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

import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.util.TestMockUtils;
import org.junit.Before;
import org.junit.Test;

public class ProductCardResponseModelMapperTest {

  private ProductCardResponseModelMapper modelMapper;
  private ApiConnectProductCardRs apiConnectProductCardRs;
  private ProductListInquiryResponse productCardRs;
  private ProductCardRq input;

  @Before
  public void setUp() {
    this.modelMapper = new ProductCardResponseModelMapper();
    this.apiConnectProductCardRs = TestMockUtils.getApiConnectProductCardRs();
    this.productCardRs = TestMockUtils.getProductCardRs();
    this.input = TestMockUtils.getProductCardsRqWithAllStatus();
  }

  @Test
  public void mapToResponseWithAllCardStatus() {
    input = TestMockUtils.getProductCardsRqWithAllStatus();
    apiConnectProductCardRs.setProductCardRq(input);
    productCardRs = modelMapper.map(apiConnectProductCardRs);
    assertTrue(
        productCardRs.getAccountList().size() == apiConnectProductCardRs.getPartyAcctRelRec().size()
            && productCardRs.getAccountList().stream()
                .anyMatch(
                    i ->
                        apiConnectProductCardRs.getPartyAcctRelRec().stream()
                            .anyMatch(
                                partyAcctRelRec ->
                                    partyAcctRelRec
                                            .getPartyAcctRelInfo()
                                            .getCardAcctId()
                                            .getAcctId()
                                            .equals(i.getProductNumber())
                                        && partyAcctRelRec
                                            .getPartyAcctRelInfo()
                                            .getCardAcctId()
                                            .getAcctType()
                                            .equals(i.getProductBankType())
                                        && partyAcctRelRec
                                            .getBankAcctStatus()
                                            .getBankAcctStatusCode()
                                            .equals(i.getStatus()))));
  }

  @Test
  public void mapToResponseWithNormalCardStatus() {
    input = TestMockUtils.getProductCardsRqWithNormaltatus();
    apiConnectProductCardRs.setProductCardRq(input);
    productCardRs = modelMapper.map(apiConnectProductCardRs);
    assertTrue(
        productCardRs.getAccountList().stream()
            .anyMatch(
                i ->
                    apiConnectProductCardRs.getPartyAcctRelRec().stream()
                        .anyMatch(
                            partyAcctRelRec ->
                                partyAcctRelRec
                                    .getBankAcctStatus()
                                    .getBankAcctStatusCode()
                                    .equals(i.getStatus()))));
  }
}
