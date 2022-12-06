import styles from "../styles/index.module.css";
import { Fragment } from "react";
import { Card, CardContent, Typography } from "@mui/material";

function UserLessons() {
  return (
    <Fragment>
      Create a Lesson
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
