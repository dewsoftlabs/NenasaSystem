/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, MenuItem, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { MaterialReactTable } from 'material-react-table';
import { useEffect, useRef, useState } from 'react';
import { ExportToCsv } from 'export-to-csv';
import { hasPermission, getUserRoleID } from '../../session';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import logosrc from '../../assets/images/logo.jpg';

import { IconFileSpreadsheet, IconPlus, IconPdf, IconTrash } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function SimpleTable(props) {
  const tableInstanceRef = useRef(null);
  const { tableSettings } = props;

  const history = useNavigate();

  const shopName = useSelector((state) => state.shop.shopname);
  const image = useSelector((state) => state.shop.logo);

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

    // Define CSS styles for formatting
    const greenText = 'style="color: green; font-weight: bold;"';
    const redText = 'style="color: red; font-weight: bold;"';

    // Apply styles to status values
    const formattedData = data.map((item) => {
      const formattedItem = { ...item };

      if (item.status) {
        formattedItem.status = item.status === 'Active' ? `<span ${greenText}>Active</span>` : `<span ${redText}>Deactive</span>`;
      }

      return formattedItem;
    });

    // Generate the current date as a string (e.g., "2023-09-13")
    const currentDate = new Date().toISOString().split('T')[0];

    // Construct the filename with the current date
    const filename = `${tableSettings.table}-${currentDate}.csv`;

    if (formattedData.length > 0) {
      const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: headersList,
        filename: filename // Use the constructed filename
      };

      const csvExporter = new ExportToCsv(csvOptions);
      csvExporter.generateCsv(formattedData);
    } else {
      // Handle the case where there is no data to export
      showToast('No data to export to CSV.', 'warn');
    }
  };

  const handleExportPDF = async () => {
    const headersList = props.columns.filter((column) => column.accessorKey && column.export).map((column) => column.accessorKey);

    const data = props.dataSet.map((item) => {
      const rowData = {};

      headersList.forEach((header) => {
        if (header == 'status') {
          const formattedStatus = item[header] == 1 ? 'Active' : 'Deactive';
          rowData[header] = formattedStatus;
        } else {
          rowData[header] = item[header];
        }
      });

      return rowData;
    });

    const doc = new jsPDF();

    console.log(image);

    const robotoFontUrl = 'https://fonts.googleapis.com/css2?family=Roboto&family=Varela+Round&display=swap';
    try {
      const logo = await loadImage(`${process.env.REACT_APP_API_ENDPOINT}/shop/getlogo/${image}`);

      const logoWidth = 20; // Adjust the logo width as needed
      const logoHeight = 20;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const textWidth = doc.getStringUnitWidth(`Table - ${tableSettings.table}`);
      const textX = (pageWidth - textWidth * doc.internal.getFontSize()) / 2;

      // Draw a border around the entire page
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
      doc.rect(5, 5, pageWidth - 10, 30);

      // Generate a PDF with the formatted data
      // Determine the image format based on the file extension
      const imageFormat = image.endsWith('.jpg') || image.endsWith('.jpeg') ? 'JPEG' : 'PNG';

      doc.addImage(logo, imageFormat, 10, 8, logoWidth, logoHeight);
      doc.setFontSize(14);
      doc.setFont('Roboto', 'normal');
      doc.text(shopName, 35, 22);
      doc.text(`${tableSettings.table} Report`, 35, 28);
      doc.setFont('Roboto', 'normal');

      // Capitalize the first letter of each header
      const capitalizedHeadersList = headersList.map((header) => header.charAt(0).toUpperCase() + header.slice(1));

      if (data.length > 0) {
        const dataForPDF = data.map((item) => {
          return headersList.map((header) => item[header]);
        });

        doc.autoTable({
          head: [capitalizedHeadersList], // Use the capitalized headers
          body: dataForPDF,
          startY: 50
        });

        // Save the PDF
        doc.save(`${tableSettings.table}.pdf`);
      } else {
        // Handle the case where there is no data to export
        showToast('No data to export to PDF.', 'warn');
      }
    } catch (error) {
      console.error('Error loading image:', error);
      showToast('Error loading image.', 'error');
    }
  };

  const loadImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
  };

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    const rowDataID = row.id;
    props.updateData(rowDataID, values); // Pass the supplier_id from the row and the updated values
    exitEditingMode(); // Exit editing mode after successful update
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  useEffect(() => {
    // Do something when the pagination state changes
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <MaterialReactTable
      columns={props.columns}
      data={props.dataSet}
      initialState={{ density: 'compact' }}
      getRowId={(row) => row[tableSettings.idName]}
      enableEditing={tableSettings.editing.enableEditing}
      editingMode={tableSettings.editing.editionMode}
      enablePagination={tableSettings.pagination.enablePagination}
      positionPagination={tableSettings.pagination.positionPagination}
      enableRowSelection={tableSettings.delete.deleteType == 'multiple' || tableSettings.delete.deleteType === 'mix' ? true : false}
      state={{
        isLoading: props.isLoading,
        pagination
      }}
      muiToolbarAlertBannerChipProps={{
        sx: (theme) => ({
          backgroundColor: theme.palette.background['paper']
        })
      }}
      muiTopToolbarProps={{
        sx: (theme) => ({
          '& button': {
            color: theme.palette.text.primary
          }
        })
      }}
      muiTableProps={{
        sx: (theme) => ({
          '& button': {
            color: theme.palette.text.primary
          },
          '& svg': {
            color: theme.palette.text.primary
          }
        })
      }}
      onPaginationChange={setPagination}
      renderTopToolbarCustomActions={({ table }) => (
        <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
          {(hasPermission(tableSettings.add.permissionCode) || getUserRoleID() == 1 || getUserRoleID() == 2) &&
            tableSettings.add.enableAddButton == true && (
              <div>
                <Button
                  style={{ color: '#000', backgroundColor: '#ffffff' }}
                  onClick={() => {
                    props.handleAddForm();
                  }}
                  startIcon={<IconPlus />}
                  variant="contained"
                >
                  {tableSettings.add.addButtonText ? tableSettings.add.addButtonText : 'Add New'}
                </Button>
              </div>
            )}
          {(hasPermission(tableSettings.delete.permissionCode) || getUserRoleID() == 1 || getUserRoleID() == 2) &&
            (tableSettings.delete.deleteType == 'multiple' || tableSettings.delete.deleteType === 'mix') && (
              <div>
                <Button
                  style={{ color: '#000', backgroundColor: '#fff' }}
                  onClick={() => {
                    props.deleteOpen(tableInstanceRef.current?.getSelectedRowModel().rows);
                  }}
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  variant="contained"
                >
                  {tableSettings.delete.deleteText ? tableSettings.delete.deleteText : 'Delete'}
                </Button>
              </div>
            )}
          {tableSettings.enableCSVExport && (
            <div>
              <Button
                style={{ color: '#000', backgroundColor: '#fff' }}
                onClick={handleExportData}
                startIcon={<IconFileSpreadsheet />}
                variant="contained"
              >
                CSV / Excel
              </Button>
            </div>
          )}
          {tableSettings.enablepdf && (
            <div>
              <Button
                style={{ color: '#000', backgroundColor: '#fff' }}
                onClick={handleExportPDF}
                startIcon={<IconPdf />}
                variant="contained"
              >
                PDF
              </Button>
            </div>
          )}
        </Box>
      )}
      muiTableBodyRowProps={
        tableSettings.row.rowSelect &&
        (({ row }) => ({
          onClick: () => {
            history(tableSettings.row.rowRedirect + row.id);
          },
          sx: {
            cursor: tableSettings.row.rowSelect ? 'pointer' : 'default'
          }
        }))
      }
      onEditingRowSave={handleSaveRow}
      renderRowActionMenuItems={
        tableSettings.editing.actionMenu.enableActionMenu ||
        tableSettings.delete.deleteType === 'single' ||
        tableSettings.delete.deleteType === 'mix'
          ? ({ row, closeMenu }) => {
              const deleteMenuItem =
                (hasPermission(tableSettings.delete.permissionCode) || getUserRoleID() == 1 || getUserRoleID() == 2) &&
                (tableSettings.delete.deleteType === 'single' || tableSettings.delete.deleteType === 'mix') ? (
                  <MenuItem
                    key={1}
                    onClick={() => {
                      props.deleteOpen(row.id);
                      closeMenu();
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <IconTrash /> Delete
                  </MenuItem>
                ) : null;

              const actionMenuItems = tableSettings.editing.actionMenu.actionMenudata.map((menuItem, index) => (
                <MenuItem
                  key={index + 2} // Start the key from 2 to avoid conflicts with the deleteMenuItem key
                  onClick={() => {
                    menuItem.action(row);
                    closeMenu();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {menuItem.icon} {menuItem.menuName}
                </MenuItem>
              ));

              return [deleteMenuItem, ...actionMenuItems];
            }
          : null // If action menu is not enabled, set to null
      }
      positionActionsColumn={tableSettings.editing.actionMenu.positionActionsColumn}
      enableClickToCopy={tableSettings.enableCopy}
      enableRowNumbers={tableSettings.enableRowNumbers}
      tableInstanceRef={tableInstanceRef}
      enableRowActions={tableSettings.rowAction}
    />
  );
}

SimpleTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableSettings: PropTypes.PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  enableCopy: PropTypes.bool,
  rowAction: PropTypes.bool,
  renderRowActionMenuItems: PropTypes.func,
  updateData: PropTypes.func,
  deleteOpen: PropTypes.func
};

export default SimpleTable;
