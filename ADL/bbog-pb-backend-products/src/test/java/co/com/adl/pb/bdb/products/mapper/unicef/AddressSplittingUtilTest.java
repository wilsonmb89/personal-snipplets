/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.unicef;

import java.util.Map;
import org.junit.Assert;
import org.junit.Test;

public class AddressSplittingUtilTest {

  @Test
  public void getAddressMapLessSixtyChars() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(generateTestAddress(10, "A"));
    Assert.assertEquals("A A A A A", processed.get(AddressSplittingUtil.AddressLine.LINE_1));
    Assert.assertNull(processed.get(AddressSplittingUtil.AddressLine.LINE_2));
  }

  @Test
  public void getAddressMap60Chars() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(generateTestAddress(60, "A"));
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertEquals(59, processed.get(AddressSplittingUtil.AddressLine.LINE_1).length());
    Assert.assertNull(processed.get(AddressSplittingUtil.AddressLine.LINE_2));
  }

  @Test
  public void unalteredOrderTest() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(
            "ABCDEF"
                .concat(generateTestAddress(54, "A"))
                .concat("XYZ")
                .concat(generateTestAddress(40, "B")));
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertTrue(processed.get(AddressSplittingUtil.AddressLine.LINE_1).startsWith("ABCDEF"));
    Assert.assertTrue(processed.get(AddressSplittingUtil.AddressLine.LINE_2).startsWith("XYZ"));
  }

  @Test
  public void getAddressMap61Chars() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(generateTestAddress(60, "A") + "A");
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertEquals(59, processed.get(AddressSplittingUtil.AddressLine.LINE_1).length());
    Assert.assertEquals("A", processed.get(AddressSplittingUtil.AddressLine.LINE_2));
  }

  @Test
  public void getAddressMap80Chars() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(
            generateTestAddress(60, "A") + generateTestAddress(20, "B"));
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertEquals(59, processed.get(AddressSplittingUtil.AddressLine.LINE_1).length());
    Assert.assertEquals(19, processed.get(AddressSplittingUtil.AddressLine.LINE_2).length());
  }

  @Test
  public void justSemicolon() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(";;;;;;;;;;;".concat(generateTestAddress(60, "A")));
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertEquals(59, processed.get(AddressSplittingUtil.AddressLine.LINE_1).length());
    Assert.assertNull(processed.get(AddressSplittingUtil.AddressLine.LINE_2));
  }

  @Test
  public void getAddressMap110Chars() {
    Map<AddressSplittingUtil.AddressLine, String> processed =
        AddressSplittingUtil.getAddressMap(
            generateTestAddress(60, "A") + generateTestAddress(50, "B"));
    // it adds space at ends but trim removes it so the length must be 59
    Assert.assertEquals(59, processed.get(AddressSplittingUtil.AddressLine.LINE_1).length());
    Assert.assertEquals(39, processed.get(AddressSplittingUtil.AddressLine.LINE_2).length());
  }

  private String generateTestAddress(int size, String probe) {
    StringBuilder testAddress = new StringBuilder();
    while (testAddress.length() < size - 1) {
      testAddress.append(probe).append(";");
    }
    return testAddress.toString();
  }
}
