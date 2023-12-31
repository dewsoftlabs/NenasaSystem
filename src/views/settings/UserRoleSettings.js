/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed
import { IconUserCircle } from '@tabler/icons';
import { IconLock } from '@tabler/icons-react';
import { IconTrashOff } from '@tabler/icons-react';

const UserRoleSettingsMainPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [userRole, setUserRole] = useState([]);
  const [permission, setPermission] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [userRoleResponse, permissionResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/permission_group/role/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/permission/all', { headers: { 'x-token': getToken() } })
      ]);

      if (userRoleResponse.status === 200) {
        setUserRole(userRoleResponse.data);
      }

      if (permissionResponse.status === 200) {
        setPermission(permissionResponse.data);
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
        accessorKey: 'role',
        header: 'Role',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150
      },
      {
        accessorKey: 'permission_code',
        header: 'Permission',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        enableEditing: false,
        size: 150
      },
      {
        accessorKey: 'permission_description',
        header: 'Permission Note',
        enableEditing: false,
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
      }
    ],
    []
  );

  const createForm = useMemo(
    () => [
      {
        formName: 'userroleadd',
        formHeading: 'User Role and Permission',
        formType: 'simple', // dynamic | simple
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'role',
            header: 'User Role',
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
            accessorKey: 'permisssionslist',
            header: 'Permissions List',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'checkgroup', // select | TextField | file | email | number | textarea | password | textlist | checkgroup
              xs: 12,
              isRequired: true,
              validationType: 'default'
            },
            editSelectOptions: permission.map((permission) => ({
              value: permission.permissionid,
              text: permission.permission_code,
              other: permission.permission_description //this only work for check-group or radio Group
            }))
          }
        ]
      }
    ],
    [permission]
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const table = {
    table: 'userrole',
    tableType: 'advance',
    heading: 'User Role and Permission Table',
    enableHeading: false,
    enableCopy: false,
    enableRowNumbers: false,
    rowAction: false,
    idName: 'assignpermissionid',
    enableCSVExport: true,
    enablepdf: true,
    group: {
      enableGroup: true,
      groupColumn: ['role'], //eg ['role', 'status']
      expanded: true
    },
    editing: {
      enableEditing: true,
      editionMode: 'row',
      actionMenu: {
        enableActionMenu: true,
        positionActionsColumn: 'first', // first | last
        actionMenudata: [
          {
            key: 2,
            action: (row) => {
              console.info('Change Image', row);
            },
            icon: <IconLock />,
            menuName: 'Add New Permission'
          },
          {
            key: 2,
            action: (row) => {
              console.info('Change Image', row);
            },
            icon: <IconTrashOff />,
            menuName: 'Delete Use Role'
          }
          // Add more menu items as needed
        ]
      },
      updateApi: '/permission_group/update/'
    },

    delete: {
      deleteType: 'mix', //single | multiple | mix
      deleteApi: '', //multiple delete
      deleteText: 'Deleten Permission', //use default keep empty
      singleDeleteApi: '/permission_group/delete/'
    },
    pagination: {
      enablePagination: true,
      positionPagination: 'bottom'
    },
    add: {
      enableAddButton: true,
      addButtonText: 'Add User Role', //use default keep empty
      addApi: '/userrole/create'
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
          dataSet={userRole}
          isLoading={isLoading}
          tableSettings={table}
        />
      </Grid>
    </MainCard>
  );
};

export default UserRoleSettingsMainPage;
