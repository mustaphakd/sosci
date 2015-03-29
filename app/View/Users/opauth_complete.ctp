<?php $this->start('appHeader'); ?>
    <link href="/demos/sosci/favicon.ico" type="image/x-icon" rel="shortcut icon" />

    <meta charset="utf-8">

    <link href="../css/main.css" rel="stylesheet" type="text/css" media="all" />

    <script src="../js/libs/spin.min.js" type="text/javascript"></script>
<!--  <script src="../js/libs/cookies.min.js" type="text/javascript"></script>   <script src="../js/libs/jquery-2.1.3.min.js" type="text/javascript"></script> -->

<?php $this->end(); ?>

<div>
    <style>
        body{
            background-color: #ffffff!important;
        }
    </style>
    <div style="text-align: center; font-size: 38px;">
        complete
    </div>

    <div id="spinnerContainer"></div>

    <script  >

        (function() {



               // http://fgnass.github.io/spin.js/#?
            var opts = {
                lines:17,
                length:14,
                width:30,
                radius:39,
                corners:0,
                rotate:0,
                trail:100,
                speed:0.5,
                direction:1,
                color: '#3b0', // #rgb or #rrggbb or array of colors
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            };


            //if(isset($user_info['validated']) && $user_info['validated'] == true)
            //{

<?php
if($user_data['validated'] == true)
{ ?>
                var _data =  {
                    name: <?php echo json_encode($user_data['name']);?>,
                    email: <?php echo json_encode($user_data['email']);?>,
                    image: <?php echo json_encode($user_data['image']);?>,
                    validated: <?php echo json_encode($user_data['validated']);?>
                };

            localStorage.securityToken = JSON.stringify(_data);
            
            var target = document.getElementById('spinnerContainer');
           // debugger;
            var spinner = new Spinner(opts).spin(target);

            //window.opener.$(window.opener.document).trigger('authcompleted',  sessionStorage.securityToken);
           /* window.setTimeout(function() {
                localStorage.securityTokenAuthDone = JSON.stringify(true);

                //closeWindows();

                //window.close();
            }, 500);*/
<?php }
else{
?>
            var _data =  {
                validated: <?php echo json_encode($user_data['validated']);?>
            };

            localStorage.securityToken = JSON.stringify(_data);

<?php
}

?>
            localStorage.securityTokenAuthDone = JSON.stringify(true);

            top.window.opener = top;
            top.window.open(" ",'_parent'," ");
            top.window.close();

        })();

    </script>
</div>
