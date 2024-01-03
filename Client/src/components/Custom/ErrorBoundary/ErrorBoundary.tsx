import { Component, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Button from 'components/Button';

interface Props extends RouteComponentProps {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch () {
    if (import.meta.env.NODE_ENV !== 'development') {
      const timeout = setTimeout(() => {
        this.props.history.push('/');
        this.setState({ hasError: false });
        clearTimeout(timeout);
      }, 5000);
    }
  }

  render () {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <p className="text-xl font-semibold">Something went wrong</p>

          <Button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.history.push('/');
            }}
          >
            <i className="mdi mdi-home" />
            <span>Home</span>
          </Button>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default withRouter(ErrorBoundary);
