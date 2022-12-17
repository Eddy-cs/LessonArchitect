import { Fragment } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../styles/globals.css";
import styles from "../styles/app.module.css";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../components/Login";

const muiTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#13354c",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#fff8f5",
    },
  },
  typography: {
    fontFamily: [
      "Nunito",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);

  return (
    <Fragment>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Head>
          <title>Lesson Architect</title>
        </Head>
        <Navbar />
        <main className={styles.layout__grid}>
          <Component {...pageProps} user={user} />
        </main>
        <Footer></Footer>
      </ThemeProvider>
    </Fragment>
  );
}

export default MyApp;
