import { connect } from 'react-redux';
import Date from './Date';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';
import { setPatientValue } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Date);
