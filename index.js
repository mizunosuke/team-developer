var map;
var marker;
var markers = [];
var infowindow;
var directionsDisplay;
var directionsService;


//initialize関数
function initMap() {
  var latlng = new google.maps.LatLng(35.681382,139.766084);//東京駅

  //表示のオプションを設定
  var myOptions = {
      zoom:14,
      center:latlng,
      mapTypeId:google.maps.MapTypeId.ROADMAP
  };

  //id=mapのhtml要素に地図を表示
  map = new google.maps.Map(document.getElementById("map"),myOptions);

  //ルートをレンダリング
  directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
          //strokeColor: '#FF0000',
          strokeColor: '#1e90ff',
          strokeWeight: 6,
          strokeOpacity: 0.9
      }
  });

  //レンダリングする地図を指定
  directionsDisplay.setMap(map);
}

//ルートを検索する関数
function searchRoute() {
  //スタート地点とゴール地点の文字列を取得
  var start = document.getElementById("selectStart").value;
  var end = document.getElementById("selectEnd").value;

  //レンダリングのオプション設定
  var rendererOptions = {
      //ドラッグ可能
      draggable: true,
      preserveViewport:false
  };

  //新しいインスタンスを作成
  directionsService = new google.maps.DirectionsService();
  //インスタンス作成時の設定・開始地点やゴール地点など
  var request = {
      origin: start,
      destination: end,
      waypoints: [{
        location: "下関市"
      },{
        location: "岩国市"
      }],
      travelMode: google.maps.DirectionsTravelMode.DRIVING, // 自動車でのルート
      unitSystem: google.maps.DirectionsUnitSystem.METRIC, // 単位km表示
      optimizeWaypoints: true, // 最適化された最短距離にする
      avoidHighways: true, // 高速道路を除外
      avoidTolls: true // 有料道路を除外
  };

  //route関数の呼び出し
  directionsService.route(request, function(response, status){
      if (status == google.maps.DirectionsStatus.OK){
        console.log(response);
        console.log(status);
          directionsDisplay.setDirections(response);
          directionsDisplay.setPanel(document.getElementById("directionsPanel"));
      }
      // overview_pathを表示する
      for (var i = 0; i < response.routes.length; i++) {
          var r = response.routes[i];
          for (var j = 0; j < r.overview_path.length; j++) {
              var latlng = r.overview_path[j];
              marker = new google.maps.Marker({
                  position: latlng,
                  icon: pinImage_red,
                  map: map
              });
              markers.push(marker);
          }
      }
  });
  map = new google.maps.Map(document.getElementById("map"),response);
  directionsDisplay.setMap(map);
}


//検索ボタンを押してルートを検索
$("#btn").on("click",(e) => {
  e.preventDefault();
  searchRoute();
})


window.initMap = initMap;