/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TransactionHistory {
  @SerializedName("TransactionId")
  private String transactionId;

  @SerializedName("CancelTrxId")
  private String cancelTrxId;

  @SerializedName("CardNumber")
  private String cardNumber;

  @SerializedName("AccountPoints")
  private String accountPoints;

  @SerializedName("State")
  private String state;

  @SerializedName("Channel")
  private String channel;

  @SerializedName("CreatedDt")
  private String createdDt;

  @SerializedName("TrnType")
  private String trnType;

  @SerializedName("SubStatus")
  private String subStatus;

  @SerializedName("OverrideReasonCode")
  private String overrideReasonCode;

  @SerializedName("DepAcctIdloy")
  private List<DepAcctIdLoy> depAcctIdLoy;

  @SerializedName("DepAcctIdMilesloy")
  private List<DepAcctIdMilesLoy> depAcctIdMilesLoy;

  @SerializedName("PartnerInfo")
  private List<PartnerInfo> partnerInfo;

  @SerializedName("CompositeCurAmt")
  private List<CompositeCurAmt> compositeCurAmt;

  @SerializedName("PointsInfo")
  private List<PointsInfo> pointsInfo;

  @SerializedName("DepAcctIdProgloy")
  private List<DepAcctIdProgLoy> depAcctIdProgLoy;

  @SerializedName("AccumulationItem")
  private List<AccumulationItem> accumulationItem;

  @SerializedName("RedemptionItem")
  private List<RedemptionItem> redemptionItem;
}
