// assets
import { IconCategoryFilled } from '@tabler/icons-react';
import { IconBuildingStore } from '@tabler/icons-react';

// constant
const icons = {
  IconCategoryFilled,
  IconBuildingStore
};

const generalDash = {
  id: 'general-settings',
  title: 'Genaral Settings',
  type: 'group',
  children: [
    {
      id: 'company-settings',
      title: 'Company Settings',
      type: 'item',
      url: '/company-settings',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'branch-settings',
      title: 'Branch Settings',
      type: 'item',
      url: '/branch-settings',
      icon: icons.IconCategoryFilled,
      breadcrumbs: false
    }
  ]
};

export default generalDash;
