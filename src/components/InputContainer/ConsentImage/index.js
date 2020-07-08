import { connect } from 'react-redux';
import { addConsentFile, updateMedicalCaseProperty } from '../../../../frontend_service/actions/creators.actions';
import { withApplication } from '../../../engine/contexts/Application.context';
import ConsentImage from './ConsentImage';

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

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(ConsentImage));
