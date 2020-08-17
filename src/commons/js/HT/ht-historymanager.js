!function(E, _, Z) {
  "use strict";
  var n = "ht"
    , O = E[n]
    , W = O.Default
    , y = W.def
    , d = W.getInternal();
  O.HistoryManager = function(X) {
    this._histories = [],
      this.setDataModel(X)
  }
    ,
    y(O.HistoryManager, _, {
      ms_ac: ["dataModel", "histories", "historyIndex", "maxHistoryCount", "disabled"],
      ms_fire: 1,
      _historyIndex: -1,
      _betweenTransaction: 0,
      _maxHistoryCount: 200,
      _disabled: !1,
      ignoredPropertyMap: {
        imageLoaded: !0,
        children: !0,
        attaches: !0,
        shape: !0,
        childChange: !0,
        agentChange: !0,
        sourceAgent: !0,
        targetAgent: !0,
        edgeGroup: !0,
        "*": !0
      },
      ignoreDataModelPropertyMap: {},
      beginInteraction: function() {
        this.beginTransaction()
      },
      endInteraction: function() {
        this.endTransaction()
      },
      beginTransaction: function() {
        if (!this._disabled) {
          var u = this;
          u._betweenTransaction++,
          1 === u._betweenTransaction && (u._transactionHistories = {})
        }
      },
      endTransaction: function() {
        if (!this._disabled) {
          var C = this
            , P = C._histories;
          if (C._betweenTransaction > 0 && C._betweenTransaction--,
          0 === C._betweenTransaction) {
            if (C._transactionHistories) {
              var Q = [];
              for (var z in C._transactionHistories)
                Q.push(C._transactionHistories[z]);
              Q.length && (P = P.slice(0, C._historyIndex + 1),
                P.push(Q),
              P.length > C._maxHistoryCount && (P = P.slice(P.length - C._maxHistoryCount)),
                C.setHistories(P),
                C.setHistoryIndex(P.length - 1, !0))
            }
            delete C._transactionHistories
          }
        }
      },
      setDataModel: function($) {
        var i = this
          , j = i._dataModel;
        j !== $ && (j && (delete j._historyManager,
          j.ump(i.handleDataModelPropertyChange, i),
          j.umm(i.$5p, i),
          j.umd(i.$6p, i),
          j.removeHierarchyChangeListener(i.handleHierarchyChange, i),
          j.removeIndexChangeListener(i.handleIndexChange, i)),
          i._dataModel = $,
        $ && ($._historyManager = i,
          $.mp(i.handleDataModelPropertyChange, i),
          $.mm(i.$5p, i),
          $.md(i.$6p, i),
          $.addHierarchyChangeListener(i.handleHierarchyChange, i),
          $.addIndexChangeListener(i.handleIndexChange, i)),
          i.fp("dataModel", j, $),
          i.clear())
      },
      setHistoryIndex: function(o, O) {
        var G = this
          , F = G._historyIndex
          , e = G._histories.length;
        if (-1 > o ? o = -1 : o >= e && (o = e - 1),
        F !== o) {
          if (!O) {
            var S = o - F;
            S > 0 ? G.$2p(S) : 0 > S && G.$1p(-S)
          }
          G._historyIndex = o,
            G.fp("historyIndex", F, o),
          G.dataModel && G.dataModel.onHistoryManagerChanged()
        }
      },
      setMaxHistoryCount: function(V) {
        var u = this
          , o = u._histories
          , E = u._maxHistoryCount;
        (!V || 0 >= V) && (V = 10),
        E !== V && (u._maxHistoryCount = V,
          u.fp("maxHistoryCount", E, V),
        o.length > V && u.clear())
      },
      cloneValue: function(A) {
        return O.Default.clone(A)
      },
      isPropertyUndoable: function(w) {
        return w && !this.ignoredPropertyMap[w]
      },
      isIndexUndoable: function() {
        return !1
      },
      isDataModelPropertyUndoable: function(A) {
        return A && !this.ignoreDataModelPropertyMap[A]
      },
      $5p: function(q) {
        this.handleChange(q, q.kind)
      },
      $6p: function(w) {
        this.handleChange(w, "property")
      },
      handleHierarchyChange: function(p) {
        this.handleChange(p, "hierarchy")
      },
      handleIndexChange: function(r) {
        this.handleChange(r, "index")
      },
      handleDataModelPropertyChange: function(K) {
        this.handleChange(K, "dataModelProperty")
      },
      toChildrenInfo: function(S) {
        var U = {};
        return U.data = S,
          U.children = [],
          S.eachChild(function(h) {
            U.children.push(this.toChildrenInfo(h))
          }, this),
          U
      },
      restoreChildren: function(v) {
        var X = v.data;
        v.children.forEach(function(m) {
          var V = m.data;
          V.getParent() !== X && X.addChild(V),
          this._dataModel.contains(V) || this._dataModel.add(V),
            this.restoreChildren(m)
        }, this)
      },
      handleChange: function(l, v) {
        var $ = this;
        if (!($._disabled || $._isUndoRedoing || W.loadingRefGraph)) {
          var n, s = ($._histories,
            l.data), E = l.property;
          if (!s || !(s._refGraph || s instanceof O.RefGraph)) {
            if ("property" === v)
              $.isPropertyUndoable(E, s) && (n = {
                kind: v,
                data: s,
                property: E,
                oldValue: $.cloneValue(l.oldValue, s, E),
                newValue: $.cloneValue(l.newValue, s, E),
                event: l
              });
            else if ("hierarchy" === v || "index" === v && $.isIndexUndoable(l))
              n = {
                kind: v,
                data: s,
                oldIndex: l.oldIndex,
                newIndex: l.newIndex,
                event: l
              };
            else if ("clear" === v)
              n = {
                kind: v,
                json: l.json,
                event: l
              };
            else if ("add" === v) {
              if (n = {
                kind: v,
                data: s,
                event: l,
                childrenInfo: this.toChildrenInfo(s),
                parent: s.getParent()
              },
                n.parent) {
                var i = $._dataModel.getSiblings(s);
                n.siblingsIndex = i.indexOf(s)
              }
              s instanceof O.Node && (n.host = s.getHost(),
                n.attaches = s.getAttaches() ? s.getAttaches().toArray() : Z),
              s instanceof O.Edge && (n.source = s.getSource(),
                n.target = s.getTarget())
            } else
              "remove" === v ? n = {
                kind: v,
                data: s,
                event: l
              } : "dataModelProperty" === v && $.isDataModelPropertyUndoable(E, s) && (n = {
                kind: v,
                property: E,
                oldValue: $.cloneValue(l.oldValue, s, E),
                newValue: $.cloneValue(l.newValue, s, E),
                event: l
              });
            $.addHistory(n)
          }
        }
      },
      addHistory: function(G) {
        var e = this;
        if (G)
          if (e._betweenTransaction) {
            var D = (G.data ? G.data._id : 0) + "_" + G.kind + "_" + G.property;
            if ("property" === G.kind || "dataModelProperty" === G.kind) {
              var s = e._transactionHistories[D];
              s && (G.oldValue = s.oldValue)
            }
            e._transactionHistories[D] = G
          } else {
            var v = e._histories;
            v = v.slice(0, e._historyIndex + 1),
              v.push([G]),
            v.length > e._maxHistoryCount && (v = v.slice(v.length - e._maxHistoryCount)),
              e.setHistories(v),
              e.setHistoryIndex(v.length - 1, !0)
          }
      },
      canUndo: function() {
        return !this._disabled && this._historyIndex >= 0 && this._historyIndex < this._histories.length
      },
      canRedo: function() {
        return !this._disabled && this._historyIndex >= -1 && this._historyIndex < this._histories.length - 1
      },
      undo: function(r) {
        (!r || 0 >= r) && (r = 1),
          this.setHistoryIndex(this._historyIndex - r)
      },
      $1p: function(p) {
        if (this.canUndo()) {
          var l, J = this, k = J._dataModel, $ = J._histories, P = J._historyIndex, R = 0;
          for (J._isUndoRedoing = !0,
                 W.setIsolating(!0); p > 0; ) {
            if (P >= 0 && P < $.length) {
              R++,
                l = $[P],
                P--;
              for (var I = l.length - 1; I >= 0; I--) {
                var y = l[I]
                  , U = y.kind
                  , Y = y.data
                  , i = y.property
                  , c = y.event
                  , O = this.cloneValue(y.oldValue, Y, i);
                if (y.undo)
                  y.undo();
                else if ("add" === U)
                  k.remove(Y, {
                    keepChildren: !0
                  });
                else if ("remove" === U)
                  k.contains(Y) || k.add(Y, c.rootsIndex, c.datasIndex);
                else if ("clear" === U)
                  k.deserialize(W.clone(y.json));
                else if ("property" === U)
                  if ("parent" === i)
                    O ? O.addChild(Y, c.oldIndex) : (Y.setParent(O),
                    c.oldIndex >= 0 && k.moveTo(Y, c.oldIndex));
                  else {
                    var u = null;
                    0 === i.indexOf("a:") ? (u = "attr",
                      i = i.replace("a:", "")) : 0 === i.indexOf("s:") ? (u = "style",
                      i = i.replace("s:", "")) : 0 === i.indexOf("f:") && (u = "field",
                      i = i.replace("f:", "")),
                      d.setPropertyValue(Y, u, i, O)
                  }
                else if ("dataModelProperty" === U) {
                  var u = null;
                  0 === i.indexOf("a:") ? (u = "attr",
                    i = i.replace("a:", "")) : 0 === i.indexOf("s:") ? (u = "style",
                    i = i.replace("s:", "")) : 0 === i.indexOf("f:") && (u = "field",
                    i = i.replace("f:", "")),
                    d.setPropertyValue(k, u, i, O)
                } else
                  "hierarchy" === U ? k.moveTo(Y, y.oldIndex) : "index" === U && k.moveToIndex(Y, y.oldIndex)
              }
            }
            p--
          }
          W.setIsolating(!1),
            delete J._isUndoRedoing,
            J.afterUndo(R)
        }
      },
      afterUndo: function() {},
      redo: function(C) {
        (!C || 0 >= C) && (C = 1),
          this.setHistoryIndex(this._historyIndex + C)
      },
      $2p: function(p) {
        if (this.canRedo()) {
          var c, j = this, F = j._dataModel, $ = j._histories, i = j._historyIndex, y = 0;
          for (j._isUndoRedoing = !0,
                 W.setIsolating(!0); p > 0; ) {
            if (i >= -1 && i < $.length - 1) {
              y++,
                i++,
                c = $[i];
              for (var z = 0; z < c.length; z++) {
                var l = c[z]
                  , _ = l.kind
                  , r = l.data
                  , D = l.property
                  , M = l.event
                  , A = this.cloneValue(l.newValue, r, D);
                if (l.redo)
                  l.redo();
                else if ("add" === _)
                  l.parent && !r.getParent() && l.parent.addChild(r, l.siblingsIndex),
                  F.contains(r) || F.add(r, M.rootsIndex, M.datasIndex),
                    this.restoreChildren(l.childrenInfo),
                  r instanceof O.Node && (r.setHost(l.host),
                  l.attaches && l.attaches.forEach(function(u) {
                    u.setHost(r)
                  })),
                  r instanceof O.Edge && (r.setSource(l.source),
                    r.setTarget(l.target));
                else if ("remove" === _)
                  F.remove(r);
                else if ("clear" === _)
                  F.clear();
                else if ("property" === _)
                  if ("parent" === D)
                    A ? A.addChild(r, M.newIndex) : (r.setParent(A),
                    M.newIndex >= 0 && F.moveTo(r, M.newIndex));
                  else {
                    var t = null;
                    0 === D.indexOf("a:") ? (t = "attr",
                      D = D.replace("a:", "")) : 0 === D.indexOf("s:") ? (t = "style",
                      D = D.replace("s:", "")) : 0 === D.indexOf("f:") && (t = "field",
                      D = D.replace("f:", "")),
                      d.setPropertyValue(r, t, D, A)
                  }
                else if ("dataModelProperty" === _) {
                  var t = null;
                  0 === D.indexOf("a:") ? (t = "attr",
                    D = D.replace("a:", "")) : 0 === D.indexOf("s:") ? (t = "style",
                    D = D.replace("s:", "")) : 0 === D.indexOf("f:") && (t = "field",
                    D = D.replace("f:", "")),
                    d.setPropertyValue(F, t, D, A)
                } else
                  "hierarchy" === _ ? F.moveTo(r, l.newIndex) : "index" === _ && F.moveToIndex(r, l.newIndex)
              }
            }
            p--
          }
          W.setIsolating(!1),
            delete j._isUndoRedoing,
            this.afterRedo(y)
        }
      },
      afterRedo: function() {},
      clear: function() {
        this.setHistories([]),
          this.setHistoryIndex(-1, !0),
          this._betweenTransaction = 0,
          delete this._transactionHistories
      }
    })
}("undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : (0,
  eval)("this"), Object);
