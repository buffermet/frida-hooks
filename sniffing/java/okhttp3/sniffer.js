/*

Dumps HTTP(S) traffic handled by okhttp3 lib.

*/

Java.perform(function(){
  const blue = "\x1b[34m",
    yellow   = "\x1b[33m",
    reset    = "\x1b[0m";

  function logRaw(a) {
    console.log(a);
  }

  function logError(a) {
    console.error(a);
  }

  function reflect(a) {
    logRaw(
      "propnames {\n" + 
        "  " + Object
          .getOwnPropertyNames(a.__proto__)
          .toString()
          .replace(/,/g, ",\n  ") + "\n" +
      "}\n" +
      "keys {\n" +
        "  " + Object.keys(a) + "\n" +
      "}");
  }

  try {
    const ResponseBuilder = Java.use("okhttp3.Response$Builder");

    ResponseBuilder.build.implementation = function() {
      const res = this.build.call(this);

      try {
        if (res != null) {
          const req    = res.request.call(res),
            url        = req.url.call(req),
            method     = req.method.call(req),
            code       = res.code.call(res),
            reqHeaders = req.headers.call(req),
            resHeaders = res.headers.call(res),
            reqBody    = req.body.call(req),
            resBody    = res.body.call(res);

          logRaw(
            blue +
              method + " " + url + "\n" +
              reqHeaders + "\n" +
              reqBody.string.call(reqBody) + "\n" +
            yellow +
              code + " " + url + "\n" +
              resHeaders + "\n" +
              resBody.string.call(resBody) + "\n" +
            reset +
              "---");
        }
      } catch(e) {
        logError(e);
      }

      return res;
    }
  } catch(e) {
    logError(e);
  }
});
