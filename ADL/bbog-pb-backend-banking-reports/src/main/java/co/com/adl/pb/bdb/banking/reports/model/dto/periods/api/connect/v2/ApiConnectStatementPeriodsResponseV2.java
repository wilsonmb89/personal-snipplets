/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiConnectStatementPeriodsResponseV2 extends ApiConnectGenericResponse {

  @SerializedName("StatementRecord")
  private List<StatementRecordV2> statementRecord;
}
