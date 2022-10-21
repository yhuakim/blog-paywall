import '../styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';

const API_KEY = process.env.API_KEY

function MyApp({ Component, pageProps }) {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: "WZKEJhYDkq8349rKvJzC"
      }}
    >
      <Component {...pageProps} />
    </FpjsProvider>
  )
}

export default MyApp
