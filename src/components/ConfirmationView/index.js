import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import ConfirmationView from "./ConfirmationView";
import { withApplication } from "../../engine/contexts/Application.context";

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withNavigation(withApplication(ConfirmationView)));
