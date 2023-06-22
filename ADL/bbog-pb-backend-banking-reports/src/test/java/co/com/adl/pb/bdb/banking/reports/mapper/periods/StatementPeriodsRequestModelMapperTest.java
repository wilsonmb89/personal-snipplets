/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.periods;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.ApiConnectStatementPeriodsRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRq;
import co.com.adl.pb.bdb.common.entity.Customer;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

@RunWith(MockitoJUnitRunner.class)
public class StatementPeriodsRequestModelMapperTest {

  @Autowired
  private StatementPeriodsRequestModelMapper sdtatementPeriodsRequestModelMapper =
      new StatementPeriodsRequestModelMapper();

  @Test
  public void mapperInputRequestToApi() {
    GetStatementPeriodRq rq = new GetStatementPeriodRq();
    rq.setAcctType("SDA");
    rq.setAcctId("123456");
    ApiConnectStatementPeriodsRequest apiRq = sdtatementPeriodsRequestModelMapper.map(rq);

    Assert.assertEquals(apiRq.getDepAcctId().getAcctId(), rq.getAcctId());
    Assert.assertEquals(apiRq.getDepAcctId().getAcctType(), rq.getAcctType());
  }

  private Customer getCustomer() {

    Customer customer = new Customer();
    customer.setIdentificationNumber("10203948");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("custumer@custumer.com");
    return customer;
  }
}
