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
		'crimetype' => array(  //1->kidnap, 2->murder
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

        /*
         * value="1">Enfant</option>
                                   <option value="2">Teen(12-18 ans)</option>
                                   <option value="4">Jeune Adult(19 - 25 ans)</option>
                                   <option value="8">Adult(26 - 45 ans)</option>
                                   <option value="16">Middle aged(46 - 69 ans)</option>
                                   <option value="32">Old(70+)</option>
         * */
		'agegroup' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		),

        /*
         * <option value="1">Club</option>
                                  <option value="2">Ecole</option>
                                  <option value="4">Marche</option>
                                  <option value="8">Rue</option>
                                  <option value="16">Taxi</option>
                                  <option value="32">Maison</option>
                                  <option value="64">other</option>
         * */
		'occurenceplace' => array(
			'numeric' => array(
				'rule' => array('numeric'))
		),
		'casestatus' => array(  //1open, 2pending, 16close, 4unresolved, 8unknown
			'numeric' => array(
				'rule' => array('numeric'))
		),

        /*'datetime' => array(
            'rule' => array('datetime'))*/
		'created' => array(
		),
        'occurrencedate' => array(
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
        'gender' => array( // values are 1-male  and 2-female

        ),
		'validitystatus' => array(  // 1-> valid, 3-> false alarm,  5-> not valid, 7-> not validated
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
