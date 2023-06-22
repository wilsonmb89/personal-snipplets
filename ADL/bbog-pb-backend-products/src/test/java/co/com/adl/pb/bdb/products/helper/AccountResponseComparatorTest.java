/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.helper;

import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class AccountResponseComparatorTest {

  public static final String DDA = "DDA";
  public static final String DLA = "DLA";
  public static final String SDA = "SDA";
  public static final String CDA = "CDA";
  public static final String FDA = "FDA";
  private AccountResponseComparator accountResponseComparator;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    accountResponseComparator = new AccountResponseComparator();
  }

  @Test
  public void compareSDADDATest() {
    int compare =
        accountResponseComparator.compare(
            TestMockUtils.getAccount(SDA), TestMockUtils.getAccount(DDA));
    Assertions.assertThat(compare).isEqualTo(-1);
  }

  @Test
  public void compareDLADDATest() {
    int compare =
        accountResponseComparator.compare(
            TestMockUtils.getAccount(DLA), TestMockUtils.getAccount(DDA));
    Assertions.assertThat(compare).isEqualTo(3);
  }

  @Test
  public void compareFDADLATest() {
    int compare =
        accountResponseComparator.compare(
            TestMockUtils.getAccount(FDA), TestMockUtils.getAccount(DLA));
    Assertions.assertThat(compare).isEqualTo(1);
  }

  @Test
  public void compareCDASDATest() {
    int compare =
        accountResponseComparator.compare(
            TestMockUtils.getAccount(CDA), TestMockUtils.getAccount(SDA));
    Assertions.assertThat(compare).isEqualTo(6);
  }
}
