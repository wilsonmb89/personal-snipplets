/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.provider.references;

import co.com.adl.pb.bdb.banking.reports.model.dto.references.api.connect.ApiAccountsCertificatesRs;
import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.common.util.ErrorMappingUtil;
import co.com.adl.pb.web.client.APIConnectTemplate;
import org.springframework.stereotype.Component;

@Component
public class BankReferenceApiConnectProvider
    implements ApiConnectProvider<ApiAccountsCertificatesRs> {

  private final APIConnectTemplate apiConnectTemplate;
  private final ApiConnectProperties apiConnectProperties;

  public BankReferenceApiConnectProvider(
      APIConnectTemplate apiConnectTemplate, ApiConnectProperties apiConnectProperties) {
    this.apiConnectTemplate = apiConnectTemplate;
    this.apiConnectProperties = apiConnectProperties;
  }

  @Override
  public ApiAccountsCertificatesRs provide(BusinessContext context) throws BDBApplicationException {
    return ErrorMappingUtil.mapError(
        apiConnectTemplate.exchange(
            (retrofitSSL ->
                retrofitSSL
                    .create(BankReferenceCaller.class)
                    .post(
                        apiConnectProperties.getResource(
                            context.getParameter(ContextParameter.RESOURCE)),
                        context.getParameter(ContextParameter.HEADER_MAP),
                        context.getParameter(ContextParameter.REQUEST_ELEMENT))),
            context.getParameter(ContextParameter.HEADER_MAP)));
  }
}
