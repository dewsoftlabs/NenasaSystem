/* eslint-disable no-unused-vars */
import { TextareaAutosize } from '@mui/base';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import dayjs from 'dayjs';

// ... rest of your code

import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
const Yup = require('yup');
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Box } from '@mui/system';

const passwordSchema = Yup.string()
  .min(12, 'Password must be at least 12 characters long')
  .matches(
    /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]+$/,
    'Password must include at least one letter, one number, and one symbol'
  )
  .required('This field is required');

const imageSchema = Yup.mixed().test('image', 'Invalid image format', (value) => {
  if (!value) {
    return true; // No image provided, validation will be handled separately
  } else {
    const acceptedFormats = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg']; // Add more formats if needed
    return acceptedFormats.includes(value[0].type);
  }
});

function SimpleForm(props) {
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkgroup, setCheckGroup] = useState([]);
  const [dynamicgroup, setDynamicGroup] = useState([]);
  const [textFields, setTextFields] = useState([]);

  // Add a new state and initial form data for the image field:
  const [selectedImage, setSelectedImage] = useState(null);
  // Add a new state and initial form data for the image field:

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleFieldFocus = (field) => {
    setFocusedField(field);
  };
  const handleDateChange = (fieldname, value, type) => {
    let formattedValue = '';

    if (type === 'date') {
      // Format the date as desired (e.g., "YYYY-MM-DD")
      formattedValue = value
        ? new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(value)
        : '';
    } else if (type === 'datetime') {
      // Format the datetime
      formattedValue = value
        ? new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(value)
        : '';
    } else if (type === 'time') {
      // Format the time as "HH:mm"
      formattedValue = value
        ? new Intl.DateTimeFormat('en', {
            hour: '2-digit',
            minute: '2-digit'
          }).format(value)
        : '';
    }

    let fieldError = null;

    // Update formData
    setFormData((prevState) => ({
      data: {
        ...prevState.data,
        [fieldname]: formattedValue
      },
      errors: {
        ...prevState.errors,
        [fieldname]: fieldError
      }
    }));
  };

  const { enableAddButton, columns, formData, setFormData, formSubmit, formDataCollection, setformDataCollection, isOpen, handleClose } =
    props;

  const handleValidation = (validationType, field) => {
    if (!field) {
      console.error('Field object is missing.');
      return;
    }

    if (validationType === 'mobile') {
      const validation = Yup.string()
        .matches(/^[+]\d{1,3}\s?(\d{10}|\d{12})$/, {
          message: 'Invalid mobile number',
          excludeEmptyString: true
        })
        .required('This field is required');

      field.validation = validation;
    } else if (validationType === 'email') {
      const baseValidation = Yup.string().email('Invalid email address');

      const validation = field.isrequired ? baseValidation.required('This field is required') : baseValidation;

      field.validation = validation;
    } else if (validationType === 'password') {
      field.validation = passwordSchema;
    } else if (validationType === 'file') {
      field.validation = imageSchema;
    } else if (validationType === 'nic') {
      const validation = Yup.string()
        .matches(/^[A-Za-z0-9]{10,12}$/, {
          message: 'NIC number must be between 10 and 12 alphanumeric characters',
          excludeEmptyString: true
        })
        .required('This field is required');

      field.validation = validation;
    }

    if (field.isrequired === true) {
      const baseValidation = Yup.string();

      field.validation = field.validation
        ? field.validation.concat(baseValidation.required('This field is required'))
        : baseValidation.required('This field is required');
    }
  };

  const formFields = columns[0].fields.reduce((fields, column) => {
    const { accessorKey, header, formField, action } = column;

    // Create a field object
    const field = {
      name: accessorKey,
      label: header,
      value: formField.value || '', // Handle potential undefined values
      isrequired: formField.isRequired || false, // Handle potential undefined values
      disableOption: formField.disableOption || 'default', // Handle potential undefined values
      type: formField.type === 'TextField' ? 'text' : formField.type,
      xs: formField.xs,
      action: action || null
    };

    // Call handleValidation if needed
    if (formField.isFormField) {
      handleValidation(formField.validationType, field);
    }

    // Handle 'select' or 'checkgroup' fields
    if (formField.type === 'select' || formField.type === 'checkgroup' || formField.type === 'search') {
      const options = (column.editSelectOptions || []).map((option) => ({
        value: option.value,
        label: option.text
      }));
      field.options = options;
    }

    // Only add the field to the array if it's a form field
    if (formField.isFormField) {
      fields.push(field);
    }

    return fields;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    checkValidation(event);

    if (name === 'terms_id' || name === 'loan_amount' || name === 'rate') {
      calculateInstallment(event);
    }

    if (name === 'document_charge' || name === 'service_charge' || name === 'deposit_amount') {
      // calculateTotalPayable(event);
    }
  };

  const calculateTotalPayable = (event) => {
    const { name, value } = event.target;
    let fieldError = null;

    if (name === 'document_charge') {
      if (value && formData.data.deposit_amount && formData.data.loan_amount && formData.data.service_charge) {
        const calc = parseFloat(value) + parseFloat(formData.data.deposit_amount) + parseFloat(formData.data.service_charge);
        const total_payable = parseFloat(formData.data.loan_amount) - calc;

        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            total_payable: fieldError
          }
        }));
      }
    } else if (name === 'service_charge') {
      if (value && formData.data.deposit_amount && formData.data.loan_amount && formData.data.document_charge) {
        const calc = parseFloat(value) + parseFloat(formData.data.deposit_amount) + parseFloat(formData.data.document_charge);
        const total_payable = parseFloat(formData.data.loan_amount) - calc;

        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            total_payable: fieldError
          }
        }));
      }
    } else if (name === 'deposit_amount') {
      if (value && formData.data.document_charge && formData.data.loan_amount && formData.data.service_charge) {
        const calc = parseFloat(value) + parseFloat(formData.data.document_charge) + parseFloat(formData.data.service_charge);
        const total_payable = parseFloat(formData.data.loan_amount) - calc;
        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            total_payable: fieldError
          }
        }));
      }
    }
  };

  const calculateInstallment = (event) => {
    const { name, value } = event.target;
    let fieldError = null;

    if (name === 'terms_id') {
      const selectedOption = formFields.find((field) => field.name === name)?.options;

      if (selectedOption && formData.data.rate && formData.data.loan_amount) {
        const getslected = selectedOption.find((option) => option.value == value);

        // Use parseFloat to convert values to floats
        const rate = parseFloat(formData.data.rate) || 0;
        const calc = (parseFloat(formData.data.loan_amount) / 100) * rate;

        const total_payable = parseFloat(formData.data.loan_amount) + calc;

        // Check if getslected.label is not zero to avoid division by zero
        const installment = getslected.label !== 0 ? (parseFloat(formData.data.loan_amount) + calc) / parseFloat(getslected.label) : 0;

        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            installments: installment,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            installments: fieldError,
            total_payable: fieldError
          }
        }));
      }
    } else if (name === 'rate') {
      const selectedOption = formFields.find((field) => field.name === 'terms_id')?.options;

      if (value && formData.data.terms_id && formData.data.loan_amount) {
        const getslected = selectedOption.find((option) => option.value == formData.data.terms_id);

        // Use parseFloat to convert values to floats
        const rate = parseFloat(value) || 0;
        const calc = (parseFloat(formData.data.loan_amount) / 100) * rate;
        const total_payable = parseFloat(formData.data.loan_amount) + calc;

        // Check if getslected.label is not zero to avoid division by zero
        const installment = getslected.label !== 0 ? (parseFloat(formData.data.loan_amount) + calc) / parseFloat(getslected.label) : 0;

        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            installments: installment,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            installments: fieldError,
            total_payable: fieldError
          }
        }));
      }
    } else if (name === 'loan_amount') {
      const selectedOption = formFields.find((field) => field.name === 'terms_id')?.options;

      if (value && formData.data.terms_id && formData.data.rate) {
        const getslected = selectedOption.find((option) => option.value == formData.data.terms_id);

        // Use parseFloat to convert values to floats
        const rate = parseFloat(formData.data.rate) || 0;
        const calc = (parseFloat(value) / 100) * rate;
        const total_payable = parseFloat(value) + calc;

        // Check if getslected.label is not zero to avoid division by zero
        const installment = getslected.label !== 0 ? (parseFloat(value) + calc) / parseFloat(getslected.label) : 0;

        setFormData((prevState) => ({
          data: {
            ...prevState.data,
            installments: installment,
            total_payable: total_payable
          },
          errors: {
            ...prevState.errors,
            installments: fieldError,
            total_payable: fieldError
          }
        }));
      }
    }
  };

  const handleChangeCheckList = (event) => {
    const { name, value, checked } = event.target;

    setCheckGroup((prevCheckGroup) => {
      const updatedCheckGroup = { ...prevCheckGroup };

      // If the checkbox is checked, add the value to the array
      if (checked) {
        if (!updatedCheckGroup['values']) {
          updatedCheckGroup['values'] = []; // Initialize the array if it doesn't exist
        }
        updatedCheckGroup['values'].push(value); // Add the value to the array
      } else {
        // If the checkbox is unchecked, remove the value from the array
        if (updatedCheckGroup['values']) {
          updatedCheckGroup['values'] = updatedCheckGroup['values'].filter((item) => item !== value);
        }
      }
      let fieldError = null;

      setFormData((prevState) => ({
        data: {
          ...prevState.data,
          [name]: updatedCheckGroup
        },
        errors: {
          ...prevState.errors,
          [name]: fieldError
        }
      }));

      console.log(checkgroup);
      return updatedCheckGroup;
    });
  };

  const handleChangeDynamicText = (event, index, fieldName) => {
    const { value } = event.target;

    setDynamicGroup((prevDynamicGroup) => {
      const updatedDynamicGroup = { ...prevDynamicGroup };

      // Initialize 'values' as an empty array if it doesn't exist
      if (!updatedDynamicGroup['values']) {
        updatedDynamicGroup['values'] = [];
      }

      // Update the value at the specified index or push it to the array
      updatedDynamicGroup['values'][index] = value;

      return updatedDynamicGroup;
    });

    // Capture the updated dynamicGroup
    const updatedDynamicGroup = { ...dynamicgroup }; // Replace dynamicGroup with the actual state variable name

    // Update formData with the new values
    setFormData((prevState) => ({
      data: {
        ...prevState.data,
        [fieldName]: updatedDynamicGroup.values // Use updatedDynamicGroup.values to update formData
      },
      errors: {
        ...prevState.errors,
        [fieldName]: null // Clear any errors for this field
      }
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    checkValidation(event);
    const hasErrors = Object.values(formData.errors).some((error) => error !== null);

    if (!hasErrors) {
      console.log(formData);

      setformDataCollection((prevState) => ({
        ...prevState,
        [columns[0].formName]: formData.data
      }));

      formSubmit(formDataCollection);
    }
  };

  const handleAddTextBox = () => {
    const newTextFields = [...textFields]; // Create a copy of the existing array
    const newIndex = newTextFields.length + 1; // Calculate a unique index for the new text field

    const newTextField = {
      label: `Field ${newIndex}`,
      name: `field_${newIndex}`,
      type: 'textlist', // Adjust the type if needed
      isrequired: false, // Set as required if needed
      disableOption: 'enabled' // Set the disable option as needed
    };

    newTextFields.push(newTextField); // Add the new text field to the array
    setTextFields(newTextFields); // Update the state with the new array
  };

  const handleDeleteTextBox = (indexToDelete) => {
    // Create a copy of the current textFields array
    const newTextFields = [...textFields];

    // Remove the text field at the specified index
    newTextFields.splice(indexToDelete, 1);

    // Update the state with the modified array
    setTextFields(newTextFields);
  };
  const checkValidation = (event) => {
    const { name, value, files } = event.target;
    const fieldSchema = formFields.find((field) => field.name === name)?.validation;

    let fieldError = null;

    if (fieldSchema) {
      if (files == null) {
        try {
          fieldSchema.validateSync(value);
        } catch (error) {
          fieldError = error.message;
        }
      } else {
        try {
          fieldSchema.validateSync(files);
        } catch (error) {
          fieldError = error.message;
        }
      }
    }

    if (name === 'confirm_password' && formData.data.password != '') {
      if (value && value !== formData.data.password) {
        fieldError = 'Passwords do not match';
      }
    }
    const selectedFile = files && files[0];
    setFormData((prevState) => ({
      data: {
        ...prevState.data,
        [name]: selectedFile || value
      },
      errors: {
        ...prevState.errors,
        [name]: fieldError
      }
    }));
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={12} lg={field.xs} key={field.name}>
              {field.type === 'file' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <div
                    style={{
                      border: '1px solid #fff',
                      borderRadius: '4px',
                      paddingTop: '7.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'right',
                      height: 'auto'
                    }}
                  >
                    <InputLabel
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        margin: '0 ',
                        color: focusedField === field.name ? '#000' : '#000'
                      }}
                    >
                      {field.label}
                    </InputLabel>
                    <input
                      name={field.name}
                      type="file"
                      accept="image/pdf"
                      onChange={(e) => {
                        setSelectedImage(e.target.files[0]);
                        handleChange(e); // Call the handleChange function separately
                      }}
                      style={{ display: 'none' }}
                      id={`${field.name}-upload-input`}
                    />

                    <label htmlFor={`${field.name}-upload-input`} style={{ textAlign: 'right', marginRight: '15px' }}>
                      <Button variant="outlined" color="secondary" component="span" style={{ color: '#fff', backgroundColor: '#1890ff' }}>
                        Upload Image
                      </Button>
                    </label>

                    <div
                      className="selectedImage-div"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'right',
                        marginTop: '8px',
                        marginRight: '15px'
                      }}
                    >
                      {selectedImage && (
                        <Typography
                          variant="body2"
                          style={{ color: '#1890ff', display: 'flex', flexDirection: 'column', marginBottom: '8px' }}
                        >
                          {selectedImage.name}
                        </Typography>
                      )}
                      {formData.errors[field.name] && (
                        <Typography variant="body2" style={{ color: 'red', marginTop: '8px' }}>
                          {formData.errors[field.name]}
                        </Typography>
                      )}
                    </div>
                  </div>
                </FormControl>
              )}
              {field.type === 'select' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <InputLabel
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '5px !important',
                      marginLeft: '8px !important',
                      marginRight: '8px !important',
                      color: focusedField === field.name ? '#000' : '#000'
                    }}
                  >
                    {field.label}
                  </InputLabel>
                  <Select
                    className="select-modal"
                    style={{
                      textAlign: 'left',
                      color: '#000' // Change the text color
                    }}
                    onChange={(e) => {
                      if (field.action) {
                        field.action(e);
                      }
                      handleChange(e); // Make sure to call handleChange if needed
                    }}
                    name={field.name}
                    value={formData.data[field.name] || ''}
                    required={field.isrequired}
                    disabled={field.disableOption === 'disabled' && true}
                    readOnly={field.disableOption === 'readonly' && true}
                    onFocus={() => handleFieldFocus(field.name)}
                    onBlur={() => setFocusedField(null)}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {field.type === 'textarea' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <TextareaAutosize
                    minRows={3} // You can adjust the number of rows as needed
                    maxRows={10} // You can adjust the maximum number of rows as needed
                    aria-label={field.label}
                    placeholder={field.label}
                    name={field.name}
                    required={field.isrequired}
                    disabled={field.disableOption === 'disabled' && true}
                    readOnly={true}
                    value={formData.data[field.name] ? formData.data[field.name] : field.value}
                    onChange={handleChange}
                    error={!!formData.errors[field.name]}
                    helperText={formData.errors[field.name]}
                    fullWidth
                    style={{
                      color: '#000',
                      borderColor: focusedField === field.name ? '#1890ff' : '#000'
                    }}
                    onFocus={() => handleFieldFocus(field.name)}
                    onBlur={() => setFocusedField(null)}
                  />
                </FormControl>
              )}

              {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'password') && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    required={field.isrequired}
                    disabled={field.disableOption === 'disabled' && true}
                    readOnly={true}
                    value={formData.data[field.name] ? formData.data[field.name] : field.value}
                    onChange={(e) => {
                      handleChange(e); // Call the common handleChange function
                    }}
                    onInput={(e) => {
                      if (field.action) {
                        field.action(e);
                      }
                    }}
                    error={!!formData.errors[field.name]}
                    helperText={formData.errors[field.name]}
                    fullWidth
                    InputLabelProps={{
                      style: {
                        color: focusedField === field.name ? '#000' : '#000'
                      }
                    }}
                    InputProps={{
                      style: {
                        color: '#000',
                        borderColor: focusedField === field.name ? '#1890ff' : '#000'
                      }
                    }}
                    onFocus={() => handleFieldFocus(field.name)}
                    onBlur={() => setFocusedField(null)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: focusedField === field.name ? '#1890ff' : '#000'
                        },
                        '&:hover fieldset': {
                          borderColor: '#1890ff'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1890ff'
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#1890ff' // Change the text color
                      }
                    }}
                  />
                </FormControl>
              )}

              {(field.type === 'textlist' || field.type === 'numberlist') && (
                <FormControl style={{ width: '100%', marginBottom: '15px', border: '1px solid black', borderRadius: '10px' }}>
                  <InputLabel style={{ color: focusedField === field.name ? '#000' : '#000' }}>{field.label}</InputLabel>
                  <div style={{ marginTop: '40px', padding: '10px' }}>
                    {textFields.map((subfield, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl style={{ width: '90%', marginBottom: '15px' }}>
                          <TextField
                            label={subfield.label}
                            name={subfield.name}
                            type={(field.type === 'textlist' && 'text') || (field.type === 'numberlist' && 'number')}
                            required={subfield.isrequired}
                            disabled={subfield.disableOption === 'disabled' && true}
                            readOnly={true}
                            onChange={(event) => handleChangeDynamicText(event, index, field.name)}
                            error={!!formData.errors[subfield.name]}
                            helperText={formData.errors[subfield.name]}
                            fullWidth
                          />
                        </FormControl>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteTextBox(index)}
                          type="button"
                          style={{
                            width: '10%',
                            height: '50px',
                            background: 'transparent',
                            color: 'black',
                            outline: '0px',
                            marginLeft: '10px',
                            boxShadow: 'none'
                          }}
                        >
                          <IconTrash />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddTextBox}
                      type="button"
                      style={{ width: '10%', background: '#1790FF', color: 'white', height: '35px', marginBottom: '20px' }}
                    >
                      <IconPlus />
                    </Button>
                    {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
                  </div>
                </FormControl>
              )}

              {field.type === 'checkgroup' && (
                <FormControl
                  style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '15px',
                    border: '1px solid black',
                    borderRadius: '10px'
                  }}
                >
                  <Typography>{field.label}</Typography>
                  <div style={{ marginTop: '10px' }}>
                    {field.options.length === 0 ? (
                      <p>
                        <i>No {field.label} available</i>
                      </p>
                    ) : (
                      field.options.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              name={field.name}
                              value={option.label}
                              onChange={(e) => {
                                handleChangeCheckList(e);
                              }}
                              color="primary"
                              disabled={field.disableOption === 'disabled' && true}
                              readOnly={field.disableOption === 'readonly' && true}
                            />
                          }
                          label={option.label}
                        />
                      ))
                    )}
                  </div>
                  {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
                </FormControl>
              )}

              {field.type === 'date' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <InputLabel style={{ color: focusedField === field.name ? '#000' : '#000' }}>{field.label}</InputLabel>
                  <div style={{ marginTop: '50px', padding: '0px 20px 20px 20px' }}>
                    <FormControlLabel
                      control={
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            color="primary"
                            value={
                              formData.data[field.name]
                                ? dayjs(formData.data[field.name]).isValid()
                                  ? dayjs(formData.data[field.name])
                                  : null
                                : null
                            }
                            onChange={(e) => {
                              handleDateChange(field.name, e, field.type);
                            }}
                            InputLabelProps={{
                              style: {
                                color: focusedField === field.name ? '#000' : '#000'
                              }
                            }}
                            InputProps={{
                              style: {
                                color: '#000',
                                borderColor: focusedField === field.name ? '#1890ff' : '#000'
                              }
                            }}
                            onFocus={() => handleFieldFocus(field.name)}
                            onBlur={() => setFocusedField(null)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: focusedField === field.name ? '#1890ff' : '#000'
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1890ff'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1890ff'
                                }
                              },
                              '& .MuiOutlinedInput-input': {
                                color: '#1890ff' // Change the text color
                              }
                            }}
                          />
                        </LocalizationProvider>
                      }
                    />
                  </div>
                  {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
                </FormControl>
              )}
              {field.type === 'time' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <InputLabel style={{ color: focusedField === field.name ? '#000' : '#000' }}>{field.label}</InputLabel>
                  <div style={{ marginTop: '50px', padding: '0px 20px 20px 20px' }}>
                    <FormControlLabel
                      control={
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            color="primary"
                            value={formData.data[field.name] ? formData.data[field.name] : null}
                            onChange={(e) => {
                              handleDateChange(field.name, e, field.type);
                            }}
                            InputLabelProps={{
                              style: {
                                color: focusedField === field.name ? '#000' : '#000'
                              }
                            }}
                            InputProps={{
                              style: {
                                color: '#000',
                                borderColor: focusedField === field.name ? '#1890ff' : '#000'
                              }
                            }}
                            onFocus={() => handleFieldFocus(field.name)}
                            onBlur={() => setFocusedField(null)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: focusedField === field.name ? '#1890ff' : '#000'
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1890ff'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1890ff'
                                }
                              },
                              '& .MuiOutlinedInput-input': {
                                color: '#1890ff' // Change the text color
                              }
                            }}
                          />
                        </LocalizationProvider>
                      }
                    />
                  </div>
                  {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
                </FormControl>
              )}
              {field.type === 'search' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <Autocomplete
                    options={field.options || []} // Ensure that options is defined or provide a default value
                    getOptionLabel={(option) => option.label}
                    value={formData.data[field.name]}
                    onChange={(e) => {
                      if (field.action) {
                        field.action(e);
                      }
                      handleChange(e); // Make sure to call handleChange if needed
                    }}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.label}
                        InputLabelProps={{
                          style: {
                            color: focusedField === field.name ? '#000' : '#000'
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          style: {
                            color: '#000',
                            borderColor: focusedField === field.name ? '#1890ff' : '#000'
                          }
                        }}
                        onFocus={() => handleFieldFocus(field.name)}
                        onBlur={() => setFocusedField(null)}
                      />
                    )}
                  />
                </FormControl>
              )}

              {field.type === 'datetime' && (
                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                  <InputLabel style={{ color: focusedField === field.name ? '#000' : '#000' }}>{field.label}</InputLabel>
                  <div style={{ marginTop: '50px', padding: '0px 20px 20px 20px' }}>
                    <FormControlLabel
                      control={
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            color="primary"
                            value={formData.data[field.name] ? formData.data[field.name] : null}
                            onChange={(e) => {
                              handleDateChange(field.name, e, field.type);
                            }}
                            InputLabelProps={{
                              style: {
                                color: focusedField === field.name ? '#000' : '#000'
                              }
                            }}
                            InputProps={{
                              style: {
                                color: '#000',
                                borderColor: focusedField === field.name ? '#1890ff' : '#000'
                              }
                            }}
                            onFocus={() => handleFieldFocus(field.name)}
                            onBlur={() => setFocusedField(null)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: focusedField === field.name ? '#1890ff' : '#000'
                                },
                                '&:hover fieldset': {
                                  borderColor: '#1890ff'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1890ff'
                                }
                              },
                              '& .MuiOutlinedInput-input': {
                                color: '#1890ff' // Change the text color
                              }
                            }}
                          />
                        </LocalizationProvider>
                      }
                    />
                  </div>
                  {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
                </FormControl>
              )}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', padding: '20px', justifyContent: 'space-between' }}>
          <Button disabled={props.count == 0} variant="contained" onClick={props.handlePrev}>
            Previous
          </Button>
          <Button type="submit" variant="contained">
            {columns[0].buttonText ? columns[0].buttonText : 'Next'}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default SimpleForm;
