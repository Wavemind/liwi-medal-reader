import { connect } from 'react-redux';
import Boolean from './Boolean';
import { setAnswer } from '../../../../../frontend_service/actions/creators.actions';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswer: (index, value) => dispatch(setAnswer(index, value)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(Boolean)));
