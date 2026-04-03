'use client'
import { client } from '@/lib/apollo-client'
import { ApolloProvider } from '@apollo/client/react'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { ModalProvider } from './ModalProvider'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ApolloProvider client={client}>
        <ModalProvider />
        {children}
      </ApolloProvider>
    </>
  )
}
