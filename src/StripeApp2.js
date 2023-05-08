import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CardField,
  useConfirmPayment,
  usePaymentSheet,
} from "@stripe/stripe-react-native";

// const API_URL =
//   "https://c0b6-2603-8000-a200-c18f-51f-e4f4-6b33-ee22.ngrok-free.app";
// const API_URL = "http://localhost:3000";
const API_URL =
  "https://us-central1-wp-clone-256aa.cloudfunctions.net/paymentSheet";

export default function StripeApp2() {
  // const { confirmPayment, loading } = useConfirmPayment();
  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();

  useEffect(() => {
    initialisePaymentSheet();
  }, []);
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/paymentSheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const { clientSecret, error } = await response.json();
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    console.log("customer", customer);

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Example Inc",
      allowDelayedPaymentMethods: true,
      returnURL: "stripe-example://stripe-redirect",
      applePay: {
        merchantCountryCode: "US",
      },
      googlePay: {
        merchantCountryCode: "US",
        testEnv: true,
        currencyCode: "usd",
      },
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setReady(true);
    }
  };

  async function buy() {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "The payment was confirmed successfully");
      setReady(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={buy} title="Pay" disabled={loading || !ready}></Button>
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
