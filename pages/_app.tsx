import '../styles/globals.css'
import { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Like Detector</title>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
