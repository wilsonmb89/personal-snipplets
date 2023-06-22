/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountHelper {
  public AccountHelper(String bankId, String subBankId, String franchise, String description) {
    this.bankId = bankId;
    this.subBankId = subBankId;
    this.franchise = franchise;
    this.description = description;
  }

  private String bankId;
  private String subBankId;
  private String athId;
  private String accountName;
  private String franchise;
  private String description;

  public String cacheKey() {
    return String.join("-", bankId, subBankId);
  }
}
