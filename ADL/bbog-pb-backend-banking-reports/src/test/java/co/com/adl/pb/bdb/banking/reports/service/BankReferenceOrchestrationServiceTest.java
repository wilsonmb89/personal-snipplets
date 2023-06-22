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
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountReference;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.CustomerReference;
import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import java.util.ArrayList;
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
public class BankReferenceOrchestrationServiceTest {

  @Mock private Mapper<AccountsCertificatesMngrRq, ApiAccountsCertificatesRq> requestMapper;

  @Mock private Mapper<ApiAccountsCertificatesRs, AccountsCertificatesMngrRs> responseMapper;

  @Mock private ApiConnectProvider<ApiAccountsCertificatesRs> provider;

  @Mock private HeaderMapHelper headerMapHelper;

  @Captor private ArgumentCaptor<AccountsCertificatesMngrRq> requestCaptor;

  @Captor private ArgumentCaptor<ApiAccountsCertificatesRs> responseCaptor;

  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  private OrchestrationService<AccountsCertificatesMngrRq, AccountsCertificatesMngrRs>
      bankReferenceService;

  @Before
  public void init() {
    this.bankReferenceService =
        new BankReferenceOrchestrationService(
            headerMapHelper, provider, requestMapper, responseMapper);
  }

  @Test
  public void orchestrate() throws BDBApplicationException {
    Mockito.doReturn(ApiAccountsCertificatesRq.builder().build())
        .when(requestMapper)
        .map(Mockito.any());
    Mockito.doReturn(AccountsCertificatesMngrRs.builder().build())
        .when(responseMapper)
        .map(Mockito.any());
    Mockito.doReturn(new ApiAccountsCertificatesRs()).when(provider).provide(Mockito.any());

    AccountsCertificatesMngrRq testFrontRequest = getServiceRequest();
    testFrontRequest.setCustomer(getCustomer());

    AccountsCertificatesMngrRs testFrontResponse =
        bankReferenceService.orchestrate(testFrontRequest);

    Mockito.verify(requestMapper).map(requestCaptor.capture());
    Mockito.verify(responseMapper).map(responseCaptor.capture());
    Mockito.verify(provider).provide(contextCaptor.capture());

    Assert.assertEquals(
        testFrontRequest.getAccountReference().get(0).getAcctType(),
        requestCaptor.getValue().getAccountReference().get(0).getAcctType());
    Assert.assertEquals(
        testFrontRequest.getAccountReference().get(0).getAcctId(),
        requestCaptor.getValue().getAccountReference().get(0).getAcctId());
    Assert.assertEquals(
        testFrontRequest.getAccountReference().get(0).getAmount(),
        requestCaptor.getValue().getAccountReference().get(0).getAmount());
    Assert.assertEquals(
        testFrontRequest.getAccountReference().get(0).getOpenDt(),
        requestCaptor.getValue().getAccountReference().get(0).getOpenDt());
    Assert.assertEquals(
        testFrontRequest.getAccountReference().get(0).getIncludedAmt(),
        requestCaptor.getValue().getAccountReference().get(0).getIncludedAmt());
    Assert.assertEquals(testFrontRequest.getReceiver(), requestCaptor.getValue().getReceiver());
    Assert.assertEquals(
        testFrontRequest.getCustomerReference().getEmail(),
        requestCaptor.getValue().getCustomerReference().getEmail());
    Assert.assertEquals(
        testFrontRequest.getCustomerReference().getFullName(),
        requestCaptor.getValue().getCustomerReference().getFullName());
  }

  private AccountsCertificatesMngrRq getServiceRequest() {
    AccountsCertificatesMngrRq accountsCertificatesMngrRq = new AccountsCertificatesMngrRq();
    accountsCertificatesMngrRq.setReceiver("Hola");
    accountsCertificatesMngrRq.setCustomerReference(getCustomerReference());
    accountsCertificatesMngrRq.setAccountReference(getAccountReferenceList());
    return accountsCertificatesMngrRq;
  }

  private Customer getCustomer() {

    Customer customer = new Customer();
    customer.setIdentificationNumber("1011459576");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("costumer@costumer.com");
    return customer;
  }

  private ArrayList<AccountReference> getAccountReferenceList() {
    ArrayList<AccountReference> accountReferenceList = new ArrayList<>();
    accountReferenceList.add(getAccountReference());
    return accountReferenceList;
  }

  private AccountReference getAccountReference() {
    AccountReference accountReference = new AccountReference();
    accountReference.setAcctId("019585173");
    accountReference.setAcctType("SDA");
    accountReference.setAmount(5143395);
    accountReference.setOpenDt("2019-10-09T07:00:00-05:00");
    accountReference.setIncludedAmt(true);
    return accountReference;
  }

  private CustomerReference getCustomerReference() {
    CustomerReference customerReference = new CustomerReference();
    customerReference.setEmail("vyirsa@bancodebogota.com.co");
    customerReference.setFullName("GRUPO GENERACION");
    return customerReference;
  }
}
