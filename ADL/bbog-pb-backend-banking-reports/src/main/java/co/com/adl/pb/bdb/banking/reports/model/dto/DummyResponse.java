/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto;

import lombok.Getter;

// TODO: Remove this testing purpose entity

@Getter
public class DummyResponse {

  private final String success = "SUCCESS_REQUEST";
  private long freeMem = Runtime.getRuntime().freeMemory() / 1024;
  private long maxMem = Runtime.getRuntime().maxMemory() / 1024;
  private long totalMem = Runtime.getRuntime().totalMemory() / 1024;
  private long proc = Runtime.getRuntime().availableProcessors();
}
