/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.program;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_3;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import co.com.adl.pb.web.client.APIConnectTemplate;
import java.util.HashMap;
import okhttp3.mockwebserver.MockWebServer;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class LoyaltyProgramApiConnectProviderTest {

  public static final String LOYALTY_PROGRAM_RESORUCE = "loyalty-program";

  @Test
  public void shouldCallApiConnectProvider() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_3);
    ApiConnectProperties mockApiConnectProperties =
        TestMockUtils.buildApiConnectProperties(MOCK_PORT_3);
    APIConnectTemplate mockApiConnectTemplate = TestMockUtils.buildApiConnectTemplate(MOCK_PORT_3);
    LoyaltyProgramApiConnectProvider subject =
        new LoyaltyProgramApiConnectProvider(mockApiConnectTemplate, mockApiConnectProperties);
    ApiConnectLoyaltyProgramResponse response = subject.provide(buildBusinessContext());
    Assertions.assertThat(response).isNotNull();
    mockWebServer.shutdown();
  }

  private BusinessContext buildBusinessContext() {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(
            ContextParameter.RESOURCE,
            LoyaltyProgramApiConnectProviderTest.LOYALTY_PROGRAM_RESORUCE);
  }
}
