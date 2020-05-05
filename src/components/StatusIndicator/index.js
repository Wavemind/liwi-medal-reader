import { connect } from "react-redux";
import StatusIndicator from "./StatusIndicator";
import { withApplication } from "../../engine/contexts/Application.context";

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withApplication(StatusIndicator));
