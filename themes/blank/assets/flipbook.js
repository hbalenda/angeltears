window.addEventListener('DOMContentLoaded', function() {

    const showFlipBook = function(counter) {
        setTimeout(function() {
            if (document.querySelectorAll('[page]').length) {
                document.querySelector('.flipbook-wrapper').classList.remove('is-hidden');
                document.querySelector('.controls-container').classList.remove('is-hidden');
                document.querySelector('.angel').classList.remove('is-hidden');
                document.querySelector('.spotify-wrapper').classList.remove('is-hidden');
            } else if (counter > 9) {
                alert(':( God should\'ve spent a little more time on this page.')
                return;
            } else {
                showFlipBook(counter);
            }
            counter ++;
        }, 500);
    };

    const flipBook = document.querySelector('.flipbook-wrapper').innerHTML;

    const initFlipBook = function(page) {
        setGlobalVariables();

        $("#flipbook").turn({
            width: window.qzine.clientWidth,
            height: window.qzine.flipBookHeight,
            page: page,
            autoCenter: true,
            duration: 1000,
        });
        window.qzine.length = $("#flipbook").turn("pages");
        bindFlipBookEvents();
        //Set Flipbook Dimensions
        setFlipBookDimensions();
        showFlipBook(0);
    }
    const bindFlipBookEvents = function() {
        $("#flipbook").bind("turned", function(event, page, view) {
            currentPage = page;
        });

        $("#flipbook").bind("turning", function(event, page, view) {
            const controls = document.querySelector('.controls');
            // Hide/show first last controls
            if (view.includes(1)) {
                controls.classList.add('first');
                controls.classList.remove('last');
            } else if (view.includes(window.qzine.length)) {
                controls.classList.add('last');
                controls.classList.remove('first');
            } else {
                if (controls.classList.contains('first')) {
                    controls.classList.remove('first');
                } else if (controls.classList.contains('last')) {
                    controls.classList.remove('last');
                }
            }
            //Set Image Heights 
            setImageHeights();
            //Hide/show Spotify
            if (page == '2' || page == '3') {
                document.querySelector('.spotify-wrapper').style.opacity = 1;
                document.querySelector('.spotify-wrapper').style.zIndex = 3;
            } else {
                document.querySelector('.spotify-wrapper').style.opacity = 0;
                document.querySelector('.spotify-wrapper').style.zIndex = -1;
            }
        });
    }
    const bindMouseEvents = function () {
        root.addEventListener("mousemove", e => {
            if (e.pageX < window.qzine.singlePageWidth) {
                body.classList.remove('right');
                body.classList.add('left');
                root.style.setProperty('--mouse-x', e.clientX - 25 + "px");
                root.style.setProperty('--mouse-y', e.clientY - 45 + "px");
            } else {
                body.classList.remove('left');
                body.classList.add('right');
                root.style.setProperty('--mouse-x', e.clientX - 55 + "px");
                root.style.setProperty('--mouse-y', e.clientY - 45 + "px");
            }
        });
    }
    const setImageHeights = function() {
        document.querySelectorAll('.images-with-text img').forEach(function(img) {
            img.style.height = (window.qzine.flipBookHeight * .7) + 'px';
        })
    }
    const setFlipBookDimensions = function() {
        var flipbook = document.querySelector('#flipbook');
        var spotifywrapper = document.querySelector('.spotify-wrapper');
        var spotifyiframe = document.querySelector('.spotify-wrapper iframe');
        var controls = document.querySelector('.controls');

        flipbook.style.height = window.qzine.flipBookHeight + 'px';
        flipbook.style.width = window.qzine.clientWidth + 'px';
        let translateY = (window.innerHeight - window.qzine.flipBookHeight) / 2;
        document.querySelector('.angel-tears').style.transform ='translateY('+ translateY + 'px' + ')';
        document.querySelectorAll('#flipbook .page').forEach(function(page) {
            page.style.height = window.qzine.flipBookHeight + 'px';
            page.style.width = window.qzine.clientWidth;
        })
        document.querySelectorAll('.qzine-page').forEach(function(page) {
            page.style.height = window.qzine.flipBookHeight + 'px';
            page.style.width = window.qzine.singlePageWidth + 'px';
        })
        document.querySelectorAll('.video-embed iframe').forEach(function(embed) {
            embed.style.width = (window.qzine.singlePageWidth) + 'px';
        })
        setImageHeights();
        controls.style.right = window.qzine.controlsOffset;
        spotifywrapper.style.left = (window.qzine.clientWidth / 4) + 'px';
        spotifywrapper.style.top = (window.qzine.flipBookHeight / 2) + 'px';

        if (window.qzine.clientWidth < 500) {
            var spotifyWidth = '80px';
            spotifyiframe.style.width = spotifyWidth;
            // hamburger style phone controls should be under zine
            controls.style.top = window.qzine.flipBookHeight + translateY + 'px';
        } else {
            spotifyiframe.style.width = '300px';
            controls.style.top = 'unset';
        }
    }
    const onResizeLeading = function() {
        document.querySelector('.flipbook-wrapper').style.display = 'none';
        document.querySelector('.angel').style.display = 'none';
        document.querySelector('.controls-container').style.display = 'none';
        document.querySelector('.flipbook-wrapper').classList.add('is-hidden');
        document.querySelector('.controls-container').classList.add('is-hidden');
        document.querySelector('.spotify-wrapper').classList.add('is-hidden');
        document.querySelector('.angel').classList.add('is-hidden');
        //move mouse to the middle again to prevent weird reflow
        root.style.setProperty('--mouse-x', '65%');
        root.style.setProperty('--mouse-y', '20%');
        $("#flipbook").turn("destroy");
        document.querySelector('.flipbook-wrapper').innerHTML = flipBook;
        document.querySelector('.flipbook-wrapper').style.display = 'block';
        document.querySelector('.angel').style.display = 'block';
        document.querySelector('.controls-container').style.display = 'block';
    }
    const setGlobalVariables = function() {
        window.qzine = {};
        window.qzine.clientWidth = window.innerWidth;
            if (window.qzine.clientWidth < 500) {
                window.qzine.controlsOffset = 0;
                window.qzine.flipBookHeight = window.qzine.clientWidth * .54;
            } else if (window.qzine.clientWidth < 1000 && window.qzine.clientWidth > window.innerHeight) {
                //Hot Dog Style Phone or Tablet
                window.qzine.flipBookHeight = window.innerHeight;
            } else if (window.qzine.clientWidth < 1000) {
                //Hamburger style tablet or weird desktopbrowser
                window.qzine.controlsOffset = 0;
                window.qzine.flipBookHeight = window.qzine.clientWidth * .54;
            } else {
                //Desktop
                window.qzine.controlsOffset = '50px';
                window.qzine.flipBookHeight = window.innerHeight;
            }
        window.qzine.singlePageWidth = window.qzine.clientWidth / 2;
    }

    ////////////////////////
    // DO STUFF
    ////////////////////////
    //declare global variables
    var currentPage = 1;
    const body = document.querySelector('body');
    const root = document.documentElement;
    //Initialize FlipBook
    initFlipBook(currentPage);

    //Bind Click Events
    $("#previous").mousedown(function(e) {
        $("#flipbook").turn("previous");
    });
    
    $("#next").mousedown(function(e) {
        $("#flipbook").turn("next");
    });

    //Bind Mouse Events
    bindMouseEvents();
    
    // Bind Resize Events
    if (window.innerWidth < 1000 && window.onorientationchange) {
        window.addEventListener('orientationchange', function() {
            onResizeLeading();
            initFlipBook(currentPage);
        });
    } else {
        window.addEventListener('resize', _.debounce(function() {
            //Hide FlipBook
            onResizeLeading();
        }, 125, {leading: true, trailing: false}));
        window.addEventListener('resize', _.debounce(function() {
            //Destroy and restart flipbook
            initFlipBook(currentPage);
        }, 125, {leading: false, trailing: true}));
    }
})
