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
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.DepAcctIdPeriodsRequest;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRq;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.util.Arrays;
import java.util.List;
import java.util.function.UnaryOperator;
import org.springframework.stereotype.Component;

@Component
public class StatementPeriodsRequestModelMapper
    implements Mapper<GetStatementPeriodRq, ApiConnectStatementPeriodsRequest> {

  private static final List<String> ACC_TYPES = Arrays.asList("DDA", "SDA", "CCA", "CDA", "FDA");
  private static final String CREDIT_TYPE_LOAN = "LOC";
  private static final UnaryOperator<String> MAP_ACCOUNT_TYPE =
      accType -> ACC_TYPES.stream().noneMatch(a -> a.equals(accType)) ? CREDIT_TYPE_LOAN : accType;

  @Override
  public ApiConnectStatementPeriodsRequest map(GetStatementPeriodRq target) {
    return ApiConnectStatementPeriodsRequest.builder()
        .depAcctId(
            DepAcctIdPeriodsRequest.builder()
                .acctId(target.getAcctId())
                .acctType(MAP_ACCOUNT_TYPE.apply(target.getAcctType()))
                .build())
        .build();
  }
}
