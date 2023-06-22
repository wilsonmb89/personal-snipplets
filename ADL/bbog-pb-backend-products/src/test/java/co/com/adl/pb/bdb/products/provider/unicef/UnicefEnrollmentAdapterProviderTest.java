/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.unicef;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_5;

import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.products.mapper.unicef.UnicefEnrollmentRequestModelMapper;
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
public class UnicefEnrollmentAdapterProviderTest {

  public static final String UNICEF_ADAPTER_CALL_ENABLED = "unicef-adapter-call-enabled";

  private UnicefEnrollmentRequestModelMapper unicefEnrollmentRequestModelMapper;

  private ObjectMapper mapper = new ObjectMapper();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    unicefEnrollmentRequestModelMapper = new UnicefEnrollmentRequestModelMapper();
  }

  @Test
  public void shouldCallMap() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_5);
    mockWebServer.enqueue(
        new MockResponse()
            .setResponseCode(200)
            .setBody(mapper.writeValueAsString(TestMockUtils.getAdapterGenericResponse())));

    IntegrationProperties integrationProperties =
        TestMockUtils.buildIntegrationProperties(MOCK_PORT_5);
    RetrofitTemplate retrofitTemplate = new RetrofitTemplate(integrationProperties);
    TestMockUtils.initRetrofitOnTemplate(retrofitTemplate);

    UnicefEnrollmentAdapterProvider subject =
        new UnicefEnrollmentAdapterProvider(retrofitTemplate, integrationProperties);

    AdapterGenericResponse response = subject.provide(buildBusinessContext());

    Assertions.assertThat(response).isNotNull();
  }

  private BusinessContext buildBusinessContext() throws BDBApplicationException {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(
            ContextParameter.RESOURCE,
            UnicefEnrollmentAdapterProviderTest.UNICEF_ADAPTER_CALL_ENABLED)
        .putParameter(
            ContextParameter.REQUEST_ELEMENT,
            unicefEnrollmentRequestModelMapper.map(TestMockUtils.getUnicefEnrollmentRequest()));
  }
}
