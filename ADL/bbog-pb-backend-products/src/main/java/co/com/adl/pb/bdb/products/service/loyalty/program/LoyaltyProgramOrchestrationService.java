/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.loyalty.program;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.exception.BDBTechnicalException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.provider.loyalty.program.DynamoProvider;
import co.com.adl.pb.bdb.products.utils.DynamoOperation;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.function.BiPredicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LoyaltyProgramOrchestrationService
    implements OrchestrationService<BdBGenericRequest, LoyaltyProgramResponse> {

  private static final String DEFAULT_TIME_ZONE = "America/Bogota";
  private static final String LOYALTY_PROGRAM_RESOURCE = "loyalty-program";
  private static final BiPredicate<LoyaltyProgramEntity, Integer> IS_VALID_RESULT =
      (a, ttl) ->
          Objects.nonNull(a)
              && ChronoUnit.HOURS.between(
                      a.getTtl(), LocalDateTime.now(ZoneId.of(DEFAULT_TIME_ZONE)))
                  < ttl;
  private Integer ttl;
  private final HeaderMapHelper headerMapHelper;
  private final ApiConnectProvider<ApiConnectLoyaltyProgramResponse>
      loyaltyProgramApiConnectProvider;

  private final DynamoProvider<LoyaltyProgramEntity> loyaltyProgramEntityDynamoProvider;
  private final Mapper<ApiConnectLoyaltyProgramResponse, LoyaltyProgramResponse>
      loyaltyProgramResponseModelMapper;

  public LoyaltyProgramOrchestrationService(
      HeaderMapHelper headerMapHelper,
      ApiConnectProvider<ApiConnectLoyaltyProgramResponse> loyaltyProgramApiConnectProvider,
      DynamoProvider<LoyaltyProgramEntity> loyaltyProgramEntityDynamoProvider,
      Mapper<ApiConnectLoyaltyProgramResponse, LoyaltyProgramResponse>
          loyaltyProgramResponseModelMapper,
      @Value("${amazon.dynamodb.ttl}") Integer ttl) {
    this.headerMapHelper = headerMapHelper;
    this.loyaltyProgramApiConnectProvider = loyaltyProgramApiConnectProvider;
    this.loyaltyProgramEntityDynamoProvider = loyaltyProgramEntityDynamoProvider;
    this.loyaltyProgramResponseModelMapper = loyaltyProgramResponseModelMapper;
    this.ttl = ttl;
  }

  @Override
  @ElasticTraced
  public LoyaltyProgramResponse orchestrate(BdBGenericRequest serviceRequest)
      throws BDBApplicationException {
    LoyaltyProgramEntity dbResult = findIfKeyExist(serviceRequest.getCustomer());
    if (IS_VALID_RESULT.test(dbResult, ttl)) {
      return dbResult.getLoyaltyPogramResponse();
    }
    try {
      return getApiConnectResponse(serviceRequest);
    } catch (BDBTechnicalException e) {
      if (Objects.nonNull(dbResult)) {
        return dbResult.getLoyaltyPogramResponse();
      } else {
        throw new BDBTechnicalException(e.getMessage(), e);
      }
    }
  }

  private LoyaltyProgramEntity findIfKeyExist(Customer customer) throws BDBApplicationException {
    return loyaltyProgramEntityDynamoProvider.provide(
        BusinessContext.getNewInstance()
            .putParameter(
                ContextParameter.REQUEST_ELEMENT,
                customer.getIdentificationType().concat(customer.getIdentificationNumber()))
            .putParameter(ContextParameter.ROUTING_ELEMENT, DynamoOperation.FIND));
  }

  private LoyaltyProgramResponse getApiConnectResponse(BdBGenericRequest serviceRequest)
      throws BDBApplicationException {
    LoyaltyProgramEntity apiResult =
        LoyaltyProgramEntity.builder()
            .loyaltyPogramResponse(
                loyaltyProgramResponseModelMapper.map(
                    loyaltyProgramApiConnectProvider.provide(
                        BusinessContext.getNewInstance()
                            .putParameter(
                                ContextParameter.HEADER_MAP,
                                headerMapHelper.buildHeaderMapFromCustomer(
                                    serviceRequest.getCustomer(), StringUtils.EMPTY))
                            .putParameter(ContextParameter.RESOURCE, LOYALTY_PROGRAM_RESOURCE))))
            .ttl(LocalDateTime.now(ZoneId.of(DEFAULT_TIME_ZONE)))
            .key(
                serviceRequest
                    .getCustomer()
                    .getIdentificationType()
                    .concat(serviceRequest.getCustomer().getIdentificationNumber()))
            .build();
    return saveBasicDataIntoDynamo(apiResult);
  }

  private LoyaltyProgramResponse saveBasicDataIntoDynamo(LoyaltyProgramEntity entity)
      throws BDBApplicationException {
    LoyaltyProgramEntity dynamoBasicDataEntity =
        loyaltyProgramEntityDynamoProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(ContextParameter.REQUEST_ELEMENT, entity)
                .putParameter(ContextParameter.ROUTING_ELEMENT, DynamoOperation.PUSH));
    return dynamoBasicDataEntity.getLoyaltyPogramResponse();
  }
}
