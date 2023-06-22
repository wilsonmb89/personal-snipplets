/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.unicef;

import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.HeaderMap;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface UnicefEnrollmentCaller {

  @POST
  Call<AdapterGenericResponse> enrollUnicef(
      @Url String url,
      @HeaderMap Map<String, String> headersMap,
      @Body UnicefEnrollmentAdapterRq unicefEnrollmentAdapterRq);
}
