export default (fn) => (request, response, next) =>
  fn(request, response, next).catch(next);
