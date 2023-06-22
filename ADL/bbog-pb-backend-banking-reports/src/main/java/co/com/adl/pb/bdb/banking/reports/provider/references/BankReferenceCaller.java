/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.provider.references;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRq;
import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRs;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.HeaderMap;
import retrofit2.http.POST;
import retrofit2.http.Url;

public interface BankReferenceCaller {

  @POST
  Call<ApiAccountsCertificatesRs> post(
      @Url String url,
      @HeaderMap Map<String, String> headerMap,
      @Body ApiAccountsCertificatesRq apiAccountsCertificatesRq);
}
