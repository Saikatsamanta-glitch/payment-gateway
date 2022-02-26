const express = require("express");
const app = express();
const ejs = require('ejs');
const res = require("express/lib/response");
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const path=require('path')
const pay_func=require('./middleware/payment')
const Razorpay = require('razorpay');
const crypto = require('crypto')
const mongodb=require('mongoose');
const port=process.env.PORT || 4000;
// paths
const static_file=path.join(__dirname,'public')
app.use(express.static(static_file));
// Razor pay initialization
app.get('/', (req, res) => {
  var instance = new Razorpay({
    key_id: 'rzp_test_iViU4lic20ILDr',
    key_secret: '2SnRuoVgNbOahdSIheR9jsuq',
  });
  // order_IxUbvX3dp7Qqud
  var options = {
    amount: 40000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    // console.log(order.id);
    res.render('home', { OrderId: order.id })
  })

  // res.send({orderId:order.id})
});


app.post('/prachi' ,(req, res) => {  
  order_id=req.body.orderId;
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.response;
  console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature)
  // Pass yours key_secret here 
  const key_secret = '2SnRuoVgNbOahdSIheR9jsuq';
  // STEP 8: Verification & Send Response to User
  // Creating hmac object 
  let hmac = crypto.createHmac('sha256', key_secret);
  // Passing the data to be hashed
  hmac.update(order_id + "|" + razorpay_payment_id);
  // Creating the hmac in the required format
  const generated_signature = hmac.digest('hex');
  console.log('raxorpay :' + razorpay_signature)
  console.log('generated :' + generated_signature)
  if (razorpay_signature === generated_signature) {
    res.render('afterpayment')
  }
  else {
    res.render('home')
  }   
})


app.listen(port, () => {
  console.log(`connected to server port ${port} 🎉`)
})