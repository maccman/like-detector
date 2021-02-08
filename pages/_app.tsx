import '../styles/globals.css'
import { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Like Detector</title>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,900;1,400&display=swap" rel="stylesheet" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
