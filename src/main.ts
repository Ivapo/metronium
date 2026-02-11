import { Metronome } from "./metronome.ts";
import { initUI } from "./ui.ts";

const metronome = new Metronome();
initUI(metronome);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/metronium/sw.js");
}
