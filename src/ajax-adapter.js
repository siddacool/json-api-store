export default class AjaxAdapter {

  constructor(options) {
    this._base = (options && options.base) || "";
  };

  create(store, type, partial, success, error, context) {

    if (error && {}.toString.call(error) !== '[object Function]') {

      this.create(store, type, partial, success, null, error);

    } else {

      let request = new XMLHttpRequest();

      request.open('POST', `${this._base}/${type}`, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
          let response = JSON.parse(request.responseText);
          try {
            store.push(response);
            if (success) {
              success.call(context, store.find(response.data.type, response.data.id));
            }
          } catch (e) {
            if (error) {
              error.call(context, e);
            }
          }
        } else {
          if (error) {
            error.call(context);
          }
        }
      };

      request.send({
        data: JSON.stringify(store.convert(type, partial))
      });

    }

  }

  destroy(store, type, id, success, error, context) {

    if (error && {}.toString.call(error) !== '[object Function]') {

      this.destroy(store, type, id, success, null, error);

    } else {

      let request = new XMLHttpRequest();

      request.open('DELETE', `${this._base}/${type}/${id}`, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
          try {
            store.remove(type, id);
            if (success) {
              success.call(context);
            }
          } catch (e) {
            error.call(context, e);
          }
        } else if (error) {
          error.call(context);
        }
      };

      request.send();

    }

  }

  load(store, type, id, options, success, error, context) {

    if (id && {}.toString.call(id) === '[object Function]') {
      this.load(store, type, null, null, id, options, success);
    } else if (id && typeof id === "object") {
      this.load(store, type, null, id, options, success, error);
    } else if (options && {}.toString.call(options) === '[object Function]') {
      this.load(store, type, id, {}, options, success, error);
    } else if (error && {}.toString.call(error) !== '[object Function]') {
      this.load(store, type, id, options, success, null, error);
    } else {

      let request = new XMLHttpRequest();
      let url;

      options = options || {};
      url = id ? `${this._base}/${type}/${id}` : `${this._base}/${type}`;

      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
          try {
            store.push(JSON.parse(request.responseText));
            if (success) {
              success.call(context, id ? store.find(type, id) : store.find(type));
            }
          } catch (e) {
            error.call({}, e);
          }
        } else if (error) {
          error.call(context);
        }
      };

      request.send();

    }

  }

  update(store, type, id, partial, success, error) {

    let request = new XMLHttpRequest();
    let data = store.convert(type, id, partial);

    request.open('PATCH', `${this._base}/${type}/${id}`, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 300) {
        try {
          store.add(data);
          if (success) {
            success(store.find(data.type, data.id));
          }
        } catch (e) {
          if (error) {
            error(e);
          }
        }
      } else if (error) {
        error();
      }
    };

    request.send({
      data: JSON.stringify(data)
    });

  }

}
