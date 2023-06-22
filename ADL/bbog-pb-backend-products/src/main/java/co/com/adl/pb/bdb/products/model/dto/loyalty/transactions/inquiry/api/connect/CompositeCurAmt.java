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
public class CompositeCurAmt {
  @SerializedName("CompositeCurAmtType")
  private String compositeCurAmtType;

  @SerializedName("CurAmt")
  private List<CurAmt> curAmt;
}
