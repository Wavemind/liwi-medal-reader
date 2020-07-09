import { connect } from 'react-redux';
import Numeric from './Numeric';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';
import { setPatientValue, setEstimable } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    setEstimable: (index, value) => dispatch(setEstimable(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Numeric);
