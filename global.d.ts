export {};

declare global {
  interface Window {
    electronMenu?: {
      navigateTo: (callback: (route: string) => void) => void;
    };
  }
}
