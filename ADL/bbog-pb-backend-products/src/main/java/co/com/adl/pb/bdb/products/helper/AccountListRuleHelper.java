/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.helper;

import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.AccountHelper;
import lombok.AllArgsConstructor;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AccountListRuleHelper {

  private final Rules rules;
  private final RulesEngine rulesEngine;

  @Cacheable(value = "RuleEvaluationCache", key = "#account.cacheKey()")
  public AccountHelper assist(AccountHelper account) {
    Facts facts = new Facts();
    facts.put("account", account);
    rulesEngine.fire(rules, facts);
    return account;
  }
}
