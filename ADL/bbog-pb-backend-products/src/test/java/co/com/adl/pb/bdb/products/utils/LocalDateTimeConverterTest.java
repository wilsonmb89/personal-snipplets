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

import java.time.LocalDateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class LocalDateTimeConverterTest {

  public static final String DATE_UNCONVERT = "2020-08-10T15:12:59.461";
  private LocalDateTimeConverter localDateTimeConverter;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    localDateTimeConverter = new LocalDateTimeConverter();
  }

  @Test
  public void convertTest() {
    String convert = localDateTimeConverter.convert(LocalDateTime.now());
    assertNotNull(convert);
  }

  @Test
  public void unconvertTest() {
    LocalDateTime unconvert = localDateTimeConverter.unconvert(DATE_UNCONVERT);
    assertNotNull(unconvert);
  }
}
