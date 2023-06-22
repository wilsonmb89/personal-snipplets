/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.program;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import co.com.adl.pb.bdb.common.exception.BDBBusinessException;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import co.com.adl.pb.bdb.products.repository.LoyaltyProgramRepository;
import co.com.adl.pb.bdb.products.utils.DynamoOperation;
import org.springframework.stereotype.Component;

@Component
public class LoyaltyProgramDynamoProvider implements DynamoProvider<LoyaltyProgramEntity> {

  private final LoyaltyProgramRepository loyaltyProgramRepository;

  public LoyaltyProgramDynamoProvider(LoyaltyProgramRepository loyaltyProgramRepository) {
    this.loyaltyProgramRepository = loyaltyProgramRepository;
  }

  @Override
  public LoyaltyProgramEntity provide(BusinessContext context) throws BDBApplicationException {
    DynamoOperation dynamoOperation = context.getParameter(ContextParameter.ROUTING_ELEMENT);
    switch (dynamoOperation) {
      case FIND:
        return loyaltyProgramRepository
            .findById(context.getParameter(ContextParameter.REQUEST_ELEMENT))
            .orElse(null);
      case PUSH:
        return loyaltyProgramRepository.save(
            context.getParameter(ContextParameter.REQUEST_ELEMENT));
      default:
        throw new BDBBusinessException("Dynamo operation is not supported.");
    }
  }
}
