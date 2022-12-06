import { Fragment, useState, useRef } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../styles/GenerateForm.module.css";

export default function StoryForm(props) {
  const [genre, setGenre] = useState("");
  const topicRef = useRef();
  const themeRef = useRef();
  const [result, setResult] = useState();
  const [title, setTitle] = useState();
  const [buttonLoad, setButtonLoad] = useState("contained");

  const handleChange = (event) => {
    setGenre(event.target.value);
    console.log(genre);
  };

  async function submitHandler(event) {
    event.preventDefault();
    setButtonLoad("disabled");

    const enteredTopic = topicRef.current.value;
    const enteredTheme = themeRef.current.value;

    const storyData = {
      uid: props.userData.uid || props.userData,
      user: {
        displayName: props.userData.displayName,
        email: props.userData.email,
        photoURL: props.userData.photoURL,
      },
      topic: enteredTopic,
      theme: enteredTheme,
      genre: genre,
    };

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyData),
    });

    const data = await response.json();

    console.log(data.result);
    setResult(data.result);
    setTitle(`The ${enteredTopic} and The ${enteredTheme}`);
    setButtonLoad("contained");
  }

  return (
    <Fragment>
      <div className={styles.hero}>
        {/* Hero Description */}
        <div className={styles.hero__text}>
          <div className={styles.hero__title}>
            <Typography fontWeight={700} variant="h3">
              Generate a lesson plan
            </Typography>
          </div>

          <Typography fontWeight={700} variant="h5">
            Spend less time planning and more inspiring
          </Typography>
          <Typography fontWeight={400} variant="h6">
            Simply select a subject, the lesson you want to teach and the school
            grade.
          </Typography>
        </div>
        {/* Hero Description */}
        {/* Hero Form */}
        <form className={styles.hero__form} onSubmit={submitHandler}>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gap: 30,
            }}
          >
            <TextField
              inputProps={{ maxLength: 25 }}
              required
              inputRef={topicRef}
              label="Subject"
            />
            <TextField
              inputProps={{ maxLength: 25 }}
              required
              inputRef={themeRef}
              label="Lesson"
            />
          </div>
          <FormControl>
            <InputLabel id="demo">Grade</InputLabel>
            <Select
              value={genre}
              labelId="demo"
              id="sdfs"
              label="Genre"
              required
              onChange={handleChange}
            >
              <MenuItem value={"Kindergarden"}>Kindergarden</MenuItem>
              <MenuItem value={"Elementary Grade 1"}>
                Elementary Grade 1
              </MenuItem>
              <MenuItem value={"Elementary Grade 2"}>
                Elementary Grade 2
              </MenuItem>
              <MenuItem value={"Elementary Grade 3"}>
                Elementary Grade 3
              </MenuItem>
              <MenuItem value={"Elementary Grade 4"}>
                Elementary Grade 4
              </MenuItem>
              <MenuItem value={"Elementary Grade 5"}>
                Elementary Grade 5
              </MenuItem>
              <MenuItem value={"Elementary Grade 6"}>
                Elementary Grade 6
              </MenuItem>
              <MenuItem value={"Junior High School Grade 7"}>
                Junior High School Grade 7
              </MenuItem>
              <MenuItem value={"Junior High School Grade 8"}>
                Junior High School Grade 8
              </MenuItem>
              <MenuItem value={"Junior High School Grade 9"}>
                Junior High School Grade 9
              </MenuItem>
              <MenuItem value={"Junior High School Grade 10"}>
                Junior High School Grade 10
              </MenuItem>
              <MenuItem value={"Senior High School Grade 11"}>
                Senior High School Grade 11
              </MenuItem>
              <MenuItem value={"Senior High School Grade 12"}>
                Senior High School Grade 12
              </MenuItem>
            </Select>
          </FormControl>
          <Slider
            aria-label="Temperature"
            defaultValue={7}
            // getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          />
          <Button
            size="large"
            variant={buttonLoad}
            type="submit"
            endIcon={<ArrowForwardIcon />}
          >
            Create
          </Button>
        </form>
        {/* Hero Form */}
        {/* Generated Result */}
        {/* Generated Result */}
      </div>
      <Card className={styles.hero__result} variant="outlined">
        <Typography variant="h4">
          {result ===
          "Sorry, the maximum number of requests for today has been reached. Please sign in or try again tomorrow."
            ? ""
            : title}
        </Typography>
        <Typography sx={{ whiteSpace: "pre-line" }} variant="body">
          {result}
        </Typography>
      </Card>
    </Fragment>
  );
}
