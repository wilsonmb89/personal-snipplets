/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.utils;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import java.time.LocalDateTime;

public class LocalDateTimeConverter implements DynamoDBTypeConverter<String, LocalDateTime> {
  @Override
  public String convert(LocalDateTime object) {
    return object.toString();
  }

  @Override
  public LocalDateTime unconvert(String object) {
    return LocalDateTime.parse(object);
  }
}
