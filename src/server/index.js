import express from "express"
import cors from "cors"
import {renderToString} from "react-dom/server"
import App from '../shared/App'
import React from 'react'
import serialize from "serialize-javascript"
import {fetchPopularRepos} from '../shared/api'
import {StaticRouter, matchPath} from "react-router-dom"
import routes from '../shared/routes'

const app = express();

app.use(cors());

// We're going to serve up the public
// folder since that's where our
// client bundle.js file will end up.
app.use(express.static("public"));

app.get("*", (req, res, next) => {
    const activeRoute = routes.find((route) => matchPath(req.url, route)) || {};

    const promise = activeRoute.fetchInitialData
        ? activeRoute.fetchInitialData(req.path)
        : Promise.resolve();

    promise.then((data) => {

        const context = { data };

        const markup = renderToString(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        );

        res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
          <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
          <link rel="stylesheet" href="../styles.css">
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `)
    }).catch(next)
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