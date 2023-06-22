/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoyaltyProgramPartner {
  private String name;
  private String balance;
  private String status;
  private String memberSince;
  private String rank;
  private String description;
  private String bankId;
}
