import RootSessions from './RootSessions.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { withSessions } from 'engine/contexts/Sessions.context';
import { actions } from '../../../../frontend_service/actions/types.actions';
import { connect } from 'react-redux';


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clear: () => dispatch({ type: actions.MC_CLEAR }),
  };
};

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(withSessions(RootSessions)));
