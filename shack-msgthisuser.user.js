// ==UserScript==
// @name           Shack - Message This User
// @namespace      http://www.lmnopc.com/greasemonkey/
// @description    Adds Message This User buttons back to the comments
// @include        http://*.shacknews.com/laryn.x?*      
// @include        http://shacknews.com/laryn.x?*        
// @include        http://*.shacknews.com/frame_laryn.x?*
// @include        http://shacknews.com/frame_laryn.x?* 
// @include			http://www.shacknews.com/msgcenter/
// @include			http://shacknews.com/msgcenter/
// ==/UserScript==
/*

	Amazon Wish List: http://amazon.com/gp/registry/1YRBQ22VGN9PR

	------------------------------------------------------------

	Shack - Message This User
	Author: Thom Wetzel - www.lmnopc.com
	(C)2007 Thom Wetzel
	
	To Rauol Duke with love

	REVISIONS:
	
	2007-07-24 : Fixed subthread refresh
	2007-06-26 : Initial release
*/

(function() {

	// grab start time of script
	var benchmarkTimer = null;
	var scriptStartTime = getTime();

	// UTILITY FUNCTIONS
	function getTime() { benchmarkTimer = new Date(); return benchmarkTimer.getTime(); }
	
	// ThomW: I took getElementsByClassName and stripped it down to just what's needed by this script
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
	String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g,""); }

	function showPopup(event)
	{
		// stop event from bubbling up 
		event.stopPropagation(); 
		event.preventDefault(); 
		
		// center window on the screen
		var popupWidth = 870;
		var popupHeight = 550;
		var popupLeft = (window.outerWidth - popupWidth) * 0.5; 
		var popupTop = (window.outerHeight - popupHeight) * 0.5; 
		
		// I'll have to check this out later, but for some damn reason the stupid event is returning the img object instead of the anchor
		var href;
		if (event.target.href)
		{
			href = event.target.href;
		}
		else
		{
			href = event.target.parentNode.href;
		}
		
		// show the popup
		window.open(href + '#interiorbody_container', 'shackmsg', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=' + popupWidth + ',height=' + popupHeight + ',left=' + popupLeft + ',top=' + popupTop); return false; 
	}

	// install shackerId functions
	function installShackerMsg(threadId)
	{
		var dbg = false;

		// this makes the script run on the right document when called from the iframe
		if (unsafeWindow != unsafeWindow.top)
		{
			document = unsafeWindow.top.document;
		}
		
		// find threadId
		var t = document.getElementById('item_' + threadId);
		if (!t)
		{
			if (dbg) { GM_log('COULD NOT FIND item_' + threadId); }
			return false;
		}
		
		// find div.postmeta
		var pm = getElementByClassName(t, 'span', 'author');
		if (!pm)
		{
			if (dbg) { GM_log('getElementsByClassName could not locate span.author'); }
			return false;
		}
		
		// get username 
		var username = String(pm.getElementsByTagName('a')[0].innerHTML).trim();
		
		// create anchor
		var a = document.createElement('a');
		a.href = 'http://www.shacknews.com/msgcenter/new_message.x?to=' + escape(username); 
		a.title = 'Shackmessage ' + username;
		a.style.paddingLeft = '10px';
		a.addEventListener('click', function(event) { showPopup(event); }, true);

		// create img		
		var img = document.createElement('img');
		img.src = 'data:image/gif;base64,R0lGODlhDQAJAIABAP%2F%2F%2FwAAACH5BAEAAAEALAAAAAANAAkAAAIXhI8Zy3wBmoMRymrmqrQ9x0mgeCWmUQAAOw%3D%3D';
		img.width = '13';
		img.height = '9';
		img.border = '0';
		img.alt = 'Send Shackmessage';
		
		// add img to anchor
		a.appendChild(img);
		
		// add anchor to postmeta
		pm.appendChild(a);
	}
	


	// handle iframe calls
	if (String(location.href).indexOf('frame_laryn.x') != -1)
	{
		// override standard show_item_fullpost with one that supports this script
		if (!unsafeWindow.shackmsg_show_item_fullpost)
		{
			unsafeWindow.shackmsg_show_item_fullpost = unsafeWindow.show_item_fullpost;
			unsafeWindow.show_item_fullpost = function(root_id, article_id, fullpost_element)
			{
				// call original function
				unsafeWindow.shackmsg_show_item_fullpost(root_id, article_id, fullpost_element);
				
				// embed videos in updated parent window
				installShackerMsg(article_id);
			}
		}
		
		// override function used for Refresh Thread button
		if (!unsafeWindow.shackmsg_replace_whole_element_from_iframe)
		{
			unsafeWindow.shackmsg_replace_whole_element_from_iframe = unsafeWindow.replace_whole_element_from_iframe;
			unsafeWindow.replace_whole_element_from_iframe = function(id)
			{
				unsafeWindow.shackmsg_replace_whole_element_from_iframe(id);

				// this updates all the subthreads as well as the root post
				var items = document.evaluate("//div[contains(@class, 'fullpost')]/..", document.getElementById(id), null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				for (item = null, i = 0; item = items.snapshotItem(i); i++)
				{
					installShackerMsg(item.id.substr(5));
				}
			}
		}
	}
	
	// this will automatically close the shack message window after the message is sent
	else if ((location.href == 'http://www.shacknews.com/msgcenter/') || (location.href == 'http://shacknews.com/msgcenter/'))
	{
		if (window.name == 'shackmsg')
		{
			window.close();
		}
	}


	// all other pages
	else
	{
		if (!unsafeWindow.shackmsg_show_item_fullpost)
		{
			// override standard show_item_fullpost with one that supports this script
			unsafeWindow.shackmsg_show_item_fullpost = unsafeWindow.show_item_fullpost;
			unsafeWindow.show_item_fullpost = function(root_id, article_id, fullpost_element)
			{
				// call original function
				unsafeWindow.shackmsg_show_item_fullpost(root_id, article_id, fullpost_element);

				installShackerMsg(article_id);
			}
		}

		// find all the fullposts on the page
		var items = document.evaluate("//div[contains(@class, 'fullpost')]/..", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (item = null, i = 0; item = items.snapshotItem(i); i++)
		{
			var threadId = item.id.substr(5);

			installShackerMsg(threadId);
		}
	}

	// log execution time
	if (GM_log)
	{
		GM_log((getTime() - scriptStartTime) + 'ms');
	}

})();