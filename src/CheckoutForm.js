import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { doc, collection } from "firebase/firestore";
import { db } from "../firebase";

const CheckoutForm = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePayPress = async () => {
    const paymentIntentRef = doc(collection(db, "payment_intents"));
    // console.log("paymentIntentRef", paymentIntentRef);

    // Create PaymentSheet
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntentRef.id,
    });

    if (error) {
      console.log("test");
      console.log(error.message);
    } else {
      // Present PaymentSheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.log(presentError.message);
      } else {
        console.log("Payment successful!");
        await updateDoc(paymentIntentRef, { status: "succeeded" });
      }
    }
  };

  return (
    <View>
      <Text>Name on card:</Text>
      <TextInput />

      <Text>Card number:</Text>
      <TextInput />

      <Text>Expiration month:</Text>
      <TextInput />

      <Text>Expiration year:</Text>
      <TextInput />

      <Text>CVC:</Text>
      <TextInput />

      <Button title="Pay" onPress={handlePayPress} />
    </View>
  );
};

export default CheckoutForm;
