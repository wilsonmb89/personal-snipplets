/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.loyalty.transaction.inquiry;

import static org.junit.Assert.assertEquals;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryRequest;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryResponse;
import co.com.adl.pb.bdb.products.service.loyalty.transactions.inquiry.LoyaltyTransactionsInquiryOrchestrationService;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class LoyaltyTransactionsInquiryOrchestrationServiceTest {

  @Mock
  private Mapper<LoyaltyTransactionsInquiryApiConnectResponse, TransactionsInquiryResponse>
      transactionsInquiryResponseModelMapper;

  @Mock
  private ApiConnectProvider<LoyaltyTransactionsInquiryApiConnectResponse>
      loyaltyTransactionsInquiryApiConnectProvider;

  @Mock
  private Mapper<TransactionsInquiryRequest, Map<String, String>> transactionsInquiryQueryMapper;

  @Mock private HeaderMapHelper headerMapHelper;

  private LoyaltyTransactionsInquiryOrchestrationService subject;

  @Captor private ArgumentCaptor<LoyaltyTransactionsInquiryApiConnectResponse> responseCaptor;
  @Captor private ArgumentCaptor<BusinessContext> contextCaptor;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    subject =
        new LoyaltyTransactionsInquiryOrchestrationService(
            transactionsInquiryResponseModelMapper,
            loyaltyTransactionsInquiryApiConnectProvider,
            transactionsInquiryQueryMapper,
            headerMapHelper);
  }

  @Test
  public void shouldCallMap() throws Exception {

    TransactionsInquiryResponse transactionsInquiryResponse =
        TransactionsInquiryResponse.builder()
            .loyaltyTransactions(TestMockUtils.getLoyaltyTransaction())
            .build();

    Mockito.when(transactionsInquiryQueryMapper.map(Mockito.any(TransactionsInquiryRequest.class)))
        .thenReturn(TestMockUtils.getTransactionsInquiryRequestMap());

    Mockito.when(
            transactionsInquiryResponseModelMapper.map(
                Mockito.any(LoyaltyTransactionsInquiryApiConnectResponse.class)))
        .thenReturn(transactionsInquiryResponse);

    Mockito.when(
            loyaltyTransactionsInquiryApiConnectProvider.provide(
                Mockito.any(BusinessContext.class)))
        .thenReturn(LoyaltyTransactionsInquiryApiConnectResponse.builder().build());

    TransactionsInquiryResponse response =
        subject.orchestrate(TestMockUtils.getTransactionsInquiryRequest());

    Mockito.verify(transactionsInquiryResponseModelMapper).map(responseCaptor.capture());
    Mockito.verify(loyaltyTransactionsInquiryApiConnectProvider).provide(contextCaptor.capture());

    assertEquals(transactionsInquiryResponse, response);
  }
}
