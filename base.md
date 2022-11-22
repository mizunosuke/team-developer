---
marp: true
theme: gaia
header: "**G`s Academy** __JS選手権発表会__"
footer: "by **Mizuki Hirae**"
---


<!--
_backgroundColor: white
_class: lead
_color: black
-->

# **タイトル**

### **スーパー家計簿アプリ**

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

# 自分にとって使いやすい家計簿が欲しい！

#### 誰でもつかいやすいなんてことはないですよね

##### こまめな性格ではないので続きません・・・
---

<!--
_backgroundColor: white
_class: lead
-->

# 既存のアプリにおける疑問

## その１

#### クレジットカードで支払いして
#### **今月あと何円使えるか忘れる**
---

<!--
_backgroundColor: white
_class: lead
-->
# 既存のアプリにおける疑問

## その２

#### 家計簿つけてもモチベが上がらない

###### **書くのは支出ばかり**   テンションも上がりません

---
<!--
_backgroundColor: white
-->

# 自分でつくればいい！

### 使用技術

#### 1 React.js

##### ---近年のWebサービスにおいて世界的に圧倒的な導入率を誇る

##### ---**JavaScriptライブラリ**

#### 2 FireBase

##### ---**Googleが提供**

##### ---モバイル・Webアプリケーション向けのプラットフォーム

---
<!--
_backgroundColor: white
_class: lead
-->

# まずはデモアプリ画面をご覧ください


---
<!--
_backgroundColor: white
-->
## こだわりポイント

### 1.月による入力内容の表示・非表示

### firestoreの中から条件指定句である**where,startAt,endAt**を使用

```javascript
      //入力したタイミングを取得して保存(初期値は現在の時間)
    const [ date, setDate ] = useState(new Date());
    //データ取得の開始年月を取得
    const startOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      }
      //uidが一致するデータのみ取得する
      where('uid', '==', currentUser.uid), orderBy('date'), startAt(startOfMonth(date)), endAt(endOfMonth(date));
```

---
<!--
_backgroundColor: white
-->

## こだわりポイント

### 2.認証機能をもたせるため**Authentication**を使用

```javascript
 //サインアップ処理
    const signup = async(email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await onAuthStateChanged(auth, (user)=>{
                setCurrentUser(user);//ステートによるユーザー状態の管理
                console.log(user);
                navigate("/home");//ホーム画面に遷移
            });
            //catch処理は省略
        } 
    };
```

---
<!--
_backgroundColor: white
-->

## こだわりポイント

### 3.収入、支出の金額を**別々の配列**に
###   収支の**合計・残高**を計算

```javascript
//入力金額を保存
    const [ inputAmount, setInputAmount ] = useState();
    //typeがincの内容を配列に保存
    const [ incomeItems, setIncomeItems ] = useState([]);
    //typeがexpの内容を配列に保存
    const [ expenseItems, setExpenseItems ] = useState([]);
    //収入合計(支出も同様)
    const incomeTotalAmount = incomeAmount.reduce(function(sum, element){
        return sum + element;
      }, 0);
```

---
<!--
_backgroundColor: white
_class: lead
-->

# ご清聴ありがとうございました！！
