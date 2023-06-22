/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.service;

import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementResponse;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.GetAccountStatementRs;
import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import org.springframework.stereotype.Service;

@Service
public class TaxCertificatesOrchestrationService
    implements OrchestrationService<BankStatementRequest, GetAccountStatementRs> {

  private static final String ACCOUNT_STATEMENT_RESOURCE = "account-statement";
  private static final Boolean USE_LONG_BANK_ID = Boolean.TRUE;

  private final HeaderMapHelper headerMapHelper;
  private final Mapper<BankStatementRequest, ApiConnectBankStatementRequest>
      taxCertificatesRequestModelMapper;
  private final Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs>
      bankStatementResponseModelMapper;
  private final ApiConnectProvider<ApiConnectBankStatementResponse> bankStatementApiConnectProvider;

  public TaxCertificatesOrchestrationService(
      HeaderMapHelper headerMapHelper,
      Mapper<BankStatementRequest, ApiConnectBankStatementRequest>
          taxCertificatesRequestModelMapper,
      Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs>
          bankStatementResponseModelMapper,
      ApiConnectProvider<ApiConnectBankStatementResponse> bankStatementApiConnectProvider) {
    this.headerMapHelper = headerMapHelper;

    this.taxCertificatesRequestModelMapper = taxCertificatesRequestModelMapper;
    this.bankStatementResponseModelMapper = bankStatementResponseModelMapper;
    this.bankStatementApiConnectProvider = bankStatementApiConnectProvider;
  }

  @Override
  @ElasticTraced
  public GetAccountStatementRs orchestrate(BankStatementRequest serviceRequest)
      throws BDBApplicationException {
    return bankStatementResponseModelMapper.map(
        bankStatementApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    taxCertificatesRequestModelMapper.map(serviceRequest))
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(
                        serviceRequest.getCustomer(), USE_LONG_BANK_ID))
                .putParameter(ContextParameter.RESOURCE, ACCOUNT_STATEMENT_RESOURCE)));
  }
}
