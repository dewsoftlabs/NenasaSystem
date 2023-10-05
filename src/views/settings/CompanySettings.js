/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Grid, Typography } from '@mui/material';
import Axios from 'axios'; // Make sure to import Axios
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Table from '../../components/table/Table'; // Update this with the actual path to your SimpleTable component
import { getToken, logout } from '../../session'; // Import these functions if needed
import Form from '../../components/form/Form';
import { CircularProgress } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { hasPermission, getUserRoleID } from '../../session';

const UserPermissionSettingsMainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companylogo, setCompanyLogo] = useState('');

  const [formData, setFormData] = useState({
    data: {},
    errors: {}
  });

  const updateEditMode = () => {
    setIsEditing(true);
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

      const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}/shop/update`, sendAsFormData ? getFormData : jsonData, {
        headers: {
          'Content-Type': sendAsFormData ? 'multipart/form-data' : 'application/json',
          'x-token': getToken()
        }
      });

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
      const [mainResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/shop/all', { headers: { 'x-token': getToken() } })
      ]);

      if (mainResponse.status === 200) {
        setShop(mainResponse.data);
        setCompanyLogo(mainResponse.data[0].logo);
        setFormData((prevFormData) => ({
          ...prevFormData,
          data: {
            ...prevFormData.data,
            shopname: mainResponse.data[0].shopname,
            shopnphonenumber: mainResponse.data[0].shopnphonenumber,
            address: mainResponse.data[0].address,
            email: mainResponse.data[0].email,
            website: mainResponse.data[0].website,
            facebook: mainResponse.data[0].facebook,
            instragram: mainResponse.data[0].instragram,
            whatsapp: mainResponse.data[0].whatsapp
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
            accessorKey: 'shopname',
            header: 'Shop Name',
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
            accessorKey: 'shopnphonenumber',
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
            accessorKey: 'email',
            header: 'Email',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'email' // default | custom
            }
          },
          {
            accessorKey: 'website',
            header: 'Website',
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
            accessorKey: 'facebook',
            header: 'Facebook',
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
            accessorKey: 'instragram',
            header: 'Instragram',
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
            accessorKey: 'whatsapp',
            header: 'Whatsapp Number',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 12,
              isRequired: true,
              validationType: 'mobile' // default | custom
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
      formData.append('logo', selectedFile);
      console.log('logo', formData.get('logo'));

      try {
        const response = await Axios.put(process.env.REACT_APP_API_ENDPOINT + '/shop/updatelogo', formData, {
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
                  <Typography variant="h2">Company Settings</Typography>
                  <div style={{ paddingTop: '30px' }}>
                    <Form columns={createForm} formData={formData} setFormData={setFormData} formSubmit={formSubmit} />
                  </div>
                </div>
              ) : (
                <div style={{ width: '80%', padding: '10px' }}>
                  <Typography variant="h2">Company Settings</Typography>
                  <div style={{ paddingTop: '20px' }}>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Shop Name:</strong> {formData.data.shopname}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Phone Number:</strong> <a href={`tel:${formData.data.shopnphonenumber}`}>{formData.data.shopnphonenumber}</a>
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Address:</strong> {formData.data.address}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Email:</strong> <a href={`mailto:${formData.data.email}`}>{formData.data.email}</a>
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Website:</strong> {formData.data.website}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Facebook:</strong> {formData.data.facebook}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>Instagram:</strong> {formData.data.instragram}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <strong>WhatsApp:</strong> <a href={`whatsapp://send?phone=${formData.data.whatsapp}`}> {formData.data.whatsapp}</a>
                    </Typography>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '10px' }}>
                {(hasPermission('companyedit') || getUserRoleID() == 1 || getUserRoleID() == 2) && (
                  <>
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
                          Edit Company Details
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          </Grid>

          <Grid item xs={4}>
            {companylogo && (
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
                <img
                  src={`${process.env.REACT_APP_API_ENDPOINT}/shop/getlogo/${companylogo}`}
                  alt="Company Logo"
                  style={{ width: '100%' }}
                />
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
        </Grid>
      )}
    </MainCard>
  );
};

export default UserPermissionSettingsMainPage;
