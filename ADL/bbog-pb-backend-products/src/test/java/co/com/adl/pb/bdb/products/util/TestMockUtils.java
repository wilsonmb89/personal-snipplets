/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.util;

import static co.com.adl.pb.bdb.products.util.TestConstantUtils.TERMINAL_ID;

import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.common.properties.Info;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.ApiConnectLoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.LoyMemberPartnerInfo;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.PartnerMemberStatus;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.*;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.CardsDepAcctId;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.Account;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.provider.product.card.ProductCardApiConnectProviderTest;
import co.com.adl.pb.web.client.APIConnectTemplate;
import co.com.adl.pb.web.client.auth.OAuthRs;
import co.com.adl.pb.web.client.pojos.APIConnectRs;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class TestMockUtils {

  public static Customer getCustomer() {
    Customer customer = new Customer();
    customer.setIdentificationNumber("1011459576");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("costumer@costumer.com");
    return customer;
  }

  public static ProductCardRq getProductCardsRqWithAllStatus() {
    ProductCardRq productCardRq = new ProductCardRq();
    productCardRq.setAcctId("594000093");
    productCardRq.setAcctType("SDA");
    productCardRq.setRequireAllCards("1");
    productCardRq.setCardStatus(getStatusCode("ALL"));
    return productCardRq;
  }

  public static ProductCardRq getProductCardsRqWithNormaltatus() {
    ProductCardRq productCardRq = new ProductCardRq();
    productCardRq.setAcctId("594000093");
    productCardRq.setAcctType("SDA");
    productCardRq.setRequireAllCards("1");
    productCardRq.setCardStatus(getStatusCode("N"));
    return productCardRq;
  }

  public static List<String> getStatusCode(String cardStatus) {
    List<String> statusCode = new ArrayList<>();
    statusCode.add(cardStatus);
    return statusCode;
  }

  public static CardsDepAcctId getCardsDepAccId() {
    return CardsDepAcctId.builder()
        .acctId("594000093")
        .acctType("SDA")
        .requireAllCards("1")
        .build();
  }

  public static ProductListInquiryResponse getProductCardRs() {
    return ProductListInquiryResponse.builder()
        .accountList(Collections.singletonList(getAccount()))
        .build();
  }

  public static Account getAccount() {
    return Account.builder()
        .productNumber("594000093")
        .productBankType("SDA")
        .status("N")
        .bankId("001")
        .build();
  }

  public static ApiConnectProductCardRs getApiConnectProductCardRs() {
    return ApiConnectProductCardRs.builder().partyAcctRelRec(getPartyAcctRelRecList()).build();
  }

  public static List<PartyAcctRelRec> getPartyAcctRelRecList() {
    List<PartyAcctRelRec> partyAcctRelRecs = new ArrayList<>();
    partyAcctRelRecs.add(getPartyAcctRelRec());
    return partyAcctRelRecs;
  }

  public static PartyAcctRelRec getPartyAcctRelRec() {
    return PartyAcctRelRec.builder()
        .partyAcctRelInfo(getPartyAcctRelInfo())
        .bankAcctStatus(BankAcctStatus.builder().bankAcctStatusCode("N").build())
        .build();
  }

  public static PartyAcctRelInfo getPartyAcctRelInfo() {
    return PartyAcctRelInfo.builder().cardAcctId(getCardAcctId()).build();
  }

  public static CardAcctId getCardAcctId() {
    return CardAcctId.builder()
        .acctId("594000093")
        .acctType("SDA")
        .bankInfo(BankInfo.builder().bankId("001").build())
        .build();
  }

  public static MockWebServer startMockWebServer(int port) throws Exception {
    MockWebServer mockWebServer = new MockWebServer();
    mockWebServer.useHttps(TestSSLUtils.buildSslSocketFactory(), false);
    mockWebServer.start(port);
    ObjectMapper mapper = new ObjectMapper();
    mockWebServer.enqueue(
        new MockResponse()
            .setResponseCode(200)
            .setBody(
                mapper.writeValueAsString(
                    new ResponseEntity<>(new APIConnectRs<OAuthRs>(), HttpStatus.OK))));
    mockWebServer.enqueue(
        new MockResponse()
            .setResponseCode(200)
            .setBody(mapper.writeValueAsString(TestMockUtils.buildApiConnectRsResponseEntity())));
    return mockWebServer;
  }

  public static ApiConnectProductCardsRq getApiConnectProductCardsRq() {
    return ApiConnectProductCardsRq.builder()
        .cardsDepAcctId(getCardsDepAccId())
        .networkTrnInfo(getNetworkTrnInfo())
        .build();
  }

  public static NetworkTrnInfo getNetworkTrnInfo() {
    return NetworkTrnInfo.builder().terminalId(TERMINAL_ID).build();
  }

  public static BusinessContext buildProductCardBusinessContext(String resource) {
    ProductCardRq input = TestMockUtils.getProductCardsRqWithAllStatus();
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.HEADER_MAP, new HashMap<>())
        .putParameter(ContextParameter.REQUEST_METHOD, HttpMethod.POST)
        .putParameter(ContextParameter.REQUEST_ELEMENT, input)
        .putParameter(ContextParameter.RESOURCE, resource);
  }

  public static ResponseEntity<APIConnectRs<ApiConnectGenericResponse>>
      buildApiConnectRsResponseEntity() {
    APIConnectRs<ApiConnectGenericResponse> apiConnectRs = new APIConnectRs<>();
    apiConnectRs.setBody(new ApiConnectGenericResponse());
    return new ResponseEntity<>(apiConnectRs, HttpStatus.OK);
  }

  public static APIConnectTemplate buildApiConnectTemplate(int port) {
    String MOCK_SERVER_URL =
        co.com.adl.pb.bdb.products.utils.TestConstantUtils.MOCK_SERVER_BASE_URL.replace(
            "PORT", String.valueOf(port));
    APIConnectTemplate template =
        co.com.adl.pb.bdb.products.utils.TestMockUtils.buildApiConnectTemplate();
    template.getOauthSettings().setHost(MOCK_SERVER_URL);
    template.setHost(MOCK_SERVER_URL);
    return template;
  }

  public static ApiConnectProperties buildApiConnectProperties() {
    ApiConnectProperties properties = new ApiConnectProperties();
    Map<String, String> resourceMap = new HashMap<>();
    resourceMap.put(
        ProductCardApiConnectProviderTest.PRODUCT_CARDS_RESOURCE,
        "customerManagement/v1/Administration_Products/Products/Cards");
    Info info = new Info();
    info.setResourceMap(resourceMap);
    properties.setInfo(info);
    return properties;
  }

  public static ApiConnectProperties buildApiConnectProperties(int port) {
    String MOCK_SERVER_URL =
        TestConstantUtils.MOCK_SERVER_BASE_URL.replace("PORT", String.valueOf(port));
    ApiConnectProperties properties = TestMockUtils.buildApiConnectProperties();
    properties.getInfo().setUrl(MOCK_SERVER_URL);
    return properties;
  }

  public static ApiConnectLoyaltyProgramResponse buildApiConnectLoyaltyProgramResponse() {
    return ApiConnectLoyaltyProgramResponse.builder()
        .loyMemberPartnerInfo(loyMemberPartnerInfo())
        .build();
  }

  private static LoyMemberPartnerInfo loyMemberPartnerInfo() {
    return LoyMemberPartnerInfo.builder()
        .custPermId("1-7GN-6")
        .pointOfService("200")
        .listPartnerMemberStatus(generatePartnerMemberStatuses())
        .build();
  }

  private static List<PartnerMemberStatus> generatePartnerMemberStatuses() {
    List<PartnerMemberStatus> list = new ArrayList<>();
    list.add(
        PartnerMemberStatus.builder()
            .idPartner("1-7GU-6")
            .idMember("1-7GN-6")
            .namePartner("Banco de Bogota")
            .memberStatus("Activo")
            .registrationDate("2017-09-20T00:00:00")
            .nameSegment("Platino")
            .partnerBalance("1000")
            .typeSiebel("Estado Miembro Socio")
            .build());
    return list;
  }
}
