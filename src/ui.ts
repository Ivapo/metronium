import { Metronome } from "./metronome.ts";

export function initUI(metronome: Metronome): void {
  const bpmValue = document.getElementById("bpm-value")!;
  const bpmSlider = document.getElementById("bpm-slider") as HTMLInputElement;
  const bpmDown = document.getElementById("bpm-down")!;
  const bpmUp = document.getElementById("bpm-up")!;
  const startStop = document.getElementById("start-stop")!;
  const beatContainer = document.getElementById("beat-indicators")!;
  const beatsDisplay = document.getElementById("ts-numerator")!;
  const tsDown = document.getElementById("ts-down")!;
  const tsUp = document.getElementById("ts-up")!;
  const subdivDisplay = document.getElementById("subdiv-display")!;
  const subdivDown = document.getElementById("subdiv-down")!;
  const subdivUp = document.getElementById("subdiv-up")!;
  const volumeSlider = document.getElementById("volume-slider") as HTMLInputElement;

  function updateSubdivDisplay(): void {
    subdivDisplay.textContent = String(metronome.subdivisions);
  }

  function updateBpmDisplay(): void {
    bpmValue.textContent = String(metronome.bpm);
    bpmSlider.value = String(metronome.bpm);
    // BPM change may have clamped subdivisions
    updateSubdivDisplay();
  }

  function renderBeatIndicators(): void {
    beatContainer.innerHTML = "";
    for (let i = 0; i < metronome.beatsPerMeasure; i++) {
      const dot = document.createElement("div");
      dot.className = "beat-dot";
      if (i === 0) dot.classList.add("accent");
      dot.dataset["index"] = String(i);
      beatContainer.appendChild(dot);
    }
  }

  function highlightBeat(index: number): void {
    const dots = beatContainer.querySelectorAll(".beat-dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index]?.classList.add("active");
  }

  // BPM slider
  bpmSlider.addEventListener("input", () => {
    metronome.bpm = Number(bpmSlider.value);
    updateBpmDisplay();
  });

  // +/- buttons
  bpmDown.addEventListener("click", () => {
    metronome.bpm = metronome.bpm - 1;
    updateBpmDisplay();
  });

  bpmUp.addEventListener("click", () => {
    metronome.bpm = metronome.bpm + 1;
    updateBpmDisplay();
  });

  // Time signature +/- buttons
  function updateTimeSig(): void {
    beatsDisplay.textContent = String(metronome.beatsPerMeasure);
    renderBeatIndicators();
  }

  tsDown.addEventListener("click", () => {
    if (metronome.beatsPerMeasure > 1) {
      metronome.beatsPerMeasure = metronome.beatsPerMeasure - 1;
      updateTimeSig();
    }
  });

  tsUp.addEventListener("click", () => {
    if (metronome.beatsPerMeasure < 12) {
      metronome.beatsPerMeasure = metronome.beatsPerMeasure + 1;
      updateTimeSig();
    }
  });

  // Subdivision +/- buttons
  subdivDown.addEventListener("click", () => {
    if (metronome.subdivisions > 1) {
      metronome.subdivisions = metronome.subdivisions - 1;
      updateSubdivDisplay();
    }
  });

  subdivUp.addEventListener("click", () => {
    metronome.subdivisions = metronome.subdivisions + 1;
    updateSubdivDisplay();
  });

  // Volume slider
  volumeSlider.addEventListener("input", () => {
    metronome.volume = Number(volumeSlider.value) / 100;
  });

  // Start/Stop
  startStop.addEventListener("click", () => {
    metronome.toggle();
    startStop.textContent = metronome.isPlaying ? "Stop" : "Start";
    startStop.classList.toggle("playing", metronome.isPlaying);
    if (!metronome.isPlaying) {
      beatContainer
        .querySelectorAll(".beat-dot")
        .forEach((dot) => dot.classList.remove("active"));
    }
  });

  // Beat callback
  metronome.setOnBeat((beat) => {
    highlightBeat(beat);
  });

  // Keyboard shortcut: Space to toggle
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      startStop.click();
    }
  });

  // Init
  renderBeatIndicators();
  updateBpmDisplay();
}
