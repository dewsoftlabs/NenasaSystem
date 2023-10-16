import { Link } from 'react-router-dom';

// material-ui
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { useSelector } from 'react-redux';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper1 from '../AuthWrapper1';
import AuthLogin from '../auth-forms/AuthLogin';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const shopName = useSelector((state) => state.shop.shopname);
  const image = useSelector((state) => state.shop.logo);

  const imageSrc = image && `${process.env.REACT_APP_API_ENDPOINT}/shop/getlogo/${image}`;

  return (
    <AuthWrapper1>
      <Grid
        style={{ backgroundColor: theme.palette.background.paper }}
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    {image && (
                      <Link style={{ display: 'flex', justifyContent: 'center' }} to="#">
                        <img
                          style={{ width: '30%', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
                          src={imageSrc}
                          alt="Logo"
                        />
                      </Link>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.text.primary} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Hi, Welcome Back to
                          </Typography>
                          <Typography color={theme.palette.text.primary} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            {shopName}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
