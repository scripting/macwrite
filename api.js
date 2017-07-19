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
		twStorageData.urlTwitterServer = myConsts.urlTwitterServer;
		if (myConsts.pathAppPrefs !== undefined) {
			twStorageData.pathAppPrefs = myConsts.pathAppPrefs;
			}
		twGetOauthParams (); //redirects if OAuth params are present
		if (twIsTwitterConnected ()) {
			twStorageStartup (myPrefs, function (flGoodStart) {
				this.flStartupFail = !flGoodStart;
				if (flGoodStart) {
					console.log ("nodeStorageApp.start: myPrefs == " + jsonStringify (myPrefs));
					twGetTwitterConfig (function () { //twStorageData.twitterConfig will have information from twitter.com
						if (callback !== undefined) {
							callback (true);
							}
						self.setInterval (everySecond, 1000); 
						});
					}
				});
			}
		else {
			if (callback !== undefined) {
				callback (false);
				}
			}
		}
	};
