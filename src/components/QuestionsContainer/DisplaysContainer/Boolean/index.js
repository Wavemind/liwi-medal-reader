import { connect } from 'react-redux';
import Boolean from './Boolean';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setPatientValue, setAnswer, updateModalFromRedux } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (algorithm, index, newValue) => dispatch(setAnswer(algorithm, index, newValue)),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Boolean));
