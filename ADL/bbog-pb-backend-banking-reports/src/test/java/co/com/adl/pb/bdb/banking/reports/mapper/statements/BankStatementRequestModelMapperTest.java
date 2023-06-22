/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.statements;

import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class BankStatementRequestModelMapperTest {

  @Autowired
  private BankStatementRequestModelMapper bankStatementRequestModelMapper =
      new BankStatementRequestModelMapper();

  @Test
  public void mapperInputRequestToApi() {
    ApiConnectBankStatementRequest apiRq =
        bankStatementRequestModelMapper.map(getBankStatementRequest());

    Assert.assertEquals(apiRq.getDepAcctId().getAcctId(), getBankStatementRequest().getAcctId());
    Assert.assertEquals(
        apiRq.getDepAcctId().getAcctType(), getBankStatementRequest().getAcctType());
    Assert.assertEquals(
        apiRq.getStatementRecord().getMainDocType(), getBankStatementRequest().getDocFormat());
    Assert.assertEquals(
        apiRq.getStatementRecord().getSelRangeDt().getStartDt(),
        getBankStatementRequest().getStartDate());
  }

  private BankStatementRequest getBankStatementRequest() {
    BankStatementRequest bs = new BankStatementRequest();
    bs.setStartDate("2018-11-01T00:00:00");
    bs.setDocFormat("LOC");
    bs.setAcctType("LOC");
    bs.setAcctId("121");
    return bs;
  }
}
