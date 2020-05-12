import { connect } from "react-redux";
import MedicalCaseSummary from "./MedicalCaseSummary.screen";
import { withApplication } from "../../../engine/contexts/Application.context";
import { setMedicalCase, updatePatient } from "../../../../frontend_service/actions/creators.actions";
import { WrapperNavigation } from "../../../utils/WrapperNavigation";

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(MedicalCaseSummary)));
