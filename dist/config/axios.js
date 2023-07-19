"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _config = require('./config'); var _config2 = _interopRequireDefault(_config);

const { apiUrl, tokenApi, cryptKey } = _config2.default;

const instance = _axios2.default.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use((config) => {
  config.params = {
    tokenAPI: tokenApi,
    cryptKey,
  };

  return config;
});

exports. default = instance;
