/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.loyalty.program;

import static org.junit.Assert.assertEquals;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramPartner;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.provider.loyalty.program.DynamoProvider;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

public class LoyaltyProgramOrchestrationServiceCacheTest {

  @Mock
  private ApiConnectProvider<ApiConnectLoyaltyProgramResponse> loyaltyProgramApiConnectProvider;

  @Mock
  private Mapper<ApiConnectLoyaltyProgramResponse, LoyaltyProgramResponse>
      loyaltyProgramResponseMapper;

  @Mock private HeaderMapHelper headerMapHelper;
  @Mock private DynamoProvider<LoyaltyProgramEntity> loyaltyProgramEntityDynamoProvider;

  private LoyaltyProgramOrchestrationService subject;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    subject =
        new LoyaltyProgramOrchestrationService(
            headerMapHelper,
            loyaltyProgramApiConnectProvider,
            loyaltyProgramEntityDynamoProvider,
            loyaltyProgramResponseMapper,
            12);
  }

  @Test
  public void shouldCallOrchestrate() throws BDBApplicationException {

    Mockito.when(loyaltyProgramEntityDynamoProvider.provide(Mockito.any(BusinessContext.class)))
        .thenReturn(TestMockUtils.generateLoyaltyProgramEntity(1));

    LoyaltyProgramResponse response = subject.orchestrate(TestMockUtils.buildBdBGenericRequest());

    LoyaltyProgramPartner programPartner = response.getPartners().get(0);

    assertEquals("Activo", programPartner.getStatus());
    assertEquals("Platino", programPartner.getRank());
  }
}
