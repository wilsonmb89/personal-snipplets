/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.product.list;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;

import co.com.adl.pb.bdb.products.helper.AccountListRuleHelper;
import co.com.adl.pb.bdb.products.mapper.ProductListResponseModelMapper;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.AccountHelper;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ProductListResponseMapperTest {

  @Spy @InjectMocks private AccountListRuleHelper accountListRuleHelper;

  private ProductListResponseModelMapper mapper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    mapper = new ProductListResponseModelMapper(accountListRuleHelper);
  }

  @Test
  public void ProductListRequestMapTest() {

    ApiConnectProductListInquiryResponse apiConnectProductListInquiryResponse =
        TestMockUtils.buildApiConnectProductListInquiryResponse();

    Mockito.doReturn(TestMockUtils.generateAccountHelper())
        .when(accountListRuleHelper)
        .assist(any(AccountHelper.class));

    ProductListInquiryResponse productListInquiryResponse =
        mapper.map(apiConnectProductListInquiryResponse);

    assertNotNull(productListInquiryResponse);
    assertEquals(productListInquiryResponse.getAccountList().get(0).getFranchise(), "Visa");
  }
}
