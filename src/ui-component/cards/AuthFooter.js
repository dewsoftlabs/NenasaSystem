// material-ui
import { Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();
  
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="subtitle2">Nenasa Investment &copy; {currentYear}. All Rights Reserved</Typography>
    </Stack>
  );
};

export default AuthFooter;
