/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../../session'; // Import these functions if needed

const UserSettingsMainPage = () => {
  const [loan, setLoan] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [route, setRoute] = useState([]);
  const [branch, setBranch] = useState([]);
  const [terms, setTerms] = useState([]);
  const [depositType, setDepositType] = useState([]);
  const [loanType, setLoanType] = useState([]);
  const [category, setCategory] = useState([]);

  const fetchData = useCallback(async () => {
    console.log('here');
    try {
      const [loanResponse, routeResponse, termsResponse, depositTypeResponse, categoryResponse, loanTypeResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/loan/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/route/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/terms/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/depositType/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/category/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/loan_type/all', { headers: { 'x-token': getToken() } })
      ]);

      if (loanResponse.status === 200) {
        setLoan(loanResponse.data);
      }

      if (routeResponse.status === 200) {
        setRoute(routeResponse.data);
      }

      if (termsResponse.status === 200) {
        setTerms(termsResponse.data);
      }

      if (depositTypeResponse.status === 200) {
        setDepositType(depositTypeResponse.data);
      }

      if (categoryResponse.status === 200) {
        setCategory(categoryResponse.data);
      }

      if (loanTypeResponse.status === 200) {
        setLoanType(loanTypeResponse.data);
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
        accessorKey: 'customer_name',
        header: 'Full Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'customer_address',
        header: 'Address',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 160
      },
      {
        accessorKey: 'customer_email',
        header: 'Email',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'customer_phone',
        header: 'Mobile',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'customer_gender',
        header: 'Gender',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50,
        editVariant: 'select',
        editSelectOptions: [
          {
            value: 'Male',
            text: 'Male'
          },
          {
            value: 'Female',
            text: 'Female'
          }
        ]
      },
      {
        accessorKey: 'customer_nic',
        header: 'NIC',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'routeid',
        header: 'Route',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 180,
        Cell: ({ renderedCellValue }) => {
          const getName = route.find((route) => route.routeid === renderedCellValue)?.route_name;
          return <>{getName ? getName : 'Unknown'}</>;
        },
        editVariant: 'select',
        editSelectOptions: route.map((route) => ({ value: route.routeid, text: route.route_name }))
      },
      {
        accessorKey: 'branchid',
        header: 'Branch',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 180,
        Cell: ({ renderedCellValue }) => {
          const BranchName = branch.find((branch) => branch.branchid === renderedCellValue)?.branch_name;
          return <>{BranchName ? BranchName : 'Unknown'}</>;
        },
        editVariant: 'select',

        editSelectOptions: branch.map((branch) => ({ value: branch.branchid, text: branch.branch_name }))
      },

      {
        accessorKey: 'customer_status',
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
      }
    ],
    [route, branch]
  );

  const createForm = useMemo(
    () => [
      {
        formName: 'customeradd',
        formHeading: 'Customer Create Form',
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'customer_name',
            header: 'Full Name',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'TextField', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              value: '',
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'customer_phone',
            header: 'Mobile',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'mobile' // default | custom
            }
          },
          {
            accessorKey: 'customer_email',
            header: 'Email',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'email', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'email' // default | custom
            }
          },
          {
            accessorKey: 'customer_address',
            header: 'Address',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },

          {
            accessorKey: 'customer_gender',
            header: 'Gender',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: [
              {
                value: 'Male',
                text: 'Male'
              },
              {
                value: 'Female',
                text: 'Female'
              }
            ]
          },
          // Add more fields here
          {
            accessorKey: 'customer_nic',
            header: 'NIC',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'nic' // default | custom
            }
          },
          {
            accessorKey: 'routeid',
            header: 'Route',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: route.map((route) => ({ value: route.routeid, text: route.route_name }))
          },
          {
            accessorKey: 'branchid',
            header: 'Branch',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: branch.map((branch) => ({
              value: branch.branchid,
              text: branch.branch_name
            }))
          }
        ]
      }
    ],
    [route, branch]
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const table = {
    table: 'Customer',
    tableType: 'simple',
    heading: 'Customer Table',
    enableHeading: false,
    enableCopy: true,
    enableRowNumbers: false,
    rowAction: false,
    idName: 'customer_id',
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
      updateApi: '/customer/update/'
    },

    delete: {
      deleteType: 'mix', //single | multiple | mix
      deleteApi: '/customer/delete/',
      singleDeleteApi: '/customer/delete/'
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: false,
      addButtonText: '',
      addApi: '/customer/create'
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
        <Table createForm={createForm} fetchData={fetchData} columns={columns} dataSet={loan} isLoading={isLoading} tableSettings={table} />
      </Grid>
    </MainCard>
  );
};

export default UserSettingsMainPage;