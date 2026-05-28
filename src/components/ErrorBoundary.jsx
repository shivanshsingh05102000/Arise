import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="screen error-screen">
          <div className="system-panel">
            <p className="mono warning">[ SCREEN FAILURE ]</p>
            <h1>Recovery Interface</h1>
            <p>{this.state.error.message}</p>
            <button className="system-button" onClick={() => this.setState({ error: null })}>RETRY</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
