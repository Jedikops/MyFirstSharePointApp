'use strict';

$(document).ready(function () {

    var hostweburl;
    var appweburl;

    //The SharePoint site where the App is installed
    hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    //The location within the site where the App will be deployed
    appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));

    // resources are in URLs in the form: web_url/_layouts/15/resource
    var scriptbase = hostweburl + "/_layouts/15/";
    $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);

    // Use cross-domain library to interact with more than one domain
    //in your remote add-in page through a proxy
    function execCrossDomainRequest() {
        var executor = new SP.RequestExecutor(appweburl);
    }

    $("#showButton").click(function () {

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync(
            {
                url: appweburl + "/_api/SP.AppContextSite(@target)/web/GetFolderByServerRelativeUrl('SitePages')/Files?@target='"
                    + hostweburl + "'",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: successHandler,
                error: errorHandler
            }
        );

    });
    

});


function successHandler(data) {

    var jsonObject = JSON.parse(data.body);
    var moviesHTML = "";
    var results = jsonObject.d.results;
    for (var i = 0; i < results.length; i++) {
        moviesHTML = moviesHTML + "<p><h3>" + results[i].Name + "</p><hr>";
    }

    document.getElementById("resultsDiv").innerHTML = moviesHTML;
}

function errorHandler(error) {
    $("#resultsDiv").append(error.statusText)
}

function getQueryStringParameter(paramToRetrieve) {
    var params =
    document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}