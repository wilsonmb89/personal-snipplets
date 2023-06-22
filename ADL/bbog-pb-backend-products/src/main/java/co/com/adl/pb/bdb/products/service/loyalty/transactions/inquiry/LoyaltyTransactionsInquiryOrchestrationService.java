/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.loyalty.transactions.inquiry;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryRequest;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryResponse;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LoyaltyTransactionsInquiryOrchestrationService
    implements OrchestrationService<TransactionsInquiryRequest, TransactionsInquiryResponse> {
  private final Mapper<LoyaltyTransactionsInquiryApiConnectResponse, TransactionsInquiryResponse>
      transactionsInquiryResponseModelMapper;
  private final ApiConnectProvider<LoyaltyTransactionsInquiryApiConnectResponse>
      loyaltyTransactionsInquiryApiConnectProvider;
  private final Mapper<TransactionsInquiryRequest, Map<String, String>>
      transactionsInquiryQueryMapper;
  private final HeaderMapHelper headerMapHelper;
  private static final String LOYALTY_TRANSACTIONS_RESOURCE = "loyalty-transactions";

  @Override
  @ElasticTraced
  public TransactionsInquiryResponse orchestrate(TransactionsInquiryRequest serviceRequest)
      throws BDBApplicationException {
    return transactionsInquiryResponseModelMapper.map(
        loyaltyTransactionsInquiryApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(
                        serviceRequest.getCustomer(), Boolean.TRUE))
                .putParameter(
                    ContextParameter.QUERY_PARAMS,
                    transactionsInquiryQueryMapper.map(serviceRequest))
                .putParameter(ContextParameter.RESOURCE, LOYALTY_TRANSACTIONS_RESOURCE)));
  }
}
