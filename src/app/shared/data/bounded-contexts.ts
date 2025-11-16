import { RoleName } from '../../features/iam/models/iam.models';

export type BoundedContextStatus = 'ready' | 'in-progress' | 'pending';

export interface BoundedContextDescriptor {
  key: string;
  name: string;
  description: string;
  targetRoute: string;
  status: BoundedContextStatus;
  icon?: string;
  roles?: RoleName[];
}

export const BOUNDED_CONTEXTS: BoundedContextDescriptor[] = [
  {
    key: 'profile',
    name: 'Perfiles ciudadanos',
    description: 'Gestión del perfil del ciudadano y contactos de referencia.',
    targetRoute: '/profile',
    status: 'ready',
    icon: 'user',
    roles: ['CITIZEN', 'OPERATOR', 'MUNICIPAL_OFFICER', 'ADMIN']
  },
  {
    key: 'monitoring',
    name: 'Monitoreo urbano',
    description: 'Panel de estado de tachos inteligentes filtrados por municipio.',
    targetRoute: '/monitoring',
    status: 'pending',
    icon: 'chart',
    roles: ['MUNICIPAL_OFFICER', 'ADMIN']
  },
  {
    key: 'smartbins',
    name: 'Tachos inteligentes',
    description: 'Registro y gestión de tachos inteligentes y operaciones asociadas.',
    targetRoute: '/smartbins',
    status: 'pending',
    icon: 'bin',
    roles: ['MUNICIPAL_OFFICER', 'ADMIN']
  },
  {
    key: 'operations',
    name: 'Operaciones',
    description: 'Planificación de rutas de recolección y asignación de operadores.',
    targetRoute: '/operations',
    status: 'pending',
    icon: 'route',
    roles: ['OPERATOR', 'MUNICIPAL_OFFICER', 'ADMIN']
  },
  {
    key: 'admin',
    name: 'Administración',
    description: 'Gestión de municipios, roles y aprobaciones administrativas.',
    targetRoute: '/admin',
    status: 'pending',
    icon: 'settings',
    roles: ['ADMIN']
  }
];
