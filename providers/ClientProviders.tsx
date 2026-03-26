"use client"
import { client } from "@/lib/apollo-client"
import { ApolloProvider } from "@apollo/client/react"
import React from "react"
import { Toaster } from "react-hot-toast"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </>
  )
}
