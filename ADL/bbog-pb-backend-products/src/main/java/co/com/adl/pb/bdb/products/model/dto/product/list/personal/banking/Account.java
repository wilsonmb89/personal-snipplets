/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Account {
  private String productName;
  private String description;
  private String officeId;
  private String bankId;
  private String productAthType;
  private String productBankType;
  private String productBankSubType;
  private String productNumber;
  private String status;
  private String bin;
  private Boolean valid;
  private String franchise;
  private String openDate;
}
