/*
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
  var d = 0;
  return function () {
    return d < a.length ? { done: !1, value: a[d++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
  var d = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (d) return d.call(a);
  if ("number" == typeof a.length) return $jscomp.arrayIterator(a);
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
$jscomp.arrayFromIterator = function (a) {
  for (var d, b = []; !(d = a.next()).done; ) b.push(d.value);
  return b;
};
$jscomp.arrayFromIterable = function (a) {
  return a instanceof Array
    ? a
    : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
};
"undefined" == typeof _pio && (_pio = {});
(function () {
  _pio.channel = function () {};
  _pio.channel.prototype.call = function (a, d, b, e, c) {
    var f =
        "undefined" != typeof PLAYERIO_API_HOST
          ? PLAYERIO_API_HOST
          : (PlayerIO.useSecureApiRequests ? "https" : "http") +
            "://api.playerio.com/json/",
      g = new XMLHttpRequest();
    "withCredentials" in g
      ? g.open("post", f, !0)
      : "undefined" != typeof XDomainRequest
      ? ((g = new XDomainRequest()), g.open("post", f))
      : (g = new _pio.flashWebRequest("post", f));
    var h = Error();
    null != g
      ? (g.send("[" + a + "|" + (this.token || "") + "]" + JSON.stringify(d)),
        (g.onload = function () {
          var l = null;
          try {
            var k = g.response || g.responseText;
            if ("[" == k[0]) {
              var m = k.indexOf("]");
              this.token = k.substring(1, m);
              k = k.substring(m + 1);
            }
            l = JSON.parse(k);
          } catch (p) {
            _pio.handleError(
              h,
              e,
              PlayerIOErrorCode.GeneralError,
              "Error decoding response from webservice: " + p
            );
            return;
          }
          if (
            "undefined" == typeof l.errorcode &&
            "undefined" == typeof l.message
          ) {
            k = l;
            if (c)
              try {
                k = c(l);
              } catch (p) {
                _pio.handleError(
                  h,
                  e,
                  PlayerIOErrorCode.GeneralError,
                  p.message
                );
              }
            b && b(k);
          } else _pio.handleError(h, e, l.errorcode, l.message);
        }),
        (g.onerror = function (l) {
          _pio.handleError(
            h,
            e,
            PlayerIOErrorCode.GeneralError,
            "Error talking to webservice: " + JSON.stringify(l)
          );
        }))
      : _pio.handleError(
          h,
          e,
          PlayerIOErrorCode.GeneralError,
          "Need to implement flash calling"
        );
  };
  _pio.runCallback = function (a, d, b) {
    try {
      a && a(d);
    } catch (e) {
      (a = "Unhandled error in callback: " + e.message),
        (a = a + "\nStack:\n" + (e.stack || e.stacktrace || e.StackTrace)),
        b &&
          (a =
            a +
            "\nCallsite stack:\n" +
            (b.stack || b.stacktrace || b.StackTrace)),
        console.log(a);
    }
  };
  _pio.handleError = function (a, d, b, e) {
    b = _pio.error(b, e);
    a &&
      (a.stack && (b.stack = a.stack),
      a.stacktrace && (b.stacktrace = a.stacktrace),
      a.StackTrace && (b.StackTrace = a.StackTrace));
    d
      ? _pio.runCallback(d, b, a)
      : "undefined" != typeof console
      ? console.log(
          "No error callback specified for: " +
            b.code +
            ": " +
            b.message +
            "\n" +
            (b.stack || b.stacktrace || b.StackTrace)
        )
      : alert(
          "No error callback specified for: " +
            b.code +
            ": " +
            b.message +
            "\n" +
            (b.stack || b.stacktrace || b.StackTrace)
        );
  };
  _pio.error = function (a, d) {
    1 == arguments.length && ((d = a), (a = PlayerIOErrorCode.GeneralError));
    "number" == typeof a && (a = PlayerIOErrorCode.codes[a]);
    if ("string" != typeof a)
      throw (console.log(a, d, Error().stack), "Code must be a string!");
    var b = Error();
    return new PlayerIOError(a, d, b.stack || b.stacktrace || b.StackTrace);
  };
  _pio.debugLog = function (a) {
    "undefined" != typeof console && console.log(a);
  };
  _pio.convertToKVArray = function (a) {
    var d = [];
    if (a) for (var b in a) d.push({ key: "" + b, value: "" + a[b] });
    return d;
  };
  _pio.convertFromKVArray = function (a) {
    var d = {};
    if (a && a.length) for (var b in a) d[a[b].key] = a[b].value;
    return d;
  };
  _pio.convertToSegmentArray = function (a) {
    var d = [];
    if (a) for (var b in a) d.push(b + ":" + a[b]);
    return d;
  };
})();
PlayerIO = {
  useSecureApiRequests: !1,
  authenticate: function (a, d, b, e, c, f) {
    if ("auto" == b.publishingnetworklogin)
      "undefined" == typeof window.PublishingNetwork
        ? f(
            new PlayerIOError(
              PlayerIOErrorCode.GeneralError,
              "Could not find the PublishingNetwork object on the current page. Did you include the PublishingNetwork.js script?"
            )
          )
        : PublishingNetwork.dialog(
            "login",
            { gameId: a, connectionId: d, __use_usertoken__: !0 },
            function (h) {
              h.error
                ? f(new PlayerIOError(PlayerIOErrorCode.GeneralError, h.error))
                : "undefined" == typeof h.userToken
                ? f(
                    new PlayerIOError(
                      PlayerIOErrorCode.GeneralError,
                      "Missing userToken value in result, but no error message given."
                    )
                  )
                : PlayerIO.authenticate(
                    a,
                    d,
                    { userToken: h.userToken },
                    e,
                    c,
                    f
                  );
            }
          );
    else {
      var g = new _pio.channel();
      g.authenticate(
        a,
        d,
        _pio.convertToKVArray(b),
        _pio.convertToSegmentArray(e),
        "javascript",
        _pio.convertToKVArray({}),
        null,
        c,
        f,
        function (h) {
          g.token = h.token;
          return new _pio.client(g, a, h.gamefsredirectmap, h.userid);
        }
      );
    }
  },
  quickConnect: null,
  gameFS: function (a) {
    return new _pio.gameFS(a);
  },
};
var JSON;
JSON || (JSON = {});
(function () {
  function a(k) {
    return 10 > k ? "0" + k : k;
  }
  function d(k) {
    c.lastIndex = 0;
    return c.test(k)
      ? '"' +
          k.replace(c, function (m) {
            var p = h[m];
            return "string" === typeof p
              ? p
              : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + k + '"';
  }
  function b(k, m) {
    var p,
      n = f,
      q = m[k];
    q &&
      "object" === typeof q &&
      "function" === typeof q.toJSON &&
      (q = q.toJSON(k));
    "function" === typeof l && (q = l.call(m, k, q));
    switch (typeof q) {
      case "string":
        return d(q);
      case "number":
        return isFinite(q) ? String(q) : "null";
      case "boolean":
      case "null":
        return String(q);
      case "object":
        if (!q) return "null";
        f += g;
        var t = [];
        if ("[object Array]" === Object.prototype.toString.apply(q)) {
          var z = q.length;
          for (p = 0; p < z; p += 1) t[p] = b(p, q) || "null";
          var A =
            0 === t.length
              ? "[]"
              : f
              ? "[\n" + f + t.join(",\n" + f) + "\n" + n + "]"
              : "[" + t.join(",") + "]";
          f = n;
          return A;
        }
        if (l && "object" === typeof l)
          for (z = l.length, p = 0; p < z; p += 1) {
            if ("string" === typeof l[p]) {
              var C = l[p];
              (A = b(C, q)) && t.push(d(C) + (f ? ": " : ":") + A);
            }
          }
        else
          for (C in q)
            Object.prototype.hasOwnProperty.call(q, C) &&
              (A = b(C, q)) &&
              t.push(d(C) + (f ? ": " : ":") + A);
        A =
          0 === t.length
            ? "{}"
            : f
            ? "{\n" + f + t.join(",\n" + f) + "\n" + n + "}"
            : "{" + t.join(",") + "}";
        f = n;
        return A;
    }
  }
  "function" !== typeof Date.prototype.toJSON &&
    ((Date.prototype.toJSON = function (k) {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            "-" +
            a(this.getUTCMonth() + 1) +
            "-" +
            a(this.getUTCDate()) +
            "T" +
            a(this.getUTCHours()) +
            ":" +
            a(this.getUTCMinutes()) +
            ":" +
            a(this.getUTCSeconds()) +
            "Z"
        : null;
    }),
    (String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON =
        function (k) {
          return this.valueOf();
        }));
  var e =
      /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    c =
      /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    f,
    g,
    h = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\",
    },
    l;
  "function" !== typeof JSON.stringify &&
    (JSON.stringify = function (k, m, p) {
      var n;
      g = f = "";
      if ("number" === typeof p) for (n = 0; n < p; n += 1) g += " ";
      else "string" === typeof p && (g = p);
      if (
        (l = m) &&
        "function" !== typeof m &&
        ("object" !== typeof m || "number" !== typeof m.length)
      )
        throw Error("JSON.stringify");
      return b("", { "": k });
    });
  "function" !== typeof JSON.parse &&
    (JSON.parse = function (k, m) {
      function p(q, t) {
        var z,
          A = q[t];
        if (A && "object" === typeof A)
          for (z in A)
            if (Object.prototype.hasOwnProperty.call(A, z)) {
              var C = p(A, z);
              void 0 !== C ? (A[z] = C) : delete A[z];
            }
        return m.call(q, t, A);
      }
      k = String(k);
      e.lastIndex = 0;
      e.test(k) &&
        (k = k.replace(e, function (q) {
          return "\\u" + ("0000" + q.charCodeAt(0).toString(16)).slice(-4);
        }));
      if (
        /^[\],:{}\s]*$/.test(
          k
            .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              "]"
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )
      ) {
        var n = eval("(" + k + ")");
        return "function" === typeof m ? p({ "": n }, "") : n;
      }
      throw new SyntaxError("JSON.parse");
    });
})();
(function () {
  function a(h) {
    if (null != c) h(c);
    else if (f) h(null);
    else if (null == g) {
      g = [h];
      var l = setInterval(function () {
        var m = d();
        null != m && k(m);
      }, 50);
      setTimeout(function () {
        null == c && k(null);
      }, 3e4);
      var k = function (m) {
        c = m;
        f = null == m;
        clearInterval(l);
        for (var p = 0; p != g.length; p++) g[p](m);
      };
    } else g.push(h);
  }
  function d() {
    var h =
      '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="10" height="10" style="$style$" id="$id$">\t<param name="movie" value="$src$" />\t<param name="allowNetworking" value="all" />\t<param name="allowScriptAccess" value="always" />\t\x3c!--[if !IE]>--\x3e\t<object type="application/x-shockwave-flash" data="$src$" width="10" height="10" style="$style$">\t\t<param name="allowNetworking" value="all" />\t\t<param name="allowScriptAccess" value="always" />\t</object>\t\x3c!--<![endif]--\x3e</object>'.replace(
        /\$id\$/gi,
        "__pio_flashfallback__"
      );
    h = h.replace(
      /\$src\$/gi,
      "http://192.168.30.154/html5client/FlashFallback/bin-debug/FlashFallback.swf"
    );
    h = h.replace(/\$style\$/gi, "width:10px;height:10px");
    var l = document.getElementById("containerId");
    if (!l) {
      var k = document.createElement("div");
      k.setAttribute("id", l);
      k.setAttribute("style", "position:absolute;top:-20px;left:-20px");
      k.innerHTML = h;
      try {
        document.body.appendChild(k);
      } catch (m) {}
    }
    h = function (m) {
      m = document.getElementsByTagName(m);
      for (var p = 0; p != m.length; p++)
        if (m[p].ping && "pong" == m[p].ping()) return m[p];
    };
    return h("embed") || h("object");
  }
  var b = {},
    e = 0;
  __pio_flashfallback_callback__ = function () {
    var h = b[arguments[0]];
    if (h) {
      for (var l = [], k = 1; k != arguments.length; k++)
        l[k - 1] = arguments[k];
      h.apply(null, l);
    }
  };
  _pio.flashWebRequest = function (h, l) {
    var k = this;
    this.response = null;
    this.onload = function () {};
    this.onerror = function () {};
    this.send = function (m) {
      a(function (p) {
        if (null == p)
          k.onerror(
            "Browser does not support Cross-Origin (CORS) webrequest or Flash as a fallback method"
          );
        else {
          var n = "cb" + e++;
          b[n] = function (q, t) {
            delete b[n];
            if (q) (k.response = t), k.onload();
            else k.onerror(t);
          };
          p.webrequest(n, h, l, m);
        }
      });
    };
  };
  _pio.flashSocketConnection = function (h, l, k, m, p) {
    var n = "cb" + e++,
      q = this,
      t = new _pio.messageSerializer(),
      z = !1,
      A = !1,
      C = setTimeout(function () {
        z || ((z = !0), k(!1, "Connect attempt timed out"));
      }, l);
    this.disconnect = function () {
      console.log("... this shouldn't happen");
    };
    this.sendMessage = function (w) {
      console.log("... send msg. this shouldn't happen");
    };
    a(function (w) {
      null == w
        ? ((z = !0),
          k(
            !1,
            "Browser does not support WebSocket connections and the Flash fallback failed."
          ))
        : ((b[n] = function (B, u) {
            switch (B) {
              case "onopen":
                z ||
                  (clearTimeout(C), (A = z = !0), w.socketSend(n, [0]), k(A));
                break;
              case "onclose":
                q.disconnect();
                break;
              case "onerror":
                q.disconnect();
                break;
              case "onmessage":
                p(t.deserializeMessage(u, 0, u.length));
            }
          }),
          (q.disconnect = function () {
            if (A) {
              A = !1;
              m();
              try {
                w.socketClose(n);
              } catch (B) {
                _pio.debugLog(B);
              }
            }
          }),
          (q.sendMessage = function (B) {
            B = t.serializeMessage(B);
            w.socketSend(n, B);
          }),
          w.socketConnection(n, h));
    });
  };
  _pio.isFlashFallbackEnabled = function (h) {
    a(function (l) {
      h(null != l);
    });
  };
  var c = null,
    f = !1,
    g = null;
})();
(function () {
  var a = _pio.channel.prototype;
  a.connect = function (d, b, e, c, f, g, h, l, k, m, p) {
    this.call(
      10,
      {
        gameid: d,
        connectionid: b,
        userid: e,
        auth: c,
        partnerid: f,
        playerinsightsegments: g,
        clientapi: h,
        clientinfo: l,
      },
      k,
      m,
      p
    );
  };
  _pio.ApiSecurityRule = { RespectClientSetting: 0, UseHttp: 1, UseHttps: 2 };
  a.authenticate = function (d, b, e, c, f, g, h, l, k, m) {
    this.call(
      13,
      {
        gameid: d,
        connectionid: b,
        authenticationarguments: e,
        playerinsightsegments: c,
        clientapi: f,
        clientinfo: g,
        playcodes: h,
      },
      l,
      k,
      m
    );
  };
  a.createRoom = function (d, b, e, c, f, g, h, l) {
    this.call(
      21,
      { roomid: d, roomtype: b, visible: e, roomdata: c, isdevroom: f },
      g,
      h,
      l
    );
  };
  a.joinRoom = function (d, b, e, c, f, g, h) {
    this.call(
      24,
      { roomid: d, joindata: b, isdevroom: e, serverdomainnameneeded: c },
      f,
      g,
      h
    );
  };
  a.createJoinRoom = function (d, b, e, c, f, g, h, l, k, m) {
    this.call(
      27,
      {
        roomid: d,
        roomtype: b,
        visible: e,
        roomdata: c,
        joindata: f,
        isdevroom: g,
        serverdomainnameneeded: h,
      },
      l,
      k,
      m
    );
  };
  a.listRooms = function (d, b, e, c, f, g, h, l) {
    this.call(
      30,
      {
        roomtype: d,
        searchcriteria: b,
        resultlimit: e,
        resultoffset: c,
        onlydevrooms: f,
      },
      g,
      h,
      l
    );
  };
  a.userLeftRoom = function (d, b, e, c, f, g) {
    this.call(40, { extendedroomid: d, newplayercount: b, closed: e }, c, f, g);
  };
  a.writeError = function (d, b, e, c, f, g, h, l) {
    this.call(
      50,
      { source: d, error: b, details: e, stacktrace: c, extradata: f },
      g,
      h,
      l
    );
  };
  a.updateRoom = function (d, b, e, c, f, g) {
    this.call(53, { extendedroomid: d, visible: b, roomdata: e }, c, f, g);
  };
  _pio.ValueType = {
    String: 0,
    Int: 1,
    UInt: 2,
    Long: 3,
    Bool: 4,
    Float: 5,
    Double: 6,
    ByteArray: 7,
    DateTime: 8,
    Array: 9,
    Obj: 10,
  };
  a.createObjects = function (d, b, e, c, f) {
    this.call(82, { objects: d, loadexisting: b }, e, c, f);
  };
  a.loadObjects = function (d, b, e, c) {
    this.call(85, { objectids: d }, b, e, c);
  };
  _pio.LockType = { NoLocks: 0, LockIndividual: 1, LockAll: 2 };
  a.saveObjectChanges = function (d, b, e, c, f, g) {
    this.call(88, { locktype: d, changesets: b, createifmissing: e }, c, f, g);
  };
  a.deleteObjects = function (d, b, e, c) {
    this.call(91, { objectids: d }, b, e, c);
  };
  a.loadMatchingObjects = function (d, b, e, c, f, g, h) {
    this.call(94, { table: d, index: b, indexvalue: e, limit: c }, f, g, h);
  };
  a.loadIndexRange = function (d, b, e, c, f, g, h, l) {
    this.call(
      97,
      { table: d, index: b, startindexvalue: e, stopindexvalue: c, limit: f },
      g,
      h,
      l
    );
  };
  a.deleteIndexRange = function (d, b, e, c, f, g, h) {
    this.call(
      100,
      { table: d, index: b, startindexvalue: e, stopindexvalue: c },
      f,
      g,
      h
    );
  };
  a.loadMyPlayerObject = function (d, b, e) {
    this.call(103, {}, d, b, e);
  };
  a.payVaultReadHistory = function (d, b, e, c, f, g) {
    this.call(160, { page: d, pagesize: b, targetuserid: e }, c, f, g);
  };
  a.payVaultRefresh = function (d, b, e, c, f) {
    this.call(163, { lastversion: d, targetuserid: b }, e, c, f);
  };
  a.payVaultConsume = function (d, b, e, c, f) {
    this.call(166, { ids: d, targetuserid: b }, e, c, f);
  };
  a.payVaultCredit = function (d, b, e, c, f, g) {
    this.call(169, { amount: d, reason: b, targetuserid: e }, c, f, g);
  };
  a.payVaultDebit = function (d, b, e, c, f, g) {
    this.call(172, { amount: d, reason: b, targetuserid: e }, c, f, g);
  };
  a.payVaultBuy = function (d, b, e, c, f, g) {
    this.call(175, { items: d, storeitems: b, targetuserid: e }, c, f, g);
  };
  a.payVaultGive = function (d, b, e, c, f) {
    this.call(178, { items: d, targetuserid: b }, e, c, f);
  };
  a.payVaultPaymentInfo = function (d, b, e, c, f, g) {
    this.call(181, { provider: d, purchasearguments: b, items: e }, c, f, g);
  };
  a.payVaultUsePaymentInfo = function (d, b, e, c, f) {
    this.call(184, { provider: d, providerarguments: b }, e, c, f);
  };
  a.partnerPayTrigger = function (d, b, e, c, f) {
    this.call(200, { key: d, count: b }, e, c, f);
  };
  a.partnerPaySetTag = function (d, b, e, c) {
    this.call(203, { partnerid: d }, b, e, c);
  };
  a.notificationsRefresh = function (d, b, e, c) {
    this.call(213, { lastversion: d }, b, e, c);
  };
  a.notificationsRegisterEndpoints = function (d, b, e, c, f) {
    this.call(216, { lastversion: d, endpoints: b }, e, c, f);
  };
  a.notificationsSend = function (d, b, e, c) {
    this.call(219, { notifications: d }, b, e, c);
  };
  a.notificationsToggleEndpoints = function (d, b, e, c, f, g) {
    this.call(222, { lastversion: d, endpoints: b, enabled: e }, c, f, g);
  };
  a.notificationsDeleteEndpoints = function (d, b, e, c, f) {
    this.call(225, { lastversion: d, endpoints: b }, e, c, f);
  };
  a.gameRequestsSend = function (d, b, e, c, f, g) {
    this.call(
      241,
      { requesttype: d, requestdata: b, requestrecipients: e },
      c,
      f,
      g
    );
  };
  a.gameRequestsRefresh = function (d, b, e, c) {
    this.call(244, { playcodes: d }, b, e, c);
  };
  a.gameRequestsDelete = function (d, b, e, c) {
    this.call(247, { requestids: d }, b, e, c);
  };
  a.achievementsRefresh = function (d, b, e, c) {
    this.call(271, { lastversion: d }, b, e, c);
  };
  a.achievementsLoad = function (d, b, e, c) {
    this.call(274, { userids: d }, b, e, c);
  };
  a.achievementsProgressSet = function (d, b, e, c, f) {
    this.call(277, { achievementid: d, progress: b }, e, c, f);
  };
  a.achievementsProgressAdd = function (d, b, e, c, f) {
    this.call(280, { achievementid: d, progressdelta: b }, e, c, f);
  };
  a.achievementsProgressMax = function (d, b, e, c, f) {
    this.call(283, { achievementid: d, progress: b }, e, c, f);
  };
  a.achievementsProgressComplete = function (d, b, e, c) {
    this.call(286, { achievementid: d }, b, e, c);
  };
  a.playerInsightRefresh = function (d, b, e) {
    this.call(301, {}, d, b, e);
  };
  a.playerInsightSetSegments = function (d, b, e, c) {
    this.call(304, { segments: d }, b, e, c);
  };
  a.playerInsightTrackInvitedBy = function (d, b, e, c, f) {
    this.call(307, { invitinguserid: d, invitationchannel: b }, e, c, f);
  };
  a.playerInsightTrackEvents = function (d, b, e, c) {
    this.call(311, { events: d }, b, e, c);
  };
  a.playerInsightTrackExternalPayment = function (d, b, e, c, f) {
    this.call(314, { currency: d, amount: b }, e, c, f);
  };
  a.playerInsightSessionKeepAlive = function (d, b, e) {
    this.call(317, {}, d, b, e);
  };
  a.playerInsightSessionStop = function (d, b, e) {
    this.call(320, {}, d, b, e);
  };
  a.oneScoreLoad = function (d, b, e, c) {
    this.call(351, { userids: d }, b, e, c);
  };
  a.oneScoreSet = function (d, b, e, c) {
    this.call(354, { score: d }, b, e, c);
  };
  a.oneScoreAdd = function (d, b, e, c) {
    this.call(357, { score: d }, b, e, c);
  };
  a.oneScoreRefresh = function (d, b, e) {
    this.call(360, {}, d, b, e);
  };
  a.simpleConnect = function (d, b, e, c, f, g, h, l, k) {
    this.call(
      400,
      {
        gameid: d,
        usernameoremail: b,
        password: e,
        playerinsightsegments: c,
        clientapi: f,
        clientinfo: g,
      },
      h,
      l,
      k
    );
  };
  a.simpleRegister = function (d, b, e, c, f, g, h, l, k, m, p, n, q, t) {
    this.call(
      403,
      {
        gameid: d,
        username: b,
        password: e,
        email: c,
        captchakey: f,
        captchavalue: g,
        extradata: h,
        partnerid: l,
        playerinsightsegments: k,
        clientapi: m,
        clientinfo: p,
      },
      n,
      q,
      t
    );
  };
  a.simpleRecoverPassword = function (d, b, e, c, f) {
    this.call(406, { gameid: d, usernameoremail: b }, e, c, f);
  };
  a.kongregateConnect = function (d, b, e, c, f, g, h, l, k) {
    this.call(
      412,
      {
        gameid: d,
        userid: b,
        gameauthtoken: e,
        playerinsightsegments: c,
        clientapi: f,
        clientinfo: g,
      },
      h,
      l,
      k
    );
  };
  a.simpleGetCaptcha = function (d, b, e, c, f, g) {
    this.call(415, { gameid: d, width: b, height: e }, c, f, g);
  };
  a.facebookOAuthConnect = function (d, b, e, c, f, g, h, l, k) {
    this.call(
      418,
      {
        gameid: d,
        accesstoken: b,
        partnerid: e,
        playerinsightsegments: c,
        clientapi: f,
        clientinfo: g,
      },
      h,
      l,
      k
    );
  };
  a.steamConnect = function (d, b, e, c, f, g, h, l, k) {
    this.call(
      421,
      {
        gameid: d,
        steamappid: b,
        steamsessionticket: e,
        playerinsightsegments: c,
        clientapi: f,
        clientinfo: g,
      },
      h,
      l,
      k
    );
  };
  a.simpleUserGetSecureLoginInfo = function (d, b, e) {
    this.call(424, {}, d, b, e);
  };
  a.leaderboardsGet = function (d, b, e, c, f, g, h, l, k) {
    this.call(
      431,
      {
        group: d,
        leaderboard: b,
        index: e,
        count: c,
        neighbouruserid: f,
        filteruserids: g,
      },
      h,
      l,
      k
    );
  };
  a.leaderboardsSet = function (d, b, e, c, f, g) {
    this.call(434, { group: d, leaderboard: b, score: e }, c, f, g);
  };
  a.leaderboardsCount = function (d, b, e, c, f) {
    this.call(437, { group: d, leaderboard: b }, e, c, f);
  };
  a.joinCluster = function (d, b, e, c, f, g, h, l, k, m, p, n, q, t, z, A, C) {
    this.call(
      504,
      {
        clusteraccesskey: d,
        isdevelopmentserver: b,
        ports: e,
        machinename: c,
        version: f,
        machineid: g,
        os: h,
        cpu: l,
        cpucores: k,
        cpulogicalcores: m,
        cpuaddresswidth: p,
        cpumaxclockspeed: n,
        rammegabytes: q,
        ramspeed: t,
      },
      z,
      A,
      C
    );
  };
  a.serverHeartbeat = function (
    d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m,
    p,
    n,
    q,
    t,
    z,
    A,
    C,
    w,
    B,
    u
  ) {
    this.call(
      510,
      {
        serverid: d,
        appdomains: b,
        servertypes: e,
        machinecpu: c,
        processcpu: f,
        memoryusage: g,
        avaliablememory: h,
        freememory: l,
        runningrooms: k,
        usedresources: m,
        apirequests: p,
        apirequestserror: n,
        apirequestsfailed: q,
        apirequestsexecuting: t,
        apirequestsqueued: z,
        apirequeststime: A,
        serverunixtimeutc: C,
      },
      w,
      B,
      u
    );
  };
  a.getGameAssemblyUrl = function (d, b, e, c, f, g) {
    this.call(
      513,
      { clusteraccesskey: d, gamecodeid: b, machineid: e },
      c,
      f,
      g
    );
  };
  a.devServerLogin = function (d, b, e, c, f) {
    this.call(524, { username: d, password: b }, e, c, f);
  };
  a.webserviceOnlineTest = function (d, b, e) {
    this.call(533, {}, d, b, e);
  };
  a.getServerInfo = function (d, b, e, c) {
    this.call(540, { machineid: d }, b, e, c);
  };
  a.socialRefresh = function (d, b, e) {
    this.call(601, {}, d, b, e);
  };
  a.socialLoadProfiles = function (d, b, e, c) {
    this.call(604, { userids: d }, b, e, c);
  };
})();
PlayerIOError = function (a, d, b) {
  this.code = a;
  this.message = d;
  this.stack = b;
  this.stack ||
    ((b = Error()), (this.stack = b.stack || b.stacktrace || b.StackTrace));
  this.toString = function () {
    return "PlayerIOError[" + a + "]: " + d;
  };
};
PlayerIOError.prototype = Error();
PlayerIOErrorCode = {
  UnsupportedMethod: "UnsupportedMethod",
  GeneralError: "GeneralError",
  InternalError: "InternalError",
  AccessDenied: "AccessDenied",
  InvalidMessageFormat: "InvalidMessageFormat",
  MissingValue: "MissingValue",
  GameRequired: "GameRequired",
  ExternalError: "ExternalError",
  ArgumentOutOfRange: "ArgumentOutOfRange",
  GameDisabled: "GameDisabled",
  UnknownGame: "UnknownGame",
  UnknownConnection: "UnknownConnection",
  InvalidAuth: "InvalidAuth",
  NoServersAvailable: "NoServersAvailable",
  RoomDataTooLarge: "RoomDataTooLarge",
  RoomAlreadyExists: "RoomAlreadyExists",
  UnknownRoomType: "UnknownRoomType",
  UnknownRoom: "UnknownRoom",
  MissingRoomId: "MissingRoomId",
  RoomIsFull: "RoomIsFull",
  NotASearchColumn: "NotASearchColumn",
  QuickConnectMethodNotEnabled: "QuickConnectMethodNotEnabled",
  UnknownUser: "UnknownUser",
  InvalidPassword: "InvalidPassword",
  InvalidRegistrationData: "InvalidRegistrationData",
  InvalidBigDBKey: "InvalidBigDBKey",
  BigDBObjectTooLarge: "BigDBObjectTooLarge",
  BigDBObjectDoesNotExist: "BigDBObjectDoesNotExist",
  UnknownTable: "UnknownTable",
  UnknownIndex: "UnknownIndex",
  InvalidIndexValue: "InvalidIndexValue",
  NotObjectCreator: "NotObjectCreator",
  KeyAlreadyUsed: "KeyAlreadyUsed",
  StaleVersion: "StaleVersion",
  CircularReference: "CircularReference",
  HeartbeatFailed: "HeartbeatFailed",
  InvalidGameCode: "InvalidGameCode",
  VaultNotLoaded: "VaultNotLoaded",
  UnknownPayVaultProvider: "UnknownPayVaultProvider",
  DirectPurchaseNotSupportedByProvider: "DirectPurchaseNotSupportedByProvider",
  BuyingCoinsNotSupportedByProvider: "BuyingCoinsNotSupportedByProvider",
  NotEnoughCoins: "NotEnoughCoins",
  ItemNotInVault: "ItemNotInVault",
  InvalidPurchaseArguments: "InvalidPurchaseArguments",
  InvalidPayVaultProviderSetup: "InvalidPayVaultProviderSetup",
  UnknownPartnerPayAction: "UnknownPartnerPayAction",
  InvalidType: "InvalidType",
  IndexOutOfBounds: "IndexOutOfBounds",
  InvalidIdentifier: "InvalidIdentifier",
  InvalidArgument: "InvalidArgument",
  LoggedOut: "LoggedOut",
  InvalidSegment: "InvalidSegment",
  GameRequestsNotLoaded: "GameRequestsNotLoaded",
  AchievementsNotLoaded: "AchievementsNotLoaded",
  UnknownAchievement: "UnknownAchievement",
  NotificationsNotLoaded: "NotificationsNotLoaded",
  InvalidNotificationsEndpoint: "InvalidNotificationsEndpoint",
  NetworkIssue: "NetworkIssue",
  OneScoreNotLoaded: "OneScoreNotLoaded",
  PublishingNetworkNotAvailable: "PublishingNetworkNotAvailable",
  PublishingNetworkNotLoaded: "PublishingNetworkNotLoaded",
  DialogClosed: "DialogClosed",
  AdTrackCheckCookie: "AdTrackCheckCookie",
  codes: {
    0: "UnsupportedMethod",
    1: "GeneralError",
    2: "InternalError",
    3: "AccessDenied",
    4: "InvalidMessageFormat",
    5: "MissingValue",
    6: "GameRequired",
    7: "ExternalError",
    8: "ArgumentOutOfRange",
    9: "GameDisabled",
    10: "UnknownGame",
    11: "UnknownConnection",
    12: "InvalidAuth",
    13: "NoServersAvailable",
    14: "RoomDataTooLarge",
    15: "RoomAlreadyExists",
    16: "UnknownRoomType",
    17: "UnknownRoom",
    18: "MissingRoomId",
    19: "RoomIsFull",
    20: "NotASearchColumn",
    21: "QuickConnectMethodNotEnabled",
    22: "UnknownUser",
    23: "InvalidPassword",
    24: "InvalidRegistrationData",
    25: "InvalidBigDBKey",
    26: "BigDBObjectTooLarge",
    27: "BigDBObjectDoesNotExist",
    28: "UnknownTable",
    29: "UnknownIndex",
    30: "InvalidIndexValue",
    31: "NotObjectCreator",
    32: "KeyAlreadyUsed",
    33: "StaleVersion",
    34: "CircularReference",
    40: "HeartbeatFailed",
    41: "InvalidGameCode",
    50: "VaultNotLoaded",
    51: "UnknownPayVaultProvider",
    52: "DirectPurchaseNotSupportedByProvider",
    54: "BuyingCoinsNotSupportedByProvider",
    55: "NotEnoughCoins",
    56: "ItemNotInVault",
    57: "InvalidPurchaseArguments",
    58: "InvalidPayVaultProviderSetup",
    70: "UnknownPartnerPayAction",
    80: "InvalidType",
    81: "IndexOutOfBounds",
    82: "InvalidIdentifier",
    83: "InvalidArgument",
    84: "LoggedOut",
    90: "InvalidSegment",
    100: "GameRequestsNotLoaded",
    110: "AchievementsNotLoaded",
    111: "UnknownAchievement",
    120: "NotificationsNotLoaded",
    121: "InvalidNotificationsEndpoint",
    130: "NetworkIssue",
    131: "OneScoreNotLoaded",
    200: "PublishingNetworkNotAvailable",
    201: "PublishingNetworkNotLoaded",
    301: "DialogClosed",
    302: "AdTrackCheckCookie",
  },
};
(function () {
  _pio.client = function (a, d, b, e) {
    this.connectUserId = e;
    this.gameId = d;
    this.gameFS = new _pio.gameFS(d, b);
    this.errorLog = new _pio.errorLog(a);
    this.payVault = new _pio.payVault(a);
    this.bigDB = new _pio.bigDB(a);
    this.multiplayer = new _pio.multiplayer(a);
    this.gameRequests = new _pio.gameRequests(a);
    this.achievements = new _pio.achievements(a);
    this.playerInsight = new _pio.playerInsight(a);
    this.oneScore = new _pio.oneScore(a);
    this.leaderboards = new _pio.leaderboards(a, this.connectUserId);
    this.notifications = new _pio.notifications(a);
    this.publishingNetwork = new _pio.publishingNetwork(a, this.connectUserId);
  };
})();
(function () {
  var a = {};
  _pio.gameFS = function (d, b) {
    if ("string" == typeof b && 0 < b.length) {
      var e = (b || "").split("|");
      if (1 <= e.length)
        for (var c = (a[d.toLowerCase()] = {}), f = 0; f != e.length; f++) {
          var g = e[f];
          "alltoredirect" == g || "cdnmap" == g
            ? (c.baseUrl = e[f + 1])
            : "alltoredirectsecure" == g || "cdnmapsecure" == g
            ? (c.secureBaseUrl = e[f + 1])
            : (c["." + g] = e[f + 1]);
        }
    }
    this.getUrl = function (h, l) {
      if ("/" == !h[0])
        throw _pio.error(
          "The path given to getUrl must start with a slash, like: '/myfile.swf' or '/folder/file.jpg'"
        );
      var k = a[d];
      return k
        ? (l ? k.secureBaseUrl : k.baseUrl) + (k["." + h] || h)
        : (l ? "https" : "http") + "://r.playerio.com/r/" + d + h;
    };
  };
})();
(function () {
  _pio.gameRequests = function (a) {
    function d(c) {
      if (null == c || 0 == c.length) return [];
      for (var f = [], g = 0; g != c.length; g++) {
        var h = c[g];
        f.push(
          new _pio.gameRequest(h.id, h.type, h.senderuserid, h.created, h.data)
        );
      }
      return f;
    }
    var b = [];
    this.waitingRequests =
      "[ERROR: You tried to access gameRequests.waitingRequests before loading waiting requests. You have to call the refresh method first.]";
    var e = this;
    this.send = function (c, f, g, h, l) {
      a.gameRequestsSend(c, _pio.convertToKVArray(f), g, h, l, function (k) {});
    };
    this.refresh = function (c, f) {
      a.gameRequestsRefresh(b, c, f, function (g) {
        e._playCodes = g.newplaycodes;
        e.waitingRequests = d(g.requests);
      });
    };
    this["delete"] = function (c, f, g) {
      if ("object" == typeof c || c.length) {
        for (var h = [], l = 0; l != c.length; l++) {
          var k = c[l].id;
          if (k) h.push(k);
          else {
            c = _pio.error(
              "No GameRequest id found on item#" +
                l +
                ". You have to use requests from the gameRequests.waitingRequests array. For instance: client.gameRequests.delete(client.gameRequests.waitingRequests, ...)"
            );
            _pio.handleError(c, g, c.code, c.message);
            return;
          }
        }
        a.gameRequestsDelete(h, f, g, function (m) {
          e.waitingRequests = d(m.requests);
        });
      } else
        (c = _pio.error(
          "The first argument to delete should be an array: client.gameRequests.delete([requests], ...)"
        )),
          _pio.handleError(c, g, c.code, c.message);
    };
  };
  _pio.gameRequest = function (a, d, b, e, c) {
    this.id = a;
    this.type = d;
    this.senderUserId = b;
    this.created = new Date(e);
    this.data = _pio.convertFromKVArray(c);
  };
})();
(function () {
  _pio.errorLog = function (a) {
    this.writeError = function (d, b, e, c) {
      a.writeError("Javascript", d, b, e, _pio.convertToKVArray(c));
    };
  };
})();
(function () {
  _pio.quickConnect = function () {
    this.simpleGetCaptcha = function (a, d, b, e, c) {
      new _pio.channel().simpleGetCaptcha(a, d, b, e, c, function (f) {
        return new _pio.simpleGetCaptchaOutput(f.captchakey, f.captchaimageurl);
      });
    };
    this.simpleRecoverPassword = function (a, d, b, e) {
      new _pio.channel().simpleRecoverPassword(a, d, b, e, function (c) {});
    };
  };
  _pio.simpleGetCaptchaOutput = function (a, d) {
    this.captchaKey = a;
    this.captchaImageUrl = d;
  };
  PlayerIO.quickConnect = new _pio.quickConnect();
})();
(function () {
  _pio.payVault = function (a) {
    function d(c) {
      if (
        null != c &&
        ((b = c.version),
        (e.coins = c.coins || 0),
        (e.items = []),
        c.items && c.items.length)
      )
        for (var f = 0; f != c.items.length; f++) {
          var g = c.items[f],
            h = (e.items[f] = new _pio.vaultItem(
              g.id,
              g.itemkey,
              new Date().setTime(g.purchasedate)
            ));
          _pio.bigDBDeserialize(g.properties, h, !0);
        }
    }
    var b = null;
    this.coins =
      "[ERROR: you tried to access payVault.coins before the vault was loaded. You have to refresh the vault before the .coins property is set to the right value]";
    this.items =
      "[ERROR: you tried to access payVault.items before the vault was loaded. You have to refresh the vault before the .items property is set to the right value]";
    this.has = function (c) {
      if (null == b)
        throw new PlayerIOError(
          PlayerIOErrorCode.VaultNotLoaded,
          "Cannot access items before vault has been loaded. Please refresh the vault first"
        );
      for (var f = 0; f != this.items.length; f++)
        if (this.items[f].itemKey == c) return !0;
      return !1;
    };
    this.first = function (c) {
      if (null == b)
        throw new PlayerIOError(
          PlayerIOErrorCode.VaultNotLoaded,
          "Cannot access items before vault has been loaded. Please refresh the vault first"
        );
      for (var f = 0; f != this.items.length; f++)
        if (this.items[f].itemKey == c) return this.items[f];
      return null;
    };
    this.count = function (c) {
      if (null == b)
        throw new PlayerIOError(
          PlayerIOErrorCode.VaultNotLoaded,
          "Cannot access items before vault has been loaded. Please refresh the vault first"
        );
      for (var f = 0, g = 0; g != this.items.length; g++)
        this.items[g].itemKey == c && f++;
      return f;
    };
    this.refresh = function (c, f) {
      a.payVaultRefresh(b, null, c, f, function (g) {
        d(g.vaultcontents);
      });
    };
    this.readHistory = function (c, f, g, h) {
      a.payVaultReadHistory(c, f, null, g, h, function (l) {
        for (var k = [], m = 0; m != l.entries.length; m++) {
          var p = l.entries[m];
          k.push(
            new _pio.payVaultHistoryEntry(
              p.type,
              p.amount,
              p.timestamp,
              p.itemkeys || [],
              p.reason,
              p.providertransactionid,
              p.providerprice
            )
          );
        }
        return k;
      });
    };
    this.credit = function (c, f, g, h) {
      a.payVaultCredit(c, f, null, g, h, function (l) {
        d(l.vaultcontents);
      });
    };
    this.debit = function (c, f, g, h) {
      a.payVaultDebit(c, f, null, g, h, function (l) {
        d(l.vaultcontents);
      });
    };
    this.consume = function (c, f, g) {
      if ("object" == typeof c || c.length) {
        for (var h = [], l = 0; l != c.length; l++) {
          var k = c[l].id;
          if (k) h.push(k);
          else {
            c = _pio.error(
              "No PayVault item id found on item#" +
                l +
                ". You have to use items from the payVault.items array. For instance: client.payVault.consume([client.payVault.first('sportscar')], ...)"
            );
            _pio.handleError(c, g, c.code, c.message);
            return;
          }
        }
        a.payVaultConsume(h, null, f, g, function (m) {
          d(m.vaultcontents);
        });
      } else
        (c = _pio.error(
          "The first argument to consume should be an array: client.payVault.consume([item], ...)"
        )),
          _pio.handleError(c, g, c.code, c.message);
    };
    this.buy = function (c, f, g, h) {
      a.payVaultBuy(_pio.convertBuyItems(c), f, null, g, h, function (l) {
        d(l.vaultcontents);
      });
    };
    this.give = function (c, f, g) {
      a.payVaultGive(_pio.convertBuyItems(c), null, f, g, function (h) {
        d(h.vaultcontents);
      });
    };
    this.getBuyCoinsInfo = function (c, f, g, h) {
      a.payVaultPaymentInfo(
        c,
        _pio.convertToKVArray(f),
        null,
        g,
        h,
        function (l) {
          return _pio.convertFromKVArray(l.providerarguments);
        }
      );
    };
    this.getBuyDirectInfo = function (c, f, g, h, l) {
      a.payVaultPaymentInfo(
        c,
        _pio.convertToKVArray(f),
        _pio.convertBuyItems(g),
        h,
        l,
        function (k) {
          return _pio.convertFromKVArray(k.providerarguments);
        }
      );
    };
    var e = this;
  };
  _pio.convertBuyItems = function (a) {
    if (null == a) return [];
    for (var d = [], b = 0; b != a.length; b++) {
      var e = a[b].itemkey;
      if (!e)
        throw _pio.error(
          "You have to specify an itemkey for the payvault item. Example:  {itemkey:'car'}"
        );
      d.push({
        itemkey: e,
        payload: _pio.compareForChanges({ itemkey: e }, a[b], !0, !0),
      });
    }
    return d;
  };
  _pio.vaultItem = function (a, d, b) {
    this.id = a;
    this.itemKey = d;
    this.purchaseDate = b;
  };
  _pio.payVaultHistoryEntry = function (a, d, b, e, c, f, g) {
    this.type = a;
    this.amount = d;
    this.timestamp = new Date().setTime(b);
    this.itemKeys = e;
    this.reason = c;
    this.providerTransactionId = f;
    this.providerPrice = g;
  };
})();
(function () {
  _pio.bigDB = function (a) {
    function d() {
      for (var f = 0; f < c.length; f++) {
        var g = c[f],
          h = !0,
          l;
        for (l in g.objects)
          if (g.objects[l]._internal_("get-is-saving")) {
            h = !1;
            break;
          }
        if (h) {
          for (l in g.objects)
            for (h = f + 1; h < c.length; h++) {
              futureSave = c[h];
              for (var k = 0; k < futureSave.objects.length; k++)
                futureSave.objects[k] == g.objects[l] &&
                  futureSave.fullOverwrite == g.fullOverwrite &&
                  futureSave.useOptimisticLock == g.useOptimisticLock &&
                  ((g.changesets[l] = futureSave.changesets[k]),
                  g.futureSaves.push(futureSave));
            }
          c.splice(f, 1);
          f--;
          g.execute();
        }
      }
    }
    function b(f, g) {
      null == f ? (f = []) : f instanceof Array || (f = [f]);
      null != g && (f = f.concat([g]));
      for (var h = [], l = 0; l != f.length; l++) {
        var k = f[l];
        switch (typeof k) {
          case "boolean":
            h.push({ valuetype: _pio.ValueType.Bool, bool: k });
            break;
          case "string":
            h.push({ valuetype: _pio.ValueType.String, string: k });
            break;
          case "number":
            0 != k % 1
              ? h.push({ valuetype: _pio.ValueType.Double, double: k })
              : -2147483648 < k && 2147483647 > k
              ? h.push({ valuetype: _pio.ValueType.Int, int: k })
              : 0 < k && 4294967295 > k
              ? h.push({ valuetype: _pio.ValueType.UInt, uint: k })
              : h.push({ valuetype: _pio.ValueType.Long, long: k });
            break;
          case "object":
            if (k.getTime && k.getMilliseconds)
              h.push({
                valuetype: _pio.ValueType.DateTime,
                datetime: k.getTime(),
              });
            else
              throw Error(
                "Don't know how to serialize type '" + typeof k + "' for BigDB"
              );
            break;
          default:
            throw Error(
              "Don't know how to serialize type '" + typeof k + "' for BigDB"
            );
        }
      }
      return h;
    }
    var e = this,
      c = [];
    this.createObject = function (f, g, h, l, k) {
      var m = _pio.compareForChanges({}, h || {}, !0, !0);
      a.createObjects(
        [{ key: g, table: f, properties: m }],
        !1,
        l,
        k,
        function (p) {
          if (1 == p.objects.length)
            return new _pio.databaseobject(
              e,
              f,
              p.objects[0].key,
              p.objects[0].version,
              !1,
              m
            );
          throw new PlayerIOError(
            PlayerIOErrorCode.GeneralError,
            "Error creating object"
          );
        }
      );
    };
    this.loadMyPlayerObject = function (f, g) {
      a.loadMyPlayerObject(f, g, function (h) {
        return new _pio.databaseobject(
          e,
          "PlayerObjects",
          h.playerobject.key,
          h.playerobject.version,
          !0,
          h.playerobject.properties
        );
      });
    };
    this.load = function (f, g, h, l) {
      a.loadObjects([{ table: f, keys: [g] }], h, l, function (k) {
        if (1 == k.objects.length)
          return null == k.objects[0]
            ? null
            : new _pio.databaseobject(
                e,
                f,
                k.objects[0].key,
                k.objects[0].version,
                !1,
                k.objects[0].properties
              );
        throw new PlayerIOError(
          PlayerIOErrorCode.GeneralError,
          "Error loading object"
        );
      });
    };
    this.loadKeys = function (f, g, h, l) {
      a.loadObjects([{ table: f, keys: g }], h, l, function (k) {
        for (var m = [], p = 0; p != k.objects.length; p++) {
          var n = k.objects[p];
          m[p] =
            null == n
              ? null
              : new _pio.databaseobject(
                  e,
                  f,
                  n.key,
                  n.version,
                  !1,
                  n.properties
                );
        }
        return m;
      });
    };
    this.loadOrCreate = function (f, g, h, l) {
      a.createObjects(
        [{ key: g, table: f, properties: [] }],
        !0,
        h,
        l,
        function (k) {
          if (1 == k.objects.length)
            return new _pio.databaseobject(
              e,
              f,
              k.objects[0].key,
              k.objects[0].version,
              !1,
              k.objects[0].properties
            );
          throw new PlayerIOError(
            PlayerIOErrorCode.GeneralError,
            "Error creating object"
          );
        }
      );
    };
    this.deleteKeys = function (f, g, h, l) {
      a.deleteObjects([{ table: f, keys: g }], h, l, function (k) {
        return null;
      });
    };
    this.loadKeysOrCreate = function (f, g, h, l) {
      for (var k = [], m = 0; m != g.length; m++)
        k.push({ key: g[m], table: f, properties: [] });
      a.createObjects(k, !0, h, l, function (p) {
        for (var n = [], q = 0; q != p.objects.length; q++) {
          var t = p.objects[q];
          n[q] = new _pio.databaseobject(
            e,
            f,
            t.key,
            t.version,
            !1,
            t.properties
          );
        }
        return n;
      });
    };
    this.loadSingle = function (f, g, h, l, k) {
      a.loadMatchingObjects(f, g, b(h), 1, l, k, function (m) {
        return 0 == m.objects.length
          ? null
          : new _pio.databaseobject(
              e,
              f,
              m.objects[0].key,
              m.objects[0].version,
              !1,
              m.objects[0].properties
            );
      });
    };
    this.loadRange = function (f, g, h, l, k, m, p, n) {
      a.loadIndexRange(f, g, b(h, l), b(h, k), m, p, n, function (q) {
        for (var t = [], z = 0; z != q.objects.length; z++) {
          var A = q.objects[z];
          t[z] =
            null == A
              ? null
              : new _pio.databaseobject(
                  e,
                  f,
                  A.key,
                  A.version,
                  !1,
                  A.properties
                );
        }
        return t;
      });
    };
    this.deleteRange = function (f, g, h, l, k, m, p) {
      a.deleteIndexRange(f, g, b(h, l), b(h, k), m, p, function () {});
    };
    this.saveChanges = function (f, g, h, l, k, m) {
      var p = 1 == m;
      m = [];
      for (var n in h) {
        var q = h[n];
        if (
          !(q.existsInDatabase && q.key && q.table && q._internal_ && q.save)
        ) {
          f = _pio.error(
            "You can only save database objects that exist in the database"
          );
          _pio.handleError(f, k, f.code, f.message);
          return;
        }
        var t = _pio.compareForChanges(
          g ? {} : q._internal_("get-dbCurrent"),
          q,
          !0,
          !0
        );
        (g || 0 < t.length) &&
          m.push({
            key: q._internal_("get-key"),
            table: q._internal_("get-table"),
            fulloverwrite: g,
            onlyifversion: f ? q._internal_("get-version") : null,
            changes: t,
          });
      }
      c.push({
        objects: h,
        changesets: m,
        fullOverwrite: g,
        useOptimisticLock: f,
        futureSaves: [],
        setIsSavingOnAll: function (z) {
          for (var A = 0; A != this.objects.length; A++)
            this.objects[A]._internal_("set-is-saving", z);
        },
        done: function () {
          this.setIsSavingOnAll(!1);
          d();
        },
        execute: function () {
          var z = this;
          z.setIsSavingOnAll(!0);
          0 < z.changesets.length
            ? a.saveObjectChanges(
                _pio.LockType.LockAll,
                z.changesets,
                p,
                l,
                function (A) {
                  z.done();
                  _pio.handleError(A, k, A.code, A.message);
                },
                function (A) {
                  for (var C = 0; C != z.objects.length; C++) {
                    var w = z.objects[C];
                    w._internal_("set-version", A.versions[C]);
                    w._internal_("change-dbCurrent", z.changesets[C].changes);
                    for (var B = 0; B != z.futureSaves.length; B++)
                      for (
                        var u = z.futureSaves[B], r = 0;
                        r < u.objects.length;
                        r++
                      )
                        u.objects[r] == w &&
                          (u.changesets.splice(r, 1),
                          u.objects.splice(r, 1),
                          r--);
                  }
                  z.done();
                }
              )
            : (z.done(), setTimeout(l, 1));
        },
      });
      d();
    };
  };
  _pio.databaseobject = function (a, d, b, e, c, f) {
    var g = {},
      h = !1;
    _pio.bigDBDeserialize(f, g, !0);
    this.table = d;
    this.key = b;
    this.existsInDatabase = !0;
    this.save = function (l, k, m, p) {
      a.saveChanges(l, k, [this], m, p, c);
    };
    this._internal_ = function (l, k) {
      switch (l) {
        case "get-table":
          return d;
        case "get-key":
          return b;
        case "set-is-saving":
          h = k;
        case "get-is-saving":
          return h;
        case "get-version":
          return e;
        case "set-version":
          e = k;
        case "get-dbCurrent":
          return g;
        case "change-dbCurrent":
          _pio.bigDBDeserialize(k, g, !0);
      }
    };
    _pio.bigDBDeserialize(f, this, !0);
  };
  _pio.compareForChanges = function (a, d, b, e) {
    var c = [],
      f;
    for (f in d) {
      var g = d[f],
        h = a ? a[f] : null;
      switch (f) {
        case "table":
          if (e) continue;
        case "key":
          if (e) continue;
        case "save":
          if (e) continue;
        case "existsInDatabase":
          if (e) continue;
        case "_internal_":
          if (e) continue;
        case "_circular_reference_finder_":
          continue;
      }
      if (null != g) {
        var l = b ? { name: f } : { index: parseInt(f) };
        switch (typeof g) {
          case "boolean":
            g != h &&
              ((l.value = { valuetype: _pio.ValueType.Bool, bool: g }),
              c.push(l));
            break;
          case "number":
            g != h &&
              (isFinite(g) && Math.floor(g) === g
                ? (l.value =
                    -2147483648 <= g && 2147483647 >= g
                      ? { valuetype: _pio.ValueType.Int, int: g }
                      : 0 < g && 4294967295 >= g
                      ? { valuetype: _pio.ValueType.UInt, uint: g }
                      : -0x7ffffffffffffc00 <= g && 0x7ffffffffffffc00 >= g
                      ? { valuetype: _pio.ValueType.Long, long: g }
                      : 0 < g && 1.844674407370955e19 >= g
                      ? { valuetype: _pio.ValueType.ULong, ulong: g }
                      : { valuetype: _pio.ValueType.Double, double: g })
                : (l.value = { valuetype: _pio.ValueType.Double, double: g }),
              c.push(l));
            break;
          case "string":
            g != h &&
              ((l.value = { valuetype: _pio.ValueType.String, string: g }),
              c.push(l));
            break;
          case "object":
            if (g.getTime && g.getMilliseconds)
              g + "" != h + "" &&
                ((l.value = {
                  valuetype: _pio.ValueType.DateTime,
                  datetime: g.getTime(),
                }),
                c.push(l));
            else {
              if (g._circular_reference_finder_)
                throw new PlayerIOError(
                  PlayerIOErrorCode.CircularReference,
                  "The object you're trying to save contains a circular reference for " +
                    (b ? "a property named" : "the array entry") +
                    "): " +
                    f
                );
              g._circular_reference_finder_ = !0;
              var k = g instanceof Array;
              if (k && g.bytearray) {
                k = Array(g.length);
                for (h = 0; h != k.length; h++) {
                  var m = g[h];
                  if (0 <= m && 255 >= m) k[h] = m;
                  else
                    throw new PlayerIOError(
                      PlayerIOErrorCode.GeneralError,
                      "The bytearray property '" +
                        f +
                        "' was supposed to only contain byte (0-255) values, but contained the value: " +
                        m
                    );
                }
                l.value = { valuetype: _pio.ValueType.ByteArray, bytearray: k };
              } else
                (h = _pio.compareForChanges(h, g, !k, !1)),
                  (l.value = k
                    ? { valuetype: _pio.ValueType.Array, arrayproperties: h }
                    : { valuetype: _pio.ValueType.Obj, objectproperties: h });
              c.push(l);
              delete g._circular_reference_finder_;
            }
            break;
          case "undefined":
            break;
          case "function":
            break;
          default:
            throw Error(
              "Don't know how to serialize type '" + typeof g + "' for BigDB"
            );
        }
      }
    }
    for (f in a)
      (null != d[f] && "undefined" != typeof d[f]) ||
        c.push(b ? { name: f } : { index: parseInt(f) });
    return c;
  };
  _pio.bigDBDeserialize = function (a, d, b) {
    for (var e in a) {
      var c = a[e],
        f = b ? c.name : c.index || 0;
      if ((c = c.value))
        switch (c.valuetype || 0) {
          case _pio.ValueType.String:
            d[f] = c.string || "";
            break;
          case _pio.ValueType.Int:
            d[f] = c["int"] || 0;
            break;
          case _pio.ValueType.UInt:
            d[f] = c.uint || 0;
            break;
          case _pio.ValueType.Long:
            d[f] = c["long"] || 0;
            break;
          case _pio.ValueType.Bool:
            d[f] = c.bool || 0;
            break;
          case _pio.ValueType.Float:
            d[f] = c["float"] || 0;
            break;
          case _pio.ValueType.Double:
            d[f] = c["double"] || 0;
            break;
          case _pio.ValueType.ByteArray:
            d[f] = c.bytearray;
            d[f].bytearray = !0;
            break;
          case _pio.ValueType.DateTime:
            d[f] = new Date(c.datetime || 0);
            break;
          case _pio.ValueType.Array:
            var g = d[f] instanceof Array ? d[f] : [];
            _pio.bigDBDeserialize(c.arrayproperties, g, !1);
            d[f] = g;
            break;
          case _pio.ValueType.Obj:
            (g = "object" == typeof d[f] ? d[f] : {}),
              _pio.bigDBDeserialize(c.objectproperties, g, !0),
              (d[f] = g);
        }
      else delete d[f];
    }
  };
})();
(function () {
  _pio.multiplayer = function (b) {
    var e = this;
    this.developmentServer = null;
    this.useSecureConnections = !1;
    this.createRoom = function (c, f, g, h, l, k) {
      b.createRoom(
        c,
        f,
        g,
        _pio.convertToKVArray(h),
        null != e.developmentServer,
        l,
        k,
        function (m) {
          return m.roomid;
        }
      );
    };
    this.joinRoom = function (c, f, g, h) {
      clearTimeout(
        setTimeout(function () {
          g(new _pio.connection());
        }, 1e4)
      );
      var l = Error();
      b.joinRoom(
        c,
        _pio.convertToKVArray(f),
        null != e.developmentServer,
        e.useSecureConnections,
        function () {},
        h,
        function (k) {
          return new _pio.connection(
            l,
            e.developmentServer,
            e.useSecureConnections,
            k.endpoints,
            k.joinkey,
            f || {},
            g,
            h
          );
        }
      );
    };
    this.createJoinRoom = function (c, f, g, h, l, k, m) {
      clearTimeout(
        setTimeout(function () {
          k(new _pio.connection());
        }, 1e4)
      );
      var p = Error();
      b.createJoinRoom(
        c,
        f,
        g,
        _pio.convertToKVArray(h),
        _pio.convertToKVArray(l),
        null != e.developmentServer,
        e.useSecureConnections,
        function () {},
        m,
        function (n) {
          return new _pio.connection(
            p,
            e.developmentServer,
            e.useSecureConnections,
            n.endpoints,
            n.joinkey,
            l || {},
            k,
            m
          );
        }
      );
    };
    this.listRooms = function (c, f, g, h, l, k) {
      b.listRooms(
        c,
        _pio.convertToKVArray(f),
        g,
        h,
        null != e.developmentServer,
        l,
        k,
        function (m) {
          var p = [];
          if (m.rooms && 0 < m.rooms.length)
            for (var n = 0; n != m.rooms.length; n++) {
              var q = m.rooms[n];
              p.push(
                new _pio.roomInfo(
                  q.id,
                  q.roomtype,
                  q.onlineusers,
                  _pio.convertFromKVArray(q.roomdata)
                )
              );
            }
          return p;
        }
      );
    };
  };
  _pio.websocketConnection = function (b, e, c, f, g, h, l) {
    var k = this,
      m = !1,
      p = new _pio.messageSerializer(),
      n = !1,
      q = null;
    e = (e ? "wss://" : "ws://") + c + "/";
    try {
      q =
        "undefined" != typeof MozWebSocket
          ? new MozWebSocket(e)
          : new WebSocket(e);
    } catch (z) {
      g(!1, "" + z);
      return;
    }
    var t = setTimeout(function () {
      m || ((m = !0), g(!1, "Connect attempt timed out"));
    }, f);
    q.onopen = function () {
      m || (clearTimeout(t), (n = m = !0), g(n));
    };
    q.onclose = function (z) {
      k.disconnect();
    };
    q.onerror = function (z) {
      k.disconnect();
    };
    q.onmessage = function (z) {
      if (n)
        if (b) {
          var A = new FileReader();
          A.onloadend = function () {
            for (
              var C = new Uint8Array(A.result), w = Array(C.length), B = 0;
              B != C.length;
              B++
            )
              w[B] = C[B];
            l(p.deserializeMessage(w, 0, w.length));
          };
          A.readAsArrayBuffer(z.data);
        } else
          (z = _pio.base64decode(z.data)),
            l(p.deserializeMessage(z, 0, z.length));
    };
    this.disconnect = function () {
      if (n) {
        n = !1;
        h();
        try {
          q.close();
        } catch (z) {
          _pio.debugLog(z);
        }
      }
    };
    this.sendMessage = function (z) {
      z = p.serializeMessage(z);
      if (b) {
        for (var A = new Uint8Array(z.length), C = 0; C < z.length; C++)
          A[C] = z[C];
        q.send(A.buffer);
      } else (z = _pio.base64encode(z)), q.send(z);
    };
  };
  _pio.connection = function (b, e, c, f, g, h, l, k) {
    function m(B) {
      function u() {
        if (0 < y.length) {
          var I = y[0];
          y.splice(0, 1);
          var Y = B(
            c,
            I,
            4e3,
            function (X, fa) {
              if (X) {
                A = Y;
                p.connected = !0;
                var oa = p.createMessage("join");
                oa.addString(g);
                if (null != h)
                  for (var ta in h) oa.addString(ta), oa.addString("" + h[ta]);
                p.sendMessage(oa);
              } else
                _pio.debugLog(
                  "Unable to connect to endpoint: " +
                    I +
                    '. reason: "' +
                    fa +
                    (0 < y.length
                      ? '". Trying next endpoint.'
                      : '". No more endpoints to try.')
                ),
                  u();
            },
            function (X) {
              p.connected &&
                ((p.connected = !1),
                setTimeout(function () {
                  for (var fa = 0; fa != q.length; fa++)
                    _pio.runCallback(q[fa].callback, p, q[fa].stackSource);
                }, 100));
            },
            function (X) {
              n
                ? "playerio.joinresult" == X.type
                  ? ((n = !1),
                    X.getBoolean(0)
                      ? _pio.runCallback(l, p, null)
                      : _pio.handleError(b, k, X.getInt(1), X.getString(2)))
                  : _pio.handleError(
                      b,
                      k,
                      PlayerIOErrorCode.GeneralError,
                      "The expected inital messagetype is: playerio.joinresult, received: " +
                        joinResult.getType()
                    )
                : (r(X.type, X), r("*", X));
            }
          );
        } else
          _pio.handleError(
            b,
            k,
            PlayerIOErrorCode.GeneralError,
            "Could not establish a socket connection to any of the given endpoints for the room"
          );
      }
      function r(I, Y) {
        var X = t[I];
        if (X)
          for (var fa = 0; fa < X.length; fa++)
            _pio.runCallback(X[fa].callback, Y, X[fa].stackSource);
      }
      var y = [];
      if (e) y.push(e);
      else
        for (var J = 0; J != f.length; J++)
          y.push(f[J].address + ":" + f[J].port);
      u();
    }
    var p = this,
      n = !0,
      q = [],
      t = {},
      z = [],
      A = null,
      C = /(WebKit|Firefox|Trident)\/([0-9]+)/gi.exec(navigator.userAgent),
      w = C && 3 <= C.length ? C[1] : null;
    C = C && 3 <= C.length ? parseInt(C[2]) : null;
    (window.FileReader && "WebKit" == w && 535 <= C) ||
    ("Firefox" == w && 11 <= C) ||
    ("Trident" == w && 6 <= C)
      ? m(function (B, u, r, y, J, I) {
          return new _pio.websocketConnection(!0, B, u, r, y, J, I);
        })
      : _pio.isFlashFallbackEnabled(function (B) {
          B
            ? m(function (u, r, y, J, I, Y) {
                return new _pio.flashSocketConnection(r, y, J, I, Y);
              })
            : m(function (u, r, y, J, I, Y) {
                return new _pio.websocketConnection(!1, u, r, y, J, I, Y);
              });
        });
    this.connected = !1;
    this.addDisconnectCallback = function (B) {
      q.push({ callback: B, stackSourc: Error() });
    };
    this.addMessageCallback = function (B, u) {
      null == B && (B = "*");
      var r = t[B];
      r || (t[B] = r = []);
      r.push({ callback: u, stackSource: Error() });
    };
    this.removeDisconnectCallback = function (B) {
      for (var u = 0; u < q.length; u++)
        q[u].callback == B && (q.splice(u, 1), u--);
    };
    this.removeMessageCallback = function (B) {
      for (var u in t)
        for (var r = t[u], y = 0; y < r.length; y++)
          r[y].callback == B && (r.splice(y, 1), y--);
    };
    this.createMessage = function (B) {
      for (var u = new _pio.message(B), r = 1; r < arguments.length; r++)
        u.add(arguments[r]);
      return u;
    };
    this.send = function (B) {
      var u = this.createMessage.apply(this, arguments);
      this.sendMessage(u);
    };
    this.sendMessage = function (B) {
      p.connected ? A.sendMessage(B) : z.push(B);
    };
    this.disconnect = function () {
      p.connected && A.disconnect();
    };
  };
  _pio.message = function (b) {
    function e(m, p, n, q) {
      if (m) k.push(p), l.push(n), (h.length = k.length);
      else throw _pio.error("The given value (" + p + ") is not " + q);
    }
    function c(m, p) {
      if (m > k.length)
        throw _pio.error(
          "this message (" + h.type + ") only has " + k.length + " entries"
        );
      if (l[m] == p) return k[m];
      throw _pio.error(
        "Value at index:" +
          m +
          " is a " +
          f(l[m]) +
          " and not a " +
          f(p) +
          " as requested. The value is: " +
          k[m]
      );
    }
    function f(m) {
      return {
        0: "Integer",
        1: "Unsigned Integer",
        2: "Long",
        3: "Unsigned Long",
        4: "Double",
        5: "Float",
        6: "String",
        7: "ByteArray",
        8: "Boolean",
      }[m];
    }
    function g(m) {
      var p = "object" == typeof m && "undefined" != typeof m.length;
      if (p)
        for (var n = 0; n != m.length; n++)
          if (255 < m[n] || 0 > m[n]) {
            p = !1;
            break;
          }
      return p;
    }
    var h = this,
      l = [],
      k = [];
    this.type = b;
    this.length = 0;
    this.add = function () {
      for (var m = 0; m < arguments.length; m++) {
        var p = arguments[m];
        switch (typeof p) {
          case "string":
            h.addString(p);
            break;
          case "boolean":
            h.addBoolean(p);
            break;
          case "number":
            if (isFinite(p) && Math.floor(p) === p)
              if (-2147483648 <= p && 2147483647 >= p) {
                h.addInt(p);
                break;
              } else if (0 < p && 4294967295 >= p) {
                h.addUInt(p);
                break;
              } else if (-0x7ffffffffffffc00 <= p && 0x7ffffffffffffc00 >= p) {
                h.addLong(p);
                break;
              } else if (0 < p && 1.844674407370955e19 >= p) {
                h.addULong(p);
                break;
              }
            h.addDouble(p);
            break;
          case "object":
            if (g(p)) {
              this.addByteArray(p);
              break;
            }
          default:
            throw _pio.error(
              "The type of the value (" + p + ") cannot be inferred"
            );
        }
      }
    };
    this.addInt = function (m) {
      e(
        -2147483648 <= m && 2147483647 >= m,
        Math.trunc(m),
        0,
        "an integer (32bit)"
      );
    };
    this.addUInt = function (m) {
      e(
        0 <= m && 4294967295 >= m,
        Math.trunc(m),
        1,
        "an unsigned integer (32bit)"
      );
    };
    this.addLong = function (m) {
      e(
        -0x7ffffffffffffc00 <= m && 0x7ffffffffffffc00 >= m,
        Math.trunc(m),
        2,
        "a long (64bit)"
      );
    };
    this.addULong = function (m) {
      e(0 <= m && 1.844674407370955e19 >= m, m, 3, "an unsigned long (64bit)");
    };
    this.addBoolean = function (m) {
      e(!0, m ? !0 : !1, 8, "a boolean value");
    };
    this.addFloat = function (m) {
      e(!0, Number(m), 5, "a floating point value (32bit)");
    };
    this.addDouble = function (m) {
      e(!0, Number(m), 4, "a double floating point value (64bit)");
    };
    this.addByteArray = function (m) {
      e(g(m), m, 7, "a bytearray");
    };
    this.addString = function (m) {
      e(!0, m + "", 6, "a string");
    };
    this.getInt = function (m) {
      return c(m, 0);
    };
    this.getUInt = function (m) {
      return c(m, 1);
    };
    this.getLong = function (m) {
      return c(m, 2);
    };
    this.getULong = function (m) {
      return c(m, 3);
    };
    this.getBoolean = function (m) {
      return c(m, 8);
    };
    this.getDouble = function (m) {
      return c(m, 4);
    };
    this.getFloat = function (m) {
      return c(m, 5);
    };
    this.getByteArray = function (m) {
      return c(m, 7);
    };
    this.getString = function (m) {
      return c(m, 6);
    };
    this.toString = function () {
      for (var m = "msg.Type = " + this.type, p = 0; p != this.length; p++)
        m += ", msg[" + p + "] = " + k[p] + " (" + f(l[p]) + ")";
      return m;
    };
    this._internal_ = function (m, p) {
      switch (m) {
        case "get-objects":
          return k;
        case "get-types":
          return l;
      }
    };
  };
  _pio.roomInfo = function (b, e, c, f) {
    this.id = b;
    this.roomType = e;
    this.onlineUsers = c;
    this.roomData = f;
  };
  _pio.byteWriter = function () {
    this.bytes = [];
    this.writeByte = function (b) {
      if (0 <= b && 255 >= b) this.bytes.push(b);
      else throw Error("This is not a byte value: " + b);
    };
    this.writeBytes = function (b) {
      for (var e = 0; e != b.length; e++) this.writeByte(b[e]);
    };
    this.writeTagWithLength = function (b, e, c) {
      63 < b || 0 > b
        ? this.writeBottomPatternAndBytes(
            c,
            _pio.binaryserializer.bytesFromInt(b)
          )
        : this.writeByte(e | b);
    };
    this.writeBottomPatternAndBytes = function (b, e) {
      var c = 0;
      0 != e[0] ? (c = 3) : 0 != e[1] ? (c = 2) : 0 != e[2] && (c = 1);
      this.writeByte(b | c);
      for (c = e.length - c - 1; c != e.length; c++) this.writeByte(e[c]);
    };
    this.writeLongPattern = function (b, e, c) {
      for (var f = 0, g = 0; 7 != g; g++)
        if (0 != c[g]) {
          f = 7 - g;
          break;
        }
      3 < f ? this.writeByte(e | (f - 4)) : this.writeByte(b | f);
      for (g = c.length - f - 1; g != c.length; g++) this.writeByte(c[g]);
    };
  };
  _pio.messageSerializer = function () {
    this.serializeMessage = function (b) {
      var e = new _pio.byteWriter();
      e.writeTagWithLength(b.length, 128, 4);
      var c = _pio.binaryserializer.bytesFromString(b.type);
      e.writeTagWithLength(c.length, 192, 12);
      e.writeBytes(c);
      for (var f = 0; f != b.length; f++)
        switch (
          ((c = b._internal_("get-objects")[f]), b._internal_("get-types")[f])
        ) {
          case 6:
            c = _pio.binaryserializer.bytesFromString(c);
            e.writeTagWithLength(c.length, 192, 12);
            e.writeBytes(c);
            break;
          case 0:
            e.writeTagWithLength(c, 128, 4);
            break;
          case 1:
            e.writeBottomPatternAndBytes(
              8,
              _pio.binaryserializer.bytesFromUInt(c)
            );
            break;
          case 2:
            e.writeLongPattern(48, 52, _pio.binaryserializer.bytesFromLong(c));
            break;
          case 3:
            e.writeLongPattern(56, 60, _pio.binaryserializer.bytesFromULong(c));
            break;
          case 7:
            e.writeTagWithLength(c.length, 64, 16);
            e.writeBytes(c);
            break;
          case 4:
            e.writeByte(3);
            e.writeBytes(_pio.binaryserializer.bytesFromDouble(c));
            break;
          case 5:
            e.writeByte(2);
            c = _pio.binaryserializer.bytesFromFloat(c);
            e.writeBytes(c);
            break;
          case 8:
            e.writeByte(c ? 1 : 0);
        }
      return e.bytes;
    };
    this.deserializeMessage = function (b, e, c) {
      var f = e;
      e += c;
      c = null;
      for (var g = 0; f < e; ) {
        var h = 0,
          l = 0,
          k = b[f];
        f++;
        var m = k & 192;
        0 == m && ((m = k & 60), 0 == m && (m = k));
        switch (m) {
          case 12:
          case 16:
            h = (k & 3) + 1;
            if (f + h > e) throw Error("Unexpected: Unfinished message");
            k = h;
            h = _pio.binaryserializer.intFromBytes(b, f, h);
            f += k;
            break;
          case 192:
            h = k & 63;
            break;
          case 128:
            l = k & 63;
            break;
          case 64:
            h = k & 63;
            break;
          case 4:
          case 8:
          case 48:
          case 56:
            h = (k & 3) + 1;
            break;
          case 52:
          case 60:
            h = (k & 3) + 5;
            break;
          case 3:
            h = 8;
            break;
          case 2:
            h = 4;
        }
        if (f + h > e) throw Error("Unexpected: Unfinished message");
        switch (m) {
          case 12:
          case 192:
            null == c
              ? ((c = new _pio.message(
                  _pio.binaryserializer.stringFromBytes(b, f, h)
                )),
                g++)
              : c.addString(_pio.binaryserializer.stringFromBytes(b, f, h));
            break;
          case 4:
            l = _pio.binaryserializer.intFromBytes(b, f, h);
          case 128:
            0 == g ? (g = l) : c.addInt(l);
            break;
          case 16:
          case 64:
            c.addByteArray(b.slice(f, f + h));
            break;
          case 8:
            c.addUInt(_pio.binaryserializer.uintFromBytes(b, f, h));
            break;
          case 48:
          case 52:
            c.addLong(_pio.binaryserializer.longFromBytes(b, f, h));
            break;
          case 56:
          case 60:
            c.addULong(_pio.binaryserializer.ulongFromBytes(b, f, h));
            break;
          case 3:
            c.addDouble(_pio.binaryserializer.doubleFromBytes(b, f, h));
            break;
          case 2:
            c.addFloat(_pio.binaryserializer.floatFromBytes(b, f, h));
            break;
          case 1:
            c.addBoolean(!0);
            break;
          case 0:
            c.addBoolean(!1);
        }
        f += h;
        if (null != c && 0 == --g) return c;
      }
      throw Error("Unexpected: Misaligned message");
    };
  };
  _pio.binaryserializer = {
    pow2: function (b) {
      return 0 <= b && 31 > b
        ? 1 << b
        : this.pow2[b] || (this.pow2[b] = Math.pow(2, b));
    },
    _intEncode: function (b, e) {
      if (4 == e)
        var c = [(b >>> 24) & 255, (b >>> 16) & 255, (b >>> 8) & 255, b & 255];
      else {
        if (0 <= b) {
          c = Math.floor(b / this.pow2(32));
          var f = b - c * this.pow2(32);
        } else
          (c = Math.floor(b / this.pow2(32))),
            (f = b - c * this.pow2(32)),
            (c += this.pow2(32));
        c = [
          (c >>> 24) & 255,
          (c >>> 16) & 255,
          (c >>> 8) & 255,
          c & 255,
          (f >>> 24) & 255,
          (f >>> 16) & 255,
          (f >>> 8) & 255,
          f & 255,
        ];
      }
      return c;
    },
    _floatEncode: function (b, e, c) {
      var f = 0 > b ? 1 : 0,
        g,
        h = ~(-1 << (c - 1)),
        l = 1 - h;
      0 > b && (b = -b);
      0 === b
        ? (b = g = 0)
        : isNaN(b)
        ? ((g = 2 * h + 1), (b = 1))
        : Infinity === b
        ? ((g = 2 * h + 1), (b = 0))
        : ((g = Math.floor(Math.log(b) / Math.LN2)),
          g >= l && g <= h
            ? ((b = Math.floor((b * this.pow2(-g) - 1) * this.pow2(e))),
              (g += h))
            : ((b = Math.floor(b / this.pow2(l - e))), (g = 0)));
      for (h = []; 8 <= e; )
        h.push(b % 256), (b = Math.floor(b / 256)), (e -= 8);
      g = (g << e) | b;
      for (c += e; 8 <= c; ) h.push(g & 255), (g >>>= 8), (c -= 8);
      h.push((f << c) | g);
      h.reverse();
      return h;
    },
    bytesFromString: function (b) {
      for (var e = [], c = 0; c < b.length; c++)
        if (127 >= b.charCodeAt(c)) e.push(b.charCodeAt(c));
        else
          for (
            var f = encodeURIComponent(b.charAt(c)).substr(1).split("%"), g = 0;
            g < f.length;
            g++
          )
            e.push(parseInt(f[g], 16));
      return e;
    },
    bytesFromInt: function (b) {
      return this._intEncode(b, 4);
    },
    bytesFromUInt: function (b) {
      return this._intEncode(b, 4);
    },
    bytesFromLong: function (b) {
      return this._intEncode(b, 8);
    },
    bytesFromULong: function (b) {
      return this._intEncode(b, 8);
    },
    bytesFromFloat: function (b) {
      return this._floatEncode(b, 23, 8);
    },
    bytesFromDouble: function (b) {
      return this._floatEncode(b, 52, 11);
    },
    _intDecode: function (b, e, c, f, g) {
      var h = e + c - 1;
      e = g && c == f && b[e] & 128;
      f = 0;
      g = 1;
      for (var l = 0; l < c; l++) {
        var k = b[h - l];
        e && ((k = (k ^ 255) + g), (g = k >> 8), (k &= 255));
        f += k * this.pow2(8 * l);
      }
      return e ? -f : f;
    },
    _float32Decode: function (b, e) {
      var c = b.slice(e, e + 4).reverse(),
        f = 1 - 2 * (c[3] >> 7),
        g = (((c[3] << 1) & 255) | (c[2] >> 7)) - 127;
      c = ((c[2] & 127) << 16) | (c[1] << 8) | c[0];
      return 128 === g
        ? 0 !== c
          ? NaN
          : Infinity * f
        : -127 === g
        ? f * c * this.pow2(-149)
        : f * (1 + c * this.pow2(-23)) * this.pow2(g);
    },
    _float64Decode: function (b, e) {
      var c = b.slice(e, e + 8).reverse(),
        f = 1 - 2 * (c[7] >> 7),
        g = ((((c[7] << 1) & 255) << 3) | (c[6] >> 4)) - 1023;
      c =
        (c[6] & 15) * this.pow2(48) +
        c[5] * this.pow2(40) +
        c[4] * this.pow2(32) +
        c[3] * this.pow2(24) +
        c[2] * this.pow2(16) +
        c[1] * this.pow2(8) +
        c[0];
      return 1024 === g
        ? 0 !== c
          ? NaN
          : Infinity * f
        : -1023 === g
        ? f * c * this.pow2(-1074)
        : f * (1 + c * this.pow2(-52)) * this.pow2(g);
    },
    stringFromBytes: function (b, e, c) {
      for (var f = "", g = e; g < e + c; g++)
        f +=
          127 >= b[g]
            ? 37 === b[g]
              ? "%25"
              : String.fromCharCode(b[g])
            : "%" + b[g].toString(16).toUpperCase();
      return decodeURIComponent(f);
    },
    intFromBytes: function (b, e, c) {
      return this._intDecode(b, e, c, 4, !0);
    },
    uintFromBytes: function (b, e, c) {
      return this._intDecode(b, e, c, 4, !1);
    },
    longFromBytes: function (b, e, c) {
      return this._intDecode(b, e, c, 8, !0);
    },
    ulongFromBytes: function (b, e, c) {
      return this._intDecode(b, e, c, 8, !1);
    },
    floatFromBytes: function (b, e, c) {
      return 4 == c ? this._float32Decode(b, e) : NaN;
    },
    doubleFromBytes: function (b, e, c) {
      return 8 == c ? this._float64Decode(b, e) : NaN;
    },
  };
  for (var a = [], d = 0; 65 != d; d++)
    a[
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charCodeAt(
        d
      )
    ] = d;
  _pio.base64encode = function (b) {
    for (var e = [], c = 0; c < b.length; c++) {
      var f = b[c],
        g = ++c <= b.length ? b[c] : NaN,
        h = ++c <= b.length ? b[c] : NaN,
        l = f >> 2;
      f = ((f & 3) << 4) | (g >> 4);
      var k = ((g & 15) << 2) | (h >> 6),
        m = h & 63;
      isNaN(g) ? (k = m = 64) : isNaN(h) && (m = 64);
      e.push(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
          l
        )
      );
      e.push(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
          f
        )
      );
      e.push(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
          k
        )
      );
      e.push(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
          m
        )
      );
    }
    return e.join("");
  };
  _pio.base64decode = function (b) {
    for (var e = [], c = 0; c < b.length; c++) {
      var f = a[b.charCodeAt(c)],
        g = ++c < b.length ? a[b.charCodeAt(c)] : 64,
        h = ++c < b.length ? a[b.charCodeAt(c)] : 64,
        l = ++c < b.length ? a[b.charCodeAt(c)] : 64,
        k = ((g & 15) << 4) | (h >> 2),
        m = ((h & 3) << 6) | l;
      e.push((f << 2) | (g >> 4));
      64 != h && (e.push(k), 64 != l && e.push(m));
    }
    return e;
  };
})();
(function () {
  _pio.achievements = function (a) {
    function d(c, f) {
      var g = new _pio.achievement(
        c.identifier,
        c.title,
        c.description,
        c.imageurl,
        c.progress,
        c.progressgoal,
        c.lastupdated
      );
      if ("string" !== typeof e.myAchievements)
        for (var h = 0; h < e.myAchievements.length; h++)
          e.myAchievements[h].id == g.id &&
            ((e.myAchievements[h] = g), (e.currentVersion = null));
      if (f)
        for (h = 0; h < e.onCompleteHandlers.length; h++)
          (0, e.onCompleteHandlers[h])(g);
      return g;
    }
    var b = null;
    this.myAchievements =
      "[ERROR: You tried to access achievements.myAchievements before loading them. You have to call the refresh method first.]";
    this.onCompleteHandlers = [];
    var e = this;
    this.addOnComplete = function (c) {
      if ("function" === typeof c && 1 == c.length)
        e.onCompleteHandlers.push(c);
      else
        throw new PlayerIOError(
          PlayerIOErrorCode.InvalidArgument,
          "Expects argument to be a function that takes an achievement as an argument."
        );
    };
    this.get = function (c) {
      if ("string" === typeof e.myAchievements) return null;
      for (var f = 0; f < e.myAchievements.length; f++)
        if (e.myAchievements[f].id == c) return e.myAchievements[f];
      return null;
    };
    this.refresh = function (c, f) {
      a.achievementsRefresh(b, c, f, function (g) {
        if (b != g.version)
          if (
            ((b = g.version),
            null == g.achievements || 0 == g.achievements.length)
          )
            e.myAchievements = [];
          else {
            for (var h = [], l = 0; l < g.achievements.length; l++) {
              var k = g.achievements[l];
              h.push(
                new _pio.achievement(
                  k.identifier,
                  k.title,
                  k.description,
                  k.imageurl,
                  k.progress,
                  k.progressgoal,
                  k.lastupdated
                )
              );
            }
            e.myAchievements = h;
          }
      });
    };
    this.load = function (c, f, g) {
      "object" == typeof c || requests.length
        ? a.achievementsLoad(c, f, g, function (h) {
            if (null == h || 0 == h.length) return {};
            for (var l = {}, k = 0; k < h.userachievements.length; k++) {
              for (
                var m = h.userachievements[k], p = [], n = 0;
                n < m.achievements.length;
                n++
              ) {
                var q = m.achievements[n];
                p.push(
                  new _pio.achievement(
                    q.identifier,
                    q.title,
                    q.description,
                    q.imageurl,
                    q.progress,
                    q.progressgoal,
                    q.lastupdated
                  )
                );
              }
              l[m.userid] = p;
            }
            return l;
          })
        : ((c = _pio.error(
            "The first argument to load should be an array: client.achievements.load(['user1', 'user2', ...], ...)"
          )),
          _pio.handleError(c, g, c.code, c.message));
    };
    this.progressSet = function (c, f, g, h) {
      a.achievementsProgressSet(c, f, g, h, function (l) {
        return d(l.achievement, l.completednow);
      });
    };
    this.progressAdd = function (c, f, g, h) {
      a.achievementsProgressAdd(c, f, g, h, function (l) {
        return d(l.achievement, l.completednow);
      });
    };
    this.progressMax = function (c, f, g, h) {
      a.achievementsProgressMax(c, f, g, h, function (l) {
        return d(l.achievement, l.completednow);
      });
    };
    this.progressComplete = function (c, f, g) {
      a.achievementsProgressComplete(c, f, g, function (h) {
        return d(h.achievement, h.completednow);
      });
    };
  };
  _pio.achievement = function (a, d, b, e, c, f, g) {
    this.id = a;
    this.title = d;
    this.description = b;
    this.imageUrl = e;
    this.progress = "undefined" === typeof c ? 0 : c;
    this.progressGoal = f;
    this.lastUpdated = new Date(1e3 * g);
    this.progressRatio = this.progress / this.progressGoal;
    this.completed = this.progress == this.progressGoal;
  };
})();
(function () {
  _pio.playerInsight = function (a) {
    function d(e) {
      b.playersOnline =
        -1 == e.playersonline
          ? "[ERROR: The current connection does not have the rights required to read the playersonline variable.]"
          : e.playersonline;
      b.segments = _pio.convertFromKVArray(e.segments);
    }
    this.playersOnline =
      "[ERROR: You tried to access playerInsight.playersOnline before loading it. You have to call the refresh method first.]";
    this.segments = {};
    var b = this;
    this.refresh = function (e, c) {
      a.playerInsightRefresh(e, c, function (f) {
        d(f.state);
      });
    };
    this.setSegments = function (e, c, f) {
      a.playerInsightSetSegments(
        _pio.convertToSegmentArray(e),
        c,
        f,
        function (g) {
          d(g.state);
        }
      );
    };
    this.trackInvitedBy = function (e, c, f, g) {
      a.playerInsightTrackInvitedBy(e, c, f, g, function (h) {});
    };
    this.trackEvent = function (e, c, f, g) {
      a.playerInsightTrackEvents(
        [{ eventtype: e, value: c }],
        f,
        g,
        function (h) {}
      );
    };
    this.trackExternalPayment = function (e, c, f, g) {
      a.playerInsightTrackExternalPayment(e, c, f, g, function (h) {});
    };
    this.sessionKeepAlive = function (e, c) {
      a.playerInsightSessionKeepAlive(e, c, function (f) {});
    };
  };
})();
(function () {
  _pio.leaderboards = function (a, d) {
    this.set = function (b, e, c, f, g) {
      a.leaderboardsSet(b, e, c, f, g, function (h) {
        return new _pio.leaderboardEntry(
          h.leaderboardentry.userid,
          h.leaderboardentry.rank,
          h.leaderboardentry.score
        );
      });
    };
    this.count = function (b, e, c, f) {
      a.leaderboardsCount(b, e, c, f, function (g) {
        return g.count;
      });
    };
    this.getTop = function (b, e, c, f, g, h, l) {
      a.leaderboardsGet(b, e, c, f, null, g, h, l, function (k) {
        if (
          null == k ||
          null == k.leaderboardentry ||
          0 == k.leaderboardentry.length
        )
          return [];
        for (var m = [], p = 0; p < k.leaderboardentry.length; p++)
          m.push(
            new _pio.leaderboardEntry(
              k.leaderboardentry[p].userid,
              k.leaderboardentry[p].rank,
              k.leaderboardentry[p].score
            )
          );
        return m;
      });
    };
    this.getNeighbourhood = function (b, e, c, f, g, h, l) {
      a.leaderboardsGet(b, e, c, f, d, g, h, l, function (k) {
        if (
          null == k ||
          null == k.leaderboardentry ||
          0 == k.leaderboardentry.length
        )
          return [];
        for (var m = [], p = 0; p < k.leaderboardentry.length; p++)
          m.push(
            new _pio.leaderboardEntry(
              k.leaderboardentry[p].userid,
              k.leaderboardentry[p].rank,
              k.leaderboardentry[p].score
            )
          );
        return m;
      });
    };
  };
  _pio.leaderboardEntry = function (a, d, b) {
    this.userId = a;
    this.rank = d;
    this.score = b;
  };
})();
(function () {
  _pio.oneScore = function (a) {
    this.percentile =
      "[ERROR: You tried to access oneScore.percentile before loading the OneScore. You have to call the refresh method first.]";
    this.score =
      "[ERROR: You tried to access oneScore.score before loading the OneScore. You have to call the refresh method first.]";
    this.topRank =
      "[ERROR: You tried to access oneScore.topRank before loading the OneScore. You have to call the refresh method first.]";
    var d = this;
    this.refresh = function (b, e) {
      a.oneScoreRefresh(b, e, function (c) {
        c = new _pio.oneScoreValue(
          c.onescore.percentile,
          c.onescore.score,
          c.onescore.toprank
        );
        d.percentile = c.percentile;
        d.score = c.score;
        d.topRank = c.toprank;
      });
    };
    this.set = function (b, e, c) {
      a.oneScoreSet(b, e, c, function (f) {
        f = new _pio.oneScoreValue(
          f.onescore.percentile,
          f.onescore.score,
          f.onescore.toprank
        );
        d.percentile = f.percentile;
        d.score = f.score;
        d.topRank = f.toprank;
        return f;
      });
    };
    this.add = function (b, e, c) {
      a.oneScoreAdd(b, e, c, function (f) {
        f = new _pio.oneScoreValue(
          f.onescore.percentile,
          f.onescore.score,
          f.onescore.toprank
        );
        d.percentile = f.percentile;
        d.score = f.score;
        d.topRank = f.toprank;
        return f;
      });
    };
    this.load = function (b, e, c) {
      if ("object" == typeof b || requests.length)
        a.oneScoreLoad(b, e, c, function (f) {
          if (null == f || null == f.onescores || 0 == f.onescores.length)
            return [];
          for (var g = [], h = 0, l = 0; l < b.length; l++) {
            var k = f.onescores[h];
            k && b[l] == k.userid
              ? (g.push(
                  new _pio.oneScoreValue(k.percentile, k.score, k.toprank)
                ),
                h++)
              : g.push(null);
          }
          return g;
        });
      else
        (e = _pio.error(
          "The first argument to load should be an array: client.oneScore.load(['user1', 'user2', ...], ...)"
        )),
          _pio.handleError(e, c, e.code, e.message);
    };
  };
  _pio.oneScoreValue = function (a, d, b) {
    this.percentile = "undefined" === typeof a ? 0 : a;
    this.score = "undefined" === typeof d ? 0 : d;
    this.topRank = "undefined" === typeof b ? 0 : b;
  };
})();
(function () {
  _pio.notifications = function (a) {
    function d(f) {
      if (f.version != c) {
        var g = [];
        if (f.endpoints)
          for (var h = 0; h != f.endpoints.length; h++) {
            var l = f.endpoints[h];
            g[h] = new _pio.notificationEndpoint(
              l.type,
              l.identifier,
              _pio.convertFromKVArray(l.configuration),
              l.enabled ? !0 : !1
            );
          }
        c = f.version;
        e.myEndpoints = g;
      }
    }
    function b(f) {
      var g = [];
      if (f && 0 < f.length)
        for (var h = 0; h != f.length; h++) {
          var l = f[h];
          l.type &&
            l.identifier &&
            g.push({ type: l.type, identifier: l.identifier });
        }
      return g;
    }
    this.myEndpoints =
      "[ERROR: You tried to access notifications.myEndpoints before calling refresh.]";
    var e = this,
      c = "";
    this.refresh = function (f, g) {
      a.notificationsRefresh(c, f, g, d);
    };
    this.registerEndpoint = function (f, g, h, l, k, m) {
      var p;
      a: {
        if ("" != c)
          for (p = 0; p != e.myEndpoints.length; p++) {
            var n = e.myEndpoints[p];
            if (n.type == f && n.identifier == g) {
              p = n;
              break a;
            }
          }
        p = null;
      }
      (n = null == p || p.enabled != l) ||
        (n = JSON.stringify(p.configuration) != JSON.stringify(h));
      n
        ? a.notificationsRegisterEndpoints(
            c,
            [
              {
                type: f,
                identifier: g,
                configuration: _pio.convertToKVArray(h),
                enabled: l,
              },
            ],
            k,
            m,
            d
          )
        : k && k();
    };
    this.toggleEndpoints = function (f, g, h, l) {
      f = b(f);
      0 < f.length
        ? a.notificationsToggleEndpoints(c, f, g ? !0 : !1, h, l, d)
        : h && h();
    };
    this.deleteEndpoints = function (f, g, h) {
      f = b(f);
      0 < f.length ? a.notificationsDeleteEndpoints(c, f, g, h, d) : g && g();
    };
    this.send = function (f, g, h) {
      for (var l = [], k = 0; k != f.length; k++) {
        var m = f[k],
          p = {
            recipient: m.recipientUserId,
            endpointtype: m.endpointType,
            data: {},
          };
        (0 != (p.recipient + "").length && 0 != (p.endpointtype + "").length) ||
          console.log("error");
        for (var n in m)
          "recipientUserId" != n && "endpointType" != n && (p.data[n] = m[n]);
        l[k] = p;
      }
      0 < l.length ? a.notificationsSend(l, g, h, null) : g && g();
    };
  };
  _pio.notificationEndpoint = function (a, d, b, e) {
    this.type = a;
    this.identifier = d;
    this.configuration = b;
    this.enabled = e;
  };
})();
(function () {
  _pio.publishingNetwork = function (a, d) {
    var b = this;
    this.profiles = new _pio.publishingNetworkProfiles(a);
    this.payments = new _pio.publishingNetworkPayments(a);
    this.relations = new _pio.publishingNetworkRelations(a, d, this);
    this.userToken =
      "[ERROR: you tried to access publishingNetwork.userToken before calling publishingNetwork.refresh(callback)]";
    this.refresh = function (e, c) {
      a.socialRefresh(e, c, function (f) {
        b.userToken = f.myprofile.usertoken;
        b.profiles.myProfile = new _pio.publishingNetworkProfile(f.myprofile);
        "undefined" == typeof _pio.friendLookup &&
          ((_pio.friendLookup = {}), (_pio.blockedLookup = {}));
        var g = _pio.friendLookup[b.profiles.myProfile.userId],
          h = _pio.blockedLookup[b.profiles.myProfile.userId];
        g ||
          h ||
          ((g = _pio.friendLookup[b.profiles.myProfile.userId] = {}),
          (h = _pio.blockedLookup[b.profiles.myProfile.userId] = {}));
        b.relations.friends = [];
        for (var l = 0; l != f.friends.length; l++) {
          var k = new _pio.publishingNetworkProfile(f.friends[l]);
          b.relations.friends.push(k);
          g[k.userId] = !0;
        }
        for (l = 0; l != f.blocked.length; l++) h[f.blocked[l]] = !0;
      });
    };
  };
  _pio.showDialog = function (a, d, b, e) {
    if ("undefined" == typeof window.PublishingNetwork)
      throw new PlayerIOError(
        PlayerIOErrorCode.PublishingNetworkNotAvailable,
        "PublishingNetwork.js was not found on the current page. You have to include the 'piocdn.com/publishingnetwork.js' on the containing page to show dialogs. See http://playerio.com/documentation/ for more information."
      );
    b.__apitoken__ = d.token;
    window.PublishingNetwork.dialog(a, b, e);
  };
})();
(function () {
  _pio.publishingNetworkPayments = function (a) {
    this.showBuyCoinsDialog = function (d, b, e, c) {
      b || (b = {});
      b.coinamount = d;
      a.payVaultPaymentInfo(
        "publishingnetwork",
        _pio.convertToKVArray(b),
        null,
        function (f) {
          _pio.showDialog("buy", a, f, function (g) {
            g.error
              ? c(new PlayerIOError(PlayerIOErrorCode.GeneralError, g.error))
              : e(g);
          });
        },
        c,
        function (f) {
          return _pio.convertFromKVArray(f.providerarguments);
        }
      );
    };
    this.showBuyItemsDialog = function (d, b, e, c) {
      a.payVaultPaymentInfo(
        "publishingnetwork",
        _pio.convertToKVArray(b || {}),
        _pio.convertBuyItems(d),
        function (f) {
          _pio.showDialog("buy", a, f, function (g) {
            g.error
              ? c(new PlayerIOError(PlayerIOErrorCode.GeneralError, g.error))
              : e(g);
          });
        },
        c,
        function (f) {
          return _pio.convertFromKVArray(f.providerarguments);
        }
      );
    };
  };
})();
(function () {
  _pio.publishingNetworkProfiles = function (a) {
    this.myProfile =
      "[ERROR: you tried to access publishingNetworkProfiles.myProfile before calling publishingNetwork.refresh(callback)]";
    this.showProfile = function (d, b) {
      _pio.showDialog("profile", a, { userId: d }, b);
    };
    this.loadProfiles = function (d, b, e) {
      a.socialLoadProfiles(d, b, e, function (c) {
        for (var f = [], g = 0; g != d.length; g++) {
          var h = d[g];
          f[g] = null;
          for (var l = 0; l != c.profiles.length; l++) {
            var k = c.profiles[l];
            if (k && k.userid == h) {
              f[g] = new _pio.publishingNetworkProfile(c.profiles[l]);
              break;
            }
          }
        }
        return f;
      });
    };
  };
  _pio.publishingNetworkProfile = function (a) {
    this.userId = a.userid;
    this.displayName = a.displayname;
    this.avatarUrl = a.avatarurl;
    this.lastOnline = new Date(a.lastonline);
    this.countryCode = a.countrycode;
  };
})();
(function () {
  _pio.publishingNetworkRelations = function (a, d, b) {
    this.friends =
      "[ERROR: you tried to access publishingNetworkRelations.friends before calling publishingNetwork.refresh(callback)]";
    this.isFriend = function (e) {
      if (
        "undefined" != typeof _pio.friendLookup &&
        "undefined" != typeof _pio.friendLookup[d]
      )
        return _pio.friendLookup[d][e] || !1;
      throw new PlayerIOError(
        PlayerIOErrorCode.PublishingNetworkNotLoaded,
        "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first"
      );
    };
    this.isBlocked = function (e) {
      if (
        "undefined" != typeof _pio.blockedLookup &&
        "undefined" != typeof _pio.blockedLookup[d]
      )
        return _pio.blockedLookup[d][e] || !1;
      throw new PlayerIOError(
        PlayerIOErrorCode.PublishingNetworkNotLoaded,
        "Cannot access profile, friends, ignored before Publishing Network has been loaded. Please refresh Publishing Network first"
      );
    };
    this.showRequestFriendshipDialog = function (e, c) {
      _pio.showDialog("requestfriendship", a, { userId: e }, c);
    };
    this.showRequestBlockUserDialog = function (e, c) {
      _pio.showDialog("requestblockuser", a, { userId: e }, function () {
        b.refresh(
          function () {
            c && c();
          },
          function () {
            c && c();
          }
        );
      });
    };
    this.showFriendsManager = function (e) {
      _pio.showDialog("friendsmanager", a, {}, function (c) {
        c.updated
          ? b.refresh(
              function () {
                e && e();
              },
              function () {
                e && e();
              }
            )
          : e && e();
      });
    };
    this.showBlockedUsersManager = function (e) {
      _pio.showDialog("blockedusersmanager", a, {}, function (c) {
        c.updated
          ? b.refresh(
              function () {
                e && e();
              },
              function () {
                e && e();
              }
            )
          : e && e();
      });
    };
  };
})();
(function (a, d) {
  "object" === typeof exports && "undefined" !== typeof module
    ? (module.exports = d())
    : "function" === typeof define && define.amd
    ? define(d)
    : (function () {
        var b = a.Base64,
          e = d();
        e.noConflict = function () {
          a.Base64 = b;
          return e;
        };
        a.Meteor && (Base64 = e);
        a.Base64 = e;
      })();
})(
  "undefined" !== typeof self
    ? self
    : "undefined" !== typeof window
    ? window
    : "undefined" !== typeof global
    ? global
    : this,
  function () {
    var a = "function" === typeof atob,
      d = "function" === typeof btoa,
      b = "function" === typeof Buffer,
      e = "function" === typeof TextDecoder ? new TextDecoder() : void 0,
      c = "function" === typeof TextEncoder ? new TextEncoder() : void 0,
      f = Array.prototype.slice.call(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      ),
      g = (function (H) {
        var x = {};
        H.forEach(function (aa, wa) {
          return (x[aa] = wa);
        });
        return x;
      })(f),
      h =
        /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
      l = String.fromCharCode.bind(String),
      k =
        "function" === typeof Uint8Array.from
          ? Uint8Array.from.bind(Uint8Array)
          : function (H, x) {
              void 0 === x &&
                (x = function (aa) {
                  return aa;
                });
              return new Uint8Array(Array.prototype.slice.call(H, 0).map(x));
            },
      m = function (H) {
        return H.replace(/=/g, "").replace(/[+\/]/g, function (x) {
          return "+" == x ? "-" : "_";
        });
      },
      p = function (H) {
        for (var x, aa, wa, sa = "", U = H.length % 3, K = 0; K < H.length; ) {
          if (
            255 < (x = H.charCodeAt(K++)) ||
            255 < (aa = H.charCodeAt(K++)) ||
            255 < (wa = H.charCodeAt(K++))
          )
            throw new TypeError("invalid character found");
          x = (x << 16) | (aa << 8) | wa;
          sa +=
            f[(x >> 18) & 63] +
            f[(x >> 12) & 63] +
            f[(x >> 6) & 63] +
            f[x & 63];
        }
        return U ? sa.slice(0, U - 3) + "===".substring(U) : sa;
      },
      n = d
        ? function (H) {
            return btoa(H);
          }
        : b
        ? function (H) {
            return Buffer.from(H, "binary").toString("base64");
          }
        : p,
      q = b
        ? function (H) {
            return Buffer.from(H).toString("base64");
          }
        : function (H) {
            for (var x = [], aa = 0, wa = H.length; aa < wa; aa += 4096)
              x.push(l.apply(null, H.subarray(aa, aa + 4096)));
            return n(x.join(""));
          },
      t = function (H, x) {
        void 0 === x && (x = !1);
        return x ? m(q(H)) : q(H);
      },
      z = function (H) {
        if (2 > H.length) {
          var x = H.charCodeAt(0);
          return 128 > x
            ? H
            : 2048 > x
            ? l(192 | (x >>> 6)) + l(128 | (x & 63))
            : l(224 | ((x >>> 12) & 15)) +
              l(128 | ((x >>> 6) & 63)) +
              l(128 | (x & 63));
        }
        x =
          65536 + 1024 * (H.charCodeAt(0) - 55296) + (H.charCodeAt(1) - 56320);
        return (
          l(240 | ((x >>> 18) & 7)) +
          l(128 | ((x >>> 12) & 63)) +
          l(128 | ((x >>> 6) & 63)) +
          l(128 | (x & 63))
        );
      },
      A = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
      C = function (H) {
        return H.replace(A, z);
      },
      w = b
        ? function (H) {
            return Buffer.from(H, "utf8").toString("base64");
          }
        : c
        ? function (H) {
            return q(c.encode(H));
          }
        : function (H) {
            return n(C(H));
          },
      B = function (H, x) {
        void 0 === x && (x = !1);
        return x ? m(w(H)) : w(H);
      };
    d = function (H) {
      return B(H, !0);
    };
    var u =
        /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,
      r = function (H) {
        switch (H.length) {
          case 4:
            return (
              (H =
                (((7 & H.charCodeAt(0)) << 18) |
                  ((63 & H.charCodeAt(1)) << 12) |
                  ((63 & H.charCodeAt(2)) << 6) |
                  (63 & H.charCodeAt(3))) -
                65536),
              l((H >>> 10) + 55296) + l((H & 1023) + 56320)
            );
          case 3:
            return l(
              ((15 & H.charCodeAt(0)) << 12) |
                ((63 & H.charCodeAt(1)) << 6) |
                (63 & H.charCodeAt(2))
            );
          default:
            return l(((31 & H.charCodeAt(0)) << 6) | (63 & H.charCodeAt(1)));
        }
      },
      y = function (H) {
        return H.replace(u, r);
      },
      J = function (H) {
        H = H.replace(/\s+/g, "");
        if (!h.test(H)) throw new TypeError("malformed base64.");
        H += "==".slice(2 - (H.length & 3));
        for (var x, aa = "", wa, sa, U = 0; U < H.length; )
          (x =
            (g[H.charAt(U++)] << 18) |
            (g[H.charAt(U++)] << 12) |
            ((wa = g[H.charAt(U++)]) << 6) |
            (sa = g[H.charAt(U++)])),
            (aa +=
              64 === wa
                ? l((x >> 16) & 255)
                : 64 === sa
                ? l((x >> 16) & 255, (x >> 8) & 255)
                : l((x >> 16) & 255, (x >> 8) & 255, x & 255));
        return aa;
      },
      I = a
        ? function (H) {
            return atob(H.replace(/[^A-Za-z0-9\+\/]/g, ""));
          }
        : b
        ? function (H) {
            return Buffer.from(H, "base64").toString("binary");
          }
        : J,
      Y = b
        ? function (H) {
            return k(Buffer.from(H, "base64"));
          }
        : function (H) {
            return k(I(H), function (x) {
              return x.charCodeAt(0);
            });
          },
      X = function (H) {
        return Y(oa(H));
      },
      fa = b
        ? function (H) {
            return Buffer.from(H, "base64").toString("utf8");
          }
        : e
        ? function (H) {
            return e.decode(Y(H));
          }
        : function (H) {
            return y(I(H));
          },
      oa = function (H) {
        return H.replace(/[-_]/g, function (x) {
          return "-" == x ? "+" : "/";
        }).replace(/[^A-Za-z0-9\+\/]/g, "");
      },
      ta = function (H) {
        return fa(oa(H));
      },
      Ga = function (H) {
        return { value: H, enumerable: !1, writable: !0, configurable: !0 };
      },
      Ha = function () {
        var H = function (x, aa) {
          return Object.defineProperty(String.prototype, x, Ga(aa));
        };
        H("fromBase64", function () {
          return ta(this);
        });
        H("toBase64", function (x) {
          return B(this, x);
        });
        H("toBase64URI", function () {
          return B(this, !0);
        });
        H("toBase64URL", function () {
          return B(this, !0);
        });
        H("toUint8Array", function () {
          return X(this);
        });
      },
      Ca = function () {
        var H = function (x, aa) {
          return Object.defineProperty(Uint8Array.prototype, x, Ga(aa));
        };
        H("toBase64", function (x) {
          return t(this, x);
        });
        H("toBase64URI", function () {
          return t(this, !0);
        });
        H("toBase64URL", function () {
          return t(this, !0);
        });
      },
      na = {
        version: "3.7.2",
        VERSION: "3.7.2",
        atob: I,
        atobPolyfill: J,
        btoa: n,
        btoaPolyfill: p,
        fromBase64: ta,
        toBase64: B,
        encode: B,
        encodeURI: d,
        encodeURL: d,
        utob: C,
        btou: y,
        decode: ta,
        isValid: function (H) {
          if ("string" !== typeof H) return !1;
          H = H.replace(/\s+/g, "").replace(/={0,2}$/, "");
          return !/[^\s0-9a-zA-Z\+/]/.test(H) || !/[^\s0-9a-zA-Z\-_]/.test(H);
        },
        fromUint8Array: t,
        toUint8Array: X,
        extendString: Ha,
        extendUint8Array: Ca,
        extendBuiltins: function () {
          Ha();
          Ca();
        },
        Base64: {},
      };
    Object.keys(na).forEach(function (H) {
      return (na.Base64[H] = na[H]);
    });
    return na;
  }
);
(function (a, d) {
  "object" === typeof exports && "undefined" !== typeof module
    ? (module.exports = d(require("@popperjs/core")))
    : "function" === typeof define && define.amd
    ? define(["@popperjs/core"], d)
    : ((a = a || self), (a.tippy = d(a.Popper)));
})(this, function (a) {
  function d(v) {
    var D = document.createElement("style");
    D.textContent = v;
    D.setAttribute("data-tippy-stylesheet", "");
    v = document.head;
    var E = document.querySelector("head>style,head>link");
    E ? v.insertBefore(D, E) : v.appendChild(D);
  }
  function b(v, D, E) {
    return Array.isArray(v)
      ? ((v = v[D]), null == v ? (Array.isArray(E) ? E[D] : E) : v)
      : v;
  }
  function e(v, D) {
    var E = {}.toString.call(v);
    return 0 === E.indexOf("[object") && -1 < E.indexOf(D + "]");
  }
  function c(v, D) {
    return "function" === typeof v ? v.apply(void 0, D) : v;
  }
  function f(v, D) {
    if (0 === D) return v;
    var E;
    return function (L) {
      clearTimeout(E);
      E = setTimeout(function () {
        v(L);
      }, D);
    };
  }
  function g(v, D) {
    var E = Object.assign({}, v);
    D.forEach(function (L) {
      delete E[L];
    });
    return E;
  }
  function h(v, D) {
    -1 === v.indexOf(D) && v.push(D);
  }
  function l(v) {
    return v.filter(function (D, E) {
      return v.indexOf(D) === E;
    });
  }
  function k(v) {
    return Object.keys(v).reduce(function (D, E) {
      void 0 !== v[E] && (D[E] = v[E]);
      return D;
    }, {});
  }
  function m() {
    return document.createElement("div");
  }
  function p(v) {
    return ["Element", "Fragment"].some(function (D) {
      return e(v, D);
    });
  }
  function n(v) {
    return p(v)
      ? [v]
      : e(v, "NodeList")
      ? [].slice.call(v)
      : Array.isArray(v)
      ? v
      : [].slice.call(document.querySelectorAll(v));
  }
  function q(v, D) {
    v.forEach(function (E) {
      E && (E.style.transitionDuration = D + "ms");
    });
  }
  function t(v, D) {
    v.forEach(function (E) {
      E && E.setAttribute("data-state", D);
    });
  }
  function z(v) {
    var D;
    v = [].concat(v)[0];
    return (null == v ? 0 : null == (D = v.ownerDocument) ? 0 : D.body)
      ? v.ownerDocument
      : document;
  }
  function A(v, D) {
    var E = D.clientX,
      L = D.clientY;
    return v.every(function (N) {
      var V = N.popperRect,
        P = N.popperState;
      N = N.props.interactiveBorder;
      var Q = P.placement.split("-")[0];
      P = P.modifiersData.offset;
      if (!P) return !0;
      var R = L - V.bottom - ("top" === Q ? P.bottom.y : 0) > N,
        Z = V.left - E + ("right" === Q ? P.left.x : 0) > N,
        pa = E - V.right - ("left" === Q ? P.right.x : 0) > N;
      return V.top - L + ("bottom" === Q ? P.top.y : 0) > N || R || Z || pa;
    });
  }
  function C(v, D, E) {
    var L = D + "EventListener";
    ["transitionend", "webkitTransitionEnd"].forEach(function (N) {
      v[L](N, E);
    });
  }
  function w() {
    ka.isTouch ||
      ((ka.isTouch = !0),
      window.performance && document.addEventListener("mousemove", B));
  }
  function B() {
    var v = performance.now();
    20 > v - ia &&
      ((ka.isTouch = !1), document.removeEventListener("mousemove", B));
    ia = v;
  }
  function u() {
    var v = document.activeElement;
    if (v && v._tippy && v._tippy.reference === v) {
      var D = v._tippy;
      v.blur && !D.state.isVisible && v.blur();
    }
  }
  function r(v) {
    return [
      v +
        "() was called on a" +
        ("destroy" === v ? "n already-" : " ") +
        "destroyed instance. This is a no-op but",
      "indicates a potential memory leak.",
    ].join(" ");
  }
  function y(v) {
    return v
      .replace(/[ \t]{2,}/g, " ")
      .replace(/^[ \t]*/gm, "")
      .trim();
  }
  function J(v) {
    return [
      y(
        "\n  %ctippy.js\n\n  %c" +
          y(v) +
          "\n\n  %c\ud83d\udc77\u200d This is a development-only message. It will be removed in production.\n  "
      ),
      "color: #00C584; font-size: 1.3em; font-weight: bold;",
      "line-height: 1.5",
      "color: #a6a095;",
    ];
  }
  function I(v, D) {
    if (v && !ba.has(D)) {
      var E;
      ba.add(D);
      (E = console).warn.apply(E, J(D));
    }
  }
  function Y(v, D) {
    if (v && !ba.has(D)) {
      var E;
      ba.add(D);
      (E = console).error.apply(E, J(D));
    }
  }
  function X(v) {
    var D = !v,
      E =
        "[object Object]" === Object.prototype.toString.call(v) &&
        !v.addEventListener;
    Y(
      D,
      [
        "tippy() was passed",
        "`" + String(v) + "`",
        "as its targets (first) argument. Valid types are: String, Element, Element[], or NodeList.",
      ].join(" ")
    );
    Y(
      E,
      "tippy() was passed a plain object which is not supported as an argument for virtual positioning. Use props.getReferenceClientRect instead."
    );
  }
  function fa(v) {
    var D = (v.plugins || []).reduce(function (E, L) {
      var N = L.name,
        V = L.defaultValue;
      N && (E[N] = void 0 !== v[N] ? v[N] : V);
      return E;
    }, {});
    return Object.assign({}, v, {}, D);
  }
  function oa(v, D) {
    return (
      D ? Object.keys(fa(Object.assign({}, la, { plugins: D }))) : La
    ).reduce(function (E, L) {
      var N = (v.getAttribute("data-tippy-" + L) || "").trim();
      if (!N) return E;
      if ("content" === L) E[L] = N;
      else
        try {
          E[L] = JSON.parse(N);
        } catch (V) {
          E[L] = N;
        }
      return E;
    }, {});
  }
  function ta(v, D) {
    var E = Object.assign(
      {},
      D,
      { content: c(D.content, [v]) },
      D.ignoreAttributes ? {} : oa(v, D.plugins)
    );
    E.aria = Object.assign({}, la.aria, {}, E.aria);
    E.aria = {
      expanded: "auto" === E.aria.expanded ? D.interactive : E.aria.expanded,
      content:
        "auto" === E.aria.content
          ? D.interactive
            ? null
            : "describedby"
          : E.aria.content,
    };
    return E;
  }
  function Ga(v, D) {
    void 0 === v && (v = {});
    void 0 === D && (D = []);
    Object.keys(v).forEach(function (E) {
      var L = g(la, Object.keys(xa));
      (L = !{}.hasOwnProperty.call(L, E)) &&
        (L =
          0 ===
          D.filter(function (N) {
            return N.name === E;
          }).length);
      I(
        L,
        [
          "`" + E + "`",
          "is not a valid prop. You may have spelled it incorrectly, or if it's a plugin, forgot to pass it in an array as props.plugins. \n\n All props: https://atomiks.github.io/tippyjs/v6/all-props/\n Plugins: https://atomiks.github.io/tippyjs/v6/plugins/",
        ].join(" ")
      );
    });
  }
  function Ha(v) {
    var D = m();
    !0 === v
      ? (D.className = "tippy-arrow")
      : ((D.className = "tippy-svg-arrow"),
        p(v) ? D.appendChild(v) : (D.innerHTML = v));
    return D;
  }
  function Ca(v, D) {
    p(D.content)
      ? ((v.innerHTML = ""), v.appendChild(D.content))
      : "function" !== typeof D.content &&
        (D.allowHTML ? (v.innerHTML = D.content) : (v.textContent = D.content));
  }
  function na(v) {
    v = v.firstElementChild;
    var D = [].slice.call(v.children);
    return {
      box: v,
      content: D.find(function (E) {
        return E.classList.contains("tippy-content");
      }),
      arrow: D.find(function (E) {
        return (
          E.classList.contains("tippy-arrow") ||
          E.classList.contains("tippy-svg-arrow")
        );
      }),
      backdrop: D.find(function (E) {
        return E.classList.contains("tippy-backdrop");
      }),
    };
  }
  function H(v) {
    function D(V, P) {
      var Q = na(E),
        R = Q.box,
        Z = Q.content;
      Q = Q.arrow;
      P.theme
        ? R.setAttribute("data-theme", P.theme)
        : R.removeAttribute("data-theme");
      "string" === typeof P.animation
        ? R.setAttribute("data-animation", P.animation)
        : R.removeAttribute("data-animation");
      P.inertia
        ? R.setAttribute("data-inertia", "")
        : R.removeAttribute("data-inertia");
      R.style.maxWidth =
        "number" === typeof P.maxWidth ? P.maxWidth + "px" : P.maxWidth;
      P.role ? R.setAttribute("role", P.role) : R.removeAttribute("role");
      (V.content === P.content && V.allowHTML === P.allowHTML) ||
        Ca(Z, v.props);
      P.arrow
        ? Q
          ? V.arrow !== P.arrow &&
            (R.removeChild(Q), R.appendChild(Ha(P.arrow)))
          : R.appendChild(Ha(P.arrow))
        : Q && R.removeChild(Q);
    }
    var E = m(),
      L = m();
    L.className = "tippy-box";
    L.setAttribute("data-state", "hidden");
    L.setAttribute("tabindex", "-1");
    var N = m();
    N.className = "tippy-content";
    N.setAttribute("data-state", "hidden");
    Ca(N, v.props);
    E.appendChild(L);
    L.appendChild(N);
    D(v.props, v.props);
    return { popper: E, onUpdate: D };
  }
  function x(v, D) {
    function E() {
      var F = G.props.touch;
      return Array.isArray(F) ? F : [F, 0];
    }
    function L() {
      var F;
      return !(null == (F = G.props.render) || !F.$$tippy);
    }
    function N() {
      var F = (Da || v).parentNode;
      return F ? z(F) : document;
    }
    function V(F) {
      return (G.state.isMounted && !G.state.isVisible) ||
        ka.isTouch ||
        (Pa && "focus" === Pa.type)
        ? 0
        : b(G.props.delay, F ? 0 : 1, la.delay);
    }
    function P() {
      ea.style.pointerEvents =
        G.props.interactive && G.state.isVisible ? "" : "none";
      ea.style.zIndex = "" + G.props.zIndex;
    }
    function Q(F, S, W) {
      void 0 === W && (W = !0);
      rb.forEach(function (ma) {
        ma[F] && ma[F].apply(void 0, S);
      });
      if (W) {
        var ca;
        (ca = G.props)[F].apply(ca, S);
      }
    }
    function R() {
      var F = G.props.aria;
      if (F.content) {
        var S = "aria-" + F.content,
          W = ea.id;
        [].concat(G.props.triggerTarget || v).forEach(function (ca) {
          var ma = ca.getAttribute(S);
          G.state.isVisible
            ? ca.setAttribute(S, ma ? ma + " " + W : W)
            : (ma = ma && ma.replace(W, "").trim())
            ? ca.setAttribute(S, ma)
            : ca.removeAttribute(S);
        });
      }
    }
    function Z() {
      !sb &&
        G.props.aria.expanded &&
        [].concat(G.props.triggerTarget || v).forEach(function (F) {
          G.props.interactive
            ? F.setAttribute(
                "aria-expanded",
                G.state.isVisible && F === (Da || v) ? "true" : "false"
              )
            : F.removeAttribute("aria-expanded");
        });
    }
    function pa() {
      N().removeEventListener("mousemove", Ea);
      Qa = Qa.filter(function (F) {
        return F !== Ea;
      });
    }
    function ja(F) {
      if (!ka.isTouch || (!Xa && "mousedown" !== F.type))
        if (!G.props.interactive || !ea.contains(F.target)) {
          if ((Da || v).contains(F.target)) {
            if (
              ka.isTouch ||
              (G.state.isVisible && 0 <= G.props.trigger.indexOf("click"))
            )
              return;
          } else Q("onClickOutside", [G, F]);
          !0 === G.props.hideOnClick &&
            (G.clearDelayTimeouts(),
            G.hide(),
            (Ya = !0),
            setTimeout(function () {
              Ya = !1;
            }),
            G.state.isMounted || za());
        }
    }
    function qa() {
      Xa = !0;
    }
    function O() {
      Xa = !1;
    }
    function ua() {
      var F = N();
      F.addEventListener("mousedown", ja, !0);
      F.addEventListener("touchend", ja, Ba);
      F.addEventListener("touchstart", O, Ba);
      F.addEventListener("touchmove", qa, Ba);
    }
    function za() {
      var F = N();
      F.removeEventListener("mousedown", ja, !0);
      F.removeEventListener("touchend", ja, Ba);
      F.removeEventListener("touchstart", O, Ba);
      F.removeEventListener("touchmove", qa, Ba);
    }
    function T(F, S) {
      ra(F, function () {
        !G.state.isVisible &&
          ea.parentNode &&
          ea.parentNode.contains(ea) &&
          S();
      });
    }
    function ha(F, S) {
      ra(F, S);
    }
    function ra(F, S) {
      function W(ma) {
        ma.target === ca && (C(ca, "remove", W), S());
      }
      var ca = na(ea).box;
      if (0 === F) return S();
      C(ca, "remove", db);
      C(ca, "add", W);
      db = W;
    }
    function va(F, S, W) {
      void 0 === W && (W = !1);
      [].concat(G.props.triggerTarget || v).forEach(function (ca) {
        ca.addEventListener(F, S, W);
        Za.push({ node: ca, eventType: F, handler: S, options: W });
      });
    }
    function Aa() {
      "hold" === E()[0] &&
        (va("touchstart", Ma, { passive: !0 }),
        va("touchend", eb, { passive: !0 }));
      G.props.trigger
        .split(/\s+/)
        .filter(Boolean)
        .forEach(function (F) {
          if ("manual" !== F)
            switch ((va(F, Ma), F)) {
              case "mouseenter":
                va("mouseleave", eb);
                break;
              case "focus":
                va(M ? "focusout" : "blur", fb);
                break;
              case "focusin":
                va("focusout", fb);
            }
        });
    }
    function Fa() {
      Za.forEach(function (F) {
        F.node.removeEventListener(F.eventType, F.handler, F.options);
      });
      Za = [];
    }
    function Ma(F) {
      var S,
        W = !1;
      if (G.state.isEnabled && !gb(F) && !Ya) {
        var ca = "focus" === (null == (S = Pa) ? void 0 : S.type);
        Pa = F;
        Da = F.currentTarget;
        Z();
        !G.state.isVisible &&
          e(F, "MouseEvent") &&
          Qa.forEach(function (ma) {
            return ma(F);
          });
        "click" === F.type &&
        (0 > G.props.trigger.indexOf("mouseenter") || Na) &&
        !1 !== G.props.hideOnClick &&
        G.state.isVisible
          ? (W = !0)
          : hb(F);
        "click" === F.type && (Na = !W);
        W && !ca && Ra(F);
      }
    }
    function ib(F) {
      var S = F.target;
      S = (Da || v).contains(S) || ea.contains(S);
      ("mousemove" === F.type && S) ||
        ((S = $a()
          .concat(ea)
          .map(function (W) {
            var ca,
              ma = null == (ca = W._tippy.popperInstance) ? void 0 : ca.state;
            return ma
              ? {
                  popperRect: W.getBoundingClientRect(),
                  popperState: ma,
                  props: Ia,
                }
              : null;
          })
          .filter(Boolean)),
        A(S, F) && (pa(), Ra(F)));
    }
    function eb(F) {
      gb(F) ||
        (0 <= G.props.trigger.indexOf("click") && Na) ||
        (G.props.interactive ? G.hideWithInteractivity(F) : Ra(F));
    }
    function fb(F) {
      (0 > G.props.trigger.indexOf("focusin") && F.target !== (Da || v)) ||
        (G.props.interactive &&
          F.relatedTarget &&
          ea.contains(F.relatedTarget)) ||
        Ra(F);
    }
    function gb(F) {
      return ka.isTouch
        ? ("hold" === E()[0]) !== 0 <= F.type.indexOf("touch")
        : !1;
    }
    function jb() {
      kb();
      var F = G.props,
        S = F.popperOptions,
        W = F.placement,
        ca = F.offset,
        ma = F.getReferenceClientRect,
        Sa = F.moveTransition;
      F = L() ? na(ea).arrow : null;
      ma = ma
        ? {
            getBoundingClientRect: ma,
            contextElement: ma.contextElement || Da || v,
          }
        : v;
      ca = [
        { name: "offset", options: { offset: ca } },
        {
          name: "preventOverflow",
          options: { padding: { top: 2, bottom: 2, left: 5, right: 5 } },
        },
        { name: "flip", options: { padding: 5 } },
        { name: "computeStyles", options: { adaptive: !Sa } },
        {
          name: "$$tippy",
          enabled: !0,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: function (Ja) {
            var Ka = Ja.state;
            if (L()) {
              var ab = na(ea).box;
              ["placement", "reference-hidden", "escaped"].forEach(function (
                Ta
              ) {
                "placement" === Ta
                  ? ab.setAttribute("data-placement", Ka.placement)
                  : Ka.attributes.popper["data-popper-" + Ta]
                  ? ab.setAttribute("data-" + Ta, "")
                  : ab.removeAttribute("data-" + Ta);
              });
              Ka.attributes.popper = {};
            }
          },
        },
      ];
      L() &&
        F &&
        ca.push({ name: "arrow", options: { element: F, padding: 3 } });
      ca.push.apply(ca, (null == S ? void 0 : S.modifiers) || []);
      G.popperInstance = a.createPopper(
        ma,
        ea,
        Object.assign({}, S, { placement: W, onFirstUpdate: lb, modifiers: ca })
      );
    }
    function kb() {
      G.popperInstance &&
        (G.popperInstance.destroy(), (G.popperInstance = null));
    }
    function tb() {
      var F = G.props.appendTo,
        S = Da || v;
      var W =
        (G.props.interactive && F === la.appendTo) || "parent" === F
          ? S.parentNode
          : c(F, [S]);
      W.contains(ea) || W.appendChild(ea);
      jb();
      I(
        G.props.interactive && F === la.appendTo && S.nextElementSibling !== ea,
        "Interactive tippy element may not be accessible via keyboard navigation because it is not directly after the reference element in the DOM source order. \n\n Using a wrapper <div> or <span> tag around the reference element solves this by creating a new parentNode context. \n\n Specifying `appendTo: document.body` silences this warning, but it assumes you are using a focus management solution to handle keyboard navigation. \n\n See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"
      );
    }
    function $a() {
      return [].slice.call(ea.querySelectorAll("[data-tippy-root]"));
    }
    function hb(F) {
      G.clearDelayTimeouts();
      F && Q("onTrigger", [G, F]);
      ua();
      F = V(!0);
      var S = E(),
        W = S[0];
      S = S[1];
      ka.isTouch && "hold" === W && S && (F = S);
      F
        ? (mb = setTimeout(function () {
            G.show();
          }, F))
        : G.show();
    }
    function Ra(F) {
      G.clearDelayTimeouts();
      Q("onUntrigger", [G, F]);
      G.state.isVisible
        ? (0 <= G.props.trigger.indexOf("mouseenter") &&
            0 <= G.props.trigger.indexOf("click") &&
            0 <= ["mouseleave", "mousemove"].indexOf(F.type) &&
            Na) ||
          ((F = V(!1))
            ? (nb = setTimeout(function () {
                G.state.isVisible && G.hide();
              }, F))
            : (ob = requestAnimationFrame(function () {
                G.hide();
              })))
        : za();
    }
    var Ia = ta(v, Object.assign({}, la, {}, fa(k(D)))),
      mb,
      nb,
      ob,
      Na = !1,
      Ya = !1,
      Xa = !1,
      bb = !1,
      Pa,
      db,
      lb,
      Za = [],
      Ea = f(ib, Ia.interactiveDebounce),
      Da,
      Ua = Oa++,
      pb = l(Ia.plugins),
      G = {
        id: Ua,
        reference: v,
        popper: m(),
        popperInstance: null,
        props: Ia,
        state: {
          isEnabled: !0,
          isVisible: !1,
          isDestroyed: !1,
          isMounted: !1,
          isShown: !1,
        },
        plugins: pb,
        clearDelayTimeouts: function () {
          clearTimeout(mb);
          clearTimeout(nb);
          cancelAnimationFrame(ob);
        },
        setProps: function (F) {
          I(G.state.isDestroyed, r("setProps"));
          if (!G.state.isDestroyed) {
            Q("onBeforeUpdate", [G, F]);
            Fa();
            var S = G.props,
              W = ta(
                v,
                Object.assign({}, G.props, {}, F, { ignoreAttributes: !0 })
              );
            G.props = W;
            Aa();
            S.interactiveDebounce !== W.interactiveDebounce &&
              (pa(), (Ea = f(ib, W.interactiveDebounce)));
            S.triggerTarget && !W.triggerTarget
              ? [].concat(S.triggerTarget).forEach(function (ca) {
                  ca.removeAttribute("aria-expanded");
                })
              : W.triggerTarget && v.removeAttribute("aria-expanded");
            Z();
            P();
            qb && qb(S, W);
            G.popperInstance &&
              (jb(),
              $a().forEach(function (ca) {
                requestAnimationFrame(ca._tippy.popperInstance.forceUpdate);
              }));
            Q("onAfterUpdate", [G, F]);
          }
        },
        setContent: function (F) {
          G.setProps({ content: F });
        },
        show: function () {
          I(G.state.isDestroyed, r("show"));
          var F = G.state.isVisible,
            S = G.state.isDestroyed,
            W = !G.state.isEnabled,
            ca = ka.isTouch && !G.props.touch,
            ma = b(G.props.duration, 0, la.duration);
          F ||
            S ||
            W ||
            ca ||
            (Da || v).hasAttribute("disabled") ||
            (Q("onShow", [G], !1),
            !1 !== G.props.onShow(G) &&
              ((G.state.isVisible = !0),
              L() && (ea.style.visibility = "visible"),
              P(),
              ua(),
              G.state.isMounted || (ea.style.transition = "none"),
              L() && ((F = na(ea)), q([F.box, F.content], 0)),
              (lb = function () {
                var Sa;
                if (G.state.isVisible && !bb) {
                  bb = !0;
                  void 0;
                  ea.style.transition = G.props.moveTransition;
                  if (L() && G.props.animation) {
                    var Ja = na(ea),
                      Ka = Ja.box;
                    Ja = Ja.content;
                    q([Ka, Ja], ma);
                    t([Ka, Ja], "visible");
                  }
                  R();
                  Z();
                  h(Va, G);
                  null == (Sa = G.popperInstance) ? void 0 : Sa.forceUpdate();
                  G.state.isMounted = !0;
                  Q("onMount", [G]);
                  G.props.animation &&
                    L() &&
                    ha(ma, function () {
                      G.state.isShown = !0;
                      Q("onShown", [G]);
                    });
                }
              }),
              tb()));
        },
        hide: function () {
          I(G.state.isDestroyed, r("hide"));
          var F = !G.state.isVisible,
            S = G.state.isDestroyed,
            W = !G.state.isEnabled,
            ca = b(G.props.duration, 1, la.duration);
          F ||
            S ||
            W ||
            (Q("onHide", [G], !1),
            !1 !== G.props.onHide(G) &&
              ((G.state.isVisible = !1),
              (Na = bb = G.state.isShown = !1),
              L() && (ea.style.visibility = "hidden"),
              pa(),
              za(),
              P(),
              L() &&
                ((S = na(ea)),
                (F = S.box),
                (S = S.content),
                G.props.animation && (q([F, S], ca), t([F, S], "hidden"))),
              R(),
              Z(),
              G.props.animation ? L() && T(ca, G.unmount) : G.unmount()));
        },
        hideWithInteractivity: function (F) {
          I(G.state.isDestroyed, r("hideWithInteractivity"));
          N().addEventListener("mousemove", Ea);
          h(Qa, Ea);
          Ea(F);
        },
        enable: function () {
          G.state.isEnabled = !0;
        },
        disable: function () {
          G.hide();
          G.state.isEnabled = !1;
        },
        unmount: function () {
          I(G.state.isDestroyed, r("unmount"));
          G.state.isVisible && G.hide();
          G.state.isMounted &&
            (kb(),
            $a().forEach(function (F) {
              F._tippy.unmount();
            }),
            ea.parentNode && ea.parentNode.removeChild(ea),
            (Va = Va.filter(function (F) {
              return F !== G;
            })),
            (G.state.isMounted = !1),
            Q("onHidden", [G]));
        },
        destroy: function () {
          I(G.state.isDestroyed, r("destroy"));
          G.state.isDestroyed ||
            (G.clearDelayTimeouts(),
            G.unmount(),
            Fa(),
            delete v._tippy,
            (G.state.isDestroyed = !0),
            Q("onDestroy", [G]));
        },
      };
    if (!Ia.render) return Y(!0, "render() function has not been supplied."), G;
    Ua = Ia.render(G);
    var ea = Ua.popper,
      qb = Ua.onUpdate;
    ea.setAttribute("data-tippy-root", "");
    ea.id = "tippy-" + G.id;
    G.popper = ea;
    v._tippy = G;
    ea._tippy = G;
    var rb = pb.map(function (F) {
        return F.fn(G);
      }),
      sb = v.hasAttribute("aria-expanded");
    Aa();
    Z();
    P();
    Q("onCreate", [G]);
    Ia.showOnCreate && hb();
    ea.addEventListener("mouseenter", function () {
      G.props.interactive && G.state.isVisible && G.clearDelayTimeouts();
    });
    ea.addEventListener("mouseleave", function (F) {
      G.props.interactive &&
        0 <= G.props.trigger.indexOf("mouseenter") &&
        (N().addEventListener("mousemove", Ea), Ea(F));
    });
    return G;
  }
  function aa(v, D) {
    void 0 === D && (D = {});
    var E = la.plugins.concat(D.plugins || []);
    X(v);
    Ga(D, E);
    document.addEventListener("touchstart", w, Ba);
    window.addEventListener("blur", u);
    var L = Object.assign({}, D, { plugins: E });
    E = n(v);
    var N = p(L.content),
      V = 1 < E.length;
    I(
      N && V,
      "tippy() was passed an Element as the `content` prop, but more than one tippy instance was created by this invocation. This means the content element will only be appended to the last tippy instance. \n\n Instead, pass the .innerHTML of the element, or use a function that returns a cloned version of the element instead. \n\n 1) content: element.innerHTML\n 2) content: () => element.cloneNode(true)"
    );
    E = E.reduce(function (P, Q) {
      var R = Q && x(Q, L);
      R && P.push(R);
      return P;
    }, []);
    return p(v) ? E[0] : E;
  }
  function wa() {
    var v = m();
    v.className = "tippy-backdrop";
    t([v], "hidden");
    return v;
  }
  function sa(v) {
    cb = { clientX: v.clientX, clientY: v.clientY };
  }
  function U(v, D) {
    var E;
    return {
      popperOptions: Object.assign({}, v.popperOptions, {
        modifiers: [].concat(
          ((null == (E = v.popperOptions) ? void 0 : E.modifiers) || []).filter(
            function (L) {
              return L.name !== D.name;
            }
          ),
          [D]
        ),
      }),
    };
  }
  function K(v, D, E, L) {
    if (2 > E.length || null === v) return D;
    if (2 === E.length && 0 <= L && E[0].left > E[1].right) return E[L] || D;
    switch (v) {
      case "top":
      case "bottom":
        D = E[0];
        var N = E[E.length - 1],
          V = "top" === v;
        E = D.top;
        L = N.bottom;
        var P = V ? D.left : N.left;
        D = V ? D.right : N.right;
        return {
          top: E,
          bottom: L,
          left: P,
          right: D,
          width: D - P,
          height: L - E,
        };
      case "left":
      case "right":
        var Q = Math.min.apply(
            Math,
            E.map(function (Z) {
              return Z.left;
            })
          ),
          R = Math.max.apply(
            Math,
            E.map(function (Z) {
              return Z.right;
            })
          );
        E = E.filter(function (Z) {
          return "left" === v ? Z.left === Q : Z.right === R;
        });
        D = E[0].top;
        E = E[E.length - 1].bottom;
        return {
          top: D,
          bottom: E,
          left: Q,
          right: R,
          width: R - Q,
          height: E - D,
        };
      default:
        return D;
    }
  }
  function da(v, D) {
    return v && D
      ? v.top !== D.top ||
          v.right !== D.right ||
          v.bottom !== D.bottom ||
          v.left !== D.left
      : !0;
  }
  var ya = "undefined" !== typeof window && "undefined" !== typeof document,
    M = /MSIE |Trident\//.test(ya ? navigator.userAgent : ""),
    Ba = { passive: !0, capture: !0 },
    ka = { isTouch: !1 },
    ia = 0;
  var ba = new Set();
  var xa = {
      animateFill: !1,
      followCursor: !1,
      inlinePositioning: !1,
      sticky: !1,
    },
    la = Object.assign(
      {
        appendTo: function () {
          return document.body;
        },
        aria: { content: "auto", expanded: "auto" },
        delay: 0,
        duration: [300, 250],
        getReferenceClientRect: null,
        hideOnClick: !0,
        ignoreAttributes: !1,
        interactive: !1,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        moveTransition: "",
        offset: [0, 10],
        onAfterUpdate: function () {},
        onBeforeUpdate: function () {},
        onCreate: function () {},
        onDestroy: function () {},
        onHidden: function () {},
        onHide: function () {},
        onMount: function () {},
        onShow: function () {},
        onShown: function () {},
        onTrigger: function () {},
        onUntrigger: function () {},
        onClickOutside: function () {},
        placement: "top",
        plugins: [],
        popperOptions: {},
        render: null,
        showOnCreate: !1,
        touch: !0,
        trigger: "mouseenter focus",
        triggerTarget: null,
      },
      xa,
      {},
      {
        allowHTML: !1,
        animation: "fade",
        arrow: !0,
        content: "",
        inertia: !1,
        maxWidth: 350,
        role: "tooltip",
        theme: "",
        zIndex: 9999,
      }
    ),
    La = Object.keys(la);
  H.$$tippy = !0;
  var Oa = 1,
    Qa = [],
    Va = [];
  aa.defaultProps = la;
  aa.setDefaultProps = function (v) {
    Ga(v, []);
    Object.keys(v).forEach(function (D) {
      la[D] = v[D];
    });
  };
  aa.currentInput = ka;
  var ub = Object.assign({}, a.applyStyles, {
      effect: function (v) {
        v = v.state;
        var D = {
          popper: {
            position: v.options.strategy,
            left: "0",
            top: "0",
            margin: "0",
          },
          arrow: { position: "absolute" },
          reference: {},
        };
        Object.assign(v.elements.popper.style, D.popper);
        v.styles = D;
        v.elements.arrow && Object.assign(v.elements.arrow.style, D.arrow);
      },
    }),
    vb = { mouseover: "mouseenter", focusin: "focus", click: "click" },
    cb = { clientX: 0, clientY: 0 },
    Wa = [];
  ya &&
    d(
      '.tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}'
    );
  aa.setDefaultProps({
    plugins: [
      {
        name: "animateFill",
        defaultValue: !1,
        fn: function (v) {
          var D;
          if (null == (D = v.props.render) || !D.$$tippy)
            return (
              Y(
                v.props.animateFill,
                "The `animateFill` plugin requires the default render function."
              ),
              {}
            );
          D = na(v.popper);
          var E = D.box,
            L = D.content,
            N = v.props.animateFill ? wa() : null;
          return {
            onCreate: function () {
              N &&
                (E.insertBefore(N, E.firstElementChild),
                E.setAttribute("data-animatefill", ""),
                (E.style.overflow = "hidden"),
                v.setProps({ arrow: !1, animation: "shift-away" }));
            },
            onMount: function () {
              if (N) {
                var V = E.style.transitionDuration,
                  P = Number(V.replace("ms", ""));
                L.style.transitionDelay = Math.round(P / 10) + "ms";
                N.style.transitionDuration = V;
                t([N], "visible");
              }
            },
            onShow: function () {
              N && (N.style.transitionDuration = "0ms");
            },
            onHide: function () {
              N && t([N], "hidden");
            },
          };
        },
      },
      {
        name: "followCursor",
        defaultValue: !1,
        fn: function (v) {
          function D() {
            Q = !0;
            v.setProps({ getReferenceClientRect: null });
            Q = !1;
          }
          function E(ja) {
            var qa = ja.target ? V.contains(ja.target) : !0,
              O = v.props.followCursor,
              ua = ja.clientX,
              za = ja.clientY;
            ja = V.getBoundingClientRect();
            var T = ua - ja.left,
              ha = za - ja.top;
            (!qa && v.props.interactive) ||
              v.setProps({
                getReferenceClientRect: function () {
                  var ra = V.getBoundingClientRect(),
                    va = ua,
                    Aa = za;
                  "initial" === O && ((va = ra.left + T), (Aa = ra.top + ha));
                  var Fa = "horizontal" === O ? ra.top : Aa,
                    Ma = "vertical" === O ? ra.right : va;
                  Aa = "horizontal" === O ? ra.bottom : Aa;
                  ra = "vertical" === O ? ra.left : va;
                  return {
                    width: Ma - ra,
                    height: Aa - Fa,
                    top: Fa,
                    right: Ma,
                    bottom: Aa,
                    left: ra,
                  };
                },
              });
          }
          function L() {
            v.props.followCursor &&
              (Wa.push({ instance: v, doc: P }),
              P.addEventListener("mousemove", sa));
          }
          function N() {
            Wa = Wa.filter(function (ja) {
              return ja.instance !== v;
            });
            0 ===
              Wa.filter(function (ja) {
                return ja.doc === P;
              }).length && P.removeEventListener("mousemove", sa);
          }
          var V = v.reference,
            P = z(v.props.triggerTarget || V),
            Q = !1,
            R = !1,
            Z = !0,
            pa = v.props;
          return {
            onCreate: L,
            onDestroy: N,
            onBeforeUpdate: function () {
              pa = v.props;
            },
            onAfterUpdate: function (ja, qa) {
              var O = qa.followCursor;
              Q ||
                void 0 === O ||
                pa.followCursor === O ||
                (N(),
                O
                  ? (L(),
                    !v.state.isMounted ||
                      R ||
                      ("initial" === v.props.followCursor &&
                        v.state.isVisible) ||
                      P.addEventListener("mousemove", E))
                  : (P.removeEventListener("mousemove", E), D()));
            },
            onMount: function () {
              v.props.followCursor &&
                !R &&
                (Z && (E(cb), (Z = !1)),
                ("initial" === v.props.followCursor && v.state.isVisible) ||
                  P.addEventListener("mousemove", E));
            },
            onTrigger: function (ja, qa) {
              e(qa, "MouseEvent") &&
                (cb = { clientX: qa.clientX, clientY: qa.clientY });
              R = "focus" === qa.type;
            },
            onHidden: function () {
              v.props.followCursor &&
                (D(), P.removeEventListener("mousemove", E), (Z = !0));
            },
          };
        },
      },
      {
        name: "inlinePositioning",
        defaultValue: !1,
        fn: function (v) {
          function D() {
            if (!V) {
              var Q = U(v.props, P);
              V = !0;
              v.setProps(Q);
              V = !1;
            }
          }
          var E = v.reference,
            L,
            N = -1,
            V = !1,
            P = {
              name: "tippyInlinePositioning",
              enabled: !0,
              phase: "afterWrite",
              fn: function (Q) {
                var R = Q.state;
                v.props.inlinePositioning &&
                  (L !== R.placement &&
                    v.setProps({
                      getReferenceClientRect: function () {
                        return K(
                          R.placement.split("-")[0],
                          E.getBoundingClientRect(),
                          [].slice.call(E.getClientRects()),
                          N
                        );
                      },
                    }),
                  (L = R.placement));
              },
            };
          return {
            onCreate: D,
            onAfterUpdate: D,
            onTrigger: function (Q, R) {
              if (e(R, "MouseEvent")) {
                var Z = [].slice.call(v.reference.getClientRects()),
                  pa = Z.find(function (ja) {
                    return (
                      ja.left - 2 <= R.clientX &&
                      ja.right + 2 >= R.clientX &&
                      ja.top - 2 <= R.clientY &&
                      ja.bottom + 2 >= R.clientY
                    );
                  });
                N = Z.indexOf(pa);
              }
            },
            onUntrigger: function () {
              N = -1;
            },
          };
        },
      },
      {
        name: "sticky",
        defaultValue: !1,
        fn: function (v) {
          function D() {
            var P =
                !0 === v.props.sticky || "reference" === v.props.sticky
                  ? (v.popperInstance
                      ? v.popperInstance.state.elements.reference
                      : E
                    ).getBoundingClientRect()
                  : null,
              Q =
                !0 === v.props.sticky || "popper" === v.props.sticky
                  ? L.getBoundingClientRect()
                  : null;
            ((P && da(N, P)) || (Q && da(V, Q))) &&
              v.popperInstance &&
              v.popperInstance.update();
            N = P;
            V = Q;
            v.state.isMounted && requestAnimationFrame(D);
          }
          var E = v.reference,
            L = v.popper,
            N = null,
            V = null;
          return {
            onMount: function () {
              v.props.sticky && D();
            },
          };
        },
      },
    ],
    render: H,
  });
  aa.createSingleton = function (v, D) {
    function E() {
      R = Q.map(function (T) {
        return T.reference;
      });
    }
    function L(T) {
      Q.forEach(function (ha) {
        T ? ha.enable() : ha.disable();
      });
    }
    function N(T) {
      return Q.map(function (ha) {
        var ra = ha.setProps;
        ha.setProps = function (va) {
          ra(va);
          ha.reference === Z && T.setProps(va);
        };
        return function () {
          ha.setProps = ra;
        };
      });
    }
    function V(T, ha) {
      var ra = R.indexOf(ha);
      if (ha !== Z) {
        Z = ha;
        var va = (pa || []).concat("content").reduce(function (Aa, Fa) {
          Aa[Fa] = Q[ra].props[Fa];
          return Aa;
        }, {});
        T.setProps(
          Object.assign({}, va, {
            getReferenceClientRect:
              "function" === typeof va.getReferenceClientRect
                ? va.getReferenceClientRect
                : function () {
                    return ha.getBoundingClientRect();
                  },
          })
        );
      }
    }
    var P;
    void 0 === D && (D = {});
    Y(
      !Array.isArray(v),
      [
        "The first argument passed to createSingleton() must be an array of tippy instances. The passed value was",
        String(v),
      ].join(" ")
    );
    var Q = v,
      R = [],
      Z,
      pa = D.overrides,
      ja = [],
      qa = !1;
    L(!1);
    E();
    var O = aa(
        m(),
        Object.assign({}, g(D, ["overrides"]), {
          plugins: [
            {
              fn: function () {
                return {
                  onDestroy: function () {
                    L(!0);
                  },
                  onHidden: function () {
                    Z = null;
                  },
                  onClickOutside: function (T) {
                    T.props.showOnCreate && !qa && ((qa = !0), (Z = null));
                  },
                  onShow: function (T) {
                    T.props.showOnCreate && !qa && ((qa = !0), V(T, R[0]));
                  },
                  onTrigger: function (T, ha) {
                    V(T, ha.currentTarget);
                  },
                };
              },
            },
          ].concat(D.plugins || []),
          triggerTarget: R,
          popperOptions: Object.assign({}, D.popperOptions, {
            modifiers: [].concat(
              (null == (P = D.popperOptions) ? void 0 : P.modifiers) || [],
              [ub]
            ),
          }),
        })
      ),
      ua = O.show;
    O.show = function (T) {
      ua();
      if (!Z && null == T) return V(O, R[0]);
      if (!Z || null != T) {
        if ("number" === typeof T) return R[T] && V(O, R[T]);
        if (Q.includes(T)) return V(O, T.reference);
        if (R.includes(T)) return V(O, T);
      }
    };
    O.showNext = function () {
      var T = R[0];
      if (!Z) return O.show(0);
      var ha = R.indexOf(Z);
      O.show(R[ha + 1] || T);
    };
    O.showPrevious = function () {
      var T = R[R.length - 1];
      if (!Z) return O.show(T);
      var ha = R.indexOf(Z);
      O.show(R[ha - 1] || T);
    };
    var za = O.setProps;
    O.setProps = function (T) {
      pa = T.overrides || pa;
      za(T);
    };
    O.setInstances = function (T) {
      L(!0);
      ja.forEach(function (ha) {
        return ha();
      });
      Q = T;
      L(!1);
      E();
      N(O);
      O.setProps({ triggerTarget: R });
    };
    ja = N(O);
    return O;
  };
  aa.delegate = function (v, D) {
    function E(O) {
      if (O.target && !R) {
        var ua = O.target.closest(Z);
        if (ua) {
          var za =
            ua.getAttribute("data-tippy-trigger") || D.trigger || la.trigger;
          ua._tippy ||
            ("touchstart" === O.type && "boolean" === typeof qa.touch) ||
            ("touchstart" !== O.type && 0 > za.indexOf(vb[O.type])) ||
            ((O = aa(ua, qa)) && (Q = Q.concat(O)));
        }
      }
    }
    function L(O, ua, za, T) {
      void 0 === T && (T = !1);
      O.addEventListener(ua, za, T);
      P.push({ node: O, eventType: ua, handler: za, options: T });
    }
    function N(O) {
      O = O.reference;
      L(O, "touchstart", E, Ba);
      L(O, "mouseover", E);
      L(O, "focusin", E);
      L(O, "click", E);
    }
    function V() {
      P.forEach(function (O) {
        O.node.removeEventListener(O.eventType, O.handler, O.options);
      });
      P = [];
    }
    Y(
      !(D && D.target),
      "You must specity a `target` prop indicating a CSS selector string matching the target elements that should receive a tippy."
    );
    var P = [],
      Q = [],
      R = !1,
      Z = D.target,
      pa = g(D, ["target"]),
      ja = Object.assign({}, pa, { trigger: "manual", touch: !1 }),
      qa = Object.assign({}, pa, { showOnCreate: !0 });
    pa = aa(v, ja);
    [].concat(pa).forEach(function (O) {
      var ua = O.destroy,
        za = O.enable,
        T = O.disable;
      O.destroy = function (ha) {
        void 0 === ha && (ha = !0);
        ha &&
          Q.forEach(function (ra) {
            ra.destroy();
          });
        Q = [];
        V();
        ua();
      };
      O.enable = function () {
        za();
        Q.forEach(function (ha) {
          return ha.enable();
        });
        R = !1;
      };
      O.disable = function () {
        T();
        Q.forEach(function (ha) {
          return ha.disable();
        });
        R = !0;
      };
      N(O);
    });
    return pa;
  };
  aa.hideAll = function (v) {
    v = void 0 === v ? {} : v;
    var D = v.exclude,
      E = v.duration;
    Va.forEach(function (L) {
      var N = !1;
      D &&
        (N =
          D && D._tippy && D._tippy.reference === D
            ? L.reference === D
            : L.popper === D.popper);
      N ||
        ((N = L.props.duration),
        L.setProps({ duration: E }),
        L.hide(),
        L.state.isDestroyed || L.setProps({ duration: N }));
    });
  };
  aa.roundArrow =
    '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
  return aa;
});
(function () {
  function a(w) {
    w = String(w);
    return w.charAt(0).toUpperCase() + w.slice(1);
  }
  function d(w, B) {
    var u = -1,
      r = w ? w.length : 0;
    if ("number" == typeof r && -1 < r && r <= q)
      for (; ++u < r; ) B(w[u], u, w);
    else e(w, B);
  }
  function b(w) {
    w = String(w).replace(/^ +| +$/g, "");
    return /^(?:webOS|i(?:OS|P))/.test(w) ? w : a(w);
  }
  function e(w, B) {
    for (var u in w) z.call(w, u) && B(w[u], u, w);
  }
  function c(w) {
    return null == w ? a(w) : A.call(w).slice(8, -1);
  }
  function f(w, B) {
    var u = null != w ? typeof w[B] : "number";
    return (
      !/^(?:boolean|number|string|undefined)$/.test(u) &&
      ("object" == u ? !!w[B] : !0)
    );
  }
  function g(w) {
    return String(w).replace(/([ -])(?!$)/g, "$1?");
  }
  function h(w, B) {
    var u = null;
    d(w, function (r, y) {
      u = B(u, r, y, w);
    });
    return u;
  }
  function l(w) {
    function B(ka) {
      return h(ka, function (ia, ba) {
        var xa = ba.pattern || g(ba);
        !ia &&
          (ia =
            RegExp("\\b" + xa + " *\\d+[.\\w_]*", "i").exec(w) ||
            RegExp("\\b" + xa + " *\\w+-[\\w]*", "i").exec(w) ||
            RegExp(
              "\\b" + xa + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)",
              "i"
            ).exec(w)) &&
          ((ia = String(
            ba.label && !RegExp(xa, "i").test(ba.label) ? ba.label : ia
          ).split("/"))[1] &&
            !/[\d.]+/.test(ia[0]) &&
            (ia[0] += " " + ia[1]),
          (ba = ba.label || ba),
          (ia = b(
            ia[0]
              .replace(RegExp(xa, "i"), ba)
              .replace(RegExp("; *(?:" + ba + "[_-])?", "i"), " ")
              .replace(RegExp("(" + ba + ")[-_.]?(\\w)", "i"), "$1 $2")
          )));
        return ia;
      });
    }
    function u(ka) {
      return h(ka, function (ia, ba) {
        return (
          ia ||
          (RegExp(
            ba + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)",
            "i"
          ).exec(w) || 0)[1] ||
          null
        );
      });
    }
    var r = m,
      y = w && "object" == typeof w && "String" != c(w);
    y && ((r = w), (w = null));
    var J = r.navigator || {},
      I = J.userAgent || "";
    w || (w = I);
    var Y = y
        ? !!J.likeChrome
        : /\bChrome\b/.test(w) && !/internal|\n/i.test(A.toString()),
      X = y ? "Object" : "ScriptBridgingProxyObject",
      fa = y ? "Object" : "Environment",
      oa = y && r.java ? "JavaPackage" : c(r.java),
      ta = y ? "Object" : "RuntimeObject";
    fa = (oa = /\bJava/.test(oa) && r.java) && c(r.environment) == fa;
    var Ga = oa ? "a" : "\u03b1",
      Ha = oa ? "b" : "\u03b2",
      Ca = r.document || {},
      na = r.operamini || r.opera,
      H = t.test((H = y && na ? na["[[Class]]"] : c(na))) ? H : (na = null),
      x,
      aa = w;
    y = [];
    var wa = null,
      sa = w == I;
    I = sa && na && "function" == typeof na.version && na.version();
    var U = (function (ka) {
        return h(ka, function (ia, ba) {
          return (
            ia ||
            (RegExp("\\b" + (ba.pattern || g(ba)) + "\\b", "i").exec(w) &&
              (ba.label || ba))
          );
        });
      })([
        { label: "EdgeHTML", pattern: "Edge" },
        "Trident",
        { label: "WebKit", pattern: "AppleWebKit" },
        "iCab",
        "Presto",
        "NetFront",
        "Tasman",
        "KHTML",
        "Gecko",
      ]),
      K = (function (ka) {
        return h(ka, function (ia, ba) {
          return (
            ia ||
            (RegExp("\\b" + (ba.pattern || g(ba)) + "\\b", "i").exec(w) &&
              (ba.label || ba))
          );
        });
      })([
        "Adobe AIR",
        "Arora",
        "Avant Browser",
        "Breach",
        "Camino",
        "Electron",
        "Epiphany",
        "Fennec",
        "Flock",
        "Galeon",
        "GreenBrowser",
        "iCab",
        "Iceweasel",
        "K-Meleon",
        "Konqueror",
        "Lunascape",
        "Maxthon",
        { label: "Microsoft Edge", pattern: "Edge" },
        "Midori",
        "Nook Browser",
        "PaleMoon",
        "PhantomJS",
        "Raven",
        "Rekonq",
        "RockMelt",
        { label: "Samsung Internet", pattern: "SamsungBrowser" },
        "SeaMonkey",
        { label: "Silk", pattern: "(?:Cloud9|Silk-Accelerated)" },
        "Sleipnir",
        "SlimBrowser",
        { label: "SRWare Iron", pattern: "Iron" },
        "Sunrise",
        "Swiftfox",
        "Waterfox",
        "WebPositive",
        "Opera Mini",
        { label: "Opera Mini", pattern: "OPiOS" },
        "Opera",
        { label: "Opera", pattern: "OPR" },
        "Chrome",
        { label: "Chrome Mobile", pattern: "(?:CriOS|CrMo)" },
        { label: "Firefox", pattern: "(?:Firefox|Minefield)" },
        { label: "Firefox for iOS", pattern: "FxiOS" },
        { label: "IE", pattern: "IEMobile" },
        { label: "IE", pattern: "MSIE" },
        "Safari",
      ]),
      da = B([
        { label: "BlackBerry", pattern: "BB10" },
        "BlackBerry",
        { label: "Galaxy S", pattern: "GT-I9000" },
        { label: "Galaxy S2", pattern: "GT-I9100" },
        { label: "Galaxy S3", pattern: "GT-I9300" },
        { label: "Galaxy S4", pattern: "GT-I9500" },
        { label: "Galaxy S5", pattern: "SM-G900" },
        { label: "Galaxy S6", pattern: "SM-G920" },
        { label: "Galaxy S6 Edge", pattern: "SM-G925" },
        { label: "Galaxy S7", pattern: "SM-G930" },
        { label: "Galaxy S7 Edge", pattern: "SM-G935" },
        "Google TV",
        "Lumia",
        "iPad",
        "iPod",
        "iPhone",
        "Kindle",
        { label: "Kindle Fire", pattern: "(?:Cloud9|Silk-Accelerated)" },
        "Nexus",
        "Nook",
        "PlayBook",
        "PlayStation Vita",
        "PlayStation",
        "TouchPad",
        "Transformer",
        { label: "Wii U", pattern: "WiiU" },
        "Wii",
        "Xbox One",
        { label: "Xbox 360", pattern: "Xbox" },
        "Xoom",
      ]),
      ya = (function (ka) {
        return h(ka, function (ia, ba, xa) {
          return (
            ia ||
            ((ba[da] ||
              ba[/^[a-z]+(?: +[a-z]+\b)*/i.exec(da)] ||
              RegExp("\\b" + g(xa) + "(?:\\b|\\w*\\d)", "i").exec(w)) &&
              xa)
          );
        });
      })({
        Apple: { iPad: 1, iPhone: 1, iPod: 1 },
        Archos: {},
        Amazon: { Kindle: 1, "Kindle Fire": 1 },
        Asus: { Transformer: 1 },
        "Barnes & Noble": { Nook: 1 },
        BlackBerry: { PlayBook: 1 },
        Google: { "Google TV": 1, Nexus: 1 },
        HP: { TouchPad: 1 },
        HTC: {},
        LG: {},
        Microsoft: { Xbox: 1, "Xbox One": 1 },
        Motorola: { Xoom: 1 },
        Nintendo: { "Wii U": 1, Wii: 1 },
        Nokia: { Lumia: 1 },
        Samsung: {
          "Galaxy S": 1,
          "Galaxy S2": 1,
          "Galaxy S3": 1,
          "Galaxy S4": 1,
        },
        Sony: { PlayStation: 1, "PlayStation Vita": 1 },
      }),
      M = (function (ka) {
        return h(ka, function (ia, ba) {
          var xa = ba.pattern || g(ba);
          if (
            !ia &&
            (ia = RegExp("\\b" + xa + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(w))
          ) {
            var la = ia,
              La = ba.label || ba,
              Oa = {
                "10.0": "10",
                6.4: "10 Technical Preview",
                6.3: "8.1",
                6.2: "8",
                6.1: "Server 2008 R2 / 7",
                "6.0": "Server 2008 / Vista",
                5.2: "Server 2003 / XP 64-bit",
                5.1: "XP",
                5.01: "2000 SP1",
                "5.0": "2000",
                "4.0": "NT",
                "4.90": "ME",
              };
            xa &&
              La &&
              /^Win/i.test(la) &&
              !/^Windows Phone /i.test(la) &&
              (Oa = Oa[/[\d.]+$/.exec(la)]) &&
              (la = "Windows " + Oa);
            la = String(la);
            xa && La && (la = la.replace(RegExp(xa, "i"), La));
            ia = la = b(
              la
                .replace(/ ce$/i, " CE")
                .replace(/\bhpw/i, "web")
                .replace(/\bMacintosh\b/, "Mac OS")
                .replace(/_PowerPC\b/i, " OS")
                .replace(/\b(OS X) [^ \d]+/i, "$1")
                .replace(/\bMac (OS X)\b/, "$1")
                .replace(/\/(\d)/, " $1")
                .replace(/_/g, ".")
                .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "")
                .replace(/\bx86\.64\b/gi, "x86_64")
                .replace(/\b(Windows Phone) OS\b/, "$1")
                .replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1")
                .split(" on ")[0]
            );
          }
          return ia;
        });
      })([
        "Windows Phone",
        "Android",
        "CentOS",
        { label: "Chrome OS", pattern: "CrOS" },
        "Debian",
        "Fedora",
        "FreeBSD",
        "Gentoo",
        "Haiku",
        "Kubuntu",
        "Linux Mint",
        "OpenBSD",
        "Red Hat",
        "SuSE",
        "Ubuntu",
        "Xubuntu",
        "Cygwin",
        "Symbian OS",
        "hpwOS",
        "webOS ",
        "webOS",
        "Tablet OS",
        "Tizen",
        "Linux",
        "Mac OS X",
        "Macintosh",
        "Mac",
        "Windows 98;",
        "Windows ",
      ]);
    U && (U = [U]);
    ya && !da && (da = B([ya]));
    if ((x = /\bGoogle TV\b/.exec(da))) da = x[0];
    /\bSimulator\b/i.test(w) && (da = (da ? da + " " : "") + "Simulator");
    "Opera Mini" == K &&
      /\bOPiOS\b/.test(w) &&
      y.push("running in Turbo/Uncompressed mode");
    "IE" == K && /\blike iPhone OS\b/.test(w)
      ? ((x = l(w.replace(/like iPhone OS/, ""))),
        (ya = x.manufacturer),
        (da = x.product))
      : /^iP/.test(da)
      ? (K || (K = "Safari"),
        (M =
          "iOS" +
          ((x = / OS ([\d_]+)/i.exec(w)) ? " " + x[1].replace(/_/g, ".") : "")))
      : "Konqueror" != K || /buntu/i.test(M)
      ? (ya &&
          "Google" != ya &&
          ((/Chrome/.test(K) && !/\bMobile Safari\b/i.test(w)) ||
            /\bVita\b/.test(da))) ||
        (/\bAndroid\b/.test(M) && /^Chrome/.test(K) && /\bVersion\//i.test(w))
        ? ((K = "Android Browser"), (M = /\bAndroid\b/.test(M) ? M : "Android"))
        : "Silk" == K
        ? (/\bMobi/i.test(w) || ((M = "Android"), y.unshift("desktop mode")),
          /Accelerated *= *true/i.test(w) && y.unshift("accelerated"))
        : "PaleMoon" == K && (x = /\bFirefox\/([\d.]+)\b/.exec(w))
        ? y.push("identifying as Firefox " + x[1])
        : "Firefox" == K && (x = /\b(Mobile|Tablet|TV)\b/i.exec(w))
        ? (M || (M = "Firefox OS"), da || (da = x[1]))
        : !K ||
          (x = !/\bMinefield\b/i.test(w) && /\b(?:Firefox|Safari)\b/.exec(K))
        ? (K &&
            !da &&
            /[\/,]|^[^(]+?\)/.test(w.slice(w.indexOf(x + "/") + 8)) &&
            (K = null),
          (x = da || ya || M) &&
            (da ||
              ya ||
              /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(M)) &&
            (K =
              /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(M) ? M : x) +
              " Browser"))
        : "Electron" == K &&
          (x = (/\bChrome\/([\d.]+)\b/.exec(w) || 0)[1]) &&
          y.push("Chromium " + x)
      : (M = "Kubuntu");
    I ||
      (I = u([
        "(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))",
        "Version",
        g(K),
        "(?:Firefox|Minefield|NetFront)",
      ]));
    if (
      (x =
        ("iCab" == U && 3 < parseFloat(I) && "WebKit") ||
        (/\bOpera\b/.test(K) && (/\bOPR\b/.test(w) ? "Blink" : "Presto")) ||
        (/\b(?:Midori|Nook|Safari)\b/i.test(w) &&
          !/^(?:Trident|EdgeHTML)$/.test(U) &&
          "WebKit") ||
        (!U && /\bMSIE\b/i.test(w) && ("Mac OS" == M ? "Tasman" : "Trident")) ||
        ("WebKit" == U && /\bPlayStation\b(?! Vita\b)/i.test(K) && "NetFront"))
    )
      U = [x];
    "IE" == K && (x = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(w) || 0)[1])
      ? ((K += " Mobile"),
        (M = "Windows Phone " + (/\+$/.test(x) ? x : x + ".x")),
        y.unshift("desktop mode"))
      : /\bWPDesktop\b/i.test(w)
      ? ((K = "IE Mobile"),
        (M = "Windows Phone 8.x"),
        y.unshift("desktop mode"),
        I || (I = (/\brv:([\d.]+)/.exec(w) || 0)[1]))
      : "IE" != K &&
        "Trident" == U &&
        (x = /\brv:([\d.]+)/.exec(w)) &&
        (K && y.push("identifying as " + K + (I ? " " + I : "")),
        (K = "IE"),
        (I = x[1]));
    if (sa) {
      if (f(r, "global"))
        if (
          (oa &&
            ((x = oa.lang.System),
            (aa = x.getProperty("os.arch")),
            (M =
              M ||
              x.getProperty("os.name") + " " + x.getProperty("os.version"))),
          fa)
        ) {
          try {
            (I = r.require("ringo/engine").version.join(".")), (K = "RingoJS");
          } catch (ka) {
            (x = r.system) &&
              x.global.system == r.system &&
              ((K = "Narwhal"), M || (M = x[0].os || null));
          }
          K || (K = "Rhino");
        } else
          "object" == typeof r.process &&
            !r.process.browser &&
            (x = r.process) &&
            ("object" == typeof x.versions &&
              ("string" == typeof x.versions.electron
                ? (y.push("Node " + x.versions.node),
                  (K = "Electron"),
                  (I = x.versions.electron))
                : "string" == typeof x.versions.nw &&
                  (y.push("Chromium " + I, "Node " + x.versions.node),
                  (K = "NW.js"),
                  (I = x.versions.nw))),
            K ||
              ((K = "Node.js"),
              (aa = x.arch),
              (M = x.platform),
              (I = (I = /[\d.]+/.exec(x.version)) ? I[0] : null)));
      else
        c((x = r.runtime)) == X
          ? ((K = "Adobe AIR"), (M = x.flash.system.Capabilities.os))
          : c((x = r.phantom)) == ta
          ? ((K = "PhantomJS"),
            (I =
              (x = x.version || null) &&
              x.major + "." + x.minor + "." + x.patch))
          : "number" == typeof Ca.documentMode &&
            (x = /\bTrident\/(\d+)/i.exec(w))
          ? ((I = [I, Ca.documentMode]),
            (x = +x[1] + 4) != I[1] &&
              (y.push("IE " + I[1] + " mode"), U && (U[1] = ""), (I[1] = x)),
            (I = "IE" == K ? String(I[1].toFixed(1)) : I[0]))
          : "number" == typeof Ca.documentMode &&
            /^(?:Chrome|Firefox)\b/.test(K) &&
            (y.push("masking as " + K + " " + I),
            (K = "IE"),
            (I = "11.0"),
            (U = ["Trident"]),
            (M = "Windows"));
      M = M && b(M);
    }
    I &&
      (x =
        /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(I) ||
        /(?:alpha|beta)(?: ?\d)?/i.exec(w + ";" + (sa && J.appMinorVersion)) ||
        (/\bMinefield\b/i.test(w) && "a")) &&
      ((wa = /b/i.test(x) ? "beta" : "alpha"),
      (I =
        I.replace(RegExp(x + "\\+?$"), "") +
        ("beta" == wa ? Ha : Ga) +
        (/\d+\+?/.exec(x) || "")));
    if (
      "Fennec" == K ||
      ("Firefox" == K && /\b(?:Android|Firefox OS)\b/.test(M))
    )
      K = "Firefox Mobile";
    else if ("Maxthon" == K && I) I = I.replace(/\.[\d.]+/, ".x");
    else if (/\bXbox\b/i.test(da))
      "Xbox 360" == da && (M = null),
        "Xbox 360" == da && /\bIEMobile\b/.test(w) && y.unshift("mobile mode");
    else if (
      (!/^(?:Chrome|IE|Opera)$/.test(K) &&
        (!K || da || /Browser|Mobi/.test(K))) ||
      ("Windows CE" != M && !/Mobi/i.test(w))
    )
      if ("IE" == K && sa)
        try {
          null === r.external && y.unshift("platform preview");
        } catch (ka) {
          y.unshift("embedded");
        }
      else
        (/\bBlackBerry\b/.test(da) || /\bBB10\b/.test(w)) &&
        (x =
          (RegExp(da.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(w) ||
            0)[1] || I)
          ? ((x = [x, /BB10/.test(w)]),
            (M =
              (x[1] ? ((da = null), (ya = "BlackBerry")) : "Device Software") +
              " " +
              x[0]),
            (I = null))
          : this != e &&
            "Wii" != da &&
            ((sa && na) ||
              (/Opera/.test(K) && /\b(?:MSIE|Firefox)\b/i.test(w)) ||
              ("Firefox" == K && /\bOS X (?:\d+\.){2,}/.test(M)) ||
              ("IE" == K &&
                ((M && !/^Win/.test(M) && 5.5 < I) ||
                  (/\bWindows XP\b/.test(M) && 8 < I) ||
                  (8 == I && !/\bTrident\b/.test(w))))) &&
            !t.test((x = l.call(e, w.replace(t, "") + ";"))) &&
            x.name &&
            ((x = "ing as " + x.name + ((x = x.version) ? " " + x : "")),
            t.test(K)
              ? (/\bIE\b/.test(x) && "Mac OS" == M && (M = null),
                (x = "identify" + x))
              : ((x = "mask" + x),
                (K = H ? b(H.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera"),
                /\bIE\b/.test(x) && (M = null),
                sa || (I = null)),
            (U = ["Presto"]),
            y.push(x));
    else K += " Mobile";
    if ((x = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(w) || 0)[1])) {
      x = [parseFloat(x.replace(/\.(\d)$/, ".0$1")), x];
      if ("Safari" == K && "+" == x[1].slice(-1))
        (K = "WebKit Nightly"), (wa = "alpha"), (I = x[1].slice(0, -1));
      else if (
        I == x[1] ||
        I == (x[2] = (/\bSafari\/([\d.]+\+?)/i.exec(w) || 0)[1])
      )
        I = null;
      x[1] = (/\bChrome\/([\d.]+)/i.exec(w) || 0)[1];
      537.36 == x[0] &&
        537.36 == x[2] &&
        28 <= parseFloat(x[1]) &&
        "WebKit" == U &&
        (U = ["Blink"]);
      sa && (Y || x[1])
        ? (U && (U[1] = "like Chrome"),
          (x =
            x[1] ||
            ((x = x[0]),
            530 > x
              ? 1
              : 532 > x
              ? 2
              : 532.05 > x
              ? 3
              : 533 > x
              ? 4
              : 534.03 > x
              ? 5
              : 534.07 > x
              ? 6
              : 534.1 > x
              ? 7
              : 534.13 > x
              ? 8
              : 534.16 > x
              ? 9
              : 534.24 > x
              ? 10
              : 534.3 > x
              ? 11
              : 535.01 > x
              ? 12
              : 535.02 > x
              ? "13+"
              : 535.07 > x
              ? 15
              : 535.11 > x
              ? 16
              : 535.19 > x
              ? 17
              : 536.05 > x
              ? 18
              : 536.1 > x
              ? 19
              : 537.01 > x
              ? 20
              : 537.11 > x
              ? "21+"
              : 537.13 > x
              ? 23
              : 537.18 > x
              ? 24
              : 537.24 > x
              ? 25
              : 537.36 > x
              ? 26
              : "Blink" != U
              ? "27"
              : "28")))
        : (U && (U[1] = "like Safari"),
          (x =
            ((x = x[0]),
            400 > x
              ? 1
              : 500 > x
              ? 2
              : 526 > x
              ? 3
              : 533 > x
              ? 4
              : 534 > x
              ? "4+"
              : 535 > x
              ? 5
              : 537 > x
              ? 6
              : 538 > x
              ? 7
              : 601 > x
              ? 8
              : "8")));
      U &&
        (U[1] +=
          " " + (x += "number" == typeof x ? ".x" : /[.+]/.test(x) ? "" : "+"));
      "Safari" == K && (!I || 45 < parseInt(I)) && (I = x);
    }
    "Opera" == K && (x = /\bzbov|zvav$/.exec(M))
      ? ((K += " "),
        y.unshift("desktop mode"),
        "zvav" == x ? ((K += "Mini"), (I = null)) : (K += "Mobile"),
        (M = M.replace(RegExp(" *" + x + "$"), "")))
      : "Safari" == K &&
        /\bChrome\b/.exec(U && U[1]) &&
        (y.unshift("desktop mode"),
        (K = "Chrome Mobile"),
        (I = null),
        /\bOS X\b/.test(M) ? ((ya = "Apple"), (M = "iOS 4.3+")) : (M = null));
    I &&
      0 == I.indexOf((x = /[\d.]+$/.exec(M))) &&
      -1 < w.indexOf("/" + x + "-") &&
      (M = String(M.replace(x, "")).replace(/^ +| +$/g, ""));
    U &&
      !/\b(?:Avant|Nook)\b/.test(K) &&
      (/Browser|Lunascape|Maxthon/.test(K) ||
        ("Safari" != K && /^iOS/.test(M) && /\bSafari\b/.test(U[1])) ||
        (/^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(
          K
        ) &&
          U[1])) &&
      (x = U[U.length - 1]) &&
      y.push(x);
    y.length && (y = ["(" + y.join("; ") + ")"]);
    ya && da && 0 > da.indexOf(ya) && y.push("on " + ya);
    da && y.push((/^on /.test(y[y.length - 1]) ? "" : "on ") + da);
    if (M) {
      var Ba =
        (x = / ([\d.+]+)$/.exec(M)) &&
        "/" == M.charAt(M.length - x[0].length - 1);
      M = {
        architecture: 32,
        family: x && !Ba ? M.replace(x[0], "") : M,
        version: x ? x[1] : null,
        toString: function () {
          var ka = this.version;
          return (
            this.family +
            (ka && !Ba ? " " + ka : "") +
            (64 == this.architecture ? " 64-bit" : "")
          );
        },
      };
    }
    (x = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(aa)) && !/\bi686\b/i.test(aa)
      ? (M &&
          ((M.architecture = 64),
          (M.family = M.family.replace(RegExp(" *" + x), ""))),
        K &&
          (/\bWOW64\b/i.test(w) ||
            (sa &&
              /\w(?:86|32)$/.test(J.cpuClass || J.platform) &&
              !/\bWin64; x64\b/i.test(w))) &&
          y.unshift("32-bit"))
      : M &&
        /^OS X/.test(M.family) &&
        "Chrome" == K &&
        39 <= parseFloat(I) &&
        (M.architecture = 64);
    w || (w = null);
    r = {};
    r.description = w;
    r.layout = U && U[0];
    r.manufacturer = ya;
    r.name = K;
    r.prerelease = wa;
    r.product = da;
    r.ua = w;
    r.version = K && I;
    r.os = M || {
      architecture: null,
      family: null,
      version: null,
      toString: function () {
        return "null";
      },
    };
    r.parse = l;
    r.toString = function () {
      return this.description || "";
    };
    r.version && y.unshift(I);
    r.name && y.unshift(K);
    M &&
      K &&
      (M != String(M).split(" ")[0] || (M != K.split(" ")[0] && !da)) &&
      y.push(da ? "(" + M + ")" : "on " + M);
    y.length && (r.description = y.join(" "));
    return r;
  }
  var k = { function: !0, object: !0 },
    m = (k[typeof window] && window) || this,
    p = k[typeof exports] && exports;
  k = k[typeof module] && module && !module.nodeType && module;
  var n = p && k && "object" == typeof global && global;
  !n || (n.global !== n && n.window !== n && n.self !== n) || (m = n);
  var q = Math.pow(2, 53) - 1,
    t = /\bOpera/;
  n = Object.prototype;
  var z = n.hasOwnProperty,
    A = n.toString,
    C = l();
  "function" == typeof define && "object" == typeof define.amd && define.amd
    ? ((m.platform = C),
      define(function () {
        return C;
      }))
    : p && k
    ? e(C, function (w, B) {
        p[B] = w;
      })
    : (m.platform = C);
}.call(this));
function buildIOSMeta() {
  for (
    var a = [
        {
          name: "viewport",
          content:
            "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no",
        },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ],
      d = 0;
    d < a.length;
    d++
  ) {
    var b = document.createElement("meta");
    b.name = a[d].name;
    b.content = a[d].content;
    var e = window.document.head.querySelector('meta[name="' + b.name + '"]');
    e && e.parentNode.removeChild(e);
    window.document.head.appendChild(b);
  }
}
function hideIOSFullscreenPanel() {
  document.querySelector(".xxx-ios-fullscreen-message").style.display = "none";
  document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "none";
  document
    .querySelector(".xxx-game-iframe-full")
    .classList.remove("xxx-game-iframe-iphone-se");
}
function buildIOSFullscreenPanel() {
  var a = document.createElement(
    '<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>'
  );
  document.querySelector("body").appendChild(a);
}
function showIOSFullscreenPanel() {
  document.querySelector(".xxx-ios-fullscreen-message").style.display = "block";
  document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "block";
}
function __iosResize() {
  window.scrollTo(0, 0);
  console.log(window.devicePixelRatio);
  console.log(window.innerWidth);
  console.log(window.innerHeight);
  if ("iPhone" === platform.product)
    switch (window.devicePixelRatio) {
      case 2:
        switch (window.innerWidth) {
          case 568:
            320 !== window.innerHeight &&
              document
                .querySelector(".xxx-game-iframe-full")
                .classList.add("xxx-game-iframe-iphone-se");
            break;
          case 667:
            375 === window.innerHeight
              ? hideIOSFullscreenPanel()
              : showIOSFullscreenPanel();
            break;
          case 808:
            414 === window.innerHeight
              ? hideIOSFullscreenPanel()
              : showIOSFullscreenPanel();
            break;
          default:
            hideIOSFullscreenPanel();
        }
        break;
      case 3:
        switch (window.innerWidth) {
          case 736:
            414 === window.innerHeight
              ? hideIOSFullscreenPanel()
              : showIOSFullscreenPanel();
            break;
          case 724:
            375 === window.innerHeight
              ? hideIOSFullscreenPanel()
              : showIOSFullscreenPanel();
            break;
          case 808:
            414 === window.innerHeight
              ? hideIOSFullscreenPanel()
              : showIOSFullscreenPanel();
            break;
          default:
            hideIOSFullscreenPanel();
        }
        break;
      default:
        hideIOSFullscreenPanel();
    }
}
function iosResize() {
  __iosResize();
  setTimeout(function () {
    __iosResize();
  }, 500);
}
function iosInIframe() {
  try {
    return window.self !== window.top;
  } catch (a) {
    return !0;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  platform &&
    "iPhone" === platform.product &&
    "safari" !== platform.name.toLowerCase() &&
    !iosInIframe() &&
    (buildIOSFullscreenPanel(), buildIOSMeta());
});
window.addEventListener("resize", function (a) {
  platform &&
    "iPhone" === platform.product &&
    "safari" !== platform.name.toLowerCase() &&
    !iosInIframe() &&
    iosResize();
});
(function () {
  var a =
      "undefined" !== typeof window && "undefined" !== typeof window.document
        ? window.document
        : {},
    d = "undefined" !== typeof module && module.exports,
    b = (function () {
      for (
        var f,
          g = [
            "requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(
              " "
            ),
            "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(
              " "
            ),
            "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(
              " "
            ),
            "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(
              " "
            ),
            "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(
              " "
            ),
          ],
          h = 0,
          l = g.length,
          k = {};
        h < l;
        h++
      )
        if ((f = g[h]) && f[1] in a) {
          for (h = 0; h < f.length; h++) k[g[0][h]] = f[h];
          return k;
        }
      return !1;
    })(),
    e = { change: b.fullscreenchange, error: b.fullscreenerror },
    c = {
      request: function (f) {
        return new Promise(
          function (g, h) {
            var l = function () {
              this.off("change", l);
              g();
            }.bind(this);
            this.on("change", l);
            f = f || a.documentElement;
            Promise.resolve(f[b.requestFullscreen]())["catch"](h);
          }.bind(this)
        );
      },
      exit: function () {
        return new Promise(
          function (f, g) {
            if (this.isFullscreen) {
              var h = function () {
                this.off("change", h);
                f();
              }.bind(this);
              this.on("change", h);
              Promise.resolve(a[b.exitFullscreen]())["catch"](g);
            } else f();
          }.bind(this)
        );
      },
      toggle: function (f) {
        return this.isFullscreen ? this.exit() : this.request(f);
      },
      onchange: function (f) {
        this.on("change", f);
      },
      onerror: function (f) {
        this.on("error", f);
      },
      on: function (f, g) {
        var h = e[f];
        h && a.addEventListener(h, g, !1);
      },
      off: function (f, g) {
        var h = e[f];
        h && a.removeEventListener(h, g, !1);
      },
      raw: b,
    };
  b
    ? (Object.defineProperties(c, {
        isFullscreen: {
          get: function () {
            return !!a[b.fullscreenElement];
          },
        },
        element: {
          enumerable: !0,
          get: function () {
            return a[b.fullscreenElement];
          },
        },
        isEnabled: {
          enumerable: !0,
          get: function () {
            return !!a[b.fullscreenEnabled];
          },
        },
      }),
      d ? (module.exports = c) : (window.screenfull = c))
    : d
    ? (module.exports = { isEnabled: !1 })
    : (window.screenfull = { isEnabled: !1 });
})();
var CANVAS_WIDTH = 1920,
  CANVAS_HEIGHT = 1080,
  EDGEBOARD_X = 256,
  EDGEBOARD_Y = 84,
  PRIMARY_FONT = "RoundedMplus1c",
  FPS = 60,
  FPS_ANIMS = 40,
  FPS_TIME = 1e3 / FPS,
  DISABLE_SOUND_MOBILE = !1,
  ENABLE_FULLSCREEN = !0,
  GAME_PLAYERIO_ID = "four-colors-o2yb5hcxu2o4lkmfuuykw",
  GAME_NAME = "four_colors_gd",
  MULTIPLAYER_TEST_LOCAL = !1,
  COMBINED_PLAYERS_MODE = !1,
  STATE_LOADING = 0,
  STATE_MENU = 1,
  STATE_HELP = 2,
  STATE_GAME = 3,
  STATE_SELECT_PLAYERS = 4,
  ON_MOUSE_DOWN = 0,
  ON_MOUSE_UP = 1,
  ON_MOUSE_OVER = 2,
  ON_MOUSE_OUT = 3,
  ON_DRAG_START = 4,
  ON_DRAG_END = 5,
  ON_CARD_DEALED = 6,
  ON_HOME = 7,
  ON_CHECK = 8,
  ON_NEXT = 9,
  ON_SELECT_LANG = 10,
  ENABLE_CHECK_ORIENTATION,
  AD_SHOW_COUNTER,
  NUM_PLAYERS,
  STARTING_NUM_CARDS,
  CARD_WIDTH = 156,
  CARD_HEIGHT = 242,
  SOUNDTRACK_VOLUME_IN_GAME = 0.4,
  DEBUG_SHOW_CARDS = !1,
  ON_HUMAN_INTERACTION = "human_interact",
  ON_TIMER_END = 0,
  ON_LAST_TIMER_END = 1,
  CARD_SCORE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 20, 20, 50, 50],
  NUM_PENALTY_CARDS = 2,
  NUM_WILD_CARDS = 3,
  GAME_SCORE_WIN = 250,
  TIME_PER_MOVE = 2e4,
  TIME_HURRYUP_WARNING = 5e3,
  TIME_CONTROLLER_RADIUS = 50,
  NUM_ATTEMPT = 3,
  TIME_BG_COLORS = [373205, 15083560, 16767244, 374346],
  TIME_FOR_REMATCH_ANSWER = 4e4,
  BOTTOM = 0,
  TOP = 1,
  LEFT = 2,
  RIGHT = 3,
  HAND_POS = [];
HAND_POS.num_player_2 = [
  { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 350, side: BOTTOM },
  { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 350, side: TOP },
];
HAND_POS.num_player_3 = [
  { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 350, side: BOTTOM },
  { x: CANVAS_WIDTH / 2 - 650, y: CANVAS_HEIGHT / 2 - 40, side: LEFT },
  { x: CANVAS_WIDTH / 2 + 650, y: CANVAS_HEIGHT / 2, side: RIGHT },
];
HAND_POS.num_player_4 = [
  { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 350, side: BOTTOM },
  { x: CANVAS_WIDTH / 2 - 650, y: CANVAS_HEIGHT / 2 - 40, side: LEFT },
  { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 350, side: TOP },
  { x: CANVAS_WIDTH / 2 + 650, y: CANVAS_HEIGHT / 2 - 40, side: RIGHT },
];
var FOTOGRAM_COLOR = 52,
  FOTOGRAM_DRAW_FOUR = 53,
  ON_COLOR_SELECTED = 0,
  ACTION_NEXT_TURN = 0,
  ACTION_USE_CARD = 1,
  ACTION_ON_SHUFFLECARDS = 2,
  ACTION_ON_DRAWCARDS = 3,
  ACTION_ON_UNO_CLICK = 4,
  ACTION_SELECT_COLOR = 5,
  ACTION_DRAW_FOUR = 6,
  ACTION_BLOCK_TURN = 7,
  ACTION_INVERT_TURN = 8,
  ACTION_DRAW_TWO_COLORED = 9,
  ACTION_PLAYER_QUIT = 16,
  EFFECT_SELECT_COLOR = 0,
  EFFECT_DRAW_THREE = 1,
  EFFECT_STOP = 2,
  EFFECT_INVERT_TURN = 3,
  EFFECT_DRAW_TWO_COLORED = 4,
  EFFECT_NORMAL_CARD = 5,
  ON_APPLY_EFFECT = 0,
  ON_APPLY_PENALITY = 1,
  ON_UNO_CLICK = 2,
  DRAW_TYPE_NORMAL = 0,
  DRAW_TYPE_PENALITY = 1,
  DRAW_TYPE_DRAW2_COLORED = 2,
  DRAW_TYPE_DRAW3 = 3,
  GAME_STATE_DEALING = "dealing",
  GAME_STATE_TURN_START = "turn_start",
  GAME_STATE_DRAW = "draw",
  GAME_STATE_CHOOSE_COLOR = "choose_color",
  GAME_STATE_END = "game_end",
  GAME_STATE_ACTION_IN_PROGRESS = "action_in_progress",
  AI_MOVE_NULL = null,
  AI_MOVE_PLAYCARD = "playcard",
  AI_MOVE_DRAWCARD = "drawcard",
  NUM_LANGUAGES = 13,
  LANG_EN = 0,
  LANG_RU = 1,
  LANG_ES = 2,
  LANG_FR = 3,
  LANG_DE = 4,
  LANG_PT = 5,
  LANG_IT = 6,
  LANG_TR = 7,
  LANG_AR = 8,
  LANG_HI = 9,
  LANG_ID = 10,
  LANG_JA = 11,
  LANG_ZH = 12,
  LANG_CODES = {};
LANG_CODES.en = LANG_EN;
LANG_CODES.ru = LANG_RU;
LANG_CODES.es = LANG_ES;
LANG_CODES.fr = LANG_FR;
LANG_CODES.de = LANG_DE;
LANG_CODES.pt = LANG_PT;
LANG_CODES.it = LANG_IT;
LANG_CODES.ar = LANG_AR;
LANG_CODES.hi = LANG_HI;
LANG_CODES.tr = LANG_TR;
LANG_CODES.id = LANG_ID;
LANG_CODES.ja = LANG_JA;
LANG_CODES.zh = LANG_ZH;
LANG_CODES.be = LANG_RU;
LANG_CODES.kk = LANG_RU;
LANG_CODES.uk = LANG_RU;
LANG_CODES.uz = LANG_RU;
var PARAM_ROOM_ID = "roomid",
  PARAM_PASSWORD = "pwd",
  HTTPS_FORMAT = "https://%s/",
  CODETHISLAB_LINK_COM = "www.codethislab.com",
  CODETHISLAB_LINK_IT = "www.codethislab.it",
  CODETHISLAB_LINK = CODETHISLAB_LINK_COM,
  s_iScaleFactor = 1,
  s_bIsIphone = !1,
  s_iOffsetX,
  s_iOffsetY,
  s_bFocus = !0,
  MIN_KEYBOARD_HEIGHT = 300,
  s_bIsKeyboardOpen = !1,
  browserName = (function (a) {
    switch (!0) {
      case -1 < a.indexOf("edge"):
        return "MS Edge";
      case -1 < a.indexOf("edg/"):
        return "Edge ( chromium based)";
      case -1 < a.indexOf("opr") && !!window.opr:
        return "Opera";
      case -1 < a.indexOf("chrome") && !!window.chrome:
        return "Chrome";
      case -1 < a.indexOf("trident"):
        return "MS IE";
      case -1 < a.indexOf("firefox"):
        return "Mozilla Firefox";
      case -1 < a.indexOf("safari"):
        return "Safari";
      default:
        return "other";
    }
  })(window.navigator.userAgent.toLowerCase());
window.addEventListener(
  "resize",
  function (a) {
    sizeHandler();
  },
  !0
);
window.visualViewport.addEventListener("resize", function (a) {
  a.target.height < MIN_KEYBOARD_HEIGHT
    ? ((s_bIsKeyboardOpen = !0),
      document.querySelector(".ctl-multiplayer-dlg-wrapper") &&
        ((document.querySelector(".ctl-multiplayer-dlg-wrapper").style.height =
          a.target.height),
        (document.querySelector(
          ".ctl-multiplayer-dlg-content"
        ).style.transform = "translate(-50%, -50%) scale(0.5)")))
    : ((s_bIsKeyboardOpen = !1),
      document.querySelector(".ctl-multiplayer-dlg-wrapper") &&
        ((document.querySelector(
          ".ctl-multiplayer-dlg-content"
        ).style.transform = "translate(-50%, -50%) scale(1)"),
        (document.querySelector(".ctl-multiplayer-dlg-wrapper").style.height =
          "100%")));
});
function trace(a) {
  console.log(a);
}
function getSize(a) {
  var d = a.toLowerCase(),
    b = window.document,
    e = b.documentElement;
  if (void 0 === window["inner" + a]) a = e["client" + a];
  else if (window["inner" + a] != e["client" + a]) {
    var c = b.createElement("body");
    c.id = "vpw-test-b";
    c.style.cssText = "overflow:scroll";
    var f = b.createElement("div");
    f.id = "vpw-test-d";
    f.style.cssText = "position:absolute;top:-1000px";
    f.innerHTML =
      "<style>@media(" +
      d +
      ":" +
      e["client" + a] +
      "px){body#vpw-test-b div#vpw-test-d{" +
      d +
      ":7px!important}}</style>";
    c.appendChild(f);
    e.insertBefore(c, b.head);
    a = 7 == f["offset" + a] ? e["client" + a] : window["inner" + a];
    e.removeChild(c);
  } else a = window["inner" + a];
  return a;
}
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange() {
  window.matchMedia("(orientation: portrait)").matches && sizeHandler();
  window.matchMedia("(orientation: landscape)").matches && sizeHandler();
}
function isChrome() {
  return (
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  );
}
function isIpad() {
  var a = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
  return !a &&
    navigator.userAgent.match(/Mac/) &&
    navigator.maxTouchPoints &&
    2 < navigator.maxTouchPoints
    ? !0
    : a;
}
function isMobile() {
  return isIpad()
    ? !0
    : navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ? !0
    : !1;
}
function isIOS() {
  if (isIpad()) return !0;
  for (
    var a =
      "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(
        ";"
      );
    a.length;

  )
    if (navigator.platform === a.pop()) return (s_bIsIphone = !0);
  return (s_bIsIphone = !1);
}
function getIOSWindowHeight() {
  return (
    (document.documentElement.clientWidth / window.innerWidth) *
    window.innerHeight
  );
}
function getHeightOfIOSToolbars() {
  var a =
    (0 === window.orientation ? screen.height : screen.width) -
    getIOSWindowHeight();
  return 1 < a ? a : 0;
}
function sizeHandler() {
  window.scrollTo(0, 1);
  if (document.querySelector("#canvas")) {
    var a =
      null !== platform.name && "safari" === platform.name.toLowerCase()
        ? getIOSWindowHeight()
        : getSize("Height");
    var d = getSize("Width");
    s_bFocus && _checkOrientation(d, a);
    var b = Math.min(a / CANVAS_HEIGHT, d / CANVAS_WIDTH),
      e = Math.round(CANVAS_WIDTH * b);
    b = Math.round(CANVAS_HEIGHT * b);
    if (b < a) {
      var c = a - b;
      b += c;
      e += (CANVAS_WIDTH / CANVAS_HEIGHT) * c;
    } else
      e < d &&
        ((c = d - e), (e += c), (b += (CANVAS_HEIGHT / CANVAS_WIDTH) * c));
    c = a / 2 - b / 2;
    var f = d / 2 - e / 2,
      g = CANVAS_WIDTH / e;
    if (f * g < -EDGEBOARD_X || c * g < -EDGEBOARD_Y)
      (b = Math.min(
        a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y),
        d / (CANVAS_WIDTH - 2 * EDGEBOARD_X)
      )),
        (e = Math.round(CANVAS_WIDTH * b)),
        (b = Math.round(CANVAS_HEIGHT * b)),
        (c = (a - b) / 2),
        (f = (d - e) / 2),
        (g = CANVAS_WIDTH / e);
    s_iOffsetX = -1 * f * g;
    s_iOffsetY = -1 * c * g;
    0 <= c && (s_iOffsetY = 0);
    0 <= f && (s_iOffsetX = 0);
    s_oGame && s_oGame.refreshButtonPos();
    null !== s_oMenu && s_oMenu.refreshButtonPos();
    null !== s_oSelectPlayers && s_oSelectPlayers.refreshButtonPos();
    document.querySelector("#canvas").style.width = e + "px";
    document.querySelector("#canvas").style.height = b + "px";
    0 > c || (c = (a - b) / 2);
    document.querySelector("#canvas").style.top = c + "px";
    document.querySelector("#canvas").style.left = f + "px";
    fullscreenHandler();
  }
}
function _checkOrientation(a, d) {
  s_bMobile &&
    ENABLE_CHECK_ORIENTATION &&
    (a > d
      ? "landscape" ===
        document
          .querySelector(".orientation-msg-container")
          .getAttribute("data-orientation")
        ? ((document.querySelector(".orientation-msg-container").style.display =
            "none"),
          document.querySelector("body").classList.remove("orientation-alert"),
          s_oMain.startUpdate())
        : ((document.querySelector(".orientation-msg-container").style.display =
            "block"),
          document.querySelector("body").classList.add("orientation-alert"),
          s_oMain.stopUpdate())
      : "portrait" ===
        document
          .querySelector(".orientation-msg-container")
          .getAttribute("data-orientation")
      ? ((document.querySelector(".orientation-msg-container").style.display =
          "none"),
        document.querySelector("body").classList.remove("orientation-alert"),
        s_oMain.startUpdate())
      : ((document.querySelector(".orientation-msg-container").style.display =
          "block"),
        document.querySelector("body").classList.add("orientation-alert"),
        s_oMain.stopUpdate()));
}
function playSound(a, d, b) {
  return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile
    ? (s_aSounds[a].play(),
      s_aSounds[a].volume(d),
      s_aSounds[a].loop(b),
      s_aSounds[a])
    : null;
}
function stopSound(a) {
  (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || s_aSounds[a].stop();
}
function setVolume(a, d) {
  (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || s_aSounds[a].volume(d);
}
function setMute(a, d) {
  (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || s_aSounds[a].mute(d);
}
function createBitmap(a, d, b) {
  var e = new createjs.Bitmap(a),
    c = new createjs.Shape();
  d && b
    ? c.graphics.beginFill("#fff").drawRect(0, 0, d, b)
    : c.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
  e.hitArea = c;
  return e;
}
function createSprite(a, d, b, e, c, f) {
  a = null !== d ? new createjs.Sprite(a, d) : new createjs.Sprite(a);
  d = new createjs.Shape();
  d.graphics.beginFill("#000000").drawRect(-b, -e, c, f);
  a.hitArea = d;
  return a;
}
function pad(a, d, b) {
  a += "";
  return a.length >= d ? a : Array(d - a.length + 1).join(b || "0") + a;
}
function linearFunction(a, d, b, e, c) {
  return ((a - d) * (c - e)) / (b - d) + e;
}
function randomFloatBetween(a, d, b) {
  "undefined" === typeof b && (b = 2);
  return parseFloat(Math.min(a + Math.random() * (d - a), d).toFixed(b));
}
function rotateVector2D(a, d) {
  var b = d.getX() * Math.cos(a) + d.getY() * Math.sin(a),
    e = d.getX() * -Math.sin(a) + d.getY() * Math.cos(a);
  d.set(b, e);
}
function tweenVectorsOnX(a, d, b) {
  return a + b * (d - a);
}
function shuffle(a) {
  for (var d = a.length, b, e; 0 !== d; )
    (e = Math.floor(Math.random() * d)),
      --d,
      (b = a[d]),
      (a[d] = a[e]),
      (a[e] = b);
  return a;
}
function shuffleWithSeed(a, d) {
  for (var b = a.length, e, c; b; )
    (c = Math.floor(random(d) * b--)),
      (e = a[b]),
      (a[b] = a[c]),
      (a[c] = e),
      ++d;
  return a;
}
function random(a) {
  a = 1e4 * Math.sin(a++);
  return a - Math.floor(a);
}
function bubbleSort(a) {
  do {
    var d = !1;
    for (var b = 0; b < a.length - 1; b++)
      a[b] > a[b + 1] &&
        ((d = a[b]), (a[b] = a[b + 1]), (a[b + 1] = d), (d = !0));
  } while (d);
}
function compare(a, d) {
  return a.index > d.index ? -1 : a.index < d.index ? 1 : 0;
}
function CircularList(a, d) {
  this.arr = a;
  this.currentIndex = d || 0;
}
CircularList.prototype._getNextIndex = function () {
  var a = this.currentIndex;
  return a < this.arr.length - 1 ? a + 1 : 0;
};
CircularList.prototype._getPrevIndex = function () {
  var a = this.currentIndex,
    d = this.arr;
  return 0 < a ? a - 1 : d.length - 1;
};
CircularList.prototype.getNext = function () {
  return this.arr[this._getNextIndex()];
};
CircularList.prototype.getPrev = function () {
  return this.arr[this._getPrevIndex()];
};
CircularList.prototype.next = function () {
  this.currentIndex = this._getNextIndex();
  return this.current();
};
CircularList.prototype.prev = function () {
  this.currentIndex = this._getPrevIndex();
  return this.current();
};
CircularList.prototype.current = function () {
  return this.arr[this.currentIndex];
};
CircularList.prototype.removeElement = function (a) {
  a = this.arr.indexOf(a);
  -1 < a && this.arr.splice(a, 1);
};
CircularList.prototype.getArray = function () {
  return this.arr;
};
CircularList.prototype.setCurrent = function (a) {
  a = this.arr.indexOf(a);
  return -1 < a ? ((this.currentIndex = a), this.current()) : null;
};
function easeLinear(a, d, b, e) {
  return (b * a) / e + d;
}
function easeInQuad(a, d, b, e) {
  return b * (a /= e) * a + d;
}
function easeInSine(a, d, b, e) {
  return -b * Math.cos((a / e) * (Math.PI / 2)) + b + d;
}
function easeInCubic(a, d, b, e) {
  return b * (a /= e) * a * a + d;
}
function getTrajectoryPoint(a, d) {
  var b = new createjs.Point(),
    e = (1 - a) * (1 - a),
    c = a * a;
  b.x = e * d.start.x + 2 * (1 - a) * a * d.traj.x + c * d.end.x;
  b.y = e * d.start.y + 2 * (1 - a) * a * d.traj.y + c * d.end.y;
  return b;
}
function formatTime(a) {
  a /= 1e3;
  var d = Math.floor(a / 60);
  a = parseFloat(a - 60 * d).toFixed(1);
  var b = "";
  b = 10 > d ? b + ("0" + d + ":") : b + (d + ":");
  return 10 > a ? b + ("0" + a) : b + a;
}
function degreesToRadians(a) {
  return (a * Math.PI) / 180;
}
function checkRectCollision(a, d) {
  var b = getBounds(a, 0.9);
  var e = getBounds(d, 0.98);
  return calculateIntersection(b, e);
}
function calculateIntersection(a, d) {
  var b, e, c, f;
  var g = a.x + (b = a.width / 2);
  var h = a.y + (e = a.height / 2);
  var l = d.x + (c = d.width / 2);
  var k = d.y + (f = d.height / 2);
  g = Math.abs(g - l) - (b + c);
  h = Math.abs(h - k) - (e + f);
  return 0 > g && 0 > h
    ? ((g = Math.min(Math.min(a.width, d.width), -g)),
      (h = Math.min(Math.min(a.height, d.height), -h)),
      {
        x: Math.max(a.x, d.x),
        y: Math.max(a.y, d.y),
        width: g,
        height: h,
        rect1: a,
        rect2: d,
      })
    : null;
}
function getBounds(a, d) {
  var b = { x: Infinity, y: Infinity, width: 0, height: 0 };
  if (a instanceof createjs.Container) {
    b.x2 = -Infinity;
    b.y2 = -Infinity;
    var e = a.children,
      c = e.length,
      f;
    for (f = 0; f < c; f++) {
      var g = getBounds(e[f], 1);
      g.x < b.x && (b.x = g.x);
      g.y < b.y && (b.y = g.y);
      g.x + g.width > b.x2 && (b.x2 = g.x + g.width);
      g.y + g.height > b.y2 && (b.y2 = g.y + g.height);
    }
    Infinity == b.x && (b.x = 0);
    Infinity == b.y && (b.y = 0);
    Infinity == b.x2 && (b.x2 = 0);
    Infinity == b.y2 && (b.y2 = 0);
    b.width = b.x2 - b.x;
    b.height = b.y2 - b.y;
    delete b.x2;
    delete b.y2;
  } else {
    if (a instanceof createjs.Bitmap) {
      c = a.sourceRect || a.image;
      f = c.width * d;
      var h = c.height * d;
    } else if (a instanceof createjs.Sprite)
      if (
        a.spriteSheet._frames &&
        a.spriteSheet._frames[a.currentFrame] &&
        a.spriteSheet._frames[a.currentFrame].image
      ) {
        c = a.spriteSheet.getFrame(a.currentFrame);
        f = c.rect.width;
        h = c.rect.height;
        e = c.regX;
        var l = c.regY;
      } else (b.x = a.x || 0), (b.y = a.y || 0);
    else (b.x = a.x || 0), (b.y = a.y || 0);
    e = e || 0;
    f = f || 0;
    l = l || 0;
    h = h || 0;
    b.regX = e;
    b.regY = l;
    c = a.localToGlobal(0 - e, 0 - l);
    g = a.localToGlobal(f - e, h - l);
    f = a.localToGlobal(f - e, 0 - l);
    e = a.localToGlobal(0 - e, h - l);
    b.x = Math.min(Math.min(Math.min(c.x, g.x), f.x), e.x);
    b.y = Math.min(Math.min(Math.min(c.y, g.y), f.y), e.y);
    b.width = Math.max(Math.max(Math.max(c.x, g.x), f.x), e.x) - b.x;
    b.height = Math.max(Math.max(Math.max(c.y, g.y), f.y), e.y) - b.y;
  }
  return b;
}
function NoClickDelay(a) {
  this.element = a;
  window.Touch && this.element.addEventListener("touchstart", this, !1);
}
function shuffle(a) {
  for (var d = a.length, b, e; 0 < d; )
    (e = Math.floor(Math.random() * d)),
      d--,
      (b = a[d]),
      (a[d] = a[e]),
      (a[e] = b);
  return a;
}
NoClickDelay.prototype = {
  handleEvent: function (a) {
    switch (a.type) {
      case "touchstart":
        this.onTouchStart(a);
        break;
      case "touchmove":
        this.onTouchMove(a);
        break;
      case "touchend":
        this.onTouchEnd(a);
    }
  },
  onTouchStart: function (a) {
    a.preventDefault();
    this.moved = !1;
    this.element.addEventListener("touchmove", this, !1);
    this.element.addEventListener("touchend", this, !1);
  },
  onTouchMove: function (a) {
    this.moved = !0;
  },
  onTouchEnd: function (a) {
    this.element.removeEventListener("touchmove", this, !1);
    this.element.removeEventListener("touchend", this, !1);
    if (!this.moved) {
      a = document.elementFromPoint(
        a.changedTouches[0].clientX,
        a.changedTouches[0].clientY
      );
      3 == a.nodeType && (a = a.parentNode);
      var d = document.createEvent("MouseEvents");
      d.initEvent("click", !0, !0);
      a.dispatchEvent(d);
    }
  },
};
(function () {
  function a(b) {
    var e = {
      focus: "visible",
      focusin: "visible",
      pageshow: "visible",
      blur: "hidden",
      focusout: "hidden",
      pagehide: "hidden",
    };
    b = b || window.event;
    b.type in e
      ? (document.body.className = e[b.type])
      : ((document.body.className = this[d] ? "hidden" : "visible"),
        "hidden" === document.body.className
          ? (s_oMain.stopUpdate(), (s_bFocus = !1))
          : (s_oMain.startUpdate(), (s_bFocus = !0)));
  }
  var d = "hidden";
  d in document
    ? document.addEventListener("visibilitychange", a)
    : (d = "mozHidden") in document
    ? document.addEventListener("mozvisibilitychange", a)
    : (d = "webkitHidden") in document
    ? document.addEventListener("webkitvisibilitychange", a)
    : (d = "msHidden") in document
    ? document.addEventListener("msvisibilitychange", a)
    : "onfocusin" in document
    ? (document.onfocusin = document.onfocusout = a)
    : (window.onpageshow =
        window.onpagehide =
        window.onfocus =
        window.onblur =
          a);
})();
function getParamValue(a) {
  for (
    var d = window.location.search.substring(1).split("&"), b = 0;
    b < d.length;
    b++
  ) {
    var e = d[b].split("=");
    if (e[0] == a) return e[1];
  }
}
function getParameterByName(a, d) {
  d = void 0 === d ? window.location.href : d;
  a = a.replace(/[\[\]]/g, "\\$&");
  var b = new RegExp("[?&]" + a + "(=([^&#]*)|&|#|$)").exec(d);
  return b ? (b[2] ? decodeURIComponent(b[2].replace(/\+/g, " ")) : "") : null;
}
function fullscreenHandler() {
  ENABLE_FULLSCREEN &&
    screenfull.isEnabled &&
    ((s_bFullscreen = screenfull.isFullscreen),
    null !== s_oInterface && s_oInterface.resetFullscreenBut(),
    null !== s_oMenu && s_oMenu.resetFullscreenBut(),
    null !== s_oSelectPlayers && s_oSelectPlayers.resetFullscreenBut());
}
if (screenfull.isEnabled)
  screenfull.on("change", function () {
    s_bFullscreen = screenfull.isFullscreen;
    null !== s_oInterface && s_oInterface.resetFullscreenBut();
    null !== s_oMenu && s_oMenu.resetFullscreenBut();
    null !== s_oSelectPlayers && s_oSelectPlayers.resetFullscreenBut();
  });
function removeParamFromURL(a) {
  for (var d = new URL(window.location.href), b = 0; b < a.length; b++)
    d.searchParams["delete"](a[b]);
  return d.toString();
}
function addParameterToUrl(a, d, b, e) {
  if (0 < a.indexOf("#")) {
    var c = a.indexOf("#");
    var f = a.substring(a.indexOf("#"), a.length);
  } else (f = ""), (c = a.length);
  a = a.substring(0, c).split("?");
  c = "";
  if (1 < a.length)
    for (var g = a[1].split("&"), h = 0; h < g.length; h++) {
      var l = g[h].split("=");
      l[0] !== d &&
        ((c = "" === c ? "?" : c + "&"),
        (c += l[0] + "=" + (l[1] ? l[1] : "")));
    }
  "" === c && (c = "?");
  e
    ? (c = "?" + d + "=" + b + (1 < c.length ? "&" + c.substring(1) : ""))
    : ("" !== c && "?" !== c && (c += "&"), (c += d + "=" + (b ? b : "")));
  return a[0] + c + f;
}
var s_szGameID = "f2520bae00624e93a4f4614732fa259e";
window.GD_OPTIONS = {
  gameId: s_szGameID,
  onEvent: function (a) {
    switch (a.name) {
      case "SDK_GAME_START":
        s_bAdShown = !1;
        s_oMain && s_oMain.startUpdate();
        break;
      case "SDK_GAME_PAUSE":
        s_bAdShown = !0;
        s_oMain && s_oMain.stopUpdate();
        break;
      case "SDK_READY":
        s_bMobile ||
          ((document.querySelector("#div_display_id").style.display = "block"),
          "undefined" !== typeof gdsdk &&
            "undefined" !== gdsdk.showAd &&
            gdsdk
              .showAd(gdsdk.AdType.Display, { containerId: "div_display_id" })
              .then(function () {
                return console.info("showAd(gdsdk.AdType.Display) resolved.");
              })
              ["catch"](function (d) {
                return console.info(d);
              }));
        break;
      case "CONTENT_PAUSE_REQUESTED":
      case "STARTED":
        s_oMain.stopUpdate();
        break;
      case "CONTENT_RESUME_REQUESTED":
      case "COMPLETE":
        s_oMain.startUpdate();
    }
  },
};
(function (a, d, b) {
  var e = a.getElementsByTagName(d)[0];
  a.getElementById(b) ||
    ((a = a.createElement(d)),
    (a.id = b),
    (a.src = "main.min.js"),
    e.parentNode.insertBefore(a, e));
})(document, "script", "gamedistribution-jssdk");
var s_bAdShown = !1;
function CSpriteLibrary() {
  var a = {},
    d,
    b,
    e,
    c,
    f,
    g;
  this.init = function (h, l, k) {
    d = {};
    e = b = 0;
    c = h;
    f = l;
    g = k;
  };
  this.addSprite = function (h, l) {
    if (!a.hasOwnProperty(h)) {
      var k = new Image();
      a[h] = d[h] = { szPath: l, oSprite: k, bLoaded: !1 };
      b++;
    }
  };
  this.getSprite = function (h) {
    return a.hasOwnProperty(h) ? a[h].oSprite : null;
  };
  this._onSpritesLoaded = function () {
    b = 0;
    f.call(g);
  };
  this._onSpriteLoaded = function () {
    c.call(g);
    ++e === b && this._onSpritesLoaded();
  };
  this.loadSprites = function () {
    for (var h in d)
      (d[h].oSprite.oSpriteLibrary = this),
        (d[h].oSprite.szKey = h),
        (d[h].oSprite.onload = function () {
          this.oSpriteLibrary.setLoaded(this.szKey);
          this.oSpriteLibrary._onSpriteLoaded(this.szKey);
        }),
        (d[h].oSprite.onerror = function (l) {
          var k = l.currentTarget;
          setTimeout(function () {
            d[k.szKey].oSprite.src = d[k.szKey].szPath;
          }, 500);
        }),
        (d[h].oSprite.src = d[h].szPath);
  };
  this.setLoaded = function (h) {
    a[h].bLoaded = !0;
  };
  this.isLoaded = function (h) {
    return a[h].bLoaded;
  };
  this.getNumSprites = function () {
    return b;
  };
}
function CTextButton(a, d, b, e, c, f, g, h) {
  var l, k, m, p, n, q, t, z, A, C, w, B;
  this._init = function (u, r, y, J, I, Y, X, fa) {
    l = !1;
    p = [];
    n = [];
    B = createBitmap(y);
    k = y.width;
    m = y.height;
    var oa = Math.ceil(X / 20);
    C = new createjs.Text(J, X + "px " + I, "#000000");
    var ta = C.getBounds();
    C.textAlign = "center";
    C.lineWidth = 0.9 * k;
    C.textBaseline = "alphabetic";
    C.x = y.width / 2 + oa;
    C.y = Math.floor(y.height / 2) + ta.height / 3 + oa;
    w = new createjs.Text(J, X + "px " + I, Y);
    w.textAlign = "center";
    w.textBaseline = "alphabetic";
    w.lineWidth = 0.9 * k;
    w.x = y.width / 2;
    w.y = Math.floor(y.height / 2) + ta.height / 3;
    A = new createjs.Container();
    A.x = u;
    A.y = r;
    A.regX = y.width / 2;
    A.regY = y.height / 2;
    s_bMobile || (A.cursor = "pointer");
    A.addChild(B, C, w);
    !1 !== fa && s_oStage.addChild(A);
    this._initListener();
  };
  this.unload = function () {
    A.off("mousedown", t);
    A.off("pressup", z);
    s_oStage.removeChild(A);
  };
  this.setVisible = function (u) {
    A.visible = u;
  };
  this.setAlign = function (u) {
    w.textAlign = u;
    C.textAlign = u;
  };
  this.enable = function () {
    l = !1;
    B.filters = [];
    B.cache(0, 0, k, m);
  };
  this.disable = function () {
    l = !0;
    var u = new createjs.ColorMatrix()
      .adjustSaturation(-100)
      .adjustBrightness(40);
    B.filters = [new createjs.ColorMatrixFilter(u)];
    B.cache(0, 0, k, m);
  };
  this._initListener = function () {
    t = A.on("mousedown", this.buttonDown);
    z = A.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (u, r, y) {
    p[u] = r;
    n[u] = y;
  };
  this.addEventListenerWithParams = function (u, r, y, J) {
    p[u] = r;
    n[u] = y;
    q = J;
  };
  this.buttonRelease = function () {
    l ||
      (playSound("click", 1, !1),
      (A.scaleX = 1),
      (A.scaleY = 1),
      p[ON_MOUSE_UP] && p[ON_MOUSE_UP].call(n[ON_MOUSE_UP], q));
  };
  this.buttonDown = function () {
    l ||
      ((A.scaleX = 0.9),
      (A.scaleY = 0.9),
      p[ON_MOUSE_DOWN] && p[ON_MOUSE_DOWN].call(n[ON_MOUSE_DOWN]));
  };
  this.setPosition = function (u, r) {
    A.x = u;
    A.y = r;
  };
  this.changeText = function (u) {
    w.text = u;
    C.text = u;
  };
  this.setX = function (u) {
    A.x = u;
  };
  this.setY = function (u) {
    A.y = u;
  };
  this.getButtonImage = function () {
    return A;
  };
  this.getX = function () {
    return A.x;
  };
  this.getY = function () {
    return A.y;
  };
  this.getSprite = function () {
    return A;
  };
  this._init(a, d, b, e, c, f, g, h);
  return this;
}
function CToggle(a, d, b, e, c) {
  var f, g, h, l, k, m;
  this._init = function (p, n, q, t, z) {
    g = [];
    h = [];
    var A = new createjs.SpriteSheet({
      images: [q],
      frames: {
        width: q.width / 2,
        height: q.height,
        regX: q.width / 2 / 2,
        regY: q.height / 2,
      },
      animations: { state_true: [0], state_false: [1] },
    });
    f = t;
    m = createSprite(
      A,
      "state_" + f,
      q.width / 2 / 2,
      q.height / 2,
      q.width / 2,
      q.height
    );
    m.x = p;
    m.y = n;
    m.stop();
    m.cursor = "pointer";
    z.addChild(m);
    this._initListener();
  };
  this.unload = function () {
    m.off("mousedown", l);
    m.off("pressup", k);
    c.removeChild(m);
  };
  this._initListener = function () {
    l = m.on("mousedown", this.buttonDown);
    k = m.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (p, n, q) {
    g[p] = n;
    h[p] = q;
  };
  this.setActive = function (p) {
    f = p;
    m.gotoAndStop("state_" + f);
  };
  this.buttonRelease = function () {
    m.scaleX = 1;
    m.scaleY = 1;
    playSound("click", 1, !1);
    f = !f;
    m.gotoAndStop("state_" + f);
    g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], f);
  };
  this.buttonDown = function () {
    m.scaleX = 0.9;
    m.scaleY = 0.9;
    g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN]);
  };
  this.setPosition = function (p, n) {
    m.x = p;
    m.y = n;
  };
  this._init(a, d, b, e, c);
}
function CGfxButton(a, d, b, e) {
  var c, f, g, h, l, k, m;
  this._init = function (p, n, q, t) {
    c = !1;
    f = 1;
    g = [];
    h = [];
    m = createBitmap(q);
    m.x = p;
    m.y = n;
    m.scaleX = m.scaleY = f;
    m.regX = q.width / 2;
    m.regY = q.height / 2;
    m.cursor = "pointer";
    t.addChild(m);
    this._initListener();
  };
  this.unload = function () {
    createjs.Tween.removeTweens(m);
    m.off("mousedown", l);
    m.off("pressup", k);
    e.removeChild(m);
  };
  this.setVisible = function (p) {
    m.visible = p;
  };
  this.setClickable = function (p) {
    c = !p;
  };
  this._initListener = function () {
    l = m.on("mousedown", this.buttonDown);
    k = m.on("pressup", this.buttonRelease);
  };
  this.addEventListener = function (p, n, q) {
    g[p] = n;
    h[p] = q;
  };
  this.addEventListenerWithParams = function (p, n, q, t) {
    g[p] = n;
    h[p] = q;
  };
  this.buttonRelease = function () {
    c ||
      ((m.scaleX = f),
      (m.scaleY = f),
      g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], void 0));
  };
  this.buttonDown = function () {
    c ||
      ((m.scaleX = 0.9 * f),
      (m.scaleY = 0.9 * f),
      playSound("click", 1, !1),
      g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN]));
  };
  this.pulseAnimation = function () {
    createjs.Tween.get(m, { loop: -1 })
      .to({ scaleX: 0.9 * f, scaleY: 0.9 * f }, 850, createjs.Ease.quadOut)
      .to({ scaleX: f, scaleY: f }, 650, createjs.Ease.quadIn);
  };
  this.trembleAnimation = function () {
    createjs.Tween.get(m, { loop: -1 })
      .to({ rotation: 10 }, 75, createjs.Ease.quadOut)
      .to({ rotation: -10 }, 140, createjs.Ease.quadIn)
      .to({ rotation: 0 }, 75, createjs.Ease.quadIn);
  };
  this.removeAnimation = function () {
    m.scale = f;
    m.rotation = 0;
    createjs.Tween.removeTweens(m);
  };
  this.setScale = function (p) {
    f = p;
    m.scale = f;
  };
  this.setPosition = function (p, n) {
    m.x = p;
    m.y = n;
  };
  this.setX = function (p) {
    m.x = p;
  };
  this.setY = function (p) {
    m.y = p;
  };
  this.setImage = function (p) {
    m.image = p;
  };
  this.getButtonImage = function () {
    return m;
  };
  this.getX = function () {
    return m.x;
  };
  this.getY = function () {
    return m.y;
  };
  this._init(a, d, b, e);
  return this;
}
CTLText.prototype = {
  constructor: CTLText,
  __autofit: function () {
    if (this._bFitText) {
      for (
        var a = this._iFontSize;
        (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV ||
          this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) &&
        !(a--,
        (this._oText.font = a + "px " + this._szFont),
        (this._oText.lineHeight = Math.round(a * this._fLineHeightFactor)),
        this.__updateY(),
        this.__verticalAlign(),
        8 > a);

      );
      this._iFontSize = a;
    }
  },
  __verticalAlign: function () {
    if (this._bVerticalAlign) {
      var a = this._oText.getBounds().height;
      this._oText.y -= (a - this._iHeight) / 2 + this._iPaddingV;
    }
  },
  __updateY: function () {
    this._oText.y = this._y + this._iPaddingV;
    switch (this._oText.textBaseline) {
      case "middle":
        this._oText.y +=
          this._oText.lineHeight / 2 +
          (this._iFontSize * this._fLineHeightFactor - this._iFontSize);
    }
  },
  __createText: function (a) {
    this._bDebug &&
      ((this._oDebugShape = new createjs.Shape()),
      this._oDebugShape.graphics
        .beginFill("rgba(255,0,0,0.5)")
        .drawRect(0, 0, this._iWidth, this._iHeight),
      (this._oDebugShape.x = this._x),
      (this._oDebugShape.y = this._y),
      this._oContainer.addChild(this._oDebugShape));
    this._oText = new createjs.Text(
      a,
      this._iFontSize + "px " + this._szFont,
      this._szColor
    );
    this._oText.textBaseline = "middle";
    this._oText.lineHeight = Math.round(
      this._iFontSize * this._fLineHeightFactor
    );
    this._oText.textAlign = this._szAlign;
    this._oText.lineWidth = this._bMultiline
      ? this._iWidth - 2 * this._iPaddingH
      : null;
    switch (this._szAlign) {
      case "center":
        this._oText.x = this._x + this._iWidth / 2;
        break;
      case "left":
        this._oText.x = this._x + this._iPaddingH;
        break;
      case "right":
        this._oText.x = this._x + this._iWidth - this._iPaddingH;
    }
    this._oContainer.addChild(this._oText);
    this.refreshText(a);
  },
  setVerticalAlign: function (a) {
    this._bVerticalAlign = a;
  },
  setOutline: function (a) {
    null !== this._oText && (this._oText.outline = a);
  },
  setShadow: function (a, d, b, e) {
    null !== this._oText &&
      (this._oText.shadow = new createjs.Shadow(a, d, b, e));
  },
  setColor: function (a) {
    this._oText.color = a;
  },
  setScale: function (a, d) {
    this._oText.scaleX = a;
    this._oText.scaleY = d;
  },
  setX: function (a) {
    this._x = a;
    this._oText.x = a;
  },
  setAlpha: function (a) {
    this._oText.alpha = a;
  },
  setVisible: function (a) {
    this._oText.visible = a;
  },
  setAlign: function (a) {
    this._oText.textAlign = a;
  },
  removeTweens: function () {
    createjs.Tween.removeTweens(this._oText);
  },
  getText: function () {
    return this._oText;
  },
  getString: function () {
    return this._oText.text;
  },
  getX: function () {
    return this._x;
  },
  getY: function () {
    return this._y;
  },
  getFontSize: function () {
    return this._iFontSize;
  },
  setY: function (a) {
    this._y = a;
    this._oText.y = this._y;
  },
  setPos: function (a, d) {
    this._x = a;
    this._y = d;
    this._oText.x = this._x;
    this._oText.y = this._y;
    if (this._bDebug) {
      this._oContainer.removeChild(this._oDebugShape);
      var b = "left" === this._oText.textAlign ? 0 : -this._iWidth;
      this._oDebugShape = new createjs.Shape();
      this._oDebugShape.graphics
        .beginFill("rgba(255,0,0,0.5)")
        .drawRect(b, 0, this._iWidth, this._iHeight);
      this._oDebugShape.x = this._x;
      this._oDebugShape.y = this._y;
      this._oContainer.addChild(this._oDebugShape);
    }
    this.__autofit();
    this.__updateY();
    this.__verticalAlign();
  },
  refreshText: function (a) {
    "" === a && (a = " ");
    null === this._oText && this.__createText(a);
    this._oText.text = a;
    this._oText.font = this._iFontSize + "px " + this._szFont;
    this._oText.lineHeight = Math.round(
      this._iFontSize * this._fLineHeightFactor
    );
    this.__autofit();
    this.__updateY();
    this.__verticalAlign();
  },
};
function CTLText(a, d, b, e, c, f, g, h, l, k, m, p, n, q, t, z, A) {
  this._oContainer = a;
  this._x = d;
  this._y = b;
  this._iWidth = e;
  this._iHeight = c;
  this._bMultiline = z;
  this._iFontSize = f;
  this._szAlign = g;
  this._szColor = h;
  this._szFont = l;
  this._iPaddingH = m;
  this._iPaddingV = p;
  this._bVerticalAlign = t;
  this._bFitText = q;
  this._bDebug = A;
  this._oDebugShape = null;
  this._fLineHeightFactor = k;
  this._oText = null;
  n && this.__createText(n);
}
!(function () {
  function a(c) {
    var f = c;
    if (e[f]) f = e[f];
    else {
      for (var g = f, h, l = [], k = 0; g; ) {
        if (null !== (h = b.text.exec(g))) l.push(h[0]);
        else if (null !== (h = b.modulo.exec(g))) l.push("%");
        else if (null !== (h = b.placeholder.exec(g))) {
          if (h[2]) {
            k |= 1;
            var m = [],
              p = h[2],
              n;
            if (null !== (n = b.key.exec(p)))
              for (m.push(n[1]); "" !== (p = p.substring(n[0].length)); )
                if (null !== (n = b.key_access.exec(p))) m.push(n[1]);
                else if (null !== (n = b.index_access.exec(p))) m.push(n[1]);
                else
                  throw new SyntaxError(
                    "[sprintf] failed to parse named argument key"
                  );
            else
              throw new SyntaxError(
                "[sprintf] failed to parse named argument key"
              );
            h[2] = m;
          } else k |= 2;
          if (3 === k)
            throw Error(
              "[sprintf] mixing positional and named placeholders is not (yet) supported"
            );
          l.push({
            placeholder: h[0],
            param_no: h[1],
            keys: h[2],
            sign: h[3],
            pad_char: h[4],
            align: h[5],
            width: h[6],
            precision: h[7],
            type: h[8],
          });
        } else throw new SyntaxError("[sprintf] unexpected placeholder");
        g = g.substring(h[0].length);
      }
      f = e[f] = l;
    }
    g = arguments;
    h = 1;
    l = f.length;
    m = "";
    var q, t;
    for (p = 0; p < l; p++)
      if ("string" === typeof f[p]) m += f[p];
      else if ("object" === typeof f[p]) {
        n = f[p];
        if (n.keys)
          for (k = g[h], q = 0; q < n.keys.length; q++) {
            if (void 0 == k)
              throw Error(
                a(
                  '[sprintf] Cannot access property "%s" of undefined value "%s"',
                  n.keys[q],
                  n.keys[q - 1]
                )
              );
            k = k[n.keys[q]];
          }
        else k = n.param_no ? g[n.param_no] : g[h++];
        b.not_type.test(n.type) &&
          b.not_primitive.test(n.type) &&
          k instanceof Function &&
          (k = k());
        if (b.numeric_arg.test(n.type) && "number" !== typeof k && isNaN(k))
          throw new TypeError(a("[sprintf] expecting number but found %T", k));
        b.number.test(n.type) && (t = 0 <= k);
        switch (n.type) {
          case "b":
            k = parseInt(k, 10).toString(2);
            break;
          case "c":
            k = String.fromCharCode(parseInt(k, 10));
            break;
          case "d":
          case "i":
            k = parseInt(k, 10);
            break;
          case "j":
            k = JSON.stringify(k, null, n.width ? parseInt(n.width) : 0);
            break;
          case "e":
            k = n.precision
              ? parseFloat(k).toExponential(n.precision)
              : parseFloat(k).toExponential();
            break;
          case "f":
            k = n.precision
              ? parseFloat(k).toFixed(n.precision)
              : parseFloat(k);
            break;
          case "g":
            k = n.precision
              ? String(Number(k.toPrecision(n.precision)))
              : parseFloat(k);
            break;
          case "o":
            k = (parseInt(k, 10) >>> 0).toString(8);
            break;
          case "s":
            k = String(k);
            k = n.precision ? k.substring(0, n.precision) : k;
            break;
          case "t":
            k = String(!!k);
            k = n.precision ? k.substring(0, n.precision) : k;
            break;
          case "T":
            k = Object.prototype.toString.call(k).slice(8, -1).toLowerCase();
            k = n.precision ? k.substring(0, n.precision) : k;
            break;
          case "u":
            k = parseInt(k, 10) >>> 0;
            break;
          case "v":
            k = k.valueOf();
            k = n.precision ? k.substring(0, n.precision) : k;
            break;
          case "x":
            k = (parseInt(k, 10) >>> 0).toString(16);
            break;
          case "X":
            k = (parseInt(k, 10) >>> 0).toString(16).toUpperCase();
        }
        if (b.json.test(n.type)) m += k;
        else {
          if (!b.number.test(n.type) || (t && !n.sign)) var z = "";
          else (z = t ? "+" : "-"), (k = k.toString().replace(b.sign, ""));
          q = n.pad_char
            ? "0" === n.pad_char
              ? "0"
              : n.pad_char.charAt(1)
            : " ";
          var A = n.width - (z + k).length;
          A = n.width ? (0 < A ? q.repeat(A) : "") : "";
          m += n.align ? z + k + A : "0" === q ? z + A + k : A + z + k;
        }
      }
    return m;
  }
  function d(c, f) {
    return a.apply(null, [c].concat(f || []));
  }
  var b = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder:
        /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/,
    },
    e = Object.create(null);
  "undefined" !== typeof exports &&
    ((exports.sprintf = a), (exports.vsprintf = d));
  "undefined" !== typeof window &&
    ((window.sprintf = a),
    (window.vsprintf = d),
    "function" === typeof define &&
      define.amd &&
      define(function () {
        return { sprintf: a, vsprintf: d };
      }));
})();
var CCTLMultiplayerGui = function () {
  this._cssClassDomain = "ctl-multiplayer-";
  this._idCurDialog;
  this._idLoadingDialog;
  this._iMaxPlayersInRoom = 2;
  this._iStartNumPlayers = 3;
  this._aRoomList = [];
  var a = "";
  try {
    console.log(GAME_NAME + "_nickname"),
      (a = localStorage.getItem(GAME_NAME + "_nickname")),
      console.log("szNickName " + a),
      null == a && (a = "");
  } catch (d) {}
  this._szNickName = null === a || void 0 === a ? "" : a;
};
CCTLMultiplayerGui.prototype.unload = function () {};
CCTLMultiplayerGui.prototype._onRoomClick = function (a) {
  var d = "" + this._aRoomList[a].name,
    b = "" + this._aRoomList[a]["private"];
  "false" !== "" + this._aRoomList[a].accessible &&
    (g_oCTLMultiplayer.closeCurrentDialog(),
    "true" === b
      ? g_oCTLMultiplayer.showTypeRoomPassword(d)
      : (g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING),
        on_ctl_multiplayer_join_room(d)));
};
CCTLMultiplayerGui.prototype.refreshRoomList = function (a) {
  this._aRoomList = a;
  for (var d = "", b = 0; b < a.length; b++)
    (d +=
      '<li onclick="g_oCTLMultiplayer._onRoomClick(' +
      b +
      ')" data-private="' +
      a[b]["private"] +
      '" data-accessible="' +
      a[b].accessible +
      '">'),
      (d += '<span class="' + this._cssClassDomain + 'room-name">'),
      (d += a[b].name),
      (d += "</span>"),
      (d += '<span class="' + this._cssClassDomain + 'current-users">'),
      (d += a[b].curusers + "/" + a[b].maxusers),
      (d += "</span>"),
      (d =
        !0 === a[b]["private"]
          ? d + ('<i class="' + this._cssClassDomain + 'icons-lock"></i>')
          : !1 === a[b].accessible
          ? d + ('<i class="' + this._cssClassDomain + 'icons-block"></i>')
          : d + ('<i class="' + this._cssClassDomain + 'icons-login"></i>')),
      (d += "</li>");
  document.querySelector("." + this._cssClassDomain + "room-list").innerHTML =
    "";
  document
    .querySelector("." + this._cssClassDomain + "room-list")
    .appendChild(htmlMarkupToNode(d));
};
function htmlMarkupToNode(a) {
  var d = document.createElement("template");
  d.innerHTML = a;
  return d.content.cloneNode(!0);
}
CCTLMultiplayerGui.prototype.showRoomList = function (a) {
  var d = "";
  d =
    '<input type="text" placeholder="' +
    TEXT_SYS_FINDROOM +
    '" name="nickname" maxlength="60" value="" oninput="on_ctl_user_search(this.value)">';
  d +=
    '<ul class="' +
    this._cssClassDomain +
    "list " +
    this._cssClassDomain +
    'room-list">';
  d =
    d +
    '</ul><button onclick="on_ctl_multiplayer_refresh_room_list()" type="button" class="' +
    (this._cssClassDomain + "update " + this._cssClassDomain + 'btn-gray">');
  d += '<i class="' + this._cssClassDomain + 'icons-arrows-cw"></i>';
  d += "<span>" + TEXT_SYS_UPDATE + "</span>";
  this._idCurDialog = this.showDialog(TEXT_SYS_MATCH_LIST, d + "</button>", [
    {
      txt: TEXT_SYS_QUICKMATCH,
      cb: "on_ctl_multiplayer_join_quick_match",
      classes: "",
    },
    {
      txt: TEXT_SYS_CREATEMATCH,
      cb: "on_ctl_multiplayer_show_create_match",
      classes: "",
    },
    {
      txt: TEXT_SYS_BACK,
      cb: "g_oCTLMultiplayer.closeCurrentDialog",
      classes: "",
    },
  ]);
  this.refreshRoomList(a);
  document.onkeydown = function (b) {
    13 === b.keyCode &&
      (on_ctl_multiplayer_join_quick_match(), (document.onkeydown = null));
  };
};
CCTLMultiplayerGui.prototype.showTypeRoomPassword = function (a) {
  var d = '<div class="' + this._cssClassDomain + 'form-group">';
  d += "<label>" + TEXT_SYS_TYPEROOMPASS + "</label>";
  this._idCurDialog = this.showDialog(
    TEXT_SYS_TYPEROOMPASS,
    d +
      ('<input type="password" name="password" data-room-name="' +
        a +
        '"></div>'),
    [
      { txt: TEXT_SYS_OK, cb: "on_ctl_multiplayer_send_password", classes: "" },
      {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_type_room_password",
        classes: "",
      },
    ]
  );
  document.onkeydown = function (b) {
    13 === b.keyCode &&
      (on_ctl_multiplayer_send_password(), (document.onkeydown = null));
  };
};
CCTLMultiplayerGui.prototype.showCreateRoom = function () {
  var a = '<div class="' + this._cssClassDomain + 'form-group">';
  a += "<label>" + TEXT_SYS_NAMEROOM + "</label>";
  a +=
    '<input type="text" name="roomname" value="' +
    sprintf(TEXT_SYS_DEFAULTROOMNAME, this._szNickName) +
    '">';
  a = a + '</div><div class="' + (this._cssClassDomain + 'form-group">');
  a += "<label>" + TEXT_SYS_PASSWORD + "</label>";
  a =
    a +
    '<input type="password" name="password" oninput="g_oCTLMultiplayer.onPasswordInput()"><p>' +
    (TEXT_SYS_INFOPASS + "</p>");
  a =
    a +
    '</div><div class="' +
    (this._cssClassDomain +
      "form-group" +
      (2 === this._iMaxPlayersInRoom
        ? " " + this._cssClassDomain + "display-none"
        : "") +
      '">');
  a += "<label>" + TEXT_SYS_MAXPLAYERS + "</label>";
  a += '<ul class="' + this._cssClassDomain + 'inline-list">';
  if (2 < this._iMaxPlayersInRoom)
    for (var d = 2; d < this._iMaxPlayersInRoom + 1; d++)
      a =
        this._iStartNumPlayers === d
          ? a +
            ('<li><input type="radio" name="maxplayers" value="' +
              d +
              '" checked="checked"><span>' +
              d +
              "</span></li>")
          : a +
            ('<li><input type="radio" name="maxplayers" value="' +
              d +
              '"><span>' +
              d +
              "</span></li>");
  a += "<p>" + TEXT_SYS_CHOOSEMAXNUMPLAYERS + "</p>";
  this._idCurDialog = this.showDialog(
    TEXT_SYS_CREATEROOM +
      '<i id="visibility-icon" class="' +
      this._cssClassDomain +
      "icon-create-match " +
      this._cssClassDomain +
      'icons-login"></i>',
    a + "</div>",
    [
      {
        txt: TEXT_SYS_CREATE,
        cb: "on_ctl_multiplayer_create_room",
        classes: "",
      },
      {
        txt: TEXT_SYS_BACK,
        cb: "on_ctl_multiplayer_close_create_room",
        classes: "",
      },
    ]
  );
  document.onkeydown = function (b) {
    13 === b.keyCode &&
      (on_ctl_multiplayer_create_room(), (document.onkeydown = null));
  };
};
CCTLMultiplayerGui.prototype.onPasswordInput = function () {
  var a = document
      .querySelector("[id='" + g_oCTLMultiplayer._idCurDialog + "']")
      .querySelector("input[name='password']").value.length,
    d = document.querySelector("#visibility-icon");
  0 < a
    ? (d.classList.remove(this._cssClassDomain + "icons-login"),
      d.classList.add(this._cssClassDomain + "icons-lock"))
    : (d.classList.remove(this._cssClassDomain + "icons-lock"),
      d.classList.add(this._cssClassDomain + "icons-login"));
};
CCTLMultiplayerGui.prototype.showChooseNickName = function () {
  this._idCurDialog = this.showDialog(
    TEXT_SYS_CHOOSENICK,
    '<input type="text" name="nickname" maxlength="20" value="' +
      this._szNickName +
      '">',
    [
      { txt: TEXT_SYS_OK, cb: "on_ctl_multiplayer_send_nickname", classes: "" },
      {
        txt: TEXT_SYS_CLOSE,
        cb: "g_oCTLMultiplayer.closeCurrentDialog",
        classes: "",
      },
    ]
  );
  document.onkeydown = function (a) {
    13 === a.keyCode &&
      (on_ctl_multiplayer_send_nickname(), (document.onkeydown = null));
  };
};
CCTLMultiplayerGui.prototype.showGeneralDialog = function (a, d) {
  this._idCurDialog = this.showDialog(a, "", [
    { txt: TEXT_SYS_BACK, cb: d, classes: "" },
  ]);
  document.onkeydown = function (b) {
    13 === b.keyCode && (d(), (document.onkeydown = null));
  };
};
CCTLMultiplayerGui.prototype.closeLoadingDialog = function () {
  this.closeDlg(this._idLoadingDialog);
};
CCTLMultiplayerGui.prototype.closeCurrentDialog = function () {
  this.closeDlg(this._idCurDialog);
  document.onkeydown = null;
};
CCTLMultiplayerGui.prototype.makeCode = function () {
  for (var a = "", d = 0; 32 > d; d++)
    a +=
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(62 * Math.random())
      );
  return a;
};
CCTLMultiplayerGui.prototype.showDialog = function (a, d, b, e) {
  var c = "";
  e || (e = this.makeCode());
  c += "<div id='" + e + "' class='" + this._cssClassDomain + "dlg-wrapper'>";
  c += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
  c += "<div class='" + this._cssClassDomain + "dlg-content'>";
  c += "<div class='" + this._cssClassDomain + "dlg-header'>";
  c =
    c +
    ("<h1>" + a + "</h1></div><div class='") +
    (this._cssClassDomain + "dlg-content-body'>");
  c += d;
  c += "</div>";
  if (b && 0 < b.length) {
    c += "<div class='" + this._cssClassDomain + "dlg-footer'>";
    for (a = 0; a < b.length; a++)
      c +=
        "<button type='button' onclick='" +
        b[a].cb +
        '("' +
        e +
        "\");' class='" +
        this._cssClassDomain +
        "mini " +
        b[a].classes +
        "'>" +
        b[a].txt +
        "</button>";
    c += this.buildExtraFooter();
    c += "</div>";
  }
  c += "</div>";
  c += "</div>";
  document.querySelector("body").appendChild(htmlMarkupToNode(c));
  return e;
};
CCTLMultiplayerGui.prototype.buildExtraFooter = function () {
  var a = '<div class="' + this._cssClassDomain + 'copyright">';
  a +=
    '<a href="' +
    sprintf(HTTPS_FORMAT, CODETHISLAB_LINK) +
    '" target="_blank">' +
    CODETHISLAB_LINK +
    "</a>";
  return a + "</div>";
};
CCTLMultiplayerGui.prototype.setCountdown = function (a) {
  document.querySelector("#countdown-vs-panel-text").textContent = a;
  this._iIDTimeout = setInterval(function () {
    --a;
    document.querySelector("#countdown-vs-panel-text") &&
      (document.querySelector("#countdown-vs-panel-text").textContent = a);
    0 >= a && g_oCTLMultiplayer.removeCountdown();
  }, 1e3);
};
CCTLMultiplayerGui.prototype.removeCountdown = function () {
  null !== this._iIDTimeout &&
    (document.querySelector("#countdown-vs-panel-text") &&
      (document.querySelector("#countdown-vs-panel-text").textContent = ""),
    clearInterval(this._iIDTimeout),
    (this._iIDTimeout = null));
};
CCTLMultiplayerGui.prototype.onPlayerFound = function (a) {
  document.querySelector("#opponent-nickname") &&
    (document.querySelector("#opponent-nickname").textContent = a);
  document.querySelector("#countdown-vs-panel-text") &&
    (document.querySelector("#countdown-vs-panel-text").textContent = "");
  document.querySelector("button.ctl-multiplayer-mini") &&
    (document.querySelector("button.ctl-multiplayer-mini").style.display =
      "none");
  g_oCTLMultiplayer.removeCountdown();
};
CCTLMultiplayerGui.prototype.showVsPanel = function (a, d) {
  var b = "";
  this._idLoadingDialog = this.makeCode();
  a || (a = TEXT_SYS_LOADING);
  b +=
    "<div id='" +
    this._idLoadingDialog +
    "' class='" +
    this._cssClassDomain +
    "dlg-wrapper " +
    this._cssClassDomain +
    "fixed'>";
  b += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
  b += "<div class='" + this._cssClassDomain + "dlg-scroll'>";
  b += "<div class='" + this._cssClassDomain + "dlg-content'>";
  b += "<div class='" + this._cssClassDomain + "dlg-header'>";
  b +=
    "<h1 style='text-align:center'>" +
    s_oNetworkManager.getPlayerNickname() +
    "</h1>";
  b =
    b +
    ("<h1 style='font-size:22px;text-align:center;color:#31a8fd'>" +
      a +
      "</h1><h1 id='opponent-nickname' style='text-align:center'>") +
    (TEXT_WAIT_OPPONENT.toLowerCase() + "</h1>");
  b += "<h1 id='countdown-vs-panel-text' style='text-align:center'></h1></div>";
  d &&
    ((b +=
      "<div class='" +
      this._cssClassDomain +
      "dlg-footer " +
      this._cssClassDomain +
      "center'>"),
    (b +=
      "<button type='button' onclick='" +
      d +
      '("' +
      this._idLoadingDialog +
      "\");' class='" +
      this._cssClassDomain +
      "mini '>" +
      TEXT_SYS_BACK +
      "</button>"),
    (b += this.buildExtraFooter()),
    (b += "</div>"));
  b += "</div></div></div>";
  document.querySelector("body").appendChild(htmlMarkupToNode(b));
  this.setCountdown(60);
};
CCTLMultiplayerGui.prototype.showLoading = function (a, d) {
  var b = "";
  this._idLoadingDialog = this.makeCode();
  a || (a = TEXT_SYS_LOADING);
  b +=
    "<div id='" +
    this._idLoadingDialog +
    "' class='" +
    this._cssClassDomain +
    "dlg-wrapper " +
    this._cssClassDomain +
    "fixed'>";
  b += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
  b += "<div class='" + this._cssClassDomain + "dlg-content'>";
  b += "<div class='" + this._cssClassDomain + "dlg-header'>";
  b =
    b +
    ("<h1>" + a + "</h1></div><div class='") +
    (this._cssClassDomain +
      "dlg-content-body " +
      this._cssClassDomain +
      "align-center'>");
  b += '<i class="' + this._cssClassDomain + 'icons-spin5 animate-spin"></i>';
  b += "</div>";
  d &&
    ((b +=
      "<div class='" +
      this._cssClassDomain +
      "dlg-footer " +
      this._cssClassDomain +
      "center'>"),
    (b +=
      "<button type='button' onclick='" +
      d +
      '("' +
      this._idLoadingDialog +
      "\");' class='" +
      this._cssClassDomain +
      "mini '>" +
      TEXT_SYS_BACK +
      "</button>"),
    (b += this.buildExtraFooter()),
    (b += "</div>"));
  b += "</div>";
  b += "</div>";
  document.querySelector("body").appendChild(htmlMarkupToNode(b));
};
CCTLMultiplayerGui.prototype.updateRoomUserList = function (a, d) {
  var b = document.querySelector("." + this._cssClassDomain + "user-list");
  if (b) {
    b.innerHTML = "";
    for (var e = 0; e < a.length; e++)
      0 < a[e].length &&
        b.appendChild(htmlMarkupToNode("<li>" + a[e] + "</li>"));
    b = TEXT_WAITING_ROOM_MESSAGE.replace("%d", d);
    document.querySelector(
      "." + this._cssClassDomain + "room-info"
    ).textContent = b;
    document.querySelector("." + this._cssClassDomain + "room-play-now") &&
      (1 === a.length
        ? document
            .querySelector("." + this._cssClassDomain + "room-play-now")
            .classList.add(this._cssClassDomain + "display-none")
        : document
            .querySelector("." + this._cssClassDomain + "room-play-now")
            .classList.remove(this._cssClassDomain + "display-none"));
  }
};
CCTLMultiplayerGui.prototype.showWaitingPlayersInRoom = function (a, d, b, e) {
  var c = "";
  this._idLoadingDialog = this.makeCode();
  a || (a = TEXT_SYS_LOADING);
  c +=
    "<div id='" +
    this._idLoadingDialog +
    "' class='" +
    this._cssClassDomain +
    "dlg-wrapper " +
    this._cssClassDomain +
    "fixed'>";
  c += "<div class='" + this._cssClassDomain + "dlg-block'></div>";
  c += "<div class='" + this._cssClassDomain + "dlg-content'>";
  c += "<div class='" + this._cssClassDomain + "dlg-header'>";
  c =
    c +
    ("<h1>" + a + "</h1></div><div class='") +
    (this._cssClassDomain +
      "dlg-content-body " +
      this._cssClassDomain +
      "align-center'>");
  c +=
    "<ul class='" +
    this._cssClassDomain +
    "list " +
    this._cssClassDomain +
    "user-list'>";
  for (a = 0; a < d.length; a++) c += "<li>" + d[a] + "</li>";
  c += "</ul>";
  c += "<p class='" + this._cssClassDomain + "room-info'></p>";
  c += '<i class="' + this._cssClassDomain + 'icons-spin5 animate-spin"></i>';
  e &&
    ((c +=
      '<input class="' +
      this._cssClassDomain +
      'room-link" type="text" placeholder="' +
      e +
      '" id="link" name="link"'),
    (c +=
      'maxlength="60" value="' +
      e +
      '" size="4" data-clipboard-target="#link" readonly>'));
  c += "</div>";
  if (b) {
    c +=
      "<div class='" +
      this._cssClassDomain +
      "dlg-footer " +
      this._cssClassDomain +
      "center'>";
    for (a = 0; a < b.length; a++)
      (d = b[a]),
        (c +=
          "<button id='" +
          d.id +
          "' type='button' " +
          ("invite" === d.id ? "data-clipboard-target='#link'" : "") +
          " onclick='" +
          d.func +
          '("' +
          this._idLoadingDialog +
          "\");' class='" +
          this._cssClassDomain +
          "mini" +
          (d.classes ? " " + d.classes : "") +
          " '>" +
          d.label +
          "</button>");
    c += this.buildExtraFooter();
    c += "</div>";
  }
  c += "</div>";
  c += "</div>";
  document.querySelector("body").appendChild(htmlMarkupToNode(c));
};
CCTLMultiplayerGui.prototype.closeDlg = function (a) {
  document.querySelector("[id='" + a + "']") &&
    document.querySelector("[id='" + a + "']").remove();
};
CCTLMultiplayerGui.prototype.closeAllDialog = function () {
  []
    .concat($jscomp.arrayFromIterable(document.querySelectorAll("*")))
    .forEach(function (a) {
      a._tippy && a._tippy.destroy();
    });
  g_oCTLMultiplayer.closeLoadingDialog();
  g_oCTLMultiplayer.closeCurrentDialog();
  g_oCTLMultiplayer.removeCountdown();
};
CCTLMultiplayerGui.prototype.setNickName = function (a) {
  this._szNickName = null === a || void 0 === a ? "" : a;
  try {
    localStorage.setItem(GAME_NAME + "_nickname", this._szNickName);
  } catch (d) {}
};
CCTLMultiplayerGui.prototype.getNickname = function () {
  return this._szNickName;
};
CCTLMultiplayerGui.prototype.setMaxPlayersInRoom = function (a) {
  2 > a || 4 < a || (this._iMaxPlayersInRoom = a);
};
var g_oCTLMultiplayer = new CCTLMultiplayerGui();
g_oCTLMultiplayer.setMaxPlayersInRoom(4);
function on_ctl_multiplayer_send_nickname() {
  var a = document.querySelector("input[name='nickname']").value;
  g_oCTLMultiplayer.setNickName(a);
  s_oNetworkManager.login(a);
}
function on_ctl_multiplayer_send_password() {
  var a = document
      .querySelector("[id='" + g_oCTLMultiplayer._idCurDialog + "']")
      .querySelector("input[name='password']"),
    d = a.getAttribute("data-room-name");
  s_oNetworkManager.tryJoinRoomWithPass(d, a.value);
}
function on_ctl_multiplayer_join_room_with_password() {
  g_oCTLMultiplayer.closeAllDialog();
  g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING);
}
function on_ctl_multiplayer_show_create_match() {
  g_oCTLMultiplayer.closeAllDialog();
  g_oCTLMultiplayer.showCreateRoom();
}
function on_ctl_multiplayer_join_quick_match() {
  g_oCTLMultiplayer.closeAllDialog();
  s_oNetworkManager.joinQuickMatch();
}
function on_ctl_multiplayer_close_type_room_password() {
  g_oCTLMultiplayer.closeAllDialog();
  s_oNetworkManager.gotoLobby();
}
function on_ctl_multiplayer_close_create_room() {
  g_oCTLMultiplayer.closeAllDialog();
  s_oNetworkManager.gotoLobby();
}
function on_ctl_multiplayer_refresh_room_list() {
  s_oNetworkManager.gotoLobby();
}
function on_ctl_multiplayer_create_room() {
  var a = document.querySelector("input[name='roomname']").value,
    d = document.querySelector("input[name='password']").value,
    b = document.querySelector("input[name='maxplayers']:checked").value;
  s_oNetworkManager.tryCreateUniqueRoom(a, d, b);
}
function on_ctl_multiplayer_join_room(a) {
  s_oNetworkManager.joinRoom(a);
}
function on_ctl_user_search(a) {
  s_oNetworkManager.filterRoomsShown(a);
}
var ON_CONNECTION_ERROR = 0,
  ON_DISCONNECTION = 1,
  ON_DISCONNECTION_FROM_MATCH = 2,
  ON_LOGIN_SUCCESS = 3,
  ON_MATCHMAKING_CONNECTION_SUCCESS = 4,
  ON_GAMEROOM_CONNECTION_SUCCESS = 5,
  ON_USEROWNERROOM_CREATE_SUCCESS = 6,
  ON_USEROWNERROOM_JOIN_SUCCESS = 7,
  ON_ROOM_INFO_RETURNED = 8,
  ON_BACK_FROM_A_ROOM = 9,
  ON_REMOTE_GAME_START = 10,
  ON_GAME_FOUND = 11,
  ERROR_CODE_UNKNOWNROOM = "UnknownRoom",
  ON_STATUS_ONLINE = "online",
  ON_STATUS_OFFLINE = "offline",
  ROOM_TYPE_MATCHMAKING = "MatchmakingRoom",
  ROOM_TYPE_USEROWNER = "UserOwnerRoom",
  ROOM_TYPE_GAME = "GameRoom",
  WAITING_PLAYERS_TIMEOUT = 1e4;
function CNetworkManager() {
  var a, d, b, e, c, f, g, h, l, k, m, p, n, q, t, z, A, C, w, B;
  this._init = function () {
    a = navigator.onLine;
    d = [];
    b = [];
    e = [];
    c = [];
    p = 0;
    window.addEventListener("online", this._onConnectionChangeStatusOnline);
    window.addEventListener("offline", this._onConnectionChangeStatusOffline);
    h = new CNetworkMessageForwarder();
    h.addEventListener(ON_REMOTE_GAME_START, this._onRemoteGameStart, this);
    h.addEventListener(ON_GAME_FOUND, this._onGameFound, this);
    B = this;
  };
  this.unload = function () {
    window.removeEventListener("online", this._onConnectionChangeStatusOnline);
    window.removeEventListener(
      "offline",
      this._onConnectionChangeStatusOffline
    );
    d = [];
    b = [];
    f && (f.removeDisconnectCallback(), f.removeMessageCallback());
    s_oNetworkManager = null;
  };
  this.disconnectFromSystem = function () {
    g_oCTLMultiplayer.closeAllDialog();
    B.disconnectFromCurRoom();
  };
  this.connectToSystem = function () {
    a
      ? g_oCTLMultiplayer.showChooseNickName()
      : B.showErrorMessage(TEXT_NO_CONNECTION);
  };
  this.login = function (u) {
    B.isAllowedWord(u)
      ? ((q = u),
        (u = B._setValidNick(u)),
        g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showLoading(TEXT_SYS_LOADING),
        (PlayerIO.useSecureApiRequests = !MULTIPLAYER_TEST_LOCAL),
        PlayerIO.authenticate(
          GAME_PLAYERIO_ID,
          "public",
          { userId: u },
          {},
          function (r) {
            g = r;
            g.multiplayer.useSecureConnections = !MULTIPLAYER_TEST_LOCAL;
            MULTIPLAYER_TEST_LOCAL &&
              (g.multiplayer.developmentServer = "localhost:8184");
            d[ON_LOGIN_SUCCESS] &&
              d[ON_LOGIN_SUCCESS].call(b[ON_LOGIN_SUCCESS]);
          },
          B.callbackError
        ))
      : (g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showGeneralDialog(
          TEXT_INVALID_NAME,
          "g_oCTLMultiplayer.closeAllDialog"
        ));
  };
  this._stripHTML = function (u) {
    return u.replace(/<[^>]*>?/gm, "");
  };
  this.isAllowedWord = function (u) {
    var r = !0;
    u = u.toLocaleLowerCase();
    for (var y = 0; y < FORBIDDEN_LIST.length; y++) {
      var J = FORBIDDEN_LIST[y];
      if (u.includes(J) && 2 > u.length / J.length) {
        r = !1;
        break;
      }
    }
    return r;
  };
  this._setValidNick = function (u) {
    var r = B._getRandomCodeNumber();
    "" === u ? (q = u = "guest-" + r) : (u = u + "-" + r);
    return (u = this._stripHTML(u));
  };
  this._getRandomCodeNumber = function () {
    return Math.floor(1e3 * Math.random());
  };
  this.generateRandomName = function () {
    var u =
        "xmariox alex max mahuro biajus rob idah fabrix seth ikillyou commander admiral general seasalt emperorofthesea Aspect Kraken Dragon Shiver Dracula Doom Scar Roadkill Cobra Psycho Ranger Ripley Clink Bruise Bowser Creep Cannon Daemon Steel Tempest Hurricane Titanium Tito Lightning IronHeart Sabotage Rex Hydra Terminator Agrippa Gash Blade Katana Gladius Angon Claymore Pike Hammer Club Heart Gauntlet Montante Longbow bow Dagger".split(
          " "
        ),
      r = Math.floor(Math.random() * u.length);
    u = u[r];
    if (0.5 < Math.random()) {
      var y = Math.floor(100 * Math.random());
      if (0.5 < Math.random()) {
        var J = ["-", "_"];
        r = Math.floor(Math.random() * J.length);
        u += J[r];
      }
      u += y;
    }
    return (w = u);
  };
  this.getBotName = function () {
    return w;
  };
  this._onConnectionChangeStatusOnline = function (u) {
    a = !0;
    d[ON_STATUS_ONLINE] && d[ON_STATUS_ONLINE].call(b[ON_STATUS_ONLINE]);
    null !== document.querySelector(".ctl-multiplayer-dlg-content") &&
      B._onReconnection();
  };
  this._onConnectionChangeStatusOffline = function () {
    a = !1;
    d[ON_STATUS_OFFLINE] && d[ON_STATUS_OFFLINE].call(b[ON_STATUS_OFFLINE]);
    null !== document.querySelector(".ctl-multiplayer-dlg-content") &&
      B.showErrorMessage(TEXT_NO_CONNECTION);
    B.disconnect();
  };
  this._onReconnection = function () {
    null === q || void 0 === q
      ? (g_oCTLMultiplayer.closeAllDialog(), B.connectToSystem())
      : (g_oCTLMultiplayer.closeAllDialog(), B.gotoLobby());
  };
  this.showErrorMessage = function (u) {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showGeneralDialog(u, "g_oCTLMultiplayer.closeAllDialog");
  };
  this.addEventListener = function (u, r, y) {
    d[u] = r;
    b[u] = y;
  };
  this.callbackError = function (u) {
    console.log("Error: " + u.code + " - " + u.message);
    d[ON_CONNECTION_ERROR] &&
      d[ON_CONNECTION_ERROR].call(b[ON_CONNECTION_ERROR], u);
    switch (u.code) {
      case ERROR_CODE_UNKNOWNROOM:
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showGeneralDialog(
          TEXT_ROOM_DOESNT_EXIST,
          "s_oNetworkManager.gotoLobby"
        );
        break;
      default:
        B.showErrorMessage(u);
    }
  };
  this.callbackDisconnect = function (u) {
    console.log("Disconnected From Menu");
    d[ON_DISCONNECTION] && d[ON_DISCONNECTION].call(b[ON_DISCONNECTION], u);
  };
  this.callbackDisconnectFromMatch = function (u) {
    console.log("Disconnected From Match");
    d[ON_DISCONNECTION_FROM_MATCH] &&
      d[ON_DISCONNECTION_FROM_MATCH].call(b[ON_DISCONNECTION_FROM_MATCH], u);
  };
  this.sendMsg = function (u, r) {
    f && f.send(u, r);
  };
  this.disconnect = function () {
    f && (f.disconnect(), (f = null));
  };
  this.isUserA = function () {
    return 0 === parseInt(l) ? !0 : !1;
  };
  this.getPlayerOrderID = function () {
    return l;
  };
  this.getPlayerNickname = function () {
    return q;
  };
  this.getNicknameByID = function (u) {
    return t[u];
  };
  this.getNicknameList = function () {
    return t;
  };
  this.getAvatarByID = function (u) {
    return z[u];
  };
  this.getAvatarList = function () {
    return z;
  };
  this.createRoom = function (u, r, y) {
    MULTIPLAYER_TEST_LOCAL &&
      (g.multiplayer.developmentServer = "localhost:8184");
    console.log("maxusers:" + y);
    g.multiplayer.createJoinRoom(
      u,
      ROOM_TYPE_USEROWNER,
      !0,
      { id: u, pass: r, curusers: 1, maxusers: y },
      { nickname: q, avatar: "" },
      function (J) {
        f = J;
        J.addMessageCallback("*", h.messageHandler);
        J.addDisconnectCallback(B.callbackDisconnect);
        d[ON_USEROWNERROOM_CREATE_SUCCESS] &&
          d[ON_USEROWNERROOM_CREATE_SUCCESS].call(
            b[ON_USEROWNERROOM_CREATE_SUCCESS]
          );
        B._onRoomCreated();
      },
      B.callbackError
    );
  };
  this.joinRoom = function (u) {
    void 0 !== u && (A = u);
    MULTIPLAYER_TEST_LOCAL &&
      (g.multiplayer.developmentServer = "localhost:8184");
    g.multiplayer.joinRoom(
      u,
      { nickname: q, avatar: "" },
      function (r) {
        f = r;
        r.addMessageCallback("*", h.messageHandler);
        r.addDisconnectCallback(B.callbackDisconnect);
        d[ON_USEROWNERROOM_JOIN_SUCCESS] &&
          d[ON_USEROWNERROOM_JOIN_SUCCESS].call(
            b[ON_USEROWNERROOM_JOIN_SUCCESS]
          );
        B._onRoomJoined();
      },
      B.callbackError
    );
  };
  this._onGameFound = function () {
    d[ON_GAME_FOUND] && d[ON_GAME_FOUND].call(b[ON_GAME_FOUND]);
  };
  this.gotoGameRoom = function (u) {
    MULTIPLAYER_TEST_LOCAL &&
      (g.multiplayer.developmentServer = "localhost:8184");
    playSound("match_found", 1, !1);
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showLoading(TEXT_MATCH_FOUND.toUpperCase());
    var r = u.getString(0);
    l = u.getInt(1);
    u = u.getString(2);
    var y = JSON.parse(u);
    y = Object.values(y);
    t = [];
    z = [];
    for (var J = 0; J < y.length; J++)
      (t[J] = y[J].nickname), (z[J] = y[J].avatar);
    m = y.length;
    g.multiplayer.createJoinRoom(
      r,
      ROOM_TYPE_GAME,
      !0,
      { pass: "", maxusers: m, playersinfo: u },
      { ingameid: l },
      function (I) {
        B.disconnectFromCurRoom();
        f = I;
        I.addMessageCallback("*", h.messageHandler);
        I.addDisconnectCallback(B.callbackDisconnectFromMatch);
        d[ON_GAMEROOM_CONNECTION_SUCCESS] &&
          d[ON_GAMEROOM_CONNECTION_SUCCESS].call(
            b[ON_GAMEROOM_CONNECTION_SUCCESS],
            m
          );
        B._onGameRoomEntered();
      },
      B.callbackError
    );
  };
  this.gotoGameRoomWithBot = function () {
    MULTIPLAYER_TEST_LOCAL &&
      (g.multiplayer.developmentServer = "localhost:8184");
    var u = randomFloatBetween(1e6, 2e6, 0) + "";
    l = 0;
    t = [];
    t[0] = q;
    t[1] = w;
    z = ["", ""];
    g.multiplayer.createJoinRoom(
      u,
      ROOM_TYPE_GAME,
      !0,
      { pass: "", maxusers: 2, bot: !0 },
      { ingameid: l },
      function (r) {
        B.disconnectFromCurRoom();
        f = r;
        r.addMessageCallback("*", h.messageHandler);
        r.addDisconnectCallback(B.callbackDisconnectFromMatch);
        g_oCTLMultiplayer.closeAllDialog();
      },
      B.callbackError
    );
  };
  this.gotoMatchMakingRoom = function () {
    MULTIPLAYER_TEST_LOCAL &&
      (g.multiplayer.developmentServer = "localhost:8184");
    g.multiplayer.createJoinRoom(
      "matchmakingroom1",
      ROOM_TYPE_MATCHMAKING,
      !0,
      {},
      { nickname: q, avatar: "" },
      function (u) {
        f = u;
        u.addMessageCallback("*", h.messageHandler);
        u.addDisconnectCallback(B.callbackDisconnect);
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showVsPanel(
          TEXT_VS,
          "s_oNetworkManager._onDisconnectFromARoom"
        );
      },
      B.callbackError
    );
  };
  this.onMatchmakingConnectionSucces = function () {
    d[ON_MATCHMAKING_CONNECTION_SUCCESS] &&
      d[ON_MATCHMAKING_CONNECTION_SUCCESS].call(
        b[ON_MATCHMAKING_CONNECTION_SUCCESS]
      );
  };
  this._onGameRoomEntered = function () {
    n = setTimeout(function () {
      g_oCTLMultiplayer.closeAllDialog();
      g_oCTLMultiplayer.showGeneralDialog(
        TEXT_OPPONENT_LEFT,
        "s_oNetworkManager.gotoLobby"
      );
      B.disconnect();
    }, WAITING_PLAYERS_TIMEOUT);
  };
  this._onRemoteGameStart = function (u) {
    d[ON_REMOTE_GAME_START] &&
      d[ON_REMOTE_GAME_START].call(b[ON_REMOTE_GAME_START], u);
    g_oCTLMultiplayer.closeAllDialog();
    clearTimeout(n);
  };
  this.tryCreateUniqueRoom = function (u, r, y) {
    B.isAllowedWord(u)
      ? ((A = s_oNetworkManager._stripHTML(u)),
        (C = r),
        (k = y),
        g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING),
        g.multiplayer.listRooms(
          ROOM_TYPE_USEROWNER,
          { id: u },
          0,
          0,
          B._onUniqueListRoomSearch,
          B.callbackError
        ))
      : (g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showGeneralDialog(
          TEXT_INVALID_NAME,
          "g_oCTLMultiplayer.closeAllDialog"
        ));
  };
  this._onUniqueListRoomSearch = function (u) {
    0 < u.length && (A += "-" + B._getRandomCodeNumber());
    B.createRoom(A, C, k);
  };
  this._onPlayNow = function () {
    B.sendMsg(MSG_PLAYNOW, "");
  };
  this._addBotInRoom = function () {
    COMBINED_PLAYERS_MODE &&
      (B.sendMsg(MSG_ADDBOT, B.generateRandomName() + "-bot"),
      document
        .querySelector(".ctl-multiplayer-room-add-bot")
        .classList.add("ctl-multiplayer-display-none"),
      document
        .querySelector(".ctl-multiplayer-room-remove-bot")
        .classList.add("ctl-multiplayer-display-none"));
  };
  this._removeBotInRoom = function () {
    COMBINED_PLAYERS_MODE &&
      (B.sendMsg(MSG_REMOVEBOT, ""),
      document
        .querySelector(".ctl-multiplayer-room-add-bot")
        .classList.add("ctl-multiplayer-display-none"),
      document
        .querySelector(".ctl-multiplayer-room-remove-bot")
        .classList.add("ctl-multiplayer-display-none"));
  };
  this.onBotAdded = function (u) {
    COMBINED_PLAYERS_MODE &&
      (document
        .querySelector(".ctl-multiplayer-room-add-bot")
        .classList.remove("ctl-multiplayer-display-none"),
      document
        .querySelector(".ctl-multiplayer-room-remove-bot")
        .classList.remove("ctl-multiplayer-display-none"));
  };
  this.onBotRemoved = function (u) {
    COMBINED_PLAYERS_MODE &&
      (0 < u
        ? (document
            .querySelector(".ctl-multiplayer-room-add-bot")
            .classList.remove("ctl-multiplayer-display-none"),
          document
            .querySelector(".ctl-multiplayer-room-remove-bot")
            .classList.remove("ctl-multiplayer-display-none"))
        : (document
            .querySelector(".ctl-multiplayer-room-add-bot")
            .classList.remove("ctl-multiplayer-display-none"),
          document
            .querySelector(".ctl-multiplayer-room-remove-bot")
            .classList.add("ctl-multiplayer-display-none")));
  };
  this.disconnectFromCurRoom = function () {
    f && (f.removeDisconnectCallback(B.callbackDisconnect), f.disconnect());
  };
  this._onDisconnectFromARoom = function () {
    d[ON_BACK_FROM_A_ROOM] &&
      d[ON_BACK_FROM_A_ROOM].call(b[ON_BACK_FROM_A_ROOM]);
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
    B.disconnectFromCurRoom();
    setTimeout(function () {
      B.gotoLobby();
    }, 500);
  };
  this.inviteLink = function () {
    var u = Base64.encode(A),
      r = Base64.encode(C),
      y = window.location.href;
    y = addParameterToUrl(y, PARAM_ROOM_ID, u);
    return (y = addParameterToUrl(y, PARAM_PASSWORD, r));
  };
  this._onClickInvite = function () {};
  this._onRoomCreated = function () {
    var u = {
        func: "s_oNetworkManager._onPlayNow",
        label: TEXT_PLAY_NOW,
        classes: "ctl-multiplayer-room-play-now ctl-multiplayer-display-none",
      },
      r = {
        func: "s_oNetworkManager._onDisconnectFromARoom",
        label: TEXT_SYS_BACK,
      },
      y = {
        func: "s_oNetworkManager._addBotInRoom",
        label: TEXT_SYS_ADD_BOT,
        classes: "ctl-multiplayer-room-add-bot ctl-multiplayer-display-block",
      },
      J = {
        func: "s_oNetworkManager._removeBotInRoom",
        label: TEXT_SYS_REMOVE_BOT,
        classes: "ctl-multiplayer-room-remove-bot ctl-multiplayer-display-none",
      },
      I = {
        id: "invite",
        func: "s_oNetworkManager._onClickInvite",
        label: TEXT_SYS_INVITE,
        classes: "ctl-multiplayer-room-invite",
      },
      Y = B.inviteLink();
    u = [u, r, I];
    COMBINED_PLAYERS_MODE && u.push(y, J);
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showWaitingPlayersInRoom(
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM + A,
      [q],
      u,
      Y
    );
    tippy("#link", {
      content: TEXT_SYS_COPIED_TO_CLIPBOARD,
      trigger: "click",
      duration: 100,
    });
    tippy("#invite", {
      content: TEXT_SYS_COPIED_TO_CLIPBOARD,
      trigger: "click",
      duration: 100,
    });
    new ClipboardJS(".ctl-multiplayer-room-invite");
    new ClipboardJS(".ctl-multiplayer-room-link");
  };
  this._onRoomJoined = function () {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showWaitingPlayersInRoom(
      TEXT_WAITING_FOR_PLAYERS_IN_ROOM + A,
      [],
      [
        {
          func: "s_oNetworkManager._onDisconnectFromARoom",
          label: TEXT_SYS_BACK,
        },
      ]
    );
  };
  this.gotoLobby = function () {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showLoading(TEXT_CONNECT_TO_LOBBY);
    B.refreshRooms();
  };
  this.refreshRooms = function () {
    g.multiplayer.listRooms(
      ROOM_TYPE_USEROWNER,
      null,
      0,
      0,
      B._onFillWithOwnerRoom,
      B.callbackError
    );
    g.multiplayer.listRooms(
      ROOM_TYPE_GAME,
      null,
      0,
      0,
      B._onFillWithGameRoom,
      B.callbackError
    );
  };
  this._onFillWithOwnerRoom = function (u) {
    p++;
    B._extractOwnerRoomInfo(u);
    2 <= p && B._onFinalUpdateRoomList();
  };
  this._onFillWithGameRoom = function (u) {
    p++;
    B._extractGameRoomInfo(u);
    2 <= p && B._onFinalUpdateRoomList();
  };
  this._onFinalUpdateRoomList = function () {
    var u = B._getCombinedRoomsLists();
    null !== document.querySelector(".ctl-multiplayer-room-list")
      ? g_oCTLMultiplayer.refreshRoomList(u)
      : this._showLobby(u);
    u = "300px";
    s_bMobile && (u = "200px");
    document.querySelector(".ctl-multiplayer-room-list").style.maxHeight = u;
  };
  this._showLobby = function (u) {
    p = 0;
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showRoomList(u);
  };
  this._extractOwnerRoomInfo = function (u) {
    e = [];
    for (var r = 0; r < u.length; r++) {
      var y = 0 === u[r].roomData.pass.length ? !1 : !0,
        J = s_oNetworkManager._stripHTML(u[r].id);
      e[r] = {
        name: J,
        private: y,
        accessible: !0,
        curusers: u[r].roomData.curusers,
        maxusers: u[r].roomData.maxusers,
      };
    }
    return e;
  };
  this._extractGameRoomInfo = function (u) {
    c = [];
    for (var r = 0; r < u.length; r++) {
      var y = 0 === u[r].roomData.pass.length ? !1 : !0,
        J = s_oNetworkManager._stripHTML(u[r].id);
      c[r] = {
        name: "game-" + J,
        private: y,
        accessible: !1,
        curusers: u[r].roomData.curusers,
        maxusers: u[r].roomData.maxusers,
      };
    }
    return c;
  };
  this._getCombinedRoomsLists = function () {
    for (var u = [], r = 0; r < e.length; r++) u.push(e[r]);
    for (r = 0; r < c.length; r++) u.push(c[r]);
    return u;
  };
  this.joinQuickMatch = function () {
    g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING);
    B.gotoMatchMakingRoom();
  };
  this.getRoomInfo = function (u, r) {
    g.multiplayer.listRooms(
      ROOM_TYPE_USEROWNER,
      { id: u, pass: r },
      0,
      0,
      B._onRoomInfoReturned,
      B.callbackError
    );
  };
  this._onRoomInfoReturned = function (u) {
    d[ON_ROOM_INFO_RETURNED] &&
      d[ON_ROOM_INFO_RETURNED].call(b[ON_ROOM_INFO_RETURNED], u);
  };
  this.tryJoinFromInvitation = function (u, r) {
    A = Base64.decode(u);
    C = Base64.decode(r);
    B.addEventListener(
      ON_ROOM_INFO_RETURNED,
      B._checkRoomAvailableFromInvitation
    );
    B.getRoomInfo(A, C);
  };
  this._checkRoomAvailableFromInvitation = function (u) {
    0 < u.length
      ? B.joinRoom(u[0].roomData.id, u[0].roomData.pass)
      : (g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showGeneralDialog(
          TEXT_ROOM_IS_EXPIRED,
          "s_oNetworkManager.gotoLobby"
        ));
  };
  this.tryJoinRoomWithPass = function (u, r) {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showLoading(TEXT_NETWORK_CONNECTING);
    A = u;
    C = r;
    g.multiplayer.listRooms(
      ROOM_TYPE_USEROWNER,
      { id: u, pass: r },
      0,
      0,
      B._checkUserPermissionToJoin,
      B.callbackError
    );
  };
  this._checkUserPermissionToJoin = function (u) {
    0 < u.length
      ? B.joinRoom(u[0].roomData.id, u[0].roomData.pass)
      : (g_oCTLMultiplayer.closeAllDialog(),
        g_oCTLMultiplayer.showGeneralDialog(
          TEXT_WRONG_PASSWORD,
          "s_oNetworkManager._onPasswordFailed"
        ));
  };
  this._onPasswordFailed = function () {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showTypeRoomPassword(A);
  };
  this.filterRoomsShown = function (u) {
    var r = B._getCombinedRoomsLists();
    u = u.toLowerCase();
    for (var y = [], J = 0; J < r.length; J++) {
      var I = r[J].name.toLowerCase();
      void 0 !== I && I.includes(u) && y.push(r[J]);
    }
    0 < u.length
      ? g_oCTLMultiplayer.refreshRoomList(y)
      : g_oCTLMultiplayer.refreshRoomList(r);
  };
  this._init();
}
var MSG_ROOM_UPDATE = "room_update",
  MSG_ROOM_IS_FULL = "room_is_full",
  MSG_ROOM_EXPIRED = "room_expired",
  MSG_MATCHMAKING_CONNECTION_SUCCESS = "matchmaking_connection_success",
  MSG_GAME_FOUND = "game_found",
  MSG_PLAYER_LEFT_GAME = "player_left_game",
  MSG_REMATCH_PANEL = "rematch_panel",
  MSG_REMATCH_ANSWER_RESULTS = "rematch_answer_results",
  MSG_NEXTMATCH_ANSWER_RESULTS = "next_match_answer_results",
  MSG_OPPONENT_MOVES = "opponent_moves",
  MSG_PIECES_RECEIVED = "pieces_received",
  MSG_START_THE_GAME = "start_the_game",
  MSG_BOT_ADDED = "bot_added",
  MSG_BOT_REMOVED = "bot_removed",
  MSG_END_MATCH = "end_match",
  MSG_END_GAME = "end_game",
  MSG_ACCEPT_REMATCH = "accept_rematch",
  MSG_ACCEPT_NEXTMATCH = "accept_next_match",
  MSG_DISCONNECTION = "disconnection",
  MSG_MOVE = "move",
  MSG_REQUEST_PIECES = "request_pieces",
  MSG_NOTIFY = "notify",
  MSG_PLAYNOW = "play_now",
  MSG_ADDBOT = "add_bot",
  MSG_REMOVEBOT = "remove_bot";
function CNetworkMessageForwarder() {
  var a, d;
  this._init = function () {
    a = [];
    d = [];
  };
  this.addEventListener = function (e, c, f) {
    a[e] = c;
    d[e] = f;
  };
  this.messageHandler = function (e) {
    switch (e.type) {
      case MSG_ROOM_UPDATE:
        b._onUpdateRoom(e);
        break;
      case MSG_ROOM_IS_FULL:
        b._onFullRoom(e);
        break;
      case MSG_ROOM_EXPIRED:
        b._onExpiredRoom(e);
        break;
      case MSG_MATCHMAKING_CONNECTION_SUCCESS:
        b._onMatchmakingConnectionSuccess(e);
        break;
      case MSG_GAME_FOUND:
        b._onGameFound(e);
        break;
      case MSG_PLAYER_LEFT_GAME:
        b._onOpponentLeftTheGame(e);
        break;
      case MSG_REMATCH_PANEL:
        b._onRematchPanel(e);
        break;
      case MSG_REMATCH_ANSWER_RESULTS:
        b._onRematchResults(e);
        break;
      case MSG_NEXTMATCH_ANSWER_RESULTS:
        b._onNextMatchResults(e);
        break;
      case MSG_OPPONENT_MOVES:
        b._onEnemyMoves(e);
        break;
      case MSG_PIECES_RECEIVED:
        b._onPiecesReceived(e);
        break;
      case MSG_START_THE_GAME:
        b._onGameStart(e);
        break;
      case MSG_BOT_ADDED:
        b._onBotAdded(e);
        break;
      case MSG_BOT_REMOVED:
        b._onBotRemoved(e);
    }
  };
  this._onUpdateRoom = function (e) {
    e = e.getString(0);
    var c = JSON.parse(e);
    e = c.nicknamelist;
    c = parseInt(c.maxnumplayers);
    g_oCTLMultiplayer.updateRoomUserList(e, c);
  };
  this._onFullRoom = function () {
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showGeneralDialog(
      TEXT_ROOM_IS_FULL,
      "s_oNetworkManager.gotoLobby"
    );
  };
  this._onExpiredRoom = function () {
    s_oNetworkManager.disconnectFromCurRoom();
    g_oCTLMultiplayer.closeAllDialog();
    g_oCTLMultiplayer.showGeneralDialog(
      TEXT_ROOM_IS_EXPIRED,
      "s_oNetworkManager.gotoLobby"
    );
  };
  this._onMatchmakingConnectionSuccess = function (e) {
    s_oNetworkManager.onMatchmakingConnectionSucces();
  };
  this._onGameFound = function (e) {
    var c = 0 == e.getInt(1) ? 1 : 0,
      f = e.getString(2);
    f = JSON.parse(f);
    f = Object.values(f);
    a[ON_GAME_FOUND] && a[ON_GAME_FOUND].call(d[ON_GAME_FOUND]);
    g_oCTLMultiplayer.onPlayerFound(f[c].nickname);
    setTimeout(function () {
      s_oNetworkManager.gotoGameRoom(e);
    }, 1500);
  };
  this._onGameStart = function (e) {
    e = e.getString(0);
    e = JSON.parse(e);
    e = parseInt(e.maxusers);
    a[ON_REMOTE_GAME_START] &&
      a[ON_REMOTE_GAME_START].call(d[ON_REMOTE_GAME_START], e);
  };
  this._onBotAdded = function (e) {
    e = e.getInt(0);
    e = parseInt(JSON.parse(e));
    s_oNetworkManager.onBotAdded(e);
  };
  this._onBotRemoved = function (e) {
    e = e.getInt(0);
    e = parseInt(JSON.parse(e));
    s_oNetworkManager.onBotRemoved(e);
  };
  this._onOpponentLeftTheGame = function (e) {
    e = parseInt(e.getInt(0));
    s_oGame.opponentLeftTheGame(e);
  };
  this._onRematchPanel = function () {
    s_oGame.showRematchQuestion();
  };
  this._onNextMatchResults = function (e) {
    if (e.getBoolean(0)) s_oGame.onOpponentAcceptNextMatch();
    else s_oGame.onOpponentRefuseNextMatch(e.getInt(1));
  };
  this._onRematchResults = function (e) {
    if (e.getBoolean(0)) s_oGame.onOpponentAcceptRematch();
    else s_oGame.onOpponentRefuseRematch();
  };
  this._onPiecesReceived = function (e) {
    e = e.getString(0);
    e = JSON.parse(e);
    s_oGame._onPiecesReceived(e);
  };
  this._onEnemyMoves = function (e) {
    e = e.getString(0);
    e = JSON.parse(e);
    s_oGame.onActionReceived(e);
  };
  var b = this;
  this._init();
}
var FORBIDDEN_LIST =
  "2 girls 1 cup;2g1c;4r5e;5h1t;5hit;a_s_s;a55;a55hole;acrotomophilia;aeolus;ahole;alabama hot pocket;alaskan pipeline;anal;analprobe;anilingus;anus;apeshit;ar5e;areola;areole;arian;arrse;arse;arsehole;aryan;ass;ass hole;assbag;assbandit;assbang;assbanged;assbanger;assbangs;assbite;assclown;asscock;asscracker;asses;assface;assfuck;assfucker;ass-fucker;assfukka;assgoblin;assh0le;asshat;ass-hat;asshead;assho1e;asshole;assholes;asshopper;ass-jabber;assjacker;asslick;asslicker;assmaster;assmonkey;assmunch;assmuncher;assnigger;asspirate;ass-pirate;assshit;assshole;asssucker;asswad;asswhole;asswipe;asswipes;auto erotic;autoerotic;axwound;azazel;azz;b!tch;b00bs;b17ch;b1tch;babe;babeland;babes;baby batter;baby juice;ball gag;ball gravy;ball kicking;ball licking;ball sack;ball sucking;ballbag;balls;ballsack;bampot;bang;bangbros;banger;bareback;barely legal;barenaked;barf;bastard;bastardo;bastards;bastinado;bawdy;bbw;bdsm;beaner;beaners;beardedclam;beastial;beastiality;beatch;beater;beaver;beaver cleaver;beaver lips;beer;beeyotch;bellend;beotch;bestial;bestiality;bi+ch;biatch;big black;big breasts;big knockers;big tits;bigtits;bimbo;bimbos;birdlock;bitch;bitchass;bitched;bitcher;bitchers;bitches;bitchin;bitching;bitchtits;bitchy;black cock;blonde action;blonde on blonde action;bloody;blow;blow job;blow your load;blowjob;blowjobs;blue waffle;blumpkin;bod;bodily;boink;boiolas;bollock;bollocks;bollok;bollox;bondage;bone;boned;boner;boners;bong;boob;boobies;boobs;booby;booger;bookie;booobs;boooobs;booooobs;booooooobs;bootee;bootie;booty;booty call;booze;boozer;boozy;bosom;bosomy;bowel;bowels;bra;brassiere;breast;breasts;breeder;brotherfucker;brown showers;brunette action;buceta;bugger;bukkake;bull shit;bulldyke;bullet vibe;bullshit;bullshits;bullshitted;bullturds;bum;bumblefuck;bung;bung hole;bunghole;bunny fucker;busty;butt;butt fuck;butt plug;buttcheeks;buttfuck;buttfucka;buttfucker;butthole;buttmuch;butt-pirate;buttplug;c.0.c.k;c.o.c.k.;c.u.n.t;c0ck;c-0-c-k;c0cksucker;caca;cahone;camel toe;cameltoe;camgirl;camslut;camwhore;carpet muncher;carpetmuncher;cawk;cervix;chesticle;chinc;chincs;chink;choad;chocolate rosebuds;chode;chodes;cipa;circlejerk;cl1t;cleveland steamer;climax;clit;clitface;clitfuck;clitoris;clitorus;clits;clitty;clover clamps;clusterfuck;cnut;cocain;cocaine;cock;c-o-c-k;cock sucker;cockass;cockbite;cockblock;cockburger;cockeye;cockface;cockfucker;cockhead;cockholster;cockjockey;cockknocker;cockknoker;cocklump;cockmaster;cockmongler;cockmongruel;cockmonkey;cockmunch;cockmuncher;cocknose;cocknugget;cocks;cockshit;cocksmith;cocksmoke;cocksmoker;cocksniffer;cocksuck;cocksucked;cocksucker;cock-sucker;cocksucking;cocksucks;cocksuka;cocksukka;cockwaffle;coital;cok;cokmuncher;coksucka;commie;condom;coochie;coochy;coon;coons;cooter;coprolagnia;coprophilia;corksucker;cornhole;cox;crabs;crack;cracker;crackwhore;crap;crappy;creampie;crotte;cum;cumbubble;cumdumpster;cumguzzler;cumjockey;cummer;cummin;cumming;cums;cumshot;cumshots;cumslut;cumstain;cumtart;cunilingus;cunillingus;cunnie;cunnilingus;cunny;cunt;c-u-n-t;cuntass;cuntface;cunthole;cunthunter;cuntlick;cuntlicker;cuntlicking;cuntrag;cunts;cuntslut;cyalis;cyberfuc;cyberfuck;cyberfucked;cyberfucker;cyberfuckers;cyberfucking;d0ng;d0uch3;d0uche;d1ck;d1ld0;d1ldo;dago;dagos;dammit;damn;damned;damnit;darkie;date rape;daterape;dawgie-style;deep throat;deepthroat;deggo;dendrophilia;dick;dickbag;dickbeaters;dickdipper;dickface;dickflipper;dickfuck;dickfucker;dickhead;dickheads;dickhole;dickish;dick-ish;dickjuice;dickmilk\ufffd;dickmonger;dickripper;dicks;dicksipper;dickslap;dick-sneeze;dicksucker;dicksucking;dicktickler;dickwad;dickweasel;dickweed;dickwhipper;dickwod;dickzipper;diddle;dike;dildo;dildos;diligaf;dillweed;dimwit;dingle;dingleberries;dingleberry;dink;dinks;dipship;dipshit;dirsa;dirty pillows;dirty sanchez;dlck;dog style;dog-fucker;doggie style;doggiestyle;doggie-style;doggin;dogging;doggy style;doggystyle;doggy-style;dolcett;domination;dominatrix;dommes;dong;donkey punch;donkeyribber;doochbag;doofus;dookie;doosh;dopey;double dong;double penetration;doublelift;douch3;douche;douchebag;douchebags;douche-fag;douchewaffle;douchey;dp action;drunk;dry hump;duche;dumass;dumb ass;dumbass;dumbasses;dumbcunt;dumbfuck;dumbshit;dummy;dumshit;dvda;dyke;dykes;eat my ass;ecchi;ejaculate;ejaculated;ejaculates;ejaculating;ejaculatings;ejaculation;ejakulate;enlargement;erect;erection;erotic;erotism;escort;essohbee;eunuch;extacy;extasy;f u c k;f u c k e r;f.u.c.k;f_u_c_k;f4nny;fack;fag;fagbag;fagfucker;fagg;fagged;fagging;faggit;faggitt;faggot;faggotcock;faggs;fagot;fagots;fags;fagtard;faig;faigt;fanny;fannybandit;fannyflaps;fannyfucker;fanyy;fart;fartknocker;fat;fatass;fcuk;fcuker;fcuking;fecal;feck;fecker;felch;felcher;felching;fellate;fellatio;feltch;feltcher;female squirting;femdom;figging;fingerbang;fingerfuck;fingerfucked;fingerfucker;fingerfuckers;fingerfucking;fingerfucks;fingering;fisted;fistfuck;fistfucked;fistfucker;fistfuckers;fistfucking;fistfuckings;fistfucks;fisting;fisty;flamer;flange;floozy;foad;foah;fondle;foobar;fook;fooker;foot fetish;footjob;foreskin;freex;frigg;frigga;frotting;fubar;fuck;f-u-c-k;fuck buttons;fuck off;fucka;fuckass;fuckbag;fuckboy;fuckbrain;fuckbutt;fuckbutter;fucked;fucker;fuckers;fuckersucker;fuckface;fuckhead;fuckheads;fuckhole;fuckin;fucking;fuckings;fuckingshitmotherfucker;fuckme;fucknugget;fucknut;fucknutt;fuckoff;fucks;fuckstick;fucktard;fuck-tard;fucktards;fucktart;fucktwat;fuckup;fuckwad;fuckwhit;fuckwit;fuckwitt;fudge packer;fudgepacker;fuk;fuker;fukker;fukkin;fuks;fukwhit;fukwit;futanari;fux;fux0r;fvck;fxck;gae;gai;gang bang;gangbang;gangbanged;gangbangs;ganja;gay;gay sex;gayass;gaybob;gaydo;gayfuck;gayfuckist;gaylord;gays;gaysex;gaytard;gaywad;genitals;gey;gfy;ghay;ghey;giant cock;gigolo;girl on;girl on top;girls gone wild;glans;goatcx;goatse;god damn;godamn;godamnit;goddam;god-dam;goddammit;goddamn;goddamned;god-damned;goddamnit;gokkun;golden shower;goldenshower;gonad;gonads;goo girl;gooch;goodpoop;gook;gooks;goregasm;gringo;grope;group sex;gspot;g-spot;gtfo;guido;guro;h0m0;h0mo;hand job;handjob;hard core;hard on;hardcore;hardcoresex;he11;hebe;heeb;hell;hemp;hentai;heroin;herp;herpes;herpy;heshe;hitler;hiv;ho;hoar;hoare;hobag;hoe;hoer;hom0;homey;homo;homodumbshit;homoerotic;homoey;honkey;honky;hooch;hookah;hooker;hoor;hootch;hooter;hooters;hore;horniest;horny;hot carl;hot chick;hotsex;how to kill;how to murder;huge fat;hump;humped;humping;hussy;hymen;inbred;incest;injun;intercourse;j3rk0ff;jack Off;jackass;jackhole;jackoff;jack-off;jaggi;jagoff;jail bait;jailbait;jap;japs;jelly donut;jerk;jerk off;jerk0ff;jerkass;jerked;jerkoff;jerk-off;jigaboo;jiggaboo;jiggerboo;jism;jiz;jizm;jizz;jizzed;juggs;jungle bunny;junglebunny;junkie;junky;kawk;kike;kikes;kill;kinbaku;kinkster;kinky;kkk;klan;knob;knobbing;knobead;knobed;knobend;knobhead;knobjocky;knobjokey;kock;kondum;kondums;kooch;kooches;kootch;kraut;kum;kummer;kumming;kums;kunilingus;kunja;kunt;kyke;l3i+ch;l3itch;labia;lameass;lardass;leather restraint;leather straight jacket;lech;lemon party;leper;lesbian;lesbians;lesbo;lesbos;lez;lezbian;lezbians;lezbo;lezbos;lezzie;lezzies;lezzy;lmao;lmfao;loin;loins;lolita;lovemaking;lube;lust;lusting;lusty;m0f0;m0fo;m45terbate;ma5terb8;ma5terbate;make me come;male squirting;mams;masochist;massa;masterb8;masterbat;masterbat3;masterbate;master-bate;masterbating;masterbation;masterbations;masturbate;masturbating;masturbation;maxi;mcfagget;menage a trois;menses;menstruate;menstruation;meth;m-fucking;mick;milf;minge;missionary position;mof0;mofo;mo-fo;molest;moolie;moron;mothafuck;mothafucka;mothafuckas;mothafuckaz;mothafucked;mothafucker;mothafuckers;mothafuckin;mothafucking;mothafuckings;mothafucks;mother fucker;motherfuck;motherfucka;motherfucked;motherfucker;motherfuckers;motherfuckin;motherfucking;motherfuckings;motherfuckka;motherfucks;mound of venus;mr hands;mtherfucker;mthrfucker;mthrfucking;muff;muff diver;muffdiver;muffdiving;munging;murder;mutha;muthafecker;muthafuckaz;muthafucker;muthafuckker;muther;mutherfucker;mutherfucking;muthrfucking;n1gga;n1gger;nad;nads;naked;nambla;napalm;nappy;nawashi;nazi;nazism;negro;neonazi;nig nog;nigaboo;nigg3r;nigg4h;nigga;niggah;niggas;niggaz;nigger;niggers;niggle;niglet;nimphomania;nimrod;ninny;nipple;nipples;nob;nob jokey;nobhead;nobjocky;nobjokey;nooky;nsfw images;nude;nudity;numbnuts;nut sack;nutsack;nympho;nymphomania;octopussy;omorashi;one cup two girls;one guy one jar;opiate;opium;oral;orally;organ;orgasim;orgasims;orgasm;orgasmic;orgasms;orgies;orgy;ovary;ovum;ovums;p.u.s.s.y.;p0rn;paddy;paedophile;paki;panooch;pantie;panties;panty;pastie;pasty;pawn;pcp;pecker;peckerhead;pedo;pedobear;pedophile;pedophilia;pedophiliac;pee;peepee;pegging;penetrate;penetration;penial;penile;penis;penisbanger;penisfucker;penispuffer;perversion;peyote;phalli;phallic;phone sex;phonesex;phuck;phuk;phuked;phuking;phukked;phukking;phuks;phuq;piece of shit;pigfucker;pillowbiter;pimp;pimpis;pinko;piss;piss pig;pissed;pissed off;pisser;pissers;pisses;pissflaps;pissin;pissing;pissoff;piss-off;pisspig;playboy;pleasure chest;pms;polack;pole smoker;polesmoker;pollock;ponyplay;poof;poon;poonani;poonany;poontang;poop;poop chute;poopchute;poopuncher;porch monkey;porchmonkey;porn;porno;pornography;pornos;pot;potty;prick;pricks;prig;prince albert piercing;pron;prostitute;prude;pthc;pube;pubes;pubic;pubis;punanny;punany;punkass;punky;punta;puss;pusse;pussi;pussies;pussy;pussylicking;pussypounder;pussys;pust;puto;queaf;queef;queer;queerbait;queerhole;queero;queers;quicky;quim;racy;raghead;raging boner;rape;raped;raper;raping;rapist;raunch;rectal;rectum;rectus;reefer;reetard;reich;renob;retard;retarded;reverse cowgirl;revue;rimjaw;rimjob;rimming;ritard;rosy palm;rosy palm and her 5 sisters;rtard;r-tard;rum;rump;rumprammer;ruski;rusty trombone;s hit;s&m;s.h.i.t.;s.o.b.;s_h_i_t;s0b;sadism;sadist;sand nigger;sandler;sandnigger;sanger;santorum;scag;scantily;scat;schizo;schlong;scissoring;screw;screwed;screwing;scroat;scrog;scrot;scrote;scrotum;scrud;scum;seaman;seamen;seduce;seks;semen;sex;sexo;sexual;sexy;sh!+;sh!t;sh1t;s-h-1-t;shag;shagger;shaggin;shagging;shamedame;shaved beaver;shaved pussy;shemale;shi+;shibari;shit;s-h-i-t;shitass;shitbag;shitbagger;shitblimp;shitbrains;shitbreath;shitcanned;shitcunt;shitdick;shite;shiteater;shited;shitey;shitface;shitfaced;shitfuck;shitfull;shithead;shithole;shithouse;shiting;shitings;shits;shitspitter;shitstain;shitt;shitted;shitter;shitters;shittiest;shitting;shittings;shitty;shiz;shiznit;shota;shrimping;sissy;skag;skank;skeet;skullfuck;slag;slanteye;slave;sleaze;sleazy;slut;slutbag;slutdumper;slutkiss;sluts;smeg;smegma;smut;smutty;snatch;sniper;snowballing;snuff;s-o-b;sodom;sodomize;sodomy;son-of-a-bitch;souse;soused;spac;sperm;spic;spick;spik;spiks;splooge;splooge moose;spooge;spook;spread legs;spunk;steamy;stfu;stiffy;stoned;strap on;strapon;strappado;strip;strip club;stroke;stupid;style doggy;suck;suckass;sucked;sucking;sucks;suicide girls;sultry women;sumofabiatch;swastika;swinger;t1t;t1tt1e5;t1tties;tainted love;tampon;tard;taste my;tawdry;tea bagging;teabagging;teat;teets;teez;terd;teste;testee;testes;testical;testicle;testis;threesome;throating;thrust;thug;thundercunt;tied up;tight white;tinkle;tit;titfuck;titi;tits;titt;tittie5;tittiefucker;titties;titty;tittyfuck;tittyfucker;tittywank;titwank;toke;tongue in a;toots;topless;tosser;towelhead;tramp;tranny;transsexual;trashy;tribadism;tub girl;tubgirl;turd;tush;tushy;tw4t;twat;twathead;twatlips;twats;twatty;twatwaffle;twink;twinkie;two girls one cup;twunt;twunter;ugly;unclefucker;undies;undressing;unwed;upskirt;urethra play;urinal;urine;urophilia;uterus;uzi;v14gra;v1gra;vag;vagina;vajayjay;va-j-j;valium;venus mound;viagra;vibrator;violet wand;virgin;vixen;vjayjay;vodka;vomit;vorarephilia;voyeur;vulgar;vulva;w00se;wad;wang;wank;wanker;wankjob;wanky;wazoo;wedgie;weed;weenie;weewee;weiner;weirdo;wench;wet dream;wetback;wh0re;wh0reface;white power;whitey;whiz;whoar;whoralicious;whore;whorealicious;whorebag;whored;whoreface;whorehopper;whorehouse;whores;whoring;wigger;willies;willy;womb;woody;wop;wrapping men;wrinkled starfish;wtf;xrated;x-rated;xx;xxx;yaoi;yeasty;yellow showers;yiffy;yobbo;zoophile;zoophilia;zubb".split(
    ";"
  );
function CRadialWipeWidget(a, d, b) {
  var e, c, f, g, h, l, k;
  this._init = function (m, p, n) {
    c = e = !1;
    f = 0;
    k = new createjs.Container();
    k.x = m;
    k.y = p;
    n.addChild(k);
    g = createjs.Graphics.getRGB(
      TIME_BG_COLORS[Math.floor(Math.random() * TIME_BG_COLORS.length)]
    );
    h = new createjs.Shape();
    h.rotation = -90;
    h.alpha = 1;
    k.addChild(h);
    l = new createjs.Text("", " 60px " + PRIMARY_FONT, "#ffffff");
    l.textAlign = "center";
    l.textBaseline = "alphabetic";
    l.y = 20;
    l.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    k.addChild(l);
  };
  this.unload = function () {
    b.removeChild(k);
  };
  this.setPos = function (m, p) {
    k.x = m;
    k.y = p;
  };
  this.reset = function () {
    l.text = "";
    stopSound("hurryup");
    l.color = "#ffffff";
  };
  this.setVisible = function (m) {
    k.visible = m;
  };
  this.setScale = function (m) {
    k.scaleX = k.scaleY = m;
  };
  this.setHurryUpMode = function (m) {
    e = !0;
    f = m;
  };
  this.removeHurryUpMode = function () {
    e = !1;
  };
  this._showHurryUpWarning = function () {
    playSound("hurryup", 1, !1);
  };
  this.alwaysShown = function () {
    c = !0;
  };
  this._updateTimeText = function (m) {
    l.text = Math.ceil(m / 1e3);
  };
  this._updateRadialWipe = function (m, p) {
    var n = linearFunction(m, p, 0, 0, 360);
    h.graphics.clear();
    h.graphics.f(g);
    h.graphics.moveTo(0, 0);
    h.graphics.arc(0, 0, TIME_CONTROLLER_RADIUS, 0, degreesToRadians(n), !0);
  };
  this.update = function (m, p) {
    this._updateTimeText(m);
    this._updateRadialWipe(m, p);
    if (0 === m || (m > f && !c)) (l.text = ""), h.graphics.clear();
    e && m < f && ((e = !1), this._showHurryUpWarning());
  };
  this._init(a, d, b);
}
function CPreloader() {
  var a, d, b, e, c, f, g, h, l;
  this._init = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
    s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
    s_oSpriteLibrary.loadSprites();
    l = new createjs.Container();
    s_oStage.addChild(l);
  };
  this.unload = function () {
    l.removeAllChildren();
  };
  this._onImagesLoaded = function () {};
  this._onAllImagesLoaded = function () {
    this.attachSprites();
    s_oMain.preloaderReady();
  };
  this.attachSprites = function () {
    var k = new createjs.Shape();
    k.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    l.addChild(k);
    k = s_oSpriteLibrary.getSprite("200x200");
    g = createBitmap(k);
    g.regX = 0.5 * k.width;
    g.regY = 0.5 * k.height;
    g.x = CANVAS_WIDTH / 2;
    g.y = CANVAS_HEIGHT / 2 - 180;
    l.addChild(g);
    h = new createjs.Shape();
    h.graphics
      .beginFill("rgba(0,0,0,0.01)")
      .drawRoundRect(g.x - 100, g.y - 100, 200, 200, 10);
    l.addChild(h);
    g.mask = h;
    k = s_oSpriteLibrary.getSprite("progress_bar");
    e = createBitmap(k);
    e.x = CANVAS_WIDTH / 2 - k.width / 2;
    e.y = CANVAS_HEIGHT / 2 + 50;
    l.addChild(e);
    a = k.width;
    d = k.height;
    c = new createjs.Shape();
    c.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(e.x, e.y, 1, d);
    l.addChild(c);
    e.mask = c;
    b = new createjs.Text("", "30px " + PRIMARY_FONT, "#fff");
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2 + 100;
    b.textBaseline = "alphabetic";
    b.textAlign = "center";
    l.addChild(b);
    f = new createjs.Shape();
    f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    l.addChild(f);
    createjs.Tween.get(f)
      .to({ alpha: 0 }, 500)
      .call(function () {
        createjs.Tween.removeTweens(f);
        l.removeChild(f);
      });
  };
  this.refreshLoader = function (k) {
    b.text = k + "%";
    100 === k &&
      (s_oMain.onRemovePreloader(), (b.visible = !1), (e.visible = !1));
    c.graphics.clear();
    k = Math.floor((k * a) / 100);
    c.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(e.x, e.y, k, d);
  };
  this._init();
}
function CMain(a) {
  var d,
    b = 0,
    e = 0,
    c = STATE_LOADING,
    f,
    g;
  this.initContainer = function () {
    s_oCanvas = document.getElementById("canvas");
    s_oStage = new createjs.Stage(s_oCanvas);
    s_oStage.preventSelection = !0;
    s_bMobile = isMobile();
    !1 === s_bMobile
      ? s_oStage.enableMouseOver(20)
      : createjs.Touch.enable(s_oStage, !0);
    s_iPrevTime = new Date().getTime();
    createjs.Ticker.addEventListener("tick", this._update);
    createjs.Ticker.framerate = FPS;
    navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
    s_oSpriteLibrary = new CSpriteLibrary();
    s_oNetworkManager = new CNetworkManager();
    f = new CPreloader();
  };
  this.preloaderReady = function () {
    this._loadImages();
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || this._initSounds();
    d = !0;
  };
  this.soundLoaded = function () {
    b++;
    f.refreshLoader(Math.floor((b / e) * 100));
  };
  this._initSounds = function () {
    Howler.mute(!s_bAudioActive);
    s_aSoundsInfo = [];
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "soundtrack",
      loop: !0,
      volume: 1,
      ingamename: "soundtrack",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "click",
      loop: !1,
      volume: 1,
      ingamename: "click",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "game_over",
      loop: !1,
      volume: 1,
      ingamename: "game_over",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "card_dealing",
      loop: !1,
      volume: 1,
      ingamename: "card_dealing",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "snap",
      loop: !1,
      volume: 1,
      ingamename: "snap",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "card",
      loop: !1,
      volume: 1,
      ingamename: "card",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "special_card",
      loop: !1,
      volume: 1,
      ingamename: "special_card",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "change_color",
      loop: !1,
      volume: 1,
      ingamename: "change_color",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "hurryup",
      loop: !1,
      volume: 1,
      ingamename: "hurryup",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "attempt_failed",
      loop: !1,
      volume: 1,
      ingamename: "attempt_failed",
    });
    s_aSoundsInfo.push({
      path: "./sounds/",
      filename: "match_found",
      loop: !1,
      volume: 1,
      ingamename: "match_found",
    });
    e += s_aSoundsInfo.length;
    s_aSounds = [];
    for (var l = 0; l < s_aSoundsInfo.length; l++)
      this.tryToLoadSound(s_aSoundsInfo[l], !1);
  };
  this.tryToLoadSound = function (l, k) {
    setTimeout(
      function () {
        s_aSounds[l.ingamename] = new Howl({
          src: [l.path + l.filename + ".mp3"],
          autoplay: !1,
          preload: !0,
          loop: l.loop,
          volume: l.volume,
          onload: s_oMain.soundLoaded,
          onloaderror: function (m, p) {
            for (var n = 0; n < s_aSoundsInfo.length; n++)
              if (
                0 < s_aSounds[s_aSoundsInfo[n].ingamename]._sounds.length &&
                m === s_aSounds[s_aSoundsInfo[n].ingamename]._sounds[0]._id
              ) {
                s_oMain.tryToLoadSound(s_aSoundsInfo[n], !0);
                break;
              } else
                document.querySelector("#block_game").style.display = "none";
          },
          onplayerror: function (m) {
            for (var p = 0; p < s_aSoundsInfo.length; p++)
              if (m === s_aSounds[s_aSoundsInfo[p].ingamename]._sounds[0]._id) {
                s_aSounds[s_aSoundsInfo[p].ingamename].once(
                  "unlock",
                  function () {
                    s_aSounds[s_aSoundsInfo[p].ingamename].play();
                    "soundtrack" === s_aSoundsInfo[p].ingamename &&
                      null !== s_oGame &&
                      setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
                  }
                );
                break;
              }
          },
        });
      },
      k ? 200 : 0
    );
  };
  this._loadImages = function () {
    s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
    s_oSpriteLibrary.addSprite("credits_panel", "./sprites/credits_panel.png");
    s_oSpriteLibrary.addSprite(
      "select_color_panel",
      "./sprites/select_color_panel.png"
    );
    s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
    s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
    s_oSpriteLibrary.addSprite("but_yes_big", "./sprites/but_yes_big.png");
    s_oSpriteLibrary.addSprite("but_exit_big", "./sprites/but_exit_big.png");
    s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
    s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
    s_oSpriteLibrary.addSprite("but_uno", "./sprites/but_uno.png");
    s_oSpriteLibrary.addSprite("but_p2", "./sprites/but_p2.png");
    s_oSpriteLibrary.addSprite("but_p3", "./sprites/but_p3.png");
    s_oSpriteLibrary.addSprite("but_p4", "./sprites/but_p4.png");
    s_oSpriteLibrary.addSprite("but_red", "./sprites/but_red.png");
    s_oSpriteLibrary.addSprite("but_green", "./sprites/but_green.png");
    s_oSpriteLibrary.addSprite("but_blue", "./sprites/but_blue.png");
    s_oSpriteLibrary.addSprite("but_yellow", "./sprites/but_yellow.png");
    s_oSpriteLibrary.addSprite("stop_turn", "./sprites/stop_turn.png");
    s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
    s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
    s_oSpriteLibrary.addSprite(
      "bg_select_players",
      "./sprites/bg_select_players.jpg"
    );
    s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
    s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
    s_oSpriteLibrary.addSprite(
      "but_fullscreen",
      "./sprites/but_fullscreen.png"
    );
    s_oSpriteLibrary.addSprite("but_arrow", "./sprites/arrow.png");
    s_oSpriteLibrary.addSprite("but_skip", "./sprites/but_skip.png");
    s_oSpriteLibrary.addSprite("line_player", "./sprites/line_players.png");
    s_oSpriteLibrary.addSprite("cards", "./sprites/cards.png");
    s_oSpriteLibrary.addSprite("colors", "./sprites/colors.png");
    s_oSpriteLibrary.addSprite("draw_four_anim", "./sprites/draw_4.png");
    s_oSpriteLibrary.addSprite("draw_two_anim", "./sprites/draw_2.png");
    s_oSpriteLibrary.addSprite("stop_turn_anim", "./sprites/stop_turn.png");
    s_oSpriteLibrary.addSprite(
      "clock_wise_anim",
      "./sprites/change_clockwise.png"
    );
    s_oSpriteLibrary.addSprite("change_color", "./sprites/change_color.png");
    s_oSpriteLibrary.addSprite("cloud_uno", "./sprites/cloud.png");
    s_oSpriteLibrary.addSprite("finger", "./sprites/finger.png");
    s_oSpriteLibrary.addSprite("shuffle_anim", "./sprites/shuffle_anim.png");
    s_oSpriteLibrary.addSprite("local_but", "./sprites/local_but.png");
    s_oSpriteLibrary.addSprite(
      "multiplayer_but",
      "./sprites/multiplayer_but.png"
    );
    s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");
    s_oSpriteLibrary.addSprite("but_show", "./sprites/but_show.png");
    s_oSpriteLibrary.addSprite("score_icon", "./sprites/score_icon.png");
    s_oSpriteLibrary.addSprite("info_label", "./sprites/info_label.png");
    s_oSpriteLibrary.addSprite("cup_icon", "./sprites/cup_icon.png");
    s_oSpriteLibrary.addSprite("but_lang", "./sprites/but_lang.png");
    s_oSpriteLibrary.addSprite("toggle_anim", "./sprites/toggle_anim.png");
    s_oSpriteLibrary.addSprite("attempt", "./sprites/attempt.png");
    for (var l = 0; l < NUM_LANGUAGES; l++)
      s_oSpriteLibrary.addSprite("logo_" + l, "./sprites/logo_" + l + ".png");
    e += s_oSpriteLibrary.getNumSprites();
    s_oSpriteLibrary.loadSprites();
  };
  this._onImagesLoaded = function () {
    b++;
    f.refreshLoader(Math.floor((b / e) * 100));
  };
  this._onAllImagesLoaded = function () {};
  this.onRemovePreloader = function () {
    f.unload();
    try {
      checkMoreGames(
        s_szGameID,
        "middle-left",
        ["cards", "board", "multiplayer"],
        [],
        -1,
        "black"
      );
    } catch (l) {}
    s_oSoundtrack = playSound("soundtrack", 1, !0);
    s_oLocalSavings = new CLocalSavings();
    this.gotoMenu();
  };
  this.gotoMenu = function () {
    try {
      showMoreGames();
    } catch (l) {}
    new CMenu();
    c = STATE_MENU;
  };
  this.gotoSelectPlayers = function () {
    new CSelectPlayers();
    c = STATE_SELECT_PLAYERS;
  };
  this.gotoGame = function () {
    s_oGame = g = new CGameSingle(h);
    c = STATE_GAME;
  };
  this.gotoGameMulti = function (l) {
    NUM_PLAYERS = l;
    s_oGame = g = new CGameMulti(h);
    c = STATE_GAME;
  };
  this.gotoGameWithBot = function () {
    NUM_PLAYERS = 2;
    s_oGame = g = new CGameSingleWithBot(h);
    c = STATE_GAME;
  };
  this.gotoHelp = function () {
    new CHelp();
    c = STATE_HELP;
  };
  this.stopUpdate = function () {
    s_bMultiplayer ||
      ((d = !1),
      (createjs.Ticker.paused = !0),
      (document.querySelector("#block_game").style.display = "block"));
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) || Howler.mute(!0);
  };
  this.startUpdate = function () {
    s_bMultiplayer ||
      ((s_iPrevTime = new Date().getTime()),
      (d = !0),
      (createjs.Ticker.paused = !1),
      (document.querySelector("#block_game").style.display = "none"));
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      !s_bAudioActive ||
      s_bAdShown ||
      Howler.mute(!1);
  };
  this._update = function (l) {
    if (!1 !== d) {
      var k = new Date().getTime();
      s_iTimeElaps = k - s_iPrevTime;
      s_iCntTime += s_iTimeElaps;
      s_iCntFps++;
      s_iPrevTime = k;
      1e3 <= s_iCntTime &&
        ((s_iCurFps = s_iCntFps), (s_iCntTime -= 1e3), (s_iCntFps = 0));
      c === STATE_GAME && g.update();
      s_oStage.update(l);
    }
  };
  s_oMain = this;
  var h = a;
  ENABLE_FULLSCREEN = ENABLE_CHECK_ORIENTATION = !0;
  STARTING_NUM_CARDS = 7;
  s_bAudioActive = !0;
  a = navigator.language.split("-")[0];
  console.log("iLang " + a);
  void 0 === LANG_CODES[a] && (a = "en");
  s_iCurLang = LANG_CODES[a];
  this.initContainer();
  refreshLanguage();
}
var s_bMobile,
  s_bAudioActive = !1,
  s_iCntTime = 0,
  s_iTimeElaps = 0,
  s_iPrevTime = 0,
  s_iCntFps = 0,
  s_iCurFps = 0,
  s_bFullscreen = !1,
  s_oDrawLayer,
  s_oStage,
  s_oMain,
  s_oSpriteLibrary,
  s_oSoundtrack = null,
  s_oCanvas,
  s_bFirstGame = !0,
  s_aSounds,
  s_aSoundsInfo,
  s_oNetworkManager,
  s_bMultiplayer,
  s_bPlayWithBot,
  s_oGame,
  s_iCurLang = LANG_EN,
  s_oLocalSavings;
function CPanelTutorial() {
  var a, d, b, e, c, f, g;
  this.init = function () {
    g = new createjs.Container();
    f = 0;
    a = new createjs.Container();
    a.x = CANVAS_WIDTH / 2;
    a.y = CANVAS_HEIGHT / 2;
    d = new createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
    d.regX = 398;
    d.regY = 258.5;
    d.alpha = 0.8;
    a.addChild(d);
    s_oStage.addChild(a);
    b = new CGfxButton(
      a.getBounds().width / 2 - 50,
      0,
      s_oSpriteLibrary.getSprite("but_arrow"),
      a
    );
    b.addEventListener(ON_MOUSE_DOWN, this.onButNext, this);
    var h = s_oSpriteLibrary.getSprite("but_arrow");
    e = new CGfxButton(-(a.getBounds().width / 2 - 50), 0, h, a);
    e.addEventListener(ON_MOUSE_DOWN, this.onButBack, this);
    e.getButtonImage().rotation = 180;
    c = new CGfxButton(
      a.getBounds().width / 2 - 53,
      a.getBounds().height / 2 - 53,
      s_oSpriteLibrary.getSprite("but_skip"),
      a
    );
    c.addEventListener(ON_MOUSE_DOWN, this.onButSkip, this);
    this.loadPage(f);
  };
  this.loadPage = function (h) {
    switch (h) {
      case 0:
        e.setVisible(!1);
        new CTLText(
          g,
          -300,
          -200,
          600,
          50,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          TEXT_WELCOME,
          !0,
          !0,
          !0,
          !1
        );
        new CTLText(
          g,
          -80,
          -120,
          300,
          240,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL1, GAME_SCORE_WIN),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, "card_1_7", 0, 0);
        h.setAnimTutorial("tutorial");
        a.addChild(g);
        break;
      case 1:
        e.setVisible(!0);
        new CTLText(
          g,
          -80,
          -120,
          300,
          240,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL2, CARD_SCORE[12]),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, "card_0_12", 0, 0);
        h.setAnimTutorial("draw2tutorial");
        break;
      case 2:
        new CTLText(
          g,
          -80,
          -105,
          300,
          210,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL3, CARD_SCORE[10]),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, "card_1_7", 0, 0);
        h.setAnimTutorial("stopTurnTutorial");
        break;
      case 3:
        new CTLText(
          g,
          -80,
          -105,
          300,
          210,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL4, CARD_SCORE[11]),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, "card_1_7", 0, 0);
        h.setAnimTutorial("changeClockWiseTutorial");
        break;
      case 4:
        new CTLText(
          g,
          -80,
          -120,
          300,
          240,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL5, CARD_SCORE[13]),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, FOTOGRAM_COLOR, 0, 0);
        h.instantShow();
        break;
      case 5:
        b.setVisible(!0);
        new CTLText(
          g,
          -80,
          -120,
          300,
          240,
          50,
          "center",
          "#fff",
          PRIMARY_FONT,
          1.2,
          0,
          0,
          sprintf(TEXT_TUTORIAL6, CARD_SCORE[14]),
          !0,
          !0,
          !0,
          !1
        );
        h = new CCard(-215, 0, g, FOTOGRAM_DRAW_FOUR, 0, 0);
        h.instantShow();
        break;
      case 6:
        b.setVisible(!1),
          new CTLText(
            g,
            -80,
            -120,
            300,
            240,
            50,
            "center",
            "#fff",
            PRIMARY_FONT,
            1.2,
            0,
            0,
            sprintf(TEXT_TUTORIAL7, NUM_PENALTY_CARDS),
            !0,
            !0,
            !0,
            !1
          ),
          (h = new createBitmap(s_oSpriteLibrary.getSprite("but_uno"))),
          (h.regX = 50),
          (h.regY = 50.5),
          (h.x = -215),
          (h.scaleX = 1.5),
          (h.scaleY = 1.5),
          g.addChild(h);
    }
  };
  this.onButNext = function () {
    f++;
    g.removeAllChildren();
    this.loadPage(f);
  };
  this.onButBack = function () {
    f--;
    g.removeAllChildren();
    this.loadPage(f);
  };
  this.onButSkip = function () {
    s_oStage.removeChild(a);
    s_oGame._startGame();
  };
  this.init();
}
function CTurnManager() {
  var a, d, b, e, c;
  this.init = function () {
    a = !0;
    for (var f = [], g = 0; g < NUM_PLAYERS; g++) f.push(g);
    c = new CircularList(f);
    e = c.current();
    b = c.current();
    d = c.getNext();
    s_oTurnManager = this;
  };
  this.changeClockWise = function () {
    a = !0 === a ? !1 : !0;
  };
  this.nextTurn = function () {
    !0 === a
      ? (c.next(), (b = c.current()), (d = c.getNext()))
      : (c.prev(), (b = c.current()), (d = c.getPrev()));
  };
  this.prevTurn = function () {
    !0 === a
      ? (c.prev(), (b = c.current()), (d = c.getNext()))
      : (c.next(), (b = c.current()), (d = c.getPrev()));
  };
  this.setTurn = function (f) {
    c.setCurrent(f);
    b = c.current();
    d = !0 === a ? c.getNext() : c.getPrev();
  };
  this.setFirstPlayerToBegin = function () {
    do e++, e === NUM_PLAYERS && (e = 0);
    while (null === c.setCurrent(e));
    this.setTurn(e);
  };
  this.getFirstPlayerToBegin = function () {
    return e;
  };
  this.resetClockWise = function () {
    a = !0;
  };
  this.resetFirstPlayer = function () {
    e = -1;
  };
  this.getTurn = function () {
    return b;
  };
  this.getNextPlayer = function () {
    return d;
  };
  this.getClockWise = function () {
    return a;
  };
  this.removePlayer = function (f) {
    f === b
      ? (a ? this.prevTurn() : this.nextTurn(), c.removeElement(f))
      : (c.removeElement(f), c.setCurrent(b));
  };
  this.init();
}
s_oTurnManager = null;
function CAnimation() {
  var a, d, b, e, c, f, g;
  this.init = function () {
    f = !1;
    var h = s_oSpriteLibrary.getSprite("draw_four_anim");
    h = {
      images: [h],
      framerate: FPS_ANIMS,
      frames: { width: 292, height: 290, regX: 146, regY: 145 },
      animations: {
        anim: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          next: "stop",
          speed: 0.8,
        },
        reverse: {
          frames: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          next: [0],
          speed: 0.8,
        },
        stop: [13],
      },
    };
    h = new createjs.SpriteSheet(h);
    a = new createjs.Sprite(h, 0);
    h = s_oSpriteLibrary.getSprite("draw_two_anim");
    h = {
      images: [h],
      framerate: FPS_ANIMS,
      frames: { width: 292, height: 322, regX: 146, regY: 161 },
      animations: {
        anim: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          next: "stop",
          speed: 0.8,
        },
        reverse: {
          frames: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
          next: [0],
          speed: 0.8,
        },
        stop: [13],
      },
    };
    h = new createjs.SpriteSheet(h);
    d = new createjs.Sprite(h, 0);
    h = s_oSpriteLibrary.getSprite("stop_turn_anim");
    b = new createBitmap(h, 292, 300);
    h = s_oSpriteLibrary.getSprite("clock_wise_anim");
    e = new createBitmap(h, 292, 300);
    h = s_oSpriteLibrary.getSprite("change_color");
    h = {
      images: [h],
      framerate: FPS_ANIMS,
      frames: { width: 328, height: 315, regX: 164, regY: 157.5 },
      animations: {
        anim: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          next: "anim",
          speed: 0.8,
        },
        stop: [16],
        color_0: { frames: [0, 1, 2, 3, 4, 5, 6], speed: 0.8 },
        color_1: { frames: [0, 1, 2], speed: 0.8 },
        color_2: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          speed: 0.8,
        },
        color_3: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], speed: 0.8 },
      },
    };
    h = new createjs.SpriteSheet(h);
    c = new createjs.Sprite(h, 0);
    h = s_oSpriteLibrary.getSprite("shuffle_anim");
    h = {
      images: [h],
      framerate: FPS_ANIMS,
      frames: { width: 403, height: 386, regX: 201.5, regY: 193 },
      animations: {
        anim: {
          frames: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
          ],
          next: "anim",
        },
        idle: [17],
      },
    };
    h = new createjs.SpriteSheet(h);
    g = new createjs.Sprite(h, "idle");
  };
  this.draw3Anim = function (h, l, k, m) {
    s_bEnableAnim
      ? ((a.alpha = 0),
        (a.x = CANVAS_WIDTH / 2),
        (a.y = CANVAS_HEIGHT / 2),
        (a.scaleX = 0.01),
        (a.scaleY = 0.01),
        s_oStage.addChild(a),
        a.stop(),
        playSound("special_card", 0.5, !1),
        new createjs.Tween.get(a)
          .to(
            { alpha: 1, scaleX: 1.4, scaleY: 1.4 },
            200,
            createjs.Ease.cubicOut
          )
          .wait(200)
          .call(function () {
            a.gotoAndPlay("anim");
          })
          .wait(1e3)
          .call(function () {
            a.gotoAndPlay("reverse");
          })
          .wait(200)
          .to(
            { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
            200,
            createjs.Ease.cubicIn
          )
          .call(function () {
            s_oStage.removeChild(a);
            s_oGame.drawCardsTween(h, l, k, m);
          }))
      : s_oGame.drawCardsTween(h, l, k, m);
  };
  this.drawTwoAnim = function (h, l, k, m) {
    s_bEnableAnim
      ? ((d.alpha = 0),
        (d.x = CANVAS_WIDTH / 2),
        (d.y = CANVAS_HEIGHT / 2),
        (d.scaleX = 0.01),
        (d.scaleY = 0.01),
        s_oStage.addChild(d),
        d.stop(),
        playSound("special_card", 0.5, !1),
        new createjs.Tween.get(d)
          .to(
            { alpha: 1, scaleX: 1.4, scaleY: 1.4 },
            200,
            createjs.Ease.cubicOut
          )
          .wait(200)
          .call(function () {
            d.gotoAndPlay("anim");
            setVolume("special_card", 0.2);
          })
          .wait(1e3)
          .call(function () {
            d.gotoAndPlay("reverse");
            setVolume("special_card", 0.1);
          })
          .wait(200)
          .to(
            { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
            200,
            createjs.Ease.cubicIn
          )
          .call(function () {
            s_oStage.removeChild(d);
            s_oGame.drawCardsTween(h, l, k, m);
          }))
      : s_oGame.drawCardsTween(h, l, k, m);
  };
  this.stopTurn = function () {
    return s_bEnableAnim
      ? new Promise(function (h, l) {
          b.alpha = 0;
          b.regX = 146;
          b.regY = 150;
          b.x = CANVAS_WIDTH / 2;
          b.y = CANVAS_HEIGHT / 2;
          b.scaleX = 0.01;
          b.scaleY = 0.01;
          s_oStage.addChild(b);
          playSound("game_over", 1, !1);
          new createjs.Tween.get(b)
            .to({ alpha: 1, scaleX: 2, scaleY: 2 }, 200, createjs.Ease.cubicOut)
            .to({ scaleX: 1.6, scaleY: 1.6 }, 200)
            .to({ scaleX: 2, scaleY: 2 }, 200)
            .to({ scaleX: 1.6, scaleY: 1.6 }, 200)
            .to({ scaleX: 2, scaleY: 2 }, 200)
            .to(
              { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
              200,
              createjs.Ease.cubicIn
            )
            .call(function () {
              s_oStage.removeChild(b);
              h();
            });
        })
      : new Promise(function (h, l) {
          h();
        });
  };
  this.changeClockWise = function (h) {
    return s_bEnableAnim
      ? new Promise(function (l, k) {
          e.alpha = 0;
          e.rotation = 0;
          e.regX = 146;
          e.regY = 150;
          e.x = CANVAS_WIDTH / 2;
          e.y = CANVAS_HEIGHT / 2;
          e.scaleX = 0.01;
          e.scaleY = 0.01;
          s_oStage.addChild(e);
          playSound("special_card", 0.5, !1);
          !1 === h
            ? new createjs.Tween.get(e)
                .to(
                  { alpha: 1, scaleX: 2, scaleY: 2 },
                  200,
                  createjs.Ease.cubicOut
                )
                .to({ rotation: 360 }, 500)
                .wait(500)
                .to({ rotation: -360 }, 500)
                .wait(500)
                .to(
                  { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
                  200,
                  createjs.Ease.cubicIn
                )
                .call(function () {
                  s_oStage.removeChild(e);
                  l();
                })
            : new createjs.Tween.get(e)
                .to(
                  { alpha: 1, scaleX: 2, scaleY: 2 },
                  200,
                  createjs.Ease.cubicOut
                )
                .to({ rotation: -360 }, 500)
                .wait(500)
                .to({ rotation: 360 }, 500)
                .wait(500)
                .to(
                  { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
                  200,
                  createjs.Ease.cubicIn
                )
                .call(function () {
                  s_oStage.removeChild(e);
                  l();
                });
        })
      : new Promise(function (l, k) {
          l();
        });
  };
  this.changeColor = function (h) {
    return s_bEnableAnim
      ? new Promise(function (l, k) {
          c.alpha = 0;
          c.x = CANVAS_WIDTH / 2;
          c.y = CANVAS_HEIGHT / 2;
          c.scaleX = 0.01;
          c.scaleY = 0.01;
          s_oStage.addChild(c);
          c.stop();
          playSound("change_color", 0.5, !1);
          new createjs.Tween.get(c)
            .to(
              { alpha: 1, scaleX: 1.4, scaleY: 1.4 },
              200,
              createjs.Ease.cubicOut
            )
            .call(function () {
              c.gotoAndPlay("anim");
            })
            .wait(1300)
            .call(function () {
              f = !0;
              c.on(
                "animationend",
                s_oCAnimation.endAnimation,
                s_oCAnimation,
                !1,
                l
              );
              c.gotoAndStop(16);
              c.gotoAndPlay("color_" + h);
            });
        })
      : new Promise(function (l, k) {
          f = !0;
          l();
        });
  };
  this.endAnimation = function (h, l) {
    !0 === f &&
      (stopSound("change_color"),
      playSound("special_card", 1, !1),
      (f = !1),
      c.removeAllEventListeners(),
      c.stop(),
      new createjs.Tween.get(c)
        .to({ scaleX: 2, scaleY: 2 }, 250)
        .to({ scaleX: 1.4, scaleY: 1.4 }, 250)
        .to({ scaleX: 2, scaleY: 2 }, 250)
        .to({ scaleX: 1.4, scaleY: 1.4 }, 250)
        .to({ alpha: 0, scaleX: 0.1, scaleY: 0.1 }, 200, createjs.Ease.cubicIn)
        .call(function () {
          s_oStage.removeChild(c);
          c.gotoAndStop(0);
          l();
        }));
  };
  this.shuffleAnimation = function () {
    return s_bEnableAnim
      ? new Promise(function (h, l) {
          g.alpha = 0;
          g.x = CANVAS_WIDTH / 2;
          g.y = CANVAS_HEIGHT / 2;
          g.scaleX = 0.01;
          g.scaleY = 0.01;
          s_oStage.addChild(g);
          g.stop();
          new createjs.Tween.get(g)
            .to(
              { alpha: 1, scaleX: 1.6, scaleY: 1.6 },
              400,
              createjs.Ease.cubicOut
            )
            .call(function () {
              g.gotoAndPlay("anim");
              playSound("card_dealing", 1, !0);
            })
            .wait(1700)
            .call(function () {
              g.gotoAndStop("idle");
              stopSound("change_color");
            })
            .to(
              { alpha: 0, scaleX: 0.01, scaleY: 0.01 },
              300,
              createjs.Ease.cubicIn
            )
            .call(function () {
              s_oStage.removeChild(g);
              stopSound("card_dealing");
              h();
            });
        })
      : new Promise(function (h, l) {
          h();
        });
  };
  this.init();
  s_oCAnimation = this;
}
s_oCAnimation = null;
function CMenu() {
  var a,
    d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m,
    p,
    n,
    q,
    t,
    z,
    A = null,
    C = null,
    w,
    B,
    u;
  this._init = function () {
    s_bMobile ||
      (document.querySelector("#div_display_id").style.display = "block");
    l = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(l);
    var r = s_oSpriteLibrary.getSprite("logo_" + s_iCurLang);
    n = createBitmap(r);
    n.x = CANVAS_WIDTH / 2;
    n.y = CANVAS_HEIGHT / 2;
    n.regX = r.width / 2;
    n.regY = r.height / 2;
    s_oStage.addChild(n);
    var y = CANVAS_WIDTH / 2 - 400,
      J = CANVAS_HEIGHT - 320;
    r = s_oSpriteLibrary.getSprite("local_but");
    w = new CGfxButton(y, J, r, s_oStage);
    w.addEventListener(ON_MOUSE_UP, this._onButLocalRelease, this);
    y = CANVAS_WIDTH / 2 + 400;
    J = CANVAS_HEIGHT - 320;
    r = s_oSpriteLibrary.getSprite("multiplayer_but");
    B = new CGfxButton(y, J, r, s_oStage);
    B.addEventListener(ON_MOUSE_UP, this._onButMultiplayerRelease, this);
    r = s_oSpriteLibrary.getSprite("but_info");
    g = r.width / 2 + 10;
    h = r.height / 2 + 10;
    p = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 240, r, s_oStage);
    p.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
    !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile
      ? ((r = s_oSpriteLibrary.getSprite("audio_icon")),
        (c = CANVAS_WIDTH - r.height / 2 - 10),
        (f = r.height / 2 + 10),
        (m = new CToggle(c, f, r, s_bAudioActive, s_oStage)),
        m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this),
        (a = c - LANG_WIDTH - 10),
        (d = f))
      : ((a = CANVAS_WIDTH - r.width / 4 - 10), (d = r.height / 2 + 10));
    this._checkCodethislabLink();
    r = s_oSpriteLibrary.getSprite("but_lang");
    q = new CButLang(a, d, NUM_LANGUAGES, s_iCurLang, r, s_oStage);
    q.addEventListener(ON_SELECT_LANG, this._onSelectLang, this);
    r = window.document;
    y = r.documentElement;
    A =
      y.requestFullscreen ||
      y.mozRequestFullScreen ||
      y.webkitRequestFullScreen ||
      y.msRequestFullscreen;
    C =
      r.exitFullscreen ||
      r.mozCancelFullScreen ||
      r.webkitExitFullscreen ||
      r.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (A = !1);
    A &&
      screenfull.isEnabled &&
      ((r = s_oSpriteLibrary.getSprite("but_fullscreen")),
      (b = g + r.width / 2 + 10),
      (e = h),
      (z = new CToggle(b, e, r, s_bFullscreen, s_oStage)),
      z.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
    t = new CLangPanel(s_oStage);
    t.addEventListener(ON_SELECT_LANG, this._onChangeLang, this);
    k = new createjs.Shape();
    k.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    s_oStage.addChild(k);
    createjs.Tween.get(k)
      .to({ alpha: 0 }, 1e3)
      .call(function () {
        k.visible = !1;
      });
    null !== s_oSoundtrack && setVolume("soundtrack", 1);
    this.checkPendingInvitation();
    this.refreshButtonPos();
  };
  this.unload = function () {
    q.unload();
    w.unload();
    B.unload();
    t.unload();
    k.visible = !1;
    p.unload();
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) m.unload(), (m = null);
    A && screenfull.isEnabled && z.unload();
    s_oStage.removeAllChildren();
    s_oMenu = null;
  };
  this.refreshButtonPos = function () {
    p.setPosition(g + s_iOffsetX, s_iOffsetY + h);
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      m.setPosition(c - s_iOffsetX, s_iOffsetY + f);
    A && screenfull.isEnabled && z.setPosition(b + s_iOffsetX, e + s_iOffsetY);
    q.setPosition(a - s_iOffsetX, d + s_iOffsetY);
  };
  this.checkPendingInvitation = function () {
    var r = getParameterByName(PARAM_ROOM_ID),
      y = getParameterByName(PARAM_PASSWORD);
    void 0 !== r &&
      null !== r &&
      (window.history.replaceState(
        null,
        null,
        removeParamFromURL([PARAM_ROOM_ID, PARAM_PASSWORD])
      ),
      s_oNetworkManager.addEventListener(
        ON_REMOTE_GAME_START,
        this.onRemoteGameStart,
        this
      ),
      s_oNetworkManager.addEventListener(ON_LOGIN_SUCCESS, function () {
        s_oNetworkManager.tryJoinFromInvitation(r.toString(), y.toString());
      }),
      s_oNetworkManager.connectToSystem());
  };
  this.resetFullscreenBut = function () {
    A && screenfull.isEnabled && z.setActive(s_bFullscreen);
  };
  this._onFullscreen = function () {
    s_bFullscreen
      ? C.call(window.document)
      : A.call(window.document.documentElement);
    sizeHandler();
  };
  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };
  this._onCreditsBut = function () {
    new CCreditsPanel();
  };
  this._onButLocalRelease = function () {
    "undefined" !== typeof gdsdk &&
      "undefined" !== gdsdk.showAd &&
      gdsdk.showAd();
    try {
      hideMoreGames();
    } catch (r) {}
    document.querySelector("#div_display_id").style.display = "none";
    s_bPlayWithBot = s_bMultiplayer = !1;
    s_oMenu.unload();
    document.dispatchEvent(new CustomEvent("start_session"));
    s_oMain.gotoSelectPlayers();
  };
  this._onButMultiplayerRelease = function () {
    "undefined" !== typeof gdsdk &&
      "undefined" !== gdsdk.showAd &&
      gdsdk.showAd();
    try {
      hideMoreGames();
    } catch (r) {}
    document.querySelector("#div_display_id").style.display = "none";
    document.dispatchEvent(new CustomEvent("start_session"));
    s_bMultiplayer = !0;
    s_bPlayWithBot = !1;
    s_oNetworkManager.addEventListener(
      ON_REMOTE_GAME_START,
      this.onRemoteGameStart,
      this
    );
    s_oNetworkManager.addEventListener(ON_GAME_FOUND, this.clearBotCheck, this);
    s_oNetworkManager.addEventListener(
      ON_STATUS_OFFLINE,
      this.clearBotCheck,
      this
    );
    s_oNetworkManager.addEventListener(
      ON_MATCHMAKING_CONNECTION_SUCCESS,
      this._onMatchmakingConnected,
      this
    );
    s_oNetworkManager.addEventListener(
      ON_GAMEROOM_CONNECTION_SUCCESS,
      this.clearBotCheck,
      this
    );
    s_oNetworkManager.addEventListener(
      ON_BACK_FROM_A_ROOM,
      this.clearBotCheck,
      this
    );
    s_oNetworkManager.addEventListener(
      ON_LOGIN_SUCCESS,
      s_oNetworkManager.gotoLobby,
      this
    );
    s_oNetworkManager.connectToSystem();
  };
  this.onRemoteGameStart = function (r) {
    s_oMenu.clearBotCheck();
    s_bMultiplayer = !0;
    s_bPlayWithBot = !1;
    s_oMenu.unload();
    s_oMain.gotoGameMulti(r);
  };
  this._onMatchmakingConnected = function () {
    s_oMenu._checkMatchWithBot();
  };
  this._checkMatchWithBot = function () {
    var r = randomFloatBetween(18e3, 26e3);
    u = setTimeout(function () {
      s_bPlayWithBot = s_bMultiplayer = !0;
      s_oNetworkManager.disconnect();
      var y = s_oNetworkManager.generateRandomName();
      g_oCTLMultiplayer.onPlayerFound(y);
      setTimeout(function () {
        playSound("match_found", 1, !1);
        g_oCTLMultiplayer.closeAllDialog();
        g_oCTLMultiplayer.showLoading(TEXT_MATCH_FOUND.toUpperCase());
        setTimeout(function () {
          g_oCTLMultiplayer.closeAllDialog();
          s_oMenu.unload();
          s_oMain.gotoGameWithBot();
        }, 500);
      }, 1e3);
    }, r);
  };
  this.clearBotCheck = function () {
    clearTimeout(u);
  };
  this._onSelectLang = function () {
    t.show();
  };
  this._onChangeLang = function (r) {
    s_iCurLang = r;
    q.setLang(r);
    refreshLanguage();
    r = s_oSpriteLibrary.getSprite("logo_" + s_iCurLang);
    n.image = r;
    n.regX = r.width / 2;
  };
  this._checkCodethislabLink = function () {
    CODETHISLAB_LINK = CODETHISLAB_LINK_COM;
    s_iCurLang === LANG_CODES.it && (CODETHISLAB_LINK = CODETHISLAB_LINK_IT);
  };
  s_oMenu = this;
  this._init();
}
var s_oMenu = null;
function CSelectPlayers() {
  var a,
    d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m = null,
    p = null,
    n,
    q;
  this._init = function () {
    var t = createBitmap(s_oSpriteLibrary.getSprite("bg_select_players"));
    s_oStage.addChild(t);
    t = s_oSpriteLibrary.getSprite("but_p2");
    g = new CGfxButton(
      CANVAS_WIDTH / 2 - 450,
      CANVAS_HEIGHT - 500,
      t,
      s_oStage
    );
    g.addEventListener(ON_MOUSE_UP, this._onButP2, this);
    t = s_oSpriteLibrary.getSprite("but_p3");
    h = new CGfxButton(CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT - 500, t, s_oStage);
    h.addEventListener(ON_MOUSE_UP, this._onButP3, this);
    t = s_oSpriteLibrary.getSprite("but_p4");
    l = new CGfxButton(
      CANVAS_WIDTH / 2 + 450,
      CANVAS_HEIGHT - 500,
      t,
      s_oStage
    );
    l.addEventListener(ON_MOUSE_UP, this._onButP4, this);
    new CTLText(
      s_oStage,
      CANVAS_WIDTH / 2 - 500,
      300,
      1e3,
      150,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      TEXT_SELECT_PLAYERS,
      !0,
      !0,
      !0,
      !1
    );
    t = s_oSpriteLibrary.getSprite("but_exit");
    a = CANVAS_WIDTH - t.height / 2 - 10;
    d = t.height / 2 + 10;
    q = new CGfxButton(a, d, t, s_oStage);
    q.addEventListener(ON_MOUSE_UP, this._onExit, this);
    c = CANVAS_WIDTH - t.width / 2 - 100;
    f = t.height / 2 + 10;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      (t = s_oSpriteLibrary.getSprite("audio_icon")),
        (n = new CToggle(c, f, t, s_bAudioActive, s_oStage)),
        n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    t = window.document;
    var z = t.documentElement;
    m =
      z.requestFullscreen ||
      z.mozRequestFullScreen ||
      z.webkitRequestFullScreen ||
      z.msRequestFullscreen;
    p =
      t.exitFullscreen ||
      t.mozCancelFullScreen ||
      t.webkitExitFullscreen ||
      t.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (m = !1);
    m &&
      screenfull.isEnabled &&
      ((t = s_oSpriteLibrary.getSprite("but_fullscreen")),
      (b = t.width / 4 + 10),
      (e = t.height / 2 + 10),
      (k = new CToggle(b, e, t, s_bFullscreen, s_oStage)),
      k.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
    this.refreshButtonPos();
  };
  this._onButP2 = function () {
    NUM_PLAYERS = 2;
    this.unload();
    document.dispatchEvent(
      new CustomEvent("select_players", { detail: { num: 2 } })
    );
    s_oMain.gotoGame();
  };
  this._onButP3 = function () {
    NUM_PLAYERS = 3;
    this.unload();
    document.dispatchEvent(
      new CustomEvent("select_players", { detail: { num: 3 } })
    );
    s_oMain.gotoGame();
  };
  this._onButP4 = function () {
    NUM_PLAYERS = 4;
    this.unload();
    document.dispatchEvent(
      new CustomEvent("select_players", { detail: { num: 4 } })
    );
    s_oMain.gotoGame();
  };
  this.unload = function () {
    q.unload();
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) n.unload(), (n = null);
    m && screenfull.isEnabled && k.unload();
    g.unload();
    h.unload();
    l.unload();
    s_oStage.removeAllChildren();
    s_oSelectPlayers = null;
  };
  this.refreshButtonPos = function () {
    q.setPosition(a - s_iOffsetX, s_iOffsetY + d);
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      n.setPosition(c - s_iOffsetX, s_iOffsetY + f);
    m && screenfull.isEnabled && k.setPosition(b + s_iOffsetX, e + s_iOffsetY);
  };
  this.resetFullscreenBut = function () {
    m && screenfull.isEnabled && k.setActive(s_bFullscreen);
  };
  this._onFullscreen = function () {
    s_bFullscreen
      ? p.call(window.document)
      : m.call(window.document.documentElement);
    sizeHandler();
  };
  this._onExit = function () {
    this.unload();
    s_oMain.gotoMenu();
  };
  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };
  s_oSelectPlayers = this;
  this._init();
}
var s_oSelectPlayers = null;
function CCard(a, d, b, e, c, f, g, h) {
  var l, k, m, p, n, q, t, z, A, C, w, B, u;
  this._init = function (y, J, I, Y, X, fa, oa, ta) {
    B = I;
    p = X;
    n = fa;
    m = Y;
    this.setEffect(Y);
    l = !1;
    u = oa;
    k = 0 === n || 2 === n ? "red" : "black";
    t = 0;
    ta && (t = ta);
    w = new createjs.Container();
    w.x = y;
    w.y = J;
    w.rotation = t;
    B.addChild(w);
    y = {
      images: [s_oSpriteLibrary.getSprite("cards")],
      framerate: FPS_ANIMS / 2,
      frames: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        regX: CARD_WIDTH / 2,
        regY: CARD_HEIGHT / 2,
      },
      animations: {
        card_0_0: [0],
        card_0_1: [1],
        card_0_2: [2],
        card_0_3: [3],
        card_0_4: [4],
        card_0_5: [5],
        card_0_6: [6],
        card_0_7: [7],
        card_0_8: [8],
        card_0_9: [9],
        card_0_10: [10],
        card_0_11: [11],
        card_0_12: [12],
        card_1_0: [13],
        card_1_1: [14],
        card_1_2: [15],
        card_1_3: [16],
        card_1_4: [17],
        card_1_5: [18],
        card_1_6: [19],
        card_1_7: [20],
        card_1_8: [21],
        card_1_9: [22],
        card_1_10: [23],
        card_1_11: [24],
        card_1_12: [25],
        card_2_0: [26],
        card_2_1: [27],
        card_2_2: [28],
        card_2_3: [29],
        card_2_4: [30],
        card_2_5: [31],
        card_2_6: [32],
        card_2_7: [33],
        card_2_8: [34],
        card_2_9: [35],
        card_2_10: [36],
        card_2_11: [37],
        card_2_12: [38],
        card_3_0: [39],
        card_3_1: [40],
        card_3_2: [41],
        card_3_3: [42],
        card_3_4: [43],
        card_3_5: [44],
        card_3_6: [45],
        card_3_7: [46],
        card_3_8: [47],
        card_3_9: [48],
        card_3_10: [49],
        card_3_11: [50],
        card_3_12: [51],
        color: [52],
        draw_four: [53],
        back: [54],
        tutorial: { frames: [20, 5, 47, 31], speed: 0.1 },
        draw2tutorial: { frames: [12, 25, 38, 51], speed: 0.1 },
        stopTurnTutorial: { frames: [10, 23, 36, 49], speed: 0.1 },
        changeClockWiseTutorial: { frames: [11, 24, 37, 50], speed: 0.1 },
      },
    };
    y = new createjs.SpriteSheet(y);
    C = createSprite(
      y,
      "back",
      CARD_WIDTH / 2,
      CARD_HEIGHT / 2,
      CARD_WIDTH,
      CARD_HEIGHT
    );
    C.stop();
    w.addChild(C);
    C.on("mousedown", this._mouseDown);
    z = [];
    A = [];
  };
  this.getCardSprite = function () {
    return C;
  };
  this.setEffect = function (y) {
    switch (y) {
      case 52:
        q = EFFECT_SELECT_COLOR;
        break;
      case 53:
        q = EFFECT_DRAW_THREE;
        break;
      default:
        switch (p) {
          case 10:
            q = EFFECT_STOP;
            break;
          case 11:
            q = EFFECT_INVERT_TURN;
            break;
          case 12:
            q = EFFECT_DRAW_TWO_COLORED;
            break;
          default:
            q =
              y === FOTOGRAM_COLOR
                ? EFFECT_SELECT_COLOR
                : y === FOTOGRAM_DRAW_FOUR
                ? EFFECT_DRAW_THREE
                : EFFECT_NORMAL_CARD;
        }
    }
  };
  this.setAnimTutorial = function (y) {
    C.gotoAndPlay(y);
  };
  this.unload = function () {
    C.off("mousedown", this._mouseDown);
    B.removeChild(w);
  };
  this.unloadEvent = function () {
    C.off("mousedown", this._mouseDown);
  };
  this.saveInfo = function () {
    return { szFotogram: m, iRank: p, iSuit: n, bValue: !0 };
  };
  this.instantShow = function () {
    C.gotoAndStop(m);
  };
  this.setValue = function () {
    C.gotoAndStop(m);
    s_aSounds.card.playing() || playSound("card", 1, !1);
    createjs.Tween.get(w).to({ scaleX: 1 }, 100);
  };
  this.setActive = function (y) {
    y ? w.addChild(void 0) : w.removeChild(void 0);
  };
  this.setVisible = function (y) {
    w.visible = !0 === y ? !0 : !1;
  };
  this.onSetTurned = function () {
    l = !0;
  };
  this.offSetTurned = function () {
    l = !1;
  };
  this.moveCard = function (y, J, I, Y, X) {
    var fa = this;
    createjs.Tween.get(w)
      .wait(X)
      .to({ x: y, y: J, rotation: I }, Y, createjs.Ease.sineInOut)
      .call(function () {
        null !== s_oGame && s_oGame.playedCard(fa);
      });
  };
  this.moveCardFirstHand = function (y, J, I, Y, X) {
    var fa = this;
    createjs.Tween.get(w)
      .wait(X)
      .to({ x: y, y: J, rotation: I }, Y, createjs.Ease.sineInOut)
      .call(function () {
        null !== s_oGame &&
          (playSound("card_dealing", 1, !1), s_oGame.onCardDealed(fa));
      });
  };
  this.moveFirstLastCard = function (y, J, I, Y) {
    var X = this;
    createjs.Tween.get(w)
      .wait(Y)
      .to({ x: y, y: J }, I, createjs.Ease.cubicOut)
      .call(function () {
        if (null !== s_oGame) s_oGame.onFirstLastCardDealed(X);
      });
  };
  this.setOnTop = function () {
    B.addChildAt(w, B.numChildren);
  };
  this.stackAndDeactive = function (y, J, I) {
    createjs.Tween.get(w).to({ x: y, y: J }, I, createjs.Ease.cubicOut);
  };
  this._mouseDown = function (y) {
    !1 !== l && s_oGame.playCard(r, !0);
  };
  this.showCard = function (y, J) {
    var I = this;
    createjs.Tween.get(w)
      .wait(y)
      .to({ scaleX: 0.1 }, 100)
      .call(function () {
        I.setValue(J);
      });
  };
  this.showCardNoInput = function (y, J) {
    var I = this;
    createjs.Tween.get(w)
      .wait(y)
      .to({ scaleX: 0.1 }, 100)
      .call(function () {
        I.setValue(J);
      })
      .call(function () {
        l = !1;
      });
  };
  this.hideCard = function () {
    var y = this;
    createjs.Tween.get(w)
      .to({ scaleX: 0.1 }, 100)
      .call(function () {
        y.setBack();
      });
  };
  this.jumpAnim = function () {
    var y = 1e3 * Math.random(),
      J = 1e3 * Math.random();
    createjs.Tween.get(w, { loop: !0 })
      .wait(y)
      .to({ y: d - 20 }, 200, createjs.Ease.cubicOut)
      .to({ y: d }, 200, createjs.Ease.cubicIn)
      .wait(J);
  };
  this.stopAllAnim = function () {
    w.y = d;
    createjs.Tween.removeTweens(w);
  };
  this.setPos = function (y, J) {
    w.x = y;
    w.y = J;
  };
  this.setBack = function () {
    l = !1;
    C.gotoAndStop("back");
    var y = this;
    createjs.Tween.get(w)
      .to({ scaleX: 1 }, 100)
      .call(function () {
        y.cardHidden();
      });
  };
  this.cardHidden = function () {
    z[ON_CARD_HIDE] && z[ON_CARD_HIDE].call(A[ON_CARD_HIDE], this);
  };
  this.getEffect = function () {
    return q;
  };
  this.getRank = function () {
    return p;
  };
  this.getSuit = function () {
    return n;
  };
  this.getColor = function () {
    return k;
  };
  this.getFotogram = function () {
    return m;
  };
  this.getPos = function () {
    return { x: w.x, y: w.y };
  };
  this.getSprite = function () {
    return w;
  };
  this.getLogicRect = function () {
    return new createjs.Rectangle(
      w.x - CARD_WIDTH / 2,
      w.y - CARD_HEIGHT / 2,
      CARD_WIDTH,
      CARD_HEIGHT
    );
  };
  this.getTurned = function () {
    return l;
  };
  this.getGlobalToLocal = function (y, J) {
    return C.globalToLocal(y / s_oStage.scaleX, J / s_oStage.scaleY);
  };
  this.getUniqueID = function () {
    return u;
  };
  this.getRot = function () {
    return w.rotation;
  };
  var r = this;
  this._init(a, d, b, e, c, f, g, h);
}
function CDeckDisplayer(a, d, b, e) {
  var c, f, g, h, l, k, m, p;
  this._init = function () {
    p = 0;
    l = b;
    c = [];
    f = new createjs.Container();
    f.x = a;
    f.y = d;
    f.on("mousedown", this.onDraw, this);
    l.addChild(f);
    if (e) {
      h = new createjs.Container();
      h.x = a;
      h.y = d;
      h.visible = !1;
      l.addChild(h);
      var n = s_oSpriteLibrary.getSprite("finger"),
        q = n.width / 5,
        t = n.height / 2;
      n = new createjs.SpriteSheet({
        images: [n],
        frames: { width: q, height: t, regX: q / 2, regY: t / 2 },
        animations: {
          idle: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], speed: 0.9 },
        },
      });
      k = createSprite(n, "idle", q / 2, t / 2, q, t);
      k.scaleX = 0.5;
      k.scaleY = 0.5;
      k.x = -100;
      k.y = -100;
      h.addChild(k);
    }
    g = !1;
  };
  this.initializeDeck = function () {
    for (var n, q, t = 0; 4 > t; t++)
      for (var z = 0; 10 > z; z++)
        (n = z), (q = 13 * t + n), c.push(new CCard(0, 0, f, q, n, t, p++, 0));
    for (t = 0; 4 > t; t++)
      for (z = 0; 9 > z; z++)
        (n = z + 1),
          (q = 13 * t + n),
          c.push(new CCard(0, 0, f, q, n, t, p++, 0));
    for (t = 0; 4 > t; t++)
      for (z = 0; 2 > z; z++)
        c.push(new CCard(0, 0, f, 13 * t + 10, 10, t, p++, 0)),
          c.push(new CCard(0, 0, f, 13 * t + 11, 11, t, p++, 0)),
          c.push(new CCard(0, 0, f, 13 * t + 12, 12, t, p++, 0));
    for (t = 0; 4 > t; t++)
      c.push(new CCard(0, 0, f, FOTOGRAM_COLOR, 13, 4, p++, 0)),
        c.push(new CCard(0, 0, f, FOTOGRAM_DRAW_FOUR, 14, 4, p++, 0));
  };
  this.initializeFromData = function (n) {
    for (var q, t, z = 0; z < n.length; z++) {
      switch (n[z]) {
        case FOTOGRAM_COLOR:
          q = 13;
          t = 4;
          break;
        case FOTOGRAM_DRAW_FOUR:
          q = 14;
          t = 4;
          break;
        default:
          (q = n[z] % 13), (t = Math.floor(n[z] / 13));
      }
      c.push(new CCard(0, 0, f, n[z], q, t, p++));
    }
  };
  this.shuffle = function () {
    var n;
    for (n = c.length; n; n--) {
      var q = Math.floor(Math.random() * n);
      var t = c[n - 1];
      c[n - 1] = c[q];
      c[q] = t;
    }
  };
  this.clearCards = function () {
    for (var n = 0; n < c.length; n++) c[n].unload();
    c = [];
  };
  this.moveContainer = function (n, q, t, z) {
    createjs.Tween.get(f).wait(z).to({ x: n, y: q }, t, createjs.Ease.linear);
  };
  this.takeFirstLastCard = function () {
    return c.pop();
  };
  this.takeLastCard = function () {
    return c.pop();
  };
  this.getLastCard = function () {
    return c[c.length - 1];
  };
  this.getCardByIndex = function (n) {
    return c[n];
  };
  this.removeCardByIndex = function (n) {
    return c.splice(n, 1);
  };
  this.pushCard = function (n) {
    c.push(n);
  };
  this.getContainer = function () {
    return f;
  };
  this.getLength = function () {
    return c.length;
  };
  this.onDraw = function () {
    if (!1 === g) s_oGame.onDraw();
  };
  this.disableInputUsedCards = function () {
    c[c.length - 1].offSetTurned();
  };
  this.disableInputDraw = function () {
    g = !0;
  };
  this.enableInputDraw = function () {
    g = !1;
  };
  this.getIndexChild = function () {
    return s_oStage.getChildIndex(f);
  };
  this.setChildDepth = function (n) {
    s_oStage.addChildAt(f, n);
  };
  this.getGlobalPosition = function () {
    return { x: f.x, y: f.y };
  };
  this.setOnTop = function () {
    l.addChildAt(f, l.numChildren);
  };
  this.setHelp = function () {
    l.setChildIndex(h, l.numChildren - 1);
    this.setPointer(!0);
    m = setTimeout(function () {
      h.visible = !0;
    }, 5e3);
  };
  this.hideHelp = function () {
    clearTimeout(m);
    h.visible = !1;
    this.setPointer(!1);
  };
  this.setPointer = function (n) {
    f.cursor = n ? "pointer" : "default";
  };
  this.addNewCardUnderTheDeck = function (n) {
    for (var q = 0; q < n.length; q++) c.push(n[q]);
  };
  this.removeAllCardUnderTheDeck = function () {
    for (var n = [], q = 0; q < c.length - 1; q++)
      c[q].unload(), n.push(c.shift()), q--;
    return n;
  };
  this._init();
}
function CHandDisplayer(a, d, b, e, c, f, g, h) {
  var l, k, m, p, n, q, t, z, A, C, w, B, u;
  this.init = function () {
    l = !1;
    B = g;
    w = 0;
    u = c;
    n = [];
    q = new createjs.Container();
    C = f;
    C.addChild(q);
    t = new CPlayerInfo(b, e, C, g);
    z = new CInfoLabel(b, e, C);
    z.setVisible(!1);
    var r = {
      images: [s_oSpriteLibrary.getSprite("cloud_uno")],
      frames: { width: 261, height: 194, regX: 130.5, regY: 97 },
      animations: { cloud1: [0], cloud2: [1] },
    };
    r = new createjs.SpriteSheet(r);
    A = new createjs.Sprite(r, "cloud1");
    A.alpha = 0;
    A.scaleX = 0.1;
    A.scaleY = 0.1;
    this.setPosition(a, d, b, e, h);
  };
  this.setPosition = function (r, y, J, I, Y) {
    k = r;
    m = y;
    q.x = J;
    q.y = I;
    p = Y;
    z.setPosition(q.x, q.y, p);
    switch (p) {
      case BOTTOM:
        var X = q.x;
        var fa = q.y - 140;
        break;
      case TOP:
        k = -r;
        X = q.x;
        fa = q.y + 140;
        break;
      case LEFT:
        X = q.x + 140;
        fa = q.y;
        z.setPosition(q.x + 20, q.y, p);
        break;
      case RIGHT:
        (m = -y), (X = q.x - 140), (fa = q.y), z.setPosition(q.x - 20, q.y, p);
    }
    t.setPosition(X, fa, p);
  };
  this.clearCards = function () {
    for (var r = 0; r < n.length; r++) n[r].unload();
    n = [];
  };
  this.getGlobalPosition = function () {
    for (var r = 0, y = 0, J = 0; J < n.length; J++)
      0 !== k ? (r += CARD_WIDTH / 2) : (y += CARD_HEIGHT / 2);
    return { x: q.x + r, y: q.y + y };
  };
  this.getContainerPos = function () {
    return { x: q.x, y: q.y };
  };
  this.getCardPositionByIndex = function (r) {
    r = n[r].getPos();
    return { x: r.x, y: r.y };
  };
  this.searchIndexCard = function (r) {
    for (var y = 0; y < n.length; y++) if (r === n[y]) return y;
  };
  this.removeCardByIndex = function (r) {
    return n.splice(r, 1);
  };
  this.getPosNewCard = function () {
    var r = this.getDynamicOffset(k),
      y = this.getDynamicOffset(m);
    return { x: n.length * r, y: n.length * y };
  };
  this.pushCard = function (r) {
    n.push(r);
    if (0 === m && q.y > CANVAS_HEIGHT / 2)
      n[n.length - 1].getCardSprite().on("mouseover", this.onMouseOver);
  };
  this.getContainer = function () {
    return q;
  };
  this.getLastCard = function () {
    return n[n.length - 1];
  };
  this.getLength = function () {
    return n.length;
  };
  this.centerContainer = function () {
    var r = q.getBounds();
    var y = -(r.width / 2) + CARD_WIDTH / 2;
    p === TOP && (y = r.width / 2 - CARD_WIDTH / 2);
    var J = -(r.height / 2) + CARD_WIDTH / 2;
    p === RIGHT && (J = r.height / 2 - CARD_WIDTH / 2);
    0 !== k
      ? createjs.Tween.get(q).to(
          { x: CANVAS_WIDTH / 2 + y },
          300,
          createjs.Ease.linear
        )
      : createjs.Tween.get(q).to(
          { y: CANVAS_HEIGHT / 2 + J - 40 },
          300,
          createjs.Ease.linear
        );
  };
  this.setOnTop = function () {
    C.addChildAt(q, C.numChildren);
  };
  this.setChildDepth = function (r) {
    r > q.s_oStage.numChild - 1 && (r = q.s_oStage.numChild - 1);
    s_oStage.addChildAt(r);
  };
  this.getContainerInfo = function () {
    return q.getBounds();
  };
  this.getCardByIndex = function (r) {
    return n[r];
  };
  this.organizeHand = function () {
    var r = this;
    if (0 !== k)
      for (var y = 0; y < n.length; y++) {
        var J = this.getDynamicOffset(k);
        J *= y;
        createjs.Tween.get(n[y].getSprite())
          .to({ x: J }, 300, createjs.Ease.linear)
          .call(r.centerContainer);
      }
    else
      for (y = 0; y < n.length; y++)
        (J = this.getDynamicOffset(m)),
          (J *= y),
          createjs.Tween.get(n[y].getSprite())
            .to({ y: J }, 300, createjs.Ease.linear)
            .call(function () {
              r.centerContainer();
            });
  };
  this.getDynamicOffset = function (r) {
    var y = r;
    6 < n.length && (y = linearFunction(n.length, 7, 20, r, 0.55 * r));
    return y;
  };
  this.setOnTurn = function () {
    t.highlight();
  };
  this.setOffTurn = function () {
    t.disable();
  };
  this.checkUno = function () {
    1 === n.length &&
      (this.setOnTop(),
      0 !== k
        ? q.y < CANVAS_HEIGHT / 2
          ? (A.gotoAndStop("cloud2"),
            (A.x = CANVAS_WIDTH / 2 - 270),
            (A.y = CANVAS_HEIGHT / 2 - 300))
          : (A.gotoAndStop("cloud1"),
            (A.x = CANVAS_WIDTH / 2 + 300),
            (A.y = CANVAS_HEIGHT / 2 + 100))
        : q.x < CANVAS_WIDTH / 2
        ? (A.gotoAndStop("cloud1"),
          (A.x = CANVAS_WIDTH / 2 - 350),
          (A.y = CANVAS_HEIGHT / 2 - 30))
        : (A.gotoAndStop("cloud2"),
          (A.x = CANVAS_WIDTH / 2 + 350),
          (A.y = CANVAS_HEIGHT / 2 - 200)),
      s_oStage.addChild(A),
      new createjs.Tween.get(A)
        .to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300, createjs.Ease.bounceOut)
        .wait(1500)
        .to({ scaleX: 0.1, scaleY: 0.1 }, 300, createjs.Ease.cubicIn)
        .to({ alpha: 0 }, 20)
        .call(function () {
          s_oStage.removeChild(A);
        }));
  };
  this.onMouseOver = function (r) {
    s_bMobile || (r.target.cursor = "pointer");
  };
  this.showAllCards = function () {
    for (var r = 0; r < n.length; r++) n[r].showCard();
  };
  this.changeName = function (r) {
    B = r;
    t.setName(r);
  };
  this.refreshScore = function () {
    t.setScore(w);
    z.setVisible(!1);
  };
  this.getCardByUniqueID = function (r) {
    for (var y = 0; y < n.length; y++)
      if (n[y].getUniqueID() === r) return n[y];
  };
  this.getPlayerID = function () {
    return u;
  };
  this.getName = function () {
    return B;
  };
  this.getSide = function () {
    return p;
  };
  this.getScore = function () {
    return w;
  };
  this.setScore = function (r) {
    w = r;
  };
  this.showHandScore = function (r) {
    z.setVisible(!0);
    z.setTextScore(r);
    z.setOnTop();
  };
  this.hideMsgBox = function () {
    z.setVisible(!1);
    z.setTextScore("");
  };
  this.calculateHandScore = function () {
    for (var r = 0, y = 0; y < n.length; y++) {
      var J = n[y].getRank();
      r += CARD_SCORE[J];
    }
    return r;
  };
  this.getAllCards = function () {
    return n;
  };
  this.stopAllAnim = function () {
    for (var r = 0; r < n.length; r++) n[r].stopAllAnim();
  };
  this.dispose = function (r, y) {
    var J = this;
    l = !0;
    for (var I = n.length, Y = 0; Y < n.length; Y++)
      n[Y].dispose(r, y, 0, 400, 0).then(function () {
        I--;
        0 === I && J.clearCards();
      });
    this.showHandScore(TEXT_PLAYER_QUIT);
    z.stopAnim();
  };
  this.isDisposed = function () {
    return l;
  };
  this.init();
}
function CGameBase(a) {
  this._iCounterDraw;
  this._oInterface;
  this._iGameState;
  this._oParent;
  this._oDeck;
  this._aPlayersHand;
  this._oUsedCards;
  this._oTurnManager;
  this._iCurrentColor;
  this._bUNO;
  this._bEndGame;
  this._oAnimation;
  this._iCurPlayer;
  this._iNextPlayer;
  this._oFinger;
  this._oFade;
  this._oDecksContainer;
  this._oHandsContainer;
  this._oCardsContainer;
  this._oTopContainer;
  this._oAIManager;
  this._oUnoController;
  this._oSummaryPanel;
  this._oContainerSelectColor;
  this._init();
}
CGameBase.prototype._init = function () {
  try {
    hideMoreGames();
  } catch (c) {}
  document.querySelector("#div_display_id").style.display = "none";
  this._bEndGame = this._bUNO = !1;
  this._iCounterDraw = 0;
  this._oTurnManager = new CTurnManager();
  this._oAnimation = new CAnimation();
  var a = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
  s_oStage.addChild(a);
  this._oUnoController = new CUnoController();
  this._oInterface = new CInterface();
  this._oCardsContainer = new createjs.Container();
  this._oHandsContainer = new createjs.Container();
  this._oPanelContainer = new createjs.Container();
  this._oDecksContainer = new createjs.Container();
  this._oTopContainer = new createjs.Container();
  a = [];
  a[0] = TEXT_PLAYER_1;
  a[1] = TEXT_PLAYER_2;
  a[2] = TEXT_PLAYER_3;
  a[3] = TEXT_PLAYER_4;
  this._aPlayersHand = [];
  for (var d = 0; d < NUM_PLAYERS; d++) {
    var b = 0,
      e = 0;
    HAND_POS["num_player_" + NUM_PLAYERS][d].x === CANVAS_WIDTH / 2
      ? (b = CARD_WIDTH / 2)
      : (e = CARD_HEIGHT / 4);
    this._aPlayersHand[d] = new CHandDisplayer(
      b,
      e,
      HAND_POS["num_player_" + NUM_PLAYERS][d].x,
      HAND_POS["num_player_" + NUM_PLAYERS][d].y,
      d,
      this._oHandsContainer,
      a[d],
      HAND_POS["num_player_" + NUM_PLAYERS][d].side
    );
  }
  this._oCardsContainer.addChild(this._oDecksContainer);
  this._oCardsContainer.addChild(this._oHandsContainer);
  s_oStage.addChild(this._oCardsContainer);
  s_oStage.addChild(this._oPanelContainer);
  this._oSummaryPanel = new CSummaryPanel(this._oPanelContainer);
  this._oSummaryPanel.addEventListener(ON_CHECK, this._onCheck, this);
  s_oStage.addChild(this._oTopContainer);
  this._oMsgBox = new CMsgBox(this._oPanelContainer);
  this._oDeck = new CDeckDisplayer(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    this._oDecksContainer,
    !0
  );
  this._oUsedCards = new CDeckDisplayer(
    CANVAS_WIDTH / 2 + CARD_WIDTH,
    CANVAS_HEIGHT / 2,
    this._oDecksContainer,
    !1
  );
  this._oUsedCards.disableInputDraw();
  this.setOffTurn();
  this._oContainerSelectColor = new createjs.Container();
  s_oStage.addChild(this._oContainerSelectColor);
  this._oAIManager = new CAIManager();
  this.changeState(GAME_STATE_DEALING);
  setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
};
CGameBase.prototype.reset = function () {
  this.changeState(GAME_STATE_DEALING);
  this._iCounterDraw = 0;
  this._oTurnManager.setFirstPlayerToBegin();
  this._oTurnManager.resetClockWise();
  this._oDeck.clearCards();
  this._oUsedCards.clearCards();
  this._oUsedCards.disableInputDraw();
  for (var a = 0; a < this._aPlayersHand.length; a++)
    this._aPlayersHand[a].clearCards(), this._aPlayersHand[a].refreshScore();
  this._oSummaryPanel.reset();
  this.setOffTurn();
};
CGameBase.prototype.getFirstHand = function () {
  var a = this._oDeck.takeLastCard(),
    d = this._oTurnManager.getTurn(),
    b = this._aPlayersHand[d].getContainerPos(),
    e = this._aPlayersHand[d].getPosNewCard(),
    c = this._oDeck.getGlobalPosition();
  a.setOnTop();
  this._oCardsContainer.addChildAt(
    this._oDecksContainer,
    this._oCardsContainer.numChildren
  );
  this._oDeck.setOnTop();
  d = this._getCardRotation(d);
  a.moveCardFirstHand(b.x + e.x - c.x, b.y + e.y - c.y, d, 250);
};
CGameBase.prototype.onCardDealed = function (a) {
  var d = this._oTurnManager.getTurn(),
    b = this._getCardRotation(d);
  this._aPlayersHand[d].pushCard(
    new CCard(
      this._aPlayersHand[d].getPosNewCard().x,
      this._aPlayersHand[d].getPosNewCard().y,
      this._aPlayersHand[d].getContainer(),
      a.getFotogram(),
      a.getRank(),
      a.getSuit(),
      a.getUniqueID(),
      b
    )
  );
  a.unload();
  a = this._aPlayersHand[d].getLastCard();
  this._aPlayersHand[d].centerContainer();
  this.canCardBeShown(d) && a.showCard();
  this._oTurnManager.nextTurn();
  this.matchCanStart()
    ? (this._oCardsContainer.addChildAt(
        this._oDecksContainer,
        this._oCardsContainer
      ),
      this._oDeck.setOnTop(),
      (a = this._oDeck.takeFirstLastCard()),
      a.moveFirstLastCard(CARD_WIDTH, 0, 600))
    : this.getFirstHand();
};
CGameBase.prototype.onFirstLastCardDealed = function (a) {
  this._oUsedCards.pushCard(
    new CCard(
      0,
      0,
      this._oUsedCards.getContainer(),
      a.getFotogram(),
      a.getRank(),
      a.getSuit(),
      a.getUniqueID(),
      0
    )
  );
  a.unload();
  this._oUsedCards.getLastCard().showCardNoInput();
  this._oDeck.moveContainer(
    CANVAS_WIDTH / 2 - CARD_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    400
  );
  this._oUsedCards.moveContainer(
    CANVAS_WIDTH / 2 + CARD_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    400
  );
  this._iCurrentColor = this._oUsedCards.getLastCard().getSuit();
  this._oInterface.refreshColor(this._iCurrentColor);
  this._iCurPlayer = this._oTurnManager.getTurn();
  this._iNextPlayer = this._oTurnManager.getNextPlayer();
  this._aPlayersHand[this._iCurPlayer].setOnTurn();
  this._oUsedCards.disableInputUsedCards();
  this._onFirstTurnStart();
};
CGameBase.prototype._onFirstTurnStart = function () {
  this._oTurnManager.prevTurn();
  this._iCurPlayer = this._oTurnManager.getTurn();
  this._iNextPlayer = this._oTurnManager.getNextPlayer();
  this.setOffTurn();
  this.changeState(GAME_STATE_TURN_START);
  var a = this._oUsedCards.getLastCard();
  this._checkFirstCardEffect(a.getEffect());
};
CGameBase.prototype.cpuPlayCard = function (a) {
  var d = this._iCurPlayer,
    b = this._aPlayersHand[d].getContainerPos(),
    e = this._oUsedCards.getGlobalPosition();
  this._oCardsContainer.addChildAt(
    this._oHandsContainer,
    this._oCardsContainer.numChildren
  );
  this._aPlayersHand[d].setOnTop();
  a.moveCard(e.x - b.x, e.y - b.y, 0, 400, 1e3);
  this._oDeck.setChildDepth(2);
  this._oUsedCards.setChildDepth(2);
  a.showCard(1e3);
};
CGameBase.prototype.checkUno = function (a) {
  var d = this._oTurnManager.getTurn();
  1 === this._aPlayersHand[d].getLength() && (this._bUNO = !0);
  this._oUnoController.check(a);
};
CGameBase.prototype.setUNO = function (a) {
  this._bUNO = a;
};
CGameBase.prototype.applyPenality = function () {
  this._bUNO = !1;
  this.drawCards(this._iCurPlayer, NUM_PENALTY_CARDS, 0, DRAW_TYPE_PENALITY);
};
CGameBase.prototype._checkEffect = function (a) {
  switch (a) {
    case EFFECT_SELECT_COLOR:
      this._applySelectColor();
      break;
    case EFFECT_DRAW_THREE:
      this._applyDraw3Effect();
      break;
    case EFFECT_STOP:
      this._applyStopTurn();
      break;
    case EFFECT_INVERT_TURN:
      this._applyInvertTurn();
      break;
    case EFFECT_DRAW_TWO_COLORED:
      this._applyDrawTwoColored();
      break;
    default:
      this._applyNormalCardEffect();
  }
};
CGameBase.prototype._checkNumberCardsToDraw = function (a, d, b, e) {
  this._iCounterDraw = d;
  switch (e) {
    case DRAW_TYPE_PENALITY:
      this.drawCardsTween(a, d, b, e);
      break;
    case DRAW_TYPE_DRAW2_COLORED:
      s_oCAnimation.drawTwoAnim(a, d, b, e);
      break;
    case DRAW_TYPE_DRAW3:
      s_oCAnimation.draw3Anim(a, d, b, e);
      break;
    default:
      this.drawCardsTween(a, d, b, e);
  }
};
CGameBase.prototype.drawCardsTween = function (a, d, b, e) {
  this._oCardsContainer.addChildAt(
    this._oDecksContainer,
    this._oCardsContainer.numChildren
  );
  this._oDeck.setOnTop();
  this._aPlayersHand[a].organizeHand();
  var c = this._aPlayersHand[a].getContainerPos(),
    f = this._aPlayersHand[a].getPosNewCard(),
    g = this._oDeck.getGlobalPosition(),
    h = this,
    l = this._oDeck.takeLastCard();
  l.setOnTop();
  var k = c.x + f.x - g.x;
  c = c.y + f.y - g.y;
  var m = this._getCardRotation(a);
  createjs.Tween.get(l.getSprite())
    .wait(b)
    .to({ x: k, y: c, rotation: m }, 400, createjs.Ease.cubicOut)
    .call(function () {
      h._aPlayersHand[a].pushCard(
        new CCard(
          h._aPlayersHand[a].getPosNewCard().x,
          h._aPlayersHand[a].getPosNewCard().y,
          h._aPlayersHand[a].getContainer(),
          l.getFotogram(),
          l.getRank(),
          l.getSuit(),
          l.getUniqueID(),
          m
        )
      );
      l.unload();
      var p = h._aPlayersHand[a].getLastCard();
      h.canCardBeShown(a)
        ? p.showCard()
        : s_aSounds.card.playing() || playSound("card", 1, !1);
      h._aPlayersHand[a].centerContainer();
      h.checkForMoreDraws(a, d, b, e);
    });
};
CGameBase.prototype.checkForMoreDraws = function (a, d, b, e) {
  0 === this._oDeck.getLength()
    ? this.shuffleCards(a, d, b, e)
    : (this._iCounterDraw--,
      0 < this._iCounterDraw
        ? this.drawCardsTween(a, d, b, e)
        : this._onAllCardsDrawCompleted(a, e));
};
CGameBase.prototype._checkEffectAfterDrawCompleted = function (a, d) {
  switch (d) {
    case DRAW_TYPE_PENALITY:
      this.applyEffectOnCard(this._oUsedCards.getLastCard().getEffect());
      break;
    case DRAW_TYPE_DRAW2_COLORED:
      this._oTurnManager.nextTurn();
      this._notifyChangeTurn();
      break;
    case DRAW_TYPE_DRAW3:
      this._oTurnManager.nextTurn();
      this._notifyChangeTurn();
      break;
    default:
      this._checkIfCanStillPlayTheTurn(a);
  }
};
CGameBase.prototype.onInputPlayer = function (a) {
  for (var d = 0; d < this._aPlayersHand[a].getLength(); d++)
    this._aPlayersHand[a].getCardByIndex(d).onSetTurned();
};
CGameBase.prototype.offInputPlayer = function (a) {
  for (var d = 0; d < this._aPlayersHand[a].getLength(); d++)
    this._aPlayersHand[a].getCardByIndex(d).offSetTurned();
};
CGameBase.prototype.setOffTurn = function () {
  for (var a = 0; a < NUM_PLAYERS; a++)
    this._aPlayersHand[a].setOffTurn(a), this.offInputPlayer(a);
};
CGameBase.prototype.prevTurn = function () {
  this._oTurnManager.prevTurn();
};
CGameBase.prototype.getPlayerTurn = function () {
  return this._iCurPlayer;
};
CGameBase.prototype.getbUNO = function () {
  return this._bUNO;
};
CGameBase.prototype.isAnyCardPlayableExceptDrawFour = function (a) {
  for (var d = !1, b = 0; b < this._aPlayersHand[a].getLength(); b++) {
    var e = this._aPlayersHand[a].getCardByIndex(b);
    if (
      e.getFotogram() !== FOTOGRAM_DRAW_FOUR &&
      (e.getRank() === this._oUsedCards.getLastCard().getRank() ||
        e.getSuit() === this._iCurrentColor ||
        e.getFotogram() === FOTOGRAM_COLOR)
    ) {
      d = !0;
      break;
    }
  }
  return d;
};
CGameBase.prototype.cardMatchTheWaste = function (a, d) {
  var b = !1,
    e = a.getRank() === this._oUsedCards.getLastCard().getRank(),
    c = a.getSuit() === this._iCurrentColor,
    f = a.getFotogram() === FOTOGRAM_COLOR,
    g = a.getFotogram() === FOTOGRAM_DRAW_FOUR,
    h = !this.isAnyCardPlayableExceptDrawFour(d);
  if (e || c || f || (g && h)) b = !0;
  return b;
};
CGameBase.prototype.playerCanPlay = function (a) {
  for (var d = !1, b = 0; b < this._aPlayersHand[a].getLength(); b++) {
    var e = this._aPlayersHand[a].getCardByIndex(b);
    if (this.cardMatchTheWaste(e, a)) {
      d = !0;
      break;
    }
  }
  return d;
};
CGameBase.prototype._getCardRotation = function (a) {
  var d = 0;
  switch (this._aPlayersHand[a].getSide()) {
    case BOTTOM:
      d = 0;
      break;
    case LEFT:
      d = 90;
      break;
    case TOP:
      d = 180;
      break;
    case RIGHT:
      d = -90;
  }
  return d;
};
CGameBase.prototype.shuffle = function (a) {
  var d;
  for (d = a.length; d; d--) {
    var b = Math.floor(Math.random() * d);
    var e = a[d - 1];
    a[d - 1] = a[b];
    a[b] = e;
  }
};
CGameBase.prototype.unload = function () {
  this._oUnoController.unload();
  this._oInterface.unload();
  this._oSummaryPanel.unload();
  this._oMsgBox.unload();
  createjs.Tween.removeAllTweens();
  s_oStage.removeAllChildren();
  s_oGame = null;
};
CGameBase.prototype.gameOver = function (a) {
  this.changeState(GAME_STATE_END);
  this.setOffTurn();
  this._showAllPlayersCards();
  this._showAllPlayersMatchScore();
  var d = this._calculateMatchScore(),
    b = this._aPlayersHand[a].getScore() + d;
  this._aPlayersHand[a].setOnTurn();
  this._aPlayersHand[a].setScore(b);
  var e = this._getPlayersRank();
  this._oSummaryPanel.setAndShow(e, a, d);
  b >= GAME_SCORE_WIN &&
    ((this._bEndGame = !0),
    this._oSummaryPanel.endMode(
      sprintf(TEXT_PLAYER_WON, this._aPlayersHand[a].getName())
    ),
    document.dispatchEvent(
      new CustomEvent("share_event", { detail: { winner: b } })
    ));
};
CGameBase.prototype.checkWinner = function () {
  for (var a = null, d = 0; d < this._aPlayersHand.length; d++)
    if (0 === this._aPlayersHand[d].getLength()) {
      a = d;
      break;
    }
  return a;
};
CGameBase.prototype._calculateMatchScore = function () {
  for (var a = 0, d = 0; d < this._aPlayersHand.length; d++)
    a += this._aPlayersHand[d].calculateHandScore();
  return a;
};
CGameBase.prototype._showAllPlayersCards = function () {
  for (var a = 0; a < this._aPlayersHand.length; a++)
    this._aPlayersHand[a].getSide() !== BOTTOM &&
      this._aPlayersHand[a].showAllCards();
};
CGameBase.prototype._showAllPlayersMatchScore = function () {
  for (var a = 0; a < this._aPlayersHand.length; a++) {
    var d = this._aPlayersHand[a].calculateHandScore();
    0 < this._aPlayersHand[a].getLength()
      ? this._aPlayersHand[a].showHandScore(sprintf(TEXT_PTS_TO_WINNER, d))
      : this._aPlayersHand[a].showHandScore(TEXT_WINNER);
  }
};
CGameBase.prototype._getPlayersRank = function () {
  for (var a = [], d = 0; d < this._aPlayersHand.length; d++) {
    var b = this._aPlayersHand[d].getName(),
      e = this._aPlayersHand[d].getScore();
    a.push({ name: b, score: e, index: d });
  }
  a.sort(function (c, f) {
    return c.score > f.score ? -1 : 1;
  });
  return a;
};
CGameBase.prototype.matchCanStart = function () {
  for (var a = !1, d = 0, b = 0; b < this._aPlayersHand.length; b++)
    this._aPlayersHand[b].getLength() === STARTING_NUM_CARDS && d++;
  d === NUM_PLAYERS && (a = !0);
  return a;
};
CGameBase.prototype._checkUnoNotify = function (a, d, b) {
  a &&
    (b === d
      ? ((a = sprintf(TEXT_ALERT_1, NUM_PENALTY_CARDS)),
        this._oUnoController.unoAnimation())
      : ((a = this._aPlayersHand[b].getName().toUpperCase()),
        (a = sprintf(TEXT_ALERT_2, a, NUM_PENALTY_CARDS))),
    this._oUnoController.showAlertMsg(a));
};
CGameBase.prototype.canCardBeShown = function (a) {
  return this._aPlayersHand[a].getSide() === BOTTOM || DEBUG_SHOW_CARDS;
};
CGameBase.prototype.getPlayersHand = function (a) {
  return this._aPlayersHand[a];
};
CGameBase.prototype.getRandomPlayableCard = function (a) {
  for (
    var d = this._aPlayersHand[a].getAllCards(), b = [], e = 0;
    e < d.length;
    e++
  ) {
    var c = d[e];
    this.cardMatchTheWaste(c, a) && b.push(c);
  }
  return b[Math.floor(Math.random() * b.length)];
};
CGameBase.prototype.getCurColor = function (a) {
  return this._iCurrentColor;
};
CGameBase.prototype.getLastCard = function (a) {
  return this._oUsedCards.getLastCard();
};
CGameBase.prototype.getGameState = function () {
  return this._iGameState;
};
CGameBase.prototype.changeState = function (a) {
  this._iGameState !== a && (this._iGameState = a);
};
CGameBase.prototype.update = function () {};
CGameBase.prototype._onCheck = function () {
  this._oSummaryPanel.hide();
};
function CGameSingle(a) {
  CGameBase.call(this, a);
  !0 !== s_bFirstGame || s_bPlayWithBot
    ? this._startGame()
    : new CPanelTutorial();
}
CGameSingle.prototype = Object.create(CGameBase.prototype);
CGameSingle.prototype._startGame = function () {
  s_bFirstGame = !1;
  this._oUnoController.setVisible(!0);
  this._oUnoController.addEventListener(
    ON_APPLY_EFFECT,
    this.applyEffectOnCard,
    this
  );
  this._oUnoController.addEventListener(
    ON_APPLY_PENALITY,
    this.applyPenality,
    this
  );
  this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
  this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
  this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
  this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
  this._setPieces();
  this.refreshButtonPos();
};
CGameSingle.prototype.refreshButtonPos = function () {
  this._oInterface.refreshButtonPos();
};
CGameSingle.prototype._setPieces = function () {
  this._oDeck.initializeDeck();
  this._oDeck.shuffle();
  this.getFirstHand();
};
CGameSingle.prototype.setNewGame = function () {
  for (var a = 0; a < this._aPlayersHand.length; a++)
    this._aPlayersHand[a].setScore(0);
  this._oTurnManager.resetFirstPlayer();
};
CGameSingle.prototype.restart = function () {
  this.reset();
  this._setPieces();
};
CGameSingle.prototype._checkFirstCardEffect = function (a) {
  switch (a) {
    case EFFECT_SELECT_COLOR:
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._applySelectColor();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_DRAW_THREE:
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._iNextPlayer = this._iCurPlayer = this._oTurnManager.getTurn();
      this._applyDraw3Effect();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_STOP:
      this._applyStopTurn();
      break;
    case EFFECT_INVERT_TURN:
      2 !== NUM_PLAYERS && this._oTurnManager.nextTurn();
      this._applyInvertTurn();
      break;
    case EFFECT_DRAW_TWO_COLORED:
      this._applyDrawTwoColored();
      break;
    default:
      this._oTurnManager.nextTurn(),
        (this._iCurPlayer = this._oTurnManager.getTurn()),
        (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
        0 === this._iCurPlayer
          ? (this.onInputPlayer(this._iCurPlayer),
            this.playerCanPlay(this._iCurPlayer) || this._oDeck.setHelp(),
            this._oDeck.enableInputDraw())
          : this._oAIManager.selectACard(this._iCurPlayer),
        this._aPlayersHand[this._iCurPlayer].setOnTurn();
  }
};
CGameSingle.prototype.onDraw = function () {
  var a = this._oTurnManager.getTurn(),
    d = !0;
  if (0 !== this._oUsedCards.getLength() && 0 === this._iCurPlayer) {
    for (var b = 0; b < this._aPlayersHand[0].getLength(); b++) {
      var e = this._aPlayersHand[0].getCardByIndex(b);
      this.cardMatchTheWaste(e, a) && (d = !1);
    }
    !0 === d &&
      (this._oDeck.disableInputDraw(),
      this._oDeck.hideHelp(),
      this.changeState(GAME_STATE_DRAW),
      this.drawCards(0, 1, 0, DRAW_TYPE_NORMAL));
  }
};
CGameSingle.prototype.onNextTurn = function () {
  this._bUNO = !1;
  var a = this.checkWinner();
  if (null !== a)
    this.gameOver(a),
      0 === a &&
        document.dispatchEvent(
          new CustomEvent("save_score", {
            detail: { score: this._calculateMatchScore() },
          })
        );
  else if (
    (this.changeState(GAME_STATE_TURN_START),
    this.setOffTurn(),
    this._oDeck.enableInputDraw(),
    this._oTurnManager.nextTurn(),
    (this._iCurPlayer = a = this._oTurnManager.getTurn()),
    (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
    this._aPlayersHand[a].setOnTurn(),
    0 === a)
  ) {
    if ((this.onInputPlayer(a), !this.playerCanPlay(a))) this.onDraw(!1);
  } else this._oAIManager.selectACard(a);
};
CGameSingle.prototype.playCard = function (a, d) {
  var b = this._oTurnManager.getTurn(),
    e = !1;
  0 === b && (e = this.cardMatchTheWaste(a, b));
  e &&
    (this._oCardsContainer.addChildAt(
      this._oHandsContainer,
      this._oCardsContainer.numChildren
    ),
    this._aPlayersHand[b].setOnTop(),
    this._oDeck.disableInputDraw(),
    this.offInputPlayer(0),
    (b = this._aPlayersHand[b].getContainerPos()),
    (e = this._oUsedCards.getGlobalPosition()),
    s_aSounds.card.playing() || playSound("card", 1, !1),
    a.moveCard(e.x - b.x, e.y - b.y, 0, 300),
    a.showCard(),
    this._oUsedCards.setChildDepth(2));
};
CGameSingle.prototype.playedCard = function (a) {
  var d = this._oTurnManager.getTurn(),
    b = this._aPlayersHand[d].searchIndexCard(a);
  this._oUsedCards.pushCard(
    new CCard(
      0,
      0,
      this._oUsedCards.getContainer(),
      a.getFotogram(),
      a.getRank(),
      a.getSuit(),
      a.getUniqueID(),
      0
    )
  );
  this._oUsedCards.disableInputUsedCards();
  this._oUsedCards.getLastCard().instantShow();
  this._aPlayersHand[d].removeCardByIndex(b);
  a.unload();
  4 !== this._oUsedCards.getLastCard().getSuit() &&
    ((this._iCurrentColor = this._oUsedCards.getLastCard().getSuit()),
    this._oInterface.refreshColor(this._iCurrentColor));
  this._aPlayersHand[d].organizeHand(b);
  this.checkUno(a.getEffect());
  0 !== d && this._onUnoClick();
};
CGameSingle.prototype._onUnoClick = function () {
  !0 === this._bUNO &&
    ((this._bUNO = !1), this._aPlayersHand[this._iCurPlayer].checkUno());
};
CGameSingle.prototype.applyEffectOnCard = function (a) {
  this._checkEffect(a);
};
CGameSingle.prototype._applySelectColor = function () {
  if (0 === this._iCurPlayer)
    this.changeState(GAME_STATE_CHOOSE_COLOR),
      new CSelectColorPanel(
        EFFECT_SELECT_COLOR,
        this._oContainerSelectColor
      ).addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          this._onActionSelectColor({ colorindex: d });
        },
        this
      );
  else {
    var a = { colorindex: this._oAIManager.onSelectColorCpu(this._iCurPlayer) };
    this._onActionSelectColor(a);
  }
};
CGameSingle.prototype._applyDraw3Effect = function () {
  if (0 === this._iCurPlayer)
    this.changeState(GAME_STATE_CHOOSE_COLOR),
      new CSelectColorPanel(
        EFFECT_DRAW_THREE,
        this._oContainerSelectColor
      ).addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          this._onActionDraw3({
            playerindex: this._iNextPlayer,
            colorindex: d,
          });
        },
        this
      );
  else {
    var a = this._oAIManager.onSelectColorCpu(this._iCurPlayer);
    this._onActionDraw3({ playerindex: this._iNextPlayer, colorindex: a });
  }
};
CGameSingle.prototype._applyStopTurn = function () {
  var a = this;
  this._oAnimation.stopTurn().then(function () {
    a._oTurnManager.nextTurn();
    a._notifyChangeTurn();
  });
};
CGameSingle.prototype._applyInvertTurn = function () {
  var a = this;
  this._oTurnManager.changeClockWise();
  2 === NUM_PLAYERS && this._oTurnManager.nextTurn();
  this._oAnimation
    .changeClockWise(s_oGame._oTurnManager.getClockWise())
    .then(function () {
      a._notifyChangeTurn();
    });
};
CGameSingle.prototype._applyDrawTwoColored = function () {
  this.drawCards(this._iNextPlayer, 2, 0, DRAW_TYPE_DRAW2_COLORED);
};
CGameSingle.prototype._applyNormalCardEffect = function () {
  this._notifyChangeTurn();
};
CGameSingle.prototype.drawCards = function (a, d, b, e) {
  this._checkUnoNotify(e === DRAW_TYPE_PENALITY ? !0 : !1, 0, a);
  this._checkNumberCardsToDraw(a, d, b, e);
};
CGameSingle.prototype._notifyChangeTurn = function () {
  s_oGame.onNextTurn();
};
CGameSingle.prototype.shuffleCards = function (a, d, b, e) {
  for (
    var c = this,
      f = this._oUsedCards.removeAllCardUnderTheDeck(),
      g = [],
      h = 0;
    h < f.length;
    h++
  )
    g.push(f[h].getFotogram());
  this._oAnimation.shuffleAnimation().then(function () {
    shuffle(g);
    c._oDeck.clearCards();
    c._oDeck.initializeFromData(g);
    c.checkForMoreDraws(a, d, b, e);
  });
};
CGameSingle.prototype._onAllCardsDrawCompleted = function (a, d) {
  this._checkEffectAfterDrawCompleted(a, d);
};
CGameSingle.prototype._checkIfCanStillPlayTheTurn = function (a) {
  this.playerCanPlay(a)
    ? (this.onInputPlayer(a),
      0 !== this._iCurPlayer && this._oAIManager.selectACard(this._iCurPlayer))
    : (this._aPlayersHand[a].centerContainer(), this._notifyChangeTurn());
};
CGameSingle.prototype._onActionDraw3 = function (a) {
  this._iCurrentColor = a.colorindex;
  this._oInterface.refreshColor(this._iCurrentColor);
  this.drawCards(a.playerindex, NUM_WILD_CARDS, 0, DRAW_TYPE_DRAW3);
};
CGameSingle.prototype._onActionSelectColor = function (a) {
  var d = this;
  this._iCurrentColor = a.colorindex;
  this._oAnimation.changeColor(this._iCurrentColor).then(function () {
    d._oInterface.refreshColor(d._iCurrentColor);
    d._notifyChangeTurn();
  });
};
CGameSingle.prototype._onConfirmNextMatch = function () {
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
  this._bEndGame && ((this._bEndGame = !1), this.setNewGame());
  this.restart();
};
CGameSingle.prototype.onExit = function () {
  s_oGame.unload();
  s_oMain.gotoMenu();
  document.dispatchEvent(new CustomEvent("end_session"));
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
};
function CGameSingleWithBot(a) {
  CGameSingle.call(this, a);
  this._oMoveTimeController;
  this._oSelectColorPanel;
}
CGameSingleWithBot.prototype = Object.create(CGameSingle.prototype);
CGameSingleWithBot.prototype._startGame = function () {
  this._oUnoController.setVisible(!0);
  this._oUnoController.addEventListener(
    ON_APPLY_EFFECT,
    this.applyEffectOnCard,
    this
  );
  this._oUnoController.addEventListener(
    ON_APPLY_PENALITY,
    this.applyPenality,
    this
  );
  this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
  this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
  this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
  this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
  this._oMoveTimeController = new CMoveTimeController(
    0,
    CANVAS_HEIGHT,
    this._oTopContainer,
    TIME_PER_MOVE
  );
  this._oMoveTimeController.addEventListener(
    ON_TIMER_END,
    this._onTimerEnd,
    this
  );
  this._oMoveTimeController.addEventListener(
    ON_LAST_TIMER_END,
    this._onLastTimerEnd,
    this
  );
  this._oMoveTimeController.setAlwaysShown();
  this._oMoveTimeController.showAttempt(!0);
  this._setPieces();
  this._aPlayersHand[0].changeName(s_oNetworkManager.getPlayerNickname());
  this._aPlayersHand[1].changeName(s_oNetworkManager.getBotName());
  this.refreshButtonPos();
};
CGameSingleWithBot.prototype.refreshButtonPos = function () {
  this._oInterface.refreshButtonPos();
  this._oMoveTimeController.setPos(
    TIME_CONTROLLER_RADIUS + s_iOffsetX + 10,
    CANVAS_HEIGHT - TIME_CONTROLLER_RADIUS - s_iOffsetY - 10
  );
};
CGameSingleWithBot.prototype._checkFirstCardEffect = function (a) {
  switch (a) {
    case EFFECT_SELECT_COLOR:
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._applySelectColor();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_DRAW_THREE:
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._iNextPlayer = this._iCurPlayer = this._oTurnManager.getTurn();
      this._applyDraw3Effect();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_STOP:
      this._applyStopTurn();
      break;
    case EFFECT_INVERT_TURN:
      2 !== NUM_PLAYERS && this._oTurnManager.nextTurn();
      this._applyInvertTurn();
      break;
    case EFFECT_DRAW_TWO_COLORED:
      this._applyDrawTwoColored();
      break;
    default:
      this._oTurnManager.nextTurn(),
        (this._iCurPlayer = this._oTurnManager.getTurn()),
        (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
        0 === this._iCurPlayer
          ? (this.onInputPlayer(this._iCurPlayer),
            this.playerCanPlay(this._iCurPlayer) || this._oDeck.setHelp(),
            this._oDeck.enableInputDraw())
          : this._oAIManager.selectACard(this._iCurPlayer),
        this._aPlayersHand[this._iCurPlayer].setOnTurn(),
        this.startTimer();
  }
};
CGameSingleWithBot.prototype.onDraw = function (a) {
  var d = this._oTurnManager.getTurn(),
    b = !0;
  if (0 !== this._oUsedCards.getLength() && 0 === this._iCurPlayer) {
    for (var e = 0; e < this._aPlayersHand[0].getLength(); e++) {
      var c = this._aPlayersHand[0].getCardByIndex(e);
      this.cardMatchTheWaste(c, d) && (b = !1);
    }
    !0 === b &&
      (a && this._onHumanInteraction(),
      this._oDeck.disableInputDraw(),
      this._oDeck.hideHelp(),
      this.changeState(GAME_STATE_DRAW),
      this.drawCards(0, 1, 0, DRAW_TYPE_NORMAL));
  }
};
CGameSingleWithBot.prototype.onNextTurn = function () {
  this._bUNO = !1;
  var a = this.checkWinner();
  if (null !== a)
    this.gameOver(a),
      0 === a &&
        document.dispatchEvent(
          new CustomEvent("save_score", {
            detail: { score: this._calculateMatchScore() },
          })
        );
  else if (
    (this.changeState(GAME_STATE_TURN_START),
    this.setOffTurn(),
    this._oDeck.enableInputDraw(),
    this._oTurnManager.nextTurn(),
    (this._iCurPlayer = a = this._oTurnManager.getTurn()),
    (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
    this._aPlayersHand[a].setOnTurn(),
    0 === a)
  )
    if ((this.onInputPlayer(a), this.playerCanPlay(a))) this.startTimer();
    else this.onDraw(!1);
  else this._oAIManager.selectACard(a);
};
CGameSingleWithBot.prototype.playCard = function (a, d) {
  var b = this._oTurnManager.getTurn(),
    e = !1;
  0 === b && (e = this.cardMatchTheWaste(a, b));
  e &&
    (d && this._onHumanInteraction(),
    this._oCardsContainer.addChildAt(
      this._oHandsContainer,
      this._oCardsContainer.numChildren
    ),
    this._aPlayersHand[b].setOnTop(),
    this._oDeck.disableInputDraw(),
    this.offInputPlayer(0),
    (b = this._aPlayersHand[b].getContainerPos()),
    (e = this._oUsedCards.getGlobalPosition()),
    s_aSounds.card.playing() || playSound("card", 1, !1),
    a.moveCard(e.x - b.x, e.y - b.y, 0, 300),
    a.showCard(),
    this._oUsedCards.setChildDepth(2));
};
CGameSingleWithBot.prototype._applySelectColor = function () {
  this.changeState(GAME_STATE_CHOOSE_COLOR);
  if (0 === this._iCurPlayer)
    this.startTimer(),
      (this._oSelectColorPanel = new CSelectColorPanel(
        EFFECT_SELECT_COLOR,
        this._oContainerSelectColor
      )),
      this._oSelectColorPanel.addEventListener(
        ON_HUMAN_INTERACTION,
        this._onHumanInteraction,
        this
      ),
      this._oSelectColorPanel.addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          this._onActionSelectColor({ colorindex: d });
        },
        this
      );
  else {
    var a = { colorindex: this._oAIManager.onSelectColorCpu(this._iCurPlayer) };
    this._onActionSelectColor(a);
  }
};
CGameSingleWithBot.prototype._applyDraw3Effect = function () {
  this.changeState(GAME_STATE_CHOOSE_COLOR);
  if (0 === this._iCurPlayer)
    this.startTimer(),
      (this._oSelectColorPanel = new CSelectColorPanel(
        EFFECT_DRAW_THREE,
        this._oContainerSelectColor
      )),
      this._oSelectColorPanel.addEventListener(
        ON_HUMAN_INTERACTION,
        this._onHumanInteraction,
        this
      ),
      this._oSelectColorPanel.addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          this._onActionDraw3({
            playerindex: this._iNextPlayer,
            colorindex: d,
          });
        },
        this
      );
  else {
    var a = this._oAIManager.onSelectColorCpu(this._iCurPlayer);
    this._onActionDraw3({ playerindex: this._iNextPlayer, colorindex: a });
  }
};
CGameSingleWithBot.prototype._checkIfCanStillPlayTheTurn = function (a) {
  this.playerCanPlay(a)
    ? (this.startTimer(),
      this.changeState(GAME_STATE_DRAW),
      this.onInputPlayer(a),
      0 !== this._iCurPlayer && this._oAIManager.selectACard(this._iCurPlayer))
    : (this.stopTimer(),
      this._aPlayersHand[a].centerContainer(),
      this._notifyChangeTurn());
};
CGameSingleWithBot.prototype._onConfirmNextMatch = function () {
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
  s_oGame._oSummaryPanel.waitingMode();
  var a = randomFloatBetween(200, 2e3);
  setTimeout(function () {
    if (s_oGame._bEndGame)
      if (0.4 < Math.random()) s_oGame.onOpponentAcceptNextMatch();
      else s_oGame.opponentLeftTheGame();
    else s_oGame.onOpponentAcceptNextMatch();
  }, a);
};
CGameSingleWithBot.prototype.onOpponentAcceptNextMatch = function () {
  this._bEndGame && ((this._bEndGame = !1), this.setNewGame());
  this.restart();
};
CGameSingleWithBot.prototype.opponentLeftTheGame = function () {
  var a = s_oNetworkManager.getBotName();
  this._oSummaryPanel.isShown()
    ? this._oSummaryPanel.playerQuitMode(sprintf(TEXT_QUIT_FROM_GAME, a))
    : this._oMsgBox.isShown() ||
      (this._oSummaryPanel.hide(),
      this._oMsgBox.show(sprintf(TEXT_QUIT_FROM_GAME, a)));
};
CGameSingleWithBot.prototype.onExit = function () {
  s_oGame._oMoveTimeController.unload();
  s_oGame.unload();
  s_oMain.gotoMenu();
  document.dispatchEvent(new CustomEvent("end_session"));
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
};
CGameSingleWithBot.prototype.startTimer = function () {
  0 === this._iCurPlayer && this._oMoveTimeController.startTimer();
};
CGameSingleWithBot.prototype.stopTimer = function () {
  this._oMoveTimeController.stopTimer();
};
CGameSingleWithBot.prototype._onTimerEnd = function () {
  switch (this._iGameState) {
    case GAME_STATE_TURN_START:
      this.changeState(GAME_STATE_ACTION_IN_PROGRESS);
      this._oDeck.disableInputDraw();
      this._oDeck.hideHelp();
      var a = this.playerCanPlay(this._iCurPlayer);
      if (a)
        (a = this.getRandomPlayableCard(this._iCurPlayer)),
          this.playCard(a, !1);
      else this.onDraw(!1);
      break;
    case GAME_STATE_DRAW:
      (a = this.playerCanPlay(this._iCurPlayer))
        ? ((a = this.getRandomPlayableCard(this._iCurPlayer)),
          this.playCard(a, !1))
        : this._notifyChangeTurn();
      break;
    case GAME_STATE_CHOOSE_COLOR:
      (a = this._oAIManager.onSelectColorCpu(this._iCurPlayer)),
        this._oSelectColorPanel.setColor(a);
  }
};
CGameSingleWithBot.prototype._onLastTimerEnd = function () {
  this.changeState(GAME_STATE_END);
  this._oSummaryPanel.hide();
  this._oMsgBox.show(TEXT_PLAYER_KICKED);
};
CGameSingleWithBot.prototype._onHumanInteraction = function (a) {
  this._oMoveTimeController.restartEndGameCounter();
};
function CGameMulti(a) {
  CGameBase.call(this, a);
  this._bActionInProgress;
  this._aMessageQueue;
  this._iPlayCardTimeOut;
  this._aDisconnectedPlayer;
  this._oMoveTimeController;
  this._oSelectColorPanel;
  this._startGame();
}
CGameMulti.prototype = Object.create(CGameBase.prototype);
CGameMulti.prototype._startGame = function () {
  this._bActionInProgress = !0;
  this._aMessageQueue = [];
  this._aDisconnectedPlayer = [];
  this._oUnoController.addEventListener(
    ON_APPLY_EFFECT,
    this.applyEffectOnCard,
    this
  );
  this._oUnoController.addEventListener(
    ON_APPLY_PENALITY,
    this.applyPenality,
    this
  );
  this._oUnoController.addEventListener(ON_UNO_CLICK, this._onUnoClick, this);
  this._oSummaryPanel.addEventListener(ON_NEXT, this._onConfirmNextMatch, this);
  this._oSummaryPanel.addEventListener(ON_HOME, this.onExit, this);
  this._oMsgBox.addEventListener(ON_HOME, this.onExit, this);
  this._oMoveTimeController = new CMoveTimeController(
    0,
    CANVAS_HEIGHT,
    this._oTopContainer,
    TIME_PER_MOVE
  );
  this._oMoveTimeController.addEventListener(
    ON_TIMER_END,
    this._onTimerEnd,
    this
  );
  this._oMoveTimeController.addEventListener(
    ON_LAST_TIMER_END,
    this._onLastTimerEnd,
    this
  );
  this._oMoveTimeController.setAlwaysShown();
  this._oMoveTimeController.showAttempt(!0);
  this._initHandPlayers();
  s_oNetworkManager.addEventListener(
    ON_STATUS_OFFLINE,
    this._onConnectionCrashed,
    this
  );
  s_oNetworkManager.sendMsg(MSG_REQUEST_PIECES, "");
  this.refreshButtonPos();
};
CGameMulti.prototype.refreshButtonPos = function () {
  this._oInterface.refreshButtonPos();
  this._oMoveTimeController.setPos(
    TIME_CONTROLLER_RADIUS + s_iOffsetX + 10,
    CANVAS_HEIGHT - TIME_CONTROLLER_RADIUS - s_iOffsetY - 10
  );
};
CGameMulti.prototype.setNewGame = function () {
  for (var a = 0; a < this._aPlayersHand.length; a++)
    this._aPlayersHand[a].setScore(0);
  this._oTurnManager.resetFirstPlayer();
};
CGameMulti.prototype.restart = function () {
  this.reset();
  s_oNetworkManager.sendMsg(MSG_REQUEST_PIECES, "");
};
CGameMulti.prototype._initHandPlayers = function () {
  for (
    var a = HAND_POS["num_player_" + NUM_PLAYERS], d = [], b = 0;
    b < a.length;
    b++
  ) {
    var e = a[b];
    d.push({ x: e.x, y: e.y, side: e.side });
  }
  e = s_oNetworkManager.getPlayerOrderID();
  for (b = 0; b < e; b++) (a = d.pop()), d.splice(0, 0, a);
  for (b = 0; b < NUM_PLAYERS; b++) {
    e = d[b];
    var c = (a = 0);
    e.x === CANVAS_WIDTH / 2 ? (a = CARD_WIDTH / 2) : (c = CARD_HEIGHT / 4);
    this._aPlayersHand[b].setPosition(a, c, d[b].x, d[b].y, d[b].side);
    this._aPlayersHand[b].changeName(s_oNetworkManager.getNicknameByID(b));
  }
};
CGameMulti.prototype._onPiecesReceived = function (a) {
  this._oUnoController.setVisible(!0);
  this._oDeck.initializeFromData(a);
  this.getFirstHand();
};
CGameMulti.prototype._checkFirstCardEffect = function (a) {
  switch (a) {
    case EFFECT_SELECT_COLOR:
      this.onActionStop();
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._aPlayersHand[this._iCurPlayer].setOnTurn();
      this._applySelectColor();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_DRAW_THREE:
      this.onActionStop();
      this._oTurnManager.nextTurn();
      this._iCurPlayer = this._oTurnManager.getTurn();
      this._iNextPlayer = this._oTurnManager.getNextPlayer();
      this._aPlayersHand[this._iCurPlayer].setOnTurn();
      this._iNextPlayer = this._iCurPlayer = this._oTurnManager.getTurn();
      this._applyDraw3Effect();
      this._oTurnManager.prevTurn();
      break;
    case EFFECT_STOP:
      this.onActionStop();
      this._applyStopTurn();
      break;
    case EFFECT_INVERT_TURN:
      this.onActionStop();
      2 !== NUM_PLAYERS && this._oTurnManager.nextTurn();
      this._applyInvertTurn();
      break;
    case EFFECT_DRAW_TWO_COLORED:
      this.onActionStop();
      this._applyDrawTwoColored();
      break;
    default:
      this._oTurnManager.nextTurn(),
        (this._iCurPlayer = this._oTurnManager.getTurn()),
        (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
        this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() &&
          (this.onInputPlayer(this._iCurPlayer), this._oDeck.enableInputDraw()),
        this._aPlayersHand[this._iCurPlayer].setOnTurn(),
        this.startTimer(),
        this.onActionStop(),
        this._isDisconnectedPlayer(this._iCurPlayer) && this._evaluateBotMove();
  }
};
CGameMulti.prototype.onDraw = function (a) {
  var d = this._oTurnManager.getTurn(),
    b = !0,
    e = 0;
  s_bPlayWithBot || (e = s_oNetworkManager.getPlayerOrderID());
  if (0 !== this._oUsedCards.getLength() && this._iCurPlayer === e) {
    for (var c = 0; c < this._aPlayersHand[e].getLength(); c++) {
      var f = this._aPlayersHand[e].getCardByIndex(c);
      this.cardMatchTheWaste(f, d) && (b = !1);
    }
    !0 === b &&
      (a && this._onHumanInteraction(),
      this._oDeck.disableInputDraw(),
      this._oDeck.hideHelp(),
      this.changeState(GAME_STATE_ACTION_IN_PROGRESS),
      this.drawCards(e, 1, 0, DRAW_TYPE_NORMAL));
  }
};
CGameMulti.prototype.onNextTurn = function () {
  this._bUNO = !1;
  var a = this.checkWinner();
  if (null !== a)
    this.gameOver(a),
      this._oSummaryPanel.startAnswerTimer(),
      this.onActionStop();
  else if (
    (this.changeState(GAME_STATE_TURN_START),
    this.setOffTurn(),
    this._oDeck.enableInputDraw(),
    this._oTurnManager.nextTurn(),
    (this._iCurPlayer = a = this._oTurnManager.getTurn()),
    (this._iNextPlayer = this._oTurnManager.getNextPlayer()),
    this._aPlayersHand[a].setOnTurn(),
    a === s_oNetworkManager.getPlayerOrderID())
  ) {
    this.onInputPlayer(a);
    if (this.playerCanPlay(a)) this.startTimer();
    else this.onDraw(!1);
    this.onActionStop();
  } else if (this._isDisconnectedPlayer(a)) this._evaluateBotMove();
  else this.onActionStop();
};
CGameMulti.prototype.playCard = function (a, d) {
  var b = this._oTurnManager.getTurn(),
    e = !1,
    c = s_oNetworkManager.getPlayerOrderID();
  b === c && (e = this.cardMatchTheWaste(a, b));
  e &&
    (d && this._onHumanInteraction(),
    this._oCardsContainer.addChildAt(
      this._oHandsContainer,
      this._oCardsContainer.numChildren
    ),
    this._aPlayersHand[b].setOnTop(),
    this._oDeck.disableInputDraw(),
    this.offInputPlayer(c),
    (b = a.getUniqueID()),
    s_oNetworkManager.sendMsg(
      MSG_MOVE,
      JSON.stringify({ action: ACTION_USE_CARD, playerindex: c, cardindex: b })
    ));
};
CGameMulti.prototype.playedCard = function (a) {
  var d = this._oTurnManager.getTurn(),
    b = this._aPlayersHand[d].searchIndexCard(a);
  this._oUsedCards.pushCard(
    new CCard(
      0,
      0,
      this._oUsedCards.getContainer(),
      a.getFotogram(),
      a.getRank(),
      a.getSuit(),
      a.getUniqueID()
    )
  );
  this._oUsedCards.disableInputUsedCards();
  this._oUsedCards.getLastCard().instantShow();
  this._aPlayersHand[d].removeCardByIndex(b);
  a.unload();
  4 !== this._oUsedCards.getLastCard().getSuit() &&
    ((this._iCurrentColor = this._oUsedCards.getLastCard().getSuit()),
    this._oInterface.refreshColor(this._iCurrentColor));
  this._aPlayersHand[d].organizeHand();
  this.onActionStop();
  d === s_oNetworkManager.getPlayerOrderID()
    ? this.checkUno(a.getEffect())
    : this._isDisconnectedPlayer(d) &&
      (this.checkUno(a.getEffect()), this._onUnoClick());
};
CGameMulti.prototype._onUnoClick = function () {
  if (!0 === this._bUNO) {
    this._bUNO = !1;
    var a = { action: ACTION_ON_UNO_CLICK, playerindex: this._iCurPlayer };
    this._isDisconnectedPlayer(this._iCurPlayer)
      ? this._onActionUnoClick(a)
      : s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a));
  }
};
CGameMulti.prototype.applyEffectOnCard = function (a) {
  (this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() ||
    this._isDisconnectedPlayer(this._iCurPlayer)) &&
    this._checkEffect(a);
};
CGameMulti.prototype._applySelectColor = function () {
  this.changeState(GAME_STATE_CHOOSE_COLOR);
  if (this._iCurPlayer === s_oNetworkManager.getPlayerOrderID())
    this.startTimer(),
      (this._oSelectColorPanel = new CSelectColorPanel(
        EFFECT_SELECT_COLOR,
        this._oContainerSelectColor
      )),
      this._oSelectColorPanel.addEventListener(
        ON_HUMAN_INTERACTION,
        this._onHumanInteraction,
        this
      ),
      this._oSelectColorPanel.addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          d = {
            action: ACTION_SELECT_COLOR,
            playerindex: s_oNetworkManager.getPlayerOrderID(),
            colorindex: d,
          };
          s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(d));
        },
        this
      );
  else if (this._isDisconnectedPlayer(this._iCurPlayer)) {
    var a = this._oAIManager.onSelectColorCpu(this._iCurPlayer);
    a = {
      action: ACTION_SELECT_COLOR,
      playerindex: s_oNetworkManager.getPlayerOrderID(),
      colorindex: a,
    };
    this._onActionSelectColor(a);
  }
};
CGameMulti.prototype._applyDraw3Effect = function () {
  this.changeState(GAME_STATE_CHOOSE_COLOR);
  if (this._iCurPlayer === s_oNetworkManager.getPlayerOrderID())
    this.startTimer(),
      (this._oSelectColorPanel = new CSelectColorPanel(
        EFFECT_DRAW_THREE,
        this._oContainerSelectColor
      )),
      this._oSelectColorPanel.addEventListener(
        ON_HUMAN_INTERACTION,
        this._onHumanInteraction,
        this
      ),
      this._oSelectColorPanel.addEventListener(
        ON_COLOR_SELECTED,
        function (d) {
          s_oNetworkManager.sendMsg(
            MSG_MOVE,
            JSON.stringify({
              action: ACTION_DRAW_FOUR,
              playerindex: this._iNextPlayer,
              colorindex: d,
            })
          );
        },
        this
      );
  else if (this._isDisconnectedPlayer(this._iCurPlayer)) {
    var a = this._oAIManager.onSelectColorCpu(this._iCurPlayer);
    this._onActionDraw3({
      action: ACTION_DRAW_FOUR,
      playerindex: this._iNextPlayer,
      colorindex: a,
    });
  }
};
CGameMulti.prototype._applyStopTurn = function () {
  var a = { action: ACTION_BLOCK_TURN };
  this._iCurPlayer === s_oNetworkManager.getPlayerOrderID()
    ? s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a))
    : this._isDisconnectedPlayer(this._iCurPlayer) &&
      this._onActionBlockTurn(a);
};
CGameMulti.prototype._applyInvertTurn = function () {
  var a = { action: ACTION_INVERT_TURN };
  this._iCurPlayer === s_oNetworkManager.getPlayerOrderID()
    ? s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a))
    : this._isDisconnectedPlayer(this._iCurPlayer) &&
      this._onActionInvertTurn(a);
};
CGameMulti.prototype._applyDrawTwoColored = function () {
  var a = { action: ACTION_DRAW_TWO_COLORED, playerindex: this._iNextPlayer };
  this._iCurPlayer === s_oNetworkManager.getPlayerOrderID()
    ? s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a))
    : this._isDisconnectedPlayer(this._iCurPlayer) &&
      this._onActionDrawTwoColored(a);
};
CGameMulti.prototype._applyNormalCardEffect = function () {
  this._notifyChangeTurn();
};
CGameMulti.prototype._notifyChangeTurn = function () {
  var a = {
    action: ACTION_NEXT_TURN,
    playerindex: s_oNetworkManager.getPlayerOrderID(),
  };
  if (this._iCurPlayer === s_oNetworkManager.getPlayerOrderID())
    s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(a));
  else if (this._isDisconnectedPlayer(this._iCurPlayer)) this.onNextTurn();
};
CGameMulti.prototype.shuffleCards = function (a, d, b, e) {
  var c = this;
  this.changeState(GAME_STATE_ACTION_IN_PROGRESS);
  for (
    var f = this._oUsedCards.removeAllCardUnderTheDeck(), g = [], h = 0;
    h < f.length;
    h++
  )
    g.push(f[h].getFotogram());
  this._oAnimation.shuffleAnimation().then(function () {
    c.onActionStop();
    if (c._iCurPlayer === s_oNetworkManager.getPlayerOrderID()) {
      shuffle(g);
      var l = {
        action: ACTION_ON_SHUFFLECARDS,
        playerindex: a,
        numberofcards: d,
        delay: b,
        drawtype: e,
        cards: g,
      };
      s_oNetworkManager.sendMsg(MSG_MOVE, JSON.stringify(l));
    } else c._isDisconnectedPlayer(c._iCurPlayer) && (shuffleWithSeed(g, 0), (l = { action: ACTION_ON_SHUFFLECARDS, playerindex: a, numberofcards: d, delay: b, drawtype: e, cards: g }), c._onActionShuffleCard(l));
  });
};
CGameMulti.prototype.drawCards = function (a, d, b, e) {
  s_oNetworkManager.sendMsg(
    MSG_MOVE,
    JSON.stringify({
      action: ACTION_ON_DRAWCARDS,
      playerindex: a,
      numberofcards: d,
      delay: b,
      drawtype: e,
    })
  );
};
CGameMulti.prototype._onAllCardsDrawCompleted = function (a, d) {
  this._checkEffectAfterDrawCompleted(a, d);
  this.onActionStop();
};
CGameMulti.prototype._checkIfCanStillPlayTheTurn = function (a) {
  this.playerCanPlay(a)
    ? (this.startTimer(),
      this.changeState(GAME_STATE_DRAW),
      this.onInputPlayer(a),
      this._isDisconnectedPlayer(this._iCurPlayer) && this._evaluateBotMove())
    : (this.stopTimer(),
      this._aPlayersHand[a].centerContainer(),
      this._notifyChangeTurn());
};
CGameMulti.prototype.onActionReceived = function (a) {
  this._aMessageQueue.push(a);
  this._evaluateMessageQueue();
};
CGameMulti.prototype.onActionStop = function () {
  this._bActionInProgress = !1;
  this._evaluateMessageQueue();
};
CGameMulti.prototype._evaluateMessageQueue = function () {
  if (0 !== this._aMessageQueue.length && !this._bActionInProgress) {
    this._bActionInProgress = !0;
    var a = this._aMessageQueue.shift();
    switch (a.action) {
      case ACTION_NEXT_TURN:
        this.onNextTurn();
        break;
      case ACTION_USE_CARD:
        this._onActionPlayCard(a);
        break;
      case ACTION_ON_SHUFFLECARDS:
        this._onActionShuffleCard(a);
        break;
      case ACTION_ON_DRAWCARDS:
        this._onActionDrawCards(a);
        break;
      case ACTION_ON_UNO_CLICK:
        this._onActionUnoClick(a);
        break;
      case ACTION_SELECT_COLOR:
        this._onActionSelectColor(a);
        break;
      case ACTION_DRAW_FOUR:
        this._onActionDraw3(a);
        break;
      case ACTION_BLOCK_TURN:
        this._onActionBlockTurn(a);
        break;
      case ACTION_INVERT_TURN:
        this._onActionInvertTurn(a);
        break;
      case ACTION_DRAW_TWO_COLORED:
        this._onActionDrawTwoColored(a);
        break;
      case ACTION_PLAYER_QUIT:
        this._onActionPlayerQuit(a);
        break;
      case MSG_NOTIFY:
        this._onNotifyReceived(a);
    }
  }
};
CGameMulti.prototype._onActionPlayCard = function (a) {
  this.changeState(GAME_STATE_ACTION_IN_PROGRESS);
  var d = a.playerindex,
    b = this._aPlayersHand[d].getContainerPos(),
    e = this._oUsedCards.getGlobalPosition();
  a = this._aPlayersHand[d].getCardByUniqueID(a.cardindex);
  d = a.getFotogram();
  (d !== FOTOGRAM_DRAW_FOUR && d !== FOTOGRAM_COLOR) ||
    this.changeState(GAME_STATE_CHOOSE_COLOR);
  s_aSounds.card.playing() || playSound("card", 1, !1);
  a.moveCard(e.x - b.x, e.y - b.y, 0, 300);
  a.showCard();
  this._oUsedCards.setChildDepth(2);
};
CGameMulti.prototype._onActionShuffleCard = function (a) {
  var d = a.playerindex,
    b = a.numberofcards,
    e = a.delay,
    c = a.drawtype;
  a = a.cards;
  this._oDeck.clearCards();
  this._oDeck.initializeFromData(a);
  this.checkForMoreDraws(d, b, e, c);
};
CGameMulti.prototype._onActionDrawCards = function (a) {
  var d = a.drawtype,
    b = a.numberofcards,
    e = a.delay;
  a = a.playerindex;
  this._checkUnoNotify(
    d === DRAW_TYPE_PENALITY ? !0 : !1,
    s_oNetworkManager.getPlayerOrderID(),
    a
  );
  this._checkNumberCardsToDraw(a, b, e, d);
};
CGameMulti.prototype._onActionUnoClick = function (a) {
  this._aPlayersHand[a.playerindex].checkUno();
  this.onActionStop();
};
CGameMulti.prototype._onActionSelectColor = function (a) {
  var d = this;
  this._iCurrentColor = a.colorindex;
  this._oAnimation.changeColor(this._iCurrentColor).then(function () {
    d._oInterface.refreshColor(d._iCurrentColor);
    d._notifyChangeTurn();
    d.onActionStop();
  });
};
CGameMulti.prototype._onActionDraw3 = function (a) {
  this._iCurrentColor = a.colorindex;
  this._oInterface.refreshColor(this._iCurrentColor);
  a = {
    playerindex: a.playerindex,
    numberofcards: NUM_WILD_CARDS,
    delay: 0,
    drawtype: DRAW_TYPE_DRAW3,
  };
  this._onActionDrawCards(a);
};
CGameMulti.prototype._onActionBlockTurn = function (a) {
  var d = this;
  this._oAnimation.stopTurn().then(function () {
    d._oTurnManager.nextTurn();
    d._notifyChangeTurn();
    d.onActionStop();
  });
};
CGameMulti.prototype._onActionInvertTurn = function (a) {
  var d = this;
  this._oTurnManager.changeClockWise();
  2 === NUM_PLAYERS && this._oTurnManager.nextTurn();
  this._oAnimation
    .changeClockWise(s_oGame._oTurnManager.getClockWise())
    .then(function () {
      d._notifyChangeTurn();
      d.onActionStop();
    });
};
CGameMulti.prototype._onActionDrawTwoColored = function (a) {
  a = {
    playerindex: a.playerindex,
    numberofcards: 2,
    delay: 0,
    drawtype: DRAW_TYPE_DRAW2_COLORED,
  };
  this._onActionDrawCards(a);
};
CGameMulti.prototype.onExit = function () {
  s_oGame.unload();
  s_oMain.gotoMenu();
  document.dispatchEvent(new CustomEvent("end_session"));
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
  s_oNetworkManager.disconnect();
};
CGameMulti.prototype._onConfirmNextMatch = function () {
  document.dispatchEvent(new CustomEvent("show_interlevel_ad"));
  this._oSummaryPanel.waitingMode();
  s_oNetworkManager.sendMsg(MSG_ACCEPT_NEXTMATCH, "");
};
CGameMulti.prototype.onOpponentAcceptNextMatch = function () {
  this._bEndGame && ((this._bEndGame = !1), this.setNewGame());
  this.restart();
};
CGameMulti.prototype.onOpponentRefuseNextMatch = function (a) {
  this._aDisconnectedPlayer.push(a);
};
CGameMulti.prototype.opponentLeftTheGame = function (a) {
  this._aDisconnectedPlayer.push(a);
  if (
    this._iGameState !== GAME_STATE_DEALING &&
    this._iGameState !== GAME_STATE_ACTION_IN_PROGRESS
  )
    this.onActionReceived({ action: ACTION_PLAYER_QUIT, playerindex: a });
};
CGameMulti.prototype._onActionPlayerQuit = function (a) {
  if (a.playerindex === this._iCurPlayer) this._evaluateBotMove();
  else this.onActionStop();
};
CGameMulti.prototype._isDisconnectedPlayer = function (a) {
  return -1 === this._aDisconnectedPlayer.indexOf(a) ? !1 : !0;
};
CGameMulti.prototype._onConnectionCrashed = function () {
  this._oSummaryPanel.hide();
  this._oMsgBox.show(TEXT_SOMETHING_WENT_WRONG);
};
CGameMulti.prototype._evaluateBotMove = function () {
  switch (this._iGameState) {
    case GAME_STATE_TURN_START:
      this.getAIAction();
      break;
    case GAME_STATE_DRAW:
      this.getAIAction();
      break;
    case GAME_STATE_CHOOSE_COLOR:
      var a = this._oUsedCards.getLastCard().getFotogram();
      a === FOTOGRAM_COLOR
        ? this._applySelectColor()
        : a === FOTOGRAM_DRAW_FOUR && this._applyDraw3Effect();
      break;
    case GAME_STATE_ACTION_IN_PROGRESS:
      this.onActionStop();
  }
};
CGameMulti.prototype.getAIAction = function () {
  var a = this._oAIManager.getMove(this._iCurPlayer);
  switch (a.move) {
    case AI_MOVE_DRAWCARD:
      this._onActionDrawCards({
        action: ACTION_ON_DRAWCARDS,
        playerindex: this._iCurPlayer,
        numberofcards: 1,
        delay: 1e3,
        drawtype: DRAW_TYPE_NORMAL,
      });
      this.onActionStop();
      break;
    case AI_MOVE_PLAYCARD:
      var d = this,
        b = this._iCurPlayer;
      this._iPlayCardTimeOut = setTimeout(function () {
        var e = a.card.getUniqueID();
        d._onActionPlayCard({
          action: ACTION_USE_CARD,
          playerindex: b,
          cardindex: e,
        });
      }, 1500);
  }
};
CGameMulti.prototype.unload = function () {
  clearTimeout(this._iPlayCardTimeOut);
  this._oMoveTimeController.unload();
  CGameBase.prototype.unload.call(this);
};
CGameMulti.prototype.startTimer = function () {
  this._iCurPlayer === s_oNetworkManager.getPlayerOrderID() &&
    this._oMoveTimeController.startTimer();
};
CGameMulti.prototype.stopTimer = function () {
  this._oMoveTimeController.stopTimer();
};
CGameMulti.prototype._onTimerEnd = function () {
  switch (this._iGameState) {
    case GAME_STATE_TURN_START:
      this.changeState(GAME_STATE_ACTION_IN_PROGRESS);
      this._oDeck.disableInputDraw();
      this._oDeck.hideHelp();
      var a = this.playerCanPlay(this._iCurPlayer);
      if (a)
        (a = this.getRandomPlayableCard(this._iCurPlayer)),
          this.playCard(a, !1);
      else this.onDraw(!1);
      break;
    case GAME_STATE_DRAW:
      (a = this.playerCanPlay(this._iCurPlayer))
        ? ((a = this.getRandomPlayableCard(this._iCurPlayer)),
          this.playCard(a, !1))
        : this._notifyChangeTurn();
      break;
    case GAME_STATE_CHOOSE_COLOR:
      (a = this._oAIManager.onSelectColorCpu(this._iCurPlayer)),
        this._oSelectColorPanel.setColor(a);
  }
};
CGameMulti.prototype._onLastTimerEnd = function () {
  s_oNetworkManager.disconnect();
  this._oSummaryPanel.hide();
  this._oMsgBox.show(TEXT_PLAYER_KICKED);
};
CGameMulti.prototype._onNotifyReceived = function (a) {};
CGameMulti.prototype._onHumanInteraction = function (a) {
  this._oMoveTimeController.restartEndGameCounter();
};
function CInterface() {
  var a,
    d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m,
    p,
    n,
    q,
    t = null,
    z = null,
    A,
    C;
  this._init = function () {
    A = new createjs.Container();
    var w = s_oSpriteLibrary.getSprite("but_exit");
    g = CANVAS_WIDTH - w.width / 2 - 10;
    h = w.height / 2 + 10;
    p = new CGfxButton(g, h, w, A);
    p.addEventListener(ON_MOUSE_UP, this._onExit, this);
    a = g - w.width - 10;
    d = h;
    C = new CToggle(
      a,
      d,
      s_oSpriteLibrary.getSprite("toggle_anim"),
      s_bEnableAnim,
      A
    );
    C.addEventListener(ON_MOUSE_UP, this._onToggleAnim, this);
    c = a - w.width - 10;
    f = d;
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
      (w = s_oSpriteLibrary.getSprite("audio_icon")),
        (m = new CToggle(c, f, w, s_bAudioActive, A)),
        m.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    w = window.document;
    var B = w.documentElement;
    t =
      B.requestFullscreen ||
      B.mozRequestFullScreen ||
      B.webkitRequestFullScreen ||
      B.msRequestFullscreen;
    z =
      w.exitFullscreen ||
      w.mozCancelFullScreen ||
      w.webkitExitFullscreen ||
      w.msExitFullscreen;
    !1 === ENABLE_FULLSCREEN && (t = !1);
    t &&
      screenfull.isEnabled &&
      ((w = s_oSpriteLibrary.getSprite("but_fullscreen")),
      (b = w.width / 4 + 10),
      (e = w.height / 2 + 10),
      (n = new CToggle(b, e, w, s_bFullscreen, A)),
      n.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
    w = s_oSpriteLibrary.getSprite("colors");
    w = new createjs.SpriteSheet({
      images: [w],
      frames: { width: 103, height: 102, regX: 51.5, regY: 51 },
      animations: { red: [0], green: [1], blue: [2], yellow: [3] },
    });
    l = CANVAS_WIDTH / 2 + 220;
    k = CANVAS_HEIGHT / 2 - 60;
    q = new createjs.Sprite(w, 0);
    q.stop();
    q.x = l;
    q.y = k;
    s_oStage.addChild(A);
    this.refreshButtonPos();
  };
  this.refreshColor = function (w) {
    q.gotoAndStop(w);
    s_oStage.addChildAt(q, 1);
  };
  this.unload = function () {
    if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) m.unload(), (m = null);
    p.unload();
    t && screenfull.isEnabled && n.unload();
    C.unload();
    s_oInterface = null;
  };
  this.refreshButtonPos = function () {
    p.setPosition(g - s_iOffsetX, s_iOffsetY + h);
    (!1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile) ||
      m.setPosition(c - s_iOffsetX, s_iOffsetY + f);
    t && screenfull.isEnabled && n.setPosition(b + s_iOffsetX, e + s_iOffsetY);
    C.setPosition(a - s_iOffsetX, d + s_iOffsetY);
  };
  this.setOnTop = function () {
    s_oStage.addChildAt(A, s_oStage.numChildren);
  };
  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };
  this._onExit = function () {
    new CAreYouSurePanel(s_oGame.onExit);
  };
  this._onRestart = function () {
    s_oGame.restart();
  };
  this.resetFullscreenBut = function () {
    t && screenfull.isEnabled && n.setActive(s_bFullscreen);
  };
  this._onFullscreen = function () {
    s_bFullscreen
      ? z.call(window.document)
      : t.call(window.document.documentElement);
  };
  this._onToggleAnim = function () {
    s_bEnableAnim = !s_bEnableAnim;
    s_oLocalSavings.saveSkipAnim();
  };
  sizeHandler();
  s_oInterface = this;
  this._init();
  return this;
}
var s_oInterface = null;
function CCreditsPanel() {
  var a, d, b, e, c, f, g;
  this._init = function () {
    d = new createjs.Shape();
    d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    d.alpha = 0;
    f = d.on("mousedown", function () {});
    s_oStage.addChild(d);
    new createjs.Tween.get(d).to({ alpha: 0.7 }, 500);
    b = new createjs.Container();
    s_oStage.addChild(b);
    var h = s_oSpriteLibrary.getSprite("credits_panel"),
      l = createBitmap(h);
    l.regX = h.width / 2;
    l.regY = h.height / 2;
    b.addChild(l);
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT + h.height / 2;
    a = b.y;
    new createjs.Tween.get(b).to(
      { y: CANVAS_HEIGHT / 2 - 40 },
      500,
      createjs.Ease.quartIn
    );
    h = new createjs.Text(
      "www.codethislab.com",
      "30px " + PRIMARY_FONT,
      "#ffffff"
    );
    h.y = 120;
    h.textAlign = "center";
    h.textBaseline = "middle";
    h.lineWidth = 500;
    b.addChild(h);
    h = s_oSpriteLibrary.getSprite("ctl_logo");
    c = createBitmap(h);
    g = c.on("click", this._onLogoButRelease);
    c.regX = h.width / 2;
    c.regY = h.height / 2;
    b.addChild(c);
    h = s_oSpriteLibrary.getSprite("but_exit");
    e = new CGfxButton(230, -107, h, b);
    e.addEventListener(ON_MOUSE_UP, this.unload, this);
  };
  this.unload = function () {
    e.setClickable(!1);
    new createjs.Tween.get(d).to({ alpha: 0 }, 500);
    new createjs.Tween.get(b)
      .to({ y: a }, 400, createjs.Ease.backIn)
      .call(function () {
        s_oStage.removeChild(d);
        s_oStage.removeChild(b);
        e.unload();
      });
    d.off("mousedown", f);
    c.off("mousedown", g);
  };
  this._onLogoButRelease = function () {};
  this._init();
}
function CSelectColorPanel(a, d) {
  var b,
    e,
    c,
    f,
    g,
    h,
    l = this,
    k,
    m,
    p,
    n;
  this._init = function () {
    e = [];
    c = [];
    a === EFFECT_SELECT_COLOR && playSound("special_card", 0.5, !1);
    f = new createjs.Shape();
    f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    f.alpha = 0;
    f.on("mousedown", function () {});
    d.addChild(f);
    new createjs.Tween.get(f, { override: !0 }).to({ alpha: 0.7 }, 500);
    g = new createjs.Container();
    d.addChild(g);
    h = new createjs.Container();
    g.addChild(h);
    var q = s_oSpriteLibrary.getSprite("select_color_panel"),
      t = createBitmap(q);
    t.regX = q.width / 2;
    t.regY = q.height / 2;
    g.addChildAt(t, 0);
    g.x = CANVAS_WIDTH / 2;
    g.y = CANVAS_HEIGHT + q.height / 2;
    b = g.y;
    new createjs.Tween.get(g, { override: !0 }).to(
      { y: CANVAS_HEIGHT / 2 - 40 },
      600,
      createjs.Ease.backOut
    );
    new CTLText(
      g,
      -250,
      -q.height / 2 + 10,
      500,
      110,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      TEXT_SELECT_COLOR,
      !0,
      !0,
      !0,
      !1
    );
    h.y = g.getBounds().height / 5;
    q = s_oSpriteLibrary.getSprite("but_red");
    k = new CGfxButton(-190, -20, q, h);
    k.addEventListener(ON_MOUSE_UP, function () {
      l.onSelectColor(0);
    });
    q = s_oSpriteLibrary.getSprite("but_green");
    m = new CGfxButton(-65, -20, q, h);
    m.addEventListener(ON_MOUSE_UP, function () {
      l.onSelectColor(1);
    });
    q = s_oSpriteLibrary.getSprite("but_blue");
    p = new CGfxButton(65, -20, q, h);
    p.addEventListener(ON_MOUSE_UP, function () {
      l.onSelectColor(2);
    });
    q = s_oSpriteLibrary.getSprite("but_yellow");
    n = new CGfxButton(190, -20, q, h);
    n.addEventListener(ON_MOUSE_UP, function () {
      l.onSelectColor(3);
    });
  };
  this.unload = function () {
    d.removeChild(f);
    d.removeChild(g);
    k.unload();
    m.unload();
    p.unload();
    n.unload();
    f.off("mousedown", function () {});
  };
  this.disableButtons = function () {
    k.setClickable(!1);
    m.setClickable(!1);
    p.setClickable(!1);
    n.setClickable(!1);
  };
  this.addEventListener = function (q, t, z) {
    e[q] = t;
    c[q] = z;
  };
  this.onSelectColor = function (q) {
    new createjs.Tween.get(f, { override: !0 }).to({ alpha: 0 }, 500);
    new createjs.Tween.get(g, { override: !0 }).to(
      { y: b },
      400,
      createjs.Ease.backIn
    );
    l.disableButtons();
    e[ON_COLOR_SELECTED] &&
      e[ON_COLOR_SELECTED].call(c[ON_COLOR_SELECTED], q, a);
    e[ON_HUMAN_INTERACTION] &&
      e[ON_HUMAN_INTERACTION].call(c[ON_HUMAN_INTERACTION]);
  };
  this.setColor = function (q) {
    new createjs.Tween.get(f, { override: !0 }).to({ alpha: 0 }, 500);
    new createjs.Tween.get(g, { override: !0 }).to(
      { y: b },
      400,
      createjs.Ease.backIn
    );
    l.disableButtons();
    e[ON_COLOR_SELECTED] && e[ON_COLOR_SELECTED].call(c[ON_COLOR_SELECTED], q);
  };
  l = this;
  this._init();
}
function CAreYouSurePanel(a) {
  var d, b, e, c, f;
  this._init = function (h) {
    c = new createjs.Shape();
    c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    c.alpha = 0;
    c.on("mousedown", function () {});
    s_oStage.addChild(c);
    new createjs.Tween.get(c).to({ alpha: 0.7 }, 500);
    f = new createjs.Container();
    s_oStage.addChildAt(f, s_oStage.numChildren);
    h = s_oSpriteLibrary.getSprite("credits_panel");
    var l = createBitmap(h);
    l.regX = h.width / 2;
    l.regY = h.height / 2;
    f.addChild(l);
    f.x = CANVAS_WIDTH / 2;
    f.y = CANVAS_HEIGHT + h.height / 2;
    d = f.y;
    new createjs.Tween.get(f)
      .to({ y: CANVAS_HEIGHT / 2 - 40 }, 500, createjs.Ease.quartIn)
      .call(function () {});
    new CTLText(
      f,
      -250,
      -130,
      500,
      150,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      TEXT_ARE_SURE,
      !0,
      !0,
      !0,
      !1
    );
    b = new CGfxButton(110, 80, s_oSpriteLibrary.getSprite("but_yes_big"), f);
    b.addEventListener(ON_MOUSE_UP, this._onButYes, this);
    e = new CGfxButton(-110, 80, s_oSpriteLibrary.getSprite("but_exit_big"), f);
    e.addEventListener(ON_MOUSE_UP, this._onButNo, this);
  };
  this._onButYes = function () {
    e.setClickable(!1);
    b.setClickable(!1);
    new createjs.Tween.get(c).to({ alpha: 0 }, 500);
    new createjs.Tween.get(f)
      .to({ y: d }, 400, createjs.Ease.backIn)
      .call(function () {
        a();
        g.unload();
      });
  };
  this._onButNo = function () {
    e.setClickable(!1);
    b.setClickable(!1);
    new createjs.Tween.get(c).to({ alpha: 0 }, 500);
    new createjs.Tween.get(f)
      .to({ y: d }, 400, createjs.Ease.backIn)
      .call(function () {
        g.unload();
      });
  };
  this.unload = function () {
    e.unload();
    b.unload();
    s_oStage.removeChild(c);
    s_oStage.removeChild(f);
    c.off("mousedown", function () {});
  };
  var g = this;
  this._init(a);
}
function CAIManager() {
  this._init = function () {};
  this.unload = function () {};
  this.onSelectColorCpu = function (a) {
    a = s_oGame.getPlayersHand(a);
    for (
      var d,
        b = [
          { iColor: 0, iPoints: 0 },
          { iColor: 1, iPoints: 0 },
          { iColor: 2, iPoints: 0 },
          { iColor: 3, iPoints: 0 },
        ],
        e = 0;
      e < a.getLength();
      e++
    ) {
      d = a.getCardByIndex(e);
      for (var c = 0; c < b.length; c++) d.getSuit() === c && b[c].iPoints++;
    }
    b.sort(function (f, g) {
      return parseFloat(g.iPoints) - parseFloat(f.iPoints);
    });
    return b[0].iColor;
  };
  this.selectACard = function (a) {
    var d = this.getMove(a);
    switch (d.move) {
      case AI_MOVE_DRAWCARD:
        s_oGame.drawCards(a, 1, 1e3, DRAW_TYPE_NORMAL);
        break;
      case AI_MOVE_PLAYCARD:
        setTimeout(function () {
          s_oGame.cpuPlayCard(d.card);
        }, 500);
    }
  };
  this._getBestCards = function (a) {
    a = s_oGame.getPlayersHand(a);
    for (
      var d = s_oGame.getCurColor(), b = s_oGame.getLastCard(), e = [], c = 0;
      c < a.getLength();
      c++
    )
      4 === a.getCardByIndex(c).getSuit() ||
      (a.getCardByIndex(c).getRank() !== b.getRank() &&
        a.getCardByIndex(c).getSuit() !== d)
        ? a.getCardByIndex(c).getFotogram() === FOTOGRAM_COLOR
          ? e.push({ oCard: a.getCardByIndex(c), iValue: 2 })
          : a.getCardByIndex(c).getFotogram() === FOTOGRAM_DRAW_FOUR &&
            e.push({ oCard: a.getCardByIndex(c), iValue: 1 })
        : 12 === a.getCardByIndex(c).getRank()
        ? e.push({ oCard: a.getCardByIndex(c), iValue: 6 })
        : 10 === a.getCardByIndex(c).getRank()
        ? e.push({ oCard: a.getCardByIndex(c), iValue: 5 })
        : 11 === a.getCardByIndex(c).getRank()
        ? e.push({ oCard: a.getCardByIndex(c), iValue: 4 })
        : e.push({ oCard: a.getCardByIndex(c), iValue: 3 });
    return e;
  };
  this.getMove = function (a) {
    a = this._getBestCards(a);
    var d = null,
      b = AI_MOVE_NULL;
    0 === a.length
      ? (b = AI_MOVE_DRAWCARD)
      : (a.sort(function (e, c) {
          return parseFloat(c.iValue) - parseFloat(e.iValue);
        }),
        (d = a[0].oCard),
        (b = AI_MOVE_PLAYCARD));
    return { move: b, card: d };
  };
  this._init();
}
function CUnoController() {
  var a, d, b, e, c;
  this._init = function () {
    a = [];
    d = [];
    e = new createjs.Container();
    e.visible = !1;
    s_oStage.addChild(e);
    var g = s_oSpriteLibrary.getSprite("but_uno");
    c = new CGfxButton(CANVAS_WIDTH / 2 + 222, CANVAS_HEIGHT / 2 + 70, g, e);
    c.addEventListener(ON_MOUSE_UP, this._onButUno, this);
    b = new CTLText(
      e,
      CANVAS_WIDTH / 2 + 280,
      CANVAS_HEIGHT / 2,
      200,
      150,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      sprintf(TEXT_ALERT_1, NUM_PENALTY_CARDS),
      !0,
      !0,
      !0,
      !1
    );
    b.setAlpha(0);
  };
  this.unload = function () {
    c.unload();
  };
  this.addEventListener = function (g, h, l) {
    a[g] = h;
    d[g] = l;
  };
  this.setVisible = function (g) {
    e.visible = g;
  };
  this.check = function (g) {
    !0 === s_oGame.getbUNO()
      ? setTimeout(function () {
          !0 === s_oGame.getbUNO() ? f._triggerPenality() : f._triggerEffect(g);
        }, 2e3)
      : f._triggerEffect(g);
  };
  this._triggerPenality = function () {
    a[ON_APPLY_PENALITY] && a[ON_APPLY_PENALITY].call(d[ON_APPLY_PENALITY]);
  };
  this._triggerEffect = function (g) {
    a[ON_APPLY_EFFECT] && a[ON_APPLY_EFFECT].call(d[ON_APPLY_EFFECT], g);
  };
  this._onButUno = function () {
    a[ON_UNO_CLICK] && a[ON_UNO_CLICK].call(d[ON_UNO_CLICK]);
  };
  this.showAlertMsg = function (g) {
    b.refreshText(g);
    createjs.Tween.get(b.getText())
      .to({ alpha: 1 }, 400)
      .wait(4e3)
      .to({ alpha: 0 }, 400)
      .call(function () {
        c.removeAnimation();
      });
  };
  this.unoAnimation = function () {
    c.trembleAnimation();
  };
  var f = this;
  this._init();
}
function CSummaryPanel(a) {
  var d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m,
    p,
    n,
    q,
    t,
    z,
    A = this;
  this._init = function () {
    d = [];
    b = [];
    f = new createjs.Shape();
    f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    f.alpha = 0;
    f.on("mousedown", function () {});
    a.addChild(f);
    h = new createjs.Container();
    h.alpha = 0;
    h.visible = !1;
    a.addChild(h);
    var C = s_oSpriteLibrary.getSprite("msg_box");
    g = createBitmap(C);
    C = g.getBounds();
    g.regX = C.width / 2;
    g.regY = C.height / 2;
    g.x = CANVAS_WIDTH / 2;
    g.y = CANVAS_HEIGHT / 2;
    h.addChild(g);
    m = new createjs.Container();
    m.x = g.x;
    m.y = g.y - 10;
    h.addChild(m);
    var w = NUM_PLAYERS;
    C = 40 * w;
    c = [];
    for (var B = 0; B < w; B++)
      (c[B] = new CPlayerInfo(0, 0, m, "szPlayerName")),
        c[B].setPosition(0, -C / 2 + (C / (w - 1)) * B, BOTTOM);
    e = "#35bd1b";
    k = new createjs.Text(0, " 30px " + PRIMARY_FONT, e);
    k.textBaseline = "middle";
    m.addChild(k);
    w = CANVAS_WIDTH / 2;
    B = CANVAS_HEIGHT / 2 - 185;
    C = 150;
    l = new CTLText(
      h,
      w - 250,
      B - C / 2,
      500,
      C,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      TEXT_SUMMARY,
      !0,
      !0,
      !0,
      !1
    );
    C = s_oSpriteLibrary.getSprite("cup_icon");
    p = createBitmap(C);
    p.regX = C.width / 2;
    p.regY = C.height / 2;
    p.x = -300;
    p.y = c[0].getTextScorePos().y;
    p.visible = !1;
    m.addChild(p);
    C = s_oSpriteLibrary.getSprite("but_home");
    n = new CGfxButton(CANVAS_WIDTH / 2 - 180, CANVAS_HEIGHT / 2 + 170, C, h);
    n.addEventListener(ON_MOUSE_DOWN, this._onExit, this);
    C = s_oSpriteLibrary.getSprite("but_show");
    q = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 170, C, h);
    q.addEventListener(ON_MOUSE_DOWN, this._onShow, this);
    C = s_oSpriteLibrary.getSprite("but_next");
    t = new CGfxButton(CANVAS_WIDTH / 2 + 180, CANVAS_HEIGHT / 2 + 170, C, h);
    t.addEventListener(ON_MOUSE_DOWN, this._onNext, this);
    t.pulseAnimation();
    z = new CMoveTimeController(
      CANVAS_WIDTH / 2 + 330,
      CANVAS_HEIGHT / 2 - 200,
      h,
      TIME_FOR_REMATCH_ANSWER
    );
    z.addEventListener(ON_TIMER_END, this._onTimerEnd, this);
    z.setAlwaysShown();
    z.showAttempt(!1);
  };
  this.unload = function () {
    t.unload();
    q.unload();
    n.unload();
    z.unload();
    f.removeAllEventListeners();
    h.removeAllEventListeners();
    a.removeChild(f);
    a.removeChild(h);
  };
  this.addEventListener = function (C, w, B) {
    d[C] = w;
    b[C] = B;
  };
  this.startAnswerTimer = function () {
    z.startTimer();
  };
  this.stopAnswerTimer = function () {
    z.stopTimer();
  };
  this._onTimerEnd = function () {
    console.log("TIMER END IN REMATCH");
    s_oGame._onLastTimerEnd();
  };
  this.setAndShow = function (C, w, B) {
    s_bMobile ||
      (document.querySelector("#div_display_id").style.display = "block");
    for (var u = 0; u < c.length; u++)
      if (
        (c[u].setName(C[u].name),
        c[u].setScore(C[u].score + " /" + GAME_SCORE_WIN),
        C[u].index === w)
      ) {
        var r = c[u].getTextScorePos();
        k.x = r.x + 46;
        k.y = r.y + 18;
        k.text = "(+" + B + ")";
        c[u].highlight();
      }
    playSound("game_over", 1, !1);
    h.visible = !0;
    createjs.Tween.get(f).to({ alpha: 0.7 }, 500);
    createjs.Tween.get(h).to({ alpha: 1 }, 500);
  };
  this.reset = function () {
    h.visible = !1;
    f.alpha = 0;
    f.on("mousedown", function () {});
    p.visible = !1;
    l.setY(CANVAS_HEIGHT / 2 - 185 - 75);
    l.refreshText(TEXT_SUMMARY);
    m.visible = !0;
    n.setX(CANVAS_WIDTH / 2 - 180);
    q.setX(CANVAS_WIDTH / 2);
    t.setX(CANVAS_WIDTH / 2 + 180);
    n.setVisible(!0);
    q.setVisible(!0);
    t.setVisible(!0);
    var C = s_oSpriteLibrary.getSprite("but_next");
    t.setImage(C);
    for (C = 0; C < c.length; C++) c[C].enable(), c[C].setNameColor("#FFF");
  };
  this.show = function () {
    s_bMobile ||
      (document.querySelector("#div_display_id").style.display = "block");
    h.visible = !0;
    f.alpha = 0.7;
    f.removeAllEventListeners();
    f.on("mousedown", function () {});
  };
  this.hide = function () {
    h.visible = !1;
    f.alpha = 0.01;
    f.removeAllEventListeners();
    f.on("mousedown", this.show, this);
  };
  this.waitingMode = function () {
    h.visible = !0;
    h.alpha = 1;
    f.alpha = 0.7;
    m.visible = !1;
    l.refreshText(TEXT_WAIT_OPPONENT);
    l.setY(CANVAS_HEIGHT / 2 - 50 - 75);
    n.setX(CANVAS_WIDTH / 2 - 100);
    t.setVisible(!1);
    q.setX(CANVAS_WIDTH / 2 + 100);
  };
  this.playerQuitMode = function (C) {
    h.visible = !0;
    h.alpha = 1;
    f.alpha = 0.7;
    l.refreshText(C.toUpperCase());
    n.setX(CANVAS_WIDTH / 2 - 100);
    t.setVisible(!1);
    q.setX(CANVAS_WIDTH / 2 + 100);
  };
  this.endMode = function (C) {
    s_bMobile ||
      (document.querySelector("#div_display_id").style.display = "block");
    l.refreshText(C.toUpperCase());
    C = s_oSpriteLibrary.getSprite("but_restart");
    t.setImage(C);
    c[0].setNameColor(e);
    p.visible = !0;
  };
  this.isShown = function () {
    return h.visible;
  };
  this.stopTweens = function () {
    createjs.Tween.removeTweens(f);
    createjs.Tween.removeTweens(h);
  };
  this._onExit = function () {
    A.stopTweens();
    new CAreYouSurePanel(A.onConfirmExit);
  };
  this.onConfirmExit = function () {
    document.querySelector("#div_display_id").style.display = "none";
    A.stopAnswerTimer();
    d[ON_HOME] && d[ON_HOME].call(b[ON_HOME]);
  };
  this._onShow = function () {
    A.stopTweens();
    d[ON_CHECK] && d[ON_CHECK].call(b[ON_CHECK]);
  };
  this._onNext = function () {
    document.querySelector("#div_display_id").style.display = "none";
    A.stopTweens();
    A.stopAnswerTimer();
    d[ON_NEXT] && d[ON_NEXT].call(b[ON_NEXT]);
  };
  this._init();
  return this;
}
function CPlayerInfo(a, d, b, e) {
  var c, f, g, h, l, k, m, p, n, q, t;
  this._init = function (z, A, C, w) {
    c = w;
    f = 10;
    k = new createjs.Container();
    k.x = z;
    k.y = A;
    C.addChild(k);
    m = new createjs.Container();
    k.addChild(m);
    z = s_oSpriteLibrary.getSprite("line_player");
    g = z.width / 2;
    h = z.height;
    z = new createjs.SpriteSheet({
      images: [z],
      frames: { width: g, height: h, regX: g / 2, regY: h / 2 },
      animations: { off: [0], on: [1], idle: { frames: [0, 1], speed: 0.1 } },
    });
    p = createSprite(z, "off", g / 2, h / 2, g, h);
    p.stop();
    k.addChild(p);
    l = 40;
    n = new CTLText(
      m,
      0,
      0,
      340,
      l,
      30,
      "left",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      c,
      !0,
      !0,
      !1,
      !1
    );
    z = s_oSpriteLibrary.getSprite("score_icon");
    t = createBitmap(z);
    t.regX = z.width / 2;
    t.regY = z.height / 2;
    m.addChild(t);
    q = new CTLText(
      m,
      0,
      0,
      100,
      l,
      30,
      "left",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      "0",
      !0,
      !0,
      !1,
      !1
    );
  };
  this.unload = function () {
    b.removeChild(k);
  };
  this.highlight = function () {
    p.gotoAndStop("on");
    m.alpha = 1;
    createjs.Tween.get(n.getText(), { override: !0, loop: !0 })
      .to({ alpha: 0 }, 500, createjs.Ease.cubicIn)
      .to({ alpha: 1 }, 500, createjs.Ease.cubicOut)
      .wait(500);
  };
  this.enable = function () {
    p.gotoAndStop("on");
    n.setAlpha(1);
    m.alpha = 1;
    createjs.Tween.removeTweens(n.getText());
  };
  this.disable = function () {
    p.gotoAndStop("off");
    n.setAlpha(1);
    m.alpha = 0.15;
    createjs.Tween.removeTweens(n.getText());
  };
  this.setScore = function (z) {
    q.refreshText(z);
  };
  this.setName = function (z) {
    n.refreshText(z);
  };
  this.setPosition = function (z, A, C) {
    k.x = z;
    k.y = A;
    switch (C) {
      case BOTTOM:
        this._setBottom();
        break;
      case TOP:
        this._setTop();
        break;
      case LEFT:
        this._setLeft();
        break;
      case RIGHT:
        this._setRight();
    }
  };
  this._setBottom = function () {
    this._setNormalDir();
    k.rotation = 0;
  };
  this._setTop = function () {
    this._setInverseDir();
    k.rotation = 0;
  };
  this._setLeft = function () {
    this._setNormalDir();
    k.rotation = 90;
  };
  this._setRight = function () {
    this._setInverseDir();
    k.rotation = 90;
  };
  this._setNormalDir = function () {
    n.setAlign("left");
    n.setPos(-g / 2 + f, -l);
    t.x = g / 2 - f - t.getBounds().width / 2;
    t.y = n.getY() + l / 2 - 2;
    q.setAlign("right");
    q.setPos(t.x - t.getBounds().width / 2 - 2, n.getY());
  };
  this._setInverseDir = function () {
    n.setAlign("right");
    n.setPos(g / 2 - f, 4);
    t.x = -g / 2 + f + t.getBounds().width / 2;
    t.y = n.getY() + l / 2 - 2;
    q.setAlign("left");
    q.setPos(t.x + t.getBounds().width / 2 + 2, n.getY());
  };
  this.getTextScorePos = function () {
    return { x: k.x + q.getX(), y: k.y + q.getY() };
  };
  this.setNameColor = function (z) {
    n.setColor(z);
  };
  this._init(a, d, b, e);
}
function CInfoLabel(a, d, b) {
  var e, c;
  this._init = function (f, g, h) {
    e = new createjs.Container();
    e.x = f;
    e.y = g;
    h.addChild(e);
    f = s_oSpriteLibrary.getSprite("info_label");
    g = createBitmap(f);
    g.regX = f.width / 2;
    g.regY = f.height / 2;
    e.addChild(g);
    f = f.width - 20;
    c = new CTLText(
      e,
      -(f / 2),
      -40,
      f,
      80,
      30,
      "center",
      "#fff",
      PRIMARY_FONT,
      1.2,
      0,
      0,
      sprintf(TEXT_PTS_TO_WINNER, 0),
      !0,
      !0,
      !0,
      !1
    );
    this.pulseAnimation();
  };
  this.setOnTop = function () {
    b.setChildIndex(e, b.numChildren - 1);
  };
  this.setPosition = function (f, g, h) {
    e.x = f;
    e.y = g;
  };
  this.setTextScore = function (f) {
    c.refreshText(f);
  };
  this.setVisible = function (f) {
    e.visible = f;
  };
  this.pulseAnimation = function () {
    createjs.Tween.get(e, { loop: !0 })
      .to({ scaleX: 0.9, scaleY: 0.9 }, 850, createjs.Ease.quadOut)
      .to({ scaleX: 1, scaleY: 1 }, 650, createjs.Ease.quadIn);
  };
  this._init(a, d, b);
}
function CMsgBox(a) {
  var d, b, e, c, f, g, h;
  this._init = function (l) {
    d = [];
    b = [];
    e = new createjs.Shape();
    e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    e.alpha = 0;
    e.on("mousedown", function () {});
    l.addChild(e);
    c = new createjs.Container();
    c.alpha = 0;
    c.visible = !1;
    l.addChild(c);
    l = s_oSpriteLibrary.getSprite("msg_box");
    f = createBitmap(l);
    l = f.getBounds();
    f.regX = l.width / 2;
    f.regY = l.height / 2;
    f.x = CANVAS_WIDTH / 2;
    f.y = CANVAS_HEIGHT / 2;
    c.addChild(f);
    g = new CTLText(
      c,
      CANVAS_WIDTH / 2 - 250,
      CANVAS_HEIGHT / 2 - 50 - 75,
      500,
      150,
      50,
      "center",
      "#fff",
      PRIMARY_FONT,
      1,
      0,
      0,
      " ",
      !0,
      !0,
      !0,
      !1
    );
    l = s_oSpriteLibrary.getSprite("but_home");
    h = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 170, l, c);
    h.addEventListener(ON_MOUSE_DOWN, this._onExit, this);
  };
  this.unload = function () {
    h.unload();
    e.removeAllEventListeners();
    c.removeAllEventListeners();
    a.removeChild(e);
    a.removeChild(c);
  };
  this.addEventListener = function (l, k, m) {
    d[l] = k;
    b[l] = m;
  };
  this.show = function (l) {
    playSound("game_over", 1, !1);
    c.visible = !0;
    g.refreshText(l.toUpperCase());
    createjs.Tween.get(e).to({ alpha: 0.7 }, 500);
    createjs.Tween.get(c).to({ alpha: 1 }, 500);
  };
  this._onExit = function () {
    d[ON_HOME] && d[ON_HOME].call(b[ON_HOME]);
  };
  this.isShown = function () {
    return c.visible;
  };
  this._init(a);
}
var PREFIX_GAME = "4colors_",
  s_bStorageAvailable = !0,
  s_bEnableAnim = !0;
function CLocalSavings() {
  this._init = function () {
    try {
      this.saveItem("ls_available", "ok");
    } catch (a) {
      s_bStorageAvailable = !1;
      return;
    }
    s_bEnableAnim = this.getSkipAnim();
  };
  this.saveSkipAnim = function () {
    s_bStorageAvailable &&
      this.saveItem(PREFIX_GAME + "skip_anim", s_bEnableAnim);
  };
  this.getSkipAnim = function () {
    if (!s_bStorageAvailable) return s_bEnableAnim;
    var a = this.getItem(PREFIX_GAME + "skip_anim");
    a = a ? ("true" === a ? !0 : !1) : s_bEnableAnim;
    console.log(a);
    return a;
  };
  this.saveItem = function (a, d) {
    s_bStorageAvailable && localStorage.setItem(a, d);
  };
  this.getItem = function (a) {
    return s_bStorageAvailable ? localStorage.getItem(a) : null;
  };
  this._init();
}
var LANG_WIDTH = 71,
  LANG_HEIGHT = 71;
function CButLang(a, d, b, e, c, f) {
  var g = e,
    h,
    l,
    k,
    m,
    p,
    n;
  this._init = function (q, t, z, A) {
    h = [];
    l = [];
    n = new createjs.Container();
    n.x = q;
    n.y = t;
    m = n.on("mousedown", this._onPress, this);
    k = n.on("click", this._onChangeLang, this);
    f.addChild(n);
    q = {};
    for (t = 0; t < z; t++) q["lang_" + t] = t;
    z = new createjs.SpriteSheet({
      images: [A],
      frames: { width: LANG_WIDTH, height: LANG_HEIGHT },
      animations: q,
    });
    p = createSprite(z, "lang_" + g, 0, 0, LANG_WIDTH, LANG_HEIGHT);
    n.addChild(p);
    n.regX = LANG_WIDTH / 2;
    n.regY = LANG_HEIGHT / 2;
  };
  this.unload = function () {
    n.off("mousedown", m);
    n.off("click", k);
  };
  this.addEventListener = function (q, t, z) {
    h[q] = t;
    l[q] = z;
  };
  this.setPosition = function (q, t) {
    n.x = q;
    n.y = t;
  };
  this.setLang = function (q) {
    g = q;
    p.gotoAndStop("lang_" + g);
  };
  this._onPress = function () {
    n.scale = 0.9;
  };
  this._onChangeLang = function () {
    n.scale = 1;
    h[ON_SELECT_LANG] && h[ON_SELECT_LANG].call(l[ON_SELECT_LANG], g);
  };
  this.getButtonImage = function () {
    return n;
  };
  this._init(a, d, b, c);
}
var NUM_ITEMS_PER_COLS = 4;
function CLangPanel(a) {
  var d,
    b,
    e,
    c,
    f,
    g,
    h,
    l,
    k,
    m,
    p,
    n = this;
  this._init = function () {
    d = [];
    b = [];
    p = new createjs.Container();
    p.visible = !1;
    a.addChild(p);
    l = new createjs.Shape();
    l.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    f = l.on("click", function () {});
    p.addChild(l);
    k = new createjs.Container();
    k.x = CANVAS_WIDTH / 2;
    k.y = CANVAS_HEIGHT / 2;
    p.addChild(k);
    g = s_oSpriteLibrary.getSprite("msg_box");
    var q = createBitmap(g);
    k.addChild(q);
    this._placeLanguages();
    h = new CGfxButton(g.width, 0, s_oSpriteLibrary.getSprite("but_exit"), k);
    h.addEventListener(ON_MOUSE_UP, this.hide, this);
    k.regX = g.width / 2;
    k.regY = g.height / 2;
  };
  this.unload = function () {
    h.unload();
    l.off("click", f);
    for (var q = 0; q < e.length; q++) e[q].off("click", c[q]);
  };
  this.addEventListener = function (q, t, z) {
    d[q] = t;
    b[q] = z;
  };
  this.show = function () {
    p.visible = !0;
    l.alpha = 0;
    createjs.Tween.get(l).to({ alpha: 0.7 }, 400, createjs.Ease.cubicOut);
    k.scaleX = k.scaleY = 0.01;
    k.alpha = 0;
    createjs.Tween.get(k)
      .wait(400)
      .to({ scale: 1, alpha: 1 }, 1e3, createjs.Ease.elasticOut);
  };
  this.hide = function () {
    createjs.Tween.get(l).to({ alpha: 0 }, 400, createjs.Ease.cubicOut);
    createjs.Tween.get(k)
      .to({ scaleX: 0.1, scaleY: 0.1, alpha: 0.5 }, 400, createjs.Ease.backIn)
      .call(function () {
        p.visible = !1;
      });
  };
  this._placeLanguages = function () {
    m = new createjs.Container();
    m.x = g.width / 2;
    m.y = g.height / 2;
    k.addChild(m);
    for (
      var q = s_oSpriteLibrary.getSprite("but_lang"), t = {}, z = 0;
      z < NUM_LANGUAGES;
      z++
    )
      t["lang_" + z] = z;
    q = new createjs.SpriteSheet({
      images: [q],
      frames: {
        width: LANG_WIDTH,
        height: LANG_HEIGHT,
        regX: LANG_WIDTH / 2,
        regY: LANG_HEIGHT / 2,
      },
      animations: t,
    });
    z = t = 0;
    e = [];
    c = [];
    for (var A = 0, C = 0; C < NUM_LANGUAGES; C++) {
      var w = createSprite(
        q,
        "lang_" + C,
        LANG_WIDTH / 2,
        LANG_HEIGHT / 2,
        LANG_WIDTH,
        LANG_HEIGHT
      );
      w.x = t;
      w.y = z;
      w.on("mousedown", this._onPressLang, this, !1, C);
      c[C] = w.on("click", this._onSelectLang, this, !1, C);
      m.addChild(w);
      e.push(w);
      A++;
      0 < C && 0 === A % NUM_ITEMS_PER_COLS
        ? ((t = 0), (z += LANG_HEIGHT + 10))
        : (t += LANG_WIDTH + 10);
    }
    m.regX = (LANG_WIDTH * NUM_ITEMS_PER_COLS) / 2 - LANG_WIDTH / 2;
    m.regY = z - 130;
  };
  this._onPressLang = function (q, t) {
    e[t].scale = 0.9;
  };
  this._onSelectLang = function (q, t) {
    e[t].scale = 1;
    d[ON_SELECT_LANG] && d[ON_SELECT_LANG].call(b[ON_SELECT_LANG], t);
    n.hide();
  };
  this._init();
}
function CMoveTimeController(a, d, b, e) {
  var c, f, g, h, l, k, m, p, n, q, t;
  this._init = function () {
    c = [];
    f = [];
    l = e;
    h = null;
    p = 0;
    n = new createjs.Container();
    n.x = a;
    n.y = d;
    n.visible = !1;
    b.addChild(n);
    t = new createjs.Container();
    t.x = a;
    t.y = d;
    t.alpha = 0;
    b.addChild(t);
    g = [];
    var A = s_oSpriteLibrary.getSprite("attempt"),
      C = A.width / 2,
      w = A.height;
    A = new createjs.SpriteSheet({
      images: [A],
      frames: { width: C, height: w, regX: C / 2, regY: w / 2 },
      animations: { off: [0], on: [1] },
    });
    for (
      var B = TIME_CONTROLLER_RADIUS + C / 2 + 10,
        u = TIME_CONTROLLER_RADIUS - w / 2,
        r = 0;
      r < NUM_ATTEMPT;
      r++
    ) {
      var y = createSprite(A, "off", C / 2, w / 2, C, w);
      y.x = B + r * C;
      y.y = u;
      t.addChild(y);
      g.push(y);
    }
    q = new CRadialWipeWidget(0, 0, n);
  };
  this.unload = function () {
    b.removeChild(n);
    b.removeChild(t);
    this.stopTimer();
  };
  this.setPos = function (A, C) {
    n.x = A;
    n.y = C;
    t.x = A;
    t.y = C;
  };
  this.setScale = function (A) {
    q.setScale(A);
  };
  this.setSpectatorMode = function () {
    q.removeHurryUpMode();
  };
  this.setAlwaysShown = function () {
    q.alwaysShown();
  };
  this.showAttempt = function (A) {
    t.visible = A;
  };
  this.addEventListener = function (A, C, w) {
    c[A] = C;
    f[A] = w;
  };
  this.restartEndGameCounter = function () {
    p = 0;
    l = e;
    this.stopTimer();
    for (var A = 0; A < g.length; A++) g[A].gotoAndStop("off");
  };
  this.startTimer = function () {
    q.setHurryUpMode(TIME_HURRYUP_WARNING);
    m = k = l;
    null === h &&
      ((n.visible = !0),
      createjs.Tween.removeTweens(t),
      (t.alpha = 1),
      (h = setInterval(function () {
        z.update();
      }, FPS_TIME)));
  };
  this.stopTimer = function () {
    this._resetTime();
    t.alpha = 0;
  };
  this._resetTime = function () {
    clearInterval(h);
    h = null;
    q.reset();
    n.visible = !1;
  };
  this._onTimerEnd = function () {
    g[p].gotoAndStop("on");
    createjs.Tween.get(t, { override: !0 }).to({ alpha: 0 }, 1e3);
    playSound("attempt_failed", 1, !1);
    this._resetTime();
    p++;
    var A = p === NUM_ATTEMPT ? ON_LAST_TIMER_END : ON_TIMER_END;
    c[A] && c[A].call(f[A]);
  };
  this.update = function () {
    m -= s_iTimeElaps;
    0 > m && (this._onTimerEnd(), (m = 0), clearInterval(h));
    q.update(m, k);
  };
  this._init();
  var z = this;
}
