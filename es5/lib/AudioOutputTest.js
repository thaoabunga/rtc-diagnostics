"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var constants_1 = require("./constants");
var errors_1 = require("./errors");
var polyfills_1 = require("./polyfills");
var optionValidation_1 = require("./utils/optionValidation");
/**
 * [[AudioOutputTest]] class that parses options and starts an audio output device
 * test.
 *
 * Please see [[testAudioOutputDevice]] for details and recommended practices.
 */
var AudioOutputTest = /** @class */ (function (_super) {
    __extends(AudioOutputTest, _super);
    /**
     * Sets up several things for the [[AudioOutputTest]] to run later in the
     * `_startTest` function.
     * @param options Optional settings to pass to the test.
     */
    function AudioOutputTest(options) {
        var _this = _super.call(this) || this;
        /**
         * Holds `AudioElement`s that are attached to the DOM to load and play audio.
         */
        _this._audio = [];
        /**
         * An `AudioContext` that is used to process the audio source.
         */
        _this._audioContext = null;
        /**
         * The default media devices when starting the test.
         */
        _this._defaultDevices = {};
        /**
         * A timestamp of when the test ends.
         */
        _this._endTime = null;
        /**
         * An array of errors encountered by the test during its run time.
         */
        _this._errors = [];
        /**
         * Volume values generated by the test over its run time.
         */
        _this._values = [];
        /**
         * Timeout created by `setTimeout`, used to loop the volume logic.
         */
        _this._volumeTimeout = null;
        _this._options = __assign(__assign({}, AudioOutputTest.defaultOptions), options);
        _this._startTime = Date.now();
        // We need to use a `setTimeout` here to prevent a race condition.
        // This allows event listeners to bind before the test starts.
        setTimeout(function () { return _this._startTest(); });
        return _this;
    }
    /**
     * Stops the test.
     */
    AudioOutputTest.prototype.stop = function () {
        if (this._endTime) {
            this._onWarning(new errors_1.AlreadyStoppedError());
            return;
        }
        // Clean up the test.
        this._cleanup();
        this._endTime = Date.now();
        var report = {
            deviceId: this._options.deviceId || (this._defaultDevices.audiooutput &&
                this._defaultDevices.audiooutput.deviceId),
            errors: this._errors,
            testName: AudioOutputTest.testName,
            testTiming: {
                duration: this._endTime - this._startTime,
                end: this._endTime,
                start: this._startTime,
            },
            testURI: this._options.testURI,
            values: this._values,
        };
        this.emit(AudioOutputTest.Events.End, report);
    };
    /**
     * Cleanup the test.
     */
    AudioOutputTest.prototype._cleanup = function () {
        if (this._volumeTimeout) {
            clearTimeout(this._volumeTimeout);
        }
        if (this._audioContext) {
            this._audioContext.close();
        }
        this._audio.forEach(function (audio) {
            audio.pause();
        });
    };
    /**
     * Error event handler. Adds the error to the internal list of errors that is
     * forwarded in the report.
     * @param error
     */
    AudioOutputTest.prototype._onError = function (error) {
        this._errors.push(error);
        this.emit(AudioOutputTest.Events.Error, error);
    };
    /**
     * Volume event handler, adds the value to the list `_values` and emits it
     * under the event `volume`.
     * @param volume
     */
    AudioOutputTest.prototype._onVolume = function (volume) {
        this._values.push(volume);
        this.emit(AudioOutputTest.Events.Volume, volume);
    };
    /**
     * Warning event handler.
     * @param warning
     */
    AudioOutputTest.prototype._onWarning = function (error) {
        if (this._options.debug) {
            // tslint:disable-next-line no-console
            console.warn(error);
        }
    };
    /**
     * Entry point of the test, called after setup in the constructor.
     * Emits the volume levels of the audio.
     *
     * @event [[AudioOutputTest.Events.Volume]]
     */
    AudioOutputTest.prototype._startTest = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var invalidReasons, setSinkIdSupported, devices, numberOutputDevices, sourceAudio_1, sourceNode, analyser_1, frequencyDataBytes_1, volumeEvent_1, destinationNode, destinationAudio, error_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, optionValidation_1.validateOptions(this._options, {
                                deviceId: optionValidation_1.validateDeviceId,
                                duration: optionValidation_1.validateTime,
                                volumeEventIntervalMs: optionValidation_1.validateTime,
                            })];
                    case 1:
                        invalidReasons = _c.sent();
                        if (invalidReasons) {
                            throw new errors_1.InvalidOptionsError(invalidReasons);
                        }
                        if (!this._options.audioElementFactory) {
                            throw polyfills_1.AudioUnsupportedError;
                        }
                        if (!this._options.audioContextFactory) {
                            throw polyfills_1.AudioContextUnsupportedError;
                        }
                        setSinkIdSupported = typeof this._options.audioElementFactory.prototype.setSinkId === 'function';
                        if (!setSinkIdSupported) return [3 /*break*/, 3];
                        if (!this._options.enumerateDevices) {
                            throw polyfills_1.EnumerateDevicesUnsupportedError;
                        }
                        return [4 /*yield*/, this._options.enumerateDevices()];
                    case 2:
                        devices = _c.sent();
                        numberOutputDevices = devices.filter(function (device) { return device.kind === 'audiooutput'; }).length;
                        if (numberOutputDevices === 0) {
                            throw new errors_1.DiagnosticError(undefined, 'No output devices found.');
                        }
                        this._defaultDevices = polyfills_1.getDefaultDevices(devices);
                        _c.label = 3;
                    case 3:
                        this._audioContext = new this._options.audioContextFactory();
                        sourceAudio_1 = new this._options.audioElementFactory(this._options.testURI);
                        sourceAudio_1.setAttribute('crossorigin', 'anonymous');
                        sourceAudio_1.loop = !!this._options.doLoop;
                        sourceNode = this._audioContext.createMediaElementSource(sourceAudio_1);
                        analyser_1 = this._audioContext.createAnalyser();
                        analyser_1.smoothingTimeConstant = 0.4;
                        analyser_1.fftSize = 64;
                        sourceNode.connect(analyser_1);
                        frequencyDataBytes_1 = new Uint8Array(analyser_1.frequencyBinCount);
                        volumeEvent_1 = function () {
                            if (_this._endTime) {
                                return;
                            }
                            analyser_1.getByteFrequencyData(frequencyDataBytes_1);
                            var volume = frequencyDataBytes_1.reduce(function (sum, val) { return sum + val; }, 0) / frequencyDataBytes_1.length;
                            _this._onVolume(volume);
                            // Check stop conditions
                            var isTimedOut = Date.now() - _this._startTime > _this._options.duration;
                            var stop = _this._options.doLoop
                                ? isTimedOut
                                : sourceAudio_1.ended || isTimedOut;
                            if (stop) {
                                _this.stop();
                            }
                            else {
                                _this._volumeTimeout = setTimeout(volumeEvent_1, _this._options.volumeEventIntervalMs);
                            }
                        };
                        if (!(this._options.deviceId && setSinkIdSupported)) return [3 /*break*/, 6];
                        destinationNode = this._audioContext.createMediaStreamDestination();
                        analyser_1.connect(destinationNode);
                        destinationAudio = new this._options.audioElementFactory();
                        destinationAudio.loop = !!this._options.doLoop;
                        destinationAudio.srcObject = destinationNode.stream;
                        return [4 /*yield*/, ((_b = (_a = destinationAudio).setSinkId) === null || _b === void 0 ? void 0 : _b.call(_a, this._options.deviceId))];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, destinationAudio.play()];
                    case 5:
                        _c.sent();
                        this._audio.push(destinationAudio);
                        return [3 /*break*/, 7];
                    case 6:
                        if (this._options.deviceId && !setSinkIdSupported) {
                            throw new errors_1.UnsupportedError('A `deviceId` was passed to the `AudioOutputTest` but `setSinkId` is ' +
                                'not supported in this browser.');
                        }
                        analyser_1.connect(this._audioContext.destination);
                        _c.label = 7;
                    case 7: return [4 /*yield*/, sourceAudio_1.play()];
                    case 8:
                        _c.sent();
                        this._audio.push(sourceAudio_1);
                        this._volumeTimeout = setTimeout(volumeEvent_1, this._options.volumeEventIntervalMs);
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _c.sent();
                        if (error_1 instanceof errors_1.DiagnosticError) {
                            this._onError(error_1);
                        }
                        else if (typeof DOMException !== 'undefined' && error_1 instanceof DOMException) {
                            this._onError(new errors_1.DiagnosticError(error_1, 'A DOMException has occurred.'));
                        }
                        else if (typeof DOMError !== 'undefined' && error_1 instanceof DOMError) {
                            this._onError(new errors_1.DiagnosticError(error_1, 'A DOMError has occurred.'));
                        }
                        else {
                            this._onError(new errors_1.DiagnosticError(undefined, 'Unknown error occurred.'));
                            this._onWarning(error_1);
                        }
                        this.stop();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * The name of the test.
     */
    AudioOutputTest.testName = 'audio-output-test';
    /**
     * Default options for the [[AudioOutputTest]]. Overwritten by any option passed
     * during the construction of the test.
     */
    AudioOutputTest.defaultOptions = {
        audioContextFactory: polyfills_1.AudioContext,
        audioElementFactory: polyfills_1.Audio,
        debug: false,
        doLoop: true,
        duration: Infinity,
        enumerateDevices: polyfills_1.enumerateDevices,
        testURI: constants_1.INCOMING_SOUND_URL,
        volumeEventIntervalMs: 100,
    };
    return AudioOutputTest;
}(events_1.EventEmitter));
exports.AudioOutputTest = AudioOutputTest;
(function (AudioOutputTest) {
    /**
     * Events that the [[AudioOutputTest]] will emit as it runs.
     * Please see [[AudioOutputTest.on]] for how to listen to these
     * events.
     */
    var Events;
    (function (Events) {
        Events["End"] = "end";
        Events["Error"] = "error";
        Events["Volume"] = "volume";
    })(Events = AudioOutputTest.Events || (AudioOutputTest.Events = {}));
})(AudioOutputTest = exports.AudioOutputTest || (exports.AudioOutputTest = {}));
exports.AudioOutputTest = AudioOutputTest;
/**
 * [[AudioOutputTest]] tests audio output capabilities. It serves to help diagnose
 * potential audio device issues that would prevent a user from being able to
 * hear audio.
 *
 * ---
 *
 * The [[AudioOutputTest]] class is an `EventEmitter` (please see [[AudioOutputTest.on]] for
 * events and their details) and helps to diagnose issues by playing a sound clip
 * (by default the sound clip is the ringing tone from the `twilio-client.js`
 * SDK) and emitting volume events of the sound clip as it plays.
 * ```ts
 * import { AudioOutputTest, testAudioOutputDevice } from '@twilio/rtc-diagnostics';
 * const options: AudioOutputTest.Options = { ... };
 * // `options` may be left `undefined` to use default option values
 * const audioOutputTest: AudioOutputTest = testAudioOutputDevice(options);
 * ```
 * The application can use the volume events to show in its UI that audio is
 * playing and that the end-user should be hearing something.
 * ```ts
 * audioOutputTest.on(AudioOutputTest.Events.Volume, (volume: number) => {
 *   ui.updateVolume(volume); // Update your UI with the volume value here.
 * });
 * ```
 *
 * The application should ask the end-user to confirm that the sound being played
 * can be heard. The application should call [[AudioOutputTest.stop]] with `true` if
 * the end-user hears the sound, and `false` if not.
 * ```ts
 * // If the user was able to hear the audio, the UI should indicate they should
 * // click this button...
 * const passButton = ...;
 * passButton.on('click', () => {
 *   audioOutputTest.stop();
 *   // display a confirmation dialog to the user
 * });
 *
 * // ...conversely, if they were not able to hear the audio, they should click
 * // this one.
 * const failButton = ...;
 * failButton.on('click', () => {
 *   audioOutputTest.stop();
 *   // display a warning to the user
 * });
 * ```
 * Caling [[AudioOutputTest.stop]] will immediately end the test.
 *
 * ---
 *
 * The [[AudioOutputTest]] object will always emit a [[AudioOutputTest.Report]] with
 * the [[AudioOutputTest.Events.End]] event, regardless of the occurence of errors
 * during the runtime of the test.
 *
 * Fatal errors will immediately end the test and emit a report such that the
 * value of [[AudioOutputTest.Report.errors]] will contain the fatal error.
 *
 * Non-fatal errors will not end the test, but will be included in the value of
 * [[AudioOutputTest.Report.errors]] upon completion of the test.
 *
 * If the data at `testURI` is unable to be loaded, meaning the error event is
 * raised on the audio element, a fatal error has occurred.
 *
 * If `doLoop` is set to `false`, then the test will run for either the option
 * `duration`, or the full duration of the audio file, which ever is shorter.
 * If `doLoop` is set to `true`, it will only run as long as the `duration`
 * option.
 *
 * ---
 *
 * The function [[testAudioOutputDevice]] serves as factory function that accepts
 * [[AudioOutputTest.Options]] as its only parameter and will instantiate an
 * [[AudioOutputTest]] object with those options.
 * ```ts
 * import { AudioOutputTest, testAudioOutputDevice } from '@twilio/rtc-diagnostics';
 * const options: AudioOutputTest.Options = { ... };
 * const audioOutputTest: AudioOutputTest = testAudioOutputDevice(options);
 * ```
 * @param options Options to pass to the [[AudioOutputTest]] constructor.
 */
function testAudioOutputDevice(options) {
    return new AudioOutputTest(options);
}
exports.testAudioOutputDevice = testAudioOutputDevice;
//# sourceMappingURL=AudioOutputTest.js.map