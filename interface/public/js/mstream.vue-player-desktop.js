var jukeStats = false
if (typeof JUKEBOX !== 'undefined') {
    jukeStats = JUKEBOX.stats
}

new Vue({
    el: '#mstream-player2',
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
        progress_bar: {
            start: 0,
            min: 0,
            max: 100,
        }, 
        volume_bar: {
            start: 100,
            min: 0,
            max: 100,
        } 
    },
    created() {
        
    },
    watch: {
        curVol: function (value) {
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("volume", this.curVol);
            }

            MSTREAMPLAYER.changeVolume(parseInt(this.curVol));

        },
        
    },
    computed: {
        albumArtPath: function () {
            
            if (!this.met['album-art']) {
                  return '<span class="player_album_icon mdi-set mdi-music"></span>';
            }
            return '<img class="album_art_img responsive_img" src="/album-art/' + this.met['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
        },

        playerVolume: function() {
            //TODO: Feedback from Jukebox Vol. set
            //prevent calling this if vol is changed by slider, because its lagging 
            //if this is called on every slide
            // var vol = this.playerStats.volume;
            // const vol_slider = this.$refs.volume_bar;
            // console.log("Volume Changed to: ", vol);

            // if ($(vol_slider).hasClass("noUi-target")) { 
            //     vol_slider.noUiSlider.set(vol);
            //     console.log("Slider set to: ", vol);
            // }

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
                return "mdi-pause-circle-outline";
            } else {
                return "mdi-play-circle-outline";
            }
        },

        trackDuration: function () {
            if (this.playerStats.duration === 0) {
                return '00:00';
            }

            this.$refs.progress_bar.noUiSlider.set(((this.playerStats.currentTime / this.playerStats.duration) * 100));

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

            // Auto-Scroll Playlist (current playing track always visible)
            this.$nextTick(() => {
                const elem = document.getElementsByClassName("playing")[0];
                const elemOffset = elem.offsetTop;
                const elemHeight = elem.offsetHeight;
                const frameHeight = document.getElementById("playlist_scrollBox").offsetHeight;
                let offset = 0;

                offset = elemOffset - (frameHeight / 2 - elemHeight / 2);

                var container = document.querySelector('#playlist_scrollBox .simplebar-content-wrapper'); 
                container.scrollTo({ top: offset, behavior: "smooth" });

                // jQuery('#playlist_scrollBox').animate({
                //     scrollTop: offset
                // }, 500);
            });

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
        },
    },
    methods: {
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
                $('#mstream-player2').toggleClass("blur_trans");
                this.isViz = false;
            } else {
                this.isViz = true;
                $('#main-overlay').fadeIn("slow", function () {
                    var isInit = VIZ.initPlayer();
                    if (isInit === false) {
                        VIZ.updateSize();
                    }
                    $('#mstream-player2').toggleClass("blur_trans");
                });
            }
        },
        toggleVolume: function () {
            if (this.playerStats.volume === 0) {
                //Recover last saved Vol
                this.curVol = this.lastVol;
                this.$refs.volume_bar.noUiSlider.set(this.curVol);
            } else {
                //Save last Vol
                this.lastVol = MSTREAMPLAYER.playerStats.volume;
                this.$refs.volume_bar.noUiSlider.set(0);
            }
        },
        rewind30: function () {
            MSTREAMPLAYER.goBackSeek(30);
        },
        forward30: function () {
            MSTREAMPLAYER.goForwardSeek(30);
        },
        searchTitle: function () {
            setupSearchPanel();
            let post = {
                search: "test"
            }
            var playerStats = this.playerStats;
            const searchMap = {
                albums: {
                    name: 'Album',
                    class: 'albumz',
                    data: 'album'
                },
                artists: {
                    name: 'Artist',
                    class: 'artistz',
                    data: 'artist'
                },
                files: {
                    name: 'File',
                    class: 'filez',
                    data: 'file_location'
                },
                title: {
                    name: 'Song',
                    class: 'filez',
                    data: 'file_location'
                }
            };

            if (playerStats.metadata.title) {
                post.search = playerStats.metadata.title;
                console.log("Suche:", post.search)
                MSTREAMAPI.search(post, function (res, error) {
                    if (error !== false) {
                        $('#search-results').html('<div>Server call failed</div>');
                        return boilerplateFailure(res, error);
                    }
                    // Populate list
                    var searchList = ['<div class="clear flatline"></div>'];
                    Object.keys(res).forEach(function (key) {
                        res[key].forEach(function (value, i) {
                            // perform some operation on a value;
                            if (value.filepath) {
                                searchList.push(`<div data-${searchMap[key].data}="${value.filepath}" class="${searchMap[key].class}"><b>${searchMap[key].name}:</b> ${value.name}</div>`);
                            } else {
                                searchList.push(`<div data-${searchMap[key].data}="${value.name}" class="${searchMap[key].class}"><b>${searchMap[key].name}:</b> ${value.name}</div>`);
                            }
                        });
                    });

                    if (searchList.length < 2) {
                        searchList.push('<h5>No Results Found</h5>');
                    }

                    $('#search-results').html(searchList);
                    console.log(res);
                    console.log(error);
                });
            }

        }
    },
    mounted: function() {

        // Get current value (if stored) and set volume slider start value and player volume to stored volume
        if (typeof (Storage) !== "undefined") {
            if ($.isNumeric(localStorage.getItem("volume")))
            this.curVol = localStorage.getItem("volume");
        }
        MSTREAMPLAYER.changeVolume(parseInt(this.curVol));
        this.volume_bar.start = parseInt(this.curVol);

        // ------------------- Volume Slider ------------------------
        noUiSlider.create(this.$refs.volume_bar, {
            start: this.volume_bar.start,
            connect: 'lower',
            range: {
              'min': this.volume_bar.min,
              'max': this.volume_bar.max
            }
          });

        // "update" calls function while being changed -> "live update"
        this.$refs.volume_bar.noUiSlider.on('update',function (values, handle) {
            this.curVol = parseInt(values[handle]);
            //console.log("CurVol: ", this.curVol);
            MSTREAMPLAYER.changeVolume(this.curVol);
            console.log(MSTREAMPLAYER.playerStats.volume);

            // TODO: This could probably be done better with v-bind:class but I cant get it to live update on change of curVol
            if (this.curVol >= 66) {
                $("#volume_icon").removeClass("mdi-volume-medium mdi-volume-low mdi-volume-mute").addClass("mdi-volume-high");
            }
            if (this.curVol < 66 && this.curVol >= 33) {
                $("#volume_icon").removeClass("mdi-volume-high mdi-volume-low mdi-volume-mute").addClass("mdi-volume-medium");
            }
            if (this.curVol < 33 && this.curVol > 0) {
                $("#volume_icon").removeClass("mdi-volume-high mdi-volume-medium mdi-volume-mute").addClass("mdi-volume-low");
            }
            if (this.curVol === 0) {
                $("#volume_icon").removeClass("mdi-volume-high mdi-volume-low mdi-volume-medium").addClass("mdi-volume-mute");
            }
        });
        
        // "change" calls function once when slider is released
        this.$refs.volume_bar.noUiSlider.on('change',function (values, handle) {
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("volume", this.curVol);
            }
        });


        // ---------------- Track Progress Bar ----------------------
        noUiSlider.create(this.$refs.progress_bar, {
            start: this.progress_bar.start,
            connect: 'lower',
            range: {
              'min': this.progress_bar.min,
              'max': this.progress_bar.max
            }
          });

        this.$refs.progress_bar.noUiSlider.on('slide',function (values, handle) {
            //console.log(parseInt(values[handle]));
            //this.set(values[handle]);
            MSTREAMPLAYER.seekByPercentage(values[handle]);
        });
    }
});
