import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  AdminApiService,
  CreateMunicipalityPayload,
  Municipality,
  MunicipalityPage,
  MunicipalityQuery
} from '../data-access/admin-api.service';

@Component({
  selector: 'app-admin-municipalities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './admin-municipalities.component.html',
  styleUrl: './admin-municipalities.component.css'
})
export class AdminMunicipalitiesComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  protected readonly municipalities = signal<Municipality[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedMunicipality = signal<Municipality | null>(null);
  protected readonly page = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);
  private readonly pageSize = 8;

  protected readonly addForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    department: ['', Validators.required],
    province: ['', Validators.required],
    district: ['', Validators.required],
    description: ['']
  });

  protected readonly filtersForm = this.fb.nonNullable.group({
    department: [''],
    province: [''],
    status: ['all']
  });

  constructor() {
    this.loadMunicipalities();
  }

  protected submit(): void {
    if (this.addForm.invalid || this.saving()) {
      this.addForm.markAllAsTouched();
      return;
    }
    const payload: CreateMunicipalityPayload = this.addForm.getRawValue();
    this.saving.set(true);
    this.adminApi
      .createMunicipality(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('create municipality', error);
          this.error.set('No pudimos registrar el municipio.');
          return of(null);
        }),
        finalize(() => this.saving.set(false))
      )
      .subscribe((municipality: Municipality | null) => {
        if (!municipality) {
          return;
        }
        this.municipalities.update((items) => [municipality, ...items]);
        this.addForm.reset();
        this.loadMunicipalities();
      });
  }

  protected reload(): void {
    this.loadMunicipalities();
  }

  protected applyFilters(): void {
    this.loadMunicipalities(0);
  }

  protected resetFilters(): void {
    this.filtersForm.reset({
      department: '',
      province: '',
      status: 'all'
    });
    this.loadMunicipalities(0);
  }

  protected changePage(delta: number): void {
    const next = this.page() + delta;
    if (next < 0 || next >= this.totalPages()) {
      return;
    }
    this.loadMunicipalities(next);
  }

  protected showDescription(modalTarget: Municipality): void {
    if (!modalTarget.description) {
      return;
    }
    this.selectedMunicipality.set(modalTarget);
  }

  protected closeDescription(event?: MouseEvent): void {
    event?.stopPropagation();
    this.selectedMunicipality.set(null);
  }

  private loadMunicipalities(page = this.page()): void {
    this.loading.set(true);
    this.error.set(null);
    const filters = this.filtersForm.getRawValue();
    const query: MunicipalityQuery = {
      page,
      size: this.pageSize,
      department: filters.department?.trim(),
      province: filters.province?.trim(),
      status: filters.status && filters.status !== 'all' ? (filters.status as 'active' | 'inactive') : undefined
    };
    this.adminApi
      .getMunicipalities(query)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('load municipalities', error);
          this.error.set('No pudimos cargar los municipios.');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((response: MunicipalityPage | Municipality[] ) => {
        if (Array.isArray(response)) {
          this.municipalities.set(response);
          this.page.set(0);
          this.totalPages.set(1);
          this.totalElements.set(response.length);
          return;
        }
        this.municipalities.set(response.items);
        this.page.set(response.page);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
      });
  }
}
