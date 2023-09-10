// assets
import { IconUserCheck } from '@tabler/icons-react';
import { IconLockOpen } from '@tabler/icons-react';
import { IconUserExclamation } from '@tabler/icons-react';

// constant
const icons = {
  IconUserCheck,
  IconLockOpen,
  IconUserExclamation
};

const generalDash = {
  id: 'security-settings',
  title: 'Security Settings',
  type: 'group',
  children: [
    {
      id: 'user-settings',
      title: 'User Settings',
      type: 'item',
      url: '/user-settings',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'permission-settings',
      title: 'Permission Settings',
      type: 'item',
      url: '/permission-settings',
      icon: icons.IconLockOpen,
      breadcrumbs: false
    },
    {
      id: 'userrole-settings',
      title: 'Userrole Settings',
      type: 'item',
      url: '/userrole-settings',
      icon: icons.IconUserExclamation,
      breadcrumbs: false
    }
  ]
};

export default generalDash;
