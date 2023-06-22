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
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import org.springframework.stereotype.Component;

@Component
public class CustomerCampaignResponseModelMapper
    implements Mapper<CustomerCampaignAdapterResponse, CustomerCampaignResponse> {
  @Override
  public CustomerCampaignResponse map(CustomerCampaignAdapterResponse target)
      throws BDBApplicationException {
    return CustomerCampaignResponse.builder()
        .campaignId(target.getCampaignId())
        .amount(target.getAmount())
        .product(target.getProduct())
        .bin(target.getBin())
        .brand(target.getBrand())
        .build();
  }
}
