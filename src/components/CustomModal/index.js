import { connect } from 'react-redux';
import CustomModal from './CustomModal';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    modalRedux: medicalCase.modal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: () => dispatch(updateModalFromRedux()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(CustomModal)));
