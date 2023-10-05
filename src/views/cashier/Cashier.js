/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Button, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import Axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainCard from 'ui-component/cards/MainCard';
import { getToken, logout } from '../../session';
import _debounce from 'lodash/debounce';

const Cashier = () => {
  const [items, setItems] = useState([]);
  const [customerdetails, setCustomerDetails] = useState([]);
  const [customerdeposit, setCustomerDeposit] = useState([]);
  const [search, setSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false); // Control the visibility of the Autocomplete dropdown

  // Create a ref to the Autocomplete component
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Create a timer to delay fetching data after typing stops
    const timer = setTimeout(() => {
      if (typedText) {
        fetchData();
      }
    }, 500); // Adjust the delay as needed

    // Clear the timer if the user continues typing
    return () => clearTimeout(timer);
  }, [typedText]);

  useEffect(() => {
    // Clear the search results when typedText is empty
    if (!typedText) {
      setItems([]);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [typedText]);

  useEffect(() => {
    // Add a click event listener to the document to handle clicks outside of the component
    const handleDocumentClick = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        // Click occurred outside of the Autocomplete component
        setTypedText('');
        setIsAutocompleteOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setSearch(true);
      const response = await Axios.get(process.env.REACT_APP_API_ENDPOINT + '/customer/search/' + typedText, {
        headers: { 'x-token': getToken() }
      });

      if (response.status === 200) {
        setItems(response.data);

        setIsAutocompleteOpen(true); // Open the Autocomplete dropdown when data is available
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
      setSearch(false);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      }
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setTypedText(newText);
    setIsAutocompleteOpen(!!newText); // Toggle the Autocomplete dropdown based on whether there's text
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedItem(newValue);
    fetchCustomerData(newValue.customer_id);
  };

  const fetchCustomerData = async (customer_id) => {
    try {
      setIsLoading(true);
      const [customerDetailsResponse, customerDepositResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/customer/all/' + customer_id, { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/depositAcc/customer/' + customer_id, { headers: { 'x-token': getToken() } })
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
  };

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
                    ref={inputRef}
                  />
                )}
                // Set a ref to the Autocomplete component
                ref={autocompleteRef}
                noOptionsText={<span style={{ color: '#000', background: '#fff' }}>{search ? 'Searching..' : 'Not Found'}</span>}
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
      <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <hr />
      </div>
      {isLoading == false && (
        <>
          {selectedItem && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Button variant="contained" style={{ marginBottom: '10px' }}>
                    More Information
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Button variant="contained" style={{ marginBottom: '10px' }}>
                    Continue Loan
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                  <Button variant="contained" style={{ marginBottom: '10px' }}>
                    More Information
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ paddingTop: '30px' }}>
                {/* First Column */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="h3">
                    <strong>Personal Information</strong>
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    <strong>Full Name:</strong> {selectedItem.customer_name}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    <strong>Phone Number:</strong> <a href={`tel:${selectedItem.customer_phone}`}>{selectedItem.customer_phone}</a>
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    <strong>Address:</strong> {selectedItem.customer_address}
                  </Typography>
                  {selectedItem.customer_email && (
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Email:</strong> <a href={`mailto:${selectedItem.email}`}>{selectedItem.customer_email}</a>
                    </Typography>
                  )}
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    <strong>Gender:</strong> {selectedItem.customer_gender}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    <strong>NIC:</strong> {selectedItem.customer_nic}
                  </Typography>

                </Grid>

                {/* Second Column */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {customerdeposit && (
                    <>
                      <Typography variant="h3">
                        <strong>Deposit Account Information</strong>
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '20px' }}>
                        <strong>Account Number:</strong> #{customerdeposit[0].deposit_acc_no}
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '20px' }}>
                        <strong>Deposit Account Type:</strong> {customerdeposit[0].depositType_name}
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '20px' }}>
                        <strong>Hold start Date:</strong> {customerdeposit[0].hold_startDate}
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '20px' }}>
                        <strong>Hold Period:</strong> {customerdeposit[0].hold_period}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </MainCard>
  );
};

export default Cashier;
