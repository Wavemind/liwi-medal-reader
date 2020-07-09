import { connect } from 'react-redux';
import String from './String';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';
import { setPatientValue } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(String);
