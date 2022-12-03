import { Fragment, useEffect, useState } from "react";
import StoryList from "../components/StoryList";

function AllStories() {
  const [stories, setStories] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getStories() {
      const response = await fetch("/api/firebase-config");
      const data = await response.json();
      setStories(data);
      setIsLoading(true);
    }
    getStories();
  }, []);

  return (
    <Fragment>
      {isLoading === true ? (
        <StoryList stories={stories} pageTitle={"Latest stories"} />
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );
}

export default AllStories;
