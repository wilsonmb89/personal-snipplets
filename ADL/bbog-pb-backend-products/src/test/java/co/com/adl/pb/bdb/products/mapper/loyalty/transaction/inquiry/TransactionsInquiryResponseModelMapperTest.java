/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.loyalty.transaction.inquiry;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class TransactionsInquiryResponseModelMapperTest {

  private TransactionsInquiryResponseModelMapper transactionsInquiryResponseModelMapper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    transactionsInquiryResponseModelMapper = new TransactionsInquiryResponseModelMapper();
  }

  @Test
  public void shouldCallMap() throws BDBApplicationException {
    TransactionsInquiryResponse result =
        transactionsInquiryResponseModelMapper.map(
            TestMockUtils.getLoyaltyTransactionsInquiryApiConnectResponse());
    assertTrue(!result.getLoyaltyTransactions().isEmpty());
  }
}
