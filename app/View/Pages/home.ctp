

    <?php $this->start('appHeader'); ?>
   <base href="/demos/sosci/">

    <link href="/demos/sosci/favicon.ico" type="image/x-icon" rel="shortcut icon" />

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Save our Nation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.css" />
    <link href="css/leaflet.label.css" rel="stylesheet" type="text/css" media="all" />

    <link href="css/af.ui.css" rel="stylesheet" type="text/css" media="all" />
    <link href="css/index.min.css" rel="stylesheet" type="text/css" media="all" />
    <link href="css/main.css" rel="stylesheet" type="text/css" media="all" />
    <!--
        <script type="text/javascript" async="true" src="js/libs/jquery-2.1.3.min.js"></script>manifest="cache_1_00_1.appcache"
        <script type="text/javascript" async="true" src="js/libs/verge.js"></script>
        <script type="text/javascript" async="true" src="js/libs.min.js"></script>-->

    <?php $this->end(); ?>

<!--<body ng-controller="mainAppController">-->



<div id="scrollbar" class="scrollbar">
    <div class="handle">
        <div class="mousearea"></div>
    </div>
</div>

<div id="frame" class="frame">


    <div id="host" class="host">
            <span class="mobileMenuBars" id="idMobileMenuBars">
                    <i  class="fa fa-bars fa-2"></i>
            </span>
        <div class="menu">


            <div class="topMenu">
                <ul>
                    <li><a class="tooltip" data-tooltip="map view" href=" "><i class="fa fa-map-marker fa-lg"></i></a></li>
                    <li ><a class="tooltip" data-tooltip="data visualization"><i class="fa fa-bar-chart fa-lg"></i></a></li>

                    <li><a class="tooltip" data-tooltip="details" href="ourpeople"><i class="fa fa-picture-o fa-lg"></i></a></li>
                    <?php if(AuthComponent::user('id')){ ?>

                        <li><a class="tooltip" data-tooltip="add case" href="add"><i class="fa fa-plus fa-lg"></i></a></li>
                        <li><a class="tooltip" data-tooltip="dashboard" href="dashbrd"><i class="fa fa-tachometer fa-lg"></i></a></li>
                        <li style="display: none"><a class="tooltip" data-tooltip="validate cases"><i class="fa fa-gavel fa-lg"></i></a></li>

                        <!--Logged in as < ? = //AuthComponent::user('role') == "admin"
                        ?> -->
                    <?php } ?>
                         </ul>

            </div>
            <div class="bottomMenu">
                <div class="container">
                    <div class="host farLeftOffscreen" >
                        <span><i class="fa fa-gavel fa-lg" style="float: left"></i></span><span><i class="fa fa-gavel fa-lg" style="float: left"></i></span>
                        <div class="authItems">


                            <a class="tooltip" data-tooltip="Facebook" data-auth="facebook"><i class="fa fa-facebook-official"></i></a>
                            <a class="tooltip" data-tooltip="LinkedIn" data-auth="linkedin"><i class="fa fa-linkedin-square"></i></a>
                            <a class="tooltip" data-tooltip="Google" data-auth="google"><i class="fa fa-google-plus"></i></a>
                            <a class="tooltip" data-tooltip="Twitter" data-auth="twitter"><i class="fa fa-twitter"></i></a>
                            <a class="tooltip" data-tooltip="Yahoo!" data-auth="yahoo"><i class="fa fa-yahoo"></i></a>
                            <a class="tooltip" data-tooltip="Microsoft" data-auth="live" ><i class="fa fa-windows"></i></a>
                        </div>
                    </div>

                </div>


                <span id="idLogin" class="authIcon"><a class="tooltip" data-tooltip="log in"><i class="fa fa-sign-in fa-lg selected"></i></a></span>
                <span id="idLogoff" class="authIcon"><a class="tooltip" data-tooltip="log off"><i class="fa fa-sign-out fa-lg selected"></i></a></span>
                <div class="container hide" id="loginCarte">
                    <a class="tooltip" data-tooltip="">
                        <img id="userPic" src="">
                    </a>
                </div>

            </div>
            <div class="bottomMenuMobile">
                <span id="idMobileLogIn" class="authIcon tooltip" data-tooltip="log in"><i class="fa fa-sign-in fa-lg selected"></i></span>
                <span id="idMobileLogoff" class="authIcon tooltip" data-tooltip="log off"><i class="fa fa-sign-out fa-lg selected"></i></span>
                <div class="authItems">
                    <ul>
                        <li data-auth="facebook"><a class="tooltip" data-tooltip="Facebook"><i class="fa fa-facebook-official fa-lg"></i></a></li>
                        <li data-auth="linkedin"><a class="tooltip" data-tooltip="LinkedIn"><i class="fa fa-linkedin-square fa-lg"></i></a></li>
                        <li data-auth="google"><a class="tooltip" data-tooltip="Google"><i class="fa fa-google-plus fa-lg"></i></a></li>
                        <li data-auth="twitter"><a class="tooltip" data-tooltip="Twitter"><i class="fa fa-twitter fa-lg"></i></a></li>
                        <li data-auth="yahoo"><a class="tooltip" data-tooltip="Yahoo!"><i class="fa fa-yahoo fa-lg"></i></a></li>
                        <li data-auth="microsoft" ><a class="tooltip" data-tooltip="live"><i class="fa fa-windows fa-lg"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div id="content" class="content">
            <div style="position: absolute; top: 20%;left: 20%">
                <div class="titleText catchyPhrase"> Sauvons notre nation.</div>
            </div>
            <!--
            <div class="regularText" style="position: absolute"> The quick brown fox jumps over the lazy dog</div>
            <div class="entryText2"> The quick brown fox jumps over the lazy dog</div>
            <div class="entryText3"> The quick brown fox jumps over the lazy dog</div>
            <div class="entryText4"> The quick brown fox jumps over the lazy dog</div>

            <div class="entryText1"> The quick brown fox jumps over the lazy dog</div>


            -->
            <div ng-view style="height: 100%;width: 100%;position: relative;display: inline-block;">

            </div>


        </div>

    </div>
</div>

<div id="loader-wrapper">
    <div id="loader"></div>
    <div class="titleText "> Sauvons notre nation.</div>
    <div class="notifier hide" style="color: #000000;">
        <i class="fa fa-spinner fa-pulse fa-3x"></i>
        <span class="notifierContent"></span>
    </div>

    <div class="dialog hide" id="dlgMssge" >

        <div class="messageBox bottomSpacer">

            <div class="titleGrid"></div>

            <div class=" galleryItemText messageContent" id="messageBoxContent">

            </div>
            <div class="btnGrid">
                <div class=" btnGreen" ng-click="closeDialog()"><a class=" fa  fa-5x">Close</a></div>
            </div>
        </div>

    </div>
</div>

<script type="text/javascript"  src="js/libs.min.js"></script>
<!--<script type="text/javascript"  src="js/libs/plugins.js"></script>
<script type="text/javascript" src="js/libs/fileImporter.js"></script>-->

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-animate.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-touch.min.js"  type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-route.min.js" type="text/javascript"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster.js" type="text/javascript"></script>
<script src="js/libs/cookies.min.js" type="text/javascript"></script>

<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/CSSPlugin.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.16.1/TweenLite.min.js"></script>

<script src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.3/ScrollMagic.min.js"></script>
<script type="text/javascript"  src="js/bottom_libs.min.js"></script>

<script src="js/libs/index.min.js" type="text/javascript"></script>





<script src="js/motor/main.js" type="text/javascript"></script>

