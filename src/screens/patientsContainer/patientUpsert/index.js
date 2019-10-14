import { connect } from 'react-redux';
import PatientUpsert from './PatientUpsert.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setMedicalCase } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WrapperNavigation(PatientUpsert))));
