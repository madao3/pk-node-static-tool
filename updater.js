var fs  = require('fs');
var jsp = require("./uglify-js").parser;
var pro = require("./uglify-js").uglify;
var exec = require('child_process').exec;
var stdin = process.openStdin();
var command_list = ['git checkout dev','git pull origin dev','git branch -D temp','git checkout -b temp','execute the code','rm the otherelse','git add .','git commit -m edit application.js'+new Date().toJSON(),'git push origin temp'];
var $counter = 0;
var $length = command_list.length;
var $js_local = '/Users/madao/dev/static.pk/js/';
var $response_text = ''
var $final_response = false
codeUpdate = {
  execute_command : function(response){
    var that = this;
    $final_response = $final_response || response;
    if($length==$counter){
      $response_text += '搞定了！少年！<br>';
      $final_response.writeHead(200, {"Content-Type": "text/html"});
      $final_response.write($response_text);
      $final_response.end();
    }else{
      command = that.handle(command_list[$counter])
      if(typeof(command)=='function'){
        command(function(){
          $counter++;
          that.execute_command();
        });
      }else if(typeof(command)=="string"){
        exec(command,function(){
          $counter++;
          that.execute_command();
        });
      }
    }
  },
  parse : function(cb){
    var fileIn =  [];
    this.getAll('jquery.js',function(stout){
      fileIn = stout.toString().replace('jquery.js\n','').split(/\n|\r/g);
      if (fileIn.length > 0) {
        var finalCode = [];
        var origCode = '';
        var ast = '';
        finalCode.push(fs.readFileSync($js_local+"jquery.js",'utf-8'),";");
        for (var i = 0,len = fileIn.length; i < len; i++) {
          var file = fileIn[i];
          if(!file.length){
            continue;
          }
          origCode = fs.readFileSync($js_local+file, 'utf8');
          ast = jsp.parse(origCode); 
          ast = pro.ast_mangle(ast); 
          ast = pro.ast_squeeze(ast);
          finalCode.push(pro.gen_code(ast));
          $response_text += '第'+(i+1)+'个文件'+file+'加入编译</br>'
        };
      }
      fs.writeFileSync($js_local+'application.js', finalCode.join(';'), 'utf8');
      $response_text += 'ヾ(o◕∀◕)ﾉヾ(o◕∀◕)ﾉヾ(o◕∀◕)ﾉ成功！</br>';
      exec("git commit -m 'edit application.js in "+new Date().toJSON()+"' "+$js_local+"",function(){
        $response_text += '\n\nsuccess!</br>';
        cb()
      });
    })
  },
  rm_other : function(cb){
    this.getAll('application.js',function(stout){
      var i = 0;
      var fileIn = stout.toString().replace('jquery.js\n','').split(/\n|\r/g);
      var length = fileIn.length -1 ;
      console.log('删除中',fileIn.length);
      var update = function(){
        if(i >= length){
          return cb();
        }else{
          var file = fileIn[i];
          exec("cd "+$js_local+' && rm '+file+' && git rm '+file,function(err,stout,stin){
            console.log('删除余孽'+file,stout)
            i++;
            update()
          })
        }
      }
      update()
    })
  },
  getAll : function(file_name,cb){
    console.log(file_name)
    exec('ls '+$js_local+' |grep -v '+file_name,function(err,stout,stin){
      cb(stout)
    })
  },
  handle : function(command){
    var that = this;
    console.log(command)
    switch(command){
      case 'execute the code':
        command = function(cb){that.parse(cb)};
        break;
      case 'rm the otherelse':
        command = function(cb){that.rm_other(cb)}
        break;
      default:
        $response_text += command+'</br>'
        command = /git/.test(command)?"cd "+$js_local+" && "+command:command
        break;
    }
    return command
  }
}  
