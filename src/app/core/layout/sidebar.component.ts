import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoundedContextDescriptor } from '../../shared/data/bounded-contexts';
import { UserResponse, RoleName } from '../../features/iam/models/iam.models';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { LanguageSwitcherComponent } from '../../shared/i18n/language-switcher.component';

const GENERAL_ICON_PATH =
  'M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z';

const POSTULATION_ICON_PATH =
  'M9.5 2C8.67157 2 8 2.67157 8 3.5V4.5C8 5.32843 8.67157 6 9.5 6H14.5C15.3284 6 16 5.32843 16 4.5V3.5C16 2.67157 15.3284 2 14.5 2H9.5Z ' +
  'M6.5 4.03662C5.24209 4.10719 4.44798 4.30764 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.552 4.30764 18.7579 4.10719 17.5 4.03662V4.5C17.5 6.15685 16.1569 7.5 14.5 7.5H9.5C7.84315 7.5 6.5 6.15685 6.5 4.5V4.03662ZM7 9.75C6.58579 9.75 6.25 10.0858 6.25 10.5C6.25 10.9142 6.58579 11.25 7 11.25H7.5C7.91421 11.25 8.25 10.9142 8.25 10.5C8.25 10.0858 7.91421 9.75 7.5 9.75H7ZM10.5 9.75C10.0858 9.75 9.75 10.0858 9.75 10.5C9.75 10.9142 10.0858 11.25 10.5 11.25H17C17.4142 11.25 17.75 10.9142 17.75 10.5C17.75 10.0858 17.4142 9.75 17 9.75H10.5ZM7 13.25C6.58579 13.25 6.25 13.5858 6.25 14C6.25 14.4142 6.58579 14.75 7 14.75H7.5C7.91421 14.75 8.25 14.4142 8.25 14C8.25 13.5858 7.91421 13.25 7.5 13.25H7ZM10.5 13.25C10.0858 13.25 9.75 13.5858 9.75 14C9.75 14.4142 10.0858 14.75 10.5 14.75H17C17.4142 14.75 17.75 14.4142 17.75 14C17.75 13.5858 17.4142 13.25 17 13.25H10.5ZM7 16.75C6.58579 16.75 6.25 17.0858 6.25 17.5C6.25 17.9142 6.58579 18.25 7 18.25H7.5C7.91421 18.25 8.25 17.9142 8.25 17.5C8.25 17.0858 7.91421 16.75 7.5 16.75H7ZM10.5 16.75C10.0858 16.75 9.75 17.0858 9.75 17.5C9.75 17.9142 10.0858 18.25 10.5 18.25H17C17.4142 18.25 17.75 17.9142 17.75 17.5C17.75 17.0858 17.4142 16.75 17 16.75H10.5Z';

const ROLE_APPLICATION_ICON_PATH =
  'M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z ' +
  'M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z ' +
  'M4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.9812 19.6756 20.9997 17.8316 21 14.1801L18.1817 16.9984C17.9119 17.2683 17.691 17.4894 17.4415 17.6841C17.1491 17.9121 16.8328 18.1076 16.4981 18.2671C16.2124 18.4032 15.9159 18.502 15.5538 18.6225L13.2421 19.3931C12.4935 19.6426 11.6682 19.4478 11.1102 18.8898C10.5523 18.3318 10.3574 17.5065 10.607 16.7579L10.8805 15.9375L11.3556 14.5121L11.3775 14.4463C11.4981 14.0842 11.5968 13.7876 11.7329 13.5019C11.8924 13.1672 12.0879 12.8509 12.316 12.5586C12.5106 12.309 12.7317 12.0881 13.0017 11.8183L17.0081 7.81188L18.12 6.70004C18.9626 5.85741 19.9003 5.49981 20.838 5.5C20.6867 4.46945 20.3941 3.73727 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157ZM7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H10.5C10.9142 12.25 11.25 12.5858 11.25 13C11.25 13.4142 10.9142 13.75 10.5 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z';

const MUNICIPALITY_ICON_PATH =
  'M21.25 8.5C21.25 7.09554 21.25 6.39331 20.9129 5.88886C20.767 5.67048 20.5795 5.48298 20.3611 5.33706C19.9199 5.04224 19.3274 5.00529 18.246 5.00066C18.2501 5.29206 18.25 5.59655 18.25 5.91051V7.25H19.25C19.6642 7.25 20 7.58579 20 8C20 8.41421 19.6642 8.75 19.25 8.75H18.25V10.25H19.25C19.6642 10.25 20 10.5858 20 11C20 11.4142 19.6642 11.75 19.25 11.75H18.25V13.25H19.25C19.6642 13.25 20 13.5858 20 14C20 14.4142 19.6642 14.75 19.25 14.75H18.25V21.25H16.75V6C16.75 4.11438 16.75 3.17157 16.1642 2.58579C15.5784 2 14.6356 2 12.75 2H10.75C8.86438 2 7.92157 2 7.33579 2.58579C6.75 3.17157 6.75 4.11438 6.75 6V21.25H5.25V14.75H4.25C3.83579 14.75 3.5 14.4142 3.5 14C3.5 13.5858 3.83579 13.25 4.25 13.25H5.25V11.75H4.25C3.83579 11.75 3.5 11.4142 3.5 11C3.5 10.5858 3.83579 10.25 4.25 10.25H5.25V8.75H4.25C3.83579 8.75 3.5 8.41421 3.5 8C3.5 7.58579 3.83579 7.25 4.25 7.25H5.25V6C5.24996 5.59655 5.24992 5.29206 5.25403 5.00066C4.17262 5.00529 3.58008 5.04224 3.13886 5.33706C2.92048 5.48298 2.73298 5.67048 2.58706 5.88886C2.25 6.39331 2.25 7.09554 2.25 8.5V21.25H1.75C1.33579 21.25 1 21.5858 1 22C1 22.4142 1.33579 22.75 1.75 22.75H21.75C22.1642 22.75 22.5 22.4142 22.5 22C22.5 21.5858 22.1642 21.25 21.75 21.25H21.25V8.5ZM9 11.75C9 11.3358 9.33579 11 9.75 11H13.75C14.1642 11 14.5 11.3358 14.5 11.75C14.5 12.1642 14.1642 12.5 13.75 12.5H9.75C9.33579 12.5 9 12.1642 9 11.75ZM9 14.75C9 14.3358 9.33579 14 9.75 14H13.75C14.1642 14 14.5 14.3358 14.5 14.75C14.5 15.1642 14.1642 15.5 13.75 15.5H9.75C9.33579 15.5 9 15.1642 9 14.75ZM11.75 18.25C12.1642 18.25 12.5 18.5858 12.5 19V21.25H11V19C11 18.5858 11.3358 18.25 11.75 18.25ZM9 6.25C9 5.83579 9.33579 5.5 9.75 5.5H13.75C14.1642 5.5 14.5 5.83579 14.5 6.25C14.5 6.66421 14.1642 7 13.75 7H9.75C9.33579 7 9 6.66421 9 6.25ZM9 9.25C9 8.83579 9.33579 8.5 9.75 8.5H13.75C14.1642 8.5 14.5 8.83579 14.5 9.25C14.5 9.66421 14.1642 10 13.75 10H9.75C9.33579 10 9 9.66421 9 9.25Z';

const ICON_PATHS: Record<string, string> = {
  general: GENERAL_ICON_PATH,
  home: GENERAL_ICON_PATH,
  municipalities: MUNICIPALITY_ICON_PATH,
  'role-applications': ROLE_APPLICATION_ICON_PATH,
  shield:
    'M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM13.5 15C13.5 15.5523 13.0523 16 12.5 16H11.5C10.9477 16 10.5 15.5523 10.5 15V13.5987C9.6033 13.0799 9 12.1104 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.1104 14.3967 13.0799 13.5 13.5987V15Z',
  user: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z',
  chart: 'M4 20h16v2H2V2h2zm4-6h3v6H8zm5-9h3v15h-3zm-5 5h3v10H8zm10-9h3v24h-3z',
  bin: 'M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12zm2.5-4h7l.5 2H8zm-5 2h18v2H3z',
  route:
    'M12 2a5 5 0 1 1-4.472 7.324l-1.2 3.401A5 5 0 1 1 5 20h6v-2H5a3 3 0 1 0 2.683-4.267l1.404-3.976A5 5 0 0 1 12 2zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm5 9a5 5 0 1 1-5 5h2a3 3 0 1 0 3-3 1 1 0 0 1 0-2z',
  settings:
    'M12 8.5a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0-3.5-3.5zm8.94 3.1-2.517-.18a6.994 6.994 0 0 0-.63-1.52l1.6-1.94-1.414-1.415-1.94 1.6a6.994 6.994 0 0 0-1.52-.63l-.18-2.517h-2l-.18 2.517a6.994 6.994 0 0 0-1.52.63l-1.94-1.6L7.607 6.96l1.6 1.94a6.994 6.994 0 0 0-.63 1.52l-2.517.18v2l2.517.18a6.994 6.994 0 0 0 .63 1.52l-1.6 1.94 1.414 1.414 1.94-1.6a6.994 6.994 0 0 0 1.52.63l.18 2.517h2l.18-2.517a6.994 6.994 0 0 0 1.52-.63l1.94 1.6 1.414-1.414-1.6-1.94a6.994 6.994 0 0 0 .63-1.52l2.517-.18z',
  postulation: POSTULATION_ICON_PATH,
  default: 'M4 4h16v16H4z',
  logout:
    'M3.5 9.56757V14.4324C3.5 16.7258 3.5 17.8724 4.22161 18.5849C4.87719 19.2321 5.89578 19.2913 7.81846 19.2968C7.71686 18.6224 7.69563 17.8168 7.69029 16.8689C7.68802 16.4659 8.01709 16.1374 8.42529 16.1351C8.83348 16.1329 9.16624 16.4578 9.16851 16.8608C9.17451 17.9247 9.20249 18.6789 9.30898 19.2512C9.41158 19.8027 9.57634 20.1219 9.81626 20.3588C10.089 20.6281 10.4719 20.8037 11.1951 20.8996C11.9395 20.9985 12.9261 21 14.3407 21H15.3262C16.7407 21 17.7273 20.9985 18.4717 20.8996C19.1949 20.8037 19.5778 20.6281 19.8505 20.3588C20.1233 20.0895 20.3011 19.7114 20.3983 18.9975C20.4984 18.2626 20.5 17.2885 20.5 15.8919V8.10811C20.5 6.71149 20.4984 5.73743 20.3983 5.0025C20.3011 4.28855 20.1233 3.91048 19.8505 3.6412C19.5778 3.37192 19.1949 3.19635 18.4717 3.10036C17.7273 3.00155 16.7407 3 15.3262 3H14.3407C12.9261 3 11.9395 3.00155 11.1951 3.10036C10.4719 3.19635 10.089 3.37192 9.81626 3.6412C9.57634 3.87807 9.41158 4.19728 9.30898 4.74877C9.20249 5.32112 9.17451 6.07525 9.16851 7.1392C9.16624 7.54221 8.83348 7.8671 8.42529 7.86485C8.01709 7.86261 7.68802 7.53409 7.69029 7.13107C7.69563 6.18322 7.71686 5.37758 7.81846 4.70325C5.89578 4.70867 4.87719 4.76789 4.22161 5.41515C3.5 6.12759 3.5 7.27425 3.5 9.56757ZM5.93385 12.516C5.6452 12.231 5.6452 11.769 5.93385 11.484L7.90484 9.53806C8.19348 9.25308 8.66147 9.25308 8.95011 9.53806C9.23876 9.82304 9.23876 10.2851 8.95011 10.5701L8.24088 11.2703L15.3259 11.2703C15.7341 11.2703 16.0651 11.597 16.0651 12C16.0651 12.403 15.7341 12.7297 15.3259 12.7297L8.24088 12.7297L8.95011 13.4299C9.23876 13.7149 9.23876 14.177 8.95011 14.4619C8.66147 14.7469 8.19348 14.7469 7.90484 14.4619L5.93385 12.516Z'
};

const ICON_FILL_RULES: Record<string, string> = {
  general: 'evenodd',
  home: 'evenodd',
  postulation: 'evenodd',
  'role-applications': 'evenodd',
  municipalities: 'evenodd'
};

const ICON_CLIP_RULES: Record<string, string> = {
  general: 'evenodd',
  home: 'evenodd',
  postulation: 'evenodd',
  'role-applications': 'evenodd',
  municipalities: 'evenodd'
};

interface SidebarGeneralLink {
  key: string;
  labelKey: string;
  target: string;
  icon?: string;
  roles?: RoleName[];
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input({ required: true }) contexts: BoundedContextDescriptor[] = [];
  @Input() user: UserResponse | null = null;
  @Input() isAuthenticated = false;

  @Output() logout = new EventEmitter<void>();
  @Output() profile = new EventEmitter<void>();

  protected readonly sectionOrder: Array<'operator' | 'officer' | 'admin'> = [
    'operator',
    'officer',
    'admin'
  ];
  protected readonly isOpen = signal(true);
  protected readonly isMobileView = signal(false);
  protected readonly showBackdrop = computed(
    () => this.isMobileView() && this.isOpen()
  );
  private readonly mobileBreakpoint = 900;
  private viewportMode: 'desktop' | 'mobile' | null = null;
  private readonly roleMap: Record<'operator' | 'officer' | 'admin', RoleName> = {
    operator: 'OPERATOR',
    officer: 'MUNICIPAL_OFFICER',
    admin: 'ADMIN'
  };

  protected get isAdminUser(): boolean {
    return this.hasRole('ADMIN');
  }

  protected get isMunicipalUser(): boolean {
    return this.hasRole('MUNICIPAL_OFFICER');
  }

  protected readonly adminLinks = [
    { key: 'home', labelKey: 'sidebar.admin.home', target: '/admin' },
    { key: 'municipalities', labelKey: 'sidebar.admin.municipalities', target: '/admin/municipalities' },
    { key: 'role-applications', labelKey: 'sidebar.general.roleApplications', target: '/admin/role-applications' },
    { key: 'assign', labelKey: 'sidebar.admin.assignments', target: '/admin/assignments' }
  ];

  protected readonly generalLinks: SidebarGeneralLink[] = [
    {
      key: 'home',
      labelKey: 'sidebar.general.home',
      target: '/panel',
      icon: 'general',
      roles: ['CITIZEN', 'OPERATOR', 'MUNICIPAL_OFFICER', 'ADMIN'] as RoleName[],
      exact: true
    },
    {
      key: 'apply-role',
      labelKey: 'sidebar.general.apply',
      target: '/application',
      icon: 'role-applications',
      roles: ['CITIZEN', 'OPERATOR', 'MUNICIPAL_OFFICER', 'ADMIN'] as RoleName[]
    }
  ];

  protected readonly groupedContexts = computed(() => {
    const sections: Record<'operator' | 'officer' | 'admin', BoundedContextDescriptor[]> = {
      operator: [],
      officer: [],
      admin: []
    };

    const viewerRoles = new Set(this.user?.roles ?? []);
    const isAdmin = viewerRoles.has('ADMIN');

    this.contexts.forEach((context) => {
      if (context.status !== 'ready' || context.key === 'profile') {
        return;
      }

      const suitableSection = this.sectionOrder.find((section) => {
        const requiredRole = this.roleMap[section];
        if (!context.roles || context.roles.length === 0) {
          return true;
        }
        return context.roles.includes(requiredRole);
      });

      if (!suitableSection) {
        return;
      }

      const requiredRole = this.roleMap[suitableSection];
      if (!isAdmin && requiredRole && !viewerRoles.has(requiredRole)) {
        return;
      }

      sections[suitableSection].push(context);
    });

    return sections;
  });

  constructor() {
    this.updateViewportMode(true);
  }

  @HostListener('window:resize')
  protected handleViewportChange(): void {
    this.updateViewportMode();
  }

  protected toggleSidebar(): void {
    if (!this.isMobileView()) {
      return;
    }
    this.isOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    if (!this.isMobileView()) {
      return;
    }
    this.isOpen.set(false);
  }

  protected handleNavigate(): void {
    this.closeOnMobile();
  }

  protected get userInitials(): string {
    if (!this.user) {
      return 'ES';
    }
    const values = [this.user.firstName, this.user.paternalLastName]
      .filter(Boolean)
      .map((value) => value!.charAt(0).toUpperCase());
    return values.slice(0, 2).join('') || 'ES';
  }

  protected get userName(): string {
    if (!this.user) {
      return 'EcoSmart';
    }
    return `${this.user.firstName} ${this.user.paternalLastName}`;
  }

  protected get roleLabelKey(): string {
    const role = this.user?.roles?.[0];
    if (!role) {
      return 'sidebar.role.guest';
    }
    return `sidebar.role.${role}`;
  }

  protected iconPath(key?: string): string {
    if (!key) {
      return ICON_PATHS['default'];
    }
    return ICON_PATHS[key] ?? ICON_PATHS['default'];
  }

  protected iconFillRule(key?: string): string | null {
    const resolvedKey = key ?? 'default';
    return ICON_FILL_RULES[resolvedKey] ?? null;
  }

  protected iconClipRule(key?: string): string | null {
    const resolvedKey = key ?? 'default';
    return ICON_CLIP_RULES[resolvedKey] ?? null;
  }

  protected onLogout(): void {
    this.closeOnMobile();
    this.logout.emit();
  }

  protected onProfile(): void {
    this.closeOnMobile();
    this.profile.emit();
  }

  private closeOnMobile(): void {
    if (this.isMobileView()) {
      this.isOpen.set(false);
    }
  }

  private updateViewportMode(initial = false): void {
    if (typeof window === 'undefined') {
      this.isOpen.set(true);
      this.isMobileView.set(false);
      return;
    }

    const isDesktop = window.innerWidth >= this.mobileBreakpoint;
    const mode: 'desktop' | 'mobile' = isDesktop ? 'desktop' : 'mobile';

    if (this.viewportMode === mode && !initial) {
      return;
    }

    this.viewportMode = mode;
    this.isMobileView.set(!isDesktop);
    this.isOpen.set(isDesktop);
  }

  protected canViewGeneralLinks(): boolean {
    return this.generalLinks.some((link) => this.canViewLink(link));
  }

  protected canViewLink(link: { roles?: RoleName[] }): boolean {
    if (!link.roles || link.roles.length === 0) {
      return true;
    }
    return link.roles.some((role) => this.hasRole(role));
  }

  private hasRole(role: RoleName): boolean {
    return !!this.user?.roles?.includes(role);
  }
}
