<script>
    import {onDestroy} from "svelte"
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()
    import NewMetronome from "./metronome.js"
    export let songName = ''
    export let songNumber = 0
    export let tempo = 120
    export let beatsPerBar = 4
    export let startAt = -1
    export let stopAt = -1
    export let volume = 100
    export let length = 0
    export let sequence = []
    if(typeof startAt != "number")startAt = -1
    let currentBar = startAt
    let metronome = NewMetronome(tempo, beatsPerBar)
    let playing = false
    let sequenceSteps = {
        current:[], precount: []
    }

    getSequenceSteps(sequence, currentBar)
    metronome.onBarChange(() => {
        currentBar++
        getSequenceSteps(sequence, currentBar)
        if(playing && typeof stopAt == "number" && stopAt > 0 && currentBar >= stopAt){
            metronome.stop()
            const barTime = (60 / tempo * beatsPerBar) * 1000
            setTimeout(() => {
                playing = false
                currentBar = startAt
            }, barTime)
        }
    })


    function start(){
        metronome.start()
        playing = true
    }
    
    function stop(){
        currentBar = startAt
        metronome.stop()
        playing = false
    }

    function prevSong(){
        dispatch("prev")
    }
    function nextSong(){
        dispatch("next")
    }


    $: {
        if(!playing){
            currentBar = startAt
            getSequenceSteps(sequence, currentBar)
        }
    }

    $: {
        metronome.updateTempo(tempo)
    }
    $: {
        metronome.updateVolume(clamp(volume) / 100)
    }
    $: {
        metronome.updateBeatsPerBar(beatsPerBar)
    }

    function clamp(value, min, max){
        return value > max ? max : value < min ? min : value
    }

    async function getSequenceSteps(sequence, current){
        sequenceSteps = {
            current: sequence.filter(s => {
                let end = s.start + s.length
                return current >= s.start && current < end
            }),
            precount: sequence.filter(s => {
                return s.precount > 0 && current >= s.start - s.precount && current < s.start
            }),
        }
    }


    onDestroy(() => {
        metronome.stop()
        metronome = null
    })
</script>

<style>
    main *{
        user-select:none;
    }
    main {
        max-width: 1024px;
        margin:0 auto;
        display: grid;
        padding: 2rem 1rem;   
        grid-auto-rows: min-content;
        grid-gap: 1rem;
        grid-template-rows: min-content min-content 1fr min-content min-content min-content min-content min-content;
    }
    button{
        font-size: 4rem;
        background-color: var(--green);
        color: var(--primary);
        padding: 1rem;
        max-height: 100px;
        border-radius: 1rem;
    }
    button.playing{
        background-color: var(--red);
    }

    h1 {
        margin:0;
        text-align: center;
        font-weight: 900;
        color: white;
        font-size: 6rem;
    }
    p{
        margin: 0.5rem 0;
        font-size: 1.4rem;
    }
    .controls{
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: 1fr 1fr;
    }
    .song{
        font-size: 1.8rem;
        color: var(--yellow);
        display:flex;
        align-items: center;
    }
    .song .icon{
        margin-right: 0.5rem;
    }
    .buttons button{
        font-size: 2rem;
        padding: 0.4rem;
    }
    .buttons{
        grid-gap: 1rem;
        display:grid;
        grid-template-columns: 60px 60px;
    }
    .sequence{
        display:grid;
        align-items: center;
        grid-template-rows: min-content 1fr;
        height: 100%;
        width: 100%;
    }
    .playlist{
        border-radius: 0.5rem;
        background-color: var(--yellow)
    }
    .messages{
        text-align: center;        
        font-size: 1.5rem;
        white-space: normal;

    }
    .messages span{
        color: white;
        text-transform: capitalize;
    }
    .credits{
        width: 100%;
        text-align: center;
        font-size: 0.6rem;
        margin-top: 1rem;
        padding: 0.5rem;
        color: var(--purple);
        position: relative;
        top:1.5rem;
      }
    .credits a{
    color: var(--purple);
    }
    @media screen and (max-width: 1024px) {
        .controls{
            grid-template-columns: 1fr;
        }
        .messages{
            text-align: center;        
            font-size: 1rem;
        }
        .sequence{
            height: 230px;
        }
    }

</style>

<main>
    <div>
        <p class="song">
            {#if songName && songNumber}
                <span class="material-symbols-outlined icon">
                    lyrics
                </span> {songNumber}. {songName}
            {/if}
        </p>
        {#if length > 1}
            <div class="buttons">
                <button class="playlist" on:click={prevSong}>
                    <span class="material-symbols-outlined">
                        skip_previous
                    </span>
                </button>
                <button class="playlist" on:click={nextSong}>
                    <span class="material-symbols-outlined">
                        skip_next
                    </span>
                </button>
            </div>
        {/if}
    </div>
    <p>
        Current Bar:
    </p>
    <div class="sequence">
        <p class="messages">
            {#each sequenceSteps.current as event, i}
                <span>
                    {i > 0 ? ` - ` : ''}{event?.message}
                </span>
            {:else}
                <span>
                    
                </span>
            {/each}
            {#if sequenceSteps.precount.length > 0}
                {`<<<`}
            {/if}
            {#each sequenceSteps.precount as event, i}
                <span>
                    {i > 0 ? ` - ` : ''}{event?.message} <span style="color:var(--yellow)">@</span> {event.start}
                </span>
            {/each}
        </p>
        <h1>
            {currentBar || 0}
        </h1>
    </div>
    {#if playing}
        <button class="playing" on:click={stop}>
            <span class="material-symbols-outlined play">
                stop_circle
            </span> 
        </button>
        {:else}
        <button on:click={start}>
            <span class="material-symbols-outlined">
                play_circle
            </span>
        </button>
    {/if}
    <div>
        <p class="label">
            BPM: <input class="text" type="number" bind:value={tempo} step="1" min="30" max="300"/>
        </p>
        <input type="range" bind:value={tempo} step="1" min="30" max="300"/>
    </div>
    <div class="controls">
        <div>
            <p class="label">
                Beats per bar: <input class="text" step="1" min="1" max="16" type="number" bind:value={beatsPerBar}/>
            </p>
            <input type="range" bind:value={beatsPerBar} step="1" min="1" max="16"/>
        </div>
        <div>
            <p class="label">
                Volume: <input class="text" type="number" bind:value={volume} step="1" min="1" max="100"/>
            </p>
            <input type="range" bind:value={volume} step="1" min="1" max="100"/>
        </div>
    </div>
    <div>
        <p class="label">
            Start At Bar:
        </p>
        <input type="number" bind:value={startAt} step="1" />
    </div>
    <div>
        <p class="label">
            Stop At Bar (0 to turn off):
        </p>
        <input type="number" bind:value={stopAt} step="1" />
    </div>


    <div class="credits">
      Made by Juan Pedro Aldana Grajeda | <b><a href="https://github.com/aldanasjuan/svelte-metronome">Github</a></b>
    </div>


</main>