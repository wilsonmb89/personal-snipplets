/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.configuration;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.core.DefaultRulesEngine;
import org.jeasy.rules.core.RulesEngineParameters;
import org.jeasy.rules.mvel.MVELRuleFactory;
import org.jeasy.rules.support.YamlRuleDefinitionReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class RulesConfig {

  @Bean
  public MVELRuleFactory ruleFactory() {
    return new MVELRuleFactory(new YamlRuleDefinitionReader());
  }

  @Bean
  public Rules rules(MVELRuleFactory ruleFactory) throws Exception {
    InputStream resource = new ClassPathResource("product_list_rule.yml").getInputStream();
    return ruleFactory.createRules(new BufferedReader(new InputStreamReader(resource)));
  }

  @Bean
  public RulesEngine rulesEngine() {
    RulesEngineParameters parameters = new RulesEngineParameters().skipOnFirstAppliedRule(true);
    return new DefaultRulesEngine(parameters);
  }
}
