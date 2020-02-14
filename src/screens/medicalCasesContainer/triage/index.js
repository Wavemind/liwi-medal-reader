import { connect } from 'react-redux';
import Triage from './Triage.Screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';
import { updateMetaData } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMetaData: (screen, view, value) => dispatch(updateMetaData(screen, view, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WrapperNavigation(Triage))));
