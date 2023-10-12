/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const MonthCalendar = (props) => {
  const { setData, data } = props;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const [daterange, setDateRange] = useState(true);

  const handleDateClick = (date) => {
    if (daterange && date.length === 2) {
      generatedata(date);
      setSelectedStartDate(date[0]);
      setSelectedEndDate(date[1]);
    } else {
      const endDate = new Date(date);
      setDateRange(true);
      setSelectedStartDate(endDate);
    }
  };

  const generatedata = (date) => {
    const months = [];
    console.log(date);
    let currentDate = new Date(date[0]);
    let end = new Date(date[1]);
    let count = 1;

    // Move to the next month to avoid including the start month
    currentDate.setMonth(currentDate.getMonth() + 1);

    while (currentDate <= end) {
      const monthStartDate = new Date(currentDate);
      const monthEndDate = new Date(currentDate);

      // Set to the last day of the current month
      monthEndDate.setMonth(monthEndDate.getMonth() + 1, 0);

      // If the end of the month is beyond the selected end date, adjust it
      if (monthEndDate > end) {
        monthEndDate.setDate(end.getDate());
      }

      months.push({
        index: count,
        monthNumber: monthStartDate.getMonth() + 1, // Adding 1 to get 1-based month number
        monthAndYear: `${monthStartDate.toLocaleDateString('en-US', { month: 'long' })} ${monthStartDate.getFullYear()}`,
        startDate: new Date(monthStartDate), // Create a new Date object to avoid reference issues
        endDate: new Date(monthEndDate) // Create a new Date object to avoid reference issues
      });

      currentDate.setMonth(currentDate.getMonth() + 1, 1); // Move to the first day of the next month
      count++;
    }

    console.log(months);

    setData(months);
  };

  const handleClearAll = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setData([]);
    setDateRange(true);
  };

  const handleDropdownChange = (event) => {
    const { value } = event.target;
    setNumberOfMonths(value);
  };

  const handleCheckboxChange = () => {
    setDateRange(!daterange);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setData([]);
  };

  const handleClick = () => {
    const MIN_MONTHS = 1; // Minimum allowed number of months

    if (selectedStartDate && numberOfMonths >= MIN_MONTHS) {
      const endDate = new Date(selectedStartDate);
      endDate.setMonth(parseInt(endDate.getMonth(), 10) + parseInt(numberOfMonths, 10));

      // You may want to adjust the logic to handle cases where the end date goes into the next year
      // For simplicity, the following logic assumes that each "month" is exactly 30 days
      console.log(endDate);
      const getdate = [selectedStartDate, endDate];
      handleDateClick(getdate);
    } else {
      toast.warn(`Please enter a valid number of months (minimum ${MIN_MONTHS})`, {
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
    <Grid container spacing={2}>
      {/* Left side - Calendar */}
      <Grid item xs={12} md={6}>
        <Calendar
          onChange={handleDateClick}
          selectRange={daterange}
          value={selectedStartDate && selectedEndDate ? [selectedStartDate, selectedEndDate] : null}
        />
        <Grid container spacing={2} style={{ paddingTop: '30px' }}>
          <Grid item xs={12} md={4}>
            <FormControlLabel control={<Checkbox checked={daterange} onChange={handleCheckboxChange} />} label="Date Range" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Number of Months"
              disabled={daterange}
              variant="outlined"
              type="number"
              value={numberOfMonths}
              onChange={handleDropdownChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" color="secondary" onClick={handleClick}>
              Find Months
            </Button>
          </Grid>
        </Grid>
        <div style={{ paddingTop: '15px' }}>
          <Button variant="contained" color="secondary" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </Grid>

      {/* Right side - Month Table */}
      <Grid item xs={12} md={6}>
        {data.length > 0 && (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Month Number</TableCell>
                  <TableCell>Month </TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((month) => (
                  <TableRow key={`${month.index}-${month.monthNumber}`}>
                    <TableCell>{month.index}</TableCell>
                    <TableCell>{month.monthNumber}</TableCell>
                    <TableCell>{month.monthAndYear}</TableCell>
                    <TableCell>{month.startDate.toLocaleDateString()}</TableCell>
                    <TableCell>{month.endDate.toLocaleDateString()}</TableCell>
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

MonthCalendar.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      monthNumber: PropTypes.number.isRequired,
      monthAndYear: PropTypes.string.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired
    })
  ).isRequired
};

export default MonthCalendar;
