#### What is MacWrite?

It's a simple text editing app that runs in the browser and uses <a href="https://github.com/scripting/nodeStorage">nodeStorage</a> and its API to manage identity and storage.

It's named after the famous and much-loved <a href="http://en.wikipedia.org/wiki/MacWrite">demo app</a> that came with the original Mac in 1984. It was what I call a software <a href="http://threads2.scripting.com/2013/january/whatAboutMacwriteAndMacpaint">coral reef</a>.

I've provided the full source code to the app in this repo. You can try it out on <a href="http://macwrite.org/">macwrite.org</a>, a domain that was available, so I am using it, with great reverence of course. ;-)

#### Running MacWrite on your server

When you want to try running MacWrite with your nodeStorage server, you need to make two changes.

1. In macwrite.js, change appConsts.urlTwitterServer to the address of your nodeStorage server.

2. In index.html, change the &lt;script> statement that links to macwrite2.nodestorage.io/api.js to point to the copy of api.js on your server.

