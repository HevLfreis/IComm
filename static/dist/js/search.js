/**
 * Created by hevlhayt@foxmail.com
 * Date: 2016/3/26
 * Time: 19:44
 */

var map = new BMap.Map("map");
map.setMapStyle({style:'googlelite'});
map.centerAndZoom(new BMap.Point(121.48, 31.22), 14);
map.setCurrentCity("上海");

map.enableScrollWheelZoom(true);

var options = {
    onSearchComplete: function(results){
        if (local.getStatus() == BMAP_STATUS_SUCCESS){
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i ++){
                s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
            }
            document.getElementById("r-result").innerHTML = s.join("<br/>");
        }
    }
};
var local = new BMap.LocalSearch(map, options);
local.search("");