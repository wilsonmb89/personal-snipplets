/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.unicef;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.CardAcctId;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.ContactInfo;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.OtherIdentDoc;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.PostAddr;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class UnicefEnrollmentRequestModelMapper
    implements Mapper<UnicefEnrollmentRequest, UnicefEnrollmentAdapterRq> {

  private static final String DEFAULT_CARD_TYPE = "1";
  private static final String DEFAULT_CARD_SEQ_NUM = "457602";
  private static final String DEFAULT_ACCT_TYPE = "SDA";
  private static final String DEFAULT_COUNTRY = "CO";
  private static final String DEFAULT_POSTAL_CODE = "00000";
  private static final String DEFAULT_CITY_ID = "001";
  private static final String DEFAULT_STATE_PROV = "11";
  private static final String DEFAULT_ZIP_CODE = "11001000";
  private static final String USER_DESC = "USUARIO";
  private static final String SELLER_DESC = "VENDEDOR";
  private static final int NINE_DIGITS = 9;
  private static final int THREE_DIGITS = 3;
  private static final int INDEX_2 = 2;
  private static final int INDEX_5 = 5;

  @Override
  public UnicefEnrollmentAdapterRq map(UnicefEnrollmentRequest target)
      throws BDBApplicationException {
    return UnicefEnrollmentAdapterRq.builder()
        .cardAcctId(mapCardAcctId(target))
        .contactInfo(mapContactInfo(target))
        .otherIdentDocs(mapOtherIdentDocs(target))
        .build();
  }

  private CardAcctId mapCardAcctId(UnicefEnrollmentRequest target) {
    return CardAcctId.builder()
        .acctId(target.getCustomerAccountNumber())
        .acctType(DEFAULT_ACCT_TYPE)
        .branchId(target.getAccountOfficeId())
        .cardSeqNum(DEFAULT_CARD_SEQ_NUM)
        .cardType(DEFAULT_CARD_TYPE)
        .productCode(StringUtils.left(target.getCustomerAccountSubtype(), THREE_DIGITS))
        .build();
  }

  private ContactInfo mapContactInfo(UnicefEnrollmentRequest target) {
    Map<AddressSplittingUtil.AddressLine, String> addressMap =
        AddressSplittingUtil.getAddressMap(
            target
                .getCustomerAddressNumber()
                .concat(AddressSplittingUtil.ADDRESS_DELIMITER)
                .concat(target.getCustomerAddressDistrict()));
    return ContactInfo.builder()
        .postAddr(
            PostAddr.builder()
                .addr1(addressMap.get(AddressSplittingUtil.AddressLine.LINE_1))
                .addr2(addressMap.get(AddressSplittingUtil.AddressLine.LINE_2))
                .cityId(getCustomerCityId(target))
                .country(DEFAULT_COUNTRY)
                .postalCode(buildPostalCode(target))
                .stateProv(getCustomerProvince(target))
                .zipCode(
                    StringUtils.isNotBlank(target.getCustomerZipCode())
                        ? target.getCustomerZipCode()
                        : DEFAULT_ZIP_CODE)
                .build())
        .build();
  }

  private List<OtherIdentDoc> mapOtherIdentDocs(UnicefEnrollmentRequest target) {
    return Arrays.asList(
        OtherIdentDoc.builder()
            .desc(USER_DESC)
            .participantId(
                StringUtils.left(target.getCustomer().getIdentificationNumber(), NINE_DIGITS))
            .build(),
        OtherIdentDoc.builder()
            .desc(SELLER_DESC)
            .participantId(
                StringUtils.left(target.getCustomer().getIdentificationNumber(), NINE_DIGITS))
            .build());
  }

  private String getCustomerCityId(UnicefEnrollmentRequest target) {
    return StringUtils.isNotBlank(target.getCustomerZipCode())
        ? StringUtils.substring(target.getCustomerZipCode(), INDEX_2, INDEX_5)
        : DEFAULT_CITY_ID;
  }

  private String getCustomerProvince(UnicefEnrollmentRequest target) {
    return StringUtils.isNotBlank(target.getCustomerZipCode())
        ? StringUtils.left(target.getCustomerZipCode(), INDEX_2)
        : DEFAULT_STATE_PROV;
  }

  private String buildPostalCode(UnicefEnrollmentRequest target) {
    if (StringUtils.isNotBlank(target.getCustomerZipCode())) {
      return StringUtils.left(DEFAULT_POSTAL_CODE, INDEX_2)
          .concat(StringUtils.right(target.getCustomerZipCode(), THREE_DIGITS));
    }
    return DEFAULT_POSTAL_CODE;
  }
}
