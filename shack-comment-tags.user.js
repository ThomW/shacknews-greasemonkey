// ==UserScript==
// @name           ShackCommentTags
// @namespace      http://www.animalbeach.net/public/monkey/
// @description    Adds Shack Tags besides the comment form *thanks to Awun for some changes!*
// @include http://*.shacknews.com/laryn.x?*
// @include http://shacknews.com/laryn.x?*
// @include http://*.shacknews.com/frame_laryn.x?*
// @include http://shacknews.com/frame_laryn.x?*
// ==/UserScript==

/*

	Original version: naabster

	@TODO
		* Preserve carriage returns when removing whitespace
		* Tag on/off toggle. Needs parsing...
		* Live edit

	2008-06-08 : pieman
		* href="javascript:return false" hack to get accesskeys working in ff3
	2008-02-25 : dodob
		* Better code tag handling
		* Code tag bugfix: added space to tags to prevent parsing error at srvr
	2008-02-24 : dodob
		* Catch error in the event user hits Esc key and input does not exist

	2008-02-19 : dodob
		* Place cursor after inserted tag in prompt() mode
		* Keep text selected after tag insertion in select mode
		* Move whitespace outside of tag
		* Remember/restore scrollbar position after inserting tag
		* Changed orange hotkey to 'n'

	2008-02-18 : ThomW
		* I rewrote huge chunks of addShackCommentTags() so users can highlight text,
			then click on a tag instead of having to type text into a crappy prompt().
			Along the way I streamlined the function to make it less confusing.  I'm not
			sure why naabster was doing some of the things he was doing. It worked, but
			it was tough to work with.
		* Fixed addShackCommentTags undefined errors that showed up after the script ran
		* Eliminated non-fatal postf error when script ran
*/

(function() {

function addShackCommentTags(e)
{
	var el=e.target;
	if (!el) return;
	if (!el.id) return;
	if ('sctags'!=el.name)
	{
		return;
	}

	var selectedTag = el.id;
	var isCode = (selectedTag == 'code');

		var tags = new Array(
			new Array("red", "green", "blue", "yellow", "limegreen", "olive", "orange", "pink", "italics", "bold", "quote", "sample", "underline", "strike", "spoiler", "code"),
			new Array("r{", "g{", "b{", "y{", "l[", "e[", "n[", "p[", "/[", "b[", "q[", "s[", "_[", "-[", "o[", "/{{"),
			new Array("}r", "}g", "}b", "}y", "]l", "]e", "]n", "]p", "]/", "]b", "]q", "]s", "]_", "]-", "]o", "}}/")
		);

	// Get TextArea and remember the scrollbar position
	var textarea = document.getElementById('frm_body');
	var oldScrollTop = textarea.scrollTop;
	//GM_log('very berry scrolltop: ' + textarea.scrollTop);

	var startPos = textarea.selectionStart;
	var endPos = textarea.selectionEnd;
	//GM_log('startPos and endPos are: ' + startPos + ', ' + endPos + '.');

	var input = '';

	// If text is selected, we're going to be adding the tags around it
	if (endPos - startPos > 0)
	{
		input = textarea.value.substring(startPos, endPos);
	}
	// If no text is selected, use prompt() to let the user enter text
	else
	{
		input = prompt("Type in the text you want to be " + selectedTag + ".", "");

		if (!input)	// if user presses Escape and/or no input is caught
		{
			textarea.focus();
			return;
		}
	}

	// If input is blank at this point, exit
	if (input.length == 0)
	{
		textarea.focus();
		return;
	}

	// Preprocess the input
	var wsBef = false;
	var wsAft = false;
	if (!isCode)
	{
		// Remember white space and Trim
		wsBef = /^\s\s*/.test(input);
		wsAft = /\s\s*$/.test(input);
		//GM_log('wsBef: ' + wsBef + ', wsAft: ' + wsAft );
		input = input.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
	else
	{
		// Break up curly braces that confuse shack, ie: /{{{ , }}}/
		//wsBef = /^{/.test(input);
		//wsAft = /}$/.test(input);
		input = input.replace(/^{/, '\n{').replace(/}$/, '}\n');
	}

	// Find the idx value of the selected tag in tags and exit if it's not found
	var tagIdx = tags[0].indexOf(selectedTag);
	if (tagIdx == -1)
	{
		return;
	}

	// Update the value of textarea with the outcome; put whitespace outside of tags
	textarea.value = textarea.value.substring(0, startPos)
		+ (wsBef ? ' ' : '')
		+ tags[1][tagIdx]
		+ input
		+ tags[2][tagIdx]
		+ (wsAft ? ' ' : '')
		+ textarea.value.substring(endPos, textarea.value.length);

	// Place the cursor back in the textarea
	var offset = wsBef ? 1 : 0;
	// Keep text selected
	if (endPos - startPos > 0)
	{
		offset += (isCode) ? startPos+3 : startPos+2;
		textarea.setSelectionRange(offset, offset+input.length);
	}
	// Move the cursor after inserted tags
	else
	{
		offset += (isCode) ? startPos+input.length+6 : startPos+input.length+4;
		offset += wsAft? 1 : 0;
		textarea.setSelectionRange(offset, offset);
	}
	textarea.focus();
	//GM_log('scrollTop: ' + textarea.scrollTop);
	//GM_log('scrollHeight: ' + textarea.scrollHeight);
	textarea.scrollTop = oldScrollTop;
}


// adds comment tags besides the comments form
var postf = document.getElementById('postform');
var ShackCommentTags = document.createElement("div");
ShackCommentTags.setAttribute('style','float:left; padding:5px');

ShackCommentTags.innerHTML = 'ShackCommentTags&#8482;<br /><br />' +
	'<table cellpadding="2" border="0" cellspacing="0">' +
	'<tr><td><span class="jt_red"><u>r</u>ed</span></td><td><a href="javascript:return false" accesskey="r" id="red" name="sctags" style="cursor: pointer;">r{ ... }r</a></td>' +
	'<td><i><u>i</u>talics</i></td><td><a href="javascript:return false" accesskey="i" id="italics" name="sctags" style="cursor: pointer;">/[ ... ]/</a></td></tr>' +
	'<tr><td><span class="jt_green"><u>g</u>reen</span></td><td><a href="javascript:return false" accesskey="g" id="green" name="sctags" style="cursor: pointer;">g{ ... }g</a></td>' +
	'<td><b>bol<u>d</u></b></td><td><a href="javascript:return false" accesskey="d" id="bold" name="sctags" style="cursor: pointer;">b[ ... ]b</a></td></tr>' +
	'<tr><td><span class="jt_blue"><u>b</u>lue</span></td><td><a href="javascript:return false" accesskey="b" id="blue" name="sctags" style="cursor: pointer;">b{ ... }b</a></td>' +
	'<td><span class="jt_quote"><u>q</u>uote</span></td><td><a href="javascript:return false" accesskey="q" id="quote" name="sctags" style="cursor: pointer;">q[ ... ]q</a></td></tr>' +
	'<tr><td><span class="jt_yellow"><u>y</u>ellow</span></td><td><a href="javascript:return false" accesskey="y" id="yellow" name="sctags" style="cursor: pointer;">y{ ... }y</a></td>' +
	'<td><span class="jt_sample">sam<u>p</u>le</span></td><td><a href="javascript:return false" accesskey="p" id="sample" name="sctags" style="cursor: pointer;">s[ ... ]s</a></td></tr>' +
	'<tr><td><span class="jt_olive">oliv<u>e</u></span></td><td><a href="javascript:return false" accesskey="e" id="olive" name="sctags" style="cursor: pointer;">e[ ... ]e</a></td>' +
	'<td>u<u>nderline</u></td><td><a href="javascript:return false" accesskey="u" id="underline" name="sctags" style="cursor: pointer;">_[ ... ]_</a></td></tr>' +
	'<tr><td><span class="jt_lime"><u>l</u>imegreen</span></td><td><a href="javascript:return false" accesskey="l" id="limegreen" name="sctags" style="cursor: pointer;">l[ ... ]l</a></td>' +
	'<td><span class="jt_strike">s<u>t</u>rike</span></td><td><a href="javascript:return false" accesskey="t" id="strike" name="sctags" style="cursor: pointer;">-[ ... ]-</a></td></tr>' +
	'<tr><td><span class="jt_orange">ora<u>n</u>ge</span></td><td><a href="javascript:return false" accesskey="n" id="orange" name="sctags" style="cursor: pointer;">n[ ... ]n</a></td>' +
	'<td><u>s</u><span class="jt_spoiler" onclick="return doSpoiler( event );">poiler</span></td><td><a href="javascript:return false" accesskey="s" id="spoiler" name="sctags" style="cursor: pointer;">o[ ... ]o</a></td></tr>' +
	'<tr><td><span class="jt_pink"><u>m</u>ultisync</span></td><td><a href="javascript:return false" accesskey="m" id="pink" name="sctags" style="cursor: pointer;">p[ ... ]p</a></td>' +
	'<td><pre class="jt_code"><u>c</u>ode</pre></td><td><a href="javascript:return false" accesskey="c" id="code" name="sctags" style="cursor: pointer;">/{{ ... }}/</a></td></tr>' +
	'</table>';

if (postf)
{
	postf.style.cssFloat = 'left';
	postf.parentNode.insertBefore(ShackCommentTags, postf.nextSibling);
}

window.addEventListener('click', addShackCommentTags, true);

})();
