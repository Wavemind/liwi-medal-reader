import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';
import Drawer from './Drawer.navigation';
import { withApplication } from '../../contexts/Application.context';

const mapStateToProps = (state) => {
  return {
    medicalCase: state,
  };
};

export default connect(
  mapStateToProps
)(withSessions(withApplication(Drawer)));
