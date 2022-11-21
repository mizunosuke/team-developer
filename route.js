var map;
var marker;
var markers = [];
var infowindow;
var directionsDisplay;
var directionsService;
var service;
let placeData = [];



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



//------------ホットペッパーから緯度経度をとってくる関数------------
async function getHotpepperData() {
  const txtSearch = $('#locationSearch').val();
  const genreSearch = $('#foodGenre').val();
  const hot_url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=bb80428ae528710b&address=${txtSearch}&range=5&order=4&genre=${genreSearch}&format=json`;

  let getData = await axios.get(hot_url);
  console.log(getData.data.results.shop);
  let shopData = getData.data.results.shop;

  //ホットペッパーから取ってきたデータのうちランダムに2つの緯度経度を取得
  const startNum = Math.floor(Math.random()*5);
  const endNum = Math.floor(Math.random()*4 + 5);

  //スタート地点の緯度経度
  const startShopLatLng = {
    lat: shopData[startNum].lat,
    lng: shopData[startNum].lng
  };

  //終了地点の緯度経度
  const endShopLatLng = {
    lat: shopData[endNum].lat,
    lng: shopData[endNum].lng
  };

  console.log(startShopLatLng,endShopLatLng);
  //２件のお店の緯度経度を１つにまとめる
  const shopLatLngData = {
    start: startShopLatLng,
    end: endShopLatLng
  };


  //取得したランダム２件のお店の表示
  // console.log(shopData[startNum],shopData[endNum]);
  const startShop = shopData[startNum];
  const startShopData = {
    name: startShop.name,
    access: startShop.access,
    address: startShop.address,
    budget: startShop.budget,
    card: startShop.card,
    coupon: startShop.coupon_urls,
    url: startShop.urls
  };
  console.log(startShopData);

  const endShop = shopData[endNum];
  const endShopData = {
    name: endShop.name,
    access: endShop.access,
    address: endShop.address,
    budget: endShop.budget,
    card: endShop.card,
    coupon: endShop.coupon_urls,
    url: endShop.urls
  };
  console.log(endShopData);

  //２件のお店のデータを１つにまとめる
  const twoShopData = {
    start: startShopData,
    end: endShopData
  };

  //緯度経度とお店の情報を１つにまとめる
  const allShopData = {
    latlng: shopLatLngData,
    shops: twoShopData
  };

  return allShopData; 
}




//------------GooglePlacesAPIから緯度経度をとってくる関数------------
async function getPlacesData() {
  //inputタグから入力された内容を取得
  const searchText = $("#locationSearch").val();
  const txtSearch = $('#placeSearch').val();
  const inputText = searchText + " " + txtSearch;
  const place_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Cgeometry&input=${inputText}&inputtype=textquery&key=AIzaSyBv1jCDYdaz7X9RIr4EsBa2Y2FKFEzJZqE`;

  //APIにリクエスト
  let placeData = await axios.get(place_url);
  console.log(placeData);
  console.log(placeData.data.candidates[0].geometry.location);
  //施設情報を取得
  const allPlaceData = {
    name: placeData.data.candidates[0].name,
    address: placeData.data.candidates[0].formatted_address,
    rating: placeData.data.candidates[0].rating,
    placeLatLng: placeData.data.candidates[0].geometry.location,
  };

  return allPlaceData;
}





//--------------------ルートを検索する関数--------------------
function searchRoute(shop,place) {

  //スタート地点の緯度経度をoriginに設定
  const startLatLng = shop.latlng.start;
  //ゴール地点の緯度経度をdestinationに設定
  const endLatLng = shop.latlng.end;
 
  //経由地点の緯度経度をwatpointsに指定
  console.log(place);
  var pointsLatLng = new google.maps.LatLng(place.placeLatLng.lat,place.placeLatLng.lng);//経由地点の緯度経度

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
      origin: startLatLng,
      destination: endLatLng,
      waypoints: [{
        location:pointsLatLng
      }],
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


//検索ボタンクリックで発火
$('#btn').on('click', async function(e) {
  e.preventDefault();

  //hotpepperAPIからデータを取得する関数
  let shopData = await getHotpepperData();
  console.log(shopData);

  //HTMLに変換するためにホットペッパーのお店情報を配列に追加
  const shopArr = new Array(shopData);
  console.log(shopArr);
  //1件目の情報を追加
  const starthtmlElem = [];
  for(let i =0; i < shopArr.length; i++){
    starthtmlElem.push(`
    <h2>A : ${shopArr[i].shops.start.name}<h2>
    <p>${shopArr[i].shops.start.access}</p>
    <p>${shopArr[i].shops.start.address}</p>
    <p>平均予算 : ${shopArr[i].shops.start.budget.name}</p>
    <p>クレジットカード利用 : ${shopArr[i].shops.start.card}</p>
    <p><a href="${shopArr[i].shops.start.coupon.pc}">クーポンを獲得する</a></p>
    <p><a href="${shopArr[i].shops.start.url.pc}">ホームページへ</a></p>
    `);
  }
  $("#route-each-a").html(starthtmlElem);

  //2件目の情報を追加
  const endhtmlElem = [];
  for(let i =0; i < shopArr.length; i++){
    endhtmlElem.push(`
    <h2>C : ${shopArr[i].shops.end.name}<h2>
    <p>${shopArr[i].shops.end.access}</p>
    <p>${shopArr[i].shops.end.address}</p>
    <p>平均予算 : ${shopArr[i].shops.end.budget.name}</p>
    <p>クレジットカード利用 : ${shopArr[i].shops.end.card}</p>
    <p><a href="${shopArr[i].shops.end.coupon.pc}">クーポンを獲得する</a></p>
    <p><a href="${shopArr[i].shops.end.url.pc}">ホームページへ</a></p>
    `);
  }
  $("#route-each-c").html(endhtmlElem);

  //placesAPIからデータを取得してくる関数
  let placeData = await getPlacesData();

  //GooglePlacesのデータを追加、表示
  const wayPointsElm = [];
  for(let i =0; i < shopArr.length; i++){
    wayPointsElm.push(`
    <h2>B : ${placeData.name}<h2>
    <p>住所 : ${placeData.address}</p>
    <p>評価 : ${placeData.rating}</p>
    `);
  };

  $("#route-each-b").html(wayPointsElm);

  //上記２つをもとにルート計算、描画を行う関数
  searchRoute(shopData,placeData);

})


