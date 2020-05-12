import { connect } from "react-redux";
import QuestionsReference from "./QuestionsReference";

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(QuestionsReference);
