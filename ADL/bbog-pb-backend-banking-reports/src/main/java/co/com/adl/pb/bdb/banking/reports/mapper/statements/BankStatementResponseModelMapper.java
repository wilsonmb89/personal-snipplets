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
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.personal.banking.GetAccountStatementRs;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import org.springframework.stereotype.Component;

@Component
public class BankStatementResponseModelMapper
    implements Mapper<ApiConnectBankStatementResponse, GetAccountStatementRs> {

  @Override
  public GetAccountStatementRs map(ApiConnectBankStatementResponse target) {
    return GetAccountStatementRs.builder()
        .binData(target.getTrnImage().getBinData())
        .statusDesc(target.getTrnImage().getDocumentType())
        .build();
  }
}
