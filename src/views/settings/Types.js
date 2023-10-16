/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TabList, TabPanel } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import { Grid, Tab } from '@mui/material'; // Corrected import path
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';

import DepositType from './DepositType';
import LoanType from './LoanType';

import { Box } from '@mui/system';

const UserPermissionSettingsMainPage = () => {
  const [value, setValue] = useState('1');
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (_event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('selectedTab');
    if (storedValue) {
      setValue(storedValue);
      setIsLoading(false);
    } else {
      setIsLoading(false); // If no stored value, set loading to false
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTab', value);
  }, [value]);

  return (
    <MainCard>
      <Grid container>
        <Grid item xs={12}>
          {/* TabList with tabs */}
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange}>
                <Tab icon={<RequestQuoteIcon />} label="Deposit Types" value="1" />
                <Tab icon={<AttachMoneyIcon />} label="Loan Types" value="2" />
              </TabList>
            </Box>
          </TabContext>
        </Grid>
        <Grid item xs={12}>
          {/* TabPanels with content */}
          <TabContext value={value}>
            <TabPanel value="1" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <DepositType />
            </TabPanel>
            <TabPanel value="2" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <LoanType />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UserPermissionSettingsMainPage;
