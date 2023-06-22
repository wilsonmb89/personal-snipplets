/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.loyalty.transaction.inquiry;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

@Component
public class TransactionsInquiryQueryMapper
    implements Mapper<TransactionsInquiryRequest, Map<String, String>> {

  public static final String DATE_FORMAT = "yyyy-MM-dd";
  public static final String TIME_FORMAT = "'T'HH:mm:ss";

  @SneakyThrows
  @Override
  public Map<String, String> map(TransactionsInquiryRequest target) throws BDBApplicationException {
    Map<String, String> queryMap = new HashMap<>();
    queryMap.put("StartDt", formatApiConnectDate(target.getStartDate()));
    queryMap.put("EndDt", formatApiConnectDate(target.getEndDate()));
    return queryMap;
  }

  private String formatApiConnectDate(String date) {
    return LocalDate.parse(date, DateTimeFormatter.ofPattern(DATE_FORMAT))
        .atTime(0, 0, 0)
        .format(DateTimeFormatter.ofPattern(DATE_FORMAT.concat(TIME_FORMAT)));
  }
}
