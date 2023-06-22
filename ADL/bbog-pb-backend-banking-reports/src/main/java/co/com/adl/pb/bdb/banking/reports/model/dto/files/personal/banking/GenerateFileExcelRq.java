/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.model.dto.files.personal.banking;

import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateFileExcelRq extends BdBGenericRequest {

  @NotNull private String typeFile;
  @NotNull private String reportData;
}
