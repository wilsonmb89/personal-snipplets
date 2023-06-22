/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.loyalty.program;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.util.TestMockUtils;
import org.junit.Before;
import org.junit.Test;

public class LoyaltyProgramResponseModelMapperTest {

  private ApiConnectLoyaltyProgramResponse apiConnectLoyaltyProgramResponse;
  private LoyaltyProgramResponseModelMapper loyaltyProgramResponseModelMapper;

  @Before
  public void init() {
    this.apiConnectLoyaltyProgramResponse = TestMockUtils.buildApiConnectLoyaltyProgramResponse();
    loyaltyProgramResponseModelMapper = new LoyaltyProgramResponseModelMapper();
  }

  @Test
  public void mapApiResponseToCommonResponse() throws BDBApplicationException {

    LoyaltyProgramResponse mapped =
        loyaltyProgramResponseModelMapper.map(apiConnectLoyaltyProgramResponse);

    assertTrue(
        apiConnectLoyaltyProgramResponse
            .getLoyMemberPartnerInfo()
            .getPointOfService()
            .equals(mapped.getBalance()));

    assertTrue(
        apiConnectLoyaltyProgramResponse.getLoyMemberPartnerInfo().getListPartnerMemberStatus()
            .stream()
            .anyMatch(o -> o.getPartnerBalance().equals(mapped.getPartners().get(0).getBalance())));

    assertTrue(
        apiConnectLoyaltyProgramResponse.getLoyMemberPartnerInfo().getListPartnerMemberStatus()
            .stream()
            .anyMatch(o -> o.getMemberStatus().equals(mapped.getPartners().get(0).getStatus())));
  }
}
