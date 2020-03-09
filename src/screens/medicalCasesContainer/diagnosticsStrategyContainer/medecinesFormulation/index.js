import { connect } from 'react-redux';
import MedecinesFormulations from './MedecinesFormulation.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
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
)(withSessions(withApplication(WrapperNavigation(MedecinesFormulations))));
