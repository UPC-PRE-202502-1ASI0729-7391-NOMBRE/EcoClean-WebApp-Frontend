import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminApiService, AdminApplication } from '../data-access/admin-api.service';
import { RoleName } from '../../iam/models/iam.models';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './admin-applications.component.html',
  styleUrl: './admin-applications.component.css'
})
export class AdminApplicationsComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly applications = signal<AdminApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  private readonly highlightedRoles: RoleName[] = ['OPERATOR', 'MUNICIPAL_OFFICER'];

  constructor() {
    this.loadApplications();
  }

  protected reload(): void {
    this.loadApplications();
  }

  private loadApplications(): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .getApplications()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('applications load failed', error);
          this.error.set('No pudimos cargar las aplicaciones.');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((apps: AdminApplication[]) =>
        this.applications.set(this.filterRelevantApplications(apps))
      );
  }

  private filterRelevantApplications(apps: AdminApplication[]): AdminApplication[] {
    return apps.filter((app) =>
      app.roles?.some((role) => this.highlightedRoles.includes(role))
    );
  }
}
