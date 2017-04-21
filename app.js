const Koa = require('koa');//koa2
const bodyParser = require('koa-bodyparser');//必须在router之前被注册到app对象上。
const controller = require('./controller');
const templating = require('./templating');
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';
//
const Sequelize = require('sequelize');
const config = require('./config');







/**
 * @param ctx [是由koa传入的封装了request和response的变量，我们可以通过它访问request和response]
 * @param next [是koa传入的将要处理的下一个异步函数。]
 * @return {[type]}       [description]
 */
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var 
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//这是因为在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件，否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (!isProduction){
    let staticFiles  = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request post body:
app.use(bodyParser());


//add static 文件
//判断当前环境是否是production环境。如果是，就使用缓存，如果不是，就关闭缓存。在开发环境下，关闭缓存后，我们修改View，可以直接刷新浏览器看到效果，否则，每次修改都必须重启Node程序，会极大地降低开发效率。
app.use(templating('views',{
    noCache: !isProduction,
    watch: !isProduction
}));

// 第一步，创建一个sequelize对象实例：
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
// 第二步，定义模型Pet，告诉Sequelize如何映射数据库表：
var Pet = sequelize.define('pet', {
    id:{
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
},{
    timestamps: false
});
//第三步，往数据库加数据
var now = Date.now();
(async () => {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: '0die',
        gender: false,
        birth: '2017-04-21',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog))
})();
//第四步，查询数据
(async () => {
    var pets = await Pet.findAll({
        where:{
            name: 'Gaffey'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets){
        console.log(JSON.stringify(p));
        console.log('update pet...');
        p.gender = true;
        p.updatedAt = Date.now();
        p.version ++;
        await p.save();
        if (p.version === 3) {
            await p.destroy();
            console.log(`${p.name} was destroyed.`);
        }
    }
})();
//更新数据
(async () => {
    var p = await queryFromSomewhere();
    p.gender = true;
    p.updatedAt = Date.now();
    p.version ++;
    await p.save();
})();
// 删除数据
(async () => {
    var p = await queryFromSomewhere();
    await p.destroy();
})();

//add controllers:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000....');