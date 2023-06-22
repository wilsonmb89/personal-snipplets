/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.transaction.inquiry;

import static co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_PORT_4;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.products.mapper.loyalty.transaction.inquiry.TransactionsInquiryQueryMapper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import co.com.adl.pb.bdb.products.provider.loyalty.transactions.inquiry.LoyaltyTransactionsInquiryApiConnectProvider;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import co.com.adl.pb.web.client.APIConnectTemplate;
import java.util.HashMap;
import okhttp3.mockwebserver.MockWebServer;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class LoyaltyTransactionsInquiryApiConnectProviderTest {

  public static final String LOYALTY_TRANSACTIONS = "loyalty-transactions";
  private TransactionsInquiryQueryMapper transactionsInquiryQueryMapper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    transactionsInquiryQueryMapper = new TransactionsInquiryQueryMapper();
  }

  @Test
  public void shouldCallMap() throws Exception {
    MockWebServer mockWebServer = TestMockUtils.startMockWebServer(MOCK_PORT_4);
    ApiConnectProperties mockApiConnectProperties =
        TestMockUtils.buildApiConnectProperties(MOCK_PORT_4);
    APIConnectTemplate mockApiConnectTemplate = TestMockUtils.buildApiConnectTemplate(MOCK_PORT_4);
    BusinessContext businessContext = buildBusinessContext();
    LoyaltyTransactionsInquiryApiConnectProvider subject =
        new LoyaltyTransactionsInquiryApiConnectProvider(
            mockApiConnectTemplate, mockApiConnectProperties);
    LoyaltyTransactionsInquiryApiConnectResponse response = subject.provide(businessContext);
    Assertions.assertThat(response).isNotNull();
    mockWebServer.shutdown();
  }

  private BusinessContext buildBusinessContext() throws BDBApplicationException {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(
            ContextParameter.RESOURCE,
            LoyaltyTransactionsInquiryApiConnectProviderTest.LOYALTY_TRANSACTIONS)
        .putParameter(
            ContextParameter.QUERY_PARAMS,
            transactionsInquiryQueryMapper.map(TestMockUtils.getTransactionsInquiryRequest()));
  }
}
