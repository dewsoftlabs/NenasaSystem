/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed
import defaultProPic from '../../assets/images/default/default-profile-image.png';

const UserSettingsMainPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [userRole, setUserRole] = useState([]);
  const [branch, setBranch] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [usersResponse, userRoleResponse, branchResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/user/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/userrole/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/branch/all', { headers: { 'x-token': getToken() } })
      ]);

      if (usersResponse.status === 200) {
        setUserList(usersResponse.data);
      }

      if (userRoleResponse.status === 200) {
        setUserRole(userRoleResponse.data);
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
        accessorKey: 'fullname',
        header: 'Full Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'address',
        header: 'Address',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 160
      },
      {
        accessorKey: 'email',
        header: 'Email',
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <a href={`mailto:${renderedCellValue}`}>{renderedCellValue}</a>
            </>
          );
        },
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'phonenumber',
        header: 'Mobile',
        Cell: ({ renderedCellValue }) => {
          return (
            <>
              <a href={`whatsapp://send?phone=${renderedCellValue}`}> {renderedCellValue}</a>
            </>
          );
        },
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'nic',
        header: 'NIC',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'gender',
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
        accessorKey: 'username',
        header: 'User Name',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50
      },
      {
        accessorKey: 'userroleid',
        header: 'User Role',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 180,
        Cell: ({ renderedCellValue }) => {
          const userRoleName = userRole.find((usrRole) => usrRole.userroleid === renderedCellValue)?.role;
          return <>{userRoleName ? userRoleName : 'Unknown'}</>;
        },
        editVariant: 'select',

        editSelectOptions: userRole.map((usrRole) => ({ value: usrRole.userroleid, text: usrRole.role }))
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
        accessorKey: 'profileimage',
        header: 'Profile Image',
        enableEditing: false,
        enableColumnActions: false,
        minSize: 50,
        maxSize: 50,
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <img
            src={renderedCellValue ? `${process.env.REACT_APP_API_ENDPOINT}/user/getprofile/${renderedCellValue}` : defaultProPic}
            alt="Profile"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        )
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
      }
    ],
    [userRole, branch]
  );

  const createForm = useMemo(
    () => [
      {
        formName: 'useradd',
        formHeading: 'User Create Form',
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'fullname',
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
            accessorKey: 'address',
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
            accessorKey: 'email',
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
            accessorKey: 'phonenumber',
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
            accessorKey: 'gender',
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
            accessorKey: 'nic',
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
            accessorKey: 'username',
            header: 'User Name',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'password',
            header: 'Password',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'password', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'password' // default | custom
            }
          },
          {
            accessorKey: 'confirm_password',
            header: 'Confirm Password',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'password', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'userroleid',
            header: 'User Role',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: userRole.map((usrRole) => ({
              value: usrRole.userroleid,
              text: usrRole.role
            }))
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
    [userRole, branch]
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const table = {
    table: 'User',
    tableType: 'simple',
    heading: 'User Table',
    enableHeading: false,
    enableCopy: true,
    enableRowNumbers: false,
    rowAction: false,
    idName: 'userid',
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
      updateApi: '/user/update/'
    },

    delete: {
      deleteType: 'mix', //single | multiple | mix
      deleteApi: '/user/delete/',
      singleDeleteApi: '/user/delete/'
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: true,
      addButtonText: 'Add User',
      addApi: '/user/create'
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
          dataSet={userList}
          isLoading={isLoading}
          tableSettings={table}
        />
      </Grid>
    </MainCard>
  );
};

export default UserSettingsMainPage;
