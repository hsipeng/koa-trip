let Koa = require("./application");

let app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
});

app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
});

app.use(async (ctx, next) => {
  console.log(3);
  // console.log("query", ctx.req.url);
  ctx.body = "hello world";
  console.log(4);
  console.log(ctx.req.url);
  console.log(ctx.request.req.url);
  console.log(ctx.response.req.url);
  console.log(ctx.request.url);
  console.log(ctx.request.path);
  console.log(ctx.url);
  console.log(ctx.path);
});

app.listen(3000, () => {
  console.log("listenning on 3000");
});
