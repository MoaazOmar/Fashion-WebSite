declare module 'isotope-layout' {
    export default class Isotope {
      appended(arg0: HTMLElement) {
        throw new Error('Method not implemented.');
      }
      constructor(element: Element | string, options?: any);
      layout(): void;
      // Add other methods you might need here
      destroy(): void;
    }
  }