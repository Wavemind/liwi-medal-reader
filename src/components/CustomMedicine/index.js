import { connect } from 'react-redux';
import CustomMedicine from './CustomMedicine';
import { withApplication } from '../../engine/contexts/Application.context';
import { setCustomMedecine } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setCustomMedecine: (diagnosesKey, medecine, type) => dispatch(setCustomMedecine(diagnosesKey, medecine, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(CustomMedicine));
