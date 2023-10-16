// UserSettingsMainPage.jsx

/* eslint-disable no-unused-vars */
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import Axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import DialogBox from '../../../components/Alert/Confirm';
import 'react-toastify/dist/ReactToastify.css';
import { getToken, logout, getUserBranchID, getUserid } from '../../../session';
import StepForm from '../../../components/form/LoanCreateForm';
import MarkedDatesCalendar from 'components/Calander/MarkDates';
import MarkMonths from 'components/Calander/MarkMonths';
import MarkWeek from 'components/Calander/MarkWeek';
import { useTheme } from '@mui/material/styles';

const steps = ['Personal Information', 'Loan Information', 'Guranter Information', 'Collection Information', 'Finish Loan Application'];

const CreateLoan = () => {
  const theme = useTheme();
  const [route, setRoute] = useState([]);
  const [terms, setTerms] = useState([]);
  const [depositType, setDepositType] = useState([]);
  const [loanType, setLoanType] = useState([]);
  const [category, setCategory] = useState([]);

  const [collection, setCollection] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(true);

  const [count, setCount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const limit = 4;
  const [isLoading, setisLoading] = useState(true);

  const [personalData, setPersonalData] = useState({
    data: {
      branchid: getUserBranchID()
    },
    errors: {}
  });
  const [loanData, setLoanlData] = useState({
    data: {
      userid: getUserid()
    },
    errors: {}
  });
  const [guaranterData, setGuranterData] = useState({
    data: {
      branchid: getUserBranchID()
    },
    errors: {}
  });
  const [depositData, setDepositData] = useState({
    data: {
      branchid: getUserBranchID()
    },
    errors: {}
  });

  const [formData, setFormData] = useState({});

  const handleConfirm = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchData = useCallback(async () => {
    try {
      const [routeResponse, termsResponse, depositTypeResponse, categoryResponse, loanTypeResponse] = await Promise.all([
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/route/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/terms/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/depositType/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/category/all', { headers: { 'x-token': getToken() } }),
        Axios.get(process.env.REACT_APP_API_ENDPOINT + '/loan_type/all', { headers: { 'x-token': getToken() } })
      ]);

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

  const isStepFailed = (step) => {
    // return step === 1;
  };

  const handleNext = () => {
    if (count < limit) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const handlePrev = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const createForm = useMemo(
    () => [
      {
        formName: 'customer',
        formHeading: '',
        headingVariant: 'h3',
        buttonText: 'Next',
        fields: [
          {
            accessorKey: 'customer_name',
            header: 'Name',
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
            accessorKey: 'customer_email',
            header: 'Email',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: false,
              validationType: 'email' // default | custom
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
            editSelectOptions: route.map((route) => ({
              value: route.routeid,
              text: route.route_name
            }))
          }
        ]
      }
    ],
    [route]
  );

  const createGuranterForm = useMemo(
    () => [
      {
        formName: 'guarantor',
        formHeading: '',
        headingVariant: 'h3',
        buttonText: 'Next',
        fields: [
          {
            accessorKey: 'guarantor_name',
            header: 'Name',
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
            accessorKey: 'guarantor_phone',
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
            accessorKey: 'guarantor_address',
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
            accessorKey: 'guarantor_email',
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
            accessorKey: 'guarantor_nic',
            header: 'NIC',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'nic' // default | custom
            }
          }
        ]
      }
    ],
    []
  );

  const createDepositForm = useMemo(
    () => [
      {
        formName: 'deposit',
        formHeading: '',
        headingVariant: 'h3',
        buttonText: 'Finish',
        fields: [
          {
            accessorKey: 'hold_startDate',
            header: 'Hold Start Date',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'date', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'hold_endDate',
            header: 'Hold End Date',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'date', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
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
            editSelectOptions: depositType.map((depositType) => ({
              value: depositType.depositType_id,
              text: depositType.depositType_name
            }))
          }
        ]
      }
    ],
    [depositType]
  );

  const createLoanForm = useMemo(
    () => [
      {
        formName: 'loan',
        formHeading: '',
        headingVariant: 'h3',
        buttonText: 'Next',
        fields: [
          {
            accessorKey: 'business_name',
            header: 'Business Name',
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
            accessorKey: 'loan_category',
            header: 'Category',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: category.map((category) => ({
              value: category.catid,
              text: category.cat_name
            }))
          },
          {
            accessorKey: 'business_type',
            header: 'Business type',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'text', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: [
              {
                value: 'Single',
                text: 'Single'
              },
              {
                value: 'Female',
                text: 'Female'
              }
            ]
          },
          {
            accessorKey: 'loan_amount',
            header: 'Loan Amount',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'rate',
            header: 'Rate',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },

          {
            accessorKey: 'loantype_id',
            header: 'Loan Type',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: loanType.map((loanType) => ({
              value: loanType.loantype_id,
              text: loanType.loantype_name
            }))
          },
          {
            accessorKey: 'terms_id',
            header: 'Terms',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled | default
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: terms.map((term) => ({
              value: term.terms_id,
              text: term.no_of_terms
            }))
          },
          {
            accessorKey: 'loan_period',
            header: 'Loan Type Period',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'select', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            },
            editSelectOptions: [
              {
                value: '1',
                text: 'Day'
              },
              {
                value: '2',
                text: 'Week'
              },
              {
                value: '3',
                text: 'Month'
              }
            ]
          },
          {
            accessorKey: 'startDate',
            header: 'Start Date',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'date', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'endDate',
            header: 'End Date',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'date', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'document_charge',
            header: 'Document Charge',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'service_charge',
            header: 'Service Charge',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'deposit_amount',
            header: 'Deposit Amount',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'installments',
            header: 'Installment',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'total_payable',
            header: 'Total Payble',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          },
          {
            accessorKey: 'total_payamount',
            header: 'Total Pay Amount',
            formField: {
              isFormField: true,
              disableOption: 'default', // readonly | disabled
              type: 'number', // select | TextField | file | email | phonenumber | number | hidden | textarea | password
              xs: 6,
              isRequired: true,
              validationType: 'default' // default | custom
            }
          }
        ]
      }
    ],
    [category, loanType, terms]
  );

  const personalInformation_formSubmit = (event) => {
    handleNext();
  };

  const loanInformation_formSubmit = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      loan: loanData.data
    }));
    handleNext();
  };

  const guranterInformation_formSubmit = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      guarantor: guaranterData.data
    }));
    handleNext();
  };

  const handleCollectionSubmit = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      collection: collection
    }));
    handleNext();
  };

  const depositInformation_formSubmit = async (event) => {
    handleConfirm();
    setFormData((prevState) => ({
      ...prevState,
      deposit: {
        ...prevState.deposit,
        deposithas: checked
      }
    }));
  };

  const handleSave = async () => {
    setFormData((prevState) => ({
      ...prevState,
      deposit: {
        ...prevState.deposit,
        deposithas: checked
      }
    }));

    try {
      setisLoading(true);
      const response = await Axios.post(`${process.env.REACT_APP_API_ENDPOINT}/loan/create`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setisLoading(false);
        fetchData();
        showToast(response.data.message);
        window.location.reload();
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
        console.log(error);
        setisLoading(false);
        showToast(error.response?.data.error || 'An error occurred', 'warn');
      }
    }

    handleClose();
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

  const handleCheck = () => {
    setChecked(!checked); // Toggle the value of 'checked'
    // Add other logic if needed
  };

  const handleChange = (event) => {
    console.log(event);
  };

  return (
    <MainCard>
      {isLoading && (
        <div className="skeleton-loading">
          {/* Skeleton Loading Effect */}
          <div className="skeleton-progress"></div>
          <div className="skeleton-title"></div>
        </div>
      )}

      <Grid>
        {isLoading ? (
          // Loading state: Show skeleton for each step
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={0}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <div className="skeleton-progress"></div>
                    <div className="skeleton-title"></div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        ) : (
          // Content when not loading
          <>
            <div style={{ width: '80%', padding: '10px', paddingTop: '10px', paddingBottom: '30px' }}>
              <Typography variant="h2">Loan Application</Typography>
            </div>
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={count}>
                {steps.map((label, index) => {
                  const labelProps = {
                    optional: isStepFailed(index) && (
                      <Typography variant="caption" color="error">
                        Alert message
                      </Typography>
                    ),
                    error: isStepFailed(index)
                  };

                  return (
                    <Step key={label}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
            <Box sx={{ width: '100%' }}>
              {count === 0 ? (
                <Box sx={{ width: '100%', padding: '50px 0px 0px 0px' }}>
                  <StepForm
                    handlePrev={handlePrev}
                    count={count}
                    columns={createForm}
                    formData={personalData}
                    setFormData={setPersonalData}
                    formDataCollection={formData}
                    setformDataCollection={setFormData}
                    formSubmit={personalInformation_formSubmit}
                  />
                </Box>
              ) : count === 1 ? (
                <Box sx={{ width: '100%', padding: '50px 0px 0px 0px' }}>
                  <StepForm
                    handlePrev={handlePrev}
                    count={count}
                    columns={createLoanForm}
                    formData={loanData}
                    setFormData={setLoanlData}
                    setformDataCollection={setFormData}
                    formSubmit={loanInformation_formSubmit}
                  />
                </Box>
              ) : count === 2 ? (
                <Box sx={{ width: '100%', padding: '50px 0px 0px 0px' }}>
                  <StepForm
                    handlePrev={handlePrev}
                    count={count}
                    columns={createGuranterForm}
                    formData={guaranterData}
                    setFormData={setGuranterData}
                    setformDataCollection={setFormData}
                    formSubmit={guranterInformation_formSubmit}
                  />
                </Box>
              ) : count === 3 ? (
                <Box sx={{ width: '100%', padding: '50px 0px 0px 0px' }}>
                  {loanData.data.loan_period == 1 ? (
                    <MarkedDatesCalendar setData={setCollection} data={collection} />
                  ) : loanData.data.loan_period == 2 ? (
                    <MarkWeek setData={setCollection} data={collection} />
                  ) : loanData.data.loan_period == 3 ? (
                    <MarkMonths setData={setCollection} data={collection} />
                  ) : (
                    <></>
                  )}
                  <Box sx={{ width: '100%', display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                    <Button
                      disabled={count == 0}
                      variant="contained"
                      style={{
                        width: '100%',
                        background: theme.palette.primary.main,
                        color: theme.palette.common.white,
                        paddingLeft: '20px',
                        height: '50px',
                        borderRadius: theme.shape.borderRadius,
                        marginBottom: theme.spacing(1)
                      }}
                      onClick={handlePrev}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handleCollectionSubmit}
                      style={{
                        width: '100%',
                        background: theme.palette.primary.main,
                        color: theme.palette.common.white,
                        paddingLeft: '20px',
                        height: '50px',
                        borderRadius: theme.shape.borderRadius,
                        marginBottom: theme.spacing(1)
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              ) : count === 4 ? (
                <Box sx={{ width: '100%', padding: '50px 0px 0px 0px' }}>
                  <FormGroup style={{ paddingBottom: '20px' }}>
                    <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheck} />} label="Deposit Account Create" />
                  </FormGroup>
                  {checked === true ? (
                    <StepForm
                      handlePrev={handlePrev}
                      count={count}
                      columns={createDepositForm}
                      formData={depositData}
                      setFormData={setDepositData}
                      setformDataCollection={setFormData}
                      formSubmit={depositInformation_formSubmit}
                    />
                  ) : (
                    <>
                      <Box sx={{ width: '100%', display: 'flex', gap: '30px', justifyContent: 'space-between' }}>
                        <Button
                          disabled={count == 0}
                          variant="contained"
                          style={{
                            width: '100%',
                            background: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            height: '50px',
                            borderRadius: theme.shape.borderRadius,
                            marginBottom: theme.spacing(1)
                          }}
                          onClick={handlePrev}
                        >
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          onClick={(e) => {
                            depositInformation_formSubmit(e);
                          }}
                          style={{
                            width: '100%',
                            background: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            paddingLeft: '20px',
                            height: '50px',
                            borderRadius: theme.shape.borderRadius,
                            marginBottom: theme.spacing(1)
                          }}
                        >
                          Finish
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </>
        )}
        {isOpen && (
          <DialogBox
            open={isOpen}
            desc={`Are you sure you want to Create this loan?`}
            title="Confirm Create"
            buttonText="Create"
            handleClose={handleClose}
            handleDelete={handleSave}
          />
        )}
      </Grid>
    </MainCard>
  );
};

export default CreateLoan;
