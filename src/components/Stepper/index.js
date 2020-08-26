import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import Stepper from './Stepper';
import { withApplication } from '../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(null, mapDispatchToProps)(withNavigation(withApplication(Stepper)));
