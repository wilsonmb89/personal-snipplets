/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.tax.certificates;

import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TaxCertificatesRequestModelMapperTest {

  private static final LocalDateTime TEST_DATE = LocalDateTime.of(2020, 2, 25, 0, 0, 0);
  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
  private static final String GMF_CERTIFICATE = "CG";
  private static final String TA_CERTIFICATE = "TA";
  private static final String TEST_ID_NUMBER = "159753654";
  private static final String TEST_PRODUCT_NUMBER = "987423651";
  private static final String TEST_ACCT_TYPE = "SDA";

  Mapper<BankStatementRequest, ApiConnectBankStatementRequest> taxCertificatesRequestModelMapper;

  @Before
  public void init() {
    taxCertificatesRequestModelMapper = new TaxCertificatesRequestModelMapper();
  }

  @Test
  public void map() throws BDBApplicationException {
    ApiConnectBankStatementRequest apiConnectBankStatementRequest =
        taxCertificatesRequestModelMapper.map(getBankStatementTestRequest(GMF_CERTIFICATE));
    Assert.assertEquals(
        GMF_CERTIFICATE, apiConnectBankStatementRequest.getStatementRecord().getMainDocType());
    Assert.assertEquals(
        GMF_CERTIFICATE, apiConnectBankStatementRequest.getStatementRecord().getOptDocType());
    Assert.assertEquals(
        TEST_DATE.format(DATE_FORMATTER),
        apiConnectBankStatementRequest.getStatementRecord().getSelRangeDt().getStartDt());
    Assert.assertEquals(
        TEST_ID_NUMBER, apiConnectBankStatementRequest.getStatementRecord().getFile().getFileId());
    ApiConnectBankStatementRequest apiConnectBankStatementRequestOptionalFlow =
        taxCertificatesRequestModelMapper.map(getBankStatementTestRequest(TA_CERTIFICATE));
    Assert.assertEquals(
        TEST_PRODUCT_NUMBER,
        apiConnectBankStatementRequestOptionalFlow.getStatementRecord().getFile().getFileId());
    Assert.assertEquals(
        TEST_PRODUCT_NUMBER, apiConnectBankStatementRequest.getDepAcctId().getAcctId());
    Assert.assertEquals(
        GMF_CERTIFICATE, apiConnectBankStatementRequest.getDepAcctId().getAcctType());
  }

  private BankStatementRequest getBankStatementTestRequest(String testDocFormat) {
    BankStatementRequest bankStatementRequest = new BankStatementRequest();
    bankStatementRequest.setDocFormat(testDocFormat);
    bankStatementRequest.setStartDate(TEST_DATE.format(DATE_FORMATTER));
    bankStatementRequest.setCustomer(getTestCustomer());
    bankStatementRequest.setAcctId(TEST_PRODUCT_NUMBER);
    bankStatementRequest.setAcctType(TEST_ACCT_TYPE);
    return bankStatementRequest;
  }

  private Customer getTestCustomer() {
    Customer customer = new Customer();
    customer.setIdentificationNumber(TEST_ID_NUMBER);
    return customer;
  }
}
