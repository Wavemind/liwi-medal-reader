import { connect } from 'react-redux';
import QuestionFactory from './Question.factory';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setAnswer, updateModalFromRedux, setUnavailable } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUnavailable: (algorithm, nodeId, value) => dispatch(setUnavailable(algorithm, nodeId, value)),
    setAnswer: (algorithm, index, newValue) => dispatch(setAnswer(algorithm, index, newValue)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(QuestionFactory));
