import { Typography, Grid, TextField, Button, Divider, Paper, Box } from '@mui/material';
import { makeStyles } from '@mui/system'; // Use @mui/system instead of @mui/styles

import MainCard from 'ui-component/cards/MainCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  saveButton: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

const SettingsMainPage = () => {
  const classes = useStyles();

  return (
    <MainCard title="Settings">
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.section}>
          <Typography variant="h5">General Settings</Typography>
          <Divider className={classes.divider} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" className={classes.saveButton}>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.section}>
          <Typography variant="h5">Security Settings</Typography>
          <Divider className={classes.divider} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Current Password" variant="outlined" type="password" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="New Password" variant="outlined" type="password" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" className={classes.saveButton}>
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.section}>
          <Typography variant="h5">Privacy Settings</Typography>
          <Divider className={classes.divider} />
          <Paper elevation={3} variant="outlined">
            <Box p={2}>
              <Typography variant="body1">Privacy options and settings go here.</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SettingsMainPage;
