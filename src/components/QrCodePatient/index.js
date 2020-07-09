import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import QrCodePatient from './QrCodePatient';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(withNavigation(QrCodePatient))));
