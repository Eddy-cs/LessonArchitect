import { Fragment, useEffect, useState } from "react";
import LessonList from "../components/LessonList";

function AllStories() {
  const [lessons, setLessons] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getLessons() {
      const response = await fetch("/api/firebase-config");
      const data = await response.json();
      setLessons(data);
      setIsLoading(true);
    }
    getLessons();
  }, []);

  return (
    <Fragment>
      {isLoading === true ? (
        <LessonList lessons={lessons} pageTitle={"Explore other lessons"} />
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );
}

export default AllStories;
