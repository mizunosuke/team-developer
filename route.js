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
    var latlng = new google.maps.LatLng(35.681382, 139.766084);//東京駅


    //表示のオプションを設定
    var myOptions = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //id=mapのhtml要素に地図を表示
    map = new google.maps.Map(document.getElementById("map"), myOptions);


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
    const locationSearch = $('#locationSearch').val();
    const genreSearch = $('#foodGenre').val();
    const hot_url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=bb80428ae528710b&address=${locationSearch}&range=5&order=4&genre=${genreSearch}&format=json`;

    let getData = await axios.get(hot_url);
    console.log(getData.data.results.shop);
    let shopData = getData.data.results.shop;

    //ホットペッパーから取ってきたデータのうちランダムに2つの緯度経度を取得
    const startNum = Math.floor(Math.random() * 5);
    const endNum = Math.floor(Math.random() * 4 + 5);

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

    console.log(startShopLatLng, endShopLatLng);
    const shopLatLngData = {
        start: startShopLatLng,
        end: endShopLatLng
    };

    return shopLatLngData;

}



//------------GooglePlacesAPIから緯度経度をとってくる関数------------
async function getPlacesData() {
    //inputタグから入力された内容を取得
    const placeSearch = $("#placeSearch").val();
    const locationSearch = $('#locationSearch').val();
    const inputText = placeSearch + " " + locationSearch;
    const place_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${inputText}&inputtype=textquery&key=AIzaSyBv1jCDYdaz7X9RIr4EsBa2Y2FKFEzJZqE`;

    //APIにリクエスト
    let placeData = await axios.get(place_url);
    console.log(placeData);
    console.log(placeData.data.candidates[0].geometry.location);
    //施設に緯度経度を取得
    let placeLatLng = placeData.data.candidates[0].geometry.location;

    return placeLatLng;
}





//------------ルートを検索する関数------------
function searchRoute(shop, place) {

    //スタート地点の緯度経度をoriginに設定
    const startLatLng = shop.start;
    //ゴール地点の緯度経度をdestinationに設定
    const endLatLng = shop.end;

    //経由地点の緯度経度をwatpointsに指定
    console.log(place);
    var pointsLatLng = new google.maps.LatLng(place.lat, place.lng);//東京駅

    //レンダリングのオプション設定
    var rendererOptions = {
        //ドラッグ可能
        draggable: true,
        preserveViewport: false
    };

    //新しいインスタンスを作成
    directionsService = new google.maps.DirectionsService();
    //インスタンス作成時の設定・開始地点やゴール地点など
    var request = {
        origin: startLatLng,
        destination: endLatLng,
        waypoints: [{
            location: pointsLatLng
        }],
        travelMode: google.maps.DirectionsTravelMode.WALKING, // 自動車でのルート
        // unitSystem: google.maps.DirectionsUnitSystem.METRIC, // 単位km表示
        optimizeWaypoints: true, // 最適化された最短距離にする
        avoidHighways: true, // 高速道路を除外
        avoidTolls: true // 有料道路を除外
    };

    //route関数の呼び出し
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
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
    map = new google.maps.Map(document.getElementById("map"), response);
    directionsDisplay.setMap(map);
}



window.initMap = initMap;


//検索ボタンクリックで発火
$('#btn').on('click', async function (e) {
    e.preventDefault();

    //hotpepperAPIからデータを取得する関数
    let shopLatLng = await getHotpepperData();

    //placesAPIからデータを取得してくる関数
    let placeLatLng = await getPlacesData();

    //上記２つをもとにルート計算、描画を行う関数
    searchRoute(shopLatLng, placeLatLng);

})


//   const place_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&key=AIzaSyBv1jCDYdaz7X9RIr4EsBa2Y2FKFEzJZqE";


//   axios.get(place_url)
//   .then((res) => {
//     console.log(res.data.candidates[0].geometry.location);
//     const placeLatLng = res.data.candidates[0].geometry.location;
//     placeData.push(placeLatLng);
//     console.log(placeData);
//   });

//   //ホットペッパーにリクエストを送る
//   axios.get(hot_url)
//       .then(function (response) {
//           console.log(response.data.results.shop);
//           const data = response.data.results.shop;
//           return data;
//       })
//       .then((res) => {
//         //ホットペッパーから取ってきたデータのうちランダムに2つの緯度経度を取得してlatlng配列に追加
//         const startNum = Math.floor(Math.random()*5);
//         const endNum = Math.floor(Math.random()*5 + 5);
//         console.log(res);
//         //緯度経度のセットをオブジェクトとして配列に追加
//         const latlng = [{
//           lat: res[startNum].lat,
//           lng: res[startNum].lng
//         },{
//           lat: res[endNum].lat,
//           lng: res[endNum].lng
//         }];

//         console.log(latlng);
//         return latlng;
//       })
//       .then((res) => {
//         console.log(res);
//         //ホットペッパーの緯度経度の情報
//         const hotpepper_res = res;
//         return hotpepper_res;
//       })
//       .then((res) => {
//         const hotpepper_res = res;

//       })
//       .then((res) => {
//         console.log(res);
//         searchRoute(res.hotpepper,res.placeData);
//       });


// モーダルウィンドウのJS
$(function () {
    // 変数に要素を入れる
    var open = $('.modal-open'),
        close = $('.modal-close'),
        container = $('.modal-container');

    //開くボタンをクリックしたらモーダルを表示する
    open.on('click', function () {
        container.addClass('active');
        return false;
    });

    //閉じるボタンをクリックしたらモーダルを閉じる
    close.on('click', function () {
        container.removeClass('active');
    });

    //モーダルの外側をクリックしたらモーダルを閉じる
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.modal-body').length) {
            container.removeClass('active');
        }
    });
});





