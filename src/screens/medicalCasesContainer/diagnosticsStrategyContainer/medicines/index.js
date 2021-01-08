import { connect } from 'react-redux';
import Medicines from './Medicines.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setAdditionalMedicine, setAdditionalMedicineDuration, updateModalFromRedux } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdditionalMedicine: (medicines) => dispatch(setAdditionalMedicine(medicines)),
    setAdditionalMedicineDuration: (id, duration) => dispatch(setAdditionalMedicineDuration(id, duration)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(Medicines)));
