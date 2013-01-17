function route(handle, pathname,response) {
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
  }
}

exports.route = route;