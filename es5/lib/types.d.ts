/**
 * @internalapi
 */
export interface AudioElement extends HTMLAudioElement {
    setSinkId?: (sinkId: string) => Promise<void>;
    sinkId?: string;
}
/**
 * @internalapi
 * Timing measurements that provides operational milestones.
 */
export interface TimeMeasurement {
    /**
     * Number in milliseconds elapsed for this measurement.
     */
    duration?: number;
    /**
     * A millisecond timestamp that represents the end of a process.
     */
    end?: number;
    /**
     * A millisecond timestamp that represents the start of a process.
     */
    start: number;
}
/**
 * Helper type that allows us to mark a subset of an interface's keys as
 * required.
 * @internalapi
 */
export declare type SubsetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * @internalapi
 * Volume statistics to track in the audio device tests.
 */
export interface VolumeStats {
    /**
     * The maximum volume value recorded during the test.
     */
    max?: number;
    /**
     * The smallest non-zero volume value encountered.
     */
    min?: number;
    /**
     * The timestamps of the recorded values. For example, the 0th indexed
     * timestamp correlates to when the 0th indexed volume value was recorded.
     */
    timestamps: number[];
    /**
     * The recorded volume values encountered during the test.
     */
    values: number[];
}
/**
 * Native MediaStream Recording APIs definitions
 * @private
 */
export declare namespace MediaStreamRecorder {
    type AudioData = any;
    interface DataEvent {
        data: AudioData;
    }
    interface MediaRecorder {
        ondataavailable: Function;
        onstop: Function;
        start: Function;
        stop: Function;
    }
}
/**
 * Description of a video resolution.
 * @internalapi
 */
export interface VideoResolution {
    height: number;
    width: number;
}