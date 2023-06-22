/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.configuration;

import co.com.adl.pb.bdb.products.repository.LoyaltyProgramRepository;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverterFactory;
import org.apache.commons.lang3.StringUtils;
import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableDynamoDBRepositories(
    basePackageClasses = LoyaltyProgramRepository.class,
    dynamoDBMapperConfigRef = "dynamoDBMapperConfig")
public class DynamoConfig {

  private static String amazonDynamoDBEndpoint;
  private static String prefix;

  public DynamoConfig(
      @Value("${amazon.dynamodb.endpoint:}") String amazonDynamoDBEndpoint,
      @Value("${amazon.dynamodb.prefix}") String prefix) {
    this.amazonDynamoDBEndpoint = amazonDynamoDBEndpoint;
    this.prefix = prefix;
  }

  @Bean
  public DynamoDBMapperConfig dynamoDBMapperConfig() {
    DynamoDBMapperConfig.Builder builder = new DynamoDBMapperConfig.Builder();
    builder.withTypeConverterFactory(DynamoDBTypeConverterFactory.standard());
    builder.withTableNameResolver(DynamoDBMapperConfig.DefaultTableNameResolver.INSTANCE);
    builder.withTableNameOverride(
        DynamoDBMapperConfig.TableNameOverride.withTableNamePrefix(prefix));
    return builder.build();
  }

  @Bean
  public AmazonDynamoDB amazonDynamoDB() {
    if (StringUtils.isNotBlank(amazonDynamoDBEndpoint)) {
      return AmazonDynamoDBClientBuilder.standard()
          .withEndpointConfiguration(
              new AwsClientBuilder.EndpointConfiguration(
                  amazonDynamoDBEndpoint, Regions.US_EAST_2.getName()))
          .build();
    } else {
      return AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_2).build();
    }
  }
}
