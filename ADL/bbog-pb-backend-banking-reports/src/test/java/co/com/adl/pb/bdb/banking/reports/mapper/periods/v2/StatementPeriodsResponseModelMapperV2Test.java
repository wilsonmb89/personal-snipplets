/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.periods.v2;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.ApiConnectStatementPeriodsResponseV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.FileV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.SelRangeDtV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.StatementRecordV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import java.util.ArrayList;
import java.util.List;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class StatementPeriodsResponseModelMapperV2Test {

  @Autowired
  private StatementPeriodsResponseModelMapperV2 statementPeriodsResponseModelMapperV2 =
      new StatementPeriodsResponseModelMapperV2();

  @Test
  public void mapperResponseApiToResponse() {
    ApiConnectStatementPeriodsResponseV2 apiRs = new ApiConnectStatementPeriodsResponseV2();
    apiRs.setStatementRecord(getStatementRecordList());
    apiRs.setMsgRsHdr(null);
    GetStatementPeriodRs rs = statementPeriodsResponseModelMapperV2.map(apiRs);
    Assert.assertNotNull(rs);
  }

  private List<StatementRecordV2> getStatementRecordList() {
    List<StatementRecordV2> list = new ArrayList<>();
    list.add(getStatementRecord());
    return list;
  }

  private StatementRecordV2 getStatementRecord() {
    StatementRecordV2 statementRecord = new StatementRecordV2();
    statementRecord.setSelRangeDt(new SelRangeDtV2());
    statementRecord.setFile(new FileV2());
    return statementRecord;
  }
}
