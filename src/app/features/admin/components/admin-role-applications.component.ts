import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import {
  AdminApiService,
  RoleApplication,
  RoleApplicationStatus
} from '../data-access/admin-api.service';

@Component({
  selector: 'app-admin-role-applications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './admin-role-applications.component.html',
  styleUrl: './admin-role-applications.component.css'
})
export class AdminRoleApplicationsComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly applications = signal<RoleApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly statusFilter = signal<RoleApplicationStatus>('PENDING');
  protected readonly statuses: RoleApplicationStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
  protected readonly rejectionReason = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly selectedApplication = signal<RoleApplication | null>(null);
  protected readonly decidingId = signal<string | null>(null);

  constructor() {
    this.loadApplications();
  }

  protected changeStatusFilter(status: RoleApplicationStatus): void {
    this.statusFilter.set(status);
    this.loadApplications();
  }

  protected onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (!select) {
      return;
    }
    this.changeStatusFilter(select.value as RoleApplicationStatus);
  }

  protected openRejectModal(application: RoleApplication): void {
    this.selectedApplication.set(application);
    this.rejectionReason.setValue('');
  }

  protected closeRejectModal(): void {
    this.selectedApplication.set(null);
    this.rejectionReason.setValue('');
  }

  protected approve(application: RoleApplication): void {
    if (this.decidingId()) {
      return;
    }
    this.decidingId.set(application.id);
    this.adminApi
      .approveRoleApplication(application.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('approve role application', error);
          this.error.set('admin.roleApplications.error.decide');
          return of(null);
        }),
        finalize(() => this.decidingId.set(null))
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.replaceApplication(updated);
      });
  }

  protected reject(): void {
    const application = this.selectedApplication();
    if (!application || this.decidingId() || this.rejectionReason.invalid) {
      this.rejectionReason.markAllAsTouched();
      return;
    }
    this.decidingId.set(application.id);
    const reason = this.rejectionReason.value || '';
    this.adminApi
      .rejectRoleApplication(application.id, reason)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('reject role application', error);
          this.error.set('admin.roleApplications.error.decide');
          return of(null);
        }),
        finalize(() => {
          this.decidingId.set(null);
          this.closeRejectModal();
        })
      )
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.replaceApplication(updated);
      });
  }

  private loadApplications(): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .getRoleApplications(this.statusFilter())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('load role applications', error);
          this.error.set('admin.roleApplications.error.load');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((applications) => this.applications.set(applications));
  }

  private replaceApplication(updated: RoleApplication): void {
    this.applications.update((items) =>
      items.map((item) => (item.id === updated.id ? updated : item))
    );
  }
}
