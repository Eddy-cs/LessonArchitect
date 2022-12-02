import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import { Divider, Typography, IconButton } from "@mui/material";
import { Fragment } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <Fragment>
      <Divider></Divider>
      <footer className={styles.grid}>
        <Typography
          sx={{ fontWeight: "light" }}
          variant="p"
          className={styles.created}
        >
          Created by Eddy S.
        </Typography>
        <div className={styles.social}>
          <a href="https://github.com/Eddy-cs" target="_blank" rel="noreferrer">
            <IconButton>
              <GitHubIcon color="primary" fontSize="medium" />
            </IconButton>
          </a>
          <a
            href="https://www.linkedin.com/in/eddy-s-a6661a23a/"
            target="_blank"
            rel="noreferrer"
          >
            <IconButton>
              <LinkedInIcon color="primary" fontSize="medium" />
            </IconButton>
          </a>
          <a
            href="https://eddysanchez.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            <IconButton>
              <WysiwygIcon color="primary" fontSize="medium" />
            </IconButton>
          </a>
        </div>
      </footer>
    </Fragment>
  );
}
