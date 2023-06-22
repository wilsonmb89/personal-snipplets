/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiConnectBankStatementResponse extends ApiConnectGenericResponse {

  @SerializedName("DepAcctId")
  private DepAcctIdFileResponse depAcctId;

  @SerializedName("SPRefId")
  private String sPRefId;

  @SerializedName("TrnImage")
  private TrnImage trnImage;
}
