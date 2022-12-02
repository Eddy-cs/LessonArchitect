import { Fragment, useEffect, useState } from "react";
import StoryList from "../components/StoryList";

function Favorites() {
  const [stories, setStories] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getStories() {
      const response = await fetch("data.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setStories(data);
      setIsLoading(true);
    }
    getStories();
  }, []);
  return (
    <Fragment>
      {isLoading === true ? (
        <StoryList stories={stories} pageTitle={"Favorite Stories"} />
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );
}

export default Favorites;
