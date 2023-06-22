/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.controller;

import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.analytics.annotation.Analytics;
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
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("products")
@AllArgsConstructor
public class ProductsController {

  private final OrchestrationService<BdBGenericRequest, ProductListInquiryResponse>
      productListOrchestrationService;
  private final OrchestrationService<ProductCardRq, ProductListInquiryResponse>
      productCardsOrchestrationService;
  private final OrchestrationService<BdBGenericRequest, LoyaltyProgramResponse>
      loyaltyProgramOrchestrationService;
  private final OrchestrationService<UnicefEnrollmentRequest, BdBGenericResponse>
      unicefEnrollmentOrchestrationService;
  private final OrchestrationService<TransactionsInquiryRequest, TransactionsInquiryResponse>
      loyaltyTransactionsInquiryOrchestrationService;
  private final OrchestrationService<BdBGenericRequest, CustomerCampaignResponse>
      customerCampaignResponseOrchestrationService;

  @Analytics
  @PostMapping("get-all")
  public ResponseEntity<ProductListInquiryResponse> getAllProducts(
      @RequestBody @Valid BdBGenericRequest request) throws BDBApplicationException {
    return ResponseEntity.ok(productListOrchestrationService.orchestrate(request));
  }

  @PostMapping("cards")
  public ResponseEntity<ProductListInquiryResponse> getCards(
      @RequestBody @Valid ProductCardRq request) throws BDBApplicationException {
    return ResponseEntity.ok(productCardsOrchestrationService.orchestrate(request));
  }

  @Analytics
  @PostMapping("loyalty-program")
  public ResponseEntity<LoyaltyProgramResponse> lookForLoyaltyProgram(
      @RequestBody @Valid BdBGenericRequest request) throws BDBApplicationException {
    return new ResponseEntity<>(
        loyaltyProgramOrchestrationService.orchestrate(request), HttpStatus.OK);
  }

  @PostMapping("loyalty-transactions")
  public ResponseEntity<TransactionsInquiryResponse> lookForTransactionsLoyaltyProgram(
      @RequestBody @Valid TransactionsInquiryRequest request) throws BDBApplicationException {
    return new ResponseEntity<>(
        loyaltyTransactionsInquiryOrchestrationService.orchestrate(request), HttpStatus.OK);
  }

  @Analytics
  @PostMapping("enroll-unicef")
  public ResponseEntity<BdBGenericResponse> enrollUnicef(
      @RequestBody @Valid UnicefEnrollmentRequest request) throws BDBApplicationException {
    return ResponseEntity.ok(unicefEnrollmentOrchestrationService.orchestrate(request));
  }

  @Analytics
  @PostMapping("campaign")
  public ResponseEntity<CustomerCampaignResponse> getCustomerCampaign(
      @RequestBody @Valid BdBGenericRequest request) throws BDBApplicationException {
    return ResponseEntity.ok(customerCampaignResponseOrchestrationService.orchestrate(request));
  }
}
