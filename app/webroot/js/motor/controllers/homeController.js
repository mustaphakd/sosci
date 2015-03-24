appControllers.controller('homeController',['$scope',
    function($scope){

        $scope.vctms = [];

        $scope.initVictims = function(){
            suotin.loaderVM.showLoaderMessage("loading data...");
            $scope.getVictims().then(function(vctms){

                if(angular.isArray(vctms))
                {
                    var dataLength = vctms.length;

                    for(var i = 0; i < dataLength; i++)
                    {
                        $scope.vctms.push(vctms[i]);
                    }
                    vctms = null;
                }

                //suotin.loaderVM.closeLoaderMessage();
            },function(msg){
                suotin.loaderVM.closeLoaderMessage();
            });
        };

        $scope.$on(
            "$destroy",
            function handleDestroyEvent() {
                //debugger;
                $scope.vctms = [];
                $scope.vctms = null;
                suotin.loaderVM.closeLoaderMessage();

            }
        );
        $scope.initVictims();

    }]);