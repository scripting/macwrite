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

var appConsts = {
	productname: "MacWrite",
	productnameForDisplay: "MacWrite",
	description: "Demo app for nodeStorage.io.",
	domain: "macwrite.org", 
	version: "0.61"
	}
var appPrefs = {
	ctStartups: 0, minSecsBetwAutoSaves: 3,
	textFont: "Ubuntu", textFontSize: 22, textLineHeight: 30,
	lastTweetText: "", lastUserName: "davewiner"
	};

const fnameConfig = "config.json";
var whenLastUserAction = new Date ();
var myTextFilename = "myTextFile.txt";
var myNodeStorageApp;

function aboutTestingMenu () {
	alertDialog ("Commands that test an installation of the <a href=\"http://nodestorage.io/\" target=\"_blank\">nodeStorage.io</a> server.");
	}
function sendATweet () {
	askDialog ("Text of your tweet:", appPrefs.lastTweetText, "Enter the text of your tweet here.", function (s, flcancel) {
		if (!flcancel) {
			appPrefs.lastTweetText = s;
			twTweet (s);
			myNodeStorageApp.prefsChanged ();
			}
		});
	}
function getUserInfo () {
	askDialog ("Enter a user name:", appPrefs.lastUserName, "The Twitter user you want info about.", function (username) {
		twGetUserInfo (username, function (data) {
			appPrefs.lastUserName = username;
			myNodeStorageApp.prefsChanged ();
			console.log (jsonStringify (data)); //all the info is displayed in the console
			alertDialog (data.description);
			});
		});
	}
function howManyTweets () { //6/22/15 by DW
	askDialog ("Enter a user name:", appPrefs.lastUserName, "The Twitter user you want info about.", function (username) {
		twGetUserInfo (username, function (data) {
			appPrefs.lastUserName = username;
			myNodeStorageApp.prefsChanged ();
			console.log (jsonStringify (data)); //all the info is displayed in the console
			alertDialog (appPrefs.lastUserName + " has sent " + data.statuses_count + " tweets.");
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
	myNodeStorageApp.prefsChanged ();
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
function readConfig (callback) {
	readHttpFile (fnameConfig, function (jsontext) { 
		if (jsontext !== undefined) {
			var jstruct = JSON.parse (jsontext);
			for (var x in jstruct) {
				appConsts [x] = jstruct [x];
				}
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function startup () {
	console.log ("startup");
	$("#idTwitterIcon").html (twStorageConsts.fontAwesomeIcon);
	$("#idVersionNumber").html ("v" + appConsts.version);
	initMenus ();
	readConfig (function () {
		function showHideEditor (flStartupFail) {
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
		myNodeStorageApp = new nodeStorageApp (appConsts, appPrefs);
		myNodeStorageApp.everySecond = function () {
			showHideEditor ();
			};
		myNodeStorageApp.start (function (flConnected) {
			if (flConnected) {
				getTextFile (function () {
					showHideEditor ();
					appPrefs.ctStartups++;
					myNodeStorageApp.prefsChanged ();
					applyPrefs ();
					hitCounter (); 
					initGoogleAnalytics (); 
					});
				}
			else {
				showHideEditor (true);
				}
			});
		});
	}
