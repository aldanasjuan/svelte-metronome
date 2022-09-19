<script>
  import Metronome from "./lib/Metronome.svelte"
  import Playlist from "./lib/Playlist.svelte"
  let currentSong = {}
  let songNumber = 0
  let nextSong;
  let prevSong;
  let length;
  let clearSong;

</script>



<Playlist bind:currentSong bind:songNumber bind:prevSong bind:nextSong bind:length bind:clearSong/>
{#key currentSong}
  <Metronome 
    on:prev={prevSong}
    on:next={nextSong}
    on:clearSong={clearSong}
    songName={currentSong?.title} 
    {songNumber} 
    tempo={currentSong?.tempo} 
    beatsPerBar={currentSong?.beatsPerBar} 
    startAt={currentSong?.startAt} 
    volume={currentSong?.volume}
    stopAt={currentSong?.stopAt}
    sequence={currentSong?.sequence}
    {length}
  />
{/key}

