// Lookahead scheduler metronome using Web Audio API.
// Schedules oscillator beeps ahead of time on the audio thread
// while using setInterval on the main thread only as a scheduling pump.

const SCHEDULE_AHEAD_TIME = 0.1; // seconds to look ahead
const SCHEDULER_INTERVAL = 25; // ms between scheduler calls
const MAX_CLICKS_PER_MINUTE = 800;

export type BeatCallback = (beatIndex: number) => void;

export class Metronome {
  private audioCtx: AudioContext | null = null;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private _isPlaying = false;
  private _bpm = 120;
  private _beatsPerMeasure = 4;
  private _subdivisions = 1;
  private _volume = 0.8;
  private currentSubdiv = 0;
  private onBeat: BeatCallback | null = null;

  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = Math.min(400, Math.max(20, value));
    // Clamp subdivisions if new BPM makes current value too high
    if (this._subdivisions > this.maxSubdivisions) {
      this._subdivisions = this.maxSubdivisions;
    }
  }

  get beatsPerMeasure(): number {
    return this._beatsPerMeasure;
  }

  set beatsPerMeasure(value: number) {
    this._beatsPerMeasure = value;
  }

  get subdivisions(): number {
    return this._subdivisions;
  }

  get maxSubdivisions(): number {
    return Math.max(1, Math.floor(MAX_CLICKS_PER_MINUTE / this._bpm));
  }

  set subdivisions(value: number) {
    this._subdivisions = Math.min(this.maxSubdivisions, Math.max(1, value));
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = Math.min(1, Math.max(0, value));
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  setOnBeat(cb: BeatCallback): void {
    this.onBeat = cb;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private scheduleNote(time: number, beat: number, isSubdiv: boolean): void {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isSubdiv) {
      osc.frequency.value = 600;
      gain.gain.value = 0.25 * this._volume;
    } else {
      const isAccent = beat === 0;
      osc.frequency.value = isAccent ? 1000 : 800;
      gain.gain.value = (isAccent ? 1.0 : 0.5) * this._volume;
    }

    osc.start(time);
    osc.stop(time + 0.05);

    // Fire the beat callback on main beats only.
    if (!isSubdiv) {
      const delay = (time - ctx.currentTime) * 1000;
      if (delay > 0) {
        setTimeout(() => this.onBeat?.(beat), delay);
      } else {
        this.onBeat?.(beat);
      }
    }
  }

  private scheduler(): void {
    const ctx = this.getAudioContext();
    const secondsPerBeat = 60.0 / this._bpm;
    const subdivInterval = secondsPerBeat / this._subdivisions;

    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
      const isSubdiv = this.currentSubdiv > 0;
      this.scheduleNote(this.nextNoteTime, this.currentBeat, isSubdiv);

      this.currentSubdiv++;
      if (this.currentSubdiv >= this._subdivisions) {
        this.currentSubdiv = 0;
        this.currentBeat = (this.currentBeat + 1) % this._beatsPerMeasure;
      }

      this.nextNoteTime += subdivInterval;
    }
  }

  start(): void {
    if (this._isPlaying) return;

    const ctx = this.getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    this._isPlaying = true;
    this.currentBeat = 0;
    this.currentSubdiv = 0;
    this.nextNoteTime = ctx.currentTime;
    this.scheduler();
    this.schedulerTimer = setInterval(() => this.scheduler(), SCHEDULER_INTERVAL);
  }

  stop(): void {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  toggle(): void {
    if (this._isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }
}
