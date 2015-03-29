<?php
App::uses('AppModel', 'Model');
/**
 * User Model
 *
 * @property Audit $Audit
 * @property Victim $Victim
 */
class User extends AppModel {

/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'name';

/**
 * Validation rules
 *
 * @var array
 */
	public $validate = array(
		'id' => array(
			'uuid' => array(
				'rule' => array('uuid'))
		),
		'email' => array(
			'email' => array(
				'rule' => array('email'))
		),
		'name' => array(
			'maxLength' => array(
				'rule' => array('maxLength', 150))
		),
		'ip_address' => array(
			'ip' => array(
				'rule' => array('ip'))
		),
		'registration_date' => array(
			'datetime' => array(
				'rule' => array('datetime'))
		),
		'password' => "",
		'role' => array(
            'maxLength' => array(
                'rule' => array('maxLength', 100))
		)
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * hasMany associations
 *
 * @var array
 */
	public $hasMany = array(
		'Audit' => array(
			'className' => 'Audit',
			'foreignKey' => 'user_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		),
		'Victim' => array(
			'className' => 'Victim',
			'foreignKey' => 'user_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);


    public function beforeSave($options = array()){
        if(isset($this->data[$this->alias]['password'])){
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data[$this->alias]['password'] = $passwordHasher->hash($this->data[$this->alias]['password']);
        }
        return true;
    }
}
