console.log("suc");
const api_path = "floratest1"

//產品清單
//dom
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector('.productSelect');
//初始化產品清單 init()包含render(data)
init()

function init(data){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).then(response => {
        let data = response.data.products
        render(data)

    });
};

function render(data){
    productWrap.innerHTML = data.map((item)=> `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`).join('');
};
//篩選功能
productSelect.addEventListener("change", function(e){
    if(productSelect.value == "全部"){
        init()
    };
    if(productSelect.value == "床架"){
        let arr = [];
        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).then(response =>{
            let data = response.data.products;
           // console.log(data);
            data.forEach(function(item){
                if(item.category == "床架"){
                    arr.push(item);
                }
            });
            render(arr);
        })
    };
    if(productSelect.value == "收納"){
        let arr = [];
        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).then(response =>{
            let data = response.data.products;
           // console.log(data);
            data.forEach(function(item){
                if(item.category == "收納"){
                    arr.push(item);
                }
            });
            render(arr);
        })
    };
    if(productSelect.value == "窗簾"){
        let arr = [];
        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).then(response =>{
            let data = response.data.products;
          //  console.log(data);
            data.forEach(function(item){
                if(item.category == "窗簾"){
                    arr.push(item);
                }
            }); 
            render(arr);
        })
    };

});

//加入購物車
productWrap.addEventListener("click", function(e){
    if(e.target.innerText !== "加入購物車"){
        return console.log("沒按到")
    }else{
        e.preventDefault();
        console.log(e.target.dataset.id);
        let clickItem = e.target.dataset.id;
        axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).then(response =>{
            let currentCarts = response.data.carts;
            let arr = [];
            currentCarts.forEach(item => {
                if(clickItem == item.product.id){
                    arr.push(item.product.id);
                    arr.push(item.quantity);
                }
            });
            //console.log(arr);
            if(arr.length == 0){
                console.log("空陣列")
                let data = {
                    "data":{
                    "productId": clickItem,
                    "quantity" : 1
                }};
               // console.log(data)
                axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, data).then(response =>{
                  //  console.log(response.data);
                    initMyCart()
                });
            }else{
                let data = {
                    "data":{
                        'productId':arr[0],
                        'quantity':arr[1]+1
                    }
                };
               // console.log(data);
                axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, data).then(response =>{
                    //console.log(response.data);
                    initMyCart()
                })

            }
        })


    }
})



//我的購物車
//dom
const shoppingCart = document.querySelector('.shoppingCart');
//initMyCart()包含renderMyCart(data)
initMyCart()

function initMyCart(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).then(response =>{
        let data = response.data.carts;
      //  console.log(data);
        renderMyCart(data)
    })
};

function renderMyCart(data){
let totalPrice = 0;

data.forEach(function(item){
totalPrice += item.quantity*item.product.price;
});

//console.log(totalPrice);

str = `<h3 class="section-title">我的購物車</h3>
   <div class="overflowWrap">
       <table class="shoppingCart-table">
           <tr>
               <th width="40%">品項</th>
               <th width="15%">單價</th>
               <th width="15%">數量</th>
               <th width="15%">金額</th>
               <th width="15%"></th>
           </tr>`;

data.forEach(function(item){
    str += `
    <tr >
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT$${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
            clear
        </a>
    </td>
   </tr> `
});

str +=
`<tr>
<td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
</td>
<td></td>
<td></td>
<td>
    <p>總金額</p>
</td>
<td>NT$${totalPrice}</td>
</tr>
</table>
</div>`

//console.log(str);
shoppingCart.innerHTML = str;

  
};


//刪除單筆購物車項目
shoppingCart.addEventListener("click", function(e){
    e.preventDefault();
    if(e.target.getAttribute('class') !== "material-icons"){
       // return console.log("沒按到")
    }else{
        //console.log(e.target.getAttribute('data-id'))
        let cartId = e.target.getAttribute('data-id');
      //  console.log(cartId)
         axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).then(function(response){
       //      console.log(response.data);
             initMyCart()
         })
    }
});

//刪除全部品項
shoppingCart.addEventListener("click", function(e){
    e.preventDefault();
    if(e.target.getAttribute('class') !== "discardAllBtn"){
      //  return console.log("沒按到");
    }else{
        //console.log(e.target.getAttribute('data-id'))
      //  console.log("按到");
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/`).then(function(response){
          //  console.log(response.data);
            initMyCart()
        })
    }
});

//送出預定資料
//dom
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const submitOrder= document.querySelector('.submitOrder');
const orderInfoMsg = document.querySelectorAll('.orderInfo-message');
console.log(orderInfoMsg);


submitOrder.addEventListener('click', function(e){
    e.preventDefault();
    resetBookingInfo();
    //必填的部分
    let arr = [];
 
    if(customerName.value == ""){
        arr.push("姓名")
    };
    if(customerPhone.value == ""){
        arr.push("電話")
    };
    if(customerEmail.value == ""){
        arr.push("Email")
    };
    if(customerAddress.value == ""){
        arr.push("寄送地址")
    };
    if (arr.length !== 0){

        arr.forEach(function(item){
           document.querySelector(`[data-message='${item}']`).textContent = `必填`
        })

        return
    };

    if(arr.length ==0){
        let data = {
            "data":{
                "user":{
                    "name":customerName.value,
                    "tel":customerPhone.value,
                    "email":customerEmail.value,
                    "address":customerAddress.value,
                    "payment":tradeWay.value
                }   
            }
        };
    //    console.log(data);
        axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, data).then(function(response){
            //console.log(response.data);
        })
    };  
});

function resetBookingInfo(){
    let arr = ["姓名","電話","Email","寄送地址"];
    arr.forEach(function(item){
        document.querySelector(`[data-message='${item}']`).textContent = ``
     })
}
