import { connect } from 'react-redux';
import patientEdit from './PatientEdit.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setPatient } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPatient: (patient, algorithm) => dispatch(setPatient(patient, algorithm)),
  };
};

const defaultProps = {
  navigationStatus: 'willBlur',
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(patientEdit, defaultProps)));
