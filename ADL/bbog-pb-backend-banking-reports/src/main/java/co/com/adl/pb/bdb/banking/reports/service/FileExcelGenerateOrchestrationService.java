/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.service;

import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking.GenerateFileExcelRs;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.exception.BDBTechnicalException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.stream.Stream;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

@Service
public class FileExcelGenerateOrchestrationService
    implements OrchestrationService<GenerateFileExcelRq, GenerateFileExcelRs> {

  private static final String EXTENSION_FILE_XLS = ".xls";
  private static final String CURRENCY_FORMAT = "\"$\"#,##.00;-\"$\"#,##.00";
  private static final String SHEET_NAME = "History";
  private static final String FILE_NAME = "Download";
  private static final String SPLIT_CELL_REG = ";";
  private static final String REPLACE_CELL_REG = "\"";
  private static final String MATCH_FIELD_REG = "-?\\d+(\\.\\d+)?";
  private static final int ZERO = 0;
  private static final int WIDTH_FILE_XLS = 20 * 256;

  private static final HashMap<String, String> TYPE_FILE = new HashMap();

  static {
    TYPE_FILE.put("MOVEMENTS_HISTORY", "3");
    TYPE_FILE.put("PAYMENTS_HISTORY", "6");
    TYPE_FILE.put("TRANSFERS_HISTORY", "7");
  }

  @Override
  @ElasticTraced
  public GenerateFileExcelRs orchestrate(GenerateFileExcelRq generateFileExcelRq)
      throws BDBApplicationException {

    TYPE_FILE.put("MOVEMENTS_HISTORY", "3");
    TYPE_FILE.put("PAYMENTS_HISTORY", "6");
    TYPE_FILE.put("TRANSFERS_HISTORY", "7");

    try (HSSFWorkbook workbook = new HSSFWorkbook();
        ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

      HSSFSheet sheet = workbook.createSheet(SHEET_NAME);
      DataFormat styleCurrencyFormat = workbook.createDataFormat();
      CellStyle cellStyle = workbook.createCellStyle();
      cellStyle.setDataFormat(styleCurrencyFormat.getFormat(CURRENCY_FORMAT));

      final int[] rowCount = new int[] {ZERO};

      Stream.of(generateFileExcelRq.getReportData().replaceAll("\r", "").split("\n"))
          .forEach(
              tx -> {
                Row row = sheet.createRow(++rowCount[ZERO]);
                final int[] columnCount = new int[] {ZERO};
                Stream.of(tx.split(";"))
                    .forEach(
                        field -> {
                          Cell cell = row.createCell(++columnCount[ZERO]);
                          fillCell(
                              generateFileExcelRq.getTypeFile(),
                              columnCount[ZERO],
                              cell,
                              field,
                              cellStyle);
                          sheet.setColumnWidth(columnCount[ZERO], WIDTH_FILE_XLS);
                        });
              });

      workbook.write(baos);
      byte[] encoded = Base64.getEncoder().encode(baos.toByteArray());
      GenerateFileExcelRs generateFileRS = new GenerateFileExcelRs();
      generateFileRS.setFile(new String(encoded));
      generateFileRS.setExtension(EXTENSION_FILE_XLS);
      generateFileRS.setName(FILE_NAME);
      return generateFileRS;

    } catch (IOException e) {
      throw new BDBTechnicalException("Error trying to generate file", e);
    }
  }

  private void fillCell(String type, int column, Cell cell, String field, CellStyle cellStyle) {

    boolean isNumber =
        Stream.of(TYPE_FILE.get(type).split(SPLIT_CELL_REG))
            .anyMatch(n -> Integer.parseInt(n) == column);

    field = field.replaceAll(REPLACE_CELL_REG, "").trim();
    if (isNumber && field.matches(MATCH_FIELD_REG)) {
      cell.setCellValue(Double.parseDouble(field));
      cell.setCellStyle(cellStyle);
    } else {
      cell.setCellValue(field);
    }
  }
}
