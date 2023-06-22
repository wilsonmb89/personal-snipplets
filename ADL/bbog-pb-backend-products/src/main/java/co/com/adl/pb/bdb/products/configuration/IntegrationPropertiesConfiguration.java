/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.configuration;

import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.common.properties.RetrofitTemplateProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IntegrationPropertiesConfiguration {

  private static final String ADAPTER_INTEGRATION_PROPERTY = "adapter-integration";
  private static final String CAMPAIGN_ADAPTER_INTEGRATION_PROPERTY = "campaign-adapter";

  @Bean
  IntegrationProperties adapterIntegrationProperty(
      RetrofitTemplateProperties retrofitTemplateProperties) {
    return retrofitTemplateProperties.getIntegrationProperty(ADAPTER_INTEGRATION_PROPERTY);
  }

  @Bean
  IntegrationProperties campaignIntegrationProperty(
      RetrofitTemplateProperties retrofitTemplateProperties) {
    return retrofitTemplateProperties.getIntegrationProperty(CAMPAIGN_ADAPTER_INTEGRATION_PROPERTY);
  }
}
