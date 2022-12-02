import { Fragment } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../styles/globals.css";
import styles from "../styles/app.module.css";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

const muiTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#006279",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#fff8f5",
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Head>
          <title>Little Fiction</title>
        </Head>
        <Navbar />
        <main className={styles.layout__grid}>
          <Component {...pageProps} />
        </main>
        <Footer></Footer>
      </ThemeProvider>
    </Fragment>
  );
}

export default MyApp;
