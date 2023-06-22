/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.repository;

import co.com.adl.pb.bdb.products.model.dto.loyalty.program.personal.banking.LoyaltyProgramEntity;
import org.springframework.data.repository.CrudRepository;

public interface LoyaltyProgramRepository extends CrudRepository<LoyaltyProgramEntity, String> {}
