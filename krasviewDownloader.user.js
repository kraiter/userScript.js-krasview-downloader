// ==UserScript==
// @name         krasviewDownloader
// @namespace    http://your.homepage/
// @version      0.1
// @description  Скрипт дает возможность скачивать видео с сайта www.krasview.ru
// @author       kraiter
// @match        http://krasview.ru/*
// @include 	 http://krasview.ru/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==
(function(){
    if (location.hostname !== "krasview.ru")
        return;
    var unsafeWindow= this.unsafeWindow;
    (function(){
        var test_scr= document.createElement("script");
        var tid= ("t" + Math.random() + (new Date())).replace(/\./g, "");
        test_scr.text= "window."+tid+"=true";
        document.querySelector("body").appendChild(test_scr);
        if (typeof(unsafeWindow) == "undefined" || !unsafeWindow[tid]) {
            if (window[tid]) {
                unsafeWindow= window;
            } else {
                var scr= document.createElement("script");
                scr.text= "(" +
                    (function() {
                        var el= document.createElement('unsafeWindow');
                        el.style.display= 'none';
                        el.onclick=function(){return window};
                        document.body.appendChild(el);
                    }).toString() + ")()";
                document.querySelector("body").appendChild(scr);
                this.unsafeWindow= document.querySelector("unsafeWindow").onclick();
                unsafeWindow= window.unsafeWindow;
            };
        }
    })();
    try{
        
        //событие при клике на "Скачать"
        var downLoadVideo = function(){
                $.get($(this).attr('link'), function(data) {
                    var vStript = $("#video-container > script", data).text();
                    var regURL = /flashvars:\s*({[^}]*})/;
                    var myArray = regURL.exec(vStript);
                    var myJSON = $.parseJSON(myArray[0].slice(11))
                    location.href = myJSON.url;
                    return false;
              	});
            }
        //для страницы со списком видео
        $('.video-gallery > li').each(function(indx, element) {
            var url = $('div > a', element).attr('href');
            $('div > small', element).append(' <a class="user-js-download" link="' + url + '" href="#" style="color:red;">Cкачать</a>');        
        });
        //для страницы с одним видео
        $('.block-title.video').each(function(indx, element) {
            $('[itemprop=name]', element).append(' <a class="user-js-download" link="" href="#" style="color:red;">Cкачать</a>');        
        });
        //навешиваем событие на ссылку "скачать"
        $('.user-js-download').each(function(indx, element) {
            $(element).click(downLoadVideo);      
        });     
        
    } catch(e){console.error(e)}
})();
