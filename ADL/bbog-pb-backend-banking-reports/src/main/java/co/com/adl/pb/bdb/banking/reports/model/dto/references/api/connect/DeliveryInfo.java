/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect;

import com.google.gson.annotations.SerializedName;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeliveryInfo {

  @SerializedName("Email")
  private final String email;

  @SerializedName("Label")
  private final String label;

  @SerializedName("Message")
  private final String message;

  @SerializedName("Subject")
  private final String subject;

  @SerializedName("Contract")
  private final String contract;

  @SerializedName("Business")
  private final String business;

  @SerializedName("Template")
  private final String template;

  @SerializedName("AdditionalData")
  private final List<AdditionalDatum> additionalData;
}
