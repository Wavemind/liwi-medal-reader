import { connect } from 'react-redux';
import ConsentPreview from './ConsentPreview.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (state) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const defaultProps = {
  navigationStatus: 'willBlur',
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(ConsentPreview, defaultProps)));
