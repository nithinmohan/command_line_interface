function _(data){
  console.log(data);
}
String.prototype.cut_in=function(cut_point){
  return {
    first:this.substr(0,cut_point),
    second:this.substr(cut_point,this.length-cut_point)
  }
}
Array.prototype.combine=function(index1,index2){
  var ans=this[index1];
  for(var i=index1+1;i<=index2;i++){
    ans=ans+" "+this[i];
  }
  return ans;
}
var app=angular.module('myApp',[]);
app.value('OfflineData',{
  available_links:['link1','link2'],
});
app.service('UserService',['OfflineData',function(data){
  var user_rules={
    'date':function(){

      var currentdate = new Date(); 
      return currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear()
    },
    'time':function(){
      var currentdate = new Date(); 
                return currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    },
    'add':function(arguments){
      return parseInt(arguments[0])+parseInt(arguments[1]);
    },
    'av_links':function(){
      var init_data='';
      for(var c in data.available_links){
        init_data=init_data+'<a href="'+data.available_links[c]+'">'+data.available_links[c]+'</a><br>'
      }
      return init_data;
    },
    'get_joke':function(){
      var request = new XMLHttpRequest();
      request.open('GET', 'http://api.icndb.com/jokes/random', false);  // `false` makes the request synchronous
      request.send(null);
      if (request.status === 200) {
          return JSON.parse(request.responseText)["value"]["joke"];
      } 
    },
    'add_function':function(arguments){
      this.addUserFunction(arguments[0],arguments.combine(1,arguments.length-1));
      console.log(user_rules);
      return "added";
    }
  }
  this.callUserFunction=function(function_name,arguments){
    var function_body=user_rules[function_name];
    if(function_body==undefined)
      return 'unknown_command';
    return function_body.call(this,arguments);
  }
  this.addUserFunction=function(function_name,function_body){
    user_rules[function_name]=new Function(function_body);
  }
}])
app.service('AnswerService',['UserService',function(UserService){
  this.getAnswer=function(input){
    var splitted_input=input.split(" ");
    var command=splitted_input[0];
    var arguments=splitted_input.splice(1, splitted_input.length-1);
    return UserService.callUserFunction(command,arguments)
  }
}])
app.service('KeyboardService',function(){
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
app.directive('typingPoint', ['KeyboardService','AnswerService',function(KeyboardService,AnswerService,OfflineData) {
  function addDiv(data){
    var iDiv = document.createElement('div');
    iDiv.innerHTML=data;
    document.getElementById('prev_chat').appendChild(iDiv);
  }
  return {
    restrict: 'AEC',
    replace: true,
    template: '<div>you :<input ng-model=input></div>',
    link: function(scope, elem, attrs) {
      var command_history=[];
      var cur_history_index=0;
      var current_typing='';
      scope.cursor='|';
      var cursor_position=0;
      scope.input='add_function b return 1;';
      scope.input_splited=function(){
        return scope.input.cut_in(cursor_position).first+scope.cursor+scope.input.cut_in(cursor_position).second;
      }
      setInterval(function(){
        scope.$apply(function(){
          if(scope.cursor=='|')
           scope.cursor='';
          else
            scope.cursor='|';
          })
      },500);
     document.body.onkeypress=function(e){
        scope.$apply(function() {
          scope.input=scope.input+KeyboardService.getChar(e);
          cursor_position++;
        });
      };
      document.body.onkeydown=function(e){
        if(KeyboardService.isKey(event,KeyboardService.keyCodes.Backspace)){
          scope.$apply(function() {
            var p1=scope.input.cut_in(cursor_position).first;
            var p2=scope.input.cut_in(cursor_position).second;
            if(p1){
              scope.input=p1.cut_in(p1.length-1).first+p2;
              cursor_position--;
            }
            else{
              scope.input=p1+p2;
            }
          });
          e.preventDefault(); 
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.Delete)){
          scope.$apply(function() {
            var p1=scope.input.cut_in(cursor_position).first;
            var p2=scope.input.cut_in(cursor_position).second;
            if(p1){
              scope.input=p1+p2.cut_in(1).second;
            }
            else{
              scope.input=p1+p2;
            }
          });
          e.preventDefault(); 
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.Enter)){
          current_typing='';
          var input=scope.input;
          scope.$apply(function() {
            if(scope.input){ 
              command_history.push(scope.input);
              cur_history_index=command_history.length;
            }
                scope.input='';
            });
          addDiv("you           :"+input);
          if(input=='clear'){
            document.getElementById('prev_chat').innerHTML="";
          }
          else{
            var answer=AnswerService.getAnswer(input);
            addDiv("me            :"+answer);
          }
            window.scrollTo(0,document.body.scrollHeight);
            e.preventDefault(); 
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.UpArrow)){
          if(cur_history_index==command_history.length){
            current_typing=scope.input;
          }
          scope.$apply(function() {
            if(cur_history_index>0){
                cur_history_index--;
                  scope.input=command_history[cur_history_index];
                }
            });
            e.preventDefault(); 
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.DownArrow)){
          scope.$apply(function() {
            if(cur_history_index<command_history.length) cur_history_index++;
            else return;
            if(cur_history_index==command_history.length)
              scope.input=current_typing;
            else
                  scope.input=command_history[cur_history_index];
            });
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.RightArrow)){
          scope.$apply(function() {
            if(cursor_position<scope.input.length)
            cursor_position++;
          });
            e.preventDefault(); 
        }
        else if(KeyboardService.isKey(event,KeyboardService.keyCodes.LeftArrow)){
          scope.$apply(function() {
            if(cursor_position>0)
            cursor_position--;
          });
          e.preventDefault(); 
        }
      }
    }
  };
}]);
