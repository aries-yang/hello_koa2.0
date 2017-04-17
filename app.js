const Koa = require('koa');//koa2
const bodyParser = require('koa-bodyparser');//必须在router之前被注册到app对象上。
const controller = require('./controller');
const app = new Koa();
/**
 * @param ctx [是由koa传入的封装了request和response的变量，我们可以通过它访问request和response]
 * @param next [是koa传入的将要处理的下一个异步函数。]
 * @return {[type]}       [description]
 */
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

//add controllers:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000....');