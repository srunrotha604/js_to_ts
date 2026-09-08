interface BootstrapModalInstance {
  show: () => void;
  hide: () => void;
}

interface BootstrapModalStatic {
  new (element: Element | null): BootstrapModalInstance;
  getInstance: (element: Element | null) => BootstrapModalInstance | null;
}

declare const bootstrap: {
  Modal: BootstrapModalStatic;
};
