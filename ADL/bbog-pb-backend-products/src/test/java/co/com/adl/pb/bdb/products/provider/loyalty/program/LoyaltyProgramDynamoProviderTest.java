/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.provider.loyalty.program;

import static org.mockito.ArgumentMatchers.any;

import co.com.adl.pb.bdb.common.entity.BusinessContext;
import co.com.adl.pb.bdb.common.entity.Customer;
import co.com.adl.pb.bdb.common.enumeration.ContextParameter;
import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import co.com.adl.pb.bdb.products.repository.LoyaltyProgramRepository;
import co.com.adl.pb.bdb.products.utils.DynamoOperation;
import co.com.adl.pb.bdb.products.utils.TestMockUtils;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class LoyaltyProgramDynamoProviderTest {

  @Mock private LoyaltyProgramRepository loyaltyProgramRepository;

  @Test
  public void shouldCallApiConnectProvider() throws Exception {

    LoyaltyProgramEntity entity = new LoyaltyProgramEntity();

    Mockito.when(loyaltyProgramRepository.findById(any(String.class)))
        .thenReturn(java.util.Optional.of(entity));

    Mockito.when(loyaltyProgramRepository.save(any(LoyaltyProgramEntity.class))).thenReturn(entity);

    LoyaltyProgramDynamoProvider subject =
        new LoyaltyProgramDynamoProvider(loyaltyProgramRepository);

    LoyaltyProgramEntity responseFind = subject.provide(buildFindBusinessContext());
    LoyaltyProgramEntity responsePush = subject.provide(buildPushBusinessContext());

    Assertions.assertThat(responseFind).isNotNull();
    Assertions.assertThat(responsePush).isNotNull();
  }

  private BusinessContext buildFindBusinessContext() {
    Customer customer = TestMockUtils.buildCustomer();
    return BusinessContext.getNewInstance()
        .putParameter(
            ContextParameter.REQUEST_ELEMENT,
            customer.getIdentificationType().concat(customer.getIdentificationNumber()))
        .putParameter(ContextParameter.ROUTING_ELEMENT, DynamoOperation.FIND);
  }

  private BusinessContext buildPushBusinessContext() {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.REQUEST_ELEMENT, new LoyaltyProgramEntity())
        .putParameter(ContextParameter.ROUTING_ELEMENT, DynamoOperation.PUSH);
  }

  private BusinessContext buildThrowBusinessContext() {
    return BusinessContext.getNewInstance()
        .putParameter(ContextParameter.REQUEST_ELEMENT, new LoyaltyProgramEntity())
        .putParameter(ContextParameter.ROUTING_ELEMENT, null);
  }
}
