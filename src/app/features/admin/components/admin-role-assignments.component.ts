import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminApiService, RoleAssignment } from '../data-access/admin-api.service';
import { RoleName } from '../../iam/models/iam.models';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

interface UserEntry {
  id: number;
  name: string;
  email: string;
  control: FormControl<RoleName>;
  availableRoles: RoleName[];
}

@Component({
  selector: 'app-admin-role-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './admin-role-assignments.component.html',
  styleUrl: './admin-role-assignments.component.css'
})
export class AdminRoleAssignmentsComponent {
  private readonly adminApi = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly users = signal<UserEntry[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly updatingId = signal<number | null>(null);

  constructor() {
    this.loadAssignments();
  }

  protected reload(): void {
    this.loadAssignments();
  }

  protected assign(user: UserEntry): void {
    const nextRole = user.control.value;
    if (!nextRole || this.updatingId() === user.id) {
      return;
    }
    this.updatingId.set(user.id);
    this.adminApi
      .updateUserRole(user.id, nextRole)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('assign role', error);
          this.error.set('admin.roleAssignments.error.assign');
          return of(null);
        }),
        finalize(() => this.updatingId.set(null))
      )
      .subscribe((assignment: RoleAssignment | null) => {
        if (!assignment) {
          return;
        }
        this.users.update((entries) =>
          entries.map((entry) => (entry.id === assignment.id ? this.mapToEntry(assignment) : entry))
        );
      });
  }

  private loadAssignments(): void {
    this.loading.set(true);
    this.error.set(null);
    this.adminApi
      .getRoleAssignments()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('load assignments', error);
          this.error.set('admin.roleAssignments.error.load');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((assignments: RoleAssignment[]) =>
        this.users.set(assignments.map((assignment) => this.mapToEntry(assignment)))
      );
  }

  private mapToEntry(assignment: RoleAssignment): UserEntry {
    return {
      id: assignment.id,
      name: assignment.name,
      email: assignment.email,
      control: new FormControl<RoleName>(assignment.role, { nonNullable: true }),
      availableRoles: assignment.availableRoles
    };
  }
}
