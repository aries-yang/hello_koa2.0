// 先导入fs模块，然后用readdirSync列出文件, 这里可以用sync是因为启动时只运行一次，不存在性能问题
// var files = fs.readdirSync(__dirname + '/controllers');
// console.log(`${files}`)
// 过滤出.js文件
// var js_files = files.filter((f) => {
// 	return f.endsWith('.js');
// });
// console.log(`${js_files}`)
//处理每个js文件
// for (var f of js_files){
// 	console.log(`process controller:${f}...`);
// 	let mapping = require(__dirname + '/controllers/' + f);
// 	for (var url in mapping){
// 		console.log(`url is ${url}`)
// 		if(url.startsWith('GET')){
// 			// 如果url类似"GET xxx":
// 			var urlpath = url.substring(4);
// 			router.get(urlpath, mapping[url]);
// 			console.log(`register URL mapping: GET ${path}`);
// 		}else if(url.startsWith('POST')){
// 			// 如果url类似"POST xxx":
// 			urlpath = url.substring(5);
// 			router.post(urlpath, mapping[url]);
// 			console.log(`register URL mapping: POST ${path}`);
// 		}else {
// 			console.log(`invalid URL:${url}`);
// 		}
		
// 	}
// }

// 上面的代码重构之后

const fs = require('fs');

// add url-route in /controllers:

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();// 注意require('koa-router')返回的是函数，注意导入koa-router的语句最后的()是函数调用：
    addControllers(router, controllers_dir);
    return router.routes();
};