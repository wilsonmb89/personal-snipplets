/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.unicef;

import co.com.adl.pb.bdb.common.abstraction.Mapper;
import co.com.adl.pb.bdb.common.entity.AdapterGenericResponse;
import co.com.adl.pb.bdb.common.entity.BdBGenericResponse;
import co.com.adl.pb.bdb.common.exception.BDBApplicationException;
import org.springframework.stereotype.Component;

@Component
public class AdapterGenericResponseModelMapper
    implements Mapper<AdapterGenericResponse, BdBGenericResponse> {

  private static final String OPERATION_SUCCESS = "Operation Success";

  @Override
  public BdBGenericResponse map(AdapterGenericResponse target) throws BDBApplicationException {
    return BdBGenericResponse.builder().message(OPERATION_SUCCESS).build();
  }
}
