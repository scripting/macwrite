## MacWrite

It's a simple text editing app that runs in the browser and uses <a href="https://github.com/scripting/nodeStorage">nodeStorage</a> to manage identity and storage. It's good starter code for building nodeStorage apps.

I've provided the full source code to the app in this repo. You can try it out on <a href="http://macwrite.org/">macwrite.org</a>.

### Running MacWrite on your server

To run MacWrite on your nodeStorage server, you need to make two changes.

1. In config.json, change urlTwitterServer to the address of your nodeStorage server.

2. In index.html, change the &lt;script> statement that links to macwrite2.nodestorage.io/api.js to point to the copy of api.js on your server.

### Updates

#### v0.60 -- 7/20/17 by DW

Factored the top level of the app into an API, which means more of the interface code is out of the app-developer's way. 

It also loads a config.json file that overrides any value in appConsts, so you don't have to modify the source to configure the app to use a different nodeStorage server. You do still have to modify the inclusion of api.js (see above). Further, you can choose a different name for the prefs file, which keeps two apps out of each others way, if you want to share a server between two or more apps.

Took a snapshot of  v0.5 , <a href="http://macwrite.org/archive/v0.5/">here</a> and in the repository <a href="https://github.com/scripting/macwrite/tree/master/archive/v0.50">as well</a>. 

#### v0.50 -- 6/22/15 by DW

Added a new command, How many tweets... that tells you how many tweets a user has sent. I'm getting close to 100,000 tweets and I wanted to know for sure how many I had. Twitter's user interface doesn't say what the exact number is. 

### Historical note

This project is named after the famous and much-loved <a href="http://en.wikipedia.org/wiki/MacWrite">demo app</a> that came with the original Mac in 1984. It was what I call a software <a href="http://threads2.scripting.com/2013/january/whatAboutMacwriteAndMacpaint">coral reef</a>.

