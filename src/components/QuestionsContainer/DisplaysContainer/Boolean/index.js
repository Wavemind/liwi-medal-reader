import { connect } from 'react-redux';
import Boolean from './Boolean';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { dispatcherOnChangeSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) =>
      dispatcherOnChangeSetAnswer(index, value, dispatch, props),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(Boolean)));
