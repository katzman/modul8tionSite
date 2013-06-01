$(document).ready(function ()
{
    var detect = new DeviceDetect(),
        isMobile = detect.DetectMobileLong(),
        isTablet = detect.DetectTierTablet();

    // Sets Model.
    var model = new SiteModel();
    model.xmlPath = "content/data/mainData.xml";
    model.loadXmlData();

    // sets site view
    var siteView = new SiteView();
    siteView.navList = model.getMainNavList();
    siteView.init();

    function resizePage ()
    {
        siteView.updateView();
    }
    // updates view elements based on window size.
    window.onresize = resizePage;
});