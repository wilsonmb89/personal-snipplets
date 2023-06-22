/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.transactions.inquiry;

import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.HeaderMap;
import retrofit2.http.QueryMap;
import retrofit2.http.Url;

public interface LoyaltyTransactionsInquiryCaller {

  @GET
  Call<LoyaltyTransactionsInquiryApiConnectResponse> getTransactions(
      @Url String url,
      @HeaderMap Map<String, String> headerMap,
      @QueryMap Map<String, String> queryMap);
}
