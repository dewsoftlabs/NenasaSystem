// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from '../../../MainLayout/Sidebar/MenuList/NavGroup';
import menuItem from 'menu-items/cashier';
import { hasPermission, getUserRoleID } from '../../../../session';
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    console.log(item.children.some((child) => child.permissionCode));
    if (
      item.children.some((child) => child.permissionCode == '' || hasPermission(child.permissionCode)) ||
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
  });

  return <>{navItems}</>;
};

export default MenuList;
