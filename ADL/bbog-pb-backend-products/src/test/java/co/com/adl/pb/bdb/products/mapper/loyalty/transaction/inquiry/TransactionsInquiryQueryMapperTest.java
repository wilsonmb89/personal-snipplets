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
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class TransactionsInquiryQueryMapperTest {

  private TransactionsInquiryQueryMapper transactionsInquiryQueryMapper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    transactionsInquiryQueryMapper = new TransactionsInquiryQueryMapper();
  }

  @Test
  public void shouldCallMap() throws BDBApplicationException {
    Map<String, String> result =
        transactionsInquiryQueryMapper.map(TestMockUtils.getTransactionsInquiryRequest());
    assertTrue(!result.get("StartDt").isEmpty());
    assertTrue(!result.get("EndDt").isEmpty());
  }
}
