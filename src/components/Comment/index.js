import { connect } from 'react-redux';
import Comment from './Comment';
import { updateMedicalCaseProperty } from '../../../frontend_service/actions/creators.actions';

const mapDispatchToProps = (dispatch) => {
  return {
    updateMedicalCaseProperty: (property, newValue) => dispatch(updateMedicalCaseProperty(property, newValue)),
  };
};

export default connect(null, mapDispatchToProps)(Comment);
