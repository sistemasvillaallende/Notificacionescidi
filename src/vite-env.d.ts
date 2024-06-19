/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_URL_CIDI: string 
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
