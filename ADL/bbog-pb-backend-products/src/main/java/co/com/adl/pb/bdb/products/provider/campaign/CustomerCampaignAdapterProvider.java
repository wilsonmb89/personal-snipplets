/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.campaign;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.common.util.AdapterErrorMappingUtil;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CustomerCampaignAdapterProvider
    implements AdapterProvider<CustomerCampaignAdapterResponse> {

  private final IntegrationProperties campaignIntegrationProperty;
  private final RetrofitTemplate campaignRetrofitTemplate;

  @Override
  public CustomerCampaignAdapterResponse provide(BusinessContext context)
      throws BDBApplicationException {
    return AdapterErrorMappingUtil.mapError(
        campaignRetrofitTemplate.exchange(
            retrofit ->
                retrofit
                    .create(CustomerCampaignCaller.class)
                    .getCustomerCampaign(
                        campaignIntegrationProperty.getResource(
                            context.getParameter(ContextParameter.RESOURCE)),
                        context.getParameter(ContextParameter.HEADER_MAP),
                        context.getParameter(ContextParameter.REQUEST_ELEMENT))));
  }
}
