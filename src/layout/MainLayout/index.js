/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/customization/actions';
import { useNavigate } from 'react-router-dom';

import { setUserDetails } from '../../store/user/userAction';

import { isAuthenticated, getUserid, getUserRoleID, logout, setPermissionCodes, getToken } from '../../session';
// assets
import { IconChevronRight } from '@tabler/icons';
import { useCallback, useEffect } from 'react';
import Axios from 'axios';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  const fetchUserPermission = useCallback(async () => {
    try {
      const currentUserID = getUserid(); // Assuming you have a function to get the user ID

      const response = await Axios.get(
        process.env.REACT_APP_API_ENDPOINT + '/userrole/permissionByroleid/' + currentUserID + '/' + getUserRoleID(),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-token': getToken()
          }
        }
      );

      if (response.status === 200) {
        // Extract permission codes from the response and store them in session storage
        const permissionCodes = response.data.map((item) => item.permission_code);
        setPermissionCodes(permissionCodes);
      } else {
        fetchUserPermission();
      }
    } catch (error) {
      logout();
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const currentUserID = getUserid(); // Assuming you have a function to get the user ID

      const response = await Axios.get(process.env.REACT_APP_API_ENDPOINT + '/user/me/' + currentUserID, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        dispatch(setUserDetails(response.data[0]));
      } else {
        fetchUser();
      }
    } catch (error) {
      logout();
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }

    fetchUser();

    if (getUserRoleID() != 1 && getUserRoleID() != 2) {
      fetchUserPermission();
    }
  }, [fetchUserPermission, fetchUser, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>
      <Customization />
    </Box>
  );
};

export default MainLayout;
