// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import { IconUsersGroup } from '@tabler/icons-react';
import { IconCategory2 } from '@tabler/icons-react';
import { IconRoad } from '@tabler/icons-react';
import { IconUserCheck } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUsersGroup,
  IconCategory2,
  IconRoad,
  IconUserCheck
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const filters = {
  id: 'filters',
  title: 'Filters',
  type: 'group',
  children: [
    {
      id: 'category',
      title: 'Category',
      type: 'item',
      url: '/category',
      icon: icons.IconCategory2,
      breadcrumbs: false
    },
    {
      id: 'route',
      title: 'Route',
      type: 'item',
      url: '/route',
      icon: icons.IconRoad,
      breadcrumbs: false
    },
    {
      id: 'officer',
      title: 'Officer',
      type: 'collapse',
      icon: icons.IconUserCheck,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default filters;
