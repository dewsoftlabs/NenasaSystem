/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Autocomplete, Grid, IconButton, LinearProgress, Tab, TextField } from '@mui/material';
import Axios from 'axios';
import MainCard from 'ui-component/cards/MainCard';
import { getToken, logout } from '../../session';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/system';
import CustomerDetails from './CustomerDetails';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';

const Cashier = () => {
  const theme = useTheme();
  const [value, setValue] = useState('1');
  const [items, setItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerDeposit, setCustomerDeposit] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [tabListFocused, setTabListFocused] = useState(false);

  const autocompleteRef = useRef(null);
  const tabListRef = useRef(null);
  const searchRef = useRef(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setSearching(true);

      const response = await Axios.get(`${process.env.REACT_APP_API_ENDPOINT}/customer/search/${typedText}`, {
        headers: { 'x-token': getToken() }
      });

      if (response.status === 200) {
        setItems(response.data);
        setIsAutocompleteOpen(true);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
      setSearching(false);
    }
  };

  const handleTabChange = (_event, newValue) => {
    setValue(newValue);
  };

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case '1':
      case '2':
      case '3':
        setValue(event.key);
        tabListRef.current.focus();
        break;
      case 'Escape':
        console.log('here');
        setTypedText('');
        break;
      default:
        break;
    }
  }, []);

  const handleFocus = useCallback(() => {
    setValue('1');
  }, []);

  const handleShortcut = useCallback(
    (event) => {
      if (event.key === 'F2') {
        event.preventDefault();
        setTypedText('');
        setIsAutocompleteOpen(false);

        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    },
    [setTypedText, setIsAutocompleteOpen, searchRef]
  );

  useEffect(() => {
    const storedValue = localStorage.getItem('selectedTab');
    if (storedValue) {
      setValue(storedValue);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTab', value);
  }, [value]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focus', handleFocus);
    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focus', handleFocus);
      document.removeEventListener('keydown', handleShortcut);
      setTabListFocused(false);
    };
  }, [handleKeyDown, handleFocus, handleShortcut]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typedText) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [typedText]);

  useEffect(() => {
    if (!typedText) {
      setItems([]);
    }
  }, [typedText]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setTypedText('');
        setIsAutocompleteOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleErrorResponse = (error) => {
    if (error.response && error.response.status === 401) {
      window.location.reload();
      logout();
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setTypedText(newText);
    setIsAutocompleteOpen(!!newText);
  };

  const handleAutocompleteChange = (event, newValue) => {
    setCustomerDeposit([]);
    setCustomerDetails([]);
    setSelectedItem(newValue);

    if (newValue.customer_id != null) {
      fetchCustomerData(newValue.customer_id);
    }
  };

  const fetchCustomerData = useCallback(async (customerId) => {
    try {
      setIsLoading(true);
      const [customerDetailsResponse, customerDepositResponse] = await Promise.all([
        Axios.get(`${process.env.REACT_APP_API_ENDPOINT}/customer/all/${customerId}`, { headers: { 'x-token': getToken() } }),
        Axios.get(`${process.env.REACT_APP_API_ENDPOINT}/depositAcc/customer/${customerId}`, { headers: { 'x-token': getToken() } })
      ]);

      if (customerDetailsResponse.status === 200) {
        setCustomerDetails(customerDetailsResponse.data);
      }
      if (customerDepositResponse.status === 200) {
        setCustomerDeposit(customerDepositResponse.data);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <MainCard>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px', marginBottom: '30px' }}>
        {isLoading && <LinearProgress style={{ width: '100%' }} color="primary" />}
      </div>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Autocomplete
                id="item-select-demo"
                options={items}
                value={selectedItem}
                onChange={handleAutocompleteChange}
                autoHighlight
                getOptionLabel={(option) => `${option.customer_name} - ${option.customer_nic}`}
                open={isAutocompleteOpen && !!typedText}
                onOpen={() => {
                  if (!!typedText) {
                    setIsAutocompleteOpen(true);
                  }
                }}
                onClose={() => setIsAutocompleteOpen(false)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search by Name or NIC"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                    onChange={handleTextChange}
                    value={typedText}
                    inputRef={searchRef}
                    style={{
                      backgroundColor: theme.palette.background['paper']
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background['paper'],
                    borderColor: theme.palette.primary['main'],

                    '& fieldset': {
                      borderColor: theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    color: theme.palette.text['primary'],
                    backgroundColor: theme.palette.background['paper']
                  }
                }}
                ref={autocompleteRef}
                noOptionsText={
                  <span style={{ color: theme.palette.primary.main, background: theme.palette.background['paper'] }}>
                    {searching ? 'Searching..' : 'Not Found'}
                  </span>
                }
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
      <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <hr />
      </div>
      {isLoading === false && selectedItem && (
        <>
          <Grid item xs={12}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList ref={tabListRef} autoFocus={tabListFocused} onChange={handleTabChange} onKeyDown={handleKeyDown}>
                  <Tab label="Details" value="1" />
                  <Tab label="Current Loan" value="2" />
                  <Tab label="Current History" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </Grid>
          <Grid item xs={12}>
            <TabContext value={value}>
              <TabPanel value="1" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
                <CustomerDetails getcustomerdetails={customerDetails} getcustomerdeposit={customerDeposit} />
              </TabPanel>
              <TabPanel value="2" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}></TabPanel>
              <TabPanel value="3" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}></TabPanel>
            </TabContext>
          </Grid>
        </>
      )}
    </MainCard>
  );
};

export default Cashier;
