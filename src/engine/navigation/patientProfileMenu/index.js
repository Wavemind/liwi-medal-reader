import PatientProfileMenu from './PatientProfileMenu.navigation';

import { withSessions } from '../../../engine/contexts/Sessions.context';

import { withApplication } from '../../../engine/contexts/Application.context';

import { connect } from 'react-redux';

const mapStateToProps = (medicalCase, ownProps) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,

  mapDispatchToProps
)(withSessions(withApplication(PatientProfileMenu)));
