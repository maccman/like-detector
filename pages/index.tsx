import Head from 'next/head'
import React from 'react'
import { LikeDetector } from '../components'

export default function Home() {
  return <>
    <Head>
      <meta
        name="description"
        content='Detect "likes", "whatevers", and other conversation ticks.'
      />
      <meta
        name="og:description"
        content='Detect "likes", "whatevers", and other conversation ticks.'
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@maccaw" />
      <meta
        name="twitter:image"
        content="https://likedetector.app/twitter-card.png"
      />
      <meta
        name="og:title"
        content='"Like" detector'
      />
      <meta
        name="og:image"
        content="https://likedetector.app/twitter-card.png"
      />
      <meta name="og:url" content="https://likedetector.app" />
    </Head>
    <LikeDetector />
  </>
}
