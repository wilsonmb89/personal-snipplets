/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.helper;

import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.Account;
import java.util.Comparator;

public class AccountResponseComparator implements Comparator<Account> {

  private enum AccountEnum {
    SDA(0),
    DDA(1),
    CCA(2),
    LOC(3),
    DLA(4),
    FDA(5),
    CDA(6),
    DEFAULT(7);
    private int index;

    AccountEnum(int index) {
      this.index = index;
    }

    public int getIndex() {
      return index;
    }
  }

  @Override
  public int compare(Account account1, Account account2) {
    return getIndexOf(account1) - getIndexOf(account2);
  }

  private int getIndexOf(Account account) {
    try {
      return AccountEnum.valueOf(account.getProductBankType()).getIndex();
    } catch (Exception e) {
      return AccountEnum.DEFAULT.getIndex();
    }
  }
}
