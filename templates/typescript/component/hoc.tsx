function withTest <T extends object>(WrappedComponent: any) {
  return (WrappedComponentProps: any) => {
    return (
      <>
        <h1>Hello HOC</h1>
        <WrappedComponent />
      </>
    )
  }
}

export default withTest