/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.campaign;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_6;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.products.mapper.campaign.CustomerCampaignRequestModelMapper;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class CustomerCampaignAdapterProviderTest {

  public static final String CUSTOMER_CAMPAIGN_RESOURCE = "customer-campaign";
  private CustomerCampaignRequestModelMapper customerCampaignRequestModelMapper;

  private ObjectMapper mapper = new ObjectMapper();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    customerCampaignRequestModelMapper = new CustomerCampaignRequestModelMapper();
  }

  @Test
  public void shouldCallMap() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_6);
    mockWebServer.enqueue(
        new MockResponse()
            .setResponseCode(200)
            .setBody(
                mapper.writeValueAsString(TestMockUtils.buildCustomerCampaignAdapterResponse())));

    IntegrationProperties integrationProperties =
        TestMockUtils.buildCampaignIntegrationProperties(MOCK_PORT_6);
    RetrofitTemplate retrofitTemplate = new RetrofitTemplate(integrationProperties);
    TestMockUtils.initRetrofitOnTemplate(retrofitTemplate);

    CustomerCampaignAdapterProvider subject =
        new CustomerCampaignAdapterProvider(integrationProperties, retrofitTemplate);

    CustomerCampaignAdapterResponse response = subject.provide(buildBusinessContext());

    Assertions.assertThat(response).isNotNull();
  }

  private BusinessContext buildBusinessContext() throws BDBApplicationException {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(ContextParameter.RESOURCE, CUSTOMER_CAMPAIGN_RESOURCE)
        .putParameter(
            ContextParameter.REQUEST_ELEMENT,
            customerCampaignRequestModelMapper.map(TestMockUtils.buildBdBGenericRequest()));
  }
}
