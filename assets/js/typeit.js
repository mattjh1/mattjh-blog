// TypeIt by Alex MacArthur - https://typeitjs.com
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
      ? define(t)
      : ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).TypeIt =
          t());
})(this, function () {
  "use strict";
  const e = (e) => Array.isArray(e),
    t = (t) => (e(t) ? t : [t]);
  const n = (e) => Array.from(e),
    r = (e) => document.createTextNode(e);
  let i = (e) => (
    [...e.childNodes].forEach((e) => {
      if (e.nodeValue)
        return (
          [...e.nodeValue].forEach((t) => {
            e.parentNode.insertBefore(r(t), e);
          }),
          void e.remove()
        );
      i(e);
    }),
    e
  );
  const a = (e) => {
      let t = document.implementation.createHTMLDocument();
      return (t.body.innerHTML = e), i(t.body);
    },
    o = "data-typeit-id",
    s = "ti-cursor",
    l = { started: !1, completed: !1, frozen: !1, destroyed: !1 },
    u = {
      breakLines: !0,
      cursor: {
        autoPause: !0,
        autoPauseDelay: 500,
        animation: {
          frames: [0, 0, 1].map((e) => ({ opacity: e })),
          options: {
            iterations: 1 / 0,
            easing: "steps(2, start)",
            fill: "forwards",
          },
        },
      },
      cursorChar: "|",
      cursorSpeed: 1e3,
      deleteSpeed: null,
      html: !0,
      lifeLike: !0,
      loop: !1,
      loopDelay: 750,
      nextStringDelay: 750,
      speed: 100,
      startDelay: 250,
      startDelete: !1,
      strings: [],
      waitUntilVisible: !1,
      beforeString: () => {},
      afterString: () => {},
      beforeStep: () => {},
      afterStep: () => {},
      afterComplete: () => {},
    },
    c = `[${o}]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`;
  function d(e, t = !1, n = !1) {
    let r,
      i = e.querySelector(`.${s}`),
      a = document.createTreeWalker(e, NodeFilter.SHOW_ALL, {
        acceptNode: (e) => {
          if (i && n) {
            if (e.classList?.contains(s)) return NodeFilter.FILTER_ACCEPT;
            if (i.contains(e)) return NodeFilter.FILTER_REJECT;
          }
          return e.classList?.contains(s)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        },
      }),
      o = [];
    for (; (r = a.nextNode()); )
      r.originalParent || (r.originalParent = r.parentNode), o.push(r);
    return t ? o.reverse() : o;
  }
  function f(e, t = !0) {
    return t ? d(a(e)) : n(e).map(r);
  }
  const h = (e) => document.createElement(e),
    y = (e, t = "") => {
      let n = h("style");
      (n.id = t), n.appendChild(r(e)), document.head.appendChild(n);
    },
    p = (t) => (e(t) || (t = [t / 2, t / 2]), t),
    m = (e, t) => Math.abs(Math.random() * (e + t - (e - t)) + (e - t));
  let g = (e) => e / 2;
  const b = (e) => "value" in e;
  let w = (e) => ("function" == typeof e ? e() : e);
  const T = (e) => Number.isInteger(e);
  let v = (e, t = document, n = !1) => t["querySelector" + (n ? "All" : "")](e);
  const E = (e, t) => Object.assign({}, e, t);
  let P = {
    "font-family": "",
    "font-weight": "",
    "font-size": "",
    "font-style": "",
    "line-height": "",
    color: "",
    transform: "translateX(-.125em)",
  };
  const S = (e, t) => new Array(t).fill(e),
    N = ({ queueItems: e, selector: t, cursorPosition: n, to: r }) => {
      if (T(t)) return -1 * t;
      let i = new RegExp("END", "i").test(r),
        a = t
          ? [...e].reverse().findIndex(({ char: e }) => {
              let n = e.parentElement,
                r = n.matches(t);
              return !(!i || !r) || (r && n.firstChild.isSameNode(e));
            })
          : -1;
      return a < 0 && (a = i ? 0 : e.length - 1), a - n + (i ? 0 : 1);
    };
  let L = (e) =>
      new Promise((t) => {
        requestAnimationFrame(async () => {
          t(await e());
        });
      }),
    C = (e) => e?.getAnimations().find((t) => t.id === e.dataset.tiAnimationId),
    D = ({ cursor: e, frames: t, options: n }) => {
      let r = e.animate(t, n);
      return (
        r.pause(),
        (r.id = e.dataset.tiAnimationId),
        L(() => {
          L(() => {
            r.play();
          });
        }),
        r
      );
    },
    I = (e) => e.func?.call(null),
    M = async ({
      index: e,
      queueItems: t,
      wait: n,
      cursor: r,
      cursorOptions: i,
    }) => {
      let a = t[e][1],
        o = [],
        s = e,
        l = a,
        u = () => l && !l.delay,
        c = a.shouldPauseCursor() && i.autoPause;
      for (; u(); ) o.push(l), u() && s++, (l = t[s] ? t[s][1] : null);
      if (o.length)
        return (
          await L(async () => {
            for (let e of o) await I(e);
          }),
          s - 1
        );
      let d,
        f = C(r);
      return (
        f &&
          (d = {
            ...f.effect.getComputedTiming(),
            delay: c ? i.autoPauseDelay : 0,
          }),
        await n(async () => {
          f && c && f.cancel(),
            await L(() => {
              I(a);
            });
        }, a.delay),
        await (({ cursor: e, options: t, cursorOptions: n }) => {
          if (!e || !n) return;
          let r,
            i = C(e);
          i &&
            ((t.delay = i.effect.getComputedTiming().delay),
            (r = i.currentTime),
            i.cancel());
          let a = D({ cursor: e, frames: n.animation.frames, options: t });
          return r && (a.currentTime = r), a;
        })({ cursor: r, options: d, cursorOptions: i }),
        e
      );
    };
  return function (e, r = {}) {
    let L = async (e, t, n = !1) => {
        K.frozen &&
          (await new Promise((e) => {
            this.unfreeze = () => {
              (K.frozen = !1), e();
            };
          })),
          n || (await Y.beforeStep(this)),
          await ((e, t, n) =>
            new Promise((r) => {
              n.push(
                setTimeout(async () => {
                  await e(), r();
                }, t || 0),
              );
            }))(e, t, W),
          n || (await Y.afterStep(this));
      },
      C = (e, t) =>
        M({
          index: e,
          queueItems: t,
          wait: L,
          cursor: ne,
          cursorOptions: Y.cursor,
        }),
      I = (e) =>
        ((e, t) => {
          if (!e) return;
          let n = e.parentNode;
          (n.childNodes.length > 1 || n.isSameNode(t) ? e : n).remove();
        })(e, J),
      x = () => b(J),
      A = (e = 0) =>
        (function (e) {
          let { speed: t, deleteSpeed: n, lifeLike: r } = e;
          return (
            (n = null !== n ? n : t / 3), r ? [m(t, g(t)), m(n, g(n))] : [t, n]
          );
        })(Y)[e],
      $ = () =>
        ((e) =>
          b(e)
            ? n(e.value)
            : d(e, !0).filter((e) => !(e.childNodes.length > 0)))(J),
      H = (e, t) => (
        ee.add(e),
        ((e = {}) => {
          let t = e.delay;
          t && ee.add({ delay: t });
        })(t),
        this
      ),
      O = () => G ?? X,
      F = (e = {}) => [{ func: () => j(e) }, { func: () => j(Y) }],
      k = (e) => {
        let t = Y.nextStringDelay;
        ee.add([{ delay: t[0] }, ...e, { delay: t[1] }]);
      },
      R = async () => {
        if ((!x() && ne && J.appendChild(ne), te)) {
          ((e, t) => {
            let n = `[${o}='${e}'] .${s}`,
              r = getComputedStyle(t),
              i = Object.entries(P).reduce(
                (e, [t, n]) =>
                  `${e} ${t}: var(--ti-cursor-${t}, ${n || r[t]});`,
                "",
              );
            y(`${n} { display: inline-block; width: 0; ${i} }`, e);
          })(Z, J),
            (ne.dataset.tiAnimationId = Z);
          let { animation: e } = Y.cursor,
            { frames: t, options: n } = e;
          D({
            frames: t,
            cursor: ne,
            options: { duration: Y.cursorSpeed, ...n },
          });
        }
      },
      q = () => {
        let e = Y.strings.filter((e) => !!e);
        e.forEach((t, n) => {
          if ((this.type(t), n + 1 === e.length)) return;
          let r = Y.breakLines
            ? [{ func: () => _(h("BR")), typeable: !0 }]
            : S({ func: Q, delay: A(1) }, ee.getTypeable().length);
          k(r);
        });
      },
      z = async (e = !0) => {
        K.started = !0;
        let t = (t) => {
          ee.done(t, !e);
        };
        try {
          let n = [...ee.getQueue()];
          for (let e = 0; e < n.length; e++) {
            let [r, i] = n[e];
            if (!i.done) {
              if (!i.deletable || (i.deletable && $().length)) {
                let r = await C(e, n);
                Array(r - e)
                  .fill(e + 1)
                  .map((e, t) => e + t)
                  .forEach((e) => {
                    let [r] = n[e];
                    t(r);
                  }),
                  (e = r);
              }
              t(r);
            }
          }
          if (!e) return this;
          if (((K.completed = !0), await Y.afterComplete(this), !Y.loop))
            throw "";
          let r = Y.loopDelay;
          L(async () => {
            await (async (e) => {
              let t = O();
              t && (await B({ value: t }));
              let n = $().map((e) => [
                Symbol(),
                {
                  func: Q,
                  delay: A(1),
                  deletable: !0,
                  shouldPauseCursor: () => !0,
                },
              ]);
              for (let r = 0; r < n.length; r++) await C(r, n);
              ee.reset(), ee.set(0, { delay: e });
            })(r[0]),
              z();
          }, r[1]);
        } catch (n) {}
        return this;
      },
      B = async (e) => {
        var t, n, r;
        (t = e),
          (n = X),
          (r = $()),
          (X = Math.min(Math.max(n + t, 0), r.length)),
          ((e, t, n) => {
            let r = t[n - 1],
              i = v(`.${s}`, e);
            (e = r?.parentNode || e).insertBefore(i, r || null);
          })(J, $(), X);
      },
      _ = (e) =>
        ((e, t) => {
          if (b(e)) return void (e.value = `${e.value}${t.textContent}`);
          t.innerHTML = "";
          let n =
            ((r = t.originalParent),
            /body/i.test(r?.tagName) ? e : t.originalParent || e);
          var r;
          n.insertBefore(t, v("." + s, n) || null);
        })(J, e),
      j = async (e) => (Y = E(Y, e)),
      V = async () => {
        x() ? (J.value = "") : $().forEach(I);
      },
      Q = () => {
        let e = $();
        e.length && (x() ? (J.value = J.value.slice(0, -1)) : I(e[X]));
      };
    (this.break = function (e) {
      return H({ func: () => _(h("BR")), typeable: !0 }, e);
    }),
      (this.delete = function (e = null, t = {}) {
        e = w(e);
        let n = F(t),
          r = e,
          { instant: i, to: a } = t,
          o = ee.getTypeable(),
          s =
            null === r
              ? o.length
              : T(r)
                ? r
                : N({ queueItems: o, selector: r, cursorPosition: O(), to: a });
        return H(
          [
            n[0],
            ...S({ func: Q, delay: i ? 0 : A(1), deletable: !0 }, s),
            n[1],
          ],
          t,
        );
      }),
      (this.empty = function (e = {}) {
        return H({ func: V }, e);
      }),
      (this.exec = function (e, t = {}) {
        let n = F(t);
        return H([n[0], { func: () => e(this) }, n[1]], t);
      }),
      (this.move = function (e, t = {}) {
        e = w(e);
        let n = F(t),
          { instant: r, to: i } = t,
          a = N({
            queueItems: ee.getTypeable(),
            selector: null === e ? "" : e,
            to: i,
            cursorPosition: O(),
          }),
          o = a < 0 ? -1 : 1;
        return (
          (G = O() + a),
          H(
            [
              n[0],
              ...S(
                { func: () => B(o), delay: r ? 0 : A(), cursorable: !0 },
                Math.abs(a),
              ),
              n[1],
            ],
            t,
          )
        );
      }),
      (this.options = function (e, t = {}) {
        return (e = w(e)), j(e), H({}, t);
      }),
      (this.pause = function (e, t = {}) {
        return H({ delay: w(e) }, t);
      }),
      (this.type = function (e, t = {}) {
        e = w(e);
        let { instant: n } = t,
          r = F(t),
          i = f(e, Y.html).map((e) => {
            return {
              func: () => _(e),
              char: e,
              delay:
                n || ((t = e), /<(.+)>(.*?)<\/(.+)>/.test(t.outerHTML))
                  ? 0
                  : A(),
              typeable: e.nodeType === Node.TEXT_NODE,
            };
            var t;
          }),
          a = [
            r[0],
            { func: async () => await Y.beforeString(e, this) },
            ...i,
            { func: async () => await Y.afterString(e, this) },
            r[1],
          ];
        return H(a, t);
      }),
      (this.is = function (e) {
        return K[e];
      }),
      (this.destroy = function (e = !0) {
        W.forEach(clearTimeout),
          (W = []),
          w(e) && ne && I(ne),
          (K.destroyed = !0);
      }),
      (this.freeze = function () {
        K.frozen = !0;
      }),
      (this.unfreeze = () => {}),
      (this.reset = function (e) {
        !this.is("destroyed") && this.destroy(),
          e ? (ee.wipe(), e(this)) : ee.reset(),
          (X = 0);
        for (let t in K) K[t] = !1;
        return (J[x() ? "value" : "innerHTML"] = ""), this;
      }),
      (this.go = function () {
        return K.started
          ? this
          : (R(),
            Y.waitUntilVisible
              ? (((e, t) => {
                  new IntersectionObserver(
                    (n, r) => {
                      n.forEach((n) => {
                        n.isIntersecting && (t(), r.unobserve(e));
                      });
                    },
                    { threshold: 1 },
                  ).observe(e);
                })(J, z.bind(this)),
                this)
              : (z(), this));
      }),
      (this.flush = function (e = () => {}) {
        return R(), z(!1).then(e), this;
      }),
      (this.getQueue = () => ee),
      (this.getOptions = () => Y),
      (this.updateOptions = (e) => j(e)),
      (this.getElement = () => J);
    let J = "string" == typeof (U = e) ? v(U) : U;
    var U;
    let W = [],
      X = 0,
      G = null,
      K = E({}, l);
    r.cursor = ((e) => {
      if ("object" == typeof e) {
        let t = {},
          { frames: n, options: r } = u.cursor.animation;
        return (
          (t.animation = e.animation || {}),
          (t.animation.frames = e.animation?.frames || n),
          (t.animation.options = E(r, e.animation?.options || {})),
          (t.autoPause = e.autoPause ?? u.cursor.autoPause),
          (t.autoPauseDelay = e.autoPauseDelay || u.cursor.autoPauseDelay),
          t
        );
      }
      return !0 === e ? u.cursor : e;
    })(r.cursor ?? u.cursor);
    let Y = E(u, r);
    Y = E(Y, {
      html: !x() && Y.html,
      nextStringDelay: p(Y.nextStringDelay),
      loopDelay: p(Y.loopDelay),
    });
    let Z = Math.random().toString().substring(2, 9),
      ee = (function (e) {
        let n = function (e) {
            return (
              t(e).forEach((e) =>
                a.set(Symbol(e.char?.innerText), r({ ...e })),
              ),
              this
            );
          },
          r = (e) => (
            (e.shouldPauseCursor = function () {
              return Boolean(
                this.typeable || this.cursorable || this.deletable,
              );
            }),
            e
          ),
          i = () => Array.from(a.values()),
          a = new Map();
        return (
          n(e),
          {
            add: n,
            set: function (e, t) {
              let n = [...a.keys()];
              a.set(n[e], r(t));
            },
            wipe: function () {
              (a = new Map()), n(e);
            },
            reset: function () {
              a.forEach((e) => delete e.done);
            },
            destroy: (e) => a.delete(e),
            done: (e, t = !1) => (t ? a.delete(e) : (a.get(e).done = !0)),
            getItems: (e = !1) => (e ? i() : i().filter((e) => !e.done)),
            getQueue: () => a,
            getTypeable: () => i().filter((e) => e.typeable),
          }
        );
      })([{ delay: Y.startDelay }]);
    (J.dataset.typeitId = Z), y(c);
    let te = !!Y.cursor && !x(),
      ne = (() => {
        if (x()) return;
        let e = h("span");
        return (
          (e.className = s),
          te
            ? ((e.innerHTML = a(Y.cursorChar).innerHTML), e)
            : ((e.style.visibility = "hidden"), e)
        );
      })();
    (Y.strings = ((e) => {
      let t = J.innerHTML;
      return t
        ? ((J.innerHTML = ""),
          Y.startDelete
            ? ((J.innerHTML = t),
              i(J),
              k(S({ func: Q, delay: A(1), deletable: !0 }, $().length)),
              e)
            : t
                .replace(/<!--(.+?)-->/g, "")
                .trim()
                .split(/<br(?:\s*?)(?:\/)?>/)
                .concat(e))
        : e;
    })(t(Y.strings))),
      Y.strings.length && q();
  };
});
