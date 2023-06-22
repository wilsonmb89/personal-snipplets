/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.helper;

import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.AccountHelper;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class AccountListRuleHelperTest {

  @Mock private Rules rules;

  @Mock private RulesEngine rulesEngine;

  private AccountListRuleHelper accountListRuleHelper;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    accountListRuleHelper = new AccountListRuleHelper(rules, rulesEngine);
  }

  @Test
  public void assistTest() {

    AccountHelper accountHelper = TestMockUtils.generateAccountHelper();

    doNothing().when(rulesEngine).fire(any(Rules.class), any(Facts.class));
    AccountHelper response = accountListRuleHelper.assist(accountHelper);

    assertTrue(
        response.getAccountName() == accountHelper.getAccountName()
            && response.getAthId() == accountHelper.getAthId()
            && response.getBankId() == accountHelper.getBankId()
            && response.getSubBankId() == accountHelper.getSubBankId()
            && response.getFranchise() == accountHelper.getFranchise()
            && response.getDescription() == accountHelper.getDescription());
  }
}
