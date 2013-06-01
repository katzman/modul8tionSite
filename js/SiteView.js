/* ==========================================================================
 SITE VIEW ENCOMPASSES ALL THE SITE VIEW ELEMENTS.
 ========================================================================== */
function SiteView ()
{
    this.currentPage = "";
    this.newPage = "";
    this.footerLeft = 0;
    this.footerWidth = 900;
    this.footerHeight = 150;
    this.contentNavWidth = 0;
    this.navList = [];
    this.contentNavItems = [];
    this.contentNavDiv = "";
    this.newContentItem = {};

    this.mainNav;
    this.contentNav;
    this.siteContent;
}

SiteView.prototype.init = function ()
{
    this.MainNav = new MainNav ( this.navList, this );
    this.ContentNav = new ContentNav( this );
    this.SiteContent = new SiteContent( this );

    this.MainNav.buildNav();
};

//Position site elements on init based on window size.
SiteView.prototype.initView = function ()
{
    var mainNavWidth = $(document.getElementById( "navLinks" )).width();
    var mainNavLeft = Math.round(( 900 - mainNavWidth ) * 0.5 ) + "px";

    $("#navLinks").css("margin-left", mainNavLeft );
};

//Positions site elements on screen on window resize
SiteView.prototype.updateView = function ()
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    var contentWidth = $("#itemTarget").width();

    var contentX = Math.round(( windowWidth - contentWidth ) * 0.5 );
    var contentY = Math.round (( windowHeight - 424 - 150 ) * 0.5 );

    var leftBracketPos = contentX - 100;
    var rightBracketPos = contentX - 100;

    this.footerLeft = Math.round(( windowWidth - this.footerWidth ) * 0.5 );

    $("#rightBracket").css("top", contentY );
    $("#leftBracket").css("top", contentY );
    $("#rightBracket").css("right", rightBracketPos + "px" );
    $("#leftBracket").css("left", leftBracketPos + "px" );
    $("#footer").css("bottom", "0px");
    $("#footer").css("margin-left", this.footerLeft + "px" );

    this.centerContent();
};

// centers the content on screen based on window width and height.
SiteView.prototype.centerContent = function ()
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    var contentWidth = $("#itemTarget").width();
    var contentHeight = $("#itemTarget").height();
    var contentTargetX = Math.round(( windowWidth - contentWidth ) * 0.5 );
    var contentTargetY = Math.round (( windowHeight - contentHeight - 150 ) * 0.5 );

    $("#itemTarget").css("top", contentTargetY );
    $("#itemTarget").css("left", contentTargetX );
};


/* ==========================================================================
 MAIN NAVIGATION :: BOTTOM TEXT NAV BAR.
 ========================================================================== */
function MainNav ( navList, parent )
{
    this.navList = navList;
    this.parent = parent;
    this.currentNavItem;
}

// builds bottom text navigation.
MainNav.prototype.buildNav = function ()
{
    var navDiv = document.getElementById( "navLinks" );

    for ( var i in this.navList )
    {
        console.log ( this.navList[i].action );

        if ( this.navList[i].show === "true" )
        {
            var btn = new this.MainNavElement( this.navList[i], this );
            navDiv.appendChild(btn.div);
        }
        else
        {
            if ( this.navList[i].action === "homeMenu" )
            {
                this.parent.ContentNav.navItemClicked ( this.navList[i] );
            }
        }
    }

    this.parent.initView();
    this.parent.updateView();
};

// main nav text nav element.
MainNav.prototype.MainNavElement = function  ( _data, site )
{
    this.data = _data;
    this.site = site;
    this.div = document.createElement( 'div' );
    this.div.innerHTML = this.data.name;
    this.div.setAttribute('class','mainNavBtn');

    var that = this;

    this.onClick = function ()
    {
        if ( that !== site.currentNavItem )
        {
            var tempBtn = site.currentNavItem;
            site.currentNavItem = that;

            if ( tempBtn )
            {
                tempBtn.btnOut ();
            }

            site.parent.ContentNav.navItemClicked( that.data );
        }
    };

    this.btnOver = function ()
    {
        TweenLite.to ( that.div,.3, {scaleX:1.3, scaleY:1.3, ease:'Back.easeOut' });
    };

    this.btnOut = function ()
    {
        if ( that !== site.currentNavItem )
        {
            TweenLite.to ( that.div,.3, {scaleX:1, scaleY:1, ease:'Back.easeOut' })
        }
    };

    this.div.onclick = this.onClick;
    this.div.onmouseover = this.btnOver;
    this.div.onmouseout = this.btnOut;
}


/* ==========================================================================
 CONTENT NAVIGATION :: THUMB NAIL NAVIGATION BAR.
 ========================================================================== */
function ContentNav ( parent )
{
    this.parent = parent;
    this.mousePos = {};
    this.scroll = false;
    this.contentNavDiv;
    this.currentNavItem;
}

// MainNav item clicked. Builds corresponding content nav based on xml.
ContentNav.prototype.navItemClicked = function ( item )
{
    this.buildContentNav ( item );
};


ContentNav.prototype.buildContentNav = function ( item )
{
    this.clearContentNav();

    // hack to set div width based on array length and button width plus padding.
    this.contentNavWidth = item.items.length * 85;
    this.contentNavDiv = document.getElementById( "contentLinks" );

    for ( var i in item.items )
    {
        var btn = new this.contentNavElement ( item.items[i], this );
        this.contentNavDiv.appendChild( btn.div );
        this.contentNavItems.push ( btn );
    }

    // show first media element
    this.contentNavItems[0].btnOver ();
    this.contentNavItems[0].onClick ();

    // set the width css property so scrolling will work properly.
    $(this.contentNavDiv).css('width', this.contentNavWidth + 'px');

    var updateMousePos = createDelegate(this, this.updateMousePosition );
    var stopScrolling = createDelegate(this, this.stopScrolling );
    var startScrolling = createDelegate(this, this.startScrolling );

    // removes event listeners and re-adds if needed.
    this.contentNavDiv.parentNode.onmousemove = null;
    this.contentNavDiv.parentNode.onmouseout = null;
    this.contentNavDiv.parentNode.onmouseover = null;

    if ( this.contentNavWidth > 700 )
    {
        this.contentNavDiv.parentNode.onmousemove = updateMousePos;
        this.contentNavDiv.parentNode.onmouseout = stopScrolling;
        this.contentNavDiv.parentNode.onmouseover = startScrolling;
        requestAnimFrame( createDelegate( this, this.updateContentNav ), this.contentNavDiv.parentNode );
    }
}

// content nav thumbnail element.
ContentNav.prototype.contentNavElement = function ( _data, site )
{
    this.data = _data;
    this.div = document.createElement( 'div' );
    this.image = document.createElement( 'img' );
    this.image.src = 'content/'+_data.thumb;
    this.div.appendChild( this.image );
    this.div.setAttribute('class','contentNavBtn');

    var that = this;

    this.onClick = function ()
    {
        if ( that !== site.currentNavItem )
        {
            var tempBtn = site.currentNavItem;
            site.currentNavItem = that;

            if ( tempBtn )
            {
                tempBtn.btnOut ();
            }
            site.parent.SiteContent.showItemClicked( that.data );
        }
    };

    this.btnOver = function ()
    {
        TweenLite.to ( that.div,.3, {scaleX:1.3, scaleY:1.3, ease:'Back.easeOut' });
    };

    this.btnOut = function ()
    {
        if ( that !== site.currentNavItem )
        {
            TweenLite.to ( that.div,.3, {scaleX:1, scaleY:1, ease:'Back.easeOut' });
        }
    };

    this.div.onclick = this.onClick;
    this.div.onmouseover = this.btnOver;
    this.div.onmouseout = this.btnOut;
}

// clears previous thumbnails and sets them up for collection.
ContentNav.prototype.clearContentNav = function ()
{
    for ( var i in this.contentNavItems )
    {
        this.contentNavItems[i].div.parentNode.removeChild( this.contentNavItems[i].div );
        this.contentNavItems[i] = null;
    }

    this.contentNavItems = [];
    $( this.contentNavDiv ).css("left", 0 );
};

// Mouse Out
ContentNav.prototype.stopScrolling = function ( event )
{
    event.stopImmediatePropagation();
    this.scroll = false;
};

// Mouse Over
ContentNav.prototype.startScrolling = function ( event )
{
    event.stopImmediatePropagation();
    this.scroll = true;
};

// tracks mouse position and update mouse position values that are used to position thumbs.
ContentNav.prototype.updateMousePosition = function ( event )
{
    event.stopImmediatePropagation();
    this.mousePos.x = event.clientX - this.parent.footerLeft - 190;
    this.mousePos.y = event.clientY;
};

// moves content navigation thumbs based on current mouse position values.
ContentNav.prototype.updateContentNav = function ()
{
    var navWidth = this.contentNavWidth;
    var newX;
    var currentX = $(this.contentNavDiv).position().left;
    var currentY = $(this.contentNavDiv).offset().top;

    if ( this.scroll )
    {
        if ( this.mousePos.x  < 100 && currentX < -20 ) newX = currentX + 20;
        if ( this.mousePos.x  > 600 && currentX > -( navWidth - 700 )) newX = currentX - 20;
        if ( newX > 0 ) newX = 0;
    }
    else
    {
        newX = undefined;
    }

    if ( newX ) TweenLite.to(this.contentNavDiv,.3, {left:Math.round ( newX )});
    requestAnimFrame( createDelegate( this, this.updateContentNav ), this.contentNavDiv.parentNode );
};

/* ==========================================================================
 SITE CONTENT :: IMAGES OR VIDEO THAT LOAD UP BETWEEN THE BRACKETS.
 ========================================================================== */
function SiteContent ( parent )
{
    this.parent = parent;
    this.videoPlayer;
}

SiteContent.prototype.showItemClicked = function ( item )
{
    this.newContentItem = item;
    this.hidePreviousContent();
};

SiteContent.prototype.showItem = function ()
{
    switch ( this.newContentItem.type )
    {
        case "image":
            this.showImage ();
            break;

        case "video":
            this.showMedia ();
            break;
    }
};

SiteContent.prototype.showImage = function ()
{
    if ( !this.newContentItem ) return;

    var contentTarget = document.getElementById( "contentTarget" );
    var image = document.createElement( 'img' );
    image.id = "itemTarget";
    image.onprogress = this.showLoader;
    image.onload = this.showContent.bind ( this );
    image.src = 'content/' + this.newContentItem.src;
    $(image).css({ opacity: 0 });
    contentTarget.appendChild( image );
};

SiteContent.prototype.loadImage = function ( image )
{
    var loader = new XMLHttpRequest();
    loader.onloadstart = "";
    loader.onLoadProgress = "";
    loader.onloadend = "";
}

SiteContent.prototype.showMedia = function ()
{
    console.log ( "SHOWING MEDIA" );

    var that = this;

    var ogv = String ( 'content/' + this.newContentItem.src + '.ogv');
    var mp4 = String ( 'content/' + this.newContentItem.src + '.mp4');
    var webm = String ( 'content/' + this.newContentItem.src + '.webm');
    var poster = String ( 'content/' + this.newContentItem.src + '.jpg');

    // move these values to xml.
    var videoWidth = this.newContentItem.width;
    var videoHeight = this.newContentItem.height;

    var contentTarget = document.getElementById( "contentTarget" );
    var mediaHolder = document.createElement( 'div' );
    mediaHolder.id = 'itemTarget';

    var media = document.createElement( "video" );
    media.id = "videoTarget";
    media.setAttribute('preload', 'auto');
    media.setAttribute('width', videoWidth );
    media.setAttribute('height', videoHeight );

    $(mediaHolder).css({ opacity: 0 });
    mediaHolder.appendChild( media );
    contentTarget.appendChild( mediaHolder );

    that.showContent.bind ( this );

    videojs("videoTarget").ready( function()
    {
        console.log ( "VIDEO READY!" );
        that.videoPlayer = this;
        that.videoPlayer.on ( "error", function ( e ) { console.log ( e ); })
        that.videoPlayer.poster = poster;
        that.videoPlayer.src([
            { type: "video/webm", src: webm },
            { type: "video/mp4", src: mp4 },
            { type: "video/ogg", src: ogv }
        ]);

        that.videoPlayer.play ();
        that.showContent ();
    });
};

// fades out previous content
SiteContent.prototype.hidePreviousContent = function ()
{
    var content = document.getElementById( "itemTarget" );
    if ( content )
    {
        console.log ( "HIDING PREVIOUS CONTENT" );
        var windowWidth = Math.round ( $(window).width() *.5 )-100;
        TweenLite.to( '#rightBracket',.8, {right:windowWidth, delay:.2, ease:'Back.easeOut' });
        TweenLite.to( '#leftBracket',.8, {left:windowWidth, delay:.2, ease:'Back.easeOut' });
        TweenLite.to( content,.8, {alpha:0, onComplete:this.clearPrevContent.bind ( this )});
    }
    else
    {
        this.showItem();
    }
};

// clears and destroys previous content, if video it will dispose and call to show new content.
SiteContent.prototype.clearPrevContent = function ()
{
    var content = document.getElementById( "itemTarget" );
    if ( this.videoPlayer !== undefined )
    {
        this.videoPlayer.dispose ();
        this.videoPlayer = undefined;
    }
    if ( content ) content.parentNode.removeChild ( content );

    this.showItem();
};

// shows content loader, progressive or static.
SiteContent.prototype.showLoader = function ( event )
{
    console.log ( "SHOWING LOADER: " );
    console.log ( event );
};

// shows new content, fades and animates brackets.
SiteContent.prototype.showContent = function ()
{
    var content = document.getElementById( "itemTarget" );
    var windowWidth = $(window).width();
    var contentWidth = $("#itemTarget").width();
    var contentX = Math.round(( windowWidth - contentWidth ) * 0.5 );

    var leftBracketPos = contentX - 100;
    var rightBracketPos = contentX - 100;

    console.log ( "SHOWING CONTENT: " + content );

    this.parent.centerContent();
    TweenLite.to( content, .8, {alpha:1, delay:.2 });
    TweenLite.to( '#rightBracket',.8, {right:rightBracketPos, ease:'Back.easeOut' });
    TweenLite.to( '#leftBracket',.8, {left:leftBracketPos, ease:'Back.easeOut' });
};