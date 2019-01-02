import express from "express"
import cors from "cors"

const app = express();

app.use(cors());

// We're going to serve up the public
// folder since that's where our
// client bundle.js file will end up.
app.use(express.static("public"));

app.listen(4000, () => {
    console.log(`Server is listening on port: 4000`)
});