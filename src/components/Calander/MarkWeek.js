import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

// Utility function to get the week number for a given date
const getWeekNumber = (date) => {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const WeekCalendar = ({ setData, data }) => {
  const theme = useTheme();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState(0);
  const [daterange, setDateRange] = useState(true);

  const handleDateClick = (date) => {
    if (daterange && date.length === 2) {
      generateWeekData(date);
      setSelectedStartDate(date[0]);
      setSelectedEndDate(date[1]);
    } else {
      const endDate = new Date(date);
      setDateRange(true);
      setSelectedStartDate(endDate);
    }
  };

  const generateWeekData = (date) => {
    const weeks = [];
    let currentDate = new Date(date[0]);
    let end = new Date(date[1]);
    let count = 0;

    // Move to the next week from the selected date
    currentDate.setDate(currentDate.getDate() + 7);

    while (currentDate <= end) {
      const weekStartDate = new Date(currentDate);
      const weekEndDate = new Date(currentDate);

      // Set to the last day (Sunday) of the current week
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      // If the end of the week is beyond the selected end date, adjust it
      if (weekEndDate > end) {
        weekEndDate.setDate(end.getDate());
      }

      weeks.push({
        index: count,
        weekNumber: getWeekNumber(weekStartDate),
        startDate: new Date(weekStartDate), // Create a new Date object to avoid reference issues
        endDate: new Date(weekEndDate) // Create a new Date object to avoid reference issues
      });

      currentDate.setDate(currentDate.getDate() + 7);
      count++;
    }

    console.log(weeks);

    setData(weeks);
  };

  const handleClearAll = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setData([]);
    setDateRange(true);
  };

  const handleDropdownChange = (event) => {
    const { value } = event.target;
    setNumberOfWeeks(value);
  };

  const handleCheckboxChange = () => {
    setDateRange(!daterange);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setData([]);
  };

  const handleClick = () => {
    if (selectedStartDate && numberOfWeeks > 0) {
      const startWithOffset = new Date(selectedStartDate);
      const startDate = new Date(selectedStartDate);
      let weekCount = 0;

      // Move to the next week from the selected start date
      startWithOffset.setDate(startWithOffset.getDate() + 7);

      // Increment the week count until it reaches the desired number of weeks
      while (weekCount < numberOfWeeks - 1) {
        // Move to the next week
        startWithOffset.setDate(startWithOffset.getDate() + 7);

        // Increment the week count
        weekCount++;
      }

      // Calculate the end date
      const endDate = new Date(startWithOffset);
      endDate.setDate(endDate.getDate() + 6);

      setSelectedEndDate(endDate);

      const getdate = [startDate, endDate];
      handleDateClick(getdate);
    } else if (numberOfWeeks === 0) {
      toast.warn('Please enter the number of weeks ', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else {
      toast.warn('Please select the start date ', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <Grid container spacing={2} style={{ paddingBottom: '20px' }}>
      {/* Left side - Calendar */}
      <Grid item xs={12} md={6}>
        <Calendar
          onChange={handleDateClick}
          style={{
            // Your styles here
            // For example:
            borderRadius: '5px',
            backgroundColor: '#ffcccb',
            color: '#fff'
          }}
          selectRange={daterange}
          value={selectedStartDate && selectedEndDate ? [selectedStartDate, selectedEndDate] : null}
        />
        <Grid container spacing={2} style={{ paddingTop: '30px' }}>
          <Grid item xs={12} md={4}>
            <FormControlLabel control={<Checkbox checked={daterange} onChange={handleCheckboxChange} />} label="Date Range" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Number of Weeks"
              disabled={daterange}
              variant="outlined"
              type="number"
              value={numberOfWeeks}
              onChange={handleDropdownChange}
              InputLabelProps={{
                style: {
                  color: theme.palette.text.primary
                }
              }}
              InputProps={{
                style: {
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.text.primary
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
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
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.text['primary'],
                  backgroundColor: theme.palette.background['paper']
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Find Weeks
            </Button>
          </Grid>
        </Grid>
        <div style={{ paddingTop: '15px' }}>
          <Button variant="contained" color="primary" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </Grid>

      {/* Right side - Week Table */}
      <Grid item xs={12} md={6}>
        {data.length > 0 && (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Week Number</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((week) => (
                  <TableRow key={`${week.index}-${week.weekNumber}`}>
                    <TableCell>{week.index}</TableCell>
                    <TableCell>{week.weekNumber}</TableCell>
                    <TableCell>{week.startDate.toLocaleDateString()}</TableCell>
                    <TableCell>{week.endDate.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

WeekCalendar.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      weekNumber: PropTypes.number.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired
    })
  ).isRequired
};

export default WeekCalendar;