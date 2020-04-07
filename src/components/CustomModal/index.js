import { connect } from 'react-redux';
import CustomModal from './CustomModal';
import { withApplication } from '../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: () => dispatch(updateModalFromRedux()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(CustomModal));
