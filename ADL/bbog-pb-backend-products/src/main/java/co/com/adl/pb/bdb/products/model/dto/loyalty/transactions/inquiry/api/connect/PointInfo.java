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
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PointInfo {
  @SerializedName("PointName")
  private String pointName;

  @SerializedName("AccrualedPoints")
  private String accrualedPoints;

  @SerializedName("PointsRemaining")
  private String pointsRemaining;

  @SerializedName("PointsUsedValue")
  private String pointsUsedValue;
}
