/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking;

import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnicefEnrollmentRequest extends BdBGenericRequest {

  private String customerAddressNumber;
  private String customerAddressDistrict;
  private String customerZipCode;
  private String customerPhoneNumber;
  private String customerAccountNumber;
  private String customerAccountSubtype;
  private String accountOfficeId;
}
