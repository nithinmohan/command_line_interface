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
var app=angular.module('myApp',[]);
app.directive('typingPoint', function() {
  return {
    restrict: 'AEC',
    replace: true,
    template: '<div>{{name}}</div>',
    link: function(scope, elem, attrs) {
     document.body.onkeypress=function(e){
        scope.$apply(function() {
          scope.name=scope.name?scope.name+getChar(e):getChar(e);
        });
      };
      document.body.onkeydown=function(e){
      	if(isKey(event,keyCodes.Backspace)){
     		scope.$apply(function() {
          		scope.name=scope.name?scope.name.substr(0,scope.name.length-1):'';
        	});
     	}
     	else if(isKey(event,keyCodes.Enter)){
     		var iDiv = document.createElement('div');
     		iDiv.innerHTML=scope.name;
			document.getElementById('prev_chat').appendChild(iDiv);
     		scope.$apply(function() {
          		scope.name='';
        	});
     	}
      }
    }
  };
});

var controller = app.controller("myController",function($scope){
	
  //updateClock();
})
