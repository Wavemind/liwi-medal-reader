import { connect } from 'react-redux';
import DiagnosticsStrategy from './DiagnosticsStrategy.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withApplication(WrapperNavigation(DiagnosticsStrategy)));
