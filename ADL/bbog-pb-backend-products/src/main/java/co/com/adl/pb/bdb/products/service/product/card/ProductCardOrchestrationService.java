/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.product.card;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardRs;
import co.com.adl.pb.bdb.products.model.dto.product.card.api.connect.ApiConnectProductCardsRq;
import co.com.adl.pb.bdb.products.model.dto.product.card.personal.banking.ProductCardRq;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductCardOrchestrationService
    implements OrchestrationService<ProductCardRq, ProductListInquiryResponse> {

  private static final String PRODUCT_CARDS_RESOURCE = "product-cards";

  private final HeaderMapHelper headerMapHelper;
  private final Mapper<ProductCardRq, ApiConnectProductCardsRq> productCardsRequestModelMapper;
  private final Mapper<ApiConnectProductCardRs, ProductListInquiryResponse>
      productCardsRsModelMapper;
  private final ApiConnectProvider<ApiConnectProductCardRs> productCardsRsApiConnectProvider;

  @Override
  @ElasticTraced
  public ProductListInquiryResponse orchestrate(ProductCardRq input)
      throws BDBApplicationException {
    ApiConnectProductCardRs response =
        productCardsRsApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(input.getCustomer()))
                .putParameter(ContextParameter.RESOURCE, PRODUCT_CARDS_RESOURCE)
                .putParameter(
                    ContextParameter.REQUEST_ELEMENT, productCardsRequestModelMapper.map(input)));
    response.setProductCardRq(input);
    return productCardsRsModelMapper.map(response);
  }
}
