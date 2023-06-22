/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrnImage {

  @SerializedName("ContentType")
  private String contentType;

  @SerializedName("BinLength")
  private String binLength;

  @SerializedName("BinData")
  private String binData;

  @SerializedName("DocumentType")
  private String documentType;
}
