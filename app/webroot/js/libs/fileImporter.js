/**
 * Created by Mustapha on 2/15/2015.
 */

function onScriptLoadComplete(callbck)
{
    callbck();
}

function LoadJsFile(fileName, callBck)
{
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript' ;
    scriptTag.async = false;
    scriptTag.src = fileName;


    scriptTag.onreadystatechange = scriptTag.onload = function(){
        //debugger;
        var state =  scriptTag.readyState;
        if(state == 'complete' || state == undefined) {



            onScriptLoadComplete(callBck);

        }
    }
     //onScriptLoadComplete(callBck);
    var bodyTag = document.body;
    //bodyTag.appendChild(scriptTag);
    document.documentElement.appendChild(scriptTag);

}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function ImportJsFiles(filesArr, callback)
{
    if(Array.isArray(filesArr))
    {
        //debugger;
        var currentFile = undefined;
        if(  (currentFile = filesArr.pop()) != undefined )
        {
            LoadJsFile(currentFile, function(){
                if(filesArr.length > 0)
                    ImportJsFiles(filesArr, callback);
                else if(filesArr.length == 0 && isFunction(callback))
                {
                    callback();
                }

            });
        }

    }
}

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.documentElement.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}
