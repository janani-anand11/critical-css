import got from "got";
 
async function fetch(uri, options = {}, secure = true) {
  const { user, pass, userAgent, request: requestOptions = {} } = options;
  const { headers = {}, method = "get", https } = requestOptions;
  let resourceUrl = uri;
  let protocolRelative = false;
 
  // Consider protocol-relative urls
  if (/^\/\//.test(uri)) {
    protocolRelative = true;
    resourceUrl = urlResolve(`http${secure ? "s" : ""}://te.st`, uri);
  }
 
  requestOptions.https = { rejectUnauthorized: true, ...(https || {}) };
  if (user && pass) {
    headers.Authorization = `Basic ${token(user, pass)}`;
  }
 
  if (userAgent) {
    headers["User-Agent"] = userAgent;
  }
 
  console.log(`Fetching resource: ${resourceUrl}`, {
    ...requestOptions,
    headers,
  });
 
  try {
    const response = await got(resourceUrl, { ...requestOptions, headers });
    if (method === "head") {
      return response;
    }
 
    return Buffer.from(response.body || "");
  } catch (error) {
    // Try again with http
    if (secure && protocolRelative) {
      console.log(`${error.message} - trying again over http`);
      return fetch(uri, options, false);
    }
 
    console.log(`${resourceUrl} failed: ${error.message}`);
 
    if (method === "head") {
      return error.response;
    }
 
    if (error.response) {
      return Buffer.from(error.response.body || "");
    }
 
    throw error;
  }
}
 
async function run() {
  const result = await fetch(
    "https://www.dell.com/_sec/cp_challenge/sec-3-6.css",
    { request: { method: "head" } }
  );
  // console.log(result);
  return result;
}
 
run();
 
export default fetch;
