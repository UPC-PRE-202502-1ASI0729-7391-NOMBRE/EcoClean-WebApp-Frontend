import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import {
  AdminApiService,
  Municipality,
  CreateRoleApplicationPayload
} from '../admin/data-access/admin-api.service';
import { RoleName } from '../iam/models/iam.models';

@Component({
  selector: 'app-role-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './role-application-form.component.html',
  styleUrl: './role-application-form.component.css'
})
export class RoleApplicationFormComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly municipalities = signal<Municipality[]>([]);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    role: this.fb.nonNullable.control<RoleName>('OPERATOR', { validators: [Validators.required] }),
    municipalityId: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/\d{9}/)]],
    drivingLicense: [''],
    company: [''],
    workDistrict: [''],
    workCity: [''],
    positionTitle: [''],
    municipalEntity: [''],
    entityRuc: [''],
    municipalWorkDistrict: ['']
  });

  constructor() {
    this.loadMunicipalities();
  }

  protected get isOperator(): boolean {
    return this.form.controls.role.value === 'OPERATOR';
  }

  protected get isMunicipalOfficer(): boolean {
    return this.form.controls.role.value === 'MUNICIPAL_OFFICER';
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: CreateRoleApplicationPayload = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);
    this.adminApi
      .createRoleApplication(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('create role application', error);
          this.error.set('roleApplication.form.error');
          return of(null);
        }),
        finalize(() => this.submitting.set(false))
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }
        this.success.set(true);
        this.form.reset({ role: this.form.controls.role.value });
      });
  }

  private loadMunicipalities(): void {
    this.loading.set(true);
    this.adminApi
      .getActiveMunicipalities()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('active municipalities', error);
          this.error.set('roleApplication.form.loadError');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((municipalities) => this.municipalities.set(municipalities));
  }
}
