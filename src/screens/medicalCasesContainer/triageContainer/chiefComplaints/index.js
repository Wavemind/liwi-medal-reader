import ChiefComplaint from './ChiefComplaints.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setQuestion } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {medicalCase};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setQuestion: (index, value) => dispatch(setQuestion(index, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(withNamespaces(['settings'])(ChiefComplaint))));
