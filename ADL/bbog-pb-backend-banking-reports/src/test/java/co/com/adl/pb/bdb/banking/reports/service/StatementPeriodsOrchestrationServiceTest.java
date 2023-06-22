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
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class StatementPeriodsOrchestrationServiceTest {

  private static final String STATEMENT_PERIODS_RESOURCE = "statement-periods";

  @Mock private Mapper<GetStatementPeriodRq, ApiConnectStatementPeriodsRequest> requestMapper;

  @Mock private Mapper<ApiConnectStatementPeriodsResponseV2, GetStatementPeriodRs> responseMapper;

  @Mock
  private ApiConnectProvider<ApiConnectStatementPeriodsResponseV2>
      statementPeriodsApiConnectProvider;

  @Mock private HeaderMapHelper headerMapHelper;

  @Captor private ArgumentCaptor<GetStatementPeriodRq> requestCaptor;

  @Captor private ArgumentCaptor<ApiConnectStatementPeriodsResponseV2> responseCaptor;

  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  private StatementPeriodsOrchestrationService statementPeriodsService;

  @Before
  public void init() {
    statementPeriodsService =
        new StatementPeriodsOrchestrationService(
            headerMapHelper, requestMapper, responseMapper, statementPeriodsApiConnectProvider);
  }

  @Test
  public void orchestrateCaseNonSDA() throws BDBApplicationException {
    ApiConnectStatementPeriodsRequest testApiConnectRequest =
        ApiConnectStatementPeriodsRequest.builder().build();
    GetStatementPeriodRs testFrontResponse = GetStatementPeriodRs.builder().build();
    ApiConnectStatementPeriodsResponseV2 testApiConnectResponse =
        new ApiConnectStatementPeriodsResponseV2();
    GetStatementPeriodRq testFrontRequest = getTestRequest("TEST");

    Mockito.doReturn(testApiConnectRequest).when(requestMapper).map(Mockito.any());
    Mockito.doReturn(testFrontResponse).when(responseMapper).map(Mockito.any());
    Mockito.doReturn(testApiConnectResponse)
        .when(statementPeriodsApiConnectProvider)
        .provide(Mockito.any());
    testFrontRequest.setCustomer(getTestCustomer());

    GetStatementPeriodRs frontResponse = statementPeriodsService.orchestrate(testFrontRequest);

    Mockito.verify(requestMapper).map(requestCaptor.capture());
    Mockito.verify(responseMapper).map(responseCaptor.capture());
    Mockito.verify(statementPeriodsApiConnectProvider).provide(contextCaptor.capture());

    Assert.assertEquals(testFrontRequest, requestCaptor.getValue());
    Assert.assertEquals(testApiConnectResponse, responseCaptor.getValue());
    BusinessContext context = contextCaptor.getValue();
    Assert.assertEquals(
        testApiConnectRequest, context.getParameter(ContextParameter.REQUEST_ELEMENT));
    Assert.assertEquals(
        STATEMENT_PERIODS_RESOURCE, context.getParameter(ContextParameter.RESOURCE));
    Assert.assertEquals(testFrontResponse, frontResponse);
  }

  private GetStatementPeriodRq getTestRequest(String accType) {
    GetStatementPeriodRq getStatementPeriodRq = new GetStatementPeriodRq();
    getStatementPeriodRq.setAcctType(accType);
    getStatementPeriodRq.setCustomer(getTestCustomer());
    return getStatementPeriodRq;
  }

  private Customer getTestCustomer() {
    Customer customer = new Customer();
    customer.setIdentificationNumber("123456789");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("192.168.1.25");
    return customer;
  }
}
