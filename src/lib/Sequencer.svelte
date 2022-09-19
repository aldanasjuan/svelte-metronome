<script>
    import {flip} from "svelte/animate"
    import {createEventDispatcher} from "svelte"
    const dispatch = createEventDispatcher()
    import {nanoid} from "nanoid"
    export let value = []
    let showInstructions = false
    let addEventScreen = false
    let editEventScreen = false
    let eventToAdd, eventToEdit;

    function confirmAddEvent(){
        value = [...value, eventToAdd]
        addEventScreen = false
    }

    function confirmEditEvent(){
        value = value.map(e => {
            if(e.id == eventToEdit?.id){
                return eventToEdit
            }
            return e
        })
        editEventScreen = false
    }

    function showAddEvent(){
        addEventScreen = true
        eventToAdd = newEvent(value)
    }
    
    function newEvent(sequence){
        let lastStep = Math.max(0, ...sequence.map(step => step.start + step.length - 1))
        return {
            id: nanoid(),
            title: "",
            start: lastStep + 1,
            length: 1,
            message: "",
            precount: 0
        }
    }
    function prev(event){
        let index = value.findIndex(s => s.id == event.id)
        if(index > 0){ // only move when index is not 0
            let prevSong = value[index-1]
            value = [...value.slice(0, index-1), event, prevSong, ...value.slice(index+1)]
        }
    }
    function next(event){
        let index = value.findIndex(s => s.id == event.id)
        if(index < value.length - 1){ //can only move to the next spot if it's not the last item
            value = [...value.slice(0, index), value[index+1], event, ...value.slice(index+2)]
        }
    }
    function editEvent(event){
        eventToEdit = event
        editEventScreen = true
    }
    function deleteEvent(event){
        value = value.filter(e => e.id != event.id)
    }
</script>

<style>
    h2{
        display:flex;
        align-items: center;
    }
    .sequencer{
        position: relative;
    }
    .instruction{
        color: var(--purple);
        font-size: 0.8rem;
        padding: 0;
    }
    .placeholder{
        text-align:center;
        font-size: 0.9rem;
    }
    .placeholder{
        margin: 1rem 0;
    }
    
    .yellow{
        background-color: var(--yellow);
    }
    .green{
        background-color: var(--green);
    }
    .back{
        margin-top:2rem;
        width: 100%;
    }
    button{
        margin: 1rem 0;
        font-size: 1rem;
        background-color: var(--verdi);
        color: var(--primary);
        padding: 0.8rem 1.8rem;
        border-radius: 0.5rem;
    }
    .help{
        margin-left: 0.5rem;
        color: var(--purple);
        font-size: 1.5rem;
        user-select: none;
        cursor: pointer;
    }
    .event p{
        margin: 0;
    }
    .event{
        margin: 0;
        padding: 0.5rem 0;
        font-size: 0.9rem;
        display:grid;        
        align-items: center;
        grid-template-columns: 1fr min-content min-content min-content min-content;
        grid-gap: 1.3rem;
        
    }
    .event .icon{        
        font-size: 1.5rem;
        user-select: none;
        cursor: pointer;
    }
    .down{
        transform: rotate(180deg);
    }
</style>


<div class="sequencer">

    {#if addEventScreen}
        <h2>
            Add Event
        </h2>
        <p class="label">Title</p>
        <input type="text" bind:value={eventToAdd.title} placeholder="Enter a title"/>
        <p class="label">Start</p>
        <input type="number" bind:value={eventToAdd.start} />
        <p class="label">Length</p>
        <input type="number" bind:value={eventToAdd.length} />
        <p class="label">Message</p>
        <input type="text" bind:value={eventToAdd.message} placeholder="Message to show on the metronome"/>
        <p class="label">Precount</p>
        <input type="number" bind:value={eventToAdd.precount} />
        <div class="buttons">
            <button class="add" on:click={() => addEventScreen = false}>
                Cancel
            </button>
            <button class="green" on:click={confirmAddEvent}>
                Confirm
            </button>
        </div>
    {:else if editEventScreen}
        <h2>
            Edit Event
        </h2>
        <p class="label">Title</p>
        <input type="text" bind:value={eventToEdit.title} placeholder="Enter a title"/>
        <p class="label">Start</p>
        <input type="number" bind:value={eventToEdit.start} />
        <p class="label">Length</p>
        <input type="number" bind:value={eventToEdit.length} />
        <p class="label">Message</p>
        <input type="text" bind:value={eventToEdit.message} placeholder="Message to show on the metronome"/>
        <p class="label">Precount</p>
        <input type="number" bind:value={eventToEdit.precount} />
        <div class="buttons">
            <button class="add" on:click={() => editEventScreen = false}>
                Cancel
            </button>
            <button class="green" on:click={confirmEditEvent}>
                Confirm
            </button>
        </div>
    {:else}
        <h2>Song Events    
            <span class="material-symbols-outlined help" on:click={() => showInstructions = !showInstructions}>
                {showInstructions ? "cancel" : "help"}
            </span>
        </h2>

        
        {#if showInstructions}
            <p class="instruction">
                A song can have a series of events that show a message on the metronome screen. 
                You can assign any text to each event, like "Verse 1". <br/><br/>
                If "Verse 1" starts at bar 16 and last 48 bars, the metronome would display "Verse 1" from bar 16 to bar 64. 
                <br/><br/>
                If you add a precount of 2 bars, it will display "Verse 1" from bar 14 to bar 64.
                <br/>
                <br/>
                You can have overlapping events, like adding a "Fill" event on bar 32 that lasts 2 bars. The main display would show "Verse 1 - Fill" on bar 32 and 33.
            </p>
        {/if}
        <button class="add" on:click={showAddEvent}>
            <span class="material-symbols-outlined">
                add
            </span> 
            Add Event
        </button>
        {#each value as event (event.id)}
            <div class="event" animate:flip={{duration:450}}>
                <p>
                    {event.start} - {event.start+event.length-1} | {event.title || ""}
                </p>   
                <span class="icon material-symbols-outlined" on:click={() => prev(event)}>
                    expand_less
                </span>
                <span class="icon material-symbols-outlined down" on:click={() => next(event)}>
                    expand_less
                </span>
                <span class="icon material-symbols-outlined" on:click={() => editEvent(event)}>
                        edit
                </span>
                <span class="icon material-symbols-outlined" on:click={() => deleteEvent(event)}>
                    delete
                </span>             
            </div>
        {:else}
            <p class="placeholder">
                There are no events. Click 'Add Event' to get started.
            </p>
        {/each}
        <button class="yellow back" on:click={() => dispatch("confirm")}>
            Back to song
        </button>
    {/if}


</div>