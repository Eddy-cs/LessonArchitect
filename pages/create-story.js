import { Fragment } from "react";
import { auth } from "../components/Login";
import StoryForm from "../components/StoryForm";
import { useAuthState } from "react-firebase-hooks/auth";

function CreateStory() {
  const [user] = useAuthState(auth);
  return (
    <Fragment>
      <StoryForm userData={user || "null"} />
    </Fragment>
  );
}

export default CreateStory;
