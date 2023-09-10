/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SimpleTable from '../../components/table/SimpleTable'; // Update this with the actual path to your SimpleTable component
import Axios from 'axios'; // Make sure to import Axios
import { getToken, logout } from '../../session'; // Import these functions if needed
import { Box } from '@mui/system';
const defaultProPic = 'path-to-default-image.png';

import { IconSquareRoundedPlusFilled } from '@tabler/icons-react';
import { IconFileSpreadsheet } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react';

const UserSettingsMainPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [userRole, setUserRole] = useState([]);
  const [branch, setBranch] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'fullname',
        header: 'Full Name',
        export: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150,
        formFeild: {
          isFormFeild: true,
          type: 'TextField',
          xs: 12,
          validationType: 'requiredField'
        }
      },
      {
        accessorKey: 'address',
        header: 'Address',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 160,
        formFeild: {
          isFormFeild: true,
          type: 'TextField',
          xs: 12,
          validationType: 'requiredField'
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 90,
        maxSize: 360,
        size: 150,
        formFeild: {
          isFormFeild: true,
          type: 'TextField',
          xs: 12,
          validationType: 'email'
        }
      },
      {
        accessorKey: 'phonenumber',
        header: 'Mobile',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50,
        formFeild: {
          isFormFeild: true,
          type: 'TextField',
          xs: 6,
          validationType: 'mobile'
        }
      },
      {
        accessorKey: 'username',
        header: 'User Name',
        export: true,
        enableEditing: true,
        enableColumnActions: true,
        minSize: 50,
        maxSize: 50,
        size: 50,
        formFeild: {
          isFormFeild: true,
          type: 'TextField',
          xs: 6,
          validationType: 'requiredField'
        }
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
        formFeild: {
          isFormFeild: true,
          type: 'select',
          xs: 6,
          validationType: 'requiredField'
        },
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
        formFeild: {
          isFormFeild: true,
          type: 'select',
          xs: 6,
          validationType: 'requiredField'
        },
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
        ),
        formFeild: {
          isFormFeild: false
        }
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
        ],
        formFeild: {
          isFormFeild: false
        }
      }
    ],
    [userRole, branch]
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
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
      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
          p: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}
      >
        <Typography variant="h1">
          <a href="#add-new" onClick={handleAddNew}>
            <IconPlus > Add New</IconPlus>
          </a>
        </Typography>
        <Typography variant="h1">
          <a href="#export-excel" onClick={handleExportExcel}>
            <IconFileSpreadsheet />
          </a>
        </Typography>
        <Typography variant="h1">
          <a href="#delete" onClick={handleDelete}>
            <IconTrash />
          </a>
        </Typography>
      </Box>
      <Grid item xs={12}>
        <SimpleTable
          tableHeading="Users"
          columns={columns}
          dataSet={userList}
          isLoading={isLoading}
          idName="userid"
          // handleSaveRow={/* handleSaveRow function */}
          // deletedata={/* deletedata function */}
          enableClickToCopy
          enableRowNumbers={false}
          enableRowVirtualization
          addButtonHeading="Add User"
          enableAddButton={true}
          // handleSubmit={/* handleSubmit function */}
        />
      </Grid>
    </MainCard>
  );
};

export default UserSettingsMainPage;
