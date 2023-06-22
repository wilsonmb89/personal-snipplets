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
public class BankStatementOrchestrationService
    implements OrchestrationService<BankStatementRequest, GetAccountStatementRs> {

  private static final String ACCOUNT_STATEMENT_RESOURCE = "account-statement";
  private static final Boolean USE_LONG_BANK_ID = Boolean.TRUE;

  private final HeaderMapHelper headerMapHelper;

  private final ApiConnectProvider<ApiConnectBankStatementResponse>
      bankingCertificatesApiConnectProvider;

  private final Mapper<BankStatementRequest, ApiConnectBankStatementRequest>
      bankStatementRequestModelMapper;

  private final Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs>
      bankStatementResponseMapper;

  public BankStatementOrchestrationService(
      HeaderMapHelper headerMapHelper,
      ApiConnectProvider<ApiConnectBankStatementResponse> bankingCertificatesApiConnectProvider,
      Mapper<BankStatementRequest, ApiConnectBankStatementRequest> bankStatementRequestModelMapper,
      Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs> bankStatementResponseMapper) {
    this.headerMapHelper = headerMapHelper;
    this.bankingCertificatesApiConnectProvider = bankingCertificatesApiConnectProvider;
    this.bankStatementRequestModelMapper = bankStatementRequestModelMapper;
    this.bankStatementResponseMapper = bankStatementResponseMapper;
  }

  @Override
  @ElasticTraced
  public GetAccountStatementRs orchestrate(BankStatementRequest bankStatementRequest)
      throws BDBApplicationException {
    return bankStatementResponseMapper.map(
        bankingCertificatesApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    bankStatementRequestModelMapper.map(bankStatementRequest))
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(
                        bankStatementRequest.getCustomer(), USE_LONG_BANK_ID))
                .putParameter(ContextParameter.RESOURCE, ACCOUNT_STATEMENT_RESOURCE)));
  }
}
