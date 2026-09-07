interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
