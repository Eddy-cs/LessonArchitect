import { Fragment, useEffect, useState } from "react";
import LessonList from "../components/LessonList";

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
        <LessonList stories={stories} pageTitle={"Explore Lessons"} />
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );
}

export default AllStories;
