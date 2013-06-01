function SiteModel ()
{
    this.xmlPath = "";
    this.navList = [];
    this.mainNavList = [];
    this.currentItemList = [];
    this.siteItemsObject = {};
    this.xml_data = {};
}


// loads xml only
SiteModel.prototype.loadXmlData = function ()
{
    if (window.XMLHttpRequest)
    {
        xhttp = new XMLHttpRequest();
    }
    else
    {
        // IE 5/6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if ("overrideMimeType" in xhttp)
    {
        xhttp.overrideMimeType("text/xml");
    }

    xhttp.open("GET", this.xmlPath, false);
    xhttp.send(null);

    var xmlDoc = xhttp.responseXML;
    this.parseXmlData( xmlDoc );
}


SiteModel.prototype.parseXmlData = function ( xmlDoc )
{
    this.xml_data = xmlDoc.firstChild.getElementsByTagName("menu");

    var length = this.xml_data.length;
    var menuName;
    var menuId;
    var action;
    var show;
    var audio;
    var items;

    for ( var i = 0; i < length; i++ )
    {
        items = this.xml_data[i].getElementsByTagName("item");
        menuId = this.xml_data[i].getAttribute("menuId");
        menuName = this.xml_data[i].getAttribute("name");
        action = this.xml_data[i].getAttribute("action");
        audio = this.xml_data[i].getAttribute("audio");
        show = this.xml_data[i].getAttribute("show");

        this.siteItemsObject[menuId] = {};
        this.siteItemsObject[menuId].id = menuId;
        this.siteItemsObject[menuId].action = action;
        this.siteItemsObject[menuId].name = menuName;
        this.siteItemsObject[menuId].show = show;
        this.siteItemsObject[menuId].audio = audio;
        this.siteItemsObject[menuId].items = this.createItemList( items );
    }
}


SiteModel.prototype.createItemList = function ( items )
{
    var itemList = [];
    var length = items.length;
    var i = 0;

    for ( ; i < length; i++ )
    {
        var item = new SiteItemVO ();
        item.type = items[i].getAttribute("type");
        item.src = items[i].getAttribute("src");
        item.thumb = items[i].getAttribute("thumb");
        item.width = items[i].getAttribute("width");
        item.height = items[i].getAttribute("height");
        item.itemAction = items[i].getAttribute("action");
        item.itemValue = items[i].getAttribute("value");
        itemList.push ( item );
    }

    return itemList;
}


SiteModel.prototype.getMainNavList = function ()
{
    var mainNav = [];
    for ( var i in this.siteItemsObject)
    {
        mainNav.push ( this.siteItemsObject[i] );
    }

    return mainNav;
}


function SiteItemVO ()
{
    this.itemName;
    this.type;
    this.src;
    this.thumb;
    this.itemAction;
    this.itemValue;
    this.width;
    this.height;
}

