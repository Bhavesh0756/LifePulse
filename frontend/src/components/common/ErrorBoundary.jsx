import React from 'react';
import Card from '../Card';
import Container from '../Container';
import { Button } from '../Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[LifePulse Global ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
          <Container size="sm">
            <Card variant="elevated" className="p-8 text-center border border-rose-200">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy mb-2">Something Went Wrong</h2>
              <p className="text-xs text-brand-slate mb-4">
                An unexpected error occurred while rendering this view.
              </p>
              {this.state.error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left font-mono overflow-auto max-h-40">
                  {this.state.error.toString()}
                </div>
              )}
              <Button variant="primary" onClick={this.handleReload} icon={RefreshCw}>
                Reload Page
              </Button>
            </Card>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}
