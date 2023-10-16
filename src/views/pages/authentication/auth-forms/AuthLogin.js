import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
  // useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setToken, setUserid, setUserRoleID, getToken, setUserBranchID } from '../../../../session';

// import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const Login = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_ENDPOINT + '/user/login', {
        username,
        password
      });

      // Handle the response here, e.g., store the user token in localStorage or state
      const { token, userid, branchid, userroleid } = response.data;
      // You can also redirect the user to another page upon successful login
      // history.push('/dashboard');

      return { success: true, token, userid, branchid, userroleid };
    } catch (error) {
      // Handle login error here
      return { success: false, error: error.error };
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const { username, password } = values;
            const { success, token, userid, branchid, userroleid, error } = await loginUser(username, password);

            if (success) {
              setToken(token);
              setUserRoleID(userroleid);
              setUserid(userid);
              setUserBranchID(branchid);
              // eslint-disable-next-line prettier/prettier
              if (getToken()) {
                navigate('/dashboard');
              }
            } else {
              // Handle login error, e.g., display an error message
              setStatus({ success: false });
              setErrors({ submit: error });
            }

            setSubmitting(false);
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="text"
                value={values.username}
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Username"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background['paper'],
                    borderColor: `${theme.palette.text.primary} !important`,

                    '& fieldset': {
                      borderColor: `${theme.palette.text.primary} !important`
                    },

                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  },
                  '& fieldset': {
                    borderColor: `${theme.palette.text.primary} !important`
                  },
                  '& .MuiOutlinedInput-input': {
                    color: theme.palette.text['primary'],
                    backgroundColor: theme.palette.background['paper'],
                    borderColor: `${theme.palette.text.primary} !important`
                  }
                }}
                inputProps={{}}
              />
              {touched.username && errors.username && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.username}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background['paper'],
                    borderColor: `${theme.palette.text.primary} !important`,

                    '& fieldset': {
                      borderColor: `${theme.palette.text.primary} !important`
                    },

                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  },
                  '& fieldset': {
                    borderColor: `${theme.palette.text.primary} !important`
                  },
                  '& .MuiOutlinedInput-input': {
                    color: theme.palette.text['primary'],
                    backgroundColor: theme.palette.background['paper'],
                    borderColor: `${theme.palette.text.primary} !important`
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
