/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, ThemeProvider, Typography } from '@mui/material';
import { generateCsv } from 'export-to-csv';
import { createTheme } from '@mui/material/styles';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

function SimpleTable(props) {
  const tableInstanceRef = useRef(null);

  const handleExportData = () => {
    const headersList = props.columns.filter((column) => column.accessorKey && column.export).map((column) => column.accessorKey);

    const data = props.dataSet.map((item) => {
      const rowData = {};

      headersList.forEach((header) => {
        if (header === 'status') {
          const formattedStatus = item[header] === 1 ? 'Active' : 'Deactive';
          rowData[header] = formattedStatus;
        } else {
          rowData[header] = item[header];
        }
      });

      return rowData;
    });

    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: headersList
    };

    const csvData = data.map((item) => {
      return headersList.map((header) => item[header]);
    });

    generateCsv(csvData, csvOptions);
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#fff'
      },
      background: {
        default: '#fff'
      }
    }
  });

//   const handleOpen = () => {
//     setIsOpen(true);
//   };

  const handleSaveRow = ({ exitEditingMode, row, values }) => {
    const rowDataID = row[props.idName];
    props.handleSaveRow({ exitEditingMode, rowDataID, values });
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  useEffect(() => {
    // Do something when the pagination state changes
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable
        columns={props.columns}
        data={props.dataSet}
        onPaginationChange={setPagination}
        initialState={{ density: 'compact' }}
        getRowId={(row) => row[props.idName]}
        enableEditing
        enablePagination={true}
        positionPagination="top"
        editingMode="row"
        enableRowSelection
        state={{
          isLoading: props.isLoading,
          pagination
        }}
        onEditingRowSave={handleSaveRow}
        enableClickToCopy={props.enableClickToCopy}
        enableRowNumbers={props.enableRowNumbers}
        tableInstanceRef={tableInstanceRef}
        enableRowActions={props.rowAction}
        renderRowActionMenuItems={props.renderRowActionMenuItems}
      />
    </ThemeProvider>
  );
}

export default SimpleTable;
