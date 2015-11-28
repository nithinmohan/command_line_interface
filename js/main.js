function getChar(event) {
  if (event.which == null) {
    return String.fromCharCode(event.keyCode) // IE
  } else if (event.which!=0 && event.charCode!=0) {
    return String.fromCharCode(event.which)   // the rest
  } else {
    return null // special key
  }
}
var keyCodes={};
keyCodes.Enter=13;
keyCodes.Backspace=8;
function isKey(event,keycode){
	if (event.which == null) {
    return keycode==event.keyCode;// IE
  } else if (event.which!=0) {
    return keycode==event.which;   // the rest
  } else {
    return false; // special key
  }
}
function getAnswer(input){
	return input+" bleh";
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
    template: '<div>you:{{input}}</div>',
    link: function(scope, elem, attrs) {
     document.body.onkeypress=function(e){
        scope.$apply(function() {
          scope.input=scope.input?scope.input+getChar(e):getChar(e);
        });
      };
      document.body.onkeydown=function(e){
      	if(isKey(event,keyCodes.Backspace)){
     		scope.$apply(function() {
          		scope.input=scope.input?scope.input.substr(0,scope.input.length-1):'';
        	});
     	}
     	else if(isKey(event,keyCodes.Enter)){
     		addDiv("you           :"+scope.input);
     		addDiv("me            :"+getAnswer(scope.input));
     		scope.$apply(function() {
          		scope.input='';
        	});
     	}
      }
    }
  };
});