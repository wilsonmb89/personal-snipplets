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
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
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
public class BankStatementOrchestrationServiceTest {

  @Mock private Mapper<BankStatementRequest, ApiConnectBankStatementRequest> requestMapper;

  @Mock private Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs> responseMapper;

  @Mock private ApiConnectProvider<ApiConnectBankStatementResponse> provider;

  @Mock private HeaderMapHelper headerMapHelper;

  @Captor private ArgumentCaptor<BankStatementRequest> requestCaptor;

  @Captor private ArgumentCaptor<ApiConnectBankStatementResponse> responseCaptor;

  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  private OrchestrationService<BankStatementRequest, GetAccountStatementRs> statementService;

  @Before
  public void init() {
    this.statementService =
        new BankStatementOrchestrationService(
            headerMapHelper, provider, requestMapper, responseMapper);
  }

  @Test
  public void orchestrate() throws BDBApplicationException {
    Mockito.doReturn(ApiConnectBankStatementRequest.builder().build())
        .when(requestMapper)
        .map(Mockito.any());
    Mockito.doReturn(GetAccountStatementRs.builder().build())
        .when(responseMapper)
        .map(Mockito.any());
    Mockito.doReturn(new ApiConnectBankStatementResponse()).when(provider).provide(Mockito.any());

    BankStatementRequest testFrontRequest = getServiceRequest();
    testFrontRequest.setCustomer(getCustomer());

    GetAccountStatementRs testFrontResponse = statementService.orchestrate(testFrontRequest);

    Mockito.verify(requestMapper).map(requestCaptor.capture());
    Mockito.verify(responseMapper).map(responseCaptor.capture());
    Mockito.verify(provider).provide(contextCaptor.capture());

    Assert.assertEquals(testFrontRequest.getAcctId(), requestCaptor.getValue().getAcctId());

    Assert.assertEquals(testFrontRequest.getAcctType(), requestCaptor.getValue().getAcctType());

    Assert.assertEquals(testFrontRequest.getDocFormat(), requestCaptor.getValue().getDocFormat());

    Assert.assertEquals(
        testFrontRequest.getCustomer().getIdentificationNumber(),
        requestCaptor.getValue().getCustomer().getIdentificationNumber());

    Assert.assertEquals(
        testFrontRequest.getCustomer().getIdentificationType(),
        requestCaptor.getValue().getCustomer().getIdentificationType());

    Assert.assertEquals(
        testFrontRequest.getCustomer().getRemoteAddress(),
        requestCaptor.getValue().getCustomer().getRemoteAddress());
  }

  private BankStatementRequest getServiceRequest() {
    BankStatementRequest accountsCertificatesMngrRq = new BankStatementRequest();
    accountsCertificatesMngrRq.setDocFormat("CC");
    accountsCertificatesMngrRq.setAcctId("9999999999");
    accountsCertificatesMngrRq.setAcctType("99");
    accountsCertificatesMngrRq.setStartDate("2012019-10-09T07:00:00-05:00");
    accountsCertificatesMngrRq.setCustomer(getCustomer());
    return accountsCertificatesMngrRq;
  }

  private Customer getCustomer() {

    Customer customer = new Customer();
    customer.setIdentificationNumber("1011459576");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("costumer@costumer.com");
    return customer;
  }
}
