import Drawer from './Drawer.navigation';
import { withApplication } from '../../contexts/Application.context';
import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  return {
    medicalCase: state,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( withSessions( withApplication( Drawer ) ) );
