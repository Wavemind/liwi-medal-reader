import { connect } from 'react-redux';
import Autocomplete from './Autocomplete';
import { setAnswer, setPatientValue } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    setAnswer: (algorithm, index, newValue) => dispatch(setAnswer(algorithm, index, newValue)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);
