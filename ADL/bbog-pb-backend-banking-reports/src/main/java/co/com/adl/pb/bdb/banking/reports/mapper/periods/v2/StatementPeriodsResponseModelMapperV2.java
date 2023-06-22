/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.periods.v2;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.ApiConnectStatementPeriodsResponseV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v2.StatementRecordV2;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.GetStatementPeriodRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.periods.personal.banking.ListRangeDto;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class StatementPeriodsResponseModelMapperV2
    implements Mapper<ApiConnectStatementPeriodsResponseV2, GetStatementPeriodRs> {

  @Override
  public GetStatementPeriodRs map(ApiConnectStatementPeriodsResponseV2 target) {
    return GetStatementPeriodRs.builder()
        .rangeDt(
            target.getStatementRecord().stream()
                .map(this::mapListRangeDto)
                .collect(Collectors.toList()))
        .build();
  }

  private ListRangeDto mapListRangeDto(StatementRecordV2 statementRecord) {
    return ListRangeDto.builder()
        .value(statementRecord.getSelRangeDt().getStartDt())
        .name(statementRecord.getFile().getFileDesc())
        .build();
  }
}
