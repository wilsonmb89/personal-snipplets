/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.references;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.*;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountReference;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.CustomerReference;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class BankReferenceRequestModelMapper
    implements Mapper<AccountsCertificatesMngrRq, ApiAccountsCertificatesRq> {

  private static final Function<AccountReference, String> MAP_INCLUDE_AMOUNT =
      (AccountReference input) -> input.getIncludedAmt() ? "Verdadero" : "Falso";

  private static final String BANK_REF_CERT = "cert_refBancarias_PB";
  private static final String DOC_TYPE_PDF = "PDF";
  private static final String CP_FORMAT = "CP";
  private static final String DEFAULT_TERMINAL_ID = "0890";
  private static final String DEFAULT_STATUS_DESC = "AUTO";
  private static final String DEFAULT_CITY = "Bogotá";
  private static final String DEFAULT_BRANCH_ID = "123";
  private static final String STRING_04 = "04";
  private static final String DEFAULT_NOTIFICATION_TYPE = "EMAIL";
  private static final String DEFAULT_NOTIFICATION_CATEGORY = "NMON";
  private static final String PARAMETER_NAME = "Name";
  private static final String DEFAULT_SUBJECT = "Referencia Bancaria";
  private static final String DEFAULT_ACCOUNT_ID = "9999999999";
  private static final String DEFAULT_ACCOUNT_TYPE = "99";
  private static final String DEFAULT_PMT_METHOD = "0";
  private static final String DEFAULT_TXN_TYPE = "M";
  private static final int AMT_0 = 0;
  private static final String STRING_1 = "1";
  private static final String DEFAULT_CONTRACT = "120";
  private static final String DEFAULT_BUSINESS_ID = "00124";
  private static final int MAX_LENGTH_ADDITIONAL_DATA = 15;
  private static final int MAX_LENGTH_FULLNAME = 20;
  private static final String SPACE = " ";
  private static final String SPLIT_MAX_LENGTH_REGEX = "\\s+";

  @Override
  public ApiAccountsCertificatesRq map(AccountsCertificatesMngrRq target) {

    final AccountReference accountReference = target.getAccountReference().get(0);

    return ApiAccountsCertificatesRq.builder()
        .networkTrnInfo(buildNetworkTrnInfo())
        .loanAcctId(buildLoanAcctId(accountReference))
        .partyAcctRelRec(buildPartyAccRelRecAsList(target.getAccountReference()))
        .startDt(accountReference.getOpenDt())
        .format(CP_FORMAT)
        .documentType(DOC_TYPE_PDF)
        .acctType(DEFAULT_ACCOUNT_TYPE)
        .acctId(DEFAULT_ACCOUNT_ID)
        .depAcctIdFrom(buildDepAcctIdFrom(accountReference))
        .trnType(DEFAULT_TXN_TYPE)
        .pmtMethod(DEFAULT_PMT_METHOD)
        .fee(buildFee())
        .curAmt(buildCurAmtList())
        .personInfo(buildPersonInfo(target))
        .statusDesc(DEFAULT_STATUS_DESC)
        .notificationRec(buildNotificationRecAsList(target))
        .build();
  }

  private List<PartyAcctRelRec> buildPartyAccRelRecAsList(
      final List<AccountReference> accountReferences) {
    return accountReferences.stream()
        .map(
            accountReference ->
                PartyAcctRelRec.builder()
                    .partyAcctRelInfo(buildPartyAcctRelInfo(accountReference))
                    .includedBal(MAP_INCLUDE_AMOUNT.apply(accountReference))
                    .acctBal(buildAcctBal(accountReference))
                    .openDt(accountReference.getOpenDt())
                    .build())
        .collect(Collectors.toList());
  }

  private NetworkTrnInfo buildNetworkTrnInfo() {
    return NetworkTrnInfo.builder().terminalId(DEFAULT_TERMINAL_ID).build();
  }

  private LoanAcctId buildLoanAcctId(final AccountReference accountReference) {
    return LoanAcctId.builder()
        .acctId(accountReference.getAcctId())
        .acctType(accountReference.getAcctType())
        .bankInfo(buildBankInfo())
        .build();
  }

  private AcctBal buildAcctBal(final AccountReference accountReference) {
    return AcctBal.builder()
        .curAmt(CurAmt.builder().amt(accountReference.getAmount()).build())
        .build();
  }

  private PartyAcctRelInfo buildPartyAcctRelInfo(final AccountReference accountReference) {
    return PartyAcctRelInfo.builder().depAcctId(buildDepAcctId(accountReference)).build();
  }

  private DepAcctIdFrom buildDepAcctIdFrom(final AccountReference accountReference) {
    return DepAcctIdFrom.builder().depAcctId(buildDepAcctId(accountReference)).build();
  }

  private DepAcctId buildDepAcctId(final AccountReference accountReference) {
    return DepAcctId.builder()
        .acctId(accountReference.getAcctId())
        .acctType(accountReference.getAcctType())
        .bankInfo(buildBankInfo())
        .build();
  }

  private BankInfo buildBankInfo() {
    return BankInfo.builder().branchId(DEFAULT_BRANCH_ID).city(DEFAULT_CITY).build();
  }

  private Fee buildFee() {
    return Fee.builder().feeType(STRING_04).curAmt(CurAmt.builder().amt(AMT_0).build()).build();
  }

  private List<CurAmt> buildCurAmtList() {
    return Arrays.asList(
        CurAmt.builder().amt(AMT_0).curCode(STRING_04).build(),
        CurAmt.builder().amt(AMT_0).build());
  }

  private PersonInfo buildPersonInfo(final AccountsCertificatesMngrRq accountsCertificatesMngrRq) {
    return PersonInfo.builder()
        .fullName(buildFullName(accountsCertificatesMngrRq.getCustomerReference().getFullName()))
        .govIssueIdent(buildGovIssueIdent(accountsCertificatesMngrRq))
        .build();
  }

  private String buildFullName(String fullName) {
    final String[] subName =
        Stream.of(fullName.split(SPACE)).filter(StringUtils::isNotBlank).toArray(String[]::new);
    final String subFullName =
        subName.length == 3
            ? (subName[0] + SPACE + subName[1])
            : subName.length == 4 ? (subName[0] + SPACE + subName[2]) : fullName;
    return StringUtils.left(subFullName, MAX_LENGTH_FULLNAME);
  }

  private GovIssueIdent buildGovIssueIdent(
      final AccountsCertificatesMngrRq accountsCertificatesMngrRq) {
    return GovIssueIdent.builder().desc(accountsCertificatesMngrRq.getReceiver()).build();
  }

  private List<NotificationRec> buildNotificationRecAsList(
      final AccountsCertificatesMngrRq accountsCertificatesMngrRq) {
    return Collections.singletonList(
        NotificationRec.builder()
            .type(DEFAULT_NOTIFICATION_TYPE)
            .category(DEFAULT_NOTIFICATION_CATEGORY)
            .deliveryInfo(
                buildDeliveryInfoAsList(accountsCertificatesMngrRq.getCustomerReference()))
            .build());
  }

  private List<DeliveryInfo> buildDeliveryInfoAsList(final CustomerReference customerReference) {
    return Collections.singletonList(
        DeliveryInfo.builder()
            .email(customerReference.getEmail())
            .label(BANK_REF_CERT)
            .message(STRING_1)
            .subject(DEFAULT_SUBJECT)
            .contract(DEFAULT_CONTRACT)
            .business(DEFAULT_BUSINESS_ID)
            .template(BANK_REF_CERT)
            .additionalData(buildAdditionalDatumList(customerReference))
            .build());
  }

  private List<AdditionalDatum> buildAdditionalDatumList(
      final CustomerReference customerReference) {
    return Collections.singletonList(
        AdditionalDatum.builder()
            .name(PARAMETER_NAME)
            .value(getFullNameBounded(customerReference.getFullName().trim()))
            .build());
  }

  private String getFullNameBounded(String fullName) {
    return fullName.length() < MAX_LENGTH_ADDITIONAL_DATA
        ? fullName
        : fullName.split(SPLIT_MAX_LENGTH_REGEX)[0];
  }
}
