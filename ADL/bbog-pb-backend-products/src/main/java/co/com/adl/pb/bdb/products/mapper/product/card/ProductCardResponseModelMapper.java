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
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.PartyAcctRelRec;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.Account;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.BiPredicate;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class ProductCardResponseModelMapper
    implements Mapper<ApiConnectProductCardRs, ProductListInquiryResponse> {

  private static final String FILTER_BY_PRODUCT_STATUS_ALL = "ALL";
  private static final String UNDEFINED = "UNDEFINED";
  private static final int SIX_FIRST_DIGITS = 6;
  private static final String PRIV = "PRIV";
  private static final List<String> VIRTUAL_DEBIT_CARD_PREFIX =
      Arrays.asList("777767", "777768", "777769", "777770", "777764");

  private static final BiPredicate<PartyAcctRelRec, ProductCardRq> IS_FROM_REQUESTED =
      (partyAcctRelRec, productCardRq) ->
          Objects.nonNull(partyAcctRelRec.getBankAcctStatus())
              && productCardRq
                  .getCardStatus()
                  .contains(partyAcctRelRec.getBankAcctStatus().getBankAcctStatusCode());
  private static final Predicate<ApiConnectProductCardRs> ALL_REQUESTED =
      apiConnectProductCardRs ->
          apiConnectProductCardRs
              .getProductCardRq()
              .getCardStatus()
              .contains(FILTER_BY_PRODUCT_STATUS_ALL);

  @Override
  public ProductListInquiryResponse map(ApiConnectProductCardRs target) {
    return ProductListInquiryResponse.builder()
        .accountList(
            ALL_REQUESTED.test(target) ? mapAllAccounts(target) : mapFilteringAccounts(target))
        .build();
  }

  private List<Account> mapAllAccounts(ApiConnectProductCardRs apiConnectProductCardRs) {
    return apiConnectProductCardRs.getPartyAcctRelRec().stream()
        .map(this::mapAccount)
        .collect(Collectors.toList());
  }

  private List<Account> mapFilteringAccounts(ApiConnectProductCardRs apiConnectProductCardRs) {
    return apiConnectProductCardRs.getPartyAcctRelRec().stream()
        .filter(
            partyAcctRelRec ->
                IS_FROM_REQUESTED.test(partyAcctRelRec, apiConnectProductCardRs.getProductCardRq()))
        .map(this::mapAccount)
        .collect(Collectors.toList());
  }

  private Account mapAccount(PartyAcctRelRec partyAcctRelRec) {
    return Account.builder()
        .productNumber(partyAcctRelRec.getPartyAcctRelInfo().getCardAcctId().getAcctId())
        .bankId(partyAcctRelRec.getPartyAcctRelInfo().getCardAcctId().getBankInfo().getBankId())
        .productBankType(cardType(partyAcctRelRec))
        .status(
            Objects.nonNull(partyAcctRelRec.getBankAcctStatus())
                ? partyAcctRelRec.getBankAcctStatus().getBankAcctStatusCode()
                : UNDEFINED)
        .build();
  }

  private String cardType(PartyAcctRelRec partyAcctRelRec) {
    String cardType = partyAcctRelRec.getPartyAcctRelInfo().getCardAcctId().getAcctType();
    return VIRTUAL_DEBIT_CARD_PREFIX.contains(
            StringUtils.left(
                partyAcctRelRec.getPartyAcctRelInfo().getCardAcctId().getAcctId(),
                SIX_FIRST_DIGITS))
        ? PRIV
        : cardType;
  }
}
