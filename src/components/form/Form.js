/* eslint-disable no-unused-vars */
import { TextareaAutosize } from '@mui/base';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs';
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
  const theme = useTheme();
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

  const { enableAddButton, columns, formData, setFormData, formSubmit, isOpen, handleClose } = props;

  const handleValidation = (validationType, field) => {
    if (validationType === 'mobile') {
      const validation = Yup.string()
        .matches(/^[+]\d{1,3}\s?(\d{10}|\d{12})$/, {
          message: 'Invalid mobile number',
          excludeEmptyString: true
        })
        .required('This field is required');

      field.validation = validation;
    } else if (validationType === 'email') {
      const validation = Yup.string().email('Invalid email address').required('This field is required');
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
    } else if (field.isrequired === true) {
      const validation = Yup.string().required('This field is required');
      field.validation = validation;
    }
  };

  const formFields = columns[0].fields.reduce((fields, column) => {
    const { accessorKey, header, formField } = column;

    // Create a field object
    const field = {
      name: accessorKey,
      label: header,
      value: formField.value || '', // Handle potential undefined values
      isrequired: formField.isRequired || false, // Handle potential undefined values
      disableOption: formField.disableOption || 'default', // Handle potential undefined values
      type: formField.type === 'TextField' ? 'text' : formField.type,
      xs: formField.xs
    };

    // Call handleValidation if needed
    if (formField.isFormField) {
      handleValidation(formField.validationType, field);
    }

    // Handle 'select' or 'checkgroup' fields
    if (formField.type === 'select' || formField.type === 'checkgroup') {
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
    checkValidation(event);
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
      formSubmit(formData);
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

  const renderFileField = (field) => (
    <FormControl style={{ width: '100%', marginBottom: theme.spacing(2) }}>
      <div
        style={{
          border: `1px solid ${theme.palette.background.paper}`,
          borderRadius: theme.shape.borderRadius,
          paddingTop: theme.spacing(1),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'right',
          height: 'auto'
        }}
      >
        <InputLabel
          style={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            margin: 0,
            color: theme.palette.text.primary
          }}
        >
          {field.label}
        </InputLabel>
        <input
          name={field.name}
          type="file"
          accept="image/pdf"
          onChange={(e) => {
            handleChange(e);
          }}
          style={{ display: 'none' }}
          id={`${field.name}-upload-input`}
        />

        <label htmlFor={`${field.name}-upload-input`} style={{ textAlign: 'right', marginRight: theme.spacing(2) }}>
          <Button
            variant="outlined"
            color="secondary"
            component="span"
            style={{ color: theme.palette.common.white, backgroundColor: theme.palette.primary.main }}
          >
            Upload Image
          </Button>
        </label>

        <div
          className="selectedImage-div"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'right',
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(2)
          }}
        >
          {formData.errors[field.name] && (
            <Typography
              variant="body2"
              style={{ color: theme.palette.error.main, display: 'flex', flexDirection: 'column', marginBottom: theme.spacing(1) }}
            >
              {formData.errors[field.name]}
            </Typography>
          )}
        </div>
      </div>
    </FormControl>
  );

  const renderSelectField = (field) => (
    <FormControl style={{ width: '100%', marginBottom: theme.spacing(2) }}>
      <InputLabel
        style={{
          borderRadius: `${theme.shape.borderRadius} !important`,
          marginLeft: `${theme.spacing(1)} !important`,
          marginRight: `${theme.spacing(1)} !important`,
          borderColor: theme.palette.text.primary,
          backgroundColor: theme.palette.background['paper'],
          color: theme.palette.text.primary
        }}
      >
        {field.label}
      </InputLabel>
      <Select
        className="select-modal"
        name={field.name}
        value={formData.data[field.name] || ''}
        onChange={handleChange}
        required={field.isrequired}
        disabled={field.disableOption === 'disabled' && true}
        readOnly={field.disableOption === 'readonly' && true}
        onFocus={() => handleFieldFocus(field.name)}
        onBlur={() => setFocusedField(null)}
        InputLabelProps={{
          style: {
            backgroundColor: theme.palette.background['paper']
          }
        }}
        InputProps={{
          style: {
            backgroundColor: theme.palette.background['paper']
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.text.primary
            },
            '&:hover fieldset': {
              borderColor: theme.palette.text.primary
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.text.primary
            }
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background['paper']
          },
          '& fieldset': {
            borderColor: theme.palette.text.primary
          },
          '&:hover fieldset': {
            borderColor: theme.palette.text.primary
          },
          '& fieldset .Mui-focused': {
            borderColor: theme.palette.text.primary
          }
        }}
      >
        {field.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderTextareaField = (field) => (
    <FormControl style={{ width: '100%', marginBottom: theme.spacing(2) }}>
      <TextareaAutosize
        minRows={3}
        maxRows={10}
        aria-label={field.label}
        placeholder={field.label}
        name={field.name}
        required={field.isrequired}
        readOnly={true}
        value={formData.data[field.name] ? formData.data[field.name] : ''}
        onChange={handleChange}
        error={!!formData.errors[field.name]}
        helperText={formData.errors[field.name]}
        fullWidth
        style={{
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background['paper'],
          borderColor: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
        }}
        onFocus={() => handleFieldFocus(field.name)}
        onBlur={() => setFocusedField(null)}
      />
    </FormControl>
  );

  const renderTextField = (field) => (
    <FormControl style={{ width: '100%', marginBottom: theme.spacing(2) }}>
      <TextField
        label={field.label}
        style={{ backgroundColor: theme.palette.background['paper'] }}
        name={field.name}
        type={field.type}
        required={field.isrequired}
        disabled={field.disableOption === 'disabled' && true}
        readOnly={true}
        value={formData.data[field.name] ? formData.data[field.name] : field.value}
        onChange={handleChange}
        error={!!formData.errors[field.name]}
        helperText={formData.errors[field.name]}
        fullWidth
        InputProps={{
          style: {
            color: theme.palette.text.primary,
            borderColor: formData.errors[field.name] ? theme.palette.text.dark : theme.palette.text.primary
          }
        }}
        onFocus={() => handleFieldFocus(field.name)}
        onBlur={() => setFocusedField(null)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            }
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.text['primary'],
            backgroundColor: theme.palette.background['paper']
          }
        }}
      />
    </FormControl>
  );

  const renderSearch = (field) => (
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
                color: focusedField === field.name ? theme.palette.text.primary : theme.palette.text.primary
              }
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                color: theme.palette.text.primary,
                borderColor: focusedField === field.name ? theme.palette.text.primary : theme.palette.text.primary
              }
            }}
            onFocus={() => handleFieldFocus(field.name)}
            onBlur={() => setFocusedField(null)}
          />
        )}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background['paper'],
            borderColor: theme.palette.primary['main'],

            '& fieldset': {
              borderColor: theme.palette.primary.main
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            }
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.text['primary'],
            backgroundColor: theme.palette.background['paper']
          }
        }}
      />
    </FormControl>
  );

  const renderCheckGroup = (field) => {
    return (
      <FormControl
        sx={{
          '&': {
            width: '100%',
            borderColor: focusedField === field.name ? theme.palette.text.dark : theme.palette.text.primary,
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid',
            borderRadius: '10px'
          }
        }}
      >
        <Typography>{field.label}</Typography>
        <div style={{ display: 'flex', flexDirection: field.options.length > 2 ? 'column' : 'row', width: '100%', paddingTop: '20px' }}>
          <div>
            {field.options.length === 0 ? (
              <p>
                <i>No {field.label} available</i>
              </p>
            ) : (
              field.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  onFocus={() => handleFieldFocus(field.name)}
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
                  style={{
                    marginBottom: field.options.length > 2 ? '8px' : '0',
                    marginRight: field.options.length > 2 ? '0' : '8px',
                    width: field.options.length > 2 ? '50%' : '100%'
                  }}
                />
              ))
            )}
          </div>
        </div>

        {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
      </FormControl>
    );
  };
  const renderListInputs = (field) => {
    return (
      <FormControl
        sx={{
          '&': {
            width: '100%',
            borderColor: focusedField === field.name ? theme.palette.text.dark : theme.palette.text.primary,
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid',
            borderRadius: '10px'
          }
        }}
      >
        <InputLabel>{field.label}</InputLabel>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background['paper'],
                      borderColor: theme.palette.primary['main'],

                      '& fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.text['primary'],
                      backgroundColor: theme.palette.background['paper']
                    }
                  }}
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
                  color: theme.palette.common.white,
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
    );
  };

  const renderDate = (field) => (
    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
      <InputLabel>{field.label}</InputLabel>
      <div style={{ width: '100%', marginTop: '38px', padding: '0px 20px 20px 20px' }}>
        <FormControlLabel
          style={{ width: '100%' }}
          sx={{
            '& .MuiFormControl-root': {
              width: '100%'
            }
          }}
          control={
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {field.type === 'date' ? (
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
                      color: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                    }
                  }}
                  InputProps={{
                    style: {
                      color: theme.palette.text.primary,
                      borderColor: formData.errors[field.name] ? theme.palette.text.dark : theme.palette.text.primary
                    }
                  }}
                  onFocus={() => handleFieldFocus(field.name)}
                  onBlur={() => setFocusedField(null)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.text['primary'],
                      backgroundColor: theme.palette.background['paper']
                    }
                  }}
                />
              ) : field.type === 'time' ? (
                <TimePicker
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
                      color: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                    }
                  }}
                  InputProps={{
                    style: {
                      color: theme.palette.text.primary,
                      borderColor: formData.errors[field.name] ? theme.palette.text.dark : theme.palette.text.primary
                    }
                  }}
                  onFocus={() => handleFieldFocus(field.name)}
                  onBlur={() => setFocusedField(null)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.text['primary'],
                      backgroundColor: theme.palette.background['paper']
                    }
                  }}
                />
              ) : field.type === 'datetime' ? (
                <DateTimePicker
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
                      color: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                    }
                  }}
                  InputProps={{
                    style: {
                      color: theme.palette.text.primary,
                      borderColor: formData.errors[field.name] ? theme.palette.text.dark : theme.palette.text.primary
                    }
                  }}
                  onFocus={() => handleFieldFocus(field.name)}
                  onBlur={() => setFocusedField(null)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: formData.errors[field.name] ? theme.palette.error.main : theme.palette.text.primary
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.text['primary'],
                      backgroundColor: theme.palette.background['paper']
                    }
                  }}
                />
              ) : (
                <></>
              )}
            </LocalizationProvider>
          }
        />
      </div>
      {formData.errors[field.name] && <FormHelperText>{formData.errors[field.name]}</FormHelperText>}
    </FormControl>
  );

  return (
    <div>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={field.xs} key={field.name}>
              {field.type === 'file' && renderFileField(field)}
              {field.type === 'select' && renderSelectField(field)}
              {field.type === 'search' && renderSearch(field)}
              {field.type === 'checkgroup' && renderCheckGroup(field)}
              {(field.type === 'textlist' || field.type === 'numberlist') && renderListInputs(field)}
              {field.type === 'textarea' && renderTextareaField(field)}
              {(field.type === 'date' || field.type === 'time' || field.type === 'datetime') && renderDate(field)}
              {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'password') &&
                renderTextField(field)}
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{
            width: '100%',
            background: theme.palette.primary.main,
            color: theme.palette.common.white,
            height: '50px',
            borderRadius: theme.shape.borderRadius,
            marginBottom: theme.spacing(1)
          }}
        >
          {columns[0].buttonText ? columns[0].buttonText : 'Submit'}
        </Button>
      </form>
    </div>
  );
}

export default SimpleForm;
