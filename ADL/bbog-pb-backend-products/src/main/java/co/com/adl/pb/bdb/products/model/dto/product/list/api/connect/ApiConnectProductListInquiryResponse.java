/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.product.list.api.connect;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiConnectProductListInquiryResponse extends ApiConnectGenericResponse {
  @SerializedName("PartyAcctRelRec")
  private List<PartyAcctRelRec> partyAcctRelRec;
}
