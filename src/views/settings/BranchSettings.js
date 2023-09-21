/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed

const UserPermissionSettingsMainPage = () => {
  const [isLoading, setisLoading] = useState(true);
  const [branch, setBranch] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [mainResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/branch/all', { headers: { 'x-token': getToken() } })
      ]);

      if (mainResponse.status === 200) {
        setBranch(mainResponse.data);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setisLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'branch_name',
        header: 'Branch Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'branch_location',
        header: 'Branch Location',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ renderedCellValue }) => <>{renderedCellValue === 1 ? 'Active' : 'Deactive'}</>,
        editVariant: 'select',
        minSize: 90,
        maxSize: 360,
        size: 100,
        editSelectOptions: [
          {
            value: '1',
            text: 'Active'
          },
          {
            value: '0',
            text: 'Deactive'
          }
        ]
      },
      {
        accessorKey: 'trndate',
        header: 'Date',
        export: true,
        enableEditing: false,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      }
    ],
    []
  );

  const createForm = useMemo(
    () => [
      {
        formName: 'branchadd',
        formHeading: 'Branch Create Form',
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'branch_name',
            header: 'Branch Name',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              value: '',
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'branch_location',
            header: 'Branch Location',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          }
        ]
      }
    ],
    []
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const table = {
    table: 'branch',
    tableType: 'simple',
    heading: 'Branchers',
    enableHeading: false,
    enableCopy: false,
    enableRowNumbers: true,
    rowAction: false,
    idName: 'branchid',
    enableCSVExport: true,
    enablepdf: true,
    editing: {
      enableEditing: true,
      editionMode: 'row',
      actionMenu: {
        enableActionMenu: true,
        positionActionsColumn: 'first', // first | last
        actionMenudata: [
          // {
          //   key: 2,
          //   action: (row) => {
          //     console.info('Change Image', row);
          //   },
          //   icon: <IconUserCircle />,
          //   menuName: 'Change Image'
          // }
          // Add more menu items as needed
        ]
      },
      updateApi: '/branch/update/'
    },

    delete: {
      deleteType: 'single', //single | multiple | mix
      deleteApi: '', //if your not using multiple delete you have to turn on edit to use single delete
      singleDeleteApi: '/branch/delete/' //isdelete or permenant
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: true,
      addButtonText: 'Add Branch',
      addApi: '/branch/create'
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        logout();
      } else {
        toast.warn(error.response.data.error || 'An error occurred', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    }
  };

  return (
    <MainCard>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }} // Add a higher z-index value to ensure it appears on top
      />
      <Grid item xs={12}>
        <Table
          createForm={createForm}
          fetchData={fetchData}
          columns={columns}
          dataSet={branch}
          isLoading={isLoading}
          tableSettings={table}
        />
      </Grid>
    </MainCard>
  );
};

export default UserPermissionSettingsMainPage;
