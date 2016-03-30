'use strict';
////////////////////////////////////////////////////////////////////////////////
/// DISCLAIMER
///
/// Copyright 2015-2016 ArangoDB GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is ArangoDB GmbH, Cologne, Germany
///
/// @author Alan Plum
////////////////////////////////////////////////////////////////////////////////

const crypto = require('@arangodb/crypto');

module.exports = function jwtStorage(cfg) {
  if (typeof cfg === 'string') {
    cfg = {secret: cfg};
  }
  if (!cfg) {
    cfg = {};
  }
  const expiry = (cfg.expiry || 60) * 60 * 1000;
  return {
    fromClient(sid) {
      const session = crypto.jwtDecode(cfg.secret, sid, cfg.verify === false);
      if (session.exp < Date.now()) {
        return null;
      }
      return session.payload;
    },
    forClient(payload) {
      const session = {
        payload: payload,
        exp: Date.now() + expiry,
        iat: Date.now()
      };
      return crypto.jwtEncode(cfg.secret, session, cfg.algorithm);
    },
    new() {
      return {};
    }
  };
};
