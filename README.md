### Metronome in svelte

This metronome is an adaptation of the code in this article: 
https://grantjam.es/creating-a-simple-metronome-using-javascript-and-the-web-audio-api/

I modified the envelope a little bit since it had some popping on the original (I used 'setValueCurveAtTime' instead of 'exponentialRampToValueAtTime').

I also added some setter functions to update properties based on user input (tempo, clicks per bar, volume, etc.). 

I'm using monkeypatch to fix volume issues on mobile. 

## My extras

### Bar Counter

I added a bar counter to keep track of where your are in a particular song. Hopefully you can understand the value of this, but if not, imagine having to count 60 bars of silence in your head. Trained musicians can do it but I can't. This whole project is made to fulfill this purpose since I couldn't find a metronome with this feature. Also added the StartAt property so you can start at bar 40 or bar -2 (as a precount) or whatever. 

I also added a playlist so you can save different configs as a playlist that gets saved to your local storage. I may add users and cloud integration at some point but for now local storage it is!

### Sequencer

I added a sequencer component so you can display messages on the metronome screen (above the bar counter). This way you can add a message called "Verse 1" starting from bar 1 and with a length of 64. You can also add a precount, which will show a message showing you "Verse 1" is coming. You can add multiple messages at the same time (not much logic is added if you add too many messages and they overflow). The way it works is, you could have "Verse 1" going from bar 1 to 64 and a second message only on bars 60 to 64 called "Epic Fill". You would see a message like this "Verse 1 - Epic Fill" when the bar count is at 60 to 64. 

You can find this on the playlist menu when you add or edit a song. There's a button that says "Add Song Events".

## Disclaimer

I made this for my own drumming practice so I probably won't be too active in mantaining or adding requested features to the repo unless it's something I feel it's worth the time. 

Also, this is a work in progress and may change from time to time. I always try to add backwards compatibility so nothing breaks on old versions but let me know if things do break. 

## Demo

https://svelte-metronome.vercel.app