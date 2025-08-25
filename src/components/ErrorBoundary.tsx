import { apiUrl } from '@/api/baseQuery';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { LuBug, LuHome, LuRefreshCw } from 'react-icons/lu';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode; // Opcional: UI personalizada para el fallback
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    this.sendToServer(error, errorInfo);
  }

  private sendToServer = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const response = await fetch(apiUrl + '/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        }),
      });

      if (!response.ok) {
        console.error('Failed to log error to server:', response.statusText);
      }
    } catch (e) {
      console.error('Error sending log to server:', e);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  // private toggleDetails = () => {
  //   this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  // };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
          <Row className="w-100">
            <Col md={8} lg={6} className="mx-auto">
              <Card className="shadow-lg border-0">
                <Card.Body className="p-5 text-center">
                  <div className="mb-4">
                    <LuBug size={64} className="text-danger" />
                  </div>

                  <h2 className="h3 mb-3">¡Ups! Algo salió mal</h2>

                  <Alert variant="warning" className="mb-4">
                    <Alert.Heading>Hemos detectado un problema</Alert.Heading>
                    <p className="mb-0">
                      Hemos sido notificados del error y estamos trabajando para solucionarlo.
                      Por favor, intente recargar la aplicación o volver al inicio.
                    </p>
                  </Alert>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
                    <Button
                      variant="primary"
                      onClick={this.handleReload}
                      className="me-md-2"
                    >
                      <LuRefreshCw className="me-2" />
                      Recargar la aplicación
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={this.handleGoHome}
                    >
                      <LuHome className="me-2" />
                      Volver al inicio
                    </Button>
                  </div>

                  {/* <div className="text-center">
                    <Button
                      variant="link"
                      onClick={this.toggleDetails}
                      className="text-decoration-none"
                    >
                      {this.state.showDetails ? 'Ocultar detalles' : 'Ver detalles técnicos'}
                    </Button>
                  </div>

                  {this.state.showDetails && (
                    <Alert variant="light" className="mt-3 text-start">
                      <h6 className="alert-heading">Detalles del error:</h6>
                      <pre className="small mb-0 text-muted overflow-auto" style={{ maxHeight: '200px' }}>
                        {this.state.error?.toString()}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </Alert>
                  )} */}
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <p className="text-muted small">
                  Si el problema persiste, contacte a soporte técnico.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;