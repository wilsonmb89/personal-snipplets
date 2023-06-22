export function getBdbRadioUnsupportedTypeError(type: string): Error {
  return Error(`Input type "${type}" isn't supported by bvRadio. bvRadio only support Input type radio`);
}

