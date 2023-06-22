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
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class BankReferenceResponseModelMapperTest {

  @Autowired
  private BankReferenceResponseModelMapper bankReferenceResponseModelMapper =
      new BankReferenceResponseModelMapper();

  @Test
  public void mapperResponseApiToResponse() {

    ApiAccountsCertificatesRs apiRs = new ApiAccountsCertificatesRs();
    apiRs.setFile(getFile());
    apiRs.setFee(getFee());

    AccountsCertificatesMngrRs rs = bankReferenceResponseModelMapper.map(apiRs);

    Assert.assertEquals(apiRs.getFile().getFileData().getBinData(), rs.getBinData());
    Assert.assertEquals(apiRs.getFile().getFileName(), rs.getFileName());
  }

  private File getFile() {
    File file = new File();
    file.setFileData(new FileData());
    file.getFileData().setBinData("binDataMark");
    file.setFileName("fileName");
    file.setFilePath("filePath");
    return file;
  }

  private Fee getFee() {
    return Fee.builder().curAmt(CurAmt.builder().build()).feeType("feeType").build();
  }
}
