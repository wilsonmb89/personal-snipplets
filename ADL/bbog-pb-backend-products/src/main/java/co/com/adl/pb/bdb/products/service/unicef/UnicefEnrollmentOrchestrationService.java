/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.unicef;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.BdBGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class UnicefEnrollmentOrchestrationService
    implements OrchestrationService<UnicefEnrollmentRequest, BdBGenericResponse> {

  private static final String UNICEF_ENROLLMENT_RESOURCE = "unicef-enrollment";
  private static final String X_CUST_IDENT_NUM = "x-CustIdentNum";
  private static final String X_CHANNELBUS = "x-channelbus";
  private static final String UNICEF_API_KEY = "unicef-api-key";
  private static final String X_API_KEY = "x-api-key";
  private static final String X_CUST_IDENT_TYPE = "X-CustIdentType";
  private final Mapper<AdapterGenericResponse, BdBGenericResponse>
      adapterGenericResponseModelMapper;
  private final AdapterProvider<AdapterGenericResponse> unicefEnrollmentAdapterProvider;
  private final Mapper<UnicefEnrollmentRequest, UnicefEnrollmentAdapterRq>
      unicefEnrollmentRequestModelMapper;
  private final HeaderMapHelper headerMapHelper;
  private final IntegrationProperties adapterIntegrationProperty;

  @Override
  @ElasticTraced
  public BdBGenericResponse orchestrate(UnicefEnrollmentRequest serviceRequest)
      throws BDBApplicationException {
    return adapterGenericResponseModelMapper.map(
        unicefEnrollmentAdapterProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(ContextParameter.RESOURCE, UNICEF_ENROLLMENT_RESOURCE)
                .putParameter(ContextParameter.HEADER_MAP, overrideHeaders(serviceRequest))
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    unicefEnrollmentRequestModelMapper.map(serviceRequest))));
  }

  private Map<String, String> overrideHeaders(UnicefEnrollmentRequest serviceRequest) {
    Map<String, String> headersMap =
        headerMapHelper.buildAdapterHeaderMap(serviceRequest.getCustomer(), Boolean.FALSE);
    headersMap.put(X_CUST_IDENT_NUM, serviceRequest.getCustomer().getIdentificationNumber());
    headersMap.put(X_CHANNELBUS, serviceRequest.getCustomer().getChannel());
    headersMap.put(X_API_KEY, adapterIntegrationProperty.getResource(UNICEF_API_KEY));
    headersMap.put(X_CUST_IDENT_TYPE, serviceRequest.getCustomer().getIdentificationType());
    return headersMap;
  }
}
