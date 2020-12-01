import { connect } from 'react-redux';
import ArmControlMedicines from './ArmControlMedicines.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setAdditionalMedicine, setAdditionalMedicineDuration } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdditionalMedicine: (medicines) => dispatch(setAdditionalMedicine(medicines)),
    setAdditionalMedicineDuration: (id, duration) => dispatch(setAdditionalMedicineDuration(id, duration)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(ArmControlMedicines)));
