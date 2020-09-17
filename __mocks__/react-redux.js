module.exports = {
  connect: (mapStateToProps, mapDispatchToProps) => (ReactComponent) => ({
    mapStateToProps,
    mapDispatchToProps,
    ReactComponent,
  }),
  Provider: ({children}) => children
};
