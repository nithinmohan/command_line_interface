function getChar(event) {
  if (event.which == null) {
    return String.fromCharCode(event.keyCode) // IE
  } else if (event.which!=0 && event.charCode!=0) {
    return String.fromCharCode(event.which)   // the rest
  } else {
    return null // special key
  }
}
var app=angular.module('myApp',[]);
var controller = app.controller("myController",function($scope){
	$scope.name="nithin";
	document.body.onkeypress=function(e){
		$scope.$apply(function(){
  			$scope.name=$scope.name+getChar(e);
  		})
  	}
  //updateClock();
})
