import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ChiefComplaint from './ChiefComplaints.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setQuestion } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {medicalCase};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestion: (index, value) => dispatch(setQuestion(index, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(withNamespaces(['settings'])(ChiefComplaint))));
