import { InjectionToken } from '@angular/core';

const DEFAULT_API_BASE_URL = 'http://localhost:8080';

type GlobalWithApiConfig = typeof globalThis & { ECOSMART_API_BASE_URL?: string };

function resolveApiBaseUrl(): string {
  const globalWithConfig = globalThis as GlobalWithApiConfig;
  if (globalWithConfig.ECOSMART_API_BASE_URL) {
    return globalWithConfig.ECOSMART_API_BASE_URL;
  }

  if (typeof window === 'undefined') {
    return DEFAULT_API_BASE_URL;
  }

  const { protocol, hostname } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return DEFAULT_API_BASE_URL;
  }

  return `${protocol}//${hostname}:8080`;
}

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: resolveApiBaseUrl
});
