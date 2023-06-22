/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v1;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatementRecord {

  @SerializedName("SelRangeDt")
  private SelRangeDt selRangeDt;

  @SerializedName("MainDocType")
  private String mainDocType;

  @SerializedName("OptDocType")
  private String optDocType;

  @SerializedName("File")
  private File file;
}
