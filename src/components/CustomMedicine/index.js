import { connect } from 'react-redux';
import CustomMedicine from './CustomMedicine';
import { withApplication } from '../../engine/contexts/Application.context';
import { setCustomMedicine } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setCustomMedicine: (diagnosesKey, medicine, type) => dispatch(setCustomMedicine(diagnosesKey, medicine, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(CustomMedicine));
