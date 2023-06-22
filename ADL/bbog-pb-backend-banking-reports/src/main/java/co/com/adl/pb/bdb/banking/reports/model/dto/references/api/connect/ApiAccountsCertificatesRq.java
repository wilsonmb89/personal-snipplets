/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiAccountsCertificatesRq {

  @SerializedName("NetworkTrnInfo")
  private final NetworkTrnInfo networkTrnInfo;

  @SerializedName("LoanAcctId")
  private final LoanAcctId loanAcctId;

  @SerializedName("PartyAcctRelRec")
  private final List<PartyAcctRelRec> partyAcctRelRec;

  @SerializedName("StartDt")
  private final String startDt;

  @SerializedName("Format")
  private final String format;

  @SerializedName("DocumentType")
  private final String documentType;

  @SerializedName("AcctType")
  private final String acctType;

  @SerializedName("AcctId")
  private final String acctId;

  @SerializedName("DepAcctIdFrom")
  private final DepAcctIdFrom depAcctIdFrom;

  @SerializedName("TrnType")
  private final String trnType;

  @SerializedName("PmtMethod")
  private final String pmtMethod;

  @SerializedName("Fee")
  private final Fee fee;

  @SerializedName("CurAmt")
  private final List<CurAmt> curAmt;

  @SerializedName("PersonInfo")
  private final PersonInfo personInfo;

  @SerializedName("StatusDesc")
  private final String statusDesc;

  @SerializedName("NotificationRec")
  private final List<NotificationRec> notificationRec;
}
