/* global Module */

/* Magic Mirror
 * Module: MM Music Player
 *
 * By EoF https://forum.magicmirror.builders/user/eof
 * MIT Licensed.
 */

Module.register("mm-music-player",{

	// Default module config.
	defaults: {
		startingVolume: 20,
		fadeDuriation: 2000
	},
	getScripts: function() {
		return ["modules/mm-music-player/js/jquery.js", "modules/mm-music-player/js/jquery-ui.min.js"];
	},
	getStyles: function() {
		return ["style.css"];
	},
	start: function() {
		Log.info("Starting module: " + this.name);
	},
	
	// Override dom generator.
	getDom: function() {
		var songs = [];
		
		var wrapper = document.createElement("div");
		var audioElement = document.createElement("audio");
		var musicWrapper = document.createElement("div");
		var playButton = document.createElement("div");
		var pauseButton = document.createElement("div");
		var backButton = document.createElement("div");
		var nextButton = document.createElement("div");
		var volume = document.createElement("div");
		var volumeSlider = document.createElement("div");
		var currentlyPlaying = document.createElement("div");
		
		musicWrapper.className = "music";
		
		playButton.className = "play";
		playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
		
		pauseButton.className = "pause";
		pauseButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
		
		backButton.className = "back";
		backButton.innerHTML = '<i class="fa fa-step-backward" aria-hidden="true"></i>';
		
		nextButton.className = "next";
		nextButton.innerHTML = '<i class="fa fa-step-forward" aria-hidden="true"></i>';
		
		volume.className = "volume";
		volume.innerHTML = '<i class="fa fa-volume-down" aria-hidden="true"></i>';
		
		volumeSlider.className = "slider";
		currentlyPlaying.className = "playing";
		
		
		wrapper.appendChild(audioElement);
		wrapper.appendChild(musicWrapper);
		musicWrapper.appendChild(playButton);
		musicWrapper.appendChild(pauseButton);
		musicWrapper.appendChild(backButton);
		musicWrapper.appendChild(nextButton);
		musicWrapper.appendChild(volume);
		musicWrapper.appendChild(volumeSlider);
		musicWrapper.appendChild(currentlyPlaying);
		
		var startingVolume = this.config.startingVolume;
		var fadeDuriation = this.config.fadeDuriation;

		function getSongs(callback){
			$.ajax({
				url: "/music",
				type: "GET",
				success: callback
			});
		}

		getSongs(function(result){
			songs = result;
			length = songs.length;
			current = 0;
			
			function next(){
				current++;
				index = current % length;
				
				$(currentlyPlaying).hide();
				$(currentlyPlaying).html(songs[index]).fadeIn(fadeDuriation);
				$(audioElement).attr('src', 'modules/mm-music-player/music/' + songs[index]);
				$(audioElement).trigger('play');
			}
			
			function back(){
				if(current <= 0){
					current = 0;
				}else{
					current--;
				}
				
				index = current % length;
				
				if(index <= 0){
					index = 0;
				}
				
				$(currentlyPlaying).hide();
				$(currentlyPlaying).html(songs[index]).fadeIn(fadeDuriation);
				$(audioElement).attr('src', 'modules/mm-music-player/music/' + songs[Math.abs(index)]);
				$(audioElement).trigger('play');
			}
			
			$(audioElement).trigger('load');
			$(audioElement).attr('src', 'modules/mm-music-player/music/' + songs[0]);
			$(audioElement).prop('volume', (startingVolume/100));
			$(currentlyPlaying).html(songs[current]).fadeIn(fadeDuriation);
			
			$(audioElement).bind("ended", function(){
				next();
			});

			$(playButton).on("click", function(){
				$(audioElement).trigger('play');
				$(currentlyPlaying).html(songs[current]).fadeIn(fadeDuriation);
			});
			
			$(pauseButton).on("click", function(){
				$(audioElement).trigger('pause');
				$(currentlyPlaying).fadeOut(fadeDuriation);
			});
			
			$(nextButton).on("click", function(){
				next();
			});
			
			$(backButton).on("click", function(){
				back();
			});
			
			$(function(){
				var slider = $('.slider')
				slider.slider({
					range: "min",
					min: 0,
					value: startingVolume,
					
					start: function(event,ui) {
					  
					},
					
					slide: function(event, ui) {
						 var value = slider.slider('value'),
						 volume = $('.volume');
						 
						 $(audioElement).prop('volume', (value/100));
						 
						if(value <= 10) {
							volume.html('<i class="fa fa-volume-off" aria-hidden="true"></i>');
							
							if(value <= 1){
								$(audioElement).prop('volume', (0));
							}
						}
						else if (value <= 60) {
							volume.html('<i class="fa fa-volume-down" aria-hidden="true"></i>');
						}
						else if (value <= 90) {
							volume.html('<i class="fa fa-volume-up" aria-hidden="true"></i>');
						}
					}
				});
			});
		});

		return wrapper;
	}
});
