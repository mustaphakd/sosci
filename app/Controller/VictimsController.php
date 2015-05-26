<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 4/19/2015
 * Time: 4:23 PM
 */


App::uses('AppController', 'Controller');
class VictimsController extends AppController
{
    public $uses = array("User", "Victim");
    public $components = array("Cookie", 'RequestHandler', 'Paginator');

    public function add(){

        if($this->request->is('post'))
        {

            $this->request->data['user_id'] = $this->Auth->user('id');
            $this->request->data['requestipaddress'] = $this->request->clientIp();
            $this->request->data['validitystatus'] = 7;

            if(null != ($this->data["occurrencedate"])) //this name and "occurrencedate" are not the same
            {
                $date = new DateTime($this->data["occurrencedate"]);
                $this->request->data["occurrencedate"] = $date->format('Y-m-d H:i:s') ;
            }

            /*
             *
             * validitystatus
             * modified
             * created
             *
             * */
            $this->Victim->create();
            $this->Victim->set($this->data);
            //unset($this->Model->validate['id']);
            //unset($this->validate['id']);




            $date = new DateTime();
            $this->Victim->set("created",$date->format('Y-m-d H:i:s'));


            if($this->Victim->save())//array('validate' => false)
            {
                $newId = $this->Victim->id;
                //$this->Country->read(array('Country.name', 'Country.geometry'), $newId);
                if($newId)
                {
                    //Cache::write('victims_latest', false, 'short');
                }


                $message = "Success \r\n\n Victim saved.";
                $this->set(array(
                    'status' => "Success",
                    'message' =>  $message,
                    'id' => $newId,
                    '_serialize' => array('message', 'status', 'id')
                ));
                return;
            }
            else
            {
                $message = "the victim information could not be saved " . implode($this->Victim->validationErrors);
                $this->set(array(
                    'status' => 'Error' ,
                    'message' => $message,
                    '_serialize' => array('message', 'status')
                ));
                return;
            }
        }
        $message = "Error. \r\n\n post method required to submit form";
        $this->set(array(
            'status' => 'Error' ,
            'message' => $message,
            '_serialize' => array('message', 'status')
        ));

    }

    public function get(){

        $pageNum = 1;

        if(isset($this->request->query["page"]) && is_numeric($this->request->query["page"]))
            $pageNum = (int)$this->request->query["page"];

        $this->Victim->recursive = -1;

            $this->paginate = array(
                'limit' => 7,
                'order' => array('created' => 'desc'),
                'fields'=>array('Victim.name', 'Victim.id', 'Victim.agegroup',
                    'Victim.occurrencedate', 'Victim.occurenceplace', 'Victim.casestatus',
                    'Victim.gender','Victim.locationlat', 'Victim.locationlng', 'Victim.picurl' ),
                'conditions'=>array( 'Victim.validitystatus !=' => 5),
                'contain' => false,
                'page' => $pageNum
            );



        $victims = $this->paginate('Victim');

        $this->set(array(
            "status" => "success",
            "victims" => $victims,
            "page" => array(
                "current"=> $this->request->params['paging']['Victim']["page"],
                "pageCount" => $this->request->params['paging']['Victim']["pageCount"],
                "pageSize" => $this->request->params['paging']['Victim']["limit"]
                ),
            "message" => "",
            "_serialize" => array("message", "victims", "status", "page")
        ));
    }

    public function detail($id){

        //$id = $id ?? $_GET["id"];

        $this->Victim->recursive = -1;
        $victim = $this->Victim->find('first',
            array(
                'fields'=>array('Victim.detail', 'Victim.crimetype'
                ),
                'conditions'=>array( 'Victim.id' => $id),
                'contain' => false
            )
        );
        $victim = $victim['Victim'];

        $this->set(array(
            "status" => "success",
            "victim" => $victim,
            "message" => "no error",
            "_serialize" => array("message", "victim", "status")
        ));
    }

    public function pics(){

        $pageNum = 1;

        if(isset($this->request->query["page"]) && is_numeric($this->request->query["page"]))
            $pageNum = (int)$this->request->query["page"];

        $this->Victim->recursive = -1;

        $this->paginate =  array(
                'fields'=>array('Victim.name', 'Victim.id', 'Victim.agegroup',
                    'Victim.occurrencedate', 'Victim.occurenceplace', 'Victim.picurl', 'Victim.gender' ),
                'conditions'=>array( 'Victim.validitystatus !=' => 5),
                'contain' => false,
                'limit' => 14,
                'order' => array('created' => 'desc'),
                'page' => $pageNum
            );

        $victims = $this->paginate('Victim');

        $this->set(array(
            "status" => "success",
            "message" => "",
            "victims" => $victims,
            "page" => array(
                "current"=> $this->request->params['paging']['Victim']["page"],
                "pageCount" => $this->request->params['paging']['Victim']["pageCount"],
                "pageSize" => $this->request->params['paging']['Victim']["limit"]
            ),
            "_serialize" => array("message", "victims", "status", "page")
        ));
    }

    public function vizData($year){

        //$id = $id ?? $_GET["id"];

        $this->Victim->recursive = -1;
        $victim = $this->Victim->find('all',
            array(
                'fields'=>array('Victim.gender', 'Victim.agegroup', 'Victim.occurenceplace', 'Victim.occurrencedate'
                ),
                'conditions'=>array( 'YEAR(Victim.occurrencedate) ' => $year),
                'contain' => false
            )
        );


        $this->set(array(
            "status" => "success",
            "victims" => $victim,
            "message" => "no error",
            "_serialize" => array("message", "victims", "status")
        ));
    }

    public function availableYears(){
        $years = array();
        $condition = array(
            'fields' => array('DISTINCT YEAR( Victim.occurrencedate ) AS av_date'),
            'order' =>array('av_date')

        );
        $result = $this->Victim->find('all',
            $condition
        );

        foreach ($result as &$val){
            array_push($years, $val[0]['av_date']);
        }

        $this->set(array(
            "status" => "success",
            "years" => $years,
            "message" => "no error",
            "_serialize" => array("message", "years", "status")
        ));
    }

    public function get_user_contributions(){

        $loggedInUserId = $this->Auth ? $this->Auth->user("id") : null;

        $victims = null;
        $status = "Error";
        $message = "user is neither logged in or has not contributed any information as of yet";


        if($loggedInUserId !== null)
        {
            $status = "success";
            $message = "no Error";

            $this->Victim->recursive = -1;

            $victims = $this->Victim->find("all",
                array(
                    'order' => array('created' => 'desc'),
                    'fields'=>array('Victim.name', 'Victim.id', 'Victim.agegroup','Victim.detail', 'Victim.crimetype',
                        'Victim.occurrencedate', 'Victim.occurenceplace', 'Victim.casestatus',
                        'Victim.gender','Victim.locationlat', 'Victim.locationlng', 'Victim.picurl' ),
                    'conditions'=>array( 'Victim.user_id' => $loggedInUserId),
                    'contain' => false
                )
            );

        }


        $this->set(array(
            "status" => $status,
            "victims" => $victims,
            "message" => $message,
            "_serialize" => array("message", "victims", "status")
        ));

    }

    public function update_victim_info(){

        if($this->request->is('post'))
        {

            $this->request->data['user_id'] = $this->Auth->user('id');

            if(null != ($this->data["occurrencedate"])) //this name and "occurrencedate" are not the same
            {
                $date = new DateTime($this->data["occurrencedate"]);
                $this->request->data["occurrencedate"] = $date->format('Y-m-d H:i:s') ;
            }

            /*
             *
             * validitystatus
             * modified
             * created
             *
             * */
            //$this->Victim->create();
            $this->Victim->set($this->data);




            $date = new DateTime();
            $this->Victim->set("modified",$date->format('Y-m-d H:i:s'));


            if($this->Victim->save())//array('validate' => false)
            {
                $newId = $this->Victim->id;
                //$this->Country->read(array('Country.name', 'Country.geometry'), $newId);
                if($newId)
                {
                    //Cache::write('victims_latest', false, 'short');
                }


                $message = "Success \r\n\n Victim saved.";
                $this->set(array(
                    'status' => "Success",
                    'message' =>  $message,
                    'id' => $newId,
                    '_serialize' => array('message', 'status', 'id')
                ));
                return;
            }
            else
            {
                $message = "the victim information could not be saved " . implode($this->Victim->validationErrors);
                $this->set(array(
                    'status' => 'Error' ,
                    'message' => $message,
                    '_serialize' => array('message', 'status')
                ));
                return;
            }
        }
        $message = "Error. \r\n\n post method required to submit form";
        $this->set(array(
            'status' => 'Error' ,
            'message' => $message,
            '_serialize' => array('message', 'status')
        ));
    }


    public function beforeFilter(){

        //list actions allow by unauthenticated user
        //and authenticated user based on role
        if($this->request->params['action'] == 'add' ||
            $this->request->params['action'] == 'get_user_contributions' ||
            $this->request->params['action'] == 'update_victim_info'
        )
        {
            if (!$this->Auth->user()) {
                $this->Auth->authError = false;
                return $this->Auth->deny();
            }
        }
            $this->Auth->allow();

    }

    public  function isAuthorized($user){


        return parent::isAuthorized($user);
    }
}