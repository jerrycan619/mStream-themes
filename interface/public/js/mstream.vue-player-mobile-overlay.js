var jukeStats = false
if (typeof JUKEBOX !== 'undefined') {
    jukeStats = JUKEBOX.stats
}

Vue.component('star-rating', VueStarRating.default);

new Vue({
    el: '#mstream-player-overlay',
    data: {
        playerStats: MSTREAMPLAYER.playerStats,
        playlist: MSTREAMPLAYER.playlist,
        positionCache: MSTREAMPLAYER.positionCache,
        met: MSTREAMPLAYER.playerStats.metadata,
        jukebox: jukeStats,
        curVol: 100, // Manage our own volume
        lastVol: 100,
        isViz: false,
        playmode: "continuous",
        playModeIcon: "mdi-shuffle-disabled",
        playModeTitle: "Continuous Play",
        progress_bar_handle: "" ,
        progress_bar: {
            start: 0,
            min: 0,
            max: 100,
        }, 
        volume_bar: {
            start: 100,
            min: 0,
            max: 100,
        },
        rating: '',
        overlay_star_icon: 'mdi-star'
    },
    computed: {
        albumArtPath: function () {
            if (!this.met['album-art']) {
                  return '<span class="placeholder_icon mdi-set mdi-music"></span>';
            }
            return '<img class="album_art_img responsive_img" src="/album-art/' + this.met['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
        },

        playPauseIcon: function () {

            if (this.playerStats.loading) {
                $('#track_play').addClass("d-none");
                $('#track_loading').removeClass("d-none");
                console.log(this.playerStats.loading);
            } else {
                $('#track_loading').addClass("d-none");
                $('#track_play').removeClass("d-none");
                console.log(this.playerStats.loading);
            }

            if (this.playerStats.playing) {
                return "mdi-pause";
            } else {
                return "mdi-play";
            }
        },

        progress_width: function () {
            if (this.playerStats.duration === 0) {
                return "width:0";
            }
      
            var percentage = 100 - ((this.playerStats.currentTime / this.playerStats.duration) * 100);
            return "width:calc(100% - " + percentage + "%)";
        },

        trackDuration: function () {
            if (this.playerStats.duration === 0) {
                return '00:00';
            }

            if (this.playerStats.duration == "Infinity") {
                return '\u221e';
            }

            /* progress_bar_handle */
            //this.$refs.progress_bar.noUiSlider.set(((this.playerStats.currentTime / this.playerStats.duration) * 100));

            //console.log(progress_bar_handle);
            if (progress_bar_handle) {
                progress_bar_handle.noUiSlider.set(((this.playerStats.currentTime / this.playerStats.duration) * 100));
            }

            var curr = this.playerStats.duration;
            var minutes = Math.floor(curr / 60);
            var secondsToCalc = Math.floor(curr % 60) + '';
            var currentText = minutes + ':' + (secondsToCalc.length < 2 ? '0' + secondsToCalc : secondsToCalc);

            return currentText;
        },

        remainingTime: function () {
            if (this.playerStats.duration === 0) {
                return '00:00';
            }

            var curr = this.playerStats.duration - this.playerStats.currentTime;
            var minutes = Math.floor(curr / 60);
            var secondsToCalc = Math.floor(curr % 60) + '';
            var currentText = minutes + ':' + (secondsToCalc.length < 2 ? '0' + secondsToCalc : secondsToCalc);

            return currentText;
        },

        //TODO: returns a unloaded, loading or loaded for loading icon.. live update?
        /*playerState: function() {
            return MSTREAMPLAYER.getState();
        },*/

        pastTime: function () {
            if (this.playerStats.duration === 0) {
                return '00:00';
            }

            var curr = this.playerStats.currentTime;
            var minutes = Math.floor(curr / 60);
            var secondsToCalc = Math.floor(curr % 60) + '';
            var currentText = minutes + ':' + (secondsToCalc.length < 2 ? '0' + secondsToCalc : secondsToCalc);

            return currentText;
        },

        currentSongTitle: function () {
            // Call these vars so updates change whenever they do
            var playerStats = this.playerStats;
            var titleX = this.met.title;

            var currentSong = MSTREAMPLAYER.getCurrentSong();

            if (currentSong === false) {
                return '\u00A0\u00A0\u00A0Welcome To mStream!\u00A0\u00A0\u00A0';
            }

            //Disable Player Progress Slider if stream
            if (playerStats.stream && playerStats.metadata.url) {
                this.$refs.progress_bar.setAttribute('disabled', true);
            } else {
                this.$refs.progress_bar.removeAttribute('disabled');
            }

            //console.log(currentSong.metadata.rating);
            if (!currentSong.metadata.rating) {
                this.rating = '';
            } else if (currentSong.metadata.rating > 0) {
                var returnThis = currentSong.metadata.rating / 2;
                if (!Number.isInteger(returnThis)) {
                    this.rating = returnThis.toFixed(1);
                }
            }

            if (playerStats.metadata && titleX) {
                return titleX;
            } else {
                // Use filepath instead
                var filepathArray = currentSong.filepath.split("/");
                return filepathArray[filepathArray.length - 1]
            }
        },

        currentSongArtist: function () {
            // Call these vars so updates change whenever they do
            var playerStats = this.playerStats;

            if (playerStats.metadata.artist) {
                return playerStats.metadata.artist;
            } else {
                return "";
            }
        }
    },
    methods: {
        close: function() {
            $('#playerOverlay').hide();
            $('#main_content').show();
        },
        togglePlayMode: function () {
            //continuous -> repeat -> shuffle -> continuous
            // use mstreamModule.playerStats.shuffle === true instead of this.playMode
            const playerStats = this.playerStats;
            if (playerStats.shuffle === true) {
                MSTREAMPLAYER.setShuffle(false);
                this.playModeIcon = "mdi-shuffle-disabled";
                this.playModeTitle = "Continuous Play";
            } else if (playerStats.shouldLoop === true) {
                MSTREAMPLAYER.setRepeat(false);
                MSTREAMPLAYER.setShuffle(true);
                this.playModeIcon = "mdi-shuffle";
                this.playModeTitle = "Shuffle Playlist";
            } else if (playerStats.shuffle === false && playerStats.shouldLoop === false) {
                MSTREAMPLAYER.setRepeat(true);
                this.playModeIcon = "mdi-repeat";
                this.playModeTitle = "Repeat Playlist";
            }

        },
        
        playPause: function () {
            MSTREAMPLAYER.playPause();
        },
        skipNext: function () {
            MSTREAMPLAYER.nextSong();
        },
        skipPrev: function () {
            MSTREAMPLAYER.previousSong();
        },
        toggleRepeat: function () {
            MSTREAMPLAYER.toggleRepeat();
        },
        toggleShuffle: function () {
            MSTREAMPLAYER.toggleShuffle();
        },
        toggleAutoDJ: function () {
            console.log("AutoDj");
            MSTREAMPLAYER.toggleAutoDJ();

            $("#togglePlayMode").toggleClass("disabled_icon");
            $('#autodj_icon').toggleClass("icon_animation1");

            if ($("#togglePlayMode").prop("disabled")) {
                $("#togglePlayMode").prop("disabled",false);
            } else {
                $("#togglePlayMode").prop("disabled",true);
                MSTREAMPLAYER.setShuffle(false);
                this.playModeIcon = "mdi-shuffle-disabled";
                this.playModeTitle = "Continuous Play";
            }
        },
        fadeOverlay: function () {
            if ($('#main-overlay').is(':visible')) {
                $('#main-overlay').fadeOut("slow");
                this.isViz = false;
            } else {
                this.isViz = true;
                $('#main-overlay').fadeIn("slow", function () {
                    var isInit = VIZ.initPlayer();
                    if (isInit === false) {
                        VIZ.updateSize();
                    }
                });
            }
        },
        rewind30: function () {
            MSTREAMPLAYER.goBackSeek(30);
        },
        forward30: function () {
            MSTREAMPLAYER.goForwardSeek(30);
        },
        overlay_rate: function () {
            $('.overlay_star_rating').toggleClass("overlay_star_expanded");
            if ($('.overlay_star_rating').hasClass("overlay_star_expanded")) {
                this.overlay_star_icon="mdi-star-off";
            } else {
                this.overlay_star_icon="mdi-star";
                const currentSong = MSTREAMPLAYER.getCurrentSong();
                currentSong.metadata.rating = parseInt(0);
                // make a server call here
                MSTREAMAPI.rateSong(currentSong.filepath, parseInt(0), function (res, err) {
                    if(err) {
                    iziToast.error({
                        title: 'Failed to set rating',
                        position: 'topCenter',
                        timeout: 3500
                    });
                    return;
                    }
                });
                console.log("xxSet rating to:", 0);
                this.rating = '';
            }
            
        },
        overlay_setRating: function (rating) {
            const currentSong = MSTREAMPLAYER.getCurrentSong();
            currentSong.metadata.rating = parseInt(rating * 2);
            // make a server call here
            MSTREAMAPI.rateSong(currentSong.filepath, parseInt(rating * 2), function (res, err) {
                if(err) {
                iziToast.error({
                    title: 'Failed to set rating',
                    position: 'topCenter',
                    timeout: 3500
                });
                return;
                }
            });
            console.log("Set rating to:", rating*2);
            $('.overlay_star_rating').toggleClass("overlay_star_expanded");
            this.overlay_star_icon="mdi-star";
            if (rating > 0) {
                this.rating = rating;
            } else {
                this.rating = '';
            }
            
        }
    },
    mounted: function() {

        // ---------------- Track Progress Bar ----------------------
        noUiSlider.create(this.$refs.progress_bar, {
            start: this.progress_bar.start,
            connect: 'lower',
            range: {
              'min': this.progress_bar.min,
              'max': this.progress_bar.max
            }
          });

        progress_bar_handle = this.$refs.progress_bar;

        this.$refs.progress_bar.noUiSlider.on('slide',function (values, handle) {
            //console.log(parseInt(values[handle]));
            MSTREAMPLAYER.seekByPercentage(values[handle]);
        });

        // --------------------- Star Rating --------------------------
       
    }
});

