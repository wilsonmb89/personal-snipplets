package co.com.adl.pb.bdb.products;
/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
    scanBasePackages = {"co.com.adl.pb.bdb.common", "co.com.adl.pb.bdb.products"})
public class ProductsApplication {

  public static void main(String[] args) {
    SpringApplication.run(ProductsApplication.class, args);
  }
}
