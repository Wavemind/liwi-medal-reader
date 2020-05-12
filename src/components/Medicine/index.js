import { connect } from "react-redux";
import Medicine from "./Medicine";
import { withApplication } from "../../engine/contexts/Application.context";
import { setMedicine } from "../../../frontend_service/actions/creators.actions";

const mapStateToProps = (medicalCase, props) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setMedecine: (type, diagnosesKey, medecineId, boolean) => dispatch(setMedicine(type, diagnosesKey, medecineId, boolean)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(Medicine));
