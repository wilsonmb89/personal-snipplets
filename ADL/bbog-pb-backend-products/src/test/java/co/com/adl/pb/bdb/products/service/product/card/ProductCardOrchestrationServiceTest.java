/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.product.card;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.util.TestMockUtils;
import java.util.Collections;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ProductCardOrchestrationServiceTest {

  private ProductCardOrchestrationService productCardOrchestrationService;
  @Mock Mapper<ProductCardRq, ApiConnectProductCardsRq> productCardsRequestModelMapper;

  @Mock
  private Mapper<ApiConnectProductCardRs, ProductListInquiryResponse> productCardsRsModelMapper;

  @Mock private HeaderMapHelper headerMapHelper;

  @Mock ApiConnectProvider<ApiConnectProductCardRs> productCardsRsApiConnectProvider;
  @Captor private ArgumentCaptor<ApiConnectProductCardRs> responseCaptor;
  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;
  @Captor private ArgumentCaptor<ProductCardRq> requestCaptor;

  @Before
  public void init() {
    productCardOrchestrationService =
        new ProductCardOrchestrationService(
            headerMapHelper,
            productCardsRequestModelMapper,
            productCardsRsModelMapper,
            productCardsRsApiConnectProvider);
  }

  @Test
  public void orchestrate() throws BDBApplicationException {
    Mockito.when(productCardsRsModelMapper.map(Mockito.any(ApiConnectProductCardRs.class)))
        .thenReturn(
            ProductListInquiryResponse.builder()
                .accountList(Collections.singletonList(TestMockUtils.getAccount()))
                .build());

    Mockito.when(productCardsRsApiConnectProvider.provide(Mockito.any(BusinessContext.class)))
        .thenReturn(
            ApiConnectProductCardRs.builder()
                .partyAcctRelRec(TestMockUtils.getPartyAcctRelRecList())
                .build());

    ProductCardRq input = TestMockUtils.getProductCardsRqWithAllStatus();
    input.setCustomer(TestMockUtils.getCustomer());

    ProductListInquiryResponse productCardRs = productCardOrchestrationService.orchestrate(input);
    Mockito.verify(productCardsRsModelMapper).map(responseCaptor.capture());
    Mockito.verify(productCardsRsApiConnectProvider).provide(contextCaptor.capture());

    assertTrue(productCardRs.getAccountList().size() >= 1);
  }
}
