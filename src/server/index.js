import express from "express"
import cors from "cors"
import { renderToString } from "react-dom/server"
import App from '../shared/App'
import React from 'react'
import serialize from "serialize-javascript"
import { fetchPopularRepos } from '../shared/api'

const app = express();

app.use(cors());

// We're going to serve up the public
// folder since that's where our
// client bundle.js file will end up.
app.use(express.static("public"));

app.get("*", (req, res, next) => {
    fetchPopularRepos()
        .then((data) => {
            const markup = renderToString(
                <App data={data} />
            );

            res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SSR with RR</title>
            <script src="/bundle.js" defer></script>
            <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
          </head>

          <body>
            <div id="app">${markup}</div>
          </body>
        </html>
      `)
        })
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

process.on("unhandledRejection", (reason) => {
  console.log(reason);
});

app.listen(5000, () => {
    console.log(`Server is listening on port: 5000`)
});