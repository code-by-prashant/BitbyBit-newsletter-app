const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const { post } = require("request");

// intializing the express app
const app = express();

// special function to import the static files in our App
app.use('/', express.static('public'));

// body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));


// GET Method for main route.
// sends back the signup.html to render as the page.
 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});


/*  POST method for main route.
 
  Called when user submits their data in the sign up form.
  Sends a post request to the Mailchimp API with the new user
  data, and sends back a success ro failure page, depending
  on the response status from the Mailchimp API. */

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // construct the required data 
    const data = {
        members: [
          {
            email_address: req.body.email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      };

    
    const jsonData = JSON.stringify(data);

    // replace the "<dc>" with the "us10" (the code might differ) 
    // that will provided at the end of API Key.
    // key should be kept private and hidden
    const url = 'https://us10.api.mailchimp.com/3.0/lists/583de6e597'
    
    // username:api_key -> you can have ANYTHING for username
    const options = {
        method: "POST",
        auth: 'prashant:8d81d0f044cc9a13d570f95faeb34dc2-us10',
        body: jsonData
    }


    // POST method for /success and /failure route.

    const request =  https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

});


// POST method for /failure route redirects to the main route.

app.post("/failure", (req, res) => {
    res.redirect("/");
  });


app.listen(process.env.PORT, function(){
    console.log("Server is running on port 3000");
});




// Start up server to listen on port 3000.

/* app.listen(3000, function(){
    console.log("Server is running on port 3000");
}); */



/*  API Key: 8d81d0f044cc9a13d570f95faeb34dc2-us10

 List Id : 583de6e597 */
 
