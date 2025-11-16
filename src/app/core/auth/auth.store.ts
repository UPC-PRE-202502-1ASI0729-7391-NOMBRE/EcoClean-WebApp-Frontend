import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterUserRequest,
  UserResponse
} from '../../features/iam/models/iam.models';
import { IamApiService } from '../../features/iam/data-access/iam-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly tokenStorageKey = 'ecosmart.auth.token';
  private readonly userStorageKey = 'ecosmart.auth.user';
  private readonly expiresStorageKey = 'ecosmart.auth.expires';
  private readonly _token = signal<string | null>(this.readTokenFromStorage());
  private readonly _user = signal<UserResponse | null>(this.readUserFromStorage());
  private readonly _expiresAt = signal<string | null>(this.readExpiresFromStorage());

  readonly token = computed(() => this._token());
  readonly user = computed(() => this._user());
  readonly expiresAt = computed(() => this._expiresAt());
  readonly isAuthenticated = computed(() => Boolean(this._token()) && Boolean(this._user()));

  constructor(private readonly iamApi: IamApiService) {
    if (this._token()) {
      this.refreshProfile().catch(() => this.clearSession());
    }
  }

  async login(payload: LoginRequest): Promise<void> {
    const response = await firstValueFrom(this.iamApi.login(payload));
    this.persistResponse(response);
  }

  async register(payload: RegisterUserRequest): Promise<void> {
    const response = await firstValueFrom(this.iamApi.register(payload));
    this.persistResponse(response);
  }

  async refreshProfile(): Promise<void> {
    if (!this._token()) {
      return;
    }
    const profile = await firstValueFrom(this.iamApi.me());
    this._user.set(profile);
  }

  signOut(): void {
    this.clearSession();
  }

  private persistResponse(response: AuthResponse): void {
    this._token.set(response.token);
    this._expiresAt.set(response.expiresAt);
    this._user.set(response.user);
    this.saveToken(response.token);
    this.saveUser(response.user);
    this.saveExpires(response.expiresAt);
  }

  private clearSession(): void {
    this._token.set(null);
    this._user.set(null);
    this._expiresAt.set(null);
    this.removeToken();
    this.removeUser();
    this.removeExpires();
  }

  private readTokenFromStorage(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(this.tokenStorageKey);
    } catch {
      return null;
    }
  }

  private saveToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(this.tokenStorageKey, token);
    } catch {
      /* ignore storage failures for local dev */
    }
  }

  private readUserFromStorage(): UserResponse | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const stored = window.localStorage.getItem(this.userStorageKey);
      return stored ? (JSON.parse(stored) as UserResponse) : null;
    } catch {
      return null;
    }
  }

  private saveUser(user: UserResponse): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  }

  private removeUser(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(this.userStorageKey);
    } catch {
      /* ignore */
    }
  }

  private readExpiresFromStorage(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(this.expiresStorageKey);
    } catch {
      return null;
    }
  }

  private saveExpires(value: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(this.expiresStorageKey, value);
    } catch {
      /* ignore */
    }
  }

  private removeExpires(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(this.expiresStorageKey);
    } catch {
      /* ignore */
    }
  }

  private removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(this.tokenStorageKey);
    } catch {
      /* ignore storage failures for local dev */
    }
  }
}
