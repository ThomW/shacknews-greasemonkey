// ==UserScript==
// @name           Shack - Working Collapse
// @namespace      http://www.lmnopc.com/
// @description    Makes the collapse buttons actually work!
// @include http://shacknews.com/chatty*
// @include http://*.shacknews.com/chatty*
// ==/UserScript==
(function() {

	/*
	Amazon Wish List: http://amazon.com/gp/registry/1YRBQ22VGN9PR

	------------------------------------------------------------
	Shack Working Collapse
	Author: Thom Wetzel - www.lmnopc.com
	(C)2007-2008 Thom Wetzel
	------------------------------------------------------------

	Big thanks to arhughes for making his collapse script that got me
	thinking about even doing this, but I trashed it and started over
	because his script was doing a bunch of things you shouldn't really
	do in Greasemonkey scripts.

	REVISIONS:

	2007-06-26
		- Initial Release

	2007-06-26.b
		- Fixed the show_post bug.  There's something weird going on but it works now.

	2007-07-19
		- Fixed the problem with videos showing up when posts are collapsed

	2008-01-23
		- Added setValue hack for dealing with new and improved(?) version of Greasemonkey
		- Doubled number of stored threads from 50 to 100 and created MAX_THREADS variable
			so users can easily adjust it so they can balance their own performance vs. qty

	2008-12-12
		- Got rid of the code that dealt with the +/- things (Bull had issues ... lol)
		
	2011-02-23 
		- Updated for Shacknews 2011 remodel 

	*/

	var MAX_THREADS = 100;

	var benchmarkTimer = null;
	var scriptStartTime = getTime();
	function getTime() { benchmarkTimer = new Date(); return benchmarkTimer.getTime(); }

	function isFunction(a) { return typeof a == 'function'; }
	function isObject(a) { return (a && typeof a == 'object') || isFunction(a); }
	function isArray(a) { return isObject(a) && a.constructor == Array; }

	// Hideous Greasemonkey 0.7 hack
	function setValue(key, value)
	{
		window.setTimeout(
				function()
				{
					GM_setValue(key, value);
				}, 0);
	}


	// reads in an array from a Greasemonkey variable
	function loadArray(key)
	{
		var arr = new Array();

		arr = GM_getValue(key);
		if (arr)
		{
			arr = arr.split(",");
		}

		if (!isArray(arr))
		{
			arr = new Array();
		}

		return arr;
	}

	function findThread(tid)
	{
		for (var i = 0; i < arrCollapsedThreads.length; i++)
		{
			if (arrCollapsedThreads[i] == tid)
			{
				return i;
			}
			else if (arrCollapsedThreads[i] < tid)
			{
				return -1;
			}
		}
		return -1;
	}

	// used in sort() method to reverse sort the list
	function reverseCompare(a, b)
	{
		return b-a;
	}

	function addThread(tid)
	{
		// don't allow duplicates
		if (findThread(tid) != -1)
		{
			return;
		}

		// don't allow more than MAX_THREADS threads in the list
		while (arrCollapsedThreads.length >= MAX_THREADS)
		{
			arrCollapsedThreads.pop();
		}

		// add the new thread to the array
		arrCollapsedThreads.push(tid);

		// sort the array
		arrCollapsedThreads.sort(reverseCompare);

		// save the new array
		setValue(sCollapsedThreads_Key, String(arrCollapsedThreads));
	}

	function removeThread(tid)
	{
		// find thread in the array
		var idx = findThread(tid);
		if (idx == -1)
		{
			return;
		}

		// remove the thread from the array
		arrCollapsedThreads.splice(idx, 1);

		// save the updated array
		setValue(sCollapsedThreads_Key, String(arrCollapsedThreads));
	}

	// load list of collapsed threads
	var arrCollapsedThreads = new Array();
	var sCollapsedThreads_Key = 'shackCommentsCollapsePost';
	arrCollapsedThreads = loadArray(sCollapsedThreads_Key);

	// replace functions with our stand-ins
	if (!unsafeWindow.shackcollapse_close_post)
	{
		unsafeWindow.shackcollapse_close_post = unsafeWindow.close_post;
		unsafeWindow.close_post = function(id)
		{
			// call original function
			unsafeWindow.shackcollapse_close_post(id);

			// 2008-12-12 :
			// Make sure this is a root node before adding it to the list
			// of collapsed threads to prevent subthreads from being hidden
			if (document.getElementById('root_' + id) != null)
			{
				// store this thread id
				addThread(id);
			}
		}
	}

	function removeClassFromElement(el, nukeClass)
	{
		// split classes into array
		var classArray = String(el.className).split(' ');

		// make sure the class we're removing is in classArray
		if (classArray.indexOf(nukeClass) == -1)
		{
			alert('removeClassFromElement Error : "' + nukeClass + '" not found in "' + el.className + '"');
			return;
		}

		var newClasses = '';

		for (var i = 0; i < classArray.length; i++)
		{
			if (classArray[i] != nukeClass)
			{
				if (newClasses.length)
				{
					newClasses += ' ';
				}
				newClasses += classArray[i];
			}
		}
		el.className = newClasses;
	}

	function getElementByClassName(oElm, strTagName, strClassName)
	{
		var arrElements = oElm.getElementsByTagName(strTagName);
		var oElement;
		for(var i=0; i < arrElements.length; i++)
		{
			oElement = arrElements[i];
			if (oElement.className.indexOf(strClassName) == 0)
			{
				return oElement;
			}
		}
	}

	if (!unsafeWindow.shackcollapse_show_post)
	{
		unsafeWindow.shackcollapse_show_post = unsafeWindow.show_post;
		unsafeWindow.show_post = function(article_id)
		{
			// call original function
			unsafeWindow.shackcollapse_show_post(article_id);

			// remove ul.hidden -- which is really weird but I'll go with it if it makes the stupid thing work.  ;)
			var article_node = document.getElementById("item_" + article_id);
			var ul_node = getElementByClassName(article_node, 'ul', 'hidden');
			if (ul_node)
			{
				removeClassFromElement(ul_node, 'hidden');
			}

			// remove this thread id from our list
			removeThread(article_id);
		}
	}

	if (!unsafeWindow.shackcollapse_toggle_collapse)
	{
		unsafeWindow.shackcollapse_toggle_collapse = unsafeWindow.toggle_collapse;
		unsafeWindow.toggle_collapse = function(id)
		{
			// call original function
			unsafeWindow.shackcollapse_toggle_collapse(id);

			// we have to find the UL under the item_[id] to see if it's hidden or not
			var collapsableUl = document.getElementById('item_' + id).getElementsByTagName('ul')[0];

			if (collapsableUl.className.indexOf('hidden') == -1)
			{
				removeThread(id);
			}
			else
			{
				addThread(id);
			}
		}
	}

	// add CSS to the page to hide collapsed embedded videos
	GM_addStyle('div.collapsed object { visibility: hidden; };');

	// check root posts for collapsed threads
	var items = document.evaluate("//div[contains(@class, 'root')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (item = null, i = 0; item = items.snapshotItem(i); i++)
	{
		var rootId = item.id.substr(5);
		if (findThread(rootId) > -1)
		{
			unsafeWindow.shackcollapse_close_post(rootId);
		}
	}

	// log execution time
	if (GM_log)
	{
		GM_log((getTime() - scriptStartTime) + 'ms');
	}

})();