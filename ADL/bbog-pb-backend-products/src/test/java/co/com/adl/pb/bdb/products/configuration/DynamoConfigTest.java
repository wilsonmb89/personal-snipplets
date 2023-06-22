/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.configuration;

import static org.junit.Assert.assertNotNull;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class DynamoConfigTest {

  private DynamoConfig dynamoConfig;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    dynamoConfig = new DynamoConfig("http://localhost:8108", "local");
  }

  @Test
  public void shouldCallAmazonDynamoDB() {
    AmazonDynamoDB amazonDynamoDB = dynamoConfig.amazonDynamoDB();
    assertNotNull(amazonDynamoDB);
  }

  @Test
  public void shouldCallDynamoDBMapperConfig() {
    DynamoDBMapperConfig dynamoDBMapperConfig = dynamoConfig.dynamoDBMapperConfig();
    assertNotNull(dynamoDBMapperConfig);
  }
}
