import { connect } from 'react-redux';
import CustomModal from './CustomModal';
import { withApplication } from '../../engine/contexts/Application.context';
import { setMedicalCase, updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  const modal = medicalCase.modal === undefined ? { open: false, params: { showClose: true } } : medicalCase.modal;

  if (modal.params === undefined) {
    modal.params = {
      showClose: true,
    };
  }

  return {
    modalRedux: modal,
    patientId: medicalCase?.patient?.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(CustomModal));
