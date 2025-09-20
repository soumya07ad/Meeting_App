import React from 'react';

type Props = { children: React.ReactNode };

export class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error }>{
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // noop - allow global error overlay to also catch
    console.error('ErrorBoundary caught', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500">
          <h3>Component error</h3>
          <pre>{String(this.state.error?.message)}</pre>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
