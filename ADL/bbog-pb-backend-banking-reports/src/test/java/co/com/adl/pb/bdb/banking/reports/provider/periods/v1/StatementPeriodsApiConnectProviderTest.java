/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports.provider.periods.v1;

import co.com.adl.pb.bdb.banking.reports.model.dto.periods.api.connect.v1.ApiConnectStatementPeriodsResponse;
import co.com.adl.pb.bdb.banking.reports.model.dto.statements.api.connect.ApiConnectBankStatementRequest;
import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.web.client.APIConnectTemplate;
import co.com.adl.pb.web.client.pojos.APIConnectRs;
import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RunWith(MockitoJUnitRunner.class)
public class StatementPeriodsApiConnectProviderTest {

  @Mock private ApiConnectProperties apiConnectProperties;

  @Mock private APIConnectTemplate apiConnectTemplate;

  private ApiConnectProvider<ApiConnectStatementPeriodsResponse> apiConnectProvider;

  @Before
  public void init() {
    apiConnectProvider =
        new StatementPeriodsApiConnectProvider(apiConnectTemplate, apiConnectProperties);
  }

  @Test
  public void provide() throws BDBApplicationException {
    APIConnectRs<ApiConnectStatementPeriodsResponse> apiConnectRs = new APIConnectRs<>();
    apiConnectRs.setBody(new ApiConnectStatementPeriodsResponse());
    ResponseEntity<APIConnectRs<ApiConnectStatementPeriodsResponse>> testResponse =
        new ResponseEntity<>(apiConnectRs, HttpStatus.OK);
    Mockito.doReturn(testResponse)
        .when(apiConnectTemplate)
        .exchange(Mockito.any(), Mockito.anyMap());
    Map<String, String> testHeadersMap = new HashMap<>();
    BusinessContext context =
        BusinessContext.getNewInstance()
            .putParameter(
                ContextParameter.REQUEST_ELEMENT, ApiConnectBankStatementRequest.builder().build())
            .putParameter(ContextParameter.HEADER_MAP, testHeadersMap)
            .putParameter(ContextParameter.RESOURCE, "TestResource");
    BusinessContext spyContext = Mockito.spy(context);
    apiConnectProvider.provide(spyContext);
    Mockito.verify(spyContext).getParameter(ContextParameter.HEADER_MAP);
  }
}
