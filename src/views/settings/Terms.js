/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed

const TermsSettingsMainPage = () => {
  const [isLoading, setisLoading] = useState(true);
  const [data, setdata] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [mainResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/terms/all', { headers: { 'x-token': getToken() } })
      ]);

      if (mainResponse.status === 200) {
        setdata(mainResponse.data);
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
        accessorKey: 'no_of_terms',
        header: 'No of terms',
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
        formName: 'termsadd',
        formHeading: 'Terms Create Form',
        headingVariant: 'h3',
        buttonConfig: {
          styles: {},
        },
        fields: [
          {
            accessorKey: 'no_of_terms',
            header: 'No of terms',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              value: '',
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
    table: 'terms',
    tableType: 'simple',
    heading: 'Terms',
    enableHeading: false,
    enableCopy: false,
    enableRowNumbers: true,
    rowAction: false,
    idName: 'terms_id',
    enableCSVExport: true,
    enablepdf: true,
    row: {
      rowSelect: false,
      rowRedirect: '/loan/loan-detail/'
    },
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
      updateApi: '/terms/update/'
    },

    delete: {
      deleteType: 'single', //single | multiple | mix
      deleteApi: '', //if your not using multiple delete you have to turn on edit to use single delete
      singleDeleteApi: '/terms/delete/' //isdelete or permenant
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: true,
      addButtonText: '',
      addApi: '/terms/create'
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
        <Table createForm={createForm} fetchData={fetchData} columns={columns} dataSet={data} isLoading={isLoading} tableSettings={table} />
      </Grid>
    </MainCard>
  );
};

export default TermsSettingsMainPage;
