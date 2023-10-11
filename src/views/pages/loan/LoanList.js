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
        accessorKey: 'business_name',
        header: 'Business Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'loan_amount',
        header: 'Loan Amount',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 160
      },
      {
        accessorKey: 'rate',
        header: 'Rate',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'total_payable',
        header: 'Total Payble',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ renderedCellValue }) => {
          if (renderedCellValue === 1) {
            return <>Pending</>;
          } else if (renderedCellValue == 2) {
            return <>Accepted</>;
          } else if (renderedCellValue == 3) {
            return <>Paid</>;
          } else if (renderedCellValue == 4) {
            return <>Completed</>;
          } else {
            return <>Pending</>;
          }
        },
        editVariant: 'select',
        minSize: 90,
        enableEditing: false,
        maxSize: 360,
        size: 100
      }
    ],
    []
  );

  const createForm = useMemo(
    () => [
      {
        formName: 'customeradd',
        formHeading: 'Customer Create Form',
        headingVariant: 'h3',
        buttonConfig: {
          styles: {},
        },
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
    table: 'Loan',
    tableType: 'simple',
    heading: 'Loan Table',
    enableHeading: false,
    enableCopy: false,
    enableRowNumbers: false,
    rowAction: false,
    idName: 'loan_id',
    enableCSVExport: true,
    enablepdf: true,
    row: {
      rowSelect: true,
      rowRedirect: '/loan/loan-detail/'
    },
    editing: {
      enableEditing: false,
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
      updateApi: '/loan/update/'
    },

    delete: {
      deleteType: 'single', //single | multiple | mix
      deleteApi: '',
      singleDeleteApi: ''
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: false,
      addButtonText: '',
      addApi: ''
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
