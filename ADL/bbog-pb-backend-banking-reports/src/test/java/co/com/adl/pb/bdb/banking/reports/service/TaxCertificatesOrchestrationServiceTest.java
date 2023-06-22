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
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import java.util.Map;
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
public class TaxCertificatesOrchestrationServiceTest {

  private static final String ACCOUNT_STATEMENT_RESOURCE = "account-statement";

  @Mock
  private Mapper<BankStatementRequest, ApiConnectBankStatementRequest>
      taxCertificatesRequestModelMapper;

  @Mock
  private Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs>
      bankStatementResponseModelMapper;

  @Mock private HeaderMapHelper headerMapHelper;

  @Mock private ApiConnectProvider<ApiConnectBankStatementResponse> bankStatementApiConnectProvider;
  @Captor private ArgumentCaptor<BusinessContext> contextArgumentCaptor;
  @Captor private ArgumentCaptor<BankStatementRequest> requestArgumentCaptor;
  @Captor private ArgumentCaptor<ApiConnectBankStatementResponse> responseArgumentCaptor;

  private OrchestrationService<BankStatementRequest, GetAccountStatementRs>
      taxCertificatesOrchestrationService;

  @Before
  public void init() {
    taxCertificatesOrchestrationService =
        new TaxCertificatesOrchestrationService(
            headerMapHelper,
            taxCertificatesRequestModelMapper,
            bankStatementResponseModelMapper,
            bankStatementApiConnectProvider);
  }

  @Test
  public void orchestrate() throws BDBApplicationException {
    GetAccountStatementRs testGetAccountStatementRs = GetAccountStatementRs.builder().build();
    BankStatementRequest tesBankStatementRequest = getTestBankStatementRequest();

    ApiConnectBankStatementRequest testApiConnectBankStatementRequest =
        ApiConnectBankStatementRequest.builder().build();
    ApiConnectBankStatementResponse testResponseEntity = new ApiConnectBankStatementResponse();

    Mockito.when(bankStatementResponseModelMapper.map(Mockito.any()))
        .thenReturn(testGetAccountStatementRs);
    Mockito.when(taxCertificatesRequestModelMapper.map(Mockito.any()))
        .thenReturn(testApiConnectBankStatementRequest);
    Mockito.when(bankStatementApiConnectProvider.provide(Mockito.any()))
        .thenReturn(testResponseEntity);

    Assert.assertEquals(
        testGetAccountStatementRs,
        taxCertificatesOrchestrationService.orchestrate(tesBankStatementRequest));

    Mockito.verify(taxCertificatesRequestModelMapper).map(requestArgumentCaptor.capture());
    Mockito.verify(bankStatementApiConnectProvider).provide(contextArgumentCaptor.capture());
    Mockito.verify(bankStatementResponseModelMapper).map(responseArgumentCaptor.capture());

    Assert.assertEquals(testResponseEntity, responseArgumentCaptor.getValue());
    Assert.assertEquals(tesBankStatementRequest, requestArgumentCaptor.getValue());
    Assert.assertEquals(
        testApiConnectBankStatementRequest,
        contextArgumentCaptor.getValue().getParameter(ContextParameter.REQUEST_ELEMENT));
    Map<String, String> contextHeaderMap =
        contextArgumentCaptor.getValue().getParameter(ContextParameter.HEADER_MAP);
    Assert.assertNotNull(contextHeaderMap);
    Assert.assertEquals(
        ACCOUNT_STATEMENT_RESOURCE,
        contextArgumentCaptor.getValue().getParameter(ContextParameter.RESOURCE));
  }

  private BankStatementRequest getTestBankStatementRequest() {
    Customer customer = new Customer();
    customer.setIdentificationNumber("123951753");
    customer.setRemoteAddress("192.168.2.2");
    customer.setIdentificationType("CC");
    BankStatementRequest bankStatementRequest = new BankStatementRequest();
    bankStatementRequest.setCustomer(customer);
    return bankStatementRequest;
  }
}
