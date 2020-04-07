import { connect } from 'react-redux';
import Boolean from './Boolean';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { manageSetAnswer } from '../../../../../frontend_service/engine/utilsDispatcher';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => manageSetAnswer(index, value, dispatch, props),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Boolean));
