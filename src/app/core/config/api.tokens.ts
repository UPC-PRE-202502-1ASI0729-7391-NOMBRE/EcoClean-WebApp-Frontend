import { InjectionToken } from '@angular/core';

const DEFAULT_API_BASE_URL = 'https://ecoclean-platform.onrender.com';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => DEFAULT_API_BASE_URL
});
