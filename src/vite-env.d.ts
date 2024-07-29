/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_CIDI: string 
  readonly VITE_URL_WEBAPISHARED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
