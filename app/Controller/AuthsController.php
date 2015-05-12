<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 4/3/2015
 * Time: 12:28 AM
 */

class AuthsController extends AppController{
    public $components = array('RequestHandler', 'Cookie');

    public function isStillLloggedIn(){
        $loggedIn = false;
        $message = " not Logged in";
        if($this->Auth->user()){
            $loggedIn = true;
            $message = "user is logged in.";
        }


        $this->set(array(
            'message' => $message,
            'succeeded' => false,
            'loggedIn' => $loggedIn,
            '_serialize' => array('succeeded','message', 'loggedIn')
        ));

    }


    public function beforeFilter(){
            $this->Auth->allow();
    }

    public  function isAuthorized($user){
        return parent::isAuthorized($user);
    }
}