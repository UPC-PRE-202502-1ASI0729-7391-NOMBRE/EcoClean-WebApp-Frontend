import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../../../shared/i18n/language-switcher.component';

@Component({
  selector: 'app-iam-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './iam-login.component.html',
  styleUrl: './iam-login.component.css'
})
export class IamLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected get emailControl() {
    return this.form.controls.email;
  }

  protected get passwordControl() {
    return this.form.controls.password;
  }

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
      await this.authStore.login(this.form.getRawValue());
      await this.router.navigate(['/panel']);
    } catch (error) {
      this.errorKey.set(this.resolveErrorKey(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resolveErrorKey(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return 'iam.login.errors.invalid';
    }
    return 'iam.login.errors.generic';
  }
}
