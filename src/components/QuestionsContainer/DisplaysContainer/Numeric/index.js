import { connect } from 'react-redux';
import Numeric from './Numeric';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Numeric);
