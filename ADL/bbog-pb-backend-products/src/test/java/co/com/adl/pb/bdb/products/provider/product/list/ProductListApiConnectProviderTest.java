/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.product.list;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_1;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import co.com.adl.pb.web.client.APIConnectTemplate;
import java.util.HashMap;
import okhttp3.mockwebserver.MockWebServer;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ProductListApiConnectProviderTest {
  public static final String PRODUCT_LIST_RESOURCE = "product-list";

  @Test
  public void shouldCallApiConnectProvider() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_1);
    ApiConnectProperties mockApiConnectProperties =
        TestMockUtils.buildApiConnectProperties(MOCK_PORT_1);
    APIConnectTemplate mockApiConnectTemplate = TestMockUtils.buildApiConnectTemplate(MOCK_PORT_1);
    ProductListApiConnectProvider subject =
        new ProductListApiConnectProvider(mockApiConnectTemplate, mockApiConnectProperties);
    ApiConnectProductListInquiryResponse response = subject.provide(buildBusinessContext());
    Assertions.assertThat(response).isNotNull();
    mockWebServer.shutdown();
  }

  private BusinessContext buildBusinessContext() {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(
            ContextParameter.RESOURCE, ProductListApiConnectProviderTest.PRODUCT_LIST_RESOURCE);
  }
}
