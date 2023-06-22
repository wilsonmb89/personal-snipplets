/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.utils;

import static org.junit.Assert.assertNotNull;

import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class JsonConverterTest {

  private JsonConverter jsonConverter;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    jsonConverter = new JsonConverter();
  }

  @Test
  public void convertTest() {
    String convert = jsonConverter.convert(TestMockUtils.generateLoyaltyPogramResponse());
    assertNotNull(convert);
  }

  @Test
  public void unconvertTest() {
    LoyaltyProgramResponse unconvert =
        jsonConverter.unconvert(TestMockUtils.getLoyaltyProgramJson());
    assertNotNull(unconvert);
  }
}
