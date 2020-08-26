import { connect } from "react-redux";
import PatientSummaryMenu from "./PatientSummaryMenu.navigation";
import { withApplication } from "../../contexts/Application.context";

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(withApplication(PatientSummaryMenu));
