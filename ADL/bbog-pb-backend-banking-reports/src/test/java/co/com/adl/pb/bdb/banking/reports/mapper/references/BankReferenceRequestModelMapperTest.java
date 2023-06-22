/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.references;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.*;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountReference;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.CustomerReference;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class BankReferenceRequestModelMapperTest {

  private static final String SPACE = " ";
  private static final String FIRST_NAME_0 = "HAROLD";
  private static final String FIRST_NAME_1 = "HERNANDO";
  private static final String LAST_NAME_0 = "FUNEME";
  private static final String LAST_NAME_1 = "MOLANO";

  @Autowired
  private BankReferenceRequestModelMapper bankReferenceRequestModelMapper =
      new BankReferenceRequestModelMapper();

  @Test
  public void mapperInputRequestToApi() {

    AccountsCertificatesMngrRq rq = new AccountsCertificatesMngrRq();
    rq.setAccountReference(getAccountReferenceList());
    rq.setCustomerReference(getCustomerReference());
    rq.setReceiver("hola");
    ApiAccountsCertificatesRq apiRq = bankReferenceRequestModelMapper.map(rq);
    Assert.assertEquals(rq.getAccountReference().get(0).getAcctId(), apiRq.getAcctId());
    Assert.assertEquals(rq.getAccountReference().get(0).getAcctType(), apiRq.getAcctType());
    Assert.assertEquals(rq.getAccountReference().get(0).getOpenDt(), apiRq.getStartDt());
    Assert.assertEquals(
        rq.getAccountReference().get(0).getAmount(), apiRq.getCurAmt().get(0).getAmt());
    Assert.assertTrue(
        apiRq
                .getNotificationRec()
                .get(0)
                .getDeliveryInfo()
                .get(0)
                .getAdditionalData()
                .get(0)
                .getValue()
                .length()
            < 15);
    rq.setCustomerReference(getCustomerReferenceMaxFullName());
    ApiAccountsCertificatesRq apiRq2 = bankReferenceRequestModelMapper.map(rq);
    Assert.assertEquals("FIRSTNOM LASTNAMEONE", apiRq2.getPersonInfo().getFullName());
  }

  @Test
  public void getCustomerNameTest() {
    CustomerReference customerReference = new CustomerReference();
    customerReference.setFullName(
        FIRST_NAME_0
            + SPACE
            + FIRST_NAME_1
            + SPACE
            + SPACE
            + SPACE
            + LAST_NAME_0
            + SPACE
            + LAST_NAME_1);
    AccountsCertificatesMngrRq rq = new AccountsCertificatesMngrRq();
    rq.setCustomerReference(customerReference);
    rq.setAccountReference(getAccountReferenceList());
    ApiAccountsCertificatesRq mapped = bankReferenceRequestModelMapper.map(rq);
    Assert.assertEquals(mapped.getPersonInfo().getFullName(), FIRST_NAME_0 + SPACE + LAST_NAME_0);
    rq.getCustomerReference().setFullName(FIRST_NAME_0 + SPACE + LAST_NAME_0 + SPACE + LAST_NAME_1);
    mapped = bankReferenceRequestModelMapper.map(rq);
    Assert.assertEquals(mapped.getPersonInfo().getFullName(), FIRST_NAME_0 + SPACE + LAST_NAME_0);
  }

  private ArrayList<AccountReference> getAccountReferenceList() {
    ArrayList<AccountReference> accountReference = new ArrayList<>();
    accountReference.add(getAccountReference());
    return accountReference;
  }

  private List<PartyAcctRelRec> buildPartyAccRelRecAsList() {
    List<AccountReference> accountReferences = new ArrayList<>();
    accountReferences.add(getAccountReference());

    return accountReferences.stream()
        .map(
            accountReference ->
                PartyAcctRelRec.builder()
                    .partyAcctRelInfo(getPartyAcctRelInfo())
                    .openDt("2019-10-09T07:00:00-05:00")
                    .includedBal("abc")
                    .build())
        .collect(Collectors.toList());
  }

  private PartyAcctRelInfo getPartyAcctRelInfo() {
    return PartyAcctRelInfo.builder().depAcctId(getDepAcctId()).build();
  }

  private DepAcctId getDepAcctId() {
    return DepAcctId.builder().acctId("4564").acctType("CC").bankInfo(getBankInfo()).build();
  }

  private BankInfo getBankInfo() {
    return BankInfo.builder().city("Bogotá").branchId("010001").build();
  }

  private AccountReference getAccountReference() {
    AccountReference accountReference = new AccountReference();
    accountReference.setAcctId("9999999999");
    accountReference.setAcctType("99");
    accountReference.setAmount(0);
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

  private CustomerReference getCustomerReferenceMaxFullName() {
    CustomerReference customerReference = new CustomerReference();
    customerReference.setEmail("vyirsa@bancodebogota.com.co");
    customerReference.setFullName("FIRSTNOM SECONDNOM LASTNAMEONE LASTNAMETWO");
    return customerReference;
  }
}
