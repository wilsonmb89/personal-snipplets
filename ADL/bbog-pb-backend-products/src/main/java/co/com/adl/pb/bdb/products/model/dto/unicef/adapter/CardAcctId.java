/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.unicef.adapter;

import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CardAcctId {

  @SerializedName("CardType")
  private String cardType;

  @SerializedName("CardSeqNum")
  private String cardSeqNum;

  @SerializedName("ProductCode")
  private String productCode;

  @SerializedName("AcctType")
  private String acctType;

  @SerializedName("AcctId")
  private String acctId;

  @SerializedName("BranchId")
  private String branchId;
}
