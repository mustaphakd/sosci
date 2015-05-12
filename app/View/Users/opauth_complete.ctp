<?php $this->start('appHeader'); ?>
    <link href="/demos/sosci/favicon.ico" type="image/x-icon" rel="shortcut icon" />

    <meta charset="utf-8">

    <link href="../css/main.css" rel="stylesheet" type="text/css" media="all" />

    

<?php $this->end(); ?>

<div>
    <style>
        body{
            background-color: #ffffff!important;
        }
    </style>

    <div id="prenupPack">
        <div id="messenger" style="text-align: center; font-size: 38px;">
            complete
        </div>

        <div id="spinnerContainer" style="text-align: center; width: 600px;">
            <img src="../imgs/spiffygif.gif">
        </div>

    </div>


    <div id="theform" class="hide">
        <form id="uploadFrm" style="font-family: konel-abel; font-size: 26px;" target="submitFrame" method="post"
            action="https://api.flickr.com/services/upload/"
            > <!--  -->
            <fieldset>
                <legend style="font-size: 30px;">Victim Image Uploader</legend>
                <br>
                <label for="title">Victim Name: </label><input id="title" name="title" type="text"><br><br>
                <label for="description">Brief Description: </label><textarea name="description" id="description" rows="4" cols="50"></textarea><br><br>

                <input type="hidden" name="api_key" id="api_key" value=" ">
                <input type="hidden" name="api_sig" value=" " id="api_sig" >
                <input type="hidden" name="is_public" value="1" id="is_public">
                <input type="hidden" name="oauth_token" value=" " id="auth_token">
                <input type="hidden" name="access_secret" value=" " id="access_secret">

                <!--<input type="hidden" name="oauth_nonce" value=" " id="oauth_nonce">
                <input type="hidden" name="oauth_timestamp" value=" " id="oauth_timestamp">
                <input type="hidden" name="oauth_version" value=" " id="oauth_version">
                <input type="hidden" name="oauth_consumer_key" value=" " id="oauth_consumer_key">
                <input type="hidden" name="oauth_signature_method" value=" " id="oauth_signature_method"> -->

                <label for="photo">Select file</label><input type="file" id="photo" name="photo" autofocus required="true"><br><br>
                <div class="col2 btnGreen" id="btnUpload" style="width: 95%; text-align: center; margin-left: 5px;" >
                    <a class=" fa fa-upload  fa-5x" style="font-size: 26px;">Upload</a>
                </div>
            </fieldset>
        </form>
        <iframe name="submitFrame" id="submitFrame" style="border:none" ></iframe>
    </div>
    <script src="../js/libs/cookies.min.js" type="text/javascript"></script>
    <script src="../js/libs/jquery-2.1.3.min.js" type="text/javascript"></script>

    <script  type="text/javascript" >

        function uploadFile(evt){

            evt.preventDefault();
            var form = $(this).parents('form:first');

            form.attr("enctype", "multipart/form-data")
                .attr("encoding", "multipart/form-data");

            var empty = false;
            form.find('input:text').each(function(itm) {
                if ($(this).val() <= 0) {
                    alert("please fill all fields with information");
                    empty = true;
                }
            });

            if (empty)
                return false;

            form.find('textarea').each(function(itm) {
                if ($(this).val() <= 0) {
                    alert("please fill all fields with information");
                    empty = true;
                }
            });

            if (empty)
                return false;


            var fl = $("#photo")[0].files[0];

            if (fl.size <= 0 ) {
                alert("please select an image to upload");
                return false;
            }


            var action = form.attr("action");

            var frmdata = new FormData(form[0]);

            $("#messenger").text("Please wait while we submit your image....");
            $("#theform").hide();
            $("#prenupPack").show();



            //perhaps decide on endpoint  from upload cookie
            var endpoint = Cookies.get('baggageDestination') + '/uploads/flickrBaggage';

   <?php if(isset($user_data['uploadOnly']) && $user_data['uploadOnly'] == true){ // tkn: <?php echo json_encode($user_data['token']);,
        ?>
                var _data =  {

                    postUrl: <?php echo json_encode($user_data['postUrl']);?>,
                    tkn: <?php echo json_encode($user_data['token']); ?>,
                    api_key: <?php echo json_encode($user_data['api_key']);?>,
                    secret: <?php echo json_encode($user_data['secret']); ?>
                };

                //Cookies.set();

    <?php
    } ?>
                            var data = {
                                title: $("#title").val(),
                                description: $("#description").val(),
                                token: _data.tkn,
                                secret: _data.secret
                            };

            $("#auth_token").val(data.token);
            $("#api_key").val(_data.api_key);
            $("#access_secret").val(_data.secret);

            var formData = new FormData(form[0]);
            $.ajax({
                    type: 'POST',
                    url: endpoint,
                    data: formData, //JSON.stringify(data),
                    processData: false, // tell jQuery not to process the data
                    //dataType: 'json',
                    headers: {
                        Accept : "application/json; charset=utf-8",
                        "Content-Type": "multipart/form-data; "
                    },
                //contentType: "multipart/form-data",  //"application/json;charset=utf-8",
                    success: function(response) {
                        $("#messenger").text("Success\n" + JSON.stringify(response) );
                        if((response != 'undefined') && (response.succeeded != 'undefined') && (response.succeeded == true)){

                                var photoUrl = response.photo_url;

                            localStorage.ImageLocatorDone = JSON.stringify(photoUrl);
                            window.top.close();

                            //$("#theform").show();
                            //$("#prenupPack").hide(6523);

                        }
                        else{
                            //show same as error message
                            $("#messenger").text("Error occured.... \n Close the window and try again later.");
                        }
                    },
                    error: function(rest) {
                        $("#messenger").text("Error occured.... \n" +  JSON.stringify(rest) + '\nClose the window and try again later.');
                        $("#theform").show();
                        $("#prenupPack").hide(6523);

                    }
            });

            }

                        (function() {

                <?php
                /*//name: <?php //echo json_encode($user_data['apiKey']);
                                ?>,*/
                if(isset($user_data['uploadOnly']) && $user_data['uploadOnly'] == true){
                ?>
            //debugger;
            var _data =  {

                postUrl: <?php echo json_encode($user_data['postUrl']);?>

            };

            //Cookies.set(); tkn:  echo json_encode($user_data['token']);?>

<?php
}
else if($user_data['validated'] == true)
{ ?>
                var _data =  {
                    name: <?php echo json_encode($user_data['name']);?>,
                    email: <?php echo json_encode($user_data['email']);?>,
                    image: <?php echo json_encode($user_data['image']);?>,
                    validated: <?php echo json_encode($user_data['validated']);?>
                };

            localStorage.securityToken = JSON.stringify(_data);

<?php }
else{
?>
            var _data =  {
                validated: <?php echo json_encode($user_data['validated']);?>
            };

            localStorage.securityToken = JSON.stringify(_data);

<?php
}

if(isset($user_data['uploadOnly']) && $user_data['uploadOnly'] == true){
?>
//hide spinner

//show upload control

            $("#prenupPack").hide(1000, function(){
                $("#theform").removeClass("hide").show();
                window.resizeTo($( document ).width(), 500);
            });

//wire up click event

            $("#btnUpload").click(uploadFile);

<?php
}
else
{
?>
            localStorage.securityTokenAuthDone = JSON.stringify(true);

            top.window.opener = top;
            top.window.open(" ",'_parent'," ");
            top.window.close();


<?php }  ?>
        })();
    </script>
</div>
