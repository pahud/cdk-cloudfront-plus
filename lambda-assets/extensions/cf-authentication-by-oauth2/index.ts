/*
 *  Reference: https://github.com/experoinc/aws-lambda-edge-oauth
 */
const querystring = require("querystring");
const https = require("https");
const jsonwebtoken = require("jsonwebtoken");
const escape = require("lodash.escape");

const PUBLIC_PATHS = [/\/favicons\//];

function redirect(newLocation, cookies) {
  const result = {
    status: "302",
    statusDescription: "Found",
    headers: {
      location: [
        {
          key: "Location",
          value: newLocation,
        },
      ],
    },
  };

  if (cookies) {
    result.headers["set-cookie"] = cookies.map((c) => ({
      key: "set-cookie",
      value: `${c.name}=${c.value}`,
    }));
  }

  return result;
}

function respond(status, statusText, title, message) {
  const body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escape(title)}</title>
  </head>
  <body>
    <p>${escape(message)}</p>
  </body>
</html>`;

  const result = {
    status: status,
    statusText: statusText,
    headers: {
      "cache-control": [
        {
          key: "Cache-Control",
          value: "max-age=100",
        },
      ],
      "content-type": [
        {
          key: "Content-Type",
          value: "text/html",
        },
      ],
    },
    body: body,
  };

  return result;
}

function parseCookies(headers) {
  const parsedCookie = {};
  if (headers.cookie) {
    headers.cookie[0].value.split(";").forEach((cookie) => {
      if (cookie) {
        const parts = cookie.split("=");
        parsedCookie[parts[0].trim()] = parts[1].trim();
      }
    });
  }

  return parsedCookie;
}

function validateToken(config, token) {
  if (config.DEBUG_ENABLE) console.log("validateToken: enter, token = " + token + ", config.JWT_ARGORITHM = " + config.JWT_ARGORITHM);

  if (config.DEBUG_ENABLE) {
    const decodedjwt = jsonwebtoken.decode(token, {complete: true});
    console.log("validateToken: token header = (next line)");
    console.log(decodedjwt.header);
  }
  try {
    const decoded = jsonwebtoken.verify(token, config.CLIENT_PUBLIC_KEY, {
      algorithms: [config.JWT_ARGORITHM],
    });

    if (config.DEBUG_ENABLE) console.log("validateToken: return true");
    return true;
  } catch (err) {
    if (config.DEBUG_ENABLE) console.log("validateToken: return false, err = " + err);
    return false;
  }
}

function validateCookie(config, cookie) {
  return !!cookie && validateToken(config, cookie);
}

function loginCallback(config, request, callback) {
  if (config.DEBUG_ENABLE) console.log("loginCallback: enter");

  if (request.uri !== config.CALLBACK_PATH) {
    console.log("loginCallback: is not callback path");
    return false;
  } // unhandled

  if (config.DEBUG_ENABLE) console.log("loginCallback: request.querystring = " + request.querystring);

  let params;
  try {
    params = querystring.parse(request.querystring);
    if (params.error) {
      if (config.DEBUG_ENABLE) console.log("loginCallback: params.error");
      callback(
        null,
        respond(401, "Unauthorized", params.error, params.error_description)
      );
      return true; // handled
    }
    if (!params.code) {
      if (config.DEBUG_ENABLE) console.log("loginCallback: params.code is missing!!");
      return false; // unhandled
    }
  } catch (err) {
    return false; // unhandled
  }

  // Call identity provider to get JWT token
  const headers = request.headers;
  const postData = querystring.stringify({
    grant_type: "authorization_code",
    code: params.code,
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    redirect_uri: `https://${headers.host[0].value}${config.CALLBACK_PATH}`,
  });
  const postOptions = {
    host: config.CLIENT_DOMAIN,
    port: 443,
    path: "/oauth/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  const req = https.request(postOptions, (res) => {
    if (config.DEBUG_ENABLE) console.log("loginCallback: res.statusCode = " + res.statusCode);
    if (res.statusCode >= 300) {
      return callback(
        null,
        respond(
          500,
          "Internal Server Error",
          "Bad token response",
          `Bad Token Response: ${res.statusCode} ${res.statusText}`
        )
      );
    }

    let body = "";
    res.on("data", (d) => (body += d));
    res.on("end", () => {
      try {
        const json = JSON.parse(body);
        if (config.DEBUG_ENABLE) console.log("loginCallback: parse body = (next line)");
        if (config.DEBUG_ENABLE) console.log(json);
        const token = json.id_token;
        if (config.DEBUG_ENABLE) console.log("loginCallback: token = " + token);

        if (!token) {
          if (config.DEBUG_ENABLE) console.log("loginCallback: no token!");
          return callback(
            null,
            respond(401, "Unauthorized", "Unauthorized", body)
          );
        }

        // store this in a cookie, then redirect the user
        const dest = `https://${headers.host[0].value}${params.dest || "/"}`;
        if (config.DEBUG_ENABLE) console.log("loginCallback: redirect to dest = " + dest + " with session token");

        callback(
          null,
          redirect(dest, [{ name: "session-token", value: token }])
        );
      } catch (e) {
        callback(e, null);
      }
    });
  });
  req.on("error", (e) => callback(e, null));
  req.write(postData);
  req.end();

  if (config.DEBUG_ENABLE) console.log("loginCallback: finish with true.");

  return true; // handled
}

function redirectIfNotAuthenticated(config, request, callback) {
  if (config.DEBUG_ENABLE) console.log("redirectIfNotAuthenticated: enter.");

  const headers = request.headers;

  /* Check for session-id in request cookie in viewer-request event,
   * if session-id is absent, redirect the user to sign in page with original
   * request sent as redirect_url in query params.
   */

  /* Check for session-id in cookie, if present then proceed with request */
  const parsedCookies = parseCookies(headers);
  if (config.DEBUG_ENABLE) console.log("redirectIfNotAuthenticated: parsedCookies = (next line)");
  if (config.DEBUG_ENABLE) console.log(parsedCookies);
  if (validateCookie(config, parsedCookies && parsedCookies["session-token"])) {
    if (config.DEBUG_ENABLE) console.log("redirectIfNotAuthenticated: validateCookie: false");
    return false; // not handled
  }

  // User is not authenticated.
  /* URI encode the original request so we can send as query param for when user is finally logged in */
  const encodedRedirectUrl = encodeURIComponent(
    request.querystring ? `${request.uri}?${request.querystring}` : request.uri
  );
  const callbackUrl = `https://${headers.host[0].value}${config.CALLBACK_PATH}?dest=${encodedRedirectUrl}`;
  const encodedCallback = encodeURIComponent(callbackUrl);
  const redirectUrl = `${config.AUTHORIZE_URL}${config.AUTHORIZE_PARAMS}&client_id=${config.CLIENT_ID}&redirect_uri=${encodedCallback}`;

  if (config.DEBUG_ENABLE) console.log("redirectIfNotAuthenticated: redirect to AUTHORIZE_URL with empty session token. redirectUrl = " + redirectUrl);
  callback(null, redirect(redirectUrl, [{ name: "session-token", value: "" }]));

  return true; // handled
}

function allowPublicPaths(config, request, callback) {
  if (config.DEBUG_ENABLE) console.log("allowPublicPaths: enter.");
  if (PUBLIC_PATHS.find(pattern => pattern.test(request.uri))) {
    if (config.DEBUG_ENABLE) console.log("allowPublicPaths: callback request and return true.");
    callback(null, request);
    return true;
  }else{
    if (config.DEBUG_ENABLE) console.log("allowPublicPaths: return false.");
    return false;
  }
}

export function handler(event: any, context: any, callback: any) {
  const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
    CLIENT_PUBLIC_KEY: new Buffer(process.env.CLIENT_PUBLIC_KEY, 'base64').toString(),
    CALLBACK_PATH: process.env.CALLBACK_PATH,
    JWT_ARGORITHM: process.env.JWT_ARGORITHM,
    AUTHORIZE_URL: process.env.AUTHORIZE_URL,
    AUTHORIZE_PARAMS: new Buffer(process.env.AUTHORIZE_PARAMS, 'base64').toString(),
    DEBUG_ENABLE: process.env.DEBUG_ENABLE,
  };

  const request = event.Records[0].cf.request;

  if (config.DEBUG_ENABLE) console.log("Event: %j", event);
  if (config.DEBUG_ENABLE) console.log("Context: %j", context);
  if (config.DEBUG_ENABLE) console.log("request URI = ", request.uri);

  if (
    !allowPublicPaths(config, request, callback) &&
    !loginCallback(config, request, callback) &&
    !redirectIfNotAuthenticated(config, request, callback)
  ) {
    if (config.DEBUG_ENABLE) console.log("hanlder: callback request.");
    callback(null, request);
  }
}
