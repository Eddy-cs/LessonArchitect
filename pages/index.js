import styles from "../styles/index.module.css";
import { Fragment, useEffect, useState } from "react";
import LessonList from "../components/LessonList";
import { auth } from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";

function UserLessons() {
  const [user] = useAuthState(auth);
  const [lessons, setLessons] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getLessons() {
      const response = await fetch("/api/user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      setLessons(data.map((e) => ({ generatedLessons: [e] })));
      setIsLoading(true);
    }
    getLessons();
  }, [user]);

  return (
    <Fragment>
      {isLoading === true ? (
        <LessonList lessons={lessons} pageTitle={"My Lessons"} />
      ) : (
        <div>Loading...</div>
      )}
      <div className={styles.lessons__create}>
        <div className={styles.lessons__center}>
          <div className={styles.lessons__plus}></div>
          <div className={styles.lessons__plus_horizontal}></div>
        </div>
      </div>
    </Fragment>
  );
}

export default UserLessons;
