/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.product.card;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.util.TestMockUtils;
import org.junit.Before;
import org.junit.Test;

public class ProductCardRequestModelMapperTest {

  private ProductCardRq productCardsRq;
  private ApiConnectProductCardsRq apiConnectProductCardsRq;
  private ProductCardRequestModelMapper productCardRequestModelMapper;

  @Before
  public void init() {
    this.productCardsRq = TestMockUtils.getProductCardsRqWithAllStatus();
    productCardRequestModelMapper = new ProductCardRequestModelMapper();
  }

  @Test
  public void mapRequestToApiRequest() {

    apiConnectProductCardsRq = productCardRequestModelMapper.map(productCardsRq);
    assertTrue(
        apiConnectProductCardsRq.getCardsDepAcctId().getAcctId().equals(productCardsRq.getAcctId())
            && apiConnectProductCardsRq
                .getCardsDepAcctId()
                .getAcctType()
                .equals(productCardsRq.getAcctType())
            && apiConnectProductCardsRq.getNetworkTrnInfo().getTerminalId().equals("IN01"));
  }
}
