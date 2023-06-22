/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.campaign;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterRequest;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomerCampaignOrchestrateService
    implements OrchestrationService<BdBGenericRequest, CustomerCampaignResponse> {

  private static final String CUSTOMER_CAMPAIGN_RESOURCE = "customer-campaign";
  private final Mapper<BdBGenericRequest, CustomerCampaignAdapterRequest>
      customerCampaignRequestModelMapper;
  private final Mapper<CustomerCampaignAdapterResponse, CustomerCampaignResponse>
      customerCampaignResponseModelMapper;
  private final AdapterProvider<CustomerCampaignAdapterResponse>
      customerCampaignAdapterResponseAdapterProvider;

  private static final String IDENTIFICATION_NUMBER = "identification-number";
  private static final String ACCESS_TOKEN = "access-token";

  @Override
  @ElasticTraced
  public CustomerCampaignResponse orchestrate(BdBGenericRequest serviceRequest)
      throws BDBApplicationException {
    return customerCampaignResponseModelMapper.map(
        customerCampaignAdapterResponseAdapterProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(ContextParameter.RESOURCE, CUSTOMER_CAMPAIGN_RESOURCE)
                .putParameter(ContextParameter.HEADER_MAP, buildHeadersMap(serviceRequest))
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT,
                    customerCampaignRequestModelMapper.map(serviceRequest))));
  }

  private Map<String, String> buildHeadersMap(BdBGenericRequest serviceRequest) {
    Map<String, String> headersMap = new HashMap<>();
    headersMap.put(IDENTIFICATION_NUMBER, serviceRequest.getCustomer().getIdentificationNumber());
    headersMap.put(ACCESS_TOKEN, serviceRequest.getCustomer().getBackendToken());
    return headersMap;
  }
}
