/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.unicef;

import co.com.adl.pb.bdb.common.abstraction.AdapterProvider;
import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.common.util.AdapterErrorMappingUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class UnicefEnrollmentAdapterProvider implements AdapterProvider<AdapterGenericResponse> {

  private static final String UNICEF_ADAPTER_CALL_ENABLED = "unicef-adapter-call-enabled";

  private final RetrofitTemplate adapterRetrofitTemplate;
  private final IntegrationProperties adapterIntegrationProperty;

  @Override
  public AdapterGenericResponse provide(BusinessContext context) throws BDBApplicationException {
    if (isAdapterCallEnabled()) {
      return AdapterErrorMappingUtil.mapError(
          adapterRetrofitTemplate.exchange(
              retrofit ->
                  retrofit
                      .create(UnicefEnrollmentCaller.class)
                      .enrollUnicef(
                          adapterIntegrationProperty.getResource(
                              context.getParameter(ContextParameter.RESOURCE)),
                          context.getParameter(ContextParameter.HEADER_MAP),
                          context.getParameter(ContextParameter.REQUEST_ELEMENT))));
    } else {
      return new AdapterGenericResponse();
    }
  }

  private boolean isAdapterCallEnabled() {
    return adapterIntegrationProperty.getResource(UNICEF_ADAPTER_CALL_ENABLED).equals("true");
  }
}
