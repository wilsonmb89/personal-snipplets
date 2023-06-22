/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.unicef;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.BdBGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class UnicefEnrollmentOrchestrationServiceTest {

  @Mock
  private Mapper<AdapterGenericResponse, BdBGenericResponse> adapterGenericResponseModelMapper;

  @Mock private AdapterProvider<AdapterGenericResponse> unicefEnrollmentAdapterProvider;

  @Mock
  private Mapper<UnicefEnrollmentRequest, UnicefEnrollmentAdapterRq>
      unicefEnrollmentRequestModelMapper;

  @Mock private HeaderMapHelper headerMapHelper;
  @Mock private IntegrationProperties adapterIntegrationProperty;

  private UnicefEnrollmentOrchestrationService subject;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    subject =
        new UnicefEnrollmentOrchestrationService(
            adapterGenericResponseModelMapper,
            unicefEnrollmentAdapterProvider,
            unicefEnrollmentRequestModelMapper,
            headerMapHelper,
            adapterIntegrationProperty);
  }

  @Test
  public void shouldCallMap() throws Exception {
    when(unicefEnrollmentAdapterProvider.provide(any(BusinessContext.class)))
        .thenReturn(TestMockUtils.getAdapterGenericResponse());
    when(adapterGenericResponseModelMapper.map(any(AdapterGenericResponse.class)))
        .thenReturn(TestMockUtils.getGenericResponse());
    when(unicefEnrollmentRequestModelMapper.map(any(UnicefEnrollmentRequest.class)))
        .thenReturn(TestMockUtils.getUnicefEnrollmentAdapterRq());

    BdBGenericResponse response = subject.orchestrate(TestMockUtils.getUnicefEnrollmentRequest());
    Assertions.assertThat(response).isNotNull();
  }
}
