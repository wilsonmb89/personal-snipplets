/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.campaign;

import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterRequest;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.*;

public interface CustomerCampaignCaller {

  @POST
  Call<CustomerCampaignAdapterResponse> getCustomerCampaign(
      @Url String url,
      @HeaderMap Map<String, String> headersMap,
      @Body CustomerCampaignAdapterRequest customerCampaignBankingRequest);
}
