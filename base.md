---
marp: true
theme: gaia
header: "**G`s Academy** __JS選手権発表会__"
footer: "**developed by とっぷおぶざわーるど**"
---


<!--
_backgroundColor: white
_class: lead
_color: black
-->

# **Enjoy Route Map**

### お出かけルートをお手軽に作成！

![bg blur:6px opacity:0.47](./src/images/background.jpg)

---
<!--
_backgroundColor: white
-->

# チームメンバー紹介

## とっぷおぶざわーるど

### おにっち

### すーさん

### ひらえみずき


---
<!--
_backgroundColor: white
_class: lead
-->

# 突然ですが
---
<!--
_backgroundColor: white
_class: lead
-->
# 行きたい場所がなくて

# 困ったことはありませんか？
---

<!--
_backgroundColor: white
_class: lead
-->
# 今日1日おでかけしたいけど

# どこに出かけようか

---
<!--
_backgroundColor: white
_class: lead 
-->

# 家族と過ごす週末は

# どこに行こうか

---
<!--
_backgroundColor: white
_class: lead
-->

# 恋人とのデートコースは

# どこに行こうか


---
<!--
_backgroundColor: white
_class: lead
-->
# 私たちのアプリなら

# そんな悩みを解決することができます

---
<!--
_backgroundColor: white
_class: lead
-->

## サービス名

# **Enjoy Route Map**

### ルートを自動で検索し、おすすめのコースを提案することが可能なアプリです

---
<!--
_backgroundColor: white
-->

# 使用技術

## --**HotPepperAPI(ホットペッパーAPI)**

##### 大手グルメ店紹介サイトが提供する**店舗情報を掲載したAPI**

## --**Google Map API**

##### Googleが提供する位置情報取得API

##### **位置情報**の他にも、**施設情報**や**ルート検索/表示**など提供する機能は多岐にわたる



---
<!--
_backgroundColor: white
_class: lead
-->

# デモ動画をご覧ください

---
<!--
_backgroundColor: white
_class: lead
-->

# 開発にあたってこだわったポイント
---
<!--
_backgroundColor: white
-->

# 1.各APIからデータを取得、表示までの順序を考慮

```javascript
//ホットペッパーからデータを取得
let shopData = await getHotpepperData();
//GoogleMapからデータを取得
let placeData = await getPlacesData();
//それぞれのデータをルート検索用の関数に渡す
let traveldata = await searchRoute(shopData,placeData);
```
#### async/awaitを使用してホットペッパー、GoogleMapから

#### 取得したデータをルート検索する関数に渡すことを実現
___
<!--
_backgroundColor: white
-->
# 2.ルートパターンを複数作成するためAPIで取得したデータをランダムに

```javascript
  //ホットペッパーから取ってきたデータのうちランダムに2つの緯度経度を取得
  const startNum = Math.floor(Math.random()*5);
  const endNum = Math.floor(Math.random()*4 + 5);
  //設定した乱数をデータ配列のインデックス番号として使用
  const startShopLatLng = {
    lat: shopData[startNum].lat,
    lng: shopData[startNum].lng
  };
  //終了地点も同様
```
___
<!--
_backgroundColor: white
-->

# 3.オプションタグを条件によって動的に生成

```javascript
//配列で用意した地域名を取り出して生成
for (var i = 0; i < smallArea.length; i++) {
    option = '<option id="selectedSmallArea" value="'
    + smallArea[i] + '">' + smallArea[i] + '</option>';
    $('#child').append(option);
}
else { //valueに何も値が入っていない場合
        $('#child').html(noValue); //noValue変数でhtml要素を空にしてある
    }
```
---
<!--
_backgroundColor: white
_class: lead
-->
# 以上

# ご清聴ありがとうございました！