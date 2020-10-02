import { connect } from 'react-redux';
import Numeric from './Numeric';
import {setPatientValue, setEstimable, setAnswer} from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (algorithm, index, value) => dispatch(setAnswer(algorithm, index, value)),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    setEstimable: (index, value) => dispatch(setEstimable(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Numeric);
