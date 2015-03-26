<?php
App::uses('AppModel', 'Model');
/**
 * Victim Model
 *
 * @property User $User
 */
class Victim extends AppModel {

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
		'user_id' => array(
			'notEmpty' => array(
				'rule' => array('notEmpty'))
		),
		'name' => array(
			'maxLength' => array(
				'rule' => array('maxLength', 150))
		),
		'crimetype' => array(
			'notEmpty' => array(
				'rule' => array('notEmpty'))
		),
		'picurl' => array(
			'maxLength' => array(
				'rule' => array('maxLength', 255))
		),
		'detail' => array(
			'notEmpty' => array(
				'rule' => array('notEmpty'))
		),
		'locationlat' => array(
			'notEmpty' => array(
				'rule' => array('notEmpty'))
		),
		'locationlng' => array(
			'notEmpty' => array(
				'rule' => array('notEmpty'))
		),
		'agegroup' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		),
		'occurenceplace' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		),
		'casestatus' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		),
		'created' => array(
			'datetime' => array(
				'rule' => array('datetime'))
		),
		'modified' => array(
			'datetime' => array(
				'rule' => array('datetime'))
		),
		'requestipaddress' => array(
			'ip' => array(
				'rule' => array('ip'))
		),
		'validitystatus' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		)
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * belongsTo associations
 *
 * @var array
 */
	public $belongsTo = array(
		'User' => array(
			'className' => 'User',
			'foreignKey' => 'user_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);
}
