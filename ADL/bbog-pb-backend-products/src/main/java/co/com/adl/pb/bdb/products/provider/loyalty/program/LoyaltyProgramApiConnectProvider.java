/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.program;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.common.util.ErrorMappingUtil;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.web.client.APIConnectTemplate;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import retrofit2.Call;
import retrofit2.Retrofit;

@Component
@AllArgsConstructor
public class LoyaltyProgramApiConnectProvider
    implements ApiConnectProvider<ApiConnectLoyaltyProgramResponse> {

  private final APIConnectTemplate apiConnectTemplate;
  private final ApiConnectProperties apiConnectProperties;

  public ApiConnectLoyaltyProgramResponse provide(BusinessContext context)
      throws BDBApplicationException {
    return ErrorMappingUtil.mapError(
        apiConnectTemplate.exchange(
            (retrofitSSL -> getCallable(retrofitSSL, context)),
            context.getParameter(ContextParameter.HEADER_MAP)));
  }

  private Call<ApiConnectLoyaltyProgramResponse> getCallable(
      Retrofit retrofit, BusinessContext context) {
    LoyaltyProgramCaller caller = retrofit.create(LoyaltyProgramCaller.class);
    String resource =
        apiConnectProperties.getResource(context.getParameter(ContextParameter.RESOURCE));
    Map<String, String> headersMap = context.getParameter(ContextParameter.HEADER_MAP);
    return caller.get(resource, headersMap);
  }
}
