import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../../../shared/i18n/language-switcher.component';

@Component({
  selector: 'app-iam-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './iam-register.component.html',
  styleUrl: './iam-register.component.css'
})
export class IamRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required]],
    paternalLastName: ['', [Validators.required]],
    maternalLastName: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    department: ['', [Validators.required]],
    province: ['', [Validators.required]],
    district: ['', [Validators.required]]
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected controls = this.form.controls;

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorKey.set(null);

    try {
      await this.authStore.register(this.form.getRawValue());
      await this.router.navigate(['/panel']);
    } catch (error) {
      this.errorKey.set(this.resolveErrorKey(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resolveErrorKey(error: unknown): string {
    return 'iam.register.errors.generic';
  }
}
