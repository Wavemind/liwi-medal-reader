import { connect } from 'react-redux';
import Unavailable from './Unavailable';
import { setAnswerUnavailable } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswerUnavailable: (nodeId, value) => dispatch(setAnswerUnavailable(nodeId, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Unavailable);
