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
function getAnswer(input){
	var init_data='',action;
	if(input=='clear'){
		action='clear';
	}
	else if(input=='av_links'){
		action=false;
		for(var c in data.available_links){
			init_data=init_data+'<a href="'+data.available_links[c]+'">'+data.available_links[c]+'</a><br>'
		}
		output=init_data;
	}
	else{
		output='unknown command';
		action=false;
	}
	return {
			action:action,
			output:output
		}
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
    template: '<div>you :{{input}}{{cursor}}</div>',
    link: function(scope, elem, attrs) {
    scope.cursor='_';
    scope.input='';
    setInterval(function(){
      scope.$apply(function(){
        if(scope.cursor=='_')
         scope.cursor='';
        else
          scope.cursor='_';
        })
    },500);
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
     		addDiv("you           :"+scope.input);
     		var answer=getAnswer(scope.input);
     		if(answer.action==false){
     			addDiv("me            :"+answer.output);
     		}
     		else if(answer.action=='clear'){
     			document.getElementById('prev_chat').innerHTML="";
     		}
     		scope.$apply(function() {
     			if(scope.input){ 
     				command_history.push(scope.input);
     				cur_history_index=command_history.length;
     			}
          		scope.input='';
        	});
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