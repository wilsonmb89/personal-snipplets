/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;

public class TestSSLUtils {
  public static SSLSocketFactory buildSslSocketFactory() throws Exception {
    try {
      FileInputStream stream = new FileInputStream(TestConstantUtils.MOCK_KEYSTORE_PATH);
      char[] serverKeyStorePassword = TestConstantUtils.MOCK_KC.toCharArray();
      KeyStore serverKeyStore = KeyStore.getInstance(KeyStore.getDefaultType());
      serverKeyStore.load(stream, serverKeyStorePassword);

      String kmfAlgorithm = KeyManagerFactory.getDefaultAlgorithm();
      KeyManagerFactory kmf = KeyManagerFactory.getInstance(kmfAlgorithm);
      kmf.init(serverKeyStore, serverKeyStorePassword);

      TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(kmfAlgorithm);
      trustManagerFactory.init(serverKeyStore);

      SSLContext sslContext = SSLContext.getInstance("SSL");
      sslContext.init(kmf.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);
      SSLSocketFactory sf = sslContext.getSocketFactory();
      return sf;
    } catch (NoSuchAlgorithmException
        | KeyManagementException
        | CertificateException
        | KeyStoreException
        | UnrecoverableKeyException
        | IOException e) {
      throw new Exception(e);
    }
  }
}
