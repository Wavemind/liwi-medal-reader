import VitalSigns from './VitalSigns.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

const mapStateToProps = (medicalCase, ownProps) => {
  return {medicalCase};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(withNamespaces(['settings'])(VitalSigns))));
