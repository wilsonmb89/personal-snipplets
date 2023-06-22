/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect;

import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.GovIssueIdent;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TransHistoryMember {
  private List<GovIssueIdent> govIssueIdent;
  private String pointOfService;
  private List<TransactionHistory> ListTransactionHistory;
}
