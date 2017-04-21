// 要使用Model，就需要引入对应的Model文件，例如：User.js。一旦Model多了起来，如何引用也是一件麻烦事。

const fs = require('fs');
const db = require('./db');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f) => {
	return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
	console.log(`import model form file ${f}...`);
	let name = f.substring(0, f.length - 3);
	module.exports[name] = require(__dirname + '/models/' + f);
}
module.exports.sync = () => {
	db.sync();
};