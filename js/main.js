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
var app=angular.module('myApp',['Services']);

app.value('OfflineData',{
  available_links:['link1','link2'],
});

app.directive('typingPoint', ['KeyboardService','AnswerService','CodeEditorService','$timeout','UserService',function(KeyboardService,AnswerService,CodeEditorService,$timeout,UserService) {
  function addDiv(data){
    var iDiv = document.createElement('div');
    iDiv.innerHTML=data;
    document.getElementById('prev_chat').appendChild(iDiv);
  }
  return {
    restrict: 'AEC',
    replace: true,
    template: '<div>you :<input id="main_input" autofocus ng-model=input ng-trim="false"></div>',
    link: function(scope, elem, attrs) {
      var command_history=[];
      var cur_history_index=0;
      var current_typing='';
      scope.input='';
      var enter_handler=function(data){
        if(!data)
          data="";
        current_typing='';
        var input=scope.input;
        if(scope.input){ 
          command_history.push(scope.input);
          cur_history_index=command_history.length;
        }
        scope.input='';
        addDiv("you           :"+input);
        if(input=='clear'){
          document.getElementById('prev_chat').innerHTML="";
        }
        else{
          var answer=AnswerService.getAnswer(input+" "+data);
          addDiv("me            :"+answer);
        }
        window.scrollTo(0,document.body.scrollHeight);
        try{
          e.preventDefault(); 
        }
        catch(v){
        }
      }
      scope.$on('keypress:13',function(event, args){
        _("asd");
        enter_handler(args.code);
      });
      elem.bind('keydown',function(e){
        if(KeyboardService.isKey(e,KeyboardService.keyCodes.Enter)){
          scope.$apply(enter_handler());
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
      })
    },
    controller:function($scope,$rootScope,$element){
      $scope.$watch('input', function() {
        if(/add_function\s+(\S)+\s/.test($scope.input)){
          CodeEditorService.set_show(true);
          //waiting for rendering to happen.Focus will work only after showed in dom.
          $timeout(function() {
            CodeEditorService.CodeMirror.focus();
            CodeEditorService.setContent(UserService.getUserFunctionString($scope.input.trim().split(" ")[1]));
          }, 10);
          $element[0].querySelector("#main_input").disabled=true;
        }
        else{
          CodeEditorService.set_show(false);
        }
      });
    }
  };
}]);
app.controller('EditorController',['$scope','$rootScope','CodeEditorService',function($scope,$rootScope,CodeEditorService){
    $scope.get_show=CodeEditorService.get_show;
    $scope.add=function(){
      $rootScope.input=$rootScope.input.trim();
      $rootScope.$broadcast('keypress:13', {code:CodeEditorService.getCodeWithoutLineFeed(),data:CodeEditorService.getCodeWithLineFeed()});
      document.getElementById("main_input").disabled=false;
      document.getElementById("main_input").focus();
      CodeEditorService.clear();
    } 
    $scope.cancel=function(){
      $rootScope.input=$rootScope.input.trim();
      document.getElementById("main_input").disabled=false;
      document.getElementById("main_input").focus();
    }   
}])
app.controller('LoginController',['$http','TokenFactory',function($http,TokenFactory){
  this.log_in=function(uname,pword){
    $http({
      method: 'POST',
      data: {
        username:this.username,
        password:this.password
      },
      url: 'http://localhost:8888/authenticate'
    }).then(function successCallback(response) {
        TokenFactory.set(response.data.token);
        console.log(response);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        
      })
  }
}])
