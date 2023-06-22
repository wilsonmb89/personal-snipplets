/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.campaign;

import static org.junit.Assert.assertTrue;

import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;

public class CustomerCampaignResponseModelMapperTest {

  private CustomerCampaignAdapterResponse customerCampaignAdapterResponse;
  private CustomerCampaignResponseModelMapper customerCampaignResponseModelMapper;

  @Before
  public void init() {
    this.customerCampaignAdapterResponse = TestMockUtils.buildCustomerCampaignAdapterResponse();
    customerCampaignResponseModelMapper = new CustomerCampaignResponseModelMapper();
  }

  @Test
  public void mapApiResponseToCommonResponse() throws BDBApplicationException {

    CustomerCampaignResponse response =
        customerCampaignResponseModelMapper.map(customerCampaignAdapterResponse);

    assertTrue(
        response.getCampaignId().equals(customerCampaignAdapterResponse.getCampaignId())
            && response.getProduct().equals(customerCampaignAdapterResponse.getProduct())
            && response.getAmount().equals(customerCampaignAdapterResponse.getAmount())
            && response.getBrand().equals(customerCampaignAdapterResponse.getBrand())
            && response.getBin().equals(customerCampaignAdapterResponse.getBin()));
  }
}
