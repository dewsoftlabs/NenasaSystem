// assets
import { IconDashboard } from '@tabler/icons';
import { IconKey } from '@tabler/icons';
import { IconClipboardText } from '@tabler/icons-react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import { IconUserDollar } from '@tabler/icons-react';
import { IconFileTypePdf } from '@tabler/icons-react';
import { IconBrandCashapp } from '@tabler/icons-react';
import { IconCurrencyDollarSingapore } from '@tabler/icons-react';
import { IconCoins } from '@tabler/icons-react';
import { IconBuildingBank } from '@tabler/icons-react';
import { IconCash } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconDashboard,
  IconClipboardText,
  IconAdjustmentsAlt,
  IconUserDollar,
  IconFileTypePdf,
  IconBrandCashapp,
  IconCurrencyDollarSingapore,
  IconCoins,
  IconBuildingBank,
  IconCash
};

const generalDash = {
  id: 'cashier-pannel',
  title: 'Cashier Pannel',
  type: 'group',
  children: [
    {
      id: 'cashier',
      title: 'Cashier',
      type: 'item',
      url: '/cashier',
      permissionCode: '',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'create-loan',
      title: 'New Loan',
      type: 'item',
      url: '/create-loan',
      permissionCode: '',
      icon: icons.IconClipboardText,
      breadcrumbs: false
    },
    {
      id: 'create-continue-loan',
      title: 'Continue Loan',
      type: 'item',
      url: '/create-continue-loan',
      permissionCode: '',
      icon: icons.IconClipboardText,
      breadcrumbs: false
    },
    {
      id: 'cash-book',
      title: 'Cash Book',
      type: 'item',
      url: '/cash-book',
      permissionCode: '',
      icon: icons.IconCash,
      breadcrumbs: false
    },
    {
      id: 'bank-book',
      title: 'Bank Book',
      type: 'item',
      url: '/bank-book',
      permissionCode: '',
      icon: icons.IconBuildingBank,
      breadcrumbs: false
    },
    {
      id: 'create-deposit-account',
      title: 'New Deposit Account',
      type: 'item',
      url: '/create-deposit-account',
      permissionCode: '',
      icon: icons.IconCoins,
      breadcrumbs: false
    },
  ]
};

export default generalDash;
