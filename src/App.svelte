<script>
  import Metronome from "./lib/Metronome.svelte"
  import Playlist from "./lib/Playlist.svelte"
  let currentSong = {}
  let songNumber = 0

  let nextSong;
  let prevSong;
  let length;

</script>



<Playlist bind:currentSong bind:songNumber bind:prevSong bind:nextSong bind:length/>
{#key currentSong}
  <Metronome 
    on:prev={prevSong}
    on:next={nextSong}
    songName={currentSong.title || ""} 
    {songNumber} tempo={currentSong?.tempo} 
    beatsPerBar={currentSong?.beatsPerBar} 
    startAt={currentSong?.startAt || -1} 
    volume={currentSong?.volume}
    stopAt={currentSong?.stopAt || -1}
    sequence={currentSong?.sequence || []}
    {length}
  />
{/key}

