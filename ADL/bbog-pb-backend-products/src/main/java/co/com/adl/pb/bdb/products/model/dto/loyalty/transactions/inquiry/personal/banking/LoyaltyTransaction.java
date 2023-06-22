/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LoyaltyTransaction {
  private String transactionType;
  private String status;
  private String date;
  private String totalPoints;
  private String description;
  private String partner;
  private String amount;
}
