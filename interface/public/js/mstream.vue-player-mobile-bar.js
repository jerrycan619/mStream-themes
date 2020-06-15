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
    computed: {
        albumArtPath_bar: function () {
            // if (!this.met['album-art']) {
            //   return '/public/img/default.png';
            // }
            // return '/album-art/' + this.met['album-art'] + '?token=' + MSTREAMAPI.currentServer.token;
            if (!this.met['album-art']) {
                  return '<span class="player_album_icon mdi-set mdi-music"></span>';
            }
            return '<img class="album_art_img responsive_img" src="/album-art/' + this.met['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
        },

        playPauseIcon: function () {

            if (this.playerStats.loading) {
                $('#track_play2').addClass("d-none");
                $('#track_loading2').removeClass("d-none");
                console.log(this.playerStats.loading);
            } else {
                $('#track_loading2').addClass("d-none");
                $('#track_play2').removeClass("d-none");
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

        //TODO: returns a unloaded, loading or loaded for loading icon.. live update?
        //playerState: function() {
        //    return MSTREAMPLAYER.getState();
        //},

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
        }
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
        }
    },
    mounted: function() {
        //When async content in slides put this in updated () {}
        $('.track_info').slick({
            slidesToShow: 1,
            initialSlide: 1,
            infinite: false,
            arrows: false,
            dots: false,
            waitForAnimate: false
        });

        $('.track_info').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            //console.log("beforeChange, current: ", currentSlide);
            //console.log("beforeChange ,next: ", nextSlide);
            if (nextSlide === 2) {
                MSTREAMPLAYER.nextSong();
            }
            if (nextSlide === 0) {
                MSTREAMPLAYER.previousSong();
            }
        });

        $('.track_info').on('afterChange', function(event, slick, currentSlide){
            //console.log("afterChange, current: ", currentSlide);
            if (currentSlide === 2 || currentSlide === 0) {
                //$('.track_info').slick('slickSetOption', "fade", true, true);
                $('#infoBox').css("display", "none"); //for fade in
                $('.track_info').slick('slickGoTo', 1, true);
            }
            if (currentSlide === 1) {
                $("#infoBox").fadeIn();
                //$('.track_info').slick('slickSetOption', "fade", false, true);
                //$('.track_info')[0].slick.refresh();
            }
        });
    }
});
