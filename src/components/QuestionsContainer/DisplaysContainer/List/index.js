import { connect } from 'react-redux';
import List from './List';
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
export default connect(mapStateToProps, mapDispatchToProps)(List);
