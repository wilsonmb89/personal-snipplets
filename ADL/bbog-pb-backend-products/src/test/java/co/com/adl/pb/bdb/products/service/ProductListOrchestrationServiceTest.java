/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service;

import static org.mockito.ArgumentMatchers.any;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.service.product.list.ProductListOrchestrationService;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

public class ProductListOrchestrationServiceTest {

  @Mock
  private ApiConnectProvider<ApiConnectProductListInquiryResponse> productListApiConnectProvider;

  @Mock
  private Mapper<ApiConnectProductListInquiryResponse, ProductListInquiryResponse>
      productListResponseMapper;

  @Mock private HeaderMapHelper headerMapHelper;

  @Captor private ArgumentCaptor<ApiConnectProductListInquiryResponse> responseCaptor;
  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  private ProductListOrchestrationService subject;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    subject =
        new ProductListOrchestrationService(
            headerMapHelper, productListApiConnectProvider, productListResponseMapper);
  }

  @Test
  public void shouldCallOrchestrate() throws BDBApplicationException {
    Mockito.when(productListResponseMapper.map(any(ApiConnectProductListInquiryResponse.class)))
        .thenReturn(ProductListInquiryResponse.builder().build());

    Mockito.when(productListApiConnectProvider.provide(Mockito.any(BusinessContext.class)))
        .thenReturn(ApiConnectProductListInquiryResponse.builder().build());

    ProductListInquiryResponse response =
        subject.orchestrate(TestMockUtils.buildBdBGenericRequest());

    Mockito.verify(productListResponseMapper).map(responseCaptor.capture());
    Mockito.verify(productListApiConnectProvider).provide(contextCaptor.capture());
    // TODO:Finish asserts
    // assertTrue(response.);
  }
}
