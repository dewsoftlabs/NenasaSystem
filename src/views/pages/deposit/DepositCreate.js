import React from 'react';
import { Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Form from '../../../components/form/Form';
import { useCallback, useMemo, useState , useEffect} from 'react';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getToken, logout} from '../../../session';
import { toast } from 'react-toastify';

const DepositCreate = () => {
  const [route, setRoute] = useState([]);
  const [branch, setBranch] = useState([]);
  const [deposit_type, setDepositType] = useState([]);

  const [formData, setFormData] = useState({
    data: {},
    errors: {}
  });


  const fetchData = useCallback(async () => {

    try{

      const [routeResponse , branchResponse , depositTypeResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/route/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/branch/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/depositType/all', { headers: { 'x-token': getToken() } }),
      ]);

      if (routeResponse.status === 200) {
        setRoute(routeResponse.data);
      }

      if (branchResponse.status === 200) {
        setBranch(branchResponse.data);
      }

      if (depositTypeResponse.status === 200) {
        setDepositType(depositTypeResponse.data);
      }

    }catch(error){
      handleErrorResponse(error);
      console.log(error);
    }
  }, []);


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

  const reloadPage = () => {
    window.location.reload();
  };

  const formSubmit = async () => {
    console.log(formData);

    try {

      const response = await Axios.post(`${process.env.REACT_APP_API_ENDPOINT}/depositAcc/create`, formData.data, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        fetchData();
        showToast(response.data.message || 'Successfully Created', 'success', reloadPage);
        console.log(response.data.message);
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
        console.log();
        showToast(error.response?.data.error || 'An error occurred', 'warn');
      }
    }

  };

  const createForm = useMemo(
    () => [
      {
        formName: 'depositaccadd',
        formHeading: 'Create Deposit Account',
        headingVariant: 'h3',
        buttonText: 'Save',
        buttonConfig: {
          styles: {
            width: '25%',
            background: '#1790FF',
            color: 'white',
            height: '50px',
            borderRadius: '15px',
            margin: '10px',
          },
        },
        fields: [
          {
            accessorKey: 'customer_name',
            header: 'Customer Name',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              value: '',
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'customer_phone',
            header: 'Phone Number',
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
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'email' // default | custom
            }
          },
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
            editSelectOptions: route.map((route) => ({
              value: route.routeid,
              text: route.route_name
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
          },
          {
            accessorKey: 'depositType_id',
            header: 'Deposit type',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              value: '',
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: deposit_type.map((deposit_type) => ({
              value: deposit_type.depositType_id,
              text: deposit_type.depositType_name
            }))
          }
        ]
      }
    ],
    [route,branch,deposit_type]
  );

  const showToast = (message, type = 'success', callback) => {
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: callback // This will execute the callback when the toast is closed
    });
  };

  return (
    <MainCard>
      <Grid container>
        <Grid item xs={12}>
          <div style={{ width: '90%', padding: '10px' }}>
            <Typography variant="h2">Deposit Account</Typography>
            <div style={{ paddingTop: '30px' }}>
              <Form columns={createForm} formData={formData} setFormData={setFormData} formSubmit={formSubmit} />
            </div>
          </div>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DepositCreate;