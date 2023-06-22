/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.service;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.ApiConnectStatementPeriodsRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.ApiConnectStatementPeriodsResponseV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
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
public class StatementPeriodsOrchestrationService
    implements OrchestrationService<GetStatementPeriodRq, GetStatementPeriodRs> {

  private static final String STATEMENT_PERIODS_RESOURCE = "statement-periods";
  private static final Boolean USE_LONG_BANK_ID = Boolean.TRUE;

  private final HeaderMapHelper headerMapHelper;

  private final Mapper<GetStatementPeriodRq, ApiConnectStatementPeriodsRequest>
      statementPeriodsRequestModelMapper;

  private final Mapper<ApiConnectStatementPeriodsResponseV2, GetStatementPeriodRs>
      statementPeriodsResponseModelMapperV2;

  private final ApiConnectProvider<ApiConnectStatementPeriodsResponseV2>
      statementPeriodsApiConnectProviderV2;

  public StatementPeriodsOrchestrationService(
      HeaderMapHelper headerMapHelper,
      Mapper<GetStatementPeriodRq, ApiConnectStatementPeriodsRequest>
          statementPeriodsRequestModelMapper,
      Mapper<ApiConnectStatementPeriodsResponseV2, GetStatementPeriodRs>
          statementPeriodsResponseModelMapper,
      ApiConnectProvider<ApiConnectStatementPeriodsResponseV2> statementPeriodsApiConnectProvider) {

    this.headerMapHelper = headerMapHelper;
    this.statementPeriodsRequestModelMapper = statementPeriodsRequestModelMapper;
    this.statementPeriodsResponseModelMapperV2 = statementPeriodsResponseModelMapper;
    this.statementPeriodsApiConnectProviderV2 = statementPeriodsApiConnectProvider;
  }

  @Override
  @ElasticTraced
  public GetStatementPeriodRs orchestrate(GetStatementPeriodRq serviceRequest)
      throws BDBApplicationException {

    return statementPeriodsResponseModelMapperV2.map(
        statementPeriodsApiConnectProviderV2.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    statementPeriodsRequestModelMapper.map(serviceRequest))
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(
                        serviceRequest.getCustomer(), USE_LONG_BANK_ID))
                .putParameter(ContextParameter.RESOURCE, STATEMENT_PERIODS_RESOURCE)));
  }
}
