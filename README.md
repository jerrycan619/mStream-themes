# mStream-themes
Themes for the great mStream Music server.
Please visit: https://github.com/IrosTheBeggar/mStream/

## NEW! redesigned interface 
### ALPHA status - expect bugs
### more information at https://github.com/jerrycan619/mStream/tree/interface

## Desktop UI
![](/images/desktop.gif)

## Mobile UI
![](/images/mobile.gif)

### Install:
copy the content of the interface directory into mStream root folder and replace all files if you get asked.<br/>
Your existing config / database remain untouched, but to be 100% sure just copy your mStream folder to a different backup location.
and then run: "npm install"

<br/><br/>
# ---------------------------------------------
## Themes
## How-to Install
**First: I don't know how and if it's works on the Binary and Docker install of mStream!**
<br/><br/>
**For use with the "Install from The Command Line" method:**

you should have a folder structure like this:
<pre>
path/to/mStream/
                |-> build/
                |-> electron/
                |-> modules/
                |-> ... some other...
                |-> public/ --- this is where my themes replaces some files
</pre>

Now download the Theme (or everything) from here und unpack it.<br/>
if you've done this you should have a structure like this:

<pre>
path/to/themes/
                |-> dark_green/public
                |-> dark_orange/public
                |-> ...
</pre>

Now pick the theme you want to install and then copy the public folder into the mStream root folder like this:<br/>
copy: **dark_green/public**<br/>
paste in: **mStream/**<br/>
and if you get asked if you want to overwrite the files choose "yes" (or "overwrite) to all!<br/>
<br/>
Since there is no dedicated theme engine/api the themed files have to overwrite the default files.</br>
This may break by new updates of mStream but I try to keep them working.<br/>
<br/>
If you find bug's or have suggestions for **new Themes** please open an "Issue"<br/>
Please DON'T open Issues for problems with the Software itself!!! (do that on the main mStream repository)<br/>
and also DON'T open Issues for problems with **this Themes** on the main mStream repository!!! (do it HERE)<br/>

Thanks to everyone!


## Available Themes
**Tested on:**<br/>
*Chrome: working<br/>
*Firefox: working<br/>
*Opera: working<br/>
*Android Chrome: working

### Dark Green
![darkGreen Login](/images/mstream_green_3.png)
![darkGreen 1](/images/mstream_green_1.png)
![darkGreen jukebox](/images/mstream_green_2.png)
![darkGreen mobile](/images/mstream_green_4.png)

### Dark Orange
**Just one picture but it's also everything themed like on the Dark Green**
![darkOrange 1](/images/mstream_orange_1.png)

