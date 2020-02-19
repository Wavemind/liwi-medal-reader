import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import NavigationTriage from './NavigationTriage';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { updateMedicalCaseProperty } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStatus: (status, newValue) => dispatch(updateMedicalCaseProperty(status, newValue)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withSessions(withApplication(withNavigation(NavigationTriage))));
