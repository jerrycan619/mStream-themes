$(document).ready(function (e) {

    //Change Icon on Submenu to arrow down if expanded
    $('#nav_library').click(function() {
        $(".navbar_icon", this).toggleClass("mdi-music-box-multiple mdi-chevron-down");
    });
    $('#nav_system').click(function() {
        $(".navbar_icon", this).toggleClass("mdi-cog mdi-chevron-down");
    });

    //#################### PlayerBar Swipe Up #############################
    const panel = document.getElementById("vert_resize");

    panel.style.maxHeight = "calc(" + window.innerHeight + "px - 4rem)";
    panel.style.minHeight = "4rem";

    var maxHeight = parseInt(getComputedStyle(panel, '').maxHeight, 10);
    var minHeight = parseInt(getComputedStyle(panel, '').minHeight, 10);

    let m_pos;
    function resize_mouse(e){
        const dx = m_pos - e.y;
        m_pos = e.y;
        panel.style.height = (parseInt(getComputedStyle(panel, '').height) + dx) + "px";
    }

    function resize_touch(e){
        const dx = m_pos - e.touches[0].clientY;
        m_pos = e.touches[0].clientY;
        panel.style.height = (parseInt(getComputedStyle(panel, '').height) + dx) + "px";
    }

    panel.addEventListener("mousedown", function(e){
        //Recalc max height if Fullscreen change
        panel.style.maxHeight = "calc(" + window.innerHeight + "px - 4rem)";
        maxHeight = parseInt(getComputedStyle(panel, '').maxHeight, 10);
        minHeight = parseInt(getComputedStyle(panel, '').minHeight, 10);

        m_pos = e.clientY;
        document.addEventListener("mousemove", resize_mouse, false);
    }, false);

    panel.addEventListener("touchstart", function(e){
        //Recalc max height if Fullscreen change
        panel.style.maxHeight = "calc(" + window.innerHeight + "px - 4rem)";
        maxHeight = parseInt(getComputedStyle(panel, '').maxHeight, 10);
        minHeight = parseInt(getComputedStyle(panel, '').minHeight, 10);

        m_pos = e.touches[0].clientY;
        document.addEventListener("touchmove", resize_touch, false);
    }, false);

    document.addEventListener("mouseup", function(){
        document.removeEventListener("mousemove", resize_mouse, false);
        const actualHeight = parseInt(getComputedStyle(panel, '').height, 10);
        
        
        if (actualHeight > maxHeight/2) {
            $( "#vert_resize" ).animate({
                height: maxHeight
              }, 300, function() {
                console.log("end");
            });
              
        } else {
            $( "#vert_resize" ).animate({
                height: minHeight
                }, 300, function() {
                //Callback on End
            }); 
        }
    }, false);

    //for touchcancel too???
    document.addEventListener("touchend", function(){
        document.removeEventListener("touchmove", resize_touch, false);
        const actualHeight = parseInt(getComputedStyle(panel, '').height, 10);
        if ($( "#vert_resize" ).hasClass("playlist_expanded")) {
            if (actualHeight >= maxHeight*(3/4)) {
                $( "#vert_resize" ).animate({
                    height: maxHeight
                  }, 300, function() {
                    
                });  
            } else {
                $( "#vert_resize" ).animate({
                    height: minHeight
                  }, 300, function() {
                    $( "#vert_resize" ).toggleClass("playlist_expanded");
                }); 
            }
        } else {
            if (actualHeight >= maxHeight*(1/4)) {
                $( "#vert_resize" ).animate({
                    height: maxHeight
                  }, 300, function() {
                    $( "#vert_resize" ).toggleClass("playlist_expanded");
                });  
            } else {
                $( "#vert_resize" ).animate({
                    height: minHeight
                  }, 300, function() {
                    
                }); 
            }
        }
        
    }, false);

    //########### Header Text Double Tap to make Fullscreen #################
    var header_text = document.getElementById('contentHeader_text');
    var tap_timeout1;
    var header_text_lastTap1 = 0;

    header_text.addEventListener('touchend', function(event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - header_text_lastTap1;
        clearTimeout(tap_timeout1);
        if (tapLength < 500 && tapLength > 0) {
            screenfull.toggle();
            event.preventDefault();
        } else {
            tap_timeout1 = setTimeout(function() {
                clearTimeout(tap_timeout1);
            }, 500);
        }
        header_text_lastTap1 = currentTime;
    });

    var tap_timeout2;
    var header_text_lastTap2 = 0;

    header_text.addEventListener('mouseup', function(event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - header_text_lastTap2;
        clearTimeout(tap_timeout2);
        if (tapLength < 500 && tapLength > 0) {
            screenfull.toggle();
            event.preventDefault();
        } else {
            tap_timeout2 = setTimeout(function() {
                clearTimeout(tap_timeout2);
            }, 500);
        }
        header_text_lastTap2 = currentTime;
    });


    //#################### PlayerBar double tap #############################
    var elm1 = document.getElementById('player');
    var elm2 = document.getElementById('fillContent');
    var timeout;
    var lastTap = 0;

    elm1.addEventListener('touchend', function(event) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        clearTimeout(timeout);
        if (tapLength < 500 && tapLength > 0) {
            //console.log('Double Tap');
            $('#main_content').hide();
            $('#playerOverlay').show();
            event.preventDefault();
        } else {
            //console.log('Single Tap');
            timeout = setTimeout(function() {
                //console.log('Single Tap (timeout)');
                clearTimeout(timeout);
            }, 500);
        }
        lastTap = currentTime;
    });

    var timeout2;
    var lastTap2 = 0;

    elm1.addEventListener('mouseup', function(event) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap2;
        clearTimeout(timeout2);
        if (tapLength < 500 && tapLength > 0) {
            //console.log('Double Tap');
            $('#main_content').hide();
            $('#playerOverlay').show();
            event.preventDefault();
        } else {
            //console.log('Single Tap');
            timeout2 = setTimeout(function() {
                //console.log('Single Tap (timeout)');
                clearTimeout(timeout2);
            }, 500);
        }
        lastTap2 = currentTime;
    });

});

/* Song Button Box slide out / in
/* Delegated events - for elements that gets dynamically renderd */
/* Attach event-hanlder to parent which is present on document render (#filelist) */
/* get its childs which are dynamically added or removed (.song-button-box) */
$("#fillContent").on("click", ".song-button-box .fold", function (event) {
    $(this).closest('.song-button-box').toggleClass('sbb_fold sbb_unfold');
    $(this).toggleClass('mdi-chevron-left mdi-chevron-right');  
});

$("#playlist_scrollBox").on("click", ".song-button-box .fold", function (event) {
    $(this).closest('.song-button-box').toggleClass('sbb_fold sbb_unfold');
    $(this).toggleClass('mdi-chevron-left mdi-chevron-right');
});