MM-Music-Player
===
[MagicMirror](https://github.com/MichMich/MagicMirror) Module to play music on Magic Mirror.

Setup:
---
* Add the following to your config:
````javascript
{
	module: 'mm-music-player',
	position: 'bottom_left',
	config: {
		startingVolume: 20,
		fadeDuriation: 2000
	}
}
````

Drop music files in the music directory located in the module. The script will automatically detect the files. They must be .mp3 files.