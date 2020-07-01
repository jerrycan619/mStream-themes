var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

var spinner1_html = '<div class="d-flex justify-content-center">' +
                      '<div class="spinner-border text-secondary spinner_big" role="status">' +
                        '<span class="sr-only">Loading...</span>' +
                      '</div>' +
                    '</div>';
  
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }
  
  function createFileplaylistHtml(dataDirectory, fileLocation = '') {
    return `<div class="col p-0 file_wrapper">
              <div class="row mt-1 mb-1 ml-0 mr-0 overflow-hidden align-items-center">
                <div class="col p-0">
                  <div data-directory="${dataDirectory}" class="fileplaylistz row align-items-center">
                    <div class="col-auto">
                      <span class="mdi-set mdi-playlist-music dir_icon"></span>
                    </div>
                    <div class="col pl-0">
                      <span class="item-text">${dataDirectory}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="song-button-box row align-items-center flex-nowrap sbb_fold ">
                <div class="col">
                  <span class="fold mdi-set mdi-chevron-left"></span>
                </div>
                <div class="col">
                  <span title="Add All To Queue" class="addFileplaylist mdi-set mdi-playlist-plus" data-directory="${dataDirectory}"></span>
                </div>
                <div class="col">
                  <span data-directory="${dataDirectory}" title="Download Playlist" class="downloadFileplaylist mdi-set mdi-download"></span>
                </div>
                <div class="col">
                    <span onclick="editSongModal('${fileLocation}');" class="mdi-set mdi-pencil editSong"></span>
                </div>
              </div>
            </div>`;
  }
  
  function createMusicfileHtml(fileLocation, title, titleClass, showEdit) {
    let editButton = '';
    if (showEdit) {
      editButton = `
      <div class="col">
        <span onclick="editSongModal('${fileLocation}');" class="mdi-set mdi-pencil editSong"></span>
      </div>`;
    }

    return `<div class="col-auto p-0 file_wrapper">
              <div class="row mt-1 mb-1 ml-0 mr-0 overflow-hidden align-items-center">  
                <div class="col p-0">
                  <div data-file_location="${fileLocation}" class="filez row m-0 align-items-center"> 
                    <div class="col-auto pl-0">
                      <span class="mdi-set mdi-music-note dir_icon"></span> 
                    </div>
                    <div class="col p-0">
                      <span class="${titleClass}">${title}</span>
                    </div>
                  </div> 
                </div>
                <div class="song-button-box row align-items-center flex-nowrap">
                  ${editButton}
                </div>
              </div>
            </div>`;
  }
  
  $(document).ready(function () {
    new ClipboardJS('.fed-copy-button');

    if(localStorage.getItem("enableRadio") === "true") {
      $('#get_radio').removeClass('d-none');
    }
  
    // Responsive active content
    $(document).on('click', '.activate-panel-1', function (event) {
      $('.activate-panel-1').addClass('active');
      $('.activate-panel-2').removeClass('active');
  
      $('#panel1').addClass('active');
      $('#panel2').removeClass('active');
    });
  
    $(document).on('click', '.activate-panel-2', function (event) {
      $('.activate-panel-2').addClass('active');
      $('.activate-panel-1').removeClass('active');
  
      $('#panel2').addClass('active');
      $('#panel1').removeClass('active');
    });
  
    $(document).on('click', '.hamburger-button', function (event) {
      $('.responsive-left-nav').toggleClass('hide-on-small');
    });
  
    // Modals
    $("#generateFederationInvite").iziModal({
      title: 'Generate Federation Invitation',
      headerColor: '#5a5a6a',
      focusInput: false,
      padding: 15
    });
    $("#acceptFederationInvite").iziModal({
      title: 'Accept Invitation',
      headerColor: '#5a5a6a',
      focusInput: false,
      padding: 15
    });
    $('#aboutModal').iziModal({
      title: 'Info',
      headerColor: '#5a5a6a',
      width: 475,
      focusInput: false,
      padding: 15
    });
    $('#speedModal').iziModal({
      title: 'Playback',
      headerColor: '#5a5a6a',
      width: 475,
      focusInput: false,
      padding: 15,
      afterRender: function () {
        new Vue({
          el: '#speed-bar',
          data: {
            curSpeed: 1
          },
          watch: {
            curSpeed: function () {
              MSTREAMPLAYER.changePlaybackRate(this.curSpeed);
            }
          },
        });
      }
    });
    $(document).on('click', '.trigger-accept-invite', function (event) {
      event.preventDefault();
      $('#acceptFederationInvite').iziModal('open');
    });
    $(document).on('click', '.trigger-generate-invite', function (event) {
      // Populate the modal
      $('#federation-invite-checkbox-area').html('');
      for (var i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
        $('#federation-invite-checkbox-area').append('<input checked id="fed-folder-' + MSTREAMAPI.currentServer.vpaths[i] + '" type="checkbox" name="federate-this" value="' + MSTREAMAPI.currentServer.vpaths[i] + '"><label for="fed-folder-' + MSTREAMAPI.currentServer.vpaths[i] + '">' + MSTREAMAPI.currentServer.vpaths[i] + '</label><br>');
      }
  
      $('#invite-public-url').val(window.location.origin);
  
      event.preventDefault();
      $('#generateFederationInvite').iziModal('open');
    });
  
    $(document).on('click', '.nav-logo', function (event) {
      event.preventDefault();
      $('#aboutModal').iziModal('open');
    });
    $(document).on('click', '.trigger-playback-modal', function (event) {
      event.preventDefault();
      $('#speedModal').iziModal('open');
    });
    $('#generateFederationInvite').iziModal('setTop', '12%');
    $('#acceptFederationInvite').iziModal('setTop', '12%');
    
    $('#aboutModal').iziModal('setTop', '10%');
    $('#speedModal').iziModal('setTop', '12%');
  
    // Dropzone
    const myDropzone = new Dropzone(document.body, {
      previewsContainer: false,
      clickable: "#uploadFile",
      url: '/upload',
      maxFilesize: null
    });
  
    myDropzone.on("addedfile", function (file) {
      if (programState[0].state !== 'fileExplorer') {
        iziToast.error({
          title: 'Files can only be added to the file explorer',
          position: 'topCenter',
          timeout: 3500
        });
        myDropzone.removeFile(file);
      } else if (fileExplorerArray.length < 1) {
        iziToast.error({
          title: 'Cannot Upload File Here',
          position: 'topCenter',
          timeout: 3500
        });
        myDropzone.removeFile(file);
      } else {
        if (file.fullPath) {
          file.directory = getFileExplorerPath() + file.fullPath.substring(0, file.fullPath.indexOf(file.name));
        } else {
          file.directory = getFileExplorerPath();
        }
      }
    });
  
    myDropzone.on('sending', function (file, xhr, formData) {
      xhr.setRequestHeader('data-location', encodeURI(file.directory))
      xhr.setRequestHeader('x-access-token', MSTREAMAPI.currentServer.token)
    });
  
    myDropzone.on('totaluploadprogress', function (percent, uploaded, size) {
      $('#upload_progress_bar').attr('aria-valuenow', percent).css('width', percent+'%');
      if (percent === 100) {
        $('#upload_progress_bar').attr('aria-valuenow', 0).css('width', 0);
      }
    });
  
    myDropzone.on('queuecomplete', function (file, xhr, formData) {
      var successCount = 0;
      for (var i = 0; i < myDropzone.files.length; i++) {
        if (myDropzone.files[i].status === 'success') {
          successCount += 1;
        }
      }
  
      if (successCount === myDropzone.files.length) {
        iziToast.success({
          title: 'Files Uploaded',
          position: 'topCenter',
          timeout: 3500
        });
        if (programState[0].state === 'fileExplorer') {
          senddir();
        }
      } else if (successCount === 0) {
        // do nothing
      } else {
        iziToast.warning({
          title: successCount + ' out of ' + myDropzone.files.length + ' were uploaded successfully',
          position: 'topCenter',
          timeout: 3500
        });
  
        if (programState[0].state === 'fileExplorer') {
          senddir();
        }
      }
  
      myDropzone.removeAllFiles()
    });
  
    myDropzone.on('error', function (err, msg, xhr) {
      var iziStuff = {
        title: 'Upload Failed',
        position: 'topCenter',
        timeout: 3500
      };
  
      if (msg.error) {
        iziStuff.message = msg.error;
      }
  
      iziToast.error(iziStuff);
    });
  
    // Lastfm - Setup scrobbling
    MSTREAMPLAYER.scrobble = function () {
      if (MSTREAMPLAYER.playerStats.metadata.artist && MSTREAMPLAYER.playerStats.metadata.title) {
        MSTREAMAPI.scrobbleByMetadata(MSTREAMPLAYER.playerStats.metadata.artist, MSTREAMPLAYER.playerStats.metadata.album, MSTREAMPLAYER.playerStats.metadata.title, function (response, error) {
  
        });
      }
    }
  
    // Lastfm - Setup update Now Playing
    MSTREAMPLAYER.updateNowPlaying = function () {
      console.log('updateNowPlaying called; Duration: ' + MSTREAMPLAYER.playerStats.duration);
      if (MSTREAMPLAYER.playerStats.metadata.artist && MSTREAMPLAYER.playerStats.metadata.title) {
        MSTREAMAPI.nowPlayingByMetadata(MSTREAMPLAYER.playerStats.metadata.artist, MSTREAMPLAYER.playerStats.metadata.album, MSTREAMPLAYER.playerStats.metadata.title, MSTREAMPLAYER.playerStats.duration, function (response, error) {
  
        });
      }
    }
  
    // Auto Focus
    Vue.directive('focus', {
      // When the bound element is inserted into the DOM...
      inserted: function (el) {
        // Focus the element
        el.focus()
      }
    });
  
  
    new Vue({
      el: '#login_overlay',
      data: {
        pending: false
      },
      methods: {
        submitCode: function (e) {
          // Get Code
          this.pending = true;
          var that = this;
          MSTREAMAPI.login($('#login_username').val(), $('#login_password').val(), function (response, error) {
            that.pending = false;
            if (error !== false) {
              // Alert the user
              iziToast.error({
                title: 'Login Failed',
                position: 'topCenter',
                timeout: 3500
              });
              return;
            }
  
            // Local Storage
            if (typeof (Storage) !== "undefined") {
              localStorage.setItem("token", response.token);
            }
  
            // Add the token the URL calls
            MSTREAMAPI.updateCurrentServer($('#login_username').val(), response.token, response.vpaths)
  
            loadFileExplorer();
            callOnStart();
  
            // Remove the overlay
            $('#login_overlay').slideUp("slow");
            $('#main_content').removeClass("d-none");
            $('#main_content').addClass("d-block");

            //Refresh slick because sometimes (on Firefox) it has a width of 0 after login
            $('.track_info').slick("refresh");
          });
        }
      }
    });
  
    function testIt() {
      var token;
      if (typeof (Storage) !== "undefined") {
        token = localStorage.getItem("token");
      }
  
      if (token) {
        MSTREAMAPI.currentServer.token = token;
      }
  
      MSTREAMAPI.ping(function (response, error) {
        if (error !== false) {
          //$('#login_overlay').slideDown("slow");
          $('#login_overlay').css("display", "block");
          $('#main_content').removeClass("d-block");
          $('#main_content').addClass("d-none");
          return;
        }
  
        // set vPath
        MSTREAMAPI.currentServer.vpaths = response.vpaths;
  
        // Federation ID
        federationId = response.federationId;
  
        VUEPLAYER.playlists.length = 0;
        $.each(response.playlists, function () {
          VUEPLAYER.playlists.push(this);
        });
  
        if (response.transcode) {
          MSTREAMAPI.transcodeOptions.serverEnabled = true;
          MSTREAMAPI.transcodeOptions.codec = response.transcode.defaultCodec;
          MSTREAMAPI.transcodeOptions.bitrate = response.transcode.defaultBitrate;
        }
  
        // Setup the file browser
        loadFileExplorer();
        callOnStart();
      });
    }
  
    testIt();
    var startInterval = false;
  
    function callOnStart() {
      MSTREAMAPI.dbStatus(function (response, error) {
        if (error) {
          $('.scan-status').html('');
          $('.scan-status-files').html('');
          clearInterval(startInterval);
          startInterval = false;
          return;
        }
  
        // if not scanning
        if (!response.locked || response.locked === false) {
          clearInterval(startInterval);
          startInterval = false;
          $('.scan-status').html('');
          $('.scan-status-files').html('');
  
          return;
        }
  
        // Set Interval
        if (startInterval === false) {
          startInterval = setInterval(function () {
            callOnStart();
          }, 2000);
        }
  
        // Update status
        $('.scan-status').html('Scan In Progress');
        //$('.scan-status-files').html(response.totalFileCount + ' files in DB');
  
        //format totalfilecount: 1230 -> 1.23k , 12300 -> 12.3k , 123000 -> 123k
        let totalFileCount_formatted = 0
        if (response.totalFileCount >= 1000 && response.totalFileCount < 10000) {
          totalFileCount_formatted = formatNumber(response.totalFileCount,2);
        } else if (response.totalFileCount >= 10000 && response.totalFileCount < 100000) {
          totalFileCount_formatted = formatNumber(response.totalFileCount,1);
        } else if (response.totalFileCount >= 100000 && response.totalFileCount < 1000000) {
          totalFileCount_formatted = formatNumber(response.totalFileCount,0);
        } else {
          totalFileCount_formatted = response.totalFileCount;
        }
  
        $('.scan-status-files').html(totalFileCount_formatted);
  
        //n = number , d = decimal places
        function formatNumber(n,d) {
          let x=(''+n).length;
          const p=Math.pow;
          d=p(10,d);
          x-=x%3;
          return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3];
        }
      });
    }
  
  
    ////////////////////////////// Global Variables
    // These vars track your position within the file explorer
    var fileExplorerArray = [];
    // Stores an array of searchable objects
    var currentBrowsingList = [];
    // This variable tracks the state of the explorer column
    var programState = [];
  
    ////////////////////////////////   Administrative stuff
    // when you click an mp3, add it to now playing
    $("#fillContent").on('click', 'div.filez', function () {
      MSTREAMAPI.addSongWizard($(this).data("file_location"), {}, true);
    });
  

    // Clear header buttons
    function clearHeaderBtns() {
      $('#panel_one_header_button2').html("");
      $('#panel_one_header_button2').addClass("d-none");
      $('#panel_one_header_button3').html("");
      $('#panel_one_header_button3').addClass("d-none");
      $('#panel_one_header_button4').html("");
      $('#panel_one_header_button4').addClass("d-none");
      $('#panel_one_header_button5').html("");
      $('#panel_one_header_button5').addClass("d-none");
    }

    // Handle panel stuff
    function resetPanel(panelName) {
      //$('#fillContent').empty();
      $('#directory_bar').show();
      $('#header_btns').show();
  
      $('#search_folders').val('');
      $('.directoryName').html('');

      $('#contentHeader_text').html(panelName);
      clearHeaderBtns();
      $('#uploadFile').parent().addClass("d-none");
    }
  
    function boilerplateFailure(res, err) {
      var msg = 'Call Failed';
      if (err.responseJSON && err.responseJSON.error) {
        msg = err.responseJSON.error;
      }
  
      iziToast.error({
        title: msg,
        position: 'topCenter',
        timeout: 3500
      });
    }
  
    // clear the playlist
    $("#clear").on('click', function () {
      MSTREAMPLAYER.clearPlaylist();
    });
  
    /////////////////////////////////////// File Explorer
    function loadFileExplorer() {
      $('ul.left-nav-menu li').removeClass('selected');
      $('#get_file_explorer').addClass('selected');
      $('#header_btns').show();

      //add padding which was removed by library/system because of slides spacing
      $('.filelist_wrapper').removeClass("p-0");
  
      resetPanel('File Explorer', 'scrollBoxHeight1');
      programState = [{
        state: 'fileExplorer'
      }];
      $('#directory_bar').show();
  
      // Reset file explorer vars
      fileExplorerArray = [];
  
      if (MSTREAMAPI.currentServer.vpaths && MSTREAMAPI.currentServer.vpaths.length === 1) {
        fileExplorerArray.push(MSTREAMAPI.currentServer.vpaths[0]);
        programState.push({
          state: 'fileExplorer',
          previousScroll: 0,
          previousSearch: ''
        });
      }
  
      //send this directory to be parsed and displayed
      senddir();
    }
  
    // Load up the file explorer
    $('#get_file_explorer').on('click', loadFileExplorer);
  
    // when you click on a directory, go to that directory
    $("#fillContent").on('click', 'div.dirz', function () {
      fileExplorerArray.push($(this).data("directory"));
      programState.push({
        state: 'fileExplorer',
        previousScroll: document.getElementById('fillContent').scrollTop,
        previousSearch: $('#search_folders').val()
      });
      senddir();
    });
  
    // when you click on a playlist, go to that playlist
    $("#fillContent").on('click', 'div.fileplaylistz', function () {
      listFileplaylist($(this).data("directory"));
    });

    window.listFileplaylist = function (file, refresh = false) {
      if (!refresh) {fileExplorerArray.push(file);}
      programState.push({
        state: 'fileExplorer',
        previousScroll: document.getElementById('fillContent').scrollTop,
        previousSearch: $('#search_folders').val()
      });
      var directoryString = getFileExplorerPath();

      $('.directoryName').html('/' + directoryString.substring(0, directoryString.length - 1));
      $('#fillContent').html(spinner1_html);

      MSTREAMAPI.loadFileplaylist(directoryString, function (response, error) {
        if (error !== false) {
          boilerplateFailure(response, error);
          return;
        }
        printdir(response, '', false);
        const directoryString2 = directoryString.replace(/\/$/, ''); //remove tailing "/"
        $('#panel_one_header_button5').html(`<span onclick="editM3uModal('${directoryString2}','${file}');" title="Edit Playlist" id="editM3u" class="mdi-set mdi-pencil header_icon"></span>`);
        $('#uploadFile').parent().addClass("d-none");
      });
    };
  
    // when you click the back directory
    $(".backButton").on('click', function () {
      if (programState.length < 2) {
        return;
      }
  
      var thisState = programState.pop();
      var backState = programState[programState.length - 1];
  
      if (backState.state === 'allPlaylists') {
        console.log("Back to getAllPlaylists");
        getAllPlaylists(thisState);
      } else if (backState.state === 'allAlbums') {
        console.log("Back to allAlbums");
        getAllAlbums(thisState);
      } else if (backState.state === 'allArtists') {
        console.log("Back to allArtists");
        getAllArtists(thisState);
      } else if (backState.state === 'artist') {
        console.log("Back to artist");
        getArtistsAlbums(backState.name, thisState);
      } else if (backState.state === 'fileExplorer') {
        console.log("Back to fileExplorer");
        fileExplorerArray.pop();
        senddir(thisState);
      } else if (backState.state === 'searchPanel') {
        console.log("Back to searchPanel");
        setupSearchPanel(backState.searchTerm);
      }
    });
  
    // send a new directory to be parsed.
    window.senddir = function (previousState) {
      // Construct the directory string
      var directoryString = getFileExplorerPath();
  
      var displayString = directoryString;
      if (displayString.substring(0, 1) !== '/') {
        displayString = '/' + displayString;
      }
  
      $('.directoryName').html(displayString);
      $('#fillContent').html(spinner1_html);
  
      MSTREAMAPI.dirparser(directoryString, false, function (response, error) {
        if (error !== false) {
          boilerplateFailure(response, error);
          return;
        }
  
        // Set any directory views
        // hand this data off to be printed on the page
        printdir(response, previousState);
        console.log(response);
      });
    }
  
  
    // function that will receive JSON array of a directory listing.  It will then make a list of the directory and tack on classes for functionality
    function printdir(response, previousState, showEdit = true) {
      currentBrowsingList = response.contents;
  
      // clear the list
      $('#search_folders').val('');
  
      //parse through the json array and make an array of corresponding divs
      var filelist = [];
      $.each(currentBrowsingList, function () {
        const fileLocation = this.path || response.path + this.name;

        //in vpath root don't display dir create / edit buttons
        let hideButtonClass = '';
        if(fileLocation.startsWith("/")) {
          $('#createDir').parent().addClass('d-none');
          hideButtonClass = 'd-none';
        } else {
          $('#createDir').parent().removeClass('d-none');
          $('.editDir').parent().removeClass('d-none');
        }

        if (this.type == 'directory' || this.type == 'symLink') {
          filelist.push(`<div class="col-auto p-0">
                          <div class="row mt-1 mb-1 ml-0 mr-0 align-items-center overflow-hidden">
                            <div class="col p-0 file_wrapper">
                              <div data-directory="${this.name}" class="dirz row m-0 align-items-center">
                                <div class="col-auto pl-0">
                                  <span class="mdi-set mdi-folder-music dir_icon"></span>
                                </div>
                                <div class="col pl-0">
                                  <span class="item-text">${this.name}</span>
                                </div>
                              </div>
                              <div class="song-button-box row align-items-center flex-nowrap sbb_fold ">
                                <div class="col">
                                  <span class="fold mdi-set mdi-chevron-left"></span>
                                </div>
                                <div class="col">
                                  <span title="Add All To Queue" class="recursiveAddDir mdi-set mdi-playlist-plus" data-directory="${this.name}"></span>
                                </div>
                                <div class="col">
                                  <span data-directory="${this.name}" title="Download Directory" class="downloadDir mdi-set mdi-download"></span>
                                </div>
                                <div class="col ${hideButtonClass}">
                                  <span data-directory="${this.name}" title="Edit Directory" class="editDir mdi-set mdi-pencil"></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`);
        } else {
          if (this.type == 'm3u') {
            filelist.push(createFileplaylistHtml(this.name, fileLocation));
          } else {
            const title = this.artist != null || this.title != null ? this.artist + ' - ' + this.title : this.name;
            filelist.push(createMusicfileHtml(fileLocation, title, "item-text", showEdit));
          }
        }
      });
  
      // Post the html to the filelist div
      $('#fillContent').html("<div data-simplebar class='col p-0 h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + filelist.join("") + "</div></div>");
      $('#uploadFile').parent().removeClass("d-none");
      $('#panel_one_header_button5').html("<span onclick='createDirModal();' title='Create Directory' class='add mdi-set mdi-folder-plus header_icon' id='createDir'></span>");
  
      if (previousState && previousState.previousScroll) {
        $('#fillContent').scrollTop(previousState.previousScroll);
      }
  
      if (previousState && previousState.previousSearch) {
        $('#search_folders').val(previousState.previousSearch).trigger('change');
      }
    }
  
    // when you click 'add directory', add entire directory to the playlist
    $("#addall").on('click', function () {
      //make an array of all the mp3 files in the current directory
      var elems = document.getElementsByClassName('filez');
      var arr = jQuery.makeArray(elems);
  
      //loop through array and add each file to the playlist
      $.each(arr, function () {
        MSTREAMAPI.addSongWizard($(this).data("file_location"), {}, true);
      });
    });
  
  
    //######################### Search on Directory Bar - Search Files #########################
    $('#search_folders').on('change keyup', function () {
      var searchVal = $(this).val();
  
      // Do nothing if we are in the search panel
      if (document.getElementById('db-search')) {
        return;
      }
  
      var filelist = [];
      // This causes an error in the playlist display
      $.each(currentBrowsingList, function () {
        var lowerCase = this.name !== null ? this.name.toLowerCase() : 'null';
        
        if (lowerCase.indexOf(searchVal.toLowerCase()) !== -1) {
          let type_icon = '';
          let info = [];

          if (this.type === 'directory') {
            type_icon = '<span class="mdi-set mdi-folder-music dir_icon"></span>';
            //filelist.push('<div class="clear relative"><div data-directory="' + this.name + '" class="dirz"><img class="folder-image" src="/public/img/folder.svg"><span class="item-text">' + this.name + '</span></div><div data-directory="' + this.name + '" class="song-button-box"><span title="Add All To Queue" class="recursiveAddDir" data-directory="' + this.name + '"><svg xmlns="http://www.w3.org/2000/svg" height="9" width="9" viewBox="0 0 1280 1276"><path d="M6760 12747 c-80 -5 -440 -10 -800 -11 -701 -2 -734 -4 -943 -57 -330 -84 -569 -281 -681 -563 -103 -256 -131 -705 -92 -1466 12 -241 16 -531 16 -1232 l0 -917 -1587 -4 c-1561 -3 -1590 -3 -1703 -24 -342 -62 -530 -149 -692 -322 -158 -167 -235 -377 -244 -666 -43 -1404 -42 -1813 7 -2355 21 -235 91 -400 233 -548 275 -287 730 -389 1591 -353 1225 51 2103 53 2330 7 l60 -12 6 -1489 c6 -1559 6 -1548 49 -1780 100 -535 405 -835 933 -921 88 -14 252 -17 1162 -24 591 -4 1099 -4 1148 1 159 16 312 56 422 112 118 59 259 181 333 290 118 170 195 415 227 722 18 173 21 593 6 860 -26 444 -32 678 -34 1432 l-2 811 54 7 c30 4 781 6 1670 5 1448 -2 1625 -1 1703 14 151 28 294 87 403 168 214 159 335 367 385 666 15 85 29 393 30 627 0 105 4 242 10 305 43 533 49 1047 15 1338 -44 386 -144 644 -325 835 -131 140 -278 220 -493 270 -92 21 -98 21 -1772 24 l-1680 3 3 1608 c2 1148 0 1635 -8 1706 -49 424 -255 701 -625 841 -243 91 -633 124 -1115 92z" transform="matrix(.1 0 0 -.1 0 1276)"/></svg></span><span class="downloadDir"><svg width="12" height="12" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg"><path d="M1803 960q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z"/></svg></span></div></div>');
            filelist.push(`<div class="col-auto p-0">
                            <div class="row mt-1 mb-1 ml-0 mr-0 align-items-center overflow-hidden">
                              <div class="col p-0 file_wrapper">
                                <div data-directory="${this.name}" class="dirz row m-0 align-items-center">
                                  <div class="col-auto pl-0">
                                    ${type_icon}
                                  </div>
                                  <div class="col pl-0">
                                    <span class="item-text">${this.name}</span>
                                  </div>
                                </div>
                                <div class="song-button-box row align-items-center flex-nowrap sbb_fold ">
                                  <div class="col">
                                    <span class="fold mdi-set mdi-chevron-left"></span>
                                  </div>
                                  <div class="col">
                                    <span title="Add All To Queue" class="recursiveAddDir mdi-set mdi-playlist-plus" data-directory="${this.name}"></span>
                                  </div>
                                  <div class="col">
                                    <span data-directory="${this.name}" title="Download Directory" class="downloadDir mdi-set mdi-download"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>`);
          } else if (this.type === 'playlist') {
            filelist.push('<div data-playlistname="' + encodeURIComponent(this.name) + '" class="playlist_row_container">' +
                            '<span data-playlistname="' + encodeURIComponent(this.name) + '" class="playlistz force-width">' + 
                              escapeHtml(this.name) + 
                            '</span>' +
                          '<div class="song-button-box">' +
                            '<span data-playlistname="' + encodeURIComponent(this.name) + '" class="deletePlaylist">Delete</span>' +
                          '</div>' +
                        '</div>');
          } else if (this.type === 'album') {
            var artistString = this.artist ? 'data-artist="' + this.artist + '"' : '';
            var albumString = this.name ? this.name : 'SINGLES';

            info[0] = '';
            info[1] = albumString;
  
            if (this.album_art_file) {
              //lazyload???
              //type_icon = '<img class="album-art-box"  data-original="/album-art/' + this.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
              type_icon = '<img class="album-art-box dir_icon"  src="/album-art/' + this.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
            } else {
              type_icon = '<span class="mdi-set mdi-album dir_icon"></span>';
              //filelist.push('<div ' + artistString + ' data-album="' + this.name + '" class="albumz"><img class="album-art-box" src="/public/img/default.png"><span class="explorer-label-1">' + albumString + '</span></div>');
            }

            filelist.push(`<div ${artistString} data-album="${this.name}" class="albumz row m-2 align-items-center">
                                  <div class="col">
                                    <div class="row align-items-center">
                                      <div class="col-auto">
                                        ${type_icon}
                                      </div>
                                      <div class="col pl-0 d-flex flex-column">
                                        <span class="col_track_title">${info[1]}</span>
                                        <span class="col_track_artist">${info[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>`);

          } else if (this.type === 'artist') {
            filelist.push('<div data-artist="' + this.name + '" class="artistz">' + this.name + ' </div>');
          } else {
            if (programState[programState.length - 1].state === 'playlist') {
              if (!this.metadata || !this.metadata.title) {
                filelist.push('<div data-file_location="' + this.filepath + '" class="filez"><img class="album-art-box" src="/public/img/default.png"><span class="explorer-label-1">' + this.filepath + '</span></div>');
              } else if (this.metadata['album-art']) {
                filelist.push('<div data-file_location="' + this.filepath + '" class="filez"><img class="album-art-box"  data-original="/album-art/' + this.metadata['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '"><span class="explorer-label-1">' + this.metadata.artist + ' - ' + this.metadata.title + '</span></div>');
              } else {
                filelist.push('<div data-file_location="' + this.filepath + '" class="filez"><img class="album-art-box" src="/public/img/default.png"><span class="explorer-label-1">' + this.metadata.artist + ' - ' + this.metadata.title + '</span></div>');
              }
            } else if (this.type == "m3u") {
              filelist.push(createFileplaylistHtml(this.name));
            } else {
              const fileLocation = this.path || getFileExplorerPath() + this.name;
              const title = this.artist != null || this.title != null ? this.artist + ' - ' + this.title : this.name;
              filelist.push(createMusicfileHtml(fileLocation, title, "title"));
            }
          }
        }
      });
  
      // Post the html to the filelist div
      $('#fillContent').html("<div data-simplebar class='col p-0 h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + filelist.join("") + "</div></div>");
      //ll.update();
    });
  
    $('#search-explorer').on('click', function () {
      // Hide Filepath
      $('#search_folders').toggleClass('hide');
      // Show Search Input
      $('.directoryName').toggleClass('super-hide');
  
      if (!$('#search_folders').hasClass('hide')) {
        $("#search_folders").focus();
      } else {
        $('#search_folders').val('');
        $("#search_folders").change();
      }
    });
  
    function getFileExplorerPath() {
      return fileExplorerArray.join("/") + "/";
    }
  
    window.getDirectoryString = function (component) {
      var newString = getFileExplorerPath() + component.data("directory");
      if (newString.substring(0, 1) !== '/') {
        newString = "/" + newString
      }
  
      return newString;
    }
  
    function addAllSongs(res) {
      for (var i = 0; i < res.length; i++) {
        MSTREAMAPI.addSongWizard(res[i], {}, true);
      }
    }
  
    $("#fillContent").on('click', '.recursiveAddDir', function () {
      var directoryString = getDirectoryString($(this));
      MSTREAMAPI.recursiveScan(directoryString, function (res, err) {
        if (err !== false) {
          return boilerplateFailure(res, err);
        }
        addAllSongs(res);
      });
    });
  
    $("#fillContent").on('click', '.addFileplaylist', function () {
      var playlistPath = getDirectoryString($(this));
      MSTREAMAPI.loadFileplaylistPaths(playlistPath, function (res, err) {
        if (err !== false) {
          return boilerplateFailure(res, err);
        }
        addAllSongs(res);
      });
    });
  
    $("#fillContent").on('click', '.downloadDir', function () {
      var directoryString = getDirectoryString($(this));
  
      // Use key if necessary
      $("#downform").attr("action", "/download-directory?token=" + MSTREAMAPI.currentServer.token);
  
      $('<input>').attr({
        type: 'hidden',
        name: 'directory',
        value: directoryString,
      }).appendTo('#downform');
  
      //submit form
      $('#downform').submit();
      // clear the form
      $('#downform').empty();
    });
  
    $("#fillContent").on('click', '.downloadFileplaylist', function () {
      var playlistPath = getDirectoryString($(this));
  
      // Use key if necessary
      $("#downform").attr("action", "/fileplaylist/download?token=" + MSTREAMAPI.currentServer.token);
  
      $('<input>').attr({
        type: 'hidden',
        name: 'path',
        value: playlistPath,
      }).appendTo('#downform');
  
      //submit form
      $('#downform').submit();
      // clear the form
      $('#downform').empty();
    });
  
    //////////////////////////////////////  Share playlists
    $('#share_playlist_form').on('submit', function (e) {
      e.preventDefault();
  
      $('#share_it').prop("disabled", true);
      var shareTimeInDays = $('#share_time').val();
  
      // Check for special characters
      if (/^[0-9]*$/.test(shareTimeInDays) == false) {
        console.log('don\'t do that');
        $('#share_it').prop("disabled", false);
        return false;
      }
  
      //loop through array and add each file to the playlist
      var stuff = [];
      for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
        //Do something
        stuff.push(MSTREAMPLAYER.playlist[i].filepath);
      }
  
      if (stuff.length == 0) {
        $('#share_it').prop("disabled", false);
        //If Playlist empty flip modal to warning, after 3s Flip Back
        $('#sharePlaylist .modal--front').css('transform','rotateY(180deg)');
        $('#sharePlaylist .modal--back1').css('transform','rotateY(0deg)');
  
        setTimeout(function() {
          $('#sharePlaylist .modal--front').css('transform','rotateY(0deg)');
          $('#sharePlaylist .modal--back1').css('transform','rotateY(180deg)');
        }, 3000);
        return;
      }
  
      MSTREAMAPI.makeShared(stuff, shareTimeInDays, function (response, error) {
        if (error !== false) {
          return boilerplateFailure(response, error);
        }
        $('#share_it').prop("disabled", false);
        var adrs = window.location.protocol + '//' + window.location.host + '/shared/playlist/' + response.playlist_id;
        $('#copyShareLink').val(adrs);
        $('#copyShareLink').select();
        $('#sharePlaylist .modal--front').css('transform','rotateY(180deg)');
        $('#sharePlaylist .modal--back2').css('transform','rotateY(0deg)');
      });
    });
  
    $('#copyShareLinkButton').click(function (e) {
      /* Get the text field */
      var copyText = document.getElementById("copyShareLink");
  
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
      /* Copy the text inside the text field */
      document.execCommand("copy");
  
      /* Alert the copied text */
      alert("Copied the text: " + copyText.value);
    });
  
  
    //////////////////////////////////////  Save/Load playlists
    // Save a new playlist
    $('#save_playlist_form').on('submit', function (e) {
      e.preventDefault();
  
      // Check for special characters
      if (/^[a-zA-Z0-9-_ ]*$/.test(title) == false) {
        console.log('don\'t do that');
        return false;
      }
  
      if (MSTREAMPLAYER.playlist.length == 0) {
  
        //If Playlist empty flip modal to warning, after 3s Flip Back
        $('#flip-modal-front').css('transform','rotateY(180deg)');
        $('#flip-modal-back1').css('transform','rotateY(0deg)');
  
        setTimeout(function() {
          $('#flip-modal-front').css('transform','rotateY(0deg)');
          $('#flip-modal-back1').css('transform','rotateY(180deg)');
        }, 3000);
  
        return;
      }
  
      var title = $('#playlist_name').val();
  
      //loop through array and add each file to the playlist
      var songs = [];
      for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
        songs.push(MSTREAMPLAYER.playlist[i].filepath);
      }
  
      MSTREAMAPI.savePlaylist(title, songs, function (response, error) {
        if (error !== false) {
          return boilerplateFailure(response, error);
        }
  
        //On Success flip modal to success, close after 3s
        $('#flip-modal-front').css('transform','rotateY(180deg)');
        $('#flip-modal-back2').css('transform','rotateY(0deg)');
  
        setTimeout(function() {
          $('#savePlaylist').modal('hide');
          $('#flip-modal-front').css('transform','rotateY(0deg)');
          $('#flip-modal-back2').css('transform','rotateY(180deg)');
        }, 3000);
  
        if (programState[0].state === 'allPlaylists') {
          getAllPlaylists();
        }
  
        VUEPLAYER.playlists.push({
          name: title,
          type: 'playlist'
        });
      });
    });
  
    // Get all playlists
    $('.get_all_playlists').on('click', function () {
      getAllPlaylists();
    });
  
    function getAllPlaylists(previousState) {
      //resetPanel('Playlists', 'scrollBoxHeight1');
      currentBrowsingList = [];
  
      programState = [{
        state: 'allPlaylists'
      }];
  
      MSTREAMAPI.getAllPlaylists(function (response, error) {
        if (error !== false) {
          $('#getPlaylists').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        VUEPLAYER.playlists.length = 0;
  
        // loop through the json array and make an array of corresponding divs
        var playlists = [];
        $.each(response, function () {
          playlists.push(['<div data-playlistname="' + encodeURIComponent(this.name) + '" class="playlist_row_container row mt-2 mb-2 ml-0 mr-0 align-items-center">' +
                            '<div data-playlistname="' + encodeURIComponent(this.name) + '" class="playlistz col">' +
                              '<div class="row align-items-center">' +
                                '<div class="col-auto pl-0">' +
                                  '<span class="mdi-set mdi-playlist-music dir_icon"></span>' +
                                '</div>' +
                                '<div class="col pl-0 d-flex flex-column">' +
                                  '<span class="col_track_title">' +
                                    escapeHtml(this.name) + 
                                  '</span>' +
                                  '<span class="col_track_artist"></span>' +
                                '</div>' +
                              '</div>' +
                            '</div>' +
                            '<div class="col-auto pr-0">' +
                              '<span data-playlistname="' + encodeURIComponent(this.name) + '" class="deletePlaylist mdi-set mdi-delete dir_icon"></span>' +
                            '</div>' +
                          '</div>']);
          this.type = 'playlist';
          currentBrowsingList.push(this);
          VUEPLAYER.playlists.push(this);
        });
        // Add playlists to the left panel
        //$('#getPlaylists').html(playlists);
        var clusterize = new Clusterize({
          rows: playlists,
          scrollId: 'scrollPlaylists',
          contentId: 'contentPlaylists',
          rows_in_block: 10,
          blocks_in_cluster: 2
        });
  
        if (previousState && previousState.previousScroll) {
          $('#fillContent').scrollTop(previousState.previousScroll);
        }
  
        if (previousState && previousState.previousSearch) {
          $('#search_folders').val(previousState.previousSearch).trigger('change');
        }
      });
    }
  
    // delete playlist
    $("#fillContent").on('click', '.deletePlaylist', function () {
      var playlistname = decodeURIComponent($(this).data('playlistname'));
  
      iziToast.question({
        timeout: 10000,
        close: false,
        overlayClose: true,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 99999,
        title: "Delete '" + playlistname + "'?",
        position: 'center',
        buttons: [
          ['<button><b>Delete</b></button>', function (instance, toast) {
            MSTREAMAPI.deletePlaylist(playlistname, function (response, error) {
              if (error !== false) {
                return boilerplateFailure(response, error);
              }
              $('div[data-playlistname="' + encodeURIComponent(playlistname) + '"]').remove();
            });
            instance.hide({
              transitionOut: 'fadeOut'
            }, toast, 'button');
          }, true],
          ['<button>Go Back</button>', function (instance, toast) {
            instance.hide({
              transitionOut: 'fadeOut'
            }, toast, 'button');
          }],
        ]
      });
    });
  
    $("#fillContent").on('click', '.removePlaylistSong', function () {
      var lokiId = $(this).data('lokiid');
      MSTREAMAPI.removePlaylistSong(lokiId, function (response, error) {
        if (error !== false) {
          return boilerplateFailure(response, error);
        }
        $('div[data-lokiid="' + lokiId + '"]').remove();
      });
    });
  
    // load up a playlist
    $("#fillContent").on('click', '.playlistz', function () {
      var playlistname = decodeURIComponent($(this).data('playlistname'));
      var name = $(this).html();
      $('.directoryName').html('Playlist: ' + name);
      $('#fillContent').html(spinner1_html);
      currentBrowsingList = [];
  
      programState.push({
        state: 'playlist',
        name: playlistname,
        previousScroll: document.getElementById('fillContent').scrollTop,
        previousSearch: $('#search_folders').val()
      });
      $('#search_folders').val('');
  
  
      MSTREAMAPI.loadPlaylist(playlistname, function (response, error) {
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        // Add the playlist name to the modal
        $('#playlist_name').val(name);
  
        //parse through the json array and make an array of corresponding divs
        let files = [];
        
        $.each(response, function (index, value) {
          let albumArt = '';
          let trackTitle = '';
          let trackArtist = '';

          if (!value.metadata || !value.metadata.title) {
            currentBrowsingList.push({
              type: 'file',
              name: value.filepath,
              metadata: value.metadata
            });
            albumArt = '<span class="mdi-set mdi-music-note dir_icon"></span>';
            trackTitle = value.filepath;
            trackArtist = '';
      
          } else if (value.metadata['album-art']) {
            currentBrowsingList.push({
              type: 'file',
              name: value.metadata.artist + ' - ' + value.metadata.title,
              metadata: value.metadata
            });
            //Lazyload???
            //albumArt = '<img class="album-art-box"  data-original="/album-art/' + value.metadata['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
            albumArt = '<img class="album-art-box dir_icon"  src="/album-art/' + value.metadata['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
            trackTitle = value.metadata.title;
            trackArtist = value.metadata.artist;

          } else {
            currentBrowsingList.push({
              type: 'file',
              name: value.metadata.artist + ' - ' + value.metadata.title,
              metadata: value.metadata
            });
            albumArt = '<span class="mdi-set mdi-music-note dir_icon"></span>';
            trackTitle = value.metadata.title;
            trackArtist = value.metadata.artist;
          }

          files.push(`<div class="col-auto p-0">
                        <div data-lokiid="${value.lokiId}" class="row mt-1 mb-1 ml-0 mr-0 align-items-center overflow-hidden">
                          <div class="col p-0">
                            <div data-lokiid="${value.lokiId}" data-file_location="${value.filepath}" class="filez row m-0 align-items-center">
                              <div class="col-auto pl-0">
                                ${albumArt}
                              </div>
                              <div class="col pl-0 d-flex flex-column">
                                <span class="col_track_title">${trackTitle}</span>
                                <span class="col_track_artist">${trackArtist}</span>
                              </div>
                            </div>
                          </div>
                          <div class="col-auto pr-0">
                              <span data-lokiid="${value.lokiId}" class="removePlaylistSong mdi-set mdi-delete dir_icon"></span>
                          </div>
                        </div>
                      </div>`);

        });
  
        $('#fillContent').html("<div data-simplebar class='col p-0 h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + files.join("") + "</div></div>");
        /*var clusterize = new Clusterize({
          rows: files,
          scrollId: 'scrollPlaylists',
          contentId: 'contentPlaylists',
          rows_in_block: 10,
          blocks_in_cluster: 2
        });*/
        // update lazy load plugin
        //ll.update();
      });
    });
  
    /////////////// Download Playlist
    $('#downloadPlaylist').click(function () {
      // Loop through array and add each file to the playlist
      var downloadFiles = [];
      
      for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
        downloadFiles.push(decodeURIComponent(MSTREAMPLAYER.playlist[i].filepath));
  
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
    });
  
  
    // Recent Songs
    $('.get_recent_songs').on('click', function () {
      getRecentlyAdded();
    });
  
    //############### TODO: What does this???? ################
    /*
    $('#libraryColumn').on('keydown', '#recently-added-limit', function (e) {
      if (e.keyCode === 13) {
        $("#recently-added-limit").blur();
      }
    });
  
    $('#libraryColumn').on('focusout', '#recently-added-limit', function () {
      redoRecentlyAdded();
    });*/
  
    function getRecentlyAdded() {
      $('ul.left-nav-menu li').removeClass('selected');
      $('.get_recent_songs').addClass('selected');
      resetPanel('Recently Added', 'scrollBoxHeight1');
      $('#fillContent').html(spinner1_html);
      $('.directoryName').html('Get last &nbsp;&nbsp;<input id="recently-added-limit" class="recently-added-input" type="number" min="1" step="1" value="100">&nbsp;&nbsp; songs');
  
      redoRecentlyAdded();
    }
  
    function redoRecentlyAdded() {
      currentBrowsingList = [];
  
      programState = [{
        state: 'recentlyAdded'
      }];
  
      MSTREAMAPI.getRecentlyAdded($('#recently-added-limit').val(), function (response, error) {
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        //parse through the json array and make an array of corresponding divs
        var filelist = [];
        $.each(response, function () {
          if (this.metadata.title) {
            currentBrowsingList.push({
              type: 'file',
              name: this.metadata.artist + ' - ' + this.metadata.title
            })
            filelist.push('<div data-file_location="' + this.filepath + '" class="filez">' +
              '<span class="mdi-set mdi-music-circle-outline file_icon"/>' +
              '<span class="title">' + this.metadata.artist + ' - ' + this.metadata.title + '</span>' +
              '</div>');
          } else {
            currentBrowsingList.push({
              type: 'file',
              name: this.metadata.filename
            })
            filelist.push('<div data-file_location="' + this.filepath + '" class="filez">' + 
              '<span class="mdi-set mdi-music-circle-outline file_icon"/>' + 
              '<span class="title">' + this.metadata.filename + '</span>' +
              '</div>');
          }
        });
  
        $('#fillContent').html(filelist);
      });
    }

    //###################### Library View ##################
    $('#get_library').on('click', function () {
        $('#contentHeader_text').html("Library");
        //TODO: figure out how to search and go back in clusters + slick
        $('#directory_bar').hide();
        $('#header_btns').hide();

        //for spacing between slick slides remove wrapper spacing and add padding in slides
        $('.filelist_wrapper').addClass("p-0");

        $('#fillContent').html(`
            <div class="col-auto slides_lib_nav">
                <div>Albums</div>
                <div>Artists</div>
                <div>Playlists</div>
                <div>Rated</div>
            </div>
            <div class="col p-0 overflow-hidden slides_lib">
                <div id="getAlbums" class="h-100 pl-3 pr-3">
                  <div id="scrollAlbums" class="clusterize-scroll">
                    <div id="contentAlbums" class="clusterize-content">
                      <div class="clusterize-no-data">${spinner1_html}</div>
                    </div>
                  </div>
                </div>
                <div id="getArtists" class="h-100 pl-3 pr-3">
                  <div id="scrollArtists" class="clusterize-scroll">
                    <div id="contentArtists" class="clusterize-content">
                      <div class="clusterize-no-data">${spinner1_html}</div>
                    </div>
                  </div>
                </div>
                <div id="getPlaylists" class="h-100 pl-3 pr-3">
                  <div id="scrollPlaylists" class="clusterize-scroll">
                    <div id="contentPlaylists" class="clusterize-content">
                      <div class="clusterize-no-data">${spinner1_html}</div>
                    </div>
                  </div>
                </div>
                <div id="getRated" class="h-100 pl-3 pr-3">
                  <div id="scrollRated" class="clusterize-scroll">
                    <div id="contentRated" class="clusterize-content">
                      <div class="clusterize-no-data">${spinner1_html}</div>
                    </div>
                  </div>
                </div>
            </div>`);
      

        $('.slides_lib').slick({
            lazyLoad: 'ondemand',
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '.slides_lib_nav',
            infinite: false,
            mobileFirst: true
        });
        
        $('.slides_lib_nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '.slides_lib',
            dots: false,
            centerMode: true,
            centerPadding: '0px',
            focusOnSelect: true,
            infinite: false,
            mobileFirst: true
        });

        
        $('.slides_lib').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            
            if (nextSlide === 1) {
              clearHeaderBtns();
              getAllArtists();
            }
            if (nextSlide === 2) {
              clearHeaderBtns();
              getAllPlaylists();
            }
            if (nextSlide === 3) {
              clearHeaderBtns();
              getRatedSongs();
            }
            
            console.log("current: ", currentSlide);
            //if (nextSlide)
        });

        
        getAllAlbums();
        
    });

    // ###########################################################################################
    // ############################### online Radio ##############################################
    
    window.getAllRadioStations = function () {
      $('ul.left-nav-menu li').removeClass('selected');
      $('.get_all_playlists').addClass('selected');
      resetPanel('Radio', 'scrollBoxHeight1');
      $('#directory_bar').hide();
      $('#filelist').html(spinner1_html);
      currentBrowsingList = [];
  
      programState = [{
        state: 'allRadioStations'
      }];
  
      MSTREAMAPI.getRadioStations(function (response, error) {
        console.log(response);
        console.log(error);
  
        var stations = [];
        $.each(response, function () {
          stations.push(`<div class="col-auto p-0">
                            <div data-stationurl="${this.url}" class="playlist_row_container row mt-1 mb-1 ml-0 mr-0 overflow-hidden align-items-center">
                              <div data-stationurl="${this.url}" data-stationname="${this.name}" class="stationz col p-0">
                                <div class="row m-0 align-items-center">
                                  <div class="col-auto pl-0">
                                    <span class="mdi-set mdi-radio dir_icon"></span>
                                  </div>
                                  <div class="col pl-0 d-flex flex-column">
                                    <span class="col_track_title">
                                      ${escapeHtml(this.name)}
                                    </span>
                                    <span class="col_track_artist"></span>
                                  </div>
                                </div>
                              </div>
                              <div class="col-auto pr-0">
                                <span data-stationid="${this.id}" class="editRadioStation mdi-set mdi-pencil dir_icon"></span>
                              </div>
                            </div>
                          </div>`);
          currentBrowsingList.push(this);
        });
        // Add playlists to the left panel // <div id='downloadAllStations'>Download</div>
        $('#fillContent').html("<div data-simplebar class='col p-0 h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + stations.join("") + "</div></div>");
        $('#panel_one_header_button3').html("<span title='Add radio station' id='addRadioStation' class='mdi-set mdi-plus header_icon'></span>");
        $('#panel_one_header_button4').html("<span title='Import radio stations' id='importStations' class='mdi-set mdi-import header_icon'></span>");
        $('#panel_one_header_button5').html("<span title='Export radio stations' id='downloadAllStations' class='mdi-set mdi-export header_icon'></span>");
        $('#panel_one_header_button3').removeClass("d-none");
        $('#panel_one_header_button4').removeClass("d-none");
        $('#panel_one_header_button5').removeClass("d-none");
      });
    }

    $('#get_radio').on('click', function () {
      getAllRadioStations();
    });

    // Play a Radio Station
    $("#fillContent").on('click', '.stationz', function () {
      MSTREAMAPI.addRadioWizard($(this).data("stationurl"), $(this).data("stationname"), {}, true);
    });

    //Download .pls with all stations
    $("#header_row").on('click', '#downloadAllStations', function () {
      function download(filename, storageObj) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(storageObj));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }
  
      MSTREAMAPI.getRadioStations(function (response, error) {
        console.log(response);
        console.log(error);
  
        var stations = [];
        $.each(response, function () {
          stations.push({name:this.name , url: this.url});
        });
  
        console.log("downloadArray: ", stations);
        //console.log("downloadArrayJson: ", JSON.stringify(stations));

        if (stations.length > 0) {
          let plsFile = "[playlist]\n"
          plsFile += "NumberOfEntries=" + stations.length + "\n";
          $.each(stations, function( index, value ) {
            plsFile += `
File${index+1}=${value.url}
Title${index+1}=${value.name}
Length${index+1}=-1\n`;
          });
          plsFile += "\nVersion=2";
          console.log("downloadPls: ", plsFile);
          // Start file download.
          download("mStream_radios.pls", plsFile);
        }
        
      });
  });
    
  
    // ###########################################################################################
    // ################################ Albums View ##############################################
    //Load up album explorer
    $('.get_all_albums').on('click', function () {
      getAllAlbums();
    });
  
    function getAllAlbums(previousState) {
      //resetPanel('Albums', 'scrollBoxHeight1');
      currentBrowsingList = [];
  
      programState = [{
        state: 'allAlbums'
      }];
  
      MSTREAMAPI.albums(function (response, error) {
        console.log(response);
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        //parse through the json array and make an array of corresponding divs
        var albums = [];
        $.each(response.albums, function (index, value) {
          let album_art = [];
          if (value.album_art_file) {
            currentBrowsingList.push({
              type: 'album',
              name: value.name,
              'album_art_file': value.album_art_file
            });
            // Does this work with Layload ll.update(); ???
            //album_art = '<img class="album-art-box" data-original="/album-art/' + value.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
            album_art = '<img class="album-art-box dir_icon" src="/album-art/' + value.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
          } else {
            currentBrowsingList.push({
              type: 'album',
              name: value.name
            });
            album_art = '<span class="mdi-set mdi-album dir_icon"></span>';
          }
          albums.push([`<div data-album="${value.name}" class="albumz row mt-2 mb-2 ml-0 mr-0 align-items-center">\
                          <div class="col-auto pl-0">\
                            ${album_art}\
                          </div>\
                          <div class="col pl-0">\
                            <span class="item-text">${value.name}</span>\
                          </div>\
                        </div>`])
        });
  
        //$('#getAlbums').html(albums);
        //Load additional Rows by Scroll and remove previous once
        var clusterize = new Clusterize({
          rows: albums,
          scrollId: 'scrollAlbums',
          contentId: 'contentAlbums',
          rows_in_block: 10,
          blocks_in_cluster: 2
        });

        if (previousState && previousState.previousScroll) {
          //$('#fillContent').scrollTop(previousState.previousScroll);
        }
  
        if (previousState && previousState.previousSearch) {
          //$('#search_folders').val(previousState.previousSearch).trigger('change');
        }

      });
    }
  
    // Load up album-songs
    $("#fillContent").on('click', '.albumz', function () {
      var album = $(this).data('album');
      var artist = $(this).data('artist');
      
      $('#panel_one_header_button5').removeClass("d-none");
      $('#panel_one_header_button5').html(`<span data-album="${album}" data-artist="${artist}" id="viewFullAlbum" title='View full Album' class='mdi-set mdi-notification-clear-all header_icon'></span>`);
      getAlbumSongs(album, artist);
    });

    $("#header_row").on('click', '#viewFullAlbum', function () {
      const album = $(this).data('album');
      const artist = $(this).data('artist');
      getAlbumSongs(album, '', artist);
      $('#panel_one_header_button5').html(`<span data-album="${album}" data-artist="${artist}" id="viewArtistAlbum" title='View artists songs' class='mdi-set mdi-minus header_icon'></span>`);
    });
  
    $("#header_row").on('click', '#viewArtistAlbum', function () {
      const album = $(this).data('album');
      const artist = $(this).data('artist');
      getAlbumSongs(album, artist);
      $('#panel_one_header_button5').html(`<span data-album="${album}" data-artist="${artist}" id="viewFullAlbum" title='View full Album' class='mdi-set mdi-notification-clear-all header_icon'></span>`);
    });
  
    function getAlbumSongs(album, artist, markArtist) {
      $('.directoryName').html('Album: ' + album);
      //clear the list
      $('#fillContent').html(spinner1_html);
      currentBrowsingList = [];
  
      programState.push({
        state: 'album',
        name: album,
        previousScroll: document.getElementById('fillContent').scrollTop,
        previousSearch: $('#search_folders').val()
      });
  
      $('#search_folders').val('');
  
      MSTREAMAPI.albumSongs(album, artist, function (response, error) {
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        //parse through the json array and make an array of corresponding divs
        var filelist = [];
        $.each(response, function () {
          let info = [];
          let type_icon = '<span class="mdi-set mdi-music-note dir_icon"></span>';

          if (this.metadata.artist) {
            info[0] = this.metadata.artist;
          } else {
            info[0] = '';
          }
          if (this.metadata.title) {
            currentBrowsingList.push({
              type: 'file',
              name: this.metadata.title
            })
            info[1] = this.metadata.title;
          } else {
            currentBrowsingList.push({
              type: 'file',
              name: this.metadata.filename
            })
            info[1] = this.metadata.filename;
          }

          let markArtistClass = ''
          if (info[0] === markArtist) {markArtistClass = 'markArtist';}

          filelist.push(`<div class="col-auto p-0">
                          <div data-file_location="${this.filepath}" class="filez row mt-1 mb-1 ml-0 mr-0 align-items-center overflow-hidden">
                            <div class="col p-0">
                              <div class="row m-0 align-items-center ${markArtistClass}">
                                <div class="col-auto pl-0">
                                  ${type_icon}
                                </div>
                                <div class="col pl-0 d-flex flex-column">
                                  <span class="col_track_title">${info[1]}</span>
                                  <span class="col_track_artist">${info[0]}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`);

        });
  
        $('#fillContent').html("<div data-simplebar class='col h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + filelist.join("") + "</div></div>");
      });
    }
  
    // ###########################################################################################
    // ############################### Artists View ##############################################
    $('.get_all_artists').on('click', function () {
      getAllArtists();
    });
  
    function getAllArtists(previousState) {
      $('ul.left-nav-menu li').removeClass('selected');
      $('.get_all_artists').addClass('selected');
      //resetPanel('Artists', 'scrollBoxHeight1');
      //$('#getArtists').html(spinner1_html);
      currentBrowsingList = [];

      console.log("previousState", previousState);
  
      programState = [{
        state: 'allArtists'
      }];
  
      MSTREAMAPI.artists(function (response, error) {
        if (error !== false) {
          $('#getArtists').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        // parse through the json array and make an array of corresponding divs
        var artists = [];
        $.each(response.artists, function (index, value) {
          artists.push(['<div data-artist="' + value + '" class="artistz row mt-2 mb-2 ml-0 mr-0 align-items-center">' +
                          '<div class="col-auto pl-0">' +
                            '<span class="mdi-set mdi-microphone dir_icon"></span>' +
                          '</div>' +
                          '<div class="col pl-0">' +
                            '<span class="item-text">' + value + '</span>' +
                          '</div>' +
                      '</div>']);
          currentBrowsingList.push({
            type: 'artist',
            name: value
          });
        });
  
        //$('#getArtists').html(artists);
        var clusterize = new Clusterize({
          rows: artists,
          scrollId: 'scrollArtists',
          contentId: 'contentArtists',
          rows_in_block: 10,
          blocks_in_cluster: 2
        });

        if (previousState && previousState.previousScroll) {
          //$('#contentArtists').scrollTop(previousState.previousScroll);
        }
  
        if (previousState && previousState.previousSearch) {
          //$('#search_folders').val(previousState.previousSearch).trigger('change');
        }
      });
    }
  
    $("#fillContent").on('click', '.artistz', function () {
      var artist = $(this).data('artist');
      programState.push({
        state: 'artist',
        name: artist,
        previousScroll: document.getElementById('fillContent').scrollTop,
        previousSearch: $('#search_folders').val()
      });
  
      getArtistsAlbums(artist)
    });
  
    function getArtistsAlbums(artist, previousState) {
      resetPanel('Albums', 'scrollBoxHeight1');
      $('.directoryName').html('Artist: ' + artist);
      $('#fillContent').html(spinner1_html);
      $('#search_folders').val('');
      currentBrowsingList = [];

      console.log("artist", artist);
      console.log("previousState", previousState);
  
      MSTREAMAPI.artistAlbums(artist, function (response, error) {
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        var albums = [];
        $.each(response.albums, function (index, value) {
          let type_icon = '';
          var albumString = value.name ? value.name : 'SINGLES';

          if (value.album_art_file) {
            //Lazyload???
            //type_icon = '<img class="album-art-box"  data-original="/album-art/' + value.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
            type_icon = '<img class="album-art-box dir_icon"  src="/album-art/' + value.album_art_file + '?token=' + MSTREAMAPI.currentServer.token + '">';
          } else {
            type_icon = '<span class="mdi-set mdi-album dir_icon"></span>';
          }

          albums.push(`<div class="col-auto p-0">
                        <div data-artist="${artist}" data-album="${value.name}" class="albumz row mt-1 mb-1 ml-0 mr-0 align-items-center overflow-hidden">
                          <div class="col p-0">
                            <div class="row m-0 align-items-center">
                              <div class="col-auto pl-0">
                                ${type_icon}
                              </div>
                              <div class="col pl-0 d-flex flex-column">
                                <span class="col_track_title">${albumString}</span>
                                <span class="col_track_artist"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`);

          currentBrowsingList.push({
            type: 'album',
            name: value.name,
            artist: artist,
            album_art_file: value.album_art_file
          })
        });
  
        $('#fillContent').html("<div data-simplebar class='col h-100 mh-100'><div class='row m-0 flex-column flex-nowrap w-100'>" + albums.join("") + "</div></div>");
  
        if (previousState && previousState.previousScroll) {
          //$('#fillContent').scrollTop(previousState.previousScroll);
        }
  
        if (previousState && previousState.previousSearch) {
          //$('#search_folders').val(previousState.previousSearch).trigger('change');
        }
  
        // update lazy load plugin
        //ll.update();
      });
    }
  
    // ###########################################################################################
    // ################################# Rated View ##############################################
    $('.get_rated_songs').on('click', function () {
      getRatedSongs();
    });
  
    function getRatedSongs() {
      //resetPanel('Starred', 'scrollBoxHeight1');
      //$('#fillContent').html(spinner1_html);
      $('#search_folders').val('');
      currentBrowsingList = [];
  
      programState = [{
        state: 'allRated'
      }];
  
      MSTREAMAPI.getRated(function (response, error) {
        if (error !== false) {
          $('#fillContent').html('<div>Server call failed</div>');
          return boilerplateFailure(response, error);
        }
  
        //parse through the json array and make an array of corresponding divs
        var files = [];
        $.each(response, function (index, value) {
          var rating = (value.metadata.rating / 2);
          if (!Number.isInteger(rating)) {
            rating = rating.toFixed(1);
          }

          let type_icon = '';
          let info = [];
          
          //TODO: album-art = null while there is one by playing???
          //console.log(value.metadata);
  
          if (!value.metadata || !value.metadata.title) {
            currentBrowsingList.push({
              type: 'file',
              name: value.filepath,
              metadata: value.metadata
            });
            info[0] = '';
            info[1] = value.filepath;
            type_icon = '<span class="mdi-set mdi-music-note dir_icon"></span>';
          } else if (value.metadata['album-art']) {
            currentBrowsingList.push({
              type: 'file',
              name: value.metadata.artist + ' - ' + value.metadata.title,
              metadata: value.metadata
            });
            info[0] = value.metadata.artist;
            info[1] = value.metadata.title;
            //Lazyload???
            //type_icon = '<img class="album-art-box"  data-original="/album-art/' + value.metadata['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
            type_icon = '<img class="album-art-box dir_icon"  src="/album-art/' + value.metadata['album-art'] + '?token=' + MSTREAMAPI.currentServer.token + '">';
          } else {
            currentBrowsingList.push({
              type: 'file',
              name: value.metadata.artist + ' - ' + value.metadata.title,
              metadata: value.metadata
            });
            info[0] = value.metadata.artist;
            info[1] = value.metadata.title;
            type_icon = '<span class="mdi-set mdi-music-note dir_icon"></span>';
            //files.push('<div data-file_location="' + value.filepath + '" class="filez"><img class="album-art-box" src="/public/img/default.png"><span class="explorer-label-1">[' + rating + '] ' + value.metadata.artist + ' - ' + value.metadata.title + '</span></div>');
          }

          files.push([`<div data-file_location="${value.filepath}" class="filez row mt-2 mb-2 ml-0 mr-0 align-items-center overflow-hidden">
                                  <div class="col p-0">
                                    <div class="row m-0 align-items-center">
                                      <div class="col-auto pl-0">
                                        ${type_icon}
                                      </div>
                                      <div class="col pl-0 d-flex flex-column">
                                        <span class="col_track_title">${info[1]}</span>
                                        <span class="col_track_artist">${info[0]}</span>
                                      </div>
                                      <div class="col-auto pr-0">
                                        <div class="">
                                          <span class="mdi-set mdi-star rating_icon">${rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>`]);

        });
  
        //$('#getRated').html(files);
        var clusterize = new Clusterize({
          rows: files,
          scrollId: 'scrollRated',
          contentId: 'contentRated',
          rows_in_block: 10,
          blocks_in_cluster: 2
        });
        // update lazy load plugin
        //ll.update();
      });
    }
  
    // ###########################################################################################
    // ############################### Search Panel ##############################################
    var searchToggles = {
      albums: true,
      artists: true,
      files: false,
      titles: true
    }
  
    $('#get_search').on('click', function () {
      $('#contentHeader_text').html("Search");
      $('#directory_bar').hide();
      setupSearchPanel();
    });
  
    function setupSearchPanel(searchTerm) {
      //resetPanel('Search DB', 'scrollBoxHeight1');
      currentBrowsingList = [];
      //TODO:
      //$('#directory_bar').show();
      $('#directory_bar').hide();
      //Hide Header Buttons
      $('#header_btns').hide();
      //add padding which was removed by library/system because of slides spacing
      $('.filelist_wrapper').removeClass("p-0");
  
      programState = [{
        state: 'searchPanel'
      }];
  
      var valString = '';
      if (searchTerm) {
        valString = 'value="' + searchTerm + '"';
      }
  
      var newHtml = `
      <div class="col-auto p-0">
        <form id="db-search" onsubmit="return false;">
          <div id="dbSearchForm" class="input-group">
            <input ${valString} type="text" id="search-term" class="form-control" placeholder="Search Database" aria-label="Search Database" aria-describedby="basic-addon2" required>
            <div class="input-group-append">
              <button id="filterSearch" type="button" class="mdi-set mdi-filter-variant" data-toggle="popover" title="Filter"></button>
              <button form="db-search" type="submit" class="searchButton mdi-set mdi-magnify"></button>
            </div>
          </div>
          <span id="filterString">
              <!-- Filled in updateFilterHtml() -->
          </span>
        </form>\
      </div>
      
      <div class="col p-0 overflow-hidden">
        <div id="scrollSearch" class="clusterize-scroll h-100">
            <div id="contentSearch" class="clusterize-content">
                <div class="clusterize-no-data"></div>
            </div>
        </div>
      </div>`;
      //<div id="search-results" class="row align-items-center">

      function updateFilterHtml() {
        let searchFilter = [];
        $.each(searchToggles, function(key, value) {
          if (value) {
            searchFilter.push(key.substr(0,1).toUpperCase()+key.substr(1));
          }
        });
        let searchFilterString = searchFilter.join(",\n");
  
        $('#filterString').html(`
          Search in: ${searchFilterString}
        `); 
      }
  
      $('#fillContent').html(newHtml);
      $('#search_folders').val('').trigger('change');

      //Initial Call
      updateFilterHtml();

      //Init Popover (Bootstrap)
      $("#filterSearch").popover({
        trigger: "click",
        container: '#dbSearchForm',
        html: true,
        placement: 'top',
        sanitize: false,
        boundary: "window",
        content: function() {
            return `
            <div class="col-auto p-0 mt-2 text-nowrap">
              <input ${(searchToggles.artists === true ? 'checked' : '')} id="search-in-artists" type="checkbox">
              <label for="search-in-artists">Artists</label>
            </div>
            <div class="col-auto p-0 mt-2 text-nowrap">
              <input ${(searchToggles.albums === true ? 'checked' : '')} id="search-in-albums" type="checkbox">
              <label for="search-in-albums">Albums</label><br>
            </div>
            <div class="col-auto p-0 mt-2 text-nowrap">
              <input ${(searchToggles.titles === true ? 'checked' : '')} id="search-in-titles" type="checkbox">
              <label for="search-in-titles">Song Titles</label>
            </div>
            <div class="col-auto p-0 mt-2 text-nowrap">
              <input ${(searchToggles.files === true ? 'checked' : '')} id="search-in-filepaths" type="checkbox">
              <label for="search-in-filepaths">File Paths</label>
            </div>`;
        }
      }).click(function (event) {event.stopPropagation();})
      .on('inserted.bs.popover', function () {
        $(".popover").click(function (event) {
          event.stopPropagation();
        })
      })
    
      //Hide Popover on click outside
      $(document).click(function () {
        $("#filterSearch").popover('hide');
      });

      //Save input data on popover close
      $('#filterSearch').on('hide.bs.popover', function () {
        //undefined if clicked outside the popover without opening the popover
        //just check one for undefined because all other are the same
        if(typeof $('.popover-body #search-in-artists').prop("checked") !== 'undefined') {
          if ($('.popover-body #search-in-artists').prop("checked")) {
            searchToggles.artists = true;
          } else {
            searchToggles.artists = false;
          }
    
          if ($('.popover-body #search-in-albums').prop("checked")) {
            searchToggles.albums = true;
          } else {
            searchToggles.albums = false;
          }
    
          if ($('.popover-body #search-in-titles').prop("checked")) {
            searchToggles.titles = true;
          } else {
            searchToggles.titles = false;
          }
    
          if ($('.popover-body #search-in-filepaths').prop("checked")) {
            searchToggles.files = true;
          } else {
            searchToggles.files = false;
          }
          //console.log(searchToggles);
          //Update the filter string (Search in: ... )
          updateFilterHtml();
        }
      });
  
      if (searchTerm) {
        // $('#search-term').val(searchTerm);
        $('#db-search').submit();
      }
    }
  
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
  
    $('#fillContent').on('submit', '#db-search', function (e) {
      //$('#search-results').html('');
      $('#contentSearch').append(spinner1_html);
  
      var postObject = {
        search: $('#search-term').val()
      };
      if (!searchToggles.artists) {postObject.noArtists = true;}

      if (!searchToggles.albums) {postObject.noAlbums = true;}

      if (!searchToggles.files) {postObject.noFiles = true;}

      if (!searchToggles.titles) {postObject.noTitles = true;}
  
      // Send AJAX Request
      MSTREAMAPI.search(postObject, function (res, error) {
        if (error !== false) {
          $('#search-results').html('<div>Server call failed</div>');
          return boilerplateFailure(res, error);
        }
  
        if (programState[0].state === 'searchPanel') {
          programState[0].searchTerm = postObject.search;
        }
  
        // Populate list
        var searchList = ['<div class="clear flatline"></div>'];
        Object.keys(res).forEach(function (key) {
          res[key].forEach(function (value, i) {
            // set icon by type
            let type_icon = '';
            let data_html = '';
            let info = []; // [0] = Artist, [1] = Title
            if (searchMap[key].name === "Album") {
              type_icon = '<span class="mdi-set mdi-album dir_icon"></span>';
              info = value.name.split(' - ');
            }
            if (searchMap[key].name === "Artist") {
              type_icon = '<span class="mdi-set mdi-microphone dir_icon"></span>';
              info[0] = '';
              info[1] = value.name;
            }
            if (searchMap[key].name === "Song") {
              type_icon = '<span class="mdi-set mdi-music-note dir_icon"></span>';
              info = value.name.split(' - ');
            }
            if (searchMap[key].name === "File") {
              type_icon = '<span class="mdi-set mdi-file-music dir_icon"></span>';
              info[0] = '';
              info[1] = value.name;
            }

            // perform some operation on a value;
            if (value.filepath) {
              data_html = value.filepath;
              //searchList.push(`<div data-${searchMap[key].data}="${value.filepath}" class="${searchMap[key].class}"><b>${type_icon}:</b> ${value.name}</div>`);
            } else {
              //searchList.push(`<div data-${searchMap[key].data}="${value.name}" class="${searchMap[key].class}"><b>${type_icon}:</b> ${value.name}</div>`);
              data_html = value.name;
            }

            searchList.push([`<div class="col-auto p-0">
                                <div data-${searchMap[key].data}="${data_html}" class="${searchMap[key].class} row mt-2 mb-2 ml-0 mr-0 align-items-center overflow-hidden">
                                  <div class="col p-0">
                                    <div class="row align-items-center">
                                      <div class="col-auto">
                                        ${type_icon}
                                      </div>
                                      <div class="col pl-0 d-flex flex-column">
                                        <span class="col_track_title">${info[1]}</span>
                                        <span class="col_track_artist">${info[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>`]);

          });
        });
  
        if (searchList.length < 2) {
          searchList.push('<h5>No Results Found</h5>');
        }

        var clusterize = new Clusterize({
          rows: searchList,
          scrollId: 'scrollSearch',
          contentId: 'contentSearch',
          rows_in_block: 10,
          blocks_in_cluster: 4
        });
  
        //$('#search-results').html(searchList);
      });
    });

    //###################### System View ##################
    $('#get_system').on('click', function () {
      $('#contentHeader_text').html("System");
      $('#directory_bar').hide();
      $('#header_btns').hide();

      //for spacing between slick slides remove wrapper spacing and add padding in slides
      $('.filelist_wrapper').addClass("p-0");

      $('#fillContent').html('<div class="col-auto slides_system_nav">' +
                                  '<div>Settings</div>' +
                                  '<div>Federation</div>' +
                                  '<div>Transcode</div>' +
                              '</div>' +
                              '<div class="slides_system col p-0 overflow-hidden">' +
                                  '<div data-simplebar id="getSettings" class="mh-100 h-100 pl-3 pr-3"></div>' +
                                  '<div data-simplebar id="getFederation" class="mh-100 h-100 pl-3 pr-3"></div>' +
                                  '<div data-simplebar id="getTranscode" class="mh-100 h-100 pl-3 pr-3"></div>' +
                              '</div>');

      $('.slides_system').slick({
          lazyLoad: 'ondemand',
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          asNavFor: '.slides_system_nav',
          infinite: false
      });
      $('.slides_system_nav').slick({
          slidesToShow: 3,
          slidesToScroll: 0,
          arrows: false,
          asNavFor: '.slides_system',
          centerPadding: '0px',
          dots: false,
          centerMode: true,
          focusOnSelect: true,
          infinite: false
      });

      
      $('.slides_system').on('beforeChange', function(event, slick, currentSlide, nextSlide){
          
          if (nextSlide === 1) {
            getFederation();
          }

          if (nextSlide === 2) {
            getTranscode();
          }

          console.log("current: ", currentSlide);
          //if (nextSlide)
      });

      getSettings();
      
    });
  
    //############################## Setting Panel ############################
    function getSettings() {
      //resetPanel('Auto DJ', 'scrollBoxHeight2');
      currentBrowsingList = [];
      $('#directory_bar').hide();
  
      let autodjRating_html = '';
      for (var i = 0; i < 11; i++) {
        var selectedString = (Number(MSTREAMPLAYER.minRating) === i) ? 'selected' : '';
        var optionString = (i === 0) ? 'Disabled' : +(i / 2).toFixed(1);
        autodjRating_html += '<option ' + selectedString + ' value="' + i + '">' + optionString + '</option>';
      }

      let autoDJ_checked = '';
      if(localStorage.getItem("autoPlay") !== "false") {
        autoDJ_checked = 'checked';
      }

      let radio_checked = '';
      if(localStorage.getItem("enableRadio") === "true") {
        radio_checked = 'checked';
      }

  
      const newHtml = `
        <div class="row m-0 flex-column flex-nowrap w-100 overflow-hidden">
          <div class="col-auto p-0">
            <div class="row mt-2 mb-2 settings_box">\
              <div class="col">\
                <div class="row m-0 align-items-center justify-content-between">
                  <div class="col pl-0">
                    <span class="heading">Auto DJ</span>\
                    <span class="sub_heading">Auto DJ randomly generates a playlist</span>\
                  </div>
                </div>
              </div>
            </div>\
            <div class="row m-0">
              <div class="col pl-0">
                <div class="row m-0 flex-column autoDjDirsSelect">
                  <div class="col p-0">
                    <span id="autoDjDirs_included"></span>
                  </div>
                  <div class="col p-0">
                    <span id="autoDjDirs_excluded"></span>
                  </div>
                </div>
              </div>
              <div class="col-auto p-0">
                <button id="autoDjDirs" type="button" class="mdi-set mdi-circle-edit-outline" data-toggle="popover" title="Include"></button>
              </div>
            </div>
            <div class="col pl-0">
              <span>Minimum Rating:</span>
              <select id="autodj-ratings">
                ${autodjRating_html}
              </select>
            </div>
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">
              <div class="col">
                <div class="row m-0 align-items-center justify-content-between">
                  <div class="col pl-0">
                    <span class="heading">Autoplay</span>
                    <span class="sub_heading">Start Playing on Track Add</span>
                  </div>
                  <div class="col-auto pr-0">
                    <label class="switch">
                      <input id="autoplay" type="checkbox" class="switch-input" ${autoDJ_checked}>
                      <span class="switch-label" data-on="On" data-off="Off"></span>
                      <span class="switch-handle"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">
              <div class="col">
                <div class="row m-0 align-items-center justify-content-between">
                  <div class="col pl-0">
                    <span class="heading">Radio Stations</span>
                    <span class="sub_heading">Play livestream URLs</span>
                  </div>
                  <div class="col-auto pr-0">
                    <label class="switch">
                      <input id="enableRadio" type="checkbox" class="switch-input" ${radio_checked}>
                      <span class="switch-label" data-on="On" data-off="Off"></span>
                      <span class="switch-handle"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">\
              <div id="jukeBox_html" class="col">\
              </div>\
            </div>\
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">\
              <div class="col">\
                <div class="row m-0 align-items-center justify-content-between">\
                    <div class="col pl-0">\
                      <span class="heading">Database</span>\
                      <span id="dbStatus" class="sub_heading"></span>\
                    </div>\
                    <div class="col-auto pr-0">\
                      <button class="settings_button" id="build_database">
                        <span>Scan</span>
                        <span class="mdi-set mdi-database"></span>
                      </button>
                    </div>\
                </div>\
              </div>\
            </div>\
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">\
              <div class="col">\
                <div class="row m-0 align-items-center justify-content-between">\
                    <div class="col pl-0">\
                      <span class="heading">User</span>\
                      <span class="sub_heading"></span>\
                    </div>\
                    <div class="col-auto pr-0">\
                      <button class="settings_button" id="logout">
                        <span>Logout</span>
                        <span class="mdi-set mdi-logout"></span>
                      </button>
                    </div>\
                </div>\
              </div>\
            </div>\
          </div>
          <div class="col-auto p-0">
            <div class="row mt-4">\
              <div class="col">\
                <div class="row m-0 align-items-center justify-content-between">\
                  <div class="col pl-0">\
                    <span class="heading">Mobile</span>\
                    <span class="sub_heading">Android App<br />IOS comming soon</span>\
                  </div>\
                  <div class="col-auto pr-0">\
                    <a target="_blank" href="https://play.google.com/store/apps/details?id=mstream.music&amp;pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1" class="mdi-set mdi-google-play link_button mr-3"></a>\
                  </div>\
                </div>\
              </div>\
            </div>\
          </div>
          <div class="col-auto" p-0>
            <div class="row mt-4">\
              <div class="col p-0">\
                <div class="row m-0 align-items-center justify-content-between">\
                    <div class="col pl-0">\
                      <span class="heading">About</span>\
                      <span class="sub_heading">mStream WebApp v4.0</span>\
                    </div>\
                    <div class="col-auto pr-0">\
                      <a target="_blank" href="https://github.com/IrosTheBeggar/mStream" class="mdi-set mdi-github link_button mr-3"></a>\
                    </div>\
                </div>\
                <div class="row m-0 flex-column">
                  <div class="col p-0">Developed By Paul Sori</div>
                </div>
              </div>\
            </div>\
          </div>
        </div>`;

      //############################## Database Panel ############################
      MSTREAMAPI.dbStatus(async function (response, error) {
        let db_html = '';
        if (error !== false) {
          $('#fillContent').html('<div>Databse Server call failed</div>');
           return boilerplateFailure(response, error);
                      }
    
                      // If there is an error
        if (response.error) {
            db_html = 'The database returned the following error: ' + response.error;
        }
    
        // if the DB is locked
        if (response.locked) {
            db_html = '<p class="scan-status">Scan In Progress</p><p class="scan-status-files">' + response.totalFileCount + ' files in DB</p>';
        }
        // If you got this far the db is made and working
        db_html = 'Your DB has ' + response.totalFileCount + ' files';
        //console.log(db_html);
        $('#dbStatus').html(db_html);
      });
  
      $('#getSettings').html(newHtml);
      setupJukeboxPanel();

      //Initial Call
      updateAutoDjDirs();

      function updateAutoDjDirs() {
        let autoDjDirs_excluded = [];
        let autoDjDirs_included = [];
        for (var i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
          if (!MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]]) {
            autoDjDirs_included.push(MSTREAMAPI.currentServer.vpaths[i]);
          } else {
            autoDjDirs_excluded.push(MSTREAMAPI.currentServer.vpaths[i]);
          }
        }
        const autoDjDirs_included_String = autoDjDirs_included.join(",\n");
        const autoDjDirs_excluded_String = autoDjDirs_excluded.join(",\n");
        $('#autoDjDirs_included').html(`
          Included: ${autoDjDirs_included_String}
        `); 
        $('#autoDjDirs_excluded').html(`
          Excluded: ${autoDjDirs_excluded_String}
        `); 
      }

      //Init Popover (Bootstrap)
      $("#autoDjDirs").popover({
        trigger: "click",
        container: '#autoDjDirs',
        html: true,
        placement: 'left',
        sanitize: false,
        boundary: "window",
        content: function() {
          let autoDjDirs_select = '';
          for (var i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
            let checkedString = '';
            if (!MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]]) {
              checkedString = 'checked';
            } else {
            }
            autoDjDirs_select += `<div class="col-auto p-0 mt-2 text-nowrap">
                                    <input ${checkedString} id="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}" type="checkbox" value="${MSTREAMAPI.currentServer.vpaths[i]}" name="autodj-folders">
                                    <label for="autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}">${MSTREAMAPI.currentServer.vpaths[i]}</label>
                                  </div>`;
          }
          return autoDjDirs_select;
        }
      }).click(function (event) {event.stopPropagation();})
      .on('inserted.bs.popover', function () {
        $(".popover").click(function (event) {
          event.stopPropagation();
        })
      })
    
      //Hide Popover on click outside
      $(document).click(function () {
        $("#autoDjDirs").popover('hide');
      });

      //Save input data on popover close
      $('#autoDjDirs').on('hide.bs.popover', function () {
        let autodjIgnorePaths = [];
        for (var i = 0; i < MSTREAMAPI.currentServer.vpaths.length; i++) {
          if(typeof $(`.popover-body #autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}`).prop("checked") !== 'undefined') {
            //console.log("close");
            if ($(`.popover-body #autodj-folder-${MSTREAMAPI.currentServer.vpaths[i]}`).prop("checked")) {
              MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]] = false;
              //Remove from array
              autodjIgnorePaths = $.grep(autodjIgnorePaths, function(value) {
                return value != MSTREAMAPI.currentServer.vpaths[i];
              });
            } else {
              MSTREAMPLAYER.ignoreVPaths[MSTREAMAPI.currentServer.vpaths[i]] = true;
              autodjIgnorePaths.push(MSTREAMAPI.currentServer.vpaths[i]);
            }
          } else {
            return;
          }
        }
        localStorage.setItem("autoDJ-ignorePaths", autodjIgnorePaths);
        updateAutoDjDirs();
      });
    }
  
    let autodjIgnorePaths = [];
    $('#fillContent').on('click', 'input[name="autodj-folders"]', function () {
      const input = this;
      console.log(input);
      // Don't allow user to deselct all options
      if ($('input[name="autodj-folders"]:checked').length < 1) {
        input.checked = true;
        iziToast.warning({
          title: 'Auto DJ requires a directory',
          position: 'topCenter',
          timeout: 3500
        });
        return;
      }
  
      if (input.checked) {
        MSTREAMPLAYER.ignoreVPaths[input.value] = false;
        //Remove from array
        autodjIgnorePaths = $.grep(autodjIgnorePaths, function(value) {
          return value != input.value;
        });
      } else {
        MSTREAMPLAYER.ignoreVPaths[input.value] = true;
        autodjIgnorePaths.push(input.value);
      }
      //save in browser local storage
      localStorage.setItem("autoDJ-ignorePaths", autodjIgnorePaths);
    });
  
    $('#fillContent').on('change', '#autodj-ratings', function () {
      MSTREAMPLAYER.minRating = $(this).val(); //0 - 11
      localStorage.setItem("autoDJ-minRating", $(this).val());
    });
  
    $('#fillContent').on('change', '#autoplay', function (e) {
      const autoPlay = e.target.checked
      
      //MSTREAMPLAYER.autoPlay = $(this).val();
      localStorage.setItem("autoPlay", autoPlay);
      
    });

    $('#fillContent').on('change', '#enableRadio', function (e) {
      const enableRadio = e.target.checked
      localStorage.setItem("enableRadio", enableRadio);
      if(enableRadio) {
        $('#get_radio').removeClass('d-none');
      } else {
        $('#get_radio').addClass('d-none');
      }
    });

    // Build the database
    $('body').on('click', '#build_database', function () {
      $(this).prop("disabled", true);
  
      MSTREAMAPI.dbScan(function (response, error) {
        if (error !== false) {
          return boilerplateFailure(response, error);
        }
  
        $('#fillContent').append('  <p class="scan-status">Scan In Progress</p><p class="scan-status-files"></p>');
        callOnStart();
      });
    });

    // LogOut
    $('body').on('click', '#logout', function () {
      localStorage.removeItem('token');
      location.reload(); 
    });

    //############################## Transcode Panel ############################
    function getTranscode() {
      currentBrowsingList = [];
  
      let transcoding_html = '';
      if (!MSTREAMAPI.transcodeOptions.serverEnabled) {
        transcoding_html += '<p>Transcoding is disabled on this server</p>';
      } else {
        transcoding_html += '<p>Default Bitrate: ' + MSTREAMAPI.transcodeOptions.bitrate + '</p>' +
        '<p>Default Codec: ' + MSTREAMAPI.transcodeOptions.codec + '</p>';
        if (MSTREAMAPI.transcodeOptions.frontendEnabled) {
          transcoding_html += '<p><input id="enable_transcoding_locally" type="checkbox" name="transcode" checked><label for="enable_transcoding_locally">Enable Transcoding</label></p>';
        } else {
          transcoding_html += '<p><input id="enable_transcoding_locally" type="checkbox" value="transcode"><label for="enable_transcoding_locally">Enable Transcoding</label></p>';
        }
      }
  

      const newHtml = '<div class="settings container">' +
                      '<div class="row mt-2 mb-2 settings_box">' +
                        '<div class="col">' +
                          '<span class="heading">Transcoding</span>' + 
                          '<span class="sub_heading">Experimental</span>' +
                          '<span class="sub_heading">The song position and seeking does not work.  Also it might not work in every browser.  Report and bugs to the <a target="_blank"  href="https://github.com/IrosTheBeggar/mStream/issues/213">ongoing github issue</a></span>' +
                          transcoding_html +
                        '</div>' +
                      '</div>' +
                    '</div>';
  
      $('#getTranscode').html(newHtml);
    }
  
    $('#fillContent').on('change', '#enable_transcoding_locally', function () {
      var a = '/media/';
      var b = '/transcode/';
  
      // checkbox button while we convert the playlist
      $("#enable_transcoding_locally").attr("disabled", true);
  
      if (this.checked) {
        $('#ffmpeg-logo').css({
          stroke: "#388E3C"
        });
        MSTREAMAPI.transcodeOptions.frontendEnabled = true;
      } else {
        $('#ffmpeg-logo').css({
          stroke: "#DDD"
        });
        a = '/transcode/';
        b = '/media/';
        MSTREAMAPI.transcodeOptions.frontendEnabled = false;
      }
  
      // Convert playlist
      for (let i = 0; i < MSTREAMPLAYER.playlist.length; i++) {
        MSTREAMPLAYER.playlist[i].url = MSTREAMPLAYER.playlist[i].url.replace(a, b);
      }
  
      // re-enable checkbox
      $("#enable_transcoding_locally").removeAttr("disabled");
    });
  
    //############################## Federation Panel ############################
    var federationId;
    function getFederation() {
      currentBrowsingList = [];
      //$('#directory_bar').hide();
  
      let federation_html = '';
  
      if (federationId) {
        federation_html += '\
        <p>Federation ID: <b class="autoselect">' + federationId + '</b></p>\
        <p><a href="#" class="trigger-generate-invite trigger-generate-invite-private">Secure Invitation</a> - Generates an invite token that can only be used for a specific instance. You will need that machine\'s Federation ID.  Your server does not need to be publicly available for this to work</p>\
        <p><a href="#" class="trigger-generate-invite trigger-generate-invite-public">Public Invitation</a> - Generates an invite token that anyone can use to gain access to your federated folders.  Your server must be publicly available for this to work</p>\
        <p><a href="#" class="trigger-accept-invite">Accept Invitation</a> - Have an invite code token?  This will validate it and finish the Federation process</p>';
      } else {
        federation_html += '<p><b>Federation is Disabled</b></p>';
      }

      const newHtml = '<div class="settings container">' +
                      '<div class="row mt-2 mb-2 settings_box">' +
                        '<div class="col">' +
                          '<span class="heading">Federation</span>' + 
                          '<span class="sub_heading">Federation allows you easily sync folders between mStream servers or the backup tool. Federation is a one-way process.  When you invite someone, they can only read the federated folders.  Any changes they make will not be sent to your mStream server.</span>' +
                          '<span class="sub_heading">Federation is powered by <a target="_blank" href="https://syncthing.net/">Syncthing</a></span>' +
                          federation_html +
                        '</div>' +
                      '</div>' +
                    '</div>';
  
      $('#getFederation').html(newHtml);
    }
  
    $('#fillContent').on('click', '.trigger-generate-invite-private', function () {
      $('.invite-federation-url').addClass('super-hide');
      $('.invite-federation-id').removeClass('super-hide');
  
      $('#invite-public-url').prop('disabled', true);
      $('#invite-federation-id').prop('disabled', false);
    });
  
    $('#fillContent').on('click', '.trigger-generate-invite-public', function () {
      $('.invite-federation-id').addClass('super-hide');
      $('.invite-federation-url').removeClass('super-hide');
  
      $('#invite-public-url').prop('disabled', false);
      $('#invite-federation-id').prop('disabled', true);
    });
  
    $('body').on('click', '.get-federation-stats', function () {
      MSTREAMAPI.getFederationStats(function (res, err) {
        console.log(res);
      });
    });
  
    $('#generateInviteForm').on('submit', function () {
      event.preventDefault();
  
      // get list of vpaths
      var vpaths = [];
      $('input[name="federate-this"]:checked').each(function () {
        vpaths.push($(this).val());
      });
  
      if (vpaths.length === 0) {
        iziToast.error({
          title: 'Nothing to Federate',
          position: 'topCenter',
          timeout: 3500
        });
        return;
      }
  
      var expirationTimeInDays;
      if ($('#federation-invite-forever').prop('checked')) {
        expirationTimeInDays = false;
      } else {
        expirationTimeInDays = $('#federation-invite-time').val();
      }
  
      var inviteReq = {
        paths: vpaths,
        expirationTimeInDays: expirationTimeInDays
      };
  
      if ($('#invite-federation-id').is(':enabled')) {
        inviteReq.federationId = $('#invite-federation-id').val()
      }
  
      if ($('#invite-public-url').is(':enabled')) {
        inviteReq.url = $('#invite-public-url').val()
      }
  
      MSTREAMAPI.generateFederationInvite(inviteReq, function (res, err) {
        if (err !== false) {
          boilerplateFailure(res, err);
          return;
        }
        $('#fed-textarea').val(res.token);
      });
    });
  
    var fedTokenCache;
    $("#federation-invitation-code").on('input', function (e) {
      var newHtml = '<p>Select and name folders you want to federate:</p>';
      try {
        var decoded = jwt_decode(e.target.value);
        if (fedTokenCache === decoded.iat) {
          return;
        }
  
        fedTokenCache = decoded.iat;
        Object.keys(decoded.vPaths).forEach(function (key) {
          newHtml += '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="federation-folder" value="' + decoded.vPaths[key] + '" checked>&nbsp;&nbsp;&nbsp;<span class="federation-invite-thing"><input id="' + decoded.vPaths[key] + '" type="text" value="' + key + '"></span><br>';
        });
      } catch (err) {
        fedTokenCache = null;
        newHtml = 'ERROR: Failed to decode token';
      }
  
      $('#federation-invite-selection-panel').html(newHtml);
    });
  
    $('#acceptInvitationForm').on('submit', function () {
      event.preventDefault();
      var folderNames = {};
  
      var decoded = jwt_decode($('#federation-invitation-code').val());
      Object.keys(decoded.vPaths).forEach(function (key) {
        if ($("input[type=checkbox][value=" + decoded.vPaths[key] + "]").is(":checked")) {
          folderNames[key] = $("#" + decoded.vPaths[key]).val();
        }
      });
  
      if (Object.keys(folderNames).length === 0) {
        iziToast.error({
          title: 'No directories selected',
          position: 'topCenter',
          timeout: 3500
        });
      }
  
      var sendThis = {
        invite: $('#federation-invitation-code').val(),
        paths: folderNames
      };
  
      MSTREAMAPI.acceptFederationInvite(sendThis, function (res, err) {
        if (err !== false) {
          boilerplateFailure(res, err);
          return;
        }
  
        iziToast.success({
          title: 'Federation Successful!',
          position: 'topCenter',
          timeout: 3500
        });
      });
    });
  
    $('#federation-invite-forever').change(function () {
      if (this.checked) {
        $('#federation-invite-time').prop('disabled', true);
        $('#federation-invite-time').val('-');
      } else {
        $('#federation-invite-time').prop('disabled', false);
        $('#federation-invite-time').val('14');
      }
    });

    //############################## Mobile App Panel ############################
    function getMobileAppPanel() {
      $('#getMobile').html("\
        <div class='mobile-links'>\
          <a target='_blank' href='https://play.google.com/store/apps/details?id=mstream.music&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>\
          <div class='mobile-placeholder'>&nbsp;</div>\
          <!-- <a href='https://play.google.com/store/apps/details?id=mstream.music&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a> -->\
        </div>\
        <div class='app-text'>\
          The official mStream App is now available for Android.  Use it to sync and stream music from any mStream server.\
          <br><br>\
          An iOS version will be released soon.\
          <br><br>\
          <a target='_blank' href='/public/qr-tool.html'>Checkout the QR Code tool to help add your server to the app</a>\
        </div>\
      ");
    }
  
    //############################## Jukebox Panel ############################
    function setupJukeboxPanel() {
      //$('ul.left-nav-menu li').removeClass('selected');
      //$('.jukebox_mode').addClass('selected');
      // Hide the directory bar
      //resetPanel('Jukebox Mode', 'scrollBoxHeight2');
      currentBrowsingList = [];
      $('#directory_bar').hide();
  
      let jukeBox_html = '';
      if (JUKEBOX.stats.live !== false && JUKEBOX.connection !== false) {
        jukeBox_html = createJukeboxPanel();
      } else {
        jukeBox_html = `<div class="row m-0 align-items-center justify-content-between">
                    <div class="col pl-0">
                      <span class="heading">Jukebox</span>
                      <span class="sub_heading">Control mStream remotely</span>
                    </div>
                    <div class="col-auto pr-0">
                      <button id="jukebox_connect" class="settings_button">
                        <span>Create Session</span>
                        <span class="mdi-set mdi-remote-tv"></span>
                      </button>
                    </div>
                  </div>`;
      }

      //Fill with new content
      $('#jukeBox_html').html(jukeBox_html);

    }
  
    // The jukebox panel
    $('.jukebox_mode').on('click', function () {
      setupJukeboxPanel();
    });
  
    $('body').on('click', '.remote-button', function () {
      setupJukeboxPanel();
    });
  
    // Setup Jukebox
    $('body').on('click', '#jukebox_connect', function () {
      $(this).prop("disabled", true);
      $(this).hide();
      //$('.jukebox-loading').toggleClass('hide');
  
      JUKEBOX.createWebsocket(MSTREAMAPI.currentServer.token, false, function () {
        // Wait a while and display the status
        setTimeout(function () {
          setupJukeboxPanel();
        }, 1800);
      });
    });
  
    function createJukeboxPanel() {
  
      let jukeBox_html_inner = '';
      if (JUKEBOX.stats.error !== false) {
        jukeBox_html_inner = '<div class="col pl-0">An error occurred.  Please refresh the page and try again</div>';
      }
  
      if (JUKEBOX.stats.adminCode) {
        jukeBox_html_inner = `<div class="col pl-0">Code: ${JUKEBOX.stats.adminCode}</div>`;
      }
      if (JUKEBOX.stats.guestCode) {
        jukeBox_html_inner += `<div class="col pl-0">Guest Code: ${JUKEBOX.stats.guestCode}</div>`;
      }
  
      var adrs = window.location.protocol + '//' + window.location.host + '/remote';
      jukeBox_html_inner +=  `<div class="col pl-0">Remote Jukebox Controls: <a target="_blank" href="${adrs}"></div>
                              <div class="col pl-0">${adrs}</a></div>`;
  

      const jukeBox_html = `<div class="row m-0 align-items-center justify-content-between">
                        <div class="col pl-0">
                          <span class="heading">Jukebox</span>
                          <span class="sub_heading">Control mStream remotely</span>
                        </div>
                        <div class="col-auto pr-0 jb_active">
                          <button id="jukebox_connect" class="settings_button" readonly>
                            Active Session
                            <span class="mdi-set mdi-remote-tv"></span>
                          </button>
                        </div>
                      </div>
                      <div class="row m-0 flex-column">
                        ${jukeBox_html_inner}
                      </div>`;

      //Fill with new content
      $('#jukeBox_html').html(jukeBox_html);
    }
    //TODO: doenst work with routing to /public/mstream_mobileORdesktop.html
    // Setup jukebox if URL
    // var urlPath = window.location.pathname;
    // var uuid = urlPath.split("/").pop();
  
    // var urlParams = new URLSearchParams(window.location.search);
    // var queryParm = urlParams.get('code');
  
    // var myParam = uuid || queryParm || false;
    // if (myParam) {
    //   JUKEBOX.createWebsocket(MSTREAMAPI.currentServer.token, myParam, function () {
    //     iziToast.success({
    //       title: 'Jukebox Connected',
    //       position: 'topCenter',
    //       message: 'Code: ' + myParam,
    //       timeout: 3500
    //     });
    //   });
  
    //   JUKEBOX.setAutoConnect(myParam);
    // }
  });