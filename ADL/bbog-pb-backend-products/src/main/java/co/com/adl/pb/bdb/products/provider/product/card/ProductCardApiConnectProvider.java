/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.product.card;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.common.util.ErrorMappingUtil;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.web.client.APIConnectTemplate;
import java.util.Map;
import org.springframework.stereotype.Component;
import retrofit2.Call;
import retrofit2.Retrofit;

@Component
public class ProductCardApiConnectProvider implements ApiConnectProvider<ApiConnectProductCardRs> {

  private final APIConnectTemplate apiConnectTemplate;
  private final ApiConnectProperties apiConnectProperties;

  public ProductCardApiConnectProvider(
      APIConnectTemplate apiConnectTemplate, ApiConnectProperties apiConnectProperties) {
    this.apiConnectTemplate = apiConnectTemplate;
    this.apiConnectProperties = apiConnectProperties;
  }

  @Override
  public ApiConnectProductCardRs provide(BusinessContext context) throws BDBApplicationException {
    return ErrorMappingUtil.mapError(
        apiConnectTemplate.exchange(
            (retrofitSSL -> getCallable(retrofitSSL, context)),
            context.getParameter(ContextParameter.HEADER_MAP)));
  }

  private Call<ApiConnectProductCardRs> getCallable(Retrofit retrofit, BusinessContext context) {
    ProductCardsCaller caller = retrofit.create(ProductCardsCaller.class);
    String resource =
        apiConnectProperties.getResource(context.getParameter(ContextParameter.RESOURCE));
    Map<String, String> headersMap = context.getParameter(ContextParameter.HEADER_MAP);
    ApiConnectProductCardsRq apiConnectRecurringPaymentRq =
        context.getParameter(ContextParameter.REQUEST_ELEMENT);
    return caller.post(resource, headersMap, apiConnectRecurringPaymentRq);
  }
}
