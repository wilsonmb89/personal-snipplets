/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.loyalty.program;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.PartnerMemberStatus;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramPartner;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class LoyaltyProgramResponseModelMapper
    implements Mapper<ApiConnectLoyaltyProgramResponse, LoyaltyProgramResponse> {

  public static final String BBOG_CODE = "001";
  public static final String BPOP_CODE = "002";
  public static final String BOCC_CODE = "023";
  public static final String BAVV_CODE = "052";
  public static final String UNKNOWN_PARTNER_CODE = "000";

  @Override
  public LoyaltyProgramResponse map(ApiConnectLoyaltyProgramResponse response) {

    return LoyaltyProgramResponse.builder()
        .partners(
            this.mapListPartners(response.getLoyMemberPartnerInfo().getListPartnerMemberStatus()))
        .balance(response.getLoyMemberPartnerInfo().getPointOfService())
        .build();
  }

  private List<LoyaltyProgramPartner> mapListPartners(List<PartnerMemberStatus> list) {
    return list.stream()
        .map(
            partner ->
                LoyaltyProgramPartner.builder()
                    .bankId(getBankId(partner))
                    .description(partner.getTypeSiebel())
                    .status(partner.getMemberStatus())
                    .rank(partner.getNameSegment())
                    .balance(partner.getPartnerBalance())
                    .name(partner.getNamePartner())
                    .memberSince(partner.getRegistrationDate())
                    .build())
        .collect(Collectors.toList());
  }

  private String getBankId(PartnerMemberStatus partner) {
    if (partner.getNamePartner().matches("(?i).*(bogota).*")) {
      return BBOG_CODE;
    }
    if (partner.getNamePartner().matches("(?i).*(popular).*")) {
      return BPOP_CODE;
    }
    if (partner.getNamePartner().matches("(?i).*(occidente).*")) {
      return BOCC_CODE;
    }
    if (partner.getNamePartner().matches("(?i).*(villas).*")) {
      return BAVV_CODE;
    }
    return UNKNOWN_PARTNER_CODE;
  }
}
