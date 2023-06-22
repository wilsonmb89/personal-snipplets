/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking;

import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionsInquiryRequest extends BdBGenericRequest {
  private String startDate;
  private String endDate;
}
