/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.service;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import java.util.function.Function;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BankReferenceOrchestrationService
    implements OrchestrationService<AccountsCertificatesMngrRq, AccountsCertificatesMngrRs> {

  private static final String ACCOUNT_REFERENCE_RESOURCE = "account-reference";
  private static final Function<AccountsCertificatesMngrRq, String> DEDUCE_X_NAME =
      rq -> "MB".equals(rq.getCustomer().getChannel()) ? "SMP" : "PB";

  private final HeaderMapHelper headerMapHelper;

  private final ApiConnectProvider<ApiAccountsCertificatesRs> bankReferenceApiConnectProvider;

  private final Mapper<AccountsCertificatesMngrRq, ApiAccountsCertificatesRq>
      bankReferenceRequestMapper;

  private final Mapper<ApiAccountsCertificatesRs, AccountsCertificatesMngrRs>
      bankReferenceResponseMapper;

  @Override
  @ElasticTraced
  public AccountsCertificatesMngrRs orchestrate(
      AccountsCertificatesMngrRq accountsCertificatesMngrRq) throws BDBApplicationException {
    return bankReferenceResponseMapper.map(
        bankReferenceApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    bankReferenceRequestMapper.map(accountsCertificatesMngrRq))
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(
                        accountsCertificatesMngrRq.getCustomer(),
                        DEDUCE_X_NAME.apply(accountsCertificatesMngrRq)))
                .putParameter(ContextParameter.RESOURCE, ACCOUNT_REFERENCE_RESOURCE)));
  }
}
