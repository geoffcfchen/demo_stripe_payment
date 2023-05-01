import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import {
  CardField,
  confirmPayment,
  useConfirmPayment,
} from "@stripe/stripe-react-native";

export default function StripeApp() {
  const [email, setEmail] = useState("");
  const [cardDetails, setCardDetails] = useState("");
  const { confirPayment, loading } = useConfirmPayment();

  async function fetchPaymentIntentClientSecret() {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  }

  async function handlePayPress() {
    // 1. Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please ener Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: email,
    };
    //2. Fetch the intent client secret from the backend

    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful", paymentIntent);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={(value) => setEmail(value.nativeEvent.text)}
        style={styles.input}
      ></TextInput>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: "4242 4242 4242 4242" }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      ></CardField>
      <Button onPress={handlePayPress} title="Pay" disabled={loading}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 20,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#efefefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
