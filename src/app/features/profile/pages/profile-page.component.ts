import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileApiService } from '../data-access/profile-api.service';
import { ProfileResponse, UpdateProfileRequest } from '../models/profile.models';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type ProfileFormValue = {
  avatarUrl: string;
  bio: string;
  occupation: string;
  addressReference: string;
  emergencyContact: string;
  emergencyPhone: string;
};

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, DatePipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  private readonly profileApi = inject(ProfileApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly successKey = signal<string | null>(null);
  protected readonly profile = signal<ProfileResponse | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    avatarUrl: ['', [Validators.maxLength(255)]],
    bio: ['', [Validators.maxLength(200)]],
    occupation: ['', [Validators.maxLength(120)]],
    addressReference: ['', [Validators.maxLength(160)]],
    emergencyContact: ['', [Validators.maxLength(120)]],
    emergencyPhone: ['', [Validators.pattern(/^$|^\d{9}$/)]]
  });

  protected readonly hasProfileData = computed(() => Boolean(this.profile()));

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  protected async loadProfile(): Promise<void> {
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      const response = await firstValueFrom(this.profileApi.getProfile());
      this.profile.set(response!);
      this.form.reset({
        avatarUrl: response?.avatarUrl ?? '',
        bio: response?.bio ?? '',
        occupation: response?.occupation ?? '',
        addressReference: response?.addressReference ?? '',
        emergencyContact: response?.emergencyContact ?? '',
        emergencyPhone: response?.emergencyPhone ?? ''
      });
    } catch {
      this.errorKey.set('profile.errors.load');
    } finally {
      this.loading.set(false);
    }
  }

  protected resetForm(): void {
    if (this.profile()) {
      const current = this.profile()!;
      this.form.reset({
        avatarUrl: current.avatarUrl ?? '',
        bio: current.bio ?? '',
        occupation: current.occupation ?? '',
        addressReference: current.addressReference ?? '',
        emergencyContact: current.emergencyContact ?? '',
        emergencyPhone: current.emergencyPhone ?? ''
      });
      this.successKey.set(null);
      this.errorKey.set(null);
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.errorKey.set(null);
    this.successKey.set(null);
    try {
      const payload = this.normalizePayload(this.form.getRawValue());
      const response = await firstValueFrom(this.profileApi.updateProfile(payload));
      if (response) {
        this.profile.set(response);
        this.successKey.set('profile.success.saved');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 400) {
        this.errorKey.set('profile.errors.save');
      } else {
        this.errorKey.set('profile.errors.save');
      }
    } finally {
      this.saving.set(false);
    }
  }

  private normalizePayload(values: ProfileFormValue): UpdateProfileRequest {
    return Object.entries(values).reduce<UpdateProfileRequest>(
      (acc, [key, value]) => {
        const trimmed = value?.trim() ?? '';
        acc[key as keyof UpdateProfileRequest] = trimmed.length > 0 ? trimmed : null;
        return acc;
      },
      {} as UpdateProfileRequest
    );
  }
}
