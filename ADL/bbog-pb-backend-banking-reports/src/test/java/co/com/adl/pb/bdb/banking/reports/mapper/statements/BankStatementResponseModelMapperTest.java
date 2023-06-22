/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.statements;

import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementResponse;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.DepAcctIdFileResponse;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.TrnImage;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.GetAccountStatementRs;
import co.com.adl.pb.bdb.common.entity.MsgRsHdr;
import co.com.adl.pb.bdb.common.entity.Status;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class BankStatementResponseModelMapperTest {

  @Autowired
  private BankStatementResponseModelMapper bankStatementResponseModelMapper =
      new BankStatementResponseModelMapper();

  @Test
  public void mapperResponseApiToResponse() {
    ApiConnectBankStatementResponse apiRs = new ApiConnectBankStatementResponse();
    apiRs.setSPRefId("Reference");
    apiRs.setMsgRsHdr(getMsgRsHdr());
    apiRs.setTrnImage(getTrnImage());
    apiRs.setDepAcctId(getDepAcctIdFileResponse());

    GetAccountStatementRs rs = bankStatementResponseModelMapper.map(apiRs);
    Assert.assertEquals(rs.getBinData(), apiRs.getTrnImage().getBinData());
  }

  private MsgRsHdr getMsgRsHdr() {
    MsgRsHdr msgRsHdr = new MsgRsHdr();
    msgRsHdr.setStatus(new Status());
    return msgRsHdr;
  }

  private TrnImage getTrnImage() {
    TrnImage trnImage = new TrnImage();
    trnImage.setDocumentType("CC");
    trnImage.setContentType("SDA");
    trnImage.setBinData("data");
    return trnImage;
  }

  private DepAcctIdFileResponse getDepAcctIdFileResponse() {
    DepAcctIdFileResponse depAcctIdFileResponse = new DepAcctIdFileResponse();
    depAcctIdFileResponse.setAcctType("124222");
    depAcctIdFileResponse.setAcctId("A34");
    return depAcctIdFileResponse;
  }
}
