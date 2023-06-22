/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.product.card;

import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.HeaderMap;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface ProductCardsCaller {

  @POST
  Call<ApiConnectProductCardRs> post(
      @Url String url,
      @HeaderMap Map<String, String> headerMap,
      @Body ApiConnectProductCardsRq apiConnectProductCardsRq);
}
