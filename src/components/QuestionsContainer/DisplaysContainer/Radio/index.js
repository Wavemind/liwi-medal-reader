import { connect } from 'react-redux';
import Radio from './Radio';
import { setQuestion } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestion: (index, value) => dispatch(setQuestion(index, value)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radio);
