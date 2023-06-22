/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.campaign;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterRequest;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class CustomerCampaignOrchestrationServiceTest {

  @Mock private AdapterProvider<CustomerCampaignAdapterResponse> customerCampaignAdapterProvider;

  @Mock
  private Mapper<BdBGenericRequest, CustomerCampaignAdapterRequest>
      customerCampaignRequestModelMapper;

  @Mock
  private Mapper<CustomerCampaignAdapterResponse, CustomerCampaignResponse>
      customerCampaignResponseModelMapper;

  @Captor private ArgumentCaptor<CustomerCampaignAdapterResponse> responseCaptor;
  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  private CustomerCampaignOrchestrateService customerCampaignOrchestrateService;

  @Before
  public void init() throws BDBApplicationException {
    customerCampaignOrchestrateService =
        new CustomerCampaignOrchestrateService(
            customerCampaignRequestModelMapper,
            customerCampaignResponseModelMapper,
            customerCampaignAdapterProvider);
  }

  @Test
  public void orchestrate() throws BDBApplicationException {

    Mockito.when(
            customerCampaignResponseModelMapper.map(
                Mockito.any(CustomerCampaignAdapterResponse.class)))
        .thenReturn(TestMockUtils.buildCustomerCampaignResponse());

    Mockito.when(customerCampaignAdapterProvider.provide(Mockito.any(BusinessContext.class)))
        .thenReturn(new CustomerCampaignAdapterResponse());

    BdBGenericRequest input = TestMockUtils.buildBdBGenericRequest();
    CustomerCampaignResponse customerCampaignResponse =
        customerCampaignOrchestrateService.orchestrate(input);

    Mockito.verify(customerCampaignResponseModelMapper).map(responseCaptor.capture());
    Mockito.verify(customerCampaignAdapterProvider).provide(contextCaptor.capture());

    assertTrue(!customerCampaignResponse.getCampaignId().isEmpty());
  }
}
