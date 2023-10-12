import React, { useCallback, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify'; // Import the ToastContainer component

import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import Routes from 'routes';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';

import { setShopDetails } from 'store/shop/shopActions';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const shopName = useSelector((state) => state.shop.shopname);
  const image = useSelector((state) => state.shop.logo);

  const fetchData = useCallback(async () => {
    try {
      const [responseData] = await Promise.all([Axios.get(process.env.REACT_APP_API_ENDPOINT + '/shop/getdata')]);

      if (responseData.status === 200) {
        dispatch(setShopDetails(responseData.data[0]));
      }
    } catch (error) {
      console.error('Axios Error:', error);
      handleErrorResponse(error);
    }
  }, [dispatch]);

  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
          <Helmet>
            <title>{shopName}</title>
            <link rel="icon" type="image/png" href={`${process.env.REACT_APP_API_ENDPOINT}/shop/getlogo/${image}`} sizes="16x16" />
            {/* Add more meta tags or links as needed */}
          </Helmet>
        </NavigationScroll>
        {/* Place the ToastContainer here */}
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
