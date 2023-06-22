/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.controller;

import static org.junit.Assert.assertEquals;

import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.ListRangeDto;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.GetAccountStatementRs;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RunWith(MockitoJUnitRunner.class)
public class BankingReportsControllerTest {

  @Mock
  private OrchestrationService<BankStatementRequest, GetAccountStatementRs>
      bankStatementOrchestrationService;

  @Mock
  private OrchestrationService<GetStatementPeriodRq, GetStatementPeriodRs>
      statementPeriodsOrchestrationService;

  @Mock
  private OrchestrationService<AccountsCertificatesMngrRq, AccountsCertificatesMngrRs>
      bankingReferencesOrchestrationService;

  @Mock
  private OrchestrationService<BankStatementRequest, GetAccountStatementRs>
      taxCertificatesOrchestrationService;

  @Mock
  private OrchestrationService<GenerateFileExcelRq, GenerateFileExcelRs>
      fileExcelOrchestrationService;

  private BankingReportsController bankingReportsController;

  @Before
  public void setup() {
    bankingReportsController =
        new BankingReportsController(
            bankStatementOrchestrationService,
            statementPeriodsOrchestrationService,
            bankingReferencesOrchestrationService,
            taxCertificatesOrchestrationService,
            fileExcelOrchestrationService);
  }

  @Test
  public void getAccountStatementOk() throws BDBApplicationException {
    GetAccountStatementRs getAccountStatementRs =
        GetAccountStatementRs.builder().binData("").statusDesc("").build();
    Mockito.when(
            bankStatementOrchestrationService.orchestrate(Mockito.any(BankStatementRequest.class)))
        .thenReturn(getAccountStatementRs);

    ResponseEntity response =
        bankingReportsController.getAccountStatement(new BankStatementRequest());

    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void getStatementPeriodsOk() throws BDBApplicationException {
    List<ListRangeDto> listRangeDtos = new ArrayList<>();
    GetStatementPeriodRs getStatementPeriodRs =
        GetStatementPeriodRs.builder().rangeDt(listRangeDtos).build();
    Mockito.when(
            statementPeriodsOrchestrationService.orchestrate(
                Mockito.any(GetStatementPeriodRq.class)))
        .thenReturn(getStatementPeriodRs);
    ResponseEntity response =
        bankingReportsController.getStatementPeriods(new GetStatementPeriodRq());

    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void getAccountsReferences() throws BDBApplicationException {
    AccountsCertificatesMngrRs accountsCertificatesMngrRs =
        AccountsCertificatesMngrRs.builder().binData("").fileName("").build();
    Mockito.when(
            bankingReferencesOrchestrationService.orchestrate(
                Mockito.any(AccountsCertificatesMngrRq.class)))
        .thenReturn(accountsCertificatesMngrRs);
    ResponseEntity response =
        bankingReportsController.getAccountsReferences(new AccountsCertificatesMngrRq());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void getTaxCertificate() throws BDBApplicationException {
    GetAccountStatementRs getAccountStatementRs =
        GetAccountStatementRs.builder().binData("").statusDesc("").build();
    Mockito.when(
            taxCertificatesOrchestrationService.orchestrate(
                Mockito.any(BankStatementRequest.class)))
        .thenReturn(getAccountStatementRs);
    ResponseEntity response =
        bankingReportsController.getTaxCertificate(new BankStatementRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }
}
