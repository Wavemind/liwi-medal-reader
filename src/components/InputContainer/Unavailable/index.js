import { connect } from 'react-redux';
import Unavailable from './Unavailable';
import { setAnswer } from '../../../../frontend_service/actions/creators.actions';
import { withApplication } from '../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAnswer: (algorithm, nodeId, value) => dispatch(setAnswer(algorithm, nodeId, value)),
  };
};
export default withApplication(connect(mapStateToProps, mapDispatchToProps)(Unavailable));
