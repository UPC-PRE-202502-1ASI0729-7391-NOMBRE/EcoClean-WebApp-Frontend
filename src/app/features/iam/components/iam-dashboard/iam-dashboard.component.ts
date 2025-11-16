import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../../../shared/i18n/language-switcher.component';

@Component({
  selector: 'app-iam-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './iam-dashboard.component.html',
  styleUrl: './iam-dashboard.component.css'
})
export class IamDashboardComponent {
  protected readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly refreshing = signal(false);
  protected readonly refreshError = signal<string | null>(null);
  protected readonly copyFeedback = signal<string | null>(null);

  protected readonly fullName = computed(() => {
    const user = this.auth.user();
    if (!user) {
      return '';
    }
    return `${user.firstName} ${user.paternalLastName} ${user.maternalLastName}`;
  });

  async refreshProfile(): Promise<void> {
    if (this.refreshing()) {
      return;
    }

    this.refreshing.set(true);
    this.refreshError.set(null);

    try {
      await this.auth.refreshProfile();
    } catch {
      this.refreshError.set('iam.dashboard.refreshError');
    } finally {
      this.refreshing.set(false);
    }
  }

  async copyToken(): Promise<void> {
    const token = this.auth.token();
    if (!token) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      this.copyFeedback.set('iam.dashboard.tokenClipboardMissing');
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
      this.copyFeedback.set('iam.dashboard.tokenCopied');
    } catch {
      this.copyFeedback.set('iam.dashboard.tokenCopyError');
    } finally {
      setTimeout(() => this.copyFeedback.set(null), 2000);
    }
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
