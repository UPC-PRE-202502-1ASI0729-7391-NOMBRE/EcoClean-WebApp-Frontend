import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminApiService, RolePolicy } from '../data-access/admin-api.service';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly policies = signal<RolePolicy[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadPolicies();
  }

  protected reload(): void {
    this.loadPolicies();
  }

  private loadPolicies(): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .getRolePolicies()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('role policies', error);
          this.error.set('No pudimos cargar las políticas de rol.');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((policies: RolePolicy[]) => this.policies.set(policies));
  }
}
