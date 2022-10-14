pc.SpriteAnimationClip.prototype._onSpriteAssetLoad = function (t) {
  if (!t) return !1;
  if (t.resource)
    if (t.resource.atlas) this.sprite = t.resource;
    else {
      var e = t.data.textureAtlasAsset,
        s = this._component.system.app.assets;
      s.off('load:' + e, this._onTextureAtlasLoad, this),
        s.once('load:' + e, this._onTextureAtlasLoad, this);
    }
  else this.sprite = null;
};
pc.extend(
  pc,
  (function () {
    var TweenManager = function (t) {
      (this._app = t), (this._tweens = []), (this._add = []);
    };
    TweenManager.prototype = {
      add: function (t) {
        return this._add.push(t), t;
      },
      update: function (t) {
        for (var i = 0, e = this._tweens.length; i < e; )
          this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
        this._add.length &&
          ((this._tweens = this._tweens.concat(this._add)), (this._add.length = 0));
      },
    };
    var Tween = function (t, i, e) {
        pc.events.attach(this),
          (this.manager = i),
          e && (this.entity = null),
          (this.time = 0),
          (this.complete = !1),
          (this.playing = !1),
          (this.stopped = !0),
          (this.pending = !1),
          (this.target = t),
          (this.duration = 0),
          (this._currentDelay = 0),
          (this.timeScale = 1),
          (this._reverse = !1),
          (this._delay = 0),
          (this._yoyo = !1),
          (this._count = 0),
          (this._numRepeats = 0),
          (this._repeatDelay = 0),
          (this._from = !1),
          (this._slerp = !1),
          (this._fromQuat = new pc.Quat()),
          (this._toQuat = new pc.Quat()),
          (this._quat = new pc.Quat()),
          (this.easing = pc.Linear),
          (this._sv = {}),
          (this._ev = {});
      },
      _parseProperties = function (t) {
        var i;
        return (
          t instanceof pc.Vec2
            ? (i = {
                x: t.x,
                y: t.y,
              })
            : t instanceof pc.Vec3
            ? (i = {
                x: t.x,
                y: t.y,
                z: t.z,
              })
            : t instanceof pc.Vec4 || t instanceof pc.Quat
            ? (i = {
                x: t.x,
                y: t.y,
                z: t.z,
                w: t.w,
              })
            : t instanceof pc.Color
            ? ((i = {
                r: t.r,
                g: t.g,
                b: t.b,
              }),
              void 0 !== t.a && (i.a = t.a))
            : (i = t),
          i
        );
      };
    Tween.prototype = {
      to: function (t, i, e, n, s, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          n && this.delay(n),
          s && this.repeat(s),
          r && this.yoyo(r),
          this
        );
      },
      from: function (t, i, e, n, s, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          n && this.delay(n),
          s && this.repeat(s),
          r && this.yoyo(r),
          (this._from = !0),
          this
        );
      },
      rotate: function (t, i, e, n, s, r) {
        return (
          (this._properties = _parseProperties(t)),
          (this.duration = i),
          e && (this.easing = e),
          n && this.delay(n),
          s && this.repeat(s),
          r && this.yoyo(r),
          (this._slerp = !0),
          this
        );
      },
      start: function () {
        var t, i, e, n;
        if (
          ((this.playing = !0),
          (this.complete = !1),
          (this.stopped = !1),
          (this._count = 0),
          (this.pending = this._delay > 0),
          this._reverse && !this.pending ? (this.time = this.duration) : (this.time = 0),
          this._from)
        ) {
          for (t in this._properties)
            this._properties.hasOwnProperty(t) &&
              ((this._sv[t] = this._properties[t]), (this._ev[t] = this.target[t]));
          this._slerp &&
            (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z),
            (i = void 0 !== this._properties.x ? this._properties.x : this.target.x),
            (e = void 0 !== this._properties.y ? this._properties.y : this.target.y),
            (n = void 0 !== this._properties.z ? this._properties.z : this.target.z),
            this._fromQuat.setFromEulerAngles(i, e, n));
        } else {
          for (t in this._properties)
            this._properties.hasOwnProperty(t) &&
              ((this._sv[t] = this.target[t]), (this._ev[t] = this._properties[t]));
          this._slerp &&
            (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z),
            (i = void 0 !== this._properties.x ? this._properties.x : this.target.x),
            (e = void 0 !== this._properties.y ? this._properties.y : this.target.y),
            (n = void 0 !== this._properties.z ? this._properties.z : this.target.z),
            this._toQuat.setFromEulerAngles(i, e, n));
        }
        return (this._currentDelay = this._delay), this.manager.add(this), this;
      },
      pause: function () {
        this.playing = !1;
      },
      resume: function () {
        this.playing = !0;
      },
      stop: function () {
        (this.playing = !1), (this.stopped = !0);
      },
      delay: function (t) {
        return (this._delay = t), (this.pending = !0), this;
      },
      repeat: function (t, i) {
        return (this._count = 0), (this._numRepeats = t), (this._repeatDelay = i || 0), this;
      },
      loop: function (t) {
        return t ? ((this._count = 0), (this._numRepeats = 1 / 0)) : (this._numRepeats = 0), this;
      },
      yoyo: function (t) {
        return (this._yoyo = t), this;
      },
      reverse: function () {
        return (this._reverse = !this._reverse), this;
      },
      chain: function () {
        for (var t = arguments.length; t--; )
          t > 0 ? (arguments[t - 1]._chained = arguments[t]) : (this._chained = arguments[t]);
        return this;
      },
      update: function (t) {
        if (this.stopped) return !1;
        if (!this.playing) return !0;
        if (
          (!this._reverse || this.pending
            ? (this.time += t * this.timeScale)
            : (this.time -= t * this.timeScale),
          this.pending)
        ) {
          if (!(this.time > this._currentDelay)) return !0;
          this._reverse
            ? (this.time = this.duration - (this.time - this._currentDelay))
            : (this.time = this.time - this._currentDelay),
            (this.pending = !1);
        }
        var i = 0;
        ((!this._reverse && this.time > this.duration) || (this._reverse && this.time < 0)) &&
          (this._count++,
          (this.complete = !0),
          (this.playing = !1),
          this._reverse
            ? ((i = this.duration - this.time), (this.time = 0))
            : ((i = this.time - this.duration), (this.time = this.duration)));
        var e,
          n,
          s = this.time / this.duration,
          r = this.easing(s);
        for (var h in this._properties)
          this._properties.hasOwnProperty(h) &&
            ((e = this._sv[h]), (n = this._ev[h]), (this.target[h] = e + (n - e) * r));
        if (
          (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r),
          this.entity &&
            (this.entity._dirtifyLocal(),
            this.element &&
              this.entity.element &&
              (this.entity.element[this.element] = this.target),
            this._slerp && this.entity.setLocalRotation(this._quat)),
          this.fire('update', t),
          this.complete)
        ) {
          var a = this._repeat(i);
          return (
            a
              ? this.fire('loop')
              : (this.fire('complete', i),
                this.entity && this.entity.off('destroy', this.stop, this),
                this._chained && this._chained.start()),
            a
          );
        }
        return !0;
      },
      _repeat: function (t) {
        if (this._count < this._numRepeats) {
          if (
            (this._reverse ? (this.time = this.duration - t) : (this.time = t),
            (this.complete = !1),
            (this.playing = !0),
            (this._currentDelay = this._repeatDelay),
            (this.pending = !0),
            this._yoyo)
          ) {
            for (var i in this._properties) {
              var e = this._sv[i];
              (this._sv[i] = this._ev[i]), (this._ev[i] = e);
            }
            this._slerp &&
              (this._quat.copy(this._fromQuat),
              this._fromQuat.copy(this._toQuat),
              this._toQuat.copy(this._quat));
          }
          return !0;
        }
        return !1;
      },
    };
    var BounceIn = function (t) {
        return 1 - BounceOut(1 - t);
      },
      BounceOut = function (t) {
        return t < 1 / 2.75
          ? 7.5625 * t * t
          : t < 2 / 2.75
          ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
          : t < 2.5 / 2.75
          ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
          : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      };
    return {
      TweenManager: TweenManager,
      Tween: Tween,
      Linear: function (t) {
        return t;
      },
      QuadraticIn: function (t) {
        return t * t;
      },
      QuadraticOut: function (t) {
        return t * (2 - t);
      },
      QuadraticInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
      },
      CubicIn: function (t) {
        return t * t * t;
      },
      CubicOut: function (t) {
        return --t * t * t + 1;
      },
      CubicInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
      },
      QuarticIn: function (t) {
        return t * t * t * t;
      },
      QuarticOut: function (t) {
        return 1 - --t * t * t * t;
      },
      QuarticInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2);
      },
      QuinticIn: function (t) {
        return t * t * t * t * t;
      },
      QuinticOut: function (t) {
        return --t * t * t * t * t + 1;
      },
      QuinticInOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2);
      },
      SineIn: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos((t * Math.PI) / 2);
      },
      SineOut: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : Math.sin((t * Math.PI) / 2);
      },
      SineInOut: function (t) {
        return 0 === t ? 0 : 1 === t ? 1 : 0.5 * (1 - Math.cos(Math.PI * t));
      },
      ExponentialIn: function (t) {
        return 0 === t ? 0 : Math.pow(1024, t - 1);
      },
      ExponentialOut: function (t) {
        return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
      },
      ExponentialInOut: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (t *= 2) < 1
          ? 0.5 * Math.pow(1024, t - 1)
          : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
      },
      CircularIn: function (t) {
        return 1 - Math.sqrt(1 - t * t);
      },
      CircularOut: function (t) {
        return Math.sqrt(1 - --t * t);
      },
      CircularInOut: function (t) {
        return (t *= 2) < 1
          ? -0.5 * (Math.sqrt(1 - t * t) - 1)
          : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
      },
      BackIn: function (t) {
        var i = 1.70158;
        return t * t * ((i + 1) * t - i);
      },
      BackOut: function (t) {
        var i = 1.70158;
        return --t * t * ((i + 1) * t + i) + 1;
      },
      BackInOut: function (t) {
        var i = 2.5949095;
        return (t *= 2) < 1
          ? t * t * ((i + 1) * t - i) * 0.5
          : 0.5 * ((t -= 2) * t * ((i + 1) * t + i) + 2);
      },
      BounceIn: BounceIn,
      BounceOut: BounceOut,
      BounceInOut: function (t) {
        return t < 0.5 ? 0.5 * BounceIn(2 * t) : 0.5 * BounceOut(2 * t - 1) + 0.5;
      },
      ElasticIn: function (t) {
        var i,
          e = 0.1;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1 ? ((e = 1), (i = 0.1)) : (i = (0.4 * Math.asin(1 / e)) / (2 * Math.PI)),
            -e * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - i) * (2 * Math.PI)) / 0.4));
      },
      ElasticOut: function (t) {
        var i,
          e = 0.1;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1 ? ((e = 1), (i = 0.1)) : (i = (0.4 * Math.asin(1 / e)) / (2 * Math.PI)),
            e * Math.pow(2, -10 * t) * Math.sin(((t - i) * (2 * Math.PI)) / 0.4) + 1);
      },
      ElasticInOut: function (t) {
        var i,
          e = 0.1,
          n = 0.4;
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (!e || e < 1 ? ((e = 1), (i = 0.1)) : (i = (n * Math.asin(1 / e)) / (2 * Math.PI)),
            (t *= 2) < 1
              ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - i) * (2 * Math.PI)) / n) * -0.5
              : e * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - i) * (2 * Math.PI)) / n) * 0.5 +
                1);
      },
    };
  })()
),
  (function () {
    (pc.Application.prototype.addTweenManager = function () {
      (this._tweenManager = new pc.TweenManager(this)),
        this.on('update', function (t) {
          this._tweenManager.update(t);
        });
    }),
      (pc.Application.prototype.tween = function (t) {
        return new pc.Tween(t, this._tweenManager);
      }),
      (pc.Entity.prototype.tween = function (t, i) {
        var e = this._app.tween(t);
        return (
          (e.entity = this),
          this.once('destroy', e.stop, e),
          i && i.element && (e.element = i.element),
          e
        );
      });
    var t = pc.Application.getApplication();
    t && t.addTweenManager();
  })();
var Utils = {
  prefix: 'venge',
  prefixCDN: 'https://assets.venge.io/',
  prefixMapCDN: 'https://maps.venge.io/',
  variables: {
    floatingIndex: 0,
  },
  currentNameIndex: 1,
  nameIndex: [],
  zeroVector: new pc.Vec3(0, 0, 0),
  heightVector: new pc.Vec3(0, -5, 0),
  nullVector: new pc.Vec3(0, -100, 0),
  whiteColor: new pc.Color(1, 1, 1),
  getAssetFromURL: function (e, t) {
    var r = new pc.Asset(e, 'texture', {
        url: '',
      }),
      n = new pc.Texture(pc.app.graphicsDevice),
      o = new Image();
    return (
      (o.crossOrigin = 'anonymous'),
      (o.onload = function () {
        this && (n.setSource(this), n.upload(), (r.loaded = !0));
      }),
      (o.src = 'map' == t ? Utils.prefixMapCDN + e : Utils.prefixCDN + e),
      (r.resource = n),
      pc.app.assets.add(r),
      r
    );
  },
  parseFloat: function (e) {
    return 5 * parseFloat(parseFloat(e).toFixed(1));
  },
  triggerAction: function (e) {
    var t = e.split(', ');
    if (t.length > 0)
      for (var r in t) {
        var n = t[r],
          o = n.split('@');
        if (o.length > 1) {
          var a = o[0],
            i = o[1];
          pc.app.fire(a, i);
        } else pc.app.fire(n);
      }
  },
  hex2RGB: function (e) {
    var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    return t
      ? {
          r: parseInt(t[1], 16) / 255,
          g: parseInt(t[2], 16) / 255,
          b: parseInt(t[3], 16) / 255,
        }
      : null;
  },
  generateId: function (number) {
    var _number = (Math.random() + 1).toString(36).substring(7);
    return eval(number);
  },
  encodeFloat: function (e) {
    return 5 * parseFloat(parseFloat(e).toFixed(1));
  },
  decodeFloat: function (e) {
    return e / 5;
  },
  lookAt: function (e, t, r, n) {
    return Math.atan2(r - e, n - t);
  },
  distance: function (e, t, r, n) {
    return Math.sqrt(Math.pow(e - r, 2) + Math.pow(t - n, 2));
  },
  toDeg: function (e) {
    return e * (180 / Math.PI);
  },
  toRad: function (e) {
    return e * (Math.PI / 180);
  },
  lerp: function (e, t, r) {
    var n = (1 - r) * e + r * t;
    return isNaN(n) ? 0 : Math.abs(n - e) > 50 ? t : n;
  },
  rotate: function (e, t, r) {
    return e + this.shortAngleDist(e, t) * r;
  },
  shortcutName: function (e) {
    return e ? e.replace('-Grenade', '') : '';
  },
  onlyUsername: function (e) {
    var t = e.split('[/color]]'),
      r = e.split('[/rainbow]');
    return t.length > 1 ? t[1].trim() : r.length > 1 ? r[1].trim() : t[0].trim();
  },
  rainbowIndex: 0,
  colors: [
    'FF0E0E',
    'FF6000',
    'FFCA00',
    'BFFF00',
    '2AFF00',
    '00FF60',
    '00FFBF',
    '00D4FF',
    '0055FF',
    '0000FF',
    '6000FF',
    'BF00FF',
    'FF00D4',
    'FF0075',
    'FF004A',
  ],
  usernames: [],
  preprocessUsername: function (e, t) {
    return (
      t && !t.originalText
        ? ((t.originalText = e), this.usernames.push(t))
        : (e = Utils.convertRainbow(e)),
      e
    );
  },
  updateUsernames: function () {
    for (var e in this.usernames) {
      var t = this.usernames[e];
      this.updateUsername(t);
    }
    this.rainbowIndex++,
      clearTimeout(this.usernameTimeout),
      (this.usernameTimeout = setTimeout(
        function (e) {
          e.updateUsernames();
        },
        50,
        this
      ));
  },
  updateUsername: function (e) {
    e.text = Utils.convertRainbow(e.originalText);
  },
  convertRainbow: function (e) {
    if (!e) return e;
    var t = this,
      r = e.match(/\[rainbow\](.*?)\[\/rainbow\](.*?)/);
    return r && r.length > 0
      ? ((r = (r = (r = r[1]).split(''))
          .map(function (e, r) {
            return (
              '[color="#' +
              t.colors[(t.rainbowIndex + r) % t.colors.length] +
              '"]' +
              e.replace('[', '').replace(']', '') +
              '[/color]'
            );
          })
          .join('')),
        e.replace(/\[rainbow\](.*?)\[\/rainbow\](.*?)/, '\\[' + r + ']'))
      : e;
  },
  displayUsername: function (e, t) {
    var r = 1;
    return (
      Utils.nameIndex[e]
        ? (r = Utils.nameIndex[e])
        : (Utils.currentNameIndex++, (Utils.nameIndex[e] = Utils.currentNameIndex + '')),
      pc.settings && !0 === pc.settings.hideUsernames
        ? 'HIDDEN' + r
        : Utils.preprocessUsername(e, t)
    );
  },
  cleanUsername: function (e) {
    return e
      .replace(/\[color="(.*?)"\]/g, '')
      .replace(/\[\/color]/g, '')
      .replace(/\\/g, '')
      .trim();
  },
  clearName: function (e) {
    return e ? e.replace('_', '.').replace('Ammo-', '') : '';
  },
  clearId: function (e) {
    return e ? e.replace('Ammo-', '') : '';
  },
  slug: function (e) {
    if (!e) return '';
    e = (e = e.replace(/^\s+|\s+$/g, '')).toLowerCase();
    for (var t = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;', r = 0, n = t.length; r < n; r++)
      e = e.replace(new RegExp(t.charAt(r), 'g'), 'aaaaeeeeiiiioooouuuunc------'.charAt(r));
    return (e = e
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'));
  },
  shortAngleDist: function (e, t) {
    var r = 2 * Math.PI,
      n = (t - e) % r;
    return ((2 * n) % r) - n;
  },
  float: function (e) {
    return isNaN(e) ? 0 : e.toFixed(3);
  },
  pad: function (e, t) {
    return ('000' + e).slice(-3);
  },
  mmssmm: function (e) {
    var t = e,
      r = Math.floor((1e3 * t) % 1e3),
      n = Math.floor(t % 60),
      o = Math.floor(((1e3 * t) / 6e4) % 60),
      a = 'MM:SS:XX';
    return (
      n < 10 && (n = '0' + n),
      o < 10 && (o = '0' + o),
      r < 100 && (r = '0' + r),
      (a = (a = (a = a.replace(/MM/, o)).replace(/SS/, n)).replace(/XX/, r.toString().slice(0, 2)))
    );
  },
  mmss: function (e) {
    var t = e,
      r = Math.floor((1e3 * t) % 1e3),
      n = Math.floor(t % 60),
      o = Math.floor(((1e3 * t) / 6e4) % 60),
      a = 'MM:SS';
    return (
      n < 10 && (n = '0' + n),
      o < 10 && (o = '0' + o),
      r < 100 && (r = '0' + r),
      (a = (a = a.replace(/MM/, o)).replace(/SS/, n)),
      e >= 0 ? a : '00:00'
    );
  },
  isLocalStorageSupported: function () {
    var e = !1,
      t = 'localStorageSupportTest';
    try {
      localStorage.setItem(t, t), localStorage.removeItem(t), (e = !0);
    } catch (t) {
      e = !1;
    }
    return e;
  },
  setItem: function (e, t) {
    this.isLocalStorageSupported() ? window.localStorage.setItem(e, t) : this.createCookie(e, t);
  },
  getItem: function (e) {
    return this.isLocalStorageSupported() ? window.localStorage.getItem(e) : this.readCookie(e);
  },
  deleteItem: function (e) {
    this.isLocalStorageSupported() ? window.localStorage.removeItem(e) : this.createCookie(e, '');
  },
  createCookie: function (e, t, r) {
    if (r) {
      var n = new Date();
      n.setTime(n.getTime() + 24 * r * 60 * 60 * 1e3);
      var o = '; expires=' + n.toGMTString();
    } else o = '';
    document.cookie = e + '=' + t + o + '; path=/';
  },
  readCookie: function (e) {
    for (var t = e + '=', r = document.cookie.split(';'), n = 0; n < r.length; n++) {
      for (var o = r[n]; ' ' == o.charAt(0); ) o = o.substring(1, o.length);
      if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
    }
    return null;
  },
  shuffle: function (e) {
    var t, r, n;
    for (n = e.length - 1; n > 0; n--)
      (t = Math.floor(Math.random() * (n + 1))), (r = e[n]), (e[n] = e[t]), (e[t] = r);
    return e;
  },
  isMobile: function () {
    return !(!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && !pc.isMobile);
  },
  isIOS: function () {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform);
  },
  number: function (e, t) {
    return e ? parseInt(e) : t;
  },
  getURLParams: function (e, t) {
    t || (t = location.href), (e = e.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'));
    var r = new RegExp('[\\?&]' + e + '=([^&#]*)').exec(t);
    return null == r ? null : r[1];
  },
  closestPointLine: function (e, t, r) {
    var n = r.x - t.x,
      o = r.y - t.y,
      a = n * n + o * o,
      i = (e.x - t.x) * n + (e.y - t.y) * o,
      c = Math.min(1, Math.max(0, i / a));
    return (
      (i = (r.x - t.x) * (e.y - t.y) - (r.y - t.y) * (e.x - t.x)),
      {
        point: {
          x: t.x + n * c,
          y: t.y + o * c,
        },
        left: i < 1,
        dot: i,
        t: c,
      }
    );
  },
  copyToClipboard: function (e) {
    if (window.clipboardData && window.clipboardData.setData)
      return clipboardData.setData('Text', e);
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      var t = document.createElement('textarea');
      (t.textContent = e), (t.style.position = 'fixed'), document.body.appendChild(t), t.select();
      try {
        return document.execCommand('copy');
      } catch (e) {
        return console.warn('Copy to clipboard failed.', e), !1;
      } finally {
        document.body.removeChild(t);
      }
    }
  },
};
Utils.updateUsernames();
var setMat4Forward = (function () {
  var e, t, r;
  return (
    (e = new pc.Vec3()),
    (t = new pc.Vec3()),
    (r = new pc.Vec3()),
    function (n, o, a) {
      r.copy(o).scale(-1), t.copy(a).normalize(), e.cross(t, r).normalize(), t.cross(r, e);
      var i = n.data;
      return (
        (i[0] = e.x),
        (i[1] = e.y),
        (i[2] = e.z),
        (i[3] = 0),
        (i[4] = t.x),
        (i[5] = t.y),
        (i[6] = t.z),
        (i[7] = 0),
        (i[8] = r.x),
        (i[9] = r.y),
        (i[10] = r.z),
        (i[11] = 0),
        (i[15] = 1),
        n
      );
    }
  );
})();
pc.setFromNormal = function (e) {
  var t = new pc.Mat4(),
    r = new pc.Quat();
  return setMat4Forward(t, e, pc.Vec3.UP), r.setFromMat4(t), r.getEulerAngles();
};
var keyboardMap = [
  '',
  '',
  '',
  'CANCEL',
  '',
  '',
  'HELP',
  '',
  'BACK_SPACE',
  'TAB',
  '',
  '',
  'CLEAR',
  'ENTER',
  'ENTER_SPECIAL',
  '',
  'SHIFT',
  'CONTROL',
  'ALT',
  'PAUSE',
  'CAPS_LOCK',
  'KANA',
  'EISU',
  'JUNJA',
  'FINAL',
  'HANJA',
  '',
  'ESCAPE',
  'CONVERT',
  'NONCONVERT',
  'ACCEPT',
  'MODECHANGE',
  'SPACE',
  'PAGE_UP',
  'PAGE_DOWN',
  'END',
  'HOME',
  'LEFT',
  'UP',
  'RIGHT',
  'DOWN',
  'SELECT',
  'PRINT',
  'EXECUTE',
  'PRINTSCREEN',
  'INSERT',
  'DELETE',
  '',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'COLON',
  'SEMICOLON',
  'LESS_THAN',
  'EQUALS',
  'GREATER_THAN',
  'QUESTION_MARK',
  'AT',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'OS_KEY',
  '',
  'CONTEXT_MENU',
  '',
  'SLEEP',
  'NUMPAD0',
  'NUMPAD1',
  'NUMPAD2',
  'NUMPAD3',
  'NUMPAD4',
  'NUMPAD5',
  'NUMPAD6',
  'NUMPAD7',
  'NUMPAD8',
  'NUMPAD9',
  'MULTIPLY',
  'ADD',
  'SEPARATOR',
  'SUBTRACT',
  'DECIMAL',
  'DIVIDE',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
  'F21',
  'F22',
  'F23',
  'F24',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'NUM_LOCK',
  'SCROLL_LOCK',
  'WIN_OEM_FJ_JISHO',
  'WIN_OEM_FJ_MASSHOU',
  'WIN_OEM_FJ_TOUROKU',
  'WIN_OEM_FJ_LOYA',
  'WIN_OEM_FJ_ROYA',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'CIRCUMFLEX',
  'EXCLAMATION',
  'DOUBLE_QUOTE',
  'HASH',
  'DOLLAR',
  'PERCENT',
  'AMPERSAND',
  'UNDERSCORE',
  'OPEN_PAREN',
  'CLOSE_PAREN',
  'ASTERISK',
  'PLUS',
  'PIPE',
  'HYPHEN_MINUS',
  'OPEN_CURLY_BRACKET',
  'CLOSE_CURLY_BRACKET',
  'TILDE',
  '',
  '',
  '',
  '',
  'VOLUME_MUTE',
  'VOLUME_DOWN',
  'VOLUME_UP',
  '',
  '',
  'SEMICOLON',
  'EQUALS',
  'COMMA',
  'MINUS',
  'PERIOD',
  'SLASH',
  'BACK_QUOTE',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'OPEN_BRACKET',
  'BACK_SLASH',
  'CLOSE_BRACKET',
  'QUOTE',
  '',
  'META',
  'ALTGR',
  '',
  'WIN_ICO_HELP',
  'WIN_ICO_00',
  '',
  'WIN_ICO_CLEAR',
  '',
  '',
  'WIN_OEM_RESET',
  'WIN_OEM_JUMP',
  'WIN_OEM_PA1',
  'WIN_OEM_PA2',
  'WIN_OEM_PA3',
  'WIN_OEM_WSCTRL',
  'WIN_OEM_CUSEL',
  'WIN_OEM_ATTN',
  'WIN_OEM_FINISH',
  'WIN_OEM_COPY',
  'WIN_OEM_AUTO',
  'WIN_OEM_ENLW',
  'WIN_OEM_BACKTAB',
  'ATTN',
  'CRSEL',
  'EXSEL',
  'EREOF',
  'PLAY',
  'ZOOM',
  '',
  'PA1',
  'WIN_OEM_CLEAR',
  '',
];
var Movement = pc.createScript('movement');
Movement.attributes.add('defaultSpeed', {
  type: 'number',
}),
  Movement.attributes.add('defaultSensitivity', {
    type: 'number',
  }),
  Movement.attributes.add('focusSensitivity', {
    type: 'number',
  }),
  Movement.attributes.add('defaultLookSense', {
    type: 'number',
  }),
  Movement.attributes.add('focusLookSense', {
    type: 'number',
  }),
  Movement.attributes.add('focusSpeedFactor', {
    type: 'number',
  }),
  Movement.attributes.add('strafingSpeed', {
    type: 'number',
  }),
  Movement.attributes.add('nearGround', {
    type: 'number',
    default: 4,
  }),
  Movement.attributes.add('collisionHeight', {
    type: 'number',
  }),
  Movement.attributes.add('airHeight', {
    type: 'number',
  }),
  Movement.attributes.add('groundFriction', {
    type: 'number',
    default: 0.8,
  }),
  Movement.attributes.add('slideHopFriction', {
    type: 'number',
    default: 0.2,
  }),
  Movement.attributes.add('jumpDuration', {
    type: 'number',
  }),
  Movement.attributes.add('jumpForce', {
    type: 'number',
  }),
  Movement.attributes.add('jumpHeightSpeed', {
    type: 'number',
  }),
  Movement.attributes.add('jumpLandTime', {
    type: 'number',
    default: 0.25,
  }),
  Movement.attributes.add('bounceJumpDuration', {
    type: 'number',
  }),
  Movement.attributes.add('bounceJumpForce', {
    type: 'number',
  }),
  Movement.attributes.add('gravity', {
    type: 'number',
  }),
  Movement.attributes.add('gravitySpeed', {
    type: 'number',
    default: 0.05,
  }),
  Movement.attributes.add('gravityStep', {
    type: 'number',
  }),
  Movement.attributes.add('suicideHeight', {
    type: 'number',
    default: -2,
  }),
  Movement.attributes.add('defaultFov', {
    type: 'number',
  }),
  Movement.attributes.add('defaultNonFov', {
    type: 'number',
    default: 75,
  }),
  Movement.attributes.add('airDamping', {
    type: 'number',
  }),
  Movement.attributes.add('groundDamping', {
    type: 'number',
  }),
  Movement.attributes.add('stopDamping', {
    type: 'number',
  }),
  Movement.attributes.add('stoppingSpeed', {
    type: 'number',
    default: 0.25,
  }),
  Movement.attributes.add('movementAnimationSpeed', {
    type: 'number',
  }),
  Movement.attributes.add('movementAnimationFactor', {
    type: 'number',
  }),
  Movement.attributes.add('movementAngleFactor', {
    type: 'number',
  }),
  Movement.attributes.add('movementSwingSpeed', {
    type: 'number',
  }),
  Movement.attributes.add('movementSwingFactor', {
    type: 'number',
  }),
  Movement.attributes.add('footSpeed', {
    type: 'number',
    default: 500,
  }),
  Movement.attributes.add('lookXEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('weaponPositionEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('focusPositionEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('cameraNonFOVEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('lookEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('farPoint', {
    type: 'entity',
  }),
  Movement.attributes.add('autoLockEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('angleEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('armEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('armRightEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('shoulderEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('headEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('handEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('senseHolder', {
    type: 'entity',
  }),
  Movement.attributes.add('movementHolder', {
    type: 'entity',
  }),
  Movement.attributes.add('takePoint', {
    type: 'entity',
  }),
  Movement.attributes.add('weaponCenter', {
    type: 'entity',
  }),
  Movement.attributes.add('weaponFront', {
    type: 'entity',
  }),
  Movement.attributes.add('gamepadLookPoint', {
    type: 'entity',
  }),
  Movement.attributes.add('meleeCenter', {
    type: 'entity',
  }),
  Movement.attributes.add('meleePoint', {
    type: 'entity',
  }),
  Movement.attributes.add('meleePoints', {
    type: 'entity',
    array: !0,
  }),
  Movement.attributes.add('shurikenPoint1', {
    type: 'entity',
  }),
  Movement.attributes.add('shurikenPoint2', {
    type: 'entity',
  }),
  Movement.attributes.add('shurikenPoint3', {
    type: 'entity',
  }),
  Movement.attributes.add('axeEntity', {
    type: 'entity',
  }),
  Movement.attributes.add('throwPoint', {
    type: 'entity',
  }),
  Movement.attributes.add('interfaceEntity', {
    type: 'entity',
  }),
  (Movement.prototype.initialize = function () {
    (this.locked = !1),
      (this.mouseLocked = !1),
      (this.isMouseLocked = !1),
      (this.lastDelta = 0),
      (pc.dt = 1 / 60),
      (this.heightVector = new pc.Vec3(0, -1e3, 0)),
      (this.glitchThreshold = 0),
      (this.isZoomEffectEnabled = !1),
      (this.reloadingFactor = 1),
      (this.currentFriction = 0.2),
      (this.previousVelocity = !1),
      (this.collision = {
        start: {
          name: '',
        },
        end: {
          name: '',
        },
      }),
      (this.spreadCount = 0),
      (this.spreadNumber = 0),
      (this.jumpSpread = 0),
      (this.force = new pc.Vec3(0, 0, 0)),
      (this.currentForce = new pc.Vec3(0, 0, 0)),
      (this.lastVelocity = new pc.Vec3(0, 0, 0)),
      (this.dynamicGravity = 0),
      (this.footCount = 0),
      (this.footForce = 0),
      (this.groundMaterial = 'Gravel'),
      (this.lastFootDate = this.now()),
      (this.nearestPlayerPosition = new pc.Vec3(0, 0, 0)),
      (this.lastAutoLockTime = 0),
      (this.timerBag = []),
      (this.timerTween = []),
      (this.animation = {
        jumpAngle: 0,
        landAngle: 0,
        jumpHeight: 0,
        bounceX: 0,
        bounceZ: 0,
        shootSwing: 0,
        bounceAngle: 0,
        activeBounce: 0,
        horizantalSpread: 0,
        movementFactor: 1,
        movementFactorStatic: 1,
        weaponAngleX: 0,
        weaponAngleY: 0,
        weaponAngleZ: 0,
        movementAngleX: 0,
        movementAngleY: 0,
        movementAngleZ: 0,
        movementPositionZ: 0,
        takeX: 0,
        takeY: 0,
        takeZ: 0,
        fov: 0,
        cameraBounce: 0,
        cameraImpact: 0,
        cameraShootBounce: 0,
      }),
      (this.timer = {
        inspect0: !1,
        inspect1: !1,
        inspect2: !1,
      }),
      (this.tween = {
        inspect0: !1,
        inspect1: !1,
        inspect2: !1,
      }),
      (this.isInspect = !1),
      (this.lastHeight = 0),
      (this.currentHeight = 0),
      (this.defaultHeight = this.entity.collision.height / 2),
      (this.lastImpactTime = this.now()),
      (this.airTime = this.now()),
      (this.leftAirTime = this.now()),
      (this.focusStartTime = this.now()),
      (this.lastScanUpdate = Date.now()),
      (this.jumpingTime = 0),
      (this.bounceJumpTime = 0),
      (this.randomDirection = 1),
      (this.currentFov = 60),
      (this.currentNonFov = 60),
      (this.currentSpeed = 0),
      (this.movementSpeed = 0),
      (this.deltaHeight = 0),
      (this.leftMouse = !1),
      (this.isShootingLocked = !1),
      (this.isFireStopped = !1),
      (this.isWeaponHidden = !1),
      (this.meleeShootingIndex = 0),
      (this.directionSenseX = 0),
      (this.directionSenseZ = 0),
      (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      (this.isMobileForward = !1),
      (this.isMobileBackward = !1),
      (this.isMobileLeft = !1),
      (this.isMobileRight = !1),
      (this.mobileShootTimer = !1),
      (this.isMouseReleased = !1),
      (this.timestamp = 0),
      (this.isLanded = !1),
      (this.isCollided = !1),
      (this.isJumping = !0),
      (this.isShooting = 0),
      (this.isReloading = 0),
      (this.isMobile = !1),
      (this.reloadingTime = 1.5),
      (this.inspectAfterReload = !1),
      (this.isFocusing = !1),
      (this.raycastShootFrom = !1),
      (this.raycastTo = !1),
      (this.forwardCount = 0),
      (this.leftCount = 0),
      (this.lookX = 0),
      (this.lookY = 0),
      (this.currentLook = 0),
      (this.currentWeapon = this.entity.script.weaponManager.currentWeapon),
      (this.senseX = 0),
      (this.senseY = 0),
      Utils.isMobile()
        ? ((this.isMouseLocked = !0),
          this.app.on('Touch:Direction', this.onTouchMove, this),
          this.app.on('Touch:Joystick', this.onJoystick, this),
          this.app.on('Touch:Shoot', this.onTouchShoot, this),
          this.app.on('Touch:Jump', this.onTouchJump, this),
          this.app.on('Touch:Throw', this.onTouchThrow, this),
          this.app.on('Touch:Melee', this.onTouchMelee, this),
          this.app.on('Touch:Reload', this.onTouchReload, this),
          (this.isMobile = !0))
        : (this.app.mouse.on('mousedown', this.onMouseDown, this),
          this.app.mouse.on('mousemove', this.onMouseMove, this),
          this.app.mouse.on('mouseup', this.onMouseUp, this),
          this.app.mouse.on('mousewheel', this.onMouseWheel, this)),
      this.app.on('Player:Respawn', this.onRespawn, this),
      this.app.on('Player:Lock', this.onLockChange, this),
      this.app.on('Player:Inspect', this.inspect, this),
      this.app.on('Player:Focus', this.setFocus, this),
      this.app.on('Player:Frag', this.onFrag, this),
      this.app.on('Admin:Freeze', this.freeze, this),
      this.app.on('Admin:Gravity', this.grav, this),
      this.app.on('Admin:Speed', this.speed, this),
      this.app.on('Gamepad:Tick', this.onGamepadTick, this),
      this.app.on('Gamepad:Aim', this.onGamepadAim, this),
      this.app.on('Gamepad:Shoot', this.onGamepadShoot, this),
      this.app.on('Gamepad:Movement', this.onGamepadMovement, this),
      this.app.on('Gamepad:Action', this.onGamepadAction, this),
      this.app.on('Gamepad:Look', this.onGamepadLook, this),
      this.app.on('Window:Focus', this.onWindowFocus, this),
      this.app.on('Touch:AutoLock', this.setAutoLock, this),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.entity.collision.on('collisionstart', this.onCollisionStart, this),
      this.entity.collision.on('collisionend', this.onCollisionEnd, this),
      (this.entity.rigidbody.enabled = !1),
      this.app.on('Mouse:LockChange', this.setMouseState, this),
      document.addEventListener('focus', this.onFocus),
      (this.interface = this.interfaceEntity.script.overlay),
      (this.interface.movement = this),
      (this.player = this.entity.script.player),
      (this.playerAbilities = this.entity.script.playerAbilities),
      (this.weaponManager = this.entity.script.weaponManager),
      (pc.controls = this),
      (this.mouseFrame = 0),
      this.setRandomPosition(),
      this.onSettingsChange(),
      this.on('destroy', this.onDestroy, this);
  }),
  (Movement.prototype.onDestroy = function (t) {
    this.cancelReload(), this.cancelInspect(), document.removeEventListener('focus', this.onFocus);
  }),
  (Movement.prototype.onFocus = function (t) {
    (pc.isPauseActive = !1), pc.app.fire('Window:Focus', !0);
  }),
  (Movement.prototype.onMouseWheel = function (t) {
    if ('GUNGAME' == pc.currentMode || 'CUSTOM' == pc.currentMode) return !1;
    t.wheelDelta < 0
      ? this.entity.fire('Player:WeaponIndex', 'Previous')
      : t.wheelDelta > 0 && this.entity.fire('Player:WeaponIndex', 'Next');
  }),
  (Movement.prototype.onWindowFocus = function () {
    (this.isForward = !1), (this.isBackward = !1), (this.isLeft = !1), (this.isRight = !1);
  }),
  (Movement.prototype.onGamepadAim = function (t) {
    (this.isFocusing = t), !0 === t && this.scanShootablesGamepad();
  }),
  (Movement.prototype.onGamepadShoot = function (t) {
    this.leftMouse = t;
  }),
  (Movement.prototype.onGamepadLook = function (t, i) {
    if (this.player.isDeath) return !1;
    this.isFocusing
      ? ((this.lookX -= t * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis),
        (this.lookY -= i * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis))
      : ((this.lookX -= t * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis),
        (this.lookY -= i * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis)),
      this.isFocusing
        ? ((this.senseX -= t * this.focusLookSense * this.mouseInvertAxis),
          (this.senseY -= i * this.focusLookSense * this.mouseInvertAxis))
        : ((this.senseX -= t * this.defaultLookSense * this.mouseInvertAxis),
          (this.senseY -= i * this.defaultLookSense * this.mouseInvertAxis)),
      (this.lookX = this.lookX % 360);
  }),
  (Movement.prototype.onGamepadTick = function () {
    (this.isMobileForward = !1),
      (this.isMobileBackward = !1),
      (this.isMobileLeft = !1),
      (this.isMobileRight = !1);
  }),
  (Movement.prototype.onGamepadAction = function (t) {
    'JUMP' == t && this.jump(),
      'BUTTON1' == t && this.triggerKeyF(),
      'BUTTON2' == t && this.triggerKeyE(),
      'BUTTON3' == t && this.reload();
  }),
  (Movement.prototype.onGamepadMovement = function (t) {
    'UP' == t
      ? (this.isMobileForward = !0)
      : 'LEFT-UP' == t
      ? ((this.isMobileForward = !0), (this.isMobileLeft = !0))
      : 'RIGHT-UP' == t
      ? ((this.isMobileForward = !0), (this.isMobileRight = !0))
      : 'DOWN' == t
      ? (this.isMobileBackward = !0)
      : 'LEFT-DOWN' == t
      ? ((this.isMobileBackward = !0), (this.isMobileLeft = !0))
      : 'RIGHT-DOWN' == t
      ? ((this.isMobileBackward = !0), (this.isMobileRight = !0))
      : 'RIGHT' == t
      ? (this.isMobileRight = !0)
      : 'LEFT' == t && (this.isMobileLeft = !0);
  }),
  (Movement.prototype.onFrag = function () {
    this.animation.fov = -5;
  }),
  (Movement.prototype.onSettingsChange = function () {
    pc.settings || (pc.settings = {}),
      pc.settings.sensivity || (pc.settings.sensivity = 1),
      pc.settings.adsSensivity || (pc.settings.adsSensivity = 1),
      (this.mouseInvertAxis = 1),
      !0 === pc.settings.invertAxis && (this.mouseInvertAxis = -1),
      pc.settings.fov > 0 && (this.defaultFov = pc.settings.fov),
      pc.settings.hideCrosshair
        ? (this.interface.crosshairEntity.enabled = !1)
        : (this.interface.crosshairEntity.enabled = !0),
      pc.settings.crosshairScale &&
        this.interface.crosshairEntity.setLocalScale(
          pc.settings.crosshairScale,
          pc.settings.crosshairScale,
          pc.settings.crosshairScale
        ),
      pc.settings.hideArms
        ? (this.app.scene.layers.getLayerByName('NonFOV').enabled = !1)
        : (this.app.scene.layers.getLayerByName('NonFOV').enabled = !0);
  }),
  (Movement.prototype.onRespawn = function () {
    (this.entity.rigidbody.linearVelocity.x = 0),
      (this.entity.rigidbody.linearVelocity.y = 0),
      (this.entity.rigidbody.linearVelocity.z = 0),
      (this.entity.collision.enabled = !0),
      this.setAmmoFull();
  }),
  (Movement.prototype.onMapLoaded = function () {
    (this.entity.collision.enabled = !0),
      (this.entity.rigidbody.enabled = !0),
      setTimeout(function () {
        pc.app.fire('Player:Show', !0), pc.app.fire('Player:Ready', !0);
      }, 1e3);
  }),
  (Movement.prototype.setRandomPosition = function () {
    Math.random(), Math.random();
    var t = 2 * Math.random();
    this.entity.rigidbody.teleport(50, -95, t);
  }),
  (Movement.prototype.onLockChange = function (t) {
    t ? this.enableMovement() : this.disableMovement();
  }),
  (Movement.prototype.setCurrentWeapon = function () {
    (this.currentWeapon = this.entity.script.weaponManager.currentWeapon),
      (this.currentWeapon.player = this.entity),
      this.takeout(),
      (this.interface.capacityEntity.element.text = this.currentWeapon.capacity + '');
  }),
  (Movement.prototype.onCollisionStart = function (t) {
    return (
      !this.player.isDeath &&
      !pc.isFinished &&
      !!pc.isMapLoaded &&
      (t.other &&
        (('Bounce' != t.other.name && 'BouncePad' != t.other.name) ||
          this.bounceJump(this.airTime, t.other),
        ('Water' == t.other.name || t.other.tags.list().indexOf('Water') > -1) &&
          this.app.fire('Network:Drown', !0),
        'Kill' == t.other.name &&
          this.app.fire('Network:RequestRespawn', this.entity.getPosition().clone()),
        t.other &&
          t.other.tags.list().indexOf('Damageable') > -1 &&
          this.app.fire('Network:ObjectDamage', t.other._guid)),
      this.now() - this.leftAirTime > 1e3 && (this.airTime = this.now()),
      this.playerAbilities.isDashing && this.playerAbilities.triggerDashDamage(t),
      this.playerAbilities.isGrappling && this.playerAbilities.triggerGrappleDamage(t),
      (this.collision.start = t.other),
      void (
        (t.contacts[0].localPoint.y < -1.5 ||
          (t.contacts[0].localPoint.y < 0.001 && t.other && 'Box' == t.other.name)) &&
        ((this.isCollided = !0), this.land())
      ))
    );
  }),
  (Movement.prototype.onCollisionEnd = function (t) {
    (this.collision.end = t), (this.isCollided = !1);
  }),
  (Movement.prototype.setMouseState = function (t) {
    (this.isMouseLocked = t),
      this.isMouseLocked ? this.app.fire('Overlay:Pause', !1) : this.app.fire('Overlay:Pause', !0),
      this.app.fire('Overlay:Message@Hide', !0);
  }),
  (Movement.prototype.onMouseDown = function (t) {
    return (
      !this.player.isDeath &&
      !this.player.isGliding &&
      !pc.isFinished &&
      !pc.isDisplayingAds &&
      !this.locked &&
      !this.mouseLocked &&
      !pc.isPauseActive &&
      !pc.isModeMenuActive &&
      ('undefined' == typeof app || 'Menu' != app.mode) &&
      (this.app.fire('Mouse:Lock'),
      2 === t.button &&
        ((this.isFocusing = !0),
        (this.focusStartTime = this.now()),
        this.cancelInspect(!0),
        this.app.fire('Overlay:SetAmmo', !0)),
      0 === t.button && (this.leftMouse = !0),
      void this.app.fire('Overlay:Message@Hide', !0))
    );
  }),
  (Movement.prototype.onMouseMove = function (t) {
    return (
      !this.player.isDeath &&
      !this.mouseLocked &&
      (this.isMouseLocked &&
        (this.isFocusing
          ? ((this.lookX -=
              t.dx *
              this.focusSensitivity *
              pc.settings.adsSensivity *
              this.animation.movementFactor),
            (this.lookY -=
              t.dy *
              this.focusSensitivity *
              pc.settings.adsSensivity *
              this.mouseInvertAxis *
              this.animation.movementFactor))
          : ((this.lookX -=
              t.dx *
              this.defaultSensitivity *
              pc.settings.sensivity *
              this.animation.movementFactor),
            (this.lookY -=
              t.dy *
              this.defaultSensitivity *
              pc.settings.sensivity *
              this.mouseInvertAxis *
              this.animation.movementFactor)),
        this.isFocusing
          ? ((this.senseX -= t.dx * this.focusLookSense * this.mouseInvertAxis),
            (this.senseY -= t.dy * this.focusLookSense * this.mouseInvertAxis))
          : ((this.senseX -= t.dx * this.defaultLookSense * this.mouseInvertAxis),
            (this.senseY -= t.dy * this.defaultLookSense * this.mouseInvertAxis))),
      void (this.lookX = this.lookX % 360))
    );
  }),
  (Movement.prototype.onTouchMove = function (t, i) {
    if (this.player.isDeath) return !1;
    this.isFocusing
      ? ((this.lookX -= t * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis),
        (this.lookY -= i * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis))
      : ((this.lookX -= t * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis),
        (this.lookY -= i * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis)),
      this.isFocusing
        ? ((this.senseX -= t * this.focusLookSense * this.mouseInvertAxis),
          (this.senseY -= i * this.focusLookSense * this.mouseInvertAxis))
        : ((this.senseX -= t * this.defaultLookSense * this.mouseInvertAxis),
          (this.senseY -= i * this.defaultLookSense * this.mouseInvertAxis)),
      this.scanShootables(),
      (this.lookX = this.lookX % 360);
  }),
  (Movement.prototype.onTouchShoot = function (t) {
    return (
      !this.player.isDeath &&
      !pc.isFinished &&
      !this.locked &&
      !pc.isPauseActive &&
      !!this.isMobile &&
      ((this.leftMouse = 'true' == t), void this.scanShootables())
    );
  }),
  (Movement.prototype.onTouchJump = function () {
    this.jump();
  }),
  (Movement.prototype.onTouchThrow = function () {
    this.triggerKeyF();
  }),
  (Movement.prototype.onTouchMelee = function () {
    this.triggerKeyE();
  }),
  (Movement.prototype.onJoystick = function (t, i) {
    (this.isMobileForward = !1),
      (this.isMobileBackward = !1),
      (this.isMobileLeft = !1),
      (this.isMobileRight = !1),
      'UP' == i && (this.isMobileForward = !0),
      'DOWN' == i && (this.isMobileBackward = !0),
      'RIGHT' == t && (this.isMobileRight = !0),
      'LEFT' == t && (this.isMobileLeft = !0),
      this.scanShootables();
  }),
  (Movement.prototype.onMouseUp = function (t) {
    return (
      !this.player.isDeath &&
      !this.player.isGliding &&
      !pc.isFinished &&
      (2 === t.button && (this.isFocusing = !1),
      void (
        0 === t.button && (this.leftMouse && (this.isMouseReleased = !0), (this.leftMouse = !1))
      ))
    );
  }),
  (Movement.prototype.setCameraAngle = function (t) {
    (this.lookY = Math.max(-90, this.lookY)),
      (this.lookY = Math.min(90, this.lookY)),
      this.lookEntity.setLocalEulerAngles(
        this.lookY + this.animation.cameraBounce + this.animation.cameraImpact,
        this.lookX + this.animation.cameraImpact,
        0
      ),
      this.lookXEntity.setLocalEulerAngles(0, this.lookX + this.animation.cameraImpact, 0),
      this.isLanded
        ? (this.currentLook = this.lookX + this.animation.cameraImpact)
        : (this.currentLook = pc.math.lerpAngle(
            this.currentLook,
            this.lookX + this.animation.cameraImpact,
            0.01
          )),
      this.angleEntity.setLocalEulerAngles(0, this.currentLook, 0),
      this.isReloading > this.timestamp && (this.isFocusing = !1);
  }),
  (Movement.prototype.setHandAngle = function (t) {
    (this.senseX = pc.math.lerp(this.senseX, 0, 0.1)),
      (this.senseY = pc.math.lerp(this.senseY, 0, 0.1)),
      this.senseHolder.setLocalEulerAngles(
        0.5 * this.senseX + 0.5 * this.senseY + this.animation.cameraImpact,
        0.5 * this.senseX,
        2 * -this.senseY
      );
  }),
  (Movement.prototype.setCameraMovementLock = function (t) {
    !0 === t ? ((this.mouseLocked = !0), this.stopFiring()) : (this.mouseLocked = !1);
  }),
  (Movement.prototype.setKeyboard = function () {
    return (
      !this.isFrozen &&
      !this.player.isDeath &&
      !pc.isFinished &&
      !this.locked &&
      'INPUT' != document.activeElement.tagName &&
      (this.jumpingTime + this.jumpLandTime < this.timestamp &&
        this.currentHeight < this.nearGround &&
        ((this.isForward = !1), (this.isBackward = !1), (this.isLeft = !1), (this.isRight = !1)),
      (this.app.keyboard.isPressed(pc.KEY_UP) ||
        this.app.keyboard.isPressed(pc.KEY_W) ||
        this.isMobileForward) &&
        (this.isForward = !0),
      (this.app.keyboard.isPressed(pc.KEY_DOWN) ||
        this.app.keyboard.isPressed(pc.KEY_S) ||
        this.isMobileBackward) &&
        (this.isBackward = !0),
      (this.app.keyboard.isPressed(pc.KEY_LEFT) ||
        this.app.keyboard.isPressed(pc.KEY_A) ||
        this.isMobileLeft) &&
        (this.isLeft = !0),
      (this.app.keyboard.isPressed(pc.KEY_RIGHT) ||
        this.app.keyboard.isPressed(pc.KEY_D) ||
        this.isMobileRight) &&
        (this.isRight = !0),
      this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.jump(),
      this.app.keyboard.wasPressed(pc.KEY_R) && this.reload(),
      this.app.keyboard.wasPressed(pc.KEY_F) && this.triggerKeyF(),
      this.app.keyboard.wasPressed(pc.KEY_E) && this.triggerKeyE(),
      this.app.keyboard.wasPressed(pc.KEY_V) && this.player.spray(),
      this.app.keyboard.wasPressed(pc.KEY_X) &&
        ((this.leftMouse = !0), (this.isMouseReleased = !0)),
      this.app.keyboard.wasReleased(pc.KEY_X) && (this.leftMouse = !1),
      this.app.keyboard.wasPressed(pc.KEY_L) &&
        (this.app.fire('Mouse:Lock'), this.app.fire('Overlay:Pause', !1)),
      this.app.keyboard.wasPressed(pc.KEY_M),
      this.app.keyboard.wasPressed(pc.KEY_J) && this.inspect(),
      this.app.keyboard.wasPressed(pc.KEY_SHIFT) && (this.isFocusing = !0),
      void (this.app.keyboard.wasReleased(pc.KEY_SHIFT) && (this.isFocusing = !1)))
    );
  }),
  (Movement.prototype.setMovement = function () {
    if (this.player.isDeath) return !1;
    if (pc.isFinished) return !1;
    if (this.playerAbilities.isDashing) return !1;
    var t = this.angleEntity.forward,
      i = this.angleEntity.right,
      e = 1,
      s = this.defaultSpeed,
      o = this.strafingSpeed;
    (e *= this.animation.movementFactor),
      this.isFocusing && (e = this.focusSpeedFactor),
      this.currentWeapon && 'Heavy' == this.currentWeapon.weight
        ? ((e *= 0.75), (this.animation.movementFactorStatic = 0.65))
        : (this.animation.movementFactorStatic = 1),
      (this.force.x = 0),
      (this.force.z = 0),
      !this.isForward || this.isLeft || this.isRight
        ? this.isForward && ((this.force.x += t.x * o * e), (this.force.z += t.z * o * e))
        : ((this.force.x += t.x * s * e), (this.force.z += t.z * s * e)),
      this.isBackward && ((this.force.x -= t.x * o * e), (this.force.z -= t.z * o * e)),
      this.isLeft && ((this.force.x -= i.x * o * e), (this.force.z -= i.z * o * e)),
      this.isRight && ((this.force.x += i.x * o * e), (this.force.z += i.z * o * e)),
      this.entity.rigidbody.applyForce(this.currentForce),
      this.app.fire('EffectManager:PlayerPosition', this.entity.getPosition().clone());
  }),
  (Movement.prototype.setMovementAnimation = function (t) {
    if (this.player.isDeath) return !1;
    if (this.mouseLocked) return !1;
    if (this.locked) return !1;
    if (pc.isPauseActive) return !1;
    var i =
        Math.sin(this.forwardCount / this.movementAnimationSpeed) *
        this.movementAnimationFactor *
        this.movementSpeed *
        this.animation.movementFactor *
        this.animation.movementFactorStatic *
        pc.settings.weaponBobbing,
      e =
        Math.cos(this.forwardCount / this.movementAnimationSpeed) *
        this.movementAnimationFactor *
        this.movementSpeed *
        this.animation.movementFactor *
        pc.settings.weaponBobbing,
      s =
        Math.cos(this.forwardCount / this.movementSwingSpeed) *
        Math.sin(this.forwardCount / this.movementSwingSpeed) *
        this.movementSwingFactor *
        2 *
        this.movementSpeed *
        this.animation.movementFactor *
        this.animation.movementFactorStatic *
        pc.settings.weaponBobbing,
      o =
        Math.cos(this.forwardCount / this.movementSwingSpeed) *
        this.movementSwingFactor *
        this.movementSpeed *
        pc.settings.weaponBobbing;
    !this.isFocusing && this.movementSpeed > 0.8
      ? (this.animation.movementPositionZ = pc.math.lerp(
          this.animation.movementPositionZ,
          -0.04,
          0.08
        ))
      : (this.animation.movementPositionZ = pc.math.lerp(this.animation.movementPositionZ, 0, 0.1)),
      this.isJumping
        ? ((i = 0),
          (e = 0),
          (s = 0),
          (this.animation.jumpHeight = pc.math.lerp(
            this.animation.jumpHeight,
            this.deltaHeight,
            0.15
          )))
        : (this.animation.jumpHeight = pc.math.lerp(this.animation.jumpHeight, 0, 0.1));
    var n = this.weaponPositionEntity,
      a = 1,
      h = this.defaultFov,
      r = this.defaultNonFov;
    this.isFocusing && this.isReloading < this.timestamp && this.currentWeapon.isFocusable
      ? ((n = this.focusPositionEntity),
        (a = 0.1),
        (h = this.currentWeapon.focusFov),
        (r = this.currentWeapon.focusFov),
        this.isFocused || (this.directionSenseX = 5),
        this.isFocused || this.currentWeapon.focus(),
        (this.isFocused = !0))
      : (this.isFocused = !1),
      this.isShooting > this.timestamp && (a = pc.math.lerp(a, 0, 0.1));
    var p = this.animation.jumpHeight * this.animation.jumpHeight * 0.01;
    p = Math.min(p, 0.08);
    var c = 0.4;
    this.currentWeapon && 'Shotgun' == this.currentWeapon.type && (c = 0.8);
    var m = this.handEntity
      .getLocalPosition()
      .lerp(this.handEntity.getLocalPosition(), n.getLocalPosition(), c);
    this.currentWeapon &&
    'Sniper' == this.currentWeapon.type &&
    this.isFocusing &&
    this.now() - this.focusStartTime > 60
      ? (this.currentWeapon &&
          this.currentWeapon.modelEntity &&
          (this.currentWeapon.modelEntity.enabled = !1),
        (this.currentWeapon.armEntity.enabled = !1),
        (this.currentWeapon.scopeOverlay.enabled = !1))
      : (this.currentWeapon &&
          this.currentWeapon.modelEntity &&
          (this.currentWeapon.modelEntity.enabled = !0),
        this.currentWeapon &&
          this.currentWeapon.armEntity &&
          (this.currentWeapon.armEntity.enabled = !0)),
      this.handEntity.setLocalPosition(m),
      this.movementHolder.setLocalPosition(
        0.1 * s * a + this.animation.bounceZ + this.animation.movementPositionZ,
        (i + p) * a + this.animation.landAngle * a,
        0.2 * -s * a
      ),
      this.takePoint.setLocalEulerAngles(
        this.animation.takeX,
        this.animation.takeY,
        this.animation.takeZ
      );
    var u = this.animation.cameraBounce;
    if (
      (this.isFocusing && (u = 0),
      this.movementHolder.setLocalEulerAngles(
        u +
          this.animation.movementAngleX +
          this.animation.shootSwing +
          this.directionSenseX +
          s * this.movementAngleFactor * a +
          this.animation.jumpAngle * a * this.randomDirection,
        this.animation.movementAngleY + i + s * this.movementAngleFactor * a,
        this.animation.movementAngleZ + this.directionSenseZ + this.animation.jumpAngle * a
      ),
      this.headEntity.setLocalEulerAngles(
        0.2 * -this.animation.jumpAngle * a - this.animation.cameraShootBounce,
        0,
        0
      ),
      this.weaponCenter.setLocalEulerAngles(
        this.animation.horizantalSpread + this.animation.weaponAngleX,
        -i * i + 0.1 * this.senseX + o + 20 * this.animation.bounceX + this.animation.weaponAngleY,
        this.animation.bounceAngle +
          this.animation.activeBounce +
          this.animation.weaponAngleZ +
          80 * e * a
      ),
      this.weaponFront.setLocalEulerAngles(0, 0, o + s * s * 2),
      this.isLeft
        ? ((this.forwardCount += 1.25 * t), (this.movementSpeed = 1))
        : this.isBackward || this.isRight
        ? ((this.forwardCount -= 1.25 * t), (this.movementSpeed = 1))
        : this.isForward
        ? ((this.forwardCount += t), (this.movementSpeed = 1))
        : this.currentSpeed > 0.1 &&
          ((this.forwardCount += t),
          (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, 0.1))),
      this.isShooting < this.timestamp)
    ) {
      var l = 1;
      this.isFocusing && (l = 0.12),
        this.isLeft
          ? (this.directionSenseX = pc.math.lerp(this.directionSenseX, -25 * l, 0.07))
          : this.isRight &&
            (this.directionSenseX = pc.math.lerp(this.directionSenseX, 17 * l, 0.07)),
        this.isBackward && (this.directionSenseZ = pc.math.lerp(this.directionSenseZ, 0.8, 0.1));
    }
    if (
      ((this.directionSenseX *= pc.settings.weaponLeaning),
      (this.directionSenseZ *= pc.settings.weaponLeaning),
      (this.directionSenseX = pc.math.lerp(this.directionSenseX, 0, 0.1)),
      (this.directionSenseZ = pc.math.lerp(this.directionSenseZ, 0, 0.05)),
      (this.currentSpeed = this.entity.rigidbody.linearVelocity.length()),
      (this.currentFov = pc.math.lerp(this.currentFov, h, 0.4)),
      (this.currentNonFov = pc.math.lerp(this.currentNonFov, r, 0.4)),
      (this.cameraEntity.camera.fov = this.currentFov + this.animation.fov),
      (this.cameraNonFOVEntity.camera.fov = this.currentNonFov + this.animation.fov),
      this.isForward ||
        this.isBackward ||
        (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, 0.05)),
      this.isLeft ||
        this.isRight ||
        (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, 0.01)),
      this.isJumping
        ? this.lastHeight > this.currentHeight
          ? (this.deltaHeight += t * this.jumpHeightSpeed)
          : (this.deltaHeight -= t * this.jumpHeightSpeed)
        : (this.deltaHeight = pc.math.lerp(this.deltaHeight, 0, 0.01)),
      this.now() - this.lastFootDate > this.footSpeed && this.currentSpeed > 1 && this.isLanded)
    ) {
      var d = this.groundMaterial + '-Run-' + (this.footCount + 1),
        y = this.currentSpeed;
      (this.entity.sound.slots[d].pitch = 1 + 0.1 * Math.random()),
        (this.entity.sound.slots[d].volume = 0.2 + 0.2 * Math.random() + 0.3 * this.footForce),
        this.entity.sound.play(d),
        (this.isLeft || this.isRight || this.isBackward) && (y += 50),
        (y += 20 * this.footForce),
        (this.lastFootDate = this.now() - y),
        (this.footForce = pc.math.lerp(this.footForce, 0, 0.2)),
        (this.footCount = Math.floor(5 * Math.random()));
    }
    pc.isFinished ||
      this.locked ||
      ('Melee' != this.currentWeapon.type &&
        (pc.settings.hideArms || pc.settings.hideCrosshair
          ? pc.settings.hideCrosshair && (this.interface.crosshairEntity.enabled = !1)
          : (this.interface.crosshairEntity.enabled = !this.isFocusing),
        (this.interface.focusBulletsEntity.enabled = this.isFocusing))),
      'Sniper' == this.currentWeapon.type
        ? this.now() - this.focusStartTime > 60 &&
          (this.currentWeapon.scopeOverlay.enabled = this.isFocusing)
        : this.isZoomEffectEnabled;
  }),
  (Movement.prototype.playEffortSound = function (t) {
    var i = Math.floor(1.4 * Math.random()) + 1,
      e = 'Throw-' + i;
    t && (e = 'Grunt-' + i), this.app.fire('Character:Sound', e, 0.1 * Math.random());
  }),
  (Movement.prototype.triggerKeyE = function () {
    return (
      !(this.playerAbilities.isHitting > this.timestamp) &&
      !this.player.isGliding &&
      (this.cancelReload(),
      !this.playerAbilities.isThrowing &&
        (this.cancelInspect(!0), void this.playerAbilities.triggerKeyE()))
    );
  }),
  (Movement.prototype.triggerKeyF = function () {
    return this.now() - this.lastThrowDate < 1e3 * this.playerAbilities.throwCooldown &&
      !this.playerAbilities.resetKeyF
      ? (this.entity.sound.play('Error'), !1)
      : !(this.isReloading > this.timestamp) &&
          !(this.playerAbilities.isHitting > this.timestamp) &&
          !this.player.isGliding &&
          ((this.isFocusing = !1),
          this.player.throw(),
          this.stopFiring(),
          this.playerAbilities.triggerKeyF(),
          void (this.lastThrowDate = this.now()));
  }),
  (Movement.prototype.now = function () {
    return this.app._time;
  }),
  (Movement.prototype.slowMovement = function (t) {
    this.app
      .tween(this.animation)
      .to(
        {
          movementFactor: 0.1,
        },
        t,
        pc.Linear
      )
      .start();
  }),
  (Movement.prototype.fastMovement = function () {
    this.app
      .tween(this.animation)
      .to(
        {
          movementFactor: 1,
        },
        0.4,
        pc.Linear
      )
      .start();
  }),
  (Movement.prototype.enableMovement = function () {
    (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      pc.isFinished || pc.settings.hideCrosshair || (this.interface.crosshairEntity.enabled = !0),
      (this.locked = !1);
  }),
  (Movement.prototype.disableMovement = function () {
    (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      (this.currentSpeed = 0),
      (this.interface.crosshairEntity.enabled = !1),
      (this.isShooting = !1),
      (this.isFocusing = !1),
      (this.isFocused = !1),
      (this.leftMouse = !1),
      (this.isMouseReleased = !0),
      (this.locked = !0);
  }),
  (Movement.prototype.setFocus = function (t) {
    t ||
      ((this.isFocusing = !1),
      (this.isFocused = !1),
      (this.isShooting = !1),
      (this.leftMouse = !1),
      (this.isMouseReleased = !0),
      this.disableZoom());
  }),
  (Movement.prototype.inspect = function () {
    return (
      !(this.playerAbilities.isHitting > this.timestamp) &&
      (this.isReloading > this.timestamp
        ? ((this.inspectAfterReload = !0), !1)
        : !this.isInspect &&
          (Math.random() > 0.6 && this.app.fire('Player:Speak', 'Attack', 4),
          !(Math.random() > 0.8) &&
            ((this.timer.inspect0 = setTimeout(
              function (t) {
                (t.isInspect = !0),
                  (t.tween.inspect0 = t.app
                    .tween(t.animation)
                    .to(
                      {
                        movementAngleX: 26.2,
                        movementAngleY: 47.65,
                        movementAngleZ: 2.89,
                      },
                      0.5,
                      pc.BackInOut
                    )
                    .start());
              },
              1,
              this
            )),
            (this.timer.inspect1 = setTimeout(
              function (t) {
                t.tween.inspect1 = t.app
                  .tween(t.animation)
                  .to(
                    {
                      movementAngleX: -66.53,
                      movementAngleY: 18.52,
                      movementAngleZ: 20.29,
                    },
                    0.6,
                    pc.BackInOut
                  )
                  .start();
              },
              1200,
              this
            )),
            (this.timer.inspect2 = setTimeout(
              function (t) {
                (t.tween.inspect2 = t.app
                  .tween(t.animation)
                  .to(
                    {
                      movementAngleX: 0,
                      movementAngleY: 0,
                      movementAngleZ: 0,
                    },
                    0.5,
                    pc.BackInOut
                  )
                  .start()),
                  (t.isInspect = !1);
              },
              2e3,
              this
            )),
            void (this.inspectAfterReload = !1))))
    );
  }),
  (Movement.prototype.cancelInspect = function (t) {
    t
      ? ((this.animation.movementAngleX = 0),
        (this.animation.movementAngleY = 0),
        (this.animation.movementAngleZ = 0),
        (this.inspectAfterReload = !1))
      : setTimeout(
          function (t) {
            (t.animation.movementAngleX = 0),
              (t.animation.movementAngleY = 0),
              (t.animation.movementAngleZ = 0);
          },
          500,
          this
        ),
      this.tween.inspect0 && this.tween.inspect0.stop(),
      this.tween.inspect1 && this.tween.inspect1.stop(),
      this.tween.inspect2 && this.tween.inspect2.stop(),
      clearTimeout(this.timer.inspect0),
      clearTimeout(this.timer.inspect1),
      clearTimeout(this.timer.inspect2),
      this.interface.hidePrepare();
  }),
  (Movement.prototype.setAmmoFull = function () {
    (this.currentWeapon.ammo = this.currentWeapon.capacity), this.app.fire('Overlay:SetAmmo', !0);
  }),
  (Movement.prototype.cancelReload = function () {
    if (this.isReloading < this.timestamp) return !1;
    for (var t in this.timerBag) {
      var i = this.timerBag[t];
      i && clearTimeout(i);
    }
    for (var e in this.timerTween) {
      var s = this.timerTween[e];
      s && s.stop();
    }
    (this.isReloading = 0),
      (this.animation.weaponAngleX = 0),
      (this.animation.weaponAngleY = 0),
      (this.animation.weaponAngleZ = 0),
      (this.animation.takeX = 0),
      (this.animation.takeY = 0),
      (this.animation.takeZ = 0),
      this.currentWeapon.magazineAttach(),
      (this.timerBag = []),
      (this.timerTween = []);
  }),
  (Movement.prototype.onTouchReload = function () {
    this.reload();
  }),
  (Movement.prototype.reload = function () {
    return (
      !(this.playerAbilities.isHitting > this.timestamp) &&
      !(this.isReloading > this.timestamp) &&
      this.currentWeapon.capacity !== this.currentWeapon.ammo &&
      (this.cancelInspect(),
      this.stopFiring(),
      this.player.fireNetworkEvent('r'),
      (this.reloadingTime = this.currentWeapon.reloadingTime),
      (this.reloadingTime = this.reloadingTime * this.reloadingFactor),
      (this.isReloading = this.timestamp + this.reloadingTime),
      this.entity.sound.play('Takeout'),
      this.interface.showPrepare(),
      this.currentWeapon.tempAnimation && 'Lilium' == this.player.characterName
        ? (this.entity.fire('Player:Reload', this.currentWeapon),
          this.timerBag.push(
            setTimeout(
              function (t) {
                t.setAmmoFull();
              },
              900 * this.reloadingTime,
              this
            )
          ),
          !1)
        : (!0 === this.currentWeapon.hiddenReload
            ? ((this.timerTween[0] = this.app.tween(this.animation).to(
                {
                  takeX: 19.86,
                  takeY: 7.07,
                  takeZ: -39.62,
                },
                0.4 * 0.45 * this.reloadingTime,
                pc.BackInOut
              )),
              this.timerTween[0].start())
            : 'Shotgun' == this.currentWeapon.type
            ? ((this.timerTween[0] = this.app.tween(this.animation).to(
                {
                  weaponAngleX: -68.27,
                  weaponAngleY: 29.63,
                  weaponAngleZ: -14.15,
                },
                0.4 * 0.45 * this.reloadingTime,
                pc.BackInOut
              )),
              this.timerTween[0].start(),
              this.timerBag.push(
                setTimeout(
                  function (t) {
                    t.currentWeapon.hideArms();
                  },
                  67.5 * this.reloadingTime,
                  this
                )
              ),
              this.timerBag.push(
                setTimeout(
                  function (t) {
                    (t.timerTween[1] = t.app.tween(t.animation).to(
                      {
                        weaponAngleX: -65.42,
                        weaponAngleY: 9.84,
                        weaponAngleZ: 0,
                        bounceAngle: 15,
                      },
                      0.1,
                      pc.BackInOut
                    )),
                      t.timerTween[1].start(),
                      t.currentWeapon.magazineThrow();
                  },
                  180 * this.reloadingTime,
                  this
                )
              ))
            : ((this.timerTween[2] = this.app.tween(this.animation).to(
                {
                  weaponAngleX: 29.25,
                  weaponAngleY: 6.02,
                  weaponAngleZ: 30.34,
                },
                0.4 * 0.45 * this.reloadingTime,
                pc.BackInOut
              )),
              this.timerTween[2].start(),
              this.timerBag.push(
                setTimeout(
                  function (t) {
                    t.currentWeapon.hideArms();
                  },
                  67.5 * this.reloadingTime,
                  this
                )
              ),
              this.timerBag.push(
                setTimeout(
                  function (t) {
                    (t.timerTween[3] = t.app.tween(t.animation).to(
                      {
                        weaponAngleX: 32.25,
                        weaponAngleY: 4.02,
                        weaponAngleZ: 30.34,
                        bounceAngle: 15,
                      },
                      0.1,
                      pc.BackInOut
                    )),
                      t.timerTween[3].start(),
                      t.currentWeapon.magazineThrow();
                  },
                  180 * this.reloadingTime,
                  this
                )
              )),
          this.timerBag.push(
            setTimeout(
              function (t) {
                (t.timerTween[4] = t.app.tween(t.animation).to(
                  {
                    bounceAngle: -5,
                  },
                  0.1,
                  pc.BackInOut
                )),
                  t.timerTween[4].start(),
                  t.currentWeapon.magazineAttach();
              },
              450 * this.reloadingTime,
              this
            )
          ),
          !1 === this.currentWeapon.hiddenReload &&
            this.timerBag.push(
              setTimeout(
                function (t) {
                  (t.timerTween[5] = t.app.tween(t.animation).to(
                    {
                      weaponAngleX: -68.27,
                      weaponAngleY: 29.63,
                      weaponAngleZ: -14.15,
                    },
                    0.3,
                    pc.BackInOut
                  )),
                    t.timerTween[5].start();
                },
                630 * this.reloadingTime,
                this
              )
            ),
          this.timerBag.push(
            setTimeout(
              function (t) {
                (t.timerTween[6] = t.app.tween(t.animation).to(
                  {
                    bounceZ: -0.1,
                  },
                  0.15,
                  pc.BackInOut
                )),
                  t.timerTween[6].start(),
                  t.currentWeapon.reload();
              },
              720 * this.reloadingTime,
              this
            )
          ),
          this.timerBag.push(
            setTimeout(
              function (t) {
                (t.timerTween[7] = t.app.tween(t.animation).to(
                  {
                    weaponAngleX: 0,
                    weaponAngleY: 0,
                    weaponAngleZ: 0,
                  },
                  0.15,
                  pc.BackInOut
                )),
                  t.timerTween[7].start(),
                  t.takeout();
              },
              1e3 * this.reloadingTime,
              this
            )
          ),
          this.timerBag.push(
            setTimeout(
              function (t) {
                t.inspectAfterReload && t.inspect();
              },
              1e3 * this.reloadingTime + 900 * this.reloadingTime,
              this
            )
          ),
          void this.timerBag.push(
            setTimeout(
              function (t) {
                t.setAmmoFull();
              },
              900 * this.reloadingTime,
              this
            )
          )))
    );
  }),
  (Movement.prototype.hideWeapon = function () {
    (this.isWeaponHidden = !0),
      this.app
        .tween(this.animation)
        .to(
          {
            takeX: -0.52,
            takeY: 22.19,
            takeZ: -55.11,
          },
          0.3,
          pc.BackInOut
        )
        .start(),
      this.entity.sound.play('Takeout'),
      this.interface.hidePrepare();
  }),
  (Movement.prototype.takeout = function () {
    (this.isWeaponHidden = !1),
      this.animation &&
        ((this.animation.takeX = -0.52),
        (this.animation.takeY = 22.19),
        (this.animation.takeZ = -55.11),
        this.app
          .tween(this.animation)
          .to(
            {
              takeX: 0,
              takeY: 0,
              takeZ: 0,
            },
            0.3,
            pc.BackInOut
          )
          .start()),
      this.entity.sound.play('Takeout'),
      this.interface.hidePrepare(),
      this.app.fire('Overlay:SetAmmo', !0);
  }),
  (Movement.prototype.showMelee = function () {
    this.playerAbilities.showMelee();
  }),
  (Movement.prototype.hideMelee = function () {
    this.playerAbilities.hideMelee();
  }),
  (Movement.prototype.hideWeapons = function () {
    this.playerAbilities.hideWeapons();
  }),
  (Movement.prototype.showWeapons = function () {
    this.playerAbilities.showWeapons();
  }),
  (Movement.prototype.impact = function () {
    var t = 3 * Math.random() - 3 * Math.random();
    if (
      (this.app
        .tween(this.animation)
        .to(
          {
            cameraImpact: -t,
          },
          0.09,
          pc.BackOut
        )
        .start(),
      this.now() - this.lastImpactTime < 2e3)
    )
      return !1;
    var i = 'Grunt-' + (Math.round(1 * Math.random()) + 1);
    this.app.fire('Character:Sound', i, 0.1 * Math.random()), (this.lastImpactTime = this.now());
  }),
  (Movement.prototype.disableZoom = function () {
    (this.isZoomEffectEnabled = !1),
      (this.isFocusing = !1),
      (this.isFocused = !1),
      this.currentWeapon &&
        'Sniper' == this.currentWeapon.type &&
        (this.currentWeapon.scopeOverlay.enabled = !1);
  }),
  (Movement.prototype.death = function () {
    this.app.fire('Character:Sound', 'Death-1', 0.1 * Math.random()),
      this.stopFiring(),
      (this.isShooting = !1),
      (this.leftMouse = !1),
      (this.isMouseReleased = !0),
      (this.isZoomEffectEnabled = !1),
      (this.entity.collision.enabled = !0),
      (this.isFocusing = !1),
      (this.isFocused = !1),
      'Sniper' == this.currentWeapon.type && (this.currentWeapon.scopeOverlay.enabled = !1),
      pc.settings.hideCrosshair
        ? (this.interface.crosshairEntity.enabled = !1)
        : (this.interface.crosshairEntity.enabled = !0),
      (this.interface.focusBulletsEntity.enabled = !1),
      this.interface.fullDamage(),
      (this.movementSpeed = 0),
      this.entity.sound.stop('Footsteps');
  }),
  (Movement.prototype.jump = function () {
    if (Date.now() - this.player.lastGlidingTime < 1e3) return !1;
    if ((this.player.cancelGliding(), !this.isLanded && !this.isCollided)) return !1;
    if (this.playerAbilities.isDashing) return !1;
    if (this.bounceJumpTime > this.timestamp) return !1;
    if (this.jumpingTime > this.timestamp) return !1;
    if (
      ((this.jumpingTime = this.timestamp + this.jumpDuration),
      (this.isJumping = !0),
      (this.isLanded = !1),
      (this.airTime = this.now()),
      (this.randomDirection = Math.random() > 0.5 ? -1 : 1),
      this.previousVelocity,
      this.now() - this.lastImpactTime > 3e3)
    ) {
      var t = 'Jump-' + (Math.round(1 * Math.random()) + 1);
      this.app.fire('Character:Sound', t, 0.1 * Math.random()),
        this.entity.sound.play('Only-Jump'),
        (this.entity.sound.slots['Only-Jump'].pitch = 0.1 * Math.random() + 1.1);
    }
    if (
      ((this.dynamicGravity = 0),
      this.app.fire('Overlay:Jump', !0),
      this.player.fireNetworkEvent('j'),
      this.isShooting > this.timestamp)
    )
      return !1;
    this.app
      .tween(this.animation)
      .to(
        {
          jumpAngle: -11,
        },
        0.15,
        pc.BackOut
      )
      .start();
  }),
  (Movement.prototype.bounceJump = function (t, i) {
    if (this.jumpingTime > this.timestamp) return !1;
    if (this.locked) return !1;
    var e = 1;
    if (i) {
      var s = i.tags.list();
      s.indexOf('Very-Long') > -1
        ? (e = 1.65)
        : s.indexOf('Long') > -1
        ? (e = 1.25)
        : s.indexOf('Short') > -1 && (e = 0.7);
    }
    if (
      ((this.airTime = this.now()),
      (this.bounceJumpTime = this.timestamp - 500),
      this.entity.sound.play('BounceJump'),
      this.entity.sound.play('Only-Jump'),
      this.entity.rigidbody.applyImpulse(0, this.bounceJumpForce * e, 0),
      (this.entity.sound.slots['Only-Jump'].pitch = 0.1 * Math.random() + 1.1),
      (this.isJumping = !0),
      (this.isLanded = !1),
      this.app.fire('Overlay:Jump', !0),
      this.player.fireNetworkEvent('bj'),
      this.isShooting > this.timestamp)
    )
      return !1;
    this.app
      .tween(this.animation)
      .to(
        {
          jumpAngle: -18,
          cameraShootBounce: 2,
          fov: 10,
        },
        0.15,
        pc.BackOut
      )
      .start();
  }),
  (Movement.prototype.land = function () {
    var t = Math.min((this.now() - this.airTime) / 1e3, 1);
    if (
      ((this.airTime = this.now()),
      (this.isLanded = !0),
      (this.isJumping = !1),
      (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      (this.deltaHeight = 0),
      (this.dynamicGravity = 0),
      (this.previousVelocity = this.entity.rigidbody.linearVelocity.clone()),
      this.player.fireNetworkEvent('l'),
      this.entity.fire('Player:Land', !0),
      t < 0.3)
    )
      return !1;
    if (this.isShooting > this.timestamp) return !1;
    if (Math.abs(this.currentHeight - this.lastHeight) > 0.1) {
      var i = Math.round(Math.random()) + 1;
      this.entity.sound.play('Land-' + i),
        this.app
          .tween(this.animation)
          .to(
            {
              landAngle: -0.4 * t,
              cameraShootBounce: -5 * t,
            },
            0.15,
            pc.BackOut
          )
          .start(),
        (this.footForce = 1);
    }
  }),
  (Movement.prototype.setDamping = function (t) {
    if (this.player.isGliding)
      (this.entity.rigidbody.linearDamping = this.airDamping),
        this.entity.rigidbody.applyForce(0, 0.5 * this.gravity, 0);
    else if (
      this.currentHeight > this.defaultHeight &&
      !this.isLanded &&
      !this.playerAbilities.isDashing
    ) {
      var i = Math.min((this.now() - this.airTime) / 1e3, 1);
      (this.dynamicGravity += t * this.gravityStep * this.gravityStep),
        (this.entity.rigidbody.linearDamping = this.airDamping),
        this.entity.rigidbody.applyForce(
          0,
          this.gravity + this.gravity * i - this.dynamicGravity,
          0
        );
    } else
      this.movementSpeed < 0.5
        ? (this.entity.rigidbody.linearDamping = pc.math.lerp(
            this.entity.rigidbody.linearDamping,
            this.stopDamping,
            this.stoppingSpeed
          ))
        : (this.entity.rigidbody.linearDamping = this.groundDamping);
  }),
  (Movement.prototype.setCurrentValues = function (t) {
    this.isLanded
      ? (this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, 0.2))
      : (this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, 0.05)),
      (this.animation.landAngle = pc.math.lerp(this.animation.landAngle, 0, 0.1));
    var i = 1;
    this.isLanded || (i = 0.1),
      (this.currentForce.x = pc.math.lerp(this.currentForce.x, this.force.x, i)),
      (this.currentForce.y = pc.math.lerp(this.currentForce.y, this.force.y, i)),
      (this.currentForce.z = pc.math.lerp(this.currentForce.z, this.force.z, i));
  }),
  (Movement.prototype.setGravity = function () {
    var t = this.entity.getPosition().clone(),
      i = t.clone().add(this.heightVector),
      e = this.app.systems.rigidbody.raycastFirst(t, i),
      s = 1e3,
      o = [];
    e &&
      ((o = e.entity.tags.list()),
      (s = e.point.sub(this.entity.getPosition().clone()).length()),
      o.indexOf('Wood') > -1 || o.indexOf('Concrete') > -1
        ? (this.groundMaterial = 'Concrete')
        : o.indexOf('Snow') > -1
        ? (this.groundMaterial = 'Snow')
        : o.indexOf('Mud') > -1
        ? (this.groundMaterial = 'Mud')
        : (this.groundMaterial = 'Gravel'));
    var n = this.currentHeight;
    (this.lastHeight = n),
      (this.currentHeight = s),
      this.jumpingTime > this.timestamp &&
        (this.entity.rigidbody.applyForce(0, this.jumpForce, 0),
        this.entity.rigidbody.applyForce(this.lastVelocity)),
      this.currentHeight > this.collisionHeight
        ? (this.isLanded && (this.lastVelocity = this.entity.rigidbody.linearVelocity.clone()),
          (this.isLanded = !1))
        : ((this.isLanded = !0),
          (this.lastVelocity.x = pc.math.lerp(this.lastVelocity.x, 0, 0.1)),
          (this.lastVelocity.y = pc.math.lerp(this.lastVelocity.y, 0, 0.1)),
          (this.lastVelocity.z = pc.math.lerp(this.lastVelocity.z, 0, 0.1))),
      this.currentHeight > this.airHeight && (this.leftAirTime = this.now());
  }),
  (Movement.prototype.stopMeleeShooting = function () {
    clearTimeout(this.meleeShootingTimer),
      (this.meleeShootingTimer = setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .to(
              {
                takeX: 0,
                takeY: 0,
                takeZ: 0,
              },
              0.1,
              pc.BackOut
            )
            .start();
        },
        450,
        this
      ));
  }),
  (Movement.prototype.setThrowShoot = function () {
    this.leftMouse &&
      !this.isShootingLocked &&
      !this.playerAbilities.isThrowing &&
      this.isReloading < this.timestamp &&
      this.playerAbilities.isHitting < this.timestamp &&
      (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
      this.isShooting > this.timestamp &&
        !this.isShootingLocked &&
        (this.cancelInspect(!0),
        this.app
          .tween(this.animation)
          .rotate(
            {
              takeX: -17.14,
              takeY: -30.81,
              takeZ: 42.11,
            },
            0.2,
            pc.BackOut
          )
          .start(),
        setTimeout(
          function (t) {
            t.app
              .tween(t.animation)
              .rotate(
                {
                  takeX: 0,
                  takeY: 0,
                  takeZ: -67.42,
                },
                0.1,
                pc.BackOut
              )
              .start();
          },
          200,
          this
        ),
        setTimeout(
          function (t) {
            t.playerAbilities.throwTrigger(t.currentWeapon);
          },
          160,
          this
        ),
        setTimeout(
          function (t) {
            t.stopMeleeShooting();
          },
          1e3,
          this
        ),
        (this.isShootingLocked = !0),
        (this.isShooting = this.currentWeapon.shootTime + this.timestamp)),
      this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1);
  }),
  (Movement.prototype.setMeleeShoot = function () {
    if (
      (this.leftMouse &&
        !this.isShootingLocked &&
        !this.playerAbilities.isThrowing &&
        this.isReloading < this.timestamp &&
        this.playerAbilities.isHitting < this.timestamp &&
        (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
      this.isShooting > this.timestamp && !this.isShootingLocked)
    ) {
      if (
        (this.cancelInspect(!0),
        this.meleeShootingIndex % 2 == 0
          ? (this.app
              .tween(this.animation)
              .rotate(
                {
                  takeX: 137.28,
                  takeY: 0,
                  takeZ: 52.78,
                },
                0.05,
                pc.BackOut
              )
              .start(),
            setTimeout(
              function (t) {
                t.app
                  .tween(t.animation)
                  .rotate(
                    {
                      takeX: 137.28,
                      takeY: 110,
                      takeZ: 52.78,
                    },
                    0.2,
                    pc.BackOut
                  )
                  .start();
              },
              100,
              this
            ),
            setTimeout(
              function (t) {
                t.playerAbilities.meleeTrigger(t.currentWeapon.damage),
                  t.app.fire('WeaponManager:Swing', 'Right');
              },
              160,
              this
            ))
          : (this.app
              .tween(this.animation)
              .to(
                {
                  takeX: 21.08,
                  takeY: 63.2,
                  takeZ: 17.45,
                },
                0.05,
                pc.BackOut
              )
              .start(),
            setTimeout(
              function (t) {
                t.app
                  .tween(t.animation)
                  .to(
                    {
                      takeX: 22.87,
                      takeY: -71.2,
                      takeZ: -26.46,
                    },
                    0.3,
                    pc.BackOut
                  )
                  .start();
              },
              100,
              this
            ),
            setTimeout(
              function (t) {
                t.playerAbilities.meleeTrigger(t.currentWeapon.damage),
                  t.app.fire('WeaponManager:Swing', 'Left');
              },
              160,
              this
            )),
        setTimeout(
          function (t) {
            t.currentWeapon.shoot();
          },
          100,
          this
        ),
        this.now() - this.lastImpactTime > 3e3 && Math.random() > 0.1)
      ) {
        var t = 'Jump-' + (Math.round(1 * Math.random()) + 1);
        this.app.fire('Character:Sound', t, 0.1 * Math.random()),
          this.entity.sound.play('Only-Jump'),
          (this.entity.sound.slots['Only-Jump'].pitch = 0.1 * Math.random() + 1.1);
      }
      this.stopMeleeShooting(),
        this.meleeShootingIndex++,
        (this.isShootingLocked = !0),
        (this.isShooting = this.currentWeapon.shootTime + this.timestamp);
    }
    this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1);
  }),
  (Movement.prototype.stopMeleeShooting = function () {
    clearTimeout(this.meleeShootingTimer),
      (this.meleeShootingTimer = setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .to(
              {
                takeX: 0,
                takeY: 0,
                takeZ: 0,
              },
              0.1,
              pc.BackOut
            )
            .start();
        },
        450,
        this
      ));
  }),
  (Movement.prototype.setLauncherShoot = function (t) {
    if (
      (this.leftMouse &&
        !this.isShootingLocked &&
        !this.playerAbilities.isThrowing &&
        this.isReloading < this.timestamp &&
        this.playerAbilities.isHitting < this.timestamp &&
        (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
      this.isShooting > this.timestamp && !this.isShootingLocked)
    ) {
      this.cancelInspect(!0), this.setShootDirection();
      this.app.systems.rigidbody.raycastFirst(this.raycastShootFrom, this.raycastTo);
      var i = this.currentWeapon.bulletPoint.getPosition().clone();
      this.currentWeapon.bulletPoint.getEulerAngles().clone();
      this.app.fire('EffectManager:Rocket', i, this.raycastTo, !0),
        this.app.fire('NetworkManager:Rocket', i, this.raycastTo),
        (this.isShootingLocked = !0),
        (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
        this.currentWeapon.shoot(),
        this.setShakeAnimation(t);
    }
    this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1),
      this.updateShakeAnimation(t);
  }),
  (Movement.prototype.setShakeAnimation = function (t) {
    var i = this.currentWeapon.recoil,
      e = this.currentWeapon.cameraShake,
      s = 0.03 * Math.random() - 0.03 * Math.random(),
      o = -0.15 * i,
      n = 6 * i,
      a = -1.2,
      h = 2,
      r = this.currentWeapon.spread,
      p = Math.cos(110 * this.spreadCount),
      c = this.currentWeapon.spread * p;
    this.isFocusing &&
      'Rifle' == this.currentWeapon.type &&
      ((o = -0.05),
      (n = 0.5),
      (a = -0.2),
      (e *= 0.5),
      (h = 0.05),
      (r = this.currentWeapon.focusSpread),
      (c = this.currentWeapon.focusSpread * p)),
      ('Sniper' != this.currentWeapon.type && 'Shotgun' != this.currentWeapon.type) ||
        ((a = -5), (h = 5.2)),
      (this.lookY += 0.04 * e),
      (this.spreadNumber = pc.math.lerp(this.spreadNumber, r, 0.1)),
      (this.spreadCount += t),
      this.currentWeapon.ammo--,
      this.app.fire('Overlay:Shoot', !0),
      this.app
        .tween(this.animation)
        .to(
          {
            bounceX: s,
            bounceZ: o,
            bounceAngle: n,
            shootSwing: h,
          },
          0.03,
          pc.BackOut
        )
        .start(),
      this.app
        .tween(this.animation)
        .to(
          {
            cameraShootBounce: a,
            cameraBounce: this.animation.cameraBounce + 0.025 * e,
          },
          0.09,
          pc.BackOut
        )
        .start(),
      (this.animation.activeBounce = pc.math.lerp(this.animation.activeBounce, -e, 0.05)),
      (this.animation.horizantalSpread = pc.math.lerp(
        this.animation.horizantalSpread,
        0.04 * c,
        0.1
      ));
  }),
  (Movement.prototype.updateShakeAnimation = function () {
    this.isShooting > this.timestamp + 0.1 &&
      (this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, 0.2)),
      (this.animation.fov = pc.math.lerp(this.animation.fov, 0, 0.1)),
      (this.animation.bounceX = pc.math.lerp(this.animation.bounceX, 0, 0.3)),
      (this.animation.bounceZ = pc.math.lerp(this.animation.bounceZ, 0, 0.1)),
      (this.animation.bounceAngle = pc.math.lerp(this.animation.bounceAngle, 0, 0.2)),
      (this.animation.shootSwing = pc.math.lerp(this.animation.shootSwing, 0, 0.01)),
      (this.animation.activeBounce = pc.math.lerp(this.animation.activeBounce, 0, 0.1)),
      (this.animation.cameraShootBounce = pc.math.lerp(this.animation.cameraShootBounce, 0, 0.1)),
      (this.animation.cameraBounce = pc.math.lerp(this.animation.cameraBounce, 0, 0.1)),
      (this.animation.cameraImpact = pc.math.lerp(this.animation.cameraImpact, 0, 0.1)),
      (this.spreadNumber = pc.math.lerp(this.spreadNumber, 0, 0.2)),
      (this.animation.horizantalSpread = pc.math.lerp(this.animation.horizantalSpread, 0, 0.01));
  }),
  (Movement.prototype.setShooting = function (t) {
    if (!this.isMouseLocked) return !1;
    if (
      ('Melee' == this.currentWeapon.type && this.setMeleeShoot(),
      'Throwable' == this.currentWeapon.type && this.setThrowShoot(),
      'Launcher' == this.currentWeapon.type && this.setLauncherShoot(t),
      this.player.checkShooting(),
      !this.currentWeapon.isShootable)
    )
      return !1;
    if (
      (this.leftMouse ||
        this.isShootingLocked ||
        this.isFireStopped ||
        (this.stopFiring(), 0 === this.currentWeapon.ammo && this.reload()),
      this.leftMouse &&
        !this.isWeaponHidden &&
        !this.isShootingLocked &&
        !this.playerAbilities.isThrowing &&
        this.isReloading < this.timestamp &&
        this.playerAbilities.isHitting < this.timestamp &&
        (this.currentWeapon.ammo > 0
          ? (this.isShooting = this.currentWeapon.shootTime + this.timestamp)
          : this.reload()),
      this.isShooting > this.timestamp && !this.isShootingLocked)
    ) {
      this.currentWeapon.recoil,
        this.currentWeapon.cameraShake,
        Math.random(),
        Math.random(),
        this.currentWeapon.spread;
      var i = Math.cos(110 * this.spreadCount);
      this.currentWeapon.spread;
      this.cancelInspect(!0),
        this.isFocusing &&
          'Rifle' == this.currentWeapon.type &&
          (-0.05,
          0.5,
          -0.2,
          0.5,
          0.05,
          this.currentWeapon.focusSpread,
          this.currentWeapon.focusSpread * i),
        ('Sniper' != this.currentWeapon.type && 'Shotgun' != this.currentWeapon.type) ||
          ((this.spreadNumber = this.currentWeapon.spread),
          this.isFocusing && (this.spreadNumber = this.currentWeapon.focusSpread),
          -5,
          5.2),
        this.currentWeapon.shoot(),
        this.currentWeapon.isAutomatic || ((this.isMouseReleased = !1), (this.leftMouse = !1));
      var e = this.currentWeapon.bulletPoint.getPosition().clone(),
        s = this.currentWeapon.bulletPoint.getEulerAngles().clone();
      ('Sniper' == this.currentWeapon.type && this.isFocusing) ||
        (this.app.fire('EffectManager:Bullet', e, s),
        this.entity.script.weaponManager.triggerShooting());
      var o = this.currentWeapon.muzzlePoint.getPosition().clone(),
        n = this.raycastShootFrom,
        a = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
        h = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
        r = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
        p = this.raycastTo.clone().add(new pc.Vec3(a, h, r)),
        c = this.currentWeapon.damage,
        m = this.currentWeapon.distanceMultiplier;
      if ('Shotgun' == this.currentWeapon.type) {
        this.app.fire('EffectManager:Fire', n, p, o, this.player.playerId, c, 'Shotgun', m);
        for (var u = 1, l = 0; l < 10; l++)
          l > 5 && (u = 0.5),
            (a = Math.cos((l / 3) * Math.PI) * this.spreadNumber * u),
            (h = Math.sin((l / 3) * Math.PI) * this.spreadNumber * u),
            (r = Math.cos((l / 3) * Math.PI) * this.spreadNumber * u),
            (p = this.raycastTo.clone().add(new pc.Vec3(a, h, r))),
            this.app.fire('EffectManager:Fire', n, p, o, this.player.playerId, c, 'Shotgun', m);
      } else this.app.fire('EffectManager:Fire', n, p, o, this.player.playerId, c);
      this.setShakeAnimation(t), (this.isShootingLocked = !0), (this.isFireStopped = !1);
    }
    this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1),
      this.updateShakeAnimation(t);
  }),
  (Movement.prototype.shake = function () {
    this.app
      .tween(this.animation)
      .to(
        {
          cameraShootBounce: 1,
          cameraBounce: this.animation.cameraBounce + 0.025,
        },
        0.15,
        pc.BackOut
      )
      .start();
  }),
  (Movement.prototype.stopFiring = function () {
    this.currentWeapon && !this.isFireStopped && this.currentWeapon.stopShooting(),
      (this.isFireStopped = !0);
  }),
  (Movement.prototype.setShootDirection = function () {
    var t = this.app.graphicsDevice.maxPixelRatio,
      i =
        (this.app.graphicsDevice.width,
        this.app.graphicsDevice.height,
        this.cameraEntity.getPosition()),
      e = this.farPoint.getPosition();
    (this.raycastShootFrom = i), (this.raycastTo = e);
  }),
  (Movement.prototype.updateAutoLock = function () {
    if (this.lastAutoLockTime > this.timestamp) {
      this.autoLockEntity.lookAt(this.nearestPlayerPosition);
      this.autoLockEntity.getLocalEulerAngles();
      var t = this.entity.getPosition(),
        i = Utils.lookAt(this.nearestPlayerPosition.x, this.nearestPlayerPosition.z, t.x, t.z);
      this.lookX = i * pc.math.RAD_TO_DEG;
    }
    this.setShootDirection();
    var e = this.app.systems.rigidbody.raycastFirst(this.raycastShootFrom, this.raycastTo);
    e &&
      e.entity.tags &&
      e.entity.tags.list().indexOf('Player') > -1 &&
      e.entity.script &&
      e.entity.script.enemy &&
      '-1' != e.entity.script.enemy.playerId &&
      (('Sniper' != this.currentWeapon.type ||
        ('Sniper' == this.currentWeapon.type && this.isFocusing)) &&
        (this.leftMouse = !0),
      clearTimeout(this.mobileShootTimer),
      (this.mobileShootTimer = setTimeout(
        function (t) {
          t.leftMouse = !1;
        },
        300,
        this
      )));
  }),
  (Movement.prototype.setAutoLock = function (t) {
    this.lastAutoLockTime < this.timestamp &&
      ((this.nearestPlayerPosition = t), (this.lastAutoLockTime = this.timestamp + 0.1));
  }),
  (Movement.prototype.scanShootablesGamepad = function () {
    if (Date.now() - this.lastScanUpdate < 200) return !1;
    if (!pc.isGamepadActive) return !1;
    var t = this.gamepadLookPoint.getPosition(),
      i = this.app.root.findByTag('Player');
    for (var e in i) {
      var s = i[e];
      if (s != this.entity && s.script.enemy && '-1' != s.script.enemy.isActivated)
        t.clone().sub(s.getPosition()).length() < 30 &&
          this.app.fire('Touch:AutoLock', s.getPosition());
    }
  }),
  (Movement.prototype.scanShootables = function () {
    if (Date.now() - this.lastScanUpdate < 200) return !1;
    var t = this.entity.getPosition(),
      i = !1,
      e = 900,
      s = this.app.systems.rigidbody.raycastFirst(this.raycastShootFrom, this.raycastTo);
    if (s && s.entity.tags.list().indexOf('Player') > -1) {
      var o = s.entity.getPosition().sub(t).length();
      o < e && ((i = s.point), (e = o), this.app.fire('Touch:AutoLock', i));
    }
    i && this.app.fire('Touch:AutoLock', i), (this.lastScanUpdate = Date.now());
  }),
  (Movement.prototype.checkGlitches = function (t) {
    this.entity.rigidbody.linearVelocity.length() > 300 || this.currentHeight > 100
      ? (this.glitchThreshold > 2 && this.app.fire('Network:Respawn', !0),
        (this.glitchThreshold += t))
      : (this.glitchThreshold = pc.math.lerp(this.glitchThreshold, 0, 0.1));
  }),
  (Movement.prototype.triggerGlobalEvents = function () {
    this.app.fire('Player:Focused', this.isFocusing);
  }),
  (Movement.prototype.setCommon = function () {
    this.jumpSpread = pc.math.lerp(this.jumpSpread, 0, 0.01);
  }),
  (Movement.prototype.update = function (t) {
    (this.lastDelta += t),
      this.setCameraAngle(),
      this.setKeyboard(),
      this.setGravity(),
      this.setMovement(),
      this.setDamping(t);
    var i = this.lastDelta;
    i > pc.dt - 0.001 &&
      (this.setCommon(),
      this.setHandAngle(i),
      this.setCurrentValues(i),
      this.setMovementAnimation(i),
      this.checkGlitches(i),
      this.setShooting(i),
      (this.isMobile || pc.isGamepadActive) && this.updateAutoLock(),
      this.triggerGlobalEvents(),
      (this.timestamp += i),
      (this.lastDelta = 0));
  }),
  (Movement.prototype.freeze = function () {
    this.isFrozen ? (this.isFrozen = !1) : (this.isFrozen = !0);
  }),
  (Movement.prototype.grav = function (t) {
    this.gravity = t;
  }),
  (Movement.prototype.speed = function (t) {
    (this.defaultSpeed = t), (this.strafingSpeed = t - 45);
  });
'undefined' !=
  typeof document /*! FPSMeter 0.3.1 - 9th May 2013 | https://github.com/Darsain/fpsmeter */ &&
  ((function (t, e) {
    function s(t, e) {
      for (var n in e)
        try {
          t.style[n] = e[n];
        } catch (t) {}
      return t;
    }
    function H(t) {
      return null == t
        ? String(t)
        : 'object' == typeof t || 'function' == typeof t
        ? Object.prototype.toString
            .call(t)
            .match(/\s([a-z]+)/i)[1]
            .toLowerCase() || 'object'
        : typeof t;
    }
    function R(t, e) {
      if ('array' !== H(e)) return -1;
      if (e.indexOf) return e.indexOf(t);
      for (var n = 0, o = e.length; n < o; n++) if (e[n] === t) return n;
      return -1;
    }
    function I() {
      var t,
        e = arguments;
      for (t in e[1])
        if (e[1].hasOwnProperty(t))
          switch (H(e[1][t])) {
            case 'object':
              e[0][t] = I({}, e[0][t], e[1][t]);
              break;
            case 'array':
              e[0][t] = e[1][t].slice(0);
              break;
            default:
              e[0][t] = e[1][t];
          }
      return 2 < e.length ? I.apply(null, [e[0]].concat(Array.prototype.slice.call(e, 2))) : e[0];
    }
    function N(t) {
      return 1 === (t = Math.round(255 * t).toString(16)).length ? '0' + t : t;
    }
    function S(t, e, n, o) {
      t.addEventListener
        ? t[o ? 'removeEventListener' : 'addEventListener'](e, n, !1)
        : t.attachEvent && t[o ? 'detachEvent' : 'attachEvent']('on' + e, n);
    }
    function D(t, e) {
      function g(t, e, n, o) {
        return p[0 | t][Math.round(Math.min(((e - n) / (o - n)) * C, C))];
      }
      function r() {
        O.legend.fps !== L && ((O.legend.fps = L), (O.legend[c] = L ? 'FPS' : 'ms')),
          (v = L ? y.fps : y.duration),
          (O.count[c] = 999 < v ? '999+' : v.toFixed(99 < v ? 0 : F.decimals));
      }
      function m() {
        for (
          h = n(),
            A < h - F.threshold &&
              ((y.fps -= y.fps / Math.max(1, (60 * F.smoothing) / F.interval)),
              (y.duration = 1e3 / y.fps)),
            b = F.history;
          b--;

        )
          (T[b] = 0 === b ? y.fps : T[b - 1]), (j[b] = 0 === b ? y.duration : j[b - 1]);
        if ((r(), F.heat)) {
          if (z.length)
            for (b = z.length; b--; )
              z[b].el.style[o[z[b].name].heatOn] = L
                ? g(o[z[b].name].heatmap, y.fps, 0, F.maxFps)
                : g(o[z[b].name].heatmap, y.duration, F.threshold, 0);
          if (O.graph && o.column.heatOn)
            for (b = M.length; b--; )
              M[b].style[o.column.heatOn] = L
                ? g(o.column.heatmap, T[b], 0, F.maxFps)
                : g(o.column.heatmap, j[b], F.threshold, 0);
        }
        if (O.graph)
          for (w = 0; w < F.history; w++)
            M[w].style.height =
              (L
                ? T[w]
                  ? Math.round((x / F.maxFps) * Math.min(T[w], F.maxFps))
                  : 0
                : j[w]
                ? Math.round((x / F.threshold) * Math.min(j[w], F.threshold))
                : 0) + 'px';
      }
      function k() {
        20 > F.interval ? ((l = i(k)), m()) : ((l = setTimeout(k, F.interval)), (f = i(m)));
      }
      function G(t) {
        (t = t || window.event).preventDefault
          ? (t.preventDefault(), t.stopPropagation())
          : ((t.returnValue = !1), (t.cancelBubble = !0)),
          y.toggle();
      }
      function U() {
        F.toggleOn && S(O.container, F.toggleOn, G, 1), t.removeChild(O.container);
      }
      function V() {
        if (
          (O.container && U(),
          (o = D.theme[F.theme]),
          !(p = o.compiledHeatmaps || []).length && o.heatmaps.length)
        ) {
          for (w = 0; w < o.heatmaps.length; w++)
            for (p[w] = [], b = 0; b <= C; b++) {
              var e,
                n = p[w],
                a = b;
              e = (0.33 / C) * b;
              var i = o.heatmaps[w].saturation,
                h = o.heatmaps[w].lightness,
                l = void 0,
                c = void 0,
                u = void 0,
                d = (u = void 0),
                f = (l = c = void 0);
              f = void 0;
              0 === (u = 0.5 >= h ? h * (1 + i) : h + i - h * i)
                ? (e = '#000')
                : ((c = (u - (d = 2 * h - u)) / u),
                  (f = (e *= 6) - (l = Math.floor(e))),
                  (f *= u * c),
                  0 === l || 6 === l
                    ? ((l = u), (c = d + f), (u = d))
                    : 1 === l
                    ? ((l = u - f), (c = u), (u = d))
                    : 2 === l
                    ? ((l = d), (c = u), (u = d + f))
                    : 3 === l
                    ? ((l = d), (c = u - f))
                    : 4 === l
                    ? ((l = d + f), (c = d))
                    : ((l = u), (c = d), (u -= f)),
                  (e = '#' + N(l) + N(c) + N(u))),
                (n[a] = e);
            }
          o.compiledHeatmaps = p;
        }
        for (var v in ((O.container = s(document.createElement('div'), o.container)),
        (O.count = O.container.appendChild(s(document.createElement('div'), o.count))),
        (O.legend = O.container.appendChild(s(document.createElement('div'), o.legend))),
        (O.graph = F.graph
          ? O.container.appendChild(s(document.createElement('div'), o.graph))
          : 0),
        (z.length = 0),
        O))
          O[v] &&
            o[v].heatOn &&
            z.push({
              name: v,
              el: O[v],
            });
        if (((M.length = 0), O.graph))
          for (
            O.graph.style.width =
              F.history * o.column.width + (F.history - 1) * o.column.spacing + 'px',
              b = 0;
            b < F.history;
            b++
          )
            (M[b] = O.graph.appendChild(s(document.createElement('div'), o.column))),
              (M[b].style.position = 'absolute'),
              (M[b].style.bottom = 0),
              (M[b].style.right = b * o.column.width + b * o.column.spacing + 'px'),
              (M[b].style.width = o.column.width + 'px'),
              (M[b].style.height = '0px');
        s(O.container, F),
          r(),
          t.appendChild(O.container),
          O.graph && (x = O.graph.clientHeight),
          F.toggleOn &&
            ('click' === F.toggleOn && (O.container.style.cursor = 'pointer'),
            S(O.container, F.toggleOn, G));
      }
      'object' === H(t) && undefined === t.nodeType && ((e = t), (t = document.body)),
        t || (t = document.body);
      var o,
        p,
        h,
        l,
        f,
        x,
        v,
        b,
        w,
        y = this,
        F = I({}, D.defaults, e || {}),
        O = {},
        M = [],
        C = 100,
        z = [],
        E = F.threshold,
        P = 0,
        A = n() - E,
        T = [],
        j = [],
        L = 'fps' === F.show;
      (y.options = F),
        (y.fps = 0),
        (y.duration = 0),
        (y.isPaused = 0),
        (y.tickStart = function () {
          P = n();
        }),
        (y.tick = function () {
          (h = n()),
            (E += (h - A - E) / F.smoothing),
            (y.fps = 1e3 / E),
            (y.duration = P < A ? E : h - P),
            (A = h);
        }),
        (y.pause = function () {
          return l && ((y.isPaused = 1), clearTimeout(l), a(l), a(f), (l = f = 0)), y;
        }),
        (y.resume = function () {
          return l || ((y.isPaused = 0), k()), y;
        }),
        (y.set = function (t, e) {
          return (
            (F[t] = e),
            (L = 'fps' === F.show),
            -1 !== R(t, u) && V(),
            -1 !== R(t, d) && s(O.container, F),
            y
          );
        }),
        (y.showDuration = function () {
          return y.set('show', 'ms'), y;
        }),
        (y.showFps = function () {
          return y.set('show', 'fps'), y;
        }),
        (y.toggle = function () {
          return y.set('show', L ? 'ms' : 'fps'), y;
        }),
        (y.hide = function () {
          return y.pause(), (O.container.style.display = 'none'), y;
        }),
        (y.show = function () {
          return y.resume(), (O.container.style.display = 'block'), y;
        }),
        (y.destroy = function () {
          y.pause(), U(), (y.tick = y.tickStart = function () {});
        }),
        V(),
        k();
    }
    var n,
      o = t.performance;
    n =
      o && (o.now || o.webkitNow)
        ? o[o.now ? 'now' : 'webkitNow'].bind(o)
        : function () {
            return +new Date();
          };
    for (
      var a = t.cancelAnimationFrame || t.cancelRequestAnimationFrame,
        i = t.requestAnimationFrame,
        p = 0,
        h = 0,
        l = (o = ['moz', 'webkit', 'o']).length;
      h < l && !a;
      ++h
    )
      i =
        (a = t[o[h] + 'CancelAnimationFrame'] || t[o[h] + 'CancelRequestAnimationFrame']) &&
        t[o[h] + 'RequestAnimationFrame'];
    a ||
      ((i = function (e) {
        var o = n(),
          a = Math.max(0, 16 - (o - p));
        return (
          (p = o + a),
          t.setTimeout(function () {
            e(o + a);
          }, a)
        );
      }),
      (a = function (t) {
        clearTimeout(t);
      }));
    var c = 'string' === H(document.createElement('div').textContent) ? 'textContent' : 'innerText';
    (D.extend = I),
      (window.FPSMeter = D),
      (D.defaults = {
        interval: 100,
        smoothing: 10,
        show: 'fps',
        toggleOn: 'click',
        decimals: 1,
        maxFps: 60,
        threshold: 100,
        position: 'absolute',
        zIndex: 10,
        left: '5px',
        top: '5px',
        right: 'auto',
        bottom: 'auto',
        margin: '0 0 0 0',
        theme: 'dark',
        heat: 0,
        graph: 0,
        history: 20,
      });
    var u = ['toggleOn', 'theme', 'heat', 'graph', 'history'],
      d = 'position zIndex left top right bottom margin'.split(' ');
  })(window),
  (function (t, e) {
    e.theme = {};
    var n = (e.theme.base = {
      heatmaps: [],
      container: {
        heatOn: null,
        heatmap: null,
        padding: '5px',
        minWidth: '95px',
        height: '30px',
        lineHeight: '30px',
        textAlign: 'right',
        textShadow: 'none',
      },
      count: {
        heatOn: null,
        heatmap: null,
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '5px 10px',
        height: '30px',
        fontSize: '24px',
        fontFamily: 'Consolas, Andale Mono, monospace',
        zIndex: 2,
      },
      legend: {
        heatOn: null,
        heatmap: null,
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '5px 10px',
        height: '30px',
        fontSize: '12px',
        lineHeight: '32px',
        fontFamily: 'sans-serif',
        textAlign: 'left',
        zIndex: 2,
      },
      graph: {
        heatOn: null,
        heatmap: null,
        position: 'relative',
        boxSizing: 'padding-box',
        MozBoxSizing: 'padding-box',
        height: '100%',
        zIndex: 1,
      },
      column: {
        width: 4,
        spacing: 1,
        heatOn: null,
        heatmap: null,
      },
    });
    (e.theme.dark = e.extend({}, n, {
      heatmaps: [
        {
          saturation: 0.8,
          lightness: 0.8,
        },
      ],
      container: {
        background: '#222',
        color: '#fff',
        border: '1px solid #1a1a1a',
        textShadow: '1px 1px 0 #222',
      },
      count: {
        heatOn: 'color',
      },
      column: {
        background: '#3f3f3f',
      },
    })),
      (e.theme.light = e.extend({}, n, {
        heatmaps: [
          {
            saturation: 0.5,
            lightness: 0.5,
          },
        ],
        container: {
          color: '#666',
          background: '#fff',
          textShadow: '1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        },
        count: {
          heatOn: 'color',
        },
        column: {
          background: '#eaeaea',
        },
      })),
      (e.theme.colorful = e.extend({}, n, {
        heatmaps: [
          {
            saturation: 0.5,
            lightness: 0.6,
          },
        ],
        container: {
          heatOn: 'backgroundColor',
          background: '#888',
          color: '#fff',
          textShadow: '1px 1px 0 rgba(0,0,0,.2)',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        },
        column: {
          background: '#777',
          backgroundColor: 'rgba(0,0,0,.2)',
        },
      })),
      (e.theme.transparent = e.extend({}, n, {
        heatmaps: [
          {
            saturation: 0.8,
            lightness: 0.5,
          },
        ],
        container: {
          padding: 0,
          color: '#fff',
          textShadow: '1px 1px 0 rgba(0,0,0,.5)',
        },
        count: {
          padding: '0 5px',
          height: '40px',
          lineHeight: '40px',
        },
        legend: {
          padding: '0 5px',
          height: '40px',
          lineHeight: '42px',
        },
        graph: {
          height: '40px',
        },
        column: {
          width: 5,
          background: '#999',
          heatOn: 'backgroundColor',
          opacity: 0.5,
        },
      }));
  })(window, FPSMeter));
var Fps = pc.createScript('fps');
(Fps.prototype.initialize = function () {
  (this.fps = new FPSMeter({
    heat: !0,
    graph: !0,
  })),
    (this.total = 0),
    (this.count = 0),
    (this.averageFps = 0),
    (this.lowerFps = 20),
    (this.mediumFps = 45),
    (this.higherFps = 46),
    (this.fpsResult = ''),
    setTimeout(
      function (t) {
        (t.averageFps = (t.total / t.count).toFixed(2)),
          t.averageFps >= t.higherFps
            ? (t.fpsResult = 'Higher FPS (' + t.averageFps + ')')
            : t.averageFps >= t.lowerFps && t.averageFps <= t.mediumFps
            ? (t.fpsResult = 'Medium FPS (' + t.averageFps + ')')
            : (t.fpsResult = 'Low FPS (' + t.averageFps + ')'),
          pc.currentMap && pc.app.fire('Analytics:Event', 'FPS:' + pc.currentMap, t.fpsResult);
      },
      5e4,
      this
    );
}),
  (Fps.prototype.update = function (t) {
    this.fps.tick(), (this.total += this.fps.fps), this.count++;
  });
var Overlay = pc.createScript('overlay');
Overlay.attributes.add('focusBulletsEntity', {
  type: 'entity',
}),
  Overlay.attributes.add('focusAmmoEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('focusBulletsMask', {
    type: 'entity',
  }),
  Overlay.attributes.add('focusBulletsInner', {
    type: 'entity',
  }),
  Overlay.attributes.add('blackShadow', {
    type: 'entity',
  }),
  Overlay.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('timeEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('ammoEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('capacityEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('crosshairEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('prepareEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('reloadingTimeEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('infoEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityBuyButton', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityBuyClock', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityBuyKey', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityBar', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityNotification', {
    type: 'entity',
  }),
  Overlay.attributes.add('cardEntities', {
    type: 'entity',
    array: !0,
  }),
  Overlay.attributes.add('cardEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('cardTimer', {
    type: 'entity',
  }),
  Overlay.attributes.add('cardTitle', {
    type: 'entity',
  }),
  Overlay.attributes.add('cardBackground', {
    type: 'entity',
  }),
  Overlay.attributes.add('questEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('questIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('questText', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityBind', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityHolderEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('abilityInfo', {
    type: 'entity',
  }),
  Overlay.attributes.add('friendlyFire', {
    type: 'entity',
  }),
  Overlay.attributes.add('connectivityIssue', {
    type: 'entity',
  }),
  Overlay.attributes.add('messageEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('messageText', {
    type: 'entity',
  }),
  Overlay.attributes.add('teamNotification', {
    type: 'entity',
  }),
  Overlay.attributes.add('teamNotificationText', {
    type: 'entity',
  }),
  Overlay.attributes.add('whiteShadowEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('whiteShadowColor', {
    type: 'entity',
  }),
  Overlay.attributes.add('statusEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('countBackEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('damageIndictator', {
    type: 'entity',
  }),
  Overlay.attributes.add('ricochetIndictator', {
    type: 'entity',
  }),
  Overlay.attributes.add('explosiveIndicator', {
    type: 'entity',
  }),
  Overlay.attributes.add('explosiveIndicatorArrow', {
    type: 'entity',
  }),
  Overlay.attributes.add('explosiveIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('leftDamageEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('rightDamageEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('healthBarEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('healthBarColor', {
    type: 'entity',
  }),
  Overlay.attributes.add('healthValue', {
    type: 'entity',
  }),
  Overlay.attributes.add('teamNameEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('notificationMessage', {
    type: 'entity',
  }),
  Overlay.attributes.add('notificationKill', {
    type: 'entity',
  }),
  Overlay.attributes.add('notificationHolder', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceInfoEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceIconEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceTextBackground', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceTextEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('announceStripeEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('reminderEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('reminderTextEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('leaderboardEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('leaderboardItem', {
    type: 'entity',
  }),
  Overlay.attributes.add('playerStatsEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskLabelEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskTitleEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskIconEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskCountEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('taskLevelEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('achievementEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('achievementName', {
    type: 'entity',
  }),
  Overlay.attributes.add('achievementLevel', {
    type: 'entity',
  }),
  Overlay.attributes.add('achievementIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('holdEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('holdBarEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('circularEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('circularPiece', {
    type: 'entity',
  }),
  Overlay.attributes.add('circularHolder', {
    type: 'entity',
  }),
  Overlay.attributes.add('circularSpinner', {
    type: 'entity',
  }),
  Overlay.attributes.add('skillTimer', {
    type: 'entity',
  }),
  Overlay.attributes.add('skillCountText', {
    type: 'entity',
  }),
  Overlay.attributes.add('skillKeyEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('skillIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('skillClockIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('objectiveEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('objectiveTextEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('meleeIcon', {
    type: 'entity',
  }),
  Overlay.attributes.add('meleeTimer', {
    type: 'entity',
  }),
  Overlay.attributes.add('meleeCountText', {
    type: 'entity',
  }),
  Overlay.attributes.add('meleeKeyEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('throwIconEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('throwSkillEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('meleeIconEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponIconEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponKeyEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponText', {
    type: 'entity',
  }),
  Overlay.attributes.add('icon1Entity', {
    type: 'entity',
  }),
  Overlay.attributes.add('icon2Entity', {
    type: 'entity',
  }),
  Overlay.attributes.add('pointNumberEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('pointHolder', {
    type: 'entity',
  }),
  Overlay.attributes.add('subtitleEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('respawnEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('leftCinema', {
    type: 'entity',
  }),
  Overlay.attributes.add('rightCinema', {
    type: 'entity',
  }),
  Overlay.attributes.add('chatEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('chatWrapperEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('mapImageEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('mapNameEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('modeEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponButtons', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponTimeout', {
    type: 'entity',
  }),
  Overlay.attributes.add('weaponTimeoutText', {
    type: 'entity',
  }),
  Overlay.attributes.add('statsEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('alreadyStarted', {
    type: 'entity',
  }),
  Overlay.attributes.add('alreadyStartedCount', {
    type: 'entity',
  }),
  Overlay.attributes.add('deathBannerEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('deathLoadingEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('pauseEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('garbageEntity', {
    type: 'entity',
  }),
  Overlay.attributes.add('ammoAngleFactor', {
    type: 'number',
    default: 4.15,
  }),
  Overlay.attributes.add('defaultDamageTime', {
    type: 'number',
    default: 2,
  }),
  (Overlay.prototype.initialize = function () {
    (this.isDeath = !1),
      (this.activeTaskTimer = !1),
      (this.taskHideTimer = !1),
      (this.isTransitionPlaying = !1),
      (this.lastSmallBannerUpdate = 0),
      (this.smallBannerSet = !1),
      (this.notifications = []),
      (this.leaderboardItems = []),
      (this.lastRank = {}),
      (this.lastStatUpdate = Date.now()),
      (this.lastBannerShow = Date.now()),
      (this.circularItems = []),
      (this.circularItemsList = []),
      (this.circularCallback = !1),
      (this.isOvertime = !1),
      (pc.isPauseActive = !1),
      (this.isBannerSet = !1),
      (this.pausePlayers = []),
      (this.stats = []),
      (this.playerStats = []),
      (this.ping = 0),
      (this.avgPingCount = 1),
      (this.avgPing = 1),
      (this.reloadingTime = 0),
      (this.cards = []),
      (this.abilities = []),
      (this.abilityHolder = []),
      (this.currentCards = []),
      (this.isAbilitySelected = !1),
      (this.hasAbility = !1),
      (this.lastAnnounceDate = Date.now()),
      (this.lastKillTime = -1),
      (this.killCount = 0),
      (this.myLastRank = -1),
      (this.timers = {}),
      (this.timestamp = 0),
      (this.damageTime = 0),
      (this.ricochetTime = 0),
      (this.maxAmmoValue = 27),
      (this.damagePosition = new pc.Vec3(0, 0, 0)),
      (this.explosivePosition = new pc.Vec3(0, 0, 0)),
      (this.ricochetPosition = new pc.Vec3(0, 0, 0)),
      (this.lastExplosiveWarning = this.now()),
      (this.defaultCrosshairSize = this.crosshairEntity.element.width),
      this.crosshairEntity.setLocalScale(
        pc.settings.crosshairScale,
        pc.settings.crosshairScale,
        pc.settings.crosshairScale
      ),
      pc.settings.hideCrosshair
        ? (this.crosshairEntity.enabled = !1)
        : (this.crosshairEntity.enabled = !0),
      (this.leftCinema.enabled = !1),
      (this.rightCinema.enabled = !1),
      (this.leaderboardItem.enabled = !1),
      (this.leftCinema.element.height = 2500),
      (this.rightCinema.element.height = 2500),
      this.app.on('Overlay:SetAmmo', this.setAmmo, this),
      this.app.on('Overlay:Shoot', this.onShooting, this),
      this.app.on('Overlay:Jump', this.onJumping, this),
      this.app.on('Overlay:Damage', this.onDamage, this),
      this.app.on('Overlay:Ricochet', this.onRicochet, this),
      this.app.on('Overlay:FriendlyFire', this.onFriendlyFire, this),
      this.app.on('Overlay:Circular', this.onCircularMenu, this),
      this.app.on('Overlay:CircularSelect', this.onCircularSelect, this),
      this.app.on('Overlay:SetCustomCrosshair', this.setCustomCrosshair, this),
      this.app.on('Overlay:SetCustomScope', this.setCustomScope, this),
      this.app.on('Overlay:Quest', this.setQuestMessage, this),
      this.app.on('Overlay:Display', this.setDisplayValue, this),
      this.app.on('Overlay:Objective', this.setObjective, this),
      this.app.on('View:State', this.onState, this),
      this.app.on('Overlay:Explosive', this.onExplosive, this),
      this.app.on('Overlay:SkillTimer', this.onSkillTimer, this),
      this.app.on('Overlay:MeleeTimer', this.onMeleeTimer, this),
      this.app.on('Player:Health', this.setHealth, this),
      this.app.on('Player:Death', this.setDeath, this),
      this.app.on('Player:Respawn', this.setRespawn, this),
      this.app.on('Player:Kill', this.onKill, this),
      this.app.on('Player:Team', this.onTeamChange, this),
      this.app.on('Follow:User', this.onFollowUser, this),
      this.app.on('Overlay:ReQueue', this.onReQueue, this),
      this.app.on('Overlay:HideBlackShadow', this.hideBlackShadow, this),
      this.app.on('Overlay:Task', this.onTaskMessage, this),
      this.app.on('Overlay:Cards', this.onCards, this),
      this.app.on('Overlay:SetAbility', this.setAbility, this),
      this.app.on('Overlay:Status', this.setStatus, this),
      this.app.on('Overlay:Unlock', this.onUnlock, this),
      this.app.on('Overlay:Info', this.onInfoMessage, this),
      this.app.on('Overlay:InfoClose', this.onInfoClose, this),
      this.app.on('Overlay:Message', this.onMessageShow, this),
      this.app.on('Overlay:Message@Hide', this.onMessageHide, this),
      this.app.on('Overlay:Notification', this.onNotification, this),
      this.app.on('Overlay:Announce', this.onAnnounce, this),
      this.app.on('Overlay:Reminder', this.setReminder, this),
      this.app.on('Overlay:Leaderboard', this.setLeaderboard, this),
      this.app.on('Overlay:PlayerStats', this.onPlayerStats, this),
      this.app.on('Overlay:Point', this.onPoint, this),
      this.app.on('Overlay:Pause', this.onPause, this),
      this.app.on('Overlay:OpenReport', this.openReport, this),
      this.app.on('Overlay:OpenKickMenu', this.openKickMenu, this),
      this.app.on('Overlay:Subtitle', this.setSubtitle, this),
      (this.defaultWeapons = ['Scar', 'Shotgun', 'Sniper', 'Tec-9']),
      this.app.on('Overlay:Weapon', this.onWeaponChange, this),
      this.app.on('Overlay:OtherIcons', this.onOtherIconSet, this),
      this.app.on('Overlay:WeaponText', this.setWeaponText, this),
      this.app.on('Overlay:Transition', this.onTransition, this),
      this.app.on('Overlay:Gameplay', this.setOverlayStatus, this),
      this.app.on('Overlay:WhiteShadow', this.setWhiteShadow, this),
      this.app.on('Overlay:Ping', this.setPing, this),
      this.app.on('Overlay:Attention', this.showAttention, this),
      this.app.on('Overlay:Sound', this.playSound, this),
      (this.modeElements = this.app.root.findByTag('MODE-UI')),
      this.app.on('Game:Mode', this.onModeSet, this),
      this.app.on('Game:PreStart', this.onPreStart, this),
      this.app.on('Game:Start', this.onStart, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Game:Overtime', this.setOvertime, this),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      this.onSettingsChange(),
      this.app.on('Player:Character', this.onCharacterSet, this),
      this.app.on('Player:Respawn', this.onRespawn, this),
      this.app.on('Player:AllowRespawn', this.allowRespawn, this),
      this.app.on('Map:Loaded', this.onLoaded, this),
      this.app.on('Server:Tick', this.onTick, this),
      (this.subtitleEntity.enabled = !1),
      this.on('destroy', this.onDestroy, this),
      this.timeout(
        function (t) {
          pc.Mouse.isPointerLocked() ||
            pc.isMobile ||
            t.app.fire('Overlay:Message', 'Press [L] to lock your mouse.');
        },
        8e3,
        this
      );
  }),
  (Overlay.prototype.onState = function (t) {
    this.entity.enabled = 'Game' == t;
  }),
  (Overlay.prototype.hideBlackShadow = function () {}),
  (Overlay.prototype.onDestroy = function () {
    for (var t in (this.app.off('View:State', this.onState, this),
    clearTimeout(this.circularMenuTimer),
    clearTimeout(this.friendlyFireTimer),
    clearTimeout(this.teamChangeTimer),
    clearTimeout(this.holdTimer),
    clearTimeout(this.cardTimeout),
    clearTimeout(this.lastWeaponSelection),
    clearTimeout(this.activeTaskTimer),
    clearTimeout(this.taskHideTimer),
    clearTimeout(this.announceTimer),
    this.timers))
      clearTimeout(this.timers[t]), (this.timers[t] = !1);
  }),
  (Overlay.prototype.timeout = function (t, e, i, a, n) {
    var s = this.generateFunctionHash(t, e);
    return (
      clearTimeout(this.timers[s]),
      (this.timers[s] = setTimeout(
        function (e, i, a) {
          t(e, i, a);
        },
        e,
        i,
        a,
        n
      )),
      this.timers[s]
    );
  }),
  (Overlay.prototype.generateFunctionHash = function (t, e) {
    return t.toString() + Date.now() + '' + e;
  }),
  (Overlay.prototype.setLoadingScreen = function (t) {
    var e = t.map;
    if (!e) return !1;
    e.split(' - ').length > 1 && (e = e.split(' - ')[0]) && (e = e.trim()),
      (this.mapNameEntity.element.text = e.toLowerCase()),
      (this.mapImageEntity.element.textureAsset = Utils.getAssetFromURL(e + '-Large.jpg', 'map')),
      (this.mapImageEntity.element.color = pc.colors.white),
      this.app.fire('Timeline:Focus', !0);
  }),
  (Overlay.prototype.onMessageShow = function (t) {
    (this.messageEntity.enabled = !0),
      (this.messageText.element.text = t),
      clearTimeout(this.messageTimer),
      (this.messageTimer = setTimeout(
        function (t) {
          t.messageEntity.enabled = !1;
        },
        5e3,
        this
      ));
  }),
  (Overlay.prototype.onMessageHide = function () {
    if (!this.messageEntity.enabled) return !1;
    (this.messageEntity.enabled = !1), clearTimeout(this.messageTimer);
  }),
  (Overlay.prototype.onSettingsChange = function () {
    !0 === pc.settings.hideChat
      ? (this.chatWrapperEntity.enabled = !1)
      : (this.chatWrapperEntity.enabled = !0),
      pc.settings && !0 === pc.settings.fpsCounter
        ? (this.statsEntity.enabled = !0)
        : (this.statsEntity.enabled = !1),
      pc.settings && !0 === pc.settings.hideUIElements ? this.hideGameplay() : this.showGameplay();
  }),
  (Overlay.prototype.setObjective = function (t, e) {
    (this.objectiveEntity.enabled = e), (this.objectiveTextEntity.element.text = t);
  }),
  (Overlay.prototype.playSound = function (t) {
    this.entity.sound.play(t);
  }),
  (Overlay.prototype.onFollowUser = function (t) {
    this.app.fire('Fetcher:Follow', {
      username: t,
    }),
      this.app.fire('Network:Chat', t + ' followed!');
    var e = [],
      i = Utils.getItem('Followed');
    i && (e = i = JSON.parse(i)), e.push(t), Utils.setItem('Followed', e);
  }),
  (Overlay.prototype.onReQueue = function () {
    this.app.fire('View:Pause', 'ReQueue'),
      pc.currentServer || (pc.currentServer = 'EU'),
      pc.serverCode || (pc.serverCode = '1.0.22'),
      pc.currentMap || (pc.currentMap = 'Sierra'),
      pc.maxPlayers || (pc.maxPlayers = 4),
      this.app.fire('Fetcher:ReQueue', {
        country: pc.currentServer,
        version: pc.serverCode,
        map: pc.currentMap,
        max_player: pc.maxPlayers,
        is_mobile: pc.isMobile ? 1 : 0,
      }),
      (pc.isRequeuing = !0);
  }),
  (Overlay.prototype.onModeSet = function (t, e, i) {
    var a = this.modeElements;
    for (var n in a) {
      var s = a[n];
      -1 === s.tags.list().indexOf(t) ? (s.enabled = !1) : (s.enabled = !0),
        i && i.team && s.tags.list().indexOf('CUSTOM-TEAM') > -1 && (s.enabled = !0),
        i && i.allowAbilities && s.tags.list().indexOf('CUSTOM-ABILITY') > -1 && (s.enabled = !0);
    }
    'GUNGAME' == pc.currentMode
      ? (this.weaponKeyEntity.parent.enabled = !1)
      : (this.weaponKeyEntity.parent.enabled = !0),
      'TDM' == pc.currentMode ||
        'PAYLOAD' == pc.currentMode ||
        (pc.currentModeOptions && pc.currentModeOptions.team) ||
        (this.healthBarColor.element.color = pc.colors.health);
  }),
  (Overlay.prototype.setQuestMessage = function (t, e) {
    if (((this.questText.element.text = e), this.questEntity.enabled)) return !1;
    (this.questEntity.enabled = !0),
      (this.questIcon.element.textureAsset = this.app.assets.find(t)),
      this.timeout(
        function (t) {
          t.questEntity.enabled = !1;
        },
        5e3,
        this
      );
  }),
  (Overlay.prototype.setDisplayValue = function (t, e) {
    var i = this.app.root.findByName(t);
    i && (i.element.text = e + '');
  }),
  (Overlay.prototype.onCharacterSet = function (t) {
    var e = this.app.assets.find(t + '-Throw.png'),
      i = this.app.assets.find(t + '-ThrowSkill.png'),
      a = this.app.assets.find(t + '-Melee.png');
    (this.throwIconEntity.element.textureAsset = e),
      (this.throwSkillEntity.element.textureAsset = i),
      (this.meleeIconEntity.element.textureAsset = a);
  }),
  (Overlay.prototype.hideDesktop = function () {
    if (!Utils.isMobile()) return !1;
    var t = this.app.root.findByTag('OnlyDesktop');
    for (var e in t) {
      t[e].enabled = !1;
    }
  }),
  (Overlay.prototype.allowRespawn = function () {}),
  (Overlay.prototype.onRespawn = function () {}),
  (Overlay.prototype.onPreStart = function () {}),
  (Overlay.prototype.onLoaded = function () {
    this.app.fire('DOM:Update', !0);
  }),
  (Overlay.prototype.onFriendlyFire = function () {
    (this.friendlyFire.enabled = !0),
      clearTimeout(this.friendlyFireTimer),
      (this.friendlyFireTimer = setTimeout(
        function (t) {
          t.friendlyFire.enabled = !1;
        },
        2e3,
        this
      ));
  }),
  (Overlay.prototype.onPlayerStats = function (t) {
    t
      ? ((this.playerStatsEntity.enabled = !0), this.setPlayerStats(this.stats))
      : ((this.playerStatsEntity.enabled = !1), this.clearPlayerStats());
  }),
  (Overlay.prototype.setCustomCrosshair = function () {
    var t = this.app.root.findByTag('CrosshairPart');
    for (var e in t) {
      t[e].enabled = !1;
    }
  }),
  (Overlay.prototype.setCustomScope = function () {
    this.app.root.findByName('Scope').enabled = !1;
  }),
  (Overlay.prototype.onPause = function (t) {
    return (
      !Utils.isMobile() &&
      !pc.isFinished &&
      ('undefined' != typeof app &&
        (t
          ? (app.showPauseMenu(this.stats), this.hideGameplay())
          : (app.hidePauseMenu(), this.showGameplay())),
      void (pc.isPauseActive = t))
    );
  }),
  (Overlay.prototype.openReport = function () {
    this.app.fire('View:Pause', 'Report'),
      this.app.fire('Table:Users', {
        result: this.stats,
      }),
      this.app.fire('Table:KickUsers', {
        result: this.stats,
      });
  }),
  (Overlay.prototype.openKickMenu = function () {
    this.app.fire('View:Pause', 'Kick'),
      this.app.fire('Table:KickUsers', {
        result: this.stats,
      });
  }),
  (Overlay.prototype.clearPausePlayers = function () {
    for (var t = this.pausePlayers.length; t--; ) this.pausePlayers[t].destroy();
  }),
  (Overlay.prototype.showAttention = function (t) {
    'Melee' == t &&
      (this.meleeTimer.setLocalScale(2.5, 2.5, 2.5),
      this.meleeTimer
        .tween(this.meleeTimer.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.4,
          pc.BackOut
        )
        .start(),
      this.entity.sound.play('Error'),
      this.entity.sound.play('Tick-Tock-Short'));
  }),
  (Overlay.prototype.setPausePlayers = function (t) {
    this.clearPausePlayers();
    var e = this.pauseEntity.findByName('Content'),
      i = this.pauseEntity.findByName('Row');
    for (var a in t) {
      var n = t[a],
        s = 38 * -parseInt(a),
        o = this.app.assets.find('Tier-' + n.tier + '.png');
      'GUNGAME' == pc.currentMode && (o = this.app.assets.find('Rank-' + n.tier + '.png'));
      var r = this.app.assets.find(n.skin + '-Thumbnail-3');
      n.heroThumbnail && (r = Utils.getAssetFromURL(n.heroThumbnail));
      var l = i.clone();
      (l.enabled = !0), l.setLocalPosition(0, s, 0);
      var h = l.findByName('Username');
      (h.element.text = Utils.displayUsername(n.username, h.element)),
        (l.findByName('Kill').element.text = n.kill + ''),
        (l.findByName('Death').element.text = n.death + ''),
        (l.findByName('Score').element.text = n.score + ''),
        (l.findByName('Tier').element.textureAsset = o),
        (l.findByName('Character').element.textureAsset = r),
        n.verified &&
          ((l.findByName('Username').findByName('Verified').enabled = !0),
          l.findByName('Username').setLocalPosition(65, 0, 0)),
        n.emoji &&
          ((l.findByName('Username').findByName('Emoji').enabled = !0),
          (l.findByName('Username').findByName('Emoji').enabled = this.app.assets.find(
            'Charm-' + n.emoji + '-Emoji.png'
          )),
          l.findByName('Username').setLocalPosition(65, 0, 0)),
        this.pausePlayers.push(l),
        e.addChild(l);
    }
  }),
  (Overlay.prototype.clearPlayerStats = function () {
    for (var t = this.playerStats.length; t--; ) this.playerStats[t].destroy();
  }),
  (Overlay.prototype.setPlayerStats = function (t) {
    this.clearPlayerStats();
    var e = this.playerStatsEntity.findByName('Content'),
      i = this.playerStatsEntity.findByName('Row');
    for (var a in t) {
      var n = t[a],
        s = 38 * -parseInt(a),
        o = this.app.assets.find('Tier-' + n.tier + '.png');
      'GUNGAME' == pc.currentMode && (o = this.app.assets.find('Rank-' + n.tier + '.png'));
      var r = this.app.assets.find(n.skin + '-Thumbnail-3');
      n.heroSkin && 'Default' != n.heroSkin && (r = Utils.getAssetFromURL(n.heroThumbnail));
      var l = i.clone();
      (l.enabled = !0), l.setLocalPosition(0, s, 0);
      var h = l.findByName('Username');
      (h.element.text = Utils.displayUsername(n.username, h.element)),
        (l.findByName('Kill').element.text = n.kill + ''),
        (l.findByName('Death').element.text = n.death + ''),
        (l.findByName('Score').element.text = n.score + ''),
        (l.findByName('Tier').element.textureAsset = o),
        (l.findByName('Character').element.textureAsset = r),
        n.verified &&
          ((l.findByName('Username').findByName('Verified').enabled = !0),
          l.findByName('Username').setLocalPosition(65, 0, 0)),
        n.emoji &&
          ((l.findByName('Username').findByName('Emoji').enabled = !0),
          (l.findByName('Username').findByName('Emoji').enabled = this.app.assets.find(
            'Charm-' + n.emoji + '-Emoji.png'
          )),
          l.findByName('Username').setLocalPosition(65, 0, 0)),
        this.playerStats.push(l),
        e.addChild(l);
    }
  }),
  (Overlay.prototype.onTeamChange = function (t) {
    if (pc.currentTeam == t) return !1;
    (this.teamNotification.enabled = !0),
      this.teamNotification.setLocalPosition(0, -100, 0),
      (this.teamNotificationText.element.text = 'Your team changed to ' + t + '.'),
      this.teamNotification
        .tween(this.teamNotification.getLocalPosition())
        .to(
          {
            x: 0,
            y: 150,
            z: 0,
          },
          0.8,
          pc.BackOut
        )
        .start(),
      'red' == t
        ? ((this.teamNotification.element.color = pc.colors.redTeam),
          (this.healthBarColor.element.color = pc.colors.redTeam),
          (this.teamNameEntity.element.color = pc.colors.redTeam),
          (this.teamNameEntity.element.text = 'RED'))
        : 'blue' == t &&
          ((this.teamNotification.element.color = pc.colors.blueTeam),
          (this.healthBarColor.element.color = pc.colors.blueTeam),
          (this.teamNameEntity.element.color = pc.colors.blueTeam),
          (this.teamNameEntity.element.text = 'BLUE')),
      clearTimeout(this.teamChangeTimer),
      (this.teamChangeTimer = setTimeout(
        function (t) {
          t.teamNotification.enabled = !1;
        },
        7e3,
        this
      ));
  }),
  (Overlay.prototype.setWhiteShadow = function (t) {
    t
      ? (this.entity.sound.play('White-Shadow'),
        (this.whiteShadowEntity.enabled = !0),
        this.whiteShadowEntity.setLocalScale(80, 80, 80),
        this.whiteShadowEntity
          .tween(this.whiteShadowEntity.getLocalScale())
          .to(
            {
              x: 45,
              y: 45,
              z: 45,
            },
            1,
            pc.SineIn
          )
          .start(),
        (this.whiteShadowColor.element.opacity = 0),
        this.whiteShadowColor
          .tween(this.whiteShadowColor.element)
          .to(
            {
              opacity: 1,
            },
            1,
            pc.SineIn
          )
          .start(),
        (this.holdEntity.enabled = !0),
        clearTimeout(this.holdTimer),
        this.holdBarEntity.setLocalScale(0.01, 1, 1),
        this.holdAnimation && this.holdAnimation.stop(),
        (this.holdAnimation = this.holdBarEntity.tween(this.holdBarEntity.getLocalScale()).to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          1,
          pc.SineIn
        )),
        this.holdAnimation.start())
      : this.holdAnimation &&
        (this.entity.sound.stop('White-Shadow'),
        this.entity.sound.play('Whoosh'),
        (this.whiteShadowEntity.enabled = !1),
        this.holdAnimation.stop(),
        (this.holdAnimation = this.holdBarEntity.tween(this.holdBarEntity.getLocalScale()).to(
          {
            x: 0.01,
            y: 1,
            z: 1,
          },
          0.5,
          pc.SineIn
        )),
        this.holdAnimation.start(),
        (this.holdTimer = setTimeout(
          function (t) {
            t.holdEntity.enabled = !1;
          },
          500,
          this
        )));
  }),
  (Overlay.prototype.setOvertime = function (t) {
    t
      ? ((this.isOvertime = !0), this.entity.sound.play('Overtime-Loop'))
      : ((this.isOvertime = !1), this.entity.sound.stop('Overtime-Loop'));
  }),
  (Overlay.prototype.onStart = function () {
    this.app.fire('Overlay:Gameplay', !0),
      this.clearAbilityList(),
      this.abilityBar.setLocalScale(1, 0.001, 1),
      (this.abilityHolderEntity.enabled = !1),
      (this.skillIcon.enabled = !0),
      (this.abilityNotification.enabled = !1),
      (this.abilityBuyClock.enabled = !0),
      (this.abilityBuyKey.enabled = !1),
      (this.abilityBuyButton.findByName('TierLevel').element.color = pc.colors.gray),
      (this.abilityBuyButton.findByName('Thumbnail').element.color = pc.colors.gray),
      (this.isAbilitySelected = !1),
      (this.isOvertime = !1);
  }),
  (Overlay.prototype.onFinish = function () {
    (pc.isPauseActive = !1),
      (this.taskEntity.enabled = !1),
      (this.achievementEntity.enabled = !1),
      (this.focusBulletsEntity.enabled = !1),
      (this.cardEntity.enabled = !1),
      this.entity.sound.stop('Card-Selection-Loop'),
      this.entity.sound.stop('Overtime-Loop'),
      (this.abilities = []),
      this.hideAllGameplay();
  }),
  (Overlay.prototype.onPoint = function (t) {
    if (pc.isFinished) return !1;
    if (this.isDeath) return !1;
    var e = this.pointNumberEntity.clone();
    (e.element.text = t + ''),
      (e.enabled = !0),
      e.setLocalPosition(0, -50, 0),
      this.pointHolder.addChild(e),
      this.entity.sound.play('Point'),
      e
        .tween(e.getLocalPosition())
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      e
        .tween(e.element)
        .to(
          {
            opacity: 1,
          },
          0.2,
          pc.Linear
        )
        .start(),
      this.timeout(
        function (t) {
          t
            .tween(t.getLocalPosition())
            .to(
              {
                x: 0,
                y: 50,
                z: 0,
              },
              0.2,
              pc.BackOut
            )
            .start(),
            t
              .tween(t.element)
              .to(
                {
                  opacity: 0,
                },
                0.2,
                pc.Linear
              )
              .start();
        },
        400,
        e
      ),
      this.timeout(
        function (t) {
          t.destroy();
        },
        600,
        e
      );
  }),
  (Overlay.prototype.onCards = function (t) {
    for (var e in ((this.taskEntity.enabled = !1),
    (this.achievementEntity.enabled = !1),
    (this.focusBulletsEntity.enabled = !1),
    (this.cardEntity.enabled = !0),
    (this.cardTimer.enabled = !0),
    (this.cardTitle.enabled = !0),
    (this.isAbilitySelected = !1),
    (this.abilityBuyClock.enabled = !0),
    (this.abilityBuyKey.enabled = !1),
    (this.abilityBuyButton.findByName('TierLevel').element.color = pc.colors.gray),
    (this.abilityBuyButton.findByName('Thumbnail').element.color = pc.colors.gray),
    (this.cardBackground.element.color = pc.colors.gray),
    (this.cardBackground.element.opacity = 0.5),
    (this.currentCards = t),
    this.entity.sound.play('Card-Selection-Loop'),
    this.entity.sound.play('Show-Cards'),
    this.entity.sound.play('Praying'),
    this.currentCards)) {
      var i = this.currentCards[e],
        a = this.app.assets.find(i + '-Card.png'),
        n = 0,
        s = 220 * ((r = parseInt(e)) - 1);
      0 === r ? (n = 3) : 2 === r && (n = -3),
        this.cardEntities[e].glow ||
          ((this.cardEntities[e].glow = this.cardEntities[e].findByName('Glow')),
          (this.cardEntities[e].key = this.cardEntities[e].findByName('Key'))),
        this.cardEntities[e].glow.setLocalScale(1, 1, 1),
        (this.cardEntities[e].glow.element.opacity = 0),
        (this.cardEntities[e].glow.element.color = pc.colors.white),
        (this.cardEntities[e].key.enabled = !1),
        this.cardEntities[e].setLocalScale(0.5, 0.5, 0.5),
        this.cardEntities[e].setLocalPosition(s, 0, 0),
        this.cardEntities[e].setLocalEulerAngles(0, 0, n),
        (this.cardEntities[e].enabled = !0),
        (this.cardEntities[e].element.opacity = 0),
        (this.cardEntities[e].element.textureAsset = a);
    }
    for (var o in this.cardEntities) {
      var r,
        l = this.cardEntities[o],
        h = ((s = 220 * ((r = parseInt(o)) - 1)), r % 2 == 0 ? 0 : 30),
        y = 0.6 * (r + 1);
      l
        .tween(l.getLocalPosition())
        .to(
          {
            x: s,
            y: h,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .delay(y)
        .start(),
        l
          .tween(l.getLocalScale())
          .to(
            {
              x: 0.7,
              y: 0.7,
              z: 0.7,
            },
            1,
            pc.BackOut
          )
          .delay(y)
          .start(),
        this.timeout(
          function (t, e) {
            (e.key.enabled = !0),
              (e.glow.enabled = !0),
              e.glow
                .tween(e.glow.element)
                .to(
                  {
                    opacity: 0.1,
                  },
                  0.2,
                  pc.Linear
                )
                .delay(0.3)
                .start(),
              e.glow
                .tween(e.glow.getLocalScale())
                .to(
                  {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                  },
                  0.2,
                  pc.BackOut
                )
                .delay(0.3)
                .start(),
              (t.entity.sound.slots['Show-Card'].pitch = 0.1 * Math.random() + 1),
              t.entity.sound.play('Show-Card');
          },
          1e3 * y,
          this,
          l
        ),
        l
          .tween(l.element)
          .to(
            {
              opacity: 1,
            },
            0.5,
            pc.Linear
          )
          .delay(y)
          .start();
    }
    clearTimeout(this.cardTimeout),
      (this.cardTimeout = setTimeout(
        function (t) {
          t.app.fire('Overlay:SetAbility', 0), t.app.fire('Network:Card', 1);
        },
        8e3,
        this
      ));
  }),
  (Overlay.prototype.setAbility = function (t) {
    if (this.isAbilitySelected) return !1;
    var e = this.cardEntities[t],
      i = this.currentCards[t];
    for (var a in (clearTimeout(this.cardTimeout),
    (this.isAbilitySelected = !0),
    this.cardEntities)) {
      var n = this.cardEntities[a];
      parseInt(a) != t && (n.enabled = !1);
    }
    (this.cardTimer.enabled = !1),
      (this.cardTitle.enabled = !1),
      this.entity.sound.play('Select-Ability'),
      this.app.fire('Player:Speak', 'Weapon-Selection', 1),
      (e.key.enabled = !1),
      (e.glow.element.opacity = 0.8),
      (e.glow.element.color = pc.colors.active),
      e.glow.setLocalScale(1.05, 1.05, 1.05),
      e
        .tween(e.getLocalPosition())
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .start(),
      e
        .tween(e.getLocalScale())
        .to(
          {
            x: 1.1,
            y: 1.1,
            z: 1.1,
          },
          0.5,
          pc.BackOut
        )
        .delay(0.4)
        .start(),
      e
        .tween(e.getEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.3,
          pc.BackOut
        )
        .start(),
      this.timeout(
        function (t) {
          t.entity.sound.play('Add-Ability'),
            e
              .tween(e.getLocalPosition())
              .to(
                {
                  x: 600,
                  y: -100,
                  z: 0,
                },
                0.4,
                pc.Linear
              )
              .start(),
            e
              .tween(e.getLocalScale())
              .to(
                {
                  x: 0.32,
                  y: 0.32,
                  z: 0.32,
                },
                0.35,
                pc.Linear
              )
              .delay(0.05)
              .start(),
            e
              .tween(e.getLocalEulerAngles())
              .rotate(
                {
                  x: 0,
                  y: 0,
                  z: 90,
                },
                0.2,
                pc.BackOut
              )
              .delay(0.2)
              .start(),
            t.timeout(function () {
              t.cardBackground
                .tween(t.cardBackground.element)
                .to(
                  {
                    opacity: 1,
                    color: pc.colors.black,
                  },
                  0.2,
                  pc.Linear
                )
                .start();
            }, 400),
            t.timeout(function () {
              t.entity.sound.stop('Card-Selection-Loop'),
                t.entity.sound.stop('Praying'),
                (t.cardEntity.enabled = !1);
            }, 600);
        },
        1400,
        this
      ),
      -1 === this.abilities.indexOf(i) && this.abilities.push(i),
      this.setAbilityList(),
      this.app.fire('Analytics:Event', 'Card', i);
  }),
  (Overlay.prototype.clearAbilityList = function () {
    for (var t = this.abilityHolder.length; t--; ) this.abilityHolder[t].destroy();
    this.abilityHolder = [];
  }),
  (Overlay.prototype.setAbilityList = function () {
    this.clearAbilityList();
    for (var t = this.abilities.length, e = 0; t--; ) {
      if (e < 2) {
        var i = this.app.assets.find(this.abilities[t] + '-32x.png'),
          a = this.abilityEntity.clone();
        (a.enabled = !0),
          a.setLocalPosition(25 * -t, 0, 0),
          (a.element.textureAsset = i),
          this.abilityHolder.push(a),
          this.abilityHolderEntity.addChild(a);
      }
      e++;
    }
    (this.skillIcon.enabled = !1), (this.abilityHolderEntity.enabled = !0);
  }),
  (Overlay.prototype.setSubtitle = function (t) {
    return (
      !pc.isFinished &&
      !this.isDeath &&
      ((this.subtitleEntity.element.text = t),
      (this.subtitleEntity.enabled = !0),
      void this.timeout(
        function (t) {
          t.subtitleEntity.enabled = !1;
        },
        2500,
        this
      ))
    );
  }),
  (Overlay.prototype.onOtherIconSet = function (t, e) {
    var i = this.app.assets.find(t + '-Thumbnail-White.png');
    i
      ? ((this.icon1Entity.element.textureAsset = i), (this.icon1Entity.enabled = !0))
      : (this.icon1Entity.enabled = !1);
    var a = this.app.assets.find(e + '-Thumbnail-White.png');
    a
      ? ((this.icon2Entity.element.textureAsset = a), (this.icon2Entity.enabled = !0))
      : (this.icon2Entity.enabled = !1);
  }),
  (Overlay.prototype.setWeaponText = function (t) {
    this.weaponText.element.text = t;
  }),
  (Overlay.prototype.onWeaponChange = function (t) {
    var e = this.defaultWeapons.indexOf(t);
    this.weaponKeyEntity.element.text = e + 1 + '';
    var i = this.app.assets.find(t + '-Thumbnail-White.png');
    this.weaponIconEntity.element.textureAsset = i;
    var a = this.weaponButtons.findByTag('Weapon');
    for (var n in a) {
      var s = a[n];
      s.name == t ? (s.element.color = pc.colors.active) : (s.element.color = pc.colors.gray);
    }
    (this.weaponTimer = 8),
      (this.weaponTimeout.enabled = !0),
      this.weaponTimeoutSet(),
      clearTimeout(this.lastWeaponSelection),
      (this.lastWeaponSelection = setTimeout(
        function (t) {
          t.weaponTimeout.enabled = !1;
        },
        8e3,
        this
      ));
  }),
  (Overlay.prototype.weaponTimeoutSet = function () {
    (this.weaponTimeoutText.element.text = 'Please wait ' + this.weaponTimer + ' seconds...'),
      this.weaponTimer--,
      this.weaponTimer > 0 &&
        this.timeout(
          function (t) {
            t.weaponTimeoutSet();
          },
          1e3,
          this
        );
  }),
  (Overlay.prototype.clearCircularMenu = function () {
    for (var t = this.circularItems.length; t--; ) this.circularItems[t].destroy();
    (this.circularItems = []), (this.circularItemsList = []);
  }),
  (Overlay.prototype.showSmallBanner = function (t) {}),
  (Overlay.prototype.triggerSmallBanner = function (t) {}),
  (Overlay.prototype.onCircularMenu = function (t) {
    if ((this.clearCircularMenu(), this.showDeathBanner(), 'GUNGAME' == pc.currentMode)) return !1;
    if ('CUSTOM' == pc.currentMode) return !1;
    (this.circularEntity.enabled = !0), (this.circularPiece.enabled = !1);
    var e = 0,
      i = 23.15 * t.length;
    for (var a in t) {
      var n = t[a],
        s = this.app.assets.find(n + '-Thumbnail-White.png'),
        o = parseInt(a),
        r = 0.1 * o,
        l = this.circularPiece.clone();
      l.setLocalScale(0.5, 0.5, 0.5),
        (l.findByName('Key').element.text = o + 1 + ''),
        (l.findByName('Icon').element.textureAsset = s),
        l.findByName('Icon').setLocalEulerAngles(0, 0, -e - i),
        l.setLocalEulerAngles(0, 0, e),
        l
          .tween(l.getLocalScale())
          .to(
            {
              x: 1.1,
              y: 1.1,
              z: 1.1,
            },
            0.35 + r,
            pc.BackOut
          )
          .delay(r)
          .start(),
        this.timeout(
          function (t, e) {
            (e.enabled = !0), t.entity.sound.play('Whoosh');
          },
          1e3 * r,
          this,
          l
        ),
        this.circularHolder.addChild(l),
        this.circularItems.push(l),
        this.circularItemsList.push(n),
        (e -= 62);
    }
    this.circularHolder.setLocalEulerAngles(0, 0, i),
      (this.circularSpinner.enabled = !0),
      this.circularEntity.setLocalPosition(0, -300, 0),
      this.circularEntity
        .tween(this.circularEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 125,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .start(),
      this.timeout(
        function (t) {
          t.hideCircularMenu();
        },
        3500,
        this
      );
  }),
  (Overlay.prototype.showDeathBanner = function () {
    (this.deathBannerEntity.enabled = !0),
      (this.deathLoadingEntity.enabled = !0),
      setTimeout(
        function (t) {
          t.setDeathBanner();
        },
        100,
        this
      ),
      (this.lastBannerShow = Date.now());
  }),
  (Overlay.prototype.setDeathBanner = function () {
    var t = this;
    if (PokiSDK && !PokiSDK.isAdBlocked()) {
      var e = document.getElementById('death-venge-728x90');
      e
        ? (PokiSDK.destroyAd(e),
          PokiSDK.displayAd(e, '728x90', function () {
            t.setRespawnTimer();
          }))
        : this.setRespawnTimer();
    } else this.setRespawnTimer();
  }),
  (Overlay.prototype.setRespawnTimer = function () {
    this.app.fire('Network:SetRespawnTimer'),
      setTimeout(
        function (t) {
          (t.deathBannerEntity.enabled = !1), (t.deathLoadingEntity.enabled = !1);
        },
        3500,
        this
      );
  }),
  (Overlay.prototype.onCircularSelect = function (t, e) {
    var i = this.circularItemsList.indexOf(t);
    if (i > -1) {
      var a = this.circularItems[i];
      if (a && a.element && a.element.color) {
        a.getLocalEulerAngles().clone();
        for (var n in ((a.element.color = pc.colors.active),
        a
          .tween(a.getLocalScale())
          .to(
            {
              x: 1.2,
              y: 1.2,
              z: 1.2,
            },
            0.2,
            pc.BackOut
          )
          .start(),
        a.setLocalEulerAngles(0, 0, 0),
        a.findByName('Icon').setLocalEulerAngles(0, 0, 0),
        this.circularHolder
          .tween(this.circularHolder.getLocalEulerAngles())
          .rotate(
            {
              x: 0,
              y: 0,
              z: 0,
            },
            0.2,
            pc.BackOut
          )
          .start(),
        (this.circularSpinner.enabled = !1),
        this.circularItems)) {
          var s = this.circularItems[n];
          i != n && s.destroy();
        }
        this.entity.sound.play('Select');
      }
    }
    this.circularMenuTimer = setTimeout(
      function (t) {
        t.hideCircularMenu();
      },
      1500,
      this
    );
  }),
  (Overlay.prototype.hideCircularMenu = function () {
    this.entity.sound.play('Whoosh'),
      this.circularEntity
        .tween(this.circularEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: -300,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .start(),
      clearTimeout(this.circularMenuTimer),
      (this.circularMenuTimer = setTimeout(
        function (t) {
          t.circularEntity.enabled = !1;
        },
        500,
        this
      ));
  }),
  (Overlay.prototype.setLeaderboard = function (t) {
    for (var e = this.leaderboardItems.length; e--; ) this.leaderboardItems[e].destroy();
    (this.leaderboardItems = []), (this.stats = t);
    var i = 1.3,
      a = 0,
      n = 0;
    for (var s in t) {
      var o = t[s],
        r = parseInt(s),
        l = this.app.assets.find('Tier-' + o.tier + '.png'),
        h = this.app.assets.find(o.skin + '-Thumbnail-1');
      o.heroSkin && 'Default' != o.heroSkin && (h = Utils.getAssetFromURL(o.heroThumbnail)),
        'GUNGAME' == pc.currentMode && (l = this.app.assets.find('Rank-' + o.tier + '.png'));
      var y = this.leaderboardItem.clone();
      (y.enabled = !0),
        this.lastRank[o.username] > -1e3
          ? (y.setLocalPosition(-3 * parseInt(s), this.lastRank[o.username], 0),
            y
              .tween(y.getLocalPosition())
              .to(
                {
                  x: -3 * parseInt(s),
                  y: a,
                  z: 0,
                },
                0.3,
                pc.Linear
              )
              .start(),
            this.lastRank[o.username] != a &&
              (this.app.fire('Timeline:SortingEffect', !0), this.entity.sound.play('Small-Whoosh')))
          : y.setLocalPosition(-3 * parseInt(s), a, 0),
        y.setLocalScale(i, i, i),
        y.findByName('Bar').setLocalScale(o.bar, 1, 1),
        (y.findByName('Tier').element.textureAsset = l),
        (y.findByName('Rank').element.text = r + 1 + '.'),
        (y.findByName('Character').element.textureAsset = h);
      var c = y.findByName('Username');
      (c.element.text = Utils.displayUsername(o.username, c.element)),
        'red' == o.team
          ? ((y.findByName('Team').element.color = pc.colors.redTeam),
            (y.findByName('Team').enabled = !0))
          : 'blue' == o.team
          ? ((y.findByName('Team').element.color = pc.colors.blueTeam),
            (y.findByName('Team').enabled = !0))
          : (y.findByName('Team').enabled = !1),
        o.isMe &&
          ((y.findByName('Username').element.color = pc.colors.me),
          (y.findByName('Leader').element.color = pc.colors.me),
          (n = r));
      var p = 200;
      o.verified
        ? ((y.findByName('Username').findByName('Verified').enabled = !0),
          y.findByName('Username').setLocalPosition(55, -7, 0),
          (p = Math.max(y.findByName('Username').element.width + 90 + 20, 165)),
          (y.element.width = p))
        : o.emoji
        ? ((y.findByName('Username').findByName('Emoji').enabled = !0),
          (statRow.findByName('Username').findByName('Emoji').enabled = this.app.assets.find(
            'Charm-' + stat.emoji + '-Emoji.png'
          )),
          y.findByName('Username').setLocalPosition(55, -7, 0),
          (p = Math.max(y.findByName('Username').element.width + 90 + 20, 165)),
          (y.element.width = p))
        : ((p = Math.max(y.findByName('Username').element.width + 90, 165)), (y.element.width = p)),
        (y.findByName('Leader').enabled = 0 === r),
        this.leaderboardEntity.addChild(y),
        this.leaderboardItems.push(y),
        (this.lastRank[o.username] = a),
        (a += -45 * (i -= 0.15) - 10);
    }
    (this.leaderboardEntity.element.height = 50 - a),
      this.myLastRank != n &&
        (0 === n &&
          0 !== this.myLastRank &&
          this.app.fire('Overlay:Subtitle', 'You are the leader now!'),
        0 === this.myLastRank &&
          0 !== n &&
          this.app.fire('Overlay:Subtitle', 'You are no longer leader.'),
        (this.myLastRank = n));
  }),
  (Overlay.prototype.onMeleeTimer = function (t) {
    this.setMeleeState(!1), (this.currentMeleeTime = t + 1), this.setMeleeTime();
  }),
  (Overlay.prototype.onSkillTimer = function (t) {
    this.setSkillState(!1), (this.currentSkillTime = t + 1), this.setSkillTime();
  }),
  (Overlay.prototype.setSkillTime = function () {
    this.currentSkillTime--,
      (this.skillCountText.element.text = this.currentSkillTime + ''),
      this.currentSkillTime <= 0
        ? this.setSkillState(!0)
        : this.timeout(
            function (t) {
              t.setSkillTime();
            },
            1e3,
            this
          );
  }),
  (Overlay.prototype.setMeleeTime = function () {
    this.currentMeleeTime--,
      (this.meleeCountText.element.text = this.currentMeleeTime + ''),
      this.currentMeleeTime <= 0
        ? this.setMeleeState(!0)
        : this.timeout(
            function (t) {
              t.setMeleeTime();
            },
            1e3,
            this
          );
  }),
  (Overlay.prototype.setMeleeState = function (t) {
    (this.meleeKeyEntity.enabled = t),
      (this.meleeTimer.enabled = !t),
      t
        ? ((this.meleeIcon.element.color = new pc.Color(1, 1, 1)), this.entity.sound.play('Active'))
        : (this.meleeIcon.element.color = this.skillClockIcon.element.color);
  }),
  (Overlay.prototype.setSkillState = function (t) {
    (this.skillKeyEntity.enabled = t),
      (this.skillTimer.enabled = !t),
      t
        ? ((this.abilityIcon.element.color = new pc.Color(1, 1, 1)),
          (this.skillIcon.element.color = new pc.Color(1, 1, 1)),
          this.entity.sound.play('Active'))
        : ((this.skillIcon.element.color = this.skillClockIcon.element.color),
          (this.abilityIcon.element.color = this.skillClockIcon.element.color));
  }),
  (Overlay.prototype.onExplosive = function (t) {
    if ('Star' == t.type) return !1;
    (this.explosiveEntity = t),
      (this.lastExplosiveWarning = this.now()),
      (this.explosiveIndicator.enabled = !0),
      (this.explosiveAnimation1 = this.explosiveIndicator
        .tween(this.explosiveIndicator.getLocalScale())
        .to(
          {
            x: 1.05,
            y: 1.05,
            z: 1.05,
          },
          0.15,
          pc.Linear
        )
        .yoyo(!0)
        .loop(!0)),
      (this.explosiveAnimation2 = this.explosiveIndicatorArrow
        .tween(this.explosiveIndicatorArrow.getLocalScale())
        .to(
          {
            x: 1.35,
            y: 1.35,
            z: 1.35,
          },
          0.1,
          pc.Linear
        )
        .yoyo(!0)
        .loop(!0)),
      this.explosiveAnimation1.start(),
      this.explosiveAnimation2.start(),
      this.entity.sound.play('Tick-Tock'),
      this.timeout(
        function (t) {
          t.explosiveAnimation1.stop(),
            t.explosiveAnimation2.stop(),
            t.entity.sound.stop('Tick-Tock'),
            (t.explosiveIndicator.enabled = !1);
        },
        1500,
        this
      );
  }),
  (Overlay.prototype.updateExplosiveIndicator = function () {
    if (this.now() - this.lastExplosiveWarning > 3e3) return !1;
    if (!this.explosiveEntity) return (this.explosiveIndicator.enabled = !1), !1;
    var t = this.explosiveEntity.getPosition(),
      e = this.cameraEntity.getPosition();
    if (t.clone().sub(e).length() > 60)
      return (this.explosiveIndicator.enabled = !1), this.entity.sound.stop('Tick-Tock'), !1;
    var i = Date.now() - this.explosiveEntity.startTime;
    i > 1e3 && i < 1400
      ? ((this.explosiveIndicatorArrow.element.color = pc.colors.danger),
        this.entity.sound.slots['Emergency-Alarm'].isPlaying ||
          this.entity.sound.play('Emergency-Alarm'))
      : (this.explosiveIndicatorArrow.element.color = pc.colors.explosive);
    var a = this.movement.lookX % 360,
      n = (Utils.lookAt(e.x, e.z, t.x, t.z) * pc.math.RAD_TO_DEG - a) % 360;
    (n -= 180),
      this.explosiveIndicator.setLocalEulerAngles(0, 0, n),
      this.explosiveIcon.setLocalEulerAngles(0, 0, -n);
  }),
  (Overlay.prototype.setOverlayStatus = function (t) {
    !0 === t ? this.showGameplay() : this.hideGameplay();
  }),
  (Overlay.prototype.onTransition = function (t) {
    return (
      !this.isTransitionPlaying &&
      !!pc.isMapLoaded &&
      (t
        ? ((this.leftCinema.element.color = t), (this.rightCinema.element.color = t))
        : ((this.leftCinema.element.color = pc.colors.black),
          (this.rightCinema.element.color = pc.colors.black)),
      (this.isTransitionPlaying = !0),
      (this.leftCinema.enabled = !0),
      (this.rightCinema.enabled = !0),
      (this.entity.sound.slots.Whoosh.pitch = 1.1),
      this.entity.sound.play('Whoosh'),
      this.leftCinema.setLocalEulerAngles(0, 0, 15),
      this.leftCinema.setLocalScale(0.1, 0, 0),
      this.leftCinema
        .tween(this.leftCinema.getLocalScale())
        .to(
          {
            x: 1.4,
            y: 1,
            z: 1,
          },
          0.35,
          pc.Linear
        )
        .start(),
      this.rightCinema.setLocalEulerAngles(0, 0, 15),
      this.rightCinema.setLocalScale(0.1, 0, 0),
      this.rightCinema
        .tween(this.rightCinema.getLocalScale())
        .to(
          {
            x: 1.4,
            y: 1,
            z: 1,
          },
          0.35,
          pc.Linear
        )
        .start(),
      this.timeout(
        function (t) {
          t.leftCinema.setLocalEulerAngles(0, 0, -15),
            t.leftCinema
              .tween(t.leftCinema.getLocalScale())
              .to(
                {
                  x: 0.1,
                  y: 1,
                  z: 1,
                },
                0.35,
                pc.Linear
              )
              .start(),
            t.rightCinema.setLocalEulerAngles(0, 0, -15),
            t.rightCinema
              .tween(t.rightCinema.getLocalScale())
              .to(
                {
                  x: 0.1,
                  y: 1,
                  z: 1,
                },
                0.35,
                pc.Linear
              )
              .start(),
            (t.entity.sound.slots.Whoosh.pitch = 1),
            t.entity.sound.play('Whoosh');
        },
        400,
        this
      ),
      void this.timeout(
        function (t) {
          t.isTransitionPlaying = !1;
        },
        600,
        this
      ))
    );
  }),
  (Overlay.prototype.setDeath = function () {
    this.hideGameplay(),
      (this.subtitleEntity.enabled = !1),
      (this.taskEntity.enabled = !1),
      (this.achievementEntity.enabled = !1),
      (this.focusBulletsEntity.enabled = !1),
      this.entity.sound.play('Death-UI'),
      (this.isDeath = !0);
  }),
  (Overlay.prototype.setHealth = function (t) {
    this.health = t;
    var e = (497 * this.health) / 100;
    this.healthBarEntity
      .tween(this.healthBarEntity.element)
      .to(
        {
          width: e,
        },
        0.5,
        pc.SineOut
      )
      .start(),
      (this.healthValue.element.text = Math.abs(this.health) + ''),
      'TDM' == pc.currentMode ||
        'PAYLOAD' == pc.currentMode ||
        (pc.currentModeOptions && pc.currentModeOptions.team) ||
        (this.health < 30
          ? (this.healthBarColor.element.color = pc.colors.lowHealth)
          : (this.healthBarColor.element.color = pc.colors.health));
  }),
  (Overlay.prototype.setStatus = function (t) {
    (this.statusEntity.enabled = !0),
      this.statusEntity.setLocalPosition(0, 50, 0),
      this.statusEntity
        .tween(this.statusEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: -85,
            z: 0,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      (this.statusEntity.element.text = t),
      this.timeout(
        function (t) {
          t.statusEntity.enabled = !1;
        },
        4e3,
        this
      );
  }),
  (Overlay.prototype.setRespawn = function () {
    (this.respawnEntity.enabled = !1),
      (this.isDeath = !1),
      pc.isFinished || pc.isPauseActive || this.showGameplay();
  }),
  (Overlay.prototype.setReminder = function (t) {
    if (this.reminderEntity.enabled) return !1;
    (this.reminderEntity.enabled = !0),
      this.reminderEntity.setLocalPosition(0, -140, 0),
      this.reminderEntity
        .tween(this.reminderEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 130,
            z: 0,
          },
          0.25,
          pc.BackOut
        )
        .start(),
      (this.reminderTextEntity.element.text = t.toUpperCase()),
      this.timeout(
        function (t) {
          t.reminderEntity.enabled = !1;
        },
        3e3,
        this
      );
  }),
  (Overlay.prototype.onTaskMessage = function (t, e, i, a, n, s) {
    if (this.achievementEntity.enabled) return !1;
    if (this.taskEntity.enabled) return this.setTaskScore(t, e, i, a, 0), !1;
    if (this.activeTaskTimer) return !1;
    var o = 2500;
    i - e < 5 && (o = 800),
      s
        ? (this.taskLabelEntity.enabled = !1)
        : ((this.abilityBuyButton.findByName('TierLevel').element.text = t),
          (this.taskLabelEntity.enabled = !0)),
      n && (this.taskIconEntity.element.textureAsset = this.app.assets.find(n)),
      (this.activeTaskTimer = setTimeout(
        function (s) {
          s._onTaskMessage(t, e, i, a, n);
        },
        o,
        this
      ));
  }),
  (Overlay.prototype.setTaskScore = function (t, e, i, a, n) {
    (this.taskTitleEntity.element.text = t),
      (this.taskCountEntity.element.text = i + ' / ' + a),
      this.taskLevelEntity.setLocalScale(e / a, 1, 1),
      this.taskLevelEntity
        .tween(this.taskLevelEntity.getLocalScale())
        .to(
          {
            x: i / a,
            y: 1,
            z: 1,
          },
          0.8,
          pc.BackOut
        )
        .delay(n)
        .start(),
      this.abilityBar.setLocalScale(1, e / a, 1),
      this.abilityBar
        .tween(this.abilityBar.getLocalScale())
        .to(
          {
            x: 1,
            y: i / a,
            z: 1,
          },
          0.8,
          pc.BackOut
        )
        .delay(n)
        .start(),
      this.setTaskHideTimer();
  }),
  (Overlay.prototype._onTaskMessage = function (t, e, i, a, n) {
    (this.taskEntity.enabled = !0),
      this.taskEntity.setLocalPosition(0, -75, 0),
      this.taskEntity
        .tween(this.taskEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 25,
            z: 0,
          },
          0.25,
          pc.BackOut
        )
        .start(),
      this.setTaskScore(t, e, i, a, 0.25),
      this.timeout(
        function (t) {
          t.entity.sound.play('Data-Increase');
        },
        250,
        this
      ),
      this.setTaskHideTimer();
  }),
  (Overlay.prototype.setTaskHideTimer = function () {
    clearTimeout(this.taskHideTimer),
      (this.taskHideTimer = setTimeout(
        function (t) {
          t.taskEntity
            .tween(t.taskEntity.getLocalPosition())
            .to(
              {
                x: 0,
                y: -75,
                z: 0,
              },
              0.1,
              pc.BackOut
            )
            .start(),
            t.timeout(function () {
              (t.taskEntity.enabled = !1), (t.activeTaskTimer = !1);
            }, 100);
        },
        3e3,
        this
      ));
  }),
  (Overlay.prototype.onUnlock = function (t, e) {
    (this.taskEntity.enabled = !1),
      (this.abilityNotification.enabled = !1),
      (this.abilityBuyClock.enabled = !1),
      (this.abilityBuyKey.enabled = !0),
      (this.abilityBuyButton.findByName('TierLevel').element.color = pc.colors.white),
      (this.abilityBuyButton.findByName('Thumbnail').element.color = pc.colors.white),
      (this.abilityBuyButton.findByName('TierLevel').element.text = t),
      (this.achievementName.element.text = t + ' - Abilities'),
      (this.achievementLevel.element.text = 'Unlocked (' + e + '/' + e + ')');
    var i = this.achievementEntity.findByTag('Card');
    for (var a in i) {
      var n = i[a],
        s = 0.3 * parseInt(a) + 0.5;
      n.setLocalPosition(84.136, 89.082, 0),
        n.setLocalEulerAngles(0, 0, 0),
        (n.element.opacity = 1),
        n
          .tween(n.getLocalPosition())
          .to(
            {
              x: 640,
              y: 265,
            },
            1,
            pc.BackOut
          )
          .delay(s)
          .start(),
        n
          .tween(n.getLocalEulerAngles())
          .rotate(
            {
              z: 165,
            },
            1,
            pc.Linear
          )
          .delay(s)
          .start(),
        n
          .tween(n.element)
          .to(
            {
              opacity: 0,
            },
            0.2,
            pc.Linear
          )
          .delay(s + 0.5)
          .start(),
        this.timeout(
          function (t) {
            t.entity.sound.play('Whoosh');
          },
          1e3 * s,
          this
        );
    }
    (this.achievementEntity.enabled = !0),
      this.achievementEntity.setLocalPosition(0, -75, 0),
      this.achievementEntity
        .tween(this.achievementEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 38,
            z: 0,
          },
          0.15,
          pc.BackOut
        )
        .start(),
      this.hasAbility ||
        ((this.abilityNotification.enabled = !0),
        (this.abilityInfo.enabled = !0),
        this.abilityInfo.setLocalPosition(-145, 0, 0),
        this.abilityInfo
          .tween(this.abilityInfo.getLocalPosition())
          .to(
            {
              x: -165,
              y: 0,
              z: 0,
            },
            0.3,
            pc.Linear
          )
          .yoyo(!0)
          .repeat(7)
          .start(),
        this.timeout(
          function (t) {
            (t.abilityInfo.enabled = !1), (t.abilityNotification.enabled = !1);
          },
          1e4,
          this
        ),
        (this.hasAbility = !0)),
      this.entity.sound.play('Deep-Whoosh'),
      this.timeout(
        function (t) {
          t.achievementEntity
            .tween(t.achievementEntity.getLocalPosition())
            .to(
              {
                x: 0,
                y: -75,
                z: 0,
              },
              0.1,
              pc.BackOut
            )
            .start(),
            t.timeout(function () {
              t.achievementEntity.enabled = !1;
            }, 100);
        },
        3e3,
        this
      );
  }),
  (Overlay.prototype.fullDamage = function () {
    (this.damageTime = this.timestamp + 2 * this.defaultDamageTime),
      (this.leftDamageEntity.element.opacity = 1),
      (this.rightDamageEntity.element.opacity = 1);
  }),
  (Overlay.prototype.onRicochet = function (t) {
    if (this.movement.isDeath) return !1;
    (this.ricochetTime = this.timestamp + this.defaultDamageTime),
      (this.ricochetIndictator.element.opacity = 1),
      (this.ricochetPosition.x = t.x),
      (this.ricochetPosition.y = t.y),
      (this.ricochetPosition.z = t.z);
  }),
  (Overlay.prototype.onDamage = function (t) {
    if (this.movement.isDeath) return !1;
    (this.damageTime = this.timestamp + this.defaultDamageTime),
      (this.damageIndictator.element.opacity = 1),
      (this.damagePosition.x = t.x),
      (this.damagePosition.y = t.y),
      (this.damagePosition.z = t.z);
    var e = this.cameraEntity.getPosition(),
      i = this.movement.lookX % 360,
      a =
        (Utils.lookAt(e.x, e.z, this.damagePosition.x, this.damagePosition.z) * pc.math.RAD_TO_DEG -
          i) %
        360;
    a > -180 && a < 0 && (this.leftDamageEntity.element.opacity = 0.8),
      a > 0 && a < 180 && (this.rightDamageEntity.element.opacity = 0.8),
      a < -180 && a > -360 && (this.rightDamageEntity.element.opacity = 0.8),
      this.damageIndictator.setLocalScale(1.8, 1.8, 1.8),
      this.damageIndictator
        .tween(this.damageIndictator.getLocalScale())
        .to(
          {
            x: 0.92,
            y: 0.92,
            z: 0.92,
          },
          0.18,
          pc.BackInOut
        )
        .start();
    var n = Math.round(2 * Math.random()) + 1;
    this.entity.sound.play('Body-Impact-' + n), this.movement.impact();
  }),
  (Overlay.prototype.onKill = function (t, e) {
    var i = 'Kill',
      a = 'Kill-Icon',
      n = 'Kill';
    'Kill' == e
      ? ((i = 'Kill Point'), (a = 'Kill-Icon'), (n = 'Kill'))
      : 'Headshot' == e
      ? ((i = 'Headshot'), (a = 'Headshot-Icon'), (n = 'Headshot'))
      : 'FirstBlood' == e
      ? ((i = 'First Blood'), (a = 'First-Blood-Icon'), (n = 'Kill'))
      : 'Drilled' == e
      ? ((i = 'Drilled'), (a = 'Kill-Drilled'), (n = '3x'))
      : 'PickedOff' == e
      ? ((i = 'Drilled'), (a = 'Kill-Drilled'), (n = '4x'))
      : 'Nailed' == e
      ? ((i = 'Nailed'), (a = 'Kill-Nailed'), (n = '4x'))
      : 'Pumped' == e
      ? ((i = 'Pumped'), (a = 'Kill-Pumped'), (n = '2x'))
      : '360d' == e
      ? ((i = '360 Trick Shot'), (a = 'Kill-360d'), (n = 'God'))
      : 'Revenge' == e
      ? ((i = 'Re-venge'), (a = 'Revenge-Icon'), (n = '3x'))
      : '2x' == e
      ? ((i = 'Double Kill'), (a = 'Kill-2x'), (n = '2x'))
      : '3x' == e
      ? ((i = 'Triple Kill (3x)'), (a = 'Kill-3x'), (n = '3x'))
      : '4x' == e
      ? ((i = 'Quadra kill (4x)'), (a = 'Kill-4x'), (n = '3x'))
      : '5x' == e
      ? ((i = 'Rampage (5x)'), (a = 'Kill-5x'), (n = '3x'))
      : '6x' == e
      ? ((i = 'Unstoppable (6x)'), (a = 'Kill-6x'), (n = '3x'))
      : '7x' == e
      ? ((i = 'Savage (7x)'), (a = 'Kill-7x'))
      : '8x' == e
      ? ((i = 'Immortal (8x)'), (a = 'Kill-8x'), (n = '3x'))
      : '9x' == e
      ? ((i = 'Godlike'), (a = 'Kill-9x'), (n = '4x'))
      : '10x' == e
      ? ((i = 'Annihilation!'), (a = 'God-Icon'), (n = 'God'))
      : 'Suicide' == e
      ? ((i = 'Suicide'), (a = 'Suicide-Icon'), (n = 'Suicide'))
      : 'Drown' == e
      ? ((i = 'Drown'), (a = 'Suicide-Icon'), (n = 'Suicide'))
      : 'Throw' == e
      ? ((i = 'Thrower'), (a = 'Throw-Icon'), (n = 'Throw'))
      : 'Capture' == e
      ? ((i = 'Capture'), (a = 'Capture-Icon'), (n = 'Point'))
      : 'Rank 1' == e
      ? ((i = 'Rank 1'), (a = 'Rank-1'), (n = 'Rank-Up'))
      : 'Rank 2' == e
      ? ((i = 'Rank 2'), (a = 'Rank-2'), (n = 'Rank-Up-2'))
      : 'Rank 3' == e
      ? ((i = 'Rank 3'), (a = 'Rank-3'), (n = 'Rank-Up'))
      : 'Rank 4' == e
      ? ((i = 'Rank 4'), (a = 'Rank-4'), (n = 'Rank-Up-2'))
      : 'Rank 5' == e
      ? ((i = 'Rank 5'), (a = 'Rank-5'), (n = 'Rank-Up'))
      : 'Rank 6' == e
      ? ((i = 'Rank 6'), (a = 'Rank-6'), (n = 'Rank-Up-2'))
      : 'Rank 7' == e
      ? ((i = 'Rank 7'), (a = 'Rank-7'), (n = 'Rank-Up'))
      : 'Rank 8' == e
      ? ((i = 'Rank 8'), (a = 'Rank-8'), (n = 'Rank-Up-2'))
      : 'Rank 9' == e
      ? ((i = 'Rank 9'), (a = 'Rank-9'), (n = 'Rank-Up'))
      : 'Rank 10' == e
      ? ((i = 'Rank 10'), (a = 'Rank-10'), (n = 'Rank-Up-2'))
      : 'Rank Lost' == e
      ? ((i = 'Rank Lost'), (a = 'Death-Icon'), (n = 'Suicide'))
      : 'Delivered 1x' == e
      ? ((i = 'Delivered 1x'), (a = 'BlackCoin-Icon'), (n = 'Collapse'))
      : 'Delivered 2x' == e
      ? ((i = 'Delivered 2x'), (a = 'BlackCoin-Icon'), (n = 'Collapse-2x'))
      : 'Delivered 3x' == e
      ? ((i = 'Delivered 3x'), (a = 'BlackCoin-Icon'), (n = 'Collapse-3x'))
      : 'Delivered 4x' == e
      ? ((i = 'Delivered 4x'), (a = 'BlackCoin-Icon'), (n = 'Collapse-4x'))
      : 'Delivered 5x' == e
      ? ((i = 'Delivered 5x'), (a = 'BlackCoin-Icon'), (n = 'Collapse-5x'))
      : 'Delivered' == e
      ? ((i = 'Delivered'), (a = 'BlackCoin-Icon'), (n = 'Collapse'))
      : 'Trapped' == e
      ? ((i = 'Trapped'), (a = 'Spike-Icon'), (n = 'Kill'))
      : 'Trap' == e
      ? ((i = 'Trap Kill'), (a = 'Spike-Icon'), (n = '4x'))
      : 'Flag-Delivered' == e && ((i = 'Flag Delivered'), (a = 'Flag-Save-Icon'), (n = 'Rank-Up'));
    var s = '+';
    t < 0 && (s = ''), this.app.fire('Overlay:Announce', i, s + t + ' score', n, a);
  }),
  (Overlay.prototype.onAnnounce = function (t, e, i, a) {
    if (pc.settings && !0 === pc.settings.hideMedals) return !1;
    (this.announceEntity.enabled = !0),
      this.announceIconEntity.setLocalScale(3, 3, 3),
      this.announceIconEntity
        .tween(this.announceIconEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.15,
          pc.SineOut
        )
        .start();
    var n = this.app.assets.find(a + '.png');
    if (
      ((this.announceIconEntity.element.textureAsset = n),
      (this.announceIconEntity.element.opacity = 0),
      this.announceIconEntity
        .tween(this.announceIconEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.15,
          pc.SineOut
        )
        .start(),
      (this.announceTextEntity.element.text = t.toUpperCase()),
      (this.announceTextEntity.element.opacity = 0),
      this.announceTextEntity
        .tween(this.announceTextEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.15,
          pc.SineOut
        )
        .delay(0.15)
        .start(),
      this.announceStripeEntity.setLocalScale(2.5, 1, 1),
      this.announceStripeEntity
        .tween(this.announceStripeEntity.getLocalScale())
        .to(
          {
            x: 0.015,
            y: 1,
            z: 1,
          },
          0.3,
          pc.SineOut
        )
        .start(),
      (this.announceStripeEntity.element.opacity = 0.3),
      this.announceStripeEntity
        .tween(this.announceStripeEntity.element)
        .to(
          {
            opacity: 0,
          },
          0.15,
          pc.SineOut
        )
        .delay(0.25)
        .start(),
      (this.announceInfoEntity.element.text = e.toUpperCase()),
      (this.announceInfoEntity.element.opacity = 0),
      this.announceInfoEntity
        .tween(this.announceInfoEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.3,
          pc.SineOut
        )
        .delay(0.5)
        .start(),
      e.startsWith('-')
        ? (this.announceInfoEntity.element.color = pc.colors.danger)
        : (this.announceInfoEntity.element.color = pc.colors.green),
      (this.announceTextBackground.element.width = this.announceTextEntity.element.width + 100),
      this.announceInfoEntity.setLocalPosition(0, -7, 0),
      this.announceInfoEntity
        .tween(this.announceInfoEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: -22,
            z: 0,
          },
          0.3,
          pc.SineOut
        )
        .delay(0.5)
        .start(),
      clearTimeout(this.announceTimer),
      (this.announceTimer = setTimeout(
        function (t) {
          t.announceEntity.enabled = !1;
        },
        4500,
        this
      )),
      i)
    ) {
      var s = 'Announce-' + i;
      Date.now() - this.lastAnnounceDate < 3e3
        ? (this.entity.sound.slots[s].pitch += 0.1)
        : (this.entity.sound.slots[s].pitch = 1),
        this.entity.sound.play(s);
    }
    this.lastAnnounceDate = Date.now();
  }),
  (Overlay.prototype.updateCrosshair = function (t) {
    var e = this.cameraEntity.getPosition(),
      i = this.movement.lookX % 360;
    if (
      ((this.crosshairEntity.element.width = pc.math.lerp(
        this.crosshairEntity.element.width,
        this.defaultCrosshairSize,
        0.25
      )),
      (this.crosshairEntity.element.height = this.crosshairEntity.element.width),
      this.ricochetTime > this.timestamp)
    ) {
      var a = Utils.lookAt(e.x, e.z, this.ricochetPosition.x, this.ricochetPosition.z);
      (this.ricochetIndictator.element.opacity = pc.math.lerp(
        this.ricochetIndictator.element.opacity,
        0,
        0.1
      )),
        this.ricochetIndictator.setLocalEulerAngles(0, 0, a * pc.math.RAD_TO_DEG - i);
    }
    if (this.damageTime > this.timestamp) {
      var n = Utils.lookAt(e.x, e.z, this.damagePosition.x, this.damagePosition.z);
      (this.damageIndictator.element.opacity = pc.math.lerp(
        this.damageIndictator.element.opacity,
        0,
        0.05
      )),
        (this.leftDamageEntity.element.opacity = pc.math.lerp(
          this.leftDamageEntity.element.opacity,
          0,
          0.01
        )),
        (this.rightDamageEntity.element.opacity = pc.math.lerp(
          this.rightDamageEntity.element.opacity,
          0,
          0.01
        )),
        this.damageIndictator.setLocalEulerAngles(0, 0, n * pc.math.RAD_TO_DEG - i);
    }
  }),
  (Overlay.prototype.setAmmo = function () {
    var t = Math.max(this.movement.currentWeapon.ammo, 0);
    if (
      ((this.ammoEntity.element.text = t + ''),
      (this.focusAmmoEntity.element.text = t + ''),
      !this.focusBulletsEntity.enabled)
    )
      return !1;
    this.focusBulletsMask.setLocalEulerAngles(
      0,
      0,
      -(this.maxAmmoValue - this.movement.currentWeapon.ammo) * this.ammoAngleFactor
    ),
      this.focusBulletsInner.setLocalEulerAngles(
        0,
        0,
        (this.maxAmmoValue - this.movement.currentWeapon.ammo) * this.ammoAngleFactor
      ),
      this.focusAmmoEntity.setLocalScale(1.5, 1.5, 1.5),
      this.focusAmmoEntity
        .tween(this.focusAmmoEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.2,
          pc.CircularInOut
        )
        .start();
  }),
  (Overlay.prototype.onShooting = function () {
    this.crosshairEntity
      .tween(this.crosshairEntity.element)
      .to(
        {
          width: 65,
          height: 65,
        },
        0.045,
        pc.SineOut
      )
      .start(),
      this.setAmmo();
  }),
  (Overlay.prototype.onJumping = function () {
    this.crosshairEntity
      .tween(this.crosshairEntity.element)
      .to(
        {
          width: 70,
          height: 70,
        },
        0.15,
        pc.SineOut
      )
      .start();
  }),
  (Overlay.prototype.onNotification = function (t, e, i, a) {
    var n = 35 * -this.notifications.length,
      s = !1;
    if ('message' == t)
      ((s = this.notificationMessage.clone()).findByName('Message').element.text = e),
        (s.element.width = 8 * (Utils.cleanUsername(e).length + 1));
    else if ('kill' == t && e.killer && e.killed) {
      var o = Utils.cleanUsername(e.killer).length,
        r = o + Utils.cleanUsername(e.killed).length,
        l = e.killedSkin,
        h = e.killerSkin;
      if (
        (((s = this.notificationKill.clone()).findByName('Gibbon').element.color = e.color),
        (s.findByName('Gibbon').element.width = 7 * (o + 20)),
        (s.findByName('Killer').element.text = e.killer),
        (s.findByName('Killed').element.text = e.killed),
        (s.element.width = 7 * (r + 17)),
        console.log(e),
        e.weapon)
      ) {
        var y = e.weapon;
        'string' != typeof y && (y = y.name);
        var c = this.app.assets.find(y + '-Thumbnail-White.png');
        c && (s.findByName('Icon').element.textureAsset = c);
      } else s.findByName('Icon').element.textureAsset = this.app.assets.find('Skull-Icon.png');
      var p = this.app.assets.find(l + '-Thumbnail-2');
      s.findByName('KilledPicture').element.textureAsset = p;
      var d = this.app.assets.find(h + '-Thumbnail-2');
      s.findByName('KillerPicture').element.textureAsset = d;
    }
    if (!s) return !1;
    (s.enabled = !0),
      s.setLocalPosition(180, n, 0),
      s
        .tween(s.getLocalPosition())
        .to(
          {
            x: 0,
            y: n,
            z: 0,
          },
          0.15,
          pc.BackOut
        )
        .start(),
      this.notificationHolder.addChild(s),
      this.notifications.push(s),
      this.entity.sound.play('Whoosh'),
      a && this.entity.sound.play(a),
      this.timeout(
        function (t, e) {
          t.destroy(), e.notifications.splice(0, 1);
        },
        3500,
        s,
        this
      );
  }),
  (Overlay.prototype.onTick = function (t, e) {
    this.isOvertime
      ? ((this.timeEntity.element.text = t),
        (this.timeEntity.element.color = pc.colors.health),
        (this.timeEntity.element.fontSize = 35))
      : ((this.timeEntity.element.text = Utils.mmss(e)),
        (this.timeEntity.element.color = pc.colors.white),
        (this.timeEntity.element.fontSize = 25)),
      t < 0 && !pc.isFinished
        ? ((this.alreadyStarted.enabled = !0), (this.alreadyStartedCount.element.text = 20 + t))
        : (this.alreadyStarted.enabled = !1),
      t >= 0 && t <= 5
        ? ((this.countBackEntity.enabled = !0),
          (this.countBackEntity.element.text = t),
          this.entity.sound.play('Count'))
        : ((this.countBackEntity.enabled = !1),
          this.isOvertime && !pc.isFinished && this.entity.sound.play('Overtime-Count'));
  }),
  (Overlay.prototype.onInfoMessage = function (t) {
    this.infoEntity.enabled ||
      ((this.infoEntity.enabled = !0),
      (this.infoEntity.findByName('Message').element.text = t + ''),
      this.app.fire('Mouse:Unlock'),
      (window.onbeforeunload = null));
  }),
  (Overlay.prototype.onInfoClose = function () {
    this.infoEntity.enabled = !1;
  }),
  (Overlay.prototype.showPrepare = function () {
    (this.prepareEntity.enabled = !0),
      this.prepareEntity.setLocalScale(0.5, 0.5, 0.5),
      this.prepareEntity
        .tween(this.prepareEntity.getLocalScale())
        .to(
          {
            x: 1.5,
            y: 1.5,
            z: 1.5,
          },
          0.1,
          pc.SineOut
        )
        .start(),
      (this.reloadingTime = 2.2);
  }),
  (Overlay.prototype.hidePrepare = function () {
    this.prepareEntity.enabled = !1;
  }),
  (Overlay.prototype.showGameplay = function () {
    if (pc.settings && !0 === pc.settings.hideUIElements) return !1;
    var t = this.entity.findByTag('Gameplay');
    for (var e in t) {
      var i = t[e];
      i && (i.enabled = !0);
    }
    this.hideDesktop();
  }),
  (Overlay.prototype.hideGameplay = function () {
    var t = this.entity.findByTag('Gameplay');
    for (var e in t) {
      var i = t[e];
      i && (i.enabled = !1);
    }
  }),
  (Overlay.prototype.hideAllGameplay = function () {
    this.hideGameplay();
    var t = this.entity.findByTag('OnlyGame');
    for (var e in t) {
      var i = t[e];
      i && (i.enabled = !1);
    }
  }),
  (Overlay.prototype.setPing = function (t) {
    (this.ping = t),
      (this.avgPing += t),
      this.avgPingCount++,
      this.avgPing / this.avgPingCount > 300 && this.avgPingCount > 10
        ? (this.connectivityIssue.enabled = !0)
        : (this.connectivityIssue.enabled = !1),
      this.avgPingCount > 10 && ((this.avgPingCount = 1), (this.avgPing = 1));
  }),
  (Overlay.prototype.updateStatsEntity = function (t) {
    if (Date.now() - this.lastStatUpdate < 1e3) return !1;
    var e = Math.floor(1e3 / (1e3 * t));
    (this.statsEntity.element.text = e + 'FPS - ' + this.ping + 'MS'),
      (this.lastStatUpdate = Date.now()),
      e < 30 || this.ping > 300
        ? (this.statsEntity.element.color = pc.colors.danger)
        : (this.statsEntity.element.color = pc.colors.green);
  }),
  (Overlay.prototype.now = function () {
    return this.app._time;
  }),
  (Overlay.prototype.update = function (t) {
    if (
      (this.updateCrosshair(t),
      this.updateExplosiveIndicator(),
      this.updateStatsEntity(t),
      !0 === this.prepareEntity.enabled &&
        ((this.reloadingTimeEntity.element.text = Math.max(this.reloadingTime, 0).toFixed(1)),
        (this.reloadingTime -= t)),
      'undefined' != typeof app)
    ) {
      var e =
        ('Pause' == app.page && app.transition.completed) ||
        pc.isFinished ||
        !app.transition.completed;
      this.setOverlayStatus(!e);
    }
    this.timestamp += t;
  });
var Weapon = pc.createScript('weapon');
Weapon.attributes.add('type', {
  type: 'string',
  enum: [
    {
      Rifle: 'Rifle',
    },
    {
      Shotgun: 'Shotgun',
    },
    {
      Sniper: 'Sniper',
    },
    {
      Melee: 'Melee',
    },
    {
      Throwable: 'Throwable',
    },
    {
      Launcher: 'Launcher',
    },
  ],
  default: 'Rifle',
}),
  Weapon.attributes.add('weight', {
    type: 'string',
    enum: [
      {
        Light: 'Light',
      },
      {
        Heavy: 'Heavy',
      },
    ],
    default: 'Light',
  }),
  Weapon.attributes.add('tempAnimation', {
    type: 'boolean',
    default: !1,
  }),
  Weapon.attributes.add('isShootable', {
    type: 'boolean',
    default: !0,
  }),
  Weapon.attributes.add('isAutomatic', {
    type: 'boolean',
    default: !0,
  }),
  Weapon.attributes.add('isFocusable', {
    type: 'boolean',
    default: !0,
  }),
  Weapon.attributes.add('isRightHanded', {
    type: 'boolean',
    default: !1,
  }),
  Weapon.attributes.add('shootTime', {
    type: 'number',
    default: 0.1,
  }),
  Weapon.attributes.add('recoil', {
    type: 'number',
  }),
  Weapon.attributes.add('spread', {
    type: 'number',
    default: 500,
  }),
  Weapon.attributes.add('focusSpread', {
    type: 'number',
    default: 200,
  }),
  Weapon.attributes.add('damage', {
    type: 'number',
    default: 20,
  }),
  Weapon.attributes.add('distanceMultiplier', {
    type: 'number',
    default: 1,
  }),
  Weapon.attributes.add('ammo', {
    type: 'number',
    default: 20,
  }),
  Weapon.attributes.add('capacity', {
    type: 'number',
    default: 20,
  }),
  Weapon.attributes.add('hiddenReload', {
    type: 'boolean',
    default: !1,
  }),
  Weapon.attributes.add('reloadingTime', {
    type: 'number',
    default: 2.2,
  }),
  Weapon.attributes.add('cameraShake', {
    type: 'number',
    default: 10,
  }),
  Weapon.attributes.add('focusFov', {
    type: 'number',
    default: 45,
  }),
  Weapon.attributes.add('barrelName', {
    type: 'string',
  }),
  Weapon.attributes.add('magazineName', {
    type: 'string',
  }),
  Weapon.attributes.add('sliderName', {
    type: 'string',
  }),
  Weapon.attributes.add('sliderLimit', {
    type: 'number',
    default: -220,
  }),
  Weapon.attributes.add('hasSlider', {
    type: 'boolean',
  }),
  Weapon.attributes.add('rotationSlider', {
    type: 'boolean',
  }),
  Weapon.attributes.add('doodahEntity', {
    type: 'entity',
  }),
  Weapon.attributes.add('doodahReference', {
    type: 'entity',
  }),
  Weapon.attributes.add('modelEntity', {
    type: 'entity',
  }),
  Weapon.attributes.add('armEntity', {
    type: 'entity',
  }),
  Weapon.attributes.add('rightArmEntity', {
    type: 'entity',
  }),
  Weapon.attributes.add('magazinePoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('barrelPoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('bulletPoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('muzzlePoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('handPoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('rightHandPoint', {
    type: 'entity',
  }),
  Weapon.attributes.add('ammoEntity', {
    type: 'entity',
  }),
  Weapon.attributes.add('scopeOverlay', {
    type: 'entity',
  }),
  (Weapon.prototype.initialize = function () {
    (this.currentDoodahSpeed = 0),
      (this.player = !1),
      (this.locked = !1),
      this.doodahEntity &&
        (this.doodahReference.setLocalPosition(
          this.entity.findByName('DoodahPoint').getLocalPosition()
        ),
        (this.accessory = this.doodahEntity.findByName('Model')),
        !0 === pc.settings.hideCharms && (this.doodahEntity.enabled = !1)),
      this.hasSlider &&
        ((this.slider = this.entity.findByName(this.sliderName)),
        (this.bounceZ = 0),
        this.slider && (this.sliderStartPosition = this.slider.getLocalPosition().clone())),
      this.rotationSlider &&
        ((this.slider = this.entity.findByName(this.sliderName)),
        (this.bounceZ = 0),
        this.slider && (this.sliderStartRotation = this.slider.getLocalEulerAngles().clone())),
      this.magazineName &&
        ((this.magazine = this.entity.findByName(this.magazineName)),
        this.magazine && this.magazine.reparent(this.magazinePoint)),
      this.barrelName &&
        ((this.barrel = this.entity.findByName(this.barrelName)),
        this.barrel && this.barrel.reparent(this.barrelPoint)),
      this.app.on('Weapon:Lock', this.onLockChange, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Weapon.prototype.onDestroy = function () {
    clearTimeout(this.reloadSound);
  }),
  (Weapon.prototype.onLockChange = function (t) {
    this.locked = t;
  }),
  (Weapon.prototype.prepare = function () {
    this.armEntity &&
      (this.armEntity.setLocalPosition(this.handPoint.getLocalPosition().clone()),
      this.armEntity.setLocalEulerAngles(this.handPoint.getLocalEulerAngles().clone())),
      this.rightArmEntity &&
        (this.rightHandPoint
          ? (this.rightArmEntity.setLocalPosition(this.rightHandPoint.getLocalPosition().clone()),
            this.rightArmEntity.setLocalEulerAngles(
              this.rightHandPoint.getLocalEulerAngles().clone()
            ))
          : this.rightArmEntity.setLocalPosition(0, 0, 0));
  }),
  (Weapon.prototype.hideArms = function () {
    this.armEntity.setLocalPosition(this.handPoint.getLocalPosition().clone()),
      this.armEntity
        .tween(this.armEntity.getLocalPosition())
        .to(
          {
            x: -0.3,
            y: -1.2,
            z: 0,
          },
          0.2,
          pc.BackInOut
        )
        .start();
  }),
  (Weapon.prototype.magazineThrow = function () {
    this.barrelPoint &&
      (this.barrelPoint
        .tween(this.barrelPoint.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: -55,
          },
          0.4,
          pc.BackInOut
        )
        .start(),
      this.ammoEntity.setLocalPosition(-500, 0, 0),
      this.ammoEntity
        .tween(this.ammoEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.2,
          pc.BackInOut
        )
        .delay(0.3)
        .start(),
      setTimeout(
        function (t) {
          t.entity.sound.play('Bullet-Put'), t.entity.sound.play('Whoosh');
        },
        350,
        this
      )),
      this.magazinePoint.setLocalPosition(0, 0, 0),
      this.magazinePoint.setLocalEulerAngles(0, 0, 0),
      this.magazinePoint
        .tween(this.magazinePoint.getLocalPosition())
        .to(
          {
            x: 0.5,
            y: -7,
            z: 0,
          },
          0.4,
          pc.BackInOut
        )
        .start(),
      this.magazinePoint
        .tween(this.magazinePoint.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: 30,
          },
          0.3,
          pc.BackInOut
        )
        .start(),
      this.entity.sound.play('Unload'),
      this.app.fire('Player:Shake', !0);
  }),
  (Weapon.prototype.magazineAttach = function () {
    this.barrelPoint &&
      this.barrelPoint
        .tween(this.barrelPoint.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.2,
          pc.BackInOut
        )
        .start(),
      this.magazinePoint
        .tween(this.magazinePoint.getLocalPosition())
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.2,
          pc.BackInOut
        )
        .start(),
      this.magazinePoint
        .tween(this.magazinePoint.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.2,
          pc.BackInOut
        )
        .start();
    var t = this.handPoint.getLocalPosition().clone();
    this.armEntity
      .tween(this.armEntity.getLocalPosition())
      .to(
        {
          x: t.x,
          y: t.y,
          z: t.z,
        },
        0.2,
        pc.BackInOut
      )
      .delay(0.2)
      .start(),
      this.entity.sound.play('Load'),
      this.app.fire('Player:Shake', !0);
  }),
  (Weapon.prototype.shoot = function () {
    (this.entity.sound.slots.Fire.pitch = 1 - 0.1 * Math.random()),
      this.entity.sound.play('Fire'),
      (this.bounceZ = this.sliderLimit),
      'Sniper' == this.entity.name &&
        (clearTimeout(this.reloadSound),
        (this.reloadSound = setTimeout(
          function (t) {
            t.entity.sound.play('Reload');
          },
          700,
          this
        )));
  }),
  (Weapon.prototype.focus = function () {
    this.entity.sound.slots.Focus &&
      ((this.entity.sound.slots.Focus.pitch = 1 - 0.1 * Math.random()),
      this.entity.sound.play('Focus'));
  }),
  (Weapon.prototype.stopShooting = function () {
    this.isAutomatic && (this.entity.sound.stop('Fire'), this.entity.sound.play('Tail'));
  }),
  (Weapon.prototype.reload = function () {
    this.entity.sound.play('Reload'), (this.bounceZ = this.sliderLimit);
  }),
  (Weapon.prototype.updateDoodah = function () {
    if (!this.player) return !1;
    var t = 0.01 * this.player.rigidbody.linearVelocity.length();
    t = Math.max(t, 0.1);
    var e = this.doodahReference.getPosition(),
      i = e.clone().sub(this.doodahEntity.getPosition()).length(),
      a = 0.8 * Math.cos(0.0095 * this.app._time) * this.currentDoodahSpeed * t;
    (this.currentDoodahSpeed =
      i > 0.16 && t > 0.1
        ? pc.math.lerp(this.currentDoodahSpeed, i, 0.5)
        : pc.math.lerp(this.currentDoodahSpeed, 0, 0.01)),
      this.accessory && this.accessory.setLocalEulerAngles(0, 0, 500 * a),
      this.doodahReference.setLocalPosition(a, 0, 0),
      this.doodahEntity.lookAt(e);
  }),
  (Weapon.prototype.update = function (t) {
    if (this.locked) return !1;
    this.hasSlider &&
      this.slider &&
      (this.slider.setLocalPosition(
        this.sliderStartPosition.x + this.bounceZ,
        this.sliderStartPosition.y,
        this.sliderStartPosition.z
      ),
      (this.bounceZ = pc.math.lerp(this.bounceZ, 0, 0.1))),
      this.rotationSlider &&
        this.slider &&
        (this.slider.setLocalEulerAngles(
          this.sliderStartRotation.x + this.bounceZ,
          this.sliderStartRotation.y,
          this.sliderStartRotation.z
        ),
        (this.bounceZ = pc.math.lerp(this.bounceZ, 0, 0.1))),
      this.doodahEntity && this.updateDoodah(t);
  });
var EffectManager = pc.createScript('effectManager');
EffectManager.attributes.add('shootRay', {
  type: 'entity',
}),
  EffectManager.attributes.add('shootRayCount', {
    type: 'number',
  }),
  EffectManager.attributes.add('impactEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('splashEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('hitEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('killEffect', {
    type: 'entity',
  }),
  EffectManager.attributes.add('explosionSmokeEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('bulletEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('skullEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('sprayEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('sprayEntityLight', {
    type: 'entity',
  }),
  EffectManager.attributes.add('bulletTranslate', {
    type: 'vec3',
  }),
  EffectManager.attributes.add('bulletRotate', {
    type: 'vec3',
  }),
  EffectManager.attributes.add('maxBulletTime', {
    type: 'number',
    default: 2,
  }),
  EffectManager.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('spectatorCameraEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('garbageEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('bulletHolder', {
    type: 'entity',
  }),
  EffectManager.attributes.add('mapEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('networkEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('rocketEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('grenadeEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('throwPower', {
    type: 'number',
    default: 1e3,
  }),
  EffectManager.attributes.add('grenadeTime', {
    type: 'number',
    default: 1.5,
  }),
  EffectManager.attributes.add('explosionEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('grappleEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('grapples', {
    type: 'entity',
    array: !0,
  }),
  EffectManager.attributes.add('loudSoundEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('impactSoundEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('traceEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('shurikenEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('axeEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('abilityHolder', {
    type: 'entity',
  }),
  EffectManager.attributes.add('explosionEffect', {
    type: 'entity',
  }),
  EffectManager.attributes.add('killSphereEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('destructibleEffect', {
    type: 'entity',
  }),
  EffectManager.attributes.add('crackEffect', {
    type: 'entity',
  }),
  EffectManager.attributes.add('totemEntity', {
    type: 'entity',
  }),
  EffectManager.attributes.add('testBox', {
    type: 'entity',
  }),
  EffectManager.attributes.add('breakable', {
    type: 'string',
    array: !0,
  }),
  EffectManager.attributes.add('explosive', {
    type: 'string',
    array: !0,
  }),
  EffectManager.attributes.add('impactable', {
    type: 'string',
    array: !0,
  }),
  EffectManager.attributes.add('placableObjects', {
    type: 'entity',
    array: !0,
  }),
  EffectManager.attributes.add('mapHolder', {
    type: 'entity',
  }),
  (EffectManager.prototype.initialize = function () {
    (this.timestamp = 0),
      (this.shootRays = []),
      (this.impactParticles = []),
      (this.sparkParticles = []),
      (this.hitParticles = []),
      (this.bullets = []),
      (this.skullAnimation = !1),
      (this.grenades = []),
      (this.sparkIndex = 0),
      (this.bulletIndex = 0),
      (this.shootRayIndex = 0),
      (this.shurikenSpread = 0),
      (this.thunderTimer = !1),
      (this.lastExplosionTime = Date.now()),
      this.app.on('EffectManager:Fire', this.onFire, this),
      this.app.on('EffectManager:Bullet', this.onBulletThrow, this),
      this.app.on('EffectManager:Throw', this.onThrow, this),
      this.app.on('EffectManager:Rocket', this.onRocket, this),
      this.app.on('EffectManager:Hit', this.onHit, this),
      this.app.on('EffectManager:Skull', this.onSkullShow, this),
      this.app.on('EffectManager:KillSphere', this.onKillSphere, this),
      this.app.on('EffectManager:CustomSound', this.onCustomSound, this),
      this.app.on('EffectManager:ExplosionEffect', this.setExplosionEffect, this),
      this.app.on('EffectManager:Place', this.setPlace, this),
      this.app.on('EffectManager:Destructible', this.setDestructible, this),
      this.app.on('EffectManager:Crack', this.setCrack, this),
      this.app.on('EffectManager:Totem', this.setTotem, this),
      this.app.on('EffectManager:RemoveEffect', this.removeEffect, this),
      this.app.on('EffectManager:Shuriken', this.onShuriken, this),
      this.app.on('EffectManager:DealHit', this.dealHitEntity, this),
      this.app.on('EffectManager:SetEntityPosition', this.setEntityPosition, this),
      this.app.on('EffectManager:PlayerPosition', this.setPlayerPosition, this),
      this.app.on('EffectManager:Axe', this.onAxeThrow, this),
      this.app.on('EffectManager:Grapple', this.onGrappleThrow, this),
      this.app.on('Test:Raycast', this.testRaycast, this),
      this.app.on('EffectManager:Spray', this.onSpray, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Game:Finish', this.onGameFinish, this),
      this.impactBatching(),
      this.hitBatching(),
      this.shootRayBatching(),
      this.bulletBatching(),
      this.abilityBatcher(),
      (this.grenadeEntity.enabled = !1),
      (this.splashEntity.splash1 = this.splashEntity.findByName('Splash1')),
      (this.splashEntity.splash2 = this.splashEntity.findByName('Splash2')),
      (this.lastSpark = Date.now()),
      (this.lastSmoke = Date.now());
  }),
  (EffectManager.prototype.onKillSphere = function (t) {
    (this.killSphereEntity.enabled = !0),
      this.killSphereEntity.setPosition(t),
      this.killSphereEntity.setLocalScale(0.1, 0.1, 0.1);
    var e = this.killSphereEntity.model.meshInstances[0].material;
    e.opacity = 1;
    var i = this.killSphereEntity.tween(this.killSphereEntity.getLocalScale()).to(
      {
        x: 15,
        y: 15,
        z: 15,
      },
      0.3,
      pc.CircularOut
    );
    i.on('update', function (t) {
      (e.opacity = pc.math.lerp(e.opacity, 0, 0.06)), e.update();
    }),
      i.start(),
      clearTimeout(this.killSphereTimer),
      (this.killSphereTimer = setTimeout(
        function (t) {
          t.killSphereEntity.enabled = !1;
        },
        300,
        this
      ));
  }),
  (EffectManager.prototype.onCustomSound = function (t, e, i) {
    this.entity.setPosition(i), this.entity.sound.play(t), (this.entity.sound.slots[t].pitch = e);
  }),
  (EffectManager.prototype.onSkullShow = function (t) {
    var e = t.clone().add(new pc.Vec3(0, 2, 0));
    e.clone().add(new pc.Vec3(2, 0, 2));
    this.killEffect.setLocalPosition(t),
      this.killEffect.findByName('Sprite').sprite.play('Fire'),
      this.skullEntity.setLocalPosition(e),
      this.skullEntity.sprite.play('Fire'),
      this.skullAnimation && this.skullAnimation.stop(),
      (this.skullAnimation = this.skullEntity.tween(this.skullEntity.getLocalPosition()).to(
        {
          y: e.y + 1,
        },
        1,
        pc.SineOut
      )),
      this.skullAnimation.start();
  }),
  (EffectManager.prototype.onMapLoaded = function () {
    clearTimeout(this.timer),
      (this.timer = setTimeout(
        function (t) {
          t.updateLight();
        },
        3e4,
        this
      ));
    var t = this.app.root.findByTag('Rain'),
      e = this.app.root.findByName('RainDrops');
    t.length > 0
      ? ((e.enabled = !0),
        setTimeout(
          function (t) {
            t.thunder();
          },
          5e3,
          this
        ))
      : ((e.enabled = !1), clearTimeout(this.thunderTimer)),
      (this.lookAtEntities = this.app.root.findByTag('LookAt')),
      (this.birdEntities = this.app.root.findByTag('Bird')),
      (this.checkpointEntities = this.app.root.findByTag('Checkpoint'));
  }),
  (EffectManager.prototype.thunder = function () {
    if (pc.settings && !0 === pc.settings.disableSpecialEffects) return !1;
    var t = 40 + 40 * Math.random();
    this.app.fire('Map:Thunder', !0),
      (this.thunderTimer = setTimeout(
        function (t) {
          t.thunder();
        },
        1e3 * t,
        this
      ));
  }),
  (EffectManager.prototype.updateLight = function () {
    var t = this.app.root.findByName('Light');
    t && t.light;
  }),
  (EffectManager.prototype.impactBatching = function () {
    for (var t = 0; t < this.shootRayCount; t++) {
      var e = this.impactEntity.clone();
      (e.sprite1 = e.findByName('Sprite1').sprite),
        (e.sprite2 = e.findByName('Sprite2').sprite),
        (e.sprite3 = e.findByName('Sprite3').sprite),
        (e.sprite4 = e.findByName('Sprite4').sprite),
        (e.hole = e.findByName('Hole')),
        e.setPosition(Utils.nullVector),
        this.impactParticles.push(e),
        this.garbageEntity.addChild(e);
    }
  }),
  (EffectManager.prototype.hitBatching = function () {
    for (var t = 0; t < this.shootRayCount; t++) {
      var e = this.hitEntity.clone();
      (e.sprite = e.findByName('Sprite').sprite),
        e.setPosition(Utils.nullVector),
        this.hitParticles.push(e),
        this.garbageEntity.addChild(e);
    }
  }),
  (EffectManager.prototype.shootRayBatching = function () {
    for (var t = 0; t < this.shootRayCount; t++) {
      var e = this.shootRay.clone();
      (e.sprite1 = e.findByName('RaySmoke1').sprite),
        (e.sprite2 = e.findByName('RaySmoke2').sprite),
        (e.trace = e.findByName('Trace')),
        e.setPosition(Utils.nullVector),
        this.shootRays.push(e),
        this.garbageEntity.addChild(e);
    }
    this.shootRay.destroy();
  }),
  (EffectManager.prototype.abilityBatcher = function () {
    (this.axes = []),
      (this.grenades = []),
      (this.shurikens = []),
      (this.currentAxeIndex = 0),
      (this.currentGrenadeIndex = 0),
      (this.currentShurikenIndex = 0),
      (this.currentGrappleIndex = 0);
    for (var t = 0; t < 3; t++) {
      var e = this.grenadeEntity.clone();
      e.setPosition(Utils.nullVector),
        (e.enabled = !1),
        this.grenades.push(e),
        this.abilityHolder.addChild(e);
    }
    for (var i = 0; i < 3; i++) {
      var a = this.axeEntity.clone();
      a.setPosition(Utils.nullVector),
        (a.enabled = !1),
        this.axes.push(a),
        this.abilityHolder.addChild(a);
    }
    for (var s = 0; s < 5; s++) {
      var n = this.shurikenEntity.clone();
      n.setPosition(Utils.nullVector),
        (n.enabled = !1),
        this.shurikens.push(n),
        this.abilityHolder.addChild(n);
    }
  }),
  (EffectManager.prototype.bulletBatching = function () {
    for (var t = 0; t < this.shootRayCount; t++) {
      var e = this.bulletEntity.clone();
      e.setPosition(Utils.nullVector), this.bullets.push(e), this.bulletHolder.addChild(e);
    }
  }),
  (EffectManager.prototype.getPlaceableObject = function (t) {
    var e = !1;
    for (var i in this.placableObjects) {
      var a = this.placableObjects[i];
      a.name == t && (e = a);
    }
    return e;
  }),
  (EffectManager.prototype.setDestructible = function (t) {
    if (Date.now() - this.lastExplosionTime < 1500) return !1;
    (this.destructibleEffect.enabled = !0),
      this.destructibleEffect.sound.play('Explosion'),
      this.app.fire('BakedPhysics:Destructible-Box', t),
      (this.lastExplosionTime = Date.now());
  }),
  (EffectManager.prototype.setTotem = function (t, e, i) {
    (this.totemEntity.enabled = !0),
      this.totemEntity.setLocalPosition(t),
      this.totemEntity.setLocalEulerAngles(e),
      (this.totemEntity.script.totem.objectId = i),
      this.totemEntity.sound.play('Impact'),
      this.totemEntity.sound.play('Place'),
      this.app.fire('BakedPhysics:GroundCrackPhysics', new pc.Vec3(0, 0, 0)),
      this.app.fire('Timeline:Totem');
  }),
  (EffectManager.prototype.removeEffect = function (t) {
    'Totem' == t && this.totemEntity.setLocalPosition(Utils.nullVector);
  }),
  (EffectManager.prototype.setCrack = function (t, e) {
    (this.crackEffect.enabled = !0),
      this.crackEffect.setLocalPosition(t),
      this.crackEffect.setLocalEulerAngles(e),
      this.crackEffect.sound.play('Impact'),
      this.crackEffect.sound.play('Sound-1'),
      this.app.fire('BakedPhysics:CrackBakedPhysics', new pc.Vec3(0, 0, 0)),
      this.app.fire('Timeline:Crack'),
      this.app.fire('Camera:Shake', 1.5, 0.55);
  }),
  (EffectManager.prototype.setPlace = function (t, e, i) {
    var a = this.getPlaceableObject(t);
    if (a) {
      var s = e.clone().add(new pc.Vec3(0, 2, 0)),
        n = a.clone();
      n.setLocalPosition(s),
        n.setLocalEulerAngles(0, 180 * Math.random(), 0),
        (n.enabled = !0),
        n
          .tween(n.getLocalPosition())
          .to(
            {
              x: e.x,
              y: e.y,
              z: e.z,
            },
            0.5,
            pc.BounceOut
          )
          .start(),
        this.mapHolder.addChild(n),
        i > 0 &&
          setTimeout(
            function (t, e) {
              e.destroy();
            },
            1e3 * i,
            this,
            n
          );
    }
  }),
  (EffectManager.prototype.explosiveDamageRadius = function (t) {
    for (var e in this.explosive) {
      var i = this.explosive[e],
        a = this.entity.root.findByTag(i);
      for (var s in a) {
        var n = a[s],
          o = n.getPosition().clone();
        t.clone().sub(o).length() < 10 &&
          n &&
          n.parent &&
          (this.setExplosionEffect(o), n && n.parent && n.parent.destroy());
      }
    }
  }),
  (EffectManager.prototype.breakDamageRadius = function (t) {
    for (var e in this.breakable) {
      var i = this.breakable[e],
        a = this.entity.root.findByTag(i);
      for (var s in a) {
        var n = a[s],
          o = n.getPosition().clone();
        t.clone().sub(o).length() < 10 &&
          n &&
          n.parent &&
          (this.entity.setPosition(n.getPosition().clone()),
          this.entity.sound.play(i),
          n && n.parent && n.parent.destroy());
      }
    }
  }),
  (EffectManager.prototype.checkEntityBreakable = function (t) {
    var e = t.tags.list();
    for (var i in this.breakable) {
      var a = this.breakable[i];
      t &&
        e.indexOf(a) > -1 &&
        t.parent &&
        (this.entity.setPosition(t.getPosition().clone()),
        this.entity.sound.play(a),
        t && t.parent && t.parent.destroy());
    }
    for (var s in this.explosive) {
      var n = this.explosive[s];
      t &&
        e.indexOf(n) > -1 &&
        t.parent &&
        (this.setExplosionEffect(t.getPosition().clone()), t && t.parent && t.parent.destroy());
    }
  }),
  (EffectManager.prototype.onRocket = function (t, e, i) {
    var a = this.rocketEntity.clone();
    a.setPosition(t),
      a.lookAt(e),
      (a.enabled = !0),
      i && (a.script.rocket.isOwner = !0),
      this.garbageEntity.addChild(a);
  }),
  (EffectManager.prototype.onThrow = function (t, e, i, a, s) {
    var n = this.throwPower;
    'Star' == t && (n *= 1.3);
    var o = i.scale(n),
      r = this.grenadeEntity.clone();
    r.setPosition(e),
      (r.enabled = !0),
      (r.type = t),
      (r.startTime = Date.now()),
      (r.owner = a),
      (r.hasSpell = s),
      (r.self = this),
      (r.exploded = !1),
      this.traceEntity.reparent(r),
      this.traceEntity.particlesystem && this.traceEntity.particlesystem.reset();
    try {
      this.traceEntity.particlesystem.play();
    } catch (t) {}
    r.collision.on('collisionstart', function (t) {
      var e = this.entity.self,
        i = !1;
      pc.isFinished || this.entity.sound.play('Collision'),
        t && t.contacts && t.contacts.length > 0 && (i = t.contacts[0].point),
        t.other &&
        'Player' == t.other.name &&
        Date.now() - this.entity.startTime > 50 &&
        'Star' == this.entity.type
          ? pc.app.fire('Network:Hurt', this.entity.type, this.entity.owner)
          : t.other && this.entity.self.checkEntityBreakable(t.other),
        'Star' == this.entity.type &&
          Date.now() - this.entity.startTime > 50 &&
          ((this.entity.rigidbody.linearVelocity.x = 0),
          (this.entity.rigidbody.linearVelocity.y = 0),
          (this.entity.rigidbody.linearVelocity.z = 0),
          (this.entity.collision.enabled = !1),
          (this.entity.rigidbody.enabled = !1),
          (this.entity.star.script.rotate.enabled = !1),
          i &&
            (e.explosionSmokeEntity.setLocalScale(2, 2, 2),
            e.explosionSmokeEntity.setPosition(i),
            Date.now() - e.lastSmoke > 700 &&
              (e.explosionSmokeEntity.particlesystem.reset(),
              e.explosionSmokeEntity.particlesystem.play(),
              (e.lastSmoke = Date.now())),
            this.entity.holder.setPosition(i)),
          this.entity.sound.play('Stuck'),
          this.entity.sound.stop('Loop'));
    }),
      (body = r.rigidbody.body),
      body.setCcdMotionThreshold(1),
      body.setCcdSweptSphereRadius(0.2),
      r.rigidbody.applyImpulse(o),
      (r.explode = function () {
        this && this.self.setExplosion(this);
      }),
      this.garbageEntity.addChild(r),
      this.grenades.push(r),
      setTimeout(
        function (t) {
          t.traceEntity.reparent(t.garbageEntity);
        },
        1e3 * this.grenadeTime - 700,
        this
      ),
      setTimeout(
        function (t, e) {
          e.explode();
        },
        1e3 * this.grenadeTime,
        this,
        r
      ),
      this.app.fire('Overlay:Explosive', r);
  }),
  (EffectManager.prototype.setExplosionEffect = function (t) {
    this.loudSoundEntity.setPosition(t),
      this.loudSoundEntity.sound.play('Explosion-1'),
      this.explosionEntity.setPosition(t),
      this.explosionEntity.findByName('Sprite').sprite.play('Fire'),
      this.explosionSmokeEntity.setLocalScale(10, 10, 10),
      this.explosionSmokeEntity.setPosition(t),
      this.explosionSmokeEntity.particlesystem.reset(),
      this.explosionSmokeEntity.particlesystem.play(),
      this.app.fire('Player:Shake', !0);
  }),
  (EffectManager.prototype.setExplosion = function (t) {
    if (t.exploded) return !1;
    var e = t.getPosition().clone();
    Math.round(1 * Math.random()), t.type, t.ownerId;
    (t.exploded = !0),
      'Grenade' == t.type && this.setExplosionEffect(e),
      pc.isFinished ||
        ('Grenade' == t.type &&
          (this.app.fire('Network:RadiusEffect', 'Grenade', t.getPosition(), t.owner),
          t.hasSpell && this.app.fire('Spell:Wind', t.getPosition(), 'Big'))),
      'Grenade' == t.type &&
        (this.breakDamageRadius(t.getPosition()),
        this.explosiveDamageRadius(t.getPosition()),
        (this.lastSmoke = Date.now()));
    for (var i = this.grenades.length; i--; )
      this.grenades[i]._guid == t._guid && this.grenades.splice(i, 1);
    t.destroy();
  }),
  (EffectManager.prototype.onGameFinish = function () {
    for (var t = this.grenades.length; t--; ) this.grenades[t] && this.grenades[t].destroy();
    this.grenades = [];
  }),
  (EffectManager.prototype.onBulletThrow = function (t, e) {
    var i = Math.round(40 * Math.random()),
      a = e.clone().add(new pc.Vec3(i - 90, i, i)),
      s = this.bullets[this.bulletIndex];
    s.setPosition(t),
      s.setLocalEulerAngles(a),
      (s.time = 0),
      this.bulletIndex++,
      this.bulletIndex > this.shootRayCount - 1 && (this.bulletIndex = 0);
  }),
  (EffectManager.prototype.updateBullets = function (t) {
    for (var e = this.bullets.length; e--; )
      this.bullets[e].time > this.maxBulletTime
        ? this.bullets[e].setPosition(Utils.nullVector)
        : ((this.bullets[e].time += t),
          this.bullets[e].rotateLocal(
            this.bulletRotate.x * t,
            this.bulletRotate.y * t,
            this.bulletRotate.z * t
          ),
          this.bullets[e].translateLocal(
            this.bulletTranslate.x * t,
            this.bulletTranslate.y * t,
            this.bulletTranslate.z * t
          ));
  }),
  (EffectManager.prototype.onGrappleThrow = function (t, e, i, a, s) {
    var n = Math.floor(15 * Math.random() + 20),
      o = this.testRaycast(e.clone(), i.clone().add(e)),
      r = new pc.Vec3(0, 0, 0);
    (r = o ? o.point : i.clone()),
      o &&
        setTimeout(
          function (t) {
            t.dealHitEntity('Grapple', o, n, a, !0);
          },
          100,
          this
        ),
      this.grapples[this.currentGrappleIndex].script.grapple.onThrow(t, e, r),
      this.currentGrappleIndex++,
      (this.currentGrappleIndex = this.currentGrappleIndex % 3);
  }),
  (EffectManager.prototype.onAxeThrow = function (t, e, i, a) {
    var s = Math.floor(15 * Math.random() + 20),
      n = this.testRaycast(t, e.clone().add(t)),
      o = new pc.Vec3(0, 0, 0);
    o = n ? n.point : e.clone();
    var r = this.axes[this.currentAxeIndex];
    r.setLocalPosition(t),
      r.lookAt(o),
      (r.enabled = !0),
      (r.originEntity = r.findByName('Origin')),
      (r.rayEntity = r.findByName('Ray')),
      (r.rayEntity.enabled = !0),
      (r.originEntity.enabled = !0),
      (r.originEntity.script.enabled = !0),
      r.sound.play('Loop'),
      this.currentAxeIndex++,
      (this.currentAxeIndex = this.currentAxeIndex % 3),
      r
        .tween(r.getLocalPosition())
        .to(
          {
            x: o.x,
            y: o.y,
            z: o.z,
          },
          0.25,
          pc.Linear
        )
        .start(),
      setTimeout(
        function (t, e, n) {
          t.sound.stop('Loop'),
            (t.rayEntity.enabled = !1),
            (t.originEntity.script.enabled = !1),
            t.originEntity.setLocalEulerAngles(18.68, 0, 0),
            e && n.dealHitEntity('Axe', e, s, i, !0),
            a && n.app.fire('Spell:Wind', t.getPosition().clone(), 'Small');
        },
        250,
        r,
        n,
        this
      ),
      n && n.entity && 'Player' == n.entity.name
        ? setTimeout(
            function (t, e) {
              t.enabled = !1;
            },
            600,
            r,
            this
          )
        : setTimeout(
            function (t, e) {
              t.enabled = !1;
            },
            2e3,
            r,
            this
          );
  }),
  (EffectManager.prototype.onShuriken = function (t, e, i, a, s) {
    var n = Math.floor(15 * Math.random() + 20),
      o = e[this.shurikenSpread],
      r = new pc.Vec3(o.x, o.y, o.z).sub(t.clone()).normalize().scale(100).add(t),
      p = this.testRaycast(t, r),
      l = r;
    p && (l = p.point);
    var h = this.shurikenEntity.clone();
    h.setLocalPosition(t),
      h.lookAt(l),
      (h.enabled = !0),
      (h.ray = h.findByName('Ray')),
      (h.shurikenModel = h.findByName('Model')),
      s && (h.shurikenModel.enabled = !1),
      h
        .tween(h.getLocalPosition())
        .to(
          {
            x: l.x,
            y: l.y,
            z: l.z,
          },
          0.2,
          pc.Linear
        )
        .start(),
      p &&
        setTimeout(
          function (t, e, a, s) {
            (t.ray.enabled = !1),
              a &&
                (1 === s
                  ? e.dealHitEntity('Shuriken', a, n, i, !0)
                  : e.dealHitEntity('Shuriken', a, n, i, !1));
          },
          50,
          h,
          this,
          p,
          this.shurikenSpread
        ),
      setTimeout(
        function (t) {
          t.destroy();
        },
        1e3,
        h
      ),
      this.garbageEntity.addChild(h),
      this.shurikenSpread++,
      this.shurikenSpread > 2 && (this.shurikenSpread = 0);
  }),
  (EffectManager.prototype.onSpray = function (t, e, i) {
    var a = this,
      s = Utils.getAssetFromURL('Spray-' + i + '.png');
    this.sprayEntity.setPosition(t.x, t.y, t.z),
      this.sprayEntity.setEulerAngles(e.x, e.y, e.z),
      (this.sprayEntityLight.enabled = !0),
      s &&
        s.ready(function () {
          a.sprayEntityLight.light.cookieAsset = s;
        }),
      (this.sprayEntityLight.light.isStatic = !1),
      clearTimeout(this.sprayTimer),
      (this.sprayTimer = setTimeout(
        function (t) {
          t.sprayEntityLight.light.isStatic = !1;
        },
        500,
        this
      ));
  }),
  (EffectManager.prototype.testRaycast = function (t, e, i, a, s) {
    i || ((i = 0), (a = 0), (s = 0));
    var n = e.add(new pc.Vec3(i, a, s)),
      o = this.app.systems.rigidbody.raycastFirst(t, n),
      r = 1e3;
    return !!o && ((r = t.clone().sub(o.point.clone()).length()), (o.distance = r), o);
  }),
  (EffectManager.prototype.onHit = function (t, e, i, a, s, n) {
    var o = [],
      r = 0.3,
      p = 15;
    if (('Dash' == t && ((p = 36), (r = 0.2)), n && n.length > 0))
      for (var l in n) {
        var h = n[l].getPosition().clone();
        (y = this.testRaycast(e, h)) && o.push(y);
      }
    else
      for (var c = 0; c < p; c++) {
        var y,
          d = Math.cos(c / p) * r,
          f = Math.sin(c / p) * r,
          u = Math.cos(c / p) * r;
        (y = this.testRaycast(e, i, d, f, u)) && o.push(y);
      }
    var E = !1,
      g = [],
      m = !1;
    for (var b in o) {
      var M = o[b],
        k = M.entity.tags.list();
      for (var x in this.breakable) {
        var S = this.breakable[x];
        k.indexOf(S) > -1 && !E && (E = M);
      }
      k.length > 0 && (g.indexOf(k[0]) > -1 && (m = !0), g.push(k[0])),
        m || this.dealHitEntity(t, M, s, a);
    }
  }),
  (EffectManager.prototype.dealHitEntity = function (t, e, i, a, s) {
    if (!e || !e.entity) return !1;
    var n = this.shootRayIndex,
      o = e.entity.tags.list(),
      r = pc.setFromNormal(e.normal),
      p = 2 * Math.random() + 1;
    if (o.indexOf('Player') > -1) {
      var l = this.hitParticles[n];
      if (
        (l.setPosition(e.point),
        l.setEulerAngles(r),
        l.setLocalScale(p, p, p),
        l.sprite.stop(),
        pc.controls.player.playerId == a && i > 0)
      ) {
        var h = e.entity,
          c = !1,
          y = e.point.clone().sub(h.getPosition().clone());
        h &&
          h.script &&
          h.script.enemy &&
          (h.script.enemy.damage(a, i, y),
          '-1' !== h.script.enemy.playerId && (c = !0),
          s && h.script.enemy.dealSpell(t),
          c && this.app.fire('Hit:Point', h, i)),
          this.entity.setPosition(e.point),
          this.entity.sound.play('Impact-Iron'),
          c && l.sprite.play('Impact');
      }
    } else if (o.indexOf('Explosive') > -1) e.entity.explode();
    else if (-1 === o.indexOf('Invisible')) {
      Math.round(180 * Math.random());
      var d = this.impactParticles[n];
      for (var f in (d.setPosition(e.point),
      d.setEulerAngles(r),
      d.setLocalScale(p, p, p),
      d.sprite1.play('Impact'),
      d.sprite2.play('Impact'),
      d.sprite3.play('Impact'),
      d.sprite4.play('Impact'),
      this.breakable)) {
        var u = this.breakable[f];
        o.indexOf(u) > -1 &&
          (this.entity.setPosition(e.point),
          this.entity.sound.play(u),
          e.entity.parent && e.entity.parent.destroy());
      }
      if (
        Math.random() > 0.4 ||
        'Melee' == t ||
        'Shuriken' == t ||
        'Axe' == t ||
        'Dash' == t ||
        'Grapple' == t
      )
        for (var E in this.impactable) {
          var g = this.impactable[E];
          o.indexOf(g) > -1 && this.playMaterialImpact(g, e, t);
        }
      'Shuriken' == t || 'Grapple' == t
        ? (this.entity.setPosition(e.point),
          (this.entity.sound.slots['Impact-Iron-Light'].pitch = 0.1 * Math.random() + 1),
          this.entity.sound.play('Impact-Iron-Light'))
        : ('Melee' != t && 'Dash' != t && 'Axe' != t) ||
          (this.entity.setPosition(e.point),
          (this.entity.sound.slots['Impact-Iron'].pitch = 0.1 * Math.random() + 1),
          this.entity.sound.play('Impact-Iron')),
        Date.now() - this.lastSmoke > 700 &&
          (this.explosionSmokeEntity.setLocalScale(2, 2, 2),
          this.explosionSmokeEntity.setPosition(e.point),
          this.explosionSmokeEntity.particlesystem.reset(),
          this.explosionSmokeEntity.particlesystem.play(),
          (this.lastSmoke = Date.now()));
    }
  }),
  (EffectManager.prototype.onFire = function (t, e, i, a, s, n, o) {
    if (0 === this.shootRays.length) return !1;
    var r = this.shootRayIndex,
      p = (this.sparkIndex, this.app.systems.rigidbody.raycastFirst(t, e)),
      l = 300;
    if (p) {
      var h = 1,
        c = t.clone().sub(p.point.clone()).length();
      c > 0 && (l = c), o && (c > 10 && (h *= o), c > 20 && (h *= o), c > 30 && (h *= o), (s *= h));
      var y = pc.setFromNormal(p.normal),
        d = 2 * Math.random() + 1,
        f = p.entity.tags.list();
      if (f.indexOf('Player') > -1) {
        var u = this.hitParticles[r];
        if (
          (u.setPosition(p.point),
          u.setEulerAngles(y),
          u.setLocalScale(d, d, d),
          u.sprite.stop(),
          p.entity && p.entity.script && p.entity.script.enemy)
        )
          '-1' !== p.entity.script.enemy.playerId && u.sprite.play('Impact');
      } else if (f.indexOf('Water') > -1)
        this.entity.setPosition(p.point),
          this.entity.sound.play('Water-Splash'),
          this.splashEntity.setPosition(p.point),
          this.splashEntity.splash1.sprite.stop(),
          this.splashEntity.splash2.sprite.stop(),
          this.splashEntity.splash1.sprite.play('Fire'),
          this.splashEntity.splash2.sprite.play('Fire');
      else if (f.indexOf('Explosive') > -1) p.entity.explode();
      else if (f.indexOf('Shootable') > -1) p.entity.onShoot();
      else if (-1 === f.indexOf('Invisible')) {
        var E = !0,
          g = Math.round(180 * Math.random()),
          m = this.impactParticles[r];
        if (
          (m.setPosition(p.point),
          m.setEulerAngles(y),
          m.setLocalScale(d, d, d),
          m.sprite1.play('Impact'),
          m.sprite2.play('Impact'),
          m.sprite3.play('Impact'),
          m.sprite4.play('Impact'),
          this.app.fire('EffectManager:SetEntityPosition', p.point),
          'Shotgun' != n && (Math.random() > 0.4 || 'Melee' == n))
        )
          for (var b in this.impactable) {
            var M = this.impactable[b];
            f.indexOf(M) > -1 && this.playMaterialImpact(M, p, n);
          }
        for (var k in (f.indexOf('Moving') > -1 && (E = !1), this.breakable)) {
          var x = this.breakable[k];
          f.indexOf(x) > -1 &&
            (this.entity.setPosition(p.point),
            this.entity.sound.play(x),
            p.entity.parent.destroy(),
            (E = !1));
        }
        for (var S in this.explosive) {
          var v = this.explosive[S];
          f.indexOf(v) > -1 &&
            (this.setExplosionEffect(p.point), p.entity.parent.destroy(), (E = !1));
        }
        Date.now() - this.lastSmoke > 700 &&
          (this.explosionSmokeEntity.setLocalScale(2, 2, 2),
          this.explosionSmokeEntity.setPosition(p.point),
          this.explosionSmokeEntity.particlesystem.reset(),
          this.explosionSmokeEntity.particlesystem.play(),
          (this.lastSmoke = Date.now())),
          E && -1 === p.entity.tags.list().indexOf('Player')
            ? (m.hole.setLocalScale(0.17, 0.17, 0.17), m.hole.setLocalEulerAngles(0, g, 0))
            : m.hole.setLocalScale(0.001, 0.001, 0.001),
          f.indexOf('Damageable') > -1 && this.app.fire('Network:ObjectDamage', p.entity._guid);
      }
      if (pc.controls.player.playerId == a && p.entity.tags.list().indexOf('Player') > -1) {
        var P = p.entity,
          T = p.point.clone().sub(P.getPosition().clone());
        P && P.script && P.script.enemy && P.script.enemy.damage(a, s, T);
      }
    }
    if ('Melee' != n) {
      pc.controls.player.playerId != a && this.calculateRichotte(t, e, a, r);
      var I = this.shootRays[r];
      I.setPosition(i),
        I.lookAt(e),
        I.sprite1.stop(),
        I.sprite1.play('Fire'),
        I.sprite2.stop(),
        I.sprite2.play('Fire'),
        'Shotgun' == n
          ? ((I.sprite1.opacity = 0.1),
            (I.sprite1.speed = 1.2),
            (I.sprite2.opacity = 0.1),
            (I.sprite2.speed = 1.2))
          : 'Sniper' == n
          ? ((I.sprite1.opacity = 0.9),
            (I.sprite1.speed = 0.5),
            (I.sprite2.opacity = 0.9),
            (I.sprite2.speed = 0.5))
          : s > 40
          ? ((I.sprite1.opacity = 0.3),
            (I.sprite1.speed = 0.7),
            (I.sprite2.opacity = 0.3),
            (I.sprite2.speed = 0.7))
          : ((I.sprite1.opacity = 0.1),
            (I.sprite1.speed = 1.2),
            (I.sprite2.opacity = 0.1),
            (I.sprite2.speed = 1.2)),
        I.trace.setLocalPosition(0, 0, -5),
        pc.controls.player.playerId,
        I.trace
          .tween(I.trace.getLocalPosition())
          .to(
            {
              x: 0,
              y: 0,
              z: -l,
            },
            0.2,
            pc.Linear
          )
          .start(),
        clearTimeout(I.timer),
        (I.timer = setTimeout(
          function (t) {
            t.trace.setLocalPosition(0, 0, -500);
          },
          250,
          I
        ));
    }
    this.shootRayIndex++, this.shootRayIndex > this.shootRayCount - 1 && (this.shootRayIndex = 0);
  }),
  (EffectManager.prototype.playMaterialImpact = function (t, e, i) {
    var a = Math.round(1 * Math.random()) + 1;
    this.impactSoundEntity.setPosition(e.point),
      this.impactSoundEntity.sound.play(t + '-' + a),
      Math.random() > 0.4 && 'Melee' != i && this.impactSoundEntity.sound.play('Ricochet-' + a);
  }),
  (EffectManager.prototype.pointDamage = function (t, e, i, a, s) {
    if (pc.controls.player.playerId == i) {
      var n = e.clone().sub(t.getPosition().clone());
      t &&
        t.script &&
        t.script.enemy &&
        (t.script.enemy.damage(i, a, n),
        this.app.fire('Network:PointEffect', pc.controls.player.playerId, s, e, i));
    }
  }),
  (EffectManager.prototype.calculateRichotte = function (t, e, i, a) {
    var s = pc.controls.entity.getPosition().clone(),
      n = Utils.closestPointLine(
        {
          x: s.x,
          y: s.z,
        },
        {
          x: t.x,
          y: t.z,
        },
        {
          x: e.x,
          y: e.z,
        }
      );
    if (n && n.point) {
      var o = new pc.Vec3(n.point.x, s.y, n.point.y),
        r = Math.random(),
        p = s.clone().sub(o).length();
      if (r > 0.5 && p < 3) {
        var l = 'FlyBy-' + (Math.round(1 * Math.random()) + 2);
        this.entity.setPosition(o), this.entity.sound.play(l), this.app.fire('Overlay:Ricochet', o);
      }
    }
  }),
  (EffectManager.prototype.setPlayerPosition = function (t) {
    if (!t) return !1;
    for (var e in this.checkpointEntities) {
      var i = this.checkpointEntities[e];
      i.getPosition().clone().sub(t).length() < 3 &&
        !0 === i.enabled &&
        ((i.enabled = !1), this.app.fire('Overlay:Sound', 'Checkpoint'));
    }
  }),
  (EffectManager.prototype.setEntityPosition = function (t) {
    if (!t) return !1;
    for (var e in this.birdEntities) {
      var i = this.birdEntities[e],
        a = i.getPosition().sub(t).length();
      i &&
        i.animation &&
        a < 25 &&
        !i.isFlied &&
        ((i.isFlied = !0),
        (i.animation.speed = 1.2 + Math.random()),
        (i.animation.loop = !1),
        i.animation.play('Bird-Fly'),
        (i.lastFlyDate = Date.now()),
        i.sound && i.sound.play('Fly'),
        setTimeout(
          function (t) {
            t.enabled = !1;
          },
          2e3,
          i
        ));
    }
  }),
  (EffectManager.prototype.checkDistances = function (t) {
    for (var e in this.lookAtEntities) {
      this.lookAtEntities[e].lookAt(t);
    }
    for (var i in this.birdEntities) {
      var a = this.birdEntities[i],
        s = a.getPosition().sub(t).length();
      a &&
        a.animation &&
        s > 60 &&
        !0 === a.isFlied &&
        Date.now() - a.lastFlyDate > 25e3 &&
        ((a.enabled = !0),
        a.setLocalEulerAngles(0, 180 * Math.random(), 0),
        (a.animation.speed = 1),
        (a.animation.loop = !0),
        a.animation.play('Bird-Idle'),
        (a.isFlied = !1));
    }
  }),
  (EffectManager.prototype.updateGrenades = function (t) {
    for (var e = this.grenades.length; e--; ) {
      var i = this.grenades[e];
      i && this.app.fire('EffectManager:SetEntityPosition', i.getPosition());
    }
  }),
  (EffectManager.prototype.update = function (t) {
    this.updateBullets(t), this.updateGrenades(t);
    var e = this.cameraEntity;
    pc.isSpectator && (e = this.spectatorCameraEntity);
    var i = e.getPosition();
    this.explosionEntity.lookAt(i), this.skullEntity.lookAt(i), this.checkDistances(i);
  });
var WeaponManager = pc.createScript('weaponManager');
WeaponManager.attributes.add('defaultWeapon', {
  type: 'string',
  default: 'Scar',
}),
  WeaponManager.attributes.add('armLeftEntity', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('armRightEntity', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('weaponHolder', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('swingLeftEntity', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('swingRightEntity', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('muzzleEntity', {
    type: 'entity',
  }),
  WeaponManager.attributes.add('flameSpeed', {
    type: 'number',
    default: 0.1,
  }),
  WeaponManager.attributes.add('maxFlameScale', {
    type: 'number',
    default: 3,
  }),
  WeaponManager.attributes.add('weaponIcons', {
    type: 'entity',
    array: !0,
  }),
  (WeaponManager.prototype.initialize = function () {
    (this.currentWeapon = !1),
      (this.currentWeaponEntity = !1),
      (this.isShooting = 0),
      (this.currentWeaponName = !1),
      (this.isAnimatedSkin = !1),
      (this.videoTexture = !1),
      (this.currentFlameScale = 0),
      (this.currentFlameAngle = 0),
      (this.movement = this.entity.script.movement),
      (this.weaponSkins = {}),
      (this.currentCharm = 'Default-Charm.glb'),
      this.app.on('WeaponManager:Skins', this.setSkins, this),
      this.app.on('WeaponManager:Set', this.setWeapon, this),
      this.app.on('WeaponManager:SetSkin', this.setSkin, this),
      this.app.on('WeaponManager:SetCharm', this.setCharm, this),
      this.app.on('WeaponManager:Swing', this.playSwing, this),
      this.app.on('Player:WeaponLayout', this.setWeaponLayout, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.setWeaponModel('Scar'),
      this.setWeapon('Scar'),
      this.setWeapons();
  }),
  (WeaponManager.prototype.onMapLoaded = function (e) {
    'GUNGAME' != pc.currentMode &&
      'CUSTOM' != pc.currentMode &&
      this.weapons &&
      this.weapons.length;
  }),
  (WeaponManager.prototype.setWeaponLayout = function (e) {
    if (e.success && e.weapons)
      for (var t in ((this.weapons = e.weapons), this.weaponIcons)) {
        this.weaponIcons[t].element.textureAsset = this.app.assets.find(
          e.weapons[t] + '-Thumbnail.png'
        );
      }
  }),
  (WeaponManager.prototype.playSwing = function (e) {
    'Left' == e
      ? this.swingLeftEntity.sprite.play('Swing')
      : 'Right' == e && this.swingRightEntity.sprite.play('Swing');
  }),
  (WeaponManager.prototype.setSkins = function (e) {
    (this.weaponSkins = e),
      e &&
        setTimeout(
          function (e) {
            e.setCurrentWeaponSkin();
          },
          1e3,
          this
        );
  }),
  (WeaponManager.prototype.setCurrentWeaponSkin = function () {
    this.setCosmetics(this.currentWeapon.entity.name);
  }),
  (WeaponManager.prototype.setWeapons = function () {
    'GUNGAME' != pc.currentMode && pc.currentMode;
  }),
  (WeaponManager.prototype.setWeapon = function (e, t) {
    if (this.currentWeaponName == e) return this.app.fire('Overlay:CircularSelect', e), !1;
    if (!t) {
      if (this.movement.isReloading > this.movement.timestamp) return !1;
      if (pc.isFinished) return !1;
    }
    this.app.fire('Player:Focus', !1),
      t || this.app.fire('Network:Weapon', e),
      this.movement.hideWeapon(),
      this.currentWeapon
        ? (clearTimeout(this.takeOutTimer),
          (this.takeOutTimer = setTimeout(
            function (n) {
              n.setWeaponModel(e, t), n.movement.takeout();
            },
            300,
            this
          )))
        : this.setWeaponModel(e, t),
      this.app.fire('Overlay:CircularSelect', e),
      this.app.fire('Overlay:Weapon', e),
      (this.currentWeaponName = e);
  }),
  (WeaponManager.prototype.setWeaponModel = function (e, t) {
    this.weaponHolder.findByTag('Weapon').forEach(function (e) {
      e.enabled = !1;
    });
    var n = this.weaponHolder.findByName(e);
    (n.enabled = !0),
      (this.currentWeapon = n.script.weapon),
      this.currentWeapon.prepare(),
      (this.currentWeaponEntity = n.findByName('Model')),
      this.setMuzzleParent(),
      this.setCosmetics(e),
      (this.armLeftEntity.enabled = !this.currentWeapon.isRightHanded),
      (this.armRightEntity.enabled = this.currentWeapon.isRightHanded),
      this.entity.script.movement.setCurrentWeapon(),
      this.app.fire('Weapon:Set', this.currentWeapon),
      Math.random();
  }),
  (WeaponManager.prototype.setCosmetics = function (e) {
    this.weaponSkins[e] && this.setSkin(this.weaponSkins[e]), this.setAccessory(this.currentCharm);
  }),
  (WeaponManager.prototype.setCharm = function (e) {
    (this.currentCharm = e), this.setAccessory(e);
  }),
  (WeaponManager.prototype.createAnimatedSkin = function (e) {
    var t = this.app,
      n = e.replace('.jpg', '.mp4'),
      a = new pc.Texture(t.graphicsDevice, {
        format: pc.PIXELFORMAT_R5_G6_B5,
        autoMipmap: !1,
      });
    (a.minFilter = pc.FILTER_LINEAR),
      (a.magFilter = pc.FILTER_LINEAR),
      (a.addressU = pc.ADDRESS_REPEAT),
      (a.addressV = pc.ADDRESS_REPEAT);
    var i = document.createElement('video');
    return (
      i.addEventListener('canplay', function (e) {
        a.setSource(i);
      }),
      i.setAttribute('webkit-playsinline', 'webkit-playsinline'),
      (i.muted = !0),
      (i.src = Utils.prefixCDN + n),
      (i.crossOrigin = 'anonymous'),
      (i.loop = !0),
      i.play(),
      (this.isAnimatedSkin = !0),
      (this.videoTexture = a),
      a
    );
  }),
  (WeaponManager.prototype.getSkinFromURL = function (e, t) {
    var n = new Image();
    (n.crossOrigin = 'anonymous'),
      (n.onload = function () {
        if (n) {
          var e = new pc.Texture(pc.app.graphicsDevice);
          e.setSource(n), t(e);
        }
      }),
      (n.src = Utils.prefixCDN + e);
  }),
  (WeaponManager.prototype.setDefaultModel = function (e) {
    var t = this.app.assets.find('Weapon-' + e);
    t && (this.currentWeaponEntity.model.asset = t);
  }),
  (WeaponManager.prototype.setSkin = function (e) {
    console.log(this.currentWeaponEntity, e), this.currentWeaponEntity.fire('CustomSkin:Set', e);
  }),
  (WeaponManager.prototype.setAccessory = function (e) {
    if (e && this.currentWeaponEntity && this.currentWeapon.doodahEntity) {
      var t = this.app.assets.find(e),
        n = this.currentWeapon.doodahEntity.findByName('Model');
      t &&
        n &&
        (this.app.assets.load(t),
        t.ready(function () {
          n.model.asset = t;
        }));
    }
  }),
  (WeaponManager.prototype.setMuzzleParent = function () {
    this.muzzleEntity.reparent(this.currentWeapon.muzzlePoint);
  }),
  (WeaponManager.prototype.triggerShooting = function () {
    (this.currentFlameScale = Math.random() * (this.maxFlameScale / 2) + this.maxFlameScale),
      (this.currentFlameAngle = 360 * Math.random());
  }),
  (WeaponManager.prototype.setAnimation = function (e) {
    (this.currentFlameScale = pc.math.lerp(this.currentFlameScale, 0.001, this.flameSpeed)),
      (this.currentFlameAngle = pc.math.lerpAngle(this.currentFlameAngle, 0.001, 0.1)),
      this.muzzleEntity.setLocalScale(
        this.currentFlameScale,
        this.currentFlameScale,
        this.currentFlameScale
      ),
      this.muzzleEntity.setLocalEulerAngles(0, 0, this.currentFlameAngle);
  }),
  (WeaponManager.prototype.update = function (e) {
    this.setAnimation(), this.isAnimatedSkin && this.videoTexture && this.videoTexture.upload();
  });
var Sprite = pc.createScript('sprite');
Sprite.attributes.add('type', {
  type: 'string',
  enum: [
    {
      blending: 'blending',
    },
    {
      'animated-2d': 'animated-2d',
    },
  ],
  default: 'blending',
}),
  Sprite.attributes.add('materialEntity', {
    type: 'entity',
  }),
  Sprite.attributes.add('speed', {
    type: 'number',
  }),
  Sprite.attributes.add('totalFrameCount', {
    type: 'number',
  }),
  (Sprite.prototype.initialize = function () {
    if ('blending' == this.type) {
      var t = this.entity.sprite.material.emissiveMap;
      (this.entity.sprite.material.opacityMap = t),
        (this.entity.sprite.material.blendType = pc.BLEND_ADDITIVEALPHA),
        (this.entity.sprite.material.opacityMapChannel = 'r'),
        this.materialEntity &&
          (this.materialEntity.model.model.meshInstances[0].material = this.entity.sprite.material),
        this.entity.script.destroy();
    } else if ('animated-2d' == this.type) {
      var e = this;
      (this.currentSpriteFrame = 0),
        this.on('state', function (t) {
          (e.currentSpriteFrame = 0), (e.entity.element.spriteFrame = 0);
        });
    }
  }),
  (Sprite.prototype.update = function (t) {
    'animated-2d' == this.type &&
      ((this.entity.element.spriteFrame = Math.floor(
        this.currentSpriteFrame % this.totalFrameCount
      )),
      (this.currentSpriteFrame += this.speed * t));
  });
var Hitmarker = pc.createScript('hitmarker');
Hitmarker.attributes.add('hitPointEntity', {
  type: 'entity',
}),
  Hitmarker.attributes.add('hitPointHolder', {
    type: 'entity',
  }),
  Hitmarker.attributes.add('crosshairEntity', {
    type: 'entity',
  }),
  Hitmarker.attributes.add('distance', {
    type: 'number',
    default: 100,
  }),
  Hitmarker.attributes.add('spread', {
    type: 'number',
    default: 20,
  }),
  Hitmarker.attributes.add('speed', {
    type: 'number',
    default: 1,
  }),
  Hitmarker.attributes.add('duration', {
    type: 'number',
    default: 1,
  }),
  Hitmarker.attributes.add('rotateSpeed', {
    type: 'number',
    default: 1,
  }),
  Hitmarker.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  Hitmarker.attributes.add('screenEntity', {
    type: 'entity',
  }),
  Hitmarker.attributes.add('hitmarkerEntity', {
    type: 'entity',
  }),
  Hitmarker.attributes.add('defaultPitch', {
    type: 'number',
    default: 1,
  }),
  Hitmarker.attributes.add('hitColor', {
    type: 'rgb',
  }),
  (Hitmarker.prototype.initialize = function () {
    (this.points = []),
      (this.lastHitTime = Date.now()),
      (this.lastHeadshot = Date.now()),
      (this.hitPointEntity.enabled = !1),
      (this.crosshairEntity.enabled = !1),
      this.app.on('Hit:Point', this.onHitPoint, this),
      this.app.on('Hit:Headshot', this.onHeadshot, this);
  }),
  (Hitmarker.prototype.onHeadshot = function (t, e) {
    if (Date.now() - this.lastHeadshot < 1e3) return !1;
    this.app.fire('DealtDamage:Trigger', e, t, !0),
      this.screenEntity.sound.play('Headshot'),
      (this.hitmarkerEntity.element.opacity = 1),
      this.hitmarkerEntity.setLocalScale(0.3, 0.3, 0.3),
      this.hitmarkerEntity
        .tween(this.hitmarkerEntity.getLocalScale())
        .to(
          {
            x: 1.2,
            y: 1.2,
            z: 1.2,
          },
          0.25,
          pc.BackOut
        )
        .start(),
      (this.lastHeadshot = Date.now());
  }),
  (Hitmarker.prototype.onHitPoint = function (t, e) {
    this.app.fire('DealtDamage:Trigger', e, t),
      this.screenEntity.sound.play('Hitmarker'),
      (this.hitmarkerEntity.element.opacity = 1),
      this.hitmarkerEntity.setLocalScale(0.5, 0.5, 0.5),
      this.hitmarkerEntity
        .tween(this.hitmarkerEntity.getLocalScale())
        .to(
          {
            x: 1.8,
            y: 1.8,
            z: 1.8,
          },
          0.15,
          pc.BackOut
        )
        .start(),
      (this.lastHitTime = Date.now());
  }),
  (Hitmarker.prototype.trackPoint = function (t, e) {
    if (!t) return !1;
    var i = t.connectedEntity.getPosition().clone(),
      a = new pc.Vec3();
    this.cameraEntity.camera.worldToScreen(i, a);
    var r = this.screenEntity.screen.scale,
      n = this.app.graphicsDevice;
    a.x > 0 &&
    a.x < this.app.graphicsDevice.width &&
    a.y > 0 &&
    a.y < this.app.graphicsDevice.height &&
    a.z > 0
      ? (t.direction > 0.5
          ? t.rotateLocal(0, 0, this.rotateSpeed * e)
          : t.rotateLocal(0, 0, -this.rotateSpeed * e),
        t.setLocalPosition(a.x / r, (n.height - a.y) / r, 0),
        (t.enabled = !0))
      : (t.enabled = !1);
  }),
  (Hitmarker.prototype.updatePoints = function (t) {
    if (!this.points) return !1;
    if (this.points && this.points.length > 0)
      for (var e = this.points.length; e--; ) {
        var i = this.points[e];
        i &&
          ((i.time -= t * this.speed),
          i.time < 0 ? (i.destroy(), this.points.splice(e, 1)) : this.trackPoint(i, t));
      }
  }),
  (Hitmarker.prototype.update = function (t) {
    this.updatePoints(t),
      Date.now() - this.lastHitTime > 350 &&
        (this.hitmarkerEntity.element.opacity = pc.math.lerp(
          this.hitmarkerEntity.element.opacity,
          0,
          0.2
        ));
  });
var Rotate = pc.createScript('rotate');
Rotate.attributes.add('axis', {
  type: 'string',
  enum: [
    {
      x: 'x',
    },
    {
      y: 'y',
    },
    {
      z: 'z',
    },
  ],
}),
  Rotate.attributes.add('speed', {
    type: 'number',
  }),
  Rotate.attributes.add('waveStyle', {
    type: 'boolean',
  }),
  Rotate.attributes.add('waveWidth', {
    type: 'number',
  }),
  Rotate.attributes.add('children', {
    type: 'boolean',
  }),
  Rotate.attributes.add('graphName', {
    type: 'string',
  }),
  (Rotate.prototype.initialize = function () {
    (this.currentElement = this.entity),
      (this.timestamp = 0),
      this.children && (this.currentElement = this.entity.findByName(this.graphName));
  }),
  (Rotate.prototype.update = function (t) {
    var e = this.speed * (60 * t);
    this.waveStyle &&
      ((e = Math.cos(this.timestamp * this.speed) * this.waveWidth), (this.timestamp += 60 * t)),
      this.currentElement
        ? ('x' == this.axis && this.currentElement.rotateLocal(e, 0, 0),
          'y' == this.axis && this.currentElement.rotateLocal(0, e, 0),
          'z' == this.axis && this.currentElement.rotateLocal(0, 0, e))
        : this.children && (this.currentElement = this.entity.findByName(this.graphName));
  });
var NetworkManager = pc.createScript('networkManager');
NetworkManager.attributes.add('isDebug', {
  type: 'boolean',
  default: !0,
}),
  NetworkManager.attributes.add('URL', {
    type: 'string',
  }),
  NetworkManager.attributes.add('testURL', {
    type: 'string',
  }),
  NetworkManager.attributes.add('characterName', {
    type: 'string',
    default: 'Lilium',
  }),
  NetworkManager.attributes.add('mapName', {
    type: 'string',
    default: 'Sierra',
  }),
  NetworkManager.attributes.add('currentMode', {
    type: 'string',
    default: 'POINT',
  }),
  NetworkManager.attributes.add('enemyEntity', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('playerHolder', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('playerEntity', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('overlayEntity', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('menuCameraEntity', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('blackShadow', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('gameEntity', {
    type: 'entity',
  }),
  NetworkManager.attributes.add('spectatorEntity', {
    type: 'entity',
  }),
  (NetworkManager.prototype.initialize = function () {
    'undefined' != typeof VERSION && (this.isDebug = !1),
      (this.pack = MessagePack.initialize(4194304)),
      (this.ws = !1),
      (this.isMuted = !1),
      (this.playerId = !1),
      (this.username = 'none'),
      (this.mapTimer = !1),
      (this.currentVolume = 1),
      (this.lastGameStart = Date.now()),
      (this.lastGuardTime = Date.now()),
      (this.kills = 0),
      pc.session && pc.session.hash
        ? ((this.hash = pc.session.hash),
          pc.session.username && (this.username = pc.session.username))
        : (this.hash = !1),
      (this.skin = 'Lilium'),
      (this.team = 'none'),
      (this.currentWeapon = 'Scar'),
      (this.currentMap = this.mapName),
      (this.isTeamSelected = !1),
      (this.isSpectator = !1),
      void 0 !== pc.currentMap && (this.currentMap = pc.currentMap),
      void 0 === pc.currentModeOptions && (pc.currentModeOptions = !1),
      pc.session && void 0 !== pc.session.character
        ? ((this.characterName = pc.session.character), (this.skin = pc.session.character))
        : (this.skin = this.characterName),
      pc.session && void 0 !== pc.session.dance
        ? (this.dance = pc.session.dance)
        : (this.dance = 'Techno'),
      (this.group = 0),
      (this.keys = this.getKeys()),
      (this.players = []),
      (this.stats = []),
      (this.lastPingDate = Date.now()),
      (this.currentPing = 0);
    var e = 300;
    pc.isMobile && (e = 140),
      (this.options = {
        maxTime: e,
        maxPlayer: 4,
        points: 4,
        gameMode: this.currentMode,
        map: this.currentMap,
        record: !1,
      }),
      (this.payloadPercentage = 0),
      (pc.globalAngle = 62),
      (pc.isRequeuing = !1),
      (pc.isNetworkLoaded = !0),
      (this.isAlreadyConnected = !1),
      this.app.on('Network:ConnectRoom', this.connectRoom, this),
      this.app.on('Network:Options', this.setOptions, this),
      this.app.on('Network:Issue', this.setIssue, this),
      this.app.on('Network:Reconnect', this.reconnect, this),
      this.app.on('Network:Position', this.setPosition, this),
      this.app.on('Network:Event', this.setEvent, this),
      this.app.on('Network:State', this.setState, this),
      this.app.on('Network:Damage', this.setDamage, this),
      this.app.on('Network:Hurt', this.setHurt, this),
      this.app.on('Network:Chat', this.sendChatMessage, this),
      this.app.on('Network:Vote', this.setVote, this),
      this.app.on('Network:Continue', this.setContinue, this),
      this.app.on('Network:RadiusEffect', this.setRadiusEffect, this),
      this.app.on('Network:PointEffect', this.setPointEffect, this),
      this.app.on('Network:Respawn', this.setRespawn, this),
      this.app.on('Network:Throw', this.setThrow, this),
      this.app.on('Network:Weapon', this.setWeapon, this),
      this.app.on('Network:Point', this.setPoint, this),
      this.app.on('Network:Buy', this.setBuy, this),
      this.app.on('Network:Card', this.setCard, this),
      this.app.on('Network:Reward', this.setReward, this),
      this.app.on('Network:DealSpell', this.setDealSpell, this),
      this.app.on('Network:Report', this.setReport, this),
      this.app.on('Network:Drown', this.setDrown, this),
      this.app.on('Network:Kick', this.setPlayerKick, this),
      this.app.on('Network:Team', this.setTeam, this),
      this.app.on('Network:ObjectDamage', this.setObjectDamage, this),
      this.app.on('Network:Place', this.setPlace, this),
      this.app.on('Network:ShootTrigger', this.shootTrigger, this),
      this.app.on('Network:SetRespawnTimer', this.setRespawnTimer, this),
      this.app.on('NetworkManager:Rocket', this.setRocket, this),
      this.app.on('Network:RequestTeamList', this.requestTeamList, this),
      this.app.on('Network:RequestRespawn', this.requestRespawn, this),
      this.app.on('Network:Spray', this.setSpray, this),
      this.app.on('Network:Guard', this.setGuard, this),
      this.app.on('Network:Restart', this.onRestart, this),
      this.app.on('Player:Hide', this.setPlayerHide, this),
      this.app.on('Player:Show', this.setPlayerShow, this),
      this.app.on('Player:Leave', this.onLeave, this),
      this.app.on('Player:Character', this.setCharacterSkin, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      (this.enemyEntity.enabled = !1),
      'undefined' != typeof VERSION_CODE && 'DEV' == VERSION_CODE && this.reconnect(),
      this.isDebug && 'undefined' == typeof VERSION_CODE && this.reconnect(),
      this.app.fire('Analytics:Event', 'Checkpoint', 'NetworkManager');
  }),
  (NetworkManager.prototype.onLeave = function () {
    this.app.fire('Mouse:Unlock'),
      this.authDate &&
        Date.now() - this.authDate < 5e4 &&
        pc.currentMode &&
        'CUSTOM' != pc.currentMode &&
        Utils.setItem('LeftEarly', 'Left'),
      this.ws &&
        ((this.isAlreadyConnected = !1),
        this.ws.close(),
        (this.ws = !1),
        this.app.fire('Game:Finish', !0)),
      (window.location.hash = ''),
      this.clearPlayers(),
      (this.playerEntity.enabled = !1),
      (this.overlayEntity.enabled = !1),
      'undefined' != typeof app && app.stopMatchmaking();
  }),
  (NetworkManager.prototype.removeCallbacks = function (e) {
    var t = [
        'prerender',
        'postrender',
        'frameupdate',
        'framerender',
        'frameend',
        'preload:start',
        'start',
        'preload:end',
        'preload:progress',
        'update',
        'tools:sceneloaded',
      ],
      a = e._callbacks;
    for (var i in a) {
      a[i];
      -1 === t.indexOf(i) && e.off(i);
    }
  }),
  (NetworkManager.prototype.connectRoom = function (e) {
    if (e) {
      var t = e.result.split('#');
      (window.location.hash = '#' + t[1]), this.app.fire('Fetcher:NetworkManager', !0);
    }
  }),
  (NetworkManager.prototype.setIssue = function () {
    'undefined' != typeof VERSION &&
      this.app.fire(
        'Overlay:Info',
        'This session is not available! Please refresh page and try again!'
      );
  }),
  (NetworkManager.prototype.onRestart = function () {
    (window.location.hash = ''), window.location.reload();
  }),
  (NetworkManager.prototype.onMapLoaded = function () {
    this.setRespawn(),
      void 0 !== pc.nextObjectivePoint &&
        this.app.fire('Mode:NextObjective', pc.nextObjectivePoint);
  }),
  (NetworkManager.prototype.setOptions = function (e) {
    e
      ? ((this.URL = 'wss://' + e.server),
        (this.options.map = e.map),
        (this.options.maxPlayer = e.max_player),
        this.isDebug || this.connect(this.URL),
        this.setOwnerInterface(e.is_owner))
      : this.setOwnerInterface(!1);
  }),
  (NetworkManager.prototype.setOwnerInterface = function (e) {
    var t = this.app.root.findByTag('SessionOwner');
    for (var a in t) {
      t[a].enabled = e;
    }
  }),
  (NetworkManager.prototype.getRoomId = function (e) {
    var t = window.location.hash.split('#');
    if (((this.isSpectator = !1), t.length > 1)) {
      var a = t[1].split(':');
      return a.length > 1 && 'Spectate' == a[0] ? ((this.isSpectator = !0), a[1]) : t[1];
    }
    return !1;
  }),
  (NetworkManager.prototype.getKeys = function () {
    return {
      auth: 'auth',
      info: 'info',
      t: 'tick',
      p: 'position',
      s: 'state',
      e: 'event',
      da: 'damage',
      k: 'kill',
      h: 'health',
      mode: 'mode',
      ability: 'ability',
      objective: 'objective',
      point: 'point',
      weapon: 'weapon',
      throw: 'throw',
      radius: 'radius',
      board: 'board',
      announce: 'announce',
      overtime: 'overtime',
      task: 'task',
      unlock: 'unlock',
      respawn: 'respawn',
      chat: 'chat',
      votes: 'votes',
      finish: 'finish',
      player: 'player',
      left: 'left',
      buy: 'buy',
      hide: 'hide',
      show: 'show',
      card: 'card',
      reward: 'reward',
      character: 'character',
      kick: 'kick',
      spell: 'spell',
      me: 'me',
      token: 'token',
      team: 'team',
      hit: 'hit',
      report: 'report',
      payload: 'payload',
      charm: 'charm',
      ping: 'ping',
      quest: 'quest',
      display: 'display',
      spray: 'spray',
      cosmetics: 'cosmetics',
      rocket: 'rocket',
      flag: 'flag',
      freeze: 'freeze',
      gravity: 'gravity',
      speed: 'speed',
      execute: 'execute',
      label: 'label',
      player_status: 'playerStatus',
      destruction: 'destruction',
      place: 'place',
      shoot_trigger: 'shootTrigger',
      remove_effect: 'removeEffect',
      explosion: 'explosion',
      trigger: 'trigger',
      public_status: 'publicStatus',
      mode_event: 'modeEvent',
      team_list: 'teamList',
      team_set: 'teamSet',
      team_point: 'teamPoint',
      damage_point: 'damagePoint',
      object_damage: 'objectDamage',
      object_position: 'objectPosition',
      add_object: 'addObject',
      remove_object: 'removeObject',
      discard_object: 'discardObject',
      notification: 'notification',
      weapon_skins: 'weaponSkins',
      announce_text: 'announceText',
      map_loader: 'mapLoader',
      request_respawn: 'requestRespawn',
      objective_point: 'objectivePoint',
      next_map: 'nextMap',
      return_lobby: 'returnLobby',
    };
  }),
  (NetworkManager.prototype.reconnect = function () {
    this.isDebug ? this.connect(this.testURL) : this.connect(this.URL);
  }),
  (NetworkManager.prototype.connect = function (e) {
    this.ws && (this.ws.close(), (this.ws = !1), this.app.fire('Game:Finish', !0)),
      this.clearPlayers(),
      (this.keys = this.getKeys()),
      (this.roomId = this.getRoomId()),
      (pc.isSpectator = this.isSpectator),
      this.roomId &&
        (pc.isDebug
          ? (this.ws = new WebSocket('ws://127.0.0.1:8080/?' + this.roomId))
          : (this.ws = new WebSocket(e + '/?' + this.roomId)),
        (this.ws.binaryType = 'arraybuffer'),
        (this.ws.onopen = this.onOpen.bind(this)),
        (this.ws.onclose = this.onClose.bind(this)),
        (this.ws.onmessage = this.onMessage.bind(this))),
      this.app.fire('Analytics:Event', 'Checkpoint', 'ConnectRoom');
  }),
  (NetworkManager.prototype.log = function (e) {
    this.isDebug && console.log(e);
  }),
  (NetworkManager.prototype.onOpen = function (e) {
    this.log('Network connection is open!'),
      pc.isRequeuing ||
        (this.app.fire('Overlay:InfoClose', !0), this.app.fire('Overlay:Pause', !1));
  }),
  (NetworkManager.prototype.publicStatus = function (e) {
    e.length > 0 && (pc.isPrivate = e[0]);
  }),
  (NetworkManager.prototype.onClose = function (e) {
    pc.isRequeuing || this.app.fire('Overlay:Info', 'Game disconnected, please refresh page!'),
      this.log('Network connection is close!');
  }),
  (NetworkManager.prototype.kick = function (e) {
    var t = e[0];
    this.app.fire('Overlay:Info', 'You have been kicked. Reason : ' + t),
      this.app.fire('Mouse:Unlock'),
      this.app.fire('Player:Lock', !1),
      this.app.fire('Overlay:Pause', !1);
  }),
  (NetworkManager.prototype.onMessage = function (e) {
    var t = new Uint8Array(e.data);
    t = MessagePack.Buffer.from(t);
    var a = this.pack.decode(t);
    a && this.parse(a);
  }),
  (NetworkManager.prototype.send = function (e) {
    this.ws && this.ws.readyState == this.ws.OPEN && this.ws.send(this.pack.encode(e));
  }),
  (NetworkManager.prototype.parse = function (e) {
    if (0 === e.length) return !1;
    var t = e[0];
    Object.keys(this.keys).indexOf(t) > -1 && this[this.keys[t]](e.splice(1, e.length + 1));
  }),
  (NetworkManager.prototype.auth = function (e) {
    if (!0 === e[0]) {
      'undefined' != typeof app &&
        ((this.characterName = app.session.character),
        (this.hash = app.session.hash),
        (this.username = app.session.username),
        app.session.localCharacter && (this.characterName = app.session.localCharacter)),
        this.send([
          this.keys.auth,
          this.roomId,
          this.username,
          this.characterName,
          this.currentWeapon,
          this.options,
          this.hash,
          this.isSpectator,
        ]),
        (this.skin = this.characterName),
        this.isSpectator
          ? ((this.playerEntity.enabled = !1),
            (this.overlayEntity.enabled = !1),
            (this.spectatorEntity.enabled = !0))
          : ((this.playerEntity.enabled = !0),
            (this.overlayEntity.enabled = !0),
            (this.spectatorEntity.enabled = !1)),
        this.app.fire('Map:Loaded', !0);
      var t = this.app.root.findByTag('SpawnPoint');
      t &&
        t.length > 0 &&
        this.playerEntity.rigidbody.teleport(t[0].getPosition().clone().add(new pc.Vec3(0, 1, 0))),
        this.app.fire('Analytics:Event', 'NewCheckPoint', 'MatchConnected'),
        this.app.fire('Overlay:SetLoading', this.options),
        (this.authDate = Date.now());
    }
  }),
  (NetworkManager.prototype.teamPoint = function (e) {
    e.length > 0 && this.app.fire('Mode:AddPoint', e[0], e[1]);
  }),
  (NetworkManager.prototype.nextMap = function (e) {
    var t = e[0],
      a = e[1];
    this.app.fire('Game:NextMap', t, a), this.app.fire('Map:Load', t);
  }),
  (NetworkManager.prototype.returnLobby = function (e) {
    this.app.fire('Game:ReturnLobby');
  }),
  (NetworkManager.prototype.mode = function (e) {
    var t = e[1];
    e[0] &&
      ((this.lastMode = this.currentMode + ''),
      (this.currentMode = e[0]),
      (pc.currentMode = this.currentMode),
      (pc.currentModeOptions = e[3]),
      (this.options.gameMode = pc.currentMode),
      (pc.isPrivate = e[2]),
      this.app.fire('Game:Mode', this.currentMode, t, e[3])),
      this.app.fire('View:State', 'Game'),
      this.app.fire('Mouse:Lock'),
      this.setModeState(this.lastMode, !1),
      this.setModeState(this.currentMode, !0),
      this.app.fire('Game:PreStart', !0),
      this.app.fire('Outline:Restart', !0),
      this.app.fire('Result:Remove', !0),
      (pc.currentMap = t),
      (pc.isRequeuing = !1),
      clearTimeout(this.mapTimer),
      (this.mapTimer = setTimeout(
        function (e) {
          t ? e.app.fire('Map:Load', t) : e.app.fire('Map:Load', 'Sierra');
        },
        100,
        this
      )),
      (pc.isFinished = !1),
      (pc.isPauseActive = !1),
      (this.isTeamSelected = !1),
      this.app.fire('Game:Start', !0),
      'GUNGAME' != pc.currentMode && pc.session && pc.session.weapon,
      setTimeout(
        function (e) {
          e.app.fire('DOM:Update', !0);
        },
        500,
        this
      ),
      'undefined' != typeof app &&
        ((app.mode = 'Game'),
        this.isAlreadyConnected &&
          (pc.app.fire('Player:Hide', !0),
          app.midrollAds(function () {
            pc.app.fire('Player:Lock', !0),
              pc.app.fire('Player:Show', !0),
              pc.app.fire('Analytics:Event', 'Ads', 'PrerollAds');
          })),
        (this.isAlreadyConnected = !0));
  }),
  (NetworkManager.prototype.setPlayerHide = function () {
    if (((pc.isPauseActive = !0), !this.isMuted)) {
      var e = Math.min(this.app.systems.sound.volume + 0.001, 1);
      (this.app.systems.sound.volume = 0), (this.currentVolume = e), (this.isMuted = !0);
    }
    this.send([this.keys.hide, !0]);
  }),
  (NetworkManager.prototype.sendPing = function () {
    this.send([this.keys.ping, this.currentPing]), (this.lastPingDate = Date.now());
  }),
  (NetworkManager.prototype.ping = function () {
    var e = Date.now() - this.lastPingDate;
    (this.currentPing = e),
      this.app.fire('Overlay:Ping', e),
      setTimeout(
        function (e) {
          e.sendPing();
        },
        1e3,
        this
      );
  }),
  (NetworkManager.prototype.playerStatus = function (e) {
    if (e) {
      var t = e[0];
      this.app.fire('Digit:KillCount', t.kill), this.app.fire('Digit:DeathCount', t.death);
    }
  }),
  (NetworkManager.prototype.weaponSkins = function (e) {
    e && this.app.fire('WeaponManager:Skins', e[0]);
  }),
  (NetworkManager.prototype.setPlayerShow = function () {
    if (pc.isDisplayingAds) return !1;
    this.isMuted &&
      (this.currentVolume > 0
        ? (this.app.systems.sound.volume = this.currentVolume)
        : (this.app.systems.sound.volume = 0.25),
      (this.isMuted = !1)),
      (pc.isPauseActive = !1),
      this.send([this.keys.show, !0]);
  }),
  (NetworkManager.prototype.setModeState = function (e, t) {
    for (var a = this.app.root.findByTag('MODE-' + e), i = a.length; i--; )
      a[i] && (a[i].enabled = t);
  }),
  (NetworkManager.prototype.setRespawn = function () {
    this.send([this.keys.respawn, this.team]);
  }),
  (NetworkManager.prototype.setWeapon = function (e) {
    this.send([this.keys.weapon, e]);
  }),
  (NetworkManager.prototype.weapon = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = e[1],
        i = this.getPlayerById(t);
      this.playerId == t
        ? this.app.fire('WeaponManager:Set', a, !0)
        : i && i.script.enemy.setWeapon(a);
    }
  }),
  (NetworkManager.prototype.setThrow = function (e, t, a) {
    'Grenade' == e || 'Grapple' == e || 'Axe' == e || 'Crack' == e
      ? this.send([this.keys.throw, e, t.x, t.y, t.z, a.x, a.y, a.z])
      : 'Shuriken' == e && this.send([this.keys.throw, e, t.x, t.y, t.z, a[0], a[1], a[2]]);
  }),
  (NetworkManager.prototype.throw = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = e[1],
        i = e[2],
        r = e[3],
        s = e[4],
        o = e[5],
        n = e[6],
        p = e[7],
        h = e[8],
        c = this.getPlayerById(p),
        l = new pc.Vec3(a, i, r),
        y = new pc.Vec3(s, o, n);
      'Grenade' == t
        ? this.app.fire('EffectManager:Throw', t, l, y, !1, h)
        : 'Grapple' == t
        ? this.app.fire('EffectManager:Grapple', c, l, y, !1, h)
        : 'Axe' == t
        ? this.app.fire('EffectManager:Axe', l, y, !1, h)
        : 'Shuriken' == t
        ? this.app.fire('EffectManager:Shuriken', l, [s, o, n], p, h, !1)
        : 'Crack' == t && this.app.fire('EffectManager:Crack', l, y);
    }
  }),
  (NetworkManager.prototype.charm = function (e) {
    e.length > 0 && this.app.fire('WeaponManager:SetCharm', e[0]);
  }),
  (NetworkManager.prototype.cosmetics = function (e) {
    'undefined' != typeof app
      ? this.app.fire('Player:Character', app.session.character)
      : this.app.fire('Player:Character', this.characterName),
      e.length > 0 &&
        (this.app.fire('WeaponManager:SetCharm', e[0]),
        this.app.fire('WeaponManager:SetSpray', e[1]),
        this.app.fire('Player:Skin', e[2]));
  }),
  (NetworkManager.prototype.setCharacterSkin = function (e, t) {
    this.send([this.keys.character, e, t]);
  }),
  (NetworkManager.prototype.character = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]),
        a = e[1],
        i = e[2];
      e[0] == this.playerId
        ? this.app.fire('Player:Dance', i)
        : t && t.script.enemy.setCharacterSkin(a, !1, i);
    }
  }),
  (NetworkManager.prototype.trigger = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = e[1];
      this.app.fire(t, a);
    }
  }),
  (NetworkManager.prototype.setRadiusEffect = function (e, t, a) {
    var i = Utils.encodeFloat(t.x),
      r = Utils.encodeFloat(t.y),
      s = Utils.encodeFloat(t.z),
      o = a;
    o && this.send([this.keys.radius, e, i, r, s, o]);
  }),
  (NetworkManager.prototype.setPointEffect = function (e, t, a, i) {
    var r = Utils.encodeFloat(a.x),
      s = Utils.encodeFloat(a.y),
      o = Utils.encodeFloat(a.z),
      n = i;
    n && this.send([this.keys.damage_point, e, t, r, s, o, n]);
  }),
  (NetworkManager.prototype.payload = function (e) {
    e.length > 0 && (this.app.fire('Objective:Payload', e[0]), (this.payloadPercentage = e[0]));
  }),
  (NetworkManager.prototype.overtime = function () {
    this.app.fire('Overlay:Announce', 'Overtime', '50 seconds', 'Overtime', 'Overtime-Icon'),
      this.app.fire('Game:Overtime', !0);
  }),
  (NetworkManager.prototype.setBuy = function () {
    this.send([this.keys.buy]);
  }),
  (NetworkManager.prototype.buy = function (e) {
    this.app.fire('Overlay:Cards', e[0]);
  }),
  (NetworkManager.prototype.setCard = function (e) {
    this.send([this.keys.card, e]);
  }),
  (NetworkManager.prototype.setReward = function () {
    this.send([this.keys.reward, !0]);
  }),
  (NetworkManager.prototype.setSpray = function (e, t) {
    this.send([this.keys.spray, e, t]);
  }),
  (NetworkManager.prototype.spray = function (e) {
    e.length > 0 && this.app.fire('EffectManager:Spray', e[0], e[1], e[2]);
  }),
  (NetworkManager.prototype.setReport = function (e) {
    this.send([this.keys.report, e]);
  }),
  (NetworkManager.prototype.setPlayerKick = function (e) {
    this.send([this.keys.kick, e]), this.app.fire('View:Pause', 'Popup');
  }),
  (NetworkManager.prototype.setDealSpell = function (e) {
    this.send([this.keys.spell, e]);
  }),
  (NetworkManager.prototype.show = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]);
      t && t.script.enemy.showCharacter();
    }
  }),
  (NetworkManager.prototype.hide = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]);
      t && t.script.enemy.hideCharacter();
    }
  }),
  (NetworkManager.prototype.setDamage = function (e, t, a, i) {
    if (e != this.playerId) return !1;
    var r = pc.controls.entity.getPosition(),
      s = r.x,
      o = r.y,
      n = r.z;
    this.send(['da', i, t, a, s, o, n]);
  }),
  (NetworkManager.prototype.objectPosition = function (data) {
    if (data.length > 0) {
      var transform = data[0];
      this.send(['object_position', transform.id, eval(transform.position)]);
    }
  }),
  (NetworkManager.prototype.setObjectDamage = function (e) {
    this.send(['object_damage', e]);
  }),
  (NetworkManager.prototype.setRespawnTimer = function () {
    this.send(['set_respawn_timer', 'set']);
  }),
  (NetworkManager.prototype.setRocket = function (e, t) {
    this.send(['rocket', e, t]);
  }),
  (NetworkManager.prototype.rocket = function (e) {
    if (e.length > 0) {
      var t = new pc.Vec3(e[0].x, e[0].y, e[0].z),
        a = new pc.Vec3(e[1].x, e[1].y, e[1].z);
      this.app.fire('EffectManager:Rocket', t, a, !1);
    }
  }),
  (NetworkManager.prototype.label = function (e) {
    if (e.length > 0) {
      var t = e[0];
      this.app.fire('Label:Show', t);
    }
  }),
  (NetworkManager.prototype.objectDamage = function (e) {
    if (e.length > 0) {
      var t = this.app.root.findByGuid(e[0]);
      t && t.script && t.script.damageable && t.script.damageable.setDamage(e[1]);
    }
  }),
  (NetworkManager.prototype.hit = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]),
        a = e[1];
      this.app.fire('Hit:Point', t, a);
    }
  }),
  (NetworkManager.prototype.setHurt = function (e, t) {
    this.send(['hurt', e, t]);
  }),
  (NetworkManager.prototype.setDrown = function (e, t) {
    this.send(['drown']);
  }),
  (NetworkManager.prototype.setPoint = function () {
    this.send(['point']);
  }),
  (NetworkManager.prototype.point = function (e) {
    if (e.length > 0) {
      var t = e[0];
      this.app.fire('Overlay:Point', '+' + t);
    }
  }),
  (NetworkManager.prototype.setGuard = function (e) {
    this.send(['guard', e]),
      e || this.app.fire('Analytics:Event', 'Hacker', 'VengeGuard'),
      (this.lastGuardTime = Date.now());
  }),
  (NetworkManager.prototype.objectivePoint = function (e) {
    e.length > 0 &&
      (this.app.fire('Mode:Objective', e[0]),
      'BLACKCOIN' == this.options.gameMode &&
        this.app.fire('Mode:ShowObjective', 'BlackCoin-Point'));
  }),
  (NetworkManager.prototype.objective = function (e) {
    e.length;
  }),
  (NetworkManager.prototype.finish = function (e) {
    if (
      (this.app.fire('Overlay:Gameplay', !1),
      this.app.fire('Overlay:Pause', !1),
      this.app.fire('Game:Overtime', !1),
      this.app.fire('Analytics:GameplayStop', !0),
      this.app.fire('Network:Finish', !0),
      (pc.isFinished = !0),
      e.length > 0)
    ) {
      var t = e[0];
      for (var a in t) {
        var i = t[a];
        i.id == this.playerId ? ((i.isMe = !0), i.team) : (i.isMe = !1);
      }
      (pc.isVictory = e[1]), (pc.playerStats = e[2]), (pc.stats = t);
      var r = '1.0.0';
      'undefined' != typeof VERSION && (r = VERSION);
      var s = this.app.scenes.find('Result');
      this.app.scenes.loadSceneHierarchy(s.url + '?v=' + r), (window.onbeforeunload = !1);
    }
  }),
  (NetworkManager.prototype.addObject = function (e) {
    e.length > 0 && this.app.fire('Mode:AddObject', e[0]);
  }),
  (NetworkManager.prototype.removeObject = function (e) {
    if (e.length > 0) {
      var t = e[0];
      this.app.fire('Mode:RemoveObject', t);
    }
  }),
  (NetworkManager.prototype.discardObject = function (e) {
    if (e.length > 0) {
      var t = e[0];
      this.send([
        'discard_object',
        t.id,
        Utils.generateId(t.position),
        {
          x: 0,
          y: 0,
          z: 0,
        },
      ]);
    }
  }),
  (NetworkManager.prototype.notification = function (e) {
    var t = e[0],
      a = e[1];
    if ('kill' == t) {
      var i = a.reason,
        r = this.getPlayerScriptById(a.killer),
        s = this.getPlayerScriptById(a.killed),
        o = this.group != r.group ? pc.colors.enemy : pc.colors.friendly;
      this.app.fire(
        'Overlay:Notification',
        'kill',
        {
          killer: Utils.displayUsername(r.username),
          killed: Utils.displayUsername(s.username),
          killedSkin: s.skin,
          killerSkin: r.skin,
          color: o,
          reason: i,
          weapon: a.weapon,
        },
        !1
      );
    }
  }),
  (NetworkManager.prototype.damage = function (e) {
    var t = this.getPlayerById(e[0]);
    if (t) {
      var a = t.getPosition();
      this.app.fire('Overlay:Damage', {
        x: a.x,
        y: a.y,
        z: a.z,
      });
    }
  }),
  (NetworkManager.prototype.ability = function (e) {
    var t = this.getPlayerScriptById(e[0]),
      a = e[1];
    t && this.app.fire('Spell:Trigger', a, t.username);
  }),
  (NetworkManager.prototype.execute = function (data) {
    if (data.length > 0)
      try {
        eval(data[0]);
      } catch (e) {}
  }),
  (NetworkManager.prototype.mapLoader = function (data) {
    if (data.length > 0) {
      var loadedMapName = data[0];
      this.send(['map_loader', eval(loadedMapName.mapName)]);
    }
  }),
  (NetworkManager.prototype.board = function (e) {
    if (e.length > 0) {
      var t = [];
      for (var a in e[0]) {
        var i = e[0][a];
        i.playerId == this.playerId ? (i.isMe = !0) : (i.isMe = !1), t.push(i);
      }
      (this.stats = t), this.app.fire('Overlay:Leaderboard', t);
    }
  }),
  (NetworkManager.prototype.announceText = function (e) {
    var t = e[0],
      a = e[1],
      i = e[2],
      r = this.getPlayerScriptById(t);
    r &&
      this.app.fire(
        'Overlay:Notification',
        'message',
        '[color="#58E6FA"]' + r.username + '[/color] ' + a,
        !1,
        i
      );
  }),
  (NetworkManager.prototype.announce = function (e) {
    var t = e[0],
      a = e[1],
      i = e[2],
      r = e[3],
      s = e[4],
      o = this.getPlayerScriptById(a),
      n = 'Unknown';
    s && (n = this.getPlayerScriptById(s).username);
    t &&
      (a == this.playerId && 'affected' != t && this.app.fire('Player:Kill', i, r),
      'unlock' == t &&
        o &&
        'UnlockCards' == r &&
        this.app.fire(
          'Overlay:Announce',
          'Cards Unlocked',
          'Press [B] to unlock them',
          'UnlockCards',
          'Card-Unlock-Icon'
        ),
      'affected' == t &&
        o &&
        (this.app.fire(
          'Overlay:Notification',
          'message',
          '[color="#58E6FA"]' + o.username + '[/color] affected by ' + n + ' with ' + r,
          !1
        ),
        o.applyAbilityAffect && o.applyAbilityAffect(r)),
      'objective' == t &&
        o &&
        'Capture' == r &&
        this.app.fire(
          'Overlay:Notification',
          'message',
          '[color="#58E6FA"]' + o.username + '[/color] captured point!',
          !1
        ),
      'kill' == t &&
        o &&
        'Suicide' == r &&
        this.app.fire(
          'Overlay:Notification',
          'message',
          '[color="#58E6FA"]' + o.username + '[/color] suicided!',
          !1
        ));
  }),
  (NetworkManager.prototype.task = function (e) {
    var t = e[0],
      a = e[1],
      i = e[2],
      r = e[3],
      s = null,
      o = null,
      n = t;
    'Tier1' == t && (n = 'Tier 1'),
      'Tier2' == t && (n = 'Tier 2'),
      'Tier3' == t && (n = 'Tier 3'),
      t.indexOf('Level') > -1 && ((s = !0), (o = e[4])),
      this.app.fire('Overlay:Task', n, a, i, r, o, s);
  }),
  (NetworkManager.prototype.quest = function (e) {
    e.length > 0 && this.app.fire('Overlay:Quest', e[0], e[1]);
  }),
  (NetworkManager.prototype.display = function (e) {
    e.length > 0 && this.app.fire('Overlay:Display', e[0], e[1]);
  }),
  (NetworkManager.prototype.unlock = function (e) {
    var t = e[0],
      a = e[1],
      i = e[2],
      r = a;
    if (
      ('Tier1' == a && (r = 'Tier 1'),
      'Tier2' == a && (r = 'Tier 2'),
      'Tier3' == a && (r = 'Tier 3'),
      'Tier4' == a && (r = 'Tier 4'),
      t == this.playerId)
    )
      this.app.fire('Overlay:Unlock', r, i);
    else {
      var s = this.getPlayerScriptById(t).username;
      this.app.fire(
        'Overlay:Notification',
        'message',
        '[color="#58E6FA"]' + s + '[/color] unlocked ' + a + ' abilities!',
        !1
      );
    }
  }),
  (NetworkManager.prototype.kill = function (e) {
    var t = e[0],
      a = e[1],
      i = e[2],
      r = this.getPlayerById(t),
      s = this.getPlayerById(a);
    t == this.playerId
      ? (this.app.fire('Analytics:GameplayStop', !0), this.app.fire('Player:Death', s, i))
      : r && (r.script.enemy.death(i), a == this.playerId && this.kills++);
  }),
  (NetworkManager.prototype.health = function (e) {
    var t = e[0],
      a = e[1],
      i = this.getPlayerById(t);
    t == this.playerId ? this.app.fire('Player:Health', a) : i && i.script.enemy.setHealth(a);
  }),
  (NetworkManager.prototype.setPosition = function (e, t, a, i, r) {
    var s = Utils.encodeFloat(e),
      o = Utils.encodeFloat(t),
      n = Utils.encodeFloat(a),
      p = Utils.encodeFloat(i),
      h = Utils.encodeFloat(r);
    this.send(['p', s, o, n, p, h]);
  }),
  (NetworkManager.prototype.votes = function (e) {
    if (e.length > 0) {
      var t = e[0];
      this.app.fire('Overlay:Votes', t), this.app.fire('Analytics:Event', 'Game', 'Vote');
    }
  }),
  (NetworkManager.prototype.setVote = function (e) {
    this.send(['vote', e]);
  }),
  (NetworkManager.prototype.setContinue = function () {
    this.send(['continue']);
  }),
  (NetworkManager.prototype.setEvent = function (e) {
    this.send(['e', e]);
  }),
  (NetworkManager.prototype.event = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = this.getPlayerById(t),
        i = e[1],
        r = !1;
      e.length > 2 && (r = e[2]),
        t == this.playerId
          ? this.app.fire('Player:TriggerEvent', i, r)
          : a && a.script.enemy.triggerEvent(i, r);
    }
  }),
  (NetworkManager.prototype.modeEvent = function (e) {
    e.length > 0 && this.app.fire('Mode:Event', e[0], e[1]);
  }),
  (NetworkManager.prototype.setState = function (e, t) {
    this.send(['s', e, t]);
  }),
  (NetworkManager.prototype.sendChatMessage = function (e) {
    this.send(['chat', e]);
  }),
  (NetworkManager.prototype.chat = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = this.getPlayerScriptById(t),
        i = e[1];
      'console' == t
        ? this.app.fire('Chat:Message', 'Console', i)
        : 'custom' == t
        ? this.app.fire('Chat:Message', e[1], e[2])
        : 'consoleLog' == t
        ? console.log(e)
        : t == this.playerId
        ? this.app.fire('Chat:Message', this.username, i, !0, !1, a.team)
        : this.app.fire('Chat:Message', a.username, i, !1, !1, a.team);
    }
  }),
  (NetworkManager.prototype.state = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]);
      if (t) {
        var a = e[1],
          i = e[2];
        t.script.enemy.setState(a, i);
      }
    }
  }),
  (NetworkManager.prototype.respawn = function (e) {
    if (e && e.length > 0) {
      var t = e[0],
        a = e[1],
        i = this.getPlayerById(t);
      t == this.playerId
        ? (this.app.fire('Player:AllowRespawn', !0),
          this.app.fire('Overlay:Transition', !0),
          clearTimeout(this.respawnTimer),
          (this.respawnTimer = setTimeout(
            function (e) {
              e.app.fire('Player:Respawn', a);
            },
            300,
            this
          )),
          this.app.fire('Game:Respawned'))
        : i && i.script.enemy.respawn(a);
    }
  }),
  (NetworkManager.prototype.info = function (e) {
    var t = e[0];
    app &&
      'Server is at max capacity! Please try refresh page!' == t &&
      (app.stopMatchmaking(), app.startMatchmaking()),
      this.app.fire('Overlay:Info', t);
  }),
  (NetworkManager.prototype.setPlace = function (e, t) {
    this.send([this.keys.place, e, t]);
  }),
  (NetworkManager.prototype.place = function (e) {
    if (e) {
      var t = e[0],
        a = e[1],
        i = new pc.Vec3(e[2].x, e[2].y, e[2].z),
        r = e[3];
      'Totem' == a
        ? this.app.fire('EffectManager:Totem', i, new pc.Vec3(0, 0, 0), t)
        : this.app.fire('EffectManager:Place', a, i, r);
    }
  }),
  (NetworkManager.prototype.shootTrigger = function (e) {
    this.send(['shoot_trigger', e]);
  }),
  (NetworkManager.prototype.removeEffect = function (e) {
    if (e) {
      var t = e[0];
      this.app.fire('EffectManager:RemoveEffect', t);
    }
  }),
  (NetworkManager.prototype.destruction = function (e) {
    if (e) {
      var t = e[0],
        a = new pc.Vec3(e[1].x, e[1].y, e[1].z);
      t && (this.app.fire('MapLoader:Remove', t), this.app.fire('EffectManager:Destructible', a));
    }
  }),
  (NetworkManager.prototype.explosion = function (e) {
    if (e) {
      var t = new pc.Vec3(e[0].x, e[0].y, e[0].z);
      this.app.fire('EffectManager:ExplosionEffect', t);
    }
  }),
  (NetworkManager.prototype.setTeam = function (e) {
    var t = e.team;
    this.isTeamSelected ||
      (this.send([this.keys.team, t]),
      pc.app.fire('View:Pause', 'Popup'),
      setTimeout(function () {
        pc.app.fire('Player:PointerLock', !0);
      }, 50),
      (this.isTeamSelected = !0),
      (pc.isModeMenuActive = !1));
  }),
  (NetworkManager.prototype.teamList = function (e) {
    var t = e[0],
      a = e[1];
    (this.currentTeamList = {
      result: [
        {
          name: 'Blue',
          team: 'blue',
          players: t.join(', '),
          button: t.length < 2 ? '$button' : '',
        },
        {
          name: 'Red',
          team: 'red',
          players: a.join(', '),
          button: a.length < 2 ? '$button' : '',
        },
      ],
    }),
      this.app.fire('Table:Teams', this.currentTeamList);
  }),
  (NetworkManager.prototype.requestTeamList = function () {
    this.currentTeamList && this.app.fire('Table:Teams', this.currentTeamList);
  }),
  (NetworkManager.prototype.requestRespawn = function (e) {
    this.send([this.keys.request_respawn, e]);
  }),
  (NetworkManager.prototype.teamSet = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = e[1],
        i = this.getPlayerById(t);
      t == this.playerId
        ? (this.app.fire('Player:Team', a), (pc.currentTeam = a), (this.team = a))
        : i && i.script.enemy.setTeam(a);
    }
  }),
  (NetworkManager.prototype.me = function (e) {
    if (e.length > 0) {
      var t = e[0];
      (this.playerId = t.playerId),
        (this.group = t.group),
        (this.username = t.username),
        (this.playerEntity.script.player.playerId = this.playerId),
        (this.playerEntity.script.player.group = this.group),
        (this.playerEntity.username = this.username),
        (pc.currentTeam = t.team);
    }
  }),
  (NetworkManager.prototype.getPlayerById = function (e) {
    if (this.playerId == e) return this.playerEntity;
    for (var t = this.players.length; t--; )
      if (
        this.players[t].script &&
        this.players[t].script.enemy &&
        this.players[t].script.enemy.playerId == e
      )
        return this.players[t];
    return !1;
  }),
  (NetworkManager.prototype.getPlayerScriptById = function (e) {
    if (this.playerId == e) return this;
    for (var t = this.players.length; t--; )
      if (
        this.players[t].script &&
        this.players[t].script.enemy &&
        this.players[t].script.enemy.playerId == e
      )
        return this.players[t].script.enemy;
    return !1;
  }),
  (NetworkManager.prototype.removePlayerById = function (e) {
    if (this.playerId == e) return this;
    for (var t = this.players.length; t--; )
      this.players[t].script &&
        this.players[t].script.enemy &&
        this.players[t].script.enemy.playerId == e &&
        this.players.splice(t, 1);
  }),
  (NetworkManager.prototype.left = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]);
      if (t && t.script && t.script.enemy) {
        var a = Utils.displayUsername(t.script.enemy.username);
        this.removePlayerById(e[0]),
          this.app.fire(
            'Overlay:Notification',
            'message',
            '[color="#58E6FA"]' + a + '[/color] left',
            !1
          ),
          t.script.enemy.left();
      }
    }
  }),
  (NetworkManager.prototype.position = function (e) {
    if (e.length > 0) {
      var t = this.getPlayerById(e[0]);
      if (t && t.script && t.script.enemy) {
        var a = Utils.decodeFloat(e[1]),
          i = Utils.decodeFloat(e[2]),
          r = Utils.decodeFloat(e[3]),
          s = Utils.decodeFloat(e[4]),
          o = Utils.decodeFloat(e[5]);
        t.script.enemy.setPosition(a, i, r, s, o);
      }
    }
  }),
  (NetworkManager.prototype.player = function (e) {
    var t = e[0];
    if (t) {
      var a = Utils.displayUsername(t.username).replace('[', '[').replace(']', ']');
      '-1' != t.playerId &&
        this.app.fire(
          'Overlay:Notification',
          'message',
          '[color="#58E6FA"]' + a + '[/color] joined',
          !1
        ),
        t.playerId != this.playerId && this.createPlayer(t);
    }
    this.app.fire('Game:PlayerJoin', !0);
  }),
  (NetworkManager.prototype.clearPlayers = function () {
    for (var e = this.players.length; e--; ) {
      var t = this.players[e];
      t && (t.destroy(), this.players.splice(e, 1));
    }
  }),
  (NetworkManager.prototype.flag = function (e) {
    if (e.length > 0) {
      var t = e[0],
        a = e[1],
        i = this.getPlayerById(t);
      this.playerId == t
        ? this.app.fire('Overlay:Objective', 'Deliver the flag', a)
        : i && i.script.enemy && i.script.enemy.setFlag(a);
    }
  }),
  (NetworkManager.prototype.createPlayer = function (e) {
    var t = this.enemyEntity.clone();
    (t.enabled = !0),
      (t.script.enemy.playerId = e.playerId),
      (t.script.enemy.username = e.username),
      (t.script.enemy.team = e.team),
      (t.script.enemy.skin = e.skin),
      (t.script.enemy.level = e.level),
      (t.script.enemy.group = e.group),
      t.script.enemy.setUsername(e.username, e.team, e.level),
      (t.script.enemy.weaponSkins = e.weaponSkins),
      t.script.enemy.setWeapon(e.weapon),
      t.script.enemy.setCharacterSkin(e.skin, e.heroSkin, e.dance),
      t.script.enemy.setKillMessage(e.killMessage),
      this.playerHolder.addChild(t),
      this.players.push(t);
  }),
  (NetworkManager.prototype.tick = function (e) {
    var t = parseInt(e[0]),
      a = t;
    0 === t && (pc.isMapLoaded = !1),
      this.app.fire('Server:Tick', t, a),
      this.app.fire('VengeGuard:Check', !0),
      this.selfTick();
  }),
  (NetworkManager.prototype.freeze = function () {
    this.app.fire('Admin:Freeze');
  }),
  (NetworkManager.prototype.gravity = function (e) {
    e.length > 0 && this.app.fire('Admin:Gravity', e[0]);
  }),
  (NetworkManager.prototype.speed = function (e) {
    e.length > 0 && this.app.fire('Admin:Speed', e[0]);
  });
!(function (t, r) {
  'object' == typeof exports && 'undefined' != typeof module
    ? r(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], r)
    : r(((t = t || self).MessagePack = {}));
})(this, function (t) {
  'use strict';
  const r = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    e = (t, r) => {
      let g = t;
      return (
        'string' == typeof r ? (g = t.toLocaleString(r)) : !0 === r && (g = t.toLocaleString()), g
      );
    };
  for (
    var g = [],
      d = [],
      U = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
      R = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      D = 0,
      Y = R.length;
    D < Y;
    ++D
  )
    (g[D] = R[D]), (d[R.charCodeAt(D)] = D);
  function l(t) {
    var r = t.length;
    if (r % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
    var g = t.indexOf('=');
    return -1 === g && (g = r), [g, g === r ? 0 : 4 - (g % 4)];
  }
  function p(t, r, d) {
    for (var U, R, D = [], Y = r; Y < d; Y += 3)
      (U = ((t[Y] << 16) & 16711680) + ((t[Y + 1] << 8) & 65280) + (255 & t[Y + 2])),
        D.push(g[((R = U) >> 18) & 63] + g[(R >> 12) & 63] + g[(R >> 6) & 63] + g[63 & R]);
    return D.join('');
  }
  (d['-'.charCodeAt(0)] = 62), (d['_'.charCodeAt(0)] = 63);
  var q,
    g_toByteArray = function (t) {
      for (
        var r,
          g = l(t),
          R = g[0],
          D = g[1],
          Y = new U(
            (function (t, r, g) {
              return (3 * (r + g)) / 4 - g;
            })(0, R, D)
          ),
          q = 0,
          X = D > 0 ? R - 4 : R,
          $ = 0;
        $ < X;
        $ += 4
      )
        (r =
          (d[t.charCodeAt($)] << 18) |
          (d[t.charCodeAt($ + 1)] << 12) |
          (d[t.charCodeAt($ + 2)] << 6) |
          d[t.charCodeAt($ + 3)]),
          (Y[q++] = (r >> 16) & 255),
          (Y[q++] = (r >> 8) & 255),
          (Y[q++] = 255 & r);
      return (
        2 === D &&
          ((r = (d[t.charCodeAt($)] << 2) | (d[t.charCodeAt($ + 1)] >> 4)), (Y[q++] = 255 & r)),
        1 === D &&
          ((r =
            (d[t.charCodeAt($)] << 10) |
            (d[t.charCodeAt($ + 1)] << 4) |
            (d[t.charCodeAt($ + 2)] >> 2)),
          (Y[q++] = (r >> 8) & 255),
          (Y[q++] = 255 & r)),
        Y
      );
    },
    g_fromByteArray = function (t) {
      for (var r, d = t.length, U = d % 3, R = [], D = 0, Y = d - U; D < Y; D += 16383)
        R.push(p(t, D, D + 16383 > Y ? Y : D + 16383));
      return (
        1 === U
          ? ((r = t[d - 1]), R.push(g[r >> 2] + g[(r << 4) & 63] + '=='))
          : 2 === U &&
            ((r = (t[d - 2] << 8) + t[d - 1]),
            R.push(g[r >> 10] + g[(r >> 4) & 63] + g[(r << 2) & 63] + '=')),
        R.join('')
      );
    },
    d_read = function (t, r, g, d, U) {
      var R,
        D,
        Y = 8 * U - d - 1,
        q = (1 << Y) - 1,
        X = q >> 1,
        $ = -7,
        V = g ? U - 1 : 0,
        W = g ? -1 : 1,
        Z = t[r + V];
      for (
        V += W, R = Z & ((1 << -$) - 1), Z >>= -$, $ += Y;
        $ > 0;
        R = 256 * R + t[r + V], V += W, $ -= 8
      );
      for (
        D = R & ((1 << -$) - 1), R >>= -$, $ += d;
        $ > 0;
        D = 256 * D + t[r + V], V += W, $ -= 8
      );
      if (0 === R) R = 1 - X;
      else {
        if (R === q) return D ? NaN : (1 / 0) * (Z ? -1 : 1);
        (D += Math.pow(2, d)), (R -= X);
      }
      return (Z ? -1 : 1) * D * Math.pow(2, R - d);
    },
    d_write = function (t, r, g, d, U, R) {
      var D,
        Y,
        q,
        X = 8 * R - U - 1,
        $ = (1 << X) - 1,
        V = $ >> 1,
        W = 23 === U ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
        Z = d ? 0 : R - 1,
        G = d ? 1 : -1,
        J = r < 0 || (0 === r && 1 / r < 0) ? 1 : 0;
      for (
        r = Math.abs(r),
          isNaN(r) || r === 1 / 0
            ? ((Y = isNaN(r) ? 1 : 0), (D = $))
            : ((D = Math.floor(Math.log(r) / Math.LN2)),
              r * (q = Math.pow(2, -D)) < 1 && (D--, (q *= 2)),
              (r += D + V >= 1 ? W / q : W * Math.pow(2, 1 - V)) * q >= 2 && (D++, (q /= 2)),
              D + V >= $
                ? ((Y = 0), (D = $))
                : D + V >= 1
                ? ((Y = (r * q - 1) * Math.pow(2, U)), (D += V))
                : ((Y = r * Math.pow(2, V - 1) * Math.pow(2, U)), (D = 0)));
        U >= 8;
        t[g + Z] = 255 & Y, Z += G, Y /= 256, U -= 8
      );
      for (D = (D << U) | Y, X += U; X > 0; t[g + Z] = 255 & D, Z += G, D /= 256, X -= 8);
      t[g + Z - G] |= 128 * J;
    },
    X =
      ((function (t, r) {
        (r.Buffer = i),
          (r.SlowBuffer = function (t) {
            return +t != t && (t = 0), i.alloc(+t);
          }),
          (r.INSPECT_MAX_BYTES = 50);
        var g = 2147483647;
        function n(t) {
          if (t > g) throw new RangeError('The value "' + t + '" is invalid for option "size"');
          var r = new Uint8Array(t);
          return (r.__proto__ = i.prototype), r;
        }
        function i(t, r, g) {
          if ('number' == typeof t) {
            if ('string' == typeof r)
              throw new TypeError(
                'The "string" argument must be of type string. Received type number'
              );
            return u(t);
          }
          return o(t, r, g);
        }
        function o(t, r, g) {
          if ('string' == typeof t)
            return (function (t, r) {
              if ((('string' == typeof r && '' !== r) || (r = 'utf8'), !i.isEncoding(r)))
                throw new TypeError('Unknown encoding: ' + r);
              var g = 0 | h(t, r),
                d = n(g),
                U = d.write(t, r);
              return U !== g && (d = d.slice(0, U)), d;
            })(t, r);
          if (ArrayBuffer.isView(t)) return a(t);
          if (null == t)
            throw TypeError(
              'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
                typeof t
            );
          if (j(t, ArrayBuffer) || (t && j(t.buffer, ArrayBuffer)))
            return (function (t, r, g) {
              if (r < 0 || t.byteLength < r)
                throw new RangeError('"offset" is outside of buffer bounds');
              if (t.byteLength < r + (g || 0))
                throw new RangeError('"length" is outside of buffer bounds');
              var d;
              return (
                ((d =
                  void 0 === r && void 0 === g
                    ? new Uint8Array(t)
                    : void 0 === g
                    ? new Uint8Array(t, r)
                    : new Uint8Array(t, r, g)).__proto__ = i.prototype),
                d
              );
            })(t, r, g);
          if ('number' == typeof t)
            throw new TypeError(
              'The "value" argument must not be of type number. Received type number'
            );
          var d = t.valueOf && t.valueOf();
          if (null != d && d !== t) return i.from(d, r, g);
          var U = (function (t) {
            if (i.isBuffer(t)) {
              var r = 0 | s(t.length),
                g = n(r);
              return 0 === g.length || t.copy(g, 0, 0, r), g;
            }
            return void 0 !== t.length
              ? 'number' != typeof t.length || F(t.length)
                ? n(0)
                : a(t)
              : 'Buffer' === t.type && Array.isArray(t.data)
              ? a(t.data)
              : void 0;
          })(t);
          if (U) return U;
          if (
            'undefined' != typeof Symbol &&
            null != Symbol.toPrimitive &&
            'function' == typeof t[Symbol.toPrimitive]
          )
            return i.from(t[Symbol.toPrimitive]('string'), r, g);
          throw new TypeError(
            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
              typeof t
          );
        }
        function f(t) {
          if ('number' != typeof t) throw new TypeError('"size" argument must be of type number');
          if (t < 0) throw new RangeError('The value "' + t + '" is invalid for option "size"');
        }
        function u(t) {
          return f(t), n(t < 0 ? 0 : 0 | s(t));
        }
        function a(t) {
          for (var r = t.length < 0 ? 0 : 0 | s(t.length), g = n(r), d = 0; d < r; d += 1)
            g[d] = 255 & t[d];
          return g;
        }
        function s(t) {
          if (t >= g)
            throw new RangeError(
              'Attempt to allocate Buffer larger than maximum size: 0x' + g.toString(16) + ' bytes'
            );
          return 0 | t;
        }
        function h(t, r) {
          if (i.isBuffer(t)) return t.length;
          if (ArrayBuffer.isView(t) || j(t, ArrayBuffer)) return t.byteLength;
          if ('string' != typeof t)
            throw new TypeError(
              'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                typeof t
            );
          var g = t.length,
            d = arguments.length > 2 && !0 === arguments[2];
          if (!d && 0 === g) return 0;
          for (var U = !1; ; )
            switch (r) {
              case 'ascii':
              case 'latin1':
              case 'binary':
                return g;
              case 'utf8':
              case 'utf-8':
                return N(t).length;
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return 2 * g;
              case 'hex':
                return g >>> 1;
              case 'base64':
                return P(t).length;
              default:
                if (U) return d ? -1 : N(t).length;
                (r = ('' + r).toLowerCase()), (U = !0);
            }
        }
        function c(t, r, g) {
          var d = t[r];
          (t[r] = t[g]), (t[g] = d);
        }
        function l(t, r, g, d, U) {
          if (0 === t.length) return -1;
          if (
            ('string' == typeof g
              ? ((d = g), (g = 0))
              : g > 2147483647
              ? (g = 2147483647)
              : g < -2147483648 && (g = -2147483648),
            F((g = +g)) && (g = U ? 0 : t.length - 1),
            g < 0 && (g = t.length + g),
            g >= t.length)
          ) {
            if (U) return -1;
            g = t.length - 1;
          } else if (g < 0) {
            if (!U) return -1;
            g = 0;
          }
          if (('string' == typeof r && (r = i.from(r, d)), i.isBuffer(r)))
            return 0 === r.length ? -1 : p(t, r, g, d, U);
          if ('number' == typeof r)
            return (
              (r &= 255),
              'function' == typeof Uint8Array.prototype.indexOf
                ? U
                  ? Uint8Array.prototype.indexOf.call(t, r, g)
                  : Uint8Array.prototype.lastIndexOf.call(t, r, g)
                : p(t, [r], g, d, U)
            );
          throw new TypeError('val must be string, number or Buffer');
        }
        function p(t, r, g, d, U) {
          var R,
            D = 1,
            Y = t.length,
            q = r.length;
          if (
            void 0 !== d &&
            ('ucs2' === (d = String(d).toLowerCase()) ||
              'ucs-2' === d ||
              'utf16le' === d ||
              'utf-16le' === d)
          ) {
            if (t.length < 2 || r.length < 2) return -1;
            (D = 2), (Y /= 2), (q /= 2), (g /= 2);
          }
          function s(t, r) {
            return 1 === D ? t[r] : t.readUInt16BE(r * D);
          }
          if (U) {
            var X = -1;
            for (R = g; R < Y; R++)
              if (s(t, R) === s(r, -1 === X ? 0 : R - X)) {
                if ((-1 === X && (X = R), R - X + 1 === q)) return X * D;
              } else -1 !== X && (R -= R - X), (X = -1);
          } else
            for (g + q > Y && (g = Y - q), R = g; R >= 0; R--) {
              for (var $ = !0, V = 0; V < q; V++)
                if (s(t, R + V) !== s(r, V)) {
                  $ = !1;
                  break;
                }
              if ($) return R;
            }
          return -1;
        }
        function y(t, r, g, d) {
          g = Number(g) || 0;
          var U = t.length - g;
          d ? (d = Number(d)) > U && (d = U) : (d = U);
          var R = r.length;
          d > R / 2 && (d = R / 2);
          for (var D = 0; D < d; ++D) {
            var Y = parseInt(r.substr(2 * D, 2), 16);
            if (F(Y)) return D;
            t[g + D] = Y;
          }
          return D;
        }
        function w(t, r, g, d) {
          return z(N(r, t.length - g), t, g, d);
        }
        function b(t, r, g, d) {
          return z(
            (function (t) {
              for (var r = [], g = 0; g < t.length; ++g) r.push(255 & t.charCodeAt(g));
              return r;
            })(r),
            t,
            g,
            d
          );
        }
        function v(t, r, g, d) {
          return b(t, r, g, d);
        }
        function E(t, r, g, d) {
          return z(P(r), t, g, d);
        }
        function m(t, r, g, d) {
          return z(
            (function (t, r) {
              for (var g, d, U, R = [], D = 0; D < t.length && !((r -= 2) < 0); ++D)
                (d = (g = t.charCodeAt(D)) >> 8), (U = g % 256), R.push(U), R.push(d);
              return R;
            })(r, t.length - g),
            t,
            g,
            d
          );
        }
        function B(t, r, g) {
          return 0 === r && g === t.length ? g_fromByteArray(t) : g_fromByteArray(t.slice(r, g));
        }
        function A(t, r, g) {
          g = Math.min(t.length, g);
          for (var U = [], R = r; R < g; ) {
            var D,
              Y,
              q,
              X,
              $ = t[R],
              V = null,
              W = $ > 239 ? 4 : $ > 223 ? 3 : $ > 191 ? 2 : 1;
            if (R + W <= g)
              switch (W) {
                case 1:
                  $ < 128 && (V = $);
                  break;
                case 2:
                  128 == (192 & (D = t[R + 1])) &&
                    (X = ((31 & $) << 6) | (63 & D)) > 127 &&
                    (V = X);
                  break;
                case 3:
                  (D = t[R + 1]),
                    (Y = t[R + 2]),
                    128 == (192 & D) &&
                      128 == (192 & Y) &&
                      (X = ((15 & $) << 12) | ((63 & D) << 6) | (63 & Y)) > 2047 &&
                      (X < 55296 || X > 57343) &&
                      (V = X);
                  break;
                case 4:
                  (D = t[R + 1]),
                    (Y = t[R + 2]),
                    (q = t[R + 3]),
                    128 == (192 & D) &&
                      128 == (192 & Y) &&
                      128 == (192 & q) &&
                      (X = ((15 & $) << 18) | ((63 & D) << 12) | ((63 & Y) << 6) | (63 & q)) >
                        65535 &&
                      X < 1114112 &&
                      (V = X);
              }
            null === V
              ? ((V = 65533), (W = 1))
              : V > 65535 &&
                ((V -= 65536), U.push(((V >>> 10) & 1023) | 55296), (V = 56320 | (1023 & V))),
              U.push(V),
              (R += W);
          }
          return (function (t) {
            var r = t.length;
            if (r <= d) return String.fromCharCode.apply(String, t);
            for (var g = '', U = 0; U < r; )
              g += String.fromCharCode.apply(String, t.slice(U, (U += d)));
            return g;
          })(U);
        }
        (r.kMaxLength = g),
          (i.TYPED_ARRAY_SUPPORT = (function () {
            try {
              var t = new Uint8Array(1);
              return (
                (t.__proto__ = {
                  __proto__: Uint8Array.prototype,
                  foo: function () {
                    return 42;
                  },
                }),
                42 === t.foo()
              );
            } catch (t) {
              return !1;
            }
          })()),
          i.TYPED_ARRAY_SUPPORT ||
            'undefined' == typeof console ||
            'function' != typeof console.error ||
            console.error(
              'This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
            ),
          Object.defineProperty(i.prototype, 'parent', {
            enumerable: !0,
            get: function () {
              if (i.isBuffer(this)) return this.buffer;
            },
          }),
          Object.defineProperty(i.prototype, 'offset', {
            enumerable: !0,
            get: function () {
              if (i.isBuffer(this)) return this.byteOffset;
            },
          }),
          'undefined' != typeof Symbol &&
            null != Symbol.species &&
            i[Symbol.species] === i &&
            Object.defineProperty(i, Symbol.species, {
              value: null,
              configurable: !0,
              enumerable: !1,
              writable: !1,
            }),
          (i.poolSize = 8192),
          (i.from = function (t, r, g) {
            return o(t, r, g);
          }),
          (i.prototype.__proto__ = Uint8Array.prototype),
          (i.__proto__ = Uint8Array),
          (i.alloc = function (t, r, g) {
            return (function (t, r, g) {
              return (
                f(t),
                t <= 0
                  ? n(t)
                  : void 0 !== r
                  ? 'string' == typeof g
                    ? n(t).fill(r, g)
                    : n(t).fill(r)
                  : n(t)
              );
            })(t, r, g);
          }),
          (i.allocUnsafe = function (t) {
            return u(t);
          }),
          (i.allocUnsafeSlow = function (t) {
            return u(t);
          }),
          (i.isBuffer = function (t) {
            return null != t && !0 === t._isBuffer && t !== i.prototype;
          }),
          (i.compare = function (t, r) {
            if (
              (j(t, Uint8Array) && (t = i.from(t, t.offset, t.byteLength)),
              j(r, Uint8Array) && (r = i.from(r, r.offset, r.byteLength)),
              !i.isBuffer(t) || !i.isBuffer(r))
            )
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
              );
            if (t === r) return 0;
            for (var g = t.length, d = r.length, U = 0, R = Math.min(g, d); U < R; ++U)
              if (t[U] !== r[U]) {
                (g = t[U]), (d = r[U]);
                break;
              }
            return g < d ? -1 : d < g ? 1 : 0;
          }),
          (i.isEncoding = function (t) {
            switch (String(t).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return !0;
              default:
                return !1;
            }
          }),
          (i.concat = function (t, r) {
            if (!Array.isArray(t))
              throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === t.length) return i.alloc(0);
            var g;
            if (void 0 === r) for (r = 0, g = 0; g < t.length; ++g) r += t[g].length;
            var d = i.allocUnsafe(r),
              U = 0;
            for (g = 0; g < t.length; ++g) {
              var R = t[g];
              if ((j(R, Uint8Array) && (R = i.from(R)), !i.isBuffer(R)))
                throw new TypeError('"list" argument must be an Array of Buffers');
              R.copy(d, U), (U += R.length);
            }
            return d;
          }),
          (i.byteLength = h),
          (i.prototype._isBuffer = !0),
          (i.prototype.swap16 = function () {
            var t = this.length;
            if (t % 2 != 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
            for (var r = 0; r < t; r += 2) c(this, r, r + 1);
            return this;
          }),
          (i.prototype.swap32 = function () {
            var t = this.length;
            if (t % 4 != 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
            for (var r = 0; r < t; r += 4) c(this, r, r + 3), c(this, r + 1, r + 2);
            return this;
          }),
          (i.prototype.swap64 = function () {
            var t = this.length;
            if (t % 8 != 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
            for (var r = 0; r < t; r += 8)
              c(this, r, r + 7),
                c(this, r + 1, r + 6),
                c(this, r + 2, r + 5),
                c(this, r + 3, r + 4);
            return this;
          }),
          (i.prototype.toString = function () {
            var t = this.length;
            return 0 === t
              ? ''
              : 0 === arguments.length
              ? A(this, 0, t)
              : function (t, r, g) {
                  var d = !1;
                  if (((void 0 === r || r < 0) && (r = 0), r > this.length)) return '';
                  if (((void 0 === g || g > this.length) && (g = this.length), g <= 0)) return '';
                  if ((g >>>= 0) <= (r >>>= 0)) return '';
                  for (t || (t = 'utf8'); ; )
                    switch (t) {
                      case 'hex':
                        return M(this, r, g);
                      case 'utf8':
                      case 'utf-8':
                        return A(this, r, g);
                      case 'ascii':
                        return I(this, r, g);
                      case 'latin1':
                      case 'binary':
                        return k(this, r, g);
                      case 'base64':
                        return B(this, r, g);
                      case 'ucs2':
                      case 'ucs-2':
                      case 'utf16le':
                      case 'utf-16le':
                        return S(this, r, g);
                      default:
                        if (d) throw new TypeError('Unknown encoding: ' + t);
                        (t = (t + '').toLowerCase()), (d = !0);
                    }
                }.apply(this, arguments);
          }),
          (i.prototype.toLocaleString = i.prototype.toString),
          (i.prototype.equals = function (t) {
            if (!i.isBuffer(t)) throw new TypeError('Argument must be a Buffer');
            return this === t || 0 === i.compare(this, t);
          }),
          (i.prototype.inspect = function () {
            var t = '',
              g = r.INSPECT_MAX_BYTES;
            return (
              (t = this.toString('hex', 0, g)
                .replace(/(.{2})/g, '$1 ')
                .trim()),
              this.length > g && (t += ' ... '),
              '<Buffer ' + t + '>'
            );
          }),
          (i.prototype.compare = function (t, r, g, d, U) {
            if ((j(t, Uint8Array) && (t = i.from(t, t.offset, t.byteLength)), !i.isBuffer(t)))
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                  typeof t
              );
            if (
              (void 0 === r && (r = 0),
              void 0 === g && (g = t ? t.length : 0),
              void 0 === d && (d = 0),
              void 0 === U && (U = this.length),
              r < 0 || g > t.length || d < 0 || U > this.length)
            )
              throw new RangeError('out of range index');
            if (d >= U && r >= g) return 0;
            if (d >= U) return -1;
            if (r >= g) return 1;
            if (this === t) return 0;
            for (
              var R = (U >>>= 0) - (d >>>= 0),
                D = (g >>>= 0) - (r >>>= 0),
                Y = Math.min(R, D),
                q = this.slice(d, U),
                X = t.slice(r, g),
                $ = 0;
              $ < Y;
              ++$
            )
              if (q[$] !== X[$]) {
                (R = q[$]), (D = X[$]);
                break;
              }
            return R < D ? -1 : D < R ? 1 : 0;
          }),
          (i.prototype.includes = function (t, r, g) {
            return -1 !== this.indexOf(t, r, g);
          }),
          (i.prototype.indexOf = function (t, r, g) {
            return l(this, t, r, g, !0);
          }),
          (i.prototype.lastIndexOf = function (t, r, g) {
            return l(this, t, r, g, !1);
          }),
          (i.prototype.write = function (t, r, g, d) {
            if (void 0 === r) (d = 'utf8'), (g = this.length), (r = 0);
            else if (void 0 === g && 'string' == typeof r) (d = r), (g = this.length), (r = 0);
            else {
              if (!isFinite(r))
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                );
              (r >>>= 0),
                isFinite(g) ? ((g >>>= 0), void 0 === d && (d = 'utf8')) : ((d = g), (g = void 0));
            }
            var U = this.length - r;
            if (
              ((void 0 === g || g > U) && (g = U),
              (t.length > 0 && (g < 0 || r < 0)) || r > this.length)
            )
              throw new RangeError('Attempt to write outside buffer bounds');
            d || (d = 'utf8');
            for (var R = !1; ; )
              switch (d) {
                case 'hex':
                  return y(this, t, r, g);
                case 'utf8':
                case 'utf-8':
                  return w(this, t, r, g);
                case 'ascii':
                  return b(this, t, r, g);
                case 'latin1':
                case 'binary':
                  return v(this, t, r, g);
                case 'base64':
                  return E(this, t, r, g);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return m(this, t, r, g);
                default:
                  if (R) throw new TypeError('Unknown encoding: ' + d);
                  (d = ('' + d).toLowerCase()), (R = !0);
              }
          }),
          (i.prototype.toJSON = function () {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          });
        var d = 4096;
        function I(t, r, g) {
          var d = '';
          g = Math.min(t.length, g);
          for (var U = r; U < g; ++U) d += String.fromCharCode(127 & t[U]);
          return d;
        }
        function k(t, r, g) {
          var d = '';
          g = Math.min(t.length, g);
          for (var U = r; U < g; ++U) d += String.fromCharCode(t[U]);
          return d;
        }
        function M(t, r, g) {
          var d = t.length;
          (!r || r < 0) && (r = 0), (!g || g < 0 || g > d) && (g = d);
          for (var U = '', R = r; R < g; ++R) U += O(t[R]);
          return U;
        }
        function S(t, r, g) {
          for (var d = t.slice(r, g), U = '', R = 0; R < d.length; R += 2)
            U += String.fromCharCode(d[R] + 256 * d[R + 1]);
          return U;
        }
        function T(t, r, g) {
          if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
          if (t + r > g) throw new RangeError('Trying to access beyond buffer length');
        }
        function _(t, r, g, d, U, R) {
          if (!i.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
          if (r > U || r < R) throw new RangeError('"value" argument is out of bounds');
          if (g + d > t.length) throw new RangeError('Index out of range');
        }
        function L(t, r, g, d, U, R) {
          if (g + d > t.length) throw new RangeError('Index out of range');
          if (g < 0) throw new RangeError('Index out of range');
        }
        function x(t, r, g, d, U) {
          return (r = +r), (g >>>= 0), U || L(t, 0, g, 4), d_write(t, r, g, d, 23, 4), g + 4;
        }
        function C(t, r, g, d, U) {
          return (r = +r), (g >>>= 0), U || L(t, 0, g, 8), d_write(t, r, g, d, 52, 8), g + 8;
        }
        (i.prototype.slice = function (t, r) {
          var g = this.length;
          (t = ~~t) < 0 ? (t += g) < 0 && (t = 0) : t > g && (t = g),
            (r = void 0 === r ? g : ~~r) < 0 ? (r += g) < 0 && (r = 0) : r > g && (r = g),
            r < t && (r = t);
          var d = this.subarray(t, r);
          return (d.__proto__ = i.prototype), d;
        }),
          (i.prototype.readUIntLE = function (t, r, g) {
            (t >>>= 0), (r >>>= 0), g || T(t, r, this.length);
            for (var d = this[t], U = 1, R = 0; ++R < r && (U *= 256); ) d += this[t + R] * U;
            return d;
          }),
          (i.prototype.readUIntBE = function (t, r, g) {
            (t >>>= 0), (r >>>= 0), g || T(t, r, this.length);
            for (var d = this[t + --r], U = 1; r > 0 && (U *= 256); ) d += this[t + --r] * U;
            return d;
          }),
          (i.prototype.readUInt8 = function (t, r) {
            return (t >>>= 0), r || T(t, 1, this.length), this[t];
          }),
          (i.prototype.readUInt16LE = function (t, r) {
            return (t >>>= 0), r || T(t, 2, this.length), this[t] | (this[t + 1] << 8);
          }),
          (i.prototype.readUInt16BE = function (t, r) {
            return (t >>>= 0), r || T(t, 2, this.length), (this[t] << 8) | this[t + 1];
          }),
          (i.prototype.readUInt32LE = function (t, r) {
            return (
              (t >>>= 0),
              r || T(t, 4, this.length),
              (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) + 16777216 * this[t + 3]
            );
          }),
          (i.prototype.readUInt32BE = function (t, r) {
            return (
              (t >>>= 0),
              r || T(t, 4, this.length),
              16777216 * this[t] + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
            );
          }),
          (i.prototype.readIntLE = function (t, r, g) {
            (t >>>= 0), (r >>>= 0), g || T(t, r, this.length);
            for (var d = this[t], U = 1, R = 0; ++R < r && (U *= 256); ) d += this[t + R] * U;
            return d >= (U *= 128) && (d -= Math.pow(2, 8 * r)), d;
          }),
          (i.prototype.readIntBE = function (t, r, g) {
            (t >>>= 0), (r >>>= 0), g || T(t, r, this.length);
            for (var d = r, U = 1, R = this[t + --d]; d > 0 && (U *= 256); ) R += this[t + --d] * U;
            return R >= (U *= 128) && (R -= Math.pow(2, 8 * r)), R;
          }),
          (i.prototype.readInt8 = function (t, r) {
            return (
              (t >>>= 0),
              r || T(t, 1, this.length),
              128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            );
          }),
          (i.prototype.readInt16LE = function (t, r) {
            (t >>>= 0), r || T(t, 2, this.length);
            var g = this[t] | (this[t + 1] << 8);
            return 32768 & g ? 4294901760 | g : g;
          }),
          (i.prototype.readInt16BE = function (t, r) {
            (t >>>= 0), r || T(t, 2, this.length);
            var g = this[t + 1] | (this[t] << 8);
            return 32768 & g ? 4294901760 | g : g;
          }),
          (i.prototype.readInt32LE = function (t, r) {
            return (
              (t >>>= 0),
              r || T(t, 4, this.length),
              this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24)
            );
          }),
          (i.prototype.readInt32BE = function (t, r) {
            return (
              (t >>>= 0),
              r || T(t, 4, this.length),
              (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]
            );
          }),
          (i.prototype.readFloatLE = function (t, r) {
            return (t >>>= 0), r || T(t, 4, this.length), d_read(this, t, !0, 23, 4);
          }),
          (i.prototype.readFloatBE = function (t, r) {
            return (t >>>= 0), r || T(t, 4, this.length), d_read(this, t, !1, 23, 4);
          }),
          (i.prototype.readDoubleLE = function (t, r) {
            return (t >>>= 0), r || T(t, 8, this.length), d_read(this, t, !0, 52, 8);
          }),
          (i.prototype.readDoubleBE = function (t, r) {
            return (t >>>= 0), r || T(t, 8, this.length), d_read(this, t, !1, 52, 8);
          }),
          (i.prototype.writeUIntLE = function (t, r, g, d) {
            (t = +t), (r >>>= 0), (g >>>= 0), d || _(this, t, r, g, Math.pow(2, 8 * g) - 1, 0);
            var U = 1,
              R = 0;
            for (this[r] = 255 & t; ++R < g && (U *= 256); ) this[r + R] = (t / U) & 255;
            return r + g;
          }),
          (i.prototype.writeUIntBE = function (t, r, g, d) {
            (t = +t), (r >>>= 0), (g >>>= 0), d || _(this, t, r, g, Math.pow(2, 8 * g) - 1, 0);
            var U = g - 1,
              R = 1;
            for (this[r + U] = 255 & t; --U >= 0 && (R *= 256); ) this[r + U] = (t / R) & 255;
            return r + g;
          }),
          (i.prototype.writeUInt8 = function (t, r, g) {
            return (t = +t), (r >>>= 0), g || _(this, t, r, 1, 255, 0), (this[r] = 255 & t), r + 1;
          }),
          (i.prototype.writeUInt16LE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 2, 65535, 0),
              (this[r] = 255 & t),
              (this[r + 1] = t >>> 8),
              r + 2
            );
          }),
          (i.prototype.writeUInt16BE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 2, 65535, 0),
              (this[r] = t >>> 8),
              (this[r + 1] = 255 & t),
              r + 2
            );
          }),
          (i.prototype.writeUInt32LE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 4, 4294967295, 0),
              (this[r + 3] = t >>> 24),
              (this[r + 2] = t >>> 16),
              (this[r + 1] = t >>> 8),
              (this[r] = 255 & t),
              r + 4
            );
          }),
          (i.prototype.writeUInt32BE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 4, 4294967295, 0),
              (this[r] = t >>> 24),
              (this[r + 1] = t >>> 16),
              (this[r + 2] = t >>> 8),
              (this[r + 3] = 255 & t),
              r + 4
            );
          }),
          (i.prototype.writeIntLE = function (t, r, g, d) {
            if (((t = +t), (r >>>= 0), !d)) {
              var U = Math.pow(2, 8 * g - 1);
              _(this, t, r, g, U - 1, -U);
            }
            var R = 0,
              D = 1,
              Y = 0;
            for (this[r] = 255 & t; ++R < g && (D *= 256); )
              t < 0 && 0 === Y && 0 !== this[r + R - 1] && (Y = 1),
                (this[r + R] = (((t / D) >> 0) - Y) & 255);
            return r + g;
          }),
          (i.prototype.writeIntBE = function (t, r, g, d) {
            if (((t = +t), (r >>>= 0), !d)) {
              var U = Math.pow(2, 8 * g - 1);
              _(this, t, r, g, U - 1, -U);
            }
            var R = g - 1,
              D = 1,
              Y = 0;
            for (this[r + R] = 255 & t; --R >= 0 && (D *= 256); )
              t < 0 && 0 === Y && 0 !== this[r + R + 1] && (Y = 1),
                (this[r + R] = (((t / D) >> 0) - Y) & 255);
            return r + g;
          }),
          (i.prototype.writeInt8 = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 1, 127, -128),
              t < 0 && (t = 255 + t + 1),
              (this[r] = 255 & t),
              r + 1
            );
          }),
          (i.prototype.writeInt16LE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 2, 32767, -32768),
              (this[r] = 255 & t),
              (this[r + 1] = t >>> 8),
              r + 2
            );
          }),
          (i.prototype.writeInt16BE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 2, 32767, -32768),
              (this[r] = t >>> 8),
              (this[r + 1] = 255 & t),
              r + 2
            );
          }),
          (i.prototype.writeInt32LE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 4, 2147483647, -2147483648),
              (this[r] = 255 & t),
              (this[r + 1] = t >>> 8),
              (this[r + 2] = t >>> 16),
              (this[r + 3] = t >>> 24),
              r + 4
            );
          }),
          (i.prototype.writeInt32BE = function (t, r, g) {
            return (
              (t = +t),
              (r >>>= 0),
              g || _(this, t, r, 4, 2147483647, -2147483648),
              t < 0 && (t = 4294967295 + t + 1),
              (this[r] = t >>> 24),
              (this[r + 1] = t >>> 16),
              (this[r + 2] = t >>> 8),
              (this[r + 3] = 255 & t),
              r + 4
            );
          }),
          (i.prototype.writeFloatLE = function (t, r, g) {
            return x(this, t, r, !0, g);
          }),
          (i.prototype.writeFloatBE = function (t, r, g) {
            return x(this, t, r, !1, g);
          }),
          (i.prototype.writeDoubleLE = function (t, r, g) {
            return C(this, t, r, !0, g);
          }),
          (i.prototype.writeDoubleBE = function (t, r, g) {
            return C(this, t, r, !1, g);
          }),
          (i.prototype.copy = function (t, r, g, d) {
            if (!i.isBuffer(t)) throw new TypeError('argument should be a Buffer');
            if (
              (g || (g = 0),
              d || 0 === d || (d = this.length),
              r >= t.length && (r = t.length),
              r || (r = 0),
              d > 0 && d < g && (d = g),
              d === g)
            )
              return 0;
            if (0 === t.length || 0 === this.length) return 0;
            if (r < 0) throw new RangeError('targetStart out of bounds');
            if (g < 0 || g >= this.length) throw new RangeError('Index out of range');
            if (d < 0) throw new RangeError('sourceEnd out of bounds');
            d > this.length && (d = this.length), t.length - r < d - g && (d = t.length - r + g);
            var U = d - g;
            if (this === t && 'function' == typeof Uint8Array.prototype.copyWithin)
              this.copyWithin(r, g, d);
            else if (this === t && g < r && r < d)
              for (var R = U - 1; R >= 0; --R) t[R + r] = this[R + g];
            else Uint8Array.prototype.set.call(t, this.subarray(g, d), r);
            return U;
          }),
          (i.prototype.fill = function (t, r, g, d) {
            if ('string' == typeof t) {
              if (
                ('string' == typeof r
                  ? ((d = r), (r = 0), (g = this.length))
                  : 'string' == typeof g && ((d = g), (g = this.length)),
                void 0 !== d && 'string' != typeof d)
              )
                throw new TypeError('encoding must be a string');
              if ('string' == typeof d && !i.isEncoding(d))
                throw new TypeError('Unknown encoding: ' + d);
              if (1 === t.length) {
                var U = t.charCodeAt(0);
                (('utf8' === d && U < 128) || 'latin1' === d) && (t = U);
              }
            } else 'number' == typeof t && (t &= 255);
            if (r < 0 || this.length < r || this.length < g)
              throw new RangeError('Out of range index');
            if (g <= r) return this;
            var R;
            if (
              ((r >>>= 0),
              (g = void 0 === g ? this.length : g >>> 0),
              t || (t = 0),
              'number' == typeof t)
            )
              for (R = r; R < g; ++R) this[R] = t;
            else {
              var D = i.isBuffer(t) ? t : i.from(t, d),
                Y = D.length;
              if (0 === Y)
                throw new TypeError('The value "' + t + '" is invalid for argument "value"');
              for (R = 0; R < g - r; ++R) this[R + r] = D[R % Y];
            }
            return this;
          });
        var U = /[^+\/0-9A-Za-z-_]/g;
        function O(t) {
          return t < 16 ? '0' + t.toString(16) : t.toString(16);
        }
        function N(t, r) {
          var g;
          r = r || 1 / 0;
          for (var d = t.length, U = null, R = [], D = 0; D < d; ++D) {
            if ((g = t.charCodeAt(D)) > 55295 && g < 57344) {
              if (!U) {
                if (g > 56319) {
                  (r -= 3) > -1 && R.push(239, 191, 189);
                  continue;
                }
                if (D + 1 === d) {
                  (r -= 3) > -1 && R.push(239, 191, 189);
                  continue;
                }
                U = g;
                continue;
              }
              if (g < 56320) {
                (r -= 3) > -1 && R.push(239, 191, 189), (U = g);
                continue;
              }
              g = 65536 + (((U - 55296) << 10) | (g - 56320));
            } else U && (r -= 3) > -1 && R.push(239, 191, 189);
            if (((U = null), g < 128)) {
              if ((r -= 1) < 0) break;
              R.push(g);
            } else if (g < 2048) {
              if ((r -= 2) < 0) break;
              R.push((g >> 6) | 192, (63 & g) | 128);
            } else if (g < 65536) {
              if ((r -= 3) < 0) break;
              R.push((g >> 12) | 224, ((g >> 6) & 63) | 128, (63 & g) | 128);
            } else {
              if (!(g < 1114112)) throw new Error('Invalid code point');
              if ((r -= 4) < 0) break;
              R.push(
                (g >> 18) | 240,
                ((g >> 12) & 63) | 128,
                ((g >> 6) & 63) | 128,
                (63 & g) | 128
              );
            }
          }
          return R;
        }
        function P(t) {
          return g_toByteArray(
            (function (t) {
              if ((t = (t = t.split('=')[0]).trim().replace(U, '')).length < 2) return '';
              for (; t.length % 4 != 0; ) t += '=';
              return t;
            })(t)
          );
        }
        function z(t, r, g, d) {
          for (var U = 0; U < d && !(U + g >= r.length || U >= t.length); ++U) r[U + g] = t[U];
          return U;
        }
        function j(t, r) {
          return (
            t instanceof r ||
            (null != t &&
              null != t.constructor &&
              null != t.constructor.name &&
              t.constructor.name === r.name)
          );
        }
        function F(t) {
          return t != t;
        }
      })(
        (q = {
          exports: {},
        }),
        q.exports
      ),
      q.exports);
  X.Buffer, X.SlowBuffer, X.INSPECT_MAX_BYTES, X.kMaxLength;
  const $ = X.Buffer;
  var V = {
      initialize: (t, g) => {
        if ('number' != typeof t || !0 === Number.isNaN(t))
          throw Error('@initialize : expecting "tempBufferLength" to be a number.');
        if (t < 1)
          throw Error('@initialize : expecting "tempBufferLength" to be greater than zero.');
        if (void 0 !== g) {
          if ('function' != typeof g)
            throw Error('@initialize : expecting "logFunction" to be a function.');
          g(
            `@initialize : setting buffer limit to ${((t, g) => {
              if (!Number.isFinite(t))
                throw new TypeError(`Expected a finite number, got ${typeof t}: ${t}`);
              if ((g = Object.assign({}, g)).signed && 0 === t) return ' 0 B';
              const d = t < 0,
                U = d ? '-' : g.signed ? '+' : '';
              if ((d && (t = -t), t < 1)) return U + e(t, g.locale) + ' B';
              const R = Math.min(Math.floor(Math.log10(t) / 3), r.length - 1);
              return (
                (t = Number((t / Math.pow(1e3, R)).toPrecision(3))), U + e(t, g.locale) + ' ' + r[R]
              );
            })(t)}`
          );
        }
        const d = {};
        let U = !1,
          R = -33;
        const D = $.allocUnsafe(t).fill(0);
        let Y = -1;
        const s = t => {
          let r = 0;
          switch (typeof t) {
            case 'string':
              if ((r = $.byteLength(t)) < 32) {
                r = 0;
                for (let g = 0, d = 0, U = t.length; g < U; g += 1)
                  (d = t.charCodeAt(g)) < 128
                    ? (r += 1)
                    : d < 1280
                    ? (r += 2)
                    : d < 55296 || d >= 57344
                    ? (r += 3)
                    : ((g += 1), (r += 4));
                D[(Y += 1)] = 160 | r;
                for (let r = 0, g = 0, d = t.length; r < d; r += 1)
                  (g = t.charCodeAt(r)) < 128
                    ? (D[(Y += 1)] = g)
                    : g < 1280
                    ? ((D[(Y += 1)] = 192 | (g >> 6)), (D[(Y += 1)] = 128 | (63 & g)))
                    : g < 55296 || g >= 57344
                    ? ((D[(Y += 1)] = 224 | (g >> 12)),
                      (D[(Y += 1)] = 128 | ((g >> 6) & 63)),
                      (D[(Y += 1)] = 128 | (63 & g)))
                    : ((r += 1),
                      (g = 65536 + (((1023 & g) << 10) | (1023 & t.charCodeAt(r)))),
                      (D[(Y += 1)] = 240 | (g >> 18)),
                      (D[(Y += 1)] = 128 | ((g >> 12) & 63)),
                      (D[(Y += 1)] = 128 | ((g >> 6) & 63)),
                      (D[(Y += 1)] = 128 | (63 & g)));
              } else if (r < 256)
                (D[(Y += 1)] = 217),
                  (D[(Y += 1)] = r),
                  D.write(t, (Y += 1), r, 'utf8'),
                  (Y += r - 1);
              else if (r < 65536)
                (D[(Y += 1)] = 218),
                  (D[(Y += 1)] = r >> 8),
                  (D[(Y += 1)] = r),
                  D.write(t, (Y += 1), r, 'utf8'),
                  (Y += r - 1);
              else {
                if (!(r < 4294967296))
                  throw Error(
                    '@internalEncode : Max supported string length (4294967296) exceeded, encoding failure.'
                  );
                (D[(Y += 1)] = 219),
                  (D[(Y += 1)] = r >> 24),
                  (D[(Y += 1)] = r >> 16),
                  (D[(Y += 1)] = r >> 8),
                  (D[(Y += 1)] = r),
                  D.write(t, (Y += 1), r, 'utf8'),
                  (Y += r - 1);
              }
              break;
            case 'number':
              if (!1 === Number.isFinite(t)) {
                if (!0 === Number.isNaN(t)) {
                  (D[(Y += 1)] = 212), (D[(Y += 1)] = 0), (D[(Y += 1)] = 1);
                  break;
                }
                if (t === 1 / 0) {
                  (D[(Y += 1)] = 212), (D[(Y += 1)] = 0), (D[(Y += 1)] = 2);
                  break;
                }
                if (t === -1 / 0) {
                  (D[(Y += 1)] = 212), (D[(Y += 1)] = 0), (D[(Y += 1)] = 3);
                  break;
                }
              }
              if (Math.floor(t) !== t) {
                if (Math.fround(t) === t) {
                  (D[(Y += 1)] = 202), D.writeFloatBE(t, (Y += 1)), (Y += 3);
                  break;
                }
                (D[(Y += 1)] = 203), D.writeDoubleBE(t, (Y += 1)), (Y += 7);
                break;
              }
              if (t >= 0) {
                if (t < 128) {
                  D[(Y += 1)] = t;
                  break;
                }
                if (t < 256) {
                  (D[(Y += 1)] = 204), (D[(Y += 1)] = t);
                  break;
                }
                if (t < 65536) {
                  (D[(Y += 1)] = 205), (D[(Y += 1)] = t >> 8), (D[(Y += 1)] = t);
                  break;
                }
                if (t < 4294967296) {
                  (D[(Y += 1)] = 206),
                    (D[(Y += 1)] = t >> 24),
                    (D[(Y += 1)] = t >> 16),
                    (D[(Y += 1)] = t >> 8),
                    (D[(Y += 1)] = t);
                  break;
                }
                let r = (t / Math.pow(2, 32)) >> 0,
                  g = t >>> 0;
                (D[(Y += 1)] = 207),
                  (D[(Y += 1)] = r >> 24),
                  (D[(Y += 1)] = r >> 16),
                  (D[(Y += 1)] = r >> 8),
                  (D[(Y += 1)] = r),
                  (D[(Y += 1)] = g >> 24),
                  (D[(Y += 1)] = g >> 16),
                  (D[(Y += 1)] = g >> 8),
                  (D[(Y += 1)] = g);
              } else {
                if (t >= -32) {
                  D[(Y += 1)] = t;
                  break;
                }
                if (t >= -128) {
                  (D[(Y += 1)] = 208), (D[(Y += 1)] = t);
                  break;
                }
                if (t >= -12800) {
                  (D[(Y += 1)] = 209), (D[(Y += 1)] = t >> 8), (D[(Y += 1)] = t);
                  break;
                }
                if (t >= -128e6) {
                  (D[(Y += 1)] = 210),
                    (D[(Y += 1)] = t >> 24),
                    (D[(Y += 1)] = t >> 16),
                    (D[(Y += 1)] = t >> 8),
                    (D[(Y += 1)] = t);
                  break;
                }
                let r = Math.floor(t / Math.pow(2, 32)),
                  g = t >>> 0;
                (D[(Y += 1)] = 211),
                  (D[(Y += 1)] = r >> 24),
                  (D[(Y += 1)] = r >> 16),
                  (D[(Y += 1)] = r >> 8),
                  (D[(Y += 1)] = r),
                  (D[(Y += 1)] = g >> 24),
                  (D[(Y += 1)] = g >> 16),
                  (D[(Y += 1)] = g >> 8),
                  (D[(Y += 1)] = g);
              }
              break;
            case 'object':
              if (null === t) {
                D[(Y += 1)] = 192;
                break;
              }
              if (!0 === Array.isArray(t)) {
                if ((r = t.length) < 16) D[(Y += 1)] = 144 | r;
                else if (r < 65536) (D[(Y += 1)] = 220), (D[(Y += 1)] = r >> 8), (D[(Y += 1)] = r);
                else {
                  if (!(r < 4294967296)) throw new Error('@internalEncode : Array too large');
                  (D[(Y += 1)] = 221),
                    (D[(Y += 1)] = r >> 24),
                    (D[(Y += 1)] = r >> 16),
                    (D[(Y += 1)] = r >> 8),
                    (D[(Y += 1)] = r);
                }
                for (let g = 0; g < r; g += 1) s(t[g]);
                break;
              }
              if (
                (t instanceof ArrayBuffer && (t = $.from(t)),
                t instanceof $ == 0 &&
                  (t instanceof Int8Array ||
                    t instanceof Int16Array ||
                    t instanceof Int32Array ||
                    t instanceof Uint8Array ||
                    t instanceof Uint8ClampedArray ||
                    t instanceof Uint16Array ||
                    t instanceof Uint32Array ||
                    t instanceof Float32Array ||
                    t instanceof Float64Array))
              ) {
                let r = $.from(t.buffer);
                t.byteLength !== t.buffer.byteLength &&
                  (r = r.slice(t.byteOffset, t.byteOffset + t.byteLength)),
                  (t = r);
              }
              if (t instanceof $) {
                if ((r = t.length) < 256)
                  if (((D[(Y += 1)] = 196), (D[(Y += 1)] = r), r > 32))
                    t.copy(D, (Y += 1), 0, r), (Y += r - 1);
                  else for (let g = 0; g < r; g++) D[(Y += 1)] = t[g];
                else if (r < 65536)
                  (D[(Y += 1)] = 197),
                    (D[(Y += 1)] = r >> 8),
                    (D[(Y += 1)] = r),
                    t.copy(D, (Y += 1), 0, r),
                    (Y += r - 1);
                else {
                  if (!(r < 4294967296))
                    throw Error(
                      '@internalEncode : Max supported buffer length (4294967296) exceeded, encoding failure.'
                    );
                  (D[(Y += 1)] = 198),
                    (D[(Y += 1)] = r >> 24),
                    (D[(Y += 1)] = r >> 16),
                    (D[(Y += 1)] = r >> 8),
                    (D[(Y += 1)] = r),
                    t.copy(D, (Y += 1), 0, r),
                    (Y += r - 1);
                }
                break;
              }
              {
                let g = Object.keys(t);
                if ((r = g.length) < 16) D[(Y += 1)] = 128 | r;
                else if (r < 65536) (D[(Y += 1)] = 222), (D[(Y += 1)] = r >> 8), (D[(Y += 1)] = r);
                else {
                  if (!(r < 4294967296)) throw new Error('@internalEncode : Object too large');
                  (D[(Y += 1)] = 223),
                    (D[(Y += 1)] = r >> 24),
                    (D[(Y += 1)] = r >> 16),
                    (D[(Y += 1)] = r >> 8),
                    (D[(Y += 1)] = r);
                }
                if (!0 === U) for (let U = 0; U < r; U += 1) s(d[g[U]] || g[U]), s(t[g[U]]);
                else for (let d = 0; d < r; d += 1) s(g[d]), s(t[g[d]]);
              }
              break;
            default:
              switch (t) {
                case !0:
                  D[(Y += 1)] = 195;
                  break;
                case !1:
                  D[(Y += 1)] = 194;
                  break;
                case void 0:
                  (D[(Y += 1)] = 212), (D[(Y += 1)] = 0), (D[(Y += 1)] = 0);
                  break;
                default:
                  throw Error('@internalEncode : Error encoding value.');
              }
          }
        };
        let q,
          X = 0;
        const l = () => {
          let t, r;
          if (q[X] < 192) {
            if (q[X] < 128) return (t = q[X]), (X += 1), t;
            if (q[X] < 144) {
              if (((r = 31 & q[X]), (t = {}), (X += 1), !0 === U))
                for (let g, U = 0; U < r; U++) (g = l()), (t[d[g] || g] = l());
              else for (let g = 0; g < r; g++) t[l()] = l();
              return t;
            }
            if (q[X] < 160) {
              (r = 15 & q[X]), (X += 1), (t = new Array(r));
              for (let g = 0; g < r; g += 1) t[g] = l();
              return t;
            }
            return (r = 31 & q[X]), (X += 1), (t = q.toString('utf8', X, X + r)), (X += r), t;
          }
          if (q[X] > 223) return (t = -1 * (255 - q[X] + 1)), (X += 1), t;
          switch (q[X]) {
            case 202:
              return (t = q.readFloatBE((X += 1))), (X += 4), t;
            case 203:
              return (t = q.readDoubleBE((X += 1))), (X += 8), t;
            case 204:
              return (t = q.readUInt8((X += 1))), (X += 1), t;
            case 205:
              return (t = q.readUInt16BE((X += 1))), (X += 2), t;
            case 206:
              return (t = q.readUInt32BE((X += 1))), (X += 4), t;
            case 207:
              return (
                (t = q.readUInt32BE((X += 1)) * Math.pow(2, 32) + q.readUInt32BE((X += 4))),
                (X += 4),
                t
              );
            case 208:
              return (t = q.readInt8((X += 1))), (X += 1), t;
            case 209:
              return (t = q.readInt16BE((X += 1))), (X += 2), t;
            case 210:
              return (t = q.readInt32BE((X += 1))), (X += 4), t;
            case 211:
              return (
                (t = q.readInt32BE((X += 1)) * Math.pow(2, 32) + q.readUInt32BE((X += 4))),
                (X += 4),
                t
              );
            case 217:
              return (
                (r = q.readUInt8((X += 1))),
                (X += 1),
                (t = q.toString('utf8', X, X + r)),
                (X += r),
                t
              );
            case 218:
              return (
                (r = q.readUInt16BE((X += 1))),
                (X += 2),
                (t = q.toString('utf8', X, X + r)),
                (X += r),
                t
              );
            case 219:
              return (
                (r = q.readUInt32BE((X += 1))),
                (X += 4),
                (t = q.toString('utf8', X, X + r)),
                (X += r),
                t
              );
            case 212:
              if (0 === q.readInt8((X += 1)))
                switch (q.readInt8((X += 1))) {
                  case 0:
                    return void (X += 1);
                  case 1:
                    return (X += 1), NaN;
                  case 2:
                    return (X += 1), 1 / 0;
                  case 3:
                    return (X += 1), -1 / 0;
                }
              break;
            case 192:
              return (X += 1), null;
            case 194:
              return (X += 1), !1;
            case 195:
              return (X += 1), !0;
            case 220:
              (r = q.readUInt16BE((X += 1))), (X += 2), (t = new Array(r));
              for (let g = 0; g < r; g += 1) t[g] = l();
              return t;
            case 221:
              (r = q.readUInt32BE((X += 1))), (X += 4), (t = new Array(r));
              for (let g = 0; g < r; g += 1) t[g] = l();
              return t;
            case 222:
              if (((r = q.readUInt16BE((X += 1))), (t = {}), (X += 2), !0 === U))
                for (let g, U = 0; U < r; U++) (g = l()), (t[d[g] || g] = l());
              else for (let g = 0; g < r; g++) t[l()] = l();
              return t;
            case 223:
              if (((r = q.readUInt32BE((X += 1))), (t = {}), (X += 4), !0 === U))
                for (let g, U = 0; U < r; U++) (g = l()), (t[d[g] || g] = l());
              else for (let g = 0; g < r; g++) t[l()] = l();
              return t;
            case 196:
              return (r = q.readUInt8((X += 1))), (X += 1), (t = q.slice(X, X + r)), (X += r), t;
            case 197:
              return (r = q.readUInt16BE((X += 1))), (X += 2), (t = q.slice(X, X + r)), (X += r), t;
            case 198:
              return (r = q.readUInt32BE((X += 1))), (X += 4), (t = q.slice(X, X + r)), (X += r), t;
          }
          throw Error('@internalDecode : Error decoding value.');
        };
        return {
          encode: t => {
            (Y = -1), s(t);
            const r = $.allocUnsafe(Y + 1).fill(0);
            return D.copy(r, 0, 0, Y + 1), r;
          },
          decode: t => {
            (q = t), (X = 0);
            const r = l();
            return (q = void 0), r;
          },
          register: (...t) => {
            !1 === U && (U = !0);
            for (let r = 0, g = t.length; r < g; r += 1) (d[(R += 1)] = t[r]), (d[t[r]] = R);
          },
        };
      },
      Buffer: $,
    },
    W = V.initialize,
    Z = V.Buffer;
  (t.default = V),
    (t.initialize = W),
    (t.Buffer = Z),
    Object.defineProperty(t, '__esModule', {
      value: !0,
    });
});
var Player = pc.createScript('player');
Player.attributes.add('playerId', {
  type: 'number',
  default: -1,
}),
  Player.attributes.add('username', {
    type: 'string',
    default: 'none',
  }),
  Player.attributes.add('team', {
    type: 'string',
    default: 'none',
  }),
  Player.attributes.add('characterName', {
    type: 'string',
    default: 'Lilium',
  }),
  Player.attributes.add('characterHolder', {
    type: 'entity',
  }),
  Player.attributes.add('characterEntity', {
    type: 'entity',
  }),
  Player.attributes.add('gliderEntity', {
    type: 'entity',
  }),
  Player.attributes.add('characterCamera', {
    type: 'entity',
  }),
  Player.attributes.add('characterCameraHolder', {
    type: 'entity',
  }),
  Player.attributes.add('characterArms', {
    type: 'entity',
  }),
  Player.attributes.add('characterArmLeft', {
    type: 'entity',
  }),
  Player.attributes.add('characterArmRight', {
    type: 'entity',
  }),
  Player.attributes.add('raycastEntity', {
    type: 'entity',
  }),
  Player.attributes.add('sex', {
    type: 'string',
    default: 'Female',
  }),
  Player.attributes.add('lowExposure', {
    type: 'number',
    default: 4,
  }),
  Player.attributes.add('weapons', {
    type: 'string',
    array: !0,
  }),
  Player.attributes.add('danceName', {
    type: 'string',
    default: 'Techno',
  }),
  (Player.prototype.initialize = function () {
    (this.currentDate = Date.now()),
      (this.lastPositionUpdate = Date.now()),
      (this.lastCircularMenu = Date.now() - 5e3),
      (this.lastWeaponChange = Date.now()),
      (this.isGliding = !1),
      (this.lastGlidingTime = Date.now()),
      (this.lastFlowJump = Date.now()),
      (this.leftSpawnPoint = !1),
      (this.spawnPosition = new pc.Vec3(0, 0, 0)),
      (this.isEmotePlaying = !1),
      (this.emoteTimeout = !1),
      (this.emoteReminder = !1),
      (this.allowEmoteCancelation = !1),
      (this.isMapLoaded = !1),
      (this.lastWeapon = 'Scar'),
      (this.killCount = 0),
      (this.armsLoaded = 0),
      (this.canBuy = !1),
      (this.isCircularMenuActive = !1),
      (this.animation = {
        lookX: 0,
        cameraShake: !1,
        cameraFov: !1,
      }),
      (this.timers = {
        camera: !1,
        gliderMessage: !1,
      }),
      (this.past = {}),
      (this.health = 100),
      (this.cards = []),
      (this.killedBy = !1),
      (this.isDeath = !1),
      (this.deathCount = 0),
      (this.weaponIndex = 0),
      (this.isCardSelection = !1),
      (this.isRespawnAllowed = !1),
      (this.lastRespawnDate = 0),
      (this.characterCameraScale = 1),
      (this.currentShootingState = !1),
      (this.gliderEntity.enabled = !1),
      (this.movement = this.entity.script.movement),
      (this.interface = this.movement.interface),
      (this.weaponManager = this.entity.script.weaponManager),
      this.app.on('Player:Health', this.setHealth, this),
      this.app.on('Player:Respawn', this.onRespawn, this),
      this.app.on('Player:Death', this.setDeath, this),
      this.app.on('Player:Kill', this.onKill, this),
      this.app.on('Player:Shake', this.shake, this),
      this.app.on('Player:PointerLock', this.onPointerLock, this),
      this.app.on('Player:Leave', this.onLeave, this),
      this.app.on('Player:AllowRespawn', this.onAllowRespawn, this),
      this.app.on('Player:SpeedUp', this.onSpeedUp, this),
      this.app.on('Player:TriggerEvent', this.triggerEvent, this),
      this.app.on('Player:WeaponLayout', this.setWeaponLayout, this),
      Utils.isMobile() &&
        (this.app.on('Touch:Dance', this.onTouchEmote, this),
        this.app.on('Touch:BuyStart', this.onBuyStart, this),
        this.app.on('Touch:BuyEnd', this.onBuyEnd, this),
        this.app.on('Touch:BuyCard1', this.onBuyCard1, this),
        this.app.on('Touch:BuyCard2', this.onBuyCard2, this),
        this.app.on('Touch:BuyCard3', this.onBuyCard3, this),
        this.app.on('Touch:SetWeapon', this.onTouchWeapon, this)),
      this.app.on('Player:SetWeapon', this.onTouchWeapon, this),
      this.app.on('Game:Start', this.onStart, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Overlay:Cards', this.onCards, this),
      this.app.on('Overlay:Unlock', this.onUnlock, this),
      this.app.on('Overlay:SetAbility', this.onAbilitySet, this),
      this.app.on('Overlay:WhiteShadow', this.setWhiteShadow, this),
      this.app.on('Player:Character', this.onCharacterSet, this),
      this.app.on('Player:Dance', this.onDanceSet, this),
      this.app.on('Player:Skin', this.onCharacterSkinSet, this),
      this.app.on('Weapon:Set', this.onWeaponSet, this),
      this.entity.on('Player:Reload', this.onReload, this),
      this.entity.on('Player:Land', this.onLand, this),
      this.entity.on('Player:WeaponIndex', this.setWeaponIndex, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Player.prototype.onDestroy = function () {
    clearTimeout(this.skinCheckTimer);
  }),
  (Player.prototype.onReload = function (t) {}),
  (Player.prototype.onWeaponSet = function (t) {
    t.tempAnimation && 'Lilium' == this.characterName
      ? ((this.characterArmLeft.enabled = !1), (this.characterArmRight.enabled = !1))
      : ((this.characterArmLeft.enabled = !0), (this.characterArmRight.enabled = !0));
  }),
  (Player.prototype.setWeaponLayout = function (t) {
    t.success && t.weapons && (this.weapons = t.weapons);
  }),
  (Player.prototype.onLand = function () {
    this.isGliding && this.cancelGliding();
  }),
  (Player.prototype.onSpeedUp = function () {
    (this.animation.cameraFov = this.app.tween(this.movement.animation).to(
      {
        fov: 10,
      },
      0.5,
      pc.SineIn
    )),
      (this.animation.cameraShake = this.app
        .tween(pc.controls.animation)
        .to(
          {
            cameraBounce: 1,
          },
          0.04,
          pc.Linear
        )
        .yoyo(!0)
        .repeat(10)),
      this.animation.cameraShake.start(),
      this.animation.cameraFov.start(),
      setTimeout(
        function (t) {
          t.animation.cameraFov = 0;
        },
        500,
        this
      );
  }),
  (Player.prototype.onCharacterSet = function (t) {
    var e = this;
    this.characterName = t;
    var i = this.entity.findByName(this.characterName + '-Model'),
      a = this.entity.findByTag('Skin');
    for (var s in a) {
      a[s].enabled = !1;
    }
    if (!i) return console.error('Player doesnt exist : ', i), !1;
    (i.enabled = !0), (this.characterEntity = i), (this.danceName = this.characterName + '-Techno');
    var o = this.app.assets.find(t + '-RightArm'),
      n = this.app.assets.find(t + '-LeftArm');
    this.app.assets.load(o),
      this.app.assets.load(n),
      (this.characterArmLeft.model.asset = o),
      (this.characterArmRight.model.asset = n),
      o.ready(function () {
        e.armsLoaded++, e.checkLoadedSkins();
      }),
      n.ready(function () {
        e.armsLoaded++, e.checkLoadedSkins();
      });
  }),
  (Player.prototype.onDanceSet = function (t) {
    var e = this.characterName,
      i = this.app.assets.find(e + '-' + t + '-Animation'),
      a = this.app.assets.find(t + '-Music.mp3');
    if (i) {
      (this.characterHolder.enabled = !0), this.app.assets.load(i);
      var s = this.characterEntity.animation.assets;
      s.push(i.id),
        (this.characterEntity.animation.assets = s),
        (this.entity.sound.slots.Emote.asset = a.id),
        setTimeout(
          function (t) {
            t.characterHolder.enabled = !1;
          },
          500,
          this
        ),
        (this.danceName = e + '-' + t);
    }
  }),
  (Player.prototype.getSkinFromURL = function (t, e) {
    var i = new Image();
    (i.crossOrigin = 'anonymous'),
      (i.onload = function () {
        if (i) {
          var t = new pc.Texture(pc.app.graphicsDevice);
          t.setSource(i), e(t);
        }
      }),
      (i.src = Utils.prefixCDN + t);
  }),
  (Player.prototype.onCharacterSkinSet = function (t) {
    (this.skinName = t), this.checkLoadedSkins();
  }),
  (Player.prototype.checkLoadedSkins = function () {
    if (2 != this.armsLoaded)
      return (
        (this.skinCheckTimer = setTimeout(
          function (t) {
            t.checkLoadedSkins();
          },
          500,
          this
        )),
        !1
      );
    var t = this.skinName;
    if (t && this.characterEntity)
      if (t.search('Model-') > -1) this.characterEntity.model.asset = this.app.assets.find(t).id;
      else {
        var e = this.characterEntity.model.material.clone(),
          i = this;
        this.getSkinFromURL(t, function (t) {
          var a = i.characterEntity.model.meshInstances;
          if (a)
            for (var s = 0; s < a.length; ++s) {
              a[s].material = e;
            }
          (e.diffuseMap = t), e.update();
        }),
          this.characterArmLeft.fire('CustomSkin:Set', {
            skin: t,
          }),
          this.characterArmRight.fire('CustomSkin:Set', {
            skin: t,
          });
      }
  }),
  (Player.prototype.onAllowRespawn = function () {
    this.isRespawnAllowed = !0;
  }),
  (Player.prototype.onMapLoaded = function () {
    this.isMapLoaded = !0;
  }),
  (Player.prototype.onStart = function () {
    this.movement.setAmmoFull(),
      (this.cards = []),
      setTimeout(
        function (t) {
          t.fireNetworkEvent('connected', !0);
        },
        800,
        this
      );
  }),
  (Player.prototype.onFinish = function () {
    this.movement.disableMovement(),
      (this.isCardSelection = !1),
      (this.canBuy = !1),
      (this.isMapLoaded = !1);
  }),
  (Player.prototype.onUnlock = function () {
    this.canBuy = !0;
  }),
  (Player.prototype.onPointerLock = function (t) {
    !1 === t
      ? (this.app.fire('Overlay:Pause', !0), this.app.fire('Mouse:Unlock'))
      : this.app.fire('Mouse:Lock', function () {
          pc.app.fire('Button:Continue:Resolve'), pc.app.fire('Overlay:Pause', !1);
        });
  }),
  (Player.prototype.onLeave = function () {}),
  (Player.prototype.onBuyStart = function () {
    this.buyAbility();
  }),
  (Player.prototype.onBuyCard1 = function () {
    this.app.fire('Overlay:SetAbility', 0),
      this.app.fire('Network:Card', 1),
      (this.isCardSelection = !1);
  }),
  (Player.prototype.onBuyCard2 = function () {
    this.app.fire('Overlay:SetAbility', 1),
      this.app.fire('Network:Card', 2),
      (this.isCardSelection = !1);
  }),
  (Player.prototype.onBuyCard3 = function () {
    this.app.fire('Overlay:SetAbility', 2),
      this.app.fire('Network:Card', 3),
      (this.isCardSelection = !1);
  }),
  (Player.prototype.onBuyEnd = function () {
    this.buyAbilityEnd();
  }),
  (Player.prototype.onTouchEmote = function () {
    this.emote();
  }),
  (Player.prototype.triggerEvent = function (t, e) {
    this[t] && this[t](e);
  }),
  (Player.prototype.onCards = function () {
    (this.isCardSelection = !0),
      this.movement.disableMovement(),
      this.app.fire('Overlay:Gameplay', !1),
      this.app.fire('Overlay:Transition', new pc.Color(1, 1, 1)),
      setTimeout(
        function (t) {
          t._onCards();
        },
        100,
        this
      );
  }),
  (Player.prototype.onTouchWeapon = function (t) {
    if (!this.isMapLoaded) return !1;
    var e = t + '';
    '1' === e && this.setWeapon(this.weapons[0]),
      '2' === e && this.setWeapon(this.weapons[1]),
      '3' === e && this.setWeapon(this.weapons[2]),
      '4' === e && this.setWeapon(this.weapons[3]);
  }),
  (Player.prototype.setWeaponIndex = function (t) {
    'Next' == t ? this.weaponIndex++ : this.weaponIndex--,
      this.weaponIndex > 3 && (this.weaponIndex = 0),
      this.weaponIndex < 0 && (this.weaponIndex = this.weapons.length - 1),
      this.setWeapon(this.weapons[this.weaponIndex]);
  }),
  (Player.prototype._onCards = function () {
    this.entity.rigidbody.teleport(0, -50, 0, 0, 0, 0),
      (this.entity.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0)),
      (this.characterHolder.enabled = !0),
      (this.characterCamera.script.blackWhite.enabled = !1),
      this.characterCamera.setLocalPosition(0, 0.95, 7),
      this.characterEntity.setLocalEulerAngles(0, -180, 0),
      this.characterCameraHolder.setLocalScale(0, 0, 0),
      this.characterCameraHolder
        .tween(this.characterCameraHolder.getLocalScale())
        .to(
          {
            x: 0.5,
            y: 0.5,
            z: 0.5,
          },
          1.5,
          pc.SineOut
        )
        .start(),
      this.characterCameraHolder
        .tween(this.characterCameraHolder.getLocalEulerAngles())
        .rotate(
          {
            x: -165,
            y: 0,
            z: 180,
          },
          2,
          pc.SineOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.characterEntity.animation.play('Sit'), (t.movement.lookEntity.enabled = !1);
        },
        100,
        this
      );
  }),
  (Player.prototype.onAbilitySet = function (t) {
    this.cards.push(t),
      setTimeout(
        function (t) {
          t._onAbilitySet();
        },
        2e3,
        this
      );
  }),
  (Player.prototype._onAbilitySet = function () {
    this.app.fire('Overlay:Gameplay', !0),
      this.app.fire('Network:Respawn', !0),
      setTimeout(
        function (t) {
          t.afterAbilitySet();
        },
        150,
        this
      );
  }),
  (Player.prototype.afterAbilitySet = function () {
    this.movement.enableMovement(),
      this.characterCameraHolder.setLocalScale(1, 1, 1),
      this.characterCameraHolder.setLocalEulerAngles(0, 0, 0),
      (this.characterHolder.enabled = !1),
      (this.movement.lookEntity.enabled = !0);
  }),
  (Player.prototype.setWhiteShadow = function (t) {
    t
      ? ((this.animation.cameraFov = this.app.tween(this.movement.animation).to(
          {
            fov: 20,
          },
          1,
          pc.SineIn
        )),
        (this.animation.cameraShake = this.app
          .tween(pc.controls.animation)
          .to(
            {
              cameraBounce: 0.8,
            },
            0.04,
            pc.Linear
          )
          .yoyo(!0)
          .repeat(10)),
        this.animation.cameraShake.start(),
        this.animation.cameraFov.start())
      : (this.animation.cameraShake && this.animation.cameraShake.stop(),
        this.animation.cameraFov && this.animation.cameraFov.stop());
  }),
  (Player.prototype.onKill = function (t, e) {
    this.emoteReminder ||
      'Suicide' == e ||
      'FirstBlood' == e ||
      (Math.random() > 0.5
        ? this.app.fire('Overlay:Reminder', 'Press [' + keyboardMap[pc.KEY_H] + '] to emote!')
        : this.app.fire('Overlay:Reminder', 'Press [' + keyboardMap[pc.KEY_V] + '] to spray!'),
      (this.emoteReminder = !0)),
      this.app.fire('Player:Frag', !0),
      'Capture' != e && 'Suicide' != e && this.killCount++;
  }),
  (Player.prototype.shake = function () {
    this.movement.shake();
  }),
  (Player.prototype.spray = function () {
    var t = this.movement.raycastShootFrom,
      e = this.movement.raycastTo,
      i = this.app.systems.rigidbody.raycastFirst(t, e),
      a = 1e3;
    i &&
      ((a = i.point.clone().sub(t).length()),
      (tags = i.entity.tags.list()),
      a < 20
        ? this.app.fire('Network:Spray', i.point, this.raycastEntity.getEulerAngles().clone())
        : this.entity.sound.play('Error'));
  }),
  (Player.prototype.throw = function () {
    Math.random() > 0.2
      ? this.app.fire('Player:Speak', 'Throw', 2)
      : Math.random() > 0.2 && this.movement.playEffortSound();
  }),
  (Player.prototype.melee = function () {
    Math.random() > 0.2
      ? this.app.fire('Player:Speak', 'Throw', 2)
      : Math.random() > 0.2 && this.movement.playEffortSound();
  }),
  (Player.prototype.glide = function () {
    return (
      !this.isGliding &&
      !this.isDeath &&
      ((this.movement.lookEntity.enabled = !1),
      (this.characterHolder.enabled = !0),
      this.characterEntity.setLocalPosition(0, -2.15, 0),
      (this.characterCamera.script.blackWhite.enabled = !1),
      this.characterCamera.setLocalPosition(0, 1.215, -0.115),
      this.characterCamera
        .tween(this.characterCamera.getLocalPosition())
        .to(
          {
            x: 0,
            y: 4.015,
            z: 8,
          },
          1,
          pc.SineOut
        )
        .start(),
      this.characterCamera.setLocalEulerAngles(0, 0, 0),
      this.characterCamera
        .tween(this.characterCamera.getLocalEulerAngles())
        .rotate(
          {
            x: -18,
            y: 0,
            z: 0,
          },
          0.7,
          pc.BackOut
        )
        .start(),
      this.characterEntity.animation.play('Glide'),
      this.app.fire('Effect:Trigger', 'Wind', 2500),
      this.fireNetworkEvent('glide', !0),
      this.entity.sound.play('Heavy-Wind'),
      this.entity.sound.play('Parachute-Open'),
      (this.timers.gliderMessage = setTimeout(
        function (t) {
          t.app.fire('Overlay:Reminder', 'Press [SPACE] to cancel glider!');
        },
        1500,
        this
      )),
      (this.gliderEntity.enabled = !0),
      (this.lastGlidingTime = Date.now()),
      void (this.isGliding = !0))
    );
  }),
  (Player.prototype.flowJump = function () {
    this.isGliding &&
      (Date.now() - this.lastFlowJump > 1e3 &&
        (this.entity.rigidbody.applyImpulse(0, this.movement.bounceJumpForce, 0),
        this.entity.sound.play('Flow-Jump'),
        this.fireNetworkEvent('flowJump', !0)),
      (this.lastFlowJump = Date.now()));
  }),
  (Player.prototype.updateGliding = function () {
    this.setBackRaycast(),
      (this.animation.lookX = pc.math.lerpAngle(this.animation.lookX, this.movement.lookX, 0.05)),
      this.characterEntity.setLocalEulerAngles(180, -this.animation.lookX, 180),
      this.gliderEntity.setLocalEulerAngles(0, this.animation.lookX, 0),
      this.characterCameraHolder.setLocalEulerAngles(this.movement.lookY, this.movement.lookX, 0);
  }),
  (Player.prototype.cancelGliding = function () {
    return (
      !!this.isGliding &&
      !(Date.now() - this.lastGlidingTime < 1e3) &&
      ((this.isGliding = !1),
      (this.gliderEntity.enabled = !1),
      this.fireNetworkEvent('j'),
      this.entity.sound.stop('Heavy-Wind'),
      this.entity.sound.play('Parachute-Close'),
      clearTimeout(this.timers.gliderMessage),
      void this.onCameraReturn())
    );
  }),
  (Player.prototype.emote = function () {
    if (this.isEmotePlaying) return !1;
    if (this.emoteTimeout) return !1;
    if (this.isGliding) return !1;
    var t = this.danceName;
    (this.isEmotePlaying = !0),
      this.movement.disableMovement(),
      (this.characterHolder.enabled = !0),
      (this.gliderEntity.enabled = !1),
      this.characterEntity.setLocalPosition(0, -2.15, 0),
      this.characterEntity.animation.play(t + '-Animation'),
      (this.characterEntity.animation.speed = 1),
      (this.characterEntity.animation.loop = !0),
      this.entity.sound.play('Emote'),
      setTimeout(
        function (t) {
          t.movement.lookEntity.enabled = !1;
        },
        100,
        this
      ),
      (this.characterCamera.script.blackWhite.enabled = !1),
      this.characterCamera.setLocalPosition(0, 1.215, -0.115),
      this.characterCamera
        .tween(this.characterCamera.getLocalPosition())
        .to(
          {
            x: 0,
            y: 3.015,
            z: 7,
          },
          1,
          pc.SineOut
        )
        .start(),
      this.characterCamera.setLocalEulerAngles(0, 0, 0),
      this.characterCamera
        .tween(this.characterCamera.getLocalEulerAngles())
        .rotate(
          {
            x: -18,
            y: 0,
            z: 0,
          },
          0.7,
          pc.BackOut
        )
        .start(),
      this.fireNetworkEvent('emote', t),
      setTimeout(
        function (t) {
          t.allowEmoteCancelation = !0;
        },
        1500,
        this
      ),
      (this.emoteTimeout = setTimeout(
        function (t) {
          t.finishEmote();
        },
        4500,
        this
      ));
  }),
  (Player.prototype.finishEmote = function () {
    if (!this.isEmotePlaying) return !1;
    this.isDeath ||
      (this.onCameraReturn(),
      clearTimeout(this.emoteTimeout),
      setTimeout(
        function (t) {
          (t.allowEmoteCancelation = !1),
            (t.emoteTimeout = !1),
            (t.isEmotePlaying = !1),
            t.movement.enableMovement();
        },
        400,
        this
      ));
  }),
  (Player.prototype.setDeath = function (t, e) {
    if (
      ((this.killedBy = t),
      (this.isDeath = !0),
      this.deathCount++,
      this.movement.death(),
      (this.gliderEntity.enabled = !1),
      (this.characterHolder.enabled = !0),
      this.characterEntity.setLocalEulerAngles(0, this.movement.lookX, 0),
      setTimeout(
        function (t) {
          t.movement.lookEntity.enabled = !1;
        },
        100,
        this
      ),
      this.characterEntity.setLocalPosition(0, -2.15, 0),
      (this.characterEntity.animation.speed = 1),
      this.app.fire('CustomText:KillMessage', ''),
      'Drown' == e
        ? (this.characterEntity.animation.play('Floating'),
          (this.characterEntity.animation.speed = 3),
          (this.characterEntity.animation.loop = !0),
          this.entity.sound.play('Splash'),
          this.characterEntity.setLocalPosition(0, -3.5, 0),
          this.characterEntity
            .tween(this.characterEntity.getLocalPosition())
            .to(
              {
                x: 0,
                y: -6.5,
                z: 0,
              },
              2,
              pc.Linear
            )
            .start())
        : (this.characterEntity.animation.play('Death'),
          (this.characterEntity.animation.loop = !1)),
      (this.characterCamera.script.blackWhite.enabled = !0),
      this.characterCamera.setLocalPosition(0, 1.215, -0.115),
      this.characterCamera
        .tween(this.characterCamera.getLocalPosition())
        .to(
          {
            x: 0,
            y: 3.015,
            z: 7,
          },
          1,
          pc.SineOut
        )
        .start(),
      this.characterCamera.setLocalEulerAngles(0, 0, 0),
      this.characterCamera
        .tween(this.characterCamera.getLocalEulerAngles())
        .rotate(
          {
            x: -18,
            y: 0,
            z: 0,
          },
          0.7,
          pc.BackOut
        )
        .start(),
      this.interface.hideGameplay(),
      this.killedBy && this.killedBy != this.entity)
    ) {
      var i = Utils.displayUsername(this.killedBy.script.enemy.username);
      this.app.fire('Overlay:Status', 'Following [color="#FF0000"]' + i + '[/color]'),
        this.app.fire('CustomText:KillMessage', this.killedBy.script.enemy.killMessage);
    }
    this.app.fire('Player:StopSpeaking', !0), this.showCircularMenu();
  }),
  (Player.prototype.setHealth = function (t) {
    t - this.health > 30 &&
      t > 80 &&
      (this.app.fire('Character:Sound', 'Sigh', 0.1 * Math.random()),
      setTimeout(
        function (t) {
          t.app.fire('Player:Speak', 'Heal', 1);
        },
        1e3,
        this
      )),
      t - this.health > 40 && this.app.fire('Timeline:Heal'),
      (this.health = t);
  }),
  (Player.prototype.onCameraReturn = function (t) {
    if (t) return (this.characterHolder.enabled = !1), (this.movement.lookEntity.enabled = !0), !1;
    this.characterCamera
      .tween(this.characterCamera.getLocalPosition())
      .to(
        {
          x: 0,
          y: 1.19,
          z: 0,
        },
        0.4,
        pc.SineOut
      )
      .start(),
      this.characterCamera
        .tween(this.characterCamera.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          0.4,
          pc.BackOut
        )
        .start(),
      (this.timers.camera = setTimeout(
        function (t) {
          (t.characterHolder.enabled = !1),
            (t.movement.lookEntity.enabled = !0),
            t.movement.takeout();
        },
        400,
        this
      ));
  }),
  (Player.prototype.getSpawnPoint = function () {
    var t = [],
      e = this.app.root.findByTag('SpawnPoint');
    this.app.root.findByTag('Player');
    for (var i in e) {
      var a,
        s = e[i],
        o = s.getPosition().clone(),
        n = s.getLocalEulerAngles().clone();
      (a = this.entity.getPosition().clone().sub(o).length()),
        ('TDM' != pc.currentMode && 'PAYLOAD' != pc.currentMode) ||
          pc.currentTeam != s.name ||
          t.push({
            score: a,
            point: o,
            angle: n,
          }),
        'TDM' != pc.currentMode &&
          'PAYLOAD' != pc.currentMode &&
          t.push({
            score: a,
            point: o,
            angle: n,
          });
    }
    return (
      t.sort(function (t, e) {
        return e.score - t.score;
      }),
      0 !== t.length && t[Math.round(3 * Math.random())]
    );
  }),
  (Player.prototype.onRespawn = function (t) {
    if (pc.isFinished) return !1;
    if (!pc.isMapLoaded) return !1;
    if (!this.isRespawnAllowed && 'undefined' != typeof VERSION) return !1;
    if (Date.now() - this.lastRespawnDate < 500) return !1;
    (this.isDeath = !1),
      (this.isEmotePlaying = !1),
      this.cancelGliding(),
      this.movement.currentWeapon.entity.name != this.lastWeapon
        ? ('Shotgun' == this.movement.currentWeapon.entity.name
            ? this.app.fire('Player:Speak', 'Shotgun', 1)
            : this.app.fire('Player:Speak', 'Weapon-Selection', 2),
          (this.lastWeapon = this.movement.currentWeapon.entity.name + ''))
        : Math.random() > 0.8 && this.app.fire('Player:Speak', 'Respawn', 3),
      this.onCameraReturn(!0),
      this.movement.enableMovement(),
      this.movement.setAmmoFull(),
      this.interface.showGameplay();
    var e = new pc.Vec3(t.position.x, t.position.y, t.position.z);
    Math.random(), Math.random();
    if (e) {
      0 === e.x && 0 === e.y && 0 === e.z && (e = this.getSpawnPoint()),
        e || (e = new pc.Vec3(0, 0, 0)),
        e.add || (e = new pc.Vec3(0, 0, 0));
      var i = e,
        a = t.rotation;
      (this.entity.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0)),
        this.entity.rigidbody.teleport(i.x, i.y, i.z, 0, 0, 0),
        (this.spawnPosition.x = i.x),
        (this.spawnPosition.y = i.y),
        (this.spawnPosition.z = i.z),
        (this.leftSpawnPoint = !1),
        a &&
          (180 == a.x && 180 == a.z
            ? (this.movement.lookX = 90 - a.y)
            : (this.movement.lookX = a.y + 45));
    }
    this.lastRespawnDate = Date.now();
  }),
  (Player.prototype.fireNetworkEvent = function (t) {
    this.app.fire('Network:Event', t);
  }),
  (Player.prototype.setStates = function () {
    this.movement.isForward != this.past.isForward &&
      this.app.fire('Network:State', 'w', this.movement.isForward),
      this.movement.isBackward != this.past.isBackward &&
        this.app.fire('Network:State', 's', this.movement.isBackward),
      this.movement.isLeft != this.past.isLeft &&
        this.app.fire('Network:State', 'a', this.movement.isLeft),
      this.movement.isRight != this.past.isRight &&
        this.app.fire('Network:State', 'd', this.movement.isRight),
      (this.past.isForward = this.movement.isForward),
      (this.past.isBackward = this.movement.isBackward),
      (this.past.isLeft = this.movement.isLeft),
      (this.past.isRight = this.movement.isRight);
  }),
  (Player.prototype.setPosition = function () {
    if (this.currentDate - this.lastPositionUpdate < 30) return !1;
    var t = this.entity.getPosition().clone(),
      e = this.movement.lookX % 360,
      i = this.movement.lookY % 360;
    this.app.fire('EffectManager:SetEntityPosition', t),
      this.app.fire('Network:Position', t.x, t.y, t.z, e, i),
      (this.lastPositionUpdate = this.currentDate);
  }),
  (Player.prototype.checkShooting = function () {
    var t = !1;
    this.movement.isReloading < this.movement.timestamp && this.movement.leftMouse && (t = !0),
      this.currentShootingState !== t && this.app.fire('Network:State', 'f', t),
      (this.currentShootingState = t);
  }),
  (Player.prototype.setDeathAnimation = function () {
    if (!this.killedBy) return !1;
    var t = this.entity.getPosition(),
      e = this.killedBy.getPosition(),
      i = Utils.lookAt(e.x, e.z, t.x, t.z);
    this.characterCameraHolder.setLocalEulerAngles(0, i * pc.math.RAD_TO_DEG, 0);
  }),
  (Player.prototype.setBackRaycast = function () {
    var t = this.characterCamera.forward.scale(-100),
      e = this.characterCamera.getPosition(),
      i = e.clone().add(t),
      a = this.app.systems.rigidbody.raycastFirst(e, i),
      s = 1e3;
    a && (s = a.entity.getPosition().clone().sub(e).length()),
      (this.characterCameraScale = Math.min(1, s / 10)),
      this.characterCameraHolder.setLocalScale(
        this.characterCameraScale,
        this.characterCameraScale,
        this.characterCameraScale
      );
  }),
  (Player.prototype.updateEmotePlaying = function () {
    this.setBackRaycast(),
      (this.animation.lookX = pc.math.lerpAngle(this.animation.lookX, this.movement.lookX, 0.05)),
      this.characterEntity.setLocalEulerAngles(180, -this.animation.lookX, 180),
      this.characterCameraHolder.setLocalEulerAngles(this.movement.lookY, this.movement.lookX, 0),
      this.allowEmoteCancelation &&
        (this.app.keyboard.isPressed(pc.KEY_W) ||
          this.app.keyboard.isPressed(pc.KEY_S) ||
          this.app.keyboard.isPressed(pc.KEY_D) ||
          this.app.keyboard.isPressed(pc.KEY_A)) &&
        this.finishEmote();
  }),
  (Player.prototype.buyAbility = function () {
    this.canBuy
      ? (this.app.fire('Overlay:WhiteShadow', !0),
        (this.whiteShadowTimer = setTimeout(
          function (t) {
            (t.canBuy = !1),
              pc.app.fire('Network:Buy'),
              setTimeout(function () {
                pc.app.fire('Overlay:WhiteShadow', !1);
              }, 500);
          },
          1e3,
          this
        )))
      : this.entity.sound.play('Error');
  }),
  (Player.prototype.buyAbilityEnd = function () {
    clearTimeout(this.whiteShadowTimer), this.app.fire('Overlay:WhiteShadow', !1);
  }),
  (Player.prototype.setKeyboard = function () {
    return (
      !pc.isFinished &&
      'INPUT' != document.activeElement.tagName &&
      !(
        !this.isCardSelection &&
        this.isMapLoaded &&
        ('GUNGAME' != pc.currentMode &&
          'CUSTOM' != pc.currentMode &&
          (this.app.keyboard.wasPressed(pc.KEY_1) && this.setWeapon(this.weapons[0]),
          this.app.keyboard.wasPressed(pc.KEY_2) && this.setWeapon(this.weapons[1]),
          this.app.keyboard.wasPressed(pc.KEY_3) && this.setWeapon(this.weapons[2]),
          this.app.keyboard.wasPressed(pc.KEY_4) && this.setWeapon(this.weapons[3])),
        this.isDeath && this.isCircularMenuActive)
      ) &&
      (this.isCardSelection &&
        (this.app.keyboard.wasPressed(pc.KEY_1) && this.onBuyCard1(),
        this.app.keyboard.wasPressed(pc.KEY_2) && this.onBuyCard2(),
        this.app.keyboard.wasPressed(pc.KEY_3) && this.onBuyCard3()),
      !this.movement.locked &&
        (this.app.keyboard.wasPressed(pc.KEY_H) && this.emote(),
        this.app.keyboard.wasPressed(pc.KEY_B) && this.buyAbility(),
        this.app.keyboard.wasReleased(pc.KEY_B) && this.buyAbilityEnd(),
        this.app.keyboard.wasPressed(pc.KEY_TAB) && this.app.fire('Overlay:PlayerStats', !0),
        void (
          this.app.keyboard.wasReleased(pc.KEY_TAB) && this.app.fire('Overlay:PlayerStats', !1)
        )))
    );
  }),
  (Player.prototype.setWeapon = function (t) {
    if (pc.currentModeOptions && !0 === pc.currentModeOptions.noWeaponChange) return !1;
    if (this.lastWeapon == t) return !1;
    if (Date.now() - this.lastWeaponChange > 2e3 || this.isDeath) {
      if (this.movement.isShooting > this.movement.timestamp && !this.isDeath) return !1;
      if (this.movement.isReloading > this.movement.timestamp && !this.isDeath) return !1;
      this.movement.disableZoom(),
        this.weaponManager.setWeapon(t),
        (this.weaponIndex = this.weapons.indexOf(t)),
        (this.lastWeapon = t),
        (this.lastWeaponChange = Date.now());
    } else
      this.app.fire('Chat:Message', 'Console', 'Please wait 2 seconds to change weapon.'),
        (this.weaponIndex = this.weapons.indexOf(this.lastWeapon));
  }),
  (Player.prototype.showCircularMenu = function (t) {
    return (
      !this.isCircularMenuActive &&
      (!pc.currentModeOptions || !0 !== pc.currentModeOptions.noWeaponChange) &&
      (Date.now() - this.lastCircularMenu < 5e3
        ? (this.entity.sound.play('Error'), !1)
        : ((this.isCircularMenuActive = !0),
          (this.lastCircularMenu = Date.now()),
          this.app.fire('Overlay:Circular', this.weapons),
          void setTimeout(
            function (t) {
              t.isCircularMenuActive = !1;
            },
            3500,
            this
          )))
    );
  }),
  (Player.prototype.checkDistanceFromSpawnPosition = function () {
    if (this.leftSpawnPoint) return !1;
    this.spawnPosition.clone().sub(this.entity.getPosition().clone()).length() > 2 &&
      (this.app.fire('Enemy:Collision', !0), (this.leftSpawnPoint = !0));
  }),
  (Player.prototype.update = function (t) {
    (this.currentDate = Date.now()),
      this.setPosition(),
      this.setStates(),
      this.setKeyboard(),
      this.checkDistanceFromSpawnPosition(),
      this.isEmotePlaying && this.updateEmotePlaying(),
      this.isGliding && this.updateGliding(),
      this.isDeath && this.setDeathAnimation();
  });
var Enemy = pc.createScript('enemy');
Enemy.attributes.add('playerId', {
  type: 'string',
  default: '0',
}),
  Enemy.attributes.add('username', {
    type: 'string',
    default: 'none',
  }),
  Enemy.attributes.add('team', {
    type: 'string',
    default: 'none',
  }),
  Enemy.attributes.add('weapon', {
    type: 'string',
    default: 'Scar',
  }),
  Enemy.attributes.add('characterEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('modelHolder', {
    type: 'entity',
  }),
  Enemy.attributes.add('skins', {
    type: 'entity',
    array: !0,
  }),
  Enemy.attributes.add('headEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('bodyEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('weaponHolder', {
    type: 'entity',
  }),
  Enemy.attributes.add('muzzlePoint', {
    type: 'entity',
  }),
  Enemy.attributes.add('farPoint', {
    type: 'entity',
  }),
  Enemy.attributes.add('meleePoint', {
    type: 'entity',
  }),
  Enemy.attributes.add('meleeEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('gliderEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('dashEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('hammerEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('katanaEntity', {
    type: 'entity',
  }),
  Enemy.attributes.add('healthRegenEntity', {
    type: 'entity',
  }),
  (Enemy.prototype.initialize = function () {
    (this.lastDelta = 0),
      (this.delta = 0.3),
      (this.timestamp = 0),
      (this.deltaTotal = 0.3),
      (this.deltaCount = 1),
      (this.lastDeltaDate = Date.now()),
      (this.isActivated = !1),
      (this.heroSkin = 'Default'),
      (this.killMessage = ''),
      (this.skinMaterial = !1),
      (this.isActive = !0),
      (this.isDashing = !1),
      (this.isGrappling = !1),
      (this.isEmotePlaying = !1),
      (this.isGliding = !1),
      (this.isLanded = !0),
      (this.headAngle = 52),
      (this.bodyAngle = 62),
      (this.isSkinSet = !1),
      (this.spineFactorX = 1),
      (this.spineFactorY = 0),
      (this.spineFactorZ = -1),
      (this.spineDirectionX = 0),
      (this.spineDirectionY = -10),
      (this.spineDirectionZ = 0),
      (this.headAngleX = -90),
      (this.headAngleY = 40),
      (this.headAngleZ = 30),
      (this.lastRespawnTalk = Date.now()),
      (pc.testAngle = -10),
      (pc.testAngleX = 0.5),
      (pc.testAngleZ = 0.5),
      (this.sex = 'Female'),
      (this.skin = 'Lilium'),
      (this.currentAnimation = 'none'),
      (this.lastDirection = 'none'),
      (this.weaponSkins = {}),
      (this.health = 100),
      (this.damageAngle = 0),
      (this.currentPosition = new pc.Vec3(0, 0, 0)),
      (this.currentAngle = new pc.Vec3(0, 0, 0)),
      (this.nextPosition = new pc.Vec3(0, 0, 0)),
      (this.nextAngle = new pc.Vec3(0, 0, 0)),
      (this.tempAngle = new pc.Vec3(0, 0, 0)),
      (this.currentPosition.y = Utils.nullVector.y),
      (this.nextPosition.y = Utils.nullVector.y),
      (this.isDeath = !1),
      (this.isJumping = !1),
      (this.isShooting = 0),
      (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      (this.shootingState = !1),
      (this.isShootingLocked = !1),
      (this.lastDamage = Date.now()),
      (this.timeout = {}),
      (this.currentWeapon = {}),
      this.setWeapon('Scar', !1),
      this.farPoint.setLocalPosition(0, 0, 200),
      (this.meleeEntity.enabled = !1),
      this.app.on('Player:Death', this.onPlayerDeath, this),
      this.app.on('Player:Respawn', this.onPlayerRespawn, this),
      this.app.on('Player:Ready', this.onPlayerReady, this),
      this.app.on('Enemy:Collision', this.setEnemyCollisionState, this),
      setTimeout(
        function (t) {
          t.setConnectionState();
        },
        1500,
        this
      ),
      this.entity.on('destroy', this.onDestroy, this);
  }),
  (Enemy.prototype.setEnemyCollisionState = function (t) {
    this.entity && this.entity.collision && (this.entity.collision.enabled = t);
  }),
  (Enemy.prototype.onDestroy = function () {
    this.weaponHolder.destroy(),
      this.app.off('Player:Death', this.onPlayerDeath, this),
      this.app.off('Player:Respawn', this.onPlayerRespawn, this),
      this.app.off('Player:Ready', this.onPlayerReady, this);
  }),
  (Enemy.prototype.onPlayerDeath = function () {
    this.entity && this.disableDamage();
  }),
  (Enemy.prototype.setFlag = function (t) {
    this.entity.script.label && this.entity.script.label.setFlagState(t);
  }),
  (Enemy.prototype.setUsername = function (t, i, e) {
    (this.entity.script.label.enabled = !0),
      this.entity.script.label.setInitalize(),
      (this.team = i),
      (this.isActivated = '-1' == this.playerId),
      this.isActivated
        ? this.entity.script.label.setDestroy()
        : this.entity.script.label.setUsername(t, i, e);
  }),
  (Enemy.prototype.setKillMessage = function (t) {
    this.killMessage = t;
  }),
  (Enemy.prototype.onPlayerRespawn = function () {
    this.entity &&
      (this.disableRigidbodyTemporary(),
      this.disableDamage(),
      clearTimeout(this.timeout.damageTimer),
      (this.timeout.damageTimer = setTimeout(
        function (t) {
          t.enableDamage();
        },
        1e3,
        this
      )));
  }),
  (Enemy.prototype.setWeapon = function (t) {
    if (this.isActivated) return !1;
    var i = this.app.root.findByName('Game');
    if (!i.findByName(t)) return !1;
    (this.currentWeapon = i.findByName(t).script.weapon),
      (this.currentWeapon.name = this.currentWeapon.entity.name);
    var e = this.entity.findByTag('Weapon');
    for (var n in e) {
      e[n].enabled = !1;
    }
    var s = this.entity.findByName(t + '-Enemy');
    if (
      s &&
      ((s.enabled = !0),
      (this.weaponEntity = s),
      this.weaponSkins && void 0 !== this.weaponSkins[t])
    ) {
      var a = this.weaponSkins[t];
      a && this.setWeaponSkin(a);
    }
  }),
  (Enemy.prototype.setWeaponSkin = function (t) {
    if (t && this.weaponEntity) {
      var i = this.weaponEntity.model.material.clone(),
        e = Utils.getAssetFromURL(t),
        n = this.weaponEntity.model.meshInstances;
      if (n) {
        for (var s = 0; s < n.length; ++s) {
          n[s].material = i;
        }
        e.ready(function (t) {
          (i.diffuseMap = e.resource), i.update();
        });
      }
    }
  }),
  (Enemy.prototype.setCharacterSkin = function (t, i, e) {
    if (this.isActivated)
      return (
        (this.entity.collision.height = 4),
        (this.modelHolder.enabled = !1),
        (this.bodyEntity.enabled = !1),
        !1
      );
    this.entity.addComponent('rigidbody'),
      (this.entity.rigidbody.type = pc.BODYTYPE_KINEMATIC),
      (this.entity.rigidbody.enabled = !0),
      void 0 !== t && ((this.skin = t), (this.isSkinSet = !0));
    var n = this;
    for (var s in this.skins) {
      var a = this.skins[s];
      this.skin == a.name ? ((a.enabled = !0), (this.characterEntity = a)) : (a.enabled = !1);
    }
    'Lilium' == this.skin
      ? ((this.hammerEntity.enabled = !0), (this.katanaEntity.enabled = !1))
      : 'Shin' == this.skin && ((this.hammerEntity.enabled = !1), (this.katanaEntity.enabled = !0)),
      e && this.setDanceAnimation(this.skin, e),
      i && 'undefined' !== i && i.length > 0 && ((this.heroSkin = i), this.setHeroSkin()),
      this.app.assets.find(this.skin + '-Character').ready(function () {
        n.loadCharacterParts(), n.characterEntity.fire('Character:Loaded', !0);
      });
  }),
  (Enemy.prototype.setHealthRegen = function () {
    if (Date.now() - this.lastHealthRegen < 2e3) return !1;
    (this.healthRegenEntity.enabled = !0),
      this.entity.sound.play('Health-Regen'),
      (this.lastHealthRegen = Date.now()),
      clearTimeout(this.healthRegen),
      (this.healthRegen = setTimeout(
        function (t) {
          t.healthRegenEntity.enabled = !1;
        },
        1e3,
        this
      ));
  }),
  (Enemy.prototype.setDanceAnimation = function (t, i) {
    var e = this.app.assets.find(t + '-' + i + '-Animation'),
      n = this.app.assets.find(i + '-Music.mp3');
    if (e) {
      if ((this.app.assets.load(e), this.characterEntity.animation)) {
        var s = this.characterEntity.animation.assets;
        s.push(e.id),
          (this.characterEntity.animation.assets = s),
          (this.entity.sound.slots.Emote.asset = n.id);
      }
      this.danceName = t + '-' + i;
    }
  }),
  (Enemy.prototype.loadCharacterParts = function () {
    var t = 90,
      i = -3.92,
      e = -180;
    'Lilium' == this.skin
      ? ((this.headEntity = this.characterEntity.findByName('Character1_Head')),
        (this.spineEntity = this.characterEntity.findByName('Character1_Spine2')),
        (this.handEntity = this.characterEntity.findByName('Character1_RightHand')),
        (this.headAngleX = 0),
        (this.headAngleY = 52),
        (this.headAngleZ = 0),
        (this.spineFactorX = 1),
        (this.spineFactorY = 0),
        (this.spineFactorZ = -1),
        (this.spineDirectionX = 0),
        (this.spineDirectionY = -10),
        (this.spineDirectionZ = 0),
        (this.bodyAngle = 62),
        (t = 90),
        (i = -3.92),
        (e = -180))
      : 'Shin' == this.skin
      ? ((this.headEntity = this.characterEntity.findByName('Head')),
        (this.spineEntity = this.characterEntity.findByName('Chest')),
        (this.handEntity = this.characterEntity.findByName('Hand_R')),
        (this.headAngleX = -90),
        (this.headAngleY = 40),
        (this.headAngleZ = 30),
        (this.spineFactorX = -1),
        (this.spineFactorY = -1),
        (this.spineFactorZ = 0),
        (this.spineDirectionX = 0),
        (this.spineDirectionY = 0),
        (this.spineDirectionZ = 0),
        (this.bodyAngle = 70),
        (t = 0),
        (i = -10),
        (e = -95))
      : 'Echo' == this.skin
      ? ((this.headEntity = this.characterEntity.findByName('head')),
        (this.spineEntity = this.characterEntity.findByName('spine_02')),
        (this.handEntity = this.characterEntity.findByName('hand_r')),
        (this.headAngleX = 0),
        (this.headAngleY = 52),
        (this.headAngleZ = 0),
        (this.spineFactorX = 1),
        (this.spineFactorY = 0),
        (this.spineFactorZ = -1),
        (this.spineDirectionX = 0),
        (this.spineDirectionY = -10),
        (this.spineDirectionZ = 0),
        (this.bodyAngle = 62),
        (t = 90),
        (i = -3.92),
        (e = -180))
      : 'Kulu' == this.skin &&
        ((this.headEntity = this.characterEntity.findByName('Character1_Head')),
        (this.spineEntity = this.characterEntity.findByName('Character1_Spine2')),
        (this.handEntity = this.characterEntity.findByName('Weapon_Rig')),
        (this.headAngleX = 0),
        (this.headAngleY = 52),
        (this.headAngleZ = 0),
        (this.spineFactorX = 1),
        (this.spineFactorY = 0),
        (this.spineFactorZ = -1),
        (this.spineDirectionX = 0),
        (this.spineDirectionY = -10),
        (this.spineDirectionZ = 0),
        (this.bodyAngle = 62),
        (t = 90),
        (i = -3.92),
        (e = -180)),
      this.weaponHolder.setLocalEulerAngles(t, i, e),
      this.weaponHolder.setLocalScale(40, 40, 40),
      this.weaponHolder.reparent(this.handEntity),
      this.setHeroSkin(),
      this.setAnimation('Idle', 0.1, !0);
  }),
  (Enemy.prototype.setHeroSkin = function () {
    if (!this.isSkinSet)
      return (
        setTimeout(
          function (t) {
            t.setHeroSkin();
          },
          500,
          this
        ),
        !1
      );
    var t = this.heroSkin;
    if (
      ('Default' == t && (t = this.skin + '-' + this.heroSkin + '.jpg'), t && this.characterEntity)
    ) {
      if (t.search('Model-') > -1) this.characterEntity.model.asset = this.app.assets.find(t).id;
      else {
        var i = this.characterEntity.model.material.clone(),
          e = Utils.getAssetFromURL(t),
          n = this.characterEntity.model.meshInstances;
        if ((console.log('Customskin : ', this.skin, t, e), n && n.length > 0)) {
          for (var s = 0; s < n.length; ++s) {
            n[s].material = i;
          }
          e &&
            e.ready(function (t) {
              (i.diffuseMap = e.resource), i.update();
            });
        }
      }
      this.characterEntity.animation.play('Idle');
    }
  }),
  (Enemy.prototype.setAnimation = function (t, i, e) {
    this.currentAnimation != t &&
      this.characterEntity &&
      this.characterEntity.animation &&
      ((this.characterEntity.animation.loop = !!e),
      this.characterEntity.animation.play(t, i),
      (this.currentAnimation = t));
  }),
  (Enemy.prototype.applyAbilityAffect = function (t) {
    this.entity.sound.play(t),
      (this.lastDamage = Date.now()),
      this.entity.script.label.setAbility(t);
  }),
  (Enemy.prototype.setEmote = function () {
    var t = this.danceName;
    (this.isEmotePlaying = !0),
      (this.characterEntity.animation.speed = 1),
      this.characterEntity.animation.play(t + '-Animation'),
      this.entity.sound.play('Emote'),
      (this.timeout.emote = setTimeout(
        function (t) {
          t.isEmotePlaying = !1;
        },
        3e3,
        this
      ));
  }),
  (Enemy.prototype.setGlide = function () {
    if (this.isGliding) return !1;
    (this.isGliding = !0),
      (this.gliderEntity.enabled = !0),
      (this.characterEntity.animation.speed = 1),
      this.characterEntity.animation.play('Glide'),
      this.entity.sound.play('Parachute'),
      this.entity.sound.play('Heavy-Wind'),
      clearTimeout(this.timeout.glide),
      (this.timeout.glide = setTimeout(
        function (t) {
          t.cancelGliding();
        },
        8e3,
        this
      ));
  }),
  (Enemy.prototype.cancelGliding = function () {
    return (
      !!this.isGliding &&
      !!this.isLanded &&
      ((this.isGliding = !1),
      (this.gliderEntity.enabled = !1),
      this.entity.sound.play('Parachute-Close'),
      void this.entity.sound.stop('Heavy-Wind'))
    );
  }),
  (Enemy.prototype.flowJump = function () {
    this.isGliding && this.entity.sound.play('Flow-Jump');
  }),
  (Enemy.prototype.left = function () {
    clearTimeout(this.timeout.respawn),
      clearTimeout(this.timeout.death),
      clearTimeout(this.timeout.jump),
      clearTimeout(this.timeout.reload),
      this.entity.script.label.destroy(),
      this.entity.destroy();
  }),
  (Enemy.prototype.hideCharacter = function () {
    if (!this.isDeath) return !1;
    this.disableDamage(), (this.characterEntity.enabled = !1);
  }),
  (Enemy.prototype.showCharacter = function () {
    this.enableDamage(), (this.characterEntity.enabled = !0);
  }),
  (Enemy.prototype.burn = function () {
    this.entity &&
      this.entity.sound &&
      (this.entity.sound.play('Burn'), this.characterEntity.fire('Frensel:Burn', !0));
  }),
  (Enemy.prototype.death = function (t) {
    (this.isDeath = !0),
      (this.isForward = !1),
      (this.isBackward = !1),
      (this.isLeft = !1),
      (this.isRight = !1),
      (this.isJumping = !1),
      (this.gliderEntity.enabled = !1),
      this.disableDamage(),
      'Drown' == t
        ? (this.entity.sound.play('Splash'),
          (this.characterEntity.animation.speed = 4),
          this.characterEntity.setLocalPosition(0, -3.5, 0),
          this.setAnimation('Floating', 0.1, !0))
        : ((this.characterEntity.animation.speed = 1),
          this.characterEntity.setLocalPosition(0, -2, 0),
          this.setAnimation('Death', 0.1, !1),
          setTimeout(
            function (t) {
              t.burn();
            },
            800,
            this
          ));
    var i = this.entity.getPosition().clone(),
      e = this.entity.up.scale(-100),
      n = this.app.systems.rigidbody.raycastFirst(i, e);
    n &&
      n.point &&
      this.app
        .tween(this.nextPosition)
        .to(
          {
            x: n.point.x,
            y: n.point.y + 2.05,
            z: n.point.z,
          },
          0.8,
          pc.BackOut
        )
        .start(),
      this.app.fire('EffectManager:Skull', this.currentPosition),
      this.app.fire('EffectManager:KillSphere', this.currentPosition),
      (this.nextAngle.y = this.damageAngle),
      (this.currentAngle.y = this.damageAngle),
      clearTimeout(this.timeout.death),
      (this.timeout.death = setTimeout(
        function (t) {
          t && t.hideCharacter && t.hideCharacter();
        },
        3500,
        this
      ));
  }),
  (Enemy.prototype.teleport = function () {
    (this.currentPosition = this.nextPosition.clone()),
      this.entity.setPosition(this.currentPosition);
  }),
  (Enemy.prototype.disableRigidbodyTemporary = function (t) {
    return (
      !!this.entity &&
      !!this.entity.rigidbody &&
      ((this.entity.rigidbody.enabled = !1),
      clearTimeout(this.timeout.respawnTimer),
      void (this.timeout.respawnTimer = setTimeout(
        function (t) {
          t.entity && t.entity.rigidbody && (t.entity.rigidbody.enabled = !0);
        },
        2e3,
        this
      )))
    );
  }),
  (Enemy.prototype.respawn = function (t) {
    this.disableRigidbodyTemporary(),
      (this.nextPosition.x = t.position.x),
      (this.nextPosition.y = t.position.y),
      (this.nextPosition.z = t.position.z),
      this.entity.setPosition(t.position.x, t.position.y, t.position.z),
      this.cancelGliding(),
      this.teleport(),
      (this.characterEntity.animation.speed = 1),
      this.characterEntity.setLocalPosition(0, -2, 0);
    var i = Math.round(1 * Math.random()) + 1,
      e = this.skin + '-Talk-' + i;
    Date.now() - this.lastRespawnTalk > 5e3 &&
      (this.characterEntity.fire('Frensel:ResetBurn', !0),
      this.entity.sound.play('Respawn'),
      Math.random() > 0.5 && (this.entity.sound.play(e), (this.lastRespawnTalk = Date.now()))),
      clearTimeout(this.timeout.death),
      clearTimeout(this.timeout.respawn),
      (this.timeout.respawn = setTimeout(
        function (t) {
          t && (t.showCharacter(), t.setAnimation('Idle', 0.1, !0), (t.isDeath = !1));
        },
        800,
        this
      ));
  }),
  (Enemy.prototype.dealSpell = function (t) {
    'Shuriken' == t && this.app.fire('Network:DealSpell', this.playerId),
      'Axe' == t && this.app.fire('Network:DealSpell', this.playerId);
  }),
  (Enemy.prototype.damage = function (t, i, e) {
    var n = !1;
    if (
      (e && e.y > 0.9 && (n = !0),
      (this.damageAngle = Utils.lookAt(0, 0, e.x, e.z)),
      this.characterEntity.fire('Frensel:Damage', i),
      (this.tempAngle.x += 3 * Math.random() - 3 * Math.random()),
      (this.tempAngle.y += 2 * Math.random() - 2 * Math.random()),
      this.entity.script.label.onDamage(i),
      !this.isActivated)
    ) {
      var s = Math.round(2 * Math.random()) + 1,
        a = this.skin + '-Grunt-' + s,
        h = !0;
      ('TDM' != pc.currentMode && 'PAYLOAD' != pc.currentMode) ||
        (pc.currentTeam == this.team && ((h = !1), this.app.fire('Overlay:FriendlyFire', !0))),
        h &&
          (this.app.fire('Hit:Point', this.entity, Math.floor(20 * Math.random()) + 5),
          this.entity.sound.play(a),
          n && this.app.fire('Hit:Headshot', this.entity, Math.floor(20 * Math.random()) + 5)),
        (this.lastDamage = Date.now()),
        'TDM' == pc.currentMode || pc.currentMode;
    }
    this.app.fire('Network:Damage', t, i, n, this.playerId);
  }),
  (Enemy.prototype.onPlayerReady = function () {
    this.entity && this.entity.collision;
  }),
  (Enemy.prototype.disableDamage = function () {
    return (
      !!this.entity.collision && !this.isActivated && void (this.entity.collision.enabled = !1)
    );
  }),
  (Enemy.prototype.enableDamage = function () {
    return (
      !!this.entity.collision && !this.isActivated && void (this.entity.collision.enabled = !0)
    );
  }),
  (Enemy.prototype.setTeam = function (t) {
    (this.team = t), this.entity && this.entity.script.label.setTeam(t);
  }),
  (Enemy.prototype.setHealth = function (t) {
    t - this.health > 20 && t > 90 && this.setHealthRegen(),
      (this.health = t),
      this.entity && this.entity.fire('Health', this.health);
  }),
  (Enemy.prototype.shoot = function () {
    if (!this.currentWeapon) return !1;
    this.spreadNumber = 10;
    var t = this.muzzlePoint.getPosition(),
      i = this.farPoint.getPosition(),
      e = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
      n = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
      s = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber,
      a = i.clone().add(new pc.Vec3(e, n, s)),
      h = this.playerId,
      o = this.currentWeapon.name + '-Fire';
    this.entity.sound.slots[o] &&
      ((this.entity.sound.slots[o].pitch = 1 - 0.1 * Math.random()), this.entity.sound.play(o)),
      'Melee' != this.currentWeapon.type &&
        'Launcher' != this.currentWeapon.type &&
        this.app.fire('EffectManager:Fire', t, a, t, h),
      this.showCharacter(),
      (this.isShootingLocked = !0);
  }),
  (Enemy.prototype.setState = function (t, i) {
    if (!this.isActive) return !1;
    switch (t) {
      case 'w':
        this.isForward = i;
        break;
      case 's':
        this.isBackward = i;
        break;
      case 'a':
        this.isLeft = i;
        break;
      case 'd':
        this.isRight = i;
        break;
      case 'f':
        this.shootingState = i;
    }
    this.setConnectionState(!0);
  }),
  (Enemy.prototype.triggerEvent = function (t) {
    if (!this.isActive) return !1;
    if (this.isDeath) return !1;
    switch (t) {
      case 'r':
        this.reload();
        break;
      case 'm':
        this.melee();
        break;
      case 'j':
        this.jump();
        break;
      case 'bj':
        this.bounceJump();
        break;
      case 'dash':
        this.dash();
        break;
      case 'emote':
        this.setEmote();
        break;
      case 'glide':
        this.setGlide();
        break;
      case 'flowJump':
        this.flowJump();
        break;
      case 'watch-ads':
        this.app.fire('Overlay:WatchAds', this.playerId);
        break;
      case 'l':
        this.land();
    }
  }),
  (Enemy.prototype.playGrappleAnimation = function () {
    (this.characterEntity.animation.speed = 0.1), this.setAnimation('Echo-Grapple', 0.1, !1);
  }),
  (Enemy.prototype.dash = function () {
    if (this.isDashing) return !1;
    'Shin' == this.skin &&
      ((this.isDashing = !0),
      this.entity.sound.play(this.skin + '-Dash'),
      this.entity.sound.play('Whoosh-High'),
      this.entity.sound.play('Buff-Attack-1'),
      (this.characterEntity.animation.speed = 1),
      this.setAnimation('Shin-Dash', 0.1, !1),
      (this.dashEntity.enabled = !0),
      setTimeout(
        function (t) {
          t.dashEntity.enabled = !1;
        },
        500,
        this
      ),
      setTimeout(
        function (t) {
          t.isDashing = !1;
        },
        1e3,
        this
      ));
  }),
  (Enemy.prototype.reload = function () {
    this.timeout.reload = setTimeout(
      function (t) {
        t &&
          t.entity &&
          t.entity.sound &&
          t.entity.sound.play &&
          t.entity.sound.play(t.currentWeapon.entity.name + '-Reload');
      },
      1200,
      this
    );
  }),
  (Enemy.prototype.land = function () {
    (this.isJumping = !1), (this.isLanded = !0), this.cancelGliding();
  }),
  (Enemy.prototype.jump = function () {
    var t = Math.round(1 * Math.random()) + 1;
    this.cancelGliding(),
      (this.isJumping = !0),
      (this.isLanded = !1),
      (this.characterEntity.animation.speed = 1),
      this.setAnimation('Jump-' + t, 0.1, !1);
    var i = this.skin + '-Jump-' + t;
    this.entity.sound.play(i),
      (this.timeout.jump = setTimeout(
        function (t) {
          t.land();
        },
        2e3,
        this
      ));
  }),
  (Enemy.prototype.melee = function () {
    var t = Math.round(1 * Math.random()) + 1,
      i = this.skin + '-Jump-' + t;
    this.entity.sound.play(i),
      (this.currentAngle.x = this.currentAngle.x - 2),
      (this.meleeEntity.enabled = !0),
      this.entity.sound.play('Whoosh'),
      this.entity.sound.play('Impact-Iron'),
      this.meleeEntity.setLocalEulerAngles(170.53, 21.25, 158.02),
      this.meleeEntity
        .tween(this.meleeEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 130.23,
            y: -78.41,
            z: -149.33,
          },
          0.3,
          pc.BackOut
        )
        .start();
    var e = this.muzzlePoint.getPosition(),
      n = this.meleePoint.getPosition(),
      s = Math.round(20 * Math.random()) + 80;
    this.app.fire('EffectManager:Hit', 'Melee', e, n, this.playerId, s),
      setTimeout(
        function (t) {
          t.meleeEntity.enabled = !1;
        },
        300,
        this
      );
  }),
  (Enemy.prototype.bounceJump = function () {
    var t = Math.round(1 * Math.random()) + 1;
    (this.isJumping = !0),
      (this.characterEntity.animation.speed = 1),
      this.setAnimation('Jump-' + t, 0.1, !1);
    this.entity.sound.play('Bounce-Jump');
  }),
  (Enemy.prototype.setLagCompensatorMovement = function (t) {}),
  (Enemy.prototype.setDirection = function () {
    if (
      this.isDeath ||
      this.isJumping ||
      this.isEmotePlaying ||
      this.isDashing ||
      this.isGliding ||
      this.isGrappling
    )
      return !1;
    var t = 'none';
    if (
      (this.isForward && this.isLeft
        ? (t = 'Forward-Left')
        : this.isForward && this.isRight
        ? (t = 'Forward-Right')
        : this.isBackward && this.isLeft
        ? (t = 'Backward-Left')
        : this.isBackward && this.isRight
        ? (t = 'Backward-Right')
        : this.isForward
        ? (t = 'Forward')
        : this.isBackward
        ? (t = 'Backward')
        : this.isLeft
        ? (t = 'Left')
        : this.isRight && (t = 'Right'),
      'none' != t)
    ) {
      var i = Math.min(
        Math.max(this.speed / pc.variables.enemySpeed, pc.variables.minEnemySpeed),
        pc.variables.maxEnemySpeed
      );
      'none' != this.lastDirection && this.setAnimation(this.lastDirection, 0.1, !0),
        (this.characterEntity.animation.speed = pc.math.lerp(
          this.characterEntity.animation.speed,
          i,
          0.3
        )),
        this.setLagCompensatorMovement(t),
        this.entity.sound.slots.Footsteps.isPlaying || this.entity.sound.play('Footsteps'),
        (this.lastDirection = t);
    } else this.entity.sound.stop('Footsteps'), this.setAnimation('Idle', 0.2, !0);
  }),
  (Enemy.prototype.updateShooting = function () {
    this.shootingState &&
      !this.isShootingLocked &&
      (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
      this.isShooting > this.timestamp && !this.isShootingLocked && this.shoot(),
      this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1);
  }),
  (Enemy.prototype.setPosition = function (t, i, e, n, s) {
    if (this.isDeath) return !1;
    (this.nextPosition.x = t),
      (this.nextPosition.y = i),
      (this.nextPosition.z = e),
      (this.nextAngle.x = s * pc.math.DEG_TO_RAD),
      (this.nextAngle.y = n * pc.math.DEG_TO_RAD - 90),
      this.isActivated && this.entity.setPosition(t, i, e);
    var a = Date.now() - this.lastDeltaDate;
    (a = a < 40 ? 0.3 : a < 200 ? 0.03 : a < 600 ? 0.01 : 0.4),
      this.app.fire('EffectManager:SetEntityPosition', this.nextPosition),
      (this.lastDeltaDate = Date.now()),
      (this.delta = pc.math.lerp(this.delta, a, 0.05));
  }),
  (Enemy.prototype.setConnectionState = function () {
    this.isActivated || (this.modelHolder.enabled = !0);
  }),
  (Enemy.prototype.setMovement = function (t) {
    (this.speed = this.entity.getPosition().clone().sub(this.nextPosition.clone()).length()),
      this.speed > 20 && this.teleport(),
      (this.tempAngle = this.tempAngle.lerp(this.tempAngle, Utils.zeroVector, 0.1)),
      (this.currentPosition = this.currentPosition.lerp(
        this.currentPosition,
        this.nextPosition,
        this.delta
      )),
      (this.currentAngle.x = pc.math.lerpAngle(this.currentAngle.x, this.nextAngle.x, this.delta)),
      (this.currentAngle.y = pc.math.lerpAngle(this.currentAngle.y, this.nextAngle.y, this.delta)),
      this.entity.setPosition(this.currentPosition);
    var i = -this.currentAngle.x * pc.math.RAD_TO_DEG - this.tempAngle.x * pc.math.RAD_TO_DEG;
    this.headEntity &&
      this.headEntity.setLocalEulerAngles(this.headAngleX, this.headAngleY, this.headAngleZ),
      this.spineEntity &&
        this.spineEntity.setLocalEulerAngles(
          i * this.spineFactorX + this.spineDirectionX,
          i * this.spineFactorY + this.spineDirectionY,
          i * this.spineFactorZ + this.spineDirectionZ
        ),
      this.characterEntity.setLocalEulerAngles(
        0,
        this.currentAngle.y * pc.math.RAD_TO_DEG -
          this.tempAngle.y * pc.math.RAD_TO_DEG -
          this.bodyAngle,
        0
      ),
      this.bodyEntity.setLocalEulerAngles(
        -this.currentAngle.x * pc.math.RAD_TO_DEG,
        this.currentAngle.y * pc.math.RAD_TO_DEG - this.bodyAngle,
        0
      );
  }),
  (Enemy.prototype.update = function (t) {
    if (this.isActivated) return !1;
    this.setMovement(t), (this.lastDelta += t);
    var i = this.lastDelta;
    i > pc.dt - 0.001 &&
      (this.setDirection(), this.updateShooting(), (this.timestamp += i), (this.lastDelta = 0));
  });
var MapManager = pc.createScript('mapManager');
MapManager.attributes.add('defaultMap', {
  type: 'string',
}),
  MapManager.attributes.add('mapHolder', {
    type: 'entity',
  }),
  MapManager.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  MapManager.attributes.add('autoLoad', {
    type: 'boolean',
    default: !1,
  }),
  (MapManager.prototype.initialize = function () {
    this.autoLoad &&
      ('undefined' != typeof app && (this.defaultMap = app.session.map),
      this.loadMap(this.defaultMap)),
      (this.mapName = !1),
      (this.mapTimer = !1),
      (this.isLoaded = !1),
      (this.isLoading = 0),
      this.app.on('Map:Load', this.loadMap, this),
      this.app.on('Map:Destroy', this.onDestroy, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Map:Thunder', this.thunder, this),
      this.app.on('Game:PreStart', this.onPreStart, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      (pc.isMapLoaded = !1),
      this.setRandomSounds();
  }),
  (MapManager.prototype.onPreStart = function () {
    (this.isLoaded = !1), this.cameraEntity && (this.cameraEntity.enabled = !1);
  }),
  (MapManager.prototype.onFinish = function () {
    (this.isLoaded = !1), this.cameraEntity && (this.cameraEntity.enabled = !0);
  }),
  (MapManager.prototype.onMapLoaded = function () {
    this.onSettingsChange();
  }),
  (MapManager.prototype.onDestroy = function (a) {
    this.clearHolder(), this.mapHolder.destroy(), this.entity.destroy();
  }),
  (MapManager.prototype.loadMap = function (a) {
    if (this.currentMapName == a) return this._onMapLoaded(), !1;
    var t = this,
      e = this.app.scenes.find(a);
    (this.currentMapName = a),
      console.log('Called map:', a),
      e
        ? this.clearHolder(function () {
            console.log('Holder is clear, loading: ', a), t.setMap(a);
          })
        : (console.log('[DEBUG] This map is a custom map, loading from CDN'),
          this.clearHolder(function () {
            console.log('Holder is clear, loading: ', a), t.loadCustomMap(a);
          }));
  }),
  (MapManager.prototype.loadCustomMap = function (a) {
    this.app.fire('Fetcher:MapManager', {
      name: a,
    }),
      (pc.currentModeOptions = {
        noWeaponChange: !0,
      }),
      (this.isLoaded = !1),
      this._onMapLoad();
  }),
  (MapManager.prototype.setMap = function (a) {
    if (this.isLoaded) return !1;
    console.log('Loading map : ', a), (this.mapName = a);
    var t = this,
      e = this.app.scenes.find(a),
      o = '1.0.0';
    'undefined' != typeof VERSION && (o = VERSION),
      (this.isLoading = Date.now()),
      (pc.isMapLoaded = !1);
    var i = this.app.root.findByName('Map');
    i && i.sound && (i.sound.stop('Ambient'), i.sound.stop('Rain')),
      e &&
        e.url &&
        (this.app.scenes.loadSceneHierarchy(e.url + '?v=' + o, function (a, i) {
          i &&
            (t.mapHolder.reparent(i),
            t.app.scenes.loadSceneSettings(e.url + '?v=' + o, function (a, e) {
              t.onMapLoad();
            }),
            pc.app.fire('Map:Reparent', !0)),
            a && console.log('[ERROR] ', a);
        }),
        (this.isLoaded = !0));
  }),
  (MapManager.prototype.onMapLoad = function () {
    var a = this,
      t = this.app.root.findByTag('CustomCollision');
    if (t.length > 0) {
      var e = 0;
      for (var o in t) {
        var i = t[o].collision.asset;
        this.app.assets.get(i).ready(function () {
          e++, t.length <= e && a._onMapLoad();
        });
      }
    } else this._onMapLoad();
  }),
  (MapManager.prototype._onMapLoaded = function () {
    clearTimeout(pc.mapLoadTimer),
      (pc.mapLoadTimer = setTimeout(function () {
        (pc.isMapLoaded = !0),
          pc.app.fire('Map:Reparent', !0),
          pc.app.fire('Map:Loaded', !0),
          pc.app.batcher.generate();
      }, 2e3));
  }),
  (MapManager.prototype._onMapLoad = function () {
    this._onMapLoaded();
    var a = this.app.root.findByName('MenuCamera');
    a && this.cameraEntity && this.cameraEntity.setLocalPosition(a.getPosition());
  }),
  (MapManager.prototype.onSettingsChange = function () {
    if (!pc.settings) return !1;
    var a = this.app.root.findByName('Light');
    a &&
      (!0 === pc.settings.disableShadows ? (a.light.castShadows = !1) : (a.light.castShadows = !0));
  }),
  (MapManager.prototype.thunder = function () {
    if (Utils.isMobile()) return !1;
    var a = this.app.scene.exposure + 1e-4;
    (this.app.scene.exposure = a + 15),
      this.app
        .tween(this.app.scene)
        .to(
          {
            exposure: a,
          },
          0.1,
          pc.Linear
        )
        .delay(0.15)
        .start(),
      (this.entity.sound.slots.Thunder.pitch = 1 + 0.2 * Math.random()),
      this.entity.sound.play('Thunder');
  }),
  (MapManager.prototype.setRandomSounds = function () {
    'Mistle' == this.mapName && this.entity.sound.play('Seagull'),
      setTimeout(
        function (a) {
          a.setRandomSounds();
        },
        1e3 * (50 + 90 * Math.random()),
        this
      );
  }),
  (MapManager.prototype.clearHolder = function (a) {
    var t = this.app.root.findByName('MapHolder');
    t
      ? ((this.isLoaded = !1),
        t.on('destroy', function () {
          console.log('Destroy properly completed!'), a && a();
        }),
        t.destroy())
      : a && a(),
      this.app.fire('MapLoader:Clear', !0);
  });
var PhysicsManager = pc.createScript('physicsManager');
PhysicsManager.attributes.add('mapHolder', {
  type: 'entity',
}),
  PhysicsManager.attributes.add('playerEntity', {
    type: 'entity',
  }),
  (PhysicsManager.prototype.initialize = function () {});
var Menu = pc.createScript('menu');
Menu.attributes.add('cameraEntity', {
  type: 'entity',
}),
  Menu.attributes.add('originEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('linkEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('header', {
    type: 'entity',
  }),
  Menu.attributes.add('contentHolder', {
    type: 'entity',
  }),
  Menu.attributes.add('shopIconEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('characterEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('characterHolder', {
    type: 'entity',
  }),
  Menu.attributes.add('lightRoomEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('menuColor', {
    type: 'rgb',
  }),
  Menu.attributes.add('sideEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('weaponName', {
    type: 'entity',
  }),
  Menu.attributes.add('weaponEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('weaponIcon', {
    type: 'entity',
  }),
  Menu.attributes.add('matchFoundBackground', {
    type: 'entity',
  }),
  Menu.attributes.add('matchFoundText', {
    type: 'entity',
  }),
  Menu.attributes.add('matchFoundRectangle', {
    type: 'entity',
  }),
  Menu.attributes.add('matchFoundCenter', {
    type: 'entity',
  }),
  Menu.attributes.add('matchFoundLoading', {
    type: 'entity',
  }),
  Menu.attributes.add('characterIcon', {
    type: 'entity',
  }),
  Menu.attributes.add('characterName', {
    type: 'entity',
  }),
  Menu.attributes.add('meleeIcon', {
    type: 'entity',
  }),
  Menu.attributes.add('throwIcon', {
    type: 'entity',
  }),
  Menu.attributes.add('streamEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('streamEntityContainer', {
    type: 'entity',
  }),
  Menu.attributes.add('twitchName', {
    type: 'entity',
  }),
  Menu.attributes.add('twitchButton', {
    type: 'entity',
  }),
  Menu.attributes.add('twitchProfilePicture', {
    type: 'entity',
  }),
  Menu.attributes.add('youtubeName', {
    type: 'entity',
  }),
  Menu.attributes.add('youtubeButton', {
    type: 'entity',
  }),
  Menu.attributes.add('youtubeShopName', {
    type: 'entity',
  }),
  Menu.attributes.add('youtubeShopButton', {
    type: 'entity',
  }),
  Menu.attributes.add('miniProfileEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('versionEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('updateEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('updateVersionEntity', {
    type: 'entity',
  }),
  Menu.attributes.add('streamerImage', {
    type: 'entity',
  }),
  Menu.attributes.add('bannerImage', {
    type: 'entity',
  }),
  Menu.attributes.add('offerPopup', {
    type: 'entity',
  }),
  Menu.attributes.add('boostPopup', {
    type: 'entity',
  }),
  Menu.attributes.add('mobileWaiting', {
    type: 'entity',
  }),
  Menu.attributes.add('mobileFreeCoin', {
    type: 'entity',
  }),
  Menu.attributes.add('mobileRedirection', {
    type: 'entity',
  }),
  Menu.attributes.add('mobileUsernameChange', {
    type: 'entity',
  }),
  (Menu.prototype.initialize = function () {
    if (
      ((this.currentWidth = 0),
      (this.currentHeight = 0),
      (this.timestamp = 0),
      (this.originRotation = 10),
      (this.isMatchFound = !1),
      (this.isConnected = !1),
      (pc.session = {
        weapon: 'Scar',
        character: 'Lilium',
        hash: !1,
        username: !1,
      }),
      (this.app.loader.getHandler('texture').crossOrigin = 'anonymous'),
      this.app.on('Player:Weapon', this.onWeaponSelect, this),
      this.app.on('Player:Character', this.onCharacterSelect, this),
      this.app.on('Template:Profile', this.onProfileData, this),
      this.app.on('Game:Found', this.onMatchFound, this),
      this.app.on('Game:Connect', this.onConnect, this),
      this.app.on('Menu:Mute', this.setMute, this),
      this.app.on('Menu:SetHome', this.setHome, this),
      this.app.on('Menu:CloseMobile', this.onCloseMobile, this),
      this.app.mouse.on('mousemove', this.onMouseMove, this),
      this.app.on('Menu:BuyOffer', this.onOfferBuy, this),
      this.app.on('Menu:CloseOffer', this.onOfferClose, this),
      this.app.on('Menu:GetBoost', this.onBoostGet, this),
      this.app.on('Menu:CloseBoost', this.onBoostClose, this),
      this.app.on('Menu:ClearQuests', this.clearQuests, this),
      this.app.on('Buy:State', this.onMobileBuyState, this),
      this.app.on('Buy:ApplyCode', this.applyCreatorCode, this),
      this.app.on('Buy:Coins', this.onBuyCoins, this),
      this.app.on('Menu:Music', this.setMenuMusic, this),
      (this.mobileUUID = !1),
      this.app.on('Account:CreateMobileUser', this.createMobileUser, this),
      this.app.on('Account:SaveUUID', this.onSaveUUID, this),
      this.app.on('Account:ChangeUsername', this.triggerChangeUsername, this),
      this.app.on('Account:ChangeStatus', this.onChangeStatus, this),
      this.app.on('Account:Reward', this.onAccountReward, this),
      this.app.on('CustomCSS:Loaded', this.setCustomCSS, this),
      this.app.on('Page:Menu', this.onPageChange, this),
      this.app.on('Tab:Settings', this.onSettings, this),
      this.setProfile(),
      this.setBanner(),
      this.setMobileElements(),
      this.app.on('Sound:Play', this.onSoundPlay, this),
      this.attachCharacterEntity(),
      this.entity.on('destroy', this.onDestroy, this),
      'undefined' != typeof VERSION_CODE && (this.versionEntity.element.text = 'v' + VERSION_CODE),
      this.mobileRedirection && pc.isMobile,
      Utils.isMobile() &&
        (this.mobileFreeCoin.setLocalScale(1.2, 1.2, 1.2),
        this.sideEntity.setLocalScale(1.331, 1.331, 1.331)),
      pc.isMobile)
    ) {
      Utils.getItem('MobileUsernameChanged') && this.mobileUsernameChange.destroy();
      try {
        window.webkit.messageHandlers.iosListener.postMessage('request-uuid');
      } catch (t) {}
      this.app.root.findByPath('MenuHolder/Menu/Content/Shop').script.tab.menu.splice(2, 1),
        this.app.root.findByPath('MenuHolder/Menu/Content/Shop').script.tab.page.splice(2, 1),
        (this.offerAccepted = !1);
    } else this.mobileUsernameChange.destroy();
    (this.lightRoomEntity.enabled = !1),
      (this.app.scene.layers.getLayerByName('Lightroom').enabled = !0),
      (this.app.scene.layers.getLayerByName('Lightroom-Top').enabled = !0),
      setTimeout(
        function (t) {
          t.setShopNotification(), t.setLeftEarlyNotification();
        },
        100,
        this
      ),
      this.app.fire('Ads:Adblock', !0),
      this.app.fire('Analytics:Event', 'Checkpoint', 'Menu');
  }),
  (Menu.prototype.clearQuests = function () {
    Utils.deleteItem('Storage');
  }),
  (Menu.prototype.applyCreatorCode = function (t) {
    this.app.fire('Fetcher:CreatorCode', {
      creator_code: t,
    }),
      setTimeout(
        function (t) {
          pc.app.fire('Popup:Coins');
        },
        1500,
        this
      );
  }),
  (Menu.prototype.onBuyCoins = function () {
    this.app.fire('Notify:Notify', "You don't have enough coins"),
      setTimeout(
        function (t) {
          t.app.fire('Popup:Coins');
        },
        1e3,
        this
      );
  }),
  (Menu.prototype.setCustomCSS = function () {
    accountManager.init();
  }),
  (Menu.prototype.setLeftEarlyNotification = function () {
    'Left' === Utils.getItem('LeftEarly') &&
      Math.random() > 0.5 &&
      this.app.fire('Alert:Menu', 'Leaving matches early will affect your scores.'),
      Utils.setItem('LeftEarly', 'Clear');
  }),
  (Menu.prototype.setShopNotification = function () {
    var t = !1;
    Utils.getItem('LastVersion') != VERSION_CODE &&
      ((t = !0), Utils.setItem('LastVersion', VERSION_CODE)),
      this.app.fire('ConditionPositioning:Shop', {
        new_items: t,
      });
  }),
  (Menu.prototype.inFrame = function () {
    try {
      return window.self !== window.top;
    } catch (t) {
      return !0;
    }
  }),
  (Menu.prototype.onMobileBuyState = function (t) {
    this.offerAccepted &&
      ('error' == t
        ? this.app.fire('Alert:Menu', 'An error occured on payment!')
        : ('successful' == t || 'restored' == t) &&
          (this.app.fire('Fetcher:MobilePayment', {
            token: 'mobile-process',
            sku: '10000VG',
          }),
          this.onOfferClose(),
          Utils.setItem('MobileAds', 'NoAds')));
  }),
  (Menu.prototype.onOfferClose = function () {
    (this.offerPopup.enabled = !1), Utils.setItem('MobileOffer', 'Offered');
  }),
  (Menu.prototype.onBoostGet = function () {
    this.app.fire(
      'Ads:Preroll',
      function () {
        pc.app.fire('Alert:Menu', 'Boost activated for your game session!'),
          (pc.app.systems.sound.volume = 0.25);
      },
      function () {
        pc.app.fire('Alert:Menu', 'Please disable adblock to enable rewards!'),
          (pc.app.systems.sound.volume = 0.25);
      }
    );
  }),
  (Menu.prototype.onBoostClose = function () {
    this.boostPopup.enabled = !1;
  }),
  (Menu.prototype.onOfferBuy = function () {
    (this.offerAccepted = !0), window.webkit.messageHandlers.iosListener.postMessage('buy:10000VG');
  }),
  (Menu.prototype.onAccountReward = function () {
    this.app.fire('Ads:BannerDestroy', 'venge-io_728x90', '728x90'),
      (this.app.systems.sound.volume = 0),
      this.app.fire(
        'Ads:Preroll',
        function () {
          pc.app.fire('Ads:BannerSet', 'venge-io_728x90', '728x90'),
            pc.app.fire('Fetcher:Reward', !0),
            (pc.app.systems.sound.volume = 0.25);
        },
        function () {
          pc.app.fire('Ads:BannerSet', 'venge-io_728x90', '728x90'),
            pc.app.fire('Alert:Menu', 'Please disable adblock to enable rewards!'),
            (pc.app.systems.sound.volume = 0.25);
        }
      ),
      this.app.fire('Analytics:Event', 'RewardAds', 'FromMenu');
  }),
  (Menu.prototype.setMenuMusic = function (t) {
    this.entity && this.entity.sound;
  }),
  (Menu.prototype.onMouseMove = function (t) {
    this.originRotation += 0.01 * t.dx;
  }),
  (Menu.prototype.onSaveUUID = function () {
    this.mobileUUID &&
      (Utils.setItem('MobileHash', this.mobileUUID),
      setTimeout(
        function (t) {
          (t.mobileWaiting.enabled = !1), window.location.reload(!0);
        },
        1e3,
        this
      ));
  }),
  (Menu.prototype.createMobileUser = function (t) {
    var e = Utils.getItem('Hash');
    !Utils.isMobile() ||
      (e && 'undefined' != e) ||
      (this.app.fire('Fetcher:MobileAccount', {
        username: 'mobile_' + t,
        password: 'pass_' + t,
      }),
      (this.mobileWaiting.enabled = !0),
      (this.mobileUUID = t));
  }),
  (Menu.prototype.triggerChangeUsername = function () {
    var t = prompt('Enter new username', '');
    null !== t &&
      this.app.fire('Fetcher:MobileUsername', {
        username: t,
      });
  }),
  (Menu.prototype.onChangeStatus = function (t) {
    this.app.fire('Fetcher:MiniProfile', !0), Utils.setItem('MobileUsernameChanged', !0);
  }),
  (Menu.prototype.setMobileElements = function () {
    if (Utils.isMobile()) {
      var t = this.app.root.findByTag('DesktopOnly');
      for (var e in t) {
        t[e].enabled = !1;
      }
      this.contentHolder.setLocalPosition(0, -90, 0),
        this.contentHolder.setLocalScale(1.2, 1.2, 1.2);
    }
  }),
  (Menu.prototype.onCloseMobile = function () {
    this.mobileRedirection.enabled = !1;
  }),
  (Menu.prototype.attachCharacterEntity = function () {
    var t = 'Character1_RightHand';
    'Lilium' == pc.session.character
      ? (t = 'Character1_RightHand')
      : 'Shin' == pc.session.character
      ? (t = 'Hand_R')
      : 'Echo' == pc.session.character
      ? (t = 'hand_r')
      : 'Kulu' == pc.session.character && (t = 'Weapon_Rig');
    var e = this.characterEntity.model.asset,
      i = this.app.assets.get(e),
      n = this;
    i.ready(function () {
      var e = n.characterEntity.findByName(t);
      e &&
        ((n.weaponEntity = n.characterEntity.findByName('Weapon')),
        n.weaponEntity.setLocalScale(100, 100, 100),
        n.weaponEntity.reparent(e));
    }),
      this.app.fire('Player:Weapon', pc.session.weapon);
  }),
  (Menu.prototype.onPageChange = function (t) {
    'Shop' == t
      ? (this.app.fire('Show:Character', 'Hide'), (this.lightRoomEntity.enabled = !0))
      : (this.app.fire('CustomColor:Background', {
          color: this.menuColor,
        }),
        (this.lightRoomEntity.enabled = !1)),
      'Match' == t && this.app.fire('Show:Character', 'Show'),
      setTimeout(
        function (t) {
          t.app.fire('DOM:Update', !0);
        },
        100,
        this
      ),
      this.app.fire('ConditionPositioning:Menu', {
        page: t,
      });
  }),
  (Menu.prototype.onSettings = function (t) {}),
  (Menu.prototype.setHome = function (t) {
    if (this.isConnected) return !1;
    if (
      ('undefined' != typeof VERSION_CODE &&
        'DEV' != VERSION_CODE &&
        (VERSION_CODE == t.version ||
          pc.isMobile ||
          ((this.updateEntity.enabled = !0), (this.updateVersionEntity.element.text = t.version))),
      t && t.official_stream_data)
    ) {
      var e = '';
      (e += '<iframe'),
        (e += ' src="https://player.twitch.tv/?channel=' + t.official_stream_data),
        (e += '&parent=venge.io"'),
        (e += ' height="100%"'),
        (e += ' width="100%"'),
        (e += ' frameborder="0"'),
        (e += ' scrolling="false"'),
        (e += ' allowfullscreen="true">'),
        (e += '</iframe>'),
        (this.streamEntity.enabled = !0),
        (this.streamEntityContainer.script.container.element.innerHTML = e);
    } else this.streamEntity.enabled = !1;
    this.streamerImage && t.preview_image
      ? (this.streamerImage.fire('CustomImage:Set', t),
        this.streamerImage.script.button.setLink(t.preview_link),
        this.app.fire('CustomText:StreamerText', t),
        (this.streamerImage.enabled = !0))
      : (this.streamerImage.enabled = !1),
      Math.random() > 0.2
        ? ((this.streamerImage.enabled = !0), (this.bannerImage.enabled = !1))
        : ((this.streamerImage.enabled = !1), (this.bannerImage.enabled = !0)),
      t.youtuber_shop &&
        t.youtuber_shop.name &&
        ((this.youtubeShopName.element.text = t.youtuber_shop.name.slice(0, 50)),
        this.youtubeShopButton.script.button.setLink(t.youtuber_shop.link)),
      t.server && this.app.fire('RoomManager:SetServer', t.server);
  }),
  (Menu.prototype.setMute = function () {
    this.entity.sound.stop('Loop');
  }),
  (Menu.prototype.setProfile = function () {
    var t = Utils.getItem('Hash');
    if (
      (void 0 !== t && (pc.session.hash = t),
      window.location.href.search('create-account') > -1 &&
        setTimeout(function () {
          pc.app.fire('AccountManager:Signup', !0);
        }, 50),
      window.location.href.search('login') > -1 &&
        setTimeout(function () {
          pc.app.fire('Page:Menu', 'Account'),
            setTimeout(function () {
              pc.app.fire('Tab:Login', 'Login');
            }, 10);
        }, 50),
      window.location.href.search('code') > -1)
    ) {
      var e = window.location.href.split('=')[1];
      setTimeout(function () {
        pc.app.fire('Page:Menu', 'Shop'),
          setTimeout(function () {
            pc.app.fire('Tab:Shop', 'Buy VG'),
              setTimeout(function () {
                console.log('Code set : ', e),
                  pc.app.fire('Input:Input', e),
                  pc.app.fire('Form:CreatorCode', !0);
              }, 100);
          }, 10);
      }, 50);
    }
    if (window.location.href.search('custom') > -1) {
      e = window.location.href.split('=')[1];
      setTimeout(function () {
        pc.app.fire('Page:Menu', 'Custom');
      }, 50);
    }
  }),
  (Menu.prototype.onProfileData = function (t) {
    if (this.isMatchFound) return !1;
    if (
      t &&
      ((pc.session.hash = t.hash),
      (pc.session.username = t.username),
      Utils.setItem('Hash', t.hash),
      t.username && this.miniProfileEntity && this.miniProfileEntity.element)
    )
      this.miniProfileEntity.findByName('Username').element.width;
  }),
  (Menu.prototype.onDestroy = function (t) {
    this.app.off('Sound:Play'),
      this.app.off('Player:Weapon'),
      this.app.mouse.off('mousemove', this.onMouseMove, this);
  }),
  (Menu.prototype.onSoundPlay = function (t) {
    this.entity && this.entity.enabled && this.entity.sound.play(t);
  }),
  (Menu.prototype.onMatchFound = function () {
    (this.isMatchFound = !0),
      (this.app.scene.layers.getLayerByName('Lightroom').enabled = !1),
      (this.app.scene.layers.getLayerByName('Lightroom-Top').enabled = !1),
      clearTimeout(this.bannerTimeout),
      this.app.fire('Ads:BannerDestroy', 'venge-io_728x90', '728x90'),
      this.app.fire('DOM:Clear', !0),
      this.app.off('Player:Character'),
      this.app.fire('Popup:Close', !0),
      (this.matchFoundBackground.enabled = !0),
      this.matchFoundBackground
        .tween(this.matchFoundBackground.element)
        .to(
          {
            opacity: 1,
          },
          1,
          pc.Linear
        )
        .start(),
      (this.matchFoundRectangle.element.opacity = 1),
      this.matchFoundRectangle.setLocalScale(20, 1, 1),
      this.matchFoundRectangle
        .tween(this.matchFoundRectangle.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      this.matchFoundRectangle
        .tween(this.matchFoundRectangle.element)
        .to(
          {
            opacity: 0.1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      this.matchFoundCenter
        .tween(this.matchFoundCenter.getLocalScale())
        .to(
          {
            x: 1.2,
            y: 1.2,
            z: 1.2,
          },
          2,
          pc.Linear
        )
        .start(),
      setTimeout(
        function (t) {
          (t.matchFoundLoading.enabled = !0),
            t.matchFoundRectangle
              .tween(t.matchFoundRectangle.element)
              .to(
                {
                  opacity: 0,
                },
                0.5,
                pc.Linear
              )
              .start(),
            t.matchFoundText
              .tween(t.matchFoundText.element)
              .to(
                {
                  opacity: 0,
                },
                0.5,
                pc.Linear
              )
              .start(),
            setTimeout(function () {
              pc.app.fire('Game:Connect', !0);
            }, 600);
        },
        1500,
        this
      );
  }),
  (Menu.prototype.onConnect = function () {
    var t = this.app.scenes.find('Prototype'),
      e = this.app.root,
      i = '1.0.0';
    'undefined' != typeof VERSION && (i = VERSION),
      (this.isConnected = !0),
      this.app.root.findByName('MenuHolder').destroy(),
      this.app.scenes.loadSceneHierarchy(t.url + '?v=' + i, function (t, i) {
        i.reparent(e);
      });
  }),
  (Menu.prototype.onWeaponSelect = function (t) {
    var e = this.weaponEntity.findByTag('Weapon'),
      i = this.app.assets.find(t + '-Thumbnail-White.png');
    for (var n in e) {
      e[n].enabled = !1;
    }
    (this.weaponEntity.findByName(t).enabled = !0),
      (this.weaponIcon.element.textureAsset = i),
      (this.weaponName.element.text = t.toLowerCase()),
      this.entity.sound.play('Whoosh'),
      (pc.session.weapon = t);
  }),
  (Menu.prototype.onCharacterSelect = function (t) {
    var e = this.characterHolder.findByTag('Character');
    this.app.assets.find(t + '-Thumbnail-3');
    for (var i in e) {
      e[i].enabled = !1;
    }
    var n = this.characterHolder.findByName(t);
    (this.characterEntity = n),
      (this.characterEntity.enabled = !0),
      (this.characterName.element.text = t.toLowerCase()),
      this.entity.sound.play('Whoosh');
    var o = this.characterEntity.model.asset,
      a = this.app.assets.get(o),
      s = this;
    a.ready(function () {
      s.attachCharacterEntity();
    }),
      (pc.session.character = t);
  }),
  (Menu.prototype.checkScreenSize = function () {
    if (window.innerWidth != this.currentWidth || window.innerHeight != this.currentHeight) {
      var t = this.entity.findByTag('ScreenSize');
      for (var e in t) {
        var i = t[e];
        (i.element.width = window.innerWidth), (i.element.height = window.innerHeight);
      }
      (this.currentWidth = window.innerWidth), (this.currentHeight = window.innerHeight);
    }
  }),
  (Menu.prototype.setBanner = function () {
    Utils.isMobile()
      ? this.app.fire('Ads:BannerSet', 'venge-io_320x50', '320x50')
      : this.app.fire('Ads:BannerSet', 'venge-io_728x90', '728x90');
  }),
  (Menu.prototype.update = function (t) {
    this.checkScreenSize(),
      (this.originRotation = pc.math.lerp(this.originRotation, 0, 0.02)),
      this.originEntity.setLocalEulerAngles(0, this.originRotation, 0),
      this.app.scene.skyboxRotation &&
        ((this.app.scene.skyboxRotation.y -= 0.005 * t),
        this.app.scene._resetSkyboxModel(),
        (this.timestamp += t));
  });
Object.assign(
  pc,
  (function () {
    var BlackWhiteEffect = function (t) {
      pc.PostEffect.call(this, t);
      var e = {
          aPosition: pc.SEMANTIC_POSITION,
        },
        i = [
          'attribute vec2 aPosition;',
          '',
          'varying vec2 vUv0;',
          '',
          'void main(void)',
          '{',
          '    gl_Position = vec4(aPosition, 0.0, 1.0);',
          '    vUv0 = (aPosition.xy + 1.0) * 0.5;',
          '}',
        ].join('\n'),
        c = [
          'precision ' + t.precision + ' float;',
          '',
          'uniform sampler2D uColorBuffer;',
          'varying vec2 vUv0;',
          '',
          'void main() {',
          '    vec4 color = texture2D(uColorBuffer, vUv0);',
          '    float gray = dot(color.rgb, vec3(0.199, 0.587, 0.114));',
          '    gl_FragColor = vec4(vec3(gray), 1.0);',
          '}',
        ].join('\n');
      this.blackWhiteShader = new pc.Shader(t, {
        attributes: e,
        vshader: i,
        fshader: c,
      });
    };
    return (
      ((BlackWhiteEffect.prototype = Object.create(pc.PostEffect.prototype)).constructor =
        BlackWhiteEffect),
      Object.assign(BlackWhiteEffect.prototype, {
        render: function (t, e, i) {
          var c = this.device;
          c.scope.resolve('uColorBuffer').setValue(t.colorBuffer),
            pc.drawFullscreenQuad(c, e, this.vertexBuffer, this.blackWhiteShader, i);
        },
      }),
      {
        BlackWhiteEffect: BlackWhiteEffect,
      }
    );
  })()
);
var BlackWhite = pc.createScript('blackWhite');
BlackWhite.prototype.initialize = function () {
  (this.effect = new pc.BlackWhiteEffect(this.app.graphicsDevice)),
    (this.effect.offset = this.offset),
    (this.effect.darkness = this.darkness),
    this.on(
      'attr',
      function (t, e) {
        this.effect[t] = e;
      },
      this
    );
  var t = this.entity.camera.postEffects;
  t.addEffect(this.effect),
    this.on('state', function (e) {
      e ? t.addEffect(this.effect) : t.removeEffect(this.effect);
    }),
    this.on('destroy', function () {
      t.removeEffect(this.effect);
    });
};
var Variables = pc.createScript('variables');
Variables.attributes.add('redTeamColor', {
  type: 'rgb',
}),
  Variables.attributes.add('blueTeamColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('enemyColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('friendlyColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('meColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('lowHealth', {
    type: 'rgb',
  }),
  Variables.attributes.add('health', {
    type: 'rgb',
  }),
  Variables.attributes.add('grayColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('captureColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('blackColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('purpleColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('whiteColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('greenColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('explosive', {
    type: 'rgb',
  }),
  Variables.attributes.add('danger', {
    type: 'rgb',
  }),
  Variables.attributes.add('activeColor', {
    type: 'rgb',
  }),
  Variables.attributes.add('enemySpeed', {
    type: 'number',
  }),
  Variables.attributes.add('maxEnemySpeed', {
    type: 'number',
  }),
  Variables.attributes.add('minEnemySpeed', {
    type: 'number',
  }),
  Variables.attributes.add('minEnemyVelocity', {
    type: 'number',
  }),
  (Variables.prototype.initialize = function () {
    (pc.colors = {}),
      (pc.colors.lowHealth = this.lowHealth),
      (pc.colors.health = this.health),
      (pc.colors.capture = this.captureColor),
      (pc.colors.black = this.blackColor),
      (pc.colors.purple = this.purpleColor),
      (pc.colors.white = this.whiteColor),
      (pc.colors.gray = this.grayColor),
      (pc.colors.green = this.greenColor),
      (pc.colors.transparent = new pc.Color(0, 0, 0, 0)),
      (pc.colors.redTeam = this.redTeamColor),
      (pc.colors.blueTeam = this.blueTeamColor),
      (pc.colors.enemy = this.enemyColor),
      (pc.colors.friendly = this.friendlyColor),
      (pc.colors.me = this.meColor),
      (pc.colors.active = this.activeColor),
      (pc.colors.danger = this.danger),
      (pc.colors.explosive = this.explosive),
      (pc.variables = {}),
      (pc.variables.enemySpeed = this.enemySpeed),
      (pc.variables.minEnemySpeed = this.minEnemySpeed),
      (pc.variables.maxEnemySpeed = this.maxEnemySpeed),
      (pc.variables.minEnemyVelocity = this.minEnemyVelocity);
  });
var Label = pc.createScript('label');
Label.attributes.add('headPoint', {
  type: 'entity',
}),
  Label.attributes.add('labelEntity', {
    type: 'entity',
  }),
  Label.attributes.add('spectatorLabelEntity', {
    type: 'entity',
  }),
  Label.attributes.add('screenEntity', {
    type: 'entity',
  }),
  Label.attributes.add('spectatorScreenEntity', {
    type: 'entity',
  }),
  Label.attributes.add('labelHolder', {
    type: 'entity',
  }),
  Label.attributes.add('spectatorLabelHolder', {
    type: 'entity',
  }),
  Label.attributes.add('abilityEntity', {
    type: 'entity',
  }),
  Label.attributes.add('flagEntity', {
    type: 'entity',
  }),
  Label.attributes.add('playerCameraEntity', {
    type: 'entity',
  }),
  Label.attributes.add('spectatorCameraEntity', {
    type: 'entity',
  }),
  (Label.prototype.initialize = function () {
    (this.isInitalized = !1),
      (this.alwaysShow = !1),
      (this.team = 'none'),
      (this.isEnabled = !1),
      (this.originalUsername = 'Guest'),
      (this.usernameEntity = !1),
      this.entity.on('Health', this.setHealth, this),
      this.app.on('Game:Mode', this.onGameMode, this),
      this.app.on('Game:Finish', this.onGameFinish, this),
      this.app.on('Player:Respawn', this.onPlayerRespawn, this),
      this.app.on('Player:Death', this.onPlayerDeath, this),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      this.app.on('Label:Show', this.showLabel, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Label.prototype.onDestroy = function () {
    this.app.off('Game:Mode', this.onGameMode, this),
      this.app.off('Game:Finish', this.onGameFinish, this),
      this.app.off('Player:Respawn', this.onPlayerRespawn, this),
      this.app.off('Player:Death', this.onPlayerDeath, this),
      this.app.off('Game:Settings', this.onSettingsChange, this),
      this.app.off('Label:Show', this.showLabel, this),
      this.entity.off('Health'),
      this.whiteBarTween && this.whiteBarTween.stop();
  }),
  (Label.prototype.showLabel = function (t) {
    this.player.playerId == t && (this.player.lastDamage = Date.now());
  }),
  (Label.prototype.onDamage = function (t) {
    this.isEnabled = !0;
  }),
  (Label.prototype.onSettingsChange = function () {
    this.usernameEntity &&
      this.usernameEntity.element &&
      (this.usernameEntity.element.text = Utils.displayUsername(this.originalUsername));
  }),
  (Label.prototype.onGameMode = function () {
    this.isEnabled = !0;
  }),
  (Label.prototype.onGameFinish = function () {
    (this.isEnabled = !1), this.labelEntity && this.labelEntity.destroy();
  }),
  (Label.prototype.onPlayerRespawn = function () {
    this.isEnabled = !0;
  }),
  (Label.prototype.onPlayerDeath = function () {
    this.isEnabled = !1;
  }),
  (Label.prototype.setInitalize = function () {
    pc.isSpectator
      ? ((this.labelEntity = this.spectatorLabelEntity.clone()),
        (this.screenEntity = this.spectatorScreenEntity),
        (this.labelHolder = this.spectatorLabelHolder),
        (this.labelEntity.enabled = !0))
      : (this.labelEntity = this.labelEntity.clone()),
      (this.maskEntity = this.labelEntity.findByName('Mask')),
      (this.healthBarEntity = this.labelEntity.findByName('HealthBar')),
      (this.whiteBarEntity = this.labelEntity.findByName('WhiteBar')),
      (this.abilityEntity = this.labelEntity.findByName('Ability')),
      (this.flagEntity = this.labelEntity.findByName('Flag')),
      (this.abilityEntity.enabled = !1),
      (this.flagEntity.enabled = !1),
      this.labelHolder.addChild(this.labelEntity),
      (this.player = this.entity.script.enemy),
      (this.isVisible = !1),
      (this.abilityTimer = !1),
      (this.currentCamera = this.playerCameraEntity.camera),
      pc.isSpectator && (this.currentCamera = this.spectatorCameraEntity.camera),
      (this.isInitalized = !0);
  }),
  (Label.prototype.setDestroy = function () {
    this.app.off('Game:Mode', this.onGameMode), this.labelEntity.destroy(), this.destroy();
  }),
  (Label.prototype.setUsername = function (t, e, i) {
    (this.labelEntity.findByName('Username').element.text = Utils.displayUsername(t)),
      (this.labelEntity.findByName('Level').element.text = i),
      (this.originalUsername = t),
      (this.usernameEntity = this.labelEntity.findByName('Username')),
      (this.team = e),
      this.updateTeamColor();
  }),
  (Label.prototype.setTeam = function (t) {
    (this.team = t), this.updateTeamColor();
  }),
  (Label.prototype.setFlagState = function (t) {
    (this.alwaysShow = t), (this.isEnabled = !0), (this.flagEntity.enabled = t);
  }),
  (Label.prototype.updateTeamColor = function () {
    if (
      !(this.healthBarEntity && this.healthBarEntity.element && this.healthBarEntity.element.color)
    )
      return !1;
    this.team == pc.currentTeam &&
    ('PAYLOAD' == pc.currentMode ||
      'TDM' == pc.currentMode ||
      (pc.currentModeOptions && pc.currentModeOptions.team))
      ? ((this.healthBarEntity.element.color = pc.colors.health),
        (this.flagEntity.element.color = pc.colors.health))
      : ((this.healthBarEntity.element.color = pc.colors.enemy),
        (this.flagEntity.element.color = pc.colors.enemy));
  }),
  (Label.prototype.setAbility = function (t) {
    var e = this.app.assets.find(t + '-32x.png');
    e &&
      ((this.abilityEntity.enabled = !0),
      (this.abilityEntity.element.textureAsset = e),
      clearTimeout(this.abilityTimer),
      (this.abilityTimer = setTimeout(
        function (t) {
          t.abilityEntity.enabled = !1;
        },
        5e3,
        this
      )));
  }),
  (Label.prototype.destroy = function () {
    this.labelEntity.destroy();
  }),
  (Label.prototype.setHealth = function (t) {
    var e = 0.01 * this.player.health;
    e = Math.max(e, 0);
    var i = -90 * (1 - (e = Math.min(e, 1)));
    return (
      this.maskEntity.setLocalPosition(i, 0, 0),
      this.healthBarEntity.setLocalPosition(-i, 0, 0),
      !!this.whiteBarEntity &&
        !!this.whiteBarEntity.element &&
        ((this.whiteBarEntity.element.opacity = 1),
        this.whiteBarEntity
          .tween(this.whiteBarEntity.getLocalScale())
          .to(
            {
              x: e,
              y: 1,
              z: 1,
            },
            0.5,
            pc.Linear
          )
          .start(),
        (this.whiteBarTween = this.whiteBarEntity.tween(this.whiteBarEntity.element).to(
          {
            opacity: 0,
          },
          0.5,
          pc.BackInOut
        )),
        void this.whiteBarTween.start())
    );
  }),
  (Label.prototype.checkVisibility = function () {
    var t = this.app.systems.camera.cameras[0],
      e = this.app.systems.rigidbody.raycastFirst(this.entity.getPosition(), t.getPosition());
    console.log(t),
      e && e.entity && 'Player' == e.entity.name ? (this.isVisible = !0) : (this.isVisible = !1),
      console.log(this.isVisible);
  }),
  (Label.prototype.update = function (t) {
    if (!this.isInitalized) return !1;
    if (!this.isEnabled && !pc.isSpectator)
      return this.labelEntity && (this.labelEntity.enabled = !1), !1;
    if (!pc.isSpectator) {
      if (this.player.isDeath) return (this.labelEntity.enabled = !1), !1;
      if (Date.now() - this.player.lastDamage > 1500)
        if (
          pc.currentTeam == this.team &&
          ('PAYLOAD' == pc.currentMode ||
            'TDM' == pc.currentMode ||
            (pc.currentModeOptions && pc.currentModeOptions.team))
        )
          this.labelEntity.enabled = !0;
        else if (!this.alwaysShow) return (this.labelEntity.enabled = !1), !1;
    }
    this.updateTeamColor();
    var e = this.headPoint.getPosition();
    e.y < -20 && (this.labelEntity.enabled = !1);
    var i = new pc.Vec3(),
      a = this.currentCamera,
      s = this.app.graphicsDevice.maxPixelRatio,
      n = this.screenEntity.screen.scale,
      l = this.app.graphicsDevice;
    if (!a) return (this.labelEntity.enabled = !1), !1;
    a.worldToScreen(e, i),
      (i.x *= s),
      (i.y *= s),
      i.x > 0 &&
      i.x < this.app.graphicsDevice.width &&
      i.y > 0 &&
      i.y < this.app.graphicsDevice.height &&
      i.z > 0
        ? (this.labelEntity.setLocalPosition(i.x / n, (l.height - i.y) / n, 0),
          (this.labelEntity.enabled = !0))
        : (this.labelEntity.enabled = !1);
  });
var Result = pc.createScript('result');
Result.attributes.add('topLine', {
  type: 'entity',
}),
  Result.attributes.add('bottomLine', {
    type: 'entity',
  }),
  Result.attributes.add('resultMessage', {
    type: 'entity',
  }),
  Result.attributes.add('resultMessageOpacity', {
    type: 'entity',
  }),
  Result.attributes.add('resultHolder', {
    type: 'entity',
  }),
  Result.attributes.add('cloudEntity', {
    type: 'entity',
  }),
  Result.attributes.add('cloudNoiseEntity', {
    type: 'entity',
  }),
  Result.attributes.add('mapNameEntity', {
    type: 'entity',
  }),
  Result.attributes.add('scoresEntity', {
    type: 'entity',
  }),
  Result.attributes.add('resultTitleEntity', {
    type: 'entity',
  }),
  Result.attributes.add('barEntity', {
    type: 'entity',
  }),
  Result.attributes.add('headerEntity', {
    type: 'entity',
  }),
  Result.attributes.add('headerBackgroundEntity', {
    type: 'entity',
  }),
  Result.attributes.add('rowEntity', {
    type: 'entity',
  }),
  Result.attributes.add('columnEntity', {
    type: 'entity',
  }),
  Result.attributes.add('statsHolder', {
    type: 'entity',
  }),
  Result.attributes.add('columnStatsHolder', {
    type: 'entity',
  }),
  Result.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  Result.attributes.add('chatEntity', {
    type: 'entity',
  }),
  Result.attributes.add('timerEntity', {
    type: 'entity',
  }),
  Result.attributes.add('mapEntity', {
    type: 'entity',
  }),
  Result.attributes.add('mapHolder', {
    type: 'entity',
  }),
  Result.attributes.add('skillEntity', {
    type: 'entity',
  }),
  Result.attributes.add('skillHolder', {
    type: 'entity',
  }),
  Result.attributes.add('voteBar', {
    type: 'entity',
  }),
  Result.attributes.add('voteCount', {
    type: 'entity',
  }),
  Result.attributes.add('rewardButton', {
    type: 'entity',
  }),
  Result.attributes.add('bannerEntity', {
    type: 'entity',
  }),
  Result.attributes.add('rewardCountEntity', {
    type: 'entity',
  }),
  Result.attributes.add('rewardLost', {
    type: 'entity',
  }),
  Result.attributes.add('loadingEntity', {
    type: 'entity',
  }),
  Result.attributes.add('damageEntity', {
    type: 'entity',
  }),
  Result.attributes.add('coinEntity', {
    type: 'entity',
  }),
  Result.attributes.add('levelEntity', {
    type: 'entity',
  }),
  Result.attributes.add('teamRedColor', {
    type: 'rgb',
  }),
  Result.attributes.add('teamBlueColor', {
    type: 'rgb',
  }),
  Result.attributes.add('teamNoneColor', {
    type: 'rgb',
  }),
  Result.attributes.add('meColor', {
    type: 'rgb',
  }),
  Result.attributes.add('lightColor', {
    type: 'rgb',
  }),
  Result.attributes.add('victoryColor', {
    type: 'rgb',
  }),
  Result.attributes.add('defeatColor', {
    type: 'rgb',
  }),
  Result.attributes.add('victoryBgColor', {
    type: 'rgb',
  }),
  Result.attributes.add('defeatBgColor', {
    type: 'rgb',
  }),
  Result.attributes.add('padding', {
    type: 'number',
  }),
  Result.attributes.add('maxTime', {
    type: 'number',
    default: 35,
  }),
  Result.attributes.add('maxScore', {
    type: 'number',
    default: 400,
  }),
  (Result.prototype.initialize = function () {
    for (var t in ((this.players = []),
    (this.rankOpacity = 0),
    (this.mapEntities = []),
    (this.time = this.maxTime),
    this.tick(),
    (this.rowEntity.enabled = !1),
    (this.resultHolder.enabled = !0),
    (this.scoresEntity.enabled = !1),
    pc.currentMap && (this.mapNameEntity.element.text = pc.currentMap + ''),
    pc.voteMaps || (pc.voteMaps = ['Sierra', 'Xibalba', 'Mistle', 'Tundra', 'Temple']),
    !0 === pc.isSpectator
      ? this.showMessage('OVER')
      : pc.isVictory
      ? this.showMessage('VICTORY')
      : this.showMessage('DEFEAT'),
    setTimeout(
      function (t) {
        t.showResultPage(pc.stats);
      },
      3e3,
      this
    ),
    this.app.fire('Overlay:Gameplay', !1),
    this.app.fire('Overlay:PlayerStats', !1),
    this.app.fire('Mouse:Unlock'),
    (pc.isFinished = !0),
    this.app.fire('Player:Lock', !1),
    this.app.fire('Game:Finish', !0),
    (this.currentSkillIndex = 0),
    (this.skills = []),
    pc.stats)) {
      var e = pc.stats[t];
      e.isMe &&
        (this.skills = [
          {
            name: 'Experience',
            score: e.experience,
          },
          {
            name: 'Bonus XP',
            score: e.bonus,
          },
          {
            name: 'Total Experience',
            score: e.experience + e.bonus,
          },
        ]);
    }
    (this.skillPoints = []),
      this.voteBar.setLocalScale(0.001, 1, 1),
      pc.isPrivate ? (this.skillHolder.enabled = !1) : (this.skillHolder.enabled = !0),
      this.on('state', this.onStateChange, this),
      this.entity.on('destroy', this.onDestroy, this),
      this.onStateChange(!0),
      (this.rewardButtonTimer = setTimeout(
        function (t) {
          pc.app.fire('Result:DestroyBanner', !0);
        },
        2e4,
        this
      )),
      (window.onbeforeunload = !1);
  }),
  (Result.prototype.showResultPage = function (t) {
    'undefined' != typeof app && app.onResultPage(t);
  }),
  (Result.prototype.removeResultScreen = function () {
    var t = this.app.root.findByName('ChatWrapper');
    t && (t.setLocalPosition(0, 0, 0), t.reparent(this.app.root.findByName('ChatGame'))),
      this.entity.destroy();
  }),
  (Result.prototype.onLeave = function () {
    this.removeResultScreen();
  }),
  (Result.prototype.setBanner = function () {
    Utils.isMobile()
      ? this.app.fire('Ads:BannerSet', 'venge-io_320x50_2', '320x50', !0)
      : this.app.fire('Ads:BannerSet', 'venge-io_728x90_2', '728x90', !0);
  }),
  (Result.prototype.destroyBanner = function () {
    this.app.fire('Ads:BannerDestroy', 'venge-io_728x90_2', '728x90'),
      this.app.fire('Ads:BannerDestroy', 'venge-io_320x50_2', '320x50'),
      this.bannerEntity && this.bannerEntity.destroy();
  }),
  (Result.prototype.onDestroy = function () {
    clearTimeout(this.rewardButtonTimer), this.destroyBanner();
  }),
  (Result.prototype.onPreroll = function () {
    if (!this.rewardButton.enabled) return !1;
    this.app.fire('Result:DestroyBanner', !0),
      this.app.fire('Network:Chat', 'Requested 2X reward!'),
      this.app.fire('Analytics:Event', 'Ads', 'Request2X');
    this.app.fire('Player:Hide', !0);
    var t = 'Ads:Preroll';
    Math.random() > 0.3 && (t = 'Ads:RewardAds'),
      this.app.fire(
        t,
        function (t) {
          t
            ? (pc.app.fire('Network:Reward', !0),
              pc.app.fire('Alert:Overlay', 'Your reward doubled!'))
            : pc.app.fire('Alert:Overlay', 'Reward is not available!'),
            pc.app.fire('Player:Show', !0),
            pc.app.mouse.enablePointerLock();
        },
        function () {
          pc.app.fire('Alert:Overlay', 'Please disable adblock!'),
            pc.app.fire('Player:Show', !0),
            pc.app.mouse.enablePointerLock();
        }
      );
  }),
  (Result.prototype.onStateChange = function (t) {
    t
      ? (this.app.on('Overlay:Votes', this.onVotes, this),
        this.app.on('Overlay:WatchAds', this.onWatchAds, this),
        this.app.on('Result:Preroll', this.onPreroll, this),
        this.app.on('Result:Banner', this.setBanner, this),
        this.app.on('Result:DestroyBanner', this.destroyBanner, this),
        this.app.on('Player:Leave', this.onLeave, this),
        this.app.on('Result:Remove', this.removeResultScreen, this),
        this.setVoteEntities(pc.voteMaps))
      : (clearTimeout(this.timer),
        this.app.off('Overlay:Votes'),
        this.app.off('Overlay:WatchAds'),
        this.app.off('Result:Preroll', this.onPreroll, this),
        this.app.off('Result:Banner', this.setBanner, this),
        this.app.off('Result:DestroyBanner', this.destroyBanner, this),
        this.app.off('Player:Leave', this.onLeave, this),
        this.app.off('Result:Remove', this.removeResultScreen, this),
        this.entity.sound.stop('Victory-Result'),
        this.entity.sound.stop('Defeat-Result'));
  }),
  (Result.prototype.setSkillPoint = function () {
    if (this.currentSkillIndex > this.skills.length - 1) return !1;
    var t = this.skills[this.currentSkillIndex],
      e = t.name,
      i = t.score,
      s = (1 * i) / this.maxScore;
    s = Math.min(1, s);
    var a = this.skillEntity.clone();
    if (!a || !a.element || !a.element.height) return !1;
    var n = -this.skillPoints.length * (a.element.height + this.padding);
    (a.enabled = !0),
      (a.findByName('Name').element.text = e),
      a.setLocalPosition(-15, n, 0),
      a
        .tween(a.getLocalPosition())
        .to(
          {
            x: 0,
            y: n,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .start();
    var o = a.findByName('Fill');
    o
      .tween(o.getLocalScale())
      .to(
        {
          x: s,
          y: 1,
          z: 1,
        },
        0.7,
        pc.Linear
      )
      .start(),
      (a.findByName('Point').script.count.next = i),
      this.skillPoints.push(a),
      this.skillHolder.addChild(a),
      this.currentSkillIndex++,
      this.entity.sound.play('Data-Increase'),
      setTimeout(
        function (t) {
          t.setSkillPoint();
        },
        500,
        this
      );
  }),
  (Result.prototype.tick = function () {
    if (!this.timerEntity || !this.timerEntity.element || !this.timerEntity.element.text) return !1;
    var t = Math.max(this.time, 0),
      e = this.time - 10;
    (e = Math.max(e, 0)),
      this.time--,
      t >= 0 &&
        (this.timer = setTimeout(
          function (t) {
            t.tick();
          },
          1e3,
          this
        ));
  }),
  (Result.prototype.clearVoteEntities = function () {
    for (var t = this.mapEntities.length; t--; ) this.mapEntities[t].destroy();
    (this.mapEntities = []),
      (this.mapEntity.enabled = !1),
      this.cloudNoiseEntity
        .tween(this.cloudNoiseEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: -170,
          },
          this.maxTime,
          pc.Linear
        )
        .start(),
      this.barEntity
        .tween(this.barEntity.element)
        .to(
          {
            width: 1400,
          },
          this.maxTime,
          pc.Linear
        )
        .start();
  }),
  (Result.prototype.setVoteEntities = function (t) {
    for (var e in (this.clearVoteEntities(), t)) {
      var i = t[e],
        s = i.split(' - '),
        a = this.app.assets.find(s[0] + '-Thumbnail'),
        n = this.mapEntity.clone();
      (n.name = i + '-Map'),
        (n.enabled = !0),
        n.setLocalPosition(this.mapEntities.length * (n.element.width + this.padding), 0, 0),
        (n.findByName('Name').element.text = i),
        (n.findByName('Picture').element.textureAsset = a),
        (n.findByName('VoteButton').script.button.triggerFunction = 'result.vote("' + i + '");'),
        this.mapHolder.addChild(n),
        this.mapEntities.push(n);
    }
  }),
  (Result.prototype.vote = function (t) {
    this.app.fire('Network:Vote', t);
    var e = this.app.root.findByTag('Vote-Button');
    for (var i in e) {
      e[i].enabled = !1;
    }
  }),
  (Result.prototype.onVotes = function (t) {
    var e = 0;
    for (var i in t) {
      var s = t[i],
        a = this.app.root.findByName(i + '-Map');
      a && (a.findByName('VoteCount').element.text = s + ''), (e += parseInt(s));
    }
    var n = (1 * e) / this.players.length;
    this.voteBar
      .tween(this.voteBar.getLocalScale())
      .to(
        {
          x: n,
          y: 1,
          z: 1,
        },
        0.4,
        pc.Linear
      )
      .start(),
      (this.voteCount.element.text = e + ' / ' + this.players.length),
      this.entity.sound.play('Vote');
  }),
  (Result.prototype.showProgression = function (t) {
    if (t) {
      if (this.coinEntity) {
        var e = this.coinEntity.findByName('Coin');
        e && (e.element.text = t.coins);
      }
      this.levelEntity &&
        ((this.levelEntity.findByName('LevelBar').element.width =
          (160 * t.previousExperience) / t.nextExperience),
        (this.levelEntity.findByName('PlayerLevel').element.text = t.level),
        (this.levelEntity.findByName('XP').element.text = t.experience)),
        this.damageEntity &&
          ((this.damageEntity.findByName('DamageTaken').element.text = parseInt(t.damageTaken)),
          (this.damageEntity.findByName('DamageGiven').element.text = parseInt(t.damageGiven)));
    }
  }),
  (Result.prototype.showScoreTable = function (t) {
    for (var e in (this.scoresEntity && (this.scoresEntity.enabled = !0), this.clearStats(), t)) {
      var i = t[e];
      this.createPlayerRow(i, parseInt(e) + 1);
    }
    this.backgroundEntity &&
      this.backgroundEntity.element &&
      this.backgroundEntity
        .tween(this.backgroundEntity.element)
        .to(
          {
            opacity: 0.9,
          },
          5,
          pc.Linear
        )
        .start(),
      this.headerEntity &&
        this.headerEntity.element &&
        ((this.headerEntity.element.width = 2e3),
        this.headerEntity
          .tween(this.headerEntity.element)
          .to(
            {
              width: 1e3,
            },
            0.8,
            pc.BackOut
          )
          .start());
    var s = this.app.root.findByName('ChatWrapper');
    s && (s.setLocalPosition(0, 0, 0), s.reparent(this.app.root.findByName('ChatHolder'))),
      setTimeout(
        function (t) {
          t.app.fire('DOM:Update', !0);
        },
        100,
        this
      ),
      setTimeout(function (t) {}, 800, this);
  }),
  (Result.prototype.clearStats = function () {
    for (var t = this.players.length; t--; ) this.players[t].destroy();
    this.rankOpacity = 1;
  }),
  (Result.prototype.createPlayerRow = function (t, e) {
    var i = this.rowEntity.clone();
    if (!(i && i.element && i.element.height)) return !1;
    var s = -this.players.length * (this.padding + i.element.height);
    (i.enabled = !0),
      i.setLocalPosition(-800, s, 0),
      (i.findByName('Username').element.text = Utils.displayUsername(t.username)),
      (i.findByName('Emoji').element.text = this.app.assets.find(
        'Charm-' + t.emoji + '-Emoji.png'
      )),
      (i.findByName('Kill').element.text = t.kill.toString()),
      (i.findByName('Death').element.text = t.death.toString()),
      (i.findByName('Assist').element.text = t.assist.toString()),
      (i.findByName('Headshot').element.text = t.headshot.toString()),
      (i.findByName('Objective').element.text = t.totalCardPoint.toString()),
      i.findByName('Reward') &&
        (t.reward > 0
          ? (i.findByName('Reward').element.text = '+' + t.reward.toString())
          : (i.findByName('Reward').enabled = !1)),
      (i.findByName('Score').element.text = t.score.toString());
    var a = this.app.assets.find('Tier-' + t.tier + '.png');
    a && (i.findByName('Tier').element.textureAsset = a),
      (i.findByName('Status').element.color = 1 == e ? this.victoryColor : this.defeatColor);
    var n = i.findByName('SocialHub'),
      o = !1,
      r = i.findByName('Username'),
      l = i.findByName('Follow'),
      p = !1;
    t.isMe
      ? ((i.findByName('You').enabled = !0), (p = !1), (o = !1))
      : ((i.findByName('You').enabled = !1),
        (p = !0),
        (o = !0),
        t.username.search('Guest') > -1 && ((p = !1), (o = !1))),
      (l.enabled = p),
      (n.enabled = o),
      (i.findByName('Rank').element.text = e),
      (i.findByName('Rank').element.opacity = this.rankOpacity),
      l &&
        l.script &&
        l.script.button &&
        (l.script.button.fireFunction = 'Follow:User@' + Utils.onlyUsername(t.username)),
      (n.script.button.triggerFunction =
        'window.open("https://social.venge.io/#' + Utils.onlyUsername(t.username) + '")'),
      (r.script.button.triggerFunction =
        'window.open("https://social.venge.io/#' + Utils.onlyUsername(t.username) + '")'),
      (this.rankOpacity -= 0.4);
    var h = (this.players.length % 2) + 2;
    1 === e
      ? ((h = 1), (i.element.opacity = 1))
      : (i.element.opacity = this.players.length % 2 ? 0.8 : 0.7);
    var d = i.findByName('Badges'),
      y = i.findByName('Badges').findByName('Icon');
    for (var u in t.achievements) {
      var c = t.achievements[u],
        m = this.app.assets.find(c + '-Icon.png'),
        f = y.clone();
      (f.enabled = !0),
        f.setLocalPosition(34 * parseInt(u), 0, 0),
        (f.element.textureAsset = m),
        d.addChild(f);
    }
    var g = this.app.assets.find(t.skin + '-Thumbnail-' + h);
    t.heroSkin &&
      'Default' != t.heroSkin &&
      (g = this.app.assets.find(t.skin + '-' + t.heroSkin + '-Thumbnail.png')),
      (i.findByName('PlayerPicture').element.textureAsset = g),
      i
        .tween(i.getLocalPosition())
        .to(
          {
            x: 0,
            y: s,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .delay(0.1 * e)
        .start(),
      this.statsHolder.addChild(i),
      this.players.push(i),
      setTimeout(
        function (t) {
          (t.entity.sound.slots.Whoosh.pitch = 1 + 0.1 * Math.random()),
            t.entity.sound.play('Whoosh');
        },
        100 * e,
        this
      );
  }),
  (Result.prototype.createPlayerDetail = function (t, e) {
    var i = this.columnEntity.clone();
    if (!(i && i.element && i.element.width)) return !1;
    var s = (this.players.length - 1) * (this.padding + i.element.width);
    console.log(s),
      (i.enabled = !0),
      i.setLocalPosition(-800, s, 0),
      (i.findByName('Kill').element.text = t.kill.toString()),
      (i.findByName('Death').element.text = t.death.toString()),
      (i.findByName('Assist').element.text = t.assist.toString()),
      (i.findByName('Headshot').element.text = t.headshot.toString()),
      (i.findByName('DamageGiven').element.text = t.damageGiven.toString()),
      (i.findByName('DamageTaken').element.text = t.damageTaken.toString()),
      (i.findByName('Objective').element.text = t.totalCardPoint.toString()),
      i.findByName('Reward') &&
        (t.reward > 0
          ? (i.findByName('Reward').element.text = '+' + t.reward.toString())
          : (i.findByName('Reward').enabled = !1)),
      (i.findByName('Score').element.text = t.score.toString());
    var a = this.app.assets.find('Tier-' + t.tier + '.png');
    a && (i.findByName('Tier').element.textureAsset = a),
      (i.findByName('Status').element.color = 0 == e ? this.victoryColor : this.defeatColor),
      (this.rankOpacity -= 0.4);
    var n = (this.players.length % 2) + 2;
    0 === e
      ? ((n = 0), (i.element.opacity = 1))
      : (i.element.opacity = this.players.length % 2 ? 0.8 : 0.7);
    var o = this.app.assets.find(t.skin + '-Thumbnail-' + n);
    t.heroSkin &&
      'Default' != t.heroSkin &&
      (o = this.app.assets.find(t.skin + '-' + t.heroSkin + '-Thumbnail.png')),
      (i.findByName('PlayerPicture').element.textureAsset = o),
      i
        .tween(i.getLocalPosition())
        .to(
          {
            x: s,
            y: 0,
            z: 0,
          },
          0.5,
          pc.BackOut
        )
        .delay(0.1 * e)
        .start(),
      this.columnStatsHolder.addChild(i),
      setTimeout(
        function (t) {
          (t.entity.sound.slots.Whoosh.pitch = 1 + 0.1 * Math.random()),
            t.entity.sound.play('Whoosh');
        },
        100 * e,
        this
      );
  }),
  (Result.prototype.showMessage = function (t) {
    (this.resultMessage.element.text = t),
      (this.resultMessageOpacity.element.text = t),
      (this.resultTitleEntity.element.text = t),
      'VICTORY' == t
        ? ((this.backgroundEntity.element.color = this.victoryBgColor),
          (this.headerBackgroundEntity.element.color = this.victoryColor),
          (this.topLine.element.color = this.victoryColor),
          (this.bottomLine.element.color = this.victoryColor),
          (this.resultMessage.element.color = this.victoryColor),
          this.entity.sound.play('Victory-Result'))
        : ((this.backgroundEntity.element.color = this.defeatBgColor),
          (this.headerBackgroundEntity.element.color = this.defeatColor),
          (this.topLine.element.color = this.defeatColor),
          (this.bottomLine.element.color = this.defeatColor),
          (this.resultMessage.element.color = this.defeatColor),
          this.entity.sound.play('Defeat-Result')),
      this.cloudEntity
        .tween(this.cloudEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: -20,
          },
          3,
          pc.CubicOut
        )
        .start(),
      this.cloudEntity
        .tween(this.cloudEntity.getLocalScale())
        .to(
          {
            x: 3,
            y: 3,
            z: 3,
          },
          3,
          pc.CubicOut
        )
        .start(),
      (this.cloudEntity.element.opacity = 0.15),
      this.cloudEntity
        .tween(this.cloudEntity.element)
        .to(
          {
            opacity: 0,
          },
          3,
          pc.Linear
        )
        .start(),
      this.resultMessage.setLocalScale(0.1, 0.1, 0.1),
      this.resultMessage
        .tween(this.resultMessage.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      (this.resultHolder.element.height = 100),
      this.resultHolder
        .tween(this.resultHolder.element)
        .to(
          {
            height: 300,
          },
          0.5,
          pc.ExponentialInOut
        )
        .start(),
      this.resultMessageOpacity
        .tween(this.resultMessageOpacity.element)
        .to(
          {
            opacity: 0,
          },
          0.4,
          pc.Linear
        )
        .start(),
      this.resultMessageOpacity.setLocalScale(0.1, 0.1, 0.1),
      this.resultMessageOpacity
        .tween(this.resultMessageOpacity.getLocalScale())
        .to(
          {
            x: 2,
            y: 2,
            z: 2,
          },
          0.5,
          pc.Linear
        )
        .start(),
      setTimeout(
        function (t) {
          t.resultMessage
            .tween(t.resultMessage.getLocalScale())
            .to(
              {
                x: 1.2,
                y: 1.2,
                z: 1.2,
              },
              1.3,
              pc.Linear
            )
            .start(),
            t.resultHolder
              .tween(t.resultHolder.element)
              .to(
                {
                  height: 340,
                },
                1.3,
                pc.Linear
              )
              .start();
        },
        500,
        this
      ),
      (this.resultMessage.element.opacity = 0),
      (this.resultMessage.element.spacing = 0.8),
      this.resultMessage
        .tween(this.resultMessage.element)
        .to(
          {
            opacity: 1,
            spacing: 1.3,
          },
          1.5,
          pc.BackOut
        )
        .start(),
      (this.topLine.element.opacity = 0),
      this.topLine
        .tween(this.topLine.element)
        .to(
          {
            opacity: 1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      this.topLine.setLocalScale(0.1, 0.5, 1),
      this.topLine
        .tween(this.topLine.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.5,
          pc.ExponentialInOut
        )
        .start(),
      (this.bottomLine.element.opacity = 0),
      this.bottomLine
        .tween(this.bottomLine.element)
        .to(
          {
            opacity: 1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      this.bottomLine.setLocalScale(0.1, 0.5, 1),
      this.bottomLine
        .tween(this.bottomLine.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.5,
          pc.ExponentialInOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.resultMessage
            .tween(t.resultMessage.getLocalScale())
            .to(
              {
                x: 2,
                y: 2,
                z: 2,
              },
              0.8,
              pc.QuadraticOut
            )
            .start(),
            t.resultMessage
              .tween(t.resultMessage.element)
              .to(
                {
                  opacity: 0,
                  spacing: 1,
                },
                0.8,
                pc.BackOut
              )
              .start(),
            t.topLine
              .tween(t.topLine.element)
              .to(
                {
                  opacity: 0,
                },
                0.2,
                pc.Linear
              )
              .start(),
            t.topLine
              .tween(t.topLine.getLocalScale())
              .to(
                {
                  x: 0.1,
                  y: 0.5,
                  z: 1,
                },
                0.5,
                pc.BackOut
              )
              .start(),
            t.bottomLine
              .tween(t.bottomLine.element)
              .to(
                {
                  opacity: 0,
                },
                0.2,
                pc.Linear
              )
              .start(),
            t.bottomLine
              .tween(t.bottomLine.getLocalScale())
              .to(
                {
                  x: 0.1,
                  y: 0.5,
                  z: 1,
                },
                0.5,
                pc.BackOut
              )
              .start();
        },
        1800,
        this
      );
  }),
  (Result.prototype.onWatchAds = function (t) {
    console.log('Watching ads... : ', t);
  }),
  (Result.prototype.watchAds = function () {
    this.app.fire('Network:Event', 'watch-ads');
  });
var Thumbnail = pc.createScript('thumbnail');
Thumbnail.attributes.add('model', {
  type: 'entity',
}),
  Thumbnail.attributes.add('textures', {
    type: 'asset',
    assetType: 'texture',
    array: !0,
  }),
  (Thumbnail.prototype.initialize = function () {
    (this.canvas = document.createElement('canvas')),
      (this.context = this.canvas.getContext('2d')),
      (this.currentTextureIndex = 0),
      (this.canvas.width = 512),
      (this.canvas.height = 512),
      (this.index = 0),
      (this.currentName = 'thumbnail.png');
  }),
  (Thumbnail.prototype.slug = function (e) {
    var t = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;',
      a = new RegExp(t.split('').join('|'), 'g');
    return (
      e
        .toString()
        .replace(/\s+/g, '-')
        .replace(a, e =>
          'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'.charAt(
            t.indexOf(e)
          )
        )
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') + '-thumbnail'
    );
  }),
  (Thumbnail.prototype.update = function () {
    if (
      (this.app.keyboard.wasPressed(pc.KEY_X) &&
        ((this.currentName = this.slug(this.model.name)), this.capture()),
      this.app.keyboard.wasPressed(pc.KEY_Z))
    )
      if (0 === this.currentTextureIndex) this.nextTexture();
      else {
        var e = this.textures[this.currentTextureIndex - 1].name;
        (e = e.split('.')[0]),
          (this.currentName = this.slug(e)),
          this.capture(),
          this.nextTexture();
      }
  }),
  (Thumbnail.prototype.nextTexture = function () {
    for (
      var e = this.model.model.material.clone(),
        t = this.textures[this.currentTextureIndex],
        a = this.model.model.meshInstances,
        n = 0;
      n < a.length;
      ++n
    ) {
      a[n].material = e;
    }
    this.app.assets.load(t),
      t.ready(function (a) {
        (e.diffuseMap = t.resource), e.update();
      }),
      this.currentTextureIndex++;
  }),
  (Thumbnail.prototype.capture = function () {
    var e = new pc.Texture(this.app.graphicsDevice, {
      mipmaps: !1,
    });
    (e.minFilter = pc.FILTER_LINEAR),
      (e.magFilter = pc.FILTER_LINEAR),
      (e.addressU = pc.ADDRESS_CLAMP_TO_EDGE),
      (e.addressV = pc.ADDRESS_CLAMP_TO_EDGE);
    var t = this,
      a = (this.captured, new Image());
    (a.src = pc.app.graphicsDevice.canvas.toDataURL('image/png')),
      (a.onload = function () {
        t.context.clearRect(0, 0, t.canvas.width, t.canvas.height),
          t.context.drawImage(a, -window.innerWidth / 2 + 256, -window.innerHeight / 2 + 262);
        var e = new Image();
        (e.src = t.canvas.toDataURL('image/png')),
          (e.onload = function () {
            t.download(e.src, t.currentName);
          });
      }),
      this.captured++;
  }),
  (Thumbnail.prototype.download = function (e, t) {
    var a = document.createElement('a');
    (a.href = e),
      (a.download = t),
      document.body.appendChild(a),
      a.click(),
      document.body.removeChild(a);
  });
var Input = pc.createScript('input');
Input.attributes.add('placeholder', {
  type: 'string',
}),
  Input.attributes.add('type', {
    type: 'string',
    enum: [
      {
        Text: 'text',
      },
      {
        Email: 'email',
      },
      {
        Password: 'password',
      },
    ],
    default: 'text',
  }),
  Input.attributes.add('maxLength', {
    type: 'number',
    default: 64,
  }),
  Input.attributes.add('fontSize', {
    type: 'number',
    default: 1,
  }),
  Input.attributes.add('padding', {
    type: 'number',
    default: 1,
  }),
  Input.attributes.add('hasIcon', {
    type: 'boolean',
  }),
  Input.attributes.add('scaleUnit', {
    type: 'string',
    enum: [
      {
        'Viewport Width': 'vw',
      },
      {
        'Viewport Height': 'vh',
      },
      {
        Pixel: 'px',
      },
    ],
    default: 'vw',
  }),
  Input.attributes.add('color', {
    type: 'rgb',
  }),
  Input.attributes.add('disableTab', {
    type: 'boolean',
  }),
  Input.attributes.add('whitePlaceholder', {
    type: 'boolean',
  }),
  Input.attributes.add('temporary', {
    type: 'boolean',
  }),
  Input.attributes.add('fontFamily', {
    type: 'string',
    default: 'Arial, sans-serif',
  }),
  Input.attributes.add('storeValue', {
    type: 'boolean',
  }),
  Input.attributes.add('containerEntity', {
    type: 'entity',
  }),
  Input.attributes.add('focusEntity', {
    type: 'entity',
  }),
  Input.attributes.add('sleepValue', {
    type: 'string',
  }),
  Input.attributes.add('blurFunction', {
    type: 'string',
  }),
  Input.attributes.add('key', {
    type: 'string',
  }),
  (Input.prototype.initialize = function () {
    (this.timeout = !1),
      this.app.on('Input:' + this.entity.name, this.setValue, this),
      this.on(
        'state',
        function (t) {
          t
            ? this.temporary
              ? (this.element.style.display = 'block')
              : this.createElement()
            : this.temporary
            ? (this.element.style.display = 'none')
            : this.onDestroy();
        },
        this
      ),
      this.on('destroy', this.onDestroy, this),
      this.createElement();
  }),
  (Input.prototype.createElement = function () {
    (this.currentWidth = 0),
      (this.currentHeight = 0),
      (this.isDestroyed = !1),
      (this.element = document.createElement('input')),
      (this.element.placeholder = this.placeholder),
      (this.element.type = this.type),
      (this.element.style.position = 'absolute'),
      (this.element.style.fontFamily = this.fontFamily),
      (this.element.style.border = '0px'),
      (this.element.style.background = 'transparent'),
      (this.element.style.fontSize = this.fontSize + this.scaleUnit),
      (this.element.style.padding = this.padding + this.scaleUnit),
      (this.element.style.boxSizing = 'border-box'),
      (this.element.style.display = 'block'),
      this.hasIcon && (this.element.style.paddingRight = '2.5vw'),
      this.disableTab && (this.element.tabindex = !1),
      this.maxLength > 0 && (this.element.maxLength = this.maxLength);
    var t =
      'rgb(' + 255 * this.color.r + ', ' + 255 * this.color.g + ', ' + 255 * this.color.b + ')';
    (this.element.style.color = t),
      (this.element.style.outline = 'none'),
      this.whitePlaceholder && (this.element.className = 'white-placeholder'),
      this.containerEntity
        ? ((this.element.style.position = 'fixed'),
          this.containerEntity.script.container.insideElement.appendChild(this.element))
        : document.body.appendChild(this.element),
      this.focusEntity && (this.focusEntity.enabled = !1),
      (this.element.onfocus = this.onFocus.bind(this)),
      (this.element.onblur = this.onBlur.bind(this)),
      this.blurFunction && (this.element.onblur = this.onBlurFunction.bind(this)),
      (this.element.onchange = this.onChange.bind(this)),
      Utils.getItem(this.entity._guid) && this.setValue(Utils.getItem(this.entity._guid)),
      this.updateStyle(),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.app.on('Input:' + this.entity.name, this.setResultValue, this),
      this.sleepValue && this.setValue(this.sleepValue);
  }),
  (Input.prototype.onBlurFunction = function () {
    var t = this.blurFunction.split(', ');
    if (t.length > 0)
      for (var e in t) {
        var i = t[e].split('@'),
          n = i[0];
        if (i.length > 1) {
          var s = i[1];
          this.app.fire(n, s);
        } else this.app.fire(n);
      }
  }),
  (Input.prototype.onDOMClear = function () {
    this.entity.destroy();
  }),
  (Input.prototype.onDestroy = function () {
    (this.isDestroyed = !0),
      this.element && this.element.remove(),
      this.app.off('Input:' + this.entity.name, this.setValue, this);
  }),
  (Input.prototype.store = function () {
    (this.storeValue = !0), this.onChange();
  }),
  (Input.prototype.onFocus = function () {
    this.focusEntity && (this.focusEntity.enabled = !0), this.app.fire('Input:Focus', !0);
  }),
  (Input.prototype.onBlur = function () {
    this.focusEntity && (this.focusEntity.enabled = !1), this.app.fire('Input:Focus', !1);
  }),
  (Input.prototype.onChange = function () {
    this.storeValue && Utils.setItem(this.entity._guid, this.getValue());
  }),
  (Input.prototype.onDomUpdate = function () {
    this._updateStyle();
  }),
  (Input.prototype.updateStyle = function () {
    if (this.currentWidth == window.innerWidth && this.currentHeight == window.innerHeight)
      return !1;
    this._updateStyle(),
      (this.currentWidth = window.innerWidth),
      (this.currentHeight = window.innerHeight);
  }),
  (Input.prototype._updateStyle = function () {
    if (this.isDestroyed) return !1;
    var t = this;
    if (t.entity && t.entity.element && t.entity.element.screenCorners) {
      var e = t.entity.element.screenCorners,
        i = 1 / t.app.graphicsDevice.maxPixelRatio,
        n = 0,
        s = 0,
        o = (e[2].x - e[0].x) * i,
        l = (e[2].y - e[0].y) * i;
      if (this.containerEntity) {
        var h = this.containerEntity.scaleX,
          a = this.containerEntity.scaleY;
        (n = (e[0].x - this.containerEntity.offsetLeft) / h),
          (s =
            (e[0].y - this.containerEntity.offsetTop) / a -
            l +
            this.containerEntity.element.height),
          this.containerEntity &&
            this.containerEntity.script.container.autoResize &&
            ((this.element.style.transform = 'scale(' + 1 / h + ', ' + 1 / a + ')'),
            (this.element.style.transformOrigin = 'left bottom'));
      } else (n = e[0].x), (s = e[0].y);
      (t.element.style.left = n * i + 'px'),
        (t.element.style.bottom = s * i + 'px'),
        (t.element.style.width = o + 'px'),
        (t.element.style.height = l + 'px');
    }
  }),
  (Input.prototype.setResultValue = function (t) {
    if (!t) return !1;
    if (!t.result) return (this.element.value = t), !1;
    var e = t.result;
    this.element ? ((this.element.value = e), (this.sleepValue = !1)) : (this.sleepValue = e);
  }),
  (Input.prototype.setValue = function (t) {
    if (this.key && t && t[this.key] && this.element) return (this.element.value = t[this.key]), !1;
    this.element
      ? 'string' == typeof t && this.element && ((this.element.value = t), (this.sleepValue = !1))
      : (this.sleepValue = t);
  }),
  (Input.prototype.getValue = function () {
    if (this.element) return this.element.value;
  }),
  (Input.prototype.focus = function () {
    this.element && this.element.focus();
  }),
  (Input.prototype.blur = function () {
    this.element && this.element.blur();
  });
var Chat = pc.createScript('chat');
Chat.attributes.add('inputEntity', {
  type: 'entity',
}),
  Chat.attributes.add('messageEntity', {
    type: 'entity',
  }),
  Chat.attributes.add('messageHolder', {
    type: 'entity',
  }),
  Chat.attributes.add('consoleColor', {
    type: 'rgb',
  }),
  Chat.attributes.add('meColor', {
    type: 'rgb',
  }),
  Chat.attributes.add('whiteColor', {
    type: 'rgb',
  }),
  Chat.attributes.add('padding', {
    type: 'number',
    default: 2,
  }),
  Chat.attributes.add('timeLimit', {
    type: 'number',
    default: 5,
  }),
  Chat.attributes.add('messageLimit', {
    type: 'number',
    default: 4,
  }),
  Chat.attributes.add('isFocused', {
    type: 'boolean',
    default: !1,
  }),
  Chat.attributes.add('keepHistory', {
    type: 'boolean',
    default: !1,
  }),
  Chat.attributes.add('profanity', {
    type: 'boolean',
    default: !0,
  }),
  (Chat.prototype.initialize = function () {
    (this.displayed = !1),
      (this.messages = []),
      (this.includeList = [
        'fuck',
        'f u c k',
        'fuk',
        'f u k',
        'fuc',
        'f u c',
        'rape',
        'r a p e',
        'raping',
        'r a p i n g',
        'boob',
        'b o o b',
        'b00b',
        'b 0 0 b',
        'faggot',
        'f a g g o t',
        'gay',
        'g a y',
        'nigga',
        'n i g g a',
        'nigger',
        'n i g g e r',
        'niger',
        'n i g e r',
        'niga',
        'n i g a',
        'dick',
        'd i c k',
        'cock',
        'c o c k',
        'shlong',
        's h l o n g',
        'dong',
        'd o n g',
        'vagina',
        'v a g i n a',
        'pussy',
        'p u s s y',
      ]),
      (this.exactList = ['nig', 'n i g', 'cok', 'c o k']),
      (this.messageEntity.enabled = !1),
      this.on('state', function (t) {
        t ? this.mountEvents() : this.unmountEvents();
      }),
      this.on('destroy', function (t) {
        this.unmountEvents();
      }),
      this.mountEvents();
  }),
  (Chat.prototype.mountEvents = function () {
    this.app.on('Chat:Message', this.onMessage, this),
      this.app.on('Chat:Clear', this.onClear, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Input:Focus', this.onInputFocus, this);
  }),
  (Chat.prototype.unmountEvents = function () {
    this.app.off('Chat:Message', this.onMessage, this),
      this.app.off('Chat:Clear', this.onClear, this),
      this.app.off('Map:Loaded', this.onMapLoaded, this),
      this.app.off('Input:Focus', this.onInputFocus, this);
  }),
  (Chat.prototype.checkProfinatity = function (t) {
    var e = !1;
    for (var s in this.includeList) {
      var i = this.includeList[s];
      t.toLowerCase().indexOf(i) > -1 && (e = !0);
    }
    var a = t.split(' ');
    for (var o in this.exactList) {
      var n = this.exactList[o];
      for (var h in a) {
        a[h].toLowerCase().indexOf(n) > -1 && (e = !0);
      }
    }
    return e;
  }),
  (Chat.prototype.onClear = function () {
    for (var t = this.messages.length; t--; ) this.messages[t] && this.messages[t].destroy();
    this.messages = [];
  }),
  (Chat.prototype.onMapLoaded = function () {
    if (!this.displayed) return !1;
    this.app.fire('Chat:Message', 'Console', 'Press TAB to see other players scores!'),
      (this.displayed = !0);
  }),
  (Chat.prototype.nextMessage = function () {
    var t = this.messages.length;
    if (t > 0)
      for (var e = 0; t--; )
        this.messages[t].setLocalPosition(0, (this.messages.length - t) * this.padding + e, 0),
          (e += this.messages[t].element.height);
    if (this.messages.length > this.messageLimit) {
      var s = this.messages[0];
      clearTimeout(s.messageTimeout), this.messages.splice(0, 1), s.destroy();
    }
  }),
  (Chat.prototype.onMessage = function (t, e, s, i, a) {
    if (this.profanity && this.checkProfinatity(e) && 'Console' != t)
      return s && this.app.fire('Chat:Message', 'Console', 'Message removed.'), !1;
    var o = this.messageEntity.clone();
    (o.enabled = !0),
      o.setLocalPosition(0, 0, 0),
      this.profanity && (t = Utils.displayUsername(t)),
      (o.findByName('Text').element.text = t + ' : [color="#dddddd"]' + e + '[/color]'),
      (o.element.height = o.findByName('Text').element.height + 10),
      i
        ? (o.findByName('Text').element.color = this.consoleColor)
        : 'PAYLOAD' == pc.currentMode || 'TDM' == pc.currentMode
        ? a &&
          ('red' == a
            ? (o.findByName('Text').element.color = pc.colors.redTeam)
            : 'blue' == a && (o.findByName('Text').element.color = pc.colors.blueTeam))
        : (o.findByName('Text').element.color = s ? this.meColor : this.whiteColor),
      this.messages.push(o),
      this.messageHolder.addChild(o),
      this.nextMessage(),
      this.entity.sound.play('Notify'),
      this.keepHistory ||
        (o.messageTimeout = setTimeout(
          function (t, e) {
            e && (t.messages.splice(0, 1), e.destroy());
          },
          1e3 * this.timeLimit,
          this,
          o
        ));
  }),
  (Chat.prototype.sendMessage = function () {
    if (!this.inputEntity.enabled) return !1;
    var t = this.inputEntity.script.input.getValue();
    if (t.length <= 0) return this.blur(), !1;
    this.app.fire('Network:Chat', t),
      this.inputEntity.script.input.setValue(''),
      this.blur(),
      (this.lastMessageDate = Date.now());
  }),
  (Chat.prototype.onEnter = function () {
    this.isFocused ? this.sendMessage() : this.focus();
  }),
  (Chat.prototype.focus = function () {
    this.entity.enabled &&
      (this.inputEntity.script.input.focus(),
      (this.isFocused = !0),
      this.app.fire('Player:Lock', !1));
  }),
  (Chat.prototype.onInputFocus = function (t) {
    this.isFocused = t;
  }),
  (Chat.prototype.blur = function () {
    this.inputEntity.script.input.blur(), (this.isFocused = !1), this.app.fire('Player:Lock', !0);
  }),
  (Chat.prototype.update = function () {
    this.app.keyboard.wasPressed(pc.KEY_ENTER) && this.onEnter(),
      this.app.keyboard.wasPressed(pc.KEY_ESCAPE) && this.blur();
  });
var Speaking = pc.createScript('speaking');
Speaking.attributes.add('subtitles', {
  type: 'string',
  array: !0,
}),
  (Speaking.prototype.initialize = function () {
    (this.characterName = 'Lilium'),
      (this.lastPlayTime = Date.now()),
      (this.currentIndex = 0),
      (this.lastPlayedSound = !1),
      this.app.on('Player:Speak', this.onPlay, this),
      this.app.on('Player:StopSpeaking', this.onStop, this),
      this.app.on('Player:Character', this.onCharacterSet, this);
  }),
  (Speaking.prototype.onCharacterSet = function (t) {
    this.characterName = t;
  }),
  (Speaking.prototype.onStop = function () {
    this.entity.sound.stop();
  }),
  (Speaking.prototype.onPlay = function (t, e) {
    if (Date.now() - this.lastPlayTime < 2e3) return !1;
    this.play(t, e), (this.lastPlayTime = Date.now());
  }),
  (Speaking.prototype.play = function (t, e) {
    this.currentIndex > e && (this.currentIndex = 0);
    var i = this.currentIndex + 1,
      a = this.characterName + '-' + t + '-' + i,
      n = Object.keys(pc.app.root.findByName('Speaking').sound.slots).indexOf(a);
    this.entity.sound.play(a),
      this.app.fire('Overlay:Subtitle', this.subtitles[n]),
      this.currentIndex++,
      (this.lastPlayedSound = a);
  });
var Count = pc.createScript('count');
Count.attributes.add('leftPad', {
  type: 'string',
}),
  Count.attributes.add('rightPad', {
    type: 'string',
  }),
  Count.attributes.add('next', {
    type: 'number',
  }),
  Count.attributes.add('speed', {
    type: 'number',
    default: 0.05,
  }),
  (Count.prototype.initialize = function () {
    (this.currentNumber = 0),
      this.on('state', function (t) {
        t
          ? this.startCounter()
          : this.app.off('Count:' + this.entity.name, this.setNextNumber, this);
      }),
      this.startCounter(),
      this.entity.on('Count', this.setNextNumber, this);
  }),
  (Count.prototype.startCounter = function (t) {
    this.app.on('Count:' + this.entity.name, this.setNextNumber, this);
  }),
  (Count.prototype.setNextNumber = function (t) {
    (this.next = t), this.entity.sound && this.entity.sound.play('Count');
  }),
  (Count.prototype.update = function (t) {
    var e = Math.round(this.currentNumber);
    (this.entity.element.text = this.leftPad + e + this.rightPad),
      (this.currentNumber = pc.math.lerp(this.currentNumber, this.next, this.speed));
  });
var Terrain = pc.createScript('terrain');
Terrain.attributes.add('map', {
  type: 'asset',
  assetType: 'texture',
}),
  Terrain.attributes.add('red', {
    type: 'asset',
    assetType: 'texture',
  }),
  Terrain.attributes.add('green', {
    type: 'asset',
    assetType: 'texture',
  }),
  Terrain.attributes.add('blue', {
    type: 'asset',
    assetType: 'texture',
  }),
  Terrain.attributes.add('redScale', {
    type: 'vec2',
    default: [1, 1],
  }),
  Terrain.attributes.add('greenScale', {
    type: 'vec2',
    default: [1, 1],
  }),
  Terrain.attributes.add('blueScale', {
    type: 'vec2',
    default: [1, 1],
  }),
  (Terrain.prototype.initialize = function () {
    var e = this;
    (this.currentLoaded = 0),
      this.app.assets.load(this.map),
      this.app.assets.load(this.red),
      this.app.assets.load(this.green),
      this.app.assets.load(this.blue),
      this.map.ready(function () {
        e.upload();
      }),
      this.red.ready(function () {
        e.upload();
      }),
      this.green.ready(function () {
        e.upload();
      }),
      this.blue.ready(function () {
        e.upload();
      }),
      (this.shader = ''),
      (this.shader += '#ifdef MAPCOLOR\n'),
      (this.shader += 'uniform vec3 material_diffuse;\n'),
      (this.shader += '#endif\n'),
      (this.shader += '\n'),
      (this.shader += '#ifdef MAPTEXTURE\n'),
      (this.shader += 'uniform sampler2D texture_diffuseMap;\n'),
      (this.shader += '#endif\n'),
      (this.shader += '\n'),
      (this.shader += 'uniform sampler2D mapTexture;\n'),
      (this.shader += 'uniform sampler2D redTexture;\n'),
      (this.shader += 'uniform sampler2D blueTexture;\n'),
      (this.shader += 'uniform sampler2D greenTexture;\n'),
      (this.shader += '\n'),
      (this.shader += 'uniform vec2 redScale;\n'),
      (this.shader += 'uniform vec2 blueScale;\n'),
      (this.shader += 'uniform vec2 greenScale;\n'),
      (this.shader += '\n'),
      (this.shader += 'void getAlbedo() {\n'),
      (this.shader += '    dAlbedo = vec3(1.0);\n'),
      (this.shader += '    \n'),
      (this.shader += '    vec3 baseTexture = texture2DSRGB(mapTexture, $UV).$CH;\n'),
      (this.shader += '    \n'),
      (this.shader += '    vec3 tex1 = texture2DSRGB(redTexture, $UV * redScale).$CH;\n'),
      (this.shader += '    vec3 tex2 = texture2DSRGB(blueTexture, $UV * blueScale).$CH;\n'),
      (this.shader += '    vec3 tex3 = texture2DSRGB(greenTexture, $UV * greenScale).$CH;\n'),
      (this.shader += '    float t1 = baseTexture.r;\n'),
      (this.shader += '    float t2 = baseTexture.b;\n'),
      (this.shader += '    float t3 = baseTexture.g;\n'),
      (this.shader += '    float tSum = t1 + t2 + t3;\n'),
      (this.shader += '    t1 /= tSum;\n'),
      (this.shader += '    t2 /= tSum;\n'),
      (this.shader += '    t3 /= tSum;\n'),
      (this.shader += '    tex1 *= t1;\n'),
      (this.shader += '    tex2 *= t2;\n'),
      (this.shader += '    tex3 *= t3;\n'),
      (this.shader += '    \n'),
      (this.shader += '    dAlbedo = tex1 + tex2 + tex3;\n'),
      (this.shader += '    \n'),
      (this.shader += '    #ifdef MAPVERTEX\n'),
      (this.shader += '        dAlbedo *= gammaCorrectInput(saturate(vVertexColor.$VC));\n'),
      (this.shader += '    #endif\n'),
      (this.shader += '}\n'),
      this.on('destroy', this.onDestroy, this);
  }),
  (Terrain.prototype.onDestroy = function () {}),
  (Terrain.prototype.upload = function () {
    if ((this.currentLoaded++, this.currentLoaded < 4)) return !1;
    var e = this.entity.model.model.meshInstances[0].material;
    if (e.isLoaded) return !1;
    e.setParameter('mapTexture', this.map.resource),
      e.setParameter('blueTexture', this.blue.resource),
      e.setParameter('redTexture', this.red.resource),
      e.setParameter('greenTexture', this.green.resource),
      e.setParameter('redScale', [this.redScale.x, this.redScale.y]),
      e.setParameter('greenScale', [this.greenScale.x, this.greenScale.y]),
      e.setParameter('blueScale', [this.blueScale.x, this.blueScale.y]),
      (e.chunks.diffusePS = this.shader),
      e.update(),
      (e.isLoaded = !0);
  });
Object.assign(
  pc,
  (function () {
    var ZoomEffect = function (e) {
      pc.PostEffect.call(this, e);
      var t = {
          aPosition: pc.SEMANTIC_POSITION,
        },
        o = [
          'attribute vec2 aPosition;',
          '',
          'varying vec2 vUv0;',
          '',
          'void main(void)',
          '{',
          '    gl_Position = vec4(aPosition, 0.0, 1.0);',
          '    vUv0 = (aPosition.xy + 1.0) * 0.5;',
          '}',
        ].join('\n'),
        i = [
          'precision ' + e.precision + ' float;',
          '',
          'uniform sampler2D uColorBuffer;',
          'varying vec2 vUv0;',
          'const float radius = 2.;',
          'const float depth = 0.3;',
          'uniform vec2 mouse;',
          'uniform vec2 res;',
          '',
          'void main() {',
          'vec2 uv = gl_FragCoord.xy/res.xy;',
          'uv.y = uv.y;',
          'vec2 center = mouse.xy/res.xy;',
          'vec2 dc = uv - center;',
          'float ax = dc.x*dc.x*10. + dc.y*dc.y*10.;',
          'float dx = ax*depth/radius * (ax/radius - 1.);',
          'float f = ax > radius ? ax : ax + dx;',
          'vec2 ma = center + (uv-center)*f/ax;',
          '    gl_FragColor = vec4(texture2D(uColorBuffer, ma).rgb, 1.); ',
          '}',
        ].join('\n');
      this.zoomShader = new pc.Shader(e, {
        attributes: t,
        vshader: o,
        fshader: i,
      });
    };
    return (
      ((ZoomEffect.prototype = Object.create(pc.PostEffect.prototype)).constructor = ZoomEffect),
      Object.assign(ZoomEffect.prototype, {
        render: function (e, t, o) {
          var i = this.device,
            r = i.scope,
            c = pc.app.graphicsDevice.maxPixelRatio,
            s = (window.innerWidth / 2) * c,
            a = (window.innerHeight / 2) * c,
            f = window.innerWidth * c,
            n = window.innerHeight * c,
            v = new Float32Array([s, a]),
            u = new Float32Array([f, n]);
          r.resolve('uColorBuffer').setValue(e.colorBuffer),
            r.resolve('mouse').setValue(v),
            r.resolve('res').setValue(u),
            pc.drawFullscreenQuad(i, t, this.vertexBuffer, this.zoomShader, o);
        },
      }),
      {
        ZoomEffect: ZoomEffect,
      }
    );
  })()
);
var Zoom = pc.createScript('zoom');
Zoom.prototype.initialize = function () {
  (this.effect = new pc.ZoomEffect(this.app.graphicsDevice)),
    (this.effect.offset = this.offset),
    (this.effect.darkness = this.darkness),
    this.on(
      'attr',
      function (e, t) {
        this.effect[e] = t;
      },
      this
    );
  var e = this.entity.camera.postEffects;
  e.addEffect(this.effect),
    this.on('state', function (t) {
      t ? e.addEffect(this.effect) : e.removeEffect(this.effect);
    }),
    this.on('destroy', function () {
      e.removeEffect(this.effect);
    });
};
var Waterfall = pc.createScript('waterfall');
Waterfall.attributes.add('noise_1', {
  type: 'asset',
  assetType: 'texture',
}),
  Waterfall.attributes.add('noise_2', {
    type: 'asset',
    assetType: 'texture',
  }),
  Waterfall.attributes.add('top_light_color', {
    type: 'rgba',
  }),
  Waterfall.attributes.add('top_dark_color', {
    type: 'rgba',
  }),
  Waterfall.attributes.add('bot_light_color', {
    type: 'rgba',
  }),
  Waterfall.attributes.add('bot_dark_color', {
    type: 'rgba',
  }),
  Waterfall.attributes.add('speed', {
    type: 'number',
    default: 1.1,
  }),
  Waterfall.attributes.add('opacitySpeed', {
    type: 'number',
    default: 1.1,
  }),
  (Waterfall.prototype.initialize = function () {
    if (this.app.touch) return (this.entity.enabled = !1), !1;
    (this.isLoaded = !1),
      (this.topLightColor = this.top_light_color.data),
      (this.topDarkColor = this.top_dark_color.data),
      (this.botLightColor = this.bot_light_color.data),
      (this.botDarkColor = this.bot_dark_color.data),
      (this.shader = ''),
      (this.shader += '#ifdef MAPCOLOR\n'),
      (this.shader += 'uniform vec3 material_emissive;\n'),
      (this.shader += '#endif\n'),
      (this.shader += '\n'),
      (this.shader += '#ifdef MAPTEXTURE\n'),
      (this.shader += 'uniform sampler2D texture_emissiveMap;\n'),
      (this.shader += '#endif\n'),
      (this.shader += '\n'),
      (this.shader += 'uniform sampler2D noise_tex;\n'),
      (this.shader += 'uniform sampler2D displ_tex;\n'),
      (this.shader += 'uniform vec4 top_light_color;\n'),
      (this.shader += 'uniform vec4 top_dark_color;\n'),
      (this.shader += 'uniform vec4 bot_light_color;\n'),
      (this.shader += 'uniform vec4 bot_dark_color;\n'),
      (this.shader += 'const float displ_amount = 0.02;\n'),
      (this.shader += 'const float bottom_foam_threshold = 0.48;\n'),
      (this.shader += 'uniform float TIME;\n'),
      (this.shader += '\n'),
      (this.shader += 'vec3 getEmission() {\n'),
      (this.shader += '    vec3 emission = vec3(1.0);\n'),
      (this.shader += '    vec2 displ = texture(displ_tex, $UV - TIME / 8.0).xy;\n'),
      (this.shader += '    displ = ((displ * 2.0) - 1.0) * displ_amount;\n'),
      (this.shader += '    \n'),
      (this.shader +=
        '    float noise =  texture(noise_tex, vec2($UV.x, $UV.y / 3.0 - TIME / 4.0) + displ).x;\n'),
      (this.shader += '    noise =  floor(noise * 4.0) / 4.0;\n'),
      (this.shader += '    \n'),
      (this.shader +=
        '    vec4 col = mix(mix(top_dark_color, bot_dark_color, $UV.y), mix(top_light_color, bot_light_color, $UV.y), noise);\n'),
      (this.shader +=
        '    col = mix(vec4(1,1,1,1), col, step($UV.y + displ.y, bottom_foam_threshold));\n'),
      (this.shader += '    \n'),
      (this.shader += '    emission*= col.xyz;\n'),
      (this.shader += '    \n'),
      (this.shader += '    #ifdef MAPVERTEX\n'),
      (this.shader += '        emission *= gammaCorrectInput(saturate(vVertexColor.$VC));\n'),
      (this.shader += '    #endif\n'),
      (this.shader += '    return emission;\n'),
      (this.shader += '}\n');
    var t = this,
      e = this.app.assets.find('Waterfall.glb');
    e.ready(function (e) {
      t.onLoad();
    }),
      this.app.assets.load(e),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      this.on('destroy', this.onDestroy),
      this.onSettingsChange();
  }),
  (Waterfall.prototype.onDestroy = function () {
    this.entity.sound.stop('Waterfall');
  }),
  (Waterfall.prototype.onSettingsChange = function () {
    pc.settings && !0 === pc.settings.disableSpecialEffects && (this.entity.enabled = !1);
  }),
  (Waterfall.prototype.onLoad = function () {
    var t = this.entity.model.model;
    (this.material = t.meshInstances[0].material),
      this.material.setParameter('noise_tex', this.noise_1.resource),
      this.material.setParameter('displ_tex', this.noise_2.resource),
      this.material.setParameter('top_light_color', this.topLightColor),
      this.material.setParameter('top_dark_color', this.topDarkColor),
      this.material.setParameter('bot_light_color', this.botLightColor),
      this.material.setParameter('bot_dark_color', this.botDarkColor),
      (this.material.chunks.emissivePS = this.shader),
      (this.isLoaded = !0);
  }),
  (Waterfall.prototype.update = function (t) {
    if (this.isLoaded) {
      var e = this.app._time * this.speed * 0.001;
      this.material.setParameter('TIME', e),
        (this.material.opacityMapOffset.y = (-e * this.opacitySpeed) % 1),
        this.material.update();
    }
  });
var Button = pc.createScript('button');
Button.attributes.add('connected', {
  type: 'entity',
}),
  Button.attributes.add('triggerFunction', {
    type: 'string',
  }),
  Button.attributes.add('pressFunction', {
    type: 'string',
  }),
  Button.attributes.add('leaveFunction', {
    type: 'string',
  }),
  Button.attributes.add('fireFunction', {
    type: 'string',
  }),
  Button.attributes.add('fireArgs', {
    type: 'string',
  }),
  Button.attributes.add('playSound', {
    type: 'boolean',
    default: !0,
  }),
  Button.attributes.add('waitResolve', {
    type: 'boolean',
  }),
  Button.attributes.add('destroyOnFunction', {
    type: 'boolean',
  }),
  Button.attributes.add('linkButton', {
    type: 'boolean',
    default: !1,
  }),
  Button.attributes.add('openNewTab', {
    type: 'boolean',
    default: !1,
  }),
  Button.attributes.add('link', {
    type: 'string',
  }),
  Button.attributes.add('key', {
    type: 'string',
  }),
  (Button.prototype.initialize = function () {
    (this.spinner = !1),
      (this.text = !1),
      (this.isActivated = !0),
      (this.isDestroyed = !1),
      this.linkButton
        ? (this.createLinkElement(),
          this.on(
            'state',
            function (t) {
              this.entity.enabled ? this.createLinkElement() : this.element.remove();
            },
            this
          ))
        : Utils.isMobile()
        ? (this.entity.element.on('touchstart', this.onPress, this),
          this.entity.element.on('touchend', this.onLeave, this))
        : (this.entity.element.on('mouseenter', this.onHover, this),
          this.entity.element.on('mouseleave', this.onLeave, this),
          this.entity.element.on('mousedown', this.onPress, this)),
      this.linkButton ||
        this.on(
          'state',
          function (t) {
            this.resolve();
          },
          this
        ),
      this.entity.findByName('Spinner') &&
        ((this.spinner = this.entity.findByName('Spinner')), (this.spinner.enabled = !1)),
      this.entity.findByName('Text') &&
        ((this.text = this.entity.findByName('Text')), (this.text.enabled = !0)),
      this.app.on('Button:' + this.entity.name, this.onState, this),
      this.app.on('Button:' + this.entity.name + ':Resolve', this.resolve, this),
      this.app.on('Link:' + this.entity.name, this.setLink, this),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this);
  }),
  (Button.prototype.onDOMClear = function () {
    this.entity.enabled = !1;
  }),
  (Button.prototype.onDomUpdate = function () {
    this.updateStyle();
  }),
  (Button.prototype.setLink = function (t) {
    'object' == typeof t && t[this.key] && (t = t[this.key]),
      (this.link = t),
      this.element && this.element.setAttribute('href', this.link);
  }),
  (Button.prototype.createLinkElement = function () {
    var t = this;
    (this.element = document.createElement('a')),
      (this.element.style.width = this.entity.element.width + 'px'),
      (this.element.style.height = this.entity.element.height + 'px'),
      (this.element.id = this.entity.name),
      (this.element.className = 'container'),
      (this.element.onclick = function () {
        pc.firstPressFunction ||
          (console.log('First Press : Link ' + t.link),
          pc.app.fire('Analytics:Event', 'Checkpoint', 'First Press : Link ' + t.link),
          (pc.firstPressFunction = !0));
      }),
      this.element.setAttribute('href', this.link),
      this.openNewTab && this.element.setAttribute('target', '_blank'),
      (this.element.style.position = 'absolute'),
      (this.element.style.overflow = 'hidden'),
      document.body.appendChild(this.element),
      this.updateStyle();
  }),
  (Button.prototype.updateStyle = function () {
    if (this.isDestroyed) return !1;
    if (!this.element) return !1;
    if (
      this.entity &&
      this.entity.enabled &&
      this.entity.element &&
      this.entity.element.screenCorners
    ) {
      var t = this.entity.element.screenCorners,
        e = 1 / this.app.graphicsDevice.maxPixelRatio;
      (this.element.style.left = t[0].x * e + 'px'),
        (this.element.style.bottom = t[0].y * e + 'px'),
        (this.element.style.position = 'absolute'),
        (this.element.style.display = 'block'),
        (this.element.style.zIndex = 1e3);
      var i = ((t[2].x - t[0].x) * e) / this.entity.element.width,
        n = ((t[2].y - t[0].y) * e) / this.entity.element.height;
      (this.element.style.transform = 'scale(' + i + ', ' + n + ')'),
        (this.element.style.transformOrigin = 'left bottom');
    }
  }),
  (Button.prototype.onState = function (t) {
    this.entity.button && (this.entity.button.active = t);
  }),
  (Button.prototype.onHover = function (t) {
    (document.body.style.cursor = 'pointer'), this.playSound;
  }),
  (Button.prototype.onLeave = function (t) {
    document.body.style.cursor = 'default';
    var e = this.leaveFunction.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var n = e[i].split('@'),
          s = n[0];
        if (n.length > 1) {
          var o = n[1];
          this.app.fire(s, o);
        } else this.app.fire(s);
      }
  }),
  (Button.prototype.loading = function () {
    if (!this.entity.enabled) return !1;
    (this.spinner.enabled = !0),
      (this.text.enabled = !1),
      this.entity.button && (this.entity.button.active = !1);
  }),
  (Button.prototype.resolve = function () {
    if (!this.entity.enabled) return !1;
    (this.spinner.enabled = !1),
      (this.text.enabled = !0),
      (this.isActivated = !0),
      this.entity.button && (this.entity.button.active = !0);
  }),
  (Button.prototype.onPress = function (t) {
    if (
      (pc.firstPressFunction ||
        (console.log('First Press : ' + this.pressFunction + ' - ' + this.fireFunction),
        pc.app.fire(
          'Analytics:Event',
          'Checkpoint',
          'First Press : ' + this.pressFunction + ' - ' + this.fireFunction
        ),
        (pc.firstPressFunction = !0)),
      pc.isButtonLocked)
    )
      return !1;
    if (this.entity.button && !this.entity.button.active) return !1;
    if (!this.isActivated) return !1;
    var e = this.pressFunction.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var n = e[i].split('@'),
          s = n[0];
        if (n.length > 1) {
          var o = n[1];
          this.app.fire(s, o);
        } else this.app.fire(s);
      }
    setTimeout(
      function (t, e) {
        t.onPressFire(e);
      },
      100,
      this,
      t
    );
  }),
  (Button.prototype.onPressFire = function (event) {
    if (
      (this.playSound && this.app.fire('Sound:Play', 'Primary-Click'),
      this.waitResolve &&
        (this.spinner && ((this.spinner.enabled = !0), (this.text.enabled = !1)),
        this.entity.button && (this.entity.button.active = !1),
        (this.isActivated = !1)),
      this.connected)
    ) {
      var connectedEntity = this.connected,
        self = this.entity;
      try {
        eval('connectedEntity.script.' + this.triggerFunction);
      } catch (t) {
        console.log('Button couldnt execute command!');
      }
    } else if (this.fireFunction)
      if (this.fireArgs) this.app.fire(this.fireFunction, this.fireArgs);
      else {
        var fireFunction = this.fireFunction.split(', ');
        if (fireFunction.length > 0)
          for (var successIndex in fireFunction) {
            var successFunction = fireFunction[successIndex],
              parts = successFunction.split('@'),
              key = parts[0];
            if (parts.length > 1) {
              var value = parts[1];
              'data' == value && (value = this.entity._data),
                'entity' == value && (value = this.entity),
                this.app.fire(key, value);
            } else this.app.fire(key);
          }
      }
    else
      try {
        eval(this.triggerFunction);
      } catch (t) {
        console.log('Button couldnt execute command!');
      }
    this.destroyOnFunction && this.entity.destroy();
  });
var Point = pc.createScript('point');
Point.attributes.add('playerEntity', {
  type: 'entity',
}),
  Point.attributes.add('radius', {
    type: 'number',
    default: 5,
  }),
  Point.attributes.add('labelEntity', {
    type: 'entity',
  }),
  Point.attributes.add('screenEntity', {
    type: 'entity',
  }),
  Point.attributes.add('objectiveBackground', {
    type: 'entity',
  }),
  (Point.prototype.initialize = function () {
    (this.activePlayer = !1),
      (this.distance = 100),
      (this.wasInside = !1),
      (this.isFocused = !1),
      this.app.on('Mode:NextObjective', this.onNextObjective, this),
      this.app.on('Mode:Objective', this.setObjectivePosition, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Objective:Inside', this.onInside, this),
      this.app.on('Player:Focused', this.onFocusChange, this),
      this.on('state', this.onStateChange),
      this.on('destroy', this.onDestroy, this);
  }),
  (Point.prototype.onDestroy = function () {}),
  (Point.prototype.onFocusChange = function (t) {
    this.isFocused != t &&
      (!0 === t ? this.entity.setLocalScale(1, 0.5, 1) : this.entity.setLocalScale(1, 1, 1)),
      (this.isFocused = t);
  }),
  (Point.prototype.onInside = function (t) {
    t
      ? ((this.objectiveBackground.element.color = pc.colors.capture),
        (this.objectiveBackground.element.opacity = 0.5))
      : ((this.objectiveBackground.element.color = pc.colors.black),
        (this.objectiveBackground.element.opacity = 0.15),
        (this.wasInside = !1));
  }),
  (Point.prototype.onStateChange = function (t) {
    t ? this.app.on('Objective:Inside', this.onInside, this) : this.app.off('Objective:Inside');
  }),
  (Point.prototype.onFinish = function () {
    (this.labelEntity.enabled = !1), (this.entity.enabled = !1);
  }),
  (Point.prototype.setObjectivePosition = function (t) {
    t && this.entity.setPosition(t.x, t.y, t.z);
  }),
  (Point.prototype.onNextObjective = function (t) {
    if (!1 === t) return !1;
    var i = this.app.root.findByName('MapHolder');
    if (!i) return !1;
    var e = i.findByTag('Objective')[t];
    if (e) {
      var o = e.getPosition().clone();
      o.x && o.y && o.z && this.entity.setPosition(o);
    }
  }),
  (Point.prototype.update = function () {});
var SpellManager = pc.createScript('spellManager');
SpellManager.attributes.add('playerEntity', {
  type: 'entity',
}),
  SpellManager.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('electricityEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('sparkEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('armLeftEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('armRightEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('iceEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('iceTexture', {
    type: 'asset',
    assetType: 'texture',
  }),
  SpellManager.attributes.add('venomEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('windEntity', {
    type: 'entity',
  }),
  SpellManager.attributes.add('windEntityPlayer', {
    type: 'entity',
  }),
  SpellManager.attributes.add('daggerPower', {
    type: 'entity',
  }),
  (SpellManager.prototype.initialize = function () {
    var e = this.app.scene.fogColor,
      t = this.app.scene.fogDensity,
      i = this.app.scene.skyboxIntensity;
    (this.currentSpell = !1),
      (this.characterName = 'Lilium'),
      (this.isReducedApplied = !1),
      (this.isVenomActive = !1),
      (this.isFrostBombActive = !1),
      (this.midnightCurseTimer = !1),
      (this.defaultFog = this.app.scene.fog + ''),
      (this.defaultFogColor = e),
      (this.defaultDensity = t),
      (this.defaultSkyboxIntensity = i),
      this.app.on('Spell:Trigger', this.onSpellTrigger, this),
      this.app.on('Effect:Trigger', this.onEffectTrigger, this),
      this.app.on('Game:Start', this.onGameStart, this),
      this.app.on('Game:Finish', this.onGameFinish, this),
      this.app.on('Player:Respawn', this.onRespawn, this),
      this.app.on('Player:Death', this.onSpellCancel, this),
      this.app.on('Player:Character', this.onCharacterSet, this),
      (this.spellCount = 0),
      (this.isActiveSpell = !1),
      (this.activeSpells = []),
      (this.daggerPower.enabled = !1),
      (this.weaponMaterial = !1),
      (this.player = this.playerEntity.script.player),
      (this.playerAbilities = this.playerEntity.script.playerAbilities);
  }),
  (SpellManager.prototype.onCharacterSet = function (e) {
    this.characterName = e;
  }),
  (SpellManager.prototype.onGameStart = function () {
    'Lilium' == this.characterName
      ? (this.playerAbilities.throwCooldown = 10)
      : 'Shin' == this.characterName && (this.playerAbilities.throwCooldown = 5),
      (this.isReducedApplied = !1);
  }),
  (SpellManager.prototype.onRespawn = function () {
    (this.app.scene.fogColor = this.defaultFogColor), (this.app.scene.fogDensity = 1e-4);
  }),
  (SpellManager.prototype.onEffectTrigger = function (e, t) {
    if ('Wind' == e) {
      var i = 1.367,
        a = 0.878,
        n = 300;
      t && t > 0 && (n = t),
        this.cameraEntity.camera.fov > 75 && ((i = 1.972), (a = 1.266)),
        this.windEntity.setLocalScale(i, a, a),
        (this.windEntity.enabled = !0),
        (this.windEntityPlayer.enabled = !0),
        setTimeout(
          function (e) {
            (e.windEntity.enabled = !1), (e.windEntityPlayer.enabled = !1);
          },
          n,
          this
        );
    }
    'DaggerPower' == e &&
      ((this.daggerPower.enabled = !0),
      clearTimeout(this.daggerPowerTimeout),
      (this.daggerPowerTimeout = setTimeout(
        function (e) {
          e.daggerPower.enabled = !1;
        },
        5e3,
        this
      )));
  }),
  (SpellManager.prototype.applySparkySpells = function () {
    (this.sparkEntity.enabled = !0),
      this.activeSpells.push('GrenadeSpell'),
      (this.currentSpell = 'SparkySpells'),
      this.entity.sound.play('Negative-Effect-02'),
      this.entity.sound.play('Ice-Loop'),
      setTimeout(
        function (e) {
          e.cancelSparkySpells();
        },
        4500,
        this
      );
  }),
  (SpellManager.prototype.cancelSparkySpells = function () {
    var e = this;
    e.entity.sound.stop('Ice-Loop'),
      e.entity.sound.play('Magic-Whoosh-1'),
      setTimeout(function () {
        e.sparkEntity.enabled = !1;
      }, 700),
      e.activeSpells.splice(e.activeSpells.indexOf('GrenadeSpell'), 1);
  }),
  (SpellManager.prototype.applyMidnightCurse = function () {
    this.entity.sound.play('Wolf-Howl'),
      this.entity.sound.play('Negative-Effect-01'),
      this.entity.sound.play('Shadow-Loop-2'),
      this.app.fire('Player:StopSpeaking', !0),
      (this.currentSpell = 'MidnightCurse'),
      this.activeSpells.push('GrenadeSpell'),
      (this.app.scene.fogColor = pc.colors.purple),
      (this.app.scene.fogDensity = 0.01),
      this.app
        .tween(this.app.scene)
        .to(
          {
            fogDensity: 0.3,
            skyboxIntensity: 0.3,
          },
          0.3,
          pc.Linear
        )
        .start(),
      clearTimeout(this.midnightCurseTimer),
      (this.midnightCurseTimer = setTimeout(
        function (e) {
          e.cancelMidnightCurse();
        },
        1e4,
        this
      ));
  }),
  (SpellManager.prototype.cancelMidnightCurse = function () {
    var e = this;
    e.app
      .tween(e.app.scene)
      .to(
        {
          fogDensity: 1e-4,
          skyboxIntensity: e.defaultSkyboxIntensity,
        },
        0.3,
        pc.Linear
      )
      .delay(0.2)
      .start(),
      e.entity.sound.play('Magic-Whoosh-1'),
      setTimeout(function () {
        e.entity.sound.stop('Shadow-Loop-2'),
          e.activeSpells.splice(e.activeSpells.indexOf('GrenadeSpell'), 1);
      }, 1e3);
  }),
  (SpellManager.prototype.applyMuscleShock = function () {
    if (this.player.isDeath)
      return (
        (this.spellCount = 0),
        this.activeSpells.splice(this.activeSpells.indexOf('GrenadeSpell'), 1),
        !1
      );
    if (this.spellCount > 4 || pc.isFinished)
      return (
        (this.spellCount = 0),
        (this.isActiveSpell = !1),
        this.activeSpells.splice(this.activeSpells.indexOf('GrenadeSpell'), 1),
        !1
      );
    var e = Math.round(2 * Math.random()) + 1,
      t = Math.round(500 * Math.random()) - Math.round(500 * Math.random()),
      i = -Math.round(400 * Math.random()),
      a = 180 * Math.random();
    (this.currentSpell = 'MuscleShock'),
      this.activeSpells.push('GrenadeSpell'),
      this.entity.sound.play('Electric-Shock-' + e),
      this.player.finishEmote(),
      this.player.movement.disableMovement(),
      this.app
        .tween(pc.controls.animation)
        .to(
          {
            cameraBounce: 0.8,
          },
          0.04,
          pc.Linear
        )
        .yoyo(!0)
        .repeat(7)
        .start(),
      this.app
        .tween(this.player.movement.animation)
        .to(
          {
            bounceAngle: 3,
          },
          0.03,
          pc.Linear
        )
        .yoyo(!0)
        .repeat(7)
        .start(),
      this.app.fire('Player:StopSpeaking', !0),
      this.app.fire('Network:Hurt', !0),
      (this.electricityEntity.enabled = !0),
      this.electricityEntity.setLocalPosition(t, i, 0),
      this.electricityEntity.setLocalEulerAngles(0, 0, a),
      setTimeout(
        function (e) {
          e.player.movement.enableMovement();
        },
        400 * Math.random() + 100,
        this
      ),
      setTimeout(
        function (e) {
          e.electricityEntity.enabled = !1;
        },
        150,
        this
      ),
      setTimeout(
        function (e) {
          e.applyMuscleShock();
        },
        600,
        this
      ),
      this.spellCount++;
  }),
  (SpellManager.prototype.applyVenom = function () {
    if (this.player.isDeath)
      return this.activeSpells.splice(this.activeSpells.indexOf('GrenadeSpell'), 1), !1;
    if (this.isVenomActive) return !1;
    (this.venomEntity.enabled = !0),
      (this.venomEntity.sprite.opacity = 0.2),
      (this.venomTween = this.app.tween(this.venomEntity.sprite).to(
        {
          opacity: 0.45,
        },
        2,
        pc.BackIn
      )),
      this.venomTween.start(),
      this.entity.sound.play('Venom'),
      this.entity.sound.play('Negative-Effect-01'),
      this.entity.sound.play('Heart-Beat'),
      (this.isVenomActive = !1),
      this.app.fire('Network:Hurt', !0),
      this.player.movement.slowMovement(1.5),
      this.activeSpells.push('GrenadeSpell'),
      setTimeout(
        function (e) {
          e.cancelVenom();
        },
        2500,
        this
      );
  }),
  (SpellManager.prototype.cancelVenom = function () {
    this.venomTween && this.venomTween.stop(),
      (this.venomTween = this.app.tween(this.venomEntity.sprite).to(
        {
          opacity: 0,
        },
        0.5,
        pc.BackIn
      )),
      this.venomTween.start(),
      this.app.fire('Player:StopSpeaking', !0),
      this.player.movement.fastMovement(),
      this.entity.sound.play('Magic-Whoosh-1'),
      this.entity.sound.stop('Heart-Beat'),
      (this.isVenomActive = !1),
      setTimeout(
        function (e) {
          e.venomEntity.enabled = !1;
        },
        700,
        this
      );
  }),
  (SpellManager.prototype.applyFrostBomb = function () {
    if (this.player.isDeath)
      return this.activeSpells.splice(this.activeSpells.indexOf('GrenadeSpell'), 1), !1;
    if (this.isFrostBombActive) return !1;
    var e = this;
    (this.iceEntity.enabled = !0),
      (this.iceMaterial = this.iceEntity.model.meshInstances[0].material),
      (this.iceMaterial.opacity = 0),
      (this.isFrostBombActive = !0),
      (this.iceTween = this.app.tween(this.iceMaterial).to(
        {
          opacity: 1,
        },
        1,
        pc.Linear
      )),
      this.iceTween.on('update', function (t) {
        e.iceMaterial.update();
      }),
      this.iceTween.start(),
      this.entity.sound.play('Ice-Start'),
      this.app.fire('Player:StopSpeaking', !0),
      this.player.movement.disableMovement(),
      (this.player.movement.mouseLocked = !0),
      (this.weaponEntity = this.player.weaponManager.currentWeaponEntity),
      (this.weaponMaterial = this.weaponEntity.model.meshInstances[0].material),
      (this.weaponMaterial.emissiveMap = this.iceTexture.resource),
      this.weaponMaterial.update(),
      this.armLeftEntity &&
        this.armLeftEntity.model &&
        this.armLeftEntity.model.meshInstances.length > 0 &&
        ((this.armsEntityMaterial = this.armLeftEntity.model.meshInstances[0].material),
        (this.armsEntityMaterial.emissiveMap = this.iceTexture.resource),
        this.armsEntityMaterial.update()),
      this.app.fire('Network:Hurt', !0),
      this.app.fire('Weapon:Lock', !0),
      setTimeout(
        function (e) {
          e.cancelFrostBomb();
        },
        2e3,
        this
      ),
      this.activeSpells.push('GrenadeSpell');
  }),
  (SpellManager.prototype.cancelFrostBomb = function () {
    var e = this;
    this.entity.sound.play('Ice-Break'),
      this.entity.sound.play('Magic-Whoosh-1'),
      (this.isFrostBombActive = !1),
      (this.iceMaterial = this.iceEntity.model.meshInstances[0].material),
      this.iceTween && this.iceTween.stop(),
      (this.iceTween = this.app.tween(this.iceMaterial).to(
        {
          opacity: 0,
        },
        0.3,
        pc.Linear
      )),
      this.iceTween.on('update', function (t) {
        e.iceMaterial.update();
      }),
      this.iceTween.start(),
      this.player.movement.enableMovement(),
      (this.player.movement.mouseLocked = !1),
      this.app.fire('Weapon:Lock', !1),
      this.weaponMaterial &&
        ((this.weaponMaterial.emissiveMap = !1),
        this.weaponMaterial.update(),
        this.armsEntityMaterial &&
          ((this.armsEntityMaterial.emissiveMap = !1), this.armsEntityMaterial.update())),
      setTimeout(
        function (e) {
          e.iceEntity.enabled = !1;
        },
        300,
        this
      );
  }),
  (SpellManager.prototype.cancelMuscleShock = function () {}),
  (SpellManager.prototype.applyReduce = function () {
    this.isReducedApplied ||
      ('Lilium' == this.characterName
        ? (this.playerAbilities.throwCooldown = 7)
        : 'Shin' == this.characterName && (this.playerAbilities.throwCooldown = 3),
      (this.isReducedApplied = !0),
      this.app.fire(
        'Overlay:Announce',
        'Reduce',
        'Throw cooldown time reduced',
        !1,
        'Reduce-Icon'
      ));
  }),
  (SpellManager.prototype.onSpellCancel = function () {
    'MidnightCurse' == this.currentSpell && this.cancelMidnightCurse(),
      'MuscleShock' == this.currentSpell && this.cancelMuscleShock(),
      'SparkySpells' == this.currentSpell && this.cancelSparkySpells(),
      'FrostBomb' == this.currentSpell && this.cancelFrostBomb(),
      'Venom' == this.currentSpell && this.cancelVenom();
  }),
  (SpellManager.prototype.onSpellTrigger = function (e, t) {
    if (this.activeSpells.indexOf(e) > -1) return !1;
    'MidnightCurse' == e &&
      (this.applyMidnightCurse(),
      this.app.fire('Overlay:Announce', 'Midnight Curse', 'by ' + t, !1, 'MidnightCurse-Icon')),
      'FrostBomb' == e &&
        (this.applyFrostBomb(),
        this.app.fire('Overlay:Announce', 'Frost Bomb', 'by ' + t, !1, 'FrostBomb-Icon')),
      'MuscleShock' == e &&
        (this.applyMuscleShock(),
        this.app.fire('Overlay:Announce', 'Muscle Shock', 'by ' + t, !1, 'MuscleShock-Icon')),
      'SparkySpells' == e &&
        (this.applySparkySpells(),
        this.app.fire('Overlay:Announce', 'Sparky Sprites', 'by ' + t, !1, 'SparkySpells-Icon')),
      'Venom' == e &&
        (this.applyVenom(),
        this.app.fire('Overlay:Announce', 'Venom', 'by ' + t, !1, 'Venom-Icon')),
      'Reduce' == e && this.applyReduce();
  }),
  (SpellManager.prototype.update = function (e) {});
var Tab = pc.createScript('tab');
Tab.attributes.add('menu', {
  type: 'string',
  array: !0,
}),
  Tab.attributes.add('page', {
    type: 'entity',
    array: !0,
  }),
  Tab.attributes.add('align', {
    type: 'string',
    enum: [
      {
        Vertical: 'Vertical',
      },
      {
        Horizontal: 'Horizontal',
      },
    ],
    default: 'Vertical',
  }),
  Tab.attributes.add('buttonEntity', {
    type: 'entity',
  }),
  Tab.attributes.add('buttonHolder', {
    type: 'entity',
  }),
  Tab.attributes.add('onlyTabs', {
    type: 'boolean',
    default: !1,
  }),
  (Tab.prototype.initialize = function () {
    for (var t in ((this.menuItems = []), (this.buttonEntity.enabled = !1), this.menu)) {
      var e = this.menu[t],
        a = this.buttonEntity.element.width,
        n = this.buttonEntity.element.height,
        i = this.buttonEntity.clone();
      (i.enabled = !0),
        (i.findByName('Text').element.text = e),
        (i.script.button.fireArgs = e),
        (i.element.opacity = 0),
        (i.name = e),
        'Vertical' == this.align
          ? i.setLocalPosition(0, -parseInt(t) * n, 0)
          : i.setLocalPosition(parseInt(t) * a, 0, 0),
        this.menuItems.push(i),
        this.buttonHolder.addChild(i);
    }
    this.app.on('Tab:' + this.entity.name, this.onTabChange, this),
      this.on('state', this.onStateChange, this),
      this.onTabChange(this.menu[0]);
  }),
  (Tab.prototype.onStateChange = function (t) {
    !0 === t && this.onTabChange(this.menu[0]);
  }),
  (Tab.prototype.onTabChange = function (t) {
    for (var e in this.page) {
      var a = this.page[e];
      a &&
        this.menuItems.length != this.page.length &&
        (a.name == t ? (a.enabled = !0) : (a.enabled = !1));
    }
    for (var n in this.menuItems) {
      var i = this.menuItems[n];
      if (this.onlyTabs) i.name == t ? (i.element.opacity = 1) : (i.element.opacity = 0);
      else {
        var s = this.page[n];
        i.name == t
          ? (i && (i.element.opacity = 1), (s.enabled = !0))
          : (i && (i.element.opacity = 0), (s.enabled = !1));
      }
    }
    this.app.fire('Tab:' + this.entity.name + ':Changed', t);
  });
var Page = pc.createScript('page');
Page.attributes.add('activeOpacity', {
  type: 'number',
  default: 0.05,
}),
  Page.attributes.add('defaultOpacity', {
    type: 'number',
    default: 0,
  }),
  Page.attributes.add('activePage', {
    type: 'string',
  }),
  (Page.prototype.initialize = function () {
    this.app.on('Page:' + this.entity.name, this.setPage, this),
      this.activePage && this.app.fire('Page:' + this.entity.name, this.activePage);
  }),
  (Page.prototype.setPage = function (t) {
    var e = this.entity.findByTag('Page'),
      a = this.entity.findByTag('Menu');
    for (var i in e) {
      var n = e[i];
      for (var p in (n.name == t ? (n.enabled = !0) : (n.enabled = !1), a)) {
        var r = a[p];
        r.name == t
          ? (r.element.opacity = this.activeOpacity)
          : (r.element.opacity = this.defaultOpacity);
      }
    }
  });
var Cookie = pc.createScript('cookie');
Cookie.attributes.add('key', {
  type: 'string',
}),
  Cookie.attributes.add('onGet', {
    type: 'string',
  }),
  (Cookie.prototype.initialize = function () {
    this.onGet && this.getCookie(),
      this.app.on('Cookie:' + this.entity.name, this.setCookie, this),
      this.app.on('Cookie:' + this.entity.name + ':Clear', this.clearCookie, this);
  }),
  (Cookie.prototype.onInitTrigger = function (t) {
    var i = this.onGet.split(', ');
    if (i.length > 0)
      for (var e in i) {
        var o = i[e],
          r = o.split('@');
        if (r.length > 1) {
          var s = r[0],
            n = r[1];
          this.app.fire(s, n);
        } else this.app.fire(o, t);
      }
  }),
  (Cookie.prototype.clearCookie = function (t) {
    JSON.stringify(t);
    Utils.setItem(this.key, null),
      void 0 !== window.localStorage && window.localStorage.removeItem(this.key),
      this.app.fire(this.onGet, !1);
  }),
  (Cookie.prototype.setCookie = function (t) {
    if ('Clear' == t) return this.clearCookie(), !1;
    var i = JSON.stringify(t);
    Utils.setItem(this.key, i);
  }),
  (Cookie.prototype.getCookie = function () {
    var t = Utils.getItem(this.key);
    if (t) {
      var i = JSON.parse(t);
      i && this.onInitTrigger(i);
    }
  });
var Fetcher = pc.createScript('fetcher');
Fetcher.attributes.add('auto', {
  type: 'boolean',
  default: !0,
}),
  Fetcher.attributes.add('cache', {
    type: 'boolean',
    default: !1,
  }),
  Fetcher.attributes.add('URL', {
    type: 'string',
  }),
  Fetcher.attributes.add('data', {
    type: 'string',
  }),
  Fetcher.attributes.add('template', {
    type: 'string',
    description: 'Format data',
  }),
  Fetcher.attributes.add('loading', {
    type: 'string',
  }),
  Fetcher.attributes.add('loadingEntity', {
    type: 'entity',
  }),
  Fetcher.attributes.add('confirmation', {
    type: 'boolean',
    default: !1,
  }),
  Fetcher.attributes.add('success', {
    type: 'string',
  }),
  Fetcher.attributes.add('error', {
    type: 'string',
  }),
  (Fetcher.prototype.initialize = function () {
    (this.lastCall = -1),
      this.auto &&
        (this.onFetch(),
        this.on('state', function (t) {
          !0 === t && this.onFetch();
        })),
      (this.onCallback = !1),
      (this.cacheData = !1),
      (this.waitForAction = !1),
      this.cache
        ? this.app.on('Fetcher:' + this.entity.name, this.onCache, this)
        : this.app.on('Fetcher:' + this.entity.name, this.onFetch, this),
      this.app.on('Trigger:Login', this.setWaitingAction, this);
  }),
  (Fetcher.prototype.setWaitingAction = function (t) {
    if (this.waitForAction) {
      var e = this.preprocess(this.URL);
      this.fetch(e, this.data, this.onResult.bind(this)), (this.waitForAction = !1);
    }
  }),
  (Fetcher.prototype.onResult = function (t) {
    if ((this.loadingEntity && (this.loadingEntity.enabled = !1), t)) {
      if (t.action) return this.callAction(t.action), (this.waitForAction = !0), !1;
      t.success ? (this.onSuccess(t), this.onCallback && this.onCallback(t)) : this.onError(t);
    } else this.onError('An error occured!');
  }),
  (Fetcher.prototype.onLoading = function () {
    var t = this.loading.split(', ');
    if (t.length > 0)
      for (var e in t) {
        var i = t[e],
          r = i.split('@');
        if (r.length > 1) {
          var a = r[0],
            n = r[1];
          this.app.fire(a, n);
        } else this.app.fire(i, !0);
      }
    this.loadingEntity && (this.loadingEntity.enabled = !0);
  }),
  (Fetcher.prototype.onSuccess = function (t) {
    var e = this.success.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var r = e[i],
          a = r.split('@');
        if (a.length > 1) {
          var n = a[0],
            s = a[1];
          this.app.fire(n, s);
        } else this.app.fire(r, t);
      }
  }),
  (Fetcher.prototype.callAction = function (t) {
    var e = t.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var r = e[i],
          a = r.split('@');
        if (a.length > 1) {
          var n = a[0],
            s = a[1];
          this.app.fire(n, s);
        } else this.app.fire(r);
      }
  }),
  (Fetcher.prototype.onError = function (t) {
    if (this.error) {
      var e = this.error.split(', ');
      if (e.length > 0)
        for (var i in e) {
          var r = e[i],
            a = r.split('@');
          if (a.length > 1) {
            var n = a[0],
              s = a[1];
            this.app.fire(n, s);
          } else this.app.fire(r, t);
        }
    }
  }),
  (Fetcher.prototype.getRoomId = function (t) {
    var e = window.location.hash.split('#');
    return e.length > 1 && e[1];
  }),
  (Fetcher.prototype.getSession = function () {
    var t = Utils.getItem('Hash');
    return t || '';
  }),
  (Fetcher.prototype.preprocess = function (t) {
    var e = t;
    return (e = (e = (e = (e = e.replace('$hash', this.getRoomId())).replace(
      '$session',
      this.getSession()
    )).replace('$is_mobile', pc.isMobile)).replace('$current_map', pc.currentMap));
  }),
  (Fetcher.prototype.onCache = function () {
    this.cacheData ? this.onResult(this.cacheData) : this.onFetch(data, callback);
  }),
  (Fetcher.prototype.onFetch = function (t, e) {
    if (!this.entity.enabled) return !1;
    if (Date.now() - this.lastCall < 500) return !1;
    this.template
      ? (this.data = JSON.parse(this.template.replace('variable', t)))
      : t && (this.data = t);
    var i = this.preprocess(this.URL);
    if (
      (this.onLoading(),
      (this.onCallback = !(!e || 'function' != typeof e) && e),
      this.confirmation && this.data.requireConfirmation) &&
      !confirm('Are you sure to execute this action?')
    )
      return !1;
    this.fetch(i, this.data, this.onResult.bind(this)), (this.lastCall = Date.now());
  }),
  (Fetcher.prototype.fetch = function (t, e, i) {
    var r =
        'string' == typeof e
          ? e
          : Object.keys(e)
              .map(function (t) {
                return encodeURIComponent(t) + '=' + encodeURIComponent(e[t]);
              })
              .join('&'),
      a = this,
      n = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    n.open('POST', t),
      (n.onreadystatechange = function () {
        n.readyState > 3 &&
          200 == n.status &&
          ((a.cache = JSON.parse(n.responseText)), i(JSON.parse(n.responseText)));
      }),
      (n.withCredentials = !0),
      n.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
      n.send(r);
  });
var Form = pc.createScript('form');
Form.attributes.add('inputs', {
  type: 'entity',
  array: !0,
}),
  Form.attributes.add('keys', {
    type: 'string',
    array: !0,
  }),
  Form.attributes.add('onSubmit', {
    type: 'string',
  }),
  (Form.prototype.initialize = function () {
    this.app.on('Form:' + this.entity.name, this.onFormSubmit, this),
      this.app.on('FormSet:' + this.entity.name, this.onFormSet, this);
  }),
  (Form.prototype.onFormSet = function (t) {
    for (var i in this.keys) {
      var e = this.keys[i],
        s = this.inputs[i].script;
      s.input
        ? this.inputs[i].script.input.setValue(t[e])
        : s.checkbox
        ? this.inputs[i].script.checkbox.setValue(t[e])
        : s.select
        ? this.inputs[i].script.select.setValue(t[e])
        : s.hidden && this.inputs[i].script.hidden.setValue(t[e]);
    }
  }),
  (Form.prototype.onFormSubmit = function () {
    var t = {};
    for (var i in this.keys) {
      var e = this.keys[i],
        s = this.inputs[i].script;
      s.input
        ? (t[e] = this.inputs[i].script.input.getValue())
        : s.checkbox
        ? (t[e] = this.inputs[i].script.checkbox.getValue())
        : s.select
        ? (t[e] = this.inputs[i].script.select.getValue())
        : s.hidden && (t[e] = this.inputs[i].script.hidden.getValue());
    }
    this.app.fire('Fetcher:' + this.entity.name, t), this.app.fire(this.onSubmit, !0);
  }),
  (Form.prototype.update = function () {
    this.app.keyboard.wasPressed(pc.KEY_ENTER) && this.app.fire('Form:' + this.entity.name, !0);
  });
var Table = pc.createScript('table');
Table.attributes.add('labels', {
  type: 'string',
  array: !0,
}),
  Table.attributes.add('keys', {
    type: 'string',
    array: !0,
  }),
  Table.attributes.add('buttons', {
    type: 'string',
    array: !0,
  }),
  Table.attributes.add('color', {
    type: 'rgb',
  }),
  Table.attributes.add('rowColor', {
    type: 'rgb',
  }),
  Table.attributes.add('header', {
    type: 'boolean',
    default: !0,
  }),
  Table.attributes.add('headerColor', {
    type: 'rgb',
  }),
  Table.attributes.add('opacity', {
    type: 'number',
    default: 0.1,
    max: 1,
    min: 0,
    step: 0.1,
  }),
  Table.attributes.add('destroyButton', {
    type: 'boolean',
  }),
  Table.attributes.add('cdn', {
    type: 'string',
    enum: [
      {
        maps: 'maps',
      },
      {
        assets: 'assets',
      },
    ],
    default: 'assets',
  }),
  (Table.prototype.initialize = function () {
    (this.isDestroyed = !1),
      (this.buttonsDisabled = !1),
      (this.rows = []),
      this._onInit(),
      this.on(
        'state',
        function (t) {
          this.entity.enabled ? this._onInit() : this.container.remove();
        },
        this
      ),
      this.on('destroy', this.onDestroy, this),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.app.on('Table:' + this.entity.name, this.onSet, this);
  }),
  (Table.prototype.onDOMClear = function () {
    (this.entity.enabled = !1), (this.buttonsDisabled = !1);
  }),
  (Table.prototype.onDestroy = function () {
    this.app.off('DOM:Update'),
      (this.isDestroyed = !0),
      (this.buttonsDisabled = !1),
      this.container && this.container.remove();
  }),
  (Table.prototype.onDomUpdate = function () {
    this.updateStyle();
  }),
  (Table.prototype._onInit = function () {
    (this.container = document.createElement('div')),
      (this.container.style.width = this.entity.element.width + 'px'),
      (this.container.style.height = this.entity.element.height + 'px');
    var t = '';
    (t += 'table { border-collapse: collapse; }'),
      (t += 'table, td { font-size:14px; }'),
      (t += 'table a { color:#fff; text-decoration:none; font-weight:bold; font-size:15px;'),
      (t += 'background-color:rgba(0, 0, 0, 0.1); padding: 2px 5px; }'),
      (t += 'table, td:first-child, th:last-child { width: 10px; }'),
      (t += 'table, td:last-child, th:last-child { width: 50px; }'),
      (t += '.two-buttons td:last-child, .two-buttons th:last-child { width: 1vw; }'),
      (t += 'table, button { margin-right:5px; padding: 0.3vw; float:left }'),
      (t += 'table, th, td { padding:0.3vw }'),
      (t += 'table, .verification { height:16px; float:left; margin-right: 5px; }'),
      (t +=
        'table, tr:nth-child(even) { background-color:' +
        ('rgba(' +
          255 * this.rowColor.r +
          ', ' +
          255 * this.rowColor.g +
          ', ' +
          255 * this.rowColor.b +
          ', ' +
          this.opacity +
          ')') +
        '; }'),
      (t += 'table, tr th { text-align:left; font-size:12px; '),
      (t +=
        'background-color:' +
        ('rgba(' +
          255 * this.headerColor.r +
          ', ' +
          255 * this.headerColor.g +
          ', ' +
          255 * this.headerColor.b +
          ', ' +
          this.opacity +
          ')') +
        '; }'),
      (t += 'table small { background: #3e546b; color: #fff; display: block;'),
      (t += 'float:left; width: calc(100% - 5px); font-size: 12px; height: 2vh;'),
      (t += 'border-bottom-left-radius: 0.2vw; border-bottom-right-radius: 0.2vw; '),
      (t += 'line-height: 2vh; left: 0px;'),
      (t += 'text-align:center;'),
      (t += 'box-shadow: inset 0px 0.1vh 0.4vh #272727;}'),
      (t += '.thumbnail-column{width:90px;}'),
      (t += '.small-description{display:block; font-size:11px; margin-top:10px;}'),
      (t += '.table-rating{display:block; opacity : 1; cursor:pointer; }'),
      (t += '.table-sortable th{cursor:pointer;}'),
      (t += '.table-sortable .th-sort-asc::after{content: "▴"}'),
      (t += '.table-sortable .th-sort-desc::after{content: "▾"}'),
      (t +=
        '.table-sortable .th-sort-asc::after,.table-sortable .th-sort-desc::after{"margin-left: 5px;"}'),
      (t +=
        '.table-sortable .th-sort-asc,.table-sortable .th-sort-desc{"background: rgba(0,0,0,0.1);"}'),
      (t += '.sortable::after{content: "▾"}');
    var e = document.createElement('style');
    (e.innerHTML = t),
      (e.id = 'table-style'),
      this.container.appendChild(e),
      (this.table = document.createElement('table')),
      this.table.classList.add('table-sortable'),
      (this.table.style.width = '100%'),
      (this.table.style.color = this.color),
      this.buttons.length > 1 && this.table.classList.add('two-buttons'),
      this.container.appendChild(this.table),
      (this.container.style.position = 'absolute'),
      (this.container.style.overflow = 'scroll'),
      (this.container.style.overflowX = 'auto'),
      (this.container.className = 'container'),
      document.body.appendChild(this.container);
    var a = document.createElement('tr'),
      i = document.createElement('thead');
    for (var r in (this.header && this.table.appendChild(i), this.labels)) {
      var n = this.labels[r],
        s = document.createElement('th');
      (s.innerHTML = n), 0 === n.length && (s.style.width = '32px'), a.appendChild(s);
    }
    i.append(a), this.updateStyle();
  }),
  (Table.prototype.createThumbnail = function (t, e) {
    var a = t.thumbnail;
    if (a) {
      var i = document.createElement('img');
      a.search('https') > -1
        ? (i.src = a)
        : 'maps' == this.cdn
        ? (i.src = Utils.prefixMapCDN + a)
        : (i.src = Utils.prefixCDN + a),
        (i.width = 90),
        e.appendChild(i),
        (e.className = 'thumbnail-column');
    }
  }),
  (Table.prototype.createRating = function (t, e) {
    var a = 'Stars-' + t.rating + '.png';
    if (this.app.assets.find(a)) {
      var i = document.createElement('img');
      (i.src = this.app.assets.find(a).getFileUrl()),
        (i.width = 80),
        (i.height = 15),
        (i.ratingId = t.name),
        (i.className = 'table-rating'),
        (i.onclick = function () {
          pc.app.fire('View:Menu', 'Rating'),
            pc.app.fire('Template:Rating', {
              map: this.ratingId,
            });
        }),
        e.appendChild(i);
    } else e.innerText = t.rating;
  }),
  (Table.prototype.createButtons = function (t, e, a) {
    var i = this;
    if (this.buttonsDisabled) return !1;
    if ((t[e] && t[e].match(/\$button\[(.*?)\]/)) || (e && e.match(/\$button\[(.*?)\]/))) {
      var r = 0,
        n = !1;
      t[e] && t[e].match(/\$button\[(.*?)\]/) && (r = t[e].match(/\$button\[(.*?)\]/)),
        e && e.match(/\$button\[(.*?)\]/) && (r = e.match(/\$button\[(.*?)\]/)),
        e && e.match(/\((.*?)\)/) && (n = e.match(/\((.*?)\)/));
      var s = parseInt(r[1]),
        o = (h = this.buttons[s].split('='))[1].split('@');
      if (
        (((c = document.createElement('button')).innerText = h[0]),
        (c.trigger = o[0]),
        (c._key = o[1]),
        (c._value = t[o[1]]),
        (c._row = t),
        (c.onclick = function () {
          var t = {};
          (t[this._key] = this._value),
            'data' == this._key
              ? pc.app.fire(this.trigger, this._row)
              : pc.app.fire(this.trigger, t),
            i.destroyButton && (i.buttonsDisabled = !0);
        }),
        a.appendChild(c),
        n)
      ) {
        var l = document.createElement('small');
        (l.innerText = t[n[1]]), a.appendChild(l);
      }
    } else
      for (var s in this.buttons) {
        var h, c;
        o = (h = this.buttons[s].split('='))[1].split('@');
        ((c = document.createElement('button')).innerText = h[0]),
          (c.trigger = o[0]),
          (c._key = o[1]),
          (c._value = t[o[1]]),
          (c.onclick = function () {
            var t = {};
            (t[this._key] = this._value),
              pc.app.fire(this.trigger, t),
              i.destroyButton && (i.buttonsDisabled = !0);
          }),
          a.appendChild(c);
      }
  }),
  (Table.prototype.formatMarkup = function (t, e) {
    if (t && t.replace) {
      var a = t
          .replace(/\[color="(.*?)"\]/g, '<span style="color:$1">')
          .replace(/\[\/color]/g, '</span>')
          .replace(/\\/g, ''),
        i = '',
        r = '';
      return (
        'username' == e &&
          ((username = t
            .replace(/\[color="(.*?)"\]/g, '')
            .replace(/\[\/color]/g, '')
            .replace(/\\/g, '')
            .replace(/\[(.*?)\]/g, '')
            .trim()),
          (i = '<a target="_blank" href="https://social.venge.io/#' + username + '">'),
          (r = '</a>')),
        i + a + r
      );
    }
    return t;
  }),
  (Table.prototype.clear = function () {
    for (var t = this.rows.length; t--; ) this.rows[t].remove();
  }),
  (Table.prototype.onSet = function (t) {
    this.clear();
    var e = this.app.assets.find('Verified-Icon.png');
    t = t.result;
    var a = document.createElement('tbody');
    for (var i in t) {
      var r = t[i],
        n = document.createElement('tr');
      for (var s in this.keys) {
        var o = this.keys[s],
          l = document.createElement('td');
        if (o.search('\\$verified') > -1) {
          var h = '',
            c = o.replace('$verified', '').trim();
          '1' == r.verified &&
            ((h = '<img src="' + e.getFileUrl() + '"'), (h += 'class="verification">')),
            (l.innerHTML = h + ' ' + this.formatMarkup(r[c], c));
        } else
          '$thumbnail' == o
            ? this.createThumbnail(r, l)
            : '$rating' == o
            ? this.createRating(r, l)
            : '$button' == o ||
              '$button' == r[o] ||
              (r[o] && r[o].length > 0 && r[o].search('\\$button') > -1) ||
              (o && o.length > 0 && o.search('\\$button') > -1)
            ? this.createButtons(r, o, l)
            : '$index' == o
            ? (l.innerText = parseInt(i) + 1)
            : (l.innerHTML = this.formatMarkup(r[o], o));
        n.appendChild(l);
      }
      a.append(n), this.table.appendChild(a), this.rows.push(n), this.app.fire('DOM:Update', this);
    }
    this.header &&
      (document.querySelector('.table-sortable th') &&
        document.querySelector('.table-sortable th').classList.add('sortable'),
      document.querySelectorAll('.table-sortable th').forEach(t => {
        t.addEventListener('click', () => {
          const e = t.parentElement.parentElement.parentElement,
            a = Array.prototype.indexOf.call(t.parentElement.children, t),
            i = t.classList.contains('th-sort-asc');
          this.tableSortByColumn(e, a, !i);
        });
      }));
  }),
  (Table.prototype.updateStyle = function () {
    try {
      this._updateStyle();
    } catch (t) {}
  }),
  (Table.prototype._updateStyle = function () {
    if (this.isDestroyed) return !1;
    if (this.entity.enabled && this.entity.element && this.entity.element.screenCorners) {
      var t = this.entity.element.screenCorners,
        e = 1 / this.app.graphicsDevice.maxPixelRatio;
      (this.container.style.left = t[0].x * e + 'px'),
        (this.container.style.bottom = t[0].y * e + 'px'),
        (this.container.style.position = 'absolute'),
        (this.container.style.display = 'block'),
        (this.container.style.zIndex = 1e3);
      var a = ((t[2].x - t[0].x) * e) / this.entity.element.width,
        i = ((t[2].y - t[0].y) * e) / this.entity.element.height;
      (this.container.style.transform = 'scale(' + a + ', ' + i + ')'),
        (this.container.style.transformOrigin = 'left bottom');
    }
  }),
  (Table.prototype.tableSortByColumn = function (t, e, a = !0) {
    const i = t.tBodies[0],
      r = Array.from(i.querySelectorAll('tr')),
      n = a ? 1 : -1,
      s = r.sort((t, a) => {
        var i, r;
        return (
          0 === e
            ? ((i = parseInt(t.querySelector(`td:nth-child(${e + 1})`).textContent.trim())),
              (r = parseInt(a.querySelector(`td:nth-child(${e + 1})`).textContent.trim())))
            : ((i = t.querySelector(`td:nth-child(${e + 1})`).textContent.trim()),
              (r = a.querySelector(`td:nth-child(${e + 1})`).textContent.trim())),
          i > r ? 1 * n : -1 * n
        );
      });
    for (; i.firstChild; ) i.removeChild(i.firstChild);
    i.append(...s),
      t.querySelectorAll('th').forEach(t => t.classList.remove('th-sort-asc', 'th-sort-desc')),
      t.querySelector(`th:nth-child(${e + 1})`).classList.toggle('th-sort-asc', a),
      t.querySelector(`th:nth-child(${e + 1})`).classList.toggle('th-sort-desc', !a);
  });
var Visibility = pc.createScript('visibility');
Visibility.attributes.add('visible', {
  type: 'boolean',
  default: !0,
}),
  Visibility.attributes.add('query', {
    type: 'string',
    default: 'success == true',
  }),
  Visibility.attributes.add('hideLater', {
    type: 'boolean',
  }),
  (Visibility.prototype.initialize = function () {
    this.app.on('Show:' + this.entity.name, this.onShow, this),
      this.app.on('Hide:' + this.entity.name, this.onHide, this),
      this.visible ||
        (this.timer = setTimeout(
          function (t) {
            t.entity.enabled = !1;
          },
          50,
          this
        )),
      this.entity.on('state', this.onStateChange, this);
  }),
  (Visibility.prototype.onShow = function () {
    this.entity.enabled = !0;
  }),
  (Visibility.prototype.onHide = function () {
    this.entity.enabled = !1;
  }),
  (Visibility.prototype.onStateChange = function (t) {}),
  (Visibility.prototype.trigger = function (t) {
    try {
      this._trigger(t);
    } catch (t) {
      this.entity.enabled = !1;
    }
  }),
  (Visibility.prototype._trigger = function (data) {
    if (this.query && data) {
      var query = eval('data.' + this.query);
      query
        ? ((this.entity.enabled = !0),
          this.hideLater &&
            (clearTimeout(this.timer),
            (this.timer = setTimeout(
              function (t) {
                t.entity.enabled = !1;
              },
              3e3,
              this
            ))))
        : (this.entity.enabled = !1);
    } else this.entity.enabled = !1;
  });
var Template = pc.createScript('template');
Template.attributes.add('autoRefresh', {
  type: 'boolean',
  default: !1,
}),
  Template.attributes.add('onInit', {
    type: 'string',
  }),
  (Template.prototype.initialize = function () {
    this.app.on('Template:' + this.entity.name, this.onUpdate, this),
      this.onInit && (this.onInitTrigger(), this.onUpdate()),
      this.clearValues();
  }),
  (Template.prototype.clearValues = function () {
    for (var e = this.entity.findByTag('Dynamic'), t = e.length; t--; ) {
      var r = e[t];
      if (r.element.type == pc.ELEMENTTYPE_TEXT) {
        var i = r.element.text;
        r.element.source ? (r.element.text = '-') : (r.element.source = i);
      }
    }
  }),
  (Template.prototype.onInitTrigger = function (e) {
    var t = this.onInit.split(', ');
    if (t.length > 0)
      for (var r in t) {
        var i = t[r],
          n = i.split('@');
        if (n.length > 1) {
          var a = n[0],
            s = n[1];
          this.app.fire(a, s);
        } else this.app.fire(i, e);
      }
  }),
  (Template.prototype.limit = function (e) {
    return e.slice(0, 16);
  }),
  (Template.prototype.numberFormat = function (e) {
    return (
      (e = parseInt(e)),
      (Math.abs(e) > 999
        ? Math.sign(e) * (Math.abs(e) / 1e3).toFixed(1) + 'k'
        : Math.sign(e) * Math.abs(e)) + ''
    );
  }),
  (Template.prototype.count = function (e) {
    var t = new Date(e).getTime() - new Date().getTime();
    Math.floor(t / 864e5);
    return (
      Math.floor((t % 864e5) / 36e5) +
      ' hours ' +
      Math.floor((t % 36e5) / 6e4) +
      ' minutes ' +
      Math.floor((t % 6e4) / 1e3) +
      ' seconds '
    );
  }),
  (Template.prototype.cleanUsername = function (e) {
    return Utils.cleanUsername(e);
  }),
  (Template.prototype.onlyUsername = function (e) {
    return Utils.onlyUsername(e);
  }),
  (Template.prototype.displayUsername = function (e, t) {
    return Utils.displayUsername(e, t);
  }),
  (Template.prototype.preprocess = function (e, t, r) {
    var i = t.split('|');
    return i.length > 1 ? this[i[1].trim()](e, r) : e;
  }),
  (Template.prototype.render = function (data, text, entity) {
    for (var regex = /\{\{(.*?)\}\}/gm, str = text, m; null !== (m = regex.exec(text)); ) {
      m.index === regex.lastIndex && regex.lastIndex++;
      var content = m[1],
        variable = m[1];
      (variable = variable.split('|')), (variable = variable[0].trim());
      try {
        var value = this.preprocess(eval('data.' + variable), content, entity);
        str = value ? str.replace(m[0], value) : str.replace(m[0], '');
      } catch (e) {}
    }
    return str;
  }),
  (Template.prototype.getAsset = function (e, t) {
    var r = e[t.toLowerCase()],
      i = this.app.assets.find(r);
    if (void 0 !== r && i) return i;
  }),
  (Template.prototype.refreshComponents = function (e) {
    var t = this.entity.findByTag('Dynamic');
    for (var r in t) {
      var i = t[r];
      if (
        (i && i.script && i.script.visibility && i.script.visibility.trigger(e),
        i && i.script && i.script.bar && i.script.bar.setValue(e),
        i && i.script && i.script.input && i.script.input.setValue(e),
        i && i.script && i.script.select && i.script.select.setValue(e),
        i && i.script && i.script.checkbox && i.script.checkbox.setValue(e),
        i && i.script && i.script.hidden && i.script.hidden.setValue(e),
        i && i.script && i.script.button && i.script.button.linkButton)
      ) {
        var n = i.script.button.key;
        i.script.button.setLink(e[n]);
      } else if (i && i.script && i.script.button) {
        var a = i.script.button.key;
        i.script.button.fireArgs = e[a];
      }
    }
  }),
  (Template.prototype.onUpdate = function (e) {
    this.refreshComponents(e);
    for (var t = this.entity.findByTag('Dynamic'), r = t.length; r--; ) {
      var i = t[r];
      if (i && i.enabled) {
        if (i.element.type == pc.ELEMENTTYPE_TEXT) {
          var n = i.element.text;
          i.element.source ? (i.element.text = i.element.source + '') : (i.element.source = n),
            (i.element.text = this.render(e, i.element.text, i.element));
        }
        if (i.element.type == pc.ELEMENTTYPE_IMAGE) {
          var a = i.element.textureAsset,
            s = this.getAsset(e, i.name);
          if (((i.element.sourceImage = a), i.element.sourceImage)) {
            var p = i.element.sourceImage;
            i.element.textureAsset = p;
          } else i.element.sourceImage = a;
          s && (i.element.textureAsset = s);
        }
      }
    }
    this.autoRefresh &&
      (clearTimeout(this.timer),
      (this.timer = setTimeout(
        function (t) {
          t.onUpdate(e);
        },
        1e3,
        this
      )));
  });
var View = pc.createScript('view');
View.attributes.add('items', {
  type: 'entity',
  array: !0,
}),
  View.attributes.add('defaultView', {
    type: 'string',
  }),
  (View.prototype.initialize = function () {
    this.app.on('View:' + this.entity.name, this.onViewChange, this),
      this.app.on('View:' + this.entity.name + '@Close', this.onViewClose, this),
      this.defaultView && this.app.fire('View:' + this.entity.name, this.defaultView);
  }),
  (View.prototype.onViewClose = function (i) {
    for (var e in this.items) {
      this.items[e].enabled = !1;
    }
  }),
  (View.prototype.onViewChange = function (i) {
    for (var e in this.items) {
      var t = this.items[e];
      i == t.name ? (t.enabled = !0) : (t.enabled = !1);
    }
  });
var Check = pc.createScript('check');
Check.attributes.add('query', {
  type: 'string',
}),
  Check.attributes.add('success', {
    type: 'string',
  }),
  Check.attributes.add('fail', {
    type: 'string',
  }),
  (Check.prototype.initialize = function () {
    this.app.on('Check:' + this.entity.name, this.onCheck, this);
  }),
  (Check.prototype.onCheck = function (data) {
    var query = eval('data.' + this.query);
    query ? this.onSuccess(data) : this.onError(data);
  }),
  (Check.prototype.onSuccess = function (t) {
    var e = this.success.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var r = e[i],
          a = r.split('@');
        if (a.length > 1) {
          var s = a[0],
            h = a[1];
          this.app.fire(s, h);
        } else this.app.fire(r, t);
      }
  }),
  (Check.prototype.onError = function (t) {
    var e = this.fail.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var r = e[i],
          a = r.split('@');
        if (a.length > 1) {
          var s = a[0],
            h = a[1];
          this.app.fire(s, h);
        } else this.app.fire(r, t);
      }
  });
var Bar = pc.createScript('bar');
Bar.attributes.add('key', {
  type: 'string',
}),
  Bar.attributes.add('start', {
    type: 'string',
  }),
  Bar.attributes.add('particleType', {
    type: 'string',
    enum: [
      {
        onEnd: 'onEnd',
      },
      {
        onDuring: 'onDuring',
      },
    ],
    default: 'onEnd',
  }),
  Bar.attributes.add('isAnimated', {
    type: 'boolean',
    default: !0,
    description: 'Do you want to animate the bar fill?',
  }),
  Bar.attributes.add('animationDuration', {
    type: 'number',
    default: 1,
    description: 'Duration of the animation. Default is 1.',
  }),
  (Bar.prototype.initialize = function () {}),
  (Bar.prototype.setValue = function (t) {
    var i = t[this.key];
    this.isParticle, this.particleType;
    t[this.start] && this.entity.setLocalScale(t[this.start], 1, 1),
      i > 0
        ? this.isAnimated
          ? this.entity
              .tween(this.entity.getLocalScale())
              .to(
                {
                  x: i,
                },
                this.animationDuration,
                pc.SineOut
              )
              .start()
              .on('complete', function () {})
          : this.entity.setLocalScale(i, 1, 1)
        : this.entity.setLocalScale(0.001, 1, 1);
  });
var Popup = pc.createScript('popup');
Popup.attributes.add('title', {
  type: 'string',
  default: 'Popup Title',
}),
  Popup.attributes.add('description', {
    type: 'string',
    default: 'Select one of them!',
  }),
  Popup.attributes.add('onSelect', {
    type: 'string',
  }),
  Popup.attributes.add('headerColor', {
    type: 'rgb',
  }),
  Popup.attributes.add('headerTextColor', {
    type: 'rgb',
  }),
  Popup.attributes.add('itemNames', {
    type: 'string',
    array: !0,
  }),
  Popup.attributes.add('itemImages', {
    type: 'asset',
    array: !0,
    assetType: 'texture',
  }),
  Popup.attributes.add('column', {
    type: 'number',
    default: 3,
  }),
  (Popup.prototype.initialize = function () {
    (this.popupStyle = !1),
      this.on(
        'state',
        function (t) {
          this.entity.enabled ||
            (this.wrapper && this.wrapper.remove(),
            this.popupStyle && this.popupStyle.remove(),
            (pc.isButtonLocked = !1));
        },
        this
      ),
      this.on('destroy', this._onDestroy, this),
      this.app.on('Popup:' + this.entity.name, this.onSet, this),
      this.app.on('PopupSet:' + this.entity.name, this.setItems, this),
      this.app.on('Popup:Close', this.onClose, this);
  }),
  (Popup.prototype.setItems = function (t) {
    if (t.result) {
      for (var e in ((this.itemNames = []), (this.itemImages = []), t.result)) {
        var i = t.result[e];
        this.itemNames.push(i.name), this.itemImages.push(this.app.assets.find(i.thumbnail));
      }
      t.onSelect && (this.onSelect = t.onSelect), this.onSet();
    }
  }),
  (Popup.prototype.onClose = function (t) {
    this.entity.enabled && (this.entity.enabled = !1), this.wrapper && this.wrapper.remove();
  }),
  (Popup.prototype.onSet = function (t) {
    var e = document.getElementById('popup_item_' + t);
    if ((clearTimeout(this.selectionTimeout), e)) {
      var i = document.querySelectorAll('.item');
      for (var o in i) {
        i[o].className = 'item deactivated';
      }
      (e.className = 'item active'),
        (this.selectionTimeout = setTimeout(
          function (e) {
            e._onSet(t);
          },
          200,
          this
        ));
    } else this._onSet(t);
  }),
  (Popup.prototype._onSet = function (t) {
    if (t) {
      if (this.onSelect) {
        var e = this.onSelect.split(', ');
        if (e.length > 0)
          for (var i in e) {
            var o = e[i].split('@');
            if (o.length > 1) {
              var s = o[0],
                n = o[1];
              this.app.fire(s, n);
            } else this.app.fire(o[0], t);
          }
      }
      setTimeout(
        function (t) {
          t.entity.enabled && (t.entity.enabled = !1), t.wrapper && t.wrapper.remove();
        },
        100,
        this
      );
    } else this._onInit();
  }),
  (Popup.prototype._onDestroy = function () {
    (pc.isButtonLocked = !1), this.popupStyle && this.popupStyle.remove();
  }),
  (Popup.prototype.getItems = function () {
    var t = [];
    for (var e in this.itemNames) {
      var i = this.itemNames[e],
        o = i.split(':'),
        s = o[0],
        n = 'Locked' == o[1],
        r = '';
      if (this.itemImages[e]) {
        var p = this.itemImages[e].getFileUrl();
        i &&
          ((r = '<div id="popup_item_' + s + '" class="item" '),
          (r += 'onclick="pc.app.fire(\'Popup:' + this.entity.name + "', '" + s + '\')">'),
          n && (r += '<div class="locked"></div>'),
          (r += '<img src="' + p + '">'),
          (r += '<span class="label">' + s + '</span>'),
          (r += '</div>'));
      } else {
        var a = i.match(/(.*?)\((.*?)\)/),
          l = i,
          h = '';
        a && a.length > 0 && ((l = a[1].trim()), (h = a[2])),
          (r = '<div class="list-item" '),
          (r += 'onclick="pc.app.fire(\'Popup:' + this.entity.name + "', '" + l + '\')">'),
          (r += '<span class="label">' + l + '<small>' + h + '</small></span>'),
          (r += '</div>');
      }
      t.push(r);
    }
    return t.join('');
  }),
  (Popup.prototype._onInit = function () {
    this.entity.enabled = !0;
    var t = document.getElementById('shadow');
    if (
      (t && t.remove(),
      (pc.isButtonLocked = !0),
      (this.wrapper = document.createElement('div')),
      (this.wrapper.id = 'shadow'),
      (this.container = document.createElement('div')),
      (this.container.id = 'popup'),
      (this.container.style.width = this.entity.element.width + 'px'),
      (this.container.style.height = this.entity.element.height + 'px'),
      this.wrapper.appendChild(this.container),
      document.body.appendChild(this.wrapper),
      !document.getElementById('popup-style'))
    ) {
      var e =
          'rgb(' +
          255 * this.headerColor.r +
          ', ' +
          255 * this.headerColor.g +
          ', ' +
          255 * this.headerColor.b +
          ')',
        i =
          'rgb(' +
          255 * this.headerTextColor.r +
          ', ' +
          255 * this.headerTextColor.g +
          ', ' +
          255 * this.headerTextColor.b +
          ')',
        o = 0.8;
      Utils.isMobile() && (o = 3);
      var s = '';
      (s += '#shadow {'),
        (s += '        background-color:rgba(0, 0, 0, 0.5);'),
        (s += '        width : 100%; '),
        (s += '        height : 100%; '),
        (s += '        left:0px; '),
        (s += '        right:0px; '),
        (s += '        position:fixed; '),
        (s += '        z-index:10000; '),
        (s += '}'),
        (s += '#popup { background-color:#ffffff; overflow:hidden; }'),
        (s += '#header {'),
        (s += '        background-color:' + e + ';'),
        (s += '        color : ' + i + '; '),
        (s += '        box-shadow: 0px 0.2vw 0.5vw #ccc; '),
        (s += '        text-align: center; '),
        (s += '        padding:0.8vw 0px;'),
        (s += '        font-size:1vw;'),
        (s += '}'),
        (s += '#footer {'),
        (s += '        background-color:rgba(0, 0, 0, 0.6);'),
        (s += '        color : #fff; '),
        (s += '        text-align: center; '),
        (s += '        padding:0.5vw 0px; '),
        (s += '        font-size:0.8vw; '),
        (s += '        position:absolute; '),
        (s += '        bottom:0px; '),
        (s += '        left:0px; '),
        (s += '        box-sizing:border-box; '),
        (s += '}'),
        (s += '#content {'),
        (s += '        display: flow-root;'),
        (s += '        flex-wrap: wrap;'),
        (s += '        padding: 0.5vw;'),
        (s += '        box-sizing: border-box;'),
        (s += '        height: calc(100% - 2.5vw);'),
        (s += '}'),
        (s += '.list-item {'),
        (s += '        width: 100%;'),
        (s += '        border-bottom: solid 1px #ddd;'),
        (s += '        padding: 1.5vh;'),
        (s += '        position:relative;'),
        (s += '        transition:all 0.1s;'),
        (s += '        cursor:pointer;'),
        (s += '        overflow:hidden;'),
        (s += '        box-sizing: border-box;'),
        (s += '}'),
        (s += '.list-item:last-child {'),
        (s += '        border-bottom: none;'),
        (s += '}'),
        (s += '.list-item:hover {'),
        (s += '        background:' + e + ';'),
        (s += '        transform:scale(1.05, 1.05);'),
        (s += '        color:#fff;'),
        (s += '}'),
        (s += '.list-item small {'),
        (s += '        font-size:0.7vw;'),
        (s += '        margin-left:1vw;'),
        (s += '}'),
        (s += '.item {'),
        (s += '        width: calc(' + 100 / this.column + '% - 0.8vw);'),
        (s += '        border: solid 1px #ddd;'),
        (s += '        margin: 0.4vw;'),
        (s += '        box-shadow: 0px 0px 0.5vw #ddd;'),
        (s += '        position:relative;'),
        (s += '        transition:all 0.1s;'),
        (s += '        cursor:pointer;'),
        (s += '        border-radius:0.4vw;'),
        (s += '        overflow:hidden;'),
        (s += '        box-sizing: border-box;'),
        (s += '        float: left;'),
        (s += '}'),
        (s += '.item:hover {'),
        (s += '        background:' + e + ';'),
        (s += '        transform:scale(1.05, 1.05);'),
        (s += '}'),
        (s += '.item.deactivated {'),
        (s += '        opacity: 0.5;'),
        (s += '}'),
        (s += '.item.active {'),
        (s += '        box-shadow: 0px 0px 3vw yellow;'),
        (s += '        transform:scale(1.15, 1.15);'),
        (s += '}'),
        (s += '.item img{'),
        (s += '        width: 100%;'),
        (s += '        margin-left: auto;'),
        (s += '        margin-right: auto;'),
        (s += '        display:block;'),
        (s += '}'),
        (s += '.item .label{'),
        (s += '        width: 100%;'),
        (s += '        background:rgba(0, 0, 0, 0.75);'),
        (s += '        padding: 0.5vw;'),
        (s += '        font-size: ' + o + 'vw;'),
        (s += '        color: #fff;'),
        (s += '        text-align: center;'),
        (s += '        position: absolute;'),
        (s += '        left: 0px;'),
        (s += '        bottom: 0px;'),
        (s += '        box-sizing: border-box;'),
        (s += '}'),
        (s += '#close-button{'),
        (s += '        width: 2.6vw;'),
        (s += '        height: 2.6vw;'),
        (s += '        line-height: 2.6vw;'),
        (s += '        background:rgb(234, 0, 0);'),
        (s += '        font-size: 1.5vw;'),
        (s += '        cursor: pointer;'),
        (s += '        color: #fff;'),
        (s += '        float: right;'),
        (s += '        box-sizing: border-box;'),
        (s += '        position: absolute;'),
        (s += '        top: 0px;'),
        (s += '        right: 0px;'),
        (s += '        text-align: center;'),
        (s += '}');
      var n = document.createElement('style');
      (n.innerHTML = s),
        (n.id = 'popup-style'),
        (this.popupStyle = n),
        document.body.appendChild(n);
    }
    (this.header = document.createElement('div')),
      (this.header.id = 'header'),
      (this.header.style.width = '100%'),
      (this.header.style.height = '1vw'),
      (this.header.innerText = this.title),
      (this.closeButton = document.createElement('div')),
      (this.closeButton.id = 'close-button'),
      (this.closeButton.innerText = 'x'),
      (this.closeButton.onclick = function () {
        pc.app.fire('Popup:Close', !0);
      }),
      this.header.appendChild(this.closeButton),
      this.container.appendChild(this.header),
      (this.content = document.createElement('div')),
      (this.content.id = 'content'),
      (this.content.style.width = '100%'),
      (this.content.innerHTML = this.getItems()),
      this.container.appendChild(this.content),
      (this.footer = document.createElement('div')),
      (this.footer.id = 'footer'),
      (this.footer.style.width = '100%'),
      (this.footer.innerHTML = this.description),
      this.container.appendChild(this.footer),
      (this.container.style.position = 'absolute'),
      (this.container.style.overflow = 'hidden'),
      this.updateStyle();
  }),
  (Popup.prototype.updateStyle = function () {
    if (this.entity.element.screenCorners && this.entity.enabled && this.wrapper) {
      var t = this.entity.element.screenCorners,
        e = 1 / this.app.graphicsDevice.maxPixelRatio;
      (this.container.style.left = t[0].x * e + 'px'),
        (this.container.style.bottom = t[0].y * e + 'px'),
        (this.container.style.position = 'absolute'),
        (this.container.style.display = 'block'),
        (this.container.style.zIndex = 1e3);
      var i = ((t[2].x - t[0].x) * e) / this.entity.element.width,
        o = ((t[2].y - t[0].y) * e) / this.entity.element.height;
      (this.container.style.transform = 'scale(' + i + ', ' + o + ')'),
        (this.container.style.transformOrigin = 'left bottom');
    }
  });
var Alert = pc.createScript('alert');
Alert.attributes.add('alertEntity', {
  type: 'entity',
}),
  Alert.attributes.add('alertMessage', {
    type: 'entity',
  }),
  (Alert.prototype.initialize = function () {
    this.app.on('Confirm:' + this.entity.name, this.onAlert, this),
      this.app.on('Alert:' + this.entity.name, this.onAlert, this),
      this.app.on('Alert:Close', this.onAlertClose, this),
      this.entity.on('destroy', this.onDestroy, this);
  }),
  (Alert.prototype.onDestroy = function () {
    this.app.off('Alert:' + this.entity.name), this.app.off('Alert:Close');
  }),
  (Alert.prototype.onAlert = function (t) {
    this.app.fire('DOM:Hide', !0),
      setTimeout(
        function (e) {
          e._onAlert(t);
        },
        100,
        this
      );
  }),
  (Alert.prototype._onAlert = function (t) {
    var e = t;
    'object' == typeof t && (e = t.message),
      (this.alertEntity.enabled = !0),
      (this.alertMessage.element.text = e),
      this.entity.sound.play('Error');
  }),
  (Alert.prototype.onAlertClose = function (t) {
    (this.alertEntity.enabled = !1), this.app.fire('DOM:Show', !0);
  });
var SpellWind = pc.createScript('spellWind');
SpellWind.attributes.add('material', {
  type: 'asset',
  assetType: 'material',
}),
  SpellWind.attributes.add('scaleSpeed', {
    type: 'number',
    default: 5,
  }),
  SpellWind.attributes.add('opacityDelay', {
    type: 'number',
    default: 0.1,
  }),
  SpellWind.attributes.add('time', {
    type: 'number',
    default: 1.5,
  }),
  (SpellWind.prototype.initialize = function () {
    (this.timestamp = 10),
      (this.animation = {
        scale: 0,
      }),
      this.app.on('Spell:Wind', this.onSet, this);
  }),
  (SpellWind.prototype.onSet = function (t, e) {
    var i = 10;
    'Small' == e && (e, (i = 3)),
      (this.animation.scale = 0.1),
      (this.timestamp = 0),
      (this.material.resource.opacity = 1),
      this.entity.setLocalPosition(t),
      this.app
        .tween(this.material.resource)
        .to(
          {
            opacity: 0,
          },
          0.5,
          pc.Linear
        )
        .delay(this.opacityDelay)
        .start(),
      this.app
        .tween(this.animation)
        .to(
          {
            scale: i,
          },
          0.5,
          pc.BackOut
        )
        .start(),
      (this.entity.enabled = !0),
      this.entity.sound.play('Cast');
  }),
  (SpellWind.prototype.update = function (t) {
    this.entity.rotateLocal(0, -1500 * t, 0),
      (this.timestamp += t),
      this.entity.setLocalScale(this.animation.scale, this.animation.scale, this.animation.scale),
      this.material.resource.update(),
      this.timestamp > this.time && (this.entity.enabled = !1);
  });
var RoomManager = pc.createScript('roomManager');
RoomManager.attributes.add('isDebug', {
  type: 'boolean',
  default: !0,
}),
  RoomManager.attributes.add('isMobile', {
    type: 'boolean',
    default: !1,
  }),
  RoomManager.attributes.add('URL', {
    type: 'string',
  }),
  RoomManager.attributes.add('testURL', {
    type: 'string',
  }),
  RoomManager.attributes.add('serverCode', {
    type: 'string',
    default: '1.0.0',
  }),
  (RoomManager.prototype.initialize = function () {
    if (
      ('undefined' != typeof VERSION && (this.isDebug = !1),
      (this.customRoomId = !1),
      (this.currentUsernames = []),
      (this.currentMap = 'Sierra - POINT'),
      (this.currentMaps = [
        'Sierra - POINT',
        'Mistle - PAYLOAD',
        'Tundra - GUNGAME',
        'Temple - BLACKCOIN',
      ]),
      (this.currentServer = 'EU'),
      (this.lastTickTime = Date.now()),
      (this.lastSelfTime = Date.now()),
      this.setRoomSettings(),
      (this.friends = []),
      (this.isSpectator = !1),
      (this.isStarted = !1),
      (this.waitingForInfo = !1),
      (this.time = 0),
      (this.totalTime = 0),
      (this.ws = !1),
      (this.username = 'none'),
      (this.pack = MessagePack.initialize(4194304)),
      (this.maxPlayers = 4),
      (this.isMatchmaking = !1),
      (this.isMatchmakingStarted = !1),
      this.app.on('RoomManager:ConnectInvite', this.onInviteSet, this),
      this.app.on('RoomManager:Preroll', this.onPreroll, this),
      this.app.on('RoomManager:Copy', this.onCopy, this),
      this.app.on('RoomManager:Match', this.onMatchSet, this),
      this.app.on('RoomManager:Matchmaking', this.matchmaking, this),
      this.app.on('RoomManager:Hash', this.onHashSet, this),
      this.app.on('RoomManager:InviteSet', this.onInviteSet, this),
      this.app.on('RoomManager:Leave', this.onLeave, this),
      this.app.on('RoomManager:Private', this.onPrivateChange, this),
      this.app.on('RoomManager:Start', this.onStart, this),
      this.app.on('RoomManager:Map', this.onMapSelection, this),
      this.app.on('RoomManager:Maps', this.onMapsSelection, this),
      this.app.on('RoomManager:SetServer', this.onServerSelection, this),
      this.app.on('RoomManager:Rematchmaking', this.rematchmaking, this),
      this.app.on('RoomManager:PlayMode', this.onPlayMode, this),
      this.app.on('RoomManager:InviteMode', this.onInviteMode, this),
      this.app.on('RoomManager:CustomMapInvite', this.onCustomMapInvite, this),
      this.app.on('RoomManager:SetMapTemplate', this.setMapTemplate, this),
      this.app.on('RoomManager:PlayCustomGame', this.playCustomGame, this),
      this.app.on('Game:Found', this.onGameFound, this),
      this.app.on('Template:Profile', this.setProfile, this),
      this.app.on('Server:Tick', this.onServerTick, this),
      this.app.on('RoomManager:CreateInvite', this.onCreateInvite, this),
      this.app.on(atob('TmV0d29yazpHdWFyZA=='), this.onSelfTime, this),
      window.location.href.search('map') > -1)
    ) {
      var t = window.location.href.split('=')[1];
      setTimeout(
        function (e) {
          e.setCustomMap(t);
        },
        100,
        this
      );
    }
    if (
      window.location.pathname.length > 1 &&
      '//' != window.location.pathname &&
      'venge.io' == window.location.host
    ) {
      var e = window.location.origin,
        i = window.location.pathname.split(/[\/,]+/),
        a = '#' + i[i.length - 1];
      window.location.href = e + a;
    }
    setTimeout(
      function (t) {
        t.app.fire('DOM:Update', !0);
      },
      300,
      this
    ),
      this.app.fire('RoomManager:Ready', !0);
  }),
  (RoomManager.prototype.onInviteSet = function (t) {
    if (t.success) {
      var e = t.result.hash;
      (this.customRoomId = e), this.reconnect();
    }
  }),
  (RoomManager.prototype.setMapTemplate = function (t) {
    t && (pc.displayMap = t.name);
  }),
  (RoomManager.prototype.playCustomGame = function () {
    (this.currentMaps = [pc.displayMap + ' - POINT']),
      (this.currentMap = pc.displayMap + ' - POINT'),
      (this.currentMode = 'POINT'),
      this.app.fire('Page:Menu', 'Match'),
      this.app.fire('Show:Character', 'Show'),
      this.setRoomSettings(),
      this.startMatchmaking();
  }),
  (RoomManager.prototype.setCustomMap = function (t) {
    (this.currentMap = t + ' - POINT'),
      (this.currentMaps = [this.currentMap]),
      this.app.fire('View:Match', 'Invite'),
      this.app.fire('RoomManager:CreateInvite', !0),
      this.app.fire('DOM:DelayUpdate', !0),
      console.log('[DEBUG] Create map for custom map', t);
  }),
  (RoomManager.prototype.onPlayMode = function (t) {
    (this.currentMaps = [t.name + ' - CUSTOM']),
      (this.currentMap = t.name + ' - CUSTOM'),
      (this.currentMode = 'CUSTOM'),
      this.app.fire('Page:Menu', 'Match'),
      this.app.fire('Show:Character', 'Show'),
      this.onPreroll();
  }),
  (RoomManager.prototype.onInviteMode = function (t) {
    (this.currentMaps = [pc.displayMap + ' - POINT']),
      (this.currentMap = pc.displayMap + ' - POINT'),
      (this.currentMode = 'POINT'),
      this.app.fire('Page:Menu', 'Match'),
      this.app.fire('Show:Character', 'Show'),
      this.app.fire('View:Match', 'Invite'),
      this.app.fire('RoomManager:CreateInvite', !0);
  }),
  (RoomManager.prototype.onCustomMapInvite = function (t) {
    (this.currentMaps = [t.name + ' - POINT']),
      (this.currentMap = t.name + ' - POINT'),
      (this.currentMode = 'POINT'),
      this.app.fire('Page:Menu', 'Match'),
      this.app.fire('Show:Character', 'Show'),
      this.app.fire('View:Match', 'Invite'),
      this.app.fire('RoomManager:CreateInvite', !0);
  }),
  (RoomManager.prototype.setProfile = function (t) {
    this.setSession();
  }),
  (RoomManager.prototype.onServerSelection = function (t) {
    Utils.getItem('Server')
      ? (this.currentServer = JSON.parse(Utils.getItem('Server')))
      : (this.currentServer = t),
      this.setRoomSettings();
  }),
  (RoomManager.prototype.onMapSelection = function (t) {
    (this.currentMap = t), this.setRoomSettings();
  }),
  (RoomManager.prototype.setRoomSettings = function () {
    this.app.fire('Template:QuickMatch', {
      currentMap: this.currentMap,
      currentServer: this.currentServer,
    }),
      (pc.currentMap = this.currentMap);
  }),
  (RoomManager.prototype.onCreateInvite = function (t) {
    this.app.fire('Analytics:Event', 'Invite', 'Create'),
      this.app.fire(
        'Fetcher:Invite',
        {
          map: this.currentMap,
          version: this.serverCode,
          max_player: this.maxPlayers,
          country: this.currentServer,
        },
        t
      ),
      this.app.fire('CustomText:CurrentMap', this.currentMap);
  }),
  (RoomManager.prototype.onPreroll = function () {
    var t = this;
    this.app.fire('Analytics:Event', 'Checkpoint', 'RoomManager:Preroll'),
      this.app.fire('Menu:Mute', !0);
    try {
      var e = document.querySelector('.qc-cmp2-container');
      e && e.remove();
    } catch (t) {}
    pc.session && pc.session.hash
      ? this.app.fire('Analytics:Event', 'GameStart', 'Account')
      : this.app.fire('Analytics:Event', 'GameStart', 'Guest');
    try {
      SDKLoaded && PokiSDK && PokiSDK.SDK.sdkBooted
        ? this.app.fire('Ads:Preroll', function () {
            t.startMatchmaking();
          })
        : this.startMatchmaking();
    } catch (t) {
      this.startMatchmaking();
    }
  }),
  (RoomManager.prototype.onServerTick = function () {
    this.lastTickTime, this.lastSelfTime, (this.lastTickTime = Date.now());
  }),
  (RoomManager.prototype.onSelfTime = function () {
    this.lastSelfTime = Date.now();
  }),
  (RoomManager.prototype.onMapsSelection = function (t) {
    t &&
      ((t = t.filter(function (t) {
        return t;
      })),
      (this.currentMaps = t));
  }),
  (RoomManager.prototype.startMatchmaking = function () {
    (this.isMatchmakingStarted = !0),
      this.app.fire('Analytics:Event', 'Checkpoint', 'RoomManager:StartMatchmaking'),
      this.app.fire('RoomManager:Matchmaking', !0),
      this.app.fire('Fetcher:Match', {
        country: this.currentServer,
        version: this.serverCode,
        maps: this.currentMaps,
        max_player: this.maxPlayers,
        is_mobile: pc.isMobile ? 1 : 0,
      }),
      (pc.currentServer = this.currentServer),
      (pc.serverCode = this.serverCode),
      (pc.currentMap = this.currentMap),
      (pc.currentMaps = this.currentMaps),
      (pc.maxPlayers = this.maxPlayers),
      this.app.fire('Analytics:Event', 'Matchmaking', 'Start');
  }),
  (RoomManager.prototype.onCopy = function () {
    this.app.fire('Notify:Notify', 'Link copied!'),
      this.app.fire('Analytics:Event', 'Invite', 'LinkCopy');
  }),
  (RoomManager.prototype.onMatchSet = function (t) {
    (this.isMatchmaking = !0), this.onHashSet(t);
  }),
  (RoomManager.prototype.onHashSet = function (t) {
    if (t) {
      var e = t.result.split('#');
      window.location.hash = '#' + e[1];
    }
  }),
  (RoomManager.prototype.onLeave = function (t) {
    this.ws && (this.ws.close(), (this.ws = !1)),
      (window.location.hash = ''),
      (this.isMatchmaking = !1),
      (this.waitingForInfo = !1),
      (this.isMatchmakingStarted = !1),
      this.app.fire('View:Match', 'QuickMatch'),
      t
        ? this.app.fire('Analytics:Event', 'Room', 'Rematchmaking')
        : (this.app.fire('Alert:Menu', {
            message: 'Session is canceled.',
          }),
          this.app.fire('Analytics:Event', 'Invite', 'Cancel'));
  }),
  (RoomManager.prototype.getRoomId = function (t) {
    if (this.customRoomId) return this.customRoomId;
    var e = window.location.hash.split('#');
    if (((this.isSpectator = !1), e.length > 1)) {
      var i = e[1].split(':');
      return i.length > 1 && 'Spectate' == i[0] ? ((this.isSpectator = !0), i[1]) : e[1];
    }
    return !1;
  }),
  (RoomManager.prototype.setSession = function () {
    pc.session && pc.session.hash
      ? ((this.hash = pc.session.hash),
        pc.session.username && (this.username = Utils.cleanUsername(pc.session.username)))
      : (this.hash = !1);
  }),
  (RoomManager.prototype.reconnect = function () {
    this.setSession(), this.isDebug ? this.connect(this.testURL) : this.connect(this.URL);
  }),
  (RoomManager.prototype.getKeys = function () {
    return {
      auth: 'auth',
      room: 'room',
      leave: 'leave',
      private: 'private',
      matchmaking: 'matchmaking',
      rematchmaking: 'rematchmaking',
      start: 'start',
    };
  }),
  (RoomManager.prototype.connect = function (t) {
    this.ws && (this.ws.close(), (this.ws = !1)),
      (this.keys = this.getKeys()),
      (this.roomId = this.getRoomId()),
      this.app.fire('Analytics:Event', 'Checkpoint', 'Connect'),
      this.roomId &&
        ((this.ws = new WebSocket(t + '/?' + this.roomId)),
        (this.ws.binaryType = 'arraybuffer'),
        (this.ws.onopen = this.onOpen.bind(this)),
        (this.ws.onclose = this.onClose.bind(this)),
        (this.ws.onmessage = this.onMessage.bind(this)));
  }),
  (RoomManager.prototype.rematchmaking = function () {
    (this.time = 0),
      console.log('Rematchmaking...'),
      this.app.fire('RoomManager:Leave', !0),
      this.app.fire('Analytics:Event', 'Room', 'Rematchmaking'),
      setTimeout(
        function (t) {
          t.startMatchmaking();
        },
        100,
        this
      );
  }),
  (RoomManager.prototype.log = function (t) {
    this.isDebug && console.log(t);
  }),
  (RoomManager.prototype.onOpen = function (t) {
    this.log('Network connection is open!');
  }),
  (RoomManager.prototype.onClose = function (t) {
    this.log('Network connection is close!');
  }),
  (RoomManager.prototype.onMessage = function (t) {
    var e = new Uint8Array(t.data);
    e = MessagePack.Buffer.from(e);
    var i = this.pack.decode(e);
    i && this.parse(i);
  }),
  (RoomManager.prototype.send = function (t) {
    this.ws && this.ws.readyState == this.ws.OPEN && this.ws.send(this.pack.encode(t));
  }),
  (RoomManager.prototype.parse = function (t) {
    if (0 === t.length) return !1;
    var e = t[0];
    Object.keys(this.keys).indexOf(e) > -1 && this[this.keys[e]](t.splice(1, t.length + 1));
  }),
  (RoomManager.prototype.auth = function (t) {
    !0 === t[0] &&
      this.send([this.keys.auth, this.roomId, this.username, this.maxPlayers, this.isMatchmaking]);
  }),
  (RoomManager.prototype.room = function (t) {
    if (this.isStarted) return !1;
    if (t.length > 0) {
      var e = t[0],
        i = t[1],
        a = t[2],
        o = t[3];
      Math.min(e.length, this.maxPlayers);
      i ||
        (this.app.fire('View:Match', 'Room'),
        this.app.fire('Analytics:Event', 'Invite', 'Join'),
        o && this.start()),
        'undefined' != typeof app && app.setInviteStatus(i),
        e.length > 0 &&
          ('undefined' != typeof app && (app.invite.players = e), (this.currentUsernames = e)),
        (pc.isOwner = i),
        this.private([a]);
    }
  }),
  (RoomManager.prototype.private = function (t) {
    if (t.length > 0) {
      var e = t[0];
      'undefined' != typeof app && (app.invite.isPrivate = e);
    }
  }),
  (RoomManager.prototype.leave = function (t) {
    this.onLeave();
  }),
  (RoomManager.prototype.onPrivateChange = function () {
    this.send([this.keys.private]);
  }),
  (RoomManager.prototype.clearFriendList = function () {
    for (var t = this.friends.length; t--; ) this.friends[t].destroy();
    this.friends = [];
  }),
  (RoomManager.prototype.setFriendList = function (t) {}),
  (RoomManager.prototype.onStart = function () {
    this.send([this.keys.start]);
  }),
  (RoomManager.prototype.matchmaking = function () {
    (this.time = 0), (this.isMatchmakingStarted = !0);
  }),
  (RoomManager.prototype.onGameFound = function () {
    if (this.isStarted) return !1;
    (window.onhashchange = !1),
      clearInterval(this.timer),
      (this.isStarted = !0),
      (this.isMatchmakingStarted = !1),
      this.app.fire('Analytics:Event', 'Checkpoint', 'RoomManager:GameFound');
  }),
  (RoomManager.prototype.start = function (t) {
    if (this.waitingForInfo) return !1;
    'undefined' != typeof app && app.loadGameSceneAndStartSession(), (this.waitingForInfo = !0);
  });
var Container = pc.createScript('container');
Container.attributes.add('id', {
  type: 'string',
}),
  Container.attributes.add('onInit', {
    type: 'string',
  }),
  Container.attributes.add('onInitTrigger', {
    type: 'string',
  }),
  Container.attributes.add('innerHTML', {
    type: 'string',
  }),
  Container.attributes.add('onDestroy', {
    type: 'string',
  }),
  Container.attributes.add('autoResize', {
    type: 'boolean',
    default: !0,
  }),
  Container.attributes.add('fullyRemove', {
    type: 'boolean',
  }),
  Container.attributes.add('overflow', {
    type: 'boolean',
    default: !1,
  }),
  Container.attributes.add('showOnly', {
    type: 'string',
    enum: [
      {
        Both: 'Both',
      },
      {
        Desktop: 'Desktop',
      },
      {
        Mobile: 'Mobile',
      },
    ],
    default: 'Both',
  }),
  (Container.prototype.initialize = function () {
    if (Utils.isMobile()) {
      if ('Desktop' == this.showOnly) return this.delayDestroy(), !1;
    } else if ('Mobile' == this.showOnly) return this.delayDestroy(), !1;
    (this.isDestroyed = !1),
      (this.lastUpdate = Date.now()),
      this.triggerOnInit(),
      this.on(
        'state',
        function (t) {
          this.entity.enabled
            ? (this.triggerOnInit(), (this.element.style.display = 'block'))
            : this.fullyRemove
            ? this.element.remove()
            : (this.element.style.display = 'none');
        },
        this
      ),
      this.entity.on('DOM:Style', this.setStyle, this),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.on('destroy', this._onDestroy, this);
  }),
  (Container.prototype.setStyle = function (t) {
    if (this.element) {
      var e = Object.keys(t),
        i = Object.values(t);
      for (var n in e) {
        var s = e[n],
          o = i[n];
        this.element.style[s] = o;
      }
    }
  }),
  (Container.prototype.delayDestroy = function () {
    setTimeout(
      function (t) {
        t.entity.destroy();
      },
      100,
      this
    );
  }),
  (Container.prototype.onDOMClear = function () {
    this.entity.enabled = !1;
  }),
  (Container.prototype._onDestroy = function () {
    if (((this.isDestroyed = !0), 'undefined' !== this.onDestroy)) {
      try {
        eval(this.onDestroy);
      } catch (t) {}
      try {
        this.fullyRemove && this.element.remove();
      } catch (t) {}
    }
  }),
  (Container.prototype.onDomUpdate = function () {
    this.updateStyle();
  }),
  (Container.prototype.triggerOnInit = function () {
    var t = document.getElementById(this.id);
    t
      ? ((this.element = t),
        (this.element.style.width = this.entity.element.width + 'px'),
        (this.element.style.height = this.entity.element.height + 'px'),
        (this.element.className = 'container'))
      : ((this.element = document.createElement('div')),
        (this.element.style.width = this.entity.element.width + 'px'),
        (this.element.style.height = this.entity.element.height + 'px'),
        (this.element.id = this.id),
        (this.element.className = 'container'),
        this.innerHTML && (this.element.innerHTML = this.innerHTML),
        (this.element.style.position = 'absolute'),
        document.body.appendChild(this.element)),
      this.overflow &&
        ((this.element.style.overflow = 'hidden'),
        (this.insideElement = document.createElement('div')),
        (this.insideElement.style.width = this.entity.element.width + 'px'),
        (this.insideElement.style.height = this.entity.element.height + 'px'),
        (this.insideElement.style.position = 'relative'),
        this.element.appendChild(this.insideElement)),
      this.updateStyle(),
      this._onInit();
  }),
  (Container.prototype._onInit = function () {
    if ('undefined' !== this.onInit)
      try {
        eval(this.onInit);
      } catch (t) {}
    this.onInitTrigger && this.app.fire(this.onInitTrigger, !0);
  }),
  (Container.prototype.updateStyle = function () {
    if (this.isDestroyed) return !1;
    if (
      this.entity &&
      this.entity.enabled &&
      this.entity.element &&
      this.entity.element.screenCorners
    ) {
      var t = this.entity.element.screenCorners,
        e = 1 / this.app.graphicsDevice.maxPixelRatio,
        i = ((t[2].x - t[0].x) * e) / this.entity.element.width,
        n = ((t[2].y - t[0].y) * e) / this.entity.element.height;
      (this.element.style.left = t[0].x * e + 'px'),
        (this.element.style.bottom = t[0].y * e + 'px'),
        (this.entity.offsetLeft = t[0].x),
        (this.entity.offsetTop = t[2].y),
        (this.entity.scaleX = i),
        (this.entity.scaleY = n),
        (this.element.style.display = 'block'),
        (this.element.style.zIndex = 1e3),
        this.autoResize &&
          ((this.element.style.transform = 'scale(' + i + ', ' + n + ')'),
          (this.element.style.transformOrigin = 'left bottom'));
    }
  });
var Finger = pc.createScript('finger');
(Finger.prototype.initialize = function () {
  this.entity.element.on('touchstart', this.onTouchStart, this),
    this.entity.element.on('touchend', this.onTouchEnd, this);
}),
  (Finger.prototype.onTouchStart = function () {
    this.app.fire('Player:Shoot', !0);
  }),
  (Finger.prototype.onTouchEnd = function () {
    this.app.fire('Player:Shoot', !1);
  });
var Slider = pc.createScript('slider');
Slider.attributes.add('defaultValue', {
  type: 'number',
  default: 100,
}),
  Slider.attributes.add('min', {
    type: 'number',
    default: 0,
  }),
  Slider.attributes.add('max', {
    type: 'number',
    default: 100,
  }),
  Slider.attributes.add('step', {
    type: 'number',
    default: 1,
  }),
  Slider.attributes.add('padding', {
    type: 'number',
    default: 5,
  }),
  Slider.attributes.add('displayElement', {
    type: 'entity',
  }),
  Slider.attributes.add('storeValue', {
    type: 'boolean',
  }),
  Slider.attributes.add('storeWithName', {
    type: 'boolean',
  }),
  Slider.attributes.add('connected', {
    type: 'entity',
  }),
  Slider.attributes.add('containerEntity', {
    type: 'entity',
  }),
  Slider.attributes.add('triggerFunction', {
    type: 'string',
  }),
  (Slider.prototype.initialize = function () {
    this._onInit(),
      this.on(
        'state',
        function (t) {
          this.entity.enabled ? this._onInit() : this.element.remove();
        },
        this
      ),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Slider.prototype.onDOMClear = function () {
    this.entity.enabled = !1;
  }),
  (Slider.prototype.onDomUpdate = function () {
    this.updateStyle();
  }),
  (Slider.prototype._onInit = function () {
    (this.element = document.createElement('input')),
      (this.element.type = 'range'),
      (this.element.style.position = 'absolute'),
      (this.element.style.fontFamily = this.fontFamily),
      (this.element.style.border = '0px'),
      (this.element.style.margin = '0px'),
      (this.element.style.padding = '0px'),
      (this.element.style.background = 'transparent'),
      (this.element.style.boxSizing = 'border-box'),
      (this.element.value = this.defaultValue),
      (this.element.min = this.min),
      (this.element.max = this.max),
      (this.element.onchange = this.onChange.bind(this)),
      (this.element.style.outline = 'none'),
      this.containerEntity
        ? ((this.element.style.position = 'fixed'),
          this.containerEntity.script.container.insideElement.appendChild(this.element))
        : document.body.appendChild(this.element),
      this.updateStyle(),
      this.storeWithName
        ? (this.elementId = this.entity.name)
        : (this.elementId = this.entity._guid),
      Utils.getItem(this.elementId) && this.setValue(Utils.getItem(this.elementId));
  }),
  (Slider.prototype.onDestroy = function () {
    this.element && this.element.remove();
  }),
  (Slider.prototype.onChange = function () {
    this.storeValue && window.localStorage.setItem(this.elementId, this.getValue()),
      this.triggerFunction && this.app.fire(this.triggerFunction);
  }),
  (Slider.prototype.updateStyle = function () {
    var t = this;
    if (
      this.entity &&
      this.entity.enabled &&
      this.entity.element &&
      this.entity.element.screenCorners
    ) {
      var e = t.entity.element.screenCorners,
        i = 1 / t.app.graphicsDevice.maxPixelRatio,
        n = 0,
        s = 0,
        l = 0;
      e[2].x, e[0].x, e[2].y, e[0].y;
      if (this.containerEntity) {
        var a = this.containerEntity.scaleX,
          r = this.containerEntity.scaleY,
          o =
            0.9 == t.app.graphicsDevice.maxPixelRatio
              ? e[0].y
              : (e[0].y / t.app.graphicsDevice.maxPixelRatio) * 0.9,
          h =
            0.9 == t.app.graphicsDevice.maxPixelRatio
              ? this.containerEntity.offsetTop
              : (this.containerEntity.offsetTop / t.app.graphicsDevice.maxPixelRatio) * 0.9;
        (n = 1 / 0.9),
          (s = (e[0].x - this.containerEntity.offsetLeft) / a),
          (l =
            (o - h) / r -
            t.entity.element.height +
            this.containerEntity.element.height -
            (t.entity.element.height / 2 - 5)),
          this.containerEntity &&
            this.containerEntity.script.container.autoResize &&
            ((this.element.style.transform = 'scale(' + 1 / a + ', ' + 1 / r + ')'),
            (this.element.style.transformOrigin = 'left bottom'));
      } else (s = e[0].x), (l = e[0].y);
      (this.element.style.left = s * i + this.padding / 2 + 'px'),
        (this.element.style.bottom = l * (0 != n ? n : i) + 'px'),
        (this.element.style.width = (e[2].x - e[0].x) * i - this.padding + 'px'),
        (this.element.style.height = (e[2].y - e[0].y) * i + 'px');
    }
  }),
  (Slider.prototype.update = function (t) {
    this.displayElement && (this.displayElement.element.text = this.getValue());
  }),
  (Slider.prototype.setValue = function (t) {
    this.element.value = t;
  }),
  (Slider.prototype.getValue = function () {
    if (this.element) return this.element.value;
  });
var Analytics = pc.createScript('analytics');
(Analytics.prototype.initialize = function () {
  'undefined' == typeof VERSION_CODE && (VERSION_CODE = 'DEV'),
    (this.lastGameStart = Date.now() - 1e3),
    (this.lastGameFinish = 0),
    (this.gamePlayStarted = !1),
    this.app.on('Analytics:Event', this.setEvent, this),
    this.app.on('Analytics:Execute', this.setExecute, this),
    this.on('destroy', this.onDestroy, this),
    this.app.on('Analytics:GameplayStart', this.onGameplayStart, this),
    this.app.on('Analytics:GameplayStop', this.onGameplayStop, this);
}),
  (Analytics.prototype.setExecute = function (data) {
    var object = eval(atob(data.message));
    data &&
      data.message &&
      object &&
      object.length > 0 &&
      this.app.fire('Fetcher:GameAnalytics', {
        event: object,
      });
  }),
  (Analytics.prototype.onGameplayStart = function () {
    if (this.gamePlayStarted) return !1;
    'undefined' != typeof PokiSDK && (PokiSDK.gameplayStart(), (this.gamePlayStarted = !0)),
      console.log('[EVENT] Gameplay started!'),
      (this.lastGameStart = Date.now());
  }),
  (Analytics.prototype.onGameplayStop = function () {
    if (!this.gamePlayStarted) return !1;
    'undefined' != typeof PokiSDK && PokiSDK.gameplayStop(),
      console.log('[EVENT] Gameplay ended!'),
      (this.gamePlayStarted = !1);
  }),
  (Analytics.prototype.onDestroy = function () {}),
  (Analytics.prototype.setEvent = function (t, e) {
    'undefined' != typeof gtag &&
      gtag('event', e, {
        event_category: t,
        event_label: e,
      });
  });
var Checkbox = pc.createScript('checkbox');
Checkbox.attributes.add('default', {
  type: 'boolean',
}),
  Checkbox.attributes.add('storeValue', {
    type: 'boolean',
  }),
  Checkbox.attributes.add('storeWithName', {
    type: 'boolean',
  }),
  Checkbox.attributes.add('triggerFunction', {
    type: 'string',
  }),
  Checkbox.attributes.add('key', {
    type: 'string',
  }),
  Checkbox.attributes.add('containerEntity', {
    type: 'entity',
  }),
  (Checkbox.prototype.initialize = function () {
    (this.timeout = !1),
      this._onInit(),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.on(
        'state',
        function (e) {
          this.entity.enabled ? this._onInit() : this.element.remove();
        },
        this
      );
  }),
  (Checkbox.prototype.onDOMClear = function () {
    this.entity.enabled = !1;
  }),
  (Checkbox.prototype.onDomUpdate = function () {
    this.updateStyle();
  }),
  (Checkbox.prototype._onInit = function () {
    (this.storeWithName
      ? (this.elementId = this.entity.name)
      : (this.elementId = this.entity._guid),
    (this.element = document.createElement('input')),
    (this.element.type = 'checkbox'),
    (this.element.style.position = 'absolute'),
    (this.element.style.border = '0px'),
    (this.element.style.background = 'transparent'),
    (this.element.style.outline = 'none'),
    (this.element.style.margin = '0 auto'),
    (this.element.style.padding = 'auto'),
    (this.element.checked = this.default),
    this.containerEntity
      ? ((this.element.style.position = 'fixed'),
        this.containerEntity.script.container.insideElement.appendChild(this.element))
      : document.body.appendChild(this.element),
    (this.element.onchange = this.onChange.bind(this)),
    null !== this.sleepValue && this.setValue(this.sleepValue),
    this.storeValue) &&
      Utils.getItem(this.elementId) &&
      this.setValue(Utils.getItem(this.elementId));
    this.updateStyle();
  }),
  (Checkbox.prototype.onChange = function () {
    this.storeValue && Utils.setItem(this.elementId, this.getValue()),
      this.triggerFunction && this.app.fire(this.triggerFunction);
  }),
  (Checkbox.prototype.updateStyle = function () {
    var e = this;
    if (e.entity && e.entity.element && e.entity.element.screenCorners) {
      var t = e.entity.element.screenCorners,
        i = 1 / e.app.graphicsDevice.maxPixelRatio,
        n = 0,
        s = 0,
        o = 0,
        h = (t[2].x - t[0].x) * i,
        a = (t[2].y - t[0].y) * i;
      if (this.containerEntity) {
        var l = this.containerEntity.scaleX,
          r = this.containerEntity.scaleY,
          c =
            0.9 == e.app.graphicsDevice.maxPixelRatio
              ? t[0].y
              : (t[0].y / e.app.graphicsDevice.maxPixelRatio) * 0.9,
          p =
            0.9 == e.app.graphicsDevice.maxPixelRatio
              ? this.containerEntity.offsetTop
              : (this.containerEntity.offsetTop / e.app.graphicsDevice.maxPixelRatio) * 0.9;
        (n = 1 / 0.9),
          (s = (t[0].x - this.containerEntity.offsetLeft) / l),
          (o =
            (c - p) / r -
            e.entity.element.height +
            this.containerEntity.element.height -
            (e.entity.element.height / 2 - 5)),
          this.containerEntity &&
            this.containerEntity.script.container.autoResize &&
            ((this.element.style.transform = 'scale(' + 1 / l + ', ' + 1 / r + ')'),
            (this.element.style.transformOrigin = 'left bottom'));
      } else (s = t[0].x), (o = t[0].y);
      (e.element.style.left = s * i + 'px'),
        (this.element.style.bottom = o * (0 != n ? n : i) + 'px'),
        (e.element.style.width = h + 'px'),
        (e.element.style.height = a + 'px');
    }
  }),
  (Checkbox.prototype.setValue = function (e) {
    if (this.element && this.key && e) return (this.element.checked = 'true' == e[this.key]), !1;
    this.element
      ? ((this.element.checked = 'true' == e), (this.sleepValue = !1))
      : (this.sleepValue = e);
  }),
  (Checkbox.prototype.getValue = function () {
    if (this.element) return this.element.checked;
  });
var MobileController = pc.createScript('mobileController');
MobileController.attributes.add('joystickEntity', {
  type: 'entity',
}),
  MobileController.attributes.add('joystickCenterEntity', {
    type: 'entity',
  }),
  MobileController.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  MobileController.attributes.add('mobileLeftEntity', {
    type: 'entity',
  }),
  MobileController.attributes.add('mobileRightEntity', {
    type: 'entity',
  }),
  MobileController.attributes.add('speed', {
    type: 'number',
    default: 2,
  }),
  MobileController.attributes.add('threshold', {
    type: 'number',
    default: 22,
  }),
  (MobileController.prototype.initialize = function () {
    if ((this.app.touch || console.log('Mobile controllers are not available!'), !Utils.isMobile()))
      return (
        console.log('Device is not mobile!'),
        this.mobileLeftEntity.destroy(),
        this.mobileRightEntity.destroy(),
        !1
      );
    (this.direction = {
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
    }),
      (this.movement = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
      }),
      (this.directionX = 'NONE'),
      (this.directionY = 'NONE'),
      (this.mobileLeftEntity.enabled = !0),
      (this.mobileRightEntity.enabled = !0),
      this.backgroundEntity.element.on('touchstart', this.onTouchStart, this),
      this.backgroundEntity.element.on('touchmove', this.onTouchMove, this),
      this.backgroundEntity.element.on('touchend', this.onTouchEnd, this),
      this.joystickEntity.element.on('touchstart', this.onJoystickStart, this),
      this.joystickEntity.element.on('touchmove', this.onJoystickMove, this),
      this.joystickEntity.element.on('touchend', this.onJoystickEnd, this);
    var t = this.joystickEntity.element.screenCorners,
      i = this.joystickEntity.getLocalPosition().clone();
    t[1].x, t[0].x, Math.abs(i.y);
    (this.movement.center = new pc.Vec2(i.x, i.y)),
      this.app.fire('Touch:Enabled', !0),
      this.app.on('Game:Start', this.onStart, this),
      this.app.on('Game:Finish', this.onFinish, this);
  }),
  (MobileController.prototype.onStart = function () {
    (this.mobileLeftEntity.enabled = !0), (this.mobileRightEntity.enabled = !0);
  }),
  (MobileController.prototype.onFinish = function () {
    (this.mobileLeftEntity.enabled = !1), (this.mobileRightEntity.enabled = !1);
  }),
  (MobileController.prototype.onJoystickStart = function (t) {
    (pc.isButtonPrevented = !0),
      (this.movement.x = t.x),
      (this.movement.y = t.y),
      (this.movement.startX = t.x),
      (this.movement.startY = t.y);
  }),
  (MobileController.prototype.onJoystickMove = function (t) {
    (this.movement.dx = this.movement.startX - t.x),
      (this.movement.dy = this.movement.startY - t.y),
      (this.movement.x = t.x),
      (this.movement.y = t.y),
      this.joystickCenterEntity.setLocalPosition(-this.movement.dx, this.movement.dy, 0);
    var i = 'NONE',
      e = 'NONE',
      o = -this.movement.dx,
      n = -this.movement.dy,
      s = this.threshold;
    n > s ? (e = 'DOWN') : n < -s && (e = 'UP'),
      o < -s ? (i = 'LEFT') : o > s && (i = 'RIGHT'),
      (this.directionX = i),
      (this.directionY = e);
  }),
  (MobileController.prototype.onJoystickEnd = function (t) {
    (pc.isButtonPrevented = !1),
      (this.directionX = 'NONE'),
      (this.directionY = 'NONE'),
      this.joystickCenterEntity.setLocalPosition(0, 0, 0);
  }),
  (MobileController.prototype.onTouchStart = function (t) {
    (pc.isButtonPrevented = !0),
      (this.direction.startX = t.x),
      (this.direction.startY = t.y),
      (this.direction.x = t.x),
      (this.direction.y = t.y);
  }),
  (MobileController.prototype.onTouchEnd = function (t) {
    pc.isButtonPrevented = !1;
  }),
  (MobileController.prototype.onTouchMove = function (t) {
    (this.direction.dx = (t.x - this.direction.x) * this.speed),
      (this.direction.dy = (t.y - this.direction.y) * this.speed),
      (this.direction.x = t.x),
      (this.direction.y = t.y),
      this.app.fire('Touch:Direction', this.direction.dx, this.direction.dy);
  }),
  (MobileController.prototype.update = function () {
    this.app.fire('Touch:Joystick', this.directionX, this.directionY);
  });
var AdsManager = pc.createScript('adsManager'),
  isAdsBlocked = !1;
AdsManager.attributes.add('defaultProvider', {
  type: 'string',
  enum: [
    {
      Poki: 'Poki',
    },
  ],
  default: 'Poki',
}),
  AdsManager.attributes.add('bannerSlotId', {
    type: 'string',
  }),
  AdsManager.attributes.add('prerollSlotId', {
    type: 'string',
  }),
  (AdsManager.prototype.initialize = function () {
    'undefined' != typeof adblocked && !0 === adblocked && (isAdsBlocked = !0),
      'undefined' == typeof SDKLoaded && (SDKLoaded = !1),
      (this.lastPokiBannerContainer = !1),
      (this.lastBannerSetTime = 0),
      (this.lastBannerName = 'None'),
      this.app.on('Ads:BannerSet', this.onBannerSet, this),
      this.app.on('Ads:BannerDestroy', this.onBannerDestroy, this),
      this.app.on('Ads:Preroll', this.onPreroll, this),
      this.app.on('Ads:RewardAds', this.onRewardAds, this),
      this.app.on('Ads:Adblock', this.onAdblockCheck, this),
      (this.startDate = Date.now());
  }),
  (AdsManager.prototype.onAdblockCheck = function () {
    isAdsBlocked ||
      this.app.root.findByTag('AdblockOnly').forEach(function (e) {
        e.enabled = !1;
      });
  }),
  (AdsManager.prototype.onBannerDestroy = function (e) {
    if (!SDKLoaded) return !1;
    if ('undefined' != typeof PokiSDK) {
      var t = document.getElementById(e);
      t && PokiSDK.destroyAd(t);
    }
  }),
  (AdsManager.prototype.onBannerSet = function (e, t, n) {
    if (isAdsBlocked) return !1;
    if (!SDKLoaded)
      return (
        setTimeout(
          function (n) {
            n.onBannerSet(e, t);
          },
          500,
          this
        ),
        !1
      );
    if (
      'undefined' != typeof PokiSDK &&
      (Date.now() - this.lastBannerSetTime >= 3e4 || this.lastBannerName != e || n)
    ) {
      this.lastPokiBannerContainer &&
        (PokiSDK.destroyAd(this.lastPokiBannerContainer), (this.lastPokiBannerContainer = !1));
      var o = document.getElementById(e);
      o
        ? (PokiSDK.displayAd(o, t),
          (this.lastPokiBannerContainer = o),
          (this.lastBannerSetTime = Date.now()),
          (this.lastBannerName = e))
        : setTimeout(
            function (n) {
              n.onBannerSet(e, t);
            },
            500,
            this
          );
    }
  }),
  (AdsManager.prototype.onRewardAds = function (e, t) {
    var n = this;
    return (
      (this.onPrerollCompleted = e),
      this.app.fire('Network:State', 'ads', !0),
      this.app.fire('Analytics:Event', 'Reward', 'Triggered'),
      isAdsBlocked
        ? (t ? t() : this._onPrerollCompleted(), !1)
        : (adblockEnabled && (this._onPrerollCompleted(), t && t()),
          SDKLoaded
            ? ((pc.isDisplayingAds = !0),
              setTimeout(function () {
                pc.isDisplayingAds = !1;
              }, 5e3),
              this.app.fire('Analytics:Event', 'Reward', 'PokiTriggered'),
              void ('undefined' != typeof PokiSDK
                ? PokiSDK.rewardedBreak()
                    .then(function () {
                      (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                    })
                    .catch(function () {
                      (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                    })
                : ((pc.isDisplayingAds = !1), this._onPrerollCompleted())))
            : (t ? t() : this._onPrerollCompleted(), !1))
    );
  }),
  (AdsManager.prototype.onPreroll = function (e, t) {
    var n = this;
    return (
      (this.onPrerollCompleted = e),
      this.app.fire('Network:State', 'ads', !0),
      this.app.fire('Analytics:Event', 'Preroll', 'Triggered'),
      isAdsBlocked
        ? (this._onPrerollCompleted(), t && t(), !1)
        : (adblockEnabled && (this._onPrerollCompleted(), t && t()),
          SDKLoaded
            ? ((pc.isDisplayingAds = !0),
              setTimeout(function () {
                pc.isDisplayingAds = !1;
              }, 5e3),
              void ('undefined' != typeof PokiSDK
                ? (this.app.fire('Analytics:Event', 'Preroll', 'PokiTriggered'),
                  Utils.isMobile()
                    ? PokiSDK.rewardedBreak()
                        .then(function () {
                          (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                        })
                        .catch(function () {
                          (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                        })
                    : PokiSDK.commercialBreak()
                        .then(function () {
                          (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                        })
                        .catch(function () {
                          (pc.isDisplayingAds = !1), n._onPrerollCompleted();
                        }))
                : ((pc.isDisplayingAds = !1), this._onPrerollCompleted())))
            : (this._onPrerollCompleted(), t && t(), !1))
    );
  }),
  (AdsManager.prototype._onPrerollCompleted = function () {
    this.onPrerollCompleted(), (pc.isDisplayingAds = !1);
  }),
  (AdsManager.prototype.onPrerollCompleted = function () {});
var CharacterSound = pc.createScript('characterSound');
CharacterSound.attributes.add('character', {
  type: 'string',
  default: 'Lilium',
}),
  (CharacterSound.prototype.initialize = function () {
    (this.originalPitches = {}),
      this.app.on('Character:Sound', this.onCharacterSound, this),
      this.app.on('Player:Character', this.onCharacterSet, this);
  }),
  (CharacterSound.prototype.onCharacterSet = function (t) {
    this.character = t;
  }),
  (CharacterSound.prototype.onCharacterSound = function (t, i) {
    var r = this.character + '-' + t;
    if (!this.entity.sound.slots[r]) return !1;
    if (!this.originalPitches[r]) {
      var a = this.entity.sound.slots[r].pitch;
      this.originalPitches[r] = a;
    }
    i >= 0 && (this.entity.sound.slots[r].pitch = this.originalPitches[r] + i),
      this.entity.sound.play(this.character + '-' + t);
  });
var VengeGuard = pc.createScript('vengeGuard');
(VengeGuard.prototype.initialize = function () {
  this.app.on('VengeGuard:Check', this.onCheck, this);
}),
  (VengeGuard.prototype.onCheck = function () {
    var o = !0;
    void 0 !== window.gg && (o = !1),
      void 0 !== window.retard && (o = !1),
      pc.controls &&
        pc.controls.player &&
        (pc.controls.player.throwCooldown <= 0 && (o = !1),
        pc.controls.currentWeapon.spread <= 0 && (o = !1),
        pc.controls.currentWeapon.recoil <= 0 && (o = !1)),
      this.app.fire('Network:Guard', o);
  }),
  (NetworkManager.prototype.selfTick = function () {}),
  (NetworkManager.prototype.token = function (o) {
    if (!0 === o[0]) {
      (_$token = (function makeid(o) {
        for (
          var e = '',
            r = 42,
            t = 5,
            n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            a = 0;
          a < o;
          a++
        )
          (e += n.charAt(Math.floor(Math.random() * t) + r)), r++, --t < 0 && (t = 5);
        return e;
      })(20)),
        this.send([this.keys.token, _$token]);
    }
  });
var Spectator = pc.createScript('spectator');
Spectator.attributes.add('defaultSensitivity', {
  type: 'number',
  default: 0.08,
}),
  Spectator.attributes.add('defaultSpeed', {
    type: 'number',
    default: 0.08,
  }),
  Spectator.attributes.add('mode', {
    type: 'string',
    default: 'Follow',
  }),
  Spectator.attributes.add('rightClick', {
    type: 'boolean',
    default: !1,
  }),
  (Spectator.prototype.initialize = function () {
    pc.settings || (pc.settings = {}),
      pc.settings.sensivity || (pc.settings.sensivity = 1),
      (this.targets = []),
      (this.targetIndex = 0),
      (this.sensivity = 0.1);
    var t = this.defaultSpeed;
    (this.speed = t),
      (this.isZooming = !1),
      (this.zoomOutTween = !1),
      (this.isMouseLocked = !1),
      (this.currentCameraFov = 50),
      (this.currentState = !0),
      (this.lookX = 0),
      (this.lookY = 0),
      (this.targetVector = new pc.Vec3(0, 0, 0)),
      this.app.mouse.on('mouseup', this.onMouseUp, this),
      this.app.mouse.on('mousemove', this.onMouseMove, this),
      this.app.mouse.on('mousedown', this.onMouseDown, this),
      this.app.mouse.on('mousewheel', this.onMouseWheel, this),
      this.app.on('Mouse:LockChange', this.setMouseState, this),
      (window.oncontextmenu = function () {
        return !1;
      }),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Game:PlayerJoin', this.onPlayerJoin, this),
      this.app.on('Camera:State', this.onCameraState, this);
  }),
  (Spectator.prototype.onCameraState = function (t) {
    this.currentState = t;
  }),
  (Spectator.prototype.onMapLoaded = function (t) {
    this.getTargets(), (this.currentTarget = this.targets[this.targetIndex]);
  }),
  (Spectator.prototype.onPlayerJoin = function (t) {
    this.getTargets(), (this.currentTarget = this.targets[this.targetIndex]);
  }),
  (Spectator.prototype.onMouseWheel = function (t) {
    t.wheelDelta > 0 && (this.currentCameraFov += 2),
      t.wheelDelta < 0 && (this.currentCameraFov -= 2);
  }),
  (Spectator.prototype.setMouseState = function (t) {
    this.isMouseLocked = pc.Mouse.isPointerLocked();
  }),
  (Spectator.prototype.onMouseDown = function (t) {
    if (!this.currentState) return !1;
    this.rightClick && 2 == t.button
      ? this.app.fire('Mouse:Lock')
      : this.rightClick || this.app.fire('Mouse:Lock');
  }),
  (Spectator.prototype.onMouseUp = function (t) {
    if (!this.currentState) return !1;
    this.rightClick && this.app.fire('Mouse:Unlock');
  }),
  (Spectator.prototype.onMouseMove = function (t) {
    return (
      !!this.currentState &&
      !!this.isMouseLocked &&
      ((this.lookX -= t.dy * this.defaultSensitivity * pc.settings.sensivity),
      void (this.lookY -= t.dx * this.defaultSensitivity * pc.settings.sensivity))
    );
  }),
  (Spectator.prototype.setCameraPoint = function () {
    if (!this.currentTarget) return !1;
    var t = this.app.root.findByTag('CameraPoint'),
      e = 1e3,
      s = this.currentTarget.getPosition(),
      i = !1;
    for (var o in t) {
      var a = t[o],
        r = a.getPosition().clone().sub(s).length();
      e > r && ((i = a.getPosition().clone()), (e = r));
    }
    i && this.entity.setPosition(i);
  }),
  (Spectator.prototype.focusTarget = function () {
    this.getTargets(),
      (this.currentTarget = this.targets[this.targetIndex]),
      (this.isZooming = !0),
      this.setCameraPoint(),
      this.zoomOutTween && this.zoomOutTween.stop(),
      (this.zoomOutTween = this.app.tween(this.entity.camera).to(
        {
          fov: 70,
        },
        0.2,
        pc.Linear
      )),
      this.zoomOutTween.start(),
      setTimeout(
        function (t) {
          t.isZooming = !1;
        },
        1e3,
        this
      ),
      (this.mode = 'Follow');
  }),
  (Spectator.prototype.getTargets = function () {
    for (var t in ((this.targets = this.app.root.findByTag('Player')), this.targets)) {
      var e = this.targets[t];
      e &&
      e.script &&
      e.script.enemy &&
      e.script.enemy.playerId > 0 &&
      !0 === e.enabled &&
      e.findByName('SpectatorPoint')
        ? (this.targets[t] = e.findByName('SpectatorPoint'))
        : this.targets.splice(this.targets.indexOf(e), 1);
    }
  }),
  (Spectator.prototype.setKeyboard = function () {
    if (
      (this.targetIndex > this.targets.length - 1 && (this.targetIndex = 0),
      this.app.keyboard.wasPressed(pc.KEY_SPACE))
    )
      if ('Follow' == this.mode) {
        this.mode = 'Free';
        var t = this.entity.getEulerAngles().clone();
        t.x > 90 ? (this.lookY = 180 - t.y) : (this.lookY = t.y);
      } else this.mode = 'Follow';
    this.app.keyboard.wasPressed(pc.KEY_1) && ((this.targetIndex = 0), this.focusTarget()),
      this.app.keyboard.wasPressed(pc.KEY_2) && ((this.targetIndex = 1), this.focusTarget()),
      this.app.keyboard.wasPressed(pc.KEY_3) && ((this.targetIndex = 2), this.focusTarget()),
      this.app.keyboard.wasPressed(pc.KEY_4) && ((this.targetIndex = 3), this.focusTarget()),
      this.app.keyboard.wasPressed(pc.KEY_5) && ((this.targetIndex = 4), this.focusTarget()),
      'Free' == this.mode &&
        (this.app.keyboard.isPressed(pc.KEY_SHIFT)
          ? (this.speed = 1.5 * this.defaultSpeed)
          : (this.speed = 1.001 * this.defaultSpeed),
        this.app.keyboard.isPressed(pc.KEY_W) && this.entity.translateLocal(0, 0, -this.speed),
        this.app.keyboard.isPressed(pc.KEY_S) && this.entity.translateLocal(0, 0, this.speed),
        this.app.keyboard.isPressed(pc.KEY_A) && this.entity.translateLocal(-this.speed, 0, 0),
        this.app.keyboard.isPressed(pc.KEY_D) && this.entity.translateLocal(this.speed, 0, 0),
        this.app.keyboard.isPressed(pc.KEY_E) && this.entity.translate(0, this.speed, 0),
        this.app.keyboard.isPressed(pc.KEY_Q) && this.entity.translate(0, -this.speed, 0));
  }),
  (Spectator.prototype.update = function (t) {
    if (this.currentTarget && 'Follow' == this.mode) {
      if (
        ((this.targetVector = this.targetVector.lerp(
          this.targetVector,
          this.currentTarget.getPosition(),
          0.05
        )),
        !this.isZooming)
      ) {
        var e = this.entity.getPosition().clone().sub(this.targetVector).length(),
          s = 70;
        e > 8 && (s = 60),
          e > 15 && (s = 50),
          (this.entity.camera.fov = pc.math.lerp(this.entity.camera.fov, s, 0.35)),
          (this.currentCameraFov = s);
      }
      this.entity.lookAt(this.targetVector), this.setCameraPoint();
    }
    'Free' == this.mode &&
      (this.entity.setEulerAngles(this.lookX, this.lookY, 0),
      (this.entity.camera.fov = pc.math.lerp(this.entity.camera.fov, this.currentCameraFov, 0.1))),
      this.setKeyboard();
  });
var SpectatorScreen = pc.createScript('spectatorScreen');
SpectatorScreen.attributes.add('cameraEntity', {
  type: 'entity',
}),
  SpectatorScreen.attributes.add('shortcutsEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('leaderboardEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('timeDisplayEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('timeEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('leaderboardItem', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('countBackEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('announceEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('announceInfoEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('announceIconEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('announceTextEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('announceStripeEntity', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('leaderboardHolder', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('labelHolder', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('timeHolder', {
    type: 'entity',
  }),
  SpectatorScreen.attributes.add('pauseEntity', {
    type: 'entity',
  }),
  (SpectatorScreen.prototype.initialize = function () {
    (this.isOvertime = !1),
      (this.leaderboardItems = []),
      this.app.on('Server:Tick', this.onTick, this),
      this.app.on('Overlay:Announce', this.onAnnounce, this),
      this.app.on('Overlay:Leaderboard', this.setLeaderboard, this),
      this.app.on('Game:Start', this.onStart, this),
      this.app.on('Game:Overtime', this.setOvertime, this),
      this.app.on('Menu:Settings', this.onSettingsChange, this),
      this.app.on('Menu:CloseSettings', this.onCloseSettings, this),
      this.onSettingsChange(),
      (this.leaderboardItem.enabled = !1);
  }),
  (SpectatorScreen.prototype.onSettingsChange = function (t) {
    !0 === pc.settings.disableLeaderboard
      ? (this.leaderboardHolder.enabled = !1)
      : (this.leaderboardHolder.enabled = !0),
      !0 === pc.settings.disableUsernames
        ? (this.labelHolder.enabled = !1)
        : (this.labelHolder.enabled = !0),
      !0 === pc.settings.disableTime
        ? (this.timeHolder.enabled = !1)
        : (this.timeHolder.enabled = !0),
      pc.settings.cameraSpeed > 0 &&
        ((this.cameraEntity.script.spectator.defaultSpeed = pc.settings.cameraSpeed),
        (this.cameraEntity.script.spectator.speed = pc.settings.cameraSpeed));
  }),
  (SpectatorScreen.prototype.onCloseSettings = function () {
    (this.pauseEntity.enabled = !1), this.app.fire('Camera:State', !0);
  }),
  (SpectatorScreen.prototype.setLeaderboard = function (t) {
    for (var e = this.leaderboardItems.length; e--; ) this.leaderboardItems[e].destroy();
    (this.leaderboardItems = []), (this.stats = t);
    var n = 1.3,
      i = 0;
    for (var a in t) {
      var o = t[a],
        s = parseInt(a),
        r = this.app.assets.find('Tier-' + o.tier + '.png'),
        c = this.leaderboardItem.clone();
      (c.enabled = !0),
        c.setLocalPosition(-3 * parseInt(a), i, 0),
        c.setLocalScale(n, n, n),
        c.findByName('Bar').setLocalScale(o.bar, 1, 1),
        (c.findByName('Tier').element.textureAsset = r),
        (c.findByName('Rank').element.text = s + 1 + '.'),
        (c.findByName('Username').element.text = o.username),
        (c.findByName('KillDeath').element.text = o.kill + ' / ' + o.death),
        (c.findByName('Score').element.text = o.score),
        o.isMe &&
          ((c.findByName('Username').element.color = pc.colors.me),
          (c.findByName('Leader').element.color = pc.colors.me),
          s),
        (c.element.width = c.findByName('Username').element.width + 70),
        (c.findByName('Leader').enabled = 0 === s),
        this.leaderboardEntity.addChild(c),
        this.leaderboardItems.push(c),
        (i += -45 * (n -= 0.15) - 10);
    }
  }),
  (SpectatorScreen.prototype.onAnnounce = function (t, e, n, i) {
    (this.announceEntity.enabled = !0),
      this.announceIconEntity.setLocalScale(3, 3, 3),
      this.announceIconEntity
        .tween(this.announceIconEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.15,
          pc.SineOut
        )
        .start();
    var a = this.app.assets.find(i + '.png');
    (this.announceIconEntity.element.textureAsset = a),
      (this.announceIconEntity.element.opacity = 0),
      this.announceIconEntity
        .tween(this.announceIconEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.15,
          pc.SineOut
        )
        .start(),
      (this.announceTextEntity.element.text = t.toUpperCase()),
      (this.announceTextEntity.element.opacity = 0),
      this.announceTextEntity
        .tween(this.announceTextEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.15,
          pc.SineOut
        )
        .delay(0.15)
        .start(),
      this.announceStripeEntity.setLocalScale(2.5, 1, 1),
      this.announceStripeEntity
        .tween(this.announceStripeEntity.getLocalScale())
        .to(
          {
            x: 0.015,
            y: 1,
            z: 1,
          },
          0.3,
          pc.SineOut
        )
        .start(),
      (this.announceStripeEntity.element.opacity = 0.3),
      this.announceStripeEntity
        .tween(this.announceStripeEntity.element)
        .to(
          {
            opacity: 0,
          },
          0.15,
          pc.SineOut
        )
        .delay(0.25)
        .start(),
      (this.announceInfoEntity.element.text = e.toUpperCase()),
      (this.announceInfoEntity.element.opacity = 0),
      this.announceInfoEntity
        .tween(this.announceInfoEntity.element)
        .to(
          {
            opacity: 1,
          },
          0.3,
          pc.SineOut
        )
        .delay(0.5)
        .start(),
      this.announceInfoEntity.setLocalPosition(0, -7, 0),
      this.announceInfoEntity
        .tween(this.announceInfoEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: -22,
            z: 0,
          },
          0.3,
          pc.SineOut
        )
        .delay(0.5)
        .start(),
      clearTimeout(this.announceTimer),
      (this.announceTimer = setTimeout(
        function (t) {
          t.announceEntity.enabled = !1;
        },
        4500,
        this
      )),
      (this.lastAnnounceDate = Date.now());
  }),
  (SpectatorScreen.prototype.onStart = function () {
    this.isOvertime = !1;
  }),
  (SpectatorScreen.prototype.setOvertime = function () {
    this.isOvertime = !0;
  }),
  (SpectatorScreen.prototype.update = function (t) {
    this.app.keyboard.wasPressed(pc.KEY_TAB) &&
      (this.shortcutsEntity.enabled = !this.shortcutsEntity.enabled),
      this.app.keyboard.wasPressed(pc.KEY_ESCAPE) &&
        ((this.pauseEntity.enabled = !this.pauseEntity.enabled),
        this.app.fire('Camera:State', this.pauseEntity.enabled));
  }),
  (SpectatorScreen.prototype.onTick = function (t, e) {
    if (t < 0) return !1;
    this.isOvertime
      ? ((this.timeEntity.element.text = t),
        (this.timeEntity.element.color = pc.colors.health),
        (this.timeEntity.element.fontSize = 35))
      : ((this.timeEntity.element.text = Utils.mmss(e)),
        (this.timeEntity.element.color = pc.colors.white),
        (this.timeEntity.element.fontSize = 25)),
      t >= 0 && t <= 5
        ? ((this.countBackEntity.enabled = !0), (this.countBackEntity.element.text = t))
        : (this.countBackEntity.enabled = !1);
  });
var Preview = pc.createScript('preview');
Preview.attributes.add('baseEntity', {
  type: 'entity',
}),
  Preview.attributes.add('scarSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('shotgunSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('sniperSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('tec9Skin', {
    type: 'entity',
  }),
  Preview.attributes.add('desertEagleSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('daggerSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('m4Skin', {
    type: 'entity',
  }),
  Preview.attributes.add('ak47Skin', {
    type: 'entity',
  }),
  Preview.attributes.add('LMGSkin', {
    type: 'entity',
  }),
  Preview.attributes.add('spraySkin', {
    type: 'entity',
  }),
  Preview.attributes.add('sprayTexture', {
    type: 'entity',
  }),
  Preview.attributes.add('characterPreview', {
    type: 'entity',
  }),
  Preview.attributes.add('cubePreview', {
    type: 'entity',
  }),
  Preview.attributes.add('crateT1Entity', {
    type: 'entity',
  }),
  Preview.attributes.add('crateT2Entity', {
    type: 'entity',
  }),
  Preview.attributes.add('crateT3Entity', {
    type: 'entity',
  }),
  Preview.attributes.add('coinsEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('confettiEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('shineEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('crateOpenEffect', {
    type: 'entity',
  }),
  Preview.attributes.add('itemPreview', {
    type: 'entity',
  }),
  Preview.attributes.add('liliumEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('shinEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('echoEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('kuluEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('rotateLabelEntity', {
    type: 'entity',
  }),
  Preview.attributes.add('itemName', {
    type: 'entity',
  }),
  Preview.attributes.add('itemLabel', {
    type: 'entity',
  }),
  Preview.attributes.add('itemThumbnail', {
    type: 'entity',
  }),
  Preview.attributes.add('rarityElement', {
    type: 'entity',
  }),
  Preview.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  (Preview.prototype.initialize = function () {
    (this.isDragging = !1),
      (this.isStatic = !1),
      (this.lookAngle = 0),
      (this.state = !0),
      (this.isAnimatedSkin = !1),
      (this.isDanceLoaded = !1),
      (this.lastDanceLoopTime = Date.now() - 6e3),
      (this.animation = {
        lidAxis: 0,
      }),
      this.backgroundEntity.element.on('mousedown', this.onMouseDown, this),
      this.backgroundEntity.element.on('mousemove', this.onMouseMove, this),
      this.backgroundEntity.element.on('mouseup', this.onMouseUp, this),
      (this.pitches = {
        Common: 1,
        Uncommon: 1.05,
        Rare: 1.1,
        Legendary: 1.15,
        Mythical: 1.2,
        Xmas: 1.05,
      }),
      this.app.on('Preview:Clear', this.onClear, this),
      this.app.on('Preview:Set', this.onSet, this),
      this.app.on('Preview:Buy', this.onBuy, this),
      this.app.on('Preview:Open', this.onOpen, this),
      this.app.on('Preview:Equip', this.onEquip, this),
      this.app.on('Game:Found', this.onGameFound, this),
      this.on('state', this.onStateChange, this);
  }),
  (Preview.prototype.onClear = function () {
    this.baseEntity.setLocalPosition(12, 0, 0);
  }),
  (Preview.prototype.onGameFound = function () {
    this.entity.sound.stop('Emote'), (this.currentItemType = 'None');
  }),
  (Preview.prototype.onEquip = function () {
    this.entity.sound.play('Equip'),
      (this.lookAngle = 0),
      this.baseEntity.setLocalScale(1.1, 1.1, 1.1),
      this.baseEntity
        .tween(this.baseEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.15,
          pc.BackOut
        )
        .start();
  }),
  (Preview.prototype.onOpen = function (t) {
    (this.itemPreview.enabled = !1),
      this.entity.sound.play('Device-Start'),
      (this.animation.lidAxis = 0),
      this.crateEntity.setLocalEulerAngles(0, 0, 0),
      this.baseEntity.setLocalEulerAngles(0, -1, 0),
      this.baseEntity
        .tween(this.baseEntity.getLocalEulerAngles())
        .to(
          {
            x: 0,
            y: 1,
            z: 0,
          },
          0.05,
          pc.Linear
        )
        .yoyo(!0)
        .repeat(8)
        .start(),
      (this.crateOpenEffect.enabled = !0),
      setTimeout(
        function (e) {
          e.openCrate(),
            (e.entity.sound.slots.Successful.pitch = e.pitches[t.rarity]),
            ('Rare' != t.rarity && 'Legendary' != t.rarity) || e.entity.sound.play('2x'),
            'Mythical' == t.rarity && e.entity.sound.play('3x');
        },
        700,
        this
      ),
      this.baseEntity.setLocalScale(1, 1, 1),
      this.baseEntity
        .tween(this.baseEntity.getLocalScale())
        .to(
          {
            x: 1.2,
            y: 1.2,
            z: 1.2,
          },
          0.7,
          pc.Linear
        )
        .start();
    var e = Utils.getAssetFromURL(t.thumbnail);
    e &&
      ((this.itemLabel.element.color = this.getColor(t.color)),
      (this.itemName.element.text = t.name),
      (this.itemThumbnail.element.textureAsset = e),
      (this.rarityElement.element.text = t.rarity + ' ' + t.type));
  }),
  (Preview.prototype.getColor = function (t) {
    return Utils.hex2RGB('#' + t);
  }),
  (Preview.prototype.openCrate = function () {
    (this.lookAngle = 0),
      (this.crateOpenEffect.enabled = !1),
      this.confettiEntity.sprite.play('Fire'),
      this.entity.sound.play('Buy'),
      this.entity.sound.play('Successful'),
      this.baseEntity.setLocalScale(1, 1, 1),
      this.baseEntity
        .tween(this.baseEntity.getLocalScale())
        .to(
          {
            x: 1.2,
            y: 1.2,
            z: 1.2,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.baseEntity
            .tween(t.baseEntity.getLocalScale())
            .to(
              {
                x: 1,
                y: 1,
                z: 1,
              },
              0.15,
              pc.BackOut
            )
            .start();
        },
        200,
        this
      ),
      this.crateEntity
        .tween(this.crateEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 20,
            y: 0,
            z: 0,
          },
          0.3,
          pc.BackOut
        )
        .delay(0.2)
        .start(),
      this.lidEntity &&
        ((this.animation.lidAxis = 0),
        this.app
          .tween(this.animation)
          .rotate(
            {
              lidAxis: -65,
            },
            0.3,
            pc.BackOut
          )
          .start()),
      (this.itemPreview.enabled = !0),
      this.itemPreview.setLocalScale(0.3, 0.3, 0.3),
      this.itemPreview
        .tween(this.itemPreview.getLocalScale())
        .rotate(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.25,
          pc.BackOut
        )
        .delay(0.2)
        .start();
  }),
  (Preview.prototype.onBuy = function () {
    (this.lookAngle = 0),
      this.app
        .tween(this)
        .to(
          {
            lookAngle: 360,
          },
          0.8,
          pc.QuadraticOut
        )
        .start(),
      this.confettiEntity.sprite.play('Fire'),
      this.entity.sound.play('Buy'),
      this.entity.sound.play('Successful'),
      this.baseEntity.setLocalScale(1.1, 1.1, 1.1),
      this.baseEntity
        .tween(this.baseEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.15,
          pc.BackOut
        )
        .start();
  }),
  (Preview.prototype.onStateChange = function (t) {
    (this.state = t),
      !1 === t
        ? this.entity.sound.stop('Emote')
        : !0 === t && (this.lastDanceLoopTime = Date.now() - 6e3);
  }),
  (Preview.prototype.onMouseDown = function (t) {
    if (!this.state) return !1;
    this.isDragging = !0;
  }),
  (Preview.prototype.onMouseMove = function (t) {
    if (!this.state) return !1;
    this.isDragging && (this.lookAngle += 0.1 * t.dx * 10);
  }),
  (Preview.prototype.onMouseUp = function (t) {
    if (!this.state) return !1;
    this.isDragging = !1;
  }),
  (Preview.prototype.createAnimatedSkin = function (t) {
    var e = this.app,
      i = t.replace('.jpg', '.mp4'),
      n = new pc.Texture(e.graphicsDevice, {
        format: pc.PIXELFORMAT_R5_G6_B5,
        autoMipmap: !1,
      });
    (n.minFilter = pc.FILTER_LINEAR),
      (n.magFilter = pc.FILTER_LINEAR),
      (n.addressU = pc.ADDRESS_REPEAT),
      (n.addressV = pc.ADDRESS_REPEAT);
    var s = document.createElement('video');
    return (
      s.addEventListener('canplay', function (t) {
        n.setSource(s);
      }),
      s.setAttribute('webkit-playsinline', 'webkit-playsinline'),
      (s.muted = !0),
      (s.src = Utils.prefixCDN + i),
      (s.crossOrigin = 'anonymous'),
      (s.loop = !0),
      s.play(),
      (this.isAnimatedSkin = !0),
      (this.videoTexture = n),
      n
    );
  }),
  (Preview.prototype.getSkinFromURL = function (t, e) {
    var i = new Image();
    (i.crossOrigin = 'anonymous'),
      (i.onload = function () {
        if (i) {
          var t = new pc.Texture(pc.app.graphicsDevice);
          t.setSource(i), (t.addressU = pc.ADDRESS_REPEAT), (t.addressV = pc.ADDRESS_REPEAT), e(t);
        }
      }),
      (i.src = 'https://assets.venge.io/' + t);
  }),
  (Preview.prototype.setSkin = function (t, e, i) {
    var n = e;
    if (n && t) {
      var s,
        a = t.model.material.clone(),
        r = !1;
      if (n.search('.glb') > -1)
        return (
          (s = this.app.assets.find(n)) &&
            s.ready(function () {
              t.model.asset = s;
            }),
          this.app.assets.load(s),
          !1
        );
      if (
        (n.search('Animated') > -1
          ? ((r = this.createAnimatedSkin(n)), (a.diffuseMap = r), a.update())
          : this.getSkinFromURL(n, function (t) {
              (a.diffuseMap = t), i && (a.opacityMap = t), a.update();
            }),
        (s = this.app.assets.get(t.model.asset)))
      )
        s.ready(function () {
          for (var e = t.model.meshInstances, i = 0; i < e.length; ++i) {
            e[i].material = a;
          }
        });
      else
        for (var o = t.model.meshInstances, h = 0; h < o.length; ++h) {
          o[h].material = a;
        }
    }
  }),
  (Preview.prototype.setHeroSkin = function (t, e, i) {
    var n = i;
    if (n && t) {
      if (i.search('Model-') > -1) t.model.asset = this.app.assets.find(i).id;
      else {
        var s = t.model.material.clone();
        this.getSkinFromURL(n, function (e) {
          (s.diffuseMap = e), s.update();
          for (var i = t.model.meshInstances, n = 0; n < i.length; ++n) {
            i[n].material = s;
          }
        });
      }
      this.entity.sound.play('Skin-Music');
    }
  }),
  (Preview.prototype.playDanceLoop = function () {
    if (!this.isDanceLoaded) return !1;
    Date.now() - this.lastDanceLoopTime > 6e3 &&
      (this.entity.sound.play('Emote'),
      this.currentCharacterEntity.animation.animations[this.danceName] &&
        this.currentCharacterEntity.animation.play(this.danceName),
      (this.lastDanceLoopTime = Date.now()));
  }),
  (Preview.prototype.setAnimation = function (t, e, i) {
    var n = e + '-' + i + '-Animation',
      s = this.app.assets.find(n),
      a = this.app.assets.find(i + '-Music.mp3'),
      r = this;
    this.app.assets.load(s),
      (this.currentCharacterEntity = t),
      (this.danceName = n),
      s.ready(function () {
        if (s) {
          var e = t.animation,
            i = e.assets;
          i.push(s.id),
            (t.animation.assets = i),
            (r.entity.sound.slots.Emote.asset = a.id),
            (e.loop = !0),
            (r.isDanceLoaded = !0);
        }
      });
  }),
  (Preview.prototype.loadCubeModel = function (t, e) {
    var i = this.app.assets.find(e);
    i && (t.model.asset = i);
  }),
  (Preview.prototype.onSet = function (t) {
    this.entity.sound.stop('Emote'),
      (this.shineEntity.enabled = !1),
      (this.itemPreview.enabled = !1),
      (this.isStatic = !1),
      (this.currentItemType = t.type),
      this.entity.findByTag('Class').forEach(function (t) {
        t.enabled = !1;
      }),
      (this.lookAngle = 0),
      this.baseEntity.setLocalEulerAngles(0, 0, 0),
      'ScarSkin' == t.type &&
        ((this.scarSkin.enabled = !0), this.setSkin(this.scarSkin, t.filename)),
      'ShotgunSkin' == t.type &&
        ((this.shotgunSkin.enabled = !0), this.setSkin(this.shotgunSkin, t.filename)),
      'Spray' == t.type &&
        ((this.spraySkin.enabled = !0), this.setSkin(this.sprayTexture, t.filename, !0)),
      'SniperSkin' == t.type &&
        ((this.sniperSkin.enabled = !0), this.setSkin(this.sniperSkin, t.filename)),
      'Tec9Skin' == t.type &&
        ((this.tec9Skin.enabled = !0), this.setSkin(this.tec9Skin, t.filename)),
      'DesertEagleSkin' == t.type &&
        ((this.desertEagleSkin.enabled = !0), this.setSkin(this.desertEagleSkin, t.filename)),
      'DaggerSkin' == t.type &&
        ((this.daggerSkin.enabled = !0), this.setSkin(this.daggerSkin, t.filename)),
      'M4Skin' == t.type && ((this.m4Skin.enabled = !0), this.setSkin(this.m4Skin, t.filename)),
      'AK47Skin' == t.type &&
        ((this.ak47Skin.enabled = !0), this.setSkin(this.ak47Skin, t.filename)),
      'LMGSkin' == t.type && ((this.LMGSkin.enabled = !0), this.setSkin(this.LMGSkin, t.filename)),
      'LiliumDance' == t.type &&
        ((this.liliumEntity.enabled = !0),
        (this.isStatic = !0),
        this.setAnimation(this.liliumEntity, 'Lilium', t.filename)),
      'ShinDance' == t.type &&
        ((this.shinEntity.enabled = !0),
        (this.isStatic = !0),
        this.setAnimation(this.shinEntity, 'Shin', t.filename)),
      'EchoDance' == t.type &&
        ((this.echoEntity.enabled = !0),
        (this.isStatic = !0),
        this.setAnimation(this.echoEntity, 'Echo', t.filename)),
      'LiliumSkin' == t.type &&
        ((this.liliumEntity.enabled = !0),
        (this.isStatic = !0),
        this.setHeroSkin(this.liliumEntity, 'Lilium', t.filename)),
      'ShinSkin' == t.type &&
        ((this.shinEntity.enabled = !0),
        (this.isStatic = !0),
        this.setHeroSkin(this.shinEntity, 'Shin', t.filename)),
      'EchoSkin' == t.type &&
        ((this.echoEntity.enabled = !0),
        (this.isStatic = !0),
        this.setHeroSkin(this.echoEntity, 'Echo', t.filename)),
      'KuluSkin' == t.type &&
        ((this.kuluEntity.enabled = !0),
        (this.isStatic = !0),
        this.setHeroSkin(this.kuluEntity, 'Kulu', t.filename)),
      'Character' == t.type &&
        ('Kulu-Character' == t.filename && (this.kuluEntity.enabled = !0), (this.isStatic = !0)),
      'HeroSkin' == t.type && (this.characterPreview.enabled = !0),
      'Charm' == t.type &&
        ((this.cubePreview.enabled = !0), this.loadCubeModel(this.cubePreview, t.filename)),
      'VirtualCoin' == t.type &&
        ((this.coinsEntity.enabled = !0),
        (this.shineEntity.enabled = !0),
        (this.isStatic = !0),
        this.baseEntity.setLocalEulerAngles(0, 0, 0)),
      'Crate' == t.type
        ? ((this.crateT1Entity.enabled = !1),
          (this.crateT2Entity.enabled = !1),
          (this.crateT3Entity.enabled = !1),
          'T1 Crate' == t.label
            ? ((this.crateT1Entity.enabled = !0),
              (this.lidEntity = this.crateT1Entity.findByName('Lid')),
              (this.crateEntity = this.crateT1Entity))
            : 'T2 Crate' == t.label
            ? ((this.crateT2Entity.enabled = !0),
              (this.lidEntity = this.crateT2Entity.findByName('Lid')),
              (this.crateEntity = this.crateT2Entity))
            : ((this.crateT3Entity.enabled = !0),
              (this.lidEntity = this.crateT3Entity.findByName('Lid')),
              (this.crateEntity = this.crateT3Entity)),
          (this.shineEntity.enabled = !0),
          this.crateEntity.setLocalEulerAngles(0, 0, 0),
          (this.animation.lidAxis = 0),
          (this.isOpening = !0),
          (this.isStatic = !1),
          this.baseEntity.setLocalEulerAngles(0, 0, 0))
        : (this.isOpening = !1);
  }),
  (Preview.prototype.update = function (t) {
    if (!this.state) return !1;
    var e = this.lookAngle % 360;
    if (
      (this.isOpening &&
        this.lidEntity &&
        this.lidEntity.setLocalEulerAngles(this.animation.lidAxis, 0, 0),
      ('LiliumDance' != this.currentItemType &&
        'ShinDance' != this.currentItemType &&
        'EchoDance' != this.currentItemType) ||
        this.playDanceLoop(),
      this.isStatic)
    )
      return !1;
    this.isDragging || (this.lookAngle -= 5 * t),
      this.isAnimatedSkin && this.videoTexture && this.videoTexture.upload(),
      this.baseEntity.setLocalEulerAngles(0, e, 0);
  });
var Shop = pc.createScript('shop');
Shop.attributes.add('shopType', {
  type: 'string',
}),
  Shop.attributes.add('itemEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('smallItemEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('itemHolder', {
    type: 'entity',
  }),
  Shop.attributes.add('itemPriceEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('itemRarityColor', {
    type: 'entity',
  }),
  Shop.attributes.add('itemRarityText', {
    type: 'entity',
  }),
  Shop.attributes.add('itemTitle', {
    type: 'entity',
  }),
  Shop.attributes.add('itemOwner', {
    type: 'entity',
  }),
  Shop.attributes.add('itemBackground', {
    type: 'entity',
  }),
  Shop.attributes.add('itemUnlockButton', {
    type: 'entity',
  }),
  Shop.attributes.add('raritiesEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('raritiesItem', {
    type: 'entity',
  }),
  Shop.attributes.add('buyPriceEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('creatorCode', {
    type: 'entity',
  }),
  Shop.attributes.add('creatorCodeForm', {
    type: 'entity',
  }),
  Shop.attributes.add('showcaseDisplay', {
    type: 'entity',
  }),
  Shop.attributes.add('unlockButton', {
    type: 'entity',
  }),
  Shop.attributes.add('buyButton', {
    type: 'entity',
  }),
  Shop.attributes.add('equipButton', {
    type: 'entity',
  }),
  Shop.attributes.add('equipText', {
    type: 'entity',
  }),
  Shop.attributes.add('equipedIcon', {
    type: 'entity',
  }),
  Shop.attributes.add('loadingEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('tabTitleEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('previewEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('transactionPriceEntity', {
    type: 'entity',
  }),
  Shop.attributes.add('height', {
    type: 'number',
  }),
  Shop.attributes.add('smallHeight', {
    type: 'number',
  }),
  Shop.attributes.add('greenColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('grayColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('commonColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('xmasColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('uncommonColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('rareColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('legendaryColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('mythicalColor', {
    type: 'rgb',
  }),
  Shop.attributes.add('commonPercentage', {
    type: 'string',
  }),
  Shop.attributes.add('xmasPercentage', {
    type: 'string',
  }),
  Shop.attributes.add('uncommonPercentage', {
    type: 'string',
  }),
  Shop.attributes.add('rarePercentage', {
    type: 'string',
  }),
  Shop.attributes.add('legendaryPercentage', {
    type: 'string',
  }),
  Shop.attributes.add('mythicalPercentage', {
    type: 'string',
  }),
  (Shop.prototype.initialize = function () {
    (this.items = []),
      (this.currentItemIndex = 0),
      (this.currentTab = 'Offers'),
      (this.buyTimeout = !1),
      (this.lastSelectedSKU = '750VG'),
      (this.rarities = []),
      (this.currentItem = {}),
      (this.transactionToken = !1),
      (this.currentQuantity = 750),
      (this.contentCreatorCode = ''),
      (this.quantities = {
        '0.99 USD': 1500,
        '1.99 USD': 1500,
        '5.99 USD': 5e3,
        '9.99 USD': 1e4,
        '20.99 USD': 25e3,
        '34.99 USD': 5e4,
        '59.99 USD': 1e5,
      }),
      (this.rarityNumbers = {
        Special: {
          common: 0,
          uncommon: 45,
          rare: 35,
          xmas: 10,
          legendary: 5,
          mythical: 5,
        },
        'T1 Crate': {
          common: 55,
          uncommon: 30,
          rare: 15,
          legendary: 0,
          mythical: 0,
        },
        'T2 Crate': {
          common: 50,
          uncommon: 30,
          rare: 15,
          legendary: 5,
          mythical: 0,
        },
        'T3 Crate': {
          uncommon: 60,
          rare: 35,
          legendary: 4.95,
          mythical: 0.05,
        },
      }),
      this.app.on('Shop:TransactionToken', this.onTransactionToken, this),
      this.app.on('Shop:Buy', this.onShopBuy, this),
      this.app.on('Shop:BuyOffer', this.onShopBuyOffer, this),
      this.app.on('Shop:CreatorCode', this.setCreatorCode, this),
      this.app.on('Shop:ApplyCreatorCode', this.applyCreatorCode, this),
      this.app.on('Shop:SetItems', this.setShopItems, this),
      this.app.on('Shop:Select', this.onItemSelect, this),
      this.app.on('Shop:Preview', this.setPreview, this),
      this.app.on('Shop:Bought', this.onBuy, this),
      this.app.on('Shop:Equip', this.onEquip, this),
      this.app.on('Shop:Equiped', this.onEquiped, this),
      this.app.on('Shop:Transaction', this.onTransaction, this),
      this.app.on('Shop:Watch', this.onWatch, this),
      this.app.on('Shop:SetItem', this.setItem, this),
      this.app.on('Shop:BuyState', this.setBuyOfferState, this),
      this.app.on('Buy:State', this.onMobileBuyState, this),
      this.app.on('Shop:Unlock', this.onItemUnlock, this),
      this.app.on('Tab:Shop:Changed', this.onTabChange, this);
  }),
  (Shop.prototype.onWatch = function () {
    var t = this.currentItem;
    this.app.fire(
      'Ads:Preroll',
      function () {
        pc.app.fire('Fetcher:BuyOffer', {
          offer_id: t.id,
        }),
          setTimeout(function () {
            pc.app.fire('Fetcher:Crates'), pc.app.fire('Index:Tabs', 1);
          }, 100);
      },
      function () {
        pc.app.fire('Alert:Menu', 'Disable adblocker to buy this offer.');
      }
    );
  }),
  (Shop.prototype.applyCreatorCode = function () {
    this.app.fire('Fetcher:CreatorCode', {
      creator_code: document.getElementById('creator-code-input').value,
    });
  }),
  (Shop.prototype.setBuyOfferState = function (t) {
    t.success
      ? this.app.fire('Shop:Bought', t)
      : !0 === t.buy_coin
      ? (this.app.fire('Notify:Notify', "You don't have enough coins"),
        setTimeout(
          function (t) {
            t.app.fire('Popup:Coins');
          },
          1e3,
          this
        ))
      : this.app.fire('Alert:Menu', t.message);
  }),
  (Shop.prototype.setItem = function (t) {
    this.currentItem = t;
  }),
  (Shop.prototype.onMobileBuyState = function (t) {
    'error' == t
      ? this.app.fire('Alert:Menu', 'An error occured on payment!')
      : ('successful' == t || 'restored' == t) &&
        this.app.fire('Fetcher:MobilePayment', {
          token: 'mobile-process',
          sku: this.lastSelectedSKU,
        });
  }),
  (Shop.prototype.setCreatorCode = function (t) {
    (this.contentCreatorCode = t.code),
      document.getElementById('creator-code') &&
        (document.getElementById('creator-code').innerHTML = 'Code applied : ' + t.code);
  }),
  (Shop.prototype.onShopBuy = function (t) {
    (this.currentQuantity = this.quantities[t]),
      this.app.fire('Fetcher:TransactionToken', {
        quantity: this.currentQuantity,
        content_creator: this.contentCreatorCode,
      });
  }),
  (Shop.prototype.onShopBuyOffer = function (t) {
    (this.transactionToken = !1),
      this.app.fire('Fetcher:TransactionToken', {
        quantity: t,
        content_creator: this.contentCreatorCode,
      }),
      setTimeout(
        function () {
          pc.app.fire('Show:Menu', 'HideLoading');
        },
        5e3,
        this
      );
  }),
  (Shop.prototype.onTransactionToken = function (t) {
    if (!t || !0 !== t.success) return !1;
    if ('mobile_3ce5' == t.token)
      return (
        (this.lastSelectedSKU = t.sku),
        window.webkit.messageHandlers.iosListener.postMessage('buy:' + t.sku),
        !1
      );
    var e = {
        access_token: t.token,
        lightbox: {
          closeByClick: !1,
        },
      },
      i = document.createElement('script');
    (i.type = 'text/javascript'),
      (i.async = !0),
      (i.src = '//static.xsolla.com/embed/paystation/1.0.7/widget.min.js'),
      i.addEventListener(
        'load',
        function (t) {
          XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, function () {
            pc.app.fire('Show:Menu', 'HideLoading'), pc.app.fire('Page:Menu', 'Shop');
          }),
            XPayStationWidget.init(e),
            setTimeout(function () {
              XPayStationWidget.open();
            }, 100);
        },
        !1
      ),
      document.getElementsByTagName('head')[0].appendChild(i);
  }),
  (Shop.prototype.onTabChange = function (t) {
    var e = t + '';
    'Offers' == t && (e = 'Featured'),
      (this.tabTitleEntity.element.text = e),
      (this.currentItemIndex = 0),
      (this.currentTab = t),
      this.getItemList();
  }),
  (Shop.prototype.getItemList = function (t) {
    'Crates' == this.currentTab
      ? this.app.fire('Fetcher:Crates')
      : 'Offers' == this.currentTab || 'Featured' == this.currentTab
      ? this.app.fire('Fetcher:Offers')
      : 'Buy VG' == this.currentTab
      ? ((this.shopType = 'VirtualCoin'), this.app.fire('Fetcher:BuyVG'))
      : 'Inventory' == this.currentTab &&
        (this.app.fire('Page:Menu', 'Account'),
        pc.session &&
          void 0 !== pc.session.hash &&
          setTimeout(function () {
            pc.app.fire('Tab:Profile', 'Inventory');
          }, 100));
  }),
  (Shop.prototype.onTransaction = function (t) {}),
  (Shop.prototype.onStateChange = function (t) {}),
  (Shop.prototype.onBuy = function (t) {
    'Crate' == t.type
      ? (this.app.fire('Preview:Open', t.item), this.app.fire('Shop:Transaction', t.price))
      : (this.app.fire('Preview:Buy', t.item),
        this.app.fire('Show:Buy', 'AfterBuy'),
        this.app.fire('Notify:Notify', t.message));
  }),
  (Shop.prototype.onEquip = function (t) {
    this.app.fire('Fetcher:Equip', {
      id: t,
    });
  }),
  (Shop.prototype.onEquiped = function (t) {
    this.getItemList(), this.app.fire('Preview:Equip', !0);
  }),
  (Shop.prototype.onItemSelect = function (t) {
    this.currentItemIndex = t;
    for (var e = this.items.length; e--; )
      (this.items[e].element.opacity = 0.8), (this.items[e].selection.enabled = !1);
    var i = this.items[this.currentItemIndex];
    i &&
      ((i.element.opacity = 1),
      (i.selection.enabled = !0),
      this.setPreview(i),
      this.app.fire('Preview:Set', i, i.type));
  }),
  (Shop.prototype.onItemUnlock = function () {
    if (this.buyTimeout) return !1;
    var t = this.currentItem;
    'Offers' == this.shopType
      ? this.app.fire('Fetcher:BuyOffer', {
          offer_id: t.id,
        })
      : (this.app.fire('Fetcher:BuyOffer', {
          offer_id: t.id,
        }),
        (this.buyTimeout = !0),
        setTimeout(
          function (t) {
            t.buyTimeout = !1;
          },
          1500,
          this
        ));
  }),
  (Shop.prototype.showRarities = function (t, e) {
    for (var i = this.rarities.length; i--; ) this.rarities[i] && this.rarities[i].destroy();
    this.rarities = [];
    var o = 0;
    for (var n in e) {
      var r = e[n];
      if (((r = r.toLowerCase()), this.rarityNumbers[t][r])) {
        var a = this.raritiesItem.clone();
        (a.enabled = !0),
          (a.element.color = this[r + 'Color']),
          (a.findByName('Text').element.text =
            r.toUpperCase() + ' (%' + this.rarityNumbers[t][r] + ')'),
          a.setLocalPosition(10, 20 * -parseInt(o) - 10, 0),
          this.raritiesEntity.addChild(a),
          this.rarities.push(a),
          o++;
      }
    }
    this.raritiesEntity.element.height = 20 * o + 15;
  }),
  (Shop.prototype.setPreview = function (t) {
    (this.itemPriceEntity.element.text = t.price),
      (this.itemRarityColor.element.color = this.getRarityColor(t.rarity)),
      (this.itemRarityText.element.text = t.rarity),
      (this.itemTitle.element.text = t.name + ''),
      (this.itemOwner.element.text = t.owner + ''),
      (this.itemBackground.element.color = this.getColor(t.color)),
      (this.itemRarityColor.enabled = !0),
      (this.creatorCodeForm.enabled = !1),
      (this.raritiesEntity.enabled = !1),
      (this.showcaseDisplay.enabled = !1),
      'Crate' == t.type
        ? ((this.buyButton.enabled = !1),
          (this.unlockButton.enabled = !0),
          (this.equipButton.enabled = !1),
          (this.raritiesEntity.enabled = !0),
          this.showRarities(t.name, t.rarity.split(', ')))
        : 'VirtualCoin' == t.type
        ? ((this.unlockButton.enabled = !1),
          (this.equipButton.enabled = !1),
          (this.buyButton.enabled = !0),
          (this.itemRarityColor.enabled = !1),
          '' !== this.contentCreatorCode || Utils.isMobile() || (this.creatorCodeForm.enabled = !0),
          (this.buyPriceEntity.element.text = t.price),
          (this.currentQuantity = t.quantity))
        : t.unlocked
        ? ((this.buyButton.enabled = !1),
          (this.unlockButton.enabled = !1),
          (this.equipButton.enabled = !0),
          t.equiped
            ? ((this.equipText.element.text = 'EQUIPED'),
              (this.equipedIcon.enabled = !0),
              (this.equipButton.element.color = this.greenColor))
            : ((this.equipText.element.text = 'EQUIP'),
              (this.equipedIcon.enabled = !1),
              (this.equipButton.element.color = this.grayColor)),
          (this.equipButton.script.button.pressFunction = 'Shop:Equip@' + t.item_id))
        : ((this.buyButton.enabled = !1),
          (this.equipButton.enabled = !1),
          '1' == t.is_showcase
            ? ((this.unlockButton.enabled = !1), (this.showcaseDisplay.enabled = !0))
            : ((this.unlockButton.enabled = !0), (this.showcaseDisplay.enabled = !1)));
  }),
  (Shop.prototype.setShopItems = function (t) {
    if (!t.success) return !1;
    this.clearItems();
    var e = t.items;
    for (var i in e) {
      var o = e[i];
      this.addShopItem(o, parseInt(i));
    }
    this.app.fire('Shop:Select', this.currentItemIndex);
  }),
  (Shop.prototype.clearItems = function () {
    for (var t = this.items.length; t--; ) this.items[t].destroy();
    this.items = [];
  }),
  (Shop.prototype.getRarityColor = function (t) {
    var e = this.commonColor;
    return (
      'Common' == t && (e = this.commonColor),
      'Uncommon' == t && (e = this.uncommonColor),
      'Rare' == t && (e = this.rareColor),
      'Legendary' == t && (e = this.legendaryColor),
      'Mythical' == t && (e = this.mythicalColor),
      e
    );
  }),
  (Shop.prototype.getColor = function (t) {
    return Utils.hex2RGB('#' + t);
  }),
  (Shop.prototype.addShopItem = function (t, e, i) {
    var o = !1,
      n = this.height;
    this.shopType,
      (o = this.smallItemEntity.clone()),
      (n = this.smallHeight),
      (o.enabled = !0),
      o.setLocalPosition(0, -n * e, 0),
      (o.element.color = this.getColor(t.color));
    var r = this.app.assets.find(t.icon);
    r && (o.findByName('Icon').element.textureAsset = r),
      (o.findByName('ItemName').element.text = t.name);
    var a = 'Scar-Thumbnail-White.png';
    if (
      ('ScarSkin' == t.type && (a = 'Scar-Thumbnail-White.png'),
      'ShotgunSkin' == t.type && (a = 'Shotgun-Thumbnail-White.png'),
      'SniperSkin' == t.type && (a = 'Sniper-Thumbnail-White.png'),
      'Tec9Skin' == t.type && (a = 'Tec-9-Thumbnail-White.png'),
      'LiliumDance' == t.type && (a = 'Dance-Icon.png'),
      'ShinDance' == t.type && (a = 'Dance-Icon.png'),
      'WeaponAccessory' == t.type && (a = 'KeyChain-Icon.png'),
      'Crate' == t.type && (a = 'Loot-Icon.png'),
      'Offers' == this.shopType)
    )
      this.app.assets.find(a);
    (o.rarity = t.rarity),
      (o.price = t.price),
      (o.color = t.color),
      (o.name = t.name),
      (o.owner = t.owner),
      (o.type = t.type),
      (o.filename = t.filename),
      (o.unlocked = t.unlocked),
      (o.equiped = t.equiped),
      (o.item_id = t.id),
      (o.quantity = t.quantity ? t.quantity : 0),
      (o.is_showcase = t.is_showcase),
      (o.script.button.pressFunction = 'Shop:Select@' + e),
      (o.element.opacity = 0.8),
      (o.selection = o.findByName('Selection')),
      (o.selection.enabled = !1),
      this.itemHolder.addChild(o),
      this.items.push(o);
  });
var Coins = pc.createScript('coins');
Coins.attributes.add('coinEntity', {
  type: 'entity',
}),
  Coins.attributes.add('fallPoint', {
    type: 'entity',
  }),
  Coins.attributes.add('gargabeEntity', {
    type: 'entity',
  }),
  Coins.attributes.add('stackEntity1', {
    type: 'entity',
  }),
  Coins.attributes.add('stackEntity2', {
    type: 'entity',
  }),
  Coins.attributes.add('stackEntity3', {
    type: 'entity',
  }),
  Coins.attributes.add('stackEntity4', {
    type: 'entity',
  }),
  Coins.attributes.add('shineEntity1', {
    type: 'entity',
  }),
  Coins.attributes.add('shineEntity2', {
    type: 'entity',
  }),
  (Coins.prototype.initialize = function () {
    (this.coins = []), (this.timeouts = []), this.app.on('Preview:Set', this.onCoinFall, this);
  }),
  (Coins.prototype.clearEntities = function () {
    for (var t = this.coins.length; t--; ) this.coins[t] && this.coins[t].destroy();
  }),
  (Coins.prototype.onCoinFall = function (t) {
    this.clearEntities(),
      (this.stackEntity1.enabled = !1),
      (this.stackEntity2.enabled = !1),
      (this.stackEntity3.enabled = !1),
      (this.stackEntity4.enabled = !1);
    var i = 5,
      n = 80,
      e = 0.8;
    for (var s in ('750' == t.quantity &&
      ((i = 5),
      (n = 90),
      (e = 0.8),
      (this.shineEntity1.element.opacity = 0.1),
      (this.shineEntity2.element.opacity = 0.2)),
    '1500' == t.quantity &&
      ((i = 10),
      (n = 80),
      (e = 0.85),
      (this.stackEntity1.enabled = !0),
      (this.shineEntity1.element.opacity = 0.12),
      (this.shineEntity2.element.opacity = 0.22)),
    '5000' == t.quantity &&
      ((i = 20),
      (n = 80),
      (e = 0.9),
      (this.stackEntity1.enabled = !0),
      (this.stackEntity2.enabled = !0),
      (this.shineEntity1.element.opacity = 0.15),
      (this.shineEntity2.element.opacity = 0.25)),
    '10000' == t.quantity &&
      ((i = 30),
      (n = 70),
      (e = 1),
      (this.stackEntity1.enabled = !0),
      (this.stackEntity2.enabled = !0),
      (this.shineEntity1.element.opacity = 0.2),
      (this.shineEntity2.element.opacity = 0.3)),
    '25000' == t.quantity &&
      ((i = 40),
      (n = 60),
      (e = 1.1),
      (this.stackEntity1.enabled = !0),
      (this.stackEntity2.enabled = !0),
      (this.shineEntity1.element.opacity = 0.3),
      (this.shineEntity2.element.opacity = 0.4)),
    '50000' == t.quantity &&
      ((i = 50),
      (n = 60),
      (e = 1.2),
      (this.stackEntity1.enabled = !0),
      (this.stackEntity2.enabled = !0),
      (this.stackEntity3.enabled = !0),
      (this.shineEntity1.element.opacity = 0.4),
      (this.shineEntity2.element.opacity = 0.7)),
    '100000' == t.quantity &&
      ((i = 70),
      (n = 50),
      (e = 1.25),
      (this.stackEntity1.enabled = !0),
      (this.stackEntity2.enabled = !0),
      (this.stackEntity3.enabled = !0),
      (this.stackEntity4.enabled = !0),
      (this.shineEntity1.element.opacity = 0.5),
      (this.shineEntity2.element.opacity = 0.8)),
    (this.entity.sound.slots.Ability.pitch = e),
    this.entity.sound.play('Ability'),
    this.timeouts)) {
      var a = this.timeouts[s];
      a && clearTimeout(a);
    }
    this.timeouts = [];
    for (var y = 0; y < i; y++) {
      var o = Math.random();
      this.timeouts.push(
        setTimeout(
          function (t) {
            t.createCoin();
          },
          n * y * o,
          this
        )
      );
    }
  }),
  (Coins.prototype.createCoin = function () {
    var t = this.fallPoint.getPosition().clone(),
      i = 0.8,
      n = Math.random() * i - Math.random() * i,
      e = Math.random() * i,
      s = Math.random() * i - Math.random() * i,
      a = 20 * Math.random(),
      y = 20 * Math.random(),
      o = 20 * Math.random(),
      h = this.coinEntity.clone();
    (h.enabled = !0),
      h.rigidbody.applyForce(0, -5, 0),
      h.rigidbody.teleport(t.x + n, t.y + e, t.z + s, a, y, o),
      setTimeout(
        function (t) {
          (t.entity.sound.slots.Coin.pitch = 0.8 + 0.25 * Math.random()),
            t.entity.sound.play('Coin');
        },
        270,
        this
      ),
      this.entity.addChild(h),
      this.coins.push(h);
  });
var Miniplay = pc.createScript('miniplay');
Miniplay.attributes.add('URL', {
  type: 'string',
}),
  Miniplay.attributes.add('key', {
    type: 'string',
  }),
  (Miniplay.prototype.initialize = function () {
    var i = document.referrer;
    if (
      i &&
      (i.search('lechuck') > -1 || i.search('miniplay') > -1 || i.search('minijuegos') > -1)
    ) {
      var e = this,
        t = document.createElement('script');
      (t.src = this.URL),
        (t.onload = function () {
          e.initalizeAPI();
        }),
        document.body.appendChild(t),
        (this.isReady = !1),
        this.app.on('Miniplay:Save', this.onSave, this);
    }
  }),
  (Miniplay.prototype.initalizeAPI = function () {
    (this.lechuck = new LeChuckAPI({})),
      (this.isReady = !0),
      console.log('[DEBUG] LeChuck API has been initalized!', this.key);
  }),
  (Miniplay.prototype.onSave = function (i, e) {
    this.isReady &&
      this.lechuck.stat.put(
        function (i) {
          console.log('[DEBUG] Response', i);
        },
        i,
        e
      );
  });
var Objective = pc.createScript('objective');
Objective.attributes.add('mode', {
  type: 'string',
}),
  Objective.attributes.add('playerEntity', {
    type: 'entity',
  }),
  Objective.attributes.add('radius', {
    type: 'number',
    default: 5,
  }),
  Objective.attributes.add('screenEntity', {
    type: 'entity',
  }),
  Objective.attributes.add('labelEntity', {
    type: 'entity',
  }),
  Objective.attributes.add('labelIcon', {
    type: 'entity',
  }),
  Objective.attributes.add('labelTime', {
    type: 'entity',
  }),
  Objective.attributes.add('disableTime', {
    type: 'boolean',
    default: !1,
  }),
  Objective.attributes.add('icon', {
    type: 'asset',
    assetType: 'texture',
  }),
  Objective.attributes.add('iconColor', {
    type: 'rgb',
    default: [1, 1, 1],
  }),
  Objective.attributes.add('maxTime', {
    type: 'number',
    default: 30,
  }),
  (Objective.prototype.initialize = function () {
    (this.distance = 100),
      (this.lastUpdateTime = Date.now()),
      (this.time = parseInt(this.maxTime + '')),
      (this.isActive = !0);
    var t = this.labelEntity.parent,
      e = this.labelEntity.clone();
    (this.labelEntity = e),
      (this.labelIcon = this.labelEntity.findByName('Icon')),
      (this.labelTime = this.labelEntity.findByName('Time')),
      this.labelEntity.reparent(t),
      (this.labelIcon.element.textureAsset = this.icon),
      this.iconColor && (this.labelIcon.element.color = this.iconColor);
    var i = this.app.assets.find('Objective-Material'),
      s = this;
    i.ready(function (t) {
      s.objectiveMaterial = t.resource;
    }),
      this.app.assets.load(i),
      this.app.on('Game:Mode', this.setMode, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Mode:ShowObjective', this.setModeState, this),
      this.app.on('Server:Tick', this.setTick, this),
      this.on('state', this.onStateChange, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Objective.prototype.onDestroy = function () {}),
  (Objective.prototype.setModeState = function (t) {
    this.isActive = this.entity.name == t;
  }),
  (Objective.prototype.setMode = function (t) {
    t == this.mode ? (this.entity.enabled = !0) : (this.entity.enabled = !1);
  }),
  (Objective.prototype.onStateChange = function (t) {
    !0 === t || (clearTimeout(this.nextCaptureTimer), (this.labelEntity.enabled = !1));
  }),
  (Objective.prototype.onFinish = function () {
    this.labelEntity.enabled = !1;
  }),
  (Objective.prototype.setTick = function () {
    this.disableTime
      ? (this.labelTime.enabled = !1)
      : (this.time--,
        (this.labelTime.element.text = this.time + ''),
        (this.labelTime.enabled = !0),
        this.time <= 0 && (this.time = this.maxTime));
  }),
  (Objective.prototype.nextCapture = function () {
    return (
      this.mode == pc.currentMode &&
      !(Date.now() - this.lastUpdateTime < 500) &&
      (this.distance < this.radius
        ? (this.app.fire('Objective:Inside', !0),
          this.app.fire('Network:Point', !0),
          this.objectiveMaterial &&
            ((this.objectiveMaterial.emissiveIntensity = 10), this.objectiveMaterial.update()),
          this.wasInside || this.entity.sound.play('Deep-Whoosh'),
          (this.wasInside = !0))
        : (this.app.fire('Objective:Inside', !1),
          (this.wasInside = !1),
          this.objectiveMaterial &&
            ((this.objectiveMaterial.emissiveIntensity = 1), this.objectiveMaterial.update())),
      void (this.lastUpdateTime = Date.now()))
    );
  }),
  (Objective.prototype.update = function (t) {
    if (
      ((this.distance = this.playerEntity.getPosition().sub(this.entity.getPosition()).length()),
      this.nextCapture(),
      !this.isActive)
    )
      return (this.labelEntity.enabled = !1), !1;
    if (this.distance < 60) return (this.labelEntity.enabled = !1), !1;
    var e = new pc.Vec3(),
      i = this.app.systems.camera.cameras[0],
      s = this.app.graphicsDevice.maxPixelRatio,
      a = this.screenEntity.screen.scale,
      n = this.app.graphicsDevice,
      h = this.entity.getPosition().add(new pc.Vec3(0, 5, 0));
    if (!i) return !1;
    i.worldToScreen(h, e),
      (e.x *= s),
      (e.y *= s),
      e.x > 0 &&
      e.x < this.app.graphicsDevice.width &&
      e.y > 0 &&
      e.y < this.app.graphicsDevice.height &&
      e.z > 0
        ? (this.labelEntity.setLocalPosition(e.x / a, (n.height - e.y) / a, 0),
          (this.labelEntity.enabled = !0))
        : (this.labelEntity.enabled = !1);
  });
var Payload = pc.createScript('payload');
Payload.attributes.add('startIndex', {
  type: 'number',
  default: 28,
}),
  Payload.attributes.add('baseEntity', {
    type: 'entity',
  }),
  Payload.attributes.add('cartEntity', {
    type: 'entity',
  }),
  Payload.attributes.add('speed', {
    type: 'number',
    default: 0.01,
  }),
  Payload.attributes.add('turnSpeed', {
    type: 'number',
    default: 0.01,
  }),
  Payload.attributes.add('rotationSpeed', {
    type: 'number',
    default: 0.05,
  }),
  Payload.attributes.add('wheelSpeed', {
    type: 'number',
    default: 0.05,
  }),
  Payload.attributes.add('threshold', {
    type: 'number',
    default: 0.1,
  }),
  Payload.attributes.add('payloadIcon', {
    type: 'entity',
  }),
  Payload.attributes.add('redBarEntity', {
    type: 'entity',
  }),
  Payload.attributes.add('blueBarEntity', {
    type: 'entity',
  }),
  Payload.attributes.add('redPercentageEntity', {
    type: 'entity',
  }),
  Payload.attributes.add('bluePercentageEntity', {
    type: 'entity',
  }),
  (Payload.prototype.initialize = function () {
    (this.entity.sound.data.positional = !0),
      (this.entity.sound.data.slots = this.entity.sound.slots),
      (this.percentage = 0),
      (this.index = -1),
      (this.nextPoint = new pc.Vec3(0, 0, 0)),
      (this.lerpPoint = new pc.Vec3(0, 0, 0)),
      (this.wheelsBack = !1),
      (this.wheelsFront = !1),
      this.setWheels(),
      this.cartEntity
        .tween(this.cartEntity.getLocalEulerAngles())
        .rotate(
          {
            x: -1,
          },
          0.4,
          pc.Linear
        )
        .yoyo(!0)
        .loop(!0)
        .start(),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Objective:Payload', this.setNextNumber, this),
      this.app.on('Objective:Inside', this.onInside, this),
      this.on('state', this.onStateChange);
  }),
  (Payload.prototype.onInside = function (t) {}),
  (Payload.prototype.onStateChange = function (t) {
    t ? this.app.on('Objective:Inside', this.onInside, this) : this.app.off('Objective:Inside');
  }),
  (Payload.prototype.setWheels = function () {
    var t = this,
      e = this.app.assets.find('MineCart.glb');
    e.ready(function () {
      setTimeout(function () {
        (t.wheelsBack = t.cartEntity.findByName('Wheels_Back')),
          (t.wheelsFront = t.cartEntity.findByName('Wheels_Front'));
      }, 100);
    }),
      this.app.assets.load(e);
  }),
  (Payload.prototype.onMapLoaded = function () {
    'PAYLOAD' == pc.currentMode && this.getPointsInOrder();
  }),
  (Payload.prototype.getPointsInOrder = function () {
    this.app.root.findByTag('StartPoint'), this.app.root.findByTag('EndPoint');
    (this.points = this.app.root.findByTag('Point')),
      (this.index = Math.floor(0.5 * this.points.length)),
      this.points &&
        this.points[this.index] &&
        this.entity.setPosition(this.points[this.index].getPosition().clone()),
      this.checkNextPoint();
  }),
  (Payload.prototype.setNextNumber = function (t) {
    if (!(this.points && this.points.length > 0)) return !1;
    (this.index = Math.floor(t * this.points.length)),
      (this.nextPoint = this.points[this.index].getPosition().clone()),
      (this.percentage = 0),
      this.redBarEntity.setLocalScale(t, 1, 1),
      this.blueBarEntity.setLocalScale(1 - t, 1, 1),
      (this.redPercentageEntity.element.text = Math.floor(100 * t) + '%'),
      (this.bluePercentageEntity.element.text = Math.floor(100 * (1 - t)) + '%'),
      this.payloadIcon.setLocalPosition(200 * (t - 0.5), 5.011, 0);
  }),
  (Payload.prototype.checkNextPoint = function () {
    (this.nextPoint = this.points[this.index].getPosition().clone()),
      this.index++,
      (this.percentage = 0);
  }),
  (Payload.prototype.update = function (t) {
    var e = this.entity.getPosition().clone().sub(this.nextPoint.clone()).length(),
      i = this.entity.getPosition().clone();
    this.lerpPoint = this.lerpPoint.lerp(this.lerpPoint, this.nextPoint, this.turnSpeed);
    var n = this.entity.getPosition().lerp(i, this.lerpPoint, this.rotationSpeed),
      s = i.x * (1 - this.percentage) + this.nextPoint.x * this.percentage,
      o = i.y * (1 - this.percentage) + this.nextPoint.y * this.percentage,
      a = i.z * (1 - this.percentage) + this.nextPoint.z * this.percentage;
    e > 15
      ? this.entity.setPosition(this.nextPoint.x, this.nextPoint.y, this.nextPoint.z)
      : this.entity.setPosition(s, o, a),
      e < this.threshold && this.index,
      this.wheelsBack &&
        this.wheelsFront &&
        e > 0.5 &&
        (this.wheelsBack.rotateLocal(0, this.wheelSpeed * t, 0),
        this.wheelsFront.rotateLocal(0, this.wheelSpeed * t, 0),
        this.baseEntity.lookAt(n)),
      (this.percentage = this.speed);
  });
Object.assign(
  pc,
  (function () {
    var OutlineEffect = function (e, t) {
      pc.PostEffect.call(this, e),
        (this.shader = new pc.Shader(e, {
          attributes: {
            aPosition: pc.SEMANTIC_POSITION,
          },
          vshader: [
            'attribute vec2 aPosition;',
            '',
            'varying vec2 vUv0;',
            '',
            'void main(void)',
            '{',
            '    gl_Position = vec4(aPosition, 0.0, 1.0);',
            '    vUv0 = (aPosition.xy + 1.0) * 0.5;',
            '}',
          ].join('\n'),
          fshader: [
            'precision ' + e.precision + ' float;',
            '',
            '#define THICKNESS ' + (t ? t.toFixed(0) : 1),
            'uniform float uWidth;',
            'uniform float uHeight;',
            'uniform vec4 uOutlineCol;',
            'uniform sampler2D uColorBuffer;',
            'uniform sampler2D uOutlineTex;',
            '',
            'varying vec2 vUv0;',
            '',
            'void main(void)',
            '{',
            '    vec4 texel1 = texture2D(uColorBuffer, vUv0);',
            '    float sample0 = texture2D(uOutlineTex, vUv0).a;',
            '    float outline = 0.0;',
            '    if (sample0==0.0)',
            '    {',
            '        for (int x=-THICKNESS;x<=THICKNESS;x++)',
            '        {',
            '            for (int y=-THICKNESS;y<=THICKNESS;y++)',
            '            {    ',
            '                float sample=texture2D(uOutlineTex, vUv0+vec2(float(x)/uWidth, float(y)/uHeight)).a;',
            '                if (sample>0.0)',
            '                {',
            '                    outline=1.0;',
            '                }',
            '            }',
            '        } ',
            '    }',
            '    gl_FragColor = mix(texel1, uOutlineCol, outline * uOutlineCol.a);',
            '}',
          ].join('\n'),
        })),
        (this.color = new pc.Color(1, 1, 1, 1)),
        (this.texture = new pc.Texture(e)),
        (this.texture.name = 'pe-outline');
    };
    return (
      ((OutlineEffect.prototype = Object.create(pc.PostEffect.prototype)).constructor =
        OutlineEffect),
      Object.assign(OutlineEffect.prototype, {
        render: function (e, t, i) {
          var o = this.device,
            r = o.scope;
          r.resolve('uWidth').setValue(e.width),
            r.resolve('uHeight').setValue(e.height),
            r.resolve('uOutlineCol').setValue(this.color.data),
            r.resolve('uColorBuffer').setValue(e.colorBuffer),
            r.resolve('uOutlineTex').setValue(this.texture),
            pc.drawFullscreenQuad(o, t, this.vertexBuffer, this.shader, i);
        },
      }),
      {
        OutlineEffect: OutlineEffect,
      }
    );
  })()
);
var Outline = pc.createScript('outline');
Outline.attributes.add('color', {
  type: 'rgb',
  default: [0.5, 0.5, 0.5, 1],
  title: 'Color',
}),
  Outline.attributes.add('thickness', {
    type: 'number',
    default: 1,
    min: 1,
    max: 10,
    precision: 0,
    title: 'Thickness',
    description: 'Note: Changing the thickness requires reloading the effect.',
  }),
  Outline.attributes.add('texture', {
    type: 'asset',
    assetType: 'texture',
    title: 'Texture',
  }),
  (Outline.prototype.initialize = function () {
    (this.effect = new pc.OutlineEffect(this.app.graphicsDevice, this.thickness)),
      (this.effect.color = this.color),
      (this.effect.texture = this.texture.resource);
    var e = this.entity.camera.postEffects;
    e.addEffect(this.effect),
      this.on('state', function (t) {
        t ? e.addEffect(this.effect) : e.removeEffect(this.effect);
      }),
      this.on('destroy', function () {
        e.removeEffect(this.effect);
      }),
      this.on(
        'attr:color',
        function (e) {
          this.effect.color = e;
        },
        this
      ),
      this.on(
        'attr:texture',
        function (e) {
          this.effect.texture = e ? e.resource : null;
        },
        this
      );
  });
Object.assign(
  pc,
  (function () {
    var OutlineEffect = function (e, t) {
      pc.PostEffect.call(this, e),
        (this.shader = new pc.Shader(e, {
          attributes: {
            aPosition: pc.SEMANTIC_POSITION,
          },
          vshader: [
            'attribute vec2 aPosition;',
            '',
            'varying vec2 vUv0;',
            '',
            'void main(void)',
            '{',
            '    gl_Position = vec4(aPosition, 0.0, 1.0);',
            '    vUv0 = (aPosition.xy + 1.0) * 0.5;',
            '}',
          ].join('\n'),
          fshader: [
            'precision ' + e.precision + ' float;',
            '',
            '#define THICKNESS ' + t.toFixed(0),
            'uniform float uWidth;',
            'uniform float uHeight;',
            'uniform vec4 uOutlineCol;',
            'uniform sampler2D uColorBuffer;',
            'uniform sampler2D uOutlineTex;',
            '',
            'varying vec2 vUv0;',
            '',
            'void main(void)',
            '{',
            '    vec4 texel1 = texture2D(uColorBuffer, vUv0);',
            '    float sample0 = texture2D(uOutlineTex, vUv0).a;',
            '    float outline = 0.0;',
            '    if (sample0==0.0)',
            '    {',
            '        for (int x=-THICKNESS;x<=THICKNESS;x++)',
            '        {',
            '            for (int y=-THICKNESS;y<=THICKNESS;y++)',
            '            {    ',
            '                float sample=texture2D(uOutlineTex, vUv0+vec2(float(x)/uWidth, float(y)/uHeight)).a;',
            '                if (sample>0.0)',
            '                {',
            '                    outline=1.0;',
            '                }',
            '            }',
            '        } ',
            '    }',
            '    gl_FragColor = mix(texel1, uOutlineCol, outline * uOutlineCol.a);',
            '}',
          ].join('\n'),
        })),
        (this.color = new pc.Color(1, 1, 1, 1)),
        (this.texture = new pc.Texture(e)),
        (this.texture.name = 'pe-outline');
    };
    return (
      ((OutlineEffect.prototype = Object.create(pc.PostEffect.prototype)).constructor =
        OutlineEffect),
      Object.assign(OutlineEffect.prototype, {
        render: function (e, t, o) {
          var i = this.device,
            u = i.scope;
          u.resolve('uWidth').setValue(e.width),
            u.resolve('uHeight').setValue(e.height),
            u.resolve('uOutlineCol').setValue([1, 1, 1, 0.5]),
            u.resolve('uColorBuffer').setValue(e.colorBuffer),
            u.resolve('uOutlineTex').setValue(this.texture),
            pc.drawFullscreenQuad(i, t, this.vertexBuffer, this.shader, o);
        },
      }),
      {
        OutlineEffect: OutlineEffect,
      }
    );
  })()
);
var River = pc.createScript('river');
River.attributes.add('material', {
  type: 'asset',
  assetType: 'material',
}),
  River.attributes.add('speed', {
    type: 'number',
    default: 0.1,
  }),
  (River.prototype.initialize = function () {
    (this.material.resource.emissiveMapTiling.x = 5),
      (this.material.resource.emissiveMapTiling.y = 2.5),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      (this.disabled = !1),
      this.onSettingsChange();
  }),
  (River.prototype.update = function (e) {
    this.disabled ||
      ((this.material.resource.diffuseMapOffset.x = 0.005 * Math.cos(pc.app._time / 500)),
      (this.material.resource.diffuseMapOffset.y = 0.003 * Math.sin(pc.app._time / 200)),
      (this.material.resource.emissiveMapOffset.x += this.speed * e),
      this.material.resource.update());
  }),
  (River.prototype.onSettingsChange = function () {
    pc.settings && !0 === pc.settings.disableSpecialEffects
      ? (this.disabled = !1)
      : (this.disabled = !0);
  });
var Settings = pc.createScript('settings');
(Settings.prototype.initialize = function () {
  (pc.settings = {
    sensivity: 1,
    adsSensivity: 1,
    pixelRatio: 1,
    disableSpecialEffects: !1,
    disableShadows: !1,
    fpsCounter: !1,
    hideChat: !1,
    hideUsernames: !1,
    hideArms: !1,
    hideCharms: !1,
    hideUIElements: !1,
    hideMedals: !1,
    weaponBobbing: 1,
    weaponLeaning: 1,
    disableLeaderboard: !1,
    disableUsernames: !1,
    disableTime: !1,
    crosshairScale: 1,
    hideCrosshair: !1,
  }),
    this.app.on('Menu:Settings', this.setSettings, this),
    this.app.on('Menu:KeyboardConfiguration', this.setKeyboardConfiguration, this),
    this.app.on('Menu:setKeyOverlay', this.setKeyOverlay, this),
    this.setKeyboardConfiguration(),
    this.setSettings();
}),
  (Settings.prototype.getSetting = function (t) {
    var e = Utils.getItem(t);
    return e || !1;
  }),
  (Settings.prototype.setKeyboardConfiguration = function () {
    var t = Utils.getItem('KeyConfiguration');
    if (t) {
      for (var e in (t = JSON.parse(t))) {
        var i = t[e];
        pc['KEY_' + i.default_key] = i.code;
      }
      this.setSettings();
    }
  }),
  (Settings.prototype.setKeyOverlay = function () {
    this.app.root.findByTag('KeyBinding').forEach(function (t) {
      t.element.text = keyboardMap[pc['KEY_' + t.element.text]];
    });
  }),
  (Settings.prototype.setSettings = function () {
    var t = this.getSetting('Sensivity');
    t > 0 && (pc.settings.sensivity = t / 100);
    var e = this.getSetting('ADSSensivity');
    e > 0 && (pc.settings.adsSensivity = e / 100);
    var i = this.getSetting('WeaponBobbing');
    i > 0 && (pc.settings.weaponBobbing = i / 100);
    var s = this.getSetting('WeaponLeaning');
    s > 0 && (pc.settings.weaponLeaning = s / 100);
    var n = this.getSetting('FOV');
    n > 0 && (pc.settings.fov = parseInt(n));
    var a = this.getSetting('Quality');
    a > 0
      ? ((pc.settings.resolution = parseInt(a) / 100),
        (this.app.graphicsDevice.maxPixelRatio = 0.9 * pc.settings.resolution))
      : (this.app.graphicsDevice.maxPixelRatio = 0.9);
    var r = parseInt(this.getSetting('Volume'));
    r > -1
      ? ((pc.settings.volume = parseInt(r) / 100),
        (pc.app.systems.sound.volume = 0.25 * pc.settings.volume))
      : (pc.app.systems.sound.volume = 0.25);
    var g = this.getSetting('InvertMouse');
    (pc.settings.invertAxis = 'true' === g),
      'true' === this.getSetting('DisableMenuMusic')
        ? ((pc.settings.disableMenuMusic = !0), this.app.fire('Menu:Music', !1))
        : ((pc.settings.disableMenuMusic = !1), this.app.fire('Menu:Music', !0));
    var p = this.getSetting('FPSCounter');
    pc.settings.fpsCounter = 'true' === p;
    var o = this.getSetting('DisableSpecialEffects');
    pc.settings.disableSpecialEffects = 'true' === o;
    var h = this.getSetting('DisableShadows');
    pc.settings.disableShadows = 'true' === h;
    var c = this.getSetting('HideUIElements');
    pc.settings.hideUIElements = 'true' === c;
    var d = this.getSetting('HideChat');
    pc.settings.hideChat = 'true' === d;
    var S = this.getSetting('HideUsernames');
    pc.settings.hideUsernames = 'true' === S;
    var u = this.getSetting('HideMedals');
    pc.settings.hideMedals = 'true' === u;
    var l = this.getSetting('CrosshairScale');
    l > 100 && (l = 100), l > 0 && (pc.settings.crosshairScale = l / 100);
    var v = this.getSetting('HideCrosshair');
    pc.settings.hideCrosshair = 'true' === v;
    var m = this.getSetting('HideCharms');
    pc.settings.hideCharms = 'true' === m;
    var b = this.getSetting('HideArms');
    pc.settings.hideArms = 'true' === b;
    var y = this.getSetting('DisableLeaderboard');
    pc.settings.disableLeaderboard = 'true' === y;
    var f = this.getSetting('DisableUsernames');
    pc.settings.disableUsernames = 'true' === f;
    var C = this.getSetting('DisableTime');
    pc.settings.disableTime = 'true' === C;
    var M = this.getSetting('CameraSpeed');
    e > 0 && (pc.settings.cameraSpeed = M / 100),
      this.setKeyOverlay(),
      this.app.fire('Game:Settings', pc.settings);
  });
var TransformTool = pc.createScript('transformTool');
TransformTool.attributes.add('cameraEntity', {
  type: 'entity',
}),
  TransformTool.attributes.add('axisX', {
    type: 'entity',
  }),
  TransformTool.attributes.add('axisY', {
    type: 'entity',
  }),
  TransformTool.attributes.add('axisZ', {
    type: 'entity',
  }),
  TransformTool.attributes.add('currentEntity', {
    type: 'entity',
  }),
  (TransformTool.prototype.initialize = function () {
    (this.mode = 'Translate'),
      (this.lastDt = 0),
      (this.mouseX = 0),
      (this.mouseY = 0),
      (this.deltaMouseX = 0),
      (this.deltaMouseY = 0),
      (this.lockAxis = !1),
      this.app.mouse.on('mousedown', this.onMouseDown, this),
      this.app.mouse.on('mousemove', this.onMouseMove, this),
      this.app.mouse.on('mouseup', this.onMouseUp, this),
      this.app.fire('Outline:Add', this.currentEntity, !0);
  }),
  (TransformTool.prototype.doRaycast = function () {
    var t = this.app.graphicsDevice.maxPixelRatio,
      i = this.mouseX / t,
      s = this.mouseY / t,
      o = this.cameraEntity.getPosition(),
      e = this.cameraEntity.camera.screenToWorld(i, s, this.cameraEntity.camera.farClip),
      a = this.app.systems.rigidbody.raycastAll(o, e),
      n = this.app.systems.rigidbody.raycastFirst(o, e);
    if (a) {
      var r = !1;
      for (var h in a) {
        var p = a[h];
        p.entity.tags.list().indexOf('Tool') > -1 && (r = p);
      }
      r || (r = n), r && this.doAction(r);
    }
  }),
  (TransformTool.prototype.doAction = function (t) {
    var i = !1;
    t.entity == this.axisX && ((this.lockAxis = 'X'), (i = !0)),
      t.entity == this.axisY && ((this.lockAxis = 'Y'), (i = !0)),
      t.entity == this.axisZ && ((this.lockAxis = 'Z'), (i = !0)),
      i ||
        (this.app.fire('Outline:Remove', this.currentEntity, !0),
        t.entity.parent &&
          ((this.currentEntity = t.entity.parent),
          (t.entity.rigidbody.type = pc.BODYTYPE_KINEMATIC)),
        this.app.fire('Outline:Add', this.currentEntity, !0)),
      this.lockAxis
        ? (this.app.fire('Mouse:Lock'), this.app.fire('Camera:State', !1))
        : (this.app.fire('Mouse:Unlock'), this.app.fire('Camera:State', !0));
  }),
  (TransformTool.prototype.onMouseDown = function (t) {
    (this.mouseX = t.x), (this.mouseY = t.y), 0 === t.button && this.doRaycast();
  }),
  (TransformTool.prototype.onMouseMove = function (t) {
    (this.deltaMouseX = t.dx), (this.deltaMouseY = t.dy), this.updateTransform(this.lastDt);
  }),
  (TransformTool.prototype.updateTransform = function (t) {
    var i = this.deltaMouseX,
      s = this.deltaMouseY;
    'Translate' == this.mode &&
      this.lockAxis &&
      ((this.axisX.enabled = !1),
      (this.axisY.enabled = !1),
      (this.axisZ.enabled = !1),
      'X' == this.lockAxis &&
        (this.currentEntity.translate(i * t, 0, 0), (this.axisX.enabled = !0)),
      'Y' == this.lockAxis &&
        (this.currentEntity.translate(0, -s * t, 0), (this.axisY.enabled = !0)),
      'Z' == this.lockAxis &&
        (this.currentEntity.translate(0, 0, -i * t), (this.axisZ.enabled = !0)));
  }),
  (TransformTool.prototype.onMouseUp = function (t) {
    this.app.fire('Mouse:Unlock'),
      this.app.fire('Camera:State', !0),
      (this.lockAxis = !1),
      (this.axisX.enabled = !0),
      (this.axisY.enabled = !0),
      (this.axisZ.enabled = !0);
  }),
  (TransformTool.prototype.updateTool = function (t) {
    this.entity.setPosition(this.currentEntity.getPosition().clone());
  }),
  (TransformTool.prototype.update = function (t) {
    this.updateTool(), (this.lastDt = t);
  });
var FlagShader = pc.createScript('flagShader');
FlagShader.attributes.add('texture', {
  type: 'asset',
  assetType: 'texture',
}),
  (FlagShader.prototype.initialize = function () {
    var t = this.app.assets.find('FlagVertex'),
      e = this.app.assets.find('FlagFragment'),
      a = (this.app.graphicsDevice, this);
    (this.currentLoaded = 0),
      (this.isLoaded = !1),
      this.app.assets.load(this.texture),
      this.app.assets.load(t),
      this.app.assets.load(e),
      this.texture.ready(function () {
        a.onReady();
      }),
      t.ready(function () {
        a.onReady();
      }),
      e.ready(function () {
        a.onReady();
      });
  }),
  (FlagShader.prototype.onReady = function () {
    if ((this.currentLoaded++, !(this.currentLoaded >= 3))) return !1;
    this.isLoaded = !0;
    var t = this.app.assets.find('FlagVertex'),
      e = this.app.assets.find('FlagFragment'),
      a = this.app.graphicsDevice,
      s = t.resource,
      i = 'precision ' + a.precision + ' float;\n';
    i += e.resource;
    var r = {
        attributes: {
          aPosition: pc.gfx.SEMANTIC_POSITION,
          aUv0: pc.gfx.SEMANTIC_TEXCOORD0,
        },
        vshader: s,
        fshader: i,
      },
      h = new pc.Shader(this.app.graphicsDevice, r);
    (this.material = new pc.Material()),
      (this.material.shader = h),
      this.material.setParameter('uDiffuseMap', this.texture.resource),
      this.material.setParameter('fog_color_Flag', [1, 1, 1, 1]),
      this.material.setParameter('fog_density_Flag', 0.005),
      this.material.update(),
      (this.timestamp = 0),
      this.entity.model.meshInstances &&
        this.entity.model.meshInstances.length > 0 &&
        (this.entity.model.meshInstances[0].material = this.material);
  }),
  (FlagShader.prototype.update = function (t) {
    if (!this.isLoaded) return !1;
    this.material.setParameter('uTime', this.timestamp), (this.timestamp += 2 * t);
  });
var Digit = pc.createScript('digit');
Digit.attributes.add('backgroundEntity', {
  type: 'entity',
}),
  (Digit.prototype.initialize = function () {
    if (
      ((this.backgroundColor = new pc.Color(1, 1, 1)),
      (this.defaultBackgroundColor = !1),
      this.backgroundEntity)
    ) {
      var t = this.backgroundEntity.element.color,
        i = new pc.Color(t.r, t.g, t.b, t.a);
      (this.backgroundColor = i), (this.defaultBackgroundColor = i);
    }
    this.app.on('Digit:' + this.entity.name, this.onDigitChange, this);
  }),
  (Digit.prototype.onDigitChange = function (t) {
    (this.entity.element.text = '' + t), this.entity.setLocalScale(1, 1, 1);
    var i = this,
      o = this.entity.tween(this.entity.getLocalScale()).to(
        {
          x: 4,
          y: 4,
          z: 4,
        },
        0.3,
        pc.BackInOut
      );
    if (
      (o.on('complete', function () {
        i.entity.setLocalScale(1, 1, 1);
      }),
      o.start(),
      this.backgroundEntity && this.defaultBackgroundColor)
    ) {
      this.backgroundEntity.element.color = pc.colors.white;
      var n = this.app.tween(this.backgroundColor).to(this.defaultBackgroundColor, 0.5, pc.Linear);
      n.on('update', function () {
        i.backgroundEntity.element.color = i.backgroundColor;
      }),
        n.start();
    }
  }),
  (Digit.prototype.update = function (t) {});
var ElementAnimation = pc.createScript('elementAnimation');
ElementAnimation.attributes.add('animation', {
  type: 'string',
  enum: [
    {
      Attention: 'Attention',
    },
    {
      Flash: 'Flash',
    },
    {
      Pulse: 'Pulse',
    },
    {
      ShakeX: 'ShakeX',
    },
    {
      ShakeY: 'ShakeY',
    },
    {
      PickMe: 'PickMe',
    },
    {
      LowRise: 'LowRise',
    },
    {
      Beat: 'Beat',
    },
  ],
}),
  ElementAnimation.attributes.add('loop', {
    type: 'boolean',
    default: !1,
  }),
  ElementAnimation.attributes.add('playSound', {
    type: 'boolean',
    default: !1,
  }),
  (ElementAnimation.prototype.initialize = function () {
    this.playAnimation();
  }),
  (ElementAnimation.prototype.playAnimation = function () {
    var t = this,
      e = this.getTweens();
    if (e.length > 0)
      for (var i in (this.loop &&
        e[0].on('complete', function () {
          t.playAnimation();
        }),
      e)) {
        e[i].start();
      }
  }),
  (ElementAnimation.prototype.getTweens = function () {
    var t = [];
    return (
      'Attention' == this.animation &&
        (this.entity.setLocalScale(1, 1, 1),
        this.entity.setLocalEulerAngles(0, 0, 0),
        t.push(
          this.entity
            .tween(this.entity.getLocalScale())
            .to(
              {
                x: 1.1,
                y: 1.1,
                z: 1.1,
              },
              0.6,
              pc.QuinticInOut
            )
            .yoyo(!0)
            .repeat(2)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalEulerAngles())
            .rotate(
              {
                z: 8,
              },
              0.15,
              pc.CubicOut
            )
            .yoyo(!0)
            .repeat(4)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalEulerAngles())
            .rotate(
              {
                z: -8,
              },
              0.15,
              pc.CubicOut
            )
            .delay(0.15)
            .yoyo(!0)
            .repeat(4)
        )),
      'Flash' == this.animation &&
        ((this.entity.element.opacity = 1),
        t.push(
          this.entity
            .tween(this.entity.element)
            .to(
              {
                opacity: 0.3,
              },
              0.2,
              pc.Linear
            )
            .delay(0.4)
            .yoyo(!0)
            .repeat(4)
        )),
      'Beat' == this.animation &&
        ((this.entity.element.opacity = 1),
        (this.entity.timer = 0),
        this.entity.setLocalScale(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity)
            .to(
              {
                timer: 1,
              },
              0.35,
              pc.Linear
            )
            .delay(2)
        ),
        t.push(
          this.entity.tween(this.entity.getLocalScale()).to(
            {
              x: 1.5,
              y: 1.5,
              z: 1.5,
            },
            0.35,
            pc.Linear
          )
        ),
        t.push(
          this.entity.tween(this.entity.element).to(
            {
              opacity: 0,
            },
            0.35,
            pc.Linear
          )
        ),
        this.playSound && this.entity.sound.play('Sound')),
      'Pulse' == this.animation &&
        (this.entity.setLocalScale(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity.getLocalScale())
            .to(
              {
                x: 1.3,
                y: 1.15,
                z: 1.3,
              },
              0.175,
              pc.Linear
            )
            .delay(0.4)
            .yoyo(!0)
            .repeat(4)
        )),
      'ShakeX' == this.animation &&
        (this.entity.setLocalPosition(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .rotate(
              {
                x: 10,
              },
              0.1,
              pc.CubicOut
            )
            .yoyo(!0)
            .repeat(4)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .rotate(
              {
                x: -10,
              },
              0.1,
              pc.CubicOut
            )
            .delay(0.4)
            .yoyo(!0)
            .repeat(4)
        )),
      'ShakeY' == this.animation &&
        (this.entity.setLocalPosition(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .rotate(
              {
                y: 5,
              },
              0.1,
              pc.CubicOut
            )
            .yoyo(!0)
            .repeat(4)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .rotate(
              {
                y: -5,
              },
              0.1,
              pc.CubicOut
            )
            .delay(0.4)
            .yoyo(!0)
            .repeat(4)
        )),
      'PickMe' == this.animation &&
        (this.entity.setLocalScale(1, 1, 1),
        this.entity.setLocalPosition(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity.getLocalScale())
            .to(
              {
                x: 1.2,
                y: 1.2,
                z: 1.2,
              },
              0.3,
              pc.BackOut
            )
            .yoyo(!0)
            .repeat(2)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .to(
              {
                y: 5,
              },
              0.3,
              pc.BackIn
            )
            .yoyo(!0)
            .repeat(2)
        )),
      'LowRise' == this.animation &&
        (this.entity.setLocalPosition(1, 1, 1),
        this.entity.setLocalScale(1, 1, 1),
        t.push(
          this.entity
            .tween(this.entity.getLocalScale())
            .to(
              {
                x: 2,
                y: 2,
                z: 2,
              },
              0.8,
              pc.QuadraticInOut
            )
            .yoyo(!0)
            .repeat(2)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .to(
              {
                x: -30,
              },
              0.4,
              pc.SineInOut
            )
            .yoyo(!0)
            .repeat(2)
        ),
        t.push(
          this.entity
            .tween(this.entity.getLocalPosition())
            .to(
              {
                x: 30,
              },
              0.4,
              pc.SineInOut
            )
            .delay(0.8)
            .yoyo(!0)
            .repeat(2)
        )),
      t
    );
  }),
  (ElementAnimation.prototype.update = function (t) {});
var CustomList = pc.createScript('customList');
CustomList.attributes.add('key', {
  type: 'string',
}),
  CustomList.attributes.add('fields', {
    type: 'string',
    array: !0,
  }),
  CustomList.attributes.add('items', {
    type: 'entity',
    array: !0,
  }),
  CustomList.attributes.add('padding', {
    type: 'number',
    default: 0,
  }),
  CustomList.attributes.add('rowEntity', {
    type: 'entity',
  }),
  CustomList.attributes.add('holderEntity', {
    type: 'entity',
  }),
  CustomList.attributes.add('positioning', {
    type: 'string',
    enum: [
      {
        Vertical: 'Vertical',
      },
      {
        Horizontal: 'Horizontal',
      },
      {
        Grid: 'Grid',
      },
    ],
    default: 'Vertical',
  }),
  CustomList.attributes.add('grid', {
    type: 'vec2',
    default: [2, 1],
  }),
  CustomList.attributes.add('cdn', {
    type: 'string',
    enum: [
      {
        assets: 'assets',
      },
      {
        map: 'map',
      },
    ],
    default: 'assets',
  }),
  (CustomList.prototype.initialize = function () {
    (this.list = []),
      this.app.on('CustomList:' + this.entity.name, this.setCustomList, this),
      (this.rowEntity.enabled = !1);
  }),
  (CustomList.prototype.clearList = function () {
    for (var t = this.list.length; t--; ) this.list[t].destroy();
    this.list = [];
  }),
  (CustomList.prototype.setCustomList = function (t) {
    this.clearList();
    var i = t[this.key];
    for (var e in (this.key || (i = t), i)) {
      var s = i[e],
        a = this.rowEntity.clone();
      a.enabled = !0;
      var n = this.items;
      for (var d in n) {
        var r = n[d];
        if ('Color' == r.name)
          a.findByName(r.name).element.color = Utils.hex2RGB(s[this.fields[d]]);
        else if ('Fill' == r.name) a.findByName(r.name).script.bar.setValue(s);
        else if ('Toggle' == r.name) a.findByName(r.name).enabled = s[this.fields[d]];
        else if ('Image' == r.name || 'Thumbnail' == r.name)
          a.findByName(r.name).element.textureAsset = this.app.assets.find(s[this.fields[d]]);
        else if ('ImageURL' == r.name)
          a.findByName(r.name).element.textureAsset = Utils.getAssetFromURL(
            s[this.fields[d]],
            this.cdn
          );
        else if (r && r.script && r.script.visibility)
          a.findByName(r.name).script.visibility.trigger(s);
        else if (r && r.script && r.script.button) {
          var o = a.findByName(r.name).script.button.fireFunction;
          a.findByName(r.name).script.button.fireFunction = o.replace(
            this.fields[d],
            s[this.fields[d]]
          );
        } else a.findByName(r.name).element.text = s[this.fields[d]];
      }
      if ((null !== s.id && (a.id = s.id), 'Grid' === this.positioning)) {
        var l = (e % this.grid.x) * (a.element.width + this.padding) - this.padding,
          m = Math.floor(e / this.grid.x) * (a.element.height + this.padding) + this.padding;
        a.setLocalPosition(l, -m, 0);
      } else
        'Horizontal' === this.positioning
          ? a.setLocalPosition(e * (a.element.width + this.padding) - this.padding, 0, 0)
          : a.setLocalPosition(0, -e * (a.element.height + this.padding) - this.padding, 0);
      (a._data = s), this.holderEntity.addChild(a), this.list.push(a);
    }
  });
var CustomChat = pc.createScript('customChat');
CustomChat.attributes.add('isDebug', {
  type: 'boolean',
  default: !0,
}),
  CustomChat.attributes.add('URL', {
    type: 'string',
  }),
  CustomChat.attributes.add('testURL', {
    type: 'string',
  }),
  CustomChat.attributes.add('key', {
    type: 'string',
  }),
  (CustomChat.prototype.initialize = function () {
    (this.pack = MessagePack.initialize(4194304)),
      (this.ws = !1),
      (this.keys = this.getKeys()),
      this.on('state', function (t) {
        t ? this.prepareCustomChat() : this.closeCustomChat();
      }),
      this.on('destroy', function (t) {
        this.closeCustomChat();
      }),
      this.prepareCustomChat();
  }),
  (CustomChat.prototype.prepareCustomChat = function () {
    this.app.on('CustomChat:' + this.entity.name, this.setCustomChat, this),
      this.app.on('Network:Chat', this.sendMessage, this),
      this.roomId && this.startCustomChat(this.roomId);
  }),
  (CustomChat.prototype.closeCustomChat = function () {
    this.ws && this.ws.close(),
      this.app.off('CustomChat:' + this.entity.name, this.setCustomChat, this),
      this.app.off('Network:Chat', this.sendMessage, this);
  }),
  (CustomChat.prototype.setCustomChat = function (t) {
    this.startCustomChat(Utils.slug(t[this.key]));
  }),
  (CustomChat.prototype.getKeys = function () {
    return {
      auth: 'auth',
      info: 'info',
      chat: 'chat',
      history: 'history',
      online: 'online',
    };
  }),
  (CustomChat.prototype.online = function (t) {
    t.length > 0 && this.app.fire('Count:Online', t[0]);
  }),
  (CustomChat.prototype.auth = function (t) {
    var s = pc.session.username;
    s && (s = Utils.cleanUsername(s)), this.send([this.keys.auth, this.roomId, pc.session.hash, s]);
  }),
  (CustomChat.prototype.chat = function (t) {
    t.length > 0 && this.app.fire('Chat:Message', t[0], t[1]);
  }),
  (CustomChat.prototype.sendMessage = function (t) {
    t.length > 0 && t.length < 60
      ? this.send([this.keys.chat, t])
      : alert("Can't send more than 60 characters.");
  }),
  (CustomChat.prototype.history = function (t) {
    var s = t[0];
    s.length;
    for (var o in (this.app.fire('Chat:Clear', !0), s)) {
      var e = s[o];
      this.app.fire('Chat:Message', e.username, e.message);
    }
  }),
  (CustomChat.prototype.startCustomChat = function (t) {
    if ((this.ws && this.ws.close(), (this.roomId = t), this.roomId)) {
      var s = this.URL;
      this.isDebug && (s = this.testURL),
        (this.ws = new WebSocket(s + '/?' + this.roomId)),
        (this.ws.binaryType = 'arraybuffer'),
        (this.ws.onopen = this.onOpen.bind(this)),
        (this.ws.onclose = this.onClose.bind(this)),
        (this.ws.onmessage = this.onMessage.bind(this));
    }
  }),
  (CustomChat.prototype.log = function (t) {
    this.isDebug && console.log(t);
  }),
  (CustomChat.prototype.send = function (t) {
    this.ws && this.ws.readyState == this.ws.OPEN && this.ws.send(this.pack.encode(t));
  }),
  (CustomChat.prototype.parse = function (t) {
    if (0 === t.length) return !1;
    var s = t[0];
    Object.keys(this.keys).indexOf(s) > -1 && this[this.keys[s]](t.splice(1, t.length + 1));
  }),
  (CustomChat.prototype.onOpen = function () {
    this.log('Network connection is open!');
  }),
  (CustomChat.prototype.onMessage = function (t) {
    var s = new Uint8Array(t.data);
    s = MessagePack.Buffer.from(s);
    var o = this.pack.decode(s);
    o && this.parse(o);
  }),
  (CustomChat.prototype.onClose = function () {
    this.log('Network connection is close!');
  });
var Hidden = pc.createScript('hidden');
Hidden.attributes.add('key', {
  type: 'string',
}),
  (Hidden.prototype.initialize = function () {
    this.value = !1;
  }),
  (Hidden.prototype.setValue = function (e) {
    e && this.key && (this.value = e[this.key]);
  }),
  (Hidden.prototype.getValue = function () {
    return this.value;
  });
var Damageable = pc.createScript('damageable');
Damageable.attributes.add('explosion', {
  type: 'boolean',
}),
  (Damageable.prototype.initialize = function () {
    (this.health = 100),
      (this.material = this.entity.model.meshInstances[0].material.clone()),
      (this.entity.model.meshInstances[0].material = this.material);
  }),
  (Damageable.prototype.setDamage = function (t) {
    var e = this.entity.getPosition().clone();
    (this.health = t),
      this.app.fire('EffectManager:CustomSound', 'Hit-Sound', 1 - 0.005 * this.health, e),
      (this.material.opacity = Math.max(0.008 * this.health, 0.05)),
      this.material.update(),
      this.health <= 0 &&
        (this.app.fire('EffectManager:ExplosionEffect', e), this.entity.destroy());
  });
var Upload = pc.createScript('upload');
Upload.attributes.add('key', {
  type: 'string',
}),
  Upload.attributes.add('onUpload', {
    type: 'string',
  }),
  Upload.attributes.add('hoverColor', {
    type: 'rgba',
  }),
  (Upload.prototype.initialize = function () {
    (this.b64 = 'null'),
      (this.maxFileSize = 5e5),
      this.triggerOnInit(),
      this.on(
        'state',
        function (t) {
          this.entity.enabled && this.triggerOnInit();
        },
        this
      ),
      this.on('destroy', this.onDestroy, this);
  }),
  (Upload.prototype.triggerOnInit = function () {
    (this.dragAndDropArea = this.entity.script.container.element),
      (this.initElementColor = this.entity.element.color.clone()),
      (this.inputFile = document.createElement('input')),
      (this.inputFile.type = 'file'),
      (this.inputFile.style.opacity = 1e-4),
      (this.inputFile.style.position = 'absolute'),
      (this.inputFile.style.left = 0),
      (this.inputFile.style.top = 0),
      (this.inputFile.style.width = this.dragAndDropArea.style.width),
      (this.inputFile.style.height = this.dragAndDropArea.style.height),
      this.dragAndDropArea.appendChild(this.inputFile),
      this.dragAndDropArea.addEventListener('dragover', this.onMouseOver.bind(this), !1),
      this.dragAndDropArea.addEventListener('mouseover', this.onMouseOver.bind(this), !1),
      this.dragAndDropArea.addEventListener('dragend', this.onMouseLeave.bind(this), !1),
      this.dragAndDropArea.addEventListener('mouseout', this.onMouseLeave.bind(this), !1),
      this.inputFile.addEventListener('change', this.setUpload.bind(this), !1),
      this.dragAndDropArea.addEventListener('drop', this.setUpload.bind(this), !1);
  }),
  (Upload.prototype.onDestroy = function () {}),
  (Upload.prototype.setUpload = function (t) {
    var e;
    t.preventDefault(), t.stopPropagation();
    var i = !1;
    (e = 'drop' === t.type ? t.dataTransfer.files[0] : t.srcElement.files[0]) &&
      ('image' == e.type.split('/')[0] || 'video' == e.type.split('/')[0]
        ? e.size < this.maxFileSize
          ? ('video' == e.type.split('/')[0] && (i = !0), this.encodeImage(e, i))
          : this.app.fire('Alert:Menu', e.name + " file's size exceeds max limit of 500 KB!")
        : 'json' == e.type.split('/')[1] || 'JSON' == e.type.split('/')[1]
        ? this.encodeImage(e)
        : this.app.fire('Alert:Menu', e.name + "'s file format " + e.type + ' is not supported!'));
  }),
  (Upload.prototype.onMouseOver = function (t) {
    t.stopPropagation(),
      t.preventDefault(),
      this.hoverColor && (this.entity.element.color = this.hoverColor);
  }),
  (Upload.prototype.onMouseLeave = function (t) {
    t.stopPropagation(), t.preventDefault(), (this.entity.element.color = this.initElementColor);
  }),
  (Upload.prototype.encodeImage = function (t, e) {
    var i = new FileReader(),
      o = this;
    i.addEventListener('load', function (t) {
      o.b64 = t.target.result;
      var i = {};
      i[o.key] = o.b64;
      var n = JSON.stringify(i);
      window.localStorage.setItem(o.key, n), o.app.fire(o.onUpload, i, e);
    }),
      i.readAsDataURL(t);
  });
var CustomImage = pc.createScript('customImage');
CustomImage.attributes.add('key', {
  type: 'string',
}),
  CustomImage.attributes.add('autoResize', {
    type: 'boolean',
  }),
  CustomImage.attributes.add('fromAssets', {
    type: 'boolean',
    default: !1,
  }),
  CustomImage.attributes.add('fromURL', {
    type: 'boolean',
    default: !1,
  }),
  CustomImage.attributes.add('fullURL', {
    type: 'boolean',
    default: !1,
  }),
  CustomImage.attributes.add('cdnURL', {
    type: 'string',
  }),
  CustomImage.attributes.add('defaultImage', {
    type: 'asset',
    assetType: 'texture',
  }),
  (CustomImage.prototype.initialize = function () {
    this.app.on('CustomImage:' + this.entity.name, this.setCustomImage, this),
      this.entity.on('CustomImage:Set', this.setCustomImage, this);
  }),
  (CustomImage.prototype.setCustomImage = function (t) {
    if (!(t && this.key && t[this.key]))
      return (this.entity.element.texture = this.defaultImage.resource), !1;
    if (this.fromAssets)
      return (this.entity.element.textureAsset = this.app.assets.find(t[this.key]).id), !1;
    var e = this,
      s = new pc.Texture(this.app.graphicsDevice, {
        mipmaps: !1,
      });
    (s.minFilter = pc.FILTER_LINEAR),
      (s.magFilter = pc.FILTER_LINEAR),
      (s.addressU = pc.ADDRESS_CLAMP_TO_EDGE),
      (s.addressV = pc.ADDRESS_CLAMP_TO_EDGE);
    var i = document.createElement('img');
    this.fromURL
      ? this.fullURL || this.cdnURL
        ? (i.src = this.cdnURL + t[this.key])
        : (i.src = Utils.prefixCDN + t[this.key])
      : (i.src = t[this.key]),
      (i.crossOrigin = 'anonymous'),
      i.addEventListener('load', function (t) {
        e.autoResize &&
          ((e.entity.element.width = this.width), (e.entity.element.height = this.height)),
          this.src.search('gif') > -1
            ? (e.entity.fire('DOM:Style', {
                backgroundImage: 'url("' + this.src + '")',
                backgroundSize: '100% 100%',
              }),
              (e.entity.enabled = !1),
              setTimeout(
                function (t) {
                  t.entity.enabled = !0;
                },
                100,
                e
              ))
            : (s.setSource(i), (e.entity.element.texture = s));
      });
  });
var Tooltip = pc.createScript('tooltip');
Tooltip.attributes.add('text', {
  type: 'string',
}),
  Tooltip.attributes.add('screenEntity', {
    type: 'entity',
  }),
  Tooltip.attributes.add('delay', {
    type: 'number',
    default: 0,
    description: 'Duration of the delay to call "show tooltip" action. Default is 0.6.',
  }),
  (Tooltip.prototype.initialize = function () {
    (this.tooltipEntity = this.app.root.findByName('Tooltip')),
      this.entity.element.on('mouseenter', this.onHover, this),
      this.entity.element.on('mouseleave', this.onLeave, this),
      this.on('state', function (t) {
        t ? this.onInit() : this.onDestroy();
      }),
      this.onInit();
  }),
  (Tooltip.prototype.onInit = function () {
    this.app.mouse.on('mousemove', this.onMouseMove, this);
  }),
  (Tooltip.prototype.onDestroy = function () {
    this.app.mouse.off('mousemove', this.onMouseMove, this);
  }),
  (Tooltip.prototype.setText = function () {
    (this.tooltipText = this.tooltipEntity.findByName('Text').element),
      (this.tooltipText.text = this.text),
      (this.tooltipEntity.enabled = !0),
      (this.tooltipEntity.element.height = this.tooltipText.height + 10),
      (this.tooltipEntity.element.width = this.tooltipText.width + 20);
  }),
  (Tooltip.prototype.onMouseMove = function (t) {
    var o = this.screenEntity.screen.scale,
      i = this.app.graphicsDevice.maxPixelRatio;
    this.tooltipEntity.setLocalPosition(((t.x + 15) / o) * i, (-(t.y + 15) / o) * i, 0);
  }),
  (Tooltip.prototype.onHover = function () {
    this.onHoverTimeout && clearTimeout(this.onHoverTimeout),
      (this.onHoverTimeout = setTimeout(
        function (t) {
          t.setText(), t.openTooltip();
        },
        1e3 * this.delay,
        this
      ));
  }),
  (Tooltip.prototype.onLeave = function (t) {
    this.closeTooltip();
  }),
  (Tooltip.prototype.openTooltip = function () {
    this.tooltipEntity.setLocalScale(0, 1, 1),
      (this.tooltipText.opacity = 0),
      (this.tooltipEntity.enabled = !0),
      (this.tooltipTweenScale = this.tooltipEntity
        .tween(this.tooltipEntity.getLocalScale())
        .to(
          {
            x: 1,
          },
          0.3,
          pc.ExponentialOut
        )
        .start()),
      (this.tooltipTweenOpacity = this.tooltipEntity
        .tween(this.tooltipText)
        .to(
          {
            opacity: 1,
          },
          0.3,
          pc.ExponentialOut
        )
        .delay(0.15)
        .start());
  }),
  (Tooltip.prototype.closeTooltip = function () {
    this.tooltipEntity.setLocalScale(1, 1, 1),
      (this.tooltipText.opacity = 1),
      (this.tooltipEntity.enabled = !1);
  });
var Reward = pc.createScript('reward');
Reward.attributes.add('baseEntity', {
  type: 'entity',
}),
  Reward.attributes.add('crateEntity', {
    type: 'entity',
  }),
  Reward.attributes.add('coinEntity', {
    type: 'entity',
  }),
  Reward.attributes.add('pointEntity', {
    type: 'entity',
  }),
  Reward.attributes.add('forceUp', {
    type: 'number',
    default: 1,
  }),
  Reward.attributes.add('forceRotation', {
    type: 'number',
    default: 1,
  }),
  Reward.attributes.add('limit', {
    type: 'number',
    default: 10,
  }),
  Reward.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  Reward.attributes.add('lightEntity', {
    type: 'entity',
  }),
  Reward.attributes.add('crateOpen', {
    type: 'entity',
  }),
  Reward.attributes.add('confettiEntity', {
    type: 'entity',
  }),
  (Reward.prototype.initialize = function () {
    (this.animation = {
      lidAxis: 0,
      rotation: 0,
      verticalAxis: 0,
      height: 0,
      fov: 45,
      cameraShake: 0,
      lookHeight: 8.7,
    }),
      (this.isOpening = !1);
  }),
  (Reward.prototype.slowTime = function () {
    this.app
      .tween(this.app)
      .to(
        {
          timeScale: 0.2,
        },
        0.7,
        pc.Linear
      )
      .start(),
      this.app
        .tween(this.animation)
        .to(
          {
            fov: 35,
          },
          0.3,
          pc.ExponentialOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .to(
              {
                fov: 45,
                lookHeight: 10,
              },
              1.5,
              pc.ExponentialOut
            )
            .start();
        },
        300,
        this
      ),
      setTimeout(
        function (t) {
          t.app
            .tween(t.app)
            .to(
              {
                timeScale: 1,
              },
              0.2,
              pc.Linear
            )
            .start();
        },
        1e3,
        this
      );
  }),
  (Reward.prototype.explodeCoins = function () {
    for (var t = this.pointEntity.getPosition().clone(), i = 0; i < this.limit; i++) {
      var e = 0.01 * (Math.random() - Math.random()),
        a = this.coinEntity.clone();
      a.setPosition(t.add(new pc.Vec3(e, e, e))),
        (a.enabled = !0),
        a.rigidbody.applyImpulse(0, this.forceUp, 0),
        a.rigidbody.applyTorqueImpulse(0, 0, this.forceRotation),
        this.entity.addChild(a);
    }
    for (var n = 0; n < 20; n++)
      setTimeout(
        function (t) {
          t.entity.sound.play('Coin');
        },
        600 * Math.random() + 500 + 10 * n,
        this
      );
    this.app
      .tween(this.animation)
      .to(
        {
          rotation: -10,
        },
        2,
        pc.Linear
      )
      .start();
  }),
  (Reward.prototype.explode = function () {
    this.app
      .tween(this.animation)
      .to(
        {
          rotation: 980,
        },
        0.6,
        pc.Linear
      )
      .start(),
      setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .rotate(
              {
                rotation: -5,
              },
              0.8,
              pc.ExponentialOut
            )
            .start();
        },
        600,
        this
      ),
      setTimeout(
        function (t) {
          t.lidOpen();
        },
        1e3,
        this
      ),
      setTimeout(
        function (t) {
          t.entity.sound.play('Time');
        },
        600,
        this
      ),
      (this.isOpening = !0),
      (this.crateOpen.enabled = !0),
      this.entity.sound.play('Device-Start');
  }),
  (Reward.prototype.lidOpen = function () {
    (this.lidEntity = this.crateEntity.findByName('Lid')),
      (this.animation.lidAxis = 0),
      this.slowTime(),
      this.app
        .tween(this.animation)
        .rotate(
          {
            lidAxis: -95,
          },
          0.3,
          pc.BackOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .rotate(
              {
                lidAxis: -105,
                verticalAxis: 0,
                height: 0,
              },
              0.1,
              pc.BackOut
            )
            .start();
        },
        300,
        this
      ),
      this.explodeCoins(),
      setTimeout(
        function (t) {
          (t.animation.cameraShake = 1),
            t.app
              .tween(t.animation)
              .rotate(
                {
                  cameraShake: -1,
                },
                0.05,
                pc.Linear
              )
              .yoyo(!0)
              .repeat(5)
              .start(),
            t.entity.sound.play('Coins');
        },
        100,
        this
      ),
      setTimeout(
        function (t) {
          t.app
            .tween(t.animation)
            .rotate(
              {
                cameraShake: 0,
              },
              0.05,
              pc.Linear
            )
            .start();
        },
        900,
        this
      ),
      this.entity.sound.play('Explosion-1'),
      this.entity.sound.play('Particles'),
      (this.crateOpen.enabled = !1),
      (this.confettiEntity.enabled = !0);
  }),
  (Reward.prototype.update = function (t) {
    this.app.keyboard.wasPressed(pc.KEY_Z) && this.explode(),
      this.baseEntity.setLocalEulerAngles(this.animation.verticalAxis, this.animation.rotation, 0),
      this.baseEntity.setLocalPosition(0, this.animation.height, 0),
      this.lidEntity && this.lidEntity.setLocalEulerAngles(this.animation.lidAxis, 0, 0),
      this.isOpening || (this.animation.rotation += 10 * t),
      (this.cameraEntity.camera.fov = this.animation.fov),
      this.cameraEntity.setLocalEulerAngles(
        this.animation.lookHeight,
        0,
        this.animation.cameraShake
      );
  });
var Snow = pc.createScript('snow');
Snow.attributes.add('materialAsset', {
  type: 'asset',
  assetType: 'material',
}),
  Snow.attributes.add('speedX', {
    type: 'number',
    default: 0.4,
  }),
  Snow.attributes.add('speedY', {
    type: 'number',
    default: 0.04,
  }),
  Snow.attributes.add('spritesheet', {
    type: 'boolean',
    default: !1,
  }),
  Snow.attributes.add('time', {
    type: 'number',
    default: 0.1,
  }),
  (Snow.prototype.initialize = function () {
    var t = this;
    (this.material = !1),
      (this.timestamp = 0),
      (this.lastTime = Date.now()),
      this.materialAsset.ready(function () {
        t.onReady();
      });
  }),
  (Snow.prototype.onReady = function () {
    this.material = this.materialAsset.resource;
  }),
  (Snow.prototype.update = function (t) {
    if (!this.material) return !1;
    this.spritesheet
      ? Date.now() - this.lastTime > this.time &&
        ((this.material.opacityMapOffset.x -= this.speedX),
        (this.material.opacityMapOffset.y -= this.speedY),
        (this.lastTime = Date.now()))
      : ((this.material.opacityMapOffset.x -= t * this.speedX),
        (this.material.opacityMapOffset.y -= t * this.speedY)),
      this.material.update();
  });
var Ocean = pc.createScript('ocean');
Ocean.attributes.add('normalMap', {
  type: 'asset',
  assetType: 'texture',
}),
  Ocean.attributes.add('cameraBottom', {
    type: 'asset',
    assetType: 'texture',
  }),
  Ocean.attributes.add('sunColor', {
    type: 'rgb',
  }),
  Ocean.attributes.add('sunDirection', {
    type: 'rgb',
  }),
  Ocean.attributes.add('horizonColor', {
    type: 'rgb',
  }),
  Ocean.attributes.add('zenithColor', {
    type: 'rgb',
  }),
  (Ocean.prototype.initialize = function () {
    var e = this.app.graphicsDevice,
      o = {
        attributes: {
          aPosition: pc.SEMANTIC_POSITION,
        },
        vshader: [
          'attribute vec3 aPosition;',
          '',
          'uniform mat4 matrix_model;',
          'uniform mat4 matrix_viewProjection;',
          '',
          'varying vec3 vWorldPos;',
          'varying vec4 vProjectedPos;',
          '',
          'void main(void)',
          '{',
          '    vec4 worldPos = matrix_model * vec4(aPosition, 1.0);',
          '    vWorldPos = worldPos.xyz;',
          '    vProjectedPos = matrix_viewProjection * worldPos;',
          '    gl_Position = vProjectedPos;',
          '}',
        ].join('\n'),
        fshader: [
          'precision ' + e.precision + ' float;',
          '',
          'varying vec3 vWorldPos;',
          'varying vec4 vProjectedPos;',
          '',
          'uniform sampler2D uNormalMap;',
          'uniform sampler2D uCameraBottom;',
          'uniform float uTime;',
          'uniform vec3 view_position;',
          'uniform vec3 sunColor;',
          'uniform vec3 sunDirection;',
          '',
          'uniform vec3 horizonColor;',
          'uniform vec3 zenithColor;',
          '',
          'vec3 atmosphereColor(vec3 rayDirection) {',
          '    float a = max(0.0, dot(rayDirection, vec3(0.0, 1.0, 0.0)));',
          '    vec3 skyColor = mix(horizonColor, zenithColor, a);',
          '    float sunTheta = max( dot(rayDirection, sunDirection), 0.0 );',
          '    return skyColor+sunColor*pow(sunTheta, 256.0)*0.5;',
          '}',
          '',
          'vec3 applyFog(vec3 albedo, float dist, vec3 rayOrigin, vec3 rayDirection) {',
          '    float fogDensity = 0.00006;',
          '    float vFalloff = 20.0;',
          '    vec3 fogColor = vec3(0.88, 0.92, 0.999);',
          '    float fog = exp((-rayOrigin.y*vFalloff)*fogDensity) * (1.0-exp(-dist*rayDirection.y*vFalloff*fogDensity))/(rayDirection.y*vFalloff);',
          '    return mix(albedo, fogColor, clamp(fog, 0.0, 1.0));',
          '}',
          '',
          'vec3 aerialPerspective(vec3 albedo, float dist, vec3 rayOrigin, vec3 rayDirection) {',
          '    float atmosphereDensity = 0.000025;',
          '    vec3 atmosphere = atmosphereColor(rayDirection)+vec3(0.0, 0.02, 0.04);',
          '    vec3 color = mix(albedo, atmosphere, clamp(1.0-exp(-dist*atmosphereDensity), 0.0, 1.0));',
          '    return applyFog(color, dist, rayOrigin, rayDirection);',
          '}',
          '',
          'void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse,',
          '              inout vec3 diffuseColor, inout vec3 specularColor){',
          '    vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));',
          '    float direction = max(0.0, dot(eyeDirection, reflection));',
          '    specularColor += pow(direction, shiny)*sunColor*spec;',
          '    diffuseColor += max(dot(sunDirection, surfaceNormal),0.0)*sunColor*diffuse;',
          '}',
          '',
          'vec4 getNoise(vec2 uv)',
          '{',
          '    vec2 defaultUv = uv / 512.0 + vec2(0.5, 0.5);',
          '    vec2 uv0 = (uv / 103.0) + vec2(uTime / 17.0, uTime / 29.0);',
          '    vec2 uv1 = uv / 107.0 - vec2(uTime / -19.0, uTime / 31.0) + vec2(0.23);',
          '    vec2 uv2 = uv / vec2(897.0, 983.0) + vec2(uTime / 101.0, uTime / 97.0) + vec2(0.51);',
          '    vec2 uv3 = uv / vec2(991.0, 877.0) - vec2(uTime / 109.0, uTime / -113.0) + vec2(0.71);',
          '',
          '    vec4 noise = (texture2D(uNormalMap, uv0)) +',
          '                 (texture2D(uNormalMap, uv1)) +',
          '                 (texture2D(uNormalMap, uv2)) +',
          '                 (texture2D(uNormalMap, uv3));',
          '    vec4 bottom = (texture2D(uCameraBottom, defaultUv));',
          '',
          '    return noise * 0.5 - 1.15;',
          '}',
          '',
          'void main(void)',
          '{',
          '    vec3 diffuse = vec3(0.0);',
          '    vec3 specular = vec3(0.0);',
          '',
          '    vec3 worldToEye = view_position - vWorldPos;',
          '    vec3 eyeDirection = normalize(worldToEye);',
          '',
          '    vec2 uv = vWorldPos.xz * 50.0;',
          '    vec4 noise = getNoise(uv);',
          '    float dist = length(worldToEye);',
          '    float distortionFactor = max(dist / 100.0, 50.0);',
          '',
          '    vec3 surfaceNormal = normalize(noise.xzy * vec3(2.0, clamp(dist * 0.001, 1.0, 100.0), 2.0));',
          '',
          '    sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuse, specular);',
          '',
          '    vec3 albedo = diffuse + specular;',
          '',
          '    albedo = aerialPerspective(albedo, dist, view_position, -eyeDirection);',
          '',
          '    gl_FragColor = vec4(albedo, 0.95);',
          '}',
        ].join('\n'),
      };
    this.shader = new pc.Shader(e, o);
    var t = new pc.Material();
    (t.blendType = pc.BLEND_NORMAL),
      t.setShader(this.shader),
      t.setParameter('uTime', 0),
      t.setParameter('sunColor', this.getRGB(this.sunColor)),
      t.setParameter('sunDirection', [-1, 0.2, 0]),
      t.setParameter('horizonColor', this.getRGB(this.horizonColor)),
      t.setParameter('zenithColor', this.getRGB(this.zenithColor)),
      t.setParameter('uNormalMap', this.normalMap.resource),
      t.setParameter('uCameraBottom', this.cameraBottom.resource),
      (this.entity.model.model.meshInstances[0].material = t),
      (this.material = t),
      (this.time = 0);
  }),
  (Ocean.prototype.getRGB = function (e) {
    return [e.r, e.g, e.b];
  }),
  (Ocean.prototype.update = function (e) {
    (this.time += e), this.material.setParameter('uTime', this.time);
  });
var Grapple = pc.createScript('grapple');
Grapple.attributes.add('ropeEntity', {
  type: 'entity',
}),
  Grapple.attributes.add('holderEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('grappleEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('originEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('swingEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('swingRopeEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('playerEntity', {
    type: 'entity',
  }),
  Grapple.attributes.add('playerPoint', {
    type: 'entity',
  }),
  Grapple.attributes.add('isPlayerGrapple', {
    type: 'boolean',
    default: !0,
  }),
  Grapple.attributes.add('fixedForce', {
    type: 'number',
    default: 750,
  }),
  Grapple.attributes.add('active', {
    type: 'boolean',
    default: !1,
  }),
  (Grapple.prototype.initialize = function () {
    this.currentPlayerEntity = !1;
  }),
  (Grapple.prototype.onThrow = function (t, e, i) {
    if (
      ((this.currentPlayerEntity = t),
      !1 === e && (e = this.currentPlayerEntity.getPosition().clone()),
      this.currentPlayerEntity &&
        this.currentPlayerEntity.script &&
        this.currentPlayerEntity.script.enemy &&
        ((this.currentPlayerEntity.script.enemy.isGrappling = !0),
        this.currentPlayerEntity.script.enemy.playGrappleAnimation()),
      e.clone().sub(i).length() > 47)
    )
      return !1;
    (this.holderEntity.enabled = !0),
      this.entity.setPosition(e),
      this.entity.lookAt(i),
      this.originEntity.reparent(this.entity),
      this.originEntity.setLocalPosition(0, 0, 0),
      this.ropeEntity.reparent(this.originEntity),
      this.ropeEntity.setLocalPosition(0, 0, 0),
      this.swingEntity.setPosition(i),
      this.swingEntity.setLocalEulerAngles(0, 0, 0),
      this.swingRopeEntity.setLocalScale(1, 1, 1),
      this.scaleRope(e, i),
      setTimeout(
        function (t) {
          t.entity.sound.play('Foley-Start');
        },
        100,
        this
      ),
      setTimeout(
        function (t) {
          t.entity.sound.play('Whip');
        },
        300,
        this
      ),
      (this.active = !0);
  }),
  (Grapple.prototype.scaleRope = function (t, e) {
    var i = e.clone().sub(t).length() / 3.8;
    this.ropeEntity.setLocalScale(0.5, 0.1, 0.5),
      this.ropeEntity
        .tween(this.ropeEntity.getLocalScale())
        .to(
          {
            x: 0.5,
            y: i,
            z: 0.5,
          },
          0.55,
          pc.ElasticOut
        )
        .start(),
      this.grappleEntity.setLocalPosition(0, 0.6, 0),
      this.grappleEntity
        .tween(this.grappleEntity.getLocalPosition())
        .to(
          {
            x: 0,
            y: 3.1 * i,
            z: 0,
          },
          0.55,
          pc.ElasticOut
        )
        .start();
    var n = 3 * Math.random();
    this.grappleEntity.setLocalEulerAngles(85, 50, 30),
      this.grappleEntity
        .tween(this.grappleEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: -n,
          },
          0.5,
          pc.ElasticOut
        )
        .start(),
      setTimeout(
        function (t, e) {
          t.swing(e);
        },
        200,
        this,
        i
      );
  }),
  (Grapple.prototype.swing = function (t) {
    this.entity.sound.play('Zipline'),
      this.originEntity.reparent(this.swingEntity),
      this.originEntity.setLocalPosition(0, 0, 3.8 * t),
      this.ropeEntity.reparent(this.swingRopeEntity),
      this.ropeEntity.setLocalPosition(0, 3.9 * -t, 0),
      this.swingRopeEntity
        .tween(this.swingRopeEntity.getLocalScale())
        .to(
          {
            x: 1,
            y: 0.1,
            z: 1,
          },
          0.5,
          pc.Linear
        )
        .start(),
      setTimeout(
        function (t) {
          t.swingEntity
            .tween(t.swingEntity.getLocalEulerAngles())
            .rotate(
              {
                x: 90,
                y: 0,
                z: 0,
              },
              0.5,
              pc.BackOut
            )
            .start(),
            t.swingRopeEntity
              .tween(t.swingRopeEntity.getLocalScale())
              .to(
                {
                  x: 1,
                  y: 0.2,
                  z: 1,
                },
                0.3,
                pc.BackOut
              )
              .delay(0.05)
              .start();
        },
        300,
        this
      ),
      pc.controls &&
        pc.controls.entity == this.currentPlayerEntity &&
        this.app.fire('Player:SpeedUp', !0),
      setTimeout(
        function (t) {
          (t.active = !1), t.kickForce();
        },
        400,
        this
      );
  }),
  (Grapple.prototype.kickForce = function () {
    var t = this.entity.forward.scale(20);
    this.currentPlayerEntity.rigidbody.applyImpulse(t),
      (this.holderEntity.enabled = !1),
      this.currentPlayerEntity &&
        this.currentPlayerEntity.script &&
        this.currentPlayerEntity.script.enemy &&
        (this.currentPlayerEntity.script.enemy.isGrappling = !1),
      this.entity.sound.play('Foley-Strong');
  }),
  (Grapple.prototype.update = function () {
    if (this.isPlayerGrapple && this.active) {
      var t = this.playerPoint.getPosition().clone();
      if (pc.controls && pc.controls.entity == this.currentPlayerEntity) {
        var e = this.currentPlayerEntity.getPosition().sub(t).normalize().scale(-this.fixedForce);
        this.currentPlayerEntity.rigidbody.applyForce(e);
      } else this.currentPlayerEntity.rigidbody.teleport(t);
    }
  });
var Ccd = pc.createScript('ccd');
Ccd.attributes.add('entities', {
  type: 'entity',
  array: !0,
}),
  Ccd.attributes.add('motionThreshold', {
    type: 'number',
    default: 1,
    title: 'Motion Threshold',
    description: 'Number of meters moved in one frame before CCD is enabled',
  }),
  Ccd.attributes.add('sweptSphereRadius', {
    type: 'number',
    default: 0.2,
    title: 'Swept Sphere Radius',
    description:
      'This should be below the half extent of the collision volume. E.g For an object of dimensions 1 meter, try 0.2',
  }),
  (Ccd.prototype.initialize = function () {
    for (var e in this.entities) {
      var t = this.entities[e].rigidbody.body;
      t &&
        (t.setCcdMotionThreshold(this.motionThreshold),
        t.setCcdSweptSphereRadius(this.sweptSphereRadius));
    }
  });
var ModePosition = pc.createScript('modePosition');
ModePosition.attributes.add('mode', {
  type: 'string',
}),
  ModePosition.attributes.add('position', {
    type: 'vec3',
  }),
  (ModePosition.prototype.initialize = function () {
    this.app.on('Game:Mode', this.setMode, this), this.on('destroy', this.onDestroy);
  }),
  (ModePosition.prototype.onDestroy = function (t) {
    this.app.off('Game:Mode', this.setMode, this);
  }),
  (ModePosition.prototype.setMode = function (t) {
    this.mode == t
      ? this.entity.setLocalPosition(this.position)
      : this.entity.setLocalPosition(0, 0, 0);
  });
var ModeManager = pc.createScript('modeManager');
ModeManager.attributes.add('objects', {
  type: 'entity',
  array: !0,
}),
  ModeManager.attributes.add('garbageEntity', {
    type: 'entity',
  }),
  ModeManager.attributes.add('mapHolder', {
    type: 'entity',
  }),
  ModeManager.attributes.add('teamPoints', {
    type: 'entity',
    array: !0,
  }),
  (ModeManager.prototype.initialize = function () {
    (this.currentMode = 'POINT'),
      (pc.isModeMenuActive = !1),
      (this.mapHolder = this.app.root.findByName('MapHolder')),
      this.app.on('Game:Mode', this.onModeSet, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      this.app.on('Mode:Event', this.onModeEvent, this),
      this.app.on('Mode:AddObject', this.onObjectAdd, this),
      this.app.on('Mode:RemoveObject', this.onObjectRemove, this),
      this.app.on('Mode:AddPoint', this.onAddPoint, this),
      this.app.on('Player:Kill', this.onKill, this),
      this.app.on('Overlay:Weapon', this.triggerWeaponChange, this),
      this.app.on('Player:Leave', this.onLeave, this),
      (this.objectsArray = []),
      (this.variables = {
        kills: 0,
        gungame: {
          weapons: ['Tec-9', 'Shotgun', 'Scar', 'M4', 'Sniper', 'LMG', 'Desert-Eagle', 'Dagger'],
          weaponLevels: {
            'Tec-9': 2,
            Shotgun: 2,
            M4: 3,
            Scar: 3,
            Sniper: 2,
            LMG: 2,
            'Desert-Eagle': 3,
            Dagger: 1,
          },
        },
      }),
      (this.currentWeapon = 'Scar');
  }),
  (ModeManager.prototype.onLeave = function () {
    for (var e = this.objectsArray.length; e--; ) {
      var t = this.objectsArray[e];
      t && t.destroy();
    }
  }),
  (ModeManager.prototype.onAddPoint = function (e, t) {
    var a = 'TeamPointRed';
    for (var o in ('red' == e && (a = 'TeamPointRed'),
    'blue' == e && (a = 'TeamPointBlue'),
    this.teamPoints)) {
      var i = this.teamPoints[o];
      i.name == a && t && ((i.enabled = !0), i.setPosition(new pc.Vec3(t.x, t.y, t.z)));
    }
  }),
  (ModeManager.prototype.getObjectByName = function (e) {
    var t = !1;
    for (var a in this.objects) {
      var o = this.objects[a];
      o.name == e && (t = o);
    }
    return t;
  }),
  (ModeManager.prototype.onObjectAdd = function (e) {
    if (!this.mapHolder) return !1;
    var t = this.getObjectByName(e.type);
    if (null !== t) {
      var a = t.clone();
      (a.id = e.id),
        (a.type = e.type),
        a.setPosition(e.position.x, e.position.y, e.position.z),
        (a.enabled = !0),
        this._onObjectAdd(a),
        this.mapHolder.addChild(a),
        this.objectsArray.push(a);
    }
  }),
  (ModeManager.prototype._onObjectAdd = function (e) {
    if ('TeamFlagBlue' == e.type || 'TeamFlagRed' == e.type) {
      var t = pc.colors.redTeam;
      'TeamFlagRed' == e.type && (t = pc.colors.redTeam),
        'TeamFlagBlue' == e.type && (t = pc.colors.blueTeam),
        this.app.fire('Overlay:WorldToScreen', e, {
          color: t,
        });
    }
  }),
  (ModeManager.prototype.onObjectRemove = function (e) {
    for (var t = this.objectsArray.length, a = !1; t--; ) {
      var o = this.objectsArray[t];
      o.id == e && (this._onObjectRemove(o), o.destroy(), this.objectsArray.splice(t, 1), (a = t));
    }
    return a;
  }),
  (ModeManager.prototype._onObjectRemove = function (e) {
    var t = e.getPosition();
    ('BlackCoin' != e.type && 'TeamPointBlue' != e.type && 'TeamPointRed' != e.type) ||
      (this.app.fire('EffectManager:CustomSound', 'Coin', 1, t),
      this.app.fire('EffectManager:CustomSound', 'Spell-1', 1, t)),
      'HealthPack' == e.type &&
        (this.app.fire('EffectManager:CustomSound', 'Spell-1', 1, t),
        this.app.fire('EffectManager:CustomSound', 'Potion-Pickup', 1, t));
  }),
  (ModeManager.prototype.onModeSet = function (e, t, a) {
    (this.currentMode = e), (this.currentModeOptions = a), (this.variables.kills = 0);
  }),
  (ModeManager.prototype.onMapLoaded = function () {}),
  (ModeManager.prototype.onModeEvent = function (e) {
    ('PAYLOAD' != this.currentMode && 'TDM' != this.currentMode) ||
      ('ShowTeamSelection' == e &&
        ((pc.isModeMenuActive = !0),
        this.app.fire('Overlay:Pause', !0),
        this.app.fire('View:Pause', 'Team')));
  }),
  (ModeManager.prototype.onKill = function (e, t) {
    this.variables.kills++,
      'GUNGAME' == this.currentMode &&
        (t.indexOf('Rank') > -1 && (this.variables.kills = 0),
        this.app.fire(
          'Overlay:WeaponText',
          this.variables.kills + ' / ' + this.variables.gungame.weaponLevels[this.currentWeapon]
        ));
  }),
  (ModeManager.prototype.triggerWeaponChange = function (e) {
    if ('GUNGAME' == this.currentMode) {
      var t = this.variables.gungame.weapons.indexOf(this.currentWeapon),
        a = this.variables.gungame.weapons.indexOf(e),
        o = this.variables.gungame.weapons[a + 1],
        i = this.variables.gungame.weapons[a + 2];
      t > a && (this.variables.kills = 0),
        this.app.fire('Overlay:OtherIcons', o, i),
        this.app.fire(
          'Overlay:WeaponText',
          this.variables.kills + ' / ' + this.variables.gungame.weaponLevels[e]
        );
    }
    this.currentWeapon = e;
  });
var Jsontrigger = pc.createScript('jsontrigger');
Jsontrigger.attributes.add('data', {
  type: 'string',
}),
  Jsontrigger.attributes.add('triggerFunction', {
    type: 'string',
  }),
  (Jsontrigger.prototype.initialize = function () {
    this.triggerFunction && this.app.fire(this.triggerFunction, JSON.parse(this.data));
  });
var MouseInput = pc.createScript('mouseInput');
MouseInput.attributes.add('orbitSensitivity', {
  type: 'number',
  default: 0.3,
  title: 'Orbit Sensitivity',
  description: 'How fast the camera moves around the orbit. Higher is faster',
}),
  MouseInput.attributes.add('distanceSensitivity', {
    type: 'number',
    default: 0.15,
    title: 'Distance Sensitivity',
    description: 'How fast the camera moves in and out. Higher is faster',
  }),
  (MouseInput.prototype.initialize = function () {
    if (((this.orbitCamera = this.entity.script.orbitCamera), this.orbitCamera)) {
      var t = this,
        onMouseOut = function (o) {
          t.onMouseOut(o);
        };
      this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this),
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this),
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
        this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
        window.addEventListener('mouseout', onMouseOut, !1),
        this.on('destroy', function () {
          this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this),
            this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this),
            this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
            this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
            window.removeEventListener('mouseout', onMouseOut, !1);
        });
    }
    this.app.mouse.disableContextMenu(),
      (this.lookButtonDown = !1),
      (this.panButtonDown = !1),
      (this.lastPoint = new pc.Vec2());
  }),
  (MouseInput.fromWorldPoint = new pc.Vec3()),
  (MouseInput.toWorldPoint = new pc.Vec3()),
  (MouseInput.worldDiff = new pc.Vec3()),
  (MouseInput.prototype.pan = function (t) {
    var o = MouseInput.fromWorldPoint,
      e = MouseInput.toWorldPoint,
      i = MouseInput.worldDiff,
      s = this.entity.camera,
      n = this.orbitCamera.distance;
    s.screenToWorld(t.x, t.y, n, o),
      s.screenToWorld(this.lastPoint.x, this.lastPoint.y, n, e),
      i.sub2(e, o),
      this.orbitCamera.pivotPoint.add(i);
  }),
  (MouseInput.prototype.onMouseDown = function (t) {
    switch (t.button) {
      case pc.MOUSEBUTTON_LEFT:
        this.lookButtonDown = !0;
        break;
      case pc.MOUSEBUTTON_MIDDLE:
      case pc.MOUSEBUTTON_RIGHT:
        this.panButtonDown = !0;
    }
  }),
  (MouseInput.prototype.onMouseUp = function (t) {
    switch (t.button) {
      case pc.MOUSEBUTTON_LEFT:
        this.lookButtonDown = !1;
        break;
      case pc.MOUSEBUTTON_MIDDLE:
      case pc.MOUSEBUTTON_RIGHT:
        this.panButtonDown = !1;
    }
  }),
  (MouseInput.prototype.onMouseMove = function (t) {
    pc.app.mouse;
    this.lookButtonDown
      ? ((this.orbitCamera.pitch -= t.dy * this.orbitSensitivity),
        (this.orbitCamera.yaw -= t.dx * this.orbitSensitivity))
      : this.panButtonDown && this.pan(t),
      this.lastPoint.set(t.x, t.y);
  }),
  (MouseInput.prototype.onMouseWheel = function (t) {
    (this.orbitCamera.distance -=
      t.wheel * this.distanceSensitivity * (0.1 * this.orbitCamera.distance)),
      t.event.preventDefault();
  }),
  (MouseInput.prototype.onMouseOut = function (t) {
    (this.lookButtonDown = !1), (this.panButtonDown = !1);
  });
var ContainerWrapper = pc.createScript('containerWrapper');
ContainerWrapper.attributes.add('padding', {
  type: 'number',
  default: 0,
}),
  (ContainerWrapper.prototype.initialize = function () {
    var e = 0;
    for (var t in this.entity.children) {
      var i = this.entity.children[t],
        n = i.getLocalPosition();
      i.element && (e = Math.min(i.element.height - n.y));
    }
    this.entity.element.height = e + this.padding;
  });
var CustomSkin = pc.createScript('customSkin');
CustomSkin.attributes.add('key', {
  type: 'string',
}),
  (CustomSkin.prototype.initialize = function () {
    this.isModelLoaded = !1;
    var t = this;
    this.entity.model.ready(function () {
      t.isModelLoaded = !0;
    }),
      this.app.on('CustomSkin:Set', this.setCustomSkin, this),
      this.entity.on('CustomSkin:Set', this.setCustomSkin, this);
  }),
  (CustomSkin.prototype.setCustomSkin = function (t, e) {
    if (!this.isModelLoaded)
      return (
        setTimeout(
          function (i) {
            i.setCustomSkin(t, e);
          },
          500,
          this
        ),
        !1
      );
    this.clearTemplate();
    var i = this,
      s = '' != this.key ? t[this.key] : t;
    t && t.emission;
    s && s.search && s.search('Template-') > -1
      ? this.setTemplate(s)
      : s && s.search && (s.search('Model-') > -1 || s.search('glb') > -1)
      ? this.setModelSkin(s)
      : s && s.search && (s.search('Animated-') > -1 || s.search('mp4') > -1)
      ? this.setSkin(this.entity, t[this.key], !0)
      : this.setCustomImage(t, function (t) {
          i.setSkin(i.entity, t);
        });
  }),
  (CustomSkin.prototype.loadEmissionSkin = function (t) {
    var e = this,
      i = new pc.Texture(this.app.graphicsDevice, {
        mipmaps: !1,
      });
    (i.minFilter = pc.FILTER_LINEAR),
      (i.magFilter = pc.FILTER_LINEAR),
      (i.addressU = pc.ADDRESS_REPEAT),
      (i.addressV = pc.ADDRESS_REPEAT);
    var s = document.createElement('img');
    (s.src = Utils.prefixCDN + t),
      (s.crossOrigin = 'anonymous'),
      s.addEventListener('load', function (t) {
        i.setSource(s), e.setEmissionSkin(i);
      });
  }),
  (CustomSkin.prototype.setEmissionSkin = function (t) {
    var e = this.entity.model.meshInstances[0].material;
    t && (e.emissiveMap = t);
  }),
  (CustomSkin.prototype.setDefaultModelSkin = function () {
    this.entity.model.defaultAsset && (this.entity.model.asset = this.entity.model.defaultAsset);
  }),
  (CustomSkin.prototype.getTemplate = function (t) {
    var e = !1,
      i = this.app.assets.findAll(t);
    for (var s in i) {
      var n = i[s];
      'template' == n.type && (e = n);
    }
    return e;
  }),
  (CustomSkin.prototype.clearTemplate = function () {
    this.entity.currentTemplate && this.entity.currentTemplate.destroy(),
      (this.entity.model.enabled = !0);
  }),
  (CustomSkin.prototype.setTemplate = function (t) {
    if (!t) return !1;
    var e = this,
      i = this.getTemplate(t);
    i &&
      (i.ready(function (t) {
        var i = t.resource.instantiate();
        (e.entity.currentTemplate = i),
          e.entity.addChild(i),
          (e.entity.model.enabled = !1),
          pc.app.fire('CustomSkin:Loaded', !0);
      }),
      this.app.assets.load(i));
  }),
  (CustomSkin.prototype.setModelSkin = function (t) {
    this.entity.model.defaultAsset || (this.entity.model.defaultAsset = this.entity.model.asset),
      (this.entity.model.asset = this.app.assets.find(t).id),
      setTimeout(function () {
        pc.app.fire('CustomSkin:Loaded', !0);
      }, 1e3);
  }),
  (CustomSkin.prototype.setCustomImage = function (t, e) {
    var i = t;
    if ((t[this.key] && (i = t[this.key]), this.key && !t[this.key])) return !1;
    if (!i) return !1;
    var s = new pc.Texture(this.app.graphicsDevice, {
      mipmaps: !1,
    });
    (s.minFilter = pc.FILTER_LINEAR),
      (s.magFilter = pc.FILTER_LINEAR),
      (s.addressU = pc.ADDRESS_REPEAT),
      (s.addressV = pc.ADDRESS_REPEAT),
      console.log(this.key, t, i, Utils.prefixCDN + i);
    var n = document.createElement('img');
    (n.src = Utils.prefixCDN + i),
      (n.crossOrigin = 'anonymous'),
      n.addEventListener('load', function (t) {
        s.setSource(n), pc.app.fire('CustomSkin:Loaded', !0), e(s);
      });
  }),
  (CustomSkin.prototype.createAnimatedSkin = function (t) {
    var e = this.app,
      i = new pc.Texture(e.graphicsDevice, {
        format: pc.PIXELFORMAT_R5_G6_B5,
        autoMipmap: !1,
      });
    (i.minFilter = pc.FILTER_LINEAR),
      (i.magFilter = pc.FILTER_LINEAR),
      (i.addressU = pc.ADDRESS_CLAMP_TO_EDGE),
      (i.addressV = pc.ADDRESS_CLAMP_TO_EDGE);
    var s = document.createElement('video');
    return (
      s.addEventListener('canplay', function (t) {
        i.setSource(s), pc.app.fire('CustomSkin:Loaded', !0);
      }),
      s.setAttribute('webkit-playsinline', 'webkit-playsinline'),
      (s.muted = !0),
      (s.src = Utils.prefixCDN + t),
      (s.crossOrigin = 'anonymous'),
      (s.loop = !0),
      s.play(),
      (this.isAnimatedSkin = !0),
      (this.videoTexture = i),
      i
    );
  }),
  (CustomSkin.prototype.setSkin = function (t, e, i) {
    var s = t.model.material.clone();
    if (
      (this.setDefaultModelSkin(),
      i
        ? ((e = this.createAnimatedSkin(e)), (s.diffuseMap = e), s.update())
        : ((s.diffuseMap = e), s.update()),
      t && t.model && t.model.meshInstances)
    )
      for (var n = t.model.meshInstances, o = 0; o < n.length; ++o) {
        n[o].material = s;
      }
    pc.app.fire('CustomSkin:Loaded', !0);
  }),
  (CustomSkin.prototype.update = function (t) {
    this.isAnimatedSkin && this.videoTexture && this.videoTexture.upload();
  });
var InitTrigger = pc.createScript('initTrigger');
InitTrigger.attributes.add('triggerFunction', {
  type: 'string',
}),
  InitTrigger.attributes.add('dynamicVariable', {
    type: 'string',
  }),
  (InitTrigger.prototype.initialize = function () {
    this.onState(!0), this.on('state', this.onState, this);
  }),
  (InitTrigger.prototype.preprocess = function (string) {
    var functionString = string,
      variables = string.match(/\$(.*?) /g)[0];
    for (var index in variables) {
      var dynamicVariable = variables[index];
      functionString = functionString.replace(
        dynamicVariable,
        eval(dynamicVariable.replace('$', ''))
      );
    }
    return JSON.parse(functionString);
  }),
  (InitTrigger.prototype.onState = function (i) {
    if (!0 === i && this.triggerFunction) {
      var t = this.triggerFunction.split(', ');
      if (t.length > 0)
        for (var r in t) {
          var n = t[r].split('@'),
            e = n[0];
          if (n.length > 1) {
            var a = n[1];
            this.dynamicVariable
              ? this.app.fire(e, this.preprocess(this.dynamicVariable))
              : this.app.fire(e, a);
          } else this.app.fire(e);
        }
    }
  });
var PlayerAbilities = pc.createScript('playerAbilities');
PlayerAbilities.attributes.add('meleeCenter', {
  type: 'entity',
}),
  PlayerAbilities.attributes.add('meleeOrigin', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('shoulderEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('throwPoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('throwHandPoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('weaponCenter', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('armRightOrigin', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('handEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('armEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('angleEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('meleePoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('meleePoints', {
    type: 'entity',
    array: !0,
  }),
  PlayerAbilities.attributes.add('shurikenPoint1', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('shurikenPoint2', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('shurikenPoint3', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('footPoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('hammerEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('katanaEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('grappleEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('wandEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('effectManagerEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('lookPoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('groundPlacePoint', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('hookIcon', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('screenEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('testBox', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('inspectEntity', {
    type: 'entity',
  }),
  PlayerAbilities.attributes.add('inspectMaterial', {
    type: 'asset',
    assetType: 'material',
  }),
  PlayerAbilities.attributes.add('garbageEntity', {
    type: 'entity',
  }),
  (PlayerAbilities.prototype.initialize = function () {
    (this.isDashing = !1),
      (this.isThrowing = !1),
      (this.isHitting = 0),
      (this.isGrappling = !1),
      (this.resetKeyE = !1),
      (this.resetKeyF = !1),
      (this.hittingTime = 0.7),
      (this.throwCooldown = 5),
      (this.dashCooldown = 10),
      (this.animation = {
        inspectOpacity: 0,
      }),
      (this.player = this.entity.script.player),
      (this.movement = this.entity.script.movement),
      (this.character = this.player.characterName),
      (this.effectManager = this.effectManagerEntity.script.effectManager),
      (this.grappleEntities = []),
      (this.timestamp = this.movement.timestamp),
      (this.lastThrowDate = this.now() - 5e3),
      (this.lastDashDate = this.now() - 5e3),
      (this.lastHookIndicatorTime = Date.now()),
      (this.lastAttentionDate = Date.now()),
      (this.lastHookPoint = new pc.Vec3(0, 0, 0)),
      (this.lastDirectionVector = new pc.Vec3(0, 0, 0)),
      this.app.on('Player:Character', this.onCharacterSet, this),
      this.app.on('Map:Loaded', this.onMapLoaded, this),
      (this.inspectEntities = []),
      this.createInspectBatch();
  }),
  (PlayerAbilities.prototype.onCharacterSet = function (t) {
    var e = this.meleeCenter.findByTag('Melee');
    for (var i in e) {
      e[i].enabled = !1;
    }
    'Lilium' == t
      ? ((this.hittingTime = 0.7), (this.hammerEntity.enabled = !0), (this.throwCooldown = 10))
      : 'Shin' == t
      ? ((this.hittingTime = 0.7),
        (this.katanaEntity.enabled = !0),
        (this.throwCooldown = 5),
        (this.dashCooldown = 10))
      : 'Echo' == t
      ? ((this.hittingTime = 0.7),
        (this.grappleEntity.enabled = !0),
        (this.throwCooldown = 3),
        (this.dashCooldown = 5))
      : 'Kulu' == t && ((this.hittingTime = 1), (this.throwCooldown = 7), (this.dashCooldown = 7)),
      (this.character = t),
      this.hideMelee();
  }),
  (PlayerAbilities.prototype.onMapLoaded = function () {
    'Echo' == this.character && (this.grappleEntities = this.app.root.findByTag('Grapple'));
  }),
  (PlayerAbilities.prototype.triggerKeyF = function () {
    'Lilium' == this.character
      ? this.throwGrenadeAnimation()
      : 'Shin' == this.character
      ? this.throwShurikenAnimation()
      : 'Echo' == this.character
      ? this.throwAxeAnimation()
      : 'Kulu' == this.character && this.throwTotemAnimation(),
      (this.resetKeyF = !1);
  }),
  (PlayerAbilities.prototype.triggerKeyE = function () {
    'Lilium' == this.character
      ? this.triggerAxeMelee()
      : 'Shin' == this.character
      ? this.triggerDash()
      : 'Echo' == this.character
      ? this.triggerGrapple()
      : 'Kulu' == this.character && this.triggerSmash(),
      (this.resetKeyE = !1);
  }),
  (PlayerAbilities.prototype.throwTotemAnimation = function () {
    var t = this.groundPlacePoint.getPosition().clone(),
      e = t.clone().add(Utils.nullVector);
    new pc.Vec3(0, 0, 0);
    this.movement.setShootDirection();
    var i = this.effectManager.testRaycast(t, e),
      s = this.effectManager.testRaycast(this.movement.raycastShootFrom, this.movement.raycastTo);
    s && i.distance > s.distance
      ? this.app.fire('Network:Place', 'Totem', s.point)
      : this.app.fire('Network:Place', 'Totem', i.point),
      this.app.fire('Player:Speak', 'Throw', 1),
      this.app.fire('Overlay:SkillTimer', this.throwCooldown);
  }),
  (PlayerAbilities.prototype.triggerSmash = function () {
    if (Date.now() - this.lastDashDate < 1e3 * this.dashCooldown && !this.resetKeyE)
      return this.app.fire('Overlay:Attention', 'Melee'), !1;
    this.shoulderEntity
      .tween(this.shoulderEntity.getLocalEulerAngles())
      .rotate(
        {
          x: 171.75,
          y: 72.79,
          z: 162.1,
        },
        0.1,
        pc.SineOut
      )
      .start(),
      this.shoulderEntity
        .tween(this.shoulderEntity.getLocalPosition())
        .to(
          {
            x: -0.37,
            y: -0.311,
            z: -0.675,
          },
          0.1,
          pc.BackOut
        )
        .start(),
      setTimeout(
        function (t) {
          (t.wandEntity.enabled = !0),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalPosition())
              .to(
                {
                  x: -0.37,
                  y: 0.266,
                  z: -0.675,
                },
                0.1,
                pc.BackOut
              )
              .start(),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalEulerAngles())
              .rotate(
                {
                  x: 85.1,
                  y: 33.08,
                  z: 134.29,
                },
                0.1,
                pc.BackOut
              )
              .start();
        },
        200,
        this
      ),
      this.armRightOrigin
        .tween(this.armRightOrigin.getLocalEulerAngles())
        .rotate(
          {
            x: 0,
            y: 0,
            z: -90,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.shoulderEntity
            .tween(t.shoulderEntity.getLocalPosition())
            .to(
              {
                x: -0.37,
                y: -0.599,
                z: -0.675,
              },
              0.2,
              pc.BackOut
            )
            .start(),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalEulerAngles())
              .rotate(
                {
                  x: 85.1,
                  y: 33.08,
                  z: 56.2,
                },
                0.15,
                pc.BackOut
              )
              .start();
        },
        400,
        this
      ),
      setTimeout(
        function (t) {
          t.setCrack();
        },
        500,
        this
      ),
      (this.isHitting = this.timestamp + this.hittingTime),
      (this.lastDashDate = Date.now()),
      this.app.fire('Player:Speak', 'Attack', 1);
  }),
  (PlayerAbilities.prototype.setCrack = function () {
    var t = this.footPoint.getPosition().clone(),
      e = t.clone().add(Utils.nullVector),
      i = this.app.systems.rigidbody.raycastFirst(t, e);
    if (null !== i && -1 === i.entity.tags.list().indexOf('Wood')) {
      var s = new pc.Vec3(0, this.movement.lookX, 0);
      this.app.fire('EffectManager:Crack', i.point, s),
        this.app.fire('Network:Throw', 'Crack', i.point, s),
        this.entity.sound.play('Throw'),
        this.app.fire('Overlay:MeleeTimer', this.dashCooldown),
        this.movement.slowMovement(0.1);
    }
    setTimeout(
      function (t) {
        t.shoulderEntity
          .tween(t.shoulderEntity.getLocalEulerAngles())
          .rotate(
            {
              x: 126.1,
              y: 45.79,
              z: 161.27,
            },
            0.4,
            pc.BackOut
          )
          .start(),
          t.movement.fastMovement();
      },
      700,
      this
    ),
      setTimeout(
        function (t) {
          (t.wandEntity.enabled = !1),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalEulerAngles())
              .rotate(
                {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                0.3,
                pc.BackOut
              )
              .start(),
            t.armRightOrigin
              .tween(t.armRightOrigin.getLocalEulerAngles())
              .rotate(
                {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                0.3,
                pc.SineOut
              )
              .start(),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalPosition())
              .to(
                {
                  x: -0.379,
                  y: -0.297,
                  z: -0.345,
                },
                0.2,
                pc.SineOut
              )
              .start();
        },
        900,
        this
      );
  }),
  (PlayerAbilities.prototype.showMelee = function () {
    (this.meleeCenter.enabled = !0),
      this.meleeCenter
        .tween(this.meleeCenter.getLocalPosition())
        .to(
          {
            y: -0.246,
          },
          0.2,
          pc.BackOut
        )
        .start();
  }),
  (PlayerAbilities.prototype.hideMelee = function () {
    this.meleeCenter
      .tween(this.meleeCenter.getLocalPosition())
      .to(
        {
          y: -1.5,
        },
        0.15,
        pc.BackOut
      )
      .start(),
      setTimeout(
        function (t) {
          t.meleeCenter.enabled = !1;
        },
        150,
        this
      );
  }),
  (PlayerAbilities.prototype.triggerAxeMelee = function () {
    if (this.isHitting > this.timestamp) return !1;
    this.hideWeapons(),
      this.showMelee(),
      this.meleeHit(),
      (this.isHitting = this.timestamp + this.hittingTime),
      this.player.fireNetworkEvent('m'),
      this.player.melee();
  }),
  (PlayerAbilities.prototype.meleeHit = function () {
    this.meleeOrigin.setLocalPosition(-1.341, -2.65, -3.462),
      this.meleeOrigin
        .tween(this.meleeOrigin.getLocalPosition())
        .to(
          {
            y: 0.67,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      this.movement.playEffortSound(),
      Math.random() > 0.5
        ? (this.meleeOrigin.setLocalEulerAngles(66.97, -17.07, 29.54),
          this.meleeOrigin
            .tween(this.meleeOrigin.getLocalEulerAngles())
            .rotate(
              {
                x: -20.32,
                y: 40.6,
                z: -108.25,
              },
              0.25,
              pc.BackOut
            )
            .delay(0.2)
            .start())
        : (this.meleeOrigin.setLocalEulerAngles(-42.45, -13.74, 21.08),
          this.meleeOrigin
            .tween(this.meleeOrigin.getLocalEulerAngles())
            .rotate(
              {
                x: 37.81,
                y: -38.75,
                z: -130.44,
              },
              0.25,
              pc.BackOut
            )
            .delay(0.2)
            .start()),
      setTimeout(
        function (t) {
          t.meleeTrigger(),
            t.entity.sound.play('Throw'),
            t.app
              .tween(t.movement.animation)
              .to(
                {
                  cameraImpact: -3,
                },
                0.1,
                pc.BackOut
              )
              .start();
        },
        200,
        this
      ),
      setTimeout(
        function (t) {
          t.showWeapons(), t.hideMelee();
        },
        500,
        this
      );
  }),
  (PlayerAbilities.prototype.meleeTrigger = function (t) {
    this.movement.setShootDirection();
    var e = this.movement.raycastShootFrom,
      i = this.meleePoint.getPosition().clone(),
      s = Math.round(20 * Math.random()) + 80;
    t > 0 && (s = t),
      this.app.fire('EffectManager:Hit', 'Melee', e, i, this.player.playerId, s, this.meleePoints);
  }),
  (PlayerAbilities.prototype.throwTrigger = function (t) {
    this.movement.setShootDirection();
    var e = this.effectManager.testRaycast(this.movement.raycastShootFrom, this.movement.raycastTo);
    e && e.distance < 12
      ? this.app.fire('Network:Place', t.entity.name, e.point)
      : this.app.fire('Network:Place', t.entity.name, this.groundPlacePoint.getPosition().clone());
  }),
  (PlayerAbilities.prototype.hideWeapons = function () {
    this.weaponCenter
      .tween(this.weaponCenter.getLocalPosition())
      .to(
        {
          y: -1.5,
        },
        0.15,
        pc.BackOut
      )
      .start();
  }),
  (PlayerAbilities.prototype.showWeapons = function () {
    this.weaponCenter
      .tween(this.weaponCenter.getLocalPosition())
      .to(
        {
          y: -0.058,
        },
        0.2,
        pc.BackOut
      )
      .start();
  }),
  (PlayerAbilities.prototype.createInspectBatch = function () {
    for (var t = 0; t < 7; t++) {
      var e = this.inspectEntity.clone();
      e.setPosition(Utils.nullVector),
        (e.enabled = !0),
        this.inspectEntities.push(e),
        this.garbageEntity.addChild(e);
    }
  }),
  (PlayerAbilities.prototype.showGrappleIndicators = function () {
    if (Date.now() - this.lastAttentionDate < 200) return !1;
    var t = 0,
      e = this.lookPoint.getPosition();
    for (var i in this.grappleEntities) {
      var s = this.grappleEntities[i];
      s.getPosition().clone().sub(e).length() < 50 &&
        this.inspectEntities[t] &&
        ((this.inspectEntities[t].enabled = !0),
        this.inspectEntities[t].setPosition(s.getPosition().clone()),
        this.inspectEntities[t].setRotation(s.getRotation().clone()),
        this.inspectEntities[t].setLocalScale(s.collision.halfExtents.clone().scale(2.1)),
        t++);
    }
    this.attentionInspect(), (this.lastAttentionDate = Date.now());
  }),
  (PlayerAbilities.prototype.attentionInspect = function () {
    (this.animation.inspectOpacity = 1),
      (this.inspectMaterial.resource.opacity = 1),
      this.inspectMaterial.resource.update();
    var t = this.app.tween(this.animation).to(
        {
          inspectOpacity: 0,
        },
        0.2,
        pc.Linear
      ),
      e = this;
    t.on('update', function (t) {
      (e.inspectMaterial.resource.opacity = e.animation.inspectOpacity),
        e.inspectMaterial.resource.update();
    }),
      t.start(),
      this.entity.sound.play('Attention-Echo');
  }),
  (PlayerAbilities.prototype.triggerGrapple = function () {
    if (Date.now() - this.lastDashDate < 1e3 * this.dashCooldown && !this.resetKeyE)
      return this.app.fire('Overlay:Attention', 'Melee'), !1;
    if (this.isGrappling) return !1;
    if (!this.movement.isLanded) return !1;
    var t = this,
      e = this.throwPoint.getPosition().clone(),
      i = this.throwPoint.forward.scale(110),
      s = this.effectManager.testRaycast(e, i.clone().add(e));
    return s
      ? (s && s.distance > 47) || (s && s.entity && -1 === s.entity.tags.list().indexOf('Grapple'))
        ? (this.showGrappleIndicators(), !1)
        : (this.player.fireNetworkEvent('grapple'),
          (this.isGrappling = !0),
          (this.lastDirectionVector = i.clone()),
          (this.inspectEntity.enabled = !1),
          this.throwAnimation(
            function () {
              t.movement.setCameraMovementLock(!0), t.hookGrapple();
            },
            !0,
            200
          ),
          this.app.fire('Overlay:MeleeTimer', 5),
          void (this.lastDashDate = Date.now()))
      : (this.showGrappleIndicators(), !1);
  }),
  (PlayerAbilities.prototype.hookGrapple = function () {
    this.app.fire(
      'EffectManager:Grapple',
      this.entity,
      this.throwPoint.getPosition().clone(),
      this.lastDirectionVector,
      this.player.playerId,
      this.player.cards.length > 0
    ),
      this.app.fire(
        'Network:Throw',
        'Grapple',
        this.throwPoint.getPosition().clone(),
        this.lastDirectionVector
      ),
      this.app
        .tween(this.movement.animation)
        .to(
          {
            takeX: 0,
            takeY: 0,
            takeZ: 0,
          },
          0.2,
          pc.BackInOut
        )
        .start(),
      this.hideWeapons(),
      this.entity.sound.play('Whoosh-High'),
      (this.entity.sound.slots['Whoosh-High'].pitch = 1 + 0.2 * Math.random()),
      setTimeout(
        function (t) {
          t.showMelee(),
            t.app.fire('Effect:Trigger', 'Wind', 500),
            t.entity.sound.play('Buff-Attack');
        },
        500,
        this
      ),
      setTimeout(
        function (t) {
          t.hideMelee(), (t.isGrappling = !1), t.movement.setCameraMovementLock(!1);
        },
        800,
        this
      ),
      setTimeout(
        function (t) {
          t.showWeapons();
        },
        1e3,
        this
      );
  }),
  (PlayerAbilities.prototype.throwAxe = function () {
    if (this.isGrappling) return !1;
    var t = this.throwPoint.forward.scale(110);
    this.app.fire(
      'EffectManager:Axe',
      this.throwPoint.getPosition().clone(),
      t,
      this.player.playerId,
      this.player.cards.length > 0
    ),
      this.app.fire('Network:Throw', 'Axe', this.throwPoint.getPosition().clone(), t),
      this.entity.sound.play('Throw'),
      this.app.fire('Overlay:SkillTimer', this.throwCooldown);
  }),
  (PlayerAbilities.prototype.throwGrenade = function () {
    this.app.fire(
      'EffectManager:Throw',
      'Grenade',
      this.throwHandPoint.getPosition().clone(),
      this.throwHandPoint.forward,
      this.player.playerId,
      this.player.cards.length > 0
    ),
      this.app.fire(
        'Network:Throw',
        'Grenade',
        this.throwHandPoint.getPosition().clone(),
        this.throwHandPoint.forward
      ),
      this.entity.sound.play('Throw'),
      this.app.fire('Overlay:SkillTimer', this.throwCooldown);
  }),
  (PlayerAbilities.prototype.triggerDash = function () {
    if (Date.now() - this.lastDashDate < 1e3 * this.dashCooldown && !this.resetKeyE)
      return this.entity.sound.play('Error'), !1;
    if (!this.movement.isLanded) return !1;
    var t = this.angleEntity.forward.scale(110);
    (this.isDashing = !0),
      this.showMelee(),
      this.hideWeapons(),
      this.entity.rigidbody.applyImpulse(t),
      this.player.melee(),
      this.app.fire('Effect:Trigger', 'Wind'),
      this.app.fire('Overlay:MeleeTimer', 10),
      this.player.fireNetworkEvent('dash'),
      this.entity.sound.play('Buff-Attack'),
      this.entity.sound.play('Whoosh-High'),
      (this.entity.sound.slots['Whoosh-High'].pitch = 1 + 0.2 * Math.random()),
      this.app
        .tween(this.movement.animation)
        .to(
          {
            fov: 10,
          },
          0.2,
          pc.BackOut
        )
        .start(),
      this.meleeOrigin.setLocalEulerAngles(106.08, 39.04, 48.43),
      this.meleeOrigin
        .tween(this.meleeOrigin.getLocalEulerAngles())
        .rotate(
          {
            x: 48.79,
            y: -44.81,
            z: 34.89,
          },
          0.25,
          pc.BackOut
        )
        .delay(0.08)
        .start(),
      setTimeout(
        function (t) {
          (t.isDashing = !1), t.showWeapons(), t.hideMelee();
        },
        200,
        this
      ),
      (this.isHitting = this.timestamp + this.hittingTime),
      (this.lastDashDate = Date.now());
  }),
  (PlayerAbilities.prototype.triggerDashDamage = function (t) {
    var e = Math.round(20 * Math.random()) + 30,
      i = {
        entity: t.other,
        normal: t.contacts[0].normal,
        point: t.contacts[0].point,
      };
    this.app.fire('EffectManager:DealHit', 'Dash', i, e, this.player.playerId, !1);
  }),
  (PlayerAbilities.prototype.triggerGrappleDamage = function (t) {
    var e = Math.round(20 * Math.random()) + 40,
      i = {
        entity: t.other,
        normal: t.contacts[0].normal,
        point: t.contacts[0].point,
      };
    this.app.fire('EffectManager:DealHit', 'Grapple', i, e, this.player.playerId, !1);
  }),
  (PlayerAbilities.prototype._throwShuriken = function () {
    this.movement.setShootDirection(),
      this.entity.sound.play('Whoosh-High'),
      (this.entity.sound.slots['Whoosh-High'].pitch = 1 + 0.2 * Math.random()),
      this.app.fire(
        'EffectManager:Shuriken',
        this.throwHandPoint.getPosition(),
        [
          this.shurikenPoint1.getPosition(),
          this.shurikenPoint2.getPosition(),
          this.shurikenPoint3.getPosition(),
        ],
        this.player.playerId
      ),
      this.app.fire('Network:Throw', 'Shuriken', this.throwHandPoint.getPosition(), [
        this.shurikenPoint1.getPosition(),
        this.shurikenPoint2.getPosition(),
        this.shurikenPoint3.getPosition(),
      ]);
  }),
  (PlayerAbilities.prototype.throwShuriken = function () {
    for (var t = 0; t < 3; t++)
      setTimeout(
        function (t) {
          t._throwShuriken();
        },
        90 * t,
        this
      );
    this.app.fire('Overlay:SkillTimer', this.throwCooldown);
  }),
  (PlayerAbilities.prototype.throwShurikenAnimation = function () {
    var t = this;
    this.throwAnimation(
      function () {
        t.throwShuriken();
      },
      !1,
      150
    );
  }),
  (PlayerAbilities.prototype.throwGrenadeAnimation = function () {
    var t = this;
    this.throwAnimation(function () {
      t.throwGrenade();
    }, !0);
  }),
  (PlayerAbilities.prototype.throwAxeAnimation = function () {
    var t = this;
    this.throwAnimation(
      function () {
        t.throwAxe();
      },
      !0,
      200
    );
  }),
  (PlayerAbilities.prototype.throwAnimation = function (t, e, i, s) {
    var n = 400;
    i && i > 0 && (n = i),
      this.shoulderEntity
        .tween(this.shoulderEntity.getLocalEulerAngles())
        .rotate(
          {
            x: 42.75,
            y: 30.65,
            z: -57.65,
          },
          n / 1e3,
          pc.SineOut
        )
        .start(),
      this.shoulderEntity.reparent(this.handEntity),
      this.app
        .tween(this.movement.animation)
        .to(
          {
            takeX: -0.52,
            takeY: 22.19,
            takeZ: -55.11,
          },
          n / 2500,
          pc.BackInOut
        )
        .start(),
      setTimeout(
        function (t) {
          t.shoulderEntity
            .tween(t.shoulderEntity.getLocalEulerAngles())
            .rotate(
              {
                x: 147.77,
                y: 3.9,
                z: 138.54,
              },
              n / 2e3,
              pc.Linear
            )
            .start();
        },
        n / 2,
        this
      ),
      setTimeout(
        function (i) {
          i.movement.playEffortSound(s),
            i.shoulderEntity
              .tween(i.shoulderEntity.getLocalEulerAngles())
              .rotate(
                {
                  x: 113.4,
                  y: -9.2,
                  z: 25.38,
                },
                n / 700,
                pc.QuinticInOut
              )
              .start(),
            setTimeout(function () {
              t(),
                e &&
                  i.app
                    .tween(i.movement.animation)
                    .to(
                      {
                        cameraImpact: -3,
                      },
                      0.1,
                      pc.BackOut
                    )
                    .start();
            }, n / 2);
        },
        n,
        this
      ),
      setTimeout(
        function (t) {
          t.shoulderEntity
            .tween(t.shoulderEntity.getLocalEulerAngles())
            .rotate(
              {
                x: 64.6,
                y: 4.31,
                z: 1.91,
              },
              0.2,
              pc.BackOut
            )
            .start();
        },
        2.8 * n,
        this
      ),
      setTimeout(
        function (t) {
          (t.isThrowing = !1),
            t.shoulderEntity.reparent(t.armEntity),
            t.shoulderEntity
              .tween(t.shoulderEntity.getLocalEulerAngles())
              .rotate(
                {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                0.2,
                pc.BackOut
              )
              .start(),
            t.app
              .tween(t.movement.animation)
              .to(
                {
                  takeX: 0,
                  takeY: 0,
                  takeZ: 0,
                },
                0.2,
                pc.BackInOut
              )
              .start();
        },
        2.9 * n,
        this
      );
  }),
  (PlayerAbilities.prototype.now = function () {
    return this.app._time;
  }),
  (PlayerAbilities.prototype.setScreenPosition = function (t, e) {
    var i = new pc.Vec3(),
      s = this.app.systems.camera.cameras[0],
      n = this.app.graphicsDevice.maxPixelRatio,
      a = this.screenEntity.screen.scale,
      o = this.app.graphicsDevice,
      r = e;
    if (!s) return !1;
    s.worldToScreen(r, i),
      (i.x *= n),
      (i.y *= n),
      i.x > 0 &&
      i.x < this.app.graphicsDevice.width &&
      i.y > 0 &&
      i.y < this.app.graphicsDevice.height &&
      i.z > 0
        ? (t.setLocalPosition(i.x / a, (o.height - i.y) / a, 0), (t.enabled = !0))
        : (t.enabled = !1);
  }),
  (PlayerAbilities.prototype.visionUpdate = function () {
    if ((this.movement.setShootDirection(), 'Echo' == this.character)) {
      var t = this.effectManager.testRaycast(
        this.movement.raycastShootFrom,
        this.movement.raycastTo
      );
      t &&
      t.distance > 1 &&
      t.distance < 40 &&
      t.entity &&
      t.entity.tags.list().indexOf('Grapple') > -1
        ? (this.hookIcon.enabled = !0)
        : (this.hookIcon.enabled = !1);
    }
  }),
  (PlayerAbilities.prototype.cooldownReset = function () {
    if (!this.player.killedBy) return !1;
    (this.resetKeyE = !0),
      (this.resetKeyF = !0),
      this.app.fire('Overlay:MeleeTimer', 0),
      this.app.fire('Overlay:SkillTimer', 0);
  }),
  (PlayerAbilities.prototype.update = function (t) {
    this.visionUpdate(),
      this.player.isDeath && this.cooldownReset(),
      (this.timestamp = this.movement.timestamp);
  });
var Timeline = pc.createScript('timeline');
Timeline.attributes.add('autoplay', {
  type: 'boolean',
}),
  Timeline.attributes.add('loop', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('yoyo', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('position', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('scale', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('rotation', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('opacity', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('custom', {
    type: 'boolean',
    default: !1,
  }),
  Timeline.attributes.add('duration', {
    type: 'number',
    default: 1,
  }),
  Timeline.attributes.add('delay', {
    type: 'number',
    default: 0,
  }),
  Timeline.attributes.add('ease', {
    type: 'string',
    enum: [
      {
        Linear: 'Linear',
      },
      {
        QuadraticIn: 'QuadraticIn',
      },
      {
        QuadraticOut: 'QuadraticOut',
      },
      {
        QuadraticInOut: 'QuadraticInOut',
      },
      {
        CubicIn: 'CubicIn',
      },
      {
        CubicOut: 'CubicOut',
      },
      {
        CubicInOut: 'CubicInOut',
      },
      {
        QuarticIn: 'QuarticIn',
      },
      {
        QuarticOut: 'QuarticOut',
      },
      {
        QuarticInOut: 'QuarticInOut',
      },
      {
        QuinticIn: 'QuinticIn',
      },
      {
        QuinticOut: 'QuinticOut',
      },
      {
        QuinticInOut: 'QuinticInOut',
      },
      {
        SineIn: 'SineIn',
      },
      {
        SineOut: 'SineOut',
      },
      {
        SineInOut: 'SineInOut',
      },
      {
        ExponentialIn: 'ExponentialIn',
      },
      {
        ExponentialOut: 'ExponentialOut',
      },
      {
        ExponentialInOut: 'ExponentialInOut',
      },
      {
        CircularIn: 'CircularIn',
      },
      {
        CircularOut: 'CircularOut',
      },
      {
        CircularInOut: 'CircularInOut',
      },
      {
        BackIn: 'BackIn',
      },
      {
        BackOut: 'BackOut',
      },
      {
        BackInOut: 'BackInOut',
      },
      {
        BounceIn: 'BounceIn',
      },
      {
        BounceOut: 'BounceOut',
      },
      {
        BounceInOut: 'BounceInOut',
      },
      {
        ElasticIn: 'ElasticIn',
      },
      {
        ElasticOut: 'ElasticOut',
      },
      {
        ElasticInOut: 'ElasticInOut',
      },
    ],
    default: 'Linear',
  }),
  Timeline.attributes.add('startFrame', {
    type: 'json',
    schema: [
      {
        name: 'position',
        type: 'vec3',
      },
      {
        name: 'rotation',
        type: 'vec3',
      },
      {
        name: 'scale',
        type: 'vec3',
        default: [1, 1, 1],
      },
      {
        name: 'opacity',
        type: 'number',
        default: 1,
      },
      {
        name: 'custom',
        type: 'string',
        description: 'For example camera.fov = 40',
      },
    ],
  }),
  Timeline.attributes.add('endFrame', {
    type: 'json',
    schema: [
      {
        name: 'position',
        type: 'vec3',
      },
      {
        name: 'rotation',
        type: 'vec3',
      },
      {
        name: 'scale',
        type: 'vec3',
        default: [1, 1, 1],
      },
      {
        name: 'opacity',
        type: 'number',
        default: 1,
      },
      {
        name: 'custom',
        type: 'string',
        description: 'For example camera.fov = 40',
      },
    ],
  }),
  (Timeline.prototype.initialize = function () {
    (this.animation = {
      custom: 0,
    }),
      (this.eventListener = !1),
      this.app.on('Timeline:' + this.entity.name, this.onPlay, this),
      this.on('destroy', this.onDestroy, this),
      this.on('state', this.onStateChange, this),
      this.autoplay && this.onPlay();
  }),
  (Timeline.prototype.onStateChange = function (t) {
    !0 === t ? this.autoplay && this.onPlay() : this.reset();
  }),
  (Timeline.prototype.onDestroy = function () {}),
  (Timeline.prototype.getEase = function () {
    return pc[this.ease];
  }),
  (Timeline.prototype.reset = function () {
    this.positionFrames && this.positionFrames.stop(),
      this.rotationFrames && this.rotationFrames.stop(),
      this.scaleFrames && this.scaleFrames.stop(),
      this.opacityFrames && this.opacityFrames.stop(),
      this.customFrames && this.customFrames.stop();
  }),
  (Timeline.prototype.setFirstFrame = function () {
    if (
      (this.position && this.entity.setLocalPosition(this.startFrame.position),
      this.rotation && this.entity.setLocalEulerAngles(this.startFrame.rotation),
      this.scale && this.entity.setLocalScale(this.startFrame.scale),
      this.opacity && (this.entity.element.opacity = this.startFrame.opacity),
      this.custom)
    ) {
      var parts = this.startFrame.custom.split(' = '),
        query = parts[0],
        value = parseFloat(parts[1]);
      (this.animation.custom = value), eval('this.entity.' + this.custom);
    }
  }),
  (Timeline.prototype.onComplete = function () {}),
  (Timeline.prototype.onPlay = function (_options) {
    var self = this,
      options = {
        isReverse: !1,
        delay: this.delay,
      };
    if (
      ('object' == typeof _options && (options.isReverse = !!_options.isReverse),
      options.isReverse && (options.delay = 0),
      this.reset(),
      this.setFirstFrame(),
      this.position &&
        ((this.positionFrames = this.entity
          .tween(this.entity.getLocalPosition())
          .to(
            {
              x: this.endFrame.position.x,
              y: this.endFrame.position.y,
              z: this.endFrame.position.z,
            },
            this.duration,
            this.getEase()
          )
          .delay(options.delay)),
        this.eventListener ||
          (this.eventListener = this.positionFrames.on('complete', this.onComplete, this)),
        this.loop && this.positionFrames.loop(!0),
        this.yoyo && this.positionFrames.yoyo(!0),
        options.isReverse && this.positionFrames.reverse(),
        this.positionFrames.start()),
      this.rotation &&
        ((this.rotationFrames = this.entity
          .tween(this.entity.getLocalEulerAngles())
          .rotate(
            {
              x: this.endFrame.rotation.x,
              y: this.endFrame.rotation.y,
              z: this.endFrame.rotation.z,
            },
            this.duration,
            this.getEase()
          )
          .delay(options.delay)),
        this.eventListener ||
          (this.eventListener = this.rotationFrames.on('complete', this.onComplete, this)),
        this.loop && this.rotationFrames.loop(!0),
        this.yoyo && this.rotationFrames.yoyo(!0),
        options.isReverse && this.rotationFrames.reverse(),
        this.rotationFrames.start()),
      this.scale &&
        ((this.scaleFrames = this.entity
          .tween(this.entity.getLocalScale())
          .to(
            {
              x: this.endFrame.scale.x,
              y: this.endFrame.scale.y,
              z: this.endFrame.scale.z,
            },
            this.duration,
            this.getEase()
          )
          .delay(options.delay)),
        this.eventListener ||
          (this.eventListener = this.scaleFrames.on('complete', this.onComplete, this)),
        this.loop && this.scaleFrames.loop(!0),
        this.yoyo && this.scaleFrames.yoyo(!0),
        options.isReverse && this.scaleFrames.reverse(),
        this.scaleFrames.start()),
      this.opacity &&
        ((this.opacityFrames = this.entity
          .tween(this.entity.element)
          .to(
            {
              opacity: this.endFrame.opacity,
            },
            this.duration,
            this.getEase()
          )
          .delay(options.delay)),
        this.eventListener ||
          (this.eventListener = this.opacityFrames.on('complete', this.onComplete, this)),
        this.loop && this.opacityFrames.loop(!0),
        this.yoyo && this.opacityFrames.yoyo(!0),
        options.isReverse && this.opacityFrames.reverse(),
        this.opacityFrames.start()),
      this.custom)
    ) {
      var parts = this.endFrame.custom.split(' = '),
        query = parts[0],
        value = parseFloat(parts[1]);
      (this.customFrames = this.entity
        .tween(this.animation)
        .to(
          {
            custom: value,
          },
          this.duration,
          this.getEase()
        )
        .delay(options.delay)),
        this.customFrames.on('update', function () {
          eval('this.entity.' + query + ' = ' + self.animation.custom);
        }),
        options.isReverse && this.customFrames.reverse(),
        this.customFrames.start();
    }
  });
var Shader = pc.createScript('shader');
Shader.attributes.add('autoplay', {
  type: 'boolean',
  default: !0,
}),
  Shader.attributes.add('speed', {
    type: 'number',
    default: 1,
  }),
  Shader.attributes.add('layers', {
    type: 'json',
    schema: [
      {
        name: 'texture',
        type: 'asset',
        assetType: 'texture',
      },
      {
        name: 'method',
        type: 'string',
        enum: [
          {
            Add: 'Add',
          },
          {
            Multiply: 'Multiply',
          },
          {
            Subtract: 'Subtract',
          },
          {
            Divide: 'Divide',
          },
        ],
        default: 'Add',
      },
      {
        name: 'channel',
        type: 'string',
        enum: [
          {
            RGBA: 'RGBA',
          },
          {
            RGB: 'RGB',
          },
          {
            Alpha: 'Alpha',
          },
        ],
        default: 'RGBA',
      },
      {
        name: 'position',
        type: 'vec2',
      },
      {
        name: 'scale',
        type: 'vec2',
        default: [1, 1],
      },
      {
        name: 'color',
        type: 'rgba',
      },
      {
        name: 'timeFactor',
        type: 'number',
        default: 1,
      },
      {
        name: 'timeMethodX',
        type: 'string',
        enum: [
          {
            Linear: 'Linear',
          },
          {
            Cosine: 'Cosine',
          },
          {
            Sine: 'Sine',
          },
        ],
        default: 'Linear',
      },
      {
        name: 'timeMethodY',
        type: 'string',
        enum: [
          {
            Linear: 'Linear',
          },
          {
            Cosine: 'Cosine',
          },
          {
            Sine: 'Sine',
          },
        ],
        default: 'Linear',
      },
    ],
    array: !0,
  }),
  (Shader.prototype.initialize = function () {
    var e = this;
    (this.loadedCount = -1),
      (this.time = 0),
      (this.operators = {
        Add: '+',
        Subtract: '-',
        Multiply: '*',
        Divide: '/',
      });
    var t = this.app.assets.get(this.entity.model.asset);
    for (var a in (this.app.assets.load(t),
    t.ready(function () {
      e.onAssetLoad();
    }),
    this.layers)) {
      var i = this.layers[a];
      this.app.assets.load(i.texture),
        i.texture.ready(function () {
          e.onAssetLoad();
        });
    }
  }),
  (Shader.prototype.onAssetLoad = function () {
    this.loadedCount++, this.layers.length == this.loadedCount && this.prepare();
  }),
  (Shader.prototype.prepare = function (e) {
    var t = 'precision ' + this.app.graphicsDevice.precision + ' float;';
    for (var a in ((t += 'varying vec2 vUv0;'), (t += 'uniform float uTime;'), this.layers)) {
      this.layers[a];
      (t += 'uniform sampler2D layer_' + a + ';'),
        (t += 'uniform vec2 position_' + a + ';'),
        (t += 'uniform vec2 scale_' + a + ';'),
        (t += 'uniform vec4 color_' + a + ';');
    }
    for (var i in ((t += 'void main(void){'),
    (t += 'vec4 color = vec4(0.0, 0.0, 0.0, 0.0);'),
    this.layers)) {
      var r = this.layers[i];
      (t += 'vec2 pos_' + i + ' = position_' + i + ';'),
        (t += 'pos_' + i + '.x = pos_' + i + '.x * '),
        'Linear' == r.timeMethodX
          ? (t += 'uTime')
          : 'Sine' == r.timeMethodX
          ? (t += 'sin(uTime)')
          : 'Cosine' == r.timeMethodX && (t += 'cos(uTime)'),
        (t += ';'),
        (t += 'pos_' + i + '.y = pos_' + i + '.y'),
        (t += ' * '),
        'Linear' == r.timeMethodY
          ? (t += 'uTime')
          : 'Sine' == r.timeMethodY
          ? (t += 'sin(uTime)')
          : 'Cosine' == r.timeMethodY && (t += 'cos(uTime)'),
        (t += ';'),
        (t += 'vec4 texture_' + i + ' = texture2D(layer_' + i + ','),
        (t += 'vUv0 * scale_' + i + ' + pos_' + i + ');'),
        'Alpha' != r.channel &&
          (t += 'color' + this.operators[r.method] + '= texture_' + i + ' * color_' + i + ';');
    }
    for (var s in this.layers) {
      'Alpha' == this.layers[s].channel && (t += 'color.a*= texture2D(layer_' + s + ', vUv0).a;');
    }
    (t += 'gl_FragColor = color;'), (t += '}');
    var o = {
      attributes: {
        aPosition: pc.SEMANTIC_POSITION,
        aUv0: pc.SEMANTIC_TEXCOORD0,
      },
      vshader:
        'attribute vec3 aPosition;attribute vec2 aUv0;uniform mat4 matrix_model;uniform mat4 matrix_viewProjection;varying vec2 vUv0;void main(void){vUv0 = aUv0;gl_Position = matrix_viewProjection * matrix_model *vec4(aPosition, 1.0);}',
      fshader: t,
    };
    for (var n in ((this.shader = new pc.Shader(this.app.graphicsDevice, o)),
    (this.material = new pc.Material()),
    (this.material.shader = this.shader),
    (this.material.alphaWrite = !0),
    (this.material.alphaTest = !0),
    (this.material.depthWrite = !1),
    (this.material.depthTest = !0),
    (this.material.cull = pc.CULLFACE_NONE),
    (this.material.blendType = pc.BLEND_ADDITIVEALPHA),
    this.layers)) {
      var l = this.layers[n];
      this.material.setParameter('layer_' + n, l.texture.resource),
        this.material.setParameter('position_' + n, [l.position.x, l.position.y]),
        this.material.setParameter('scale_' + n, [l.scale.x, l.scale.y]),
        this.material.setParameter('color_' + n, l.color.data);
    }
    this.entity.model.material = this.material;
    var h = this.entity.model.meshInstances;
    for (var m in h) {
      h[m].material = this.material;
    }
  }),
  (Shader.prototype.update = function (e) {
    if (!this.material) return !1;
    (this.time += e), this.material.setParameter('uTime', this.time * this.speed);
  });
var Notify = pc.createScript('notify');
Notify.attributes.add('notifyElement', {
  type: 'entity',
}),
  (Notify.prototype.initialize = function () {
    (this.notifyIndex = 0), this.app.on('Notify:' + this.entity.name, this.onNotify, this);
  }),
  (Notify.prototype.onNotify = function (t) {
    var e = t;
    'object' == typeof t && (e = t.message);
    var i = -this.notifyIndex * (this.notifyElement.element.height + 5),
      n = this.notifyElement.clone();
    (n.findByName('Text').element.text = e),
      (n.element.width = 10 * e.length + 50),
      (n.enabled = !0),
      n.setLocalPosition(50, i, 0),
      n
        .tween(n.getLocalPosition())
        .to(
          {
            x: 0,
            y: i,
            z: 0,
          },
          0.1,
          pc.BackOut
        )
        .start(),
      this.entity.addChild(n),
      this.entity.sound.play('Notify'),
      this.notifyIndex++,
      setTimeout(
        function (t, e) {
          e.destroy(), t.notifyIndex--;
        },
        5e3,
        this,
        n
      );
  });
var Selection = pc.createScript('selection');
Selection.attributes.add('default', {
  type: 'string',
}),
  Selection.attributes.add('holderEntity', {
    type: 'entity',
  }),
  Selection.attributes.add('onSelect', {
    type: 'string',
  }),
  Selection.attributes.add('onEmpty', {
    type: 'string',
  }),
  (Selection.prototype.initialize = function () {
    (this.currentSelection = []),
      this.app.on('Selection:' + this.entity.name, this.onSelection, this),
      this.app.fire('Selection:' + this.entity.name, JSON.parse(this.default)),
      this.on('destroy', this.onDestroy, this);
  }),
  (Selection.prototype.onDestroy = function (t) {
    this.app.off('Selection:' + this.entity.name, this.onSelection, this);
  }),
  (Selection.prototype.onEmptyTrigger = function (t) {
    if (!this.onEmpty) return !1;
    var e = this.onEmpty.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var n = e[i].split('@'),
          r = n[0];
        if (n.length > 1) {
          var o = n[1];
          this.app.fire(r, o);
        } else this.app.fire(r);
      }
  }),
  (Selection.prototype.onSelectTrigger = function (t) {
    var e = this.onSelect.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var n = e[i].split('@'),
          r = n[0];
        if (n.length > 1) {
          var o = n[1];
          this.app.fire(r, o);
        } else this.app.fire(r, t);
      }
  }),
  (Selection.prototype.onSelection = function (t) {
    if ('object' == typeof t && t.length > 0) this.currentSelection = t;
    else {
      var e = this.currentSelection.indexOf(t);
      e > -1 ? this.currentSelection.splice(e, 1) : this.currentSelection.push(t);
    }
    var i = [];
    for (var n in this.currentSelection) {
      var r = this.currentSelection[n];
      r && 'object' != typeof r && i.push(r);
    }
    this.currentSelection = i;
    var o = this.holderEntity.children;
    for (var s in o) {
      var c = o[s];
      c &&
        c.script &&
        c.script.toggle &&
        (this.currentSelection.indexOf(c.id) > -1
          ? c.script.toggle.setState(!0)
          : c.script.toggle.setState(!1));
    }
    0 === this.currentSelection.length && this.onEmptyTrigger(),
      this.onSelectTrigger(this.currentSelection);
  });
var Toggle = pc.createScript('toggle');
Toggle.attributes.add('show', {
  type: 'entity',
  array: !0,
}),
  Toggle.attributes.add('hide', {
    type: 'entity',
    array: !0,
  }),
  Toggle.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  Toggle.attributes.add('active', {
    type: 'rgb',
  }),
  Toggle.attributes.add('inactive', {
    type: 'rgb',
  }),
  (Toggle.prototype.setState = function (t) {
    for (var e in ((this.backgroundEntity.element.color = !0 === t ? this.active : this.inactive),
    this.show)) {
      this.show[e].enabled = t;
    }
    for (var i in this.hide) {
      this.hide[i].enabled = !t;
    }
  });
var CustomText = pc.createScript('customText');
CustomText.attributes.add('key', {
  type: 'string',
  default: 'message',
}),
  (CustomText.prototype.initialize = function () {
    (this.originalText = this.entity.element.text + ''),
      this.app.on('CustomText:' + this.entity.name, this.setCustomText, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (CustomText.prototype.onDestroy = function () {
    this.app.off('CustomText:' + this.entity.name, this.setCustomText, this);
  }),
  (CustomText.prototype.setCustomText = function (t) {
    this.entity.element.text = 'object' == typeof t ? t[this.key] : t;
  });
var DataTransformer = pc.createScript('dataTransformer');
DataTransformer.attributes.add('transformers', {
  type: 'json',
  schema: [
    {
      name: 'input',
      type: 'string',
    },
    {
      name: 'output',
      type: 'string',
    },
  ],
  array: !0,
}),
  DataTransformer.attributes.add('trigger', {
    type: 'string',
  }),
  (DataTransformer.prototype.initialize = function () {
    this.app.on('DataTransformer:' + this.entity.name, this.setCustomText, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (DataTransformer.prototype.onDestroy = function () {
    this.app.off('DataTransformer:' + this.entity.name, this.setCustomText, this);
  }),
  (DataTransformer.prototype.setCustomText = function (t) {
    var r = t;
    for (var a in this.transformers) {
      var s = this.transformers[a];
      s.input === t && (r = s.output);
    }
    this.app.fire(this.trigger, r);
  });
var NewsSlider = pc.createScript('newsSlider');
NewsSlider.attributes.add('items', {
  type: 'json',
  schema: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'thumbnail',
      type: 'asset',
      assetType: 'texture',
    },
    {
      name: 'backgroundColor',
      type: 'rgb',
    },
    {
      name: 'strokeColor',
      type: 'rgb',
    },
  ],
  array: !0,
}),
  NewsSlider.attributes.add('titleEntity', {
    type: 'entity',
  }),
  NewsSlider.attributes.add('thumbnailEntity', {
    type: 'entity',
  }),
  NewsSlider.attributes.add('strokeEntity', {
    type: 'entity',
  }),
  NewsSlider.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  NewsSlider.attributes.add('duration', {
    type: 'number',
    default: 1.5,
  }),
  (NewsSlider.prototype.initialize = function () {
    (this.index = 0), this.setSlideItem(), this.on('destroy', this.onDestroy, this);
  }),
  (NewsSlider.prototype.onDestroy = function () {
    clearTimeout(this.sliderTimeout), (this.sliderTimeout = !1);
  }),
  (NewsSlider.prototype.setSlideItem = function () {
    return (
      !!this.entity.enabled &&
      !!this.titleEntity.element &&
      ((this.titleEntity.element.text = this.items[this.index].title),
      (this.thumbnailEntity.element.textureAsset = this.items[this.index].thumbnail),
      (this.strokeEntity.element.color = this.items[this.index].strokeColor),
      (this.backgroundEntity.element.color = this.items[this.index].backgroundColor),
      this.app.fire('Timeline:Thumbnail', !0),
      this.app.fire('Timeline:Stroke', !0),
      this.app.fire('Timeline:Time', !0),
      (this.sliderTimeout = setTimeout(
        function (t) {
          t.app.fire('Timeline:Thumbnail', {
            isReverse: !0,
          }),
            t.app.fire('Timeline:Stroke', {
              isReverse: !0,
            }),
            setTimeout(function () {
              t.setSlideItem();
            }, 2e3);
        },
        1e3 * this.duration,
        this
      )),
      this.index++,
      void (this.items.length - 1 < this.index && (this.index = 0)))
    );
  });
var Conditions = pc.createScript('conditions');
Conditions.attributes.add('conditions', {
  type: 'json',
  schema: [
    {
      name: 'method',
      type: 'string',
      enum: [
        {
          Query: 'Query',
        },
        {
          GlobalVariable: 'GlobalVariable',
        },
      ],
      default: 'Query',
    },
    {
      name: 'query',
      type: 'string',
    },
    {
      name: 'action',
      type: 'string',
    },
  ],
  array: !0,
}),
  (Conditions.prototype.initialize = function () {
    this.app.on('Conditions:' + this.entity.name, this.onConditionTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Conditions.prototype.onDestroy = function (i) {
    this.app.off('Conditions:' + this.entity.name, this.onConditionTrigger, this);
  }),
  (Conditions.prototype.onConditionTrigger = function (data) {
    for (var conditionIndex in this.conditions) {
      var condition = this.conditions[conditionIndex];
      if ('GlobalVariable' == condition.method)
        eval(condition.query) && this.triggerAction(condition.action);
      else {
        var query = condition.query.replace(/\|\| /g, '|| data.');
        (query = query.replace(/\&\& /g, '&& data.')),
          eval('data.' + query) && this.triggerAction(condition.action);
      }
    }
  }),
  (Conditions.prototype.triggerAction = function (i) {
    Utils.triggerAction(i);
    var t = i.split(', ');
    if (t.length > 0)
      for (var n in t) {
        var o = t[n],
          e = o.split('@');
        if (e.length > 1) {
          var r = e[0],
            a = e[1];
          this.app.fire(r, a);
        } else this.app.fire(o);
      }
  });
var Delay = pc.createScript('delay');
Delay.attributes.add('conditions', {
  type: 'json',
  schema: [
    {
      name: 'action',
      type: 'string',
    },
    {
      name: 'delay',
      type: 'number',
      default: 0,
    },
  ],
  array: !0,
}),
  (Delay.prototype.initialize = function () {
    this.app.on('Delay:' + this.entity.name, this.onTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Delay.prototype.onDestroy = function () {
    this.app.off('Delay:' + this.entity.name, this.onTrigger, this);
  }),
  (Delay.prototype.onTrigger = function (t) {
    for (var i in this.conditions) {
      var e = this.conditions[i];
      setTimeout(
        function (i, e) {
          i.triggerAction(e, t);
        },
        e.delay,
        this,
        e.action
      );
    }
  }),
  (Delay.prototype.triggerAction = function (t, i) {
    var e = t.split(', ');
    if (e.length > 0)
      for (var n in e) {
        var o = e[n],
          a = o.split('@');
        if (a.length > 1) {
          var r = a[0],
            s = a[1];
          this.app.fire(r, s);
        } else this.app.fire(o, i);
      }
  });
var Show = pc.createScript('show');
Show.attributes.add('conditions', {
  type: 'json',
  schema: [
    {
      name: 'name',
      description: 'name is key to trigger specific action',
      type: 'string',
    },
    {
      name: 'action',
      type: 'string',
      enum: [
        {
          Show: 'Show',
        },
        {
          Hide: 'Hide',
        },
      ],
      default: 'Show',
    },
    {
      name: 'elements',
      type: 'entity',
      array: !0,
    },
  ],
  array: !0,
}),
  (Show.prototype.initialize = function () {
    this.app.on('Show:' + this.entity.name, this.onConditionTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Show.prototype.onDestroy = function () {
    this.app.off('Show:' + this.entity.name, this.onConditionTrigger, this);
  }),
  (Show.prototype.onConditionTrigger = function (t) {
    for (var i in this.conditions) {
      var n = this.conditions[i];
      if (n.name == t)
        for (var o in n.elements) {
          var e = n.elements[o];
          'Show' == n.action ? (e.enabled = !0) : 'Hide' == n.action && (e.enabled = !1);
        }
    }
  });
var Gamepad = pc.createScript('gamepad');
(Gamepad.prototype.initialize = function () {
  (pc.isGamepadActive = !1),
    (this.lookAngleX = 0),
    (this.lookAngleY = 0),
    window.addEventListener('gamepadconnected', function (p) {
      navigator.getGamepads()[0];
      pc.app.gamepads = new pc.GamePads();
    });
}),
  (Gamepad.prototype.update = function (p) {
    if (pc.app.gamepads && pc.app.gamepads.current && pc.app.gamepads.current.length > 0) {
      var a = pc.app.gamepads.current[0].pad.axes[3],
        e = pc.app.gamepads.current[0].pad.axes[4],
        t = pc.app.gamepads.current[0].pad.axes[0],
        i = pc.app.gamepads.current[0].pad.axes[1],
        s = pc.app.gamepads.current[0].pad.axes[2],
        d = pc.app.gamepads.current[0].pad.axes[5],
        r = pc.app.gamepads.current[0].pad.axes[9] * pc.math.RAD_TO_DEG,
        m = pc.app.gamepads.current[0].pad.buttons[0],
        n = pc.app.gamepads.current[0].pad.buttons[3],
        c = pc.app.gamepads.current[0].pad.buttons[1],
        o = pc.app.gamepads.current[0].pad.buttons[4],
        G = e > 0,
        h = a > 0;
      this.app.fire('Gamepad:Tick', 'TICK'),
        this.app.fire('Gamepad:Shoot', h),
        this.app.fire('Gamepad:Aim', G),
        this.app.fire('Gamepad:Movement', 'EMPTY'),
        s < 0.05 && s > -0.05 && (s = 0),
        d < 0.05 && d > -0.05 && (d = 0),
        (this.lookAngleX = pc.math.lerp(this.lookAngleX, s, 0.25)),
        (this.lookAngleY = pc.math.lerp(this.lookAngleY, d, 0.25)),
        this.app.fire('Gamepad:Look', 50 * this.lookAngleX, 50 * this.lookAngleY),
        r > 0 && r < 15 && this.app.fire('Gamepad:Movement', 'DOWN'),
        r > 15 && r < 35 && this.app.fire('Gamepad:Movement', 'LEFT-DOWN'),
        r > -20 && r < 0 && this.app.fire('Gamepad:Movement', 'RIGHT-DOWN'),
        r > -60 && r < -45 && this.app.fire('Gamepad:Movement', 'UP'),
        r > -45 && r < 0 && this.app.fire('Gamepad:Movement', 'RIGHT-UP'),
        r > 45 && r < 60 && this.app.fire('Gamepad:Movement', 'LEFT-UP'),
        r > 35 && r < 60 && this.app.fire('Gamepad:Movement', 'LEFT'),
        r > -40 && r < -20 && this.app.fire('Gamepad:Movement', 'RIGHT');
      var g = -0.5,
        f = 0.5;
      t < g && i < g
        ? (r = 'LEFT-UP')
        : t > f && i < g
        ? (r = 'RIGHT-UP')
        : t < g && i > f
        ? (r = 'LEFT-DOWN')
        : t > f && i > f
        ? (r = 'RIGHT-DOWN')
        : i > 0.1
        ? (r = 'DOWN')
        : i < -0.1
        ? (r = 'UP')
        : t < g
        ? (r = 'LEFT')
        : t > f && (r = 'RIGHT'),
        this.app.fire('Gamepad:Movement', r),
        m.pressed && this.app.fire('Gamepad:Action', 'JUMP'),
        n.pressed && this.app.fire('Gamepad:Action', 'BUTTON1'),
        c.pressed && this.app.fire('Gamepad:Action', 'BUTTON2'),
        o.pressed && this.app.fire('Gamepad:Action', 'BUTTON3'),
        (pc.isGamepadActive = !0);
    }
  });
var ConditionPositioning = pc.createScript('conditionPositioning');
ConditionPositioning.attributes.add('conditions', {
  type: 'json',
  schema: [
    {
      name: 'query',
      type: 'string',
    },
    {
      name: 'entity',
      type: 'entity',
    },
    {
      name: 'position',
      type: 'vec3',
      default: [0, 0, 0],
    },
    {
      name: 'rotation',
      type: 'vec3',
      default: [0, 0, 0],
    },
    {
      name: 'scale',
      type: 'vec3',
      default: [1, 1, 1],
    },
    {
      name: 'setAnchor',
      type: 'boolean',
      default: !1,
    },
    {
      name: 'anchor',
      type: 'vec4',
      default: [0, 0.5, 0, 0.5],
    },
    {
      name: 'visible',
      type: 'boolean',
      default: !0,
    },
  ],
  array: !0,
}),
  (ConditionPositioning.prototype.initialize = function () {
    this.app.on('ConditionPositioning:' + this.entity.name, this.onConditionTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (ConditionPositioning.prototype.onDestroy = function (i) {
    this.app.off('Conditions:' + this.entity.name, this.onConditionTrigger, this);
  }),
  (ConditionPositioning.prototype.onConditionTrigger = function (data) {
    for (var conditionIndex in this.conditions) {
      var condition = this.conditions[conditionIndex],
        query = condition.query.replace(/\|\| /g, '|| data.');
      (query = query.replace(/\&\& /g, '&& data.')),
        eval('data.' + query) && this.triggerChanges(condition);
    }
  }),
  (ConditionPositioning.prototype.triggerChanges = function (i) {
    i.entity.setLocalPosition(i.position),
      i.entity.setLocalScale(i.scale),
      i.entity.setLocalEulerAngles(i.rotation),
      i.setAnchor && (i.entity.element.anchor = i.anchor),
      (i.entity.enabled = i.visible);
  });
var LookAt = pc.createScript('lookAt');
(LookAt.prototype.initialize = function () {
  this.cameraEntity = this.app.root.findByName('Lens');
}),
  (LookAt.prototype.update = function (t) {
    this.cameraEntity && this.entity.lookAt(this.cameraEntity.getPosition());
  });
var Water = pc.createScript('water');
Water.attributes.add('normal', {
  type: 'asset',
  assetType: 'texture',
}),
  Water.attributes.add('foam', {
    type: 'asset',
    assetType: 'texture',
  }),
  Water.attributes.add('speed', {
    type: 'number',
    default: 0.1,
  }),
  Water.attributes.add('scale', {
    type: 'number',
    default: 2,
  }),
  (Water.prototype.initialize = function () {
    (this.material = !1),
      (this.loadedCount = 0),
      (this.totalAssetCount = 2),
      this.normal ||
        this.foam ||
        ((this.normal = this.app.assets.find('Water-Normal-Small.jpg')),
        (this.foam = this.app.assets.find('Foam-Texture.png'))),
      this.loadAsset(this.normal),
      this.loadAsset(this.foam);
  }),
  (Water.prototype.loadAsset = function (e) {
    var t = this;
    this.app.assets.load(e),
      e.ready(function () {
        t.loadedCount++, t.loadedCount == t.totalAssetCount && t.prepare();
      });
  }),
  (Water.prototype.prepare = function (e) {
    (this.material = this.entity.model.meshInstances[0].material),
      (this.material.chunks.diffusePS =
        'uniform sampler2D uSidesMap;\nuniform sampler2D uWaterNormal;\nuniform sampler2D uFoamMap;\nuniform vec4 uScreenSize;\nuniform vec2 scale;\nuniform float time;\n#ifdef MAPCOLOR\nuniform vec3 material_diffuse;\n#endif\nuniform sampler2D texture_diffuseMap;\nvoid getAlbedo() {\ndAlbedo = vec3(1.0);\nvec2 waterUV1 = $UV * vec2(scale.x, scale.y)+ vec2(-time, time);vec2 waterUV2 = $UV * vec2(scale.x, scale.y)+ vec2(time, time);vec3 foamMap = texture2D(uFoamMap, $UV).rgb;vec3 diffuseMap1 = texture2D(texture_diffuseMap, waterUV1).$CH;\nvec3 diffuseMap2 = texture2D(texture_diffuseMap, waterUV2).$CH;\nvec3 waterColor = diffuseMap1 + diffuseMap2;\ndAlbedo+= step(1.4, waterColor) * 2.0 + max(waterColor, 1.0) * 1.5;\ndAlbedo+= foamMap * 3.5 + step(1.0, foamMap * waterColor) * 10.0;\ndAlbedo*= material_diffuse;\n}\n'),
      (this.time = 0),
      this.material.setParameter('uFoamMap', this.foam.resource),
      this.material.setParameter('uWaterNormal', this.normal.resource),
      this.material.setParameter('scale', [this.scale, this.scale]);
  }),
  (Water.prototype.update = function (e) {
    if (!this.material) return !1;
    this.material.setParameter('time', this.time), (this.time += e * this.speed);
  });
var Ripple = pc.createScript('ripple');
Ripple.attributes.add('gradient', {
  type: 'asset',
  assetType: 'texture',
}),
  Ripple.attributes.add('loop', {
    type: 'boolean',
    default: !0,
  }),
  Ripple.attributes.add('speed', {
    type: 'number',
    default: 1,
  }),
  (Ripple.prototype.initialize = function () {
    var t = this,
      e = this.entity.model.asset,
      i = this.app.assets.get(e);
    (this.loadedCount = 0),
      this.app.assets.load(i),
      i.ready(function () {
        t.onAssetLoad();
      }),
      this.app.assets.load(this.gradient),
      this.gradient.ready(function () {
        t.onAssetLoad();
      });
  }),
  (Ripple.prototype.onAssetLoad = function () {
    this.loadedCount++, 2 == this.loadedCount && this.onReady();
  }),
  (Ripple.prototype.onReady = function () {
    this.loop
      ? (this.material = this.entity.model.meshInstances[0].material)
      : (this.material = this.entity.model.meshInstances[0].material.clone()),
      (this.material.chunks.opacityPS =
        'uniform sampler2D texture_opacityMap;\nuniform sampler2D gradient;\nuniform float scale;\nuniform float time;\nvoid getOpacity() {\ndAlpha = 1.0;\ndAlpha *= texture2D(texture_opacityMap, $UV+ vec2(scale, 0.0)).r;\ndAlpha += texture2D(texture_opacityMap, $UV+ vec2(scale * 0.5, 0.0)).g;\ndAlpha *= texture2D(gradient, $UV).r;\ndAlpha *= time;\n}\n'),
      this.material.setParameter('gradient', this.gradient.resource),
      (this.entity.model.meshInstances[0].material = this.material),
      (this.scale = 0),
      (this.nextScale = 0),
      (this.time = 0),
      (this.lastSet = Date.now()),
      this.entity.on('Trigger', this.onTrigger, this);
  }),
  (Ripple.prototype.onTrigger = function () {
    this.scale = 4.5;
  }),
  (Ripple.prototype.update = function (t) {
    if (!this.material) return !1;
    this.material.setParameter('scale', this.scale),
      this.material.setParameter('time', this.time),
      !0 === this.loop
        ? ((this.scale += t * this.speed), (this.time = 1))
        : ((this.scale += t * this.speed), (this.time = Math.cos(this.scale)));
  });
var Lightmapped = pc.createScript('lightmapped');
(Lightmapped.prototype.initialize = function () {
  var t = this;
  for (var s in ((this.loadedCount = 0),
  (this.totalCount = 0),
  (this.assets = []),
  (this.models = this.entity.findComponents('model')),
  this.models)) {
    var e = this.models[s];
    'asset' == e.type && (this.totalCount++, this.assets.push(e.asset));
  }
  for (var a in this.assets) {
    var i = this.assets[a],
      o = this.app.assets.get(i);
    o &&
      o.ready(function () {
        t.loadedCount++, t.totalCount == t.loadedCount && t.onMapLoaded();
      });
  }
}),
  (Lightmapped.prototype.onMapLoaded = function () {
    this.app.lightmapper.bake(),
      setTimeout(
        function (t) {
          t.app.batcher.generate();
        },
        1e3,
        this
      );
  });
var Trap = pc.createScript('trap');
(Trap.prototype.initialize = function () {
  var t = this,
    i = this.entity.model.asset;
  this.app.assets.get(i).ready(function () {
    t.onReady();
  }),
    (this.state = -100),
    (this.nextState = -100),
    this.app.on('Trigger:' + this.entity.name, this.onTrigger, this),
    this.on('destroy', this.onDestroy, this);
}),
  (Trap.prototype.onDestroy = function () {
    this.app.off('Trigger:' + this.entity.name, this.onTrigger, this), clearTimeout(this.trapTimer);
  }),
  (Trap.prototype.onReady = function () {
    this.stick = this.entity.findByName('Stick');
  }),
  (Trap.prototype.onTrigger = function () {
    if (!this.stick) return !1;
    (this.nextState = 0),
      this.entity.sound &&
        (this.entity.sound.play('Open'),
        this.app.fire('Overlay:Sound', 'Buff-Attack-1'),
        this.app.fire('Player:Shake', !0)),
      clearTimeout(this.trapTimer),
      (this.trapTimer = setTimeout(
        function (t) {
          (t.nextState = -25), t.entity.sound && t.entity.sound.play('Close');
        },
        2e3,
        this
      ));
  }),
  (Trap.prototype.update = function () {
    if (!this.stick) return !1;
    (this.state = pc.math.lerp(this.state, this.nextState, 0.3)),
      this.stick.setLocalPosition(0, this.state, 0);
  });
var GroupTrigger = pc.createScript('groupTrigger');
GroupTrigger.attributes.add('entities', {
  type: 'entity',
  array: !0,
}),
  GroupTrigger.attributes.add('timeout', {
    type: 'number',
    default: 2,
  }),
  (GroupTrigger.prototype.initialize = function () {
    this.entity.on('GroupTrigger', this.onTrigger, this);
  }),
  (GroupTrigger.prototype.onTrigger = function (t) {
    for (var i in this.entities) {
      this.entities[i].fire('Trigger');
    }
    t && this.entity.setPosition(t.clone()),
      clearTimeout(this.timer),
      (this.timer = setTimeout(
        function (t) {
          t.entity.setPosition(new pc.Vec3(0, -100, 0));
        },
        1e3 * this.timeout,
        this
      ));
  });
var Splash = pc.createScript('splash');
Splash.attributes.add('gradient', {
  type: 'asset',
  assetType: 'texture',
}),
  Splash.attributes.add('speed', {
    type: 'number',
    default: 1,
  }),
  (Splash.prototype.initialize = function () {
    (this.time = -1),
      (this.scale = 0),
      (this.material = this.entity.model.meshInstances[0].material.clone()),
      (this.material.chunks.opacityPS =
        'uniform sampler2D texture_opacityMap;\nuniform sampler2D gradient;\nuniform float scale;\nuniform float time;\nvoid getOpacity() {\ndAlpha = 1.0;\ndAlpha *= texture2D(texture_opacityMap, $UV+ vec2(scale * 0.1, scale)).r;\ndAlpha += texture2D(texture_opacityMap, $UV+ vec2(scale * 0.1, scale * 0.5)).g;\nvec2 alphaVec = $UV + vec2(0.0, scale);\ndAlpha *= texture2D(gradient, alphaVec).r;\ndAlpha *= time;\n}\n'),
      this.material.setParameter('gradient', this.gradient.resource),
      (this.entity.model.meshInstances[0].material = this.material),
      (this.entity.model.meshInstances[1].material = this.material),
      (this.entity.model.meshInstances[2].material = this.material),
      this.entity.on('Trigger', this.onTrigger, this);
  }),
  (Splash.prototype.onTrigger = function (t) {
    (this.isPlaying = !0), (this.scale = -1.5), (this.time = 1);
  }),
  (Splash.prototype.update = function (t) {
    this.isPlaying &&
      (this.material.setParameter('scale', this.scale),
      this.material.setParameter('time', Math.cos(this.scale + 1)),
      (this.scale += t * this.speed),
      (this.time = pc.math.lerp(this.time, 0, 0.01)));
  });
var GroupBatcher = pc.createScript('groupBatcher');
GroupBatcher.attributes.add('groupEntity', {
  type: 'entity',
}),
  GroupBatcher.attributes.add('count', {
    type: 'number',
    default: 3,
  }),
  GroupBatcher.attributes.add('timeout', {
    type: 'number',
    default: 2,
  }),
  GroupBatcher.attributes.add('garbageEntity', {
    type: 'entity',
  }),
  (GroupBatcher.prototype.initialize = function () {
    (this.index = 0), (this.pool = []), (this.times = []);
    for (var t = 0; t < this.count; t++) {
      var i = this.groupEntity.clone();
      (i.enabled = !0), this.garbageEntity.addChild(i), this.pool.push(i), (this.times[t] = -1e3);
    }
    this.groupEntity.destroy(),
      this.app.on('GroupBatcher:' + this.entity.name, this.onTrigger, this),
      this.app.on('GroupBatcher:' + this.entity.name + '@Reset', this.onReset, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (GroupBatcher.prototype.onReset = function () {
    for (var t in this.times) this.times[t] = -1e3;
    this.index = 0;
  }),
  (GroupBatcher.prototype.onDestroy = function () {
    this.app.off('GroupBatcher:' + this.entity.name, this.onTrigger, this);
  }),
  (GroupBatcher.prototype.onTrigger = function (t, i) {
    Date.now() - this.times[this.index] > 1e3 * this.timeout &&
      (this.pool[this.index].fire('GroupTrigger', t), (this.times[this.index] = Date.now())),
      this.index++,
      this.index > this.count - 1 && (this.index = 0);
  });
var Floating = pc.createScript('floating');
(Utils.variables.floatingIndex = 0),
  (Floating.prototype.initialize = function () {
    (this.timestamp = 0),
      (this.isTickSet = !1),
      (this.index = parseInt(Utils.variables.floatingIndex + '')),
      Utils.variables.floatingIndex++,
      (this.damageDirection = new pc.Vec3(0, 0, 0)),
      (this.nextDamageDirection = new pc.Vec3(0, 0, 0)),
      (this.startOffset = this.entity.getPosition().clone()),
      this.entity.on('Floating:Damage', this.onDamage, this),
      this.app.on('Server:Tick', this.setTick, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Floating.prototype.setTick = function (t) {
    this.isTickSet || ((this.timestamp = t + this.index), (this.isTickSet = !0));
  }),
  (Floating.prototype.onDestroy = function () {
    this.app.off('Server:Tick', this.setTick, this);
  }),
  (Floating.prototype.onDamage = function (t) {
    (this.nextDamageDirection = this.entity.getPosition().clone().sub(t).scale(0.5)),
      clearTimeout(this.damageTimer),
      (this.damageTimer = setTimeout(
        function (t) {
          (t.nextDamageDirection.x = 0),
            (t.nextDamageDirection.y = 0),
            (t.nextDamageDirection.z = 0);
        },
        1e3,
        this
      ));
  }),
  (Floating.prototype.update = function (t) {
    this.entity.setPosition(
      this.startOffset.x + this.damageDirection.x * Math.sin(2 * this.timestamp),
      this.startOffset.y + 1 * Math.cos(this.timestamp),
      this.startOffset.z + this.damageDirection.z * Math.sin(2 * this.timestamp)
    ),
      (this.damageDirection = this.damageDirection.lerp(
        this.damageDirection,
        this.nextDamageDirection,
        0.05
      )),
      (this.timestamp += 1 * t);
  });
var BakedPhysicsPlayer = pc.createScript('bakedPhysicsPlayer');
BakedPhysicsPlayer.attributes.add('staticEntity', {
  type: 'entity',
}),
  BakedPhysicsPlayer.attributes.add('speed', {
    type: 'number',
    default: 1,
  }),
  BakedPhysicsPlayer.attributes.add('autoplay', {
    type: 'boolean',
    default: !1,
  }),
  BakedPhysicsPlayer.attributes.add('file', {
    type: 'asset',
    assetType: 'json',
  }),
  BakedPhysicsPlayer.attributes.add('initTrigger', {
    type: 'string',
  }),
  BakedPhysicsPlayer.attributes.add('groundTrigger', {
    type: 'string',
  }),
  (BakedPhysicsPlayer.prototype.initialize = function () {
    (this.isLoaded = !1),
      this.app.on('BakedPhysics:' + this.entity.name, this.onPlay, this),
      this.autoplay && this.app.fire('BakedPhysics:' + this.entity.name, new pc.Vec3(0, 0, 0)),
      this.on('destroy', this.onDestroy, this);
  }),
  (BakedPhysicsPlayer.prototype.onDestroy = function () {
    this.app.off('BakedPhysics:' + this.entity.name, this.onPlay, this);
  }),
  (BakedPhysicsPlayer.prototype.load = function () {
    var t = this;
    (this.isPlaying = !1),
      (this.fps = 60),
      (this.pool = []),
      (this.data = {}),
      (this.frames = []),
      (this.frameIndex = 0),
      (this.frameTime = 0),
      (this.isHidden = !1),
      (this.childVertices = !1),
      (this.childScale = !1),
      this.app.assets.load(this.file),
      this.file.ready(function (i) {
        var e = this.resources[0];
        (t.data = e),
          (t.count = e.count),
          (t.duration = e.duration),
          (t.frames = e.frames),
          (t.childVertices = e.childVertices),
          (t.childScale = e.childScale),
          (t.isLoaded = !0);
      }),
      (this.staticEntity.enabled = !1),
      this.createPhysicalObjects(),
      this.hidePool();
  }),
  (BakedPhysicsPlayer.prototype.onPlay = function (t) {
    if (!this.isLoaded) return this.load(), !1;
    (this.isPlaying = !0),
      (this.isHidden = !1),
      (this.isEnded = !1),
      (this.frameIndex = 0),
      (this.frameTime = 0),
      t && this.entity.setLocalPosition(t),
      this.showPool(),
      this.entity.fire(this.initTrigger);
  }),
  (BakedPhysicsPlayer.prototype.createPhysicalObjects = function () {
    if (this.data.childVertices) {
      var t = this.staticEntity.model.meshInstances;
      for (var i in t) {
        var e = t[i];
        parseInt(i) > -1 &&
          ((e.triggered = !1), (e.isLarge = e.node.name.search('Large') > -1), this.pool.push(e));
      }
    } else
      for (var s = 0; s < this.count; s++) {
        var a = this.staticEntity.clone();
        (a.enabled = !0), this.pool.push(a), this.entity.addChild(a);
      }
  }),
  (BakedPhysicsPlayer.prototype.showPool = function (t) {
    if (this.childVertices) this.staticEntity.enabled = !0;
    else for (var i = this.pool.length; i--; ) this.pool[i].enabled = !0;
  }),
  (BakedPhysicsPlayer.prototype.hidePool = function (t) {
    if (this.isHidden) return !1;
    if (this.childVertices)
      for (var i = this.pool.length; i--; )
        (this.pool[i].triggered = !1), (this.pool[i].enabled = !1);
    else this.staticEntity.enabled = !1;
    this.isHidden = !0;
  }),
  (BakedPhysicsPlayer.prototype.onEnd = function () {
    if (this.isEnded) return !1;
    this.isEnded = !0;
  }),
  (BakedPhysicsPlayer.prototype.getRadius = function (t) {
    return t.x + t.y + t.z;
  }),
  (BakedPhysicsPlayer.prototype.update = function (t) {
    if (!this.isPlaying) return !1;
    if (0 === this.frames.length) return !1;
    if (this.frames.length - 1 < this.frameIndex)
      return (this.isPlaying = !1), this.hidePool(), this.onEnd(), !1;
    for (var i = this.pool.length; i--; ) {
      var e = this.frames[this.frameIndex][i],
        s = e,
        a = e[0];
      if (
        (this.childVertices
          ? (this.pool[a].node.setLocalPosition(100 * s[1], 100 * s[2], 100 * s[3]),
            this.pool[a].node.setLocalEulerAngles(s[4], s[5], s[6]))
          : (this.pool[a].setLocalPosition(s[1], s[2], s[3]),
            this.pool[a].setLocalEulerAngles(s[4], s[5], s[6])),
        this.groundTrigger)
      ) {
        var h = this.pool[a].node.getPosition().clone();
        !this.pool[a].triggered &&
          this.pool[a].isLarge &&
          h.y < 0 &&
          (this.app.fire(this.groundTrigger, h), (this.pool[a].triggered = !0));
      }
    }
    (this.frameTime += t * this.fps * this.speed), (this.frameIndex = Math.round(this.frameTime));
  });
var SpriteEffect = pc.createScript('spriteEffect');
(SpriteEffect.prototype.initialize = function () {
  this.app.on('SpriteEffect:' + this.entity.name, this.onTrigger, this),
    this.on('destroy', this.onDestroy, this);
}),
  (SpriteEffect.prototype.onDestroy = function () {
    this.app.off('SpriteEffect:' + this.entity.name, this.onTrigger, this);
  }),
  (SpriteEffect.prototype.onTrigger = function () {
    this.entity.sprite.play('Fire');
  });
var AutoResize = pc.createScript('autoResize');
AutoResize.attributes.add('entities', {
  type: 'entity',
  array: !0,
}),
  (AutoResize.prototype.initialize = function () {}),
  (AutoResize.prototype.update = function (e) {
    for (var t = this.entities.length; t--; ) {
      var i = this.entities[t];
      i &&
        i.element &&
        i.element.width &&
        (i.element.width = this.entity.screen.resolution.x / this.entity.screen.scale);
    }
  });
var WorldToScreen = pc.createScript('worldToScreen');
WorldToScreen.attributes.add('guideEntity', {
  type: 'entity',
}),
  (WorldToScreen.prototype.initialize = function () {
    (this.lockEntities = []),
      (this.guideEntities = []),
      (this.cameraEntity = this.app.root.findByName('Lens')),
      (this.guideEntity.enabled = !1),
      this.app.on('Overlay:WorldToScreen', this.setEntity, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (WorldToScreen.prototype.onDestroy = function (t) {
    this.app.off('Overlay:WorldToScreen', this.setEntity, this);
  }),
  (WorldToScreen.prototype.setEntity = function (t, i) {
    var e = this.lockEntities.indexOf(t);
    if (-1 === e) {
      this.lockEntities.push(t);
      var s = this.guideEntity.clone();
      (s.icon = s.findByName('Icon')),
        i.color && (s.icon.element.color = i.color),
        this.entity.addChild(s),
        this.guideEntities.push(s);
    } else
      this.guideEntities[e].destroy(),
        this.lockEntities.splice(e, 1),
        this.guideEntities.splice(e, 1);
  }),
  (WorldToScreen.prototype.updateEntity = function (t) {
    var i = new pc.Vec3(),
      e = this.cameraEntity.camera,
      s = this.app.graphicsDevice.maxPixelRatio;
    if (!this.lockEntities[t].parent)
      return (
        this.guideEntities[t].destroy(),
        this.lockEntities.splice(t, 1),
        this.guideEntities.splice(t, 1),
        !1
      );
    var n = this.lockEntities[t].getPosition(),
      o = this.entity.screen.scale,
      r = this.app.graphicsDevice;
    if (!e) return (this.guideEntities[t].enabled = !1), !1;
    e.worldToScreen(n, i),
      (i.x *= s),
      (i.y *= s),
      i.x > 0 &&
      i.x < this.app.graphicsDevice.width &&
      i.y > 0 &&
      i.y < this.app.graphicsDevice.height &&
      i.z > 0
        ? (this.guideEntities[t].setLocalPosition(i.x / o, (r.height - i.y) / o, 0),
          (this.guideEntities[t].enabled = !0))
        : (this.guideEntities[t].enabled = !1);
  }),
  (WorldToScreen.prototype.update = function (t) {
    if (0 === this.lockEntities.length) return !1;
    for (var i = this.lockEntities.length; i--; ) this.updateEntity(i);
  });
var Rating = pc.createScript('rating');
Rating.attributes.add('stars', {
  type: 'entity',
  array: !0,
}),
  Rating.attributes.add('hoverColor', {
    type: 'rgb',
    default: [1, 0.8, 0],
  }),
  Rating.attributes.add('disableColor', {
    type: 'rgb',
    default: [0.2, 0.2, 0.2],
  }),
  Rating.attributes.add('voteHidden', {
    type: 'entity',
  }),
  (Rating.prototype.initialize = function () {
    for (var t in (this.app.on('Rating:' + this.entity.name, this.onRating, this), this.stars)) {
      var e = this.stars[t];
      (e.element.rating = this),
        (e.element.currentIndex = parseInt(t) + 1),
        e.element.on('mouseenter', this.mouseOver, e.element);
      var i = this.app.assets.find('Stars-' + e.element.currentIndex + '.png');
      this.app.assets.load(i);
    }
  }),
  (Rating.prototype.mouseOver = function () {
    var t = this.rating.stars;
    for (var e in t) {
      var i = t[e];
      this.currentIndex > parseInt(e)
        ? (i.element.color = this.rating.hoverColor)
        : (i.element.color = this.rating.disableColor);
    }
  }),
  (Rating.prototype.onRating = function (t) {
    this.voteHidden.script.hidden.getValue();
    this.app.fire('Fetcher:Rating', {
      score: t,
      map: pc.displayMap,
    }),
      this.app.fire('Notify:Notify', 'Thank you for your vote!'),
      this.app.fire('View:Menu', 'Custom');
  });
var Domcontroller = pc.createScript('domcontroller');
(Domcontroller.prototype.initialize = function () {
  this.app.on('DOM:Hide', this.onHide, this),
    this.app.on('DOM:Show', this.onShow, this),
    this.app.on('DOM:DelayUpdate', this.onDelayUpdate, this),
    window.addEventListener('resize', function () {
      'undefined' != typeof pc && pc.app.fire('DOM:DelayUpdate', !0);
    }),
    (window.oncontextmenu = function () {
      return !1;
    });
}),
  (Domcontroller.prototype.onDelayUpdate = function () {
    setTimeout(
      function (e) {
        e.app.fire('DOM:Update', !0);
      },
      100,
      this
    );
  }),
  (Domcontroller.prototype.onShow = function () {
    (this.app.scene.layers.getLayerByName('Lightroom').enabled = !0),
      (this.app.scene.layers.getLayerByName('Lightroom-Top').enabled = !0);
    var e = document.querySelectorAll('table, input, .container');
    e.length > 0 &&
      e.forEach(function (e) {
        var t = e.currentDisplay + '';
        (e.style.display = t), (e.setByDOMController = !1);
      });
  }),
  (Domcontroller.prototype.onHide = function () {
    (this.app.scene.layers.getLayerByName('Lightroom').enabled = !1),
      (this.app.scene.layers.getLayerByName('Lightroom-Top').enabled = !1);
    var e = document.querySelectorAll('table, input, .container');
    e.length > 0 &&
      e.forEach(function (e) {
        if (e.setByDOMController) return !1;
        var t = e.style.display + '';
        (e.currentDisplay = t || 'block'),
          'TABLE' == e.tagName && (e.currentDisplay = 'table'),
          (e.style.display = 'none'),
          (e.setByDOMController = !0);
      });
  });
var StateTrigger = pc.createScript('stateTrigger');
StateTrigger.attributes.add('onEnabled', {
  type: 'string',
}),
  StateTrigger.attributes.add('onDisabled', {
    type: 'string',
  }),
  (StateTrigger.prototype.initialize = function () {
    this.on('state', this.onStateChange, this), this.onStateChange(!0);
  }),
  (StateTrigger.prototype.onStateChange = function (t) {
    !0 === t ? this.triggerFunction(this.onEnabled) : this.triggerFunction(this.onDisabled);
  }),
  (StateTrigger.prototype.triggerFunction = function (t) {
    var e = t.split(', ');
    if (e.length > 0)
      for (var i in e) {
        var r = e[i],
          a = r.split('@');
        if (a.length > 1) {
          var n = a[0],
            g = a[1];
          this.app.fire(n, g);
        } else this.app.fire(r, !0);
      }
  });
var AssetLoader = pc.createScript('assetLoader');
(AssetLoader.prototype.initialize = function () {
  this.app.on('Game:Found', this.loadLater, this);
}),
  (AssetLoader.prototype.loadLater = function () {
    var a = this.app.assets.findByTag('LoadLater');
    for (var t in a) {
      var e = a[t];
      this.app.assets.load(e), e.ready(function () {});
    }
  });
var GroupAction = pc.createScript('groupAction');
GroupAction.attributes.add('actions', {
  type: 'json',
  schema: [
    {
      name: 'entity',
      type: 'entity',
    },
    {
      name: 'action',
      type: 'string',
    },
    {
      name: 'delay',
      type: 'number',
      default: 0,
      title: 'Delay (1s)',
    },
    {
      name: 'global',
      type: 'boolean',
      default: !1,
    },
  ],
  array: !0,
}),
  (GroupAction.prototype.initialize = function () {
    this.app.on('GroupAction:' + this.entity.name, this.onTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (GroupAction.prototype.onDestroy = function (t) {
    this.app.off('GroupAction:' + this.entity.name, this.onTrigger, this);
  }),
  (GroupAction.prototype.triggerAction = function (t, i, o, n) {
    var e = o.split('@');
    t
      ? e.length > 1
        ? this.app.fire(e[0], e[1])
        : this.app.fire(o, n)
      : e.length > 1
      ? i.fire(e[0], e[1])
      : i.fire(o, n);
  }),
  (GroupAction.prototype.onTrigger = function (t) {
    var i = this;
    for (var o in this.actions) {
      var n = this.actions[o];
      n.delay > 0
        ? setTimeout(
            function (o) {
              i.triggerAction(o.global, o.entity, o.action, t);
            },
            1e3 * n.delay,
            n
          )
        : i.triggerAction(n.global, n.entity, n.action, t);
    }
  });
var CustomColor = pc.createScript('customColor');
CustomColor.attributes.add('key', {
  type: 'string',
  default: 'message',
}),
  (CustomColor.prototype.initialize = function () {
    this.app.on('CustomColor:' + this.entity.name, this.setCustomColor, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (CustomColor.prototype.onDestroy = function () {
    this.app.off('CustomColor:' + this.entity.name, this.setCustomColor, this);
  }),
  (CustomColor.prototype.setCustomColor = function (t) {
    var o = t[this.key];
    (o && o.r && o.g && o.b) || (o = Utils.hex2RGB(o)), (this.entity.element.color = o);
  });
var PlaySound = pc.createScript('playSound');
(PlaySound.prototype.initialize = function () {
  this.entity.on('PlaySound', this.onPlaySound, this),
    this.app.on('Sound:' + this.entity.name, this.onPlaySound, this);
}),
  (PlaySound.prototype.onPlaySound = function (n) {
    this.entity.sound.play(n);
  });
var Hover = pc.createScript('hover');
Hover.attributes.add('hasOrigin', {
  type: 'boolean',
  default: !1,
}),
  Hover.attributes.add('hoverType', {
    type: 'string',
    enum: [
      {
        Scale: 'Scale',
      },
      {
        Opacity: 'Opacity',
      },
    ],
    default: 'Scale',
  }),
  (Hover.prototype.initialize = function () {
    (this.items = []),
      this.app.on('Hover:' + this.entity.name, this.onSet, this),
      this.app.on('Select:' + this.entity.name, this.onSelect, this),
      this.app.on('Index:' + this.entity.name, this.onIndexTrigger, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Hover.prototype.onDestroy = function () {
    this.app.off('Hover:' + this.entity.name, this.onSet, this);
  }),
  (Hover.prototype.onSet = function () {
    for (var t in ((this.items = this.entity.findByTag('Hover')), this.items)) {
      !1 === this.items[t].enabled && this.items.splice(parseInt(t), 1);
    }
  }),
  (Hover.prototype.onSelect = function (t) {
    for (var e in this.items) {
      var i = this.items[e],
        o = i;
      this.hasOrigin && (o = i.findByName('Origin')),
        'Scale' == this.hoverType
          ? o && (t == i ? o.setLocalScale(1.15, 1.15, 1.15) : o.setLocalScale(1, 1, 1))
          : (i.element.opacity = t == i ? 1 : 0.3);
    }
  }),
  (Hover.prototype.onIndexTrigger = function (t) {
    this.items[t] && this.items[t].script.button.onPressFire();
  });
var AttachToBone = pc.createScript('attachTobone');
AttachToBone.attributes.add('relations', {
  type: 'json',
  schema: [
    {
      name: 'entity',
      type: 'entity',
    },
    {
      name: 'bone',
      type: 'string',
    },
    {
      name: 'attach',
      type: 'boolean',
      default: !0,
    },
  ],
  array: !0,
}),
  AttachToBone.attributes.add('isDebug', {
    type: 'boolean',
  }),
  (AttachToBone.prototype.initialize = function () {
    var t = this,
      e = this.entity.model.asset;
    this.app.assets.get(e).ready(function () {
      t.onLoad();
    });
  }),
  (AttachToBone.prototype.onLoad = function () {
    for (var t in (this.isDebug, this.relations)) {
      var e = this.relations[t];
      e.attach &&
        (e.entity.reparent(this.entity.findByName(e.bone)), e.entity.setLocalScale(100, 100, 100));
    }
  });
var Select = pc.createScript('select');
Select.attributes.add('options', {
  type: 'string',
  array: !0,
}),
  Select.attributes.add('defaultIndex', {
    type: 'number',
    default: 0,
  }),
  Select.attributes.add('fontSize', {
    type: 'number',
    default: 1,
  }),
  Select.attributes.add('padding', {
    type: 'number',
    default: 0,
  }),
  Select.attributes.add('scaleUnit', {
    type: 'string',
    enum: [
      {
        'Viewport Width': 'vw',
      },
      {
        'Viewport Height': 'vh',
      },
      {
        Pixel: 'px',
      },
    ],
    default: 'vw',
  }),
  Select.attributes.add('storeValue', {
    type: 'boolean',
  }),
  Select.attributes.add('color', {
    type: 'rgb',
  }),
  Select.attributes.add('fontFamily', {
    type: 'string',
    default: 'Arial, sans-serif',
  }),
  Select.attributes.add('triggerChange', {
    type: 'string',
  }),
  Select.attributes.add('key', {
    type: 'string',
  }),
  Select.attributes.add('containerEntity', {
    type: 'entity',
  }),
  (Select.prototype.initialize = function () {
    (this.isDestroyed = !1),
      this.createElement(),
      this.updateStyle(),
      this.app.on('DOM:Clear', this.onDOMClear, this),
      this.app.on('DOM:Update', this.onDomUpdate, this),
      this.on(
        'state',
        function (t) {
          this.entity.enabled ? this.createElement() : this.onDestroy();
        },
        this
      ),
      this.on(
        'destroy',
        function (t) {
          this.onDestroy();
        },
        this
      );
  }),
  (Select.prototype.createElement = function () {
    (this.element = document.createElement('select')),
      (this.element.style.position = 'absolute'),
      (this.element.style.fontFamily = this.fontFamily),
      (this.element.style.border = '0px'),
      (this.element.style.background = 'transparent'),
      (this.element.style.fontSize = this.fontSize + this.scaleUnit),
      (this.element.style.padding = this.padding + this.scaleUnit),
      (this.element.style.boxSizing = 'border-box');
    var t =
      'rgb(' + 255 * this.color.r + ', ' + 255 * this.color.g + ', ' + 255 * this.color.b + ')';
    for (var e in ((this.element.style.color = t),
    (this.element.style.outline = 'none'),
    this.containerEntity
      ? ((this.element.style.position = 'fixed'),
        this.containerEntity.script.container.insideElement.appendChild(this.element))
      : document.body.appendChild(this.element),
    (this.isDestroyed = !1),
    this.options)) {
      var i = this.options[e],
        n = document.createElement('option');
      (n.value = i),
        (n.innerText = i),
        this.defaultIndex == parseInt(e) && (n.selected = !0),
        this.element.appendChild(n);
    }
    ((this.element.selectedIndex = this.defaultIndex),
    (this.element.onchange = this.onChange.bind(this)),
    this._updateStyle(),
    this.storeValue) &&
      window.localStorage.getItem(this.entity._guid) &&
      (this.element.selectedIndex = window.localStorage.getItem(this.entity._guid));
  }),
  (Select.prototype.onDOMClear = function () {
    this.entity.destroy();
  }),
  (Select.prototype.onDomUpdate = function () {
    this._updateStyle();
  }),
  (Select.prototype.onDestroy = function () {
    (this.isDestroyed = !0),
      this.element && this.element.remove(),
      this.app.off('Select:' + this.entity.name, this.setValue, this);
  }),
  (Select.prototype.onChange = function () {
    if (
      (this.storeValue &&
        window.localStorage.setItem(this.entity._guid, this.element.selectedIndex),
      this.triggerChange)
    ) {
      var t = this.triggerChange.split(', ');
      if (t.length > 0)
        for (var e in t) {
          var i = t[e],
            n = i.split('@');
          if (n.length > 1) {
            var s = n[0],
              l = n[1];
            this.app.fire(s, l);
          } else this.app.fire(i, this.getValue());
        }
    }
  }),
  (Select.prototype.updateStyle = function () {
    if (this.currentWidth == window.innerWidth && this.currentHeight == window.innerHeight)
      return !1;
    this._updateStyle(),
      (this.currentWidth = window.innerWidth),
      (this.currentHeight = window.innerHeight);
  }),
  (Select.prototype._updateStyle = function () {
    if (this.isDestroyed) return !1;
    var t = this;
    if (t.entity && t.entity.element && t.entity.element.screenCorners) {
      var e = t.entity.element.screenCorners,
        i = 1 / t.app.graphicsDevice.maxPixelRatio,
        n = 0,
        s = 0,
        l = 0,
        o = (e[2].x - e[0].x) * i,
        a = (e[2].y - e[0].y) * i;
      if (this.containerEntity) {
        var r = this.containerEntity.scaleX,
          h = this.containerEntity.scaleY,
          c =
            0.9 == t.app.graphicsDevice.maxPixelRatio
              ? e[0].y
              : (e[0].y / t.app.graphicsDevice.maxPixelRatio) * 0.9,
          p =
            0.9 == t.app.graphicsDevice.maxPixelRatio
              ? this.containerEntity.offsetTop
              : (this.containerEntity.offsetTop / t.app.graphicsDevice.maxPixelRatio) * 0.9;
        (n = 1 / 0.9),
          (s = (e[0].x - this.containerEntity.offsetLeft) / r),
          (l =
            (c - p) / h -
            t.entity.element.height +
            this.containerEntity.element.height -
            (t.entity.element.height / 2 - 5)),
          this.containerEntity &&
            this.containerEntity.script.container.autoResize &&
            ((this.element.style.transform = 'scale(' + 1 / r + ', ' + 1 / h + ')'),
            (this.element.style.transformOrigin = 'left bottom'));
      } else (s = e[0].x), (l = e[0].y);
      (t.element.style.left = s * i + 'px'),
        (this.element.style.bottom = l * (0 != n ? n : i) + 'px'),
        (t.element.style.width = o + 'px'),
        (t.element.style.height = a + 'px');
    }
  }),
  (Select.prototype.getValue = function () {
    return this.element.value;
  }),
  (Select.prototype.setValue = function (t) {
    this.key && t && t[this.key] && (this.element.value = t[this.key]);
  });
var Scrollview = pc.createScript('scrollview');
Scrollview.attributes.add('speed', {
  type: 'number',
  default: 1,
}),
  (Scrollview.prototype.initialize = function () {
    this.entity.scrollview.on('set:scroll', this.setScroll, this),
      this.entity.element.on('mousewheel', this.onWheel, this);
  }),
  (Scrollview.prototype.onWheel = function (e) {
    e.event.deltaY > 0
      ? (this.entity.scrollview.scroll.y = -this.speed)
      : (this.entity.scrollview.scroll.y = 1 + this.speed);
  }),
  (Scrollview.prototype.setScroll = function () {
    this.app.fire('DOM:Update', !0);
  });
var hardwareCheck = {
  init: function () {
    try {
      this.checkHardware();
    } catch (e) {
      console.log('Probably private mode', e);
    }
  },
  checkHardware: function () {
    if (!window.localStorage.getItem('HardwareCheck')) {
      var e = document.querySelector('#application-canvas').getContext('webgl2'),
        r = document
          .querySelector('#application-canvas')
          .getContext('webgl2')
          .getExtension('WEBGL_debug_renderer_info');
      'Google SwiftShader' == e.getParameter(r.UNMASKED_RENDERER_WEBGL) && this.showAlert();
    }
  },
  close: function () {
    this.popupElement.remove();
    try {
      window.localStorage.setItem('HardwareCheck', 'Checked');
    } catch (e) {
      console.log('Probably private mode');
    }
  },
  showAlert: function () {
    var e = document.createElement('div');
    (e.className = 'hardwareError'),
      (e.innerHTML =
        '<h4>Better Performance</h4><div class="hardware-error-content"><p>Looks like you have performance issues, in order to have a better performance</p><p>Enable hardware acceleration for your browser.</p><p>In Chrome, go to <b>Chrome Menu > Settings > Advanced</b>. Under System, enable Use <b>hardware acceleration</b> when available.</p><p>Relaunch your browser if needed.</p><a class="close-hardware-popup" href="javascript:hardwareCheck.close()">Click here to close that screen.</a></div>'),
      document.body.appendChild(e),
      (this.popupElement = e);
  },
};
hardwareCheck.init();
var CustomCss = pc.createScript('customCss');
CustomCss.attributes.add('files', {
  type: 'asset',
  assetType: 'css',
  array: !0,
}),
  (CustomCss.prototype.initialize = function () {
    var s = 0,
      e = this.files.length;
    for (var t in this.files) {
      var a = this.files[t];
      this.app.assets.load(a),
        a.ready(function (t) {
          var a = document.createElement('style');
          (a.innerHTML = t.resource),
            document.body.appendChild(a),
            s++,
            e === s && pc.app.fire('CustomCSS:Loaded', !0);
        });
    }
  });
var accountManager = {
    serviceURL: 'https://gateway.venge.io/',
    init: function () {
      Credentials.createElement(),
        Credentials.navbarTop(),
        Credentials.LoginModal(),
        Credentials.SignupModal(),
        pc.app.on('AccountManager:Signup', function () {
          (Credentials.shadow.className = 'active'),
            accountManager.switch('Signup'),
            (pc.isButtonLocked = !0);
        }),
        pc.app.on('AccountManager:Login', function () {
          (Credentials.shadow.className = 'active'),
            accountManager.switch('Login'),
            (pc.isButtonLocked = !0);
        });
    },
    switch: function (e) {
      'Login' == e &&
        (Credentials.navbarLogin.classList.remove('inactive'),
        Credentials.navbarSignup.classList.add('inactive'),
        Credentials.loginModal.classList.remove('inactive'),
        Credentials.signupModal.classList.remove('active')),
        'Signup' == e &&
          (Credentials.navbarLogin.classList.add('inactive'),
          Credentials.navbarSignup.classList.remove('inactive'),
          Credentials.loginModal.classList.add('inactive'),
          Credentials.signupModal.classList.add('active'));
    },
    close: function () {
      (Credentials.shadow.className = ''), (pc.isButtonLocked = !1);
    },
    login: function (e) {
      var n = document.getElementById('modal-login-text');
      (n.style.backgroundColor = '#870909'),
        (n.style.width = '70%'),
        (n.innerHTML = '' + e.message),
        setTimeout(function () {
          (n.innerHTML =
            'Enter your username and password for Login. If you dont have an account, go to "Create Account" menu.'),
            (n.style.backgroundColor = '#14171f'),
            (n.style.width = 'fit-content');
        }, 5e3),
        1 == e.success
          ? (pc.app.fire('Trigger:Login', !0),
            pc.app.fire('Fetcher:MiniProfile', !0),
            accountManager.close())
          : ((loginButton.innerHTML = 'LOGIN<div id="chevron-arrow-right"></div>'),
            loginButton.classList.remove('button-disable'));
    },
    signup: function (e) {
      var n = document.getElementById('modal-signup-text');
      (n.style.backgroundColor = '#870909'),
        (n.style.width = '70%'),
        (n.innerHTML = '' + e.message),
        !0 === e.success
          ? (pc.app.fire('Fetcher:MiniProfile', !0), accountManager.close())
          : 'undefined' != signupButton &&
            ((signupButton.innerHTML = 'SIGNUP<div id="chevron-arrow-right"></div>'),
            signupButton.classList.remove('button-disable')),
        setTimeout(function () {
          (n.innerHTML = 'If you have an account already, go to "Login" menu.'),
            (n.style.backgroundColor = '#14171f'),
            (n.style.width = 'fit-content');
        }, 5e3);
    },
    service: function (e, n, t) {
      this.loading = !0;
      var a = this,
        i = Object.keys(n)
          .map(function (e) {
            return encodeURIComponent(e) + '=' + encodeURIComponent(n[e]);
          })
          .join('&'),
        o = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      o.open('POST', this.serviceURL + e),
        (o.onreadystatechange = function () {
          (a.loading = !1), o.readyState > 3 && 200 == o.status && t(JSON.parse(o.responseText));
        }),
        (o.withCredentials = !0),
        o.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
        o.send(i);
    },
  },
  Credentials = {
    createElement: function () {
      (this.loginModal = document.createElement('div')),
        (this.loginModal.id = 'modal-login'),
        (this.signupModal = document.createElement('div')),
        (this.signupModal.id = 'modal-signup'),
        (this.navbar = document.createElement('div')),
        (this.navbar.id = 'navbar'),
        (this.loginSignupContainer = document.createElement('div')),
        (this.loginSignupContainer.id = 'loginSignupContainer'),
        (this.shadow = document.createElement('div')),
        (this.shadow.id = 'popup-shadow'),
        (this.modal = document.createElement('div')),
        (this.modal.id = 'modal'),
        document.body.appendChild(this.shadow),
        this.shadow.append(this.modal),
        this.modal.append(this.navbar, this.loginSignupContainer),
        this.loginSignupContainer.append(this.loginModal, this.signupModal),
        document.body.appendChild(this.shadow);
    },
    navbarTop: function () {
      var e = document.createElement('div');
      e.id = 'navbarContainer';
      var n = document.createElement('ul');
      (n.id = 'navbarUL'),
        (this.navbarLogin = document.createElement('li')),
        (this.navbarLogin.id = 'navbarLoginBtn'),
        (this.navbarLogin.innerHTML = '<p>Login</p>'),
        (this.navbarLogin.onclick = function () {
          accountManager.switch('Login');
        }),
        (this.navbarSignup = document.createElement('li')),
        (this.navbarSignup.id = 'navbarSignupBtn'),
        (this.navbarSignup.innerHTML = '<p>Signup</p>'),
        this.navbarSignup.classList.add('inactive'),
        (this.navbarSignup.onclick = function () {
          accountManager.switch('Signup');
        });
      var t = document.createElement('div');
      t.id = 'closeBtnContainer';
      var a = document.createElement('button');
      (a.id = 'modal-close-button'),
        (a.innerHTML = '&times;'),
        (a.onclick = function () {
          accountManager.close();
        }),
        this.navbar.append(e, t),
        e.appendChild(n),
        n.append(this.navbarLogin, this.navbarSignup),
        t.appendChild(a);
    },
    LoginModal: function () {
      var e = document.createElement('form');
      (e.id = 'login-Form'),
        (loginHeaderTitle = document.createElement('div')),
        (loginHeaderTitle.id = 'modal-title');
      var n = document.createElement('div');
      n.id = 'modal-login-info';
      var t = document.createElement('p');
      (t.id = 'modal-login-text'),
        (t.innerHTML =
          'Enter your username and password for Login. If you dont have an account, go to "Create Account" menu.');
      var a = document.createElement('div');
      a.id = 'modal-login-body';
      var i = document.createElement('div');
      (i.id = 'modal-login-username-container'), (i.innerHTML = '<p>Username</p>');
      var o = document.createElement('input');
      (o.id = 'login_username'),
        (o.name = 'loginUsername'),
        (o.placeholder = 'Username'),
        (o.type = 'text');
      var d = document.createElement('div');
      (d.id = 'modal-login-password-container'), (d.innerHTML = '<p>Password</p>');
      var r = document.createElement('input');
      (r.id = 'login_password'),
        (r.name = 'loginPassword'),
        (r.placeholder = 'Password'),
        (r.type = 'password');
      var s = document.createElement('div');
      (s.id = 'modal-login-button-container'),
        (loginButton = document.createElement('button')),
        loginButton.classList.add('login-button'),
        (loginButton.innerHTML = 'LOGIN<div id="chevron-arrow-right"></div>'),
        loginButton.addEventListener('click', function (e) {
          e.preventDefault(),
            (loginButton.innerHTML =
              '<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>'),
            loginButton.classList.add('button-disable');
          var n = document.getElementById('login-Form'),
            t = (new FormData(n), document.getElementById('login_username').value),
            a = document.getElementById('login_password').value;
          accountManager.service(
            '?request=login',
            {
              username: t,
              password: a,
            },
            accountManager.login
          );
        }),
        this.loginModal.append(n, a),
        a.appendChild(e),
        e.append(i, d, s),
        n.appendChild(t),
        i.appendChild(o),
        d.appendChild(r),
        s.appendChild(loginButton);
    },
    SignupModal: function () {
      var e = document.createElement('form');
      (e.id = 'signup-Form'),
        (signupHeaderTitle = document.createElement('div')),
        (signupHeaderTitle.id = 'modal-title');
      var n = document.createElement('div');
      n.id = 'modal-signup-info';
      var t = document.createElement('p');
      (t.id = 'modal-signup-text'),
        (t.innerHTML = 'If you have an account already, go to "Login" menu.');
      var a = document.createElement('div');
      a.id = 'modal-signup-body';
      var i = document.createElement('div');
      (i.id = 'modal-signup-username-container'), (i.innerHTML = '<p>Username</p>');
      var o = document.createElement('input');
      (o.id = 'signup_username'),
        (o.placeholder = 'Username'),
        (o.type = 'text'),
        (o.name = 'signupUsername');
      var d = document.createElement('div');
      (d.id = 'modal-signup-password-container'), (d.innerHTML = '<p>Password</p>');
      var r = document.createElement('input');
      (r.id = 'signup_password'),
        (r.placeholder = 'Password'),
        (r.type = 'password'),
        (r.name = 'signupPassword');
      var s = document.createElement('div');
      s.id = 'modal-signup-button-container';
      var c = document.createElement('button');
      c.classList.add('signup-button'),
        (c.innerHTML = 'SIGNUP<div id="chevron-arrow-right"></div>'),
        c.addEventListener('click', function (e) {
          e.preventDefault(),
            (c.innerHTML =
              '<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>'),
            c.classList.add('button-disable');
          var n = document.getElementById('signup-Form'),
            t = (new FormData(n), document.getElementById('signup_username').value),
            a = document.getElementById('signup_password').value;
          accountManager.service(
            '?request=create_account',
            {
              username: t,
              password: a,
            },
            accountManager.signup
          );
        }),
        this.signupModal.append(n, a),
        a.append(e),
        e.append(i, d, s),
        n.appendChild(t),
        i.appendChild(o),
        d.appendChild(r),
        s.appendChild(c);
    },
  };
var Fresnel = pc.createScript('fresnel');
Fresnel.attributes.add('MeshInstance', {
  type: 'number',
  default: 0,
}),
  Fresnel.attributes.add('Power', {
    type: 'number',
    default: 5,
  }),
  Fresnel.attributes.add('Stroke', {
    type: 'number',
    default: 0.5,
  }),
  Fresnel.attributes.add('colourA', {
    type: 'rgba',
  }),
  Fresnel.attributes.add('colourB', {
    type: 'rgba',
  }),
  Fresnel.attributes.add('burningSpeed', {
    type: 'number',
    default: 0.2,
  }),
  Fresnel.attributes.add('burningTexture', {
    type: 'asset',
    assetType: 'texture',
  }),
  (Fresnel.prototype.initialize = function () {
    (this.isLoaded = !1),
      (this.isTextureLoaded = !1),
      (this.time = 0),
      (this.isBurning = !1),
      (this.intensity = 0);
    var e = this;
    this.app.assets.load(this.burningTexture),
      this.burningTexture.ready(function () {
        e.isTextureLoaded = !0;
      }),
      this.entity.on('Character:Loaded', this.onCharacterLoaded, this);
  }),
  (Fresnel.prototype.onCharacterLoaded = function () {
    this.onLoaded(this);
  }),
  (Fresnel.prototype.onLoaded = function () {
    return (
      !!this.entity.model &&
      !!this.entity.model.meshInstances &&
      0 !== this.entity.model.meshInstances.length &&
      ((this.material =
        this.entity.model.meshInstances[parseInt(this.MeshInstance)].material.clone()),
      (this.entity.model.meshInstances[parseInt(this.MeshInstance)].material = this.material),
      (this.material.chunks.emissivePS =
        '#ifdef MAPCOLOR\nuniform vec3 material_emissive;\n#endif\nuniform float material_emissiveIntensity;\n#ifdef MAPTEXTURE\nuniform sampler2D texture_emissiveMap;\n#endif\nvec3 getEmission() {\n    float fresnel = dot(dNormalW, dViewDirW);    vec3 colourA = vec3(' +
        this.colourA.r +
        ', ' +
        this.colourA.g +
        ', ' +
        this.colourA.b +
        ');    vec3 colourB = vec3(' +
        this.colourB.r +
        ', ' +
        this.colourB.g +
        ', ' +
        this.colourB.b +
        ');    vec3 emission = material_emissiveIntensity * mix(colourA, colourB, min(1.0, pow(' +
        this.Stroke.toFixed(2) +
        ' + fresnel, ' +
        this.Power.toFixed(2) +
        ')));\n    #ifdef MAPFLOAT\n    emission *= material_emissiveIntensity;\n    #endif\n    #ifdef MAPTEXTURE\n    emission *= $texture2DSAMPLE(texture_emissiveMap, $UV).$CH;\n    #endif\n    return emission;\n}\n\n'),
      this.isTextureLoaded &&
        ((this.material.chunks.startPS =
          'uniform sampler2D burning_texture;\nuniform float time;\nvoid main(void) {\ndDiffuseLight = vec3(0);\ndSpecularLight = vec3(0);\ndReflection = vec4(0);\ndSpecularity = vec3(0);\nfloat height = 0.0;\nif(time > 0.0){\nheight = texture2D(burning_texture, vUv0).r;\nif (height < time) {\n   discard;\n}\n}\n'),
        (this.material.chunks.endPS =
          '   gl_FragColor.rgb = combineColor();\n   gl_FragColor.rgb += getEmission();\n   gl_FragColor.rgb = addFog(gl_FragColor.rgb);\n   #ifndef HDR\n   gl_FragColor.rgb = toneMap(gl_FragColor.rgb);\n   gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);\n    #endif\nif (time > 0.0 && height < (time + 0.2)) {\n   gl_FragColor.rgb = vec3(0.2, 0.0, 0.0);\n}\n'),
        this.material.setParameter('burning_texture', this.burningTexture.resource)),
      this.material.setParameter('material_emissiveIntensity', this.intensity),
      this.material.setParameter('time', this.time),
      this.material.update(),
      this.entity.on('Frensel:Damage', this.onDamage, this),
      this.entity.on('Frensel:Burn', this.setBurn, this),
      this.entity.on('Frensel:ResetBurn', this.resetBurn, this),
      void (this.isLoaded = !0))
    );
  }),
  (Fresnel.prototype.resetBurn = function (e) {
    (this.isBurning = !1), (this.time = 0), this.material.setParameter('time', this.time);
  }),
  (Fresnel.prototype.setBurn = function (e) {
    this.isBurning = !0;
  }),
  (Fresnel.prototype.onDamage = function (e) {
    (this.intensity = 10), (this.lastDamage = Date.now());
  }),
  (Fresnel.prototype.update = function (e) {
    if (!this.isLoaded) return !1;
    this.isBurning &&
      this.isTextureLoaded &&
      (this.material.setParameter('time', this.time), (this.time += e * this.burningSpeed)),
      Date.now() - this.lastDamage < 2e3 &&
        Date.now() - this.lastDamage > 100 &&
        (this.material.setParameter('material_emissiveIntensity', this.intensity),
        (this.intensity = pc.math.lerp(this.intensity, 0, 0.25)));
  });
var DealtDamage = pc.createScript('dealtDamage');
DealtDamage.attributes.add('numberEntity', {
  type: 'entity',
}),
  (DealtDamage.prototype.initialize = function () {
    (this.numbers = []),
      (this.lastDamage = 100),
      (this.cameraEntity = this.app.root.findByName('Lens')),
      (this.numberEntity.enabled = !1),
      this.app.on('DealtDamage:Trigger', this.onDamageDealt, this);
  }),
  (DealtDamage.prototype.destroyEntity = function (t) {
    this.numbers.splice(this.numbers.indexOf(t), 1), t.destroy();
  }),
  (DealtDamage.prototype.onDamageDealt = function (t, e, a) {
    var i = this.numberEntity.clone();
    (i.element.text = t > 0 ? Math.round(t) + '' : t),
      (i.player = e),
      (i.element.offsetX = 50 * Math.random() - 50 * Math.random()),
      (i.element.offsetY = 20 * -Math.random() + 50),
      (i.element.opacity = 0);
    var n = 2,
      o = 0.8;
    a && ((n = 3), (o = 1), (i.element.color = pc.colors.explosive)), (this.lastDamage = t);
    var s = i.tween(i.getLocalScale()).to(
      {
        x: n,
        y: n,
        z: n,
      },
      0.3,
      pc.BounceOut
    );
    s.on('complete', function () {
      this.entity
        .tween(this.entity.getLocalScale())
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0.5,
          pc.BounceOut
        )
        .start();
    }),
      s.start(),
      this.entity.sound.play('Hit-Impact'),
      i
        .tween(i.element)
        .to(
          {
            opacity: 1,
          },
          0.4,
          pc.Linear
        )
        .start()
        .on('complete', function () {
          i.tween(i.element)
            .to(
              {
                opacity: 0,
                offsetY: 150,
              },
              o,
              pc.Linear
            )
            .start();
        }),
      setTimeout(
        function (t, e) {
          t.destroyEntity(e);
        },
        3e3,
        this,
        i
      ),
      this.numbers.push(i),
      this.entity.addChild(i);
  }),
  (DealtDamage.prototype.updateNumberPosition = function (t) {
    var e = new pc.Vec3(),
      a = this.cameraEntity.camera,
      i = this.app.graphicsDevice.maxPixelRatio,
      n = this.entity.screen.scale,
      o = this.app.graphicsDevice,
      s = t.player.getPosition();
    return (
      !!a &&
      !!t &&
      (a.worldToScreen(s, e),
      (e.x *= i),
      (e.y *= i),
      void (e.x > 0 &&
      e.x < this.app.graphicsDevice.width &&
      e.y > 0 &&
      e.y < this.app.graphicsDevice.height &&
      e.z > 0
        ? (t.setLocalPosition(
            e.x / n + t.element.offsetX,
            (o.height - e.y) / n + t.element.offsetY,
            0
          ),
          (t.element.outlineThickness = t.element.opacity),
          (t.enabled = !0))
        : (t.enabled = !1)))
    );
  }),
  (DealtDamage.prototype.update = function (t) {
    for (var e = this.numbers.length; e--; ) this.updateNumberPosition(this.numbers[e]);
  });
var MapLoader = pc.createScript('mapLoader');
MapLoader.attributes.add('mapHolder', {
  type: 'entity',
}),
  MapLoader.attributes.add('lightEntity', {
    type: 'entity',
  }),
  MapLoader.attributes.add('loadingEntity', {
    type: 'entity',
  }),
  (MapLoader.prototype.initialize = function () {
    (this.loadedModelsCount = 0),
      (this.totalModelsCount = 0),
      (this.entities = []),
      (this.mapEntities = []),
      (this.willBeBatched = []),
      (this.loadedTextures = 0),
      (this.totalTextures = 0),
      (this.mapData = {}),
      (this.app.loader.getHandler('container').crossOrigin = 'Anonymous'),
      (this.app.loader.getHandler('texture').crossOrigin = 'Anonymous'),
      (this.app.loader.getHandler('model').crossOrigin = 'Anonymous'),
      this.app.on('MapLoader:Load', this.setMap, this),
      this.app.on('MapLoader:Clear', this.clearMap, this),
      this.app.on('MapLoader:Remove', this.removeItem, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (MapLoader.prototype.onDestroy = function () {
    this.app.off('MapLoader:Load', this.setMap, this),
      this.app.off('MapLoader:Clear', this.clearMap, this),
      this.app.off('MapLoader:Remove', this.removeItem, this);
  }),
  (MapLoader.prototype.setMap = function (e) {
    clearTimeout(this.loadTimer),
      (this.currentMapWrapper = new pc.Entity('MapHolder')),
      this.mapHolder.addChild(this.currentMapWrapper),
      console.log('Map loader set map', e, this.mapHolder),
      (this.willBeBatched = []),
      (this.mapData = e),
      this.prepare(),
      this.loadingEntity && (this.loadingEntity.enabled = !0);
  }),
  (MapLoader.prototype.prepareBatches = function () {
    for (var e in this.willBeBatched) {
      var t = this.willBeBatched[e];
      this.app.fire('BatchManager:Create', t);
    }
  }),
  (MapLoader.prototype.onLoaded = function () {
    this.loadingEntity && (this.loadingEntity.enabled = !1),
      this.prepareBatches(),
      console.log('Fully loaded!'),
      clearTimeout(this.loadTimer),
      (this.loadTimer = setTimeout(
        function (e) {
          console.log('Batched!'),
            e.app.fire('CollisionScaler:Scale'),
            e.app.fire('BatchManager:Generate', !0);
        },
        1e4,
        this
      ));
  }),
  (MapLoader.prototype.loadMap = function () {
    var e = 'https://maps.venge.io/' + this.mapData.hash + '.json';
    this.service(e, this.placeModels.bind(this));
  }),
  (MapLoader.prototype.clearMap = function () {
    for (var e = this.mapEntities.length; e--; )
      this.mapEntities[e] && this.mapEntities[e].destroy();
  }),
  (MapLoader.prototype.placeModels = function (e) {
    this.clearMap();
    var t = e.objects;
    for (var a in t) this.createObject(t[a]);
    this.setSkybox(e.skybox);
  }),
  (MapLoader.prototype.setSkybox = function (e) {
    var t = this.app.assets.find(e.name);
    if (!e) return !1;
    this.app.assets.load(t),
      t.ready(function () {
        pc.app.scene.skybox = t.resource;
      });
    var a = this.lightEntity.clone();
    (a.light.color = Utils.hex2RGB(e.sunColor)),
      (a.light.intensity = e.intensity),
      (a.enabled = !0),
      this.currentMapWrapper.addChild(a),
      this.mapEntities.push(a);
    var o = Utils.hex2RGB(e.ambientColor);
    (this.app.scene.ambientLight.r = o.r),
      (this.app.scene.ambientLight.g = o.g),
      (this.app.scene.ambientLight.b = o.b),
      (this.app.scene.skyboxIntensity = e.skyboxIntensity),
      this.app.fire('Loader:SetSkybox', e);
  }),
  (MapLoader.prototype.findItemByName = function (e) {
    var t = !1;
    for (var a in this.entities) {
      var o = this.entities[a];
      e == o.name && (t = o);
    }
    return t;
  }),
  (MapLoader.prototype.createCustomObject = function (e) {
    var t = new pc.Entity(e.name);
    if (('CapturePoint' == e.name && t.tags.add('Objective'), e.tags))
      for (var a in e.tags) t.tags.add(e.tags[a]);
    t.setLocalPosition(e.position.x, e.position.y, e.position.z),
      e.scale &&
        e.scale.x &&
        e.scale.y &&
        e.scale.z &&
        t.setLocalScale(e.scale.x, e.scale.y, e.scale.z),
      (t.enabled = !0),
      this.currentMapWrapper.addChild(t),
      this.mapEntities.push(t);
  }),
  (MapLoader.prototype.createObject = function (e) {
    var t = this.findItemByName(e.name);
    if (!t) return this.createCustomObject(e), !1;
    if (t.tags.list().indexOf('Hidden') > -1) return !1;
    var a = t.clone();
    if (
      ((a.model.castShadows = !0),
      (a.model.receiveShadows = !0),
      this.willBeBatched.push(a),
      e.script_data &&
        (a.addComponent('script'), a.script.create(e.script_data.name, e.script_data.attributes)),
      e.guid && (a.server_id = e.guid),
      e.tags)
    )
      for (var o in e.tags) a.tags.add(e.tags[o]);
    a.setEulerAngles(e.rotation.x, e.rotation.y, e.rotation.z),
      a.setPosition(e.position.x, e.position.y, e.position.z),
      (a.originalScale = e.originalScale),
      e.scale &&
        e.scale.x &&
        e.scale.y &&
        e.scale.z &&
        a.setLocalScale(e.scale.x, e.scale.y, e.scale.z),
      (a.enabled = !0),
      this.currentMapWrapper.addChild(a),
      this.mapEntities.push(a);
  }),
  (MapLoader.prototype.removeItem = function (e) {
    for (var t in this.mapEntities) {
      var a = this.mapEntities[t];
      if (a && a.server_id == e) {
        a.setPosition(1e3, 1e3, 1e3);
        var o = a.findByName('Collision');
        o && o.destroy();
      }
    }
  }),
  (MapLoader.prototype.prepare = function () {
    this.service(
      'https://gateway.venge.io/editor.php?hash=' + this.mapData.hash,
      this.setModels.bind(this)
    );
  }),
  (MapLoader.prototype.setModels = function (e) {
    for (var t in ((this.loadedModelsCount = 0), (this.totalModelsCount = e.length - 1), e)) {
      var a = e[t];
      this.loadModel(a);
    }
  }),
  (MapLoader.prototype.loadModel = function (e) {
    var t = this;
    if (e.model.search('.json') > -1) return !1;
    this.app.assets.loadFromUrl(e.model, 'container', function (a, o) {
      if (!o.resource) return !1;
      var i = new pc.Entity(e.name);
      for (var s in (i.addComponent('model'),
      (i.model.asset = o.resource.model),
      (t.totalTextures += e.textures.length),
      e.textures)) {
        var r = e.textures[s];
        t.loadTexture(s, r, i);
      }
      for (var n in (i.setLocalScale(e.scale[0], e.scale[1], e.scale[2]), e.children)) {
        var p = e.children[n],
          d = new pc.Entity(p.name);
        for (var l in (d.addComponent('collision', p.collision),
        d.addComponent('rigidbody', {
          friction: 0.5,
          restitution: 0.5,
          type: pc.BODYTYPE_STATIC,
        }),
        p.tags)) {
          var c = p.tags[l];
          d.tags.add(c);
        }
        d.setLocalPosition(p.position[0], p.position[1], p.position[2]),
          d.setLocalEulerAngles(p.rotation[0], p.rotation[1], p.rotation[2]),
          i.addChild(d);
      }
      for (var h in e.tags) i.tags.add(e.tags[h]);
      (i.enabled = !1),
        t.currentMapWrapper.addChild(i),
        t.entities.push(i),
        t.loadedModelsCount++,
        t.loadedModelsCount == t.totalModelsCount && t.loadMap();
    });
  }),
  (MapLoader.prototype.loadTexture = function (e, t, a) {
    var o = new pc.StandardMaterial(),
      i = this;
    t.diffuseTexture &&
      (console.log('Load :', e, t.diffuseTexture),
      this.app.assets.loadFromUrl(t.diffuseTexture, 'texture', function (s, r) {
        console.log('Loaded asset : ', t.diffuseTexture),
          r &&
            r.resource &&
            ((o.diffuseMap = r.resource),
            t.diffuseTiling &&
              ((o.diffuseMapTiling.x = t.diffuseTiling[0]),
              (o.diffuseMapTiling.y = t.diffuseTiling[1])),
            t.diffuseColor &&
              ((o.diffuseTint = !0),
              (o.diffuse = new pc.Color(t.diffuseColor[0], t.diffuseColor[1], t.diffuseColor[2]))),
            i.loadedTextures++,
            (a.model.meshInstances[e].material = o),
            console.log(e, o, r.resource),
            i.loadedTextures >= i.totalTextures && i.onLoaded());
      })),
      t.opacityTexture &&
        this.app.assets.loadFromUrl(t.opacityTexture, 'texture', function (e, t) {
          t &&
            t.resource &&
            ((o.opacityMap = t.resource),
            (o.opacityMapChannel = 'a'),
            (o.blendType = pc.BLEND_NORMAL),
            (o.cull = pc.CULLFACE_NONE));
        }),
      t.diffuseTexture ||
        t.opacityTexture ||
        (i.loadedTextures++, i.loadedTextures >= i.totalTextures && i.onLoaded());
  }),
  (MapLoader.prototype.service = function (e, t) {
    var a = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    a.open('GET', e),
      (a.onreadystatechange = function () {
        a.readyState > 3 && 200 == a.status && t(JSON.parse(a.responseText));
      }),
      a.setRequestHeader('X-Requested-With', 'XMLHttpRequest'),
      a.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
      a.send();
  });
var BatchManager = pc.createScript('batchManager');
(BatchManager.prototype.initialize = function () {
  (this.worldLayer = this.app.scene.layers.getLayerByName('World')),
    (this.lastBatchId = 1e4),
    (this.groupIds = []),
    this.app.on('BatchManager:Create', this.createBatch, this),
    this.app.on('BatchManager:Generate', this.generate, this);
}),
  (BatchManager.prototype.generate = function () {
    this.app.batcher.generate(this.groupIds);
  }),
  (BatchManager.prototype.createBatch = function (a) {
    if ('Water' == a.name) return !1;
    var t = this.app.batcher.getGroupByName(a.name);
    console.log('[DEBUG] Batch group created : ', a.name),
      t ||
        (this.lastBatchId++,
        this.app.batcher.addGroup(a.name, !0, 100, this.lastBatchId),
        (t = this.app.batcher.getGroupByName(a.name)),
        this.groupIds.push(t.id)),
      (a.model.batchGroupId = t.id);
  });
var Banner = pc.createScript('banner');
Banner.attributes.add('bannerEntity', {
  type: 'entity',
}),
  Banner.attributes.add('groupEntity', {
    type: 'entity',
  }),
  Banner.attributes.add('dotEntity', {
    type: 'entity',
  }),
  Banner.attributes.add('dotHolder', {
    type: 'entity',
  }),
  Banner.attributes.add('width', {
    type: 'number',
    default: 512,
  }),
  Banner.attributes.add('duration', {
    type: 'number',
    default: 5,
  }),
  (Banner.prototype.initialize = function () {
    (this.index = 0),
      (this.total = 0),
      (this.dots = []),
      (this.bannerEntity.enabled = !1),
      (this.dotEntity.enable = !1),
      (this.timer = setInterval(
        function (t) {
          t && t.nextBanner && t.nextBanner();
        },
        1e3 * this.duration,
        this
      )),
      this.app.on('Banner:' + this.entity.name, this.setBanners, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Banner.prototype.onDestroy = function () {
    clearTimeout(this.timer);
  }),
  (Banner.prototype.nextBanner = function () {
    this.index > this.total - 1 && (this.index = 0), this.setBannerIndex(), this.index++;
  }),
  (Banner.prototype.setBannerIndex = function () {
    var t = -this.index * this.width;
    if (this.groupEntity && this.groupEntity.tween) {
      for (var n in (this.groupEntity
        .tween(this.groupEntity.getLocalPosition())
        .to(
          {
            x: t,
            y: 0,
            z: 0,
          },
          0.6,
          pc.ExponentialOut
        )
        .start(),
      this.dots)) {
        this.dots[n].setLocalScale(1, 1, 1);
      }
      var e = this.dots[this.index];
      e &&
        e
          .tween(e.getLocalScale())
          .to(
            {
              x: 2,
              y: 2,
              z: 2,
            },
            0.4,
            pc.ExponentialOut
          )
          .start();
    }
  }),
  (Banner.prototype.setBanners = function (t) {
    if ('string' == typeof t) return (this.index = parseInt(t)), this.setBannerIndex(), !1;
    if (!t.banners) return !1;
    for (var n in t.banners) {
      var e = t.banners[n],
        i = parseInt(n) * this.width,
        r = 30 * parseInt(n),
        a = this.bannerEntity.clone();
      a.setLocalPosition(i, 0, 0),
        'Fire' == e.type
          ? (a.script.button.fireFunction = e.action)
          : (a.script.button.triggerFunction = 'window.open("' + e.action + '")'),
        (a.enabled = !0),
        a.fire('CustomImage:Set', e),
        a.fire('EventButton:Set', 'Banner', e.slug);
      var s = this.dotEntity.clone();
      s.setLocalPosition(r, 0, 0),
        (s.script.button.fireFunction = 'Banner:' + this.entity.name + '@' + n),
        (s.enabled = !0),
        this.dotHolder.addChild(s),
        (this.dotHolder.element.width = 30 * t.banners.length),
        this.dots.push(s),
        this.groupEntity.addChild(a);
    }
    (this.total = t.banners.length), this.nextBanner();
  });
var EventButton = pc.createScript('eventButton');
(EventButton.prototype.initialize = function () {
  (this.currentKey = !1),
    (this.currentEvent = !1),
    this.entity.on('EventButton:Set', this.setEvent, this),
    this.entity.element.on('click', this.onClick, this);
}),
  (EventButton.prototype.setEvent = function (t, n) {
    (this.currentKey = t), (this.currentEvent = n);
  }),
  (EventButton.prototype.onClick = function () {
    this.currentEvent && this.app.fire('Analytics:Event', this.currentKey, this.currentEvent);
  });
var TypingText = pc.createScript('typingText');
TypingText.attributes.add('speed', {
  type: 'number',
  default: 1,
}),
  TypingText.attributes.add('background', {
    type: 'entity',
  }),
  (TypingText.prototype.initialize = function () {
    (this.text = []), (this.index = 0), this.entity.on('TypingText', this.onSet, this);
  }),
  (TypingText.prototype.onSet = function (t) {
    (this.text = t.split('')),
      (this.index = 0),
      this.entity.sound && this.entity.sound.play('Count');
  }),
  (TypingText.prototype.update = function (t) {
    var e = this.text.slice(0, Math.round(this.index)).join('');
    (e = e.replace(/_(.[a-zA-Z]*)/g, '[color="#000000"]\\[$1][/color]')),
      (this.entity.element.text = e),
      this.text.length > this.index && (this.index += this.speed * t),
      this.background && (this.background.element.width = this.entity.element.width + 20);
  });
var Quests = pc.createScript('quests');
Quests.attributes.add('cardEntity', {
  type: 'entity',
}),
  Quests.attributes.add('holderEntity', {
    type: 'entity',
  }),
  Quests.attributes.add('closeButtonEntity', {
    type: 'entity',
  }),
  (Quests.prototype.initialize = function () {
    (this.index = 0),
      (this.realIndex = 0),
      (this.quests = []),
      (this.originalQuests = []),
      this.app.on('Quests:Set', this.showQuests, this),
      this.app.on('Quests:Close', this.closeQuests, this),
      this.on('destroy', this.onDestroy, this);
  }),
  (Quests.prototype.onDestroy = function () {
    this.app.off('Quests:Set', this.showQuests, this),
      this.app.off('Quests:Close', this.closeQuests, this);
  }),
  (Quests.prototype.closeQuests = function () {
    (this.holderEntity.enabled = !1),
      (this.closeButtonEntity.enabled = !1),
      clearTimeout(this.nextQuestTimer);
  }),
  (Quests.prototype.filter = function (t) {
    var e = [],
      s = JSON.parse(Utils.getItem('Quests'));
    for (var i in t) {
      var n = t[i];
      (s && s[i] && n.total === s[i].total) || e.push(n);
    }
    return e;
  }),
  (Quests.prototype.showQuests = function (t) {
    0 === this.quests.length &&
      t &&
      ((this.originalQuests = t.quests), (this.quests = this.filter(t.quests))),
      this.setQuest();
  }),
  (Quests.prototype.hideQuests = function () {
    setTimeout(
      function (t) {
        Utils.setItem('Quests', JSON.stringify(t.originalQuests)), t.closeQuests();
      },
      3200,
      this
    );
  }),
  (Quests.prototype.setQuest = function () {
    if (this.index > this.quests.length - 1) return this.hideQuests(), !1;
    var t = this.quests[this.index];
    if (!t) return !1;
    this.index++, (this.holderEntity.enabled = !0), (this.closeButtonEntity.enabled = !0);
    var e = this.cardEntity.clone(),
      s = e.findByName('Thumbnail'),
      i = e.findByName('Title'),
      n = e.findByName('Fill'),
      o = e.findByName('Count'),
      u = (e.findByName('Checkpoint'), e.findByName('Check')),
      h = e.findByName('Success'),
      a = 0;
    (e.enabled = !0),
      (s.element.textureAsset = this.app.assets.find(t.icon)),
      (e.sound.pitch = 0.8 + 0.1 * this.index),
      (u.enabled = !1),
      (h.enabled = !1),
      e.setLocalPosition(0, -98 * this.realIndex, 0);
    var l = t.title.substr(0, 32),
      r = '.' == l[l.length - 1] ? '' : '...';
    if (
      (i.fire('TypingText', l + r),
      (n.script.timeline.endFrame.scale.x = (1 * t.total) / t.goal),
      n.script.timeline.onPlay(),
      setTimeout(function () {
        o.fire('Count', t.total);
      }, 1e3),
      t.total == t.goal &&
        (setTimeout(
          function (t) {
            (u.enabled = !0),
              e
                .tween(e.getLocalScale())
                .to(
                  {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                  },
                  0.2,
                  pc.BackOut
                )
                .start(),
              t.entity.sound.play('Successful');
          },
          1500,
          this
        ),
        (h.enabled = !0),
        (a += 200)),
      this.holderEntity.addChild(e),
      this.realIndex++,
      setTimeout(function () {
        e.tween(e.getLocalScale())
          .to(
            {
              x: 0.9,
              y: 0.9,
              z: 0.9,
            },
            0.2,
            pc.BackOut
          )
          .start();
      }, 1600 + a),
      this.index > this.quests.length - 1)
    )
      return this.hideQuests(), !1;
    this.holderEntity
      .tween(this.holderEntity.element)
      .to(
        {
          height: 98 * (this.realIndex + 1),
        },
        0.5,
        pc.BackOut
      )
      .delay(1.5 + 0.001 * a)
      .start(),
      setTimeout(
        function (t) {
          t.entity.sound.play('Whoosh');
        },
        1500 + 0.001 * a,
        this
      ),
      (this.nextQuestTimer = setTimeout(
        function (t) {
          t.setQuest();
        },
        1900 + a,
        this
      ));
  });
var Camera = pc.createScript('camera');
Camera.attributes.add('maxShakeDuration', {
  type: 'number',
  default: 0.15,
}),
  Camera.attributes.add('shakeAmount', {
    type: 'number',
    default: 0.1,
  }),
  (Camera.prototype.initialize = function () {
    (this.cameraOffset = new pc.Vec3(0, 0, 0)),
      (this.shakeDuration = 0),
      this.app.on('Camera:Shake', this.onCameraShake, this),
      this.app.on('View:State', this.onState, this),
      this.on('destroy', this.onDestroy, this),
      (pc.dt = 1 / 60);
  }),
  (Camera.prototype.onState = function (t) {
    this.entity.enabled = 'Game' == t;
  }),
  (Camera.prototype.fixedUpdate = function (t, e) {
    return 1 - Math.pow(t * pc.dt, e);
  }),
  (Camera.prototype.onDestroy = function (t) {
    console.log('Camera destroyed!'),
      this.app.off('Camera:Shake', this.onCameraShake, this),
      this.app.off('View:State', this.onState, this),
      (this.entity.audiolistener.enabled = !1);
  }),
  (Camera.prototype.onCameraShake = function (t, e) {
    (this.shakeDuration = e), (this.currentShakeAmount = this.shakeAmount * t);
  }),
  (Camera.prototype.update = function (t) {
    if (this.shakeDuration > 0)
      (this.cameraOffset.x = pc.math.random(-this.currentShakeAmount, this.currentShakeAmount)),
        (this.cameraOffset.y = pc.math.random(-this.currentShakeAmount, this.currentShakeAmount)),
        (this.cameraOffset.z = pc.math.random(-this.currentShakeAmount, this.currentShakeAmount));
    else {
      var e = this.fixedUpdate(0.1, t);
      (this.cameraOffset.x = pc.math.lerp(this.cameraOffset.x, 0, e)),
        (this.cameraOffset.y = pc.math.lerp(this.cameraOffset.x, 0, e)),
        (this.cameraOffset.z = pc.math.lerp(this.cameraOffset.x, 0, e));
    }
    (this.shakeDuration -= t),
      this.entity.setLocalPosition(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
  });
var Totem = pc.createScript('totem');
Totem.attributes.add('objectId', {
  type: 'string',
  default: 'None',
}),
  Totem.attributes.add('collisionEntity', {
    type: 'entity',
  }),
  (Totem.prototype.initialize = function () {
    var t = this;
    this.collisionEntity.onShoot = function () {
      t.app.fire('Network:ShootTrigger', t.objectId);
    };
  }),
  (Totem.prototype.onRemove = function (t) {
    t == this.objectId && this.entity.setLocalPosition(0, -100, 0);
  });
var PushAlert = pc.createScript('pushAlert');
PushAlert.attributes.add('key', {
  type: 'string',
  default: 'd5b9a58a2bb9715aacfb8aee724a626c',
}),
  PushAlert.attributes.add('success', {
    type: 'string',
  }),
  PushAlert.attributes.add('error', {
    type: 'string',
  }),
  (PushAlert.prototype.initialize = function () {
    var t = document.createElement('script');
    (t.src = 'https://cdn.pushalert.co/integrate_' + this.key + '.js'),
      document.body.appendChild(t),
      (pushalertbyiw = window.pushalertbyiw || []).push(
        ['onSuccess', this.callbackOnSuccess],
        ['onFailure', this.callbackOnFailure]
      ),
      this.app.on('PushAlert:' + this.entity.name, this.subscribeStatus, this);
  }),
  (PushAlert.prototype.subscribeStatus = function () {
    PushAlertCo.forceSubscribe(),
      'subscribed' != PushAlertCo.getSubsInfo().status
        ? this.app.fire('Alert:Menu', 'Check browser settings for notifications')
        : this.app.fire('Alert:Menu', 'Yeeeyy Subscribed');
  }),
  (PushAlert.prototype.callbackOnSuccess = function (t) {
    0 != t.alreadySubscribed && PushAlertCo.forceSubscribe(), this.onSuccess();
  }),
  (PushAlert.prototype.onSuccess = function (t) {
    var e = this.success.split(', ');
    if (e.length > 0)
      for (var s in e) {
        var r = e[s],
          i = r.split('@');
        if (i.length > 1) {
          var a = i[0],
            u = i[1];
          this.app.fire(a, u);
        } else this.app.fire(r, t);
      }
  }),
  (PushAlert.prototype.onError = function (t) {
    var e = this.error.split(', ');
    if (e.length > 0)
      for (var s in e) {
        var r = e[s],
          i = r.split('@');
        if (i.length > 1) {
          var a = i[0],
            u = i[1];
          this.app.fire(a, u);
        } else this.app.fire(r, t);
      }
  }),
  (PushAlert.prototype.callbackOnFailure = function (t) {
    this.onError();
  });
var Spray = pc.createScript('spray');
Spray.attributes.add('baseShader', {
  type: 'asset',
  assetType: 'shader',
}),
  Spray.attributes.add('sprayShader', {
    type: 'asset',
    assetType: 'shader',
  }),
  (Spray.prototype.initialize = function () {
    (pc.shaderChunks.cookiePS = this.baseShader.resource),
      (pc.shaderChunks.combineDiffuseSpecularPS = this.sprayShader.resource);
  });
var RedeemVg = pc.createScript('redeemVg');
RedeemVg.attributes.add('bannerEntity', {
  type: 'entity',
}),
  (RedeemVg.prototype.initialize = function () {
    window.location.host;
    'undefined' == typeof adblockEnabled && (adblockEnabled = !0),
      this.app.on('Menu:SetHome', this.setHomeEvent, this),
      this.app.on('RedeemVG', this.trigger, this),
      this.app.fire('Analytics:Event', 'Checkpoint', 'SDKLoaded');
  }),
  (RedeemVg.prototype.setHomeEvent = function (e) {
    if (adblockEnabled)
      return (
        pc.app.fire('View:Menu@Close'),
        e && e.can_redeem && pc.app.fire('Analytics:Event', 'Checkpoint', 'RedeemFail'),
        !1
      );
    e &&
      e.can_redeem &&
      (this.app.fire('View:Menu', 'RedeemVG'),
      this.app.fire('Analytics:Event', 'Checkpoint', 'CanRedeem'));
  }),
  (RedeemVg.prototype.trigger = function (e) {
    if (adblockEnabled) return !1;
    window.location.host;
    (pc.app.systems.sound.volume = 0),
      (this.bannerEntity.enabled = !1),
      this.app.fire('Analytics:Event', 'Checkpoint', 'RedeemTrigger'),
      this.app.fire(
        'Ads:RewardAds',
        function () {
          pc.app.fire('Fetcher:RedeemReward'),
            pc.app.fire('Analytics:Event', 'Checkpoint', 'RedeemSuccess'),
            (pc.app.systems.sound.volume = 0.25),
            setTimeout(function () {
              pc.app.fire('View:Menu@Close');
            }, 500);
        },
        function () {
          pc.app.fire('View:Menu@Close'),
            pc.app.fire('Analytics:Event', 'Checkpoint', 'RedeemFail'),
            pc.app.fire('Alert:Menu', 'Please disable adblock to enable rewards!'),
            (pc.app.systems.sound.volume = 0.25);
        }
      );
  });
var MouseLock = pc.createScript('mouseLock');
(MouseLock.prototype.initialize = function () {
  (this.onLock = !1),
    (this.onUnlock = !1),
    (this.lastLockTime = 0),
    (this.isLocked = !1),
    (this.isActive = !1),
    (this.isTrying = !1),
    Utils.isMobile() ||
      (document.addEventListener('pointerlockchange', this.onChange.bind(this), !0),
      document.addEventListener('pointerlockerror', this.lockError.bind(this), !0),
      this.app.on('Mouse:Lock', this.lock, this),
      this.app.on('Mouse:Unlock', this.unlock, this),
      this.on('destroy', this.onDestroy, this));
}),
  (MouseLock.prototype.onDestroy = function () {
    document.removeEventListener('pointerlockchange', this.onChange),
      document.removeEventListener('pointerlockerror', this.lockError),
      (this.isLocked = !1),
      (this.isActive = !1),
      (this.isTrying = !1),
      this.unlock(),
      clearTimeout(this.lockTimer);
  }),
  (MouseLock.prototype.lockError = function () {
    this.isActive && !this.isTrying && this.tryLock();
  }),
  (MouseLock.prototype.tryLock = function () {
    (this.isTrying = !0),
      this.lock(),
      clearTimeout(this.lockTimer),
      (this.lockTimer = setTimeout(
        function (o) {
          o.tryLock();
        },
        1e3,
        this
      ));
  }),
  (MouseLock.prototype.lock = function (o) {
    if ('undefined' != typeof app && !0 === app.isWatchingAds) return !1;
    var t = document.body;
    (t.requestPointerLock = t.requestPointerLock || t.mozRequestPointerLock),
      t.requestPointerLock(),
      (this.isActive = !0),
      (document.body.style.cursor = 'wait'),
      o && (this.onLock = o);
  }),
  (MouseLock.prototype.unlock = function (o) {
    (document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock),
      document.exitPointerLock(),
      o && (this.onUnlock = o);
  }),
  (MouseLock.prototype.onChange = function () {
    var o = document.pointerLockElement == document.body;
    !0 === o
      ? (this.onLock && this.onLock(),
        clearTimeout(this.lockTimer),
        (this.isActive = !1),
        (this.isLocked = !0),
        (this.isTrying = !1),
        (this.lastLockTime = Date.now()))
      : (this.onUnlock && this.onUnlock(),
        (this.isTrying = !1),
        (this.isActive = !1),
        (this.isLocked = !1)),
      (document.body.style.cursor = 'default'),
      this.app.fire('Mouse:LockChange', o);
  });
var CollisionScaler = pc.createScript('collisionScaler');
CollisionScaler.attributes.add('mapHolder', {
  type: 'entity',
}),
  (CollisionScaler.prototype.initialize = function () {
    this.app.on('CollisionScaler:Scale', this.onScale, this);
  }),
  (CollisionScaler.prototype.onScale = function () {
    var l = this,
      a = this.mapHolder.findByTag('Object');
    for (var i in a) {
      var e = a[i];
      this.scaleCollision(e),
        e &&
          e.model &&
          e.model.ready(function () {
            l.scaleMaterial(e);
          });
    }
  }),
  (CollisionScaler.prototype.scaleCollision = function (l) {
    var a = l.children;
    for (var i in a) {
      var e = a[i];
      if (e.collision) {
        e.originalHalfExtent || (e.originalHalfExtent = e.collision.halfExtents.clone());
        e.getLocalEulerAngles().y, pc.math.DEG_TO_RAD;
        var o = e.originalHalfExtent.x,
          n = e.originalHalfExtent.y,
          t = e.originalHalfExtent.z;
        if (l.originalScale) {
          var r = l.originalScale,
            c = l.getLocalScale().clone();
          (c.x /= r.x),
            (c.y /= r.y),
            (c.z /= r.z),
            (c.x = c.x * o),
            (c.y = c.y * n),
            (c.z = c.z * t),
            (e.collision.halfExtents = c);
        }
      }
    }
  }),
  (CollisionScaler.prototype.scaleMaterial = function (l) {
    if (l.originalScale) {
      var a = l.originalScale,
        i = l.getLocalScale().clone();
      if (
        ((i.x /= a.x),
        (i.y /= a.y),
        (i.z /= a.z),
        l.model && l.model.meshInstances && l.model.meshInstances.length > 0)
      ) {
        var e = !1;
        l.originalMaterialScale
          ? (e = l.model.meshInstances[0].material)
          : ((e = l.model.meshInstances[0].material.clone()),
            (l.originalMaterialScale = e.diffuseMapTiling.clone())),
          1.01 === l.originalMaterialScale.x &&
            (e.diffuseMapTiling.x = l.originalMaterialScale.x * i.x),
          1.01 === l.originalMaterialScale.y &&
            (e.diffuseMapTiling.y = l.originalMaterialScale.y * i.x),
          1.02 === l.originalMaterialScale.x &&
            (e.diffuseMapTiling.x = l.originalMaterialScale.x * i.z),
          1.02 === l.originalMaterialScale.y &&
            (e.diffuseMapTiling.y = l.originalMaterialScale.y * i.z),
          e.update(),
          (l.model.meshInstances[0].material = e);
      }
    }
  });
var ModelComponentAddon = pc.createScript('modelComponentAddon');
ModelComponentAddon.prototype.initialize = function () {
  pc.ModelComponent.prototype.ready = function (o) {
    var e = this;
    if (e.isLoaded) return o(), !1;
    if (this.asset) {
      var t = pc.app.assets.get(this.asset);
      t.ready(function () {
        var t = e.meshInstances;
        for (var n in t) t[n];
        setTimeout(function () {
          o(), (e.isLoaded = !0);
        }, 100);
      }),
        pc.app.assets.load(t);
    }
  };
};
var KeyboardConfiguration = pc.createScript('keyboardConfiguration');
(KeyboardConfiguration.prototype.initialize = function () {
  (this.currentKey = !1),
    this.app.on('Menu:KeyboardCall', this.setKeyboardTable, this),
    this.app.on('Menu:KeyboardReset', this.resetKeyboardTable, this),
    this.app.on('Menu:KeyChange', this.setKey, this),
    this.app.on('Tab:Settings', this.onSettings, this),
    this.app.fire('Menu:KeyboardConfiguration', !0),
    this.on('destory', this.onDestroy, this);
}),
  (KeyboardConfiguration.prototype.onSettings = function (e) {
    ('Controls' != e && 'Keyboard' != e) ||
      setTimeout(
        function (e) {
          e.setKeyboardTable();
        },
        100,
        this
      );
  }),
  (KeyboardConfiguration.prototype.resetKeyboardTable = function () {
    var e = ['W', 'S', 'A', 'D', 'SPACE', 'R', 'E', 'F', 'B', 'H', 'ENTER', 'X', 'V'];
    for (var t in e) {
      var a = e[t];
      pc['KEY_' + a] = keyboardMap.indexOf(a);
    }
    this.setKeyboardTable();
  }),
  (KeyboardConfiguration.prototype.setKeyboardTable = function (e) {
    var t = [
      {
        key: keyboardMap[pc.KEY_W],
        default_key: 'W',
        function: 'Forward',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_S],
        default_key: 'S',
        function: 'Backward',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_A],
        default_key: 'A',
        function: 'Left',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_D],
        default_key: 'D',
        function: 'Right',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_SPACE],
        default_key: 'SPACE',
        function: 'Jump',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_R],
        default_key: 'R',
        function: 'Reload',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_E],
        default_key: 'E',
        function: 'Melee',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_F],
        default_key: 'F',
        function: 'Throw',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_B],
        default_key: 'B',
        function: 'Buy',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_SHIFT],
        default_key: 'SHIFT',
        function: 'Focus',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_H],
        default_key: 'H',
        function: 'Dance',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_ENTER],
        default_key: 'ENTER',
        function: 'Chat',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_X],
        default_key: 'X',
        function: 'Fire (Shoot)',
        waiting: '',
      },
      {
        key: keyboardMap[pc.KEY_V],
        default_key: 'V',
        function: 'Spray',
        waiting: '',
      },
    ];
    if (e) {
      for (var a in t) {
        t[a].default_key == e.default_key && (t[a].waiting = 'Waiting for prompt...');
      }
      (this.currentKey = e.default_key), this.app.keyboard.once('keydown', this.defineKey, this);
    }
    var i = Utils.getItem('KeyConfiguration');
    if (i)
      for (var o in (i = JSON.parse(i))) {
        var n = i[o];
        for (var r in t) {
          t[r].default_key == o && (t[r].key = keyboardMap[n]);
        }
      }
    this.app.fire('Table:Keys', {
      result: t,
    });
  }),
  (KeyboardConfiguration.prototype.setKey = function (e) {
    this.setKeyboardTable(e);
  }),
  (KeyboardConfiguration.prototype.defineKey = function (e) {
    e.key;
    var t = Utils.getItem('KeyConfiguration');
    (t = t ? JSON.parse(t) : {}),
      this.currentKey && (t[this.currentKey] = e.key),
      Utils.setItem('KeyConfiguration', JSON.stringify(t)),
      this.setKeyboardTable(),
      this.app.fire('Menu:KeyboardConfiguration', !0),
      (this.currentKey = !1);
  }),
  (KeyboardConfiguration.prototype.onDestroy = function () {
    this.app.off('Menu:KeyboardCall', this.setKeyboardTable, this),
      this.app.off('Menu:KeyboardReset', this.resetKeyboardTable, this),
      this.app.off('Menu:KeyChange', this.setKey, this),
      this.app.off('Tab:Settings', this.onSettings, this);
  });
var SceneLoader = pc.createScript('sceneLoader');
SceneLoader.attributes.add('defaultScenes', {
  type: 'string',
  array: !0,
}),
  SceneLoader.attributes.add('sceneSetting', {
    type: 'string',
  }),
  SceneLoader.attributes.add('lightEntity', {
    type: 'entity',
  }),
  SceneLoader.attributes.add('light', {
    type: 'boolean',
    default: !0,
  }),
  (SceneLoader.prototype.initialize = function () {
    if (
      ((this.index = 0), this.app.on('SceneLoader:Load', this.loadIndex, this), this.sceneSetting)
    ) {
      var e = this.app.scenes.find(this.sceneSetting);
      this.app.scenes.loadSceneSettings(e.url);
    }
    this.light && (this.lightEntity.enabled = !1);
  }),
  (SceneLoader.prototype.loadIndex = function () {
    if (this.defaultScenes.length - 1 < this.index)
      return this.app.fire('NetworkManager:Connect'), !1;
    var e = this;
    this.loadScene(this.defaultScenes[this.index], function () {
      e.loadIndex();
    }),
      this.index++;
  }),
  (SceneLoader.prototype.loadScene = function (e, t) {
    var n = this.app.scenes.find(e);
    this.app.scenes.loadSceneHierarchy(n.url, function (e) {
      t && t();
    });
  });
var OptimizedLight = pc.createScript('optimizedLight');
(OptimizedLight.prototype.initialize = function () {
  (this.lastLightCheck = 0), this.app.on('OptimizedLight:Render', this.render, this);
}),
  (OptimizedLight.prototype.update = function (t) {
    Date.now() - this.lastLightCheck > 2e3 &&
      ((this.entity.light.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME),
      (this.lastLightCheck = Date.now()));
  }),
  (OptimizedLight.prototype.render = function (t) {
    this.entity.light.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME;
  });
var MenuController = pc.createScript('menuController');
MenuController.attributes.add('heroCamera', {
  type: 'entity',
}),
  MenuController.attributes.add('mapCamera', {
    type: 'entity',
  }),
  (MenuController.prototype.initialize = function () {
    (this.currentState = 'Hero'),
      this.app.on('Game:Mute', this.setMute, this),
      this.app.on('View:State', this.setState, this),
      this.app.on('Map:Reparent', this.onMapParented, this),
      this.app.on('Game:PreStart', this.onStart, this),
      this.app.on('Game:Finish', this.onFinish, this),
      this.app.on('Player:Leave', this.onPlayerLeave, this),
      this.app.on('Transition:Show', this.onTransitionShow, this),
      this.app.on('Transition:Hide', this.onTransitionHide, this),
      'undefined' != typeof app && app.onPlayCanvasLoad();
  }),
  (MenuController.prototype.onTransitionShow = function () {
    (this.heroCamera.enabled = !1), (this.mapCamera.enabled = !1);
  }),
  (MenuController.prototype.onTransitionHide = function () {
    this.setState(this.currentState);
  }),
  (MenuController.prototype.setMute = function (t) {
    this.app.systems.sound.volume = t ? 0.25 : 0;
  }),
  (MenuController.prototype.setState = function (t) {
    (this.heroCamera.enabled = 'Hero' == t),
      (this.mapCamera.enabled = 'Pause' == t),
      (this.currentState = t);
  }),
  (MenuController.prototype.onMapParented = function () {
    clearTimeout(this.parentTimer),
      (this.parentTimer = setTimeout(
        function (t) {
          t.setMapSoundState(!1);
        },
        60,
        this
      ));
  }),
  (MenuController.prototype.onStart = function () {
    this.setMapSoundState(!0);
  }),
  (MenuController.prototype.onFinish = function () {
    this.setMapSoundState(!1);
  }),
  (MenuController.prototype.onPlayerLeave = function () {
    this.setMapSoundState(!1);
  }),
  (MenuController.prototype.setMapSoundState = function (t) {
    this.app.root.findByTag('MapSound').forEach(function (e) {
      e.sound.volume = t ? 1 : 0;
    });
  });
var HeroSelector = pc.createScript('heroSelector');
HeroSelector.attributes.add('heroes', {
  type: 'entity',
  array: !0,
}),
  HeroSelector.attributes.add('holderEntity', {
    type: 'entity',
  }),
  (HeroSelector.prototype.initialize = function () {
    (this.currentState = 'Hero'),
      this.app.on('View:State', this.setState, this),
      this.app.on('HeroSelector:Select', this.setHero, this),
      this.app.on('Transition:Show', this.onTransitionShow, this),
      this.app.on('Transition:Hide', this.onTransitionHide, this),
      'undefined' != typeof app ? this.setHero(app.session.character) : this.setHero('Lilium');
  }),
  (HeroSelector.prototype.onTransitionShow = function () {
    this.holderEntity.enabled = !1;
  }),
  (HeroSelector.prototype.onTransitionHide = function () {
    this.setState(this.currentState);
  }),
  (HeroSelector.prototype.setState = function (e) {
    (this.holderEntity.enabled = 'Hero' == e), (this.currentState = e);
  }),
  (HeroSelector.prototype.getFromHeroList = function (e) {
    var t = !1;
    for (var o in this.heroes) {
      var r = this.heroes[o];
      r.name == e && (t = r);
    }
    return t;
  }),
  (HeroSelector.prototype.hideAllHeroes = function () {
    for (var e in this.heroes) {
      this.heroes[e].enabled = !1;
    }
  }),
  (HeroSelector.prototype.setHero = function (e) {
    this.hideAllHeroes();
    var t = this.getFromHeroList(e);
    t &&
      t.model.ready(function () {
        (t.enabled = !0),
          t.animation.play('Grab-Weapon'),
          (t.findByName('DefaultWeaponHolder').enabled = !1),
          setTimeout(
            function (e) {
              t.findByName('DefaultWeaponHolder').enabled = !0;
            },
            1e3,
            this
          ),
          pc.app.fire('HeroSelector:Loaded', !0);
      });
  });
var SpecialEffectController = pc.createScript('specialEffectController');
SpecialEffectController.attributes.add('entities', {
  type: 'entity',
  array: !0,
}),
  (SpecialEffectController.prototype.initialize = function () {
    (this.disabled = !1),
      this.app.on('Game:Settings', this.onSettingsChange, this),
      this.onSettingsChange(),
      this.on('destroy', this.onDestroy, this);
  }),
  (SpecialEffectController.prototype.onDestroy = function () {
    this.app.off('Game:Settings', this.onSettingsChange, this);
  }),
  (SpecialEffectController.prototype.onSettingsChange = function () {
    pc.settings && !0 === pc.settings.disableSpecialEffects
      ? ((this.disabled = !1), this.setStateEntities(!1))
      : ((this.disabled = !0), this.setStateEntities(!0));
  }),
  (SpecialEffectController.prototype.setStateEntities = function (t) {
    this.entities.forEach(function (e) {
      e.enabled = t;
    });
  });
var AutoResolution = pc.createScript('autoResolution');
AutoResolution.attributes.add('maxSample', {
  type: 'number',
  default: 500,
}),
  (AutoResolution.prototype.initialize = function () {
    (this.isCollecting = !0), (this.avgFPS = 1), (this.totalSample = 1);
  }),
  (AutoResolution.prototype.checkResolution = function (t) {
    var o = Math.floor(1e3 / (1e3 * t));
    o < 300 && o > 0 && ((this.avgFPS += o), this.totalSample++);
  }),
  (AutoResolution.prototype.setAutoResolution = function () {
    var t = this.avgFPS / this.totalSample,
      o = 'HIGH';
    t > 50 && (o = 'HIGH'),
      t > 30 && t <= 50 && (o = 'MEDIUM'),
      t > 1 && t <= 30 && (o = 'LOW'),
      this.app.fire('AutoResolution:Set', o);
  }),
  (AutoResolution.prototype.update = function (t) {
    if (!this.isCollecting) return !1;
    this.checkResolution(t),
      this.totalSample > this.maxSample && (this.setAutoResolution(), (this.isCollecting = !1));
  });
var ShopController = pc.createScript('shopController');
ShopController.attributes.add('holderEntity', {
  type: 'entity',
}),
  ShopController.attributes.add('backgroundEntity', {
    type: 'entity',
  }),
  ShopController.attributes.add('view3D', {
    type: 'entity',
  }),
  ShopController.attributes.add('sparkEntity', {
    type: 'entity',
  }),
  ShopController.attributes.add('crateResultEntity', {
    type: 'entity',
  }),
  ShopController.attributes.add('items', {
    type: 'entity',
    array: !0,
  }),
  ShopController.attributes.add('rotationSpeed', {
    type: 'number',
    default: 0.2,
  }),
  (ShopController.prototype.initialize = function () {
    (this.holderEntity.enabled = !1),
      (this.view3D.enabled = !1),
      (this.currentViewAngle = 0),
      (this.rotatingAngle = 0),
      (this.nextRotationAngle = 0),
      (this.timestamp = 0),
      this.app.on('View:State', this.setState, this),
      this.app.on('Shop:SetItem', this.setItem, this),
      this.app.on('Reforge:Effect', this.playEffect, this),
      this.backgroundEntity.element.on('mousedown', this.onMouseDown, this),
      this.backgroundEntity.element.on('mousemove', this.onMouseMove, this),
      this.backgroundEntity.element.on('mouseup', this.onMouseUp, this),
      Utils.isMobile() &&
        (this.app.touch.on('touchstart', this.onTouchStart, this),
        this.app.touch.on('touchmove', this.onTouchMove, this),
        this.app.touch.on('touchend', this.onTouchEnd, this));
  }),
  (ShopController.prototype.playEffect = function (t) {
    this.sparkEntity.particlesystem.reset(), this.sparkEntity.particlesystem.play();
  }),
  (ShopController.prototype.onTouchStart = function (t) {
    if (!this.holderEntity.enabled) return !1;
    var o = t.touches[0];
    (this.isMouseDown = !0), (this.startX = o.x), (this.isRotating = !0);
  }),
  (ShopController.prototype.onTouchMove = function (t) {
    if (!this.holderEntity.enabled) return !1;
    if (!this.isRotating) return !1;
    var o = t.touches[0];
    Math.abs(this.lastAngle - o.x) > 1
      ? this.entity.sound.slots.Spin.isPlaying || this.entity.sound.play('Spin')
      : this.entity.sound.stop('Spin'),
      (this.lastAngle = o.x),
      (this.nextRotationAngle = o.x - this.startX);
  }),
  (ShopController.prototype.onTouchEnd = function (t) {
    if (!this.holderEntity.enabled) return !1;
    (this.isMouseDown = !1),
      this.entity.sound.stop('Spin'),
      (this.isRotating = !1),
      (this.nextRotationAngle = 0);
  }),
  (ShopController.prototype.onMouseDown = function (t) {
    if (!this.holderEntity.enabled) return !1;
    t.button == pc.MOUSEBUTTON_LEFT && ((this.isMouseDown = !0), (this.startX = t.x)),
      (this.isRotating = !0);
  }),
  (ShopController.prototype.onMouseMove = function (t) {
    return (
      !!this.holderEntity.enabled &&
      !!this.isRotating &&
      (Math.abs(this.lastAngle - t.x) > 1
        ? this.entity.sound.slots.Spin.isPlaying || this.entity.sound.play('Spin')
        : this.entity.sound.stop('Spin'),
      (this.lastAngle = t.x),
      void (this.nextRotationAngle = t.x - this.startX))
    );
  }),
  (ShopController.prototype.onMouseUp = function (t) {
    if (!this.holderEntity.enabled) return !1;
    t.button == pc.MOUSEBUTTON_LEFT && (this.isMouseDown = !1),
      this.entity.sound.stop('Spin'),
      (this.isRotating = !1),
      (this.nextRotationAngle = 0);
  }),
  (ShopController.prototype.setItem = function (t, o) {
    this.items.forEach(function (o) {
      o.enabled = t == o.name;
    }),
      (this.currentItemName = t);
  }),
  (ShopController.prototype.setState = function (t, o) {
    (this.holderEntity.enabled = 'Shop' == t), (this.view3D.enabled = o);
  }),
  (ShopController.prototype.setRotation = function (t) {
    (this.rotatingAngle = pc.math.lerpAngle(this.rotatingAngle, this.nextRotationAngle, 0.1)),
      'Crate' == this.currentItemName
        ? (this.view3D.setLocalEulerAngles(0, -25, 0),
          this.crateResultEntity.setLocalEulerAngles(0, this.rotatingAngle, 0))
        : this.view3D.setLocalEulerAngles(0, this.rotatingAngle, 0),
      this.isRotating || (this.nextRotationAngle += t * this.rotationSpeed);
  }),
  (ShopController.prototype.update = function (t) {
    this.setRotation(t);
  });
var CustomShader = pc.createScript('customShader');
CustomShader.attributes.add('isDebug', {
  type: 'boolean',
  default: !1,
}),
  CustomShader.attributes.add('material', {
    type: 'asset',
    assetType: 'material',
  }),
  CustomShader.attributes.add('textures', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'texture_0',
      },
      {
        name: 'texture',
        type: 'asset',
        assetType: 'texture',
      },
    ],
    array: !0,
  }),
  CustomShader.attributes.add('colors', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'color_0',
      },
      {
        name: 'color',
        type: 'rgba',
      },
    ],
    array: !0,
  }),
  CustomShader.attributes.add('vectors', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'vector_0',
      },
      {
        name: 'vector',
        type: 'vec2',
      },
    ],
    array: !0,
  }),
  CustomShader.attributes.add('numbers', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'number_0',
      },
      {
        name: 'number',
        type: 'number',
        default: 0,
      },
    ],
    array: !0,
  }),
  CustomShader.attributes.add('alpha_ref', {
    type: 'number',
    default: 0.1,
  }),
  CustomShader.attributes.add('shader', {
    type: 'string',
    default:
      'Ly92ZWMzIHRleHR1cmUgPSB0ZXh0dXJlMkQodGV4dHVyZV8wLCAkVVYpLnJnYjsKCmNvbG9yLnJnYiA9IHZlYzMoMS4wLCAxLjAsIDEuMCk7Cm9wYWNpdHkgPSAxLjA7',
  }),
  (CustomShader.prototype.initialize = function () {
    this.reset(),
      this.isDebug ? this.addCodeEditor() : (this.emissive = atob(this.shader)),
      this.on('attr:textures', this.onAttributeChange, this),
      this.on('attr:colors', this.onAttributeChange, this),
      this.on('attr:vectors', this.onAttributeChange, this),
      this.on('attr:numbers', this.onAttributeChange, this),
      this.on('attr:shader', this.onAttributeChange, this),
      this.on('state', this.onStateChange, this),
      this.onAttributeChange();
  }),
  (CustomShader.prototype.onStateChange = function (t) {
    this.reset();
  }),
  (CustomShader.prototype.copy = function (t) {
    var e = btoa(t);
    navigator.clipboard.writeText(e).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
      },
      function (t) {
        console.error('Async: Could not copy text: ', t);
      }
    );
  }),
  (CustomShader.prototype.addCodeEditor = function () {
    var t = this,
      e = document.createElement('button');
    (e.style.position = 'fixed'),
      (e.style.left = '10px'),
      (e.style.top = '340px'),
      (e.style.width = '100px'),
      (e.style.height = '40px'),
      (e.style.background = 'rgba(0, 0, 0, 0.5)'),
      (e.style.color = '#fff'),
      (e.textContent = 'Copy'),
      (e.onclick = function () {
        t.copy(t.emissiveCode.value);
      }),
      document.body.appendChild(e);
    var a = document.createElement('textarea');
    (a.style.position = 'fixed'),
      (a.style.left = '10px'),
      (a.style.top = '10px'),
      (a.style.width = '400px'),
      (a.style.height = '300px'),
      (a.style.padding = '10px'),
      (a.style.background = 'rgba(0, 0, 0, 0.5)'),
      (a.style.outline = 'none'),
      (a.style.color = 'white'),
      (a.onkeyup = this.onShaderChange.bind(this));
    var r = document.createElement('style');
    (r.innerText = '#application-console{max-height: 80px;}'),
      document.body.appendChild(r),
      (this.emissiveCode = a),
      (this.emissiveCode.value = atob(this.shader)),
      (this.emissive = this.emissiveCode.value),
      this.updateMaterial(),
      document.body.appendChild(a);
  }),
  (CustomShader.prototype.onShaderChange = function () {
    if (';' != this.emissiveCode.value.substr(-1)) return !1;
    clearTimeout(this.timer),
      (this.timer = setTimeout(
        function (t) {
          (t.emissive = t.emissiveCode.value), t.updateMaterial();
        },
        100,
        this
      ));
  }),
  (CustomShader.prototype.reset = function () {
    (this.timestamp = 0), (this.parameters = []);
  }),
  (CustomShader.prototype.line = function (t) {
    return t + '\n';
  }),
  (CustomShader.prototype.number = function (t) {
    return parseFloat(t).toFixed(2);
  }),
  (CustomShader.prototype.colorRGB = function (t) {
    return (
      'vec3(' +
      this.number(t.data[0]) +
      ', ' +
      this.number(t.data[1]) +
      ', ' +
      this.number(t.data[2]) +
      ')'
    );
  }),
  (CustomShader.prototype.colorRGBA = function (t) {
    return (
      'vec4(' +
      this.number(t.data[0]) +
      ', ' +
      this.number(t.data[1]) +
      ', ' +
      this.number(t.data[2]) +
      ', ' +
      this.number(t.data[3]) +
      ')'
    );
  }),
  (CustomShader.prototype.addParameter = function (t, e) {
    var a = '';
    for (var r in this[t]) {
      var s = this[t][r],
        i = !1;
      (a += this.line('uniform ' + e + ' ' + s.name + ';')),
        'textures' == t && (i = s.texture.resource),
        'colors' == t && (i = s.color.data),
        'vectors' == t && (i = s.vector.data),
        'numbers' == t && (i = s.number),
        this.parameters.push({
          name: s.name,
          resource: i,
        });
    }
    return a;
  }),
  (CustomShader.prototype.generateEmissive = function () {
    var t = '';
    return (
      (t += this.addParameter('textures', 'sampler2D')),
      (t += this.addParameter('colors', 'vec4')),
      (t += this.addParameter('vectors', 'vec2')),
      (t += this.addParameter('numbers', 'float')),
      (t += this.line('uniform float timestamp;')),
      (t += this.line('uniform float alpha_ref;')),
      (t += this.line('vec3 getEmission() {')),
      (t += this.line('vec3 color = vec3(0.0);')),
      (t += this.line(this.emissive)),
      (t += this.line('dAlpha = opacity;')),
      (t += this.line('return color;')),
      (t += this.line('}')),
      (t += this.line('void getOpacity() {')),
      (t += this.line('}')),
      (t += this.line('void alphaTest(float a) {')),
      (t += this.line('if (a < alpha_ref) discard;')),
      (t += this.line('}'))
    );
  }),
  (CustomShader.prototype.onAttributeChange = function () {
    this.reset(), this.updateMaterial(), console.log('[DEBUG] Material updated!');
  }),
  (CustomShader.prototype.updateMaterial = function () {
    (this.timestamp = 0),
      (this.currentMaterial = this.material.resource),
      (this.currentMaterial.chunks.emissivePS = this.generateEmissive()),
      (this.currentMaterial.chunks.opacityPS = this.line('float opacity = 1.0;')),
      (this.currentMaterial.chunks.alphaTestPS = ' '),
      (this.currentMaterial.chunks.endPS =
        ' vec3 emissionColor = getEmission(); alphaTest(dAlpha); gl_FragColor.rgb += emissionColor;'),
      this.currentMaterial.update();
  }),
  (CustomShader.prototype.update = function (t) {
    if (this.currentMaterial) {
      for (var e in this.parameters) {
        var a = this.parameters[e];
        this.currentMaterial.setParameter(a.name, a.resource);
      }
      this.currentMaterial.setParameter('timestamp', this.timestamp),
        this.currentMaterial.setParameter('alpha_ref', this.alpha_ref);
    }
    this.timestamp += t;
  });
var Motion = pc.createScript('motion');
Motion.attributes.add('motions', {
  type: 'json',
  schema: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'position',
      type: 'curve',
      curves: ['x', 'y', 'z'],
    },
    {
      name: 'rotation',
      type: 'curve',
      curves: ['x', 'y', 'z'],
    },
    {
      name: 'scale',
      type: 'curve',
      curves: ['x', 'y', 'z'],
    },
    {
      name: 'speed',
      type: 'number',
      default: 1,
    },
    {
      name: 'autoplay',
      type: 'boolean',
      default: !1,
    },
    {
      name: 'loop',
      type: 'boolean',
      default: !1,
    },
  ],
  array: !0,
}),
  Motion.attributes.add('events', {
    type: 'json',
    schema: [
      {
        name: 'animationName',
        type: 'string',
      },
      {
        name: 'eventName',
        type: 'string',
      },
      {
        name: 'time',
        type: 'number',
        default: 1,
      },
      {
        name: 'type',
        type: 'string',
        default: 'Anytime',
        enum: [
          {
            Anytime: 'Anytime',
          },
          {
            Start: 'Start',
          },
          {
            End: 'End',
          },
        ],
      },
    ],
    array: !0,
  }),
  Motion.attributes.add('lerp', {
    type: 'number',
    default: 0.5,
  }),
  (Motion.prototype.initialize = function () {
    (this.timestamp = 0),
      (this.currentSpeed = 0),
      (this.currentMotion = !1),
      (this.isReverting = !1),
      (this.startPosition = this.entity.getLocalPosition().clone()),
      (this.startRotation = this.entity.getLocalEulerAngles().clone()),
      (this.startScale = this.entity.getLocalScale().clone()),
      (this.position = new pc.Vec3(0, 0, 0)),
      (this.rotation = new pc.Vec3(0, 0, 0)),
      (this.scale = new pc.Vec3(0, 0, 0)),
      this.motions.length > 0 &&
        this.motions[0].autoplay &&
        this.onMotionPlay(this.motions[0].name),
      this.app.on('Motion:' + this.entity.name, this.onMotionPlay, this),
      this.app.on('Motion:' + this.entity.name + '@Stop', this.onMotionStop, this),
      this.entity.on('Motion', this.onMotionPlay, this);
  }),
  (Motion.prototype.findMotion = function (t) {
    var i = !1;
    for (var e in this.motions) {
      var n = this.motions[e];
      n.name == t && (i = n);
    }
    return i;
  }),
  (Motion.prototype.onMotionStop = function (t) {
    this.isReverting = !0;
  }),
  (Motion.prototype.onMotionPlay = function (t, i) {
    if (!i && this.currentMotion && this.currentMotion.name == t) return !1;
    var e = this.findMotion(t);
    (this.isPlaying = !0),
      (this.timestamp = 0),
      (this.currentMotion = e),
      this.triggerStartEvent(this.currentMotion);
  }),
  (Motion.prototype.triggerEvents = function (t) {
    for (var i in this.events) {
      var e = this.events[i],
        n = e.time;
      e.animationName == this.currentMotion.name &&
        n > this.timestamp &&
        n <= this.timestamp + t &&
        this.app.fire(e.eventName);
    }
  }),
  (Motion.prototype.findEventByMotion = function (t, i) {
    for (var e in this.events) {
      var n = this.events[e];
      if (n.animationName == t.name && n.type == i) return n;
    }
  }),
  (Motion.prototype.triggerStartEvent = function (t) {
    var i = this.findEventByMotion(t, 'Start');
    i && this.app.fire(i.eventName);
  }),
  (Motion.prototype.triggerEndEvent = function (t) {
    var i = this.findEventByMotion(t, 'End');
    i && this.app.fire(i.eventName);
  }),
  (Motion.prototype.update = function (t) {
    if (!this.isPlaying) return !1;
    if (!this.currentMotion) return !1;
    var i = this.currentMotion.position.value(this.timestamp),
      e = this.currentMotion.rotation.value(this.timestamp),
      n = this.currentMotion.scale.value(this.timestamp);
    (this.position = this.position.lerp(this.position, new pc.Vec3(i[0], i[1], i[2]), this.lerp)),
      (this.rotation = this.rotation.lerp(this.rotation, new pc.Vec3(e[0], e[1], e[2]), this.lerp)),
      (this.scale = this.scale.lerp(this.scale, new pc.Vec3(n[0], n[1], n[2]), this.lerp)),
      this.entity.setLocalPosition(this.position.clone().add(this.startPosition)),
      this.entity.setLocalEulerAngles(this.rotation.clone().add(this.startRotation)),
      this.entity.setLocalScale(this.scale.clone().add(this.startScale)),
      this.triggerEvents(t),
      this.timestamp >= 1 &&
        ((this.isPlaying = !1),
        this.currentMotion.loop
          ? this.onMotionPlay(this.currentMotion.name, !0)
          : (this.triggerEndEvent(this.currentMotion), (this.currentMotion = !1))),
      this.isReverting
        ? ((this.timestamp -= t * this.currentMotion.speed),
          this.timestamp <= 0 &&
            (this.triggerEndEvent(this.currentMotion),
            (this.currentMotion = !1),
            (this.isPlaying = !1),
            (this.isReverting = !1)))
        : (this.timestamp += t * this.currentMotion.speed),
      (this.timestamp = Math.max(this.timestamp, 0)),
      (this.timestamp = Math.min(this.timestamp, 1));
  });
var Chest = pc.createScript('chest');
Chest.attributes.add('airEntity', {
  type: 'entity',
}),
  Chest.attributes.add('sparkEntity', {
    type: 'entity',
  }),
  Chest.attributes.add('weaponEntity', {
    type: 'entity',
  }),
  Chest.attributes.add('originEntity', {
    type: 'entity',
  }),
  Chest.attributes.add('cameraEntity', {
    type: 'entity',
  }),
  Chest.attributes.add('items', {
    type: 'entity',
    array: !0,
  }),
  (Chest.prototype.initialize = function () {
    (this.isClosed = !0),
      (this.slowDown = !1),
      (this.nextFov = 25),
      (this.fovSpeed = 0.05),
      (this.weaponEntity.enabled = !1),
      this.app.on('Chest:Start', this.onStart, this),
      this.app.on('Chest:Close', this.close, this),
      this.app.on('Chest:Explode', this.onExplode, this),
      this.app.on('Chest:Open', this.open, this);
  }),
  (Chest.prototype.onStart = function (t) {
    (this.airEntity.enabled = !0),
      this.entity.sound.play('Device'),
      this.entity.sound.play('WhiteShadow'),
      clearTimeout(this.timer0),
      (this.timer0 = setTimeout(
        function (t) {
          t.airEntity.enabled = !1;
        },
        700,
        this
      ));
  }),
  (Chest.prototype.onExplode = function (t) {
    (this.entity.animation.currentTime = 0),
      this.entity.animation.play('CrateOpen'),
      (this.entity.animation.speed = 1),
      this.entity.sound.play('Spark'),
      this.entity.sound.play('Unlock'),
      (this.weaponEntity.enabled = !0),
      this.app.fire('Motion:Weapon', 'Bounce'),
      (this.slowDown = !1),
      (this.originEntity.script.rotate.speed = 20),
      this.originEntity.setLocalEulerAngles(0, 0, 0),
      (this.sparkEntity.enabled = !0),
      this.sparkEntity.particlesystem.reset(),
      this.sparkEntity.particlesystem.play(),
      clearTimeout(this.timer0),
      (this.timer0 = setTimeout(
        function (t) {
          (t.sparkEntity.enabled = !1), (t.entity.animation.speed = 0), (t.slowDown = !0);
        },
        900,
        this
      )),
      clearTimeout(this.timer1),
      (this.timer1 = setTimeout(
        function (t) {
          (t.fovSpeed = 0.05), (t.nextFov = 15);
        },
        300,
        this
      )),
      clearTimeout(this.timer2),
      (this.timer2 = setTimeout(
        function (t) {
          t.entity.animation.speed = 0;
        },
        500,
        this
      ));
  }),
  (Chest.prototype.close = function (t) {
    (this.fovSpeed = 0.2),
      (this.nextFov = 25),
      (this.entity.animation.speed = 6),
      (this.weaponEntity.enabled = !1),
      (this.isClosed = !0),
      t &&
        setTimeout(
          function (i) {
            i.open(t);
          },
          700,
          this
        );
  }),
  (Chest.prototype.playRarity = function (t) {
    'Legendary' == t.rarity && this.entity.sound.play('Legendary'),
      'Mythical' == t.rarity && this.entity.sound.play('Mythical'),
      'Rare' == t.rarity && this.entity.sound.play('Rare'),
      'Limited' == t.rarity && this.entity.sound.play('Limited');
  }),
  (Chest.prototype.open = function (t) {
    if (!this.isClosed) return this.close(t), !1;
    if (
      (this.app.fire('Motion:Chest', 'Openning'), this.app.fire('Motion:Origin', 'Openning'), t)
    ) {
      var i = this.items.find(function (i) {
        return t.class == i.name;
      });
      this.items.find(function (i) {
        t.class == i.name ? (i.enabled = !0) : (i.enabled = !1);
      }),
        (i.initFire = {
          event: 'CustomSkin:Set',
          args: {
            skin: t.filename,
          },
        }),
        i.fire('CustomSkin:Set', {
          skin: t.filename,
        }),
        setTimeout(
          function (i) {
            i.playRarity(t);
          },
          900,
          this
        );
    } else
      this.items.forEach(function (t) {
        t.enabled = !1;
      });
    this.isClosed = !1;
  }),
  (Chest.prototype.update = function (t) {
    this.slowDown &&
      (this.originEntity.script.rotate.speed = pc.math.lerp(
        this.originEntity.script.rotate.speed,
        0.8,
        0.1
      )),
      (this.cameraEntity.camera.fov = pc.math.lerp(
        this.cameraEntity.camera.fov,
        this.nextFov,
        this.fovSpeed
      ));
  });
var InitFire = pc.createScript('initFire');
InitFire.prototype.initialize = function () {
  this.entity.initFire && this.entity.fire(this.entity.initFire.event, this.entity.initFire.args);
};
var Mvp = pc.createScript('mvp');
Mvp.attributes.add('heroes', {
  type: 'entity',
  array: !0,
}),
  Mvp.attributes.add('holderEntity', {
    type: 'entity',
  }),
  (Mvp.prototype.initialize = function () {
    this.app.on('View:State', this.setState, this),
      this.app.on('MVP:Select', this.setHero, this),
      this.setState('Hero');
  }),
  (Mvp.prototype.setState = function (t) {
    this.holderEntity.enabled = 'Result' == t;
  }),
  (Mvp.prototype.getFromHeroList = function (t) {
    var e = !1;
    for (var i in this.heroes) {
      var o = this.heroes[i];
      o.name == t && (e = o);
    }
    return e;
  }),
  (Mvp.prototype.hideAllHeroes = function () {
    for (var t in this.heroes) {
      this.heroes[t].enabled = !1;
    }
  }),
  (Mvp.prototype.setHero = function (t) {
    this.hideAllHeroes();
    var e = this.getFromHeroList(t);
    e &&
      e.model.ready(function () {
        (e.enabled = !0),
          e.animation.play('Taunt'),
          (e.findByName('DefaultWeaponHolder').enabled = !1),
          setTimeout(function (t) {}, 100, this),
          pc.app.fire('MVP:Loaded', !0);
      });
  });
var Transition = pc.createScript('transition');
Transition.attributes.add('cameraEntity', {
  type: 'entity',
}),
  Transition.attributes.add('blackShadow', {
    type: 'entity',
  }),
  Transition.attributes.add('modeEntity', {
    type: 'entity',
  }),
  Transition.attributes.add('mapNameEntity', {
    type: 'entity',
  }),
  Transition.attributes.add('mapImageEntity', {
    type: 'entity',
  }),
  (Transition.prototype.initialize = function () {
    (this.isAlreadyActive = !1),
      (this.blackShadow.enabled = !1),
      this.app.on('Transition:Show', this.show, this),
      this.app.on('Transition:Hide', this.hide, this);
  }),
  (Transition.prototype.show = function (t, i, e) {
    if (this.isAlreadyActive) return !1;
    (this.cameraEntity.enabled = !0),
      (this.modeEntity.element.text = t),
      (this.blackShadow.enabled = !0),
      (this.mapNameEntity.element.text = i.toLowerCase()),
      (this.mapImageEntity.element.textureAsset = Utils.getAssetFromURL(i + '-Large.jpg', 'map')),
      (this.mapImageEntity.element.color = pc.colors.white),
      this.app.fire('Timeline:Map'),
      this.entity.sound.play('Loading'),
      this.entity.sound.play('Respawn'),
      (this.isAlreadyActive = !0);
  }),
  (Transition.prototype.hide = function () {
    (this.cameraEntity.enabled = !1),
      (this.mapImageEntity.element.color = pc.colors.black),
      clearTimeout(this.blackTimer),
      (this.blackTimer = setTimeout(
        function (t) {
          t.blackShadow.enabled = !1;
        },
        500,
        this
      )),
      (this.isAlreadyActive = !1);
  });
var AudioFix = pc.createScript('audioFix');
AudioFix.prototype.initialize = function () {
  this.app.systems.audiolistener.manager.listener.setPosition = function (i) {
    if (!i) return !1;
    if (isNaN(i.x)) return !1;
    this.position.copy(i);
    var t = this.listener;
    t && t.setPosition(i.x, i.y, i.z);
  };
};
var MaterialShader = pc.createScript('materialShader');
MaterialShader.attributes.add('inEditor', {
  type: 'boolean',
  default: !0,
  title: 'In Editor',
}),
  MaterialShader.attributes.add('isDebug', {
    type: 'boolean',
    default: !1,
  }),
  MaterialShader.attributes.add('isStatic', {
    type: 'boolean',
    default: !1,
  }),
  MaterialShader.attributes.add('color', {
    type: 'boolean',
    default: !0,
  }),
  MaterialShader.attributes.add('transform', {
    type: 'boolean',
    default: !0,
  }),
  MaterialShader.attributes.add('light', {
    type: 'boolean',
    default: !0,
  }),
  MaterialShader.attributes.add('material', {
    type: 'asset',
    assetType: 'material',
  }),
  MaterialShader.attributes.add('textures', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'texture_0',
      },
      {
        name: 'texture',
        type: 'asset',
        assetType: 'texture',
      },
    ],
    array: !0,
  }),
  MaterialShader.attributes.add('colors', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'color_0',
      },
      {
        name: 'color',
        type: 'rgba',
      },
    ],
    array: !0,
  }),
  MaterialShader.attributes.add('vectors', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'vector_0',
      },
      {
        name: 'vector',
        type: 'vec2',
      },
    ],
    array: !0,
  }),
  MaterialShader.attributes.add('numbers', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'number_0',
      },
      {
        name: 'number',
        type: 'number',
        default: 0,
      },
    ],
    array: !0,
  }),
  MaterialShader.attributes.add('curves', {
    type: 'json',
    schema: [
      {
        name: 'name',
        type: 'string',
        default: 'curve_0',
      },
      {
        name: 'curve',
        type: 'curve',
        curves: ['x', 'y', 'z'],
      },
      {
        name: 'speed',
        type: 'number',
        default: 1,
      },
    ],
    array: !0,
  }),
  MaterialShader.attributes.add('billboard', {
    type: 'boolean',
    default: !1,
  }),
  MaterialShader.attributes.add('vertexSet', {
    type: 'boolean',
    default: !1,
  }),
  MaterialShader.attributes.add('shader', {
    type: 'string',
    default:
      'dmVjNCBnZXRDb2xvcih2ZWMyIFVWKXsKLy92ZWMzIHRleHR1cmVfY29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZV8wLCBVVikucmdiOwpjb2xvci5yZ2IgPSB2ZWMzKDAuMCwgMS4wLCAwLjApOwpjb2xvci5hID0gMS4wOwoKcmV0dXJuIGNvbG9yOwp9Cgp2ZWMzIGdldFZlcnRleCh2ZWMzIGxvY2FsUG9zaXRpb24sIHZlYzMgd29ybGRQb3NpdGlvbiwgdmVjMiBVVil7CnZlcnRleC54eXogPSB2ZWMzKDAuMCwgMC4wLCAwLjApOwoKcmV0dXJuIHZlcnRleDsKfQ==',
  }),
  (MaterialShader.prototype.initialize = function () {
    (this.once = !1),
      this.reset(),
      this.isDebug
        ? this.addCodeEditor()
        : ((this.emissive = atob(this.shader)), this.updateMaterial()),
      this.on('attr:textures', this.onAttributeChange, this),
      this.on('attr:colors', this.onAttributeChange, this),
      this.on('attr:vectors', this.onAttributeChange, this),
      this.on('attr:numbers', this.onAttributeChange, this),
      this.on('attr:curves', this.onAttributeChange, this),
      this.on('attr:shader', this.onAttributeChange, this),
      this.entity.on('MaterialShader:Set', this.setVariable, this),
      this.on('state', this.onStateChange, this),
      this.entity.on('Model:Loaded', this.onModelLoaded, this),
      this.app.on('MaterialShader:Reset', this.onStateChange, this),
      this.material &&
        ((this.totalAssets = 2 + this.textures.length), (this.loaded = 0), this.loadAllAssets());
  }),
  (MaterialShader.prototype.loadAllAssets = function () {
    var t = this,
      e = this.entity.model.asset,
      a = this.app.assets.get(e);
    for (var r in (a.ready(function () {
      t.loaded++, t.isLoaded();
    }),
    this.app.assets.load(a),
    this.material.ready(function () {
      t.loaded++, t.isLoaded();
    }),
    this.app.assets.load(this.material),
    this.textures)) {
      var i = this.textures[r];
      i.texture.ready(function () {
        t.loaded++, t.isLoaded();
      }),
        this.app.assets.load(i.texture);
    }
  }),
  (MaterialShader.prototype.isLoaded = function () {
    this.loaded >= this.totalAssets && this.updateMaterial();
  }),
  (MaterialShader.prototype.setVariable = function (t, e) {
    for (var a in this.parameters) {
      var r = this.parameters[a];
      this.currentMaterial.setParameter(r.name, r.resource),
        r.name == t && (this.parameters[a].resource = e);
    }
  }),
  (MaterialShader.prototype.updateDynamicVariables = function () {
    for (var t in this.curves) {
      var e = this.curves[t];
      for (var a in this.parameters) {
        var r = this.parameters[a];
        if (r.name == e.name) {
          var i = e.curve.value((this.timestamp * e.speed) % 1);
          r.resource = [i[0], i[1], i[2]];
        }
      }
    }
  }),
  (MaterialShader.prototype.onModelLoaded = function (t) {
    !0 === t &&
      setTimeout(
        function (t) {
          t.onAttributeChange();
        },
        3e3,
        this
      );
  }),
  (MaterialShader.prototype.onStateChange = function (t) {
    this.reset();
  }),
  (MaterialShader.prototype.copy = function (t) {
    var e = btoa(t);
    navigator.clipboard.writeText(e).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
      },
      function (t) {
        console.error('Async: Could not copy text: ', t);
      }
    );
  }),
  (MaterialShader.prototype.addCodeEditor = function () {
    var t = this,
      e = document.createElement('button');
    (e.style.position = 'fixed'),
      (e.style.left = '10px'),
      (e.style.top = '340px'),
      (e.style.width = '100px'),
      (e.style.height = '40px'),
      (e.style.zIndex = '5000'),
      (e.style.background = 'rgba(0, 0, 0, 0.5)'),
      (e.style.color = '#fff'),
      (e.textContent = 'Copy'),
      (e.onclick = function () {
        t.copy(t.emissiveCode.value);
      }),
      document.body.appendChild(e);
    var a = document.createElement('textarea');
    (a.style.position = 'fixed'),
      (a.style.left = '10px'),
      (a.style.top = '10px'),
      (a.style.width = '400px'),
      (a.style.height = '300px'),
      (a.style.padding = '10px'),
      (a.style.zIndex = '5000'),
      (a.style.background = 'rgba(0, 0, 0, 0.5)'),
      (a.style.outline = 'none'),
      (a.style.color = 'white'),
      (a.onkeyup = this.onShaderChange.bind(this));
    var r = document.createElement('style');
    (r.innerText = '#application-console{max-height: 80px;}'),
      document.body.appendChild(r),
      (this.emissiveCode = a),
      (this.emissiveCode.value = atob(this.shader)),
      (this.emissive = this.emissiveCode.value),
      this.updateMaterial(),
      document.body.appendChild(a);
  }),
  (MaterialShader.prototype.onShaderChange = function () {
    clearTimeout(this.timer),
      (this.timer = setTimeout(
        function (t) {
          (t.emissive = t.emissiveCode.value), t.updateMaterial();
        },
        100,
        this
      ));
  }),
  (MaterialShader.prototype.reset = function () {
    (this.timestamp = 0), (this.parameters = []);
  }),
  (MaterialShader.prototype.line = function (t) {
    return t + '\n';
  }),
  (MaterialShader.prototype.number = function (t) {
    return parseFloat(t).toFixed(2);
  }),
  (MaterialShader.prototype.colorRGB = function (t) {
    return (
      'vec3(' +
      this.number(t.data[0]) +
      ', ' +
      this.number(t.data[1]) +
      ', ' +
      this.number(t.data[2]) +
      ')'
    );
  }),
  (MaterialShader.prototype.colorRGBA = function (t) {
    return (
      'vec4(' +
      this.number(t.data[0]) +
      ', ' +
      this.number(t.data[1]) +
      ', ' +
      this.number(t.data[2]) +
      ', ' +
      this.number(t.data[3]) +
      ')'
    );
  }),
  (MaterialShader.prototype.addParameter = function (t, e) {
    var a = '';
    for (var r in this[t]) {
      var i = this[t][r],
        s = !1;
      if (
        ((a += this.line('uniform ' + e + ' ' + i.name + ';')),
        'textures' == t && (s = i.texture.resource),
        'colors' == t && (s = i.color.data),
        'vectors' == t && (s = i.vector.data),
        'curves' == t)
      ) {
        var o = i.curve.value(this.timestamp * i.speed);
        s = [o[0], o[1], o[2]];
      }
      'numbers' == t && (s = i.number),
        this.parameters.push({
          name: i.name,
          resource: s,
        });
    }
    return a;
  }),
  (MaterialShader.prototype.generateShaderOutput = function () {
    var t = '';
    return (
      (t += this.addParameter('textures', 'sampler2D')),
      (t += this.addParameter('colors', 'vec4')),
      (t += this.addParameter('vectors', 'vec2')),
      (t += this.addParameter('numbers', 'float')),
      (t += this.addParameter('curves', 'vec3')),
      (t += this.line('uniform float timestamp;')),
      (t += this.line('uniform float alpha_ref;')),
      (t += this.line('vec4 color  = vec4(0.0);')),
      (t += this.line('vec3 vertex = vec3(0.0);')),
      (t += this.line(this.emissive)),
      (t += this.line('void getEmission() {')),
      (t += this.line('}')),
      (t += this.line('void getAlbedo() {')),
      (t += this.line('}')),
      (t += this.line('void getOpacity() {')),
      (t += this.line('}')),
      (t += this.line('void alphaTest(float a) {')),
      (t += this.line('if (a < alpha_ref) discard;')),
      (t += this.line('}'))
    );
  }),
  (MaterialShader.prototype.onAttributeChange = function () {
    this.reset(), this.updateMaterial();
  }),
  (MaterialShader.prototype.generateTransformOutput = function () {
    var t = '';
    return (
      (t += this.addParameter('textures', 'sampler2D')),
      (t += this.addParameter('colors', 'vec4')),
      (t += this.addParameter('vectors', 'vec2')),
      (t += this.addParameter('numbers', 'float')),
      (t += this.addParameter('curves', 'vec3')),
      (t += this.line('uniform float timestamp;')),
      (t += this.line('uniform mat4 matrix_viewInverse;')),
      (t += this.line('mat4 getModelMatrix() {')),
      (t += this.line('return matrix_model;')),
      (t += this.line('}')),
      (t += this.line('vec4 color  = vec4(0.0);')),
      (t += this.line('vec3 vertex = vec3(0.0);')),
      (t += this.line(this.emissive)),
      (t += this.line('vec4 getPosition() {')),
      (t += this.line('dModelMatrix = getModelMatrix();')),
      (t += this.line('vec3 localPos = vertex_position;')),
      (t += this.line('vec4 posW   = dModelMatrix * vec4(localPos, 1.0);')),
      (t += this.line('vec2 UV     = localPos.xy * 0.5 + vec2(0.5, 0.5);')),
      this.billboard &&
        ((t += this.line('vec3 CameraUp_worldspace = matrix_viewInverse[1].xyz;')),
        (t += this.line('vec3 CameraRight_worldspace = matrix_viewInverse[0].xyz;')),
        (t += this.line(
          'vec3 particleCenter_wordspace = ( dModelMatrix * vec4(0.0, 0.0, 0.0, 1.0) ).xyz;'
        )),
        (t += this.line(
          'posW.xyz = particleCenter_wordspace.xyz + CameraRight_worldspace * localPos.x + CameraUp_worldspace * localPos.y;'
        ))),
      this.vertexSet
        ? (t += this.line(
            'posW.xyz = getFullVertex(localPos, posW.xyz, UV, dModelMatrix, matrix_viewInverse);'
          ))
        : (t += this.line('posW.xyz+= getVertex(localPos, posW.xyz, UV);')),
      (t += this.line('dPositionW = posW.xyz;')),
      (t += this.line('vec4 outputPosition = matrix_viewProjection * posW;')),
      (t += this.line('return outputPosition;')),
      (t += this.line('}')),
      (t += this.line('vec3 getWorldPosition() {')),
      (t += this.line('return dPositionW;')),
      (t += this.line('}'))
    );
  }),
  (MaterialShader.prototype.updateMaterial = function () {
    if (
      ((this.timestamp = 0), (this.currentMaterial = this.material.resource), !this.currentMaterial)
    )
      return !1;
    this.transform && (this.currentMaterial.chunks.transformVS = this.generateTransformOutput()),
      this.color &&
        ((this.currentMaterial.chunks.diffusePS = this.generateShaderOutput()),
        (this.currentMaterial.chunks.opacityPS = ' '),
        (this.currentMaterial.chunks.emissivePS = ' '),
        (this.currentMaterial.chunks.alphaTestPS = ' '),
        (this.currentMaterial.chunks.endPS = 'vec4 outputColor = getColor(vUv0);'),
        (this.currentMaterial.chunks.endPS += 'dAlpha = outputColor.a;'),
        (this.currentMaterial.chunks.endPS += 'if (dAlpha < 0.15){ discard; }'),
        (this.currentMaterial.chunks.endPS += 'gl_FragColor.rgb = outputColor.rgb;'),
        this.light &&
          ((this.currentMaterial.chunks.endPS +=
            'gl_FragColor.rgb = mix(gl_FragColor.rgb * dDiffuseLight, dSpecularLight + dReflection.rgb * dReflection.a, dSpecularity);'),
          (this.currentMaterial.chunks.endPS += 'gl_FragColor.rgb = addFog(gl_FragColor.rgb);'),
          (this.currentMaterial.chunks.endPS += 'gl_FragColor.rgb = toneMap(gl_FragColor.rgb);'),
          (this.currentMaterial.chunks.endPS +=
            'gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);'))),
      this.currentMaterial.update();
  }),
  (MaterialShader.prototype.update = function (t) {
    if (this.currentMaterial) {
      if ((this.updateDynamicVariables(), !this.isStatic || !this.once)) {
        for (var e in this.parameters) {
          var a = this.parameters[e];
          this.currentMaterial.setParameter(a.name, a.resource);
        }
        this.once = !0;
      }
      this.currentMaterial.setParameter('timestamp', this.timestamp), this.currentMaterial.update();
    }
    this.timestamp += t;
  });
