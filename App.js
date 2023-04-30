import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StripeApp from "./src/StripeApp";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Lhf4GDsOD7fAAq8BAQLfXxnP69pNkOgwcX8CbYx5YEsqzQWHEVFbKoAIjetsXCyQzq46U73S4fEQBOeJLo6inea00vzpGOQet">
      <StripeApp></StripeApp>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
