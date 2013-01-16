var fs  = require('fs');
var jsp = require("./uglify-js").parser;
var pro = require("./uglify-js").uglify;
var exec = require('child_process').exec;
var stdin = process.openStdin();
var commond_list = ['git pull origin dev','git checkout -b temp','c'];
var $counter = 0
var $length = commond_list.length
codeUpdate = {
  update : function(){
    var that = this;
    if($length==$counter){
      console.log('搞定了！少年！')
    }else{
      exec(commond_list[$counter],function(){
        $counter++;
        that.update();
      })
    }
  },
  parse : function(){
    var fileIn =  [];
    exec('ls '+local,function(err,stout,stin){console.log(a = stout.toString().split(/\n/g))})

    if (fileIn.length > 0) {
      var finalCode = [];
      var origCode = '';
      var ast = '';
      finalCode.push(fs.readFileSync("/Users/madao/dev/"+chunk+".pianke.me/static/js/jquery.js",'utf-8'),";")
      for (var i = 0,len = fileIn.length; i < len; i++) {
        origCode = fs.readFileSync(BASE_LOCAL+fileIn[i], 'utf8');
        ast = jsp.parse(origCode); 
        ast = pro.ast_mangle(ast); 
        ast = pro.ast_squeeze(ast);
        finalCode.push(pro.gen_code(ast), ';');
        console.log('第'+(i+1)+'个文件'+fileIn[i]+'加入编译\n')
      };
    }
    fs.writeFileSync(fileOut, finalCode.join(''), 'utf8');
    console.log('ヾ(o◕∀◕)ﾉヾ(o◕∀◕)ﾉヾ(o◕∀◕)ﾉ成功！');
    return exec("svn commit -m 'edit application.js in "+new Date().toJSON()+"' "+local+"",function(){
      console.log('\n\nsuccess!');
      process.exit();
    });
    
  }
}