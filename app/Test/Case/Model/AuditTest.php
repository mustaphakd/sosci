<?php
App::uses('Audit', 'Model');

/**
 * Audit Test Case
 *
 */
class AuditTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.audit',
		'app.user',
		'app.victim'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Audit = ClassRegistry::init('Audit');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Audit);

		parent::tearDown();
	}

}
