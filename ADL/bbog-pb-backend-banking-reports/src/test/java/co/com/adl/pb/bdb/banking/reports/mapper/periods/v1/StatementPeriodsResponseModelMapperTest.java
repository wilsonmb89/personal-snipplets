/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.periods.v1;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v1.*;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import java.util.ArrayList;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class StatementPeriodsResponseModelMapperTest {

  @Autowired
  private StatementPeriodsResponseModelMapper statementPeriodsResponseModelMapper =
      new StatementPeriodsResponseModelMapper();

  @Test
  public void mapperResponseApiToResponse() {
    ApiConnectStatementPeriodsResponse apiRs = new ApiConnectStatementPeriodsResponse();
    apiRs.setProductType(getProductType());
    apiRs.setMsgRsHdr(null);
    GetStatementPeriodRs rs = statementPeriodsResponseModelMapper.map(apiRs);
    Assert.assertNotNull(rs);
  }

  private ProductType getProductType() {
    ProductType productType = new ProductType();
    productType.setDepAcctId(getDepAcctIdPeriodResponse());
    productType.setStatementRecord(getStatementRecordList());
    return productType;
  }

  private DepAcctIdPeriodsResponse getDepAcctIdPeriodResponse() {
    DepAcctIdPeriodsResponse depAcctIdPeriodsResponse = new DepAcctIdPeriodsResponse();
    depAcctIdPeriodsResponse.setAcctId("");
    depAcctIdPeriodsResponse.setAcctType("");
    return depAcctIdPeriodsResponse;
  }

  private List<StatementRecord> getStatementRecordList() {
    List<StatementRecord> list = new ArrayList<>();
    list.add(getStatementRecord());
    return list;
  }

  private StatementRecord getStatementRecord() {
    StatementRecord statementRecord = new StatementRecord();
    statementRecord.setMainDocType("");
    statementRecord.setOptDocType("");
    statementRecord.setSelRangeDt(new SelRangeDt());
    statementRecord.setFile(new File());
    return statementRecord;
  }
}
