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

@Builder
@Getter
public class RedemptionItem {
  @SerializedName("AccrualItemId")
  private String accrualItemId;

  @SerializedName("ItemCount")
  private String itemCount;

  @SerializedName("AcctBal")
  private List<AcctBal> acctBal;

  @SerializedName("Value")
  private String value;

  @SerializedName("PartnerInfo")
  private List<PartnerInfo> partnerInfo;
}
