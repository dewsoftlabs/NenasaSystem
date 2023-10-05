// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { hasPermission, getUserRoleID } from '../../../../session';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (
      item.children.some((child) => child.permissionCode) ||
      hasPermission(item.children.map((child) => child.permissionCode)) ||
      getUserRoleID() == 1 ||
      getUserRoleID() == 2
    ) {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    }
    return null; // Add this line to handle the case where the conditions are not met
  });

  return <>{navItems}</>;
};

export default MenuList;
