/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.periods.v1;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v1.ApiConnectStatementPeriodsResponse;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v1.StatementRecord;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.ListRangeDto;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class StatementPeriodsResponseModelMapper
    implements Mapper<ApiConnectStatementPeriodsResponse, GetStatementPeriodRs> {

  @Override
  public GetStatementPeriodRs map(ApiConnectStatementPeriodsResponse target) {
    return GetStatementPeriodRs.builder()
        .rangeDt(
            target.getProductType().getStatementRecord().stream()
                .map(this::mapListRangeDto)
                .collect(Collectors.toList()))
        .build();
  }

  private ListRangeDto mapListRangeDto(StatementRecord statementRecord) {
    return ListRangeDto.builder()
        .value(statementRecord.getSelRangeDt().getStartDt())
        .name(statementRecord.getFile().getFileDesc())
        .build();
  }
}
