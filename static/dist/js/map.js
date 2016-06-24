/**
 * Created by hevlhayt@foxmail.com
 * Date: 2016/3/22
 * Time: 15:33
 */


function getInfo(pt) {

    //
    $('#info-panel').hide();
    $('#about-panel').hide();
    $('#spin').show();

    $('#pie').empty();
    $('#chart').empty();
    $.getJSON('/preinfo/?lng='+pt.lng+'&lat='+pt.lat,function(result) {

        console.log(result.stat);
        var circle;
        var opts = {
            position : pt,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(90, -65)    //设置文本偏移量
        };

        if (!result.space) {

            circle = new BMap.Circle(pt,1000,{strokeColor:"blue", strokeWeight:4, strokeOpacity:0.6});
            var label = new BMap.Label("工作区</br>"+'<p class="tip" style="font-size: 15px;line-height: 20px">工作日最大人流量: '+result.max15+"</br>" +
                "双休日最大人流量: "+result.max67+"</p>", opts);
        }

        else {
            circle = new BMap.Circle(pt,1000,{strokeColor:"green", strokeWeight:4, strokeOpacity:0.6});
            var label = new BMap.Label("生活区</br>"+'<p style="font-size: 15px;line-height: 20px">工作日最大人流量: '+result.max15+"</br>" +
                "双休日最大人流量: "+result.max67+"</p>", opts);
        }




        label.setStyle({
            color : "white",
            border: "3px solid white",
            //borderRadius: "15%",
            padding: "10px",
            fontSize : "20px",
            //height : "0px",
            //lineHeight : "10px",
            fontFamily:"微软雅黑",
            backgroundColor: "#38363A"

        });
        map.addOverlay(label);
        //map.addOverlay(marker);
        map.addOverlay(circle);
    });


    $.getJSON('/info/?lng='+pt.lng+'&lat='+pt.lat,function(result) {

        //console.log(result.stat);
        var i = 0;
        $.each(result.sug, function (k, v) {
            if(v != 0) {
                var sclass = "badge bg-green";
                if (v > 30) sclass = "badge bg-red";
                if (v >= 99) v = '99+';
                $('#suggest').find("#"+k).delay(200*i).fadeIn('slow').find("span").attr("class", sclass).text(v);
                i++;
            }
        });

        if (infoPanelHide) {
            $('#info-panel').show();
            $('#about-panel').hide();
        }
        $('#spin').hide();
        pie(result.people);
        chart(result.kw);

        //console.log(result.stat);
        dateLine(result.stat);
        //
        //console.log($('#info-panel').width() / 4);
        //console.log($('#info-panel').width());

        $('.btn-app').css('min-width', $('#info-panel').width() / 5.2);



    });


}

var colors = ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"];


function pie(r) {

    $('#pie').highcharts({
        chart: {
            width: $('#info-panel').width(),
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            style: {
                fontFamily: '微软雅黑'
            }
        },
        title :{
            text:null
        },
        colors: colors,

        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                title: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '百分比',
            data: [
                ['其他', r[2]],
                ['工作', r[1]],
                {
                    name: '常住',
                    y: r[0],
                    sliced: true,
                    selected: true
                },

            ]
        }]
    });
}

function chart(d) {


    var cat = [];
    var data = [];
    var i = 0;
    $.each(d, function (k, v) {
        cat.push(k);
        data.push({name: k, value:v, colorValue: v});
        i++;
    });
    //console.log(cat);
    //console.log(data);

    $('#chart').highcharts({
        colorAxis: {
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[4]
        },

        chart: {
            width: $('#pie').width(),
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            style: {
                fontFamily: '微软雅黑'
            }
        },


        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: data
        }],
        title: {
            text: '想法流分布'
        },
        credits: {
            enabled: false
        },
    });
}


function dateLine(d){

    var daydata = [];
    var hourdata = [];

    var hourcat = [];
    //for (var i = 0;i < 24; i++) hourcat.push(String.valueOf(i));

    $.each(d, function(i , ele) {

        if (ele == 0) {
            //daydata.push({
            //    name: "May "+i,
            //    y: 0,
            //    //drilldown: i
            //});
        }

        else {
            daydata.push({
                name: "5."+i,
                y: parseInt(ele.aver),
                drilldown: i,

            });
            var dataofhour= [];
            ele.hour.forEach(function(i2, ele2) {
                //console.log(i2, ele2);
                if (parseInt(i2) !=0)
                    dataofhour.push([ele2+':00', parseInt(i2)]);

            });
            hourdata.push({
                name: '流量',
                id: i,
                data: dataofhour,

            })
        }



    });

    //console.log(daydata, hourdata);

    // Create the chart
    $('#degree-body').highcharts({
        lang: {
            drillUpText: '返回'
        },

        title: {
            text: "社区人流量",
        },
        chart: {
            type: 'column',
            width: 750,
            style: {
                fontFamily: '微软雅黑'
            }
        },
        colors: colors,

        legend: {
            enabled: false
        },
        xAxis: {
            title:{
                text:'时间',
                //align: 'high',
            },


            categories: []
        },


        yAxis: {
            min: 0,
            title:{
                text: null
            },
            labels: {

                overflow: 'justify'
            }
        },
        series: [{
            name: '流量',

            colorByPoint: true,
            data: daydata
        },
            //    {
            //    name: 'Max People',
            //    type: 'spline',
            //    data: daydata
            //}
        ],
        drilldown: {
            series: hourdata
        },
        credits: {
            enabled: false
        },

    });

}


function create_map(){
    map = new BMap.Map("map", {minZoom:11,maxZoom:16,enableMapClick:false});    // 创建Map实例
    map.setMapStyle({style:'googlelite'});
    map.centerAndZoom(new BMap.Point(121.48, 31.22), 14);  // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的

    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放


    var geoc = new BMap.Geocoder();

    map.addEventListener("click", function(e){

        $('#suggest').find("div").each(function(){
            $(this).hide();
        });



        var pt = e.point;
        geoc.getLocation(pt, function(rs){

            map.clearOverlays();
            var addComp = rs.addressComponents;
            $("#info-title").text(addComp.city + ", " + addComp.district + ", " + addComp.street);
            //var marker = new BMap.Marker(pt);
            getInfo(pt);
        });
    });
}

var map = null;
var infoPanelHide = true;

create_map();


$('#people').click(function() {
    $('#pie').show();
    $('#chart').hide();
});
$('#ideas').click(function() {
    $('#chart').show();
    $('#pie').hide();
});

$('#reset').click(function() {
    create_map();
});

$('#search').on('show.bs.modal', function (e) {
    $(this).find('.modal-dialog').css({
        'margin-top': function () {
            var modalHeight = $('#search').find('.modal-dialog').height();
            return ($(window).height() / 2.8 - (modalHeight / 2));
        }
    });

});

$('#degree').on('show.bs.modal', function (e) {
    $(this).find('.modal-dialog').css({
        'margin-top': function () {
            var modalHeight = $('#degree').find('.modal-dialog').height();
            return ($(window).height() / 6 - (modalHeight / 2));
        }
    });

});




$('#stations').click(function() {
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        var points = [];  // 添加海量点数据
        $.getJSON('/stations',function(result) {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            $.each(result, function (k, v) {
                if (v != null)
                //pointArr.push(new BMap.Point(parseFloat(v[1]), parseFloat(v[0])));

                //console.debug(k+" "+v[0]+" "+v[1]);
                    points.push(new BMap.Point(parseFloat(v[0]), parseFloat(v[1])));
            });

            //console.log(points.length);


            var options = {
                size: BMAP_POINT_SIZE_SMALL,
                shape: BMAP_POINT_SHAPE_WATERDROP,
                color: '#d340c3'
            };
            var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
            //pointCollection.addEventListener('click', function (e) {
            //    alert(e.point.lng + ',' + e.point.lat);  // 监听点击事件
            //});
            map.addOverlay(pointCollection);  // 添加Overlay
        });

    } else {
        alert('请使用chrome、safari、IE8+以上浏览器');
    }
});

$('#refresh').click(function() {
    console.log('refresh');
    window.parent.location.reload();
});


$('#about').click(function() {
    map.clearOverlays();
    $('#info-title').text("关于");
    $('#about-panel').show();
    $('#info-panel').hide();
});


function searchlocation(e) {
    map.clearOverlays();
    var options = {
        onSearchComplete: function(results){
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
                var i = 0;
                var point = new BMap.Point(results.getPoi(i).point.lng, results.getPoi(i).point.lat);
                map.centerAndZoom(point, 15);
                var marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                $("#info-title").text(results.getPoi(i).title);
                getInfo(point);
            }
        }
    };

    $("#search").modal("hide");
    var local = new BMap.LocalSearch(map, options);

    local.search(e);

}

$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        searchlocation($('input').val());
    }
});


$('#go').click(function() {
    searchlocation($('input').val());
});





