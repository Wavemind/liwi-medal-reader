import { withSessions } from 'engine/contexts/Sessions.context';
import { withApplication } from 'engine/contexts/Application.context';
import { connect } from 'react-redux';
import Algorithms from './Algorithms.screen';
import { updateMedicalCaseProperty } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMedicalCaseProperty: (prop, date) => dispatch(updateMedicalCaseProperty(prop, date)),
  };
};

const defaultProps = {
  navigationStatus: 'willBlur',
};

export default connect(mapStateToProps, mapDispatchToProps)(withSessions(withApplication(WrapperNavigation(Algorithms, defaultProps))));
