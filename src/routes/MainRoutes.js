import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const Settings = Loadable(lazy(() => import('views/settings/SettingMain')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));

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
      path: 'dashboard',
      children: [
        {
          path: '/dashboard',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'settings',
      children: [
        {
          path: '/settings',
          element: <Settings />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    }

  ]
};

export default MainRoutes;
