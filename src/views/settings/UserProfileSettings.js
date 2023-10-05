/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Grid, Typography } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout, getUserid } from '../../session'; // Import these functions if needed
import Form from '../../components/form/Form';
import { CircularProgress } from '@mui/material';
import { LinearProgress } from '@mui/material';
import defaultProPic from '../../assets/images/default/default-profile-image.png';
import AddFormModal from 'components/modal/AddFormModal';

const UserPermissionSettingsMainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [isOpenPassChnage, setIsOpenPassChnage] = useState(false);
  const [isOpenEmailChnage, setIsOpenEmailChnage] = useState(false);

  const [formData, setFormData] = useState({
    data: {},
    errors: {}
  });

  const [changeEmailFormData, setChangeEmailFormData] = useState({
    data: {},
    errors: {}
  });

  const [changePasswordFormData, setChangePasswordFormData] = useState({
    data: {},
    errors: {}
  });

  const updateEditMode = () => {
    setIsEditing(true);
  };

  const handleChangePassword = () => {
    setIsOpenPassChnage(true);
  };

  const handleChangeEmail = () => {
    setIsOpenEmailChnage(true);
  };

  const changeEmailformSubmit = async (e) => {
    try {
      setIsLoading(true);

      const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}/user/me/changeEmail/${getUserid()}`, e.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setIsLoading(false);
        fetchData();
        logout();
        showToast(response.data.message);
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
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

  const changePasswordformSubmit = async (e) => {
    try {
      setIsLoading(true);

      const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}/user/me/changePassword/${getUserid()}`, e.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setIsLoading(false);
        fetchData();
        logout();
        showToast(response.data.message);
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
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

  const handleConfirmClose = () => {
    setIsOpenEmailChnage(false);
    setIsOpenPassChnage(false);
  };

  const exitEditMode = () => {
    setIsEditing(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const formSubmit = async (event) => {
    const getFormData = new FormData();
    let sendAsFormData = false;

    // Create an object to hold JSON data
    const jsonData = {};

    // Iterate through the columns
    for (const field of createForm[0].fields) {
      if (field.formField.isFormField === true) {
        if (field.formField.type !== 'file') {
          const fieldName = field.accessorKey;
          const fieldValue = event.data[fieldName];

          jsonData[fieldName] = fieldValue;
        }

        if (field.formField.type === 'file') {
          const fieldName = field.accessorKey;
          const fieldValue = event.data[fieldName];

          if (fieldValue !== undefined && fieldValue !== null) {
            // Check if the field has a value (not undefined or null)
            getFormData.append(fieldName, fieldValue);
          }
          sendAsFormData = true;
        }
      }
    }

    if (sendAsFormData == true) {
      for (const key in jsonData) {
        getFormData.append(key, jsonData[key]);
      }
    }

    for (const pair of getFormData.entries()) {
      const [key, value] = pair;
      console.log(`FormData - ${key}:`, value);
    }
    try {
      setIsLoading(true);

      const response = await Axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/user/me/update/${getUserid()}`,
        sendAsFormData ? getFormData : jsonData,
        {
          headers: {
            'Content-Type': sendAsFormData ? 'multipart/form-data' : 'application/json',
            'x-token': getToken()
          }
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        fetchData();
        showToast(response.data.message);
        exitEditMode();
      } else if (response.status === 401) {
        logout();
      } else {
        fetchData();
        exitEditMode();
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        console.log();
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
      const [mainResponse, userRoleResponse, branchResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/user/me/' + getUserid(), { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/userrole/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/branch/all', { headers: { 'x-token': getToken() } })
      ]);

      if (mainResponse.status === 200 && userRoleResponse.status === 200 && branchResponse.status === 200) {
        setShop(mainResponse.data);
        setProfileImage(
          mainResponse.data[0].profileimage
            ? `${process.env.REACT_APP_API_ENDPOINT}/user/me/getprofile/${mainResponse.data[0].profileimage}`
            : defaultProPic
        );
        setFormData((prevFormData) => ({
          ...prevFormData,
          data: {
            ...prevFormData.data,
            fullname: mainResponse.data[0].fullname,
            phonenumber: mainResponse.data[0].phonenumber,
            address: mainResponse.data[0].address,
            email: mainResponse.data[0].email,
            gender: mainResponse.data[0].gender,
            nic: mainResponse.data[0].nic,
            username: mainResponse.data[0].username,
            userroleid: userRoleResponse.data.find((userrole) => userrole.userroleid === mainResponse.data[0].userroleid)?.role,
            branchid: branchResponse.data.find((branch) => branch.branchid === mainResponse.data[0].branchid)?.branch_name,
            trndate: mainResponse.data[0].trndate
          }
        }));
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createForm = useMemo(
    () => [
      {
        formName: 'branchadd',
        formHeading: 'Branch Create Form',
        headingVariant: 'h3',
        buttonText: 'Save',
        fields: [
          {
            accessorKey: 'fullname',
            header: 'FullName',
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
            accessorKey: 'phonenumber',
            header: 'Phone Number',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'mobile' // default | custom
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
          {
            accessorKey: 'nic',
            header: 'NIC',
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

  const changeEmailForm = useMemo(
    () => [
      {
        formName: 'emailchange',
        formHeading: 'Change Email',
        headingVariant: 'h3',
        buttonText: 'Save',
        fields: [
          {
            accessorKey: 'currentEmail',
            header: 'Current Email',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'email', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              value: '',
              isRequired: true,
              validationType: 'email' // default | custom
            }
          },
          {
            accessorKey: 'newEmail',
            header: 'New Email',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'email', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'email' // default | custom
            }
          }
        ]
      }
    ],
    []
  );

  const changePasswordForm = useMemo(
    () => [
      {
        formName: 'passwordchange',
        formHeading: 'Change Password',
        headingVariant: 'h3',
        buttonText: 'Save',
        fields: [
          {
            accessorKey: 'currentPassword',
            header: 'Current Password',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'password', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              value: '',
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'password',
            header: 'New Password',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'password', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
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
              xs: 12,
              isRequired: true,
              validationType: 'password' // default | custom
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

  const uploadLogo = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profile', selectedFile);
      console.log('profile', formData.get('profile'));

      try {
        const response = await Axios.put(process.env.REACT_APP_API_ENDPOINT + '/user/me/profilechange/' + getUserid(), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-token': getToken()
          }
        });

        if (response.status === 200) {
          fetchData();
          showToast(response.data.message);
          window.location.reload();
        }
      } catch (error) {
        if (error.response.status === 401) {
          window.location.reload();
          logout();
        } else {
          toast.warn(error.response.data.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000, // Adjust the duration (milliseconds) the toast will be displayed
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <MainCard>
      {isLoading ? (
        // Display loading spinner while data is loading
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LinearProgress style={{ width: '100%' }} color="primary" />
        </div>
      ) : (
        <Grid container>
          <Grid item xs={6}>
            <>
              {isEditing ? (
                <div style={{ width: '80%', padding: '10px' }}>
                  <Typography variant="h2">Profile Settings</Typography>
                  <div style={{ paddingTop: '30px' }}>
                    <Form columns={createForm} formData={formData} setFormData={setFormData} formSubmit={formSubmit} />
                  </div>
                </div>
              ) : (
                <div style={{ width: '80%', padding: '10px' }}>
                  <Typography variant="h2">Profile Settings</Typography>
                  <div style={{ paddingTop: '20px' }}>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Full Name:</strong> {formData.data.fullname}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Phone Number:</strong> <a href={`tel:${formData.data.phonenumber}`}>{formData.data.phonenumber}</a>
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Address:</strong> {formData.data.address}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Email:</strong> <a href={`mailto:${formData.data.email}`}>{formData.data.email}</a>
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Gender:</strong> {formData.data.gender}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>NIC:</strong> {formData.data.nic}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Username:</strong> {formData.data.username}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Role:</strong> {formData.data.userroleid}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Branch:</strong> {formData.data.branchid}
                    </Typography>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '10px' }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      className="custom-form-image-upload-button"
                      onClick={exitEditMode}
                    >
                      Back to Main
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      className="custom-form-image-upload-button"
                      onClick={updateEditMode}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: '10px' }}
                      type="button"
                      className="custom-form-image-upload-button"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: '10px' }}
                      type="button"
                      className="custom-form-image-upload-button"
                      onClick={handleChangeEmail}
                    >
                      Change Email
                    </Button>
                  </>
                )}
              </div>
            </>
          </Grid>

          <Grid item xs={4}>
            {profileImage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'left',
                  flexDirection: 'column',
                  border: '1px solid black',
                  padding: '20px',
                  borderRadius: '10px'
                }}
              >
                <img src={profileImage} alt="Profile" style={{ width: '100%' }} />
                {isEditing && (
                  <form encType="multipart/form-data">
                    <input
                      required
                      type="file"
                      id="image-upload"
                      style={{ display: 'block', textAlign: 'center', margin: '10px', color: '#fff', fontSize: '12px', width: '88%' }}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      className="custom-form-image-upload-button"
                      onClick={uploadLogo}
                    >
                      Upload Logo
                    </Button>
                  </form>
                )}
              </div>
            )}
          </Grid>
          {isOpenEmailChnage && (
            <AddFormModal
              enableAddButton={true}
              columns={changeEmailForm}
              formData={changeEmailFormData}
              isOpen={isOpenEmailChnage}
              setFormData={setChangeEmailFormData}
              formSubmit={changeEmailformSubmit}
              handleClose={handleConfirmClose}
            />
          )}

          {isOpenPassChnage && (
            <AddFormModal
              enableAddButton={true}
              columns={changePasswordForm}
              formData={changePasswordFormData}
              isOpen={isOpenPassChnage}
              setFormData={setChangePasswordFormData}
              formSubmit={changePasswordformSubmit}
              handleClose={handleConfirmClose}
            />
          )}
        </Grid>
      )}
    </MainCard>
  );
};

export default UserPermissionSettingsMainPage;
