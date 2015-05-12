appControllers.controller('homeController',['$scope',
    function($scope){

        $scope.vctms = [];
        $scope.victimsLoader = true;
        $scope.victimsLoaderFlag = false;
        suotin.appData.loading = true;

        $scope.initVictims = function(){
            suotin.loaderVM.showLoaderMessage("loading data...");
            
            if(suotin.appData.cntrlrer != null){
                $scope.cleanScrollMagic();
            }

            window.setTimeout(function(){
                $scope.$apply(function(){

                        $scope.showVictimLoader();
                        suotin.appData.loading = true;
                        $scope.initScrollMgc();
                        suotin.appData.loading = false;
                    }
                );
            }, 1200);
        };

        $scope.showVictimLoader = function(){
                $scope.victimsLoaderFlag = true;
        };
        $scope.hideVictimLoader = function(){
                $scope.victimsLoaderFlag = false;
        };
        $scope.initScrollMgc= function(){
            suotin.appData.cntrlrer = new ScrollMagic.Controller({vertical: false});
            suotin.appData.scene = new ScrollMagic.Scene({triggerElement: ".dataLoaderGuard", triggerHook: "onEnter"})
                .addTo(suotin.appData.cntrlrer)
                .on("enter", function (e) {
                    //if($scope.victimsLoaderFlag == false)return;
                    $scope.$apply(function(){
                        $scope.hideVictimLoader();
                        if(suotin.appData.loading == true)
                            return;
                        suotin.appData.loading = true;

                        $scope.loadVictims($scope.currentPage + 1);
                    });


                });
        };

        $scope.loadVictims = function(pageNum){
            suotin.appData.loading = true;
            $scope.getVictims(pageNum).then(function(pckt){
                suotin.appData.loading = false;
                if(!angular.isUndefined(pckt) && angular.isArray(pckt.data))
                {
                    var vctms = pckt.data;
                    var dataLength = vctms.length;

                    for(var i = 0; i < dataLength; i++)
                    {
                        $scope.vctms.push(vctms[i]);
                    }
                    vctms = null;

                    $scope.currentPage = pckt.currentPage;
                    $scope.totalPage = pckt.totalPage;

                    if(pckt.currentPage < pckt.totalPage){
                        $scope.showVictimLoader();
                        suotin.appData.scene.update();
                    }
                    else
                    {

                        $scope.hideVictimLoader();
                        suotin.appData.scene.update();
                        $scope.victimsLoader = false;

                        $scope.cleanScrollMagic();
                    }

                }
                else{
                    $scope.hideVictimLoader();
                }

                //suotin.loaderVM.closeLoaderMessage();
            },function(msg){
                suotin.appData.loading = false;
                $scope.hideVictimLoader();
                suotin.loaderVM.closeLoaderMessage();
            });
        };

        $scope.cleanScrollMagic = function(){
            suotin.appData.scene.destroy(true);
            suotin.appData.scene = null;

            suotin.appData.cntrlrer.destroy(true);
            suotin.appData.cntrlrer = null;
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