import { connect } from 'react-redux';
import ToolTipModal from './ToolTipModal';
import { withApplication } from '../../engine/contexts/Application.context';
import { setMedicalCase, updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  const modal = medicalCase.modal === undefined ? { open: false, params: {} } : medicalCase.modal;

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
