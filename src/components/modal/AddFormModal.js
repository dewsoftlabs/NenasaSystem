/* eslint-disable no-unused-vars */
import { TextareaAutosize } from '@mui/base';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
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
import Form from '../form/Form';

export default function AddFormModal(props) {
  const { enableAddButton, columns, formData, setFormData, formSubmit, isOpen, handleClose } = props;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="modal-container">
        <div className="modal-inner-container">
          <div style={{ width: '100%', color: 'white', height: '50px', marginBottom: 15 }}>
            <Typography variant={columns[0].headingVarient} component="h2" gutterBottom style={{ color: '#000', paddingTop: 10 }}>
              {columns[0].formHeading}
            </Typography>
            <IconButton onClick={handleClose} style={{ marginRight: 15, marginTop: 15, position: 'absolute', top: 0, right: 0 }}>
              <CloseIcon />
            </IconButton>
          </div>
          {enableAddButton && (
            <div>
              <div>
                <Form columns={columns} enableAddButton={true} formData={formData} setFormData={setFormData} formSubmit={formSubmit} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
