var VUEPLAYER = (function () {
  const mstreamModule = {};
  mstreamModule.playlists = [];

  var currentPopperSongIndex2;
  var currentPopperSongIndex;
  var currentPopperSong;

  var cpsi;
  var cps;

  // Hide rating popover on click
  $(document).mouseup(function (e) {
    if (!($(e.target).hasClass("pop-c"))) {
      $("#pop").css("visibility", "hidden");
      currentPopperSongIndex = false;
    }

    if (!($(e.target).hasClass("pop-d"))) {
      $("#pop-d").css("visibility", "hidden");
      cpsi = false;
    }
  });

  Vue.component('popper-playlist-item', {
    template: '<div class="pop-list-item" v-on:click="addToPlaylist($event)">&#8226; {{playlistName}}</div>',
    props: ['index', 'playlist'],
    methods: {
      addToPlaylist: function (event) {
        MSTREAMAPI.addToPlaylist(this.playlist.name, cps.filepath, function (res, err) {
          if (err) {
            iziToast.error({
              title: 'Failed to add song',
              position: 'topCenter',
              timeout: 3500
            });
            return;
          }
          iziToast.success({
            title: 'Song Added!',
            position: 'topCenter',
            timeout: 3500
          });
        });
      }
    },
    computed: {
      playlistName: function () {
        return this.playlist.name;
      }
    }
  });

  // Template for playlist items
  Vue.component('playlist-item', {
    template: '\
        <div class="noselect playlist-item row m-0 align-items-center" v-bind:class="{ playing: (this.index === positionCache.val), playError: (this.songError && this.songError === true) }" >\
          <div class="col">\
            <div class="row align-items-center">\
                <div class="col-auto">\
                    <span class="drag-handle mdi-set mdi-swap-vertical icon_normal"></span>\
                </div>\
                <div v-on:click="goToSong($event)" class="col pl-0 pr-0 d-flex flex-column">\
                    <span class="col_track_title"> {{ trackTitle }} </span>\
                    <span class="col_track_artist"> {{ trackArtist }} </span>\
                </div>\
                <div class="song-button-box sbb_fold row align-items-center flex-nowrap">\
                  <div class="col p-0">\
                    <span class="fold mdi-set mdi-chevron-left icon_normal"></span>\
                  </div>\
                  <div class="col p-0 overflow-hidden">\
                    <span title="Add to existing Playlist" v-on:click="createPopper2($event)" class="mdi-set mdi-plus icon_normal popperMenu pop-d">\
                    </span>\
                  </div>\
                  <div class="col p-0 overflow-hidden">\
                    <span title="Rate Song" v-on:click="createPopper($event)" class="mdi-set mdi-star icon_normal songDropdown pop-c">\
                    </span>\
                    <span class="sbb_rating_number">{{ratingNumber}}</span>\
                  </div><div class="col p-0 overflow-hidden">\
                    <span title="Download Song" v-on:click="downloadSong($event)" class="mdi-set mdi-download icon_normal downloadPlaylistSong"></span>\
                  </div>\
                  <div class="col p-0 overflow-hidden">\
                    <span title="Remove Song" v-on:click="removeSong($event)" class="mdi-set mdi-delete icon_normal removeSong"></span>\
                  </div>\
                </div>\
            </div>\
          </div>\
        </div>',

    props: ['index', 'song'],

    // We need the positionCache to track the currently playing song
    data: function () {
      return {
        positionCache: MSTREAMPLAYER.positionCache,
      }
    },

    // Methods used by playlist item events
    methods: {
      // Go to a song on item click
      goToSong: function (event) {
        MSTREAMPLAYER.goToSongAtPosition(this.index);
      },
      // Remove song
      removeSong: function (event) {
        MSTREAMPLAYER.removeSongAtPosition(this.index, false);
      },
      downloadSong: function (event) {
        $("#download-file").attr("href", "/media/" + this.song.filepath + "?token=" + MSTREAMAPI.currentServer.token);
        document.getElementById('download-file').click();
        console.log(MSTREAMAPI.currentServer.token);
      },
      createPopper: function (event) {
        if (currentPopperSongIndex === this.index) {
          currentPopperSongIndex = false;
          $("#pop").css("visibility", "hidden");
          return;
        }
        var ref = event.target;
        currentPopperSongIndex = this.index;
        currentPopperSongIndex2 = this.index;

        currentPopperSong = this.song;

        $('.my-rating').starRating('setRating', this.song.metadata.rating / 2)

        const pop = document.getElementById('pop');
        new Popper(ref, pop, {
          placement: 'bowrgwr', // Putting jibberish here gives us the behavior we want.  It's not a bug, it's a feature
          onCreate: function (data) {
            $("#pop").css("visibility", "visible");
          },
          modifiers: {
            flip: {
              boundariesElement: 'scrollParent',
            },
            preventOverflow: {
              boundariesElement: 'scrollParent'
            }
          }
        });
      },
      createPopper2: function (event) {
        if (cpsi === this.index) {
          cpsi = false;
          $("#pop-d").css("visibility", "hidden");
          return;
        }
        var ref = event.target;
        cpsi = this.index;

        cps = this.song;

        const pop = document.getElementById('pop-d');
        new Popper(ref, pop, {
          placement: 'bowrgwr', // Putting jibberish here gives us the behavior we want.  It's not a bug, it's a feature
          onCreate: function (data) {
            $("#pop-d").css("visibility", "visible");
          },
          modifiers: {
            flip: {
              boundariesElement: 'scrollParent',
            },
            preventOverflow: {
              boundariesElement: 'scrollParent'
            }
          }
        });
      },
    },
    computed: {
      trackTitle: function () {
        var returnThis = this.song.filepath;
        filepathArray = returnThis.split("/");
        returnThis = filepathArray[filepathArray.length - 1];

        if (this.song.metadata.title) {
          returnThis = this.song.metadata.title;
        }

        return returnThis;
      },
      trackArtist: function () {
          let returnThis = '';

          if (this.song.metadata.artist) {
              returnThis = this.song.metadata.artist;
          }
  
          return returnThis;
      },
      songError: function () {
        return this.song.error;
      },
      ratingNumber: function () {
        if (!this.song.metadata.rating) {
          return '';
        }
        var returnThis = this.song.metadata.rating / 2;
        if (!Number.isInteger(returnThis)) {
          returnThis = returnThis.toFixed(1);
        }

        return returnThis;
      }
    }
  });

  // Code to update playlist
  new Vue({
    el: '#playlist',
    data: {
      playlist: MSTREAMPLAYER.playlist,
      playlists: mstreamModule.playlists
    },
    methods: {
      // checkMove is called when a drag-and-drop action happens
      checkMove: function (event) {
        $("#pop").css("visibility", "hidden");
        MSTREAMPLAYER.resetPositionCache();
      }
    }
  });


  var jukeStats = false
  if (typeof JUKEBOX !== 'undefined') {
    jukeStats = JUKEBOX.stats
  }

  if (document.getElementById("meta-box")) {
    new Vue({
      el: '#meta-box',
      data: {
        meta: MSTREAMPLAYER.playerStats.metadata,
        path: ''
      },
      computed: {
        albumArtPath: function () {
          var meta = this.meta;
          this.path = meta.filepath;
          if (!meta['album-art']) {
            return '/public/img/default.png';
          }
          return '/album-art/' + meta['album-art'] + '?token=' + MSTREAMAPI.currentServer.token;
        }
      },
      methods: {
        metaboxToggle: function () {
          $('#meta-box').toggleClass("expanded");
          $('.meta-box-grip-icon').toggleClass("mdi-chevron-up mdi-chevron-down");
        }
      }
    });
  }

  /*
  // Button Events
  document.getElementById("progress-bar").addEventListener("click", function (event) {
    var relativeClickPosition = event.clientX - this.getBoundingClientRect().left;
    var totalWidth = this.getBoundingClientRect().width;
    var percentage = (relativeClickPosition / totalWidth) * 100;
    // Set Player time
    MSTREAMPLAYER.seekByPercentage(percentage);
  });*/

  /*
  // Button Events
  document.getElementById("next-button").addEventListener("click", function () {
    MSTREAMPLAYER.nextSong();
  });
  document.getElementById("play-pause-button").addEventListener("click", function () {
    MSTREAMPLAYER.playPause();
  });
  document.getElementById("previous-button").addEventListener("click", function () {
    MSTREAMPLAYER.previousSong();
  });*/

  // This makes the title text scroll back and forth
  var scrollTimer;
  var scrollRight = true; //Track Scroll Direction
  var scrollPause = 0;
  /*
  function startTime(interval) {
    if (scrollTimer) {
      clearInterval(scrollTimer);
    }

    scrollTimer = setInterval(function () {
      if (scrollPause > 0) {
        scrollPause = scrollPause - 1;
        return;
      }

      // Get the max scroll distance
      var maxScrollLeft = document.getElementById('title-text').scrollWidth - document.getElementById('title-text').clientWidth;

      // Do the scroll
      if (scrollRight === true) {
        document.getElementById('title-text').scrollLeft = document.getElementById('title-text').scrollLeft + 1;
      } else {
        document.getElementById('title-text').scrollLeft = document.getElementById('title-text').scrollLeft - 1;
      }

      // Change the scroll direction if necessary
      // And set a pause
      if (document.getElementById('title-text').scrollLeft > (maxScrollLeft - 1)) {
        scrollRight = false;
        scrollPause = 50;
      }
      if (document.getElementById('title-text').scrollLeft === 0) {
        scrollRight = true;
        scrollPause = 50;
      }
    }, interval);
  }
  startTime(40);*/


  // Change spacebar behavior to Play/Pause
  window.addEventListener("keydown", function (event) {
    // Use default behavior if user is in a form
    var element = event.target.tagName.toLowerCase();
    if (element == 'input' || element == 'textarea') {
      return;
    }

    // Check the key
    switch (event.keyCode) {
      case 32: //SpaceBar
        event.preventDefault();
        MSTREAMPLAYER.playPause();
        break;
    }
    return false;
  }, false);


  $(".my-rating").starRating({
    starSize: 22,
    disableAfterRate: false,
    useGradient: false,
    hoverColor: '#26477b',
    activeColor: '#6684b2',
    ratedColor: '#6684b2',
    callback: function (currentRating, $el) {
      MSTREAMPLAYER.editSongMetadata('rating', parseInt(currentRating * 2), currentPopperSongIndex2);

      // make a server call here
      MSTREAMAPI.rateSong(currentPopperSong.filepath, parseInt(currentRating * 2), function (res, err) {
        if (err) {
          iziToast.error({
            title: 'Failed to set rating',
            position: 'topCenter',
            timeout: 3500
          });
          return;
        }
      });
    }
  });

  return mstreamModule;
}());