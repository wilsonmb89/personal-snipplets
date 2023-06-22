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

import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterRequest;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.junit.Before;
import org.junit.Test;

public class CustomerCampaignRequestModelMapperTest {

  private CustomerCampaignRequestModelMapper customerCampaignRequestModelMapper;

  @Before
  public void init() {
    this.customerCampaignRequestModelMapper = new CustomerCampaignRequestModelMapper();
  }

  @Test
  public void mapRequestToApiRequest() throws BDBApplicationException {
    BdBGenericRequest bdBGenericRequest = TestMockUtils.buildBdBGenericRequest();
    CustomerCampaignAdapterRequest customerCampaignAdapterRequest =
        customerCampaignRequestModelMapper.map(bdBGenericRequest);

    assertTrue(
        customerCampaignAdapterRequest.getDocumentType().equals("C")
            && customerCampaignAdapterRequest
                .getDocumentNumber()
                .equals(
                    Integer.parseInt(bdBGenericRequest.getCustomer().getIdentificationNumber())));
  }
}
