function getChar(event) {
  if (event.which == null) {
    return String.fromCharCode(event.keyCode) // IE
  } else if (event.which!=0 && event.charCode!=0&&!isKey(event,keyCodes.Enter)&&!isKey(event,keyCodes.Backspace)) {
    return String.fromCharCode(event.which)   // the rest
  } else {
    return '' // special key
  }
}
var keyCodes={
	Enter:13,
	Backspace:8,
	UpArrow:38,
	DownArrow:40,
	};
var data={
	available_links:['link1','link2'],
};
var command_history=[];
function isKey(event,keycode){
	if (event.which == null) {
    return keycode==event.keyCode;// IE
  } else if (event.which!=0) {
    return keycode==event.which;   // the rest
  } else {
    return false; // special key
  }
}
function _(data){
	console.log(data);
}
var cur_history_index=0;
var current_typing='';
var user_rules={
	'time':function(){
		return "12:30"
	},
	'add':function(arguments){
		return arguments[0]+arguments[1];
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
}
function getAnswer(input){
	var init_data='',action;
	var splitted_input=input.split(" ");
	var command=splitted_input[0];
	var arguments=splitted_input.splice(1, splitted_input.length-1);
	if(user_rules[command]==undefined)
		output='unknown_command';
	else
	output=user_rules[command](arguments);
	return output;
}
function addDiv(data){
	var iDiv = document.createElement('div');
    iDiv.innerHTML=data;
	document.getElementById('prev_chat').appendChild(iDiv);
}
var app=angular.module('myApp',[]);
app.directive('typingPoint', function() {
  return {
    restrict: 'AEC',
    replace: true,
    template: '<div>you :{{input}}</div>',
    link: function(scope, elem, attrs) {
    scope.input='';
     document.body.onkeypress=function(e){
        scope.$apply(function() {
          scope.input=scope.input+getChar(e);
        });
      };
      document.body.onkeydown=function(e){
      	if(isKey(event,keyCodes.Backspace)){
     		scope.$apply(function() {
          		scope.input=scope.input?scope.input.substr(0,scope.input.length-1):'';
        	});
	      	e.preventDefault(); 
     	}
     	else if(isKey(event,keyCodes.Enter)){
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
	     		var answer=getAnswer(input);
	     		addDiv("me            :"+answer);
	     	}
        	window.scrollTo(0,document.body.scrollHeight);
	      	e.preventDefault(); 
     	}
     	else if(isKey(event,keyCodes.UpArrow)){
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
     	else if(isKey(event,keyCodes.DownArrow)){
     		scope.$apply(function() {
     			if(cur_history_index<command_history.length) cur_history_index++;
     			else return;
     			if(cur_history_index==command_history.length)
     				scope.input=current_typing;
     			else
          			scope.input=command_history[cur_history_index];
        	});
	      	e.preventDefault(); 
     	}
      }
    }
  };
});