/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect;

import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProgramInfo {
  @SerializedName("ProgramId")
  private String programId;

  @SerializedName("ProgramName")
  private String programName;

  @SerializedName("SPNameString")
  private String spNameString;
}
