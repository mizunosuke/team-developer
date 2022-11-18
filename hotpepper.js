
$('#btn').on('click', function (e) {
    e.preventDefault();
    const txtSearch = $('#txtSearch').val();
    const genreSearch = $('#foodGenre').val();
    // key=bb80428ae528710b    &genre=G005
    const url = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=bb80428ae528710b&address=${txtSearch}&range=5&order=4&genre=${genreSearch}&format=json`;

    axios.get(url)
        .then(function (response) {
            console.log(response.data.results.shop[0]);
            const data = response.data.results.shop;

            const htmlElements = [];
            const LatLng = [];
            for (let i = 0; i < 4; i++) {
                // $("#btn").on("click", function () {
                htmlElements.push(`
                        <div><p id="show-results">${data[i].name}</p></div>
                        <div><p id="show-results">${data[i].access}</p></div>
                        <div><p id="show-results">${data[i].address}</p></div>
                        <div><p id="show-results">${data[i].lat}</p></div>
                        <div><p id="show-results">${data[i].lng}</p></div>
                        `);
                const latlng = { lat: data[i].lat, lng: data[i].lng };
                LatLng.push(latlng);
            };
            console.log(LatLng);
            // console.log(htmlElements);
            $('#result').html(htmlElements);

            const logLat = [];
            for (let i = 0; i < 3; i++) {
                logLat.push(`
                        <div><p id="show-results">${data.lng}</p></div>
                        <div><p id="show-results">${data.lat}</p></div>
                        `);
            };
            console.log(logLat);

        });
})
//ジャンルを見る genre
const url = `http://webservice.recruit.co.jp/hotpepper/genre/v1/?key=bb80428ae528710b&format=json`;

axios.get(url)
    .then(function (response) {
        console.log(response.data.results.genre);
    });

