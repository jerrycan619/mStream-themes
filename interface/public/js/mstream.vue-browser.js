

var VUEBROWSER = (function () {
  let mstreamModule = {};

  new Vue({
    el: '#responsive-left-nav',
    data: {
      jukebox: JUKEBOX.stats
    }
  });

  new Vue({
    el: '#sidebar-container',
    data: {
      player: MSTREAMPLAYER.playerStats,
      dbCount : 0,
      dbLocked : false
    },
    computed: {

      playbackRate: function () {
        var rate = Number(this.player.playbackRate);
        return rate.toFixed(2) + 'x'
      }
    },
    methods: {
      logout: function () {
        localStorage.removeItem('token');
        location.reload();
      },
      fullscreen: function () {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);

        var docElm = document.documentElement;
        if (!isInFullScreen) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
      },
    }
  });

  /*
  new Vue({
    el: '#playlist_container',
    methods: {
      downloadPlaylist: function () {
        // Loop through array and add each file to the playlist
        var downloadFiles = [];
        for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
          downloadFiles.push(MSTREAMPLAYER.playlist[i].filepath);
        }

        if (downloadFiles < 1) {
          return;
        }

        // Use key if necessary
        $("#downform").attr("action", "/download?token=" + MSTREAMAPI.currentServer.token);

        $('<input>').attr({
          type: 'hidden',
          name: 'fileArray',
          value: JSON.stringify(downloadFiles),
        }).appendTo('#downform');

        //submit form
        $('#downform').submit();
        // clear the form
        $('#downform').empty();
      }
    }
  });*/

  return mstreamModule;
}());
