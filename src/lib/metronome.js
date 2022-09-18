export default function NewMetronome(t = 120, b = 4) {
    let audioContext = null;
    let notesInQueue = [];         // notes that have been put into the web audio and may or may not have been played yet {note, time}
    let currentBeatInBar = 0;
    let beatsPerBar = b;
    let tempo = t;
    let lookahead = 25;          // How frequently to call scheduling function (in milliseconds)
    let scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
    let nextNoteTime = 0.0;     // when the next note is due
    let isRunning = false;
    let intervalID = null;
    let barChangeHandler = () => {}
    let firstBar = true
    let volume = 1

    function nextNote() {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        if(currentBeatInBar == 0){
            if(firstBar){
                firstBar = false
            }else{
                barChangeHandler()
            }
        }
        let secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        nextNoteTime += secondsPerBeat; // Add beat length to last beat time
        
        currentBeatInBar++;    // Advance the beat number, wrap to zero
        if (currentBeatInBar == beatsPerBar) {
            currentBeatInBar = 0;
        }
    }

    function updateTempo(t) {
        tempo = t
    }
    function updateBeatsPerBar(b) {
        beatsPerBar = b
    }
    function updateVolume(v){
        //wrap around 1
        volume = v > 1 ? 1 : v < 0 ? 0 : v
    }

    function scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push({ note: beatNumber, time: time });

        // create an oscillator
        const osc = audioContext.createOscillator();
        const envelope = audioContext.createGain();

        osc.type = "square"
        osc.frequency.value = (beatNumber % beatsPerBar == 0) ? 1000 : 800;
        envelope.gain.value = volume;
        const attack = 0.0025
        const release = 0.05
        const hold = 0.001
        envelope.gain.setValueCurveAtTime([0, volume], time, attack);
        envelope.gain.setValueCurveAtTime([volume, 0], time + attack + hold, release - hold);

        osc.connect(envelope);
        envelope.connect(audioContext.destination);

        osc.start(time);
        osc.stop(time + release);
    }

    function scheduler() {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentBeatInBar, nextNoteTime);
            nextNote();
        }
    }

    function start() {
        if (isRunning) return;

        if (audioContext == null) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        isRunning = true;

        currentBeatInBar = 0;
        nextNoteTime = audioContext.currentTime + 0.05;

        intervalID = setInterval(() => scheduler(), lookahead);
    }

    function stop() {
        isRunning = false;
        firstBar = true;

        clearInterval(intervalID);
    }

    function startStop() {
        if (isRunning) {
            stop();
        }
        else {
            start();
        }
    }
    function onBarChange(func = () => {}){
        if(typeof func == "function"){
            barChangeHandler = func
        }
    }

    return { start, stop, updateTempo, updateBeatsPerBar, updateVolume, onBarChange }
}
