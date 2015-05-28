

appSuotin.stats = {};
appSuotin.stats.controller = function ($scope){

    $scope.vctms = [];
    $scope.currentPage = 0;
    $scope.totalPage = 0;
    $scope.filterDate = {};
    $scope.filterDate.date = 0;
    $scope.dates = [];
    $scope.dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

    $scope.topLineChart = null;
    $scope.ageGroupPieChart = null;
    $scope.occurencePlacePieChart = null;

    $scope.genderDim = null;
    $scope.genderGroup = null;
    $scope.genderMaleGroup = null;
    $scope.genderFemaleGroup = null;

    $scope.dateDim = null;

    $scope.crssfiler = null;
    $scope.allGroup = null;

    $scope.lineChartXscale = null;

    $scope.ageDim = null;
    $scope.ageGrp = null;

    $scope.placeDim = null;
    $scope.placeGrp = null;

    $scope.initViz = function(){


        $scope.fetchFilterDates();
        var prevDate = sessionStorage.getItem('datavizFilteredDate');
        var _date = null;
//debugger;
        if( ( prevDate!= undefined && prevDate != null))
        {
            _date = JSON.parse(prevDate);
            _date = _date.date;

        }
        else{
            _date = new Date (Date.now()).getFullYear();
        }
        $scope.filterDate.date = _date;

        $scope.fetchVictimsByDate(_date);

        $scope.createCharts();

    };

    $scope.selectYear = function(){
        var newVal = $scope.filterDate.date;

        var _date = JSON.stringify({date: newVal});

        sessionStorage.setItem('datavizFilteredDate', _date);

        $scope.fetchVictimsByDate(newVal);
    };

    $scope.fetchFilterDates = function(){
        $scope.getDatavizDates().then(function(pckt){
           // suotin.loaderVM.closeLoaderMessage();

            if(!angular.isUndefined(pckt) && angular.isArray(pckt.data)) {
                var dates = pckt.data;
                var dataLength = dates.length;

                $scope.dates = [];

                for(var i = 0; i < dataLength; i++) {

                    $scope.dates.push(dates[i]);
                }
            }
            else
            {
                $scope.showErrorMessage();
            }
            data = null;

        },function(msg){
            suotin.loaderVM.closeLoaderMessage();
           // $scope.saving = false;
            $scope.showErrorMessage();
        });
    };

    $scope.showErrorMessage = function(){
        $scope.messageContent = "An error occured while retrieving data over the network. \n";

        $scope.messageBoxEnterMessage = "Try again!";

        $scope.messageBoxCancelMessage = "cancel";

        //$scope.dataSaved = false;

        $.afui.loadContent("#vwMessage",false,0,"up");
        $.afui.setBackButtonVisibility(false);
    };

    $scope.fetchVictimsByDate = function(dateFilter){

        $scope.getVictimsByDate(dateFilter).then(function(pckt){
            //suotin.loaderVM.closeLoaderMessage();

            if(!angular.isUndefined(pckt) && angular.isArray(pckt.data)) {
                var dates = pckt.data;
                var dataLength = dates.length;

                $scope.vctms = [];

                for(var i = 0; i < dataLength; i++) {
                    dates[i].date =  new Date($scope.dateFormat.parse(dates[i].occurrencedate));
                    dates[i].month = dates[i].date.getMonth();
                    $scope.vctms.push(dates[i]);
                }

                $scope.createCharts();
                $scope.computeDimensions();
                $scope.drawCharts();
                suotin.loaderVM.closeLoaderMessage();
            }
            else
            {
                $scope.showErrorMessage();
            }
            data = null;

        },function(msg){
            suotin.loaderVM.closeLoaderMessage();
            // $scope.saving = false;
            $scope.showErrorMessage();
        });
    };

    $scope.messageDone = function(_status){
        suotin.browseBack();
    };

    $scope.createCharts = function(){

        var lineChartContainer = $("#genderStackedLineChart");
        lineChartContainer.html("");
        $scope.topLineChart = dc.lineChart(lineChartContainer[0]);


        var agePieChartContainer = $("vizPieAgeGroup");
        agePieChartContainer.html("");
        $scope.ageGroupPieChart = dc.pieChart("#vizPieAgeGroup");

        var placeChartContainer = $("vizPieOccurencePlace");
        placeChartContainer.html("");
        $scope.occurencePlacePieChart = dc.pieChart("#vizPieOccurencePlace");


        $(".vizAreayearly").off();

        lineChartContainer.off();
        agePieChartContainer.off();
        placeChartContainer.off();


    };

    $scope.computeDimensions = function(){

        $scope.clearXDimensions();
        $scope.crssfiler = crossfilter($scope.vctms);
        $scope.allGroup = $scope.crssfiler.groupAll();
        $scope.allCount = $scope.allGroup.value();
        /************************Gender Line Chart group and dimension********************/

       // var format = d3.time.format("%Y-%m-%d %H:%M:%S");


        $scope.dateDim = $scope.crssfiler.dimension(function(vctm){
           // return format.parse(vctm.occurrencedate).getMonth();
            return vctm.month;
        });

        $scope.genderDim = $scope.crssfiler.dimension(function(vctm){
            return vctm.gender;
        });

        $scope.genderGroup = $scope.genderDim.group().reduce(
            function (p, v) {
                ++p.total;

                if(v.gender == 'f'){
                    p.female += 1;
                }
                else if(v.gender == 'm')
                {
                    p.male += 1;
                }
                return p;
            },
            function (p, v) {
                --p.total;

                if(v.gender == 'f'){
                    --p.female;
                }
                else
                {
                    --p.male;
                }

                return p;
            },
            function () {
                return {days: 0, total: 0, avg: 0, male: 0, female: 0};
            }
        );

        $scope.genderMaleGroup = $scope.dateDim.group().reduce(
            function (p, v) {
                if(v.gender == 'm')
                {
                    ++p.total;
                }

                p.month = v.month;
                p.date = v.date;
                return p;
            },
            function (p, v) {
                if(v.gender == 'm'){
                    --p.total;
                }

                return p;
            },
            function () {
                return {days: 0, total: 0, avg: 0, month: 0};
            }
        );
        $scope.genderFemaleGroup = $scope.dateDim.group().reduce(
            function (p, v) {
                if(v.gender == 'f')
                {
                    ++p.total;
                }

                p.month = v.month;
                p.date = v.date;
                return p;
            },
            function (p, v) {
                if(v.gender == 'f'){
                    --p.total;
                }

                return p;
            },
            function () {
                return {days: 0, total: 0, avg: 0, month: 0};
            }
        );

            /*****************************************************/
        /********************age group chart group and dimension******************************/

        $scope.ageDim = $scope.crssfiler.dimension(function(vctm){
            return vctm.ageGroup;
        });

        $scope.ageGrp = $scope.ageDim.group().reduceCount();


        /*****************************************************/
        /*******************place chart group and dimension*************************/

        $scope.placeDim = $scope.crssfiler.dimension(function(vctm){
            return vctm.place;
        });

        $scope.placeGrp = $scope.placeDim.group().reduceCount();


        /*****************************************************/


    };

    $scope.drawCharts = function(){
        $scope.drawTopLineChart();

        $scope.drawAgePieChart();

        $scope.drawPlacePieChart();
    };

    $scope.drawPlacePieChart = function(){
        $( $scope.occurencePlacePieChart).off();
        //var width = $("vizPieOccurencePlace").with();
        $scope.occurencePlacePieChart
            .radius(90)
            //.width(width)
            //.x(d3.scale.ordinal().domain(["Club", "Ecole", "Marche", "Rue", "Taxi", "Maison", "other"]))
            .dimension($scope.placeDim )
            .group($scope.placeGrp)
            .label(function (d) {
                if ( $scope.occurencePlacePieChart.hasFilter() && ! $scope.occurencePlacePieChart.hasFilter(d.key)) {
                    return  ' (0%)'; //d.key +
                }
                var label = d.data.key;

                label += "\n\r";

               // var val = $scope.placeGrp.all()[0].value;
                //if (val) {
                    label += '(' + Math.floor(d.value / $scope.allCount * 100) + '%)';
                //}
                return label;
            })
            .title(function(d) { return d.data.key + ": " + d.value +" case(s) reported   (" + Math.floor(d.value / $scope.allCount * 100) + "%)" ; })
            .renderTitle(true)
            .renderLabel(true)
            .innerRadius(40)
            .transitionDuration(500)
            .colors(["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"])
            .colorAccessor(function (d, i){
                return i;
            })
            .legend(dc.legend());//.horizontal(true)
            //.calculateColorDomain();

        $scope.occurencePlacePieChart.render();

    };

    $scope.drawAgePieChart = function(){
        //var width = $("vizPieAgeGroup").width();
        $($scope.ageGroupPieChart).off();
        $scope.ageGroupPieChart.radius(90);
        //$scope.ageGroupPieChart.width(width);
        $scope.ageGroupPieChart.dimension($scope.ageDim);
        $scope.ageGroupPieChart.chartGroup($scope.ageGrp)
        $scope.ageGroupPieChart.group($scope.ageGrp)
            .label(function (d) {
                if ($scope.ageGroupPieChart.hasFilter() && !$scope.ageGroupPieChart.hasFilter(d.key)) {
                    return  ' (0%)'; //d.key +
                }
                var label = d.data.key;

                label += "\n\r"

               // var val = $scope.ageGrp.all()[0].value;
                //if (val) {
                    label += '(' + Math.floor(d.value / $scope.allCount * 100) + '%)';
                //}*/
                return label;
            });
        $scope.ageGroupPieChart.keyAccessor(function(d) {
            return d.key;
        })
            .title(function(d) { return d.data.key + ": " + d.value +" cases reported  (" + Math.floor(d.value / $scope.allCount * 100) + "%)" ; })
            .renderTitle(true);
        $scope.ageGroupPieChart.renderLabel(true);
        $scope.ageGroupPieChart.innerRadius(40);
        $scope.ageGroupPieChart.transitionDuration(500);
        $scope.ageGroupPieChart.colors(["#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"]);
        $scope.ageGroupPieChart.colorAccessor(function (d, i){
                return i;
            })
        $scope.ageGroupPieChart.legend(dc.legend());
            //.calculateColorDomain();


        $scope.ageGroupPieChart.render();
    };

    $scope.drawTopLineChart = function(){

        $("#genderStackedLineChart").off();
        var maxHeight = $("#genderStackedLineChart").height();
        var maxWidth = $("#genderStackedLineChart").width();
        var maxY =  Math.max($scope.vctms.length, 10);


        var maxYval = d3.scale.linear().domain([0, maxY]).rangeRound(0, maxHeight);


        $scope.lineChartXscale = d3.time.scale().domain([new Date($scope.filterDate.date, 0, 1), new Date($scope.filterDate.date, 11, 31)]);

        $scope.topLineChart
            .width(maxWidth)
            .height(maxHeight - 10)
            .x($scope.lineChartXscale)
            .xUnits(d3.time.months)
            .y(maxYval)

            .renderHorizontalGridLines(true)
            .interpolate('linear')
            .round(d3.time.month.round)
            .renderArea(true)

            .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))

            .brushOn(false)

            .xAxisLabel("months")
            .yAxisLabel("Volume of cases")
            .dimension($scope.dateDim)
            .group($scope.genderMaleGroup, "Monthly male cases")
               .valueAccessor(function(d){
                return d.value.total ;
            })
            .keyAccessor(function(d){
               return d.value.date;
            })

            .colors(["#3851cc", "#b55e98"]);



        $scope.topLineChart.stack($scope.genderFemaleGroup, 'Monthly female cases',function(d){
            return d.value.total ;
        });

        $scope.topLineChart.render();
    };

    $scope.clearXDimensions = function(){

        $scope.allGroup = null;
        $scope.genderDim = null;


        $scope.genderFemaleGroup = null;
        $scope.genderMaleGroup = null;

        $scope.ageDim = null;
        $scope.ageGrp = null;

        $scope.placeDim = null;
        $scope.placeGrp = null;

        $scope.crssfiler = null;


    };

    $scope.resetTopLineChart = function(){
        $scope.topLineChart.filterAll();
        dc.redrawAll();
    };

    $scope.resetAgePieChart = function(){
        $scope.ageGroupPieChart.filterAll();
       // dc.redrawAll();
        dc.renderAll();
    };

    $scope.resetPlaceChart = function(){
        $scope.occurencePlacePieChart.filterAll();
        dc.renderAll();
    };



    $scope.$on(
        "$destroy",
        function handleDestroyEvent() {
            if(suotin.security.authCompleteIntervalToken != null)
            {
                appSuotin.lazyLoader.interval.cancel(suotin.security.authCompleteIntervalToken);

                $scope.vctms = [];
                $scope.vctms = null;
                $scope.dates = [];
                $scope.dates = null;
                suotin.loaderVM.closeLoaderMessage();

                d3 = null;
                dc = null;
                crossfilter = null;

            }
        }
    );

    $scope.initViz();

}

jQuery(function($){
   // suotin.loaderVM.showLoaderMessage("loading data...");
    if( suotin.isMobileDevice === false)
        $(document).off();

    appSuotin.stats.os = $.os.ie;

    $.os.ie = false;

    appSuotin.stats.init = function(){
        //var controllerName = 'js/motor/controllers/statsController.js';
        var controllerName = 'js/motor/controllers/statsController.min.js';
        var tmp = JSON.parse(sessionStorage.controllerScripts);
        tmp.scripts.push(controllerName);
        sessionStorage.controllerScripts = JSON.stringify(tmp);
        tmp = null;

        var vw = angular.element("#dataVisContainer");

        appSuotin.lazyLoader.rootScope.$apply(function() {
            //debugger;
            vw.attr('ng-controller', "appSuotin.stats.controller");

            if(!angular.isDefined(appSuotin.stats))
                appSuotin.stats = {};

            appSuotin.stats.scope = vw.scope();

            appSuotin.stats.scope.initied = true;

            $.extend( appSuotin.stats.scope, appSuotin.stats.controller(appSuotin.stats.scope) );

            vw = angular.element("#dataVisContainer");

            vw.on("$destroy",function handleDestroyEvent() {
                    //debugger;
                    //var controllerfilePathName = 'js/motor/controllers/statsController.js';
                    var controllerfilePathName = 'js/motor/controllers/statsController.min.js';


                    $.os.ie = appSuotin.stats.os;

                    var vw = angular.element("#dataVisContainer");
                    appSuotin.stats.scope.$destroy();


                    appSuotin.stats.scope = null;
                    appSuotin.stats.compiled = null;
                    appSuotin.stats = null;

                    //removejscssfile("statsController.js", "js");
                    removejscssfile("statsController.min.js", "js");
                    removejscssfile("dc.min.js", "js");
                    removejscssfile("crossfilter.min.js", "js");
                    removejscssfile("d3.v3.min.js", "js");

                    var tmp = JSON.parse(sessionStorage.controllerScripts);
                    var idx =  0;
                    if( (idx = tmp.scripts.indexOf(controllerfilePathName)) != -1)
                    {
                        tmp.scripts.splice(idx, 1);
                        sessionStorage.controllerScripts = JSON.stringify(tmp);
                        tmp = null;
                    }
                }
            );
            vw= null;

        });
    };


    ImportJsFiles([
        "js/libs/dc.min.js",
        'https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter.min.js',
        "http://d3js.org/d3.v3.min.js"

    ], function(){


        appSuotin.stats.init();
        appSuotin.modulePromise.resolve(true);

        suotin.initAppFrmwrk("#datavizMainPanel");
        $.afui.setBackButtonVisibility(false);

        suotin.frame.reload();

        var isChromium = !!window.chrome;

        if(isChromium){
            $("#dataVisContainer").css("overflow-y", "visible");
        }

        function myClickHandler(evt){
            evt.preventDefault();
        }

        $.afui.customClickHandler=myClickHandler;

    });
});
