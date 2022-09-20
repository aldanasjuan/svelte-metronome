<script>
    import Modal from "./Modal.svelte"
    import Sequencer from "./Sequencer.svelte"
    import {newLocalStore} from "./localStore"
    import {flip} from "svelte/animate"
    import {fly} from "svelte/transition"
    import {nanoid} from "nanoid"
    import {onMount} from "svelte"
    let playlist = newLocalStore("playlist", [])
    export let currentSong = {}
    export let songNumber = 0
    export let length = 0
    let newSong = {
        id: nanoid(),
        title: "",
        tempo: 120,
        beatsPerBar: 4,
        volume: 100,
        startAt: -1,
        sequence: [],
        stopAt: -1
    }
    let songToEdit = {}
    let openMenu = false
    let addSongModal = false
    let editSongModal = false
    let newSongSequence = false
    let editSongSequence = false
    $:length = $playlist.length

    onMount(() => {
        if($playlist.length > 0){
            $playlist = $playlist.map(s => {
                if(!Array.isArray(s.sequence)){
                    s.sequence = []
                }
                return s
            })
            currentSong = $playlist[0] || {}
        }
    })

    function getSongNumber(song){
        let index = $playlist.findIndex(s => s?.id == song?.id)
        if(index > -1){
            return index + 1
        }
        return 0
    }

    export function clearSong(){
        currentSong = {}
    }

    function resetAddSong(){
        newSongSequence = false
        newSong = {
            id: nanoid(),
            title: "",
            tempo: 120,
            beatsPerBar: 4,
            volume: 100,
            startAt: -1,
            sequence: [],
            stopAt: -1
        }
    }
    function resetEditSong(){
        editSongSequence = false
        songToEdit = {}
    }


    function editSong(song){
        songToEdit = song
        editSongModal = true
    }


    function deleteSong(song){
        let index = $playlist.findIndex(s => s.id == song.id)
        $playlist = $playlist.filter(s => s.id != song.id)

        if($playlist[index]){
            currentSong = $playlist[index]
        }else{
            currentSong = $playlist[0] || {}
        }
    }

    $: songNumber = getSongNumber(currentSong)


    function saveSong(){
        $playlist = [...$playlist, {...newSong}]
        addSongModal = false
        resetAddSong()
        // if it's the first song, assign it to currentSong
        if ($playlist.length == 1){
            currentSong = $playlist[0]
        }
        
    }

    function playSong(song){
        currentSong = song
        openMenu = false
    }

    function saveEditSong(){
        $playlist = $playlist.map(s => {
            if(s.id == songToEdit.id){
                return songToEdit
            }else{
                return s
            }
        })
        if(currentSong.id == songToEdit.id){
            currentSong = songToEdit
        }
        editSongModal = false
        songToEdit = null
    }

    export function prevSong(){
        let index = $playlist.findIndex(s => s.id == currentSong.id)
        if(index > 0){
            currentSong = $playlist[index-1]
        }else{
            currentSong = $playlist[$playlist.length - 1] || {}
        }
    }
    export function nextSong(){
        let index = $playlist.findIndex(s => s.id == currentSong.id)
        if(index < $playlist.length - 1){
            currentSong = $playlist[index+1]
        }else{
            currentSong = $playlist[0] || {}
        }
    }

    function prev(song){
        let index = $playlist.findIndex(s => s.id == song.id)
        if(index > 0){ // only move when index is not 0
            let prevSong = $playlist[index-1]
            $playlist = [...$playlist.slice(0, index-1), song, prevSong, ...$playlist.slice(index+1)]
        }
        
    }
    function next(song){
        let index = $playlist.findIndex(s => s.id == song.id)
        if(index < $playlist.length - 1){ //can only move to the next spot if it's not the last item
            $playlist = [...$playlist.slice(0, index), $playlist[index+1], song, ...$playlist.slice(index+2)]
        }
    }
</script>

<style>
    * {
        user-select:none;
    }
    .main-icon{
        position: fixed;
        top: 1rem;
        right:1rem;
        font-size: 2rem;
        user-select:none;
        cursor:pointer;
    }
    .menu{
        z-index: 999;
        position: fixed;
        top: 0;
        right:0;
        width: 100%;
        max-width: 500px;
        height: 100%;
        box-shadow: 0 0 4px white, 0 0 7px var(--yellow);
        background-color: var(--primary);
        padding: 1rem;
        overflow:auto;
    }
    .menu .icon{
        user-select:none;
        cursor:pointer;
        font-size: 2rem;
        position: absolute;
        top: 1rem;
        right:1rem;
    }
    h2{
        color: var(--yellow);
    }
    .song{
        display: grid;
        grid-template-columns: 1fr min-content min-content min-content min-content min-content;
        grid-gap: 1.3rem;
        align-items: center;
        user-select: none;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 1rem 0;
    }
    .song .material-symbols-outlined{
        font-size: 1.5rem;
        cursor:pointer;
        justify-self: center;
    }
    .song p{
        margin:0;
    }
    button{
        font-size: 1rem;
        background-color: var(--green);
        color: var(--primary);
        padding: 0.8rem 1.8rem;
        border-radius: 0.5rem;
    }
    .add-song{
        margin-bottom: 1.5rem;
    }
    .placeholder{
        text-align: center;
    }
    .placeholder .material-symbols-outlined{
        font-size: 2rem;
    }

    .save{
        margin: 1rem 0;
        width: 100%;
    }
    .events{
        width: 100%;
        background-color: var(--red-dark);
        color:var(--verdi);
        margin:  1rem 0 2rem;
    }
    .down{
        transform: rotate(180deg);
    }

</style>

<div class="main-icon" on:click={() => openMenu = true}>
    <span class="material-symbols-outlined">
        queue_music
    </span>
</div>

{#if openMenu}
    <div class="menu" transition:fly={{x: 500, opacity: 1}} >
        <span class="material-symbols-outlined icon" on:click={() => openMenu = false}>
            clear
        </span>
        <h2>Playlist</h2>
        <button class="add-song" on:click={() => addSongModal = true}>Add Song</button>
        {#each $playlist as song, i (song.id)}
            <div class="song" animate:flip={{duration:450}}>
                <p>
                    {i+1}. {song.title}
                </p>
                <span class="material-symbols-outlined" on:click={() => prev(song)}>
                    expand_less
                </span>
                <span class="material-symbols-outlined down" on:click={() => next(song)}>
                    expand_less
                </span>
                <span class="material-symbols-outlined" on:click={() => playSong(song)}>
                    play_circle
                </span>
                <span class="material-symbols-outlined" on:click={() => editSong(song)}>
                    edit
                </span>
                <span class="material-symbols-outlined" on:click={() => deleteSong(song)}>
                    delete
                </span>
            </div>
        {:else}

            <p class="placeholder">      
                <span class="material-symbols-outlined">
                    playlist_remove
                </span>      <br/>     
                You don't have any songs!
            </p>
        {/each}
    </div>
{/if}


<Modal on:close={resetAddSong} bind:open={addSongModal}>
    <h2>New Song</h2>
    {#if newSongSequence}
        <Sequencer bind:value={newSong.sequence} on:confirm={() => newSongSequence = false}/>
    {:else}
        <div>
            <p class="label">
                Title:
            </p>
            <input type="text" bind:value={newSong.title} />
        </div>
        <div>
            <p class="label">
                BPM: <input class="text" type="number" bind:value={newSong.tempo} step="1" min="30" max="300"/>
            </p>
            <input type="range" bind:value={newSong.tempo} step="1" min="30" max="300"/>
        </div>
        <div>
            <p class="label">
                Beats per bar: <input class="text" type="number" bind:value={newSong.beatsPerBar} step="1" min="1" max="16"/>
            </p>
            <input type="range" bind:value={newSong.beatsPerBar} step="1" min="1" max="16"/>
        </div>
        <div>
            <p class="label">
                Volume: <input class="text" type="number" bind:value={newSong.volume} step="1" min="1" max="100"/>
            </p>
            <input type="range" bind:value={newSong.volume} step="1" min="1" max="100"/>
        </div>
        <div>
            <p class="label">
                Start At Bar:
            </p>
            <input type="number" bind:value={newSong.startAt} step="1" />
        </div>
        <div>
            <p class="label">
                Stop At Bar (0 to turn off):
            </p>
            <input type="number" bind:value={newSong.stopAt} step="1" />
        </div>
        <div>
            <p class="label">
                Song events: {newSong.sequence.length}
            </p>
            <button class="events" on:click={() => newSongSequence = true}>
                {newSong.sequence.length > 0 ? "Edit" : "Add"}  Song Events
            </button>
        </div>
        <button class="save" on:click={saveSong}>
            Save Song
        </button>
    {/if}
</Modal>


<Modal on:close={resetEditSong} bind:open={editSongModal}>
    <h2>Edit Song</h2>
    {#if editSongSequence}
        <Sequencer bind:value={songToEdit.sequence} on:confirm={() => editSongSequence = false}/>
    {:else}
        <div>
            <p class="label">
                Title:
            </p>
            <input type="text" bind:value={songToEdit.title} />
        </div>
        <div>
            <p class="label">
                BPM: <input class="text" type="number" bind:value={songToEdit.tempo} step="1" min="30" max="300"/>
            </p>
            <input type="range" bind:value={songToEdit.tempo} step="1" min="30" max="300"/>
        </div>
        <div>
            <p class="label">
                Beats per bar: <input class="text" type="number" bind:value={songToEdit.beatsPerBar} step="1" min="1" max="16"/>
            </p>
            <input type="range" bind:value={songToEdit.beatsPerBar} step="1" min="1" max="16"/>
        </div>
        <div>
            <p class="label">
                Volume: <input class="text" type="number" bind:value={songToEdit.volume} step="1" min="1" max="100"/>
            </p>
            <input type="range" bind:value={songToEdit.volume} step="1" min="1" max="100"/>
        </div>
        <div>
            <p class="label">
                Start At Bar:
            </p>
            <input type="number" bind:value={songToEdit.startAt} step="1" />
        </div>
        <div>
            <p class="label">
                Stop At Bar (0 to turn off):
            </p>
            <input type="number" bind:value={songToEdit.stopAt} step="1" />
        </div>
        <div>
            <p class="label">
                Song events: {songToEdit.sequence.length}
            </p>
            <button class="events" on:click={() => editSongSequence = true}>
                {songToEdit.sequence.length > 0 ? "Edit" : "Add"} Song Events
            </button>
        </div>
        <button class="save" on:click={saveEditSong}>
            Save Song
        </button>
    {/if}
</Modal>