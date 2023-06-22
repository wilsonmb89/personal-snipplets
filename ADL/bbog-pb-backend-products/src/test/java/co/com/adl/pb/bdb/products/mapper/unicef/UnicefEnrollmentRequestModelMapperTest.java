/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.unicef;

import static org.junit.Assert.assertEquals;

import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class UnicefEnrollmentRequestModelMapperTest {

  private UnicefEnrollmentRequestModelMapper unicefEnrollmentRequestModelMapper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    unicefEnrollmentRequestModelMapper = new UnicefEnrollmentRequestModelMapper();
  }

  @Test
  public void shouldCallMap() throws BDBApplicationException {
    UnicefEnrollmentRequest request = TestMockUtils.getUnicefEnrollmentRequest();
    UnicefEnrollmentAdapterRq result = unicefEnrollmentRequestModelMapper.map(request);
    assertEquals(result.getCardAcctId().getAcctId(), request.getCustomerAccountNumber());
  }
}
