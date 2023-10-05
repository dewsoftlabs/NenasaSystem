/* eslint-disable no-unused-vars */
import { lazy } from 'react';

// project imports
import FullWidthPannel from 'layout/FullWidthPannel';
import Loadable from 'ui-component/Loadable';

// utilities routing
const CreateLoan = Loadable(lazy(() => import('views/pages/loan/CreateLoan')));
const Cashier = Loadable(lazy(() => import('views/cashier/Cashier')));
const ContinueLoan = Loadable(lazy(() => import('views/pages/loan/ContinueLoan')));

// ==============================|| MAIN ROUTING ||============================== //

const FullWidthPannelRoute = {
  path: '/',
  element: <FullWidthPannel />,
  children: [
    {
      path: '/cashier',
      element: <Cashier />
    },
    {
      path: '/create-loan',
      element: <CreateLoan />
    },
    {
      path: '/create-continue-loan',
      element: <ContinueLoan />
    }
  ]
};

export default FullWidthPannelRoute;
