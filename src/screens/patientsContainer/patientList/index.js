import { connect } from 'react-redux';
import patientList from './PatientList.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { updatePatient } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
  };
};

export default connect(mapDispatchToProps)(withApplication(WrapperNavigation(patientList)));
