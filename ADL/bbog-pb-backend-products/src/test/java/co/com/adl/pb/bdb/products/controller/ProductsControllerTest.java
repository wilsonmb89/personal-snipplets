/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.controller;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BdBGenericResponse;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.products.model.dto.campaign.personal.banking.CustomerCampaignResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramResponse;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryRequest;
import co.com.adl.pb.bdb.products.model.dto.loyalty.transactions.inquiry.personal.banking.TransactionsInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.unicef.personal.banking.UnicefEnrollmentRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RunWith(MockitoJUnitRunner.class)
public class ProductsControllerTest {

  @Mock
  private OrchestrationService<BdBGenericRequest, ProductListInquiryResponse>
      productListInquiryOrchestrationService;

  @Mock
  OrchestrationService<ProductCardRq, ProductListInquiryResponse> productCardsOrchestrationService;

  @Mock
  OrchestrationService<BdBGenericRequest, LoyaltyProgramResponse>
      loyaltyProgramOrchestrationService;

  @Mock
  private OrchestrationService<UnicefEnrollmentRequest, BdBGenericResponse>
      unicefEnrollmentOrchestrationService;

  @Mock
  private OrchestrationService<TransactionsInquiryRequest, TransactionsInquiryResponse>
      loyaltyTransactionsInquiryOrchestrationService;

  @Mock
  private OrchestrationService<BdBGenericRequest, CustomerCampaignResponse>
      customerCampaignResponseOrchestrationService;

  private ProductsController subject;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    subject =
        new ProductsController(
            productListInquiryOrchestrationService,
            productCardsOrchestrationService,
            loyaltyProgramOrchestrationService,
            unicefEnrollmentOrchestrationService,
            loyaltyTransactionsInquiryOrchestrationService,
            customerCampaignResponseOrchestrationService);
  }

  @Test
  public void shouldCallProductListAndWithSuccess() throws BDBApplicationException {
    when(productListInquiryOrchestrationService.orchestrate(any(BdBGenericRequest.class)))
        .thenReturn(ProductListInquiryResponse.builder().build());
    ResponseEntity<ProductListInquiryResponse> response =
        subject.getAllProducts(new BdBGenericRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void getCards() throws BDBApplicationException {
    when(productCardsOrchestrationService.orchestrate(any(ProductCardRq.class)))
        .thenReturn(ProductListInquiryResponse.builder().build());
    ResponseEntity response = subject.getCards(new ProductCardRq());
    assertEquals(response.getStatusCode(), HttpStatus.OK);
  }

  @Test
  public void shouldCallLoyaltyProgramAndWithSuccess() throws BDBApplicationException {
    when(loyaltyProgramOrchestrationService.orchestrate(any(BdBGenericRequest.class)))
        .thenReturn(LoyaltyProgramResponse.builder().build());
    ResponseEntity<LoyaltyProgramResponse> response =
        subject.lookForLoyaltyProgram(new BdBGenericRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void shouldCallLoyaltyTransactionsAndWithSuccess() throws BDBApplicationException {
    when(loyaltyTransactionsInquiryOrchestrationService.orchestrate(
            any(TransactionsInquiryRequest.class)))
        .thenReturn(TransactionsInquiryResponse.builder().build());
    ResponseEntity<TransactionsInquiryResponse> response =
        subject.lookForTransactionsLoyaltyProgram(new TransactionsInquiryRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void shouldCallEnrollUnicefAndWithSuccess() throws BDBApplicationException {
    when(unicefEnrollmentOrchestrationService.orchestrate(any(UnicefEnrollmentRequest.class)))
        .thenReturn(BdBGenericResponse.builder().build());
    ResponseEntity<BdBGenericResponse> response =
        subject.enrollUnicef(new UnicefEnrollmentRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void shouldCallGetCustomerCampaignSuccess() throws BDBApplicationException {
    when(customerCampaignResponseOrchestrationService.orchestrate(any(BdBGenericRequest.class)))
        .thenReturn(CustomerCampaignResponse.builder().build());
    ResponseEntity<CustomerCampaignResponse> response =
        subject.getCustomerCampaign(new BdBGenericRequest());
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }
}
