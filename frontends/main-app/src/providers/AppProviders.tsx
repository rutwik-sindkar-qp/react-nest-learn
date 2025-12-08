import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import {CustomErrorBoundary} from '../components/errorBoundary/CustomErrorBoundary'
import {BrowserRouter} from 'react-router'

export const AppProviders: React.FC<React.PropsWithChildren> = ({children}) => {
  const queryClientRef = React.useRef<QueryClient | null>(null)
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000,
        },
      },
    })
  }

  return (
    <CustomErrorBoundary>
      <QueryClientProvider client={queryClientRef.current}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </CustomErrorBoundary>
  )
}
