/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { logout, getToken } from '../../session';
import DialogBox from '../Alert/Confirm';
import SimpleTable from './SimpleTable';
import AdvancedTable from './AdvancedTable';
import AddFormModal from 'components/modal/AddFormModal';

function Table(props) {
  const { tableSettings, createForm } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [deleteId, setDeleteId] = useState(0);

  const [formData, setFormData] = useState({
    data: {},
    errors: {}
  });

  const handleAddForm = () => {
    setIsOpenAddModal(true);
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

      const response = await Axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}${tableSettings.add.addApi}`,
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
        props.fetchData();
        showToast(response.data.message);
        handleConfirmClose();
      } else if (response.status === 401) {
        logout();
      } else {
        props.fetchData();
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

  const deleteOpen = useCallback((dataArray) => {
    if (dataArray) {
      if (Array.isArray(dataArray)) {
        setIsOpen(true); // Open the dialog for multiple items
        setDeleteIds(dataArray);
        console.log(dataArray);
      } else {
        setIsOpen(true); // Open the dialog for a single item
        setDeleteId(dataArray);
      }
    }
  }, []);

  const handleConfirmClose = useCallback(() => {
    setIsOpen(false);
    setIsOpenAddModal(false);
    setDeleteIds([]);
    setDeleteId(0);
    setFormData({
      data: {},
      errors: {}
    });
  }, []);

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

  const updateData = async (userId, values) => {
    try {
      setIsLoading(true);

      const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}${tableSettings.editing.updateApi}${userId}`, values, {
        headers: {
          'Content-Type': 'application/json',
          'x-token': getToken()
        }
      });

      if (response.status === 200) {
        setIsLoading(false);
        props.fetchData();
        showToast(response.data.message);
      } else if (response.status === 401) {
        logout();
      } else {
        props.fetchData();
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

  const deleteData = async (dataArray) => {
    if (tableSettings.delete.deleteApi !== '') {
      if (dataArray.length > 0) {
        try {
          setIsLoading(true);

          const idArray = dataArray.map((data) => data.id);

          const data = {
            userIds: idArray
          };

          const response = await Axios.put(`${process.env.REACT_APP_API_ENDPOINT}${tableSettings.delete.deleteApi}`, data, {
            headers: {
              'Content-Type': 'application/json',
              'x-token': getToken()
            }
          });

          if (response.status === 200) {
            setIsLoading(false);
            props.fetchData();
            showToast('Delete Success');
            handleConfirmClose();
          } else if (response.status === 401) {
            logout();
          } else {
            props.fetchData();
            handleConfirmClose();
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            window.location.reload();
            logout();
          } else {
            showToast(error.response?.data.error || 'An error occurred', 'warn');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        showToast('Data Not Found', 'warn');
        props.fetchData();
        handleConfirmClose();
      }
    } else {
      showToast('An error occurred', 'warn');
      props.fetchData();
      handleConfirmClose();
    }
  };

  const deleteSingle = async (deleteId) => {
    if (tableSettings.delete.singleDeleteApi != '') {
      try {
        setIsLoading(true);

        const response = await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}${tableSettings.delete.singleDeleteApi}${deleteId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-token': getToken()
          }
        });

        if (response.status === 200) {
          showToast('Delete Success');
          props.fetchData();
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
    } else {
      showToast('An error occurred', 'warn');
      props.fetchData();
      handleConfirmClose();
    }
  };

  const renderTable = () => {
    if (tableSettings.tableType === 'advance') {
      return (
        <AdvancedTable
          columns={props.columns}
          dataSet={props.dataSet}
          updateData={updateData}
          deleteOpen={deleteOpen}
          handleAddForm={handleAddForm}
          isLoading={isLoading || props.isLoading}
          tableSettings={tableSettings}
        />
      );
    } else {
      // Default to rendering the 'simple' table
      return (
        <SimpleTable
          columns={props.columns}
          dataSet={props.dataSet}
          updateData={updateData}
          deleteOpen={deleteOpen}
          handleAddForm={handleAddForm}
          isLoading={isLoading || props.isLoading}
          tableSettings={tableSettings}
        />
      );
    }
  };

  return (
    <div>
      {renderTable()}
      {isOpen && (
        <DialogBox
          open={isOpen}
          desc={`Are you sure you want to delete this ${tableSettings.table}?`}
          title="Confirm Delete"
          buttonText="Delete"
          handleClose={handleConfirmClose}
          handleDelete={() => {
            deleteId != 0 ? deleteSingle(deleteId) : deleteData(deleteIds);
          }}
        />
      )}
      {isOpenAddModal && (
        <AddFormModal
          enableAddButton={true}
          columns={props.createForm}
          formData={formData}
          isOpen={isOpenAddModal}
          setFormData={setFormData}
          formSubmit={formSubmit}
          tableSettings={tableSettings}
          handleClose={handleConfirmClose}
        />
      )}
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSet: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableSettings: PropTypes.PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  isLoading: PropTypes.bool.isRequired
};

export default Table;
