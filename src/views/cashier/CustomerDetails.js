/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { Button, Grid, Typography } from '@mui/material';
import Axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { getToken, logout } from '../../session';

const Details = (prop) => {
  const { getcustomerdeposit, getcustomerdetails } = prop;

  const [customerdetails, setCustomerDetails] = useState(getcustomerdetails);
  const [customerdeposit, setCustomerDeposit] = useState(getcustomerdeposit);

  console.log(customerdetails)

  return (
    <Grid container spacing={2} style={{ paddingTop: '30px' }}>
      {/* First Column */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h3">
          <strong>Personal Information</strong>
          <a className="text-link" href="#">
            <strong style={{ fontSize: '12px', paddingLeft: '10px' }}>Edit Customer</strong>
          </a>
        </Typography>
        {customerdetails.length > 0 && (
          <>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Full Name:</strong> {customerdetails[0].customer_name}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Phone Number:</strong> <a href={`tel:${customerdetails[0].customer_phone}`}>{customerdetails[0].customer_phone}</a>
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Address:</strong> {customerdetails[0].customer_address}
            </Typography>
            {customerdetails[0].customer_email && (
              <Typography variant="body1" style={{ marginTop: '20px' }}>
                <strong>Email:</strong> <a href={`mailto:${customerdetails[0].email}`}>{customerdetails[0].customer_email}</a>
              </Typography>
            )}
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Gender:</strong> {customerdetails[0].customer_gender}
            </Typography>
            {customerdetails.length > 0 && (
              <Typography variant="body1" style={{ marginTop: '20px' }}>
                <strong>Branch:</strong> {customerdetails[0].branch_name}
              </Typography>
            )}
            {customerdetails.length > 0 && (
              <Typography variant="body1" style={{ marginTop: '20px' }}>
                <strong>Role:</strong> {customerdetails[0].route_name}
              </Typography>
            )}
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>NIC:</strong> {customerdetails[0].customer_nic}
            </Typography>
          </>
        )}
      </Grid>

      {/* Second Column */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Typography variant="h3">
          <strong>Deposit Account Information</strong>
          {customerdeposit.length > 0 && (
            <a className="text-link" href="#">
              <strong style={{ fontSize: '12px', paddingLeft: '10px' }}>Edit account</strong>
            </a>
          )}
        </Typography>
        {customerdeposit.length > 0 ? (
          <>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Account Number:</strong> #{customerdeposit[0].deposit_acc_no && <>{customerdeposit[0].deposit_acc_no}</>}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Deposit Account Type:</strong> {customerdeposit[0].depositType_name && <>{customerdeposit[0].depositType_name}</>}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Hold start Date:</strong> {customerdeposit[0].hold_startDate && <>{customerdeposit[0].hold_startDate}</>}
            </Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
              <strong>Hold Period:</strong> {customerdeposit[0].hold_period && <>{customerdeposit[0].hold_period}</>}
            </Typography>
            <Grid item xs={12} sx={{ pt: 2 }}>
              <Button variant="contained" color="secondary" style={{ marginBottom: '10px' }}>
                Make Deposit
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sx={{ pt: 2 }}>
              <Typography variant="h5" sx={{ color: 'error.main' }}>
                <strong>
                  <i>Deposit Account not Found</i>
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ pt: 2 }}>
              <Button variant="contained" style={{ marginBottom: '10px' }}>
                Create Deposit Account
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Details;
