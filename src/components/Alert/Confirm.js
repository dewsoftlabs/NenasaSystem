import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const Payments = (props) => {
  return (
    <>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.desc}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleDelete} color="primary">
            {props.buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Payments.propTypes = {
  open: PropTypes.bool.isRequired, // Corrected the type to 'bool' and added 'isRequired'
  handleClose: PropTypes.func.isRequired, // Corrected the type to 'func' and added 'isRequired'
  title: PropTypes.string.isRequired, // You can define types for other props too
  desc: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default Payments;
