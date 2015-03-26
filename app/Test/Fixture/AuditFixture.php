<?php
/**
 * AuditFixture
 *
 */
class AuditFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'binary', 'null' => false, 'default' => null, 'length' => 36, 'key' => 'primary'),
		'user_id' => array('type' => 'binary', 'null' => false, 'default' => null, 'length' => 36),
		'ipaddress' => array('type' => 'string', 'null' => false, 'default' => null, 'length' => 30, 'collate' => 'latin1_swedish_ci', 'charset' => 'latin1'),
		'login' => array('type' => 'datetime', 'null' => false, 'default' => 'CURRENT_TIMESTAMP'),
		'logoff' => array('type' => 'datetime', 'null' => false, 'default' => null),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1),
			'unique_id' => array('column' => 'id', 'unique' => 1)
		),
		'tableParameters' => array('charset' => 'latin1', 'collate' => 'latin1_swedish_ci', 'engine' => 'InnoDB')
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => '55135dfc-2dd8-4bea-af3c-1fd47b1f0d47',
			'user_id' => 'Lorem ipsum dolor sit amet',
			'ipaddress' => 'Lorem ipsum dolor sit amet',
			'login' => '2015-03-26 02:16:44',
			'logoff' => '2015-03-26 02:16:44'
		),
	);

}
