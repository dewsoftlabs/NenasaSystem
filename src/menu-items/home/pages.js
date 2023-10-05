// assets
import { IconKey } from '@tabler/icons';
import { IconClipboardText } from '@tabler/icons-react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { IconUserDollar } from '@tabler/icons-react';
// constant
const icons = {
  IconKey,
  IconClipboardText,
  IconAdjustmentsAlt,
  IconUserDollar
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  type: 'group',
  children: [
    {
      id: 'customer',
      title: 'Customer',
      type: 'item',
      url: '/customer',
      icon: icons.IconUserDollar,
      breadcrumbs: false
    },
    {
      id: 'loan',
      title: 'Loan',
      type: 'collapse',
      icon: icons.IconClipboardText,

      children: [
        {
          id: 'apply-loan',
          title: 'Apply Loan',
          type: 'item',
          url: '/apply-loan',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    },
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        }
      ]
    }
  ]
};

export default pages;
