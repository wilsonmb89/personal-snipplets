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
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.DepAcctIdFileRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.File;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.SelRangeDt;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.StatementRecord;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.stereotype.Component;

@Component
public class BankStatementRequestModelMapper
    implements Mapper<BankStatementRequest, ApiConnectBankStatementRequest> {

  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
  private static final int MONTHS = 3;

  @Override
  public ApiConnectBankStatementRequest map(BankStatementRequest target) {
    return ApiConnectBankStatementRequest.builder()
        .depAcctId(
            DepAcctIdFileRequest.builder()
                .acctId(target.getAcctId())
                .acctType(target.getAcctType())
                .build())
        .statementRecord(
            StatementRecord.builder()
                .mainDocType(target.getAcctType())
                .file(mapFileFromRequest(target))
                .selRangeDt(mapSelRangeDt(target))
                .build())
        .build();
  }

  private SelRangeDt mapSelRangeDt(BankStatementRequest bankStatementRequest) {
    LocalDateTime date = LocalDateTime.parse(bankStatementRequest.getStartDate());
    return SelRangeDt.builder()
        .startDt(date.format(DATE_FORMATTER))
        .endDt(date.plusMonths(MONTHS).format(DATE_FORMATTER))
        .build();
  }

  private File mapFileFromRequest(BankStatementRequest request) {
    return File.builder()
        .fileId(request.getAcctId())
        .fileName(String.format("ACCT_STMNT_%s_%s", request.getAcctId(), request.getStartDate()))
        .fileDesc(request.getStartDate())
        .build();
  }
}
