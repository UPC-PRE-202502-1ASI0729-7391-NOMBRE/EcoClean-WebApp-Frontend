import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.tokens';
import { RoleName } from '../../../features/iam/models/iam.models';
export type RoleApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminApplication {
  key: string;
  name: string;
  description: string;
  targetRoute: string;
  status: 'ready' | 'in-progress' | 'pending';
  roles: RoleName[];
}

export interface Municipality {
  id: string;
  name: string;
  department: string;
  province: string;
  district: string;
  description?: string;
  active: boolean;
}

export interface CreateMunicipalityPayload {
  name: string;
  department: string;
  province: string;
  district: string;
  description?: string;
}

export interface MunicipalityPage {
  items: Municipality[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface MunicipalityQuery {
  page?: number;
  size?: number;
  department?: string;
  province?: string;
  status?: 'active' | 'inactive';
}

export interface RolePolicy {
  role: RoleName;
  description: string;
  capabilities: string[];
  assignable: boolean;
}

export interface RoleAssignment {
  id: number;
  name: string;
  email: string;
  role: RoleName;
  availableRoles: RoleName[];
}

export interface RoleApplication {
  id: string;
  userId: string;
  role: RoleName;
  municipalityId: string | null;
  status: RoleApplicationStatus;
  phoneNumber?: string;
  drivingLicense?: string;
  company?: string;
  workDistrict?: string;
  workCity?: string;
  positionTitle?: string;
  municipalEntity?: string;
  entityRuc?: string;
  municipalWorkDistrict?: string;
  rejectionReason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface CreateRoleApplicationPayload {
  role: RoleName;
  municipalityId: string;
  phoneNumber: string;
  drivingLicense?: string;
  company?: string;
  workDistrict?: string;
  workCity?: string;
  positionTitle?: string;
  municipalEntity?: string;
  entityRuc?: string;
  municipalWorkDistrict?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(private readonly http: HttpClient, @Inject(API_BASE_URL) private readonly apiBaseUrl: string) {}

  getApplications(): Observable<AdminApplication[]> {
    return this.http.get<AdminApplication[]>(`${this.apiBaseUrl}/api/admin/applications`);
  }

  getMunicipalities(query?: MunicipalityQuery): Observable<MunicipalityPage> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<MunicipalityPage>(`${this.apiBaseUrl}/api/admin/municipalities`, { params });
  }

  createMunicipality(payload: CreateMunicipalityPayload): Observable<Municipality> {
    return this.http.post<Municipality>(`${this.apiBaseUrl}/api/admin/municipalities`, payload);
  }

  getRolePolicies(): Observable<RolePolicy[]> {
    return this.http.get<RolePolicy[]>(`${this.apiBaseUrl}/api/admin/roles/policies`);
  }

  getRoleAssignments(): Observable<RoleAssignment[]> {
    return this.http.get<RoleAssignment[]>(`${this.apiBaseUrl}/api/admin/users`);
  }

  updateUserRole(userId: number, role: RoleName): Observable<RoleAssignment> {
    return this.http.put<RoleAssignment>(`${this.apiBaseUrl}/api/admin/users/${userId}/role`, { role });
  }

  getRoleApplications(status?: RoleApplicationStatus): Observable<RoleApplication[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<RoleApplication[]>(`${this.apiBaseUrl}/api/admin/role-applications`, { params });
  }

  approveRoleApplication(applicationId: string): Observable<RoleApplication> {
    return this.http.post<RoleApplication>(
      `${this.apiBaseUrl}/api/admin/role-applications/${applicationId}/approve`,
      {}
    );
  }

  rejectRoleApplication(applicationId: string, reason: string): Observable<RoleApplication> {
    return this.http.post<RoleApplication>(
      `${this.apiBaseUrl}/api/admin/role-applications/${applicationId}/reject`,
      { reason }
    );
  }

  createRoleApplication(payload: CreateRoleApplicationPayload): Observable<RoleApplication> {
    return this.http.post<RoleApplication>(`${this.apiBaseUrl}/api/admin/role-applications`, payload);
  }

  getActiveMunicipalities(): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(`${this.apiBaseUrl}/api/municipalities`);
  }
}
