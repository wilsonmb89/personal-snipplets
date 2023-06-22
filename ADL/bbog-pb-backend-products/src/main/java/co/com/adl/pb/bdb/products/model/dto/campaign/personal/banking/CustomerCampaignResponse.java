/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CustomerCampaignResponse {

  private String campaignId;
  private String amount;
  private String product;
  private String bin;
  private String brand;
}
