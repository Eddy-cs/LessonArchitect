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
  Tooltip,
  IconButton,
} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../styles/GenerateForm.module.css";

export default function StoryForm(props) {
  const [grade, setGrade] = useState("");
  const [randomness, setRandomness] = useState(7);
  const [result, setResult] = useState();
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [buttonLoad, setButtonLoad] = useState("contained");
  const subjectRef = useRef();
  const lessonRef = useRef();

  async function submitHandler(event) {
    event.preventDefault();
    setButtonLoad("disabled");
    setTitle("");
    setResult("Generating lesson.. this may take up to 1 minute");

    try {
      const lessonData = {
        uid: props.userData.uid || "Anonymous",
        displayName: props.userData.displayName,
        email: props.userData.email,
        photoURL: props.userData.photoURL,
        generatedLesson: {
          randomness: randomness,
          model: "text-davinci-003",
          subject: subjectRef.current.value,
          lesson: lessonRef.current.value,
          grade: grade,
        },
      };

      let response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      });

      // Switches model used if OpenAI is at or near capacity
      if (response.status >= 400 && response.status < 600) {
        setResult(
          "Generating lesson.. this may take up to 1 minute. \n Your result will be generated with an alternative model due to OpenAI being at capacity"
        );

        lessonData.generatedLesson.model = "text-curie-001";

        response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lessonData),
        });
      }

      const data = await response.json();

      setResult(data.result);
      setTitle(lessonRef.current.value);
      lessonData.generatedLesson.model === "text-curie-001" &&
        setMessage(
          "Your result was generated with an alternative model due to OpenAI being at capacity. If you need an improved result please try again later."
        );
    } catch (error) {
      console.error(error);
      setResult("Something went wrong, please try again.");
    }
    setButtonLoad("contained");
  }

  const handleChange = (event) => {
    setGrade(event.target.value);
  };

  const sliderChange = (event) => {
    setRandomness(event.target.value);
  };

  return (
    <Fragment>
      <div className={styles.hero}>
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
        <form className={styles.hero__form} onSubmit={submitHandler}>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gap: 30,
            }}
          >
            <TextField
              inputProps={{ maxLength: 40 }}
              required
              inputRef={subjectRef}
              label="Subject"
            />
            <TextField
              inputProps={{ maxLength: 40 }}
              required
              inputRef={lessonRef}
              label="Lesson"
            />
          </div>
          <FormControl>
            <InputLabel id="demo">Grade</InputLabel>
            <Select
              value={grade}
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
          <div>
            <Typography>
              Randomness
              <Tooltip title="(Optional) - The lower the number, the more deterministic the result.">
                <IconButton
                  sx={{
                    marginLeft: 1,
                    backgroundColor: "#ebebeb",
                    height: 20,
                    width: 20,
                  }}
                >
                  <QuestionMarkIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <Slider
              aria-label="Temperature"
              defaultValue={7}
              onChange={sliderChange}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
            />
          </div>
          <Button
            size="large"
            variant={buttonLoad}
            type="submit"
            endIcon={<ArrowForwardIcon />}
          >
            Create
          </Button>
        </form>
      </div>
      <Card className={styles.hero__result} variant="outlined">
        {message && (
          <Typography
            className={styles.hero__model}
            sx={{
              margin: -2,
              marginBottom: 2,
              padding: 2,
            }}
            variant="subtitle1"
          >
            {message}
          </Typography>
        )}
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
