import http from 'http';
import axios from 'axios';
import dotenv from 'dotenv'

var stateClient, accessTokenInfo;
dotenv.config();
var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function login   () {
  //request authorisation
  var scope = "streaming user-read-email user-read-private user-read-playback-state"
  stateClient = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: 'http://localhost:5000/auth/callback',
    state: stateClient
  })

  var url = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
  
  //needs to be turned into a button since discord can't redirect to the user authorisation page
  console.log(url);
}

export async function authCallback(content) {
	var code, stateServer, err;
  //request access/refresh token
  var contentParams = content.split("&");
  for (var i =0; i < contentParams.length; i++) {
    if (contentParams[i].startsWith("code")){
        code = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("state")){
      stateServer = contentParams[i].split("=")[1];
    }
    else if (contentParams[i].startsWith("error")){
      err = contentParams[i].split("=")[1];
    }
  }
  
  if(stateClient === stateServer) {
    if (err) {
      console.log("DENIED");     
    }
    if (code) {
      var accessTokenResponse = await getAccessToken(code);
      if(accessTokenResponse != null) {
        accessTokenInfo = accessTokenResponse.data
        console.log("toekn: " + accessTokenInfo.access_token);
      }
    }
  } 
}

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function getAccessToken(code) {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: code,
      redirect_uri: 'http://localhost:5000/auth/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    responseType: 'json'
  };

  let response = await axios(authOptions).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });

  return response;
}
