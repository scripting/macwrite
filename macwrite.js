//The MIT License (MIT)
	
	//Copyright (c) 2014 Dave Winer
	
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

var appConsts = {
	productname: "MacWrite",
	productnameForDisplay: "MacWrite",
	"description": "Demo app for nodeStorage.io.",
	urlTwitterServer: "http://macwrite.nodestorage.io:1337/",
	domain: "macwrite.org", 
	version: "0.45"
	}
var appPrefs = {
	ctStartups: 0, minSecsBetwAutoSaves: 3,
	textFont: "Ubuntu", textFontSize: 22, textLineHeight: 30,
	lastTweetText: "", lastUserName: "davewiner"
	};
var flStartupFail = false;
var flPrefsChanged = false;
var whenLastUserAction = new Date ();
var myTextFilename = "myTextFile.txt";

function aboutTestingMenu () {
	alertDialog ("Commands that test an installation of the <a href=\"http://nodestorage.io/\" target=\"_blank\">nodeStorage.io</a> server.");
	}
function sendATweet () {
	askDialog ("Text of your tweet:", appPrefs.lastTweetText, "Enter the text of your tweet here.", function (s, flcancel) {
		if (!flcancel) {
			appPrefs.lastTweetText = s;
			twTweet (s);
			prefsChanged ();
			}
		});
	}
function getUserInfo () {
	askDialog ("Enter a user name:", appPrefs.lastUserName, "The Twitter user you want info about.", function (username) {
		twGetUserInfo (username, function (data) {
			appPrefs.lastUserName = username;
			prefsChanged ();
			console.log (jsonStringify (data)); //all the info is displayed in the console
			alertDialog (data.description);
			});
		});
	}
function getMyMostRecentTweet () {
	twGetUserTweets (localStorage.twUserId, undefined, function (theTweets) {
		console.log (jsonStringify (theTweets)); //all the info is displayed in the console
		if (theTweets.length > 0) {
			alertDialog (theTweets [0].text);
			}
		else {
			alertDialog ("Hey you haven't tweeted yet.");
			}
		});
	}
function viewEmbeddedTweet (idTweet, idWhereToDisplay) {
	var idDiv = "#" + idWhereToDisplay;
	$("#idTweetViewer").modal ("show"); 
	$(idDiv).css ("visibility", "hidden");
	$(idDiv).on ("load", function () { //the div holding for the tweet becomes visible when fully loaded
		$(idDiv).css ("visibility", "visible");
		});
	twViewTweet (idTweet, "idWhereToDisplayTweet", function () {
		});
	}
function closeEmbeddedTweetViewer () {
	$("#idTweetViewer").modal ("hide"); 
	}
function applyPrefs () {
	$("#idTextArea").css ("font-family", appPrefs.textFont);
	$("#idTextArea").css ("font-size", appPrefs.textFontSize);
	$("#idTextArea").css ("line-height", appPrefs.textLineHeight + "px");
	prefsChanged ();
	}
function keyupTextArea () {
	}
function getText () {
	return ($("#idTextArea").val ());
	}
function setText (s) {
	$("#idTextArea").val (s);
	}
function saveButtonClick () {
	var now = new Date ();
	twUploadFile (myTextFilename, getText (), "text/plain", true, function (data) {
		console.log ("saveButtonClick: " + data.url + " (" + secondsSince (now) + " seconds)");
		});
	}
function getTextFile (callback) {
	twGetFile (myTextFilename, true, true, function (error, data) {
		if (data != undefined) {
			setText (data.filedata);
			console.log ("getTextFile: data == " + jsonStringify (data));
			}
		else {
			console.log ("getTextFile: error == " + jsonStringify (error));
			}
		if (callback != undefined) {
			callback ();
			}
		});
	}
function showHideEditor () {
	var homeDisplayVal = "none", aboutDisplayVal = "none", startupFailDisplayVal = "none";
	
	if (twIsTwitterConnected ()) {
		if (flStartupFail) {
			startupFailDisplayVal = "block";
			}
		else {
			homeDisplayVal = "block";
			}
		}
	else {
		aboutDisplayVal = "block";
		}
	
	$("#idEditor").css ("display", homeDisplayVal);
	$("#idLogonMessage").css ("display", aboutDisplayVal);
	$("#idStartupFailBody").css ("display", startupFailDisplayVal);
	}
function prefsChanged () {
	flPrefsChanged = true;
	}
function settingsCommand () {
	twStorageToPrefs (appPrefs, function () {
		prefsDialogShow ();
		});
	}
function initMenus () {
	var cmdKeyPrefix = getCmdKeyPrefix (); //10/6/14 by DW
	document.getElementById ("idMenuProductName").innerHTML = appConsts.productnameForDisplay; 
	document.getElementById ("idMenuAboutProductName").innerHTML = appConsts.productnameForDisplay; 
	$("#idMenubar .dropdown-menu li").each (function () {
		var li = $(this);
		var liContent = li.html ();
		liContent = liContent.replace ("Cmd-", cmdKeyPrefix);
		li.html (liContent);
		});
	twUpdateTwitterMenuItem ("idTwitterConnectMenuItem");
	twUpdateTwitterUsername ("idTwitterUsername");
	}
function everySecond () {
	var now = clockNow ();
	twUpdateTwitterMenuItem ("idTwitterConnectMenuItem");
	twUpdateTwitterUsername ("idTwitterUsername");
	pingGoogleAnalytics ();
	showHideEditor ();
	if (flPrefsChanged) {
		twPrefsToStorage (appPrefs);
		flPrefsChanged = false;
		}
	}
function startup () {
	console.log ("startup");
	twStorageData.urlTwitterServer = appConsts.urlTwitterServer;
	$("#idTwitterIcon").html (twStorageConsts.fontAwesomeIcon);
	$("#idVersionNumber").html ("v" + appConsts.version);
	initMenus ();
	hitCounter (); 
	initGoogleAnalytics (); 
	twGetOauthParams (); //redirects if OAuth params are present
	if (twIsTwitterConnected ()) {
		twStorageStartup (appPrefs, function (flGoodStart) {
			flStartupFail = !flGoodStart;
			if (flGoodStart) {
				getTextFile (function () {
					showHideEditor ();
					appPrefs.ctStartups++;
					prefsChanged ();
					applyPrefs ();
					twGetTwitterConfig (function () { //twStorageData.twitterConfig will have information from twitter.com
						self.setInterval (function () {everySecond ()}, 1000); 
						});
					});
				}
			});
		}
	else {
		showHideEditor ();
		}
	}
