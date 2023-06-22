/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.product.card;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.CardsDepAcctId;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.NetworkTrnInfo;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import org.springframework.stereotype.Component;

@Component
public class ProductCardRequestModelMapper
    implements Mapper<ProductCardRq, ApiConnectProductCardsRq> {

  private static final String TERMINAL_ID = "IN01";

  @Override
  public ApiConnectProductCardsRq map(ProductCardRq target) {
    return ApiConnectProductCardsRq.builder()
        .cardsDepAcctId(mapDepAcctId(target))
        .networkTrnInfo(mapNetworkTrnInfo())
        .build();
  }

  private CardsDepAcctId mapDepAcctId(ProductCardRq productCardsRq) {
    return CardsDepAcctId.builder()
        .acctId(productCardsRq.getAcctId())
        .acctType(productCardsRq.getAcctType())
        .requireAllCards(productCardsRq.getRequireAllCards())
        .build();
  }

  private NetworkTrnInfo mapNetworkTrnInfo() {
    return NetworkTrnInfo.builder().terminalId(TERMINAL_ID).build();
  }
}
