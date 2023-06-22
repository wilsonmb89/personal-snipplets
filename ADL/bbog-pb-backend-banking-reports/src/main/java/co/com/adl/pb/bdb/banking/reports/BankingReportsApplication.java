/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.banking.reports;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;

@Configuration
@SpringBootApplication(
    scanBasePackages = {"co.com.adl.pb.bdb.common", "co.com.adl.pb.bdb.banking.reports"})
public class BankingReportsApplication {

  public static void main(String[] args) {
    SpringApplication.run(BankingReportsApplication.class, args);
  }
}
