import { CommonModule } from '@angular/common';
import { DestroyRef, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth/auth.store';
import { BOUNDED_CONTEXTS } from './shared/data/bounded-contexts';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './core/layout/sidebar.component';
import { TranslatePipe } from './shared/i18n/translate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly auth = inject(AuthStore);
  protected readonly contexts = BOUNDED_CONTEXTS;
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStandaloneRoutes = ['/login', '/register'];
  protected readonly isAuthStandalone = signal(false);

  constructor() {
    const updateLayout = (url: string) => {
      const normalized = url.split('?')[0];
      this.isAuthStandalone.set(this.authStandaloneRoutes.includes(normalized));
    };

    updateLayout(this.router.url);
    const subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => updateLayout(event.urlAfterRedirects));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  protected signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  protected goToProfile(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
