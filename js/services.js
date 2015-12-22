var Services=angular.module('Services',[])
Services.service('UserService',['OfflineData',function(data){
  //functions that can be called by user
  var user_rules={
    'date':{
      body:function(){

        var currentdate = new Date(); 
        return currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear()
      }
    },
    'time':{
      body:function(){
        var currentdate = new Date(); 
                  return currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();
      }
    },
    'add':{
      body:function(args){
        return parseInt(args[0])+parseInt(args[1]);
      }
    },
    'av_links':{
      body:function(){
        var init_data='';
        for(var c in data.available_links){
          init_data=init_data+'<a href="'+data.available_links[c]+'">'+data.available_links[c]+'</a><br>'
        }
        return init_data;
      }
    },
    'get_joke':{
      body:function(){
        var request = new XMLHttpRequest();
        request.open('GET', 'http://api.icndb.com/jokes/random', false);  // `false` makes the request synchronous
        request.send(null);
        if (request.status === 200) {
            return JSON.parse(request.responseText)["value"]["joke"];
        } 
      }
    },
    //adds new function to the list
    'add_function':{
      body:function(args){
        this.addUserFunction(args[0],args.combine(1,args.length-1));
        return "added";
      }
    }
  }
  this.callUserFunction=function(function_name,arguments){
    if(user_rules[function_name]==undefined)
      return 'unknown_command';
    var function_body=user_rules[function_name].body;
    return function_body.call(this,arguments);
  }
  this.addUserFunction=function(function_name,function_body){
    user_rules[function_name]={};
    user_rules[function_name].data=function_body;
    user_rules[function_name].body=new Function('args',function_body);
  }
  this.getUserFunctionString=function(function_name){
    if(user_rules[function_name]&&user_rules[function_name].data)
      return user_rules[function_name].data;
    return "";
  }
}])
Services.service('AnswerService',['UserService',function(UserService){
  this.getAnswer=function(input){
    var splitted_input=input.split(" ");
    var command=splitted_input[0];
    var arguments=splitted_input.splice(1, splitted_input.length-1);
    try{
      var ret_val= UserService.callUserFunction(command,arguments);
      return ret_val;
    }
    catch(e){
      return e.name+" "+e.message;
    }
  }
}])
Services.service('CodeEditorService',[function(){
  this.CodeMirror = CodeMirror(document.getElementById("code_editor"), {
    value: "//add content inside function(){...}\n",
    mode:  "javascript"
  });
  var show=true;
  this.set_show=function(status){
    show=status;
  }
  this.get_show=function(){
    return show;
  }
  this.getCodeWithoutLineFeed=function(){
    return this.CodeMirror.getValue("");
  },
  this.getCodeWithLineFeed=function(){
    return this.CodeMirror.getValue();
  },
  this.clear=function(){
    return this.CodeMirror.setValue("");
  },
  this.setContent=function(content){
    this.CodeMirror.setValue(content);
  }
}])
Services.service('KeyboardService',function(){
  this.keyCodes={
    Enter:13,
    Backspace:8,
    UpArrow:38,
    DownArrow:40,
    RightArrow:39,
    LeftArrow:37,
    Delete:46,
  }
  this.isKey=function (event,keycode){
    if (event.which == null) {
      return keycode==event.keyCode;// IE
    } else if (event.which!=0) {
      return keycode==event.which;   // the rest
    } else {
      return false; // special key
    }
  }
  this.getChar= function (event) {
    if (event.which == null) {
      return String.fromCharCode(event.keyCode) // IE
    } else if (event.which!=0 && event.charCode!=0&&!this.isKey(event,this.keyCodes.Enter)&&!this.isKey(event,this.keyCodes.Backspace)) {
      return String.fromCharCode(event.which)   // the rest
    } else {
      return '' // special key
    }
  }
})
Services.service('HistoryService',function(){

})