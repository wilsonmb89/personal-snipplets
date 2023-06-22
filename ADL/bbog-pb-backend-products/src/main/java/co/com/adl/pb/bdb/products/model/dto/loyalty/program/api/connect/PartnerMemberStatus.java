/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect;

import com.google.gson.annotations.SerializedName;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PartnerMemberStatus {
  @SerializedName("IdPartner")
  private String idPartner;

  @SerializedName("IdMember")
  private String idMember;

  @SerializedName("NamePartner")
  private String namePartner;

  @SerializedName("MemberStatus")
  private String memberStatus;

  @SerializedName("RegistrationDate")
  private String registrationDate;

  @SerializedName("NameSegment")
  private String nameSegment;

  @SerializedName("PartnerBalance")
  private String partnerBalance;

  @SerializedName("TypeSiebel")
  private String typeSiebel;
}
