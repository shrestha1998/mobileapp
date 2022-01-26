"use strict";

window.addEventListener("DOMContentLoaded",
function(){
    //1.localStorageが使えるか確認
    if(typeof localStorage==="undefined"){
        window.alert("このブラウザはLocal Storage昨日が実装されていません");
        return;
    }else{
        viewStorage(); //localStorageからのデータ取得とテーブルを表示
        saveLocalStorage();
        delLocalStorage();
        allClearLocalStorage();
        selectTable();
    }

},false
);

//2.localstorageへの保存
function saveLocalStorage(){
    const save=document.getElementById("save");
    save.addEventListener("click",
        function(e){
            e.preventDefault();
            const key=document.getElementById("textKey").value;
            const value=document.getElementById("textMemo").value;

            if(key=="" || value==""){
                window.alert("Key,Memoはいずれも必須です。");
                return;
            }else{
                let w_confirm=window.confirm("LocalStorageに"+ "\n" + key + " " + value + "\n" +"を保存(save)しますか？");
                //確認ダイアログで「OK」を押されたとき保存するversion-up1.add
                if(w_confirm===true){//version-up1 add
                    localStorage.setItem(key,value);
                    viewStorage();
                    let w_msg="LocalStorageに"+ key + " " + "を保存しました。";
                    window.alert(w_msg);
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                }
            }
        },false
    );
};


//3.localStorageから１件削除
function delLocalStorage(){
    const del=document.getElementById("del");
    del.addEventListener("click",
        function(e){
            e.preventDefault();
            let w_sel="0";
            w_sel = selectCheckBox();
            
               if(w_sel==="1"){
                const key=document.getElementById("textKey").value;
                const value=document.getElementById("textMemo").value;
                let w_confirm=window.confirm("LocalStorageから"+ "\n" + key + " " + value + "\n"+"を削除(delete)しますか？");
            //確認ダイアログで「OK」をおされたら削除する
            if(w_confirm===true){//version-up1 add
                localStorage.removeItem(key);
                viewStorage();
                let w_msg="LocalStorageに"+ key + " " + value + "を削除しました。";
                window.alert(w_msg);
                document.getElementById("textKey").value="";
                document.getElementById("textMemo").value="";
               }
            }
        },false
    );
}

//4.localStorageからすべてを削除する
function allClearLocalStorage(){
    const allClear=document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e){
            e.preventDefault();
            let w_confirm=window.confirm("LocalStorageのデータを全て削除します。\nよろしいですか？");

            if(w_confirm===true){
                localStorage.clear();
                viewStorage();
                let w_msg="LocalStoragのデータを全て削除しました。";
                window.alert(w_msg);
                document.getElementById("textKey").value="";
                document.getElementById("textMemo").value="";
            }
        },false
    );
}
//5.データ選択
function selectTable(){
    const select=document.getElementById("select");
    select.addEventListener("click",
        function(e){
            e.preventDefault();
            selectCheckBox();
        },false
    );
}
//テーブルからデータ選択
function selectCheckBox(){  //version-up2 selectRadiobtn=selectCheckbox
    let w_sel="0";
    let w_cnt=0; //version-up2 add
    const chkbox1=document.getElementsByName("chkbox1"); //version-up2 radio1=chkbox
    const table1=document.getElementById("table1");
    let w_textKey=""; //work version-up2 add
    let w_textMemo=""; //work version-up2 add

    for(let i=0; i<chkbox1.length;i++){ //version-up2 radio1==chkbox
        if(chkbox1[i].checked){ //version-up2 radio1==chkbox
            if(w_cnt === 0){ //version-up2 add 最初にチェックされている行をワークに退避
                w_textKey=table1.rows[i+1].cells[1].firstChild.data; //version-up2 chg document.getElementById.value ==> w_textKey
                w_textMemo=table1.rows[i+1].cells[2].firstChild.data; //version-up2 chg document.getElementById.value ==> w_textKey
                //return w_sel="1"; versionn-up2 del
            }
            w_cnt++; //version-up2 add counts selected checkbox number
        }    
    }
    
    document.getElementById("textKey").value = w_textKey; //version-up2 add
    document.getElementById("textMemo").value = w_textMemo; //version-up2 add
    if(w_cnt === 1){    //version-up2 add
        return w_sel = "1"; //version-up2 add
    }else{  //version-up2 add
        window.alert("1つ選択(select)してください。")   
    }   //version-up2 add
};
        

//localStorageからのテーブルの取得
function viewStorage(){
    const list= document.getElementById("list");
    //htmlのテーブル初期化
    while(list.rows[0])list.deleteRow(0);

    //localStorageすべての情報の取得
    for(let i=0; i <localStorage.length; i++){
        let w_key=localStorage.key(i);

    //local storageすべての情報の取得
    let tr=document.createElement("tr");
    let td1=document.createElement("td");
    let td2=document.createElement("td");
    let td3=document.createElement("td");
    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    td1.innerHTML="<input name='chkbox1' type='checkbox'>"; //version-up2
    td2.innerHTML=w_key;
    td3.innerHTML=localStorage.getItem(w_key);

    }

    //JQueryのplugin tablesorterを使ってテーブルのソート
    //shortlist:引数１…………最初からソートしておく列を指定、引数２…０　昇順、１…降順
    $("#table1").tablesorter({
        sortList:[[1,0]]
    });

    $("#table1").trigger("update");
}