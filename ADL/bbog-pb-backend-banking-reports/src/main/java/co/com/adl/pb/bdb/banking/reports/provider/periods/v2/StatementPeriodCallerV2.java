/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.provider.periods.v2;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.ApiConnectStatementPeriodsRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.ApiConnectStatementPeriodsResponseV2;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.HeaderMap;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface StatementPeriodCallerV2 {

  @POST
  Call<ApiConnectStatementPeriodsResponseV2> post(
      @Url String url,
      @HeaderMap Map<String, String> headerMap,
      @Body ApiConnectStatementPeriodsRequest apiConnectStatementPeriodsRequest);
}
