import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.tokens';
import { ProfileResponse, UpdateProfileRequest } from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  constructor(private readonly http: HttpClient, @Inject(API_BASE_URL) private readonly apiBaseUrl: string) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiBaseUrl}/api/profile/me`);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiBaseUrl}/api/profile/me`, payload);
  }
}
