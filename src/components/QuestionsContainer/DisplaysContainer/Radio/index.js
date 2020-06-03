import { connect } from 'react-redux';
import Radio from './Radio';
import { setAnswer, setPatientValue } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswer: (index, value) => dispatch(setAnswer(index, value)),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Radio);
