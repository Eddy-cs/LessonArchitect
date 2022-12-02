import { Typography } from "@mui/material";
import styles from "../styles/about.module.css";
import Image from "next/image";
import { Fragment } from "react";

export default function About() {
  return (
    <Fragment>
      <div className={styles.about}>
        <Typography variant="h4">
          LessonArchitect is a tool to help teachers spend less time planing and
          more inspiring students.
        </Typography>
        <Typography>
          This app uses the GPT-3 AI model to demonstrate a simple but
          interesting use case of this powerful technology. If you are more
          interested check the openAI website for more information.
        </Typography>
      </div>
      <div
        style={{
          opacity: 0.1,
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <Image width={500} height={500} src={"/composition.png"}></Image>
      </div>
    </Fragment>
  );
}
