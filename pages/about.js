import { Typography } from "@mui/material";
import styles from "../styles/about.module.css";
import Image from "next/image";
import { Fragment } from "react";

export default function About() {
  return (
    <Fragment>
      <div className={styles.about}>
        <Typography variant="h4">Helping Teachers Teach</Typography>
        <Typography variant="h5">
          I understand the challenges teachers face when it comes to lesson
          planning. My mission is to provide quick and easy solutions to save
          teachers time and energy, allowing them to focus on making meaningful
          connections with their students and inspiring them to learn.
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
