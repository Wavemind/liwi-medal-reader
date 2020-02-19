import { connect } from 'react-redux';
import Date from './Date';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Date);
