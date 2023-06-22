/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.utils;

import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.google.gson.Gson;

public class JsonConverter implements DynamoDBTypeConverter<String, LoyaltyProgramResponse> {
  private static final Gson CONVERTER = new Gson();

  @Override
  public String convert(LoyaltyProgramResponse object) {
    return CONVERTER.toJson(object);
  }

  @Override
  public LoyaltyProgramResponse unconvert(String object) {
    return CONVERTER.fromJson(object, LoyaltyProgramResponse.class);
  }
}
