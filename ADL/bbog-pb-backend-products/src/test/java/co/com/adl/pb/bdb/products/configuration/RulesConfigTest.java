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

import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.mvel.MVELRuleFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class RulesConfigTest {

  private RulesConfig rulesConfig;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    rulesConfig = new RulesConfig();
  }

  @Test
  public void ruleFactoryTest() {
    MVELRuleFactory mvelRuleFactory = rulesConfig.ruleFactory();
    assertNotNull(mvelRuleFactory);
  }

  @Test
  public void rulesEngineTest() {
    RulesEngine rulesEngine = rulesConfig.rulesEngine();
    assertNotNull(rulesEngine);
  }

  @Test
  public void rulesTest() throws Exception {
    Rules rules = rulesConfig.rules(rulesConfig.ruleFactory());
    assertNotNull(rules);
  }
}
