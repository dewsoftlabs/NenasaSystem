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
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/depositType/all', { headers: { 'x-token': getToken() } })
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
        accessorKey: 'depositType_name',
        header: 'Deposit type Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'depositType_rate',
        header: 'Deposit type Rate',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
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
        formName: 'depositTypeadd',
        formHeading: 'Deposit Type Create Form',
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'depositType_name',
            header: 'Deposit type Name',
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
            accessorKey: 'depositType_rate',
            header: 'Deposit type Rate',
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
    table: 'depositType',
    tableType: 'simple',
    heading: 'Deposit Types',
    enableHeading: false,
    enableCopy: false,
    enableRowNumbers: true,
    rowAction: false,
    idName: 'depositType_id',
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
      updateApi: '/depositType/update/'
    },

    delete: {
      deleteType: 'single', //single | multiple | mix
      deleteApi: '', //if your not using multiple delete you have to turn on edit to use single delete
      singleDeleteApi: '/depositType/delete/' //isdelete or permenant
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: true,
      addButtonText: '',
      addApi: '/depositType/create'
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
