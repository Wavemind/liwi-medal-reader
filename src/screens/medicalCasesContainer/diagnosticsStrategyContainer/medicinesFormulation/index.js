import { connect } from 'react-redux';
import MedicinesFormulations from './MedicinesFormulation.screen';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';
import { setFormulationSelected } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormulationSelected: (diagnoseId, formulation, type, drugId) => dispatch(setFormulationSelected(diagnoseId, formulation, type, drugId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(MedicinesFormulations)));
