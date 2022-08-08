require('dotenv').config({path:'./process.env'})
const express = require('express');
const { default: Stripe } = require('stripe');
const app = express();
const path = require('path')

app.use(express.json());


const stripe = new Stripe(process.env.sk);



app.post('/stripe-payment', async (req, res) => {

  const { id, amount, name, country } = req.body;


  try {

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      description: 'Indian flag',
      payment_method: id,
      confirm: true,
      shipping: {
        name,
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'New Delhi',
          state: 'Delhi',
          country
        },
      },


    })


    console.log(payment)
    res.json({ payment })

  }

  catch (error) {

    console.log(error)
    res.json({
      error: true
    })
  }




})



if (process.env.ENV == 'prod') {

  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) => {

      res.sendFile(path.join(__dirname, 'client ', 'build', 'index.html'));
  })
} else {

  app.get('/', (req, res) => {

      res.send("server is running")
  })
}

app.listen(5000, (err) => {
  err ? console.log(err) : console.log('server running successfully 5000')
})


