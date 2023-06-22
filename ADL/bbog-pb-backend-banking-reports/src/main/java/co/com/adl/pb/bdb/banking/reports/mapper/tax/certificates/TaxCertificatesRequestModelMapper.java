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
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.DepAcctIdFileRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.File;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.SelRangeDt;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.StatementRecord;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.BankStatementRequest;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;

@Component
public class TaxCertificatesRequestModelMapper
    implements Mapper<BankStatementRequest, ApiConnectBankStatementRequest> {

  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
  private static final List<String> FILE_ID_EXCLUSION_LIST = Arrays.asList("CF", "CG", "CA", "CT");
  private static final Predicate<BankStatementRequest> MUST_MAP_DEP_ACCT =
      i -> !FILE_ID_EXCLUSION_LIST.contains(i.getDocFormat());
  private static final Function<BankStatementRequest, String> MAP_FILE_ID =
      bankStatementRequest ->
          MUST_MAP_DEP_ACCT.test(bankStatementRequest)
              ? bankStatementRequest.getAcctId()
              : bankStatementRequest.getCustomer().getIdentificationNumber();

  @Override
  public ApiConnectBankStatementRequest map(BankStatementRequest target) {
    return ApiConnectBankStatementRequest.builder()
        .statementRecord(
            StatementRecord.builder()
                .mainDocType(target.getDocFormat())
                .optDocType(target.getDocFormat())
                .selRangeDt(mapSelRangeDt(target))
                .file(File.builder().fileId(MAP_FILE_ID.apply(target)).build())
                .build())
        .depAcctId(mapDepAcctId(target))
        .build();
  }

  private SelRangeDt mapSelRangeDt(BankStatementRequest bankStatementRequest) {
    LocalDateTime date = LocalDateTime.parse(bankStatementRequest.getStartDate());
    return SelRangeDt.builder().startDt(date.format(DATE_FORMATTER)).build();
  }

  private DepAcctIdFileRequest mapDepAcctId(BankStatementRequest bankStatementRequest) {
    final boolean mustMapDepAcct = MUST_MAP_DEP_ACCT.test(bankStatementRequest);

    return DepAcctIdFileRequest.builder()
        .acctId(bankStatementRequest.getAcctId())
        .acctType(
            mustMapDepAcct
                ? bankStatementRequest.getAcctType()
                : bankStatementRequest.getDocFormat())
        .build();
  }
}
