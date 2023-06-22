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
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LoyMemberPartnerInfo {
  @SerializedName("CustPermId")
  private String custPermId;

  @SerializedName("DateBirth")
  private String dateBirth;

  @SerializedName("GovIssueIdent")
  private List<GovIssueIdent> govIssueIdent;

  @SerializedName("NamePartner")
  private String namePartner;

  @SerializedName("CivilStatus")
  private String civilStatus;

  @SerializedName("Gender")
  private String gender;

  @SerializedName("IdNum")
  private String idNum;

  @SerializedName("IdType")
  private String idType;

  @SerializedName("PointOfService")
  private String pointOfService;

  @SerializedName("CustLoginId")
  private String custLoginId;

  @SerializedName("ProgramInfo")
  private List<ProgramInfo> programInfo;

  @SerializedName("SelRangeDt")
  private List<SelRangeDt> selRangeDt;

  @SerializedName("MemberStatusCode")
  private String memberStatusCode;

  @SerializedName("ListPartnerMemberStatus")
  private List<PartnerMemberStatus> listPartnerMemberStatus;
}
