import React from 'react';
import CacheErrorInfo from '../cache-error-info/CacheErrorInfo';

class ErrorBoundary extends React.Component<unknown, { hasError: boolean, showCachePage: boolean }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      hasError: false,
      showCachePage: !['LOCAL', 'DEV'].includes(process.env.TAG)
    };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown): void {
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.state.showCachePage ? <CacheErrorInfo /> : <></>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
