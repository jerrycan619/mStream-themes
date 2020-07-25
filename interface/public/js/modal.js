$(document).ready(function () {
  
    //#####################################################################################
    //# Setup Modal Functions to fill the template and control the functions of the modal #
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
  
    function ModalTemplateErrorSet(header,body,footer, timeout = 0, autoHide = false) {
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
      // Fix for texteare which stays visible even with backface-visibility: hidden!!!
      $('#ModalTemplate .ModalTemplate--front textarea').css('opacity','0');
      $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          if (autoHide) {$('#ModalTemplate').modal('hide');}
          $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
          $('#ModalTemplate .ModalTemplate--back1').css('transform','rotateY(180deg)');
        }, timeout);
      }
    }
    function ModalTemplateInfoSet(header,body,footer, timeout = 0, autoHide = false) {
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
      // Fix for texteare which stays visible even with backface-visibility: hidden!!!
      $('#ModalTemplate .ModalTemplate--front textarea').css('opacity','0');
      $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          if (autoHide) {$('#ModalTemplate').modal('hide');}
          $('#ModalTemplate .ModalTemplate--front').css('transform','rotateY(0deg)');
          $('#ModalTemplate .ModalTemplate--back2').css('transform','rotateY(180deg)');
        }, timeout);
      }
    }
    function ModalTemplateSuccessSet(header, body, footer, timeout = 0, autoHide = false) {
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
      // Fix for texteare which stays visible even with backface-visibility: hidden!!!
      $('#ModalTemplate .ModalTemplate--front textarea').css('opacity','0');
      $('#ModalTemplate .ModalTemplate--back3').css('transform','rotateY(0deg)');
  
      if (timeout > 0) {
        setTimeout(function() {
          if (autoHide) {$('#ModalTemplate').modal('hide');}
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
  window.editM3uModal = function (currentPath, file) {
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
      <button id="saveM3u" type="submit" form="edit_form" value="saveM3u"
          class="form__btn btn btn-primary">
          Save
          <span class="form__btn__icon mdi-set mdi-content-save"></span>
      </button>
    </div>`;

    console.log("File:", file);

    let body = `<form id="edit_form" class="form">
                  <input value="${currentPath}" id="editForm_currentPath" type="hidden">
                  <input value="${file}" id="editForm_M3uFile" type="hidden">`;

    const fileType = currentPath.split('.').pop();
    if (fileType === "m3u") {
      MSTREAMAPI.getM3uContent(currentPath, function (response, error) {
        console.log(response);
        console.log(error);
        //const textLines = response.content.split("\n");
        //console.log(textLines);
        body += `<textarea id="editM3uContent" name="editM3uContent" class="form__textarea">${response.content}</textarea>`;

        body += `</form>`;
        ModalTemplateMainSet("Edit m3u", expWarning, body, footer);
        $('#ModalTemplate').modal('toggle');
      });

    } else {
      body += `</form>`;
      ModalTemplateMainSet("Edit Playlist", expWarning, body, footer);
      $('#ModalTemplate').modal('toggle');
    }
  }

  $("#ModalTemplate").on("click", "#saveM3u", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "saveM3u") {

      const currentPath = $('#editForm_currentPath').val();
      const content = $('#editM3uContent').val();
      const file = $('#editForm_M3uFile').val();

      const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="editDir_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;

      MSTREAMAPI.writeM3uContent(currentPath, content, function (response, error) {
        //console.log(response);
        //console.log(error);
        if(response.status === "success") {
          const body = `<span>${currentPath} successfully edited!"</span>`;

          ModalTemplateSuccessSet("Success",body,footer);

          //Refresh
          listFileplaylist(file, true);
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


  window.editSongModal = function (currentPath) {
    //const currentPath = $(this).data("file_location");

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
          <input value="${currentPath}" id="editForm_currentPath" type="text" class="form-control form-control-sm w-100" readonly>
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
  }

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
            class="form__btn btn btn-danger">
            Delete
            <span class="form__btn__icon mdi-set mdi-delete"></span>
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
          ModalTemplateInfoSet("Info",body,"", 2000);
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
  window.createDirModal = function () {
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
  }

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
  window.editDirModal = function (button) {
    const currentPath = getDirectoryString($(button));
    console.log(currentPath);
    if (currentPath && currentPath !== "/") {
      const body = `
        <form id="editDir_form" class="form">
            <div class="input-group flex-column mb-3">
                <label for="editDir_currentPath">Directory Path</label>
                <input id="editDir_currentPath" type="text" value="${currentPath}" class="form-control form-control-sm w-100" readonly>
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
  };

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
    $('#ModalTemplate').modal('toggle');
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
  window.addSongToPlaylistMobileModal = function (song, playlists) {
    console.log("song: ", song);
    if (song.type === "stream") {
      const body = `<span>Cannot add stream to playlist!</span>`;
      ModalTemplateInfoSet("Info",body,"", 2000, true);
      //ModalTemplateRotate("info", 0);
      $('#ModalTemplate').modal('toggle');
    } else {
      const footer = `  
      <div class="col-auto p-0">
        <button id="cancelFile" type="submit" form="addToPlaylist_form" value="cancel"
        class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel 
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>
      </div>  
      <div class="col-auto p-0">
        <button id="addSongToPlaylist" type="submit" form="addToPlaylist_form" value="addSongToPlaylist"
            class="form__btn btn btn-primary">
            Save
            <span class="form__btn__icon mdi-set mdi-content-save"></span>
        </button>
      </div>`;

      let body = `<form id="addToPlaylist_form" class="form">
                    <input type="hidden" value="${song.filepath}" id="songPath" />
                    <div class="form-group col-md-4">
                      <label for="playlists">Choose a playlist</label>
                      <select id="playlists" class="form-control">
                        <option selected>Choose...</option>`;

      $.each(playlists, function( index, playlist ) {
        body += `<option>${playlist.name}</option>`;
      });

      body += "</select></div></form>"

      ModalTemplateMainSet("Add to playlist", song.filepath, body, footer);
      $('#ModalTemplate').modal('toggle');
    }
  }

  $("#ModalTemplate").on("click", "#addSongToPlaylist", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "addSongToPlaylist") {
      //console.log("filepath", $('#songPath').val());
      //console.log("playlist", $('#playlists').val());
      const songPath = $('#songPath').val();
      const playlist = $('#playlists').val();
      MSTREAMAPI.addToPlaylist(playlist, songPath, function (res, err) {
        //console.log(res);
        //console.log(err);
        if (err) {
          const body = `<span>Failed to add Song to Playlist!</span>`;
          ModalTemplateErrorSet("Error",body,"", 2000);
        } else {
          const body = `<span>Song added to Playlist ${playlist}!</span>`;

          const footer = `
          <button id="cancel" type="submit" form="" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
              class="form__btn__icon mdi-set mdi-close"></span>
          </button> `;

          ModalTemplateSuccessSet("Success",body,footer);
        }
        
      });
    }
  
  });

  //#####################################################################################
  //############################# Rate Song Modal (mobile only)##########################
  //#####################################################################################
  window.rateSongMobileModal = function (song) {
    console.log("rateSong: ", song);
    const footer = `  
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
      <star-rating class="" @rating-selected="overlay_setRating" v-model="rating"
      v-bind:increment="0.5" v-bind:clearable="true" v-bind:star-size="25" v-bind:padding="8"
      v-bind:border-color="000">
  </star-rating>`;

    ModalTemplateMainSet("Rate Song", "TODO", body, footer);
    $('#ModalTemplate').modal('toggle');
  }

  //#####################################################################################
  //################################### Radio Station ###################################
  //#####################################################################################
  $("#header_row").on('click', '#addRadioStation', function () {
    const body = `
    <form id="add_radio_form" class="form">
      <div class="input-group form-group">
        <div class="input-group-prepend">
          <span class="input-group-text">Name</span>
        </div>
        <input id="addRadio_name" type="text" class="form-control">
      </div>
      <div class="input-group form-group">
        <div class="input-group-prepend">
          <span class="input-group-text">URL</span>
        </div>
        <input id="addRadio_url" type="text" class="form-control">
      </div>
    </form>`;
    const footer = `
    <div class="col p-0">
      <button id="saveRadio" type="submit" form="add_radio_form" value="saveRadio" class="form__btn btn btn-primary">
        Add Radio
        <span class="form__btn__icon mdi-set mdi-radio" />
      </button>
    </div>`;

    ModalTemplateMainSet("Add Radio Stream", "", body, footer);
    $('#ModalTemplate').modal('toggle');
  });

  $("#ModalTemplate").on("click", "#saveRadio", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "saveRadio") {
      const radioName = $('#addRadio_name').val();
      const radioUrl = $('#addRadio_url').val();
      console.log("add radioName:", radioName);
      console.log("add radioUrl:", radioUrl);

      MSTREAMAPI.addRadioStation(radioUrl, radioName, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `
            <span>Radio name: ${response.name}</span>
            <span>Radio url: ${response.url}</span>`;

          const footer = `
          <button id="cancel" type="submit" form="editDir_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
              class="form__btn__icon mdi-set mdi-close"></span>
          </button> `;

          ModalTemplateSuccessSet("Success",body,footer);

          //Refresh
          getAllRadioStations();
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
  });

  $("#fillContent").on('click', '.editRadioStation', function () {
    const stationID = $(this).data("stationid");

    MSTREAMAPI.getRadioStationById(stationID, function (response, error) {
      console.log(response);
      console.log(error);

      if (error === false) {
        const stationName = response.stationName;
        const stationURL = response.stationUrl;
      
        const body = `
        <form id="edit_radio_form" class="form">
        <input id="editRadio_id" value="${stationID}" type="hidden" >
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Name</span>
            </div>
            <input id="editRadio_name" value="${stationName}" type="text" class="form-control">
          </div>
          <div class="input-group form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">URL</span>
            </div>
            <input id="editRadio_url" value="${stationURL}" type="text" class="form-control">
          </div>
        </form>`;
        const footer = `
        <div class="col-auto p-0">
          <button id="deleteRadio" type="submit" form="edit_radio_form" value="deleteRadio"
              class="form__btn btn btn-danger mdi-set mdi-delete">
          </button>
        </div>
        <div class="col p-0"></div>
        <div class="col-auto p-0">
          <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
            class="form__btn btn btn-secondary" data-dismiss="modal">
            Cancel
            <span class="form__btn__icon mdi-set mdi-cancel"></span>
          </button>  
        </div>
        <div class="col-auto p-0">
          <button id="editRadio" type="submit" form="edit_radio_form" value="editRadio"
              class="form__btn btn btn-primary">
              Save
              <span class="form__btn__icon mdi-set mdi-content-save"></span>
          </button>
        </div>`;

        ModalTemplateMainSet("Edit Radio Stream", "", body, footer);
        $('#ModalTemplate').modal('toggle');
      }
    
    });
  });

  $("#ModalTemplate").on("click", "#editRadio", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "editRadio") {
      const stationID = $('#editRadio_id').val();
      const stationName = $('#editRadio_name').val();
      const stationUrl = $('#editRadio_url').val();
      MSTREAMAPI.editRadio(stationID, stationUrl, stationName, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `
            <span>Updated Radio name: ${response.name}</span>
            <span>Updated Radio url: ${response.url}</span>`;

          const footer = `
          <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">Close<span
              class="form__btn__icon mdi-set mdi-close"></span>
          </button> `;

          ModalTemplateSuccessSet("Success",body,footer);

          //Refresh
          getAllRadioStations();
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
  });

  $("#ModalTemplate").on("click", "#deleteRadio", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "deleteRadio") {
      const stationName = $('#editRadio_name').val();
      const stationUrl = $('#editRadio_url').val();

      const body = `<span>Delete: ${stationName}</span> <br> <span>${stationUrl} ?</span>`;
      const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col p-0">
        <button id="confirmDeleteRadio" type="submit" form="edit_radio_form" value="confirmDeleteRadio"
            class="form__btn btn btn-danger mdi-set mdi-delete">
            Delete
        </button>
      </div>`;

      ModalTemplateInfoSet("Confirm",body,footer);
    }
  });
      
  $("#ModalTemplate").on("click", "#confirmDeleteRadio", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "confirmDeleteRadio") {
      const stationID = $('#editRadio_id').val();
      const stationName = $('#editRadio_name').val();
      const stationUrl = $('#editRadio_url').val();

      MSTREAMAPI.deleteRadio(stationID, stationUrl, stationName, function (response, error) {
        if(response.status === "success") {
          const body = `<span>Successfully deleted: ${response.name}</span><br><span>${response.url}</span>`;
          const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;
          ModalTemplateSuccessSet("Success",body,footer);
          ModalTemplateRotate("info", 180);
          
          //Refresh
          getAllRadioStations();
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

  $("#header_row").on('click', '#importStations', function () {
    const body = `
      <form id="edit_radio_form" class="form">
        <input type="file" accept=".pls" id="importRadioFile" value="importRadioFile" />
      </form>`;
    const footer = `
      <div class="col-auto p-0">
        <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col-auto p-0">
        <button id="importRadios" class="form__btn btn btn-primary" value="importRadios">
          Import
          <span class="form__btn__icon mdi-set mdi-import"></span>
        </button>
      </div>`;

    ModalTemplateMainSet("Import Stations", "", body, footer);
    $('#ModalTemplate').modal('toggle');
  });

  $("#ModalTemplate").on("click", "#importRadios", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "importRadios") {
      var files = document.getElementById('importRadioFile').files;
      //console.log(files);
      if (files.length <= 0) {
        return false;
      }

      var fr = new FileReader();

      fr.onload = function(e) { 
        //console.log(e);
        const lines = e.target.result.split("\n");
        //console.log("lines: ", lines);
        if (lines[0] !== "[playlist]") {
          console.log("Unable to parse file");
          return;
        }
        const numberOfEntrys = lines[1].split("=").pop();
        console.log("numberOfEntrys: ", numberOfEntrys);
        if (!numberOfEntrys) {
          console.log("Unable to parse file");
          return;
        }

        for (let i = 1; i <= numberOfEntrys; i++) {        
          let stationName = '';
          let stationUrl = '';
          $.each(lines, function(index, value) {
            if (value.indexOf("Title" + i) >= 0) {
              stationName = lines[index].substring(lines[index].indexOf('=')+1); //split-string-only-on-first-instance-of-specified-character (because url can contain multiple "=")
            }
            if (value.indexOf("File" + i) >= 0) {
              stationUrl = lines[index].substring(lines[index].indexOf('=')+1);
            }
          });
          //console.log("add name: ", stationName);
          //console.log("add url: ", stationUrl);
          MSTREAMAPI.addRadioStation(stationUrl, stationName, function (response, error) {
            //console.log(response);
            //console.log(error);
          });
        }
        //TODO: Error handleing
        const body = `<span>Successfully Imported!</span>`;
        const footer = `
        <div class="col p-0">
          <button id="cancel" type="submit" form="edit_radio_form" value="cancel"
            class="form__btn btn btn-secondary" data-dismiss="modal">
            Close
            <span class="form__btn__icon mdi-set mdi-close"></span>
          </button>  
        </div>`;
        ModalTemplateSuccessSet("Success",body,footer);
        
        //Refresh
        getAllRadioStations();

      }

      fr.readAsText(files.item(0));
    }
  });

  //#####################################################################################
  //#################################### AutoDJ #########################################
  //#####################################################################################
  window.addAutoDjCategory = function () {
    const body = `
    <form id="add_autoDjCat_form" class="form">
      <div class="input-group form-group">
        <div class="input-group-prepend">
          <span class="input-group-text">Title</span>
        </div>
        <input id="addAutoDjCat_title" type="text" class="form-control">
      </div>
      <div class="input-group form-group">
        <div class="input-group-prepend">
          <span class="input-group-text">Sub Title</span>
        </div>
        <input id="addAutoDjCat_subtitle" type="text" class="form-control">
      </div>
    </form>`;
    const footer = `
    <div class="col p-0">
      <button id="saveAutoDjCategory" type="submit" form="add_autoDjCat_form" value="saveAutoDjCategory" class="form__btn btn btn-primary">
        Add Category
        <span class="form__btn__icon mdi-set mdi-plus-circle-outline" />
      </button>
    </div>`;

    ModalTemplateMainSet("Add AutoDj Category", "", body, footer);
    $('#ModalTemplate').modal('toggle');
  }

  $("#ModalTemplate").on("click", "#saveAutoDjCategory", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "saveAutoDjCategory") {
      const title = $('#addAutoDjCat_title').val();
      const subTitle = $('#addAutoDjCat_subtitle').val();
      console.log("Add Title: ", title);
      console.log("Add subTitle: ", subTitle);
      MSTREAMAPI.addCat(title, subTitle, function (response, error) {
        console.log(response);
        console.log(error);
        if(response.status === "success") {
          const body = `<span>Successfully added: ${response.title}</span><br><span>${response.subtitle}</span>`;
          const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="add_autoDjCat_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;
          ModalTemplateSuccessSet("Success",body,footer);
          ModalTemplateRotate("info", 180);
          
          //Refresh
          getAutoDjView();
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
  
  window.addPathToAutoDj = function (path) {
    //console.log("addToAutoDj: ", path);
    let pathStr = $(path).data("directory");
    if ($(path).data("type") !== "file") {
      pathStr = getDirectoryString($(path));
    } 

    MSTREAMAPI.getAllAutoDj(function (response, error) {
      let body = `<form id="add_to_autodjcat">
                    <input id="addAutoDjPath" type="hidden" value="${pathStr}" />
                    <select id="autoDjCatList" class="form-control">
                      <option value="undefined" selected>Choose...</option>`;

      $.each(response, function () {
        if (this.type === "category") {
          body += `<option value="${this.id}">${this.title}</option>`;
        }
      });
      body += "</select></div></form>";

      const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="add_to_autodjcat" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Close
          <span class="form__btn__icon mdi-set mdi-close"></span>
        </button>  
      </div>
      <div class="col p-0">
        <button id="addToCategory" type="submit" form="add_to_autodjcat" value="addToCategory" class="form__btn btn btn-primary">
          Add
          <span class="form__btn__icon mdi-set mdi-plus-circle-multiple-outline" />
        </button>
      </div>`;

      ModalTemplateMainSet("Add to AutoDj", "", body, footer);
      $('#ModalTemplate').modal('toggle');
    });
  }

  $("#ModalTemplate").on("click", "#addToCategory", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "addToCategory") {
      const path = $('#addAutoDjPath').val();
      const catId = $('#autoDjCatList').val();
      const catTitle = $('#autoDjCatList option:selected').text();

      if (catId === "undefined") {
        const body = `<span>No category selected!</span>`;
        ModalTemplateInfoSet("Info",body,"", 2000);
      } else {
        console.log("Add Path: ", path);
        console.log("to catId: ", catId);

        MSTREAMAPI.addPath(path, catId, function (response, error) {
          console.log(response);
          console.log(error);
          if(response.status === "success") {
            const body = `<span>Successfully added: ${path} to ${catTitle}</span>`;
            const footer = `
            <div class="col p-0">
              <button id="cancel" type="submit" form="add_to_autodjcat" value="cancel"
                class="form__btn btn btn-secondary" data-dismiss="modal">
                Close
                <span class="form__btn__icon mdi-set mdi-close"></span>
              </button>  
            </div>`;
            ModalTemplateSuccessSet("Success",body,footer);
            ModalTemplateRotate("info", 180);
            
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
      
    } 
  });

  window.editAudoDjCat = function (cat_id) {
    MSTREAMAPI.getCat(cat_id, function (response, error) {
      console.log(response);
      console.log(error);
      const body = `
      <form id="edit_autoDjCat_form" class="form">
      <input id="editAutoDjCat_id" type="hidden" value="${response.category_id}" />
        <div class="input-group form-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Title</span>
          </div>
          <input id="editAutoDjCat_title" type="text" value="${response.title}" class="form-control">
        </div>
        <div class="input-group form-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Sub Title</span>
          </div>
          <input id="editAutoDjCat_subtitle" type="text" value="${response.subtitle}" class="form-control">
        </div>
      </form>`;
      const footer = `
      <div class="col-auto p-0">
            <button id="deleteAutoDjCat" type="submit" form="edit_autoDjCat_form" value="deleteAutoDjCat"
                class="form__btn btn btn-danger mdi-set mdi-delete">
            </button>
      </div>
      <div class="col p-0"></div>
      <div class="col-auto p-0">
        <button id="cancel" type="submit" form="edit_autoDjCat_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col-auto p-0">
        <button id="editAutoDjCategory" type="submit" form="edit_autoDjCat_form" value="editAutoDjCategory" class="form__btn btn btn-primary">
          Edit Category
          <span class="form__btn__icon mdi-set mdi-pencil" />
        </button>
      </div>`;

      ModalTemplateMainSet("Edit AutoDj Category", "", body, footer);
      $('#ModalTemplate').modal('toggle');
    });
  }

  $("#ModalTemplate").on("click", "#deleteAutoDjCat", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "deleteAutoDjCat") {
      const title = $('#editAutoDjCat_title').val();
      const subtitle = $('#editAutoDjCat_subtitle').val();
      const id = $('#editAutoDjCat_id').val();

      const body = `<span>Delete: ${title}</span> <br> <span>${subtitle} ?</span>`;
      const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="edit_autoDjCat_form" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Cancel
          <span class="form__btn__icon mdi-set mdi-cancel"></span>
        </button>  
      </div>
      <div class="col p-0">
        <button id="confirmDeleteAutoDjCat" type="submit" form="edit_autoDjCat_form" value="confirmDeleteAutoDjCat"
            class="form__btn btn btn-danger mdi-set mdi-delete">
            Delete
        </button>
      </div>`;

      ModalTemplateInfoSet("Confirm",body,footer);
    }
  });
      
  $("#ModalTemplate").on("click", "#confirmDeleteAutoDjCat", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "confirmDeleteAutoDjCat") {
      const title = $('#editAutoDjCat_title').val();
      const subtitle = $('#editAutoDjCat_subtitle').val();
      const id = $('#editAutoDjCat_id').val();

      MSTREAMAPI.deleteCat(id, function (response, error) {
        if(response.status === "success") {
          const body = `<span>Successfully deleted: ${title}</span><br><span>${subtitle}</span>`;
          const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="edit_autoDjCat_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;
          ModalTemplateSuccessSet("Success",body,footer);
          ModalTemplateRotate("info", 180);
          
          //Refresh
          getAutoDjView();
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

  $("#ModalTemplate").on("click", "#editAutoDjCategory", function (e) {
    e.preventDefault();
    //Double check
    if($(this).val() === "editAutoDjCategory") {
      const title = $('#editAutoDjCat_title').val();
      const subtitle = $('#editAutoDjCat_subtitle').val();
      const id = $('#editAutoDjCat_id').val(); 
      MSTREAMAPI.editCat(id, title, subtitle, function (response, error) {
        if(response.status === "success") {
          const body = `<span>Successfully edited: ${title}</span><br><span>${subtitle}</span>`;
          const footer = `
          <div class="col p-0">
            <button id="cancel" type="submit" form="edit_autoDjCat_form" value="cancel"
              class="form__btn btn btn-secondary" data-dismiss="modal">
              Close
              <span class="form__btn__icon mdi-set mdi-close"></span>
            </button>  
          </div>`;
          ModalTemplateSuccessSet("Success",body,footer);
          ModalTemplateRotate("info", 180);
          
          //Refresh
          getAutoDjView();
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

  window.deleteAutoDjPath = function (path_id) {
    console.log("Delete Path_ID: ", path_id);
    MSTREAMAPI.deletePath(path_id, function (response, error) {
      if(response.status === "success") {
        const body = `<span>Successfully deleted!</span>`;
        const footer = `
        <div class="col p-0">
          <button id="cancel" type="submit" form="edit_autoDjCat_form" value="cancel"
            class="form__btn btn btn-secondary" data-dismiss="modal">
            Close
            <span class="form__btn__icon mdi-set mdi-close"></span>
          </button>  
        </div>`;
        ModalTemplateMainSet("Deleted Path", "", body, footer);
        $('#ModalTemplate').modal('toggle');
        ModalTemplateSuccessSet("Success",body,footer);
        ModalTemplateRotate("info", 180);
        
        //Refresh
        getAutoDjView();
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

  window.autoDjSettings = function () {
    const includedCats = JSON.parse(localStorage.getItem("autoDJ-Cats"));
    console.log("includedCats: ", includedCats);
    let body = `<div>Get random song from: </div>
                   <ul id="includeAutoDjCatUl" class="list-group">`;

    $.each(includedCats, function (key, val) {
      body += `<li class="list-group-item">
        <div class="row m-0 flex-nowrap">
          <div class="col p-0">${val}</div>
          <div class="col-auto p-0"><span data-value="${key}" class="removeCatFromIncludedCats mdi-set mdi-delete"></span></div>
        </div>
      </li>`;
    });
    body += `</ul>`;

    MSTREAMAPI.getAllAutoDj(function (response, error) {
      body += `<form id="edit_autoDjSettings">
                    <select id="includeAutoDjCatList" class="form-control">
                      <option value="undefined" selected>Choose...</option>`;

      $.each(response, function () {
        if (this.type === "category") {
          body += `<option value="${this.id}">${this.title}</option>`;
        }
      });
      body += `</select></div><hr>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">min. Rating</span>
        </div>
        <input type="number" min="0" max="5" step="0.5" class="form-control" value="0" aria-label="minimum star rating">
        <div class="input-group-append">
          <span class="input-group-text mdi-set mdi-star"></span>
        </div>
      </div>  
      </form>`;

      const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="edit_autoDjSettings" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Close
          <span class="form__btn__icon mdi-set mdi-close"></span>
        </button>  
      </div>`;

      ModalTemplateMainSet("AutoDJ Settings", "", body, footer);
      $('#ModalTemplate').modal('toggle');
    });
  }

  $("#ModalTemplate").on("change", "#includeAutoDjCatList", function () {
    let includedCats = JSON.parse(localStorage.getItem("autoDJ-Cats"));
    if (!includedCats) {
      includedCats = {};
    }
    const catId = $('#includeAutoDjCatList').val();
    const catTitle = $('#includeAutoDjCatList option:selected').text();
    console.log("includedCats: ", includedCats);

    let autoDJPaths = {}; 
    includedCats[catId] = catTitle;

    autoDJPaths = JSON.stringify(includedCats);
    localStorage.setItem("autoDJ-Cats", autoDJPaths);

    $("#includeAutoDjCatUl").append(`<li class="list-group-item">
    <div class="row m-0 flex-nowrap">
      <div class="col p-0">${catTitle}</div>
      <div class="col-auto p-0"><span data-value="${catId}" class="removeCatFromIncludedCats mdi-set mdi-delete"></span></div>
    </div>
    </li>`);
  });

  $("#ModalTemplate").on("click", ".removeCatFromIncludedCats", function (e) {
    e.preventDefault();
    let includedCats = JSON.parse(localStorage.getItem("autoDJ-Cats"));
    const deleteCat = $(this).data("value");
    console.log("removeCat: ", deleteCat);
    delete includedCats[deleteCat];
    includedCats = JSON.stringify(includedCats);
    localStorage.setItem("autoDJ-Cats", includedCats);

    $(this).closest("li").remove();
  });

  window.importAutoDjList = function () {
    const body = `<span>TODO!</span>`;
    const footer = `
      <div class="col p-0">
        <button id="cancel" type="submit" form="edit_autoDjSettings" value="cancel"
          class="form__btn btn btn-secondary" data-dismiss="modal">
          Close
          <span class="form__btn__icon mdi-set mdi-close"></span>
        </button>  
      </div>`;

    ModalTemplateMainSet("AutoDJ import list", "", body, footer);
    $('#ModalTemplate').modal('toggle');
  }

});