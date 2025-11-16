import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { RoleName } from '../iam/models/iam.models';

interface HomeUpdate {
  badgeKey: string;
  titleKey: string;
  descriptionKey: string;
}

interface HomeAction {
  titleKey: string;
  descriptionKey: string;
  route: string;
  roles?: RoleName[];
}

const HOME_UPDATES: HomeUpdate[] = [
  {
    badgeKey: 'home.news.operations.badge',
    titleKey: 'home.news.operations.title',
    descriptionKey: 'home.news.operations.description'
  },
  {
    badgeKey: 'home.news.municipalities.badge',
    titleKey: 'home.news.municipalities.title',
    descriptionKey: 'home.news.municipalities.description'
  },
  {
    badgeKey: 'home.news.analytics.badge',
    titleKey: 'home.news.analytics.title',
    descriptionKey: 'home.news.analytics.description'
  }
];

const HOME_ACTIONS: HomeAction[] = [
  {
    titleKey: 'home.actions.profile.title',
    descriptionKey: 'home.actions.profile.description',
    route: '/profile'
  },
  {
    titleKey: 'home.actions.apply.title',
    descriptionKey: 'home.actions.apply.description',
    route: '/application'
  },
  {
    titleKey: 'home.actions.admin.title',
    descriptionKey: 'home.actions.admin.description',
    route: '/admin',
    roles: ['ADMIN', 'MUNICIPAL_OFFICER']
  }
];

@Component({
  selector: 'app-general-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './general-home.component.html',
  styleUrl: './general-home.component.css'
})
export class GeneralHomeComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly userName = computed(() => {
    const user = this.authStore.user();
    if (!user) {
      return 'EcoSmart';
    }
    const segments = [user.firstName, user.paternalLastName].filter(Boolean);
    return segments.join(' ').trim() || 'EcoSmart';
  });

  protected readonly updates = HOME_UPDATES;

  protected readonly actions = computed(() => {
    const roles = new Set(this.authStore.user()?.roles ?? []);
    return HOME_ACTIONS.filter((action) => {
      if (!action.roles || action.roles.length === 0) {
        return true;
      }
      return action.roles.some((role) => roles.has(role));
    });
  });
}
