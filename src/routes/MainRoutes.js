/* eslint-disable no-unused-vars */
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing

const CustomerList = Loadable(lazy(() => import('views/pages/customer/CustomerList')));
const CreateLoan = Loadable(lazy(() => import('views/pages/loan/CreateLoan')));
const BranchGuranter = Loadable(lazy(() => import('views/pages/guranteer/BranchGuranter')));
const LoanList = Loadable(lazy(() => import('views/pages/loan/LoanList')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/customer-list',
      element: <CustomerList />
    },
    {
      path: '/apply-loan',
      element: <CreateLoan />
    },
    {
      path: '/guranteer',
      element: <BranchGuranter />
    },
    {
      path: '/loan-list',
      element: <LoanList />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '/dashboard',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
