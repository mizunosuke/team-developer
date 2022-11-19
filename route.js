var map;
var marker;
var markers = [];
var infowindow;
var directionsDisplay;
var directionsService;
var service;


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

//-----Google Places API------
function searchPlaces() {

  const inputText = $("#input").val();
  //検索する場所のクエリ
  var request = {
    //地名、住所、カテゴリ
    query: inputText,
    fields: ["name", "geometry", "formatted_address", "business_status", "place_id", "types"],
  };

  //変数serviceにinitMapで作成されたmapインスタンスを使用するインスタンスを代入
  var service = new google.maps.places.PlacesService(map);


  const placeArr = [];
  //クエリをもとに検索結果を取得(戻り値なし/１件のみ)
   service.findPlaceFromQuery(request, function(results, status) {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);
      map.setCenter(results[0].geometry.location);
      placeArr.push(results);
    }
  });

  console.log(placeArr);

  //情報ウィンドウのインスタンスの生成（後でマーカーに紐付け）
  var infowindow = new google.maps.InfoWindow();

  //PlacesService のインスタンスの生成（引数に map を指定）
  var service = new google.maps.places.PlacesService(map);

  if (!navigator.geolocation) {
      //情報ウィンドウの位置をマップの中心位置に指定
      infowindow.setPosition(map.getCenter());
      //情報ウィンドウのコンテンツを設定
      infowindow.setContent;
      //情報ウィンドウを表示
      infowindow.open(map);
  }

  return placeArr;
}

//ルートを検索する関数
function searchRoute(latlng) {

  console.log(latlng[0].lat,latlng[0].lng,latlng[1].lat,latlng[1].lng)
  //スタート地点とゴール地点の文字列を取得
  var latlng_start = new google.maps.LatLng(latlng[0].lat,latlng[0].lng);
  var latlng_end = new google.maps.LatLng(latlng[1].lat,latlng[1].lng);
  

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
      origin: latlng_start,
      destination: latlng_end,
      // waypoints: [{
      //   location: "下関市"
      // },{
      //   location: "岩国市"
      // }],
      travelMode: google.maps.DirectionsTravelMode.WALKING, // 自動車でのルート
      // unitSystem: google.maps.DirectionsUnitSystem.METRIC, // 単位km表示
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



window.initMap = initMap;


//hotpepper API
$('#btn').on('click', function (e) {
  e.preventDefault();
  const txtSearch = $('#txtSearch').val();
  const genreSearch = $('#foodGenre').val();
  // key=bb80428ae528710b    &genre=G005
  const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=bb80428ae528710b&address=${txtSearch}&range=5&order=4&genre=${genreSearch}&format=json`;

  axios.get(url)
      .then(function (response) {
          console.log(response.data.results.shop);
          const data = response.data.results.shop;

          //ブラウザに検索結果を表示
          // const htmlElements = [];
          // const LatLng = [];
          // for (let i = 0; i < 4; i++) {
          //     // $("#btn").on("click", function () {
          //     htmlElements.push(`
          //             <div><p id="show-results">${data[i].name}</p></div>
          //             <div><p id="show-results">${data[i].access}</p></div>
          //             <div><p id="show-results">${data[i].address}</p></div>
          //             <div><p id="show-results">${data[i].lat}</p></div>
          //             <div><p id="show-results">${data[i].lng}</p></div>
          //             `);
          //     const latlng = { lat: data[i].lat, lng: data[i].lng };
          //     LatLng.push(latlng);
          // };
          // console.log(LatLng);
          // // console.log(htmlElements);
          // $('#result').html(htmlElements);

          // const logLat = [];
          // for (let i = 0; i < 3; i++) {
          //     logLat.push(`
          //             <div><p id="show-results">${data.lng}</p></div>
          //             <div><p id="show-results">${data.lat}</p></div>
          //             `);
          // };
          // console.log(logLat);
          return data;
      })
      .then((res) => {
        //ホットペッパーから取ってきたデータのうちランダムに2つの緯度経度を取得してlatlng配列に追加
        const startNum = Math.floor(Math.random()*5);
        const endNum = Math.floor(Math.random()*5 + 5);
        console.log(res);
        const latlng = [{
          lat: res[startNum].lat,
          lng: res[startNum].lng
        },{
          lat: res[endNum].lat,
          lng: res[endNum].lng
        }];

        
        let getPlaceParams = searchPlaces();
        console.log(latlng);

        return {
          latlng: latlng,
          placeParams: getPlaceParams,
        };
      })
      .then((res) => {
        console.log(res);
        let hotpepper_latlng = res.latlng;
        let places_latlng = res.placeParams;
        console.log(hotpepper_latlng,places_latlng);
        searchRoute(hotpepper_latlng)
      });
})

//ジャンルを見る genre
// const url = `http://webservice.recruit.co.jp/hotpepper/genre/v1/?key=bb80428ae528710b&format=json`;

// axios.get(url)
//   .then(function (response) {
//       console.log(response.data.results.genre);
//   });