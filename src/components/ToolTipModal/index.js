import { connect } from 'react-redux';
import ToolTipModal from './ToolTipModal';
import { withApplication } from '../../engine/contexts/Application.context';
import { setMedicalCase, updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  const modal = medicalCase.modal === undefined ? { open: false, params: { showClose: true } } : medicalCase.modal;

  if (modal.params.showClose === undefined) {
    modal.params.showClose = true;
  }

  return {
    modalRedux: modal,
    patientId: medicalCase?.patient?.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: () => dispatch(updateModalFromRedux()),
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(ToolTipModal));
