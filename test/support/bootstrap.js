/**
 * External dependencies.
 */

var chai = require('chai');

/**
 * Register `should`.
 */

global.should = chai.should();

/**
 * Do not show diffs.
 */

chai.Assertion.showDiff = false;

/**
 * Include stack traces.
 */

chai.Assertion.includeStack = true;
