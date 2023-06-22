/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountReference {

  private String acctId;

  private String acctType;

  private Integer amount;

  private String openDt;

  private Boolean includedAmt;
}