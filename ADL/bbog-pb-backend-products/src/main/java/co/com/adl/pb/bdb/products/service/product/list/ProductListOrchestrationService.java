/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.service.product.list;

import co.com.adl.pb.bdb.common.abstraction.ApiConnectProvider;
import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.abstraction.OrchestrationService;
import co.com.adl.pb.bdb.common.elastic.reporting.aspect.ElasticTraced;
import co.com.adl.pb.bdb.common.entity.BdBGenericRequest;
import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.helper.HeaderMapHelper;
import co.com.adl.pb.bdb.products.model.dto.product.list.api.connect.ApiConnectProductListInquiryResponse;
import co.com.adl.pb.bdb.products.model.dto.product.list.personal.banking.ProductListInquiryResponse;
import org.springframework.stereotype.Service;

@Service
public class ProductListOrchestrationService
    implements OrchestrationService<BdBGenericRequest, ProductListInquiryResponse> {

  private static final String PRODUCT_LIST_RESOURCE = "product-list";

  private final HeaderMapHelper headerMapHelper;
  private final ApiConnectProvider<ApiConnectProductListInquiryResponse>
      productListInquiryResponseApiConnectProvider;
  private final Mapper<ApiConnectProductListInquiryResponse, ProductListInquiryResponse>
      productListResponseModelMapper;

  public ProductListOrchestrationService(
      HeaderMapHelper headerMapHelper,
      ApiConnectProvider<ApiConnectProductListInquiryResponse>
          productListInquiryResponseApiConnectProvider,
      Mapper<ApiConnectProductListInquiryResponse, ProductListInquiryResponse>
          productListResponseModelMapper) {
    this.headerMapHelper = headerMapHelper;
    this.productListInquiryResponseApiConnectProvider =
        productListInquiryResponseApiConnectProvider;
    this.productListResponseModelMapper = productListResponseModelMapper;
  }

  @Override
  @ElasticTraced
  public ProductListInquiryResponse orchestrate(BdBGenericRequest serviceRequest)
      throws BDBApplicationException {
    return productListResponseModelMapper.map(
        productListInquiryResponseApiConnectProvider.provide(
            BusinessContext.getNewInstance()
                .putParameter(
                    ContextParameter.HEADER_MAP,
                    headerMapHelper.buildHeaderMapFromCustomer(serviceRequest.getCustomer()))
                .putParameter(ContextParameter.RESOURCE, PRODUCT_LIST_RESOURCE)));
  }
}
