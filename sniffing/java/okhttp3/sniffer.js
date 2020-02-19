/*

Dumps HTTP(S) traffic handled by okhttp3 lib.

*/

Java.perform(function(){
  const blue = "\x1b[34m",
    yellow   = "\x1b[33m",
    reset    = "\x1b[0m";

  function log(a) {
    console.log(a);
  }

  function log_err(a) {
    console.error(a);
  }

  function reflect(a) {
    log(Object.getOwnPropertyNames(a.__proto__));
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

          log(
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
        console.error(e);
      }

      return res;
    }
  } catch(e) {
    console.error(e);
  }
});
