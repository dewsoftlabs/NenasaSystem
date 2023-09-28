// assets
import { IconMenu2 } from '@tabler/icons-react';
import { IconFilters } from '@tabler/icons-react';

// constant
const icons = {
  IconMenu2,
  IconFilters
};

const generalDash = {
  id: 'other-settings',
  title: 'Other Settings',
  type: 'group',
  children: [
    {
      id: 'types',
      title: 'Types',
      type: 'item',
      url: '/types',
      icon: icons.IconMenu2,
      breadcrumbs: false
    },
    {
      id: 'filters',
      title: 'Filters',
      type: 'item',
      url: '/filters',
      icon: icons.IconFilters,
      breadcrumbs: false
    }
  ]
};

export default generalDash;
