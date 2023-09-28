// assets
import { IconUserCog } from '@tabler/icons-react';

// constant
const icons = {
  IconUserCog
};

const generalDash = {
  id: 'account-settings',
  title: 'Account Settings',
  type: 'group',
  children: [
    {
      id: 'account-settings',
      title: 'Acoount',
      type: 'item',
      url: '/account-settings',
      icon: icons.IconUserCog,
      breadcrumbs: false
    }
  ]
};

export default generalDash;
