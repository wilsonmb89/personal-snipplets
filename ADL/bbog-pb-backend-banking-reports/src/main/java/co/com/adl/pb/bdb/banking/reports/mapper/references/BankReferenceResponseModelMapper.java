/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.mapper.references;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRs;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.personal.banking.AccountsCertificatesMngrRs;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import org.springframework.stereotype.Component;

@Component
public class BankReferenceResponseModelMapper
    implements Mapper<ApiAccountsCertificatesRs, AccountsCertificatesMngrRs> {

  @Override
  public AccountsCertificatesMngrRs map(ApiAccountsCertificatesRs target) {

    return AccountsCertificatesMngrRs.builder()
        .binData(target.getFile().getFileData().getBinData())
        .fileName(target.getFile().getFileName())
        .build();
  }
}
