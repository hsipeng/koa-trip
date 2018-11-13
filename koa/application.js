let http = require("http");
let context = require("./context");
let request = require("./request");
let response = require("./response");
let EventEmitter = require("events");

class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
  listen(port, cb) {
    let server = http.createServer(this.callback());
    server.listen(port, cb);
  }
  use(fn) {
    this.middlewares.push(fn);
    return this;
  }
  compose() {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        };
      }
      let len = this.middlewares.length;
      let next = async () => {
        return Promise.resolve();
      };
      for (let i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middlewares[i];
        next = createNext(currentMiddleware, next);
      }
      await next();
    };
  }
  responseBody(ctx) {
    const res = ctx.res;
    let body = ctx.body;
    res.end(body);
  }

  onerror(err, ctx) {
    const res = ctx.res;
    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, "  "));
    console.error();
    res.end(msg);
  }
  callback() {
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let respond = () => this.responseBody(ctx);
      let onerror = err => this.onerror(err, ctx);
      let fn = this.compose();
      return fn(ctx)
        .then(respond)
        .catch(onerror);
    };
  }
}
module.exports = Application;
