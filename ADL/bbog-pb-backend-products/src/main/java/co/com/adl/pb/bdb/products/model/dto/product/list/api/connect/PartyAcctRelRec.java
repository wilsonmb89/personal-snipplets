/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.product.list.api.connect;

import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PartyAcctRelRec {
  @SerializedName("PartyAcctRelInfo")
  private PartyAcctRelInfo partyAcctRelInfo;

  @SerializedName("FullName")
  private String fullName;

  @SerializedName("Nickname")
  private String nickName;

  @SerializedName("BankAcctStatus")
  private BankAcctStatus bankAcctStatus;

  @SerializedName("OpenDt")
  private String openDt;
}
