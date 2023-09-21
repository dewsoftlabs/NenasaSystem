/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import DialogBox from '../../components/Alert/Confirm';
import { ToastContainer, toast } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed
import { IconUserCircle } from '@tabler/icons';
import { IconLock } from '@tabler/icons-react';
import { IconTrashOff } from '@tabler/icons-react';
import AddFormModal from 'components/modal/AddFormModal';

const UserRoleSettingsMainPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [permission, setPermission] = useState([]);
  const [formConfig, setFormConfig] = useState([]);

  const [formData, setFormData] = useState({
    data: {},
    errors: {}
  });

  const [isOpenAddPermission, setIsOpenAddPermission] = useState(false);
  const [id, setId] = useState(0);

  const handleConfirmClose = () => {
    setIsOpenAddPermission(false);
    setIsOpenDelete(false);
    setId(0);
  };

  const handleDeleteRole = async () => {
    console.log('here');
    try {
      setIsLoading(true);

      const response = await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/userrole/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        showToast('Delete Success');
        fetchData();
        handleConfirmClose();
      } else if (response.status === 401) {
        // logout();
      } else {
        showToast('Delete error', 'warn');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // logout();
      } else {
        showToast('An error occurred', 'warn');
      }
    } finally {
      setIsLoading(false);
      handleConfirmClose();
    }
  };

  const handleOpenDeleteRole = (id) => {
    setIsOpenDelete(true);
    setId(id);
  };

  const handleOpenAddPermission = (id) => {
    setIsOpenAddPermission(true);
    setId(id);

    const filteredEditSelectOption = permission
      .filter((option) => {
        // Check if there is a matching userRole with userroleid and permission_code
        return userRole.find((role) => role.userroleid === id && role.permission_code === option.permission_code) === undefined;
      })
      .map((option) => ({
        value: option.permission_code,
        text: option.permission_code,
        other: option.permission_code
      }));

    // Create a form configuration object
    const formConfigs = [
      {
        formName: 'userroleadd',
        formHeading: 'User Role and Permission',
        formType: 'simple', // dynamic | simple
        headingVariant: 'h3',
        fields: [
          {
            accessorKey: 'permisssionslist',
            header: 'Pending Permissions List',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'checkgroup', // select | TextField | file | email | number | textarea | password | textlist | checkgroup
              xs: 12,
              isRequired: true,
              validationType: 'default'
            },
            editSelectOptions: filteredEditSelectOption // Pass the filtered options here
          }
        ]
      }
    ];

    setFormConfig(formConfigs);

    console.log(formConfig);
  };

  const formSubmit = async (event) => {
    console.log(event.data);
    try {
      setIsLoading(true);

      const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}/userrole/addpermissions/${id}`, event.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setIsLoading(false);
        fetchData();
        showToast(response.data.message);
        handleConfirmClose();
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
        handleConfirmClose();
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        showToast(error.response?.data.error || 'An error occurred', 'warn');
      }
    } finally {
      setIsLoading(false);
    }
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
      setIsLoading(false);
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

  const addPermission = useMemo(
    () => [
      {
        formName: 'userroleadd',
        formHeading: 'User Role and Permission',
        formType: 'simple', // dynamic | simple
        headingVariant: 'h3',
        fields: [
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
            editSelectOptions: permission
              .filter((option) => {
                // Check if there is a matching userRole with userroleid and permission_code
                return userRole.find((role) => role.userroleid === id && role.permission_code === option.permission_code) === undefined;
              })
              .map((option) => ({
                value: option.permission_code,
                text: option.permission_code,
                other: option.permission_code
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
      expanded: false
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
              handleOpenAddPermission(row.original.userroleid);
            },
            icon: <IconLock />,
            menuName: 'Add New Permission'
          },
          {
            key: 3,
            action: (row) => {
              handleOpenDeleteRole(row.original.userroleid);
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
      deleteType: 'single', //single | multiple | mix
      deleteApi: '', //multiple delete
      deleteText: 'Delete Permission', //use default keep empty
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
      <Grid item xs={12}>
        {isOpenAddPermission && (
          <AddFormModal
            enableAddButton={true}
            columns={formConfig}
            formData={formData}
            isOpen={isOpenAddPermission}
            setFormData={setFormData}
            formSubmit={formSubmit}
            handleClose={handleConfirmClose}
          />
        )}
        {isOpenDelete && (
          <DialogBox
            open={isOpenDelete}
            desc={`Are you sure you want to delete this Role?`}
            title="Confirm Delete"
            buttonText="Delete"
            handleClose={handleConfirmClose}
            handleDelete={handleDeleteRole}
          />
        )}
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
