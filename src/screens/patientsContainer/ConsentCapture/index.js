import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { addConsentFile, updateMedicalCaseProperty } from '../../../../frontend_service/actions/creators.actions';
import { withApplication } from '../../../engine/contexts/Application.context';
import ConsentCapture from './ConsentCapture';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addConsentFile: (page) => dispatch(addConsentFile(page)),
    updateMedicalCaseProperty: (property, newValue) => dispatch(updateMedicalCaseProperty(property, newValue)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(withNavigation(ConsentCapture)));
