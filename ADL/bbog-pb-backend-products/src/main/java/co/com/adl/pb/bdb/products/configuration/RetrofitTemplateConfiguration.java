/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.configuration;

import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RetrofitTemplateConfiguration {

  @Bean
  RetrofitTemplate adapterRetrofitTemplate(IntegrationProperties adapterIntegrationProperty) {
    return new RetrofitTemplate(adapterIntegrationProperty);
  }

  @Bean
  RetrofitTemplate campaignRetrofitTemplate(IntegrationProperties campaignIntegrationProperty) {
    return new RetrofitTemplate(campaignIntegrationProperty);
  }
}
