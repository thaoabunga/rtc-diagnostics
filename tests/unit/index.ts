/**
 * The following rule is necessary as having `BitrateTest` imported first causes
 * unit tests to crash.
 */
/* tslint:disable ordered-imports */

// Set up global mocks first.
import './mock.ts';

// Utils
import './utils/candidate';
import './utils/optionValidation';
import './utils/waitForPromise';

// Recorder
import './recorder/audio';
import './recorder/encoder';

// Diagnostics tests
import './InputTest';
import './OutputTest';
import './BitrateTest';