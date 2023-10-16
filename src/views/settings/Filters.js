/* eslint-disable react/prop-types */
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from '@mui/icons-material/Category';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AddRoadIcon from '@mui/icons-material/AddRoad';

import { TabList, TabPanel } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import { Grid, Tab } from '@mui/material'; // Corrected import path
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';

import Terms from './Terms';
import Target from './Target';
import Category from './Category';
import Route from './Route';

import { Box } from '@mui/system';

const UserPermissionSettingsMainPage = () => {
  const [value, setValue] = useState('1');

  const handleTabChange = (_event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('selectedTab');
    if (storedValue) {
      setValue(storedValue);
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
                <Tab icon={<EventNoteIcon />} label="Terms" value="1" />
                <Tab icon={<AdsClickIcon />} label="Targets" value="2" />
                <Tab icon={<CategoryIcon />} label="Category" value="3" />
                <Tab icon={<AddRoadIcon />} label="Route" value="4" />
              </TabList>
            </Box>
          </TabContext>
        </Grid>
        <Grid item xs={12}>
          {/* TabPanels with content */}
          <TabContext value={value}>
            <TabPanel value="1" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <Terms />
            </TabPanel>
            <TabPanel value="2" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <Target />
            </TabPanel>
            <TabPanel value="3" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <Category />
            </TabPanel>
            <TabPanel value="4" sx={{ margin: '10px 0px 0px 0px', padding: 0 }}>
              <Route />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UserPermissionSettingsMainPage;
