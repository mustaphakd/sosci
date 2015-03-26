<?php
App::uses('AppModel', 'Model');
/**
 * Audit Model
 *
 * @property User $User
 */
class Audit extends AppModel {

/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'id';

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
		'ipaddress' => array(
			'ip' => array(
				'rule' => array('ip'))
		),
		'login' => array(
			'datetime' => array(
				'rule' => array('datetime'))
		),
		'logoff' => array(
			'datetime' => array(
				'rule' => array('datetime'))
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
