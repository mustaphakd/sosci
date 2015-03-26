<?php
App::uses('Victim', 'Model');

/**
 * Victim Test Case
 *
 */
class VictimTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.victim',
		'app.user',
		'app.audit'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Victim = ClassRegistry::init('Victim');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Victim);

		parent::tearDown();
	}

}
