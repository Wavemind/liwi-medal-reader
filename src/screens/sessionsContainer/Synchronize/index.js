import { connect } from 'react-redux';
import Synchronize from './Synchronize.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../../frontend_service/actions/creators.actions';

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(null, mapDispatchToProps)(withApplication(Synchronize));