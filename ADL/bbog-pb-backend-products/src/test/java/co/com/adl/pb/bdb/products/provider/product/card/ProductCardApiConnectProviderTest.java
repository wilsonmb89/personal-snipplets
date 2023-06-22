/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.product.card;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_2;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.bdb.products.util.TestMockUtils;
import co.com.adl.pb.web.client.APIConnectTemplate;
import okhttp3.mockwebserver.MockWebServer;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockitoAnnotations;

public class ProductCardApiConnectProviderTest {

  public static final String PRODUCT_CARDS_RESOURCE = "product-cards";

  @Before
  public void init() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void shouldCallApiConnectProviderWhenPOST() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_2);
    ApiConnectProperties mockApiConnectProperties =
        TestMockUtils.buildApiConnectProperties(MOCK_PORT_2);
    APIConnectTemplate mockApiConnectTemplate = TestMockUtils.buildApiConnectTemplate(MOCK_PORT_2);
    ProductCardApiConnectProvider subject =
        new ProductCardApiConnectProvider(mockApiConnectTemplate, mockApiConnectProperties);
    BusinessContext businessContext = buildBusinessContext();
    ApiConnectGenericResponse response = subject.provide(businessContext);
    Assertions.assertThat(response).isNotNull();
    mockWebServer.shutdown();
  }

  private BusinessContext buildBusinessContext() {
    BusinessContext context =
        TestMockUtils.buildProductCardBusinessContext(
            ProductCardApiConnectProviderTest.PRODUCT_CARDS_RESOURCE);
    context.putParameter(
        ContextParameter.REQUEST_ELEMENT, ApiConnectProductCardsRq.builder().build());
    return context;
  }
}
