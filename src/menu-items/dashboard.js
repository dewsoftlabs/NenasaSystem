// assets
import { IconDashboard } from '@tabler/icons';
import { IconKey } from '@tabler/icons';
import { IconClipboardText } from '@tabler/icons-react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { IconUserDollar } from '@tabler/icons-react';
import { IconFileTypePdf } from '@tabler/icons-react';
import { IconBrandCashapp } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconDashboard,
  IconClipboardText,
  IconAdjustmentsAlt,
  IconUserDollar,
  IconFileTypePdf,
  IconBrandCashapp
};


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customer',
      type: 'collapse',
      icon: icons.IconUserDollar,

      children: [
        {
          id: 'customer-list',
          title: 'Customer List',
          type: 'item',
          url: '/customer-list',
          target: true
        },
        {
          id: 'ariyas-customer',
          title: 'Ariyas Customer List',
          type: 'item',
          url: '/ariyas-customer',
          target: true
        },
        {
          id: 'guranteer',
          title: 'Guarantees',
          type: 'item',
          url: '/guranteer',
          target: true
        }
      ]
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
          id: 'cancel-loan',
          title: 'Cancel Loan',
          type: 'item',
          url: '/cancel-loan',
          target: true
        }
      ]
    },
    {
      id: 'deposit',
      title: 'Deposit',
      type: 'collapse',
      icon: icons.IconBrandCashapp,

      children: [
        {
          id: 'create-deposit-account',
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
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: icons.IconFileTypePdf,

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

export default dashboard;
