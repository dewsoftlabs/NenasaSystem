/* eslint-disable no-unused-vars */
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/FullPageLayout';
import Loadable from 'ui-component/Loadable';

// utilities routing
const UserSettings = Loadable(lazy(() => import('views/settings/UserSettings')));
const PermissionSettings = Loadable(lazy(() => import('views/settings/PermissionSettings')));
const UserroleSettings = Loadable(lazy(() => import('views/settings/UserRoleSettings')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/settings',
      element: <UserSettings />
    },
    {
      path: '/userrole-settings',
      element: <UserroleSettings />
    },
    {
      path: '/permission-settings',
      element: <PermissionSettings />
    },
    {
      path: 'user-settings',
      children: [
        {
          path: '/user-settings',
          element: <UserSettings />
        }
      ]
    }
  ]
};

export default MainRoutes;
