$(document).ready(function () {
  
    //#####################################################################################
    //# Setup Modal Functions to fill the template und control the functions of the modal #
    //#####################################################################################
    function ModalTemplateMainSet(header, headerSubtext, body, footer) {
      $('#ModalTemplateMain .modal-header').html(`
        <div class="col p-0">
          <div class="row flex-row justify-content-between align-items-center flex-nowrap m-0">
            <div class="col p-0">
              <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
            </div>
            <div class="col-auto p-0">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span class="mdi-set mdi-close" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="col p-0">
          <span>${headerSubtext}</span>
        </div>
      `);
      
      $('#ModalTemplateMain .modal-body').html(body);
  
      $('#ModalTemplateMain .modal-footer').html(footer);
    }
  
    function ModalTemplateErrorSet(header,body,footer, timeout = 0) {
      $('#ModalTemplateError .modal-header').html(`
        <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span class="mdi-set mdi-close" aria-hidden="true"></span>
        </button>
      `);
  
      $('#ModalTemplateError .modal-body').html(body);
      $('#ModalTemplateError .modal-footer').html(footer);
  
      //On Error flip modal to Error, close after 3s
      $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(180deg)');
      $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          //$('#ModalTemplate').modal('hide');
          $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
          $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(180deg)');
        }, timeout);
      }
    }
    function ModalTemplateInfoSet(header,body,footer, timeout = 0) {
      $('#ModalTemplateInfo .modal-header').html(`
        <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span class="mdi-set mdi-close" aria-hidden="true"></span>
        </button>
      `);
  
      $('#ModalTemplateInfo .modal-body').html(body);
      $('#ModalTemplateInfo .modal-footer').html(footer);
  
      //On Error flip modal to Error, close after 3s
      $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(180deg)');
      $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          //$('#ModalTemplate').modal('hide');
          $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
          $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(180deg)');
        }, timeout);
      }
    }
    function ModalTemplateSuccessSet(header, body, footer, timeout = 0) {
      $('#ModalTemplateSuccess .modal-header').html(`
        <h5 class="modal-title" id="exampleModalLabel">${header}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span class="mdi-set mdi-close" aria-hidden="true"></span>
        </button>
      `);
  
      $('#ModalTemplateSuccess .modal-body').html(body);
      $('#ModalTemplateSuccess .modal-footer').html(footer);
  
      //On Error flip modal to Error, close after 3s
      $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(180deg)');
      $('#ModalTemplate .ModalTemplate--back3').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          //$('#ModalTemplate').modal('hide');
          $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
          $('#ModalTemplate .ModalTemplate--back3').css('transform','rotateY(180deg)');
        }, timeout);
      }
    }
  
    //Manual Rotate
    function ModalTemplateRotate(selector, degree) {
      if (selector === "info") {
        $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(' + degree + 'deg)');
      }
      if (selector === "error") {
        $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(' + degree + 'deg)');
      }
      if (selector === "success") {
        $('#ModalTemplate .ModalTemplate--back3').css('transform','rotateY(' + degree + 'deg)');
      }
  
    }
  
    //Reset (rotate everything back to initial position)
    $('#ModalTemplate').on('hidden.bs.modal', function (e) {
      $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
      $('#ModalTemplate .ModalTemplate--back3').css('transform','rotateY(180deg)');
      $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(180deg)');
      $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(180deg)');
    })
    
    
    //Some standart texts
    const expWarning = "<span class='text-danger'>Experimental! Use at own risk. Be sure to have a complete backup of your music collection and mStream!</span>";

  //########################## File/Folder Manipulation Modals ##########################
  //############ Data Path: from here -> api2.js -> fileSystemManipulation.js ###########
  //#####################################################################################
  $("#filelist").on("click", ".editSong", function (event) {
    const currentPath = $(this).data("file_location");

    const footer = `
    <div class="col-auto p-0">
      <button id="deleteFile" type="submit" form="edit_form" value="remove"
          class="form__btn btn btn-danger mdi-set mdi-delete">
      </button>
    </div>
    <div class="col p-0"></div>  
    <div class="col-auto p-0">
      <button id="cancelFile" type="submit" form="edit_form" value="cancel"
      class="form__btn btn btn-secondary" data-dismiss="modal">
        Cancel 
        <span class="form__btn__icon mdi-set mdi-cancel"></span>
      </button>
    </div>  
    <div class="col-auto p-0">
      <button id="saveFile" type="submit" form="edit_form" value="save"
          class="form__btn btn btn-primary">
          Save
          <span class="form__btn__icon mdi-set mdi-content-save"></span>
      </button>
    </div>`;

    let body = `
    <form id="edit_form" class="form">
      <div class="input-group flex-column mb-3">
          <label for="editForm_currentPath">Current Path</label>
          <input value="${currentPath}" id="editForm_currentPath" type="text" class="form-control w-100" readonly>
      </div>
      <div class="input-group flex-column mb-3">
          <label for="editForm_newPath">New Path</label>
          <input value="${currentPath}" id="editForm_newPath" type="text" class="form-control w-100">
      </div>`;

    //TODO: Edit metadata only works for mp3 (?) due to node-id3 package
    const fileType = currentPath.split('.').pop();
    if(fileType === "mp3") {
      console.log("mp3");
      MSTREAMAPI.lookupMetadata(currentPath, function (response, error) {
        body += `
              <div class="input-group form-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Title</span>
                </div>
                <input value="${response.metadata.title ? response.metadata.title : ''}" id="editForm_title" type="text" class="form-control">
              </div>
              <div class="input-group form-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Artist</span>
                </div>
                <input value="${response.metadata.artist ? response.metadata.artist : ''}" id="editForm_artist" type="text" class="form-control">
              </div>
              <div class="input-group form-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Album</span>
                </div>
                  <input value="${response.metadata.album ? response.metadata.album : ''}" id="editForm_album" type="text" class="form-control">
              </div></form>`;
        ModalTemplateMainSet("Edit File", expWarning, body, footer);
        $('#ModalTemplate').modal('toggle');
      });
    } else {
      body += `</form>`;
      ModalTemplateMainSet("Edit File", expWarning, body, footer);
      $('#ModalTemplate').modal('toggle');
    }
    
    
  });

  $("#ModalTemplate").on("click", "#deleteFile", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "remove") {
      const currentPath = $('#editForm_currentPath').val();
      const body = `<span>Delete: ${currentPath} ?</span>`;
      const footer = `
      <div class="col-auto p-0">
        <button id="cancel" type="submit" form="editDir_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col"></div>
      <div class="col-auto p-0">
        <button id="confirmDeleteDir" type="submit" form="editDir_form" value="confirmDeleteDir"
            class="form__btn btn btn-danger mdi-set mdi-delete">
            Delete
        </button>
      </div>`;

      ModalTemplateInfoSet("Confirm", body, footer);
    }
  });

  $("#ModalTemplate").on("click", "#confirmDeleteDir", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "confirmDeleteDir") {

      const currentPath = $('#editForm_currentPath').val();
      console.log("Remove", currentPath);

      const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;

      MSTREAMAPI.fileDelete(currentPath, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `
            <span>Deleted: ${response.filepath}</span>`;

          ModalTemplateSuccessSet("Success", body, footer);
          ModalTemplateRotate("info", 180);
        }
        if(response.status === "info") {
          const body = `<span>${response.info}</span>`;
          ModalTemplateInfoSet("Info",body,"");
        }
        if(response.status === "error") {
          const body = `<span>${response.error}</span>`;
          ModalTemplateErrorSet("Error",body,"");
          ModalTemplateRotate("info", 180);
        }
        //Refresh contents of current folder
        senddir();
      });
    }
  });

  $("#ModalTemplate").on("click", "#saveFile", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "save") {
      console.log("Save", $(this).val());

      //const directoryString = getDirectoryString($(this));
      //console.log(directoryString);

      const currentPath = $('#editForm_currentPath').val();
      const newPath = $('#editForm_newPath').val();
      const metadata = {
        title: $('#editForm_title').val() ? $('#editForm_title').val() : '',
        artist: $('#editForm_artist').val() ? $('#editForm_artist').val() : '',
        album: $('#editForm_album').val() ? $('#editForm_album').val() : ''
      }

      //const directoryString = newPath.substr(0, newPath.lastIndexOf("/"));
      //console.log(directoryString);

      console.log("Metadata: ", metadata);
      console.log("Change: ", currentPath);
      console.log("To: ", newPath);

      const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;

      //TODO: only send metadata if changed
      MSTREAMAPI.renameFile(currentPath, newPath, metadata, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `
            <span>Old Path: ${response.oldPath}</span>
            <span>New Path: ${response.newPath}</span>
            <span>ReScan DB if you changed metadata to take effect on mStream!</span>`;

          ModalTemplateSuccessSet("Success",body,footer);

          //Refresh contents of current folder
          senddir();
          //TODO: Rescan current directory into DB
        }
        if(response.status === "info") {
          const body = `<span>${response.info}</span>`;
          ModalTemplateInfoSet("Info",body,"");
        }
        if(response.status === "error") {
          const body = `<span>${response.error}</span>`;
          ModalTemplateErrorSet("Error",body,"");
        }
      });
    }
  });

  //###################################################################
  //###################### Create New Folder ##########################
  $("#directory_bar").on("click", "#createDir", function (event) {

    console.log($('.directoryName').html());
    const currentPath = $('.directoryName').html();
    if (currentPath && currentPath !== "/") {
      const body = `
        <form id="createDir_form" class="form">
            <div class="input-group flex-column mb-3">
                <label for="createDir_name">Directory Name</label>
                <input id="createDir_name" type="text" class="form-control w-100" required>
                <input type="hidden" value="${currentPath}" id="createDir_currentPath">
            </div>
        </form>`;
      const footer = `
      <div class="col-auto p-0">
        <button id="cancel" type="submit" form="createDir_form" value="cancel"
        class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button> 
      </div>
      <div class="col p-0"></div>
      <div class="col-auto p-0">
        <button id="createDir" type="submit" form="createDir_form" value="createDir"
        class="form__btn btn btn-primary">
          Create
          <span class="form__btn__icon mdi-set mdi-folder-plus"></span>
        </button>
      </div>`;

      ModalTemplateMainSet("Create Directory", expWarning, body, footer);
      $('#ModalTemplate').modal({show: true});
    }
  });

  $("#ModalTemplate").on("click", "#createDir", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "createDir") {
      console.log("createDir", $(this).val());

      const currentPath = $('#createDir_currentPath').val();
      const name = $('#createDir_name').val();
      console.log("Create: ", name);
      console.log("in: ", currentPath);

      const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;

      MSTREAMAPI.createDir(currentPath, name, function (response, error) {
        console.log(response);
        console.log(error);

        if(response.status === "success") {
          const body = `<span>Successfully created: ${response.filepath}</span>`;
          ModalTemplateSuccessSet("Success",body,footer);
          //Refresh contents of current folder
          senddir();
        }
        if(response.status === "info") {
          const body = `<span>${response.info}</span>`;
          ModalTemplateInfoSet("Info",body,"", 3000);
        }
        if(response.status === "error") {
          const body = `<span>${response.error}</span>`;
          ModalTemplateErrorSet("Error",body,"", 3000);
        }

      });
    }
  });

  //###################################################################
  //######################### Edit Folder #############################
  $("#filelist").on("click", ".editDir", function (event) {
    const currentPath = getDirectoryString($(this));
    console.log(currentPath);
    if (currentPath && currentPath !== "/") {
      const body = `
        <form id="editDir_form" class="form">
            <div class="input-group flex-column mb-3">
                <label for="editDir_currentPath">Directory Path</label>
                <input id="editDir_currentPath" type="text" value="${currentPath}" class="form-control w-100" readonly>
            </div>
            <div class="input-group flex-column mb-3">
                <label for="editDir_newPath">New directory Path</label>
                <input id="editDir_newPath" type="text" value="${currentPath}" class="form-control w-100">
            </div>
        </form>`;
      const footer = `
      <div class="col-auto p-0">
        <button id="deleteDir" type="submit" form="editDir_form" value="remove"
            class="form__btn btn btn-danger mdi-set mdi-delete">
        </button>
      </div>
      <div class="col p-0"></div>
      <div class="col-auto p-0">
        <button id="cancel" type="submit" form="editDir_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col-auto p-0">
        <button id="editDir" type="submit" form="editDir_form" value="editDir"
            class="form__btn btn btn-primary">
            Save
            <span class="form__btn__icon mdi-set mdi-content-save"></span>
        </button>
      </div>    
      `;

      ModalTemplateMainSet("Edit Directory", expWarning, body, footer);
      $('#ModalTemplate').modal({show: true});
    }
  });

  $("#ModalTemplate").on("click", "#deleteDir", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "remove") {
      const currentPath = $('#editDir_currentPath').val();
      const body = `<span>Delete: ${currentPath} ?</span>`;
      const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="editDir_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col p-0">
        <button id="confirmDeleteDir" type="submit" form="editDir_form" value="confirmDeleteDir"
            class="form__btn btn btn-danger mdi-set mdi-delete">
            Delete
        </button>
      </div>`;

      ModalTemplateInfoSet("Confirm",body,footer);
    }
  });
      
  $("#ModalTemplate").on("click", "#confirmDeleteDir", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "confirmDeleteDir") {
      const currentPath = $('#editDir_currentPath').val();
      console.log("Delete: ", currentPath);
      MSTREAMAPI.removeDir(currentPath, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `<span>Successfully deleted: ${response.filepath}</span>`;
          const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;
          ModalTemplateSuccessSet("Success",body,footer);
          ModalTemplateRotate("info", 180);
          //Refresh contents of current folder
          senddir();
        }
        if(response.status === "info") {
          const body = `<span>${response.info}</span>`;
          ModalTemplateInfoSet("Info",body,"");
        }
        if(response.status === "error") {
          const body = `<span>${response.error}</span>`;
          ModalTemplateErrorSet("Error",body,"");
        }
      });
    }
  });

  $("#ModalTemplate").on("click", "#editDir", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "editDir") {
      const currentPath = $('#editDir_currentPath').val();
      const newPath = $('#editDir_newPath').val();
      console.log("currentPath: ", currentPath);
      console.log("newPath : ", newPath);
      if (currentPath !== newPath) {
        MSTREAMAPI.renameDir(currentPath, newPath, function (response, error) {
          console.log(response);
          console.log(error);
          if(response.status === "success") {
            const body = `
              <span>Old Path: ${response.oldPath}</span>
              <span>New Path: ${response.newPath}</span>`;

            const footer = `
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
            class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
                class="form__btn__icon mdi-set mdi-close"></span>
            </button> `;

            ModalTemplateSuccessSet("Success",body,footer);

            //Refresh contents of current folder
            senddir();
          }
          if(response.status === "info") {
            const body = `<span>${response.info}</span>`;
            ModalTemplateInfoSet("Info",body,"", 3000);
          }
          if(response.status === "error") {
            const body = `<span>${response.error}</span>`;
            ModalTemplateErrorSet("Error",body,"");
          }

        });
      }
    }
  });

  //#####################################################################################
  //################################ Share Playlist Modal ###############################
  //#####################################################################################
  $("#sharePlaylist").click(function (event) {
    const body = `
    <form id="share_playlist_form" class="form">
        <div class="input-group form-group">
            <div class="input-group-prepend"><span class="input-group-text">DAYS</span></div>
            <input id="share_time" type="number" min="1" step="1" value="14" class="form-control">
        </div>
        <label for="share_time">Expiration Time</label>
    </form>`;
    const footer = `
    <div class="col p-0">
      <button id="sharePlaylist" type="submit" form="share_playlist_form" value="sharePlaylist" class="form__btn btn btn-primary">
        Share
        <span class="form__btn__icon mdi-set mdi-share"></span>
      </button>
    </div>`;

    ModalTemplateMainSet("Share Playlist", "", body, footer);
    $('#ModalTemplate').modal({show: true});
  });

  $("#ModalTemplate").on("click", "#sharePlaylist", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "sharePlaylist") {
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
        const body = `<span>Playlist is empty!</span>`;
        ModalTemplateInfoSet("Info", body, "", 2000);
        return;
      }

      MSTREAMAPI.makeShared(stuff, shareTimeInDays, function (response, error) {
        if (error !== false) {
          const body = `<span>${error}</span>`;
          ModalTemplateErrorSet("Error", body, "", 2000);
          return boilerplateFailure(response, error);
        }
        $('#share_it').prop("disabled", false);
        const adrs = window.location.protocol + '//' + window.location.host + '/shared/playlist/' + response.playlist_id;

        const body = `
          <span>Copy this link and share it!</span>
          <div class="input-group">
            <input id="copyShareLink" type="text" class="form-control" value="${adrs}" autofocus readonly>
            <div class="input-group-append">
              <button id="copyShareLinkButton" class="btn btn-primary" type="button">Copy</button>
            </div>
          </div>
          `;

        const footer = `
        <button id="cancel" type="submit" form="" value="cancel"
        class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
            class="form__btn__icon mdi-set mdi-close"></span>
        </button> `;

        ModalTemplateSuccessSet("Success",body,footer);
      });
    }
  });

  $("#ModalTemplate").on("click", "#copyShareLinkButton", function (e) {
    e.preventDefault();
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

  //#####################################################################################
  //################################# Save Playlist Modal ###############################
  //#####################################################################################

  $("#savePlaylist").click(function (event) {
    const body = `
    <form id="save_playlist_form" class="form">
      <input id="playlist_name" class="form__input-text" type="text" required
          placeholder="Enter your playlist name" pattern="[a-zA-Z0-9 _-]+">
      <label for="playlist_name" class="form__label">Playlist name</label>
    </form>`;
    const footer = `
    <div class="col p-0">
      <button id="savePlaylist" type="submit" form="save_playlist_form" value="savePlaylist" class="form__btn btn btn-primary">
        Save
        <span class="form__btn__icon mdi-set mdi-playlist-music" />
      </button>
    </div>`;

    ModalTemplateMainSet("Save Playlist", "", body, footer);
    $('#ModalTemplate').modal({show: true});
  });

  $("#ModalTemplate").on("click", "#savePlaylist", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "savePlaylist") {
      // Check for special characters
      if (/^[a-zA-Z0-9-_ ]*$/.test(title) == false) {
        console.log('don\'t do that');
        return false;
      }

      if (MSTREAMPLAYER.playlist.length == 0) {
        const body = `<span>Playlist is empty!</span>`;
        ModalTemplateInfoSet("Info", body, "", 2000);
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

        const body = `<span>Playist ${title} successfully saved!</span>`;

        const footer = `
        <button id="cancel" type="submit" form="" value="cancel"
        class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
            class="form__btn__icon mdi-set mdi-close"></span>
        </button> `;

        ModalTemplateSuccessSet("Success",body,footer);

        if (programState[0].state === 'allPlaylists') {
          getAllPlaylists();
        }

        VUEPLAYER.playlists.push({
          name: title,
          type: 'playlist'
        });
      });

    }
  });

  //#####################################################################################
  //########################## Add to Playlist Modal (mobile only)#######################
  //#####################################################################################

  //#####################################################################################
  //############################# Rate Song Modal (mobile only)##########################
  //#####################################################################################

});