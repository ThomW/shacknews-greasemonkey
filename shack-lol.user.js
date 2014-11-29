// ==UserScript==
// @name Shack-lol
// @namespace http://www.lmnopc.com/greasemonkey/
// @description Adds [lol] links to posts
// @include /https?://shacknews.com/*/
// @include /https?://www.shacknews.com/*/
// @exclude /https?://www.shacknews.com/frame_chatty.x*/
// @exclude /https?://bananas.shacknews.com/*/
// @exclude /https?://*.gmodules.com/*/
// @exclude /https?://*.facebook.com/*/
// @version 1.6
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==
/*
	------------------------------------------------------------

	Shack [lol]
	Author: Thom Wetzel - www.lmnopc.com
	(C)2007-2011 Thom Wetzel

	------------------------------------------------------------

	If you use Amazon and want to help buy me cool shit without
	doing anything more than running a Greasemonkey script, run
	this one:

	http://lmnopc.com/greasemonkey/shack2007/usemyamazonaffiliatecode.user.js

	It's a small script that adds my Amazon Affiliate ID to any
	link to Amazon.com so I get money everytime you buy something
	from them.

	If you want to buy me shiny things, you can find my Amazon Wish
	List at

	http://wishlistbuddy.com/user/thomw

	Keep on [lol]ing!  :)

	------------------------------------------------------------

	REVISIONS:

	2007-01-26
		- Initial Release
	2007-02-18
		* Added [LOL'd] link to the top of the comments
	2007-02-26
		* [LOL'd] links now turn into links to www.lmnopc.com/shacklol/
	2007-03-13
		* Slight speed increase
			1) got rid of AddGlobalStyle()
		 	2) stripped down GetElementsByClassName down to the essentials
		* Changed where LOL'd page link is added to the DOM and absolutely
			positioned it under the Latest Chatty Thread link to make it
			easy to find.  It avoids the ugliness of forcing the whole page
			down after it loads.
	2007-03-24
		* Added link to [lol] user profile to shack profile pages
	2007-06-14
		* Updated for Shack 2007
	2008-01-31
		* Added stripHtml to getUsername to prevent another situation like
			what happened when Phil ran the Hungry Phil Greasemonkey script
		* Added Shack[lol] link to the list of sites at the top of the Shack
			so I don't have to go into the latestchatty to check out the lols
	2008-03-02
		* Dobob pointed out how fast his Image Loader script was compared to
			this one, and I took that as a challenge to speed this one up.
			This script went from ~250ms to ~125ms on my laptop, and I've even
			added an additional link to the top of every page of the site to
			get to the [lol] page.
	2008-03-02b
		* Fixed the parentAuthor / Vanity searches
	2008-03-03
		* Fixed the [lol] link to peoples' authoredby pages
	2008-03-04
		* Added something new to enhance the [lol] page.  When you [lol] a post, the script
		  stores your username, and when you go to the [lol] page, your name is now blue
		  on the posts you wrote, and bold on posts you [lol]'d.  You should uninstall
		  old versions of the script and install this one fresh to get the updated list of
		  includes/excludes.
	2008-03-12
		* Checking if commenttools exists now before trying to appendChild to prevent error
		* Transmitting script version to report.php so I can prevent people from lol'ing
			things with obsolete versions of the script.
	2008-04-17
		* Added ability to [lol] from the [lol] page
		* Profile.x : Removing _ from usernames to help those people search their post histories
		* Profile.x : Fixed Parent Author search
	2008-05-13
		* Pieman was right.  Fixed the "I don't know you man" error.
	2008-05-14
		* Profile.x : Fixed issue with underscores in vanity / parentAuthor searches (for good... I promise)
	2008-05-23
		* Modified to play nice with new profile URLs
	2008-05-24
		* Profile.x : Fixed the stupid vanity search / parentAuthor links again (thanks rock elf!)
	2008-05-30
		* Profile.x : Fixed the damn buttons so they fit across the top of the page,
		              and I added icons to the buttons that didn't have them because
		              it bugged me that some had icons and others didn't.
	2008-06-12
		* shacklol : The script now changes How To [LOL] into links that link to the user's lol profile pages
	2008-06-25
		* Added moderation to the query string so that I can display moderation on the lol page when I have time
	2008-06-26
		* "Fixed" the link at the top of the pages to blend in better
	2008-07-05
		* +inf
	2008-09-25
		* de-douched.  It wasn't that funny to begin with and annoyed a bunch of people. Ciao!
	2008-10-29
		* Fixed to work with new Shack profiles page
	2008-12-05
		* Fixed it so inf'd posts are * I N F ' D * instead of showing up as * L O L ' D *
	2008-12-06
		* Shacklol page : Posts can now be inf'd and lol'd instead of just lol'd
	2009-02-03
   		* Removed script stuff from lmnopc.com/greasemonkey/shacklol/ since that is done in the page now
	2009-08-26
		* Added some new tags, and gave people a way to select which tags they wanted to see and use
	2011-02-20
		* Updated to work with NuShack
	2011-02-23
		* Converted username at the top of the page to a pseudo-vanity search link (not tested on weird usernames)
	2011-03-27
		* Finally rewrote this thing to take advantage of DOMNodeInserted.  Finally staying in the sandbox.
		* lol buttons are now being added to stories outside of the Chatty proper
		* Fixed stupid design flaw and made users' own names links as they should have been.
		* WinChatty is still dead.  Went back to using default Shack search page to reduce amount of scrolling and clicking required to get accurate results
		* Removed dead sites from list of included sites
	2011-03-28
		* Set styling on lol buttons to keep them from going bold and changed style declarations to use !important to reduce problems with Stylish overrides
	2011-03-28b
		* Changed Username link to a dropdown menu for doing a bunch of types of searches
	2011-03-28c
		* Fixed bug in findUsername
	2011-03-31
		* Username dropdown menus on post authors
		* lolCount indicators
	2011-03-31c
		* Assorted bug fixes - fixed major 4.1 issue
	2011-04-07
		* Updated to work now that own username is a link
	2011-04-15
		* Stripped out popup stuff into its own script
	2011-04-19
		* Made lol count display toggleable through Greasemonkey user script menu (ghetto)
	2011-04-22
		* Made sure the JSON.parse commands were wrapped in try/catch blocks to prevent crashing due to bad JSON data
	2011-12-12
		* greg-m added a dumb link to the username and broke everything.  good job, greg-m.
	2012-10-24
		* Brought over some ChromeShack features: Add/Limited/None loltag display and editing list of available tags
		* Storing username when script is installed instead of waiting until something is tagged to avoid picking up part of the dropdown menu installed by other scripts
		* Stripped out dead code
	2012-10-25
		* lolcounts menu being populated by more reliable method
	2012-11-1
		* [ugh] tag is new soul-sucker with threshhold to set the cutoff
	2012-11-11
		* Fixed script to work sans Greasemonkey collapse script
	2013-05-01
		* Adjusted script for new Shacknews login markup
	2014-09-17
		* Fixed https usage
		* Fixed pills not updating
		* Fixed MutationObserver deprecation warning
		* Added the ability to get lolers
		* Fixed ugh collapsing for large amounts of ughs
		* Removed use of unsafeWindow
	2014-11-28
		* Added ability to click lolers to have it remove the list of lolers from the post
*/

(function() {

	var myDomain = 'lmnopc.com';
	var version = 20121101;

	var lolCounts = new Array();

	// grab start time of script
	var benchmarkTimer = null;
	var scriptStartTime = getTime();

	function getTime() { benchmarkTimer = new Date(); return benchmarkTimer.getTime(); }
	function stripHtml(html) { return String(html).replace(/(<([^>]+)>)/ig, ''); }

	// Setup lolcount settings and get default value
	var lolCountSettingOptions = new Array('All','Limited','None');
	var lolCountSetting = GM_getValue('lolCountSetting','Limited');

	var tags = JSON.parse(GM_getValue('lolTags', '[{"name": "lol", "color": "#f80"}, {"name": "inf", "color": "#09c"}, {"name": "unf", "color": "#f00"}, {"name": "tag", "color": "#7b2"}, {"name": "wtf", "color": "#c000c0"}, {"name": "ugh", "color": "#080"}]'));

	var lolCollapseUghs = GM_getValue('lolCollapseUghs', '3');

	var username = findUsername();

	// Add CSS for supporting the lol script
	GM_addStyle('.oneline_tags { display: inline; overflow: hidden; white-space: nowrap; } .oneline_tags span { margin: 0 2px 0 2px; padding: 0 2px; border-radius: 3px; background-color: #f8f; color: #000; font-size: 10px; font-weight: bold; } .oneline_tags .oneline_lol { background-color: #f80; } .oneline_tags .oneline_inf { background-color: #09c; } .oneline_tags .oneline_unf { background-color: #f00; } .oneline_tags .oneline_tag { background-color: #7b2; } .oneline_tags .oneline_wtf { background-color: #c000c0; } .oneline_tags .oneline_ugh { background-color: #080; } .april1 { display: inline-block ; background-image: url(data:image/gif;base64,R0lGODlhVwEUAPcAAAAAAAAANTQAADgAODMzNAAAXQAAYRY4dDE3SjA5Vi47ZAhqLgtsXwtkaDJFe0A%2FB0E%2FK2Q%2FBkE%2FSEBBRVlZWXJnTGZmZnNzcxU9kxhDvRBathhkhxlymB1kuht6oyxDkjJKkzpYmCpHqTlYqTtZuCZtjCpwkDl4lCZpvClwtg5d0wBc4hNB7hpJ8AJ06yZLxC5SwilU2zJZySJO5ChV6CdX8TphxDx4xD971D5l6zNm8zxw9FxZmFxZuEB%2FnHxZmHxZuGVuimdwinlwkGV4pEZrx0N%2BxVx0yEN06EV69FR79GJ%2B0QCLLgCJNgCSNwOaQgeMYBSrSS%2BKdyKyTEGCe0maYmWsZx6HtCSNuiyRvA2G9yKXyTWFyzuO1zacykGDgEKDlEqHo0SUtlqRrFeZtVCziGWDqWyDs2GVrWudtnOFuGSjmmihuXiluUqCyEaexFCGyV6Qylme3k2D9Umq1FyjwlWu1Vul5Vmo8WSUz2qc0XqLxXGc0mKI9WqQ93ua92uuymO12XurwXik1Xu1xXi82n2n%2BHzA9YQ%2FBqheALNMMqZhBKR%2BCr99Mp9fcaJHQ90dFtU0JOI6JP1TNf9kPulNSY56hP8A%2F7iRAKaBOYiRXZOwXovCdafTSsODBtCINv%2B8LO6KfeKhW%2FixY%2F7OB%2F%2FeP%2F%2FgLsrMYf3FTPbcZvDfefz6fY2NjY2Pk52KkJmZmYeRrpqgsbWOmLiVo6esu7WoqLOzs4ar3Yi0yI2z25%2BnzJuq1Zu4ype43oeu4IWm%2BJSp5pu54KOw2rqhybW7yrC%2B26K%2F4qO4%2BYXBsqXdsoDC4ozB%2B4zV%2BJnX9abF1bfG2LXXyLvQ3qTL5K7F%2B7TK5bLF%2B73U5qfr66709LXu9b%2F%2F%2F8OAle2fl8L6rcT8tOjHgvbTiuzAuObih%2BjkkfHtmPj0jPn1l%2FHuvfv5qP77ss3NzczP1dHXyNfX18XM4svX6c3a%2BtHe7srg7s3j8NXm79no89%2F%2F7ezXyOzu1%2FLvwP%2F%2F2%2Bjo6Ort9Ory%2BP%2F%2F7fz8%2FSH5BAEAAJcALAAAAABXARQAAAj%2BAC%2FVe0ewoMGDCBMqPMjvksOHEFlInEixosWLGDNOhAjxlcePIEOKHEnyFceT8qSpXMmypcuXMGO6lHfyIb95OHPq3MmzZ86aQC%2FlGyeuqNGjSMflq0ltkJ6nUKNKnUq1atVB1ATG48e1q9evYMOK%2FboVKAtDaNOqXcu2rdu3aVnUfPWvrt27ePPq1WsyqLx5ewMLHkz43zyaJ%2Fn1K8zYbr%2BGQSHmI4cuneXLmDOjI7cUIjVpixuLJtxPGrV3Y1OrXs3vnVkcc2LLnk27tu3buOfgkHuS7ujRfYFK%2B01ctLSagIsPnhcZ4rjM0KOnG8dxUGjl2P%2F1G4Satffvrmv%2BssCRpHz5OYaWHcLTJbb59%2FDjy5%2B%2Fe252wsFrDr%2FP3%2B7xk8n1dxdzzTkkjnQIWiYOR3oIqJwe3XV1wIQUVjjhd6qFd9J4781xiBZauCDiCnEg8R5e08ynInz19eYgX5Ht9yJ2%2F3EU4IsEFnhgZuYs8sADX0i3IEQNzjgahF%2BFoOSSTCqJYWoacsTheYaAGKILK4yhyikmlvePLRZYwMo%2FwKxoZosc%2BcbYJwAAgEdj%2BZ0k417O4EKPkXvVCNGNDubY3I6YefLjj0FCN%2BRDReLJGJJeNakkEcUU4%2BRY9xxRD2tRRoTDDpwO48iVWIaRiimkaMLpDv%2B8YoMNRfzTyg7%2B8PyyQx%2Fw9PELPLjCA2uusnKK5kNqFgbOAMyMEgAzjMXJEWj9NOtMs9CK4UEY0PbjTBjYYstLtdx226089HSr50N8CuaPKyloU5ifkQFqWSoRSODNKojIayiD3lKjwb4a3PBOs2704u3A3PpCMKNdORpCXZKG0FWll%2FJTKTuWYvraqdxMMkuIK6SQCikgY3LqP%2Fvg%2BpgEqMaygx%2F%2FEOFHLLRoN8IusbTzDyyn%2FnqJbwR3%2B4kB2IAjAB49V6ssRMw2SwgHbETTTyFYXOEBGdDKg0sbG6SBizVF9xxGGuICWO5e%2BgxhQrrrFmhgZqgAaZknECRzL5H5agBHLrd00EH%2BPP3cYo12XRfsi8HeIsyVwv%2FosuTDFTMecYav6SB5KJFQMosKHZTRSSkgMyK5Dv%2BoE0ssxPyjBuiv6MCyEDqAwDcFIcigxpcEfP6rmt8lYsA1QnPh3dEPJd0sFh54AIgXW2xxBQf1zNPsP%2Fxs8M4%2FvAjSrA9cPzNGP7yc4MOz%2FUQTxgltWFtCCWGEC%2B24ODFWtglnq0sYu0G5m07ba7z9ADLRHXqJHnXLRV2CoQHruCEY%2FeiF3gbhBq4NQgMoYCC3buELCt6icBE6HJPMcJdJSaxxE7NUOEbQjHvwIAQk%2FEqmHjKez20jEpKYhCXKMAUncCIVoKjA51IFgh62Yx3%2BqNNBH%2F4RBB1U4x8WcIAOlPCPdRBABrbjDbDqso8qWvGKWExEAa7xDQFwAYtgtCLwHCK8fsgjC1fAQvK2QDwObKtZ9NiA05xRAmtlrR9jQAMdneGMDTxDHhvghTXIR48ThAF869vT2Mi2B3ugS37LUdsl7Ic%2F%2FfGvf4gKILTs9g8N5KIfHWjgDTRgDWsUkBod0ADg%2Bja4Vl6QW4bjR5POUDp3wMKDEONKCNnRg2zgAwjZ%2BODjWvOaGhgzB5WAhCKsEAUnNKEJm8hEDIxZgy%2F1oQ9%2F6IctYNCPdtCKiMf4UhD6oIRmXWAJSqCmznZGsjCGsRFb7OId3AnGMV6ijPX%2BCMQa15gFMuACWnF0Wj%2FkOIYwlKAeJXiGD9AQDfGNoQ0nsEY02lDHr4XNIe0bzbnQNj9JUtJt6YCb3ITkED2ERRqefAw%2FOOlJff3NpbdQZd9U2ZW6VNAXdQFLLBHnjsXpEoRHYAcPSBBMEy6JqF5ZoUPGQ80a5OARVXgCE57phAW8oKl4ecYEYrCHZgmDiPC4CzDu8g4aGHOdO6MnGOUpigAoQ61XtCez5FEtOuxzC4Xg1jzk2KwxpGEDCE1DHX1wAjSgIQ3OoKhh02A9i3JLTxltzEYhKRj6AUUc6MhsZuElgW7Qq7OarcxlDqWHepj2tPUwRkrrQcBbdDIX%2BqL%2BRj8IaI2Y9qMefFAlauvRyt2edqeO%2BsczfCrMn1KsFl0obliUegmmNlUKTWDCE6DQAAzMoKk1%2BAABtksABIigBjNQAAESoAAFvIC7BCgveq9aA7S%2Boh3wja9859uORrRJDvTNL3zl2qx6kIEQ0igE8taIhXpwC5AC7aMP%2BvFXsAniBAbmBT2isYG%2FPcNp2FJfIhUpmsmmTW2YDS06BDUoKohYs%2F4rrW9VC4db8EFvBk4pCjqQN1K%2BQwNGyK1uUTu4W%2FjWtDs9g5CH%2FA93CNlhP41YCOshizvg4weHEAtzx9OCKtMADE1gQAZmMIMqe%2FnLYA6zmMfcAvfq98xo1q%2F%2BXE172zpc4a5v%2BJdvSyAPNpeAF%2FWwhvQMjIYNbMAHdOWFn0sQjXr0cQN1Pu24LhFZwni4oyA%2BcTl89AATnxgd%2Fvvfj1XLrxvE4x%2F1SCk14hCHmFqDH8GAgx4eCGrUUtAXP65HkIcs5CIf%2BWEnDAEJoBFUSz35DkYNwQ2GOWUckPnYyE72l82c5manec2nNWMh7GCHQIAm1to5bbYXc9t61GUxbNbOtuuy20UzWrKP%2FLCOLs3u0GZaD%2FSIt7zjzQ%2B81CPe%2F4iHET75QNYa4dRuQME%2F5n2nuhBc3sBVGHGfBJZiK%2FvhEF%2B2FDuyjopb%2FOIYz7jGNQ5t1FYr1iAPucj%2By40cPFm2JuIwh8pXzvKWs%2Fzd8Yi5zGdO85kPIpUoMEa%2B87AvI0yv5kCXeSwZTnRiigcHSE%2B60pfO9KY7%2FelJnziw1EH1qlv96ljPetY7PvKue13k5l7kfU5%2BkpS7%2FOwth3nQ1x7zepM75qG5LdtrPvSiP4m5zdWI3vfOd6kDqySAD7xIYvT1whue5AAyuSTHUQ60O74c1IEId%2BZO%2Bcqz%2FR2D4MdW7E70skjy86APvehHXyB5WOPgqE%2B96lfPemsghiOKmdFjJDmUctj%2B9rjPve3HcQ6OUKMXrpeH8IdP%2FOIb%2F%2FjIP741epGV1izk%2BdB%2FPmRIT%2F3qW%2F%2F6DpEHL7Yrz%2F3ue%2F%2F74A%2B%2F%2BL%2F%2F%2BsT45Pzo1wnoz0EUpLjfKLxnilOsQv%2F623%2FVWQkIAAA7); width:343px; height:20px; margin-top: -3px;  cursor: pointer; } .lolTag { margin: 0.5em 0; } .lolTag input { width: 3em; } #lol_tags label input { margin: 0 1em 0 0.5em; } #saveLolTags { display: block; margin: 1em 0; } #shacklol-settings .form-field { margin: 0.75em 0 1em 0; } #shacklol-settings fieldset { border: 1px solid #0099FF; padding: 5px 10px; } #shacklol-settings fieldset legend { padding: 0 10px; } ');

	function findUsername()
	{
		try {
			return stripHtml(document.getElementById("user_posts").innerHTML);
		}
		catch(err) {
			return '';
		}
	}

	// ThomW: I took getElementsByClassName and stripped it down to just what's needed by this script
	function getElementByClassName(oElm, strTagName, strClassName)
	{
		try
		{
			var arrElements = oElm.getElementsByTagName(strTagName);
			for(var i=0; i < arrElements.length; i++)
			{
				if (arrElements[i].className.indexOf(strClassName) == 0)
				{
					return arrElements[i];
				}
			}
		}
		catch (ex)
		{
			return null;
		}
	}

	function createButton(tag, id, color)
	{
		var button = document.createElement("a");
		button.id = tag + id;
		button.href = "#";
		button.className = "lol_button";
		button.setAttribute('style', 'color: ' + color + ' !important; font-weight: normal; padding: 0 0.25em; text-decoration: underline;');
		button.appendChild(document.createTextNode(tag));

		button.addEventListener("click", function(e)
		{
			if (tag == "lolers") {
				showLolers(id);
			}
			else {
				lolThread(tag, id);
			}
			e.preventDefault();
		}, false);

		var span = document.createElement("span");
		span.appendChild(document.createTextNode("["));
		span.appendChild(button);
		span.appendChild(document.createTextNode("]"));
		span.style.padding = '0 0.125em';

		return span;
	}

	// shackLol functions
	function installLolButton(threadIdList)
	{
		var dbg = false;

		threadIdList = String(threadIdList).split(',');

		for (var i = 0; i < threadIdList.length; i++)
		{
			var threadId = threadIdList[i];

			// Don't add #lol_ if it already exists
			if (document.getElementById('lol_' + threadId) !== null)
			{
				displayLolCounts(threadId);
				continue;
			}

			// find threadId
			var thread = document.getElementById('item_' + threadId);
			if (!thread)
			{
				if (dbg) { console.log('COULD NOT FIND item_' + threadId); }
				continue;
			}

			// find div.postmeta
			var spanAuthor = getElementByClassName(thread, 'span', 'author');
			if (!spanAuthor)
			{
				if (dbg) { console.log('getElementsByClassName could not locate span.author'); }
				continue;
			}

			var divLol = document.createElement('div');
			divLol.setAttribute('style', 'display: inline; float: none; padding-left: 10px; font-size: 14px;');
			divLol.setAttribute('id', 'lol_' + threadId);

			// Add tags to the post
			for (var idx = 0; idx < tags.length; idx++) {
				divLol.appendChild(createButton(tags[idx].name, threadId, tags[idx].color));
			}
			divLol.appendChild(createButton("lolers", threadId, "#999999"));

			// add d to spanAuthor
			spanAuthor.appendChild(divLol);

			// Update the lol counts for this post
			displayLolCounts(threadId);
		}
	}

	function getModeration(threadId)
	{
		var modTags = new Array('fpmod_offtopic', 'fpmod_nws', 'fpmod_stupid', 'fpmod_informative', 'fpmod_political');

		var liItem = document.getElementById('item_' + threadId);

		var className = liItem.getElementsByTagName('div')[0].className;
		className = className.split(' ');

		for (var i = 0, ii = modTags.length; i < ii; i++)
		{
			for (var j = 0, jj = className.length; j < jj; j++)
			{
				if (modTags[i] == className[j])
				{
					return modTags[i];
				}
			}
		}

		return '';
	}

	function lolThread(tag, id)
	{
		var moderation = '';

		if (tag == null) { tag = 'lol'; }

		// find the user
		if (username.length == 0)
		{
			alert('You have to be logged in to Shacknews to +lol a post');
			return;
		}

		// Scrape the post's current moderation from the page (this is only done on Shacknews.com obviously)
		moderation = getModeration(id);
		if (moderation.length)
		{
			moderation = '&moderation=' + encodeURIComponent(moderation);
		}

		var addr = 'http://' + myDomain + '/greasemonkey/shacklol/report.php?who=' + encodeURIComponent(username) + '&what=' + encodeURIComponent(id) + '&tag=' + encodeURIComponent(tag) + '&version=' + encodeURIComponent(version) + moderation;

		console.log(addr);

		// use xmlhttpRequest to post the data
		GM_xmlhttpRequest({
			method:"GET",
			url: addr,
			onload: function(result) {

				try
				{
					if (result.responseText.substr(0, 3) != 'ok ')
					{
						if (String(result.responseText).length)
						{
							console.log(result.responseText);
							alert(result.responseText);
						}
						else
						{
							alert("Your +" + tag + " may have failed.  Sorry.  :(");
						}
					}
					else
					{
						var taggd = '*';
						for (i = 0; i < tag.length; i++)
						{
							taggd += ' ' + tag[i].toUpperCase() + ' ';
						}
						taggd += ' \' D *';

						var objLol = document.getElementById(result.responseText.substr(3));
						objLol.setAttribute('onclick', '');
						objLol.innerHTML = '<a href="http://' + myDomain + '/greasemonkey/shacklol/?user=' + encodeURIComponent(username) + '" style="color: #f00;">' + taggd + '</a>';
					}
				}
				catch (e)
				{
					alert('+' + tag + ' failed');
				}
			}
		});
	}

	function requestLolers(tag_name, id)
	{
		var addr = 'http://' + myDomain + '/greasemonkey/shacklol/api.php?thread_id=' + encodeURIComponent(id) + '&tag=' + tag_name + '&special=get_taggers';

		GM_xmlhttpRequest({
			method:"GET",
			url: addr,
			onload: function(result) {
				try {
					var jsonObj = JSON.parse(result.responseText);
					for (var hate in jsonObj) {
						for (var tagger = 0; tagger < jsonObj[hate].length; tagger++) {
							// add the button
							spanOnelineTag = document.createElement('span');
							spanOnelineTag.id = 'taggers_' + tag_name + '_' + id + '_' + jsonObj[hate][tagger];
							spanOnelineTag.className = 'oneline_' + tag_name;
							spanOnelineTag.style.display = 'inline-block';
							spanOnelineTag.style.lineHeight = '1.25em';
							spanOnelineTag.appendChild(document.createTextNode(jsonObj[hate][tagger]));

							divTagType = document.getElementById('taggers_' + tag_name + '_' + id);
							divTagType.appendChild(spanOnelineTag);
						}
					}
				}
				catch (error)
				{
					console.log(error);
					alert('Error parsing lolcount.');
				}
			}
		});
	}

	function showLolers(id)
	{
		var thread = document.getElementById('item_' + id);
		if (!thread)
		{
			if (dbg) { console.log('COULD NOT FIND item_' + threadId); }
			return;
		}

		// find bottom of post
		var post = getElementByClassName(thread, 'div', 'fullpost');
		if (!post)
		{
			if (dbg) { console.log('getElementsByClassName could not locate div.fullpost'); }
			return;
		}

		var postbody = getElementByClassName(post, 'div', 'postbody');
		if (!postbody)
		{
			if (dbg) { console.log('getElementsByClassName could not locate div.postbody'); }
			return;
		}

		divTaggers = document.getElementById('taggers_' + id);
		if (divTaggers)
		{
			divTaggers.parentNode.removeChild(divTaggers);
			return;
		}
		else {
			divTaggers = document.createElement('div');
			divTaggers.id = 'taggers_' + id;
			divTaggers.className = 'oneline_tags';
			divTaggers.style.paddingTop = '15px';
			divTaggers.style.marginLeft = '22px';
			post.insertBefore(divTaggers, postbody.nextSibling);

			for (var tag in tags)
			{
				var tag_name = tags[tag].name;
				divTagType = document.createElement('div');
				divTagType.id = 'taggers_' + tag_name + '_' + id;
				divTagType.className = 'online_tags';
				divTagType.style.marginLeft = '22px';
				divTagType.style.whiteSpace = 'normal';
				divTaggers.appendChild(divTagType);
			}
		}

		for (var tag in tags)
		{
			var tag_name = tags[tag].name;
			requestLolers(tag_name, id);
		}
	}

	function displayLolCounts(threadId)
	{
		// Make sure lolCounts are enabled
		if (lolCountSetting == 'None') {
			return;
		}

		var rootId = -1;

		// Make sure this is a rootId
		if (document.getElementById('root_' + threadId))
		{
			rootId = threadId;
		}
		else
		{
			// If this is a subthread, the root needs to be found
			var liItem = document.getElementById('item_' + threadId);
			if (liItem)
			{
				do
				{
					liItem = liItem.parentNode;

					if (liItem.className == 'root')
					{
						rootId = liItem.id.split('_')[1];
						break;
					}
				}
				while (liItem.parentNode != null)
			}
		}

		if (rootId == -1)
		{
			console.log('Could not find root for ' + threadId);
			return;
		}

		// Create flat list of lol tags to make it easy comparisons in the loop
		var tag_names = [];
		for (var i = 0; i < tags.length; i++) {
			tag_names.push(tags[i].name);
		}

		// If there aren't any tagged threads in this root there's no need to proceed
		if (!lolCounts[rootId])
		{
			return;
		}

		// Update all the ids under the rootId we're in
		for (id in lolCounts[rootId])
		{
			for (tag in lolCounts[rootId][id])
			{
				// Make sure tag is in user's list in limited mode
				if ((lolCountSetting == 'Limited') && (tag_names.indexOf(tag) == -1)) {
					continue;
				}

				// If collapse ugs is enabled, see if we're in a root post and collapse if it's over the threshhold
				var postUghCount = parseInt(lolCounts[rootId][id][tag]);
				var userUghLimit = parseInt(lolCollapseUghs);
				if ((userUghLimit != 0) && (id == rootId) && (tag == 'ugh') && (postUghCount >= userUghLimit))
				{
					location.assign("javascript:close_post(" + rootId + ");void 0");
				}

				// Add * x indicators in the fullpost
				var tgt = document.getElementById(tag + id);
				if (tgt)
				{
					tgt.innerHTML = tag + ' &times; ' + lolCounts[rootId][id][tag];
				}

				// Add (lol * 3) indicators to the onelines
				if (!document.getElementById('oneline_' + tag + 's_' + id))
				{
					tgt = document.getElementById('item_' + id);
					if (tgt)
					{
						tgt = getElementByClassName(tgt, 'div', 'oneline');
						if (tgt)
						{
							divOnelineTags = document.createElement('div');
							divOnelineTags.id = 'oneline_' + tag + 's_' + id;
							divOnelineTags.className = 'oneline_tags';
							tgt.appendChild(divOnelineTags);

							// add the button
							spanOnelineTag = document.createElement('span');
							spanOnelineTag.id = 'oneline_' + tag + '_' + id;
							spanOnelineTag.className = 'oneline_' + tag;
							spanOnelineTag.appendChild(document.createTextNode(tag + ' * ' + lolCounts[rootId][id][tag]));
							divOnelineTags.appendChild(spanOnelineTag);
						}
					}
				}
				else
				{
					var online = document.getElementById('oneline_' + tag + '_' + id);
					if (!online)
					{
						console.log("Couldn't find oneline_" + tag + '_' + id + ' even though it should have existed.')
						continue;
					}

					online.innerHTML = tag + ' * ' + lolCounts[rootId][id][tag];
				}
			}
		}
	}

	function retrieveLolCounts()
	{
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://lmnopc.com/greasemonkey/shacklol/api.php?special=getcounts',
			onload: function(responseDetails) {
				GM_setValue('lol-counts', responseDetails.responseText);
				GM_setValue('lol-counts-time', String(new Date().getTime()));  // must be stored as String -- doesn't fit in 32-bit int

				// Update module-level variable that holds the lolCounts
				lolCounts = JSON.parse(responseDetails.responseText);

				// Loop through ids and update lolCounts
				var threadIdList = String(getIdList()).split(',');
				for (var i = 0, ii = threadIdList.length; i < ii; i++)
				{
					displayLolCounts(threadIdList[i]);
				}
			},
			onerror: function(responseDetails) {
				alert(responseDetails);
			}
		});
	}

	function installApril1Button(threadIdList)
	{
		//
		// IF YOU SEE THIS CODE, KEEP YOUR GODDAMN MOUTH SHUT - DON'T RUIN THIS FOR ME!  XOXO THOM
		//

		var dbg = false;

		threadIdList = String(threadIdList).split(',');

		for (var i = 0, ii = threadIdList.length; i < ii; i++)
		{
			var threadId = threadIdList[i];

			// Don't add #lol_ if it already exists
			if (document.getElementById('lol_' + threadId) !== null)
			{
				continue;
			}

			// find threadId
			var t = document.getElementById('item_' + threadId);
			if (!t)
			{
				if (dbg) { console.log('COULD NOT FIND item_' + threadId); }
				return false;
			}

			// find div.postmeta
			var spanAuthor = getElementByClassName(t, 'span', 'author');
			if (!spanAuthor)
			{
				if (dbg) { console.log('getElementsByClassName could not locate span.author'); }
				return false;
			}

			var divLol = document.createElement('div');
			divLol.className = 'april1';
			divLol.id = 'lol_' + threadId;
			divLol.addEventListener('click', function() {
				var audioElement = document.createElement('audio');
				audioElement.setAttribute('src', 'http://gamewith.us/shackspace/sadtuba.ogg');
				audioElement.play();
				alert('APRIL FOOLS!');
			}, false);

			spanAuthor.appendChild(divLol);
		}
	}


	function getIdList() {
		/*
		This retrieves a comma-separated list of all the root posts on a page
		*/
		var items = document.evaluate("//div[contains(@class, 'fullpost')]/..", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var idList = '';
		var i = 0;
		for (item = null, i = 0; item = items.snapshotItem(i); i++) {
			idList += idList.length ? ',' : '';
			idList += item.id.substr(5);
		}
		return idList;
	}


	function installLolButtons() {
		if (document.getElementById('4pr1lf00z')) {
			installApril1Button(getIdList());
		} else {
			installLolButton(getIdList());
		}
	}

	function removeLolTag(node)
	{
		var tag_row = node.parentNode;
		tag_row.parentNode.removeChild(tag_row);
	}

	function addLolTag(name, color)
	{
		if (typeof(name) == 'undefined') {
			name = '';
		}
		if (typeof(color) == 'undefined') {
			color = '';
		}

		var tag_row = document.createElement("div");
		tag_row.setAttribute('class','lolTag');

		var l = document.createElement('label');
		l.appendChild(document.createTextNode('Tag: '));
		var input = document.createElement('input');
		input.setAttribute('class','name');
		input.setAttribute('value', name);
		l.appendChild(input);
		tag_row.appendChild(l);

		var l = document.createElement('label');
		l.appendChild(document.createTextNode('Color: '));
		var input = document.createElement('input');
		input.setAttribute('class','color');
		input.setAttribute('value', color);
		l.appendChild(input);
		tag_row.appendChild(l);

		var a = document.createElement('a');
		a.setAttribute('href','#');
		a.setAttribute('class','remove');
		a.appendChild(document.createTextNode('(remove)'));
		a.addEventListener('click', function(e) {
			e.preventDefault();
			removeLolTag(this);
		});
		tag_row.appendChild(a);

		var lol_div = document.getElementById("lol_tags");
		lol_div.appendChild(tag_row);
	}

	function getDescendentByTagAndClassName(parent, tag, class_name)
	{
		var descendents = parent.getElementsByTagName(tag);
		for (var i = 0; i < descendents.length; i++)
		{
			if (descendents[i].className.indexOf(class_name) == 0)
				return descendents[i];
		}
	}

	function saveLolTags()
	{
		var tags = [];
		var lol_div = document.getElementById("lol_tags");
		for (var i = 0; i < lol_div.children.length; i++)
		{
			var tag_name = getDescendentByTagAndClassName(lol_div.children[i], "input", "name").value;
			var tag_color = getDescendentByTagAndClassName(lol_div.children[i], "input", "color").value;
			tags[i] = {name: tag_name, color: tag_color};
		}
		GM_setValue('lolTags', JSON.stringify(tags));
	}

	function handleFilterBox(e) {

		// Remove this handler once it fires
		e.target.removeEventListener('click', handleFilterBox);

		// Find the parent container
		var container = document.getElementById('commentssettings');

		// Create the div housing all this magnificence
		var div = document.createElement('div');
		div.setAttribute('style','clear: both; padding-top: 5px;');
		div.setAttribute('id', 'shacklol-settings');

		// Shack[lol] header
		var header = document.createElement('h5');
		header.appendChild(document.createTextNode('Shack[lol] Settings'));
		div.appendChild(header);

		// Label surrounding the select box
		var d = document.createElement('div');
		d.setAttribute('class','form-field');
		var label = document.createElement('label');
		label.appendChild(document.createTextNode('LOL Counts: '));
		var select = document.createElement('select');
		for (var i = 0; i < lolCountSettingOptions.length; i++) {
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(lolCountSettingOptions[i]));
			option.setAttribute('value', lolCountSettingOptions[i]);
			select.appendChild(option);
		}
		select.selectedIndex = lolCountSettingOptions.indexOf(lolCountSetting);
		select.addEventListener('change', function(e) {
			GM_setValue('lolCountSetting', e.target.value);
		});
		label.appendChild(select);
		d.appendChild(label);
		div.appendChild(d);

		var d = document.createElement('div');
		d.setAttribute('class','form-field');
		var label = document.createElement('label');
		label.appendChild(document.createTextNode('Collapse [ugh]s: '));
		var select = document.createElement('select');
		for (var i = 0; i <= 10; i++) {
			var option = document.createElement('option');
			if (i == 0) {
				option.appendChild(document.createTextNode('Disabled'));
			} else {
				option.appendChild(document.createTextNode(i));
			}
			option.setAttribute('value',  i);
			select.appendChild(option);
		}
		select.selectedIndex = lolCollapseUghs;
		select.addEventListener('change', function(e) {
			GM_setValue('lolCollapseUghs', e.target.value);
		});
		label.appendChild(select);
		d.appendChild(label);
		div.appendChild(d);

		var fs = document.createElement('fieldset');
		var leg = document.createElement('legend');
		leg.appendChild(document.createTextNode('Tags'));
		fs.appendChild(leg);

		// Build the lol tags
		var divLolTags = document.createElement('div');
		divLolTags.setAttribute('id','lol_tags');
		fs.appendChild(divLolTags);

	    // Add lol tag add button
	    var a = document.createElement('a');
	    a.setAttribute('href','#');
	    a.addEventListener('click', function (e) {
	    	e.preventDefault();
	    	addLolTag();
	    });
	    a.appendChild(document.createTextNode('[ + Add ]'));
	    fs.appendChild(a);

	    // Add save button
	    var lolSubmit = document.createElement('button');
	    lolSubmit.setAttribute('id','saveLolTags');
	    lolSubmit.appendChild(document.createTextNode('Save Tags'));
	    lolSubmit.addEventListener('click', function(e) {
	    	e.preventDefault();
	    	saveLolTags();
	    });
	    fs.appendChild(lolSubmit);

	    div.appendChild(fs);

		// Add the resulting div to the container all at once for MAXIMUM SPEED
		container.appendChild(div);

		// Add all of the tags to the dialog
		for (var i = 0; i < tags.length; i++)
		{
			addLolTag(tags[i].name, tags[i].color);
		}
	}



	/* MAIN
	*/

	// Add large lol link button at the top of the chatty
	if (String(location.href).indexOf('.com/chatty') != -1)
	{
		// add link to lol'd above the comments
		var divCommentstools = getElementByClassName(document, 'div', 'commentstools');
		if (divCommentstools != null)
		{
			var divLol = document.createElement('a');
			divLol.setAttribute('id', 'lol-link');
			divLol.style.display = 'block';
			divLol.style.width = '190px';
			divLol.style.height = '45px';
			divLol.style.position = 'absolute';
			divLol.style.left = '180px';
			divLol.style.top = '12px';
			divLol.style.background = '#000 url(data:image/gif;base64,R0lGODlhvgAtAPcAAAAAAAsGFhkAABIFGBcUGA4OJxAOJxgXJRocMx0iPDkBAiENJyMaJigcMTAdKzEfMSYiKCcmOC4yNjMpLjQpODYzOikoRCwwSC4yUjQtRTUzSTk4VTw9YztBWFMAAFIcK0MhKkEnNlchL1gqOVgwPn0AAHUUPmUnN3AhNUkuQkg2SkQ8WVA9WEg9YFU8YmQ1SHknRHI4XUpASkhDWkBSXFVETVpEV1hXW0dHZkdLcExRbUtTc1ZKZ1xOclhWalRZeFhhd2lBS2BIXGRRXnpGWWlLaGJPcWpSbGdUcnVEbHNVa3Vad2xub2dke3Brbn9hcnFzc05ZgFZcgkpqlFlihltok2Neh2VniWNskmlzjGd0mnloh3Fvlnd5iHd4mWp8pGZ6tXJ9o3aCmmyBpmyDtnSEqXmJtHWVrXqVv16F0naQxnKY43uy95gAAIMUO7oAAJUaR4wlSYQ3S4s0VZ44TbkdTKwqWKg7VLMrXLY8U7w%2BYYZCWIJJbYRUZ4JceJZMZ5dUaZ9cd4pmeIR3fJFofKpEXL5CXatVbq1qe9UAAP0AAOQ2bMRHYchHcshYaspZdtBBcNRaecxjeNdned1wfOpJe%2BFqf%2BFxfpFvioN8oapyjKN%2Bq8tsmsB1icp1l9xrhdxnlttxh9B0nO5Whu5tmut7iel8k%2FNlj%2FlkmPhzmPh1qZSPk4aIqYGJt4mRq4eVuJmXp5KctoCjuZuhva%2BCl7KOqKysrKGluLOzs4Wayo6jyIai2ZWlzZSp1ZKzwZ6x1Yyw6qucyqOpx66q2qq0yai427ukybC40qq345LM%2FKPL%2FK3W97bH57fQ67Ta%2FqLk%2F8yAi8iFk9WJlNiTncKNqMeUp8qbttaKo9eYp9WYss2kuNekueqGnuGSmfeImeabpfKPov6Nsf2YqPWWu%2ByotsWew9SxysG54%2F%2BWwOS2y%2Bu40fKpyfe0xPG92svLy8PH2MvT2tHGzNvC2dTX18zS8M%2Fp%2FOvAz%2BvG2PnH2PrT3fjU6OLk6e3w%2BPzg6%2F3o9%2F7%2B%2FiwAAAAAvgAtAAAI%2FgABCBxIsKBBgzUwHVzIsKHDhxAjSpxIsaJFi5qoybjIsaPHjyBDfoQwQdu2GiJTqlzJsiVDQu3UQXBJs6bNmw4JUFOIs6fPnykHmasAtKjRow8h3NOGtKlTjgGUqIAa756gp1izPpyAiRaBmRVX5UvHQGKAPqJUgQpUI4DWtzSHaMpGLUVOtwX73bv3r6%2Ffv4D%2F9VN1ClUqVKrQ6QvMuLHjx5AjS55MubJlAE%2FMWZvQsMIWGWAFMvGXzp9ldaIWqUJVCVW4fJZjy55Nu%2FZsAAEIEdJU9qCM3YSM9A6wLF21igGckCBVaVSlU%2BPwwp3use%2FAIbXSrdpIkMARbNdo%2FrmgINAXm2CEkK8bhxjVqFSpCFCfz9H6wBrZ9dWSDsEFJk2a0EKULGyskQt3EVUARRe0jOKcg5UsUsNV9FUokX0DTSAINfcMNRAEmgQSSCcynJHMGmmoEQFEAUABTz3O%2FBLMKHjAAYcdjeSoh3QW9rgQhgMFYAM19uijCw0z2RBDDIgEw0YybKSxwUI3rIKLO7ZAMA%2BMyigDTCubQFIHHG6YYIIbcfio5o%2F%2FLARiNcM8CQwaggSiCTBPJrPLAQRIoEEHG2gQgQ%2F8%2FLUPl8kAA8wurZiBCR9zxOGGGw6k5IEHC5VQggAQCVDCG2%2B0gelCHpSggEOackqQp5q2qupB%2Fp6%2BahGQBTGw2xpsyOkFGooC08srrGSCBRZXWGHFFVdgwQUrwsBDjzPLeKnoLrvkgoYZZZTByiYicQoqALIKpIgipzrkwbjoKpJIuAK9oUgJDo1b7kAKpIsuvAYJUK8C7F7YJkMEGAFGGmwAswmAhPDhggs8HPGHCz34scTESyhxRAsc4CCFFrksSu3Hu%2FSSSy671LNKSCUkAmoi%2BBIkr0P1quuBAimre5C7LS%2F0MkExt5rIuKMOJIAibRCtSL8Q0XpQBwMXjEwxxmwixQ89IOFJElvUovUmtPiBRAsbWCD2BjtwDHLIY7TCDDP03CCBfB3RPG4b8w60M0M%2Fv8Hz%2Ft0D4eyQu%2BHGTJC7iRTkKeGbXqT0QQeQgWsykD8DeTLFXEONJvJkrrk5XIQttgUX5GDGyCTnQoYuxfzyCz3vsC6BR28kovJBfOdbu98F4c5QqQYJTu%2B4gSfSRiJ1U7T4QTMgA8zkzzSfjDLljGPMP%2F70o08%2F%2FvgjjBcdgI4BDjtUocsvIveCBi%2BtfDEGsA3wCEQWREkkwBsKKPAGu7UX5DtBJSiid%2B7vssj%2BxEWugnigDQAQVX3%2B9ZBA7OMc9KAHjJyXDH1wYhim6Ys%2FqFGLTLjiChjAAAdyEAXx8YIXutBFtr6ghWFd4QAF0cUrvBA%2FkORvb4owSP%2F%2BN7gAVmSA%2FgC44UeOVxACkIN61dNHOnK1qHVgIhjfsEY5NHMNRPAACF74AQ5IWAUwkEENuZChFrRQBi1Q4Yy9GYgGmtAFIIhEiAKJWbiKxsO%2B%2BZAiAxxaAVdCRIKEIB%2FZ6ws%2BTFEFMnjBGJ7IxCzIkY1qUIMa0YAGITbQA1f8YAdUKKQaNmktLajvB2eUQhoHIgEsSOGNe8TbHcH1s5y1a5USGeC5csiSPg5kBPoI5D%2FYEYoeeMEL2TiEFLxQjWhU45jTgAYtWIADVriCClKowhc2qYZe7MIMWmjGFKqABSDAsCBieMUPUFk8gxSNeAKZn7rYpbuJ7E8BP0NgLRnYkBFkD3v%2F%2FgCHJJCwhSNwoxBe0AIXmkALbERyGtPABA5%2BgEUshMEMaKDmyHpBjGNUAVgG8UEuzNABVNqLlqv6mbpiB7SbfTSVDYmZvdbVElsKRAT4uKc%2FQnEIFdhACDSVQhay4AVpTIMc5JiGNKLBAx%2F8QApScGgYxlCGMXiyhVjQgi54UUMJiEENaKjCN214UlgVDV2JCBoAP1rOg6h0XMJDGkhcCoAPoKMf1MPHHkZwgAYI4hGH2IEUqMAFoJIjH%2BToBjYwMQOj%2FuCwiL3kDnSQgx1gwQxg3GguNokGLFgAKfVT65oAwNYTiIMd1GvHAgYQgAEgwhGA2MFRqZCNb0zjG67t%2FoYmWMCDH%2FhABzrAgW5bsIINhDAHGxsZNa9FhQtstkJslYM4xIEPdpBjtANQgCQeAYjEbgEf5PCpNKShCSGogAc8wAFve4uBC2jAAhvAQQmzZQYzfAELOFjRcenD1kJ8YrnLhe4JHEGJ6iJ2B1sQRCew8Q1sYEMQNlDBBhYcKA1oYAMt6AACMtCBxu5gBznoQATgNt%2F5uHQAk4iEN7yxXAoMYAB%2FcMQk%2BqBaxeY2GunQhz46oQlE9CEED4iABi4gNvOuQAUOOAADGoAABByARx2mjktBwI5PmILE4uiDCohgiFJIogg6uPBiF0sIfPTDHuTABiBSkIIRmPkBCEiA%2Fo7Ti6Akq8mlI8DHNbgBZW%2BY4hKMsIQjXJCDLF9YCsgqQjSwsY0i5CAHHEhBEF5A2gAYYAYB0EAD3LxZts5BDi8Q8YhLQQlH5IEOLdAt%2BPYahjBQwQ%2Fa2AIWqnBGKsQCFg0wQAEMgIN9FMo2uM61rncdGYkA4QiPMEUpSjEJFaMAwroFJRWwUAYpMFV9Tf0CPN5hgQgcIM1duMWtec3tbns7NhGRQCyugARASGISjLgDDDQQ6mTvddllaEUZsABNT86iCRGIgAESsAFYwMIHlA74QgIQTiow1AcJXsEK2h3qo%2B61CmWoQhQwzAFQ7iAFGz6ABTRAAQggWeABPwAvjcxgyh344OThHS%2BDF%2BrwS%2BYABxjY%2BA9WoAG3CJnDIM85AIjBDDP%2BIActmEHKe%2BvgC0QAvbjNLQ5oboGy6HiUOo86AGIx7ygAvbwamAHRM5CBfOc7AzMAW6Ai8HGpmx0HZ8ztBngcAQhEgAIZcLAGMkCBCDBAPgTgk9n3bhAJFBYHgar2VvlO%2BMIbPiQBAQA7) 50% 50% no-repeat';
			divLol.style.textIndent = '-9999px';
			divLol.style.color = '#f00';
			divLol.setAttribute('href', 'http://' + myDomain + '/greasemonkey/shacklol/?user=' + encodeURIComponent(username));
			divLol.setAttribute('title', 'Check out what got the [lol]s');
			divLol.innerHTML = '[ L O L ` d]';
			divCommentstools.appendChild(divLol);
		}

		// Read lol-counts from the GM store
		lolCounts = { };
		try
		{
			lolCounts = JSON.parse(GM_getValue('lol-counts', '{ }'));
		}
		catch (ex)
		{
			// Log error
			console.log(ex.description);
		}

		// Only go to the well for updated lol counts every minute
		if (GM_getValue('lolCountSetting', 'Limited') != 'None')
		{
			if ((getTime() - GM_getValue('lol-counts-time', 0)) > 60000)
			{
				retrieveLolCounts();
			}
		}

		// Add options to the filterbox on click
		var filterOpen = document.getElementById('chatty_settings').getElementsByTagName('a');
		for (var i = 0; i < filterOpen.length; i++) {
			if (filterOpen[i].text == 'Filters') {
				filterOpen[i].addEventListener('click', handleFilterBox);
				break;
			}
		}

		// Check date 4.1?
		var d = new Date();
		if ((d.getDate() == 1) && (d.getMonth() == 3) && (GM_getValue('lol-4pr1lf00z', '') != d.getYear()))
		{
			var a1 = document.createElement('div');
			a1.id = '4pr1lf00z';
			a1.style.display = 'none';
			document.getElementsByTagName('body')[0].appendChild(a1);
			GM_setValue('lol-4pr1lf00z', d.getYear());
		}
	}

	// Install [lol] buttons to any page with a div.commentsblock
	if (typeof(getElementByClassName(document, 'div', 'commentsblock')) != 'undefined')
	{
		installLolButtons();
	}

	// Create event handler to watch for DOMNode changes
	new MutationObserver(function(mutations)
	{
		for (var mutation of mutations)
		{
			if (mutation.type != 'childList') {
				continue;
			}

			for (var node of mutation.addedNodes)
			{
				if (node.classList.contains('fullpost') || node.classList.contains('root'))
				{
					installLolButtons();
					return;
				}
			}
		}
	}).observe(document.body, { childList: true, subtree: true });

	// log execution time
	// console.log(location.href + ' / ' + (getTime() - scriptStartTime) + 'ms');
})();
