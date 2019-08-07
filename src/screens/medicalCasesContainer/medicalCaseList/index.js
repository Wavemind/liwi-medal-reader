import { connect } from 'react-redux';
import MedicalCaseList from './MedicalCaseList.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { updatePatient } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(MedicalCaseList)));
