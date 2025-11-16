import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.tokens';
import {
  AuthResponse,
  LoginRequest,
  RegisterUserRequest,
  UserResponse
} from '../models/iam.models';

@Injectable({
  providedIn: 'root'
})
export class IamApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/api/iam/auth/login`, payload);
  }

  register(payload: RegisterUserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/api/iam/auth/register`, payload);
  }

  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiBaseUrl}/api/iam/auth/me`);
  }
}
