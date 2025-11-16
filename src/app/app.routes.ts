import { Routes } from '@angular/router';
import { IamLoginComponent } from './features/iam/components/iam-login/iam-login.component';
import { IamRegisterComponent } from './features/iam/components/iam-register/iam-register.component';
import { IamDashboardComponent } from './features/iam/components/iam-dashboard/iam-dashboard.component';
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard.component';
import { AdminMunicipalitiesComponent } from './features/admin/components/admin-municipalities.component';
import { AdminRolesComponent } from './features/admin/components/admin-roles.component';
import { AdminApplicationsComponent } from './features/admin/components/admin-applications.component';
import { AdminRoleAssignmentsComponent } from './features/admin/components/admin-role-assignments.component';
import { AdminRoleApplicationsComponent } from './features/admin/components/admin-role-applications.component';
import { RoleApplicationFormComponent } from './features/role-applications/role-application-form.component';
import { authenticatedGuard } from './core/auth/auth.guard';
import { ProfilePageComponent } from './features/profile/pages/profile-page.component';
import { GeneralHomeComponent } from './features/home/general-home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: IamLoginComponent },
  { path: 'register', component: IamRegisterComponent },
  { path: 'panel', component: GeneralHomeComponent, canActivate: [authenticatedGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authenticatedGuard] },
  {
    path: 'admin/applications',
    component: AdminApplicationsComponent,
    canActivate: [authenticatedGuard]
  },
  {
    path: 'admin/municipalities',
    component: AdminMunicipalitiesComponent,
    canActivate: [authenticatedGuard]
  },
  { path: 'admin/roles', component: AdminRolesComponent, canActivate: [authenticatedGuard] },
  {
    path: 'admin/assignments',
    component: AdminRoleAssignmentsComponent,
    canActivate: [authenticatedGuard]
  },
  {
    path: 'admin/role-applications',
    component: AdminRoleApplicationsComponent,
    canActivate: [authenticatedGuard]
  },
  {
    path: 'application',
    component: RoleApplicationFormComponent,
    canActivate: [authenticatedGuard]
  },
  { path: 'session', component: IamDashboardComponent, canActivate: [authenticatedGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authenticatedGuard] },
  { path: '**', redirectTo: 'login' }
];
