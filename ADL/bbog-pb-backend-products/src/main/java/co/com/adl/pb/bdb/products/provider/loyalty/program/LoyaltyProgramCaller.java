/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.program;

import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.HeaderMap;
import retrofit2.http.Url;

public interface LoyaltyProgramCaller {

  @GET
  Call<ApiConnectLoyaltyProgramResponse> get(
      @Url String url, @HeaderMap Map<String, String> headerMap);
}
