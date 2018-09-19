module.exports = {
  handleProcessError(err) {
    console.error(err.stack); // eslint-disable-line no-console
    process.exit(1);
  },
};
