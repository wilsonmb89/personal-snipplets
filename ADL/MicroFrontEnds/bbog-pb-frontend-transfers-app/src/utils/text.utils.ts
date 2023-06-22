// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const diacriticInputText = (event: any): void => {
  event.currentTarget.value = event.currentTarget.value
    .replace(/[\u0300-\u036f´`¨]/g, '')
    .replace(/[^A-Za-z0-9 ]+/g, '');
};

export const removeLeadingZeros = (value: string): string => {
  return `${value}`.replace(/\b0+/g, '');
};

const placehodersRegex = /\{[\dA-Za-z\-_]+\}/;

/**
 * Replace placeholders in text with literals values
 *
 * Example:
 *
 * template: "Text with {1} and {2} literals"
 * tags: ["one", "two"]
 *
 * returns "Text with one and two literals"
 *
 * @param template String with placeholders.
 *  The plahcehoders must delimited by a dollar sign and curly braces.
 *  Only alphabetic, number and special '-' '_' characters should be used between de curly braces.
 *
 *  Correct placehoders examples: {0} {one} {one-0} {one_0}
 *
 * @param tags String array with values to replace the placeholders on text.
 *  The literals replace placeholder in ascendent order.
 *  There is not relationship between placeholders name and literals values.
 *
 * @returns taged template
 */
export const interpolateTemplate = (template: string, tags: Array<string | number>): string => {
  if (!tags.length || !placehodersRegex.test(template)) return template;

  const tagsCopy = [...tags];
  return interpolateTemplate(template.replace(placehodersRegex, tagsCopy.shift()?.toString()), tagsCopy);
};
