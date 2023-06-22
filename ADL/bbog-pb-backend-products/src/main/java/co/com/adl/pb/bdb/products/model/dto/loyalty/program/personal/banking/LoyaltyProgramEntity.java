/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking;

import co.com.adl.pb.bdb.products.utils.JsonConverter;
import co.com.adl.pb.bdb.products.utils.LocalDateTimeConverter;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@DynamoDBTable(tableName = "user-loyalty-program")
public class LoyaltyProgramEntity {

  @DynamoDBHashKey(attributeName = "Key")
  private String key;

  @DynamoDBAttribute(attributeName = "Item")
  @DynamoDBTypeConverted(converter = JsonConverter.class)
  private LoyaltyProgramResponse loyaltyPogramResponse;

  @DynamoDBAttribute(attributeName = "Ttl")
  @DynamoDBTypeConverted(converter = LocalDateTimeConverter.class)
  private LocalDateTime ttl;
}
