/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.controller;

import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.GetAccountStatementRs;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.analytics.annotation.Analytics;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("banking-reports")
@AllArgsConstructor
public class BankingReportsController {

  private final OrchestrationService<BankStatementRequest, GetAccountStatementRs>
      bankStatementOrchestrationService;
  private final OrchestrationService<GetStatementPeriodRq, GetStatementPeriodRs>
      statementPeriodsOrchestrationService;
  private final OrchestrationService<AccountsCertificatesMngrRq, AccountsCertificatesMngrRs>
      bankingReferencesOrchestrationService;
  private final OrchestrationService<BankStatementRequest, GetAccountStatementRs>
      taxCertificatesOrchestrationService;

  private final OrchestrationService<GenerateFileExcelRq, GenerateFileExcelRs>
      fileExcelOrchestrationService;

  @Analytics
  @PostMapping("statements")
  public ResponseEntity<GetAccountStatementRs> getAccountStatement(
      @RequestBody @Valid BankStatementRequest bankStatementRequest)
      throws BDBApplicationException {
    return new ResponseEntity<>(
        bankStatementOrchestrationService.orchestrate(bankStatementRequest), HttpStatus.OK);
  }

  @Analytics
  @PostMapping("references")
  public ResponseEntity<AccountsCertificatesMngrRs> getAccountsReferences(
      @RequestBody @Valid AccountsCertificatesMngrRq accountsCertificatesMngrRq)
      throws BDBApplicationException {
    return new ResponseEntity<>(
        bankingReferencesOrchestrationService.orchestrate(accountsCertificatesMngrRq),
        HttpStatus.OK);
  }

  @Analytics
  @PostMapping("tax-certificates")
  public ResponseEntity<GetAccountStatementRs> getTaxCertificate(
      @RequestBody @Valid BankStatementRequest bankStatementRequest)
      throws BDBApplicationException {
    return new ResponseEntity<>(
        taxCertificatesOrchestrationService.orchestrate(bankStatementRequest), HttpStatus.OK);
  }

  @PostMapping("periods")
  public ResponseEntity<GetStatementPeriodRs> getStatementPeriods(
      @RequestBody @Valid GetStatementPeriodRq getStatementPeriodRq)
      throws BDBApplicationException {
    return new ResponseEntity<>(
        statementPeriodsOrchestrationService.orchestrate(getStatementPeriodRq), HttpStatus.OK);
  }

  @PostMapping("excel-file")
  public ResponseEntity<GenerateFileExcelRs> getExcelFile(
      @RequestBody @Valid GenerateFileExcelRq generateFileExcelRq) throws BDBApplicationException {
    return new ResponseEntity<>(
        fileExcelOrchestrationService.orchestrate(generateFileExcelRq), HttpStatus.OK);
  }
}
