import { connect } from 'react-redux';
import Numeric from './Numeric';
import { setAnswer } from '../../../../../frontend_service/actions/creators.actions';

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
)(Numeric);
