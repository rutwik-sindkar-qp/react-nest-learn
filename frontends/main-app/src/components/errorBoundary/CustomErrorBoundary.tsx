import React from 'react'

interface IProps extends React.PropsWithChildren {
  children: React.ReactNode
  hideRefreshMessage?: boolean
}

interface IState {
  hasError: boolean
  error: Error | null
  errorInfo?: React.ErrorInfo | null
}

export class CustomErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): IState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error)
    this.setState({
      errorInfo,
    })
  }

  render(): React.ReactNode {
    const {hasError, error} = this.state

    if (hasError) {
      return (
        <div>
          <div>{error?.message ?? 'An unexpected error occurred.'}</div>
        </div>
      )
    }

    return this.props.children
  }
}
