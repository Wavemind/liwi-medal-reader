import { connect } from 'react-redux';
import Comment from './Comment';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMedicalCaseProperty: (property, newValue) => dispatch(updateMedicalCaseProperty(property, newValue)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Comment));
