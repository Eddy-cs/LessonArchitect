import styles from "../styles/index.module.css";
import Link from "next/link";
import { Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../components/Login";
import LessonList from "../components/LessonList";

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
      console.log(lessons);
    }
    getLessons();
  }, [user]);

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

  return <Fragment>{user ? lessonPage : empthyPage}</Fragment>;
}

export default UserLessons;
