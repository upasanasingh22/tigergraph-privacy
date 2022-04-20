const express = require("express");
const fetch = require("node-fetch");
const app = express();
const config = require("./config");
var http = require('http');
var fs = require('fs');
var path = require('path');
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
const util = require('util')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(serveStatic('pkg_web', { index: ['default.html', 'default.htm', 'first.html'] }))


app.get("/echo", async (req, res) => {
    try {
        let body = req.body;
        let url = config.url + "echo";
        console.log(body)
        let response = await _makeCall(url, body);
        res.status(200).send(response);
        document.write(res)
    }
    catch (error) {
        document.write(res)
        //handleError(res, error.message);
    }
});



// app.get("/ServiceTypes", async (req, res) => {
//     try {
//         let body = req.body;
//         let url = config.url + "graph/PKG/vertices/ServiceType";
//         console.log(url)
//         let response = await _makeCall(url, body);
//         res.status(200).send(response);
//         console.log(response)
//     }
//     catch (error) {
//         handleError(res, error.message);
//     }
// });

// used by input page
app.get("/ServiceProvidersByType", async (req, res) => {
    try {
        let body = req.body;
        let url = config.url + "query/PKG/get_service_providers_by_type";
        console.log(url)
        let response = await _makeCall(url, body);
        console.log(response)
        res.status(200).send(response);
        
        // response object saved in ./temp/provider_result_tg.txt
    }
    catch (error) {
        handleError(res, error.message);
    }
});

// not used currently
// input - username
// output - dictionary of service providers subscribed by user
// example output - temp/provider_result_tg.txt
app.post("/get_service_providers_by_user", async (req, res) => {
    try {
        let body = req.body;
        
        //let body = {"input_user":"Andrew"}
        console.log("=====get_service_providers_by_user");
        console.log(body);
        let url = config.url + "query/PKG/get_service_providers_by_user";
        console.log(url)
        let response = await _makeCall(url, body);
        console.log(response)
        res.status(200).send(response);
    }
    catch (error) {
        handleError(res, error.message);
    }
});

// input - username
// output - dictonary of events with users and info type
// example output - temp/<file>
app.post("/get_events_with_user", async (req, res) => {
    try {
        let body = req.body;
        console.log("=====get_events_with_user");
        console.log(body);
        let url = config.url + "query/PKG/get_events_with_user";
        console.log(url)
        let response = await _makeCall(url, body);
        console.log(response)
        res.status(200).send(response);
    }
    catch (error) {
        handleError(res, error.message);
    }
});

// Used by input page to submit the form and create edges for user subscription
app.post("/submit_form", urlencodedParser, async (req, res) => {

    try {
        console.log(req.body);
        let req_body = req.body;
        var v1_type = "Person"
        var v2_type = "ServiceProvider"
        var v1_id = "user1"
        var v2_id= ""
        var e_type = "subscribes_to"
        //var data = {"edges": {[v1_type]:{[v1_id]:{}}}}
        var data = {"edges": {[v1_type]:{[v1_id]:{[e_type]:{[v2_type]:{[v2_id]:{}}}}}}}
        
        console.log(req_body);
        for (i in req_body) {
            
            if (typeof req_body[i] == "object") {
                for (j in req_body[i]) {
                    if (req_body[i][j].length==0){
                        continue;
                    }
                    v2_id = req_body[i][j];
                }
            }
            else {
                if (req_body[i].length==0){
                    continue;
                }
                v2_id = req_body[i];
                
            }

            sp_details = {[v2_id]:{}};
        }
        
        data["edges"][v1_type][v1_id][e_type][v2_type] = sp_details
        

        let url = config.url + "graph/PKG";
        let response = await _makeCall(url, JSON.stringify(data), 'POST');
        //res.status(200).send(response);
        res.redirect('/second.html');
        
    }
    catch (error) {
        handleError(res, error.message);
    }
});



// app.get("/get_service_providers", async (req, res) => {
//     try {
//         let body = req.body;
//         let url = config.url + "query/PKG/get_service_providers";
//         let response = await _makeCall(url, body);
//         res.status(200).send(response);
//     }
//     catch (error) {
//         handleError(res, error.message);
//     }

// });

/*
This is where the magic happens. Each of the end points will pass in a query url
with an object of parameters. This function will construct the url and make the call.
*/
async function _makeCall(url, params, method='GET') {
    try {
        
        const token = config.token;
        console.log(url);
        if (method=="POST"){
            
            const response = await fetch(url, {
                method: 'POST',
                body: params,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const json = await response.json();
            if (json.error) {
                throw Error("TigerGraphError:" + json.message);
            }
            return json;
        }
        else{
            const keys = Object.keys(params);
        if (keys.length > 0) {
            url += "?"
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                if (Array.isArray(params[key])) { //It was an array of values
                    let heading = `${key}=`;
                    if (index > 0) {
                        heading = `&${key}=`;
                    }
                    url += heading;
                    url += (params[key]).join(`&${key}=`);
                } else { //It was just a single value
                    if (index === 0) {
                        url += key + "=" + params[key]
                    } else {
                        url += "&" + key + "=" + params[key]
                    }
                }
            }
        }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const json = await response.json();
            if (json.error) {
                throw Error("TigerGraphError:" + json.message);
            }
            return json;
        }
    
        
        
        
    }
    catch (error) {
        throw Error(error.message);
    }
}

function handleError(res, errorMessage) {
    console.log('error...........')
    console.log(errorMessage)
    if (errorMessage.indexOf("TigerGraphError") > 0) {
        res.status(500).send({ error: true, message: errorMessage })
    }
    else {
        res.status(400).send({ error: true, message: errorMessage })
    }
}

app.listen(config.listen_on_port);
console.log("Listening on port "+ config.listen_on_port + " ...");

