import { connect } from 'react-redux';
import String from './String';
import { setAnswer, setPatientValue} from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    setAnswer: (index, value) => dispatch(setAnswer(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(String);
