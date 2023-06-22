/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.unicef.adapter;

import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostAddr {

  @SerializedName("Addr1")
  private String addr1;

  @SerializedName("Addr2")
  private String addr2;

  @SerializedName("CityId")
  private String cityId;

  @SerializedName("StateProv")
  private String stateProv;

  @SerializedName("PostalCode")
  private String postalCode;

  @SerializedName("Country")
  private String country;

  @SerializedName("ZipCode")
  private String zipCode;
}
