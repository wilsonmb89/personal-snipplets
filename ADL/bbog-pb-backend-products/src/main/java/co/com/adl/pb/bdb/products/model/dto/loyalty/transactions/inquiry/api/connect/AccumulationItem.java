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
public class AccumulationItem {
  @SerializedName("IdAccrualed")
  private String idAccrualed;

  @SerializedName("PointsInfo")
  private List<PointInfo> pointInfo;

  @SerializedName("AccumulationPartner")
  private String accumulationPartner;

  @SerializedName("EstablishmentCalc")
  private String establishmentCalc;

  @SerializedName("EstablishDt")
  private String establishDt;

  @SerializedName("ExpDt")
  private String expDt;

  @SerializedName("Desc")
  private String desc;
}
