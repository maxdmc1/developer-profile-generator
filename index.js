/*
The PDF will be populated with the following:

* Profile image                             response.data.avatar_url
* User name                                 response.data.name
* Links to the following:
  * User location via Google Maps           https://www.google.com/maps/place/${response.data.location}
  * User GitHub profile                     https://github.com/${response.data.login}
  * User blog                               https://github.com/${response.data.blog}
* User bio                                  response.data.bio
* Number of public repositories             response.data.public_repos
* Number of followers                       response.data.followers
* Number of GitHub stars                    response.data.  not sure where this info is
* Number of users following                 response.data.following

fs, axios, inquirer, electrom-html-to, and electon must be installed 
<title>GitHub Profile for ${userName}</title>
*/


const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const convertFactory = require("electron-html-to");


inquirer
    .prompt([
        {
            type: "input",
            message: "Enter your GitHub username:",
            name: "username"
        },
        {
            type: "list",
            message: "what color background would you like?",
            choices: ["blue", "grey", "teal"],
            name: "colors"
        }
    ])
    .then(function ({ username, colors }) {
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl)
            .then(function (response) {
                // console.log(response.data);

                const profileImage = response.data.avatar_url;
                const userName = response.data.name;
                const bio = response.data.bio;
                const pubRepos = response.data.public_repos;
                const followers = response.data.followers;
                const following = response.data.following;

                // console.log(profileImage);
                // console.log(userName);
                // console.log(bio);
                // console.log(pubRepos);
                // console.log(followers);
                // console.log(following);

                const conversion = convertFactory({
                    converterPath: convertFactory.converters.PDF
                });

                conversion({
                    html: `
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors.wrapperBackground};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors.headerBackground};
         color: ${colors.headerColor};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors.photoBorderColor};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }

         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }

         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors.headerBackground};
           color: ${colors.headerColor};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }

         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }

         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div>
                              <img src="${profileImage}"></img>
                          </div>
                          <p>Name: ${userName}</p>
                          <p>Location:</p>
                          <a href="https://www.google.com/maps/place/${response.data.location}" target="_blank">${response.data.location}</a>
                          <a href="https://github.com/${response.data.login}" target="_blank">Link to User GitHub Profile</a>
                          <a href="https://github.com/${response.data.blog}" target="_blank">Link to User Blog</a>
                          <p>User's Biography:${bio}</p>
                          <p>Number of Followers: ${followers}</p>
                          <p>Number of Users Following: ${following}</p> 
                  
                  
                      </div>
                  
                      
                  </body>
                  </html>
                  `}, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }

                    // console.log(result.numberOfPages);
                    // console.log(result.logs);
                    result.stream.pipe(fs.createWriteStream('./index.pdf'));
                    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                });
                



            })
            .catch(function (err) {
                console.log(err);
            });
    });
