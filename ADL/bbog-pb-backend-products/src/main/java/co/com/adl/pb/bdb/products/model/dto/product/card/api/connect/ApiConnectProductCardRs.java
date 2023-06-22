/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.product.card.api.connect;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApiConnectProductCardRs extends ApiConnectGenericResponse {

  @SerializedName("PartyAcctRelRec")
  List<PartyAcctRelRec> partyAcctRelRec;

  ProductCardRq productCardRq;
}
