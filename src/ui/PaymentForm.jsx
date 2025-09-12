import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements, PaymentElement
} from '@stripe/react-stripe-js';
import Button from './Button';
import {stripePayment, updateInvoiceForUserPay} from "../admin/api" 

const PaymentForm = ({ invoice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const data = await stripePayment(invoice.totalAmount)
    // const res = await fetch('http://localhost:5000/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: invoice.totalAmount * 100 }),
    // });
    console.log(data)
    const { clientSecret } =  data;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: invoice.client?.name || 'Client',
        },
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      alert('✅ Payment successful!');
      invoice.status = "Paid"
        const data = await updateInvoiceForUserPay(invoice._id,invoice);

      console.log("updated invoice",data)
      // Optional: call another API to update invoice status
    }

    setLoading(false);
  };

  return (
    <div>
    {invoice.status=="Paid"?<p style={{width:"fitContent", padding:"10px",backgroundColor: "lightGreen", borderRadius:"6px"}}> This Invoice is Paid</p>: <form onSubmit={handlePayment}>
      <CardElement />
      {/* <PaymentElement /> */}
      <div   style={{textAlign: "center", width: "fit-content", margin: "10px auto" }}>
<Button text={"Pay Invoice"} blackHover={true} icon="CreditCard"/>
</div>
    </form>}
    </div>
  );
};

 export default PaymentForm;