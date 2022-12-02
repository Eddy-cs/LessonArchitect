import { Fragment } from "react";
import { auth } from "../components/Login";
import GenerateForm from "../components/GenerateForm";
import { useAuthState } from "react-firebase-hooks/auth";

function Generate() {
  const [user] = useAuthState(auth);
  return (
    <Fragment>
      <GenerateForm userData={user || "null"} />
    </Fragment>
  );
}

export default Generate;
