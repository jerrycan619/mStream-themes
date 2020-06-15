// Collapse Menu from https://www.codeply.com/go/3e0RAjccRO/bootstrap-4-collapsing-sidebar-menu

// Hide submenus
$('#body-row .collapse').collapse('hide');


// Collapse/Expand icon
$('#collapse-icon').addClass('mdi-chevron-triple-left');


const mstreamIconSmall = 
'<svg class="logo" alt="mStream"  xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 80 80">' +
    '<g class="test" transform="matrix(0.90653854,0,0,0.90653854,-59.791605,-34.562198)">' +
        '<path d="m 75,118.5 v -83 l 21,13 v 70 z" class="st1" />' +
        '<path d="m 99,118.5 v -69 l 11.5,7 10.5,-7 v 69 z" class="st2" />' +
        '<path d="m 124,118.5 v -70 l 21,-13 v 83 z" class="st1" />' +
    '</g>' +
'</svg>';

const mstreamIconFull = 
'<svg class="logo" alt="mStream" width="181" xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 620 180">' +
    '<g class="test">' +
        '<path class="st0" d="M179.9 45.5c-6.2 0-11.5 1.7-15.9 5s-6.5 8.1-6.5 14.4c0 4.9 1.3 9.1 3.8 12.4 2.5 3.4 5.7 5.8 9.3 7.3 3.7 1.5 7.3 2.8 11 3.8s6.8 2.3 9.3 3.9c2.5 1.5 3.8 3.5 3.8 5.8 0 4.8-4.4 7.2-13.1 7.2h-24.1V118h24.1c17.1 0 25.6-6.7 25.6-20.2 0-1.9-.2-3.8-.6-5.8-.4-2-1.2-4-2.6-6-1.3-2.1-3.3-3.7-5.8-4.9-2.5-1.2-6.4-2.7-11.5-4.5l-8.8-3.1c-.7-.2-1.7-.7-2.9-1.3-1.3-.7-2.2-1.3-2.8-1.9-.6-.6-1.1-1.4-1.6-2.3-.5-.9-.7-2-.7-3.2 0-2 1-3.5 2.9-4.6 1.9-1.1 4.3-1.6 7-1.6h24.6V45.5h-24.5zM226.4 58.3v31c0 10.2 2.5 17.6 7.6 22 5.1 4.4 13 6.6 23.7 6.6v-12.8c-2.7 0-4.9-.2-6.8-.4-1.8-.3-3.7-.9-5.8-1.9-2-.9-3.6-2.6-4.7-4.9-1.1-2.3-1.6-5.2-1.6-8.7V58.3h18.8V45.5h-18.8V31.6L214 58.3h12.4zM281.1 118V76.8c0-7.2.9-12 2.6-14.5 1-1.3 2.2-2.2 3.6-2.8 1.4-.6 2.6-1 3.6-1.1 1-.1 2.5-.1 4.3-.1H310V45.5h-12.2c-3.6 0-6.5.1-8.6.3-2.1.2-4.5.9-7.3 2s-5.1 2.8-7.1 5c-4 4.4-6 12.4-6 24V118h12.3zM326.2 53.8c-6.2 7.4-9.3 17-9.3 28.9 0 10.7 3.2 19.4 9.5 26.2s14.7 10.1 25.3 10.1c8.7 0 16.3-2.7 22.7-8.1L366 102c-3.7 2.1-8.5 3.2-14.3 3.2-6.5 0-11.8-2.3-15.8-6.9-4-4.6-6-10.5-6-17.9 0-7 1.9-12.9 5.6-17.9 3.8-5 8.9-7.5 15.5-7.5 3.3 0 6.1.8 8.2 2.4 2.1 1.6 3.2 4 3.2 7.2 0 5-1.2 8.5-3.6 10.6-2.4 2.1-6.7 3.2-12.9 3.2h-6.7v11.7h5.7c20.3 0 30.5-8.5 30.5-25.4 0-13.6-7.9-20.7-23.7-21.5-10.8-.2-19.3 3.3-25.5 10.6zM412.3 73.2c-7.4 0-13.6 1.9-18.5 5.7-4.9 3.8-7.4 9.4-7.4 16.7 0 7.3 2.3 12.9 7 16.7 4.6 3.8 10.9 5.7 18.8 5.7h31V73.6c0-9.1-2.4-16-7.2-20.8-4.8-4.8-11.7-7.2-20.7-7.2h-22.9v12.8h22.3c10.9 0 16.4 6.1 16.4 18.2v28.7h-18.4c-9.1 0-13.6-3.2-13.6-9.8 0-3.3 1.2-5.9 3.6-7.8 2.4-1.8 5.8-2.7 10.2-2.7 5.1 0 9.4 1.4 12.9 4.3v-14c-4.9-1.4-9.3-2.1-13.5-2.1zM458.8 118H471V58.3h24.4V118h12.2V58.3h5.7c6.8 0 11.3.7 13.5 2 4.3 2.5 6.5 7.7 6.5 15.5V118h12.2V75.7c0-6-.6-11.2-1.9-15.5-1.2-4.3-3.9-7.8-7.9-10.6-3.9-2.7-9.1-4.1-15.7-4.1h-61.4V118z" />' +
        '<path class="st1" d="M75 118.5v-83l21 13v70z" />' +
        '<path class="st2" d="M99 118.5v-69l11.5 7 10.5-7v69z" />' +
        '<path class="st1" d="M124 118.5v-70l21-13v83z" />' +
    '</g>' +
'</svg>';

// mStream icon
//$('#mstream-icon').html(mstreamIconFull);

// Messy as fuck
//TODO: Clean Up and/or find a better way
const sidebarWidthCollapsed = 56; //px
const sidebarWidthExpanded = 208; //px

let sidebarWidth = 0;
if ($('#sidebar-container').hasClass('sidebar-expanded')) {
    sidebarWidth = sidebarWidthExpanded;
} else {
    sidebarWidth = sidebarWidthCollapsed;
}


function rezise_columns() {
    $('.mstream_col').each(function() {
        if ($('#sidebar-container').hasClass('sidebar-expanded')) {
            $(this).css("width", "calc(50% - " + (sidebarWidthExpanded/2) + "px)");
        } else {
            $(this).css("width", "calc(50% - " + (sidebarWidthCollapsed/2) + "px)");
        }
        
    });
}

rezise_columns();

/* Not Working?! - Workaround with href === "#collapse"
// Collapse click
$('[data-toggle="sidebar-colapse"]').click(function () {
    console.log("collapse");
    SidebarCollapse();
}); */

function SidebarCollapse() {
    $('.menu-collapsed').toggleClass('d-none');
    //$('.sidebar-submenu').toggleClass('d-none');
    $('.sidebar-submenu .submenu_item').css('padding-left', '');
    $('.submenu-icon').toggleClass('d-none');
    $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');

    rezise_columns();

    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if (SeparatorTitle.hasClass('d-flex')) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }

    if ($('#sidebar-container').hasClass('sidebar-expanded')) {
        sidebarWidth = sidebarWidthExpanded;
    } else {
        sidebarWidth = sidebarWidthCollapsed;
    }

    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('mdi-chevron-triple-left mdi-chevron-triple-right');

}

// prevent navigation
document.addEventListener("DOMContentLoaded", function () {
    var links = document.getElementsByTagName("A");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function (e) {
            var href = this.getAttribute("href")

            if (!href) {
                return
            }

            if (href === '#') {
                // hash only ('#')
                console.debug('Internal nav allowed by Codeply');
                e.preventDefault();
            } else if (href === "#collapse") {
                SidebarCollapse();
                e.preventDefault();

            } else if (this.hash) {
                // hash with tag ('#foo')
                var element = null
                try {
                    element = document.querySelector(this.hash);
                } catch (e) {
                    console.debug('Codeply internal nav querySelector failed');
                }
                if (element) {
                    // scroll to anchor
                    e.preventDefault();
                    const top = element.getBoundingClientRect().top + window.pageYOffset;
                    //window.scrollTo({top, behavior: 'smooth'})
                    window.scrollTo(0, top);
                    console.debug('Internal anchor controlled by Codeply to element:' + this
                        .hash)
                } else {
                    // allow javascript routing
                    console.debug('Internal nav route allowed by Codeply');
                }
            } else if (href.indexOf("/p/") === 0 || href.indexOf("/v/") === 0) {
                // special multi-page routing
                console.debug('Special internal page route: ' + href)

                var l = href.replace('/p/', '/v/')

                // reroute
                e.preventDefault()
                var newLoc = l + '?from=internal'
                console.debug('Internal view will reroute to ' + newLoc)
                location.href = newLoc
            } else if (href.indexOf("./") === 0) {
                // special multi-page routing
                console.debug('Special internal ./ route: ' + href)

                var u = parent.document.URL.split("/")
                var pn = href.split("/")[1]
                var plyId = u[u.length - 1]

                if (plyId.indexOf('?from') > -1) {
                    // already rerouted this
                    console.debug('already rerouted')
                    plyId = u[u.length - 2]
                }

                var l = plyId + '/' + pn

                console.debug(u)
                console.debug(pn)
                console.debug('l', l)

                // reroute
                e.preventDefault()
                var newLoc = '/v/' + l + '?from=internal'
                console.debug('Internal page will reroute to ' + newLoc)
                location.href = newLoc
            } else {
                // no external links
                e.preventDefault();
                //console.debug('External nav prevented by Codeply');
            }
            //return false;
            
        })
    }
}, null);

$('#meta-box-grip').click(function () {
    //$('#meta-box').animate({
    //   bottom: '0px'
    //});
    $('#meta-box-wrapper').toggleClass('meta-box-down meta-box-up');
});

var progress_slider = {};
var volume_slider = {};
$(document).ready(function (e) {

    //Change Icon on Submenu to arrow down if expanded
    $('#nav_library').click(function() {
        $(".navbar_icon", this).toggleClass("mdi-bookshelf mdi-chevron-down");
    });
    $('#nav_system').click(function() {
        $(".navbar_icon", this).toggleClass("mdi-cog mdi-chevron-down");
    });


});

/* Song Button Box slide out / in
/* Delegated events - for elements that gets dynamically renderd */
/* Attach event-hanlder to parent which is present on document render (#filelist) */
/* get its childs which are dynamically added or removed (.song-button-box) */
$("#filelist").on("click", ".song-button-box", function (event) {
    console.log($(this).attr('class'));
    //$(this).css("width", "auto");
    $(this).toggleClass('sbb_fold sbb_unfold');
    $(".fold", this).toggleClass('mdi-chevron-left mdi-chevron-right');
});
$("#playlist_scrollBox").on("click", ".song-button-box", function (event) {
    console.log($(this).attr('class'));
    //$(this).css("width", "auto");
    $(this).toggleClass('sbb_fold sbb_unfold');
    $(".fold", this).toggleClass('mdi-chevron-left mdi-chevron-right');
});

const BORDER_SIZE = 4;
const panel2 = document.getElementById("panel2");
const panel1 = document.getElementById("panel1");

let m_pos;
function resize(e){
  const dx = m_pos - e.x;
  m_pos = e.x;
  if (m_pos > (sidebarWidth+BORDER_SIZE)) {
    panel2.style.width = (parseInt(getComputedStyle(panel2, '').width) + dx) + "px";
    panel1.style.width = (parseInt(getComputedStyle(panel1, '').width) - dx) + "px";
  }
}

panel2.addEventListener("mousedown", function(e){
  if (e.offsetX < BORDER_SIZE) {
    m_pos = e.x;
    document.addEventListener("mousemove", resize, false);
  }
}, false);

document.addEventListener("mouseup", function(){
    document.removeEventListener("mousemove", resize, false);
}, false);

