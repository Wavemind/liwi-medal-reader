import { connect } from 'react-redux';
import ToolTipModal from './ToolTipModal';
import { withApplication } from '../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  const modal = medicalCase.modal === undefined ? { open: false } : medicalCase.modal;
  return {
    modalRedux: modal,
    patientId: medicalCase?.patient?.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: () => dispatch(updateModalFromRedux()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(ToolTipModal));
