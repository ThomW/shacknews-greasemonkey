// ==UserScript==
// @name Twitter Shackname Translator
// @description Adds shacknames to your Twitter feed
// @include https://twitter.com
// @include https://twitter.com/*
// ==/UserScript==

var NAMES_URL = "http://gamewith.us/_widgets/shack-twitter.php";
var CACHE_TIME = 60 * 60 * 1000;


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


function mapNames(map, source)
{
    var links = source.getElementsByTagName("a");

    // look for all the links with an 'oid' attribute
    for (var i = 0; i < links.length; i++)
    {
        var splitHref = links[i].href.split('/');
        var twitterName = splitHref[splitHref.length - 1];

        var name = map[twitterName];
        if (name)
        {
            // Make sure this name hasn't already been transmogrified or isn't an otherwise skippable link
            if ((links[i].className.indexOf('shack-translated') != -1) || (links[i].className.indexOf('account-summary') != -1) || (links[i].getAttribute('data-element-term') == 'tweet_stats'))
            {
                continue;
            }
            else
            {
                links[i].className += ' shack-translated';
            }

            // Seek optimal place for shackname -- if that's not found, use fallback
            var tgt = links[i].getElementsByTagName('strong');
            if (tgt.length)
            {
                tgt = tgt[0];
            }
            else
            {
                tgt = links[i];                
            }

            // Add the shackname
            tgt.innerHTML += ' (<i class="icon-shack"></i> ' + name + ')';
        }
    }
}


function getItStartedInHere(map)
{
    // map all the links alread in the document
    mapNames(map, document);

    document.addEventListener('DOMNodeInserted', function(e)
    {
        // try to map all the links that just got added
        mapNames(map, e.target);
    }, false);
}


GM_addStyle(".icon-shack { display: inline-block; width: 17px; height: 16px; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oJHQ4dE6FeeBIAAAJSSURBVDjLXdRPaFxVFAbw33nzJpmZRDsTarX+oxBQEIpgui3WhehOQRIX7lyL7kUo3bpRXLiX4kIjiqCLiuJCRAUXFpGiWKgg1vinndo2aZyZd1zkjrzkwuVx3z3nu993ON+JzNReERGQ5SIi6tZ1k5nNPC5bydVBkCyrnA/hdhzB3TgSJ6J74KGAmIPOQTZio7Npc4B1HMcTleqrRrOAJXxP9/3Mf89HRDVnaA6cmTJTX/8evI5X8Sm28AFWUeNpvIdn23ltVjVW8A7O4hKm2EWW72u4AwO8jadQZeYeo8x0yqkar2AbY9zA9da+hgYX8PzQcFipzpba1YFlPIIX8CR2CoMbmCDKuVNi+4XRR/gFF/FmjYUSdBFvFO1LeKvIXC7ga6VuE6qXaS7gNpxEr8a1zPw8Iu7DVTyK+zHNzJ9arfFQYTauVV9PcvZlRCzhBO6qMnN2Js5U6JWC/lokLUfEgxHxwEZEB0PM8PvUdLvgL5ScqOB0nm4KmwF+LkAVHsbq5p70JdzC5b7+XzAY6JW4P6qw15n4EUfxWwEa4WN8wp1dHMJN/Llj5ypsbzuOS+vsVOJ/h/xQqZoiYbewG2XmjK3E4VKjLdwcxWiochLnNufS5r5rNB/iXnyGc627Gt/hXXyB3tj4OY1vcDkzp/ssUvSu4kU8jqPl/yIW16x1i/9ewjPHHOvNGzoyc9/oKGPjMB4rdpjouGKmV2Tfwrc4v2+sHJxHrb5ZLAUedXWXJya7+GfFyviKv69n2p/Ycm8cnARFagfVuvUO6oPx8/0fmrccx2rpgroAAAAASUVORK5CYII='); }");


var cached = JSON.parse(GM_getValue('names', '{ }'));
var now = new Date().getTime();
if ((now - GM_getValue('last_updated', 0)) > CACHE_TIME)
{
    GM_log("fetching");
    GM_xmlhttpRequest({
        method: "GET",
        url: NAMES_URL, 
        onload: function(response) {
            var map = JSON.parse(response.responseText);

            GM_setValue('names', response.responseText);
            GM_setValue('last_updated', String(now));

            getItStartedInHere(map);
        }
    });
}
else
{
    GM_log("using cached");
    getItStartedInHere(cached);
}
