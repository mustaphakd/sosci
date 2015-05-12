<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 4/2/2015
 * Time: 6:00 PM
 */

class UploadsController extends AppController{
    public $components = array('RequestHandler', 'Cookie' ); //,Xml', 'Utility'

    public function flickrBaggage(){

        if($this->request->is('post')) {
            $api_key = Configure::read('Opauth.Strategy.Flickr')['key'];
            $title = $this->data['title'];
            $description = $this->data['description'];
            $token = $this->data['oauth_token'];
            $access_secret = $this->data['access_secret']; //new
            $secret = Configure::read('Opauth.Strategy.Flickr')['secret'];

            $photoUrl = $this->request->params['form']['photo']['tmp_name'];
            $photoType = $this->request->params['form']['photo']['type'];

            $tags = 'human missing African ivory coast west';

            $params = $this->generate_params($token); //****

            $args = array( "title" => $title, "description" => $description,  "is_public" => "1");

            $args = array_merge($params, $args); //*****

            ksort($args);
            $auth_sig = "";

            $hmac_sha1_key =  "$secret&$access_secret";   //$this->safe_encode($secret) . '&' . $this->safe_encode($access_secret);

            $keyValPair = array();

            foreach ($args as $key => $data) {
                if ( is_null($data) ) {
                    unset($args[$key]);
                } else {
                    //$auth_sig .= $key ."=" . $this->safe_encode($data) . '&';
                    array_push($keyValPair, rawurlencode($key) . "=" . rawurlencode($data));
                }
            }

            $auth_sig = implode("&", $keyValPair);   //substr($auth_sig, 0, -1);


            $url = 'https://up.flickr.com/services/upload/'; //maybe remove last /$this->safe_encode(
            $baseString = rawurlencode("POST") . '&' . rawurlencode($url) . '&' . rawurlencode($auth_sig) ;



            if (!empty($secret)) {

                $args["oauth_signature"] = $this->oauth_sign($baseString, $hmac_sha1_key);

                $oauth_header = $this->generate_auth_header($params);

                $result = $this->upload($args, $photoUrl, $oauth_header, $photoType);

                if( is_array($result) && isset($result['status']) && ($result['status'] == 'S_OK') && isset($result['photo_id']))
                {

                    $photo_url = $this->get_photo_url($result['photo_id'], $token, $access_secret, $secret);

                    if( is_array($photo_url) && isset($photo_url['status']) && ($photo_url['status'] == 'S_OK') && isset($photo_url['photo_url'])) {

                        $message = "Success";
                        /*return $this->set(array(
                            'message' => $message,
                            'succeeded' => true,
                            'photo_url' => $photo_url['photo_url'],
                            '_serialize' => array('succeeded','message', 'photo_url')
                        ));*/


                       /* return new CakeResponse(array('body' => json_encode(array(
                            'message' => $message,
                            'succeeded' => true,
                            'photo_url' => $photo_url['photo_url']
                        ))));*/

                       $this->set(array(
                            'message' => $message,
                            'succeeded' => true,
                            'photo_url' => $photo_url['photo_url'],
                            '_serialize' => array('succeeded','message', 'photo_url')
                        ));

                        //return;

                        $skip = true;


                    }
                        $message ="uploaded the image but was unsuccessful in retrieving the url";


                }
                else{
                    $message = "Message:  " . $result['message']  .  "  \r\n\n Error code:  " . $result['error_code'];

                }
            }
        }

        if(!isset($message))
            $message = "Error";

        if(!isset($skip))
            $this->set(array(
                'message' => $message,
                'succeeded' => false,
                '_serialize' => array('succeeded','message')
            ));

    }

    private function upload($args, $imagePath, $oauthHeader, $photoType){

        $authHeader = array("Authorization" => $oauthHeader);

        $args['photo'] = new CurlFile($imagePath, $photoType);
        $url = "https://up.flickr.com/services/upload/";
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $args);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
        curl_setopt($curl,CURLOPT_SSLVERSION,4);
        //curl_setopt($curl, CURLOPT_VERBOSE, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $authHeader);
        $respnse = curl_exec($curl);
        $headrs = curl_getinfo($curl);
        //$this->response = $response;
        curl_close($curl);
        $rsp = explode("\n", $respnse);
        $resultMsg = array();  //status, message, photo_url, error_code
        foreach ($rsp as $line) {
            if (preg_match('|<err code="([0-9]+)" msg="(.*)"|', $line, $match)) {

                $resultMsg['status'] = 'FAILED';
                $resultMsg['message'] = $match[2];
                $resultMsg['error_code'] = $match[1];
                return $resultMsg;

            } elseif (preg_match("|<photoid>(.*)</photoid>|", $line, $match)) {

                $resultMsg['status'] = 'S_OK';
                $resultMsg['message'] = false;
                $resultMsg['error_code'] = false;
                $resultMsg['photo_id'] = $match[1];
                return $resultMsg;
            }
        }
    }

    public function beforeFilter(){

        //list actions allow by unauthenticated user
        //and authenticated user based on role
        if (!$this->Auth->user()) {
            $this->Auth->authError = false;
            $this->Auth->deny();
        }
        else
            $this->Auth->allow();

    }

    public  function isAuthorized($user){


        return parent::isAuthorized($user);
    }

    private function safe_encode($data) {
        if (is_array($data)) {
            return array_map(array($this, 'safe_encode'), $data);
        } else if (is_scalar($data)) {
            return str_ireplace(
                array('+', '%7E'),
                array(' ', '~'),
                rawurlencode($data)
            );
        } else {
            return '';
        }
    }

    private function generate_params($oauth_token)
    {
        return array(
            'oauth_nonce' => md5(substr(microtime() . uniqid(), 0, 12)), //generate GUID
            'oauth_timestamp' => (string) time(),
            'oauth_version' => '1.0',
            'oauth_consumer_key' => Configure::read('Opauth.Strategy.Flickr')['key'], //oauth_consumer_keyrawurlencode
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_token' => $oauth_token //  oauth_auth_token oauth_token
        );
    }


    private function oauth_sign($data, $key) {//$this->safe_encoderawurlencode
        return
            base64_encode(
                hash_hmac(
                    'sha1', $data, $key, true
                ));
    }

    private function generate_auth_header($oauth_params) {


            uksort($oauth_params, 'strcmp');
            $encoded_quoted_pairs = array();
            foreach ($oauth_params as $k => $v) {
                $encoded_quoted_pairs[] = "{$k}=\"{$v}\"";
            }
            $header = 'OAuth ' . implode(', ', $encoded_quoted_pairs);


        return $header;
    }

    private function get_photo_url($photo_id, $token,$secret, $access_secret){

        App::import('Utility', 'Xml');

        $params = $this->generate_params($token); //****

        $args = array( "method"  => 'flickr.photos.getInfo', 'photo_id' => $photo_id);

        $args = array_merge($params, $args);

        if(isset($access_secret)){
            $args['secret'] = $access_secret;  //or access secret
        }

        ksort($args);
        $hmac_sha1_key =  "$secret&$access_secret";

        $keyValPair = array();

        foreach ($args as $key => $data) {
            if ( is_null($data) ) {
                unset($args[$key]);
            } else {
                array_push($keyValPair, rawurlencode($key) . "=" . rawurlencode($data));
            }
        }

        $auth_sig = implode("&", $keyValPair);

        $url = 'https://api.flickr.com/services/rest/';

        $baseString = rawurlencode("POST") . '&' . rawurlencode($url) . '&' . rawurlencode($auth_sig) ;

         $args["oauth_signature"] = $this->oauth_sign($baseString, $hmac_sha1_key);

        $oauth_header = $this->generate_auth_header($params);

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $args);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,false);
        curl_setopt($curl,CURLOPT_SSLVERSION,4);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Authorization" => $oauth_header));
        $respnse = curl_exec($curl);
        $headrs = curl_getinfo($curl);
        curl_close($curl);

        $xmlArray =Xml::toArray(Xml::build($respnse));
        $response = $xmlArray['rsp'];
        $status = strtolower($response['@stat']);
        $resultMsg = array();  //status, message, photo_url, error_code

        if($status == 'ok')
        {

            $photo = $response['photo'];

            //https://www.flickr.com/services/api/misc.urls.html
            $photo_url = 'https://farm'. $photo['@farm'] .'.staticflickr.com/'. $photo['@server'] .'/'. $photo['@id']  .'_'. $photo['@secret']  .'_z.jpg'; //[mstzb]

            $resultMsg['status'] = 'S_OK';
            $resultMsg['message'] = false;
            $resultMsg['error_code'] = false;
            $resultMsg['photo_url'] = $photo_url;
            return $resultMsg;
        }
        else{
            $resultMsg['status'] = 'FAILED';
            //$resultMsg['message'] = $match[2];
            //$resultMsg['error_code'] = $match[1];
            return $resultMsg;
        }
    }
}