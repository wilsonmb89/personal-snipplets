declare global {
  export namespace utag {
    interface TealiumEventParams {
      tealium_event: string;
      [key: string]: string;
    }
    function link(params: TealiumEventParams): void;
    function view(params: TealiumEventParams): void;
  }
}
export {};
