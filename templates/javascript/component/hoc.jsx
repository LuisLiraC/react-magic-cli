function HOC_NAME (WrappedComponent) {
  return (WrappedComponentProps) => {
    return (
      <>
        <h1>Hello HOC</h1>
        <WrappedComponent />
      </>
    )
  }
}

export default HOC_NAME
