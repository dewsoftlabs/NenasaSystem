import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import FullPageRoute from './FullPageRoute';
import CahierPannel from './CahierPannel';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, FullPageRoute, CahierPannel, AuthenticationRoutes]);
}
