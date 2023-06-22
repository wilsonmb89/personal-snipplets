/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.products.helper.AccountListRuleHelper;
import co.com.adl.pb.bdb.products.helper.AccountResponseComparator;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.PartyAcctRelRec;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.Account;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.AccountHelper;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ProductListResponseModelMapper
    implements Mapper<ApiConnectProductListInquiryResponse, ProductListInquiryResponse> {

  private final AccountResponseComparator accountResponseComparator =
      new AccountResponseComparator();
  private final AccountListRuleHelper accountListRuleHelper;

  @Override
  public ProductListInquiryResponse map(ApiConnectProductListInquiryResponse target) {

    return ProductListInquiryResponse.builder()
        .accountList(
            target.getPartyAcctRelRec().stream()
                .map(this::mapAccount)
                .sorted(accountResponseComparator)
                .collect(Collectors.toList()))
        .build();
  }

  private Account mapAccount(PartyAcctRelRec partyAcctRelRec) {
    AccountHelper accountHelper = produceAccountHelper(partyAcctRelRec);
    return Account.builder()
        .description(partyAcctRelRec.getNickName())
        .productBankType(accountHelper.getBankId())
        .productBankSubType(accountHelper.getSubBankId())
        .productAthType(accountHelper.getAthId())
        .productName(accountHelper.getAccountName())
        .officeId(
            partyAcctRelRec.getPartyAcctRelInfo().getDepAcctId().getOfficeInfo().getOfficeId())
        .productNumber(partyAcctRelRec.getPartyAcctRelInfo().getDepAcctId().getAcctId())
        .bin(mapBin(partyAcctRelRec))
        .valid(partyAcctRelRec.getBankAcctStatus().getBankAcctStatusCode().equalsIgnoreCase("A"))
        .franchise(accountHelper.getFranchise())
        .openDate(partyAcctRelRec.getOpenDt())
        .build();
  }

  private String mapBin(PartyAcctRelRec partyAcctRelRec) {
    return partyAcctRelRec
            .getPartyAcctRelInfo()
            .getCardAcctId()
            .getCcMotoAcct()
            .getBrand()
            .isEmpty()
        ? null
        : partyAcctRelRec.getPartyAcctRelInfo().getDepAcctId().getAcctId().substring(0, 6);
  }

  private AccountHelper produceAccountHelper(PartyAcctRelRec partyAcctRelRec) {
    final AccountHelper specificAccountHelper =
        new AccountHelper(
            partyAcctRelRec.getPartyAcctRelInfo().getDepAcctId().getAcctType(),
            partyAcctRelRec.getPartyAcctRelInfo().getDepAcctId().getAcctSubType(),
            partyAcctRelRec.getPartyAcctRelInfo().getCardAcctId().getCcMotoAcct().getBrand(),
            partyAcctRelRec.getNickName());
    return accountListRuleHelper.assist(specificAccountHelper);
  }
}
