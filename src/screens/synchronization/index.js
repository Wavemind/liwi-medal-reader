import { connect } from 'react-redux';
import Synchronization from './Synchronization.screen';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMedicalCaseProperty: (prop, date) => dispatch(updateMedicalCaseProperty(prop, date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(Synchronization)));
