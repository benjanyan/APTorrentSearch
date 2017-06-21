// ==UserScript==
// @name         APTorrentSearch
// @namespace    http://APTorrentSearch.bmcq.co.uk/
// @version      0.1
// @description  Adds a torrent section to a show's page on Anime-Planet link to searches on popular anime torrent sites.
// @author       benjanyan
// @match        https://www.anime-planet.com/anime/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    var ap = {
        //Returns the title of the animu
        getAnimeTitle: function() {
            var elements = $("H1[itemprop = 'name']");
            if (elements !== null && elements.length > 0 && elements[0].innerText !== null) {
                return elements[0].innerText;
            }
            return false;
        },

        //Returns the alt title of the animu (below the main title)
        getAnimeAltTitle: function() {
            var elements = $("H2[class = 'aka']"),
                text = null;
            if (elements !== null && elements.length > 0 && elements[0].innerText !== null) {
                text = elements[0].innerText;
                //Remove alt title text from element if present
                if (text.substr(0, 11) == "Alt title: ") {
                    text = elements[0].innerText.substr(11);
                }
                //Remove full stop from text of element if present
                if (text.substr(text.length - 1) == ".") {
                    text = text.substr(0, text.length - 1);
                }
                return text;
            }
            return false;
        },

        //Append the search criteria to the site's base URL
        generateURI: function(baseURL) {
            var title = ap.getAnimeTitle(),
                altTitle = ap.getAnimeAltTitle(),
                uri = "";
            if (title) {
                uri = baseURL + "\"" + title + "\"";
            }
            if (altTitle) {
                uri += " | " + "\"" + altTitle + "\"";
            }
            if (uri.length > 0) {
                return encodeURI(uri);
            } else {
                return false;
            }
        },

        //Add the HTML for the torrent section and buttons
        addTorrentSection: function() {
            var torrentButtons = $("<section>", {class: "sidebarStats"})
            .append($("<h3>", {class: "smSidebar"})
                    .text("Search for torrents"));
            //You could add additional ones here...
            torrentButtons.append($("<a>", {class: "button"})
                                  .text("nyaa")
                                  .prop("href", ap.generateURI("https://nyaa.si/?f=0&c=1_2&q=")));
            torrentButtons.append($("<a>", {class: "button"})
                                  .text("pantsu")
                                  .prop("href", ap.generateURI("https://nyaa.pantsu.cat/search?c=3_5&s=0&max=50&userID=0&q=")));
            torrentButtons.append($("<a>", {class: "button"})
                                  .text("anidex")
                                  .prop("href", ap.generateURI("https://anidex.info/?id=1&adv=1&lang_id=1&q=")));

            var sideBar = $("div[class = 'pure-1 md-1-3']");
            sideBar.append(torrentButtons);
        }
    };

    //Not every /anime page is actually an anime page. The generateURI returns false if it fails to pull the show name from the page
    //so I'm being lazy here. We don't want the torrent section in those cases.
    if (ap.generateURI()) {
        ap.addTorrentSection();
    }
})();