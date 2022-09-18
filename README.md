### Metronome in svelte

This metronome is an adaptation of the code in this article: 
https://grantjam.es/creating-a-simple-metronome-using-javascript-and-the-web-audio-api/

I modified the envelope a little bit since it had some popping on the original (I used 'setValueCurveAtTime' instead of 'exponentialRampToValueAtTime').

I also added some setter functions to update properties based on user input (tempo, clicks per bar, volume, etc.). 

I'm using monkeypatch to fix mobile volume issues. 

## My extras

I added a bar counter to keep track of where your are in a particular song. Hopefully you can understand the value of this, but if not, imagine having to count 60 bars of silence in your head. Trained musicians can do it but I can't. This whole project is made to fulfill this purpose since I couldn't find a metronome with this feature. Also added the StartAt property so you can start at bar 40 or bar -2 (as a precount) or whatever. 

I also added a playlist so you can save different configs as a playlist that gets saved to your local storage. I may add users and cloud integration at some point but for now local storage it is!

## Demo

https://svelte-metronome.vercel.app/