/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.campaign;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.constants.BdbConstants;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterRequest;
import org.springframework.stereotype.Component;

@Component
public class CustomerCampaignRequestModelMapper
    implements Mapper<BdBGenericRequest, CustomerCampaignAdapterRequest> {
  @Override
  public CustomerCampaignAdapterRequest map(BdBGenericRequest target)
      throws BDBApplicationException {
    return CustomerCampaignAdapterRequest.builder()
        .documentNumber(Integer.parseInt(target.getCustomer().getIdentificationNumber()))
        .documentType(
            BdbConstants.BACKEND_ID_TYPE_DATA_MAP_SINGLE_CASE.get(
                target.getCustomer().getIdentificationType()))
        .build();
  }
}
