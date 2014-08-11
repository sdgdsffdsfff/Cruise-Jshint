var config = require("./config");
var fs = require("fs");
var exec = require("child_process").exec;
var path = require("path");

function inArray(name, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (name.indexOf( arr[i] ) != -1) {
			return true;
		}
	}
	return false;
}

function getJSFile(root) {
	var res = [],
			files = fs.readdirSync(root);

	files.forEach(function(file) {
		var pathname = root + '/' + file,
			stat = fs.lstatSync(pathname),
			extname = path.extname(file);

		if (stat.isDirectory()) {
			res = res.concat(getJSFile(pathname));
		} else if( stat.isFile() && extname ===".js") {
			res.push(pathname);
		}
	});

	return res;
}

var today = new Date();
var dateStr = [today.getFullYear(),'-',today.getMonth()+1,'-', today.getDate()].join("");
var logfile = dateStr + "-jshidt-auto-log.md";

function wirteDocument(filename, filepath ,data){
	var dataarr = data.split("\n"),
			content = "\n",
			line = "",
			err = [],
			pathname;
  pathname = filepath.replace(config.path, "");
  content += "##" + pathname + "\n";

	dataarr.forEach(function(item){
		if(item.length && item.indexOf("js:") !== -1){
				err = item.split("js:");
				content += ">" + err[1] + "  \n";
		}
	});
	fs.appendFileSync(filename, content);
}

fs.unlink(logfile, function(){
	var beforeContent = "";
		beforeContent += "---\n"
									+ "layout: post\n"
									+ "title: 邮轮前端"+ dateStr +"自动Jshint日志\n"
									+ "description:  邮轮前端Jshint日志\n"
									+ "keywords: jshint,auto,GitHub,javascript\n"
									+ "author: auto-jshint\n"
									+ "---\n"
		   					  + "#Auto jsHint log @" + dateStr + "\n";
									+ "##说明\n";
									+ "此文档为jshint自动运行的结果,请按照实际代码酌情修改调整.\n";
	fs.appendFileSync(logfile, beforeContent);
});

var JSfiles = getJSFile(config.path);
JSfiles.forEach(function(file){
	exec("jshint "+ file, function(err,stdout, stderr){
		console.log(stdout);
		wirteDocument(logfile, file, stdout);
	});
});