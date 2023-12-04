//console.log('suc');
const api_path = "floratest1";
const token = '3TDUgyuJE9OgxBHnfpkAdpYwygM2';


//撈到全部訂單的清單 init()包含render()
//dom
const orderPageList = document.querySelector('.orderPage-list')
init()

function init(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    headers: {
      'Authorization': token
    }
  }).then(function(response){
   // console.log(response.data.orders);
    let data = response.data.orders;
    render(data)

});
};

function render(data){
    let str = `<section class="wrap orderPage-list">
    <a href="#" class="discardAllBtn">清除全部訂單</a>
    <div class="orderTableWrap">
        <table class="orderPage-table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>聯絡人</th>
                    <th>聯絡地址</th>
                    <th>電子郵件</th>
                    <th>訂單品項</th>
                    <th>訂單日期</th>
                    <th>訂單狀態</th>
                    <th>操作</th>
                </tr>
            </thead>`;

    data.forEach((item) => {
        //訂單是否處理
        if(item.paid == false){
            item.paid = '未處理'
        }else{
            item.paid = '已處理'
        };
        //訂單項目
    //    console.log(item.products);
        let order = item.products;
        let orderProduct = '';
        order.forEach((item)=>{
            orderProduct += `${item.title}<br>`;
        });
    //    console.log(orderProduct);

        str += `<tr>
        <td>${item.createdAt}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${orderProduct}</p>
        </td>
        <td>2021/03/08</td>
        <td class="orderStatus">
          <a href="#">${item.paid}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
        </td>
    </tr>`
    });

    str += `</table>
    </div>
</section>`;

//console.log(str);
orderPageList.innerHTML=str
};

//刪除單筆項目
orderPageList.addEventListener('click', function(e){
   if(e.target.getAttribute('class') !== "delSingleOrder-Btn"){
      // console.log("沒按到");
      return
   }else{
       let orderId = e.target.getAttribute('data-id');
      // console.log(orderId)

       axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`, {
        headers: {
          'Authorization': token
        }
   }).then(function(response){
     //  console.log(response.data);
       init();
       productPie();
       productTypePie();
   });
}});

//刪除全部訂單

 orderPageList.addEventListener('click', function(e){
    // console.log(e.target.getAttribute('class'));
     if(e.target.getAttribute('class') == "discardAllBtn"){
        // console.log("有按到");
         axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
            headers: {
              'Authorization': token
            }
       }).then(function(response){
        //console.log(response.data);
        init();
        productPie();
        productTypePie();
       })
     }
 });

 //全品項營收比重
 productPie()

function productPie(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
          'Authorization': token
        }
      }).then(function(response){
          let orderData = response.data.orders;
         // console.log(orderData);
          let arr = [];
          orderData.forEach(function(item){
              //console.log(item.products);
              let singleOrder = item.products;
              singleOrder.forEach(function(item){
               //   console.log(item);
                  arr.push(item);
              });
          });
         // console.log(arr);
          let obj = {};
          arr.forEach(function(item){
              let title = item.title;
              if(obj[title] == undefined){
                  obj[title] = item.price*item.quantity;
              }else{
                obj[title] += item.price*item.quantity
              }
          });
        //  console.log(obj);
         let newArr = (Object.entries(obj));
         let c3Arr = [];
        // console.log(newArr);
         newArr.sort((a,b)=> b[1] - a[1]);
         //console.log(newArr);
         c3Arr.push(newArr[0]);
         c3Arr.push(newArr[1]);
         c3Arr.push(newArr[2]);
         let elseProducts = ['其他'];
         newArr.splice(0,3);
        // console.log(newArr);
         let otherPrice = 0
         newArr.forEach(function(item){
             otherPrice += item[1];
         });
        // console.log(otherPrice);
         elseProducts.push(otherPrice);
        // console.log(elseProducts)
         c3Arr.push(elseProducts);
         //console.log(c3Arr)
         
    
          var chart = c3.generate({
            data: {
                // iris data from R
                columns: c3Arr,
                type : 'pie',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            }
        });
                  
      });
    
};

 //全產品類別營收比重
 productTypePie()
 function productTypePie(){
     axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers: {
            'Authorization': token
          }  
     }).then(function(response){
        let orderData = response.data.orders;
       // console.log(orderData);
        let arr = [];
        orderData.forEach(function(item){
           // console.log(item.products);
            let singleOrder = item.products;
            singleOrder.forEach(function(item){
               // console.log(item);
                arr.push(item);
            })
        });
       // console.log(arr);
        let obj = {};
        arr.forEach(function(item){
            let category = item.category;
            if(obj.category == undefined){
                obj[category] = item.price*item.quantity;
            }else{
                obj[category] += item.price*item.quantity;
            }
        });
       // console.log(obj);

        var chart = c3.generate({
            bindto:'#chart2',
            data: {
                // iris data from R
                columns: Object.entries(obj),
                type : 'pie',
                colors:{
                    "收納":'#6A33F8',
                    "床架":'#DACBFF',
                    "窗簾":'#9D7FEA'
                },
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            }
        });
     })
 }

