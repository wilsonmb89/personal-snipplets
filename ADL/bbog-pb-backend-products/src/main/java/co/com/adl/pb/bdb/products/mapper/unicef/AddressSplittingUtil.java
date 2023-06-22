/**
 * Grupo Aval Acciones y Valores S.A. CONFIDENTIAL
 *
 * <p>Copyright (c) 2018 . All Rights Reserved.
 *
 * <p>NOTICE: This file is subject to the terms and conditions defined in file 'LICENSE', which is
 * part of this source code package.
 */
package co.com.adl.pb.bdb.products.mapper.unicef;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.function.BiPredicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AddressSplittingUtil {

  public static final String ADDRESS_DELIMITER = ";";
  private static final String SPACE = " ";
  private static final int SECOND_LINE_MAX_LEN = 40;
  public static BiPredicate<StringBuilder, String> CAN_APPEND =
      (a, b) -> a.length() + b.length() < 60;

  public enum AddressLine {
    LINE_1,
    LINE_2
  }

  public static Map<AddressLine, String> getAddressMap(String fullAddress) {
    Queue<String> splittedFullAddress =
        Stream.of(fullAddress.split(ADDRESS_DELIMITER))
            .filter(StringUtils::isNotBlank)
            .collect(Collectors.toCollection(LinkedList::new));
    StringBuilder addressFirstLineBuilder = new StringBuilder();
    while (!splittedFullAddress.isEmpty()
        && CAN_APPEND.test(addressFirstLineBuilder, splittedFullAddress.peek())) {
      addressFirstLineBuilder.append(splittedFullAddress.poll());
      addressFirstLineBuilder.append(SPACE);
    }
    Map<AddressLine, String> addressMap = new HashMap<>();
    addressMap.put(AddressLine.LINE_1, addressFirstLineBuilder.toString().trim());
    if (!splittedFullAddress.isEmpty()) {
      addressMap.put(
          AddressLine.LINE_2,
          StringUtils.left(String.join(SPACE, splittedFullAddress), SECOND_LINE_MAX_LEN).trim());
    }
    return addressMap;
  }
}
