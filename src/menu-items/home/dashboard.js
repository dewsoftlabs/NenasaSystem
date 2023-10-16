// assets
import { IconDashboard } from '@tabler/icons';
import { IconKey } from '@tabler/icons';
import { IconClipboardText } from '@tabler/icons-react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { IconUserDollar } from '@tabler/icons-react';
import { IconFileTypePdf } from '@tabler/icons-react';
import { IconBrandCashapp } from '@tabler/icons-react';
import { IconCurrencyDollarSingapore } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconDashboard,
  IconClipboardText,
  IconAdjustmentsAlt,
  IconUserDollar,
  IconFileTypePdf,
  IconBrandCashapp,
  IconCurrencyDollarSingapore
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      permissionCode: '',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cashier',
      title: 'Cashier',
      type: 'item',
      url: '/cashier',
      external: true,
      target: '_blank',
      permissionCode: 'cashierpannel',
      icon: icons.IconCurrencyDollarSingapore,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customer',
      type: 'collapse',
      icon: icons.IconUserDollar,
      permissionCode: 'customer',

      children: [
        {
          id: 'customer-list',
          title: 'Customer List',
          type: 'item',
          url: '/customer-list',
          permissionCode: 'customerlist',
          target: true
        },
        {
          id: 'ariyas-customer',
          title: 'Ariyas Customer List',
          type: 'item',
          url: '/ariyas-customer',
          permissionCode: 'ariyascustomer',
          target: true
        },
        {
          id: 'guranteer',
          title: 'Guarantees',
          type: 'item',
          url: '/guranteer',
          permissionCode: 'guranter',
          target: true
        }
      ]
    },
    {
      id: 'loan',
      title: 'Loan',
      type: 'collapse',
      icon: icons.IconClipboardText,
      permissionCode: 'loan',

      children: [
        {
          id: 'loan-list',
          title: 'Loan List',
          type: 'item',
          url: '/loan-list',
          permissionCode: 'loanlist',
          target: true
        },
        {
          id: 'apply-loan',
          title: 'Apply Loan',
          type: 'item',
          url: '/apply-loan',
          permissionCode: 'loanadd',
          target: true
        },
        {
          id: 'cancel-loan',
          title: 'Cancel Loan',
          type: 'item',
          url: '/cancel-loan',
          permissionCode: 'loancancel',
          target: true
        }
      ]
    },
    {
      id: 'deposit',
      title: 'Deposit',
      type: 'collapse',
      icon: icons.IconBrandCashapp,
      permissionCode: 'deposit',
      children: [
        {
          id: 'create-deposit-account',
          title: 'Create Deposit Account',
          type: 'item',
          url: '/create-deposit-account',
          permissionCode: 'depositaccounts',
          target: true
        },
        {
          id: 'deposit-accounts',
          title: 'Deposit Accounts',
          type: 'item',
          url: '/deposit-accounts',
          permissionCode: '',
          target: true
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: icons.IconFileTypePdf,
      permissionCode: 'reports',

      children: [
        {
          id: 'login3',
          title: 'Login',
          type: 'item',
          url: '/pages/login/login3',
          permissionCode: '',
          target: true
        },
        {
          id: 'register3',
          title: 'Register',
          type: 'item',
          url: '/pages/register/register3',
          permissionCode: '',
          target: true
        }
      ]
    }
  ]
};

export default dashboard;
