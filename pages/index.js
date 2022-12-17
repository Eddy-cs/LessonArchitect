import styles from "../styles/index.module.css";
import Link from "next/link";
import { Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import LessonList from "../components/LessonList";

function UserLessons(props) {
  const [lessons, setLessons] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.user) {
      async function getLessons() {
        const response = await fetch("/api/user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: props.user.uid }),
        });
        const data = await response.json();
        setIsLoading(true);
        setLessons([data]);
      }
      getLessons();
    }
  }, [props.user]);

  const lessonPage = (
    <Fragment>
      {isLoading === true ? (
        <LessonList lessons={lessons} pageTitle={"My Lessons"} />
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );

  const empthyPage = (
    <Fragment>
      <Typography className={styles.title} fontWeight={700} variant="h4">
        You don't have any lessons yet...
      </Typography>
      <Typography className={styles.title} fontWeight={700} variant="h5">
        Sign in and create a lesson to begin
      </Typography>
      <Link href="/generate">
        <div className={styles.button__create}>
          <div className={styles.button__center}>
            <div className={styles.button__plus}></div>
            <div className={styles.button__plus_horizontal}></div>
          </div>
        </div>
      </Link>
    </Fragment>
  );

  return <Fragment>{props.user ? lessonPage : empthyPage}</Fragment>;
}

export default UserLessons;
