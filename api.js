//The MIT License (MIT)
	
	//Copyright (c) 2014-2017 Dave Winer
	
	//Permission is hereby granted, free of charge, to any person obtaining a copy
	//of this software and associated documentation files (the "Software"), to deal
	//in the Software without restriction, including without limitation the rights
	//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	//copies of the Software, and to permit persons to whom the Software is
	//furnished to do so, subject to the following conditions:
	
	//The above copyright notice and this permission notice shall be included in all
	//copies or substantial portions of the Software.
	
	//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	//SOFTWARE.

function nodeStorageApp (consts, prefs) {
	var myConsts = consts, myPrefs = prefs;
	var flPrefsChanged = false;
	var me = this;
	
	function everySecond () {
		var now = clockNow ();
		twUpdateTwitterMenuItem ("idTwitterConnectMenuItem");
		twUpdateTwitterUsername ("idTwitterUsername");
		if (flPrefsChanged) {
			twPrefsToStorage (myPrefs);
			flPrefsChanged = false;
			}
		if (me.everySecond !== undefined) {
			me.everySecond ();
			}
		}
	
	this.flStartupFail = false;
	
	this.prefsChanged = function () {
		flPrefsChanged = true;
		};
	this.start = function (callback) {
		function docallback (flConnected) {
			if (callback !== undefined) {
				callback (flConnected);
				}
			}
		twStorageData.urlTwitterServer = myConsts.urlTwitterServer;
		if (localStorage.urlTwitterServer !== undefined) { 
			twStorageData.urlTwitterServer = localStorage.urlTwitterServer;
			}
		if (myConsts.pathAppPrefs !== undefined) {
			twStorageData.pathAppPrefs = myConsts.pathAppPrefs;
			}
		
		if (twGetOauthParams ()) { //redirects if OAuth params are present, returns true
			console.log ("nodeStorageApp.start: redirecting after processing OAuth params.");
			docallback (false);
			return;
			}
		
		if (twIsTwitterConnected ()) {
			twStorageStartup (myPrefs, function (flGoodStart) {
				this.flStartupFail = !flGoodStart;
				if (flGoodStart) {
					console.log ("nodeStorageApp.start: myPrefs == " + jsonStringify (myPrefs));
					twGetTwitterConfig (function () { //twStorageData.twitterConfig will have information from twitter.com
						docallback (true);
						self.setInterval (everySecond, 1000); 
						});
					}
				else {
					docallback (false);
					}
				});
			}
		else {
			docallback (false);
			}
		}
	};
