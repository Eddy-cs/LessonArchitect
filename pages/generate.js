import { Fragment } from "react";
import GenerateForm from "../components/GenerateForm";

function Generate(props) {
  return (
    <Fragment>
      <GenerateForm userData={props.user || "null"} />
    </Fragment>
  );
}

export default Generate;
