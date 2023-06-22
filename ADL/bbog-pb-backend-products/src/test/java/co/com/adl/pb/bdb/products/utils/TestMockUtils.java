/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.utils;

import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.ApiConnectGenericResponse;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BdBGenericResponse;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.integration.RetrofitTemplate;
import co.com.adl.pb.bdb.common.properties.ApiConnectProperties;
import co.com.adl.pb.bdb.common.properties.Info;
import co.com.adl.pb.bdb.common.properties.IntegrationProperties;
import co.com.adl.pb.bdb.products.model.dto.campaign.adapter.CustomerCampaignAdapterResponse;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.api.connect.GovIssueIdent;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramPartner;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.CompositeCurAmt;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.CurAmt;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.DepAcctIdProgLoy;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.LoyaltyTransactionsInquiryApiConnectResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.PartnerInfo;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.PointsInfo;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.TransHistoryMember;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.api.connect.TransactionHistory;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.LoyaltyTransaction;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryRequest;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.BankAcctStatus;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.CCMotoAcct;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.CardAcctId;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.CustId;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.DepAcctId;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.OfficeInfo;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.PartyAcctRelInfo;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.PartyAcctRelRec;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.Account;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.AccountHelper;
import co.com.adl.pb.bdb.products.model.dto.unicef.adapter.UnicefEnrollmentAdapterRq;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import co.com.adl.pb.bdb.products.provider.campaign.CustomerCampaignAdapterProviderTest;
import co.com.adl.pb.bdb.products.provider.loyalty.program.LoyaltyProgramApiConnectProviderTest;
import co.com.adl.pb.bdb.products.provider.loyalty.transaction.inquiry.LoyaltyTransactionsInquiryApiConnectProviderTest;
import co.com.adl.pb.bdb.products.provider.product.list.ProductListApiConnectProviderTest;
import co.com.adl.pb.bdb.products.provider.unicef.UnicefEnrollmentAdapterProviderTest;
import co.com.adl.pb.web.client.APIConnectTemplate;
import co.com.adl.pb.web.client.auth.OAuthRs;
import co.com.adl.pb.web.client.pojos.APIConnectRs;
import co.com.adl.pb.web.client.pojos.OauthSettings;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class TestMockUtils {

  public static final Map<String, String> SP_NAME_MAP =
      new HashMap<String, String>() {
        {
          put("0215", "Claro");
          put("0211", "Movistar");
          put("0290", "Tigo");
          put("4964", "Uff");
        }
      };

  public static Customer buildCustomer() {
    Customer customer = new Customer();
    customer.setIdentificationNumber("1011459576");
    customer.setIdentificationType("CC");
    customer.setRemoteAddress("customer@customer.com");
    customer.setBackendToken("89asasasasuyy");
    return customer;
  }

  public static ApiConnectProperties buildApiConnectProperties() {
    ApiConnectProperties properties = new ApiConnectProperties();
    Map<String, String> resourceMap = new HashMap<>();
    // URL RECURSO.
    resourceMap.put(
        ProductListApiConnectProviderTest.PRODUCT_LIST_RESOURCE,
        "customerManagement/v3/Customer_Products/Products");
    resourceMap.put(
        LoyaltyProgramApiConnectProviderTest.LOYALTY_PROGRAM_RESORUCE,
        "customerManagement/v1/Customer_Loyalty/Loyalty/Balance");
    resourceMap.put(
        LoyaltyTransactionsInquiryApiConnectProviderTest.LOYALTY_TRANSACTIONS,
        "customerManagement/v1/Customer_Loyalty/Loyalty/Transactions");
    resourceMap.put(
        CustomerCampaignAdapterProviderTest.CUSTOMER_CAMPAIGN_RESOURCE,
        "credito/campaign/customer-campaign");
    Info info = new Info();
    info.setResourceMap(resourceMap);
    properties.setInfo(info);
    return properties;
  }

  public static APIConnectTemplate buildApiConnectTemplate() {
    OauthSettings oauthSettings = new OauthSettings();
    oauthSettings.setFile(TestConstantUtils.MOCK_KEYSTORE_PATH);
    oauthSettings.setCredential(TestConstantUtils.MOCK_KC);
    APIConnectTemplate apiConnectTemplate = new APIConnectTemplate(oauthSettings);
    apiConnectTemplate.setClientId(TestConstantUtils.CLIENT_ID);
    return apiConnectTemplate;
  }

  public static APIConnectTemplate buildApiConnectTemplate(int port) {
    String MOCK_SERVER_URL =
        TestConstantUtils.MOCK_SERVER_BASE_URL.replace("PORT", String.valueOf(port));
    APIConnectTemplate template = TestMockUtils.buildApiConnectTemplate();
    template.getOauthSettings().setHost(MOCK_SERVER_URL);
    template.setHost(MOCK_SERVER_URL);
    return template;
  }

  public static ApiConnectProperties buildApiConnectProperties(int port) {
    String MOCK_SERVER_URL =
        TestConstantUtils.MOCK_SERVER_BASE_URL.replace("PORT", String.valueOf(port));
    ApiConnectProperties properties = TestMockUtils.buildApiConnectProperties();
    properties.getInfo().setUrl(MOCK_SERVER_URL);
    return properties;
  }

  public static IntegrationProperties buildIntegrationProperties() {
    IntegrationProperties properties = new IntegrationProperties();
    Map<String, String> resourceMap = new HashMap<>();
    resourceMap.put(UnicefEnrollmentAdapterProviderTest.UNICEF_ADAPTER_CALL_ENABLED, "true");
    properties.setResourceMap(resourceMap);
    return properties;
  }

  public static IntegrationProperties buildIntegrationProperties(int port) {
    String MOCK_SERVER_URL =
        TestConstantUtils.MOCK_SERVER_BASE_URL.replace("PORT", String.valueOf(port));
    IntegrationProperties properties = TestMockUtils.buildIntegrationProperties();
    properties.setBaseUrl(MOCK_SERVER_URL);
    properties.setTimeout(100L);
    return properties;
  }

  public static ResponseEntity<APIConnectRs<ApiConnectGenericResponse>>
      buildApiConnectRsResponseEntity() {
    APIConnectRs<ApiConnectGenericResponse> apiConnectRs = new APIConnectRs<>();
    apiConnectRs.setBody(new ApiConnectGenericResponse());
    return new ResponseEntity<>(apiConnectRs, HttpStatus.OK);
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

  public static BdBGenericRequest buildBdBGenericRequest() {
    BdBGenericRequest request = new BdBGenericRequest();
    request.setCustomer(buildCustomer());
    return request;
  }

  public static ApiConnectProductListInquiryResponse buildApiConnectProductListInquiryResponse() {
    return ApiConnectProductListInquiryResponse.builder()
        .partyAcctRelRec(generatePartyAcctRelRec())
        .build();
  }

  private static List<PartyAcctRelRec> generatePartyAcctRelRec() {
    List<PartyAcctRelRec> list = new ArrayList<>();
    list.add(
        PartyAcctRelRec.builder()
            .partyAcctRelInfo(partyAcctRelInfo())
            .fullName("USUARIO BANCA,VIRTUAL")
            .nickName("VISA  Gold")
            .bankAcctStatus(generateBankAcctStatus())
            .openDt("2019-08-26")
            .build());
    return list;
  }

  private static PartyAcctRelInfo partyAcctRelInfo() {
    return PartyAcctRelInfo.builder()
        .custId(CustId.builder().spName("CC").custPermId("2006699").build())
        .depAcctId(generateDepAcctId())
        .cardAcctId(
            CardAcctId.builder().ccMotoAcct(CCMotoAcct.builder().brand("CB").build()).build())
        .build();
  }

  private static DepAcctId generateDepAcctId() {
    return DepAcctId.builder()
        .acctId("4599187400218149")
        .acctType("CCA")
        .acctSubType("459918TC")
        .acctCur("COP")
        .officeInfo(OfficeInfo.builder().officeId("").build())
        .build();
  }

  private static BankAcctStatus generateBankAcctStatus() {
    return BankAcctStatus.builder().bankAcctStatusCode("A").build();
  }

  public static AccountHelper generateAccountHelper() {
    AccountHelper accountHelper = new AccountHelper("DDA", "010CC", "BC", "ACCOUNT");
    accountHelper.setAthId("FT");
    accountHelper.setFranchise("Visa");
    return accountHelper;
  }

  public static LoyaltyProgramEntity generateLoyaltyProgramEntity(int ttl) {
    return LoyaltyProgramEntity.builder()
        .key("CC1234567")
        .loyaltyPogramResponse(generateLoyaltyPogramResponse())
        .ttl(LocalDateTime.now().minusHours(ttl))
        .build();
  }

  public static LoyaltyProgramResponse generateLoyaltyPogramResponse() {
    return LoyaltyProgramResponse.builder()
        .partners(getLoyaltyProgramPartners())
        .balance("0")
        .build();
  }

  private static List<LoyaltyProgramPartner> getLoyaltyProgramPartners() {
    LoyaltyProgramPartner programPartners =
        LoyaltyProgramPartner.builder()
            .status("Activo")
            .balance("0")
            .description("Estado Miembro Socio")
            .memberSince("2017-09-20T00:00:00")
            .rank("Platino")
            .build();

    return Stream.of(programPartners).collect(Collectors.toList());
  }

  public static TransactionsInquiryRequest getTransactionsInquiryRequest() {
    TransactionsInquiryRequest request = new TransactionsInquiryRequest();
    request.setStartDate("2020-01-01");
    request.setEndDate("2020-07-31");
    request.setCustomer(buildCustomer());
    return request;
  }

  public static LoyaltyTransactionsInquiryApiConnectResponse
      getLoyaltyTransactionsInquiryApiConnectResponse() {
    return LoyaltyTransactionsInquiryApiConnectResponse.builder()
        .transHistoryMember(getTransHistoryMember())
        .build();
  }

  private static TransHistoryMember getTransHistoryMember() {
    return TransHistoryMember.builder()
        .govIssueIdent(getGovIssueIdentList())
        .ListTransactionHistory(getTransactionHistoryList())
        .pointOfService("")
        .build();
  }

  private static List<GovIssueIdent> getGovIssueIdentList() {
    return Arrays.asList(GovIssueIdent.builder().govIssueIdentType("").identSerialNum("").build());
  }

  private static List<TransactionHistory> getTransactionHistoryList() {
    return Arrays.asList(
        TransactionHistory.builder()
            .createdDt("2020-07-01")
            .state("E")
            .trnType("Test")
            .depAcctIdProgLoy(new ArrayList<DepAcctIdProgLoy>())
            .partnerInfo(new ArrayList<PartnerInfo>())
            .pointsInfo(new ArrayList<PointsInfo>())
            .compositeCurAmt(Collections.singletonList(generateCompositeCurAmt()))
            .build());
  }

  private static CompositeCurAmt generateCompositeCurAmt() {
    return CompositeCurAmt.builder()
        .compositeCurAmtType("TEST")
        .curAmt(Collections.singletonList(CurAmt.builder().amt("123").build()))
        .build();
  }

  public static List<LoyaltyTransaction> getLoyaltyTransaction() {
    return Arrays.asList(
        LoyaltyTransaction.builder()
            .date("")
            .description("")
            .partner("")
            .status("")
            .totalPoints("")
            .transactionType("")
            .build());
  }

  public static Map<String, String> getTransactionsInquiryRequestMap() {
    Map<String, String> transactionsInquiryMap = new HashMap<>();
    transactionsInquiryMap.put("StartDt", "2020-01-01");
    transactionsInquiryMap.put("EndDt", "2020-07-31");
    return transactionsInquiryMap;
  }

  public static UnicefEnrollmentRequest getUnicefEnrollmentRequest() {
    UnicefEnrollmentRequest request = new UnicefEnrollmentRequest();
    request.setAccountOfficeId("0023");
    request.setCustomerAccountNumber("1234567890");
    request.setCustomerAccountSubtype("BBOG");
    request.setCustomerAddressDistrict("1116");
    request.setCustomerAddressNumber("CRA1#1-1");
    request.setCustomerPhoneNumber("3113111111");
    request.setCustomerZipCode("111611");
    request.setCustomer(buildCustomer());
    return request;
  }

  public static void initRetrofitOnTemplate(RetrofitTemplate retrofitTemplate) {
    try {
      Method method = retrofitTemplate.getClass().getDeclaredMethod("initRetrofit");
      method.setAccessible(true);
      method.invoke(retrofitTemplate);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static AdapterGenericResponse getAdapterGenericResponse() {
    AdapterGenericResponse response = new AdapterGenericResponse();
    response.setStatusCode("200");
    return response;
  }

  public static BdBGenericResponse getGenericResponse() {
    return BdBGenericResponse.builder().approvalId("200").build();
  }

  public static UnicefEnrollmentAdapterRq getUnicefEnrollmentAdapterRq() {
    return UnicefEnrollmentAdapterRq.builder()
        .cardAcctId(null)
        .contactInfo(null)
        .otherIdentDocs(null)
        .build();
  }

  public static Account getAccount(String bankType) {
    return Account.builder().productBankType(bankType).build();
  }

  public static String getLoyaltyProgramJson() {
    return "{\"balance\":\"0\",\"partners\":[{\"balance\":\"0\",\"status\":\"Activo\",\"memberSince\":\"2017-09-20T00:00:00\",\"rank\":\"Platino\",\"description\":\"Estado Miembro Socio\"}]}";
  }

  public static CustomerCampaignAdapterResponse buildCustomerCampaignAdapterResponse() {
    CustomerCampaignAdapterResponse response = new CustomerCampaignAdapterResponse();
    response.setCampaignId("7860");
    response.setProduct("Cupo_Aprob_TC");
    response.setAmount("20000000");
    response.setBrand("1234");
    response.setBin("123456");
    return response;
  }

  public static CustomerCampaignResponse buildCustomerCampaignResponse() {
    return CustomerCampaignResponse.builder()
        .campaignId("7860")
        .product("20000000")
        .amount("Cupo_Aprob_TC")
        .brand("1234")
        .bin("123456")
        .build();
  }

  public static IntegrationProperties buildCampaignIntegrationProperties(int port) {
    String MOCK_SERVER_URL =
        TestConstantUtils.MOCK_SERVER_BASE_URL.replace("PORT", String.valueOf(port));
    IntegrationProperties properties = TestMockUtils.buildCampaignIntegrationProperties();
    properties.setBaseUrl(MOCK_SERVER_URL);
    properties.setTimeout(100L);
    return properties;
  }

  public static IntegrationProperties buildCampaignIntegrationProperties() {
    IntegrationProperties properties = new IntegrationProperties();
    Map<String, String> resourceMap = new HashMap<>();
    resourceMap.put(CustomerCampaignAdapterProviderTest.CUSTOMER_CAMPAIGN_RESOURCE, "true");
    properties.setResourceMap(resourceMap);
    return properties;
  }
}
