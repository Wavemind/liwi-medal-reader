import { connect } from 'react-redux';
import MedecinesFormulations from './MedecinesFormulation.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setAdditionalMedecine, setFormulation } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormulation: (diagnoseId, formulation, type, drugId) => dispatch(setFormulation(diagnoseId, formulation, type, drugId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(WrapperNavigation(MedecinesFormulations)));
