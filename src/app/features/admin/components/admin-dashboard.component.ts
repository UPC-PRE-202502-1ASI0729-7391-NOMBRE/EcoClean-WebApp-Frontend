import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

interface AdminCard {
  key: string;
  titleKey: string;
  descriptionKey: string;
  target: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  protected readonly cards: AdminCard[] = [
    {
      key: 'municipalities',
      titleKey: 'admin.dashboard.card.municipalities.title',
      descriptionKey: 'admin.dashboard.card.municipalities.description',
      target: '/admin/municipalities'
    },
    {
      key: 'assignments',
      titleKey: 'admin.dashboard.card.assignments.title',
      descriptionKey: 'admin.dashboard.card.assignments.description',
      target: '/admin/assignments'
    }
  ];
}
