/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.service;

import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRs;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class FileExcelGenerateOrchestrationServiceTest {

  @InjectMocks private FileExcelGenerateOrchestrationService fileExcelGenerateOrchestrationService;

  @Test
  public void whenOrchestrateThenValidResponse() throws BDBApplicationException {

    GenerateFileExcelRq rq = new GenerateFileExcelRq();
    rq.setReportData("khkjhkdjf;gdg;DSfgsd124;989");
    rq.setTypeFile("TRANSFERS_HISTORY");
    GenerateFileExcelRs rs = fileExcelGenerateOrchestrationService.orchestrate(rq);

    Assert.assertEquals("Download", rs.getName());
    Assert.assertEquals(".xls", rs.getExtension());
    Assert.assertNotNull(rs.getFile());
  }
}
