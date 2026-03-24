"use client"

import React from "react"

import { client } from "@/lib/apollo-client"
import { ApolloProvider } from "@apollo/client/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <div className="w-full max-w-xl px-6 flex flex-col items-center">
          {children}
        </div>
      </div>
    </ApolloProvider>
  )
}
