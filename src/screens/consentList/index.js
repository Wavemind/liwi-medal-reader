import { connect } from 'react-redux';
import ConsentList from './ConsentList.screen';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(null, mapDispatchToProps)(withApplication(WrapperNavigation(ConsentList)));
