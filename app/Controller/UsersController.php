<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 3/28/2015
 * Time: 12:21 PM
 */

/*
 *
 *
 * * @property Audit $Audit
 * @property Victim $Victim
 * @property User $User
 */

App::uses('AppController', 'Controller');
class UsersController extends AppController
{
    public $uses = array("User","Audit", "Victim");
    public $components = array("Cookie", 'RequestHandler');

    public function add(){
        $test = $this;
    }

    public function delete($id){

        $success = false;
        if($this->request->is("post")){
            $this->User->id = $id;

            if($this->User->exist())
            {
                if($this->User->delete()){
                    $message = "user id: " . $id ." deleted";
                    $success = true;
                }
            }
            else{
                $message = "user id: " . $id ." does not exist";
            }
        }

        $this->set(array(
            'message' => $message,
            'id' => $id,
            'success' => $success,
            '_serialize' => array('message', 'id', 'success')
        ));
    }

    //manual log in
    public function login(){
        if($this->request->is('post')){
            if($this->Auth->login()){
               return $this->redirect($this->Auth->loginRedirect());
            }
            $this->Session->setFlash("Unable to log in");
        }
    }

    //manual log off
    public function logoff(){

        //handle ajax too
        $this->Session->write('forceLogout', true);

        //notidfy audits
        $_data = array("logoff" => date('Y-m-d H:i:s') );

        $this->Audit->read(array("logoff"),  $this->Session->read('session_audits'));
        $this->Audit->set($_data);
        unset($this->Audit->validate["id"]);
        $this->Audit->save();
        $this->Session->delete('session_audits');
        //$this->Session->write('session_audits', $this->Audit->id);

        if(isset($_COOKIE['boucle']) && !empty($_COOKIE['boucle'])){
            unset($_COOKIE['boucle']);
        }
        $this->redirect($this->Auth->logout());
    }

    public function opauth_complete()
    {

        $validAnyway = false;
        if(isset($_COOKIE['boucle']) && !empty($_COOKIE['boucle'])){
            $_SESSION['Auth'] = unserialize($_COOKIE['boucle']);
            $validAnyway = true;
            unset($_COOKIE['boucle']);
            if(isset($_COOKIE['havalidated']) && !empty($_COOKIE['havalidated'])){
                $this->request->data['validated'] = true;
                unset($_COOKIE['havalidated']);
            }
        }

        if($this->data['validated'] == false && !$validAnyway)
        {
            $this->user_info = array(
                'validated' => false
            );

            $this->set("user_data", $this->user_info);
            return;
        }


        $provider = strtolower($this->data["auth"]['provider']) ;

        switch($provider){
            case "google":
                $this->_process_google_user($this->data['auth']['info']);
                break;
            case "live":
                $this->_process_microsoft_user($this->data['auth']['info']);
                break;
            case "twitter":
                $this->_process_twitter_user($this->data['auth']['info']);
                break;
            case "yahoo":
                $this->_process_yahoo_user($this->data['auth']['info']);
                break;
            case "facebook":
                $this->_process_facebook_user($this->data['auth']['info']);
                break;
            case "linkedin":
                $this->_process_linkedin_user($this->data['auth']['info']);
                break;
            case "flickr":
                $this->_process_flickr_user($this->data['auth']['info']);
                break;
            default:
                break;
        }
    }

    function _check_user($email){
        $this->User->recursive = -1;
        $loginUser = $this->User->find('first',
            array(
                    'fields'=>array('User.name', 'User.id', 'User.role'),
                    'conditions'=>array( 'User.email'=> $email),
                    'contain' => false
            )
        );

        return $loginUser["User"];
    }

    function _add_new_user($user_name, $user_email, $ipAddr, $role){
        $test = $this->alias;
        $this->request->data['User'] = array(
            'name' => $user_name,
            'email' => $user_email,
            'ip_address' => $ipAddr,
            'role' => $role,
            'registration_date' => date('Y-m-d H:i:s')
        );

        if(isset($this->data['User']['password']))
            unset($this->request->data['User']['password']);

        if($this->User->save($this->data['User']))
        {
            $this->request->data['User']['id'] = $this->User->id;
            return $this->data['User'];
        }

        return null;
    }

    public function _login_user($email, $pwd, $isOauth, $usrInfo){
        if($isOauth){
            $this->Auth->login(array('email'=> $email, 'id' => $usrInfo['id'], 'role' => $usrInfo['role']));
            $this->_audit_user_actions($usrInfo['id']);
        }
    }

    function _process_google_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);

    }

    function _process_microsoft_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);
    }

    function _process_twitter_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);
    }

    function _process_yahoo_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);
    }

    function _process_facebook_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);
    }

    function _process_linkedin_user($user_info){
        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);
    }

    function _process_flickr_user($user_info){

        if(ISSET($_COOKIE["uploading"]) && $_COOKIE['uploading'] == "image")
        {
            // make sure to pass down api key

           // $session = unserialize($_COOKIE['_opauth_flickr']);
            $nicekey = Configure::read('Opauth.Strategy.Flickr');

            $this->user_info = array(
                'uploadOnly' => true,
                'postUrl' => 'https://up.flickr.com/services/upload/',
                'validated' => true,
                'name' => $user_info['nickname'],
                'image' => isset($user_info['image'])? $user_info['image']  : "",
                'token' => $user_info["oauthToken"],
                'secret' => $user_info['oauthTokenSecret'],
                'api_key' => $nicekey['key']
            );

            $this->set("user_data", $this->user_info);

        }
        else{


        $ipAddr = $_SERVER['REMOTE_ADDR'];

        $exist = $this->_check_user($user_info['email']);

        if(empty($exist))
        {
            //name, email, ipAddr, default role
            //roles: user, officer, dev, admin
            $exist = $this->_add_new_user($user_info['name'], $user_info['email'], $ipAddr, "user");
            //$exist['role'] = 'user';
        }


        if(!empty($exist))
            $this->_login_user($user_info['email'], null, true, $exist);

        $this->user_info = array(
            'name' => $user_info['name'],
            'email' => $user_info['email'],
            'image' => $user_info['image'],
            'validated' => true
        );

        $this->set("user_data", $this->user_info);

        }
    }

    public function _audit_user_actions($userId){
        $audit = array(
            'user_id' => $userId,
            'ipaddress' => $_SERVER['REMOTE_ADDR'],
            'login' => date('Y-m-d H:i:s')
        );

        $this->Audit->save($audit);
        $this->Session->write('session_audits', $this->Audit->id);
    }

    public function still_logged_in(){



        if($this->Auth->user()){
            $message = "User still logged in.";
            $status = "Success";
            $loggedIn = true;
        }
        else{
            $message = "User logged off.";
            $status = "Success";
            $loggedIn = false;
        }


        $this->set(array(
            'status' => $status ,
            'message' => $message,
            'loggedin' => $loggedIn,
            '_serialize' => array('message', 'status', 'loggedin')
        ));
    }



    public function beforeFilter(){

        //list actions allow by unauthenticated user
        //and authenticated user based on role
        $this->Auth->allow();

    }

    public  function isAuthorized($user){


        return parent::isAuthorized($user);
    }
}