/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, getUserBranchID, logout } from '../../../session'; // Import these functions if needed

const BranchCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [route, setRoute] = useState([]);
  const [branch, setBranch] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [usersResponse, routeResponse, branchResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/customer/branch/all/' + getUserBranchID(), {
          headers: { 'x-token': getToken() }
        }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/route/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/branch/all', { headers: { 'x-token': getToken() } })
      ]);

      if (usersResponse.status === 200) {
        setCustomer(usersResponse.data);
      }

      if (routeResponse.status === 200) {
        setRoute(routeResponse.data);
      }
      if (branchResponse.status === 200) {
        setBranch(branchResponse.data);
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
        header: 'Branch',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
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
    tableType: 'advance',
    heading: 'Customer Table',
    enableHeading: false,
    enableCopy: true,
    enableRowNumbers: false,
    rowAction: false,
    idName: 'customer_id',
    enableCSVExport: true,
    enablepdf: true,
    row: {
      rowSelect: false,
      rowRedirect: ''
    },
    group: {
      enableGroup: true,
      groupColumn: ['branch_name'], //eg ['role', 'status']
      expanded: true
    },
    editing: {
      enableEditing: true,
      permissionCode: 'customeredit',
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
      permissionCode: 'customerdelete',
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
      permissionCode: '',
      addButtonText: '',
      addApi: '/customer/create'
    }
  };

  const handleAddNew = () => {};

  const handleDelete = () => {};

  const handleExportExcel = () => {};

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
          dataSet={customer}
          isLoading={isLoading}
          tableSettings={table}
        />
      </Grid>
    </MainCard>
  );
};

export default BranchCustomer;
