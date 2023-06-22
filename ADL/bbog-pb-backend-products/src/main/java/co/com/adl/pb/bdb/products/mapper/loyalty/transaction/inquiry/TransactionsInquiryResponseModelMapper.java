/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.loyalty.transaction.inquiry;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.TransactionHistory;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.LoyaltyTransaction;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryResponse;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TransactionsInquiryResponseModelMapper
    implements Mapper<LoyaltyTransactionsInquiryApiConnectResponse, TransactionsInquiryResponse> {

  public static final int FIRST_ELEMENT = 0;

  @Override
  public TransactionsInquiryResponse map(LoyaltyTransactionsInquiryApiConnectResponse target)
      throws BDBApplicationException {
    return TransactionsInquiryResponse.builder()
        .loyaltyTransactions(simplifyTransactions(target))
        .build();
  }

  private List<LoyaltyTransaction> simplifyTransactions(
      LoyaltyTransactionsInquiryApiConnectResponse target) {
    List<LoyaltyTransaction> transactions = new ArrayList<>();
    for (TransactionHistory transaction :
        target.getTransHistoryMember().getListTransactionHistory()) {
      transactions.add(
          LoyaltyTransaction.builder()
              .date(transaction.getCreatedDt())
              .status(transaction.getState())
              .transactionType(transaction.getTrnType())
              .amount(getAmountOfTransaction(transaction))
              .description(
                  (transaction.getDepAcctIdProgLoy().isEmpty())
                      ? null
                      : transaction.getDepAcctIdProgLoy().get(FIRST_ELEMENT).getBranchName())
              .partner(
                  (transaction.getPartnerInfo().isEmpty())
                      ? null
                      : transaction.getPartnerInfo().get(FIRST_ELEMENT).getPartnerName())
              .totalPoints(
                  (transaction.getPointsInfo().isEmpty())
                      ? null
                      : transaction.getPointsInfo().get(FIRST_ELEMENT).getTotalPoints())
              .build());
    }
    return transactions;
  }

  private String getAmountOfTransaction(TransactionHistory transaction) {
    String amount =
        transaction.getCompositeCurAmt().get(FIRST_ELEMENT).getCurAmt().get(FIRST_ELEMENT).getAmt();
    if (amount.equals("0"))
      return transaction
          .getRedemptionItem()
          .get(FIRST_ELEMENT)
          .getAcctBal()
          .get(FIRST_ELEMENT)
          .getCurAmt()
          .get(FIRST_ELEMENT)
          .getAmt();
    return amount;
  }
}
