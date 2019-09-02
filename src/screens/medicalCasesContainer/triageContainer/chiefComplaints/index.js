import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ChiefComplaint from './ChiefComplaints.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setAnswer } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {medicalCase};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswer: (index, value) => dispatch(setAnswer(index, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(withNamespaces(['settings'])(ChiefComplaint))));
