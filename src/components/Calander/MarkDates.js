import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const MarkedDatesCalendar = (props) => {
  const { setData, data } = props;
  const [selectedDate, setSelectedDate] = useState();

  const handleDateClick = (date) => {
    const updatedDates = data.includes(date) ? data.filter((d) => d !== date) : [...data, date];
    setData(updatedDates);
    setSelectedDate(date);
  };

  const handleDeleteDate = (date) => {
    const updatedDates = data.filter((d) => d !== date);
    setData(updatedDates);
  };

  const handleClearAll = () => {
    setData([]);
    setSelectedDate(null);
  };

  return (
    <Grid container spacing={2}>
      {/* Left side - Calendar */}
      <Grid item xs={12} md={6}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          onClickDay={handleDateClick}
          tileClassName={({ date }) => (data.includes(date) ? 'marked' : null)}
        />
        <div style={{ paddingTop: '15px' }}>
          <Button variant="contained" color="secondary" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </Grid>

      {/* Right side - Table with scroll */}
      <Grid item xs={12} md={6}>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((date) => (
                <TableRow key={date.toString()}>
                  <TableCell>{date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleDeleteDate(date)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Grid>
    </Grid>
  );
};

// Define PropTypes
MarkedDatesCalendar.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired
};

export default MarkedDatesCalendar;
