const Koa = require('koa');//koa2
const bodyParser = require('koa-bodyparser');//必须在router之前被注册到app对象上。
const controller = require('./controller');
const nunjucks = require('nunjucks');
const app = new Koa();
//模板引擎
function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});
var s = env.render('hello.html', {
    name: '<Nunjucks>',
    fruits: ['Apple', 'Pear', 'Banana'],
    count: 12000
});

console.log(s);

console.log(env.render('extend.html', {
    header: 'Hello',
    body: 'bla bla bla...'
}));
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