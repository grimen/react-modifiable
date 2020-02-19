import React, { useRef, useState, useEffect, useCallback } from 'react';
import debug from 'debug';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/* =========================================
      IMPORTS
-------------------------------------- */

/* =========================================
      CONSTANTS
-------------------------------------- */
var X = 0;
var Y = 0;
/* =========================================
      FUNCTIONS
-------------------------------------- */

function getBoolean(value) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (typeof value !== 'boolean') {
    value = fallback;
  }

  return value;
}
function getObject(value) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (_typeof(value) !== 'object') {
    value = fallback;
  }

  return value;
}
function getFunction(value) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (typeof value !== 'function') {
    value = fallback;
  }

  return value;
}
function isCoordinate(value) {
  return typeof value === 'number' && !isNaN(value);
}
function isCoordinates() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return Boolean(values.filter(isCoordinate).length === values.length);
}
function isPointerEventButton(event) {
  return Boolean(event && (event.button || event.buttons || event.which || event.detail || event.force || (event.touches || []).length));
}
function getElement(element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element) {
    return null;
  }

  if (element instanceof Element) {
    return element;
  }

  element = element.current || null; // ~ $ref

  return element;
}
function getElementRect(element) {
  element = getElement(element);
  return element && element.getBoundingClientRect() || {};
}
function isElement(element) {
  element = getElement(element);
  return element instanceof Element;
} // NOTE:
function getParentElements(element) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeSelf: false,
    rootElement: null
  };
  element = getElement(element);

  if (!isElement(element)) {
    return [];
  }

  var elements = [];
  var isMatchingElement;

  if (options.includeSelf) {
    isMatchingElement = selector ? element.matches(selector) : true;

    if (isMatchingElement) {
      elements = [element];
    }
  }

  if (options.rootElement) {
    if (element === options.rootElement) {
      return elements;
    }
  }

  while (element.parentElement) {
    isMatchingElement = selector ? element.parentElement.matches(selector) : true;

    if (isMatchingElement) {
      elements = [].concat(_toConsumableArray(elements), [element.parentElement]);
    }

    element = element.parentElement;

    if (options.rootElement) {
      if (element === options.rootElement) {
        break;
      }
    }
  }

  return elements;
}
function getParentElement(element) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    includeSelf: false,
    rootElement: null
  };
  return getParentElements(element, selector, options)[0] || null;
}
function getPointerEvent(event) {
  if (event) {
    event = (event.touches || [])[0] || event;
  }

  return event;
} // OPTIMIZATION: memoize?

function getPointerEventElements(event) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (!event) {
    return [];
  }

  event = getPointerEvent(event);
  var _ref = [event.pageX - window.scrollX || event.x || event[X], event.pageY - window.scrollY || event.y || event[Y]],
      x = _ref[0],
      y = _ref[1];

  if (!isCoordinates(x, y)) {
    return [];
  }

  var elements;
  elements = document.elementsFromPoint(x, y) || [];

  if (selector) {
    elements = elements.filter(function (element) {
      return element.matches(selector);
    });
  }

  return elements;
}
function getPointerEventElement(event) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return getPointerEventElements(event, selector)[0] || null;
}
function getPointerEventPointCoords(event) {
  var _ref2 = (event.touches || [])[0] || event,
      pageX = _ref2.pageX,
      pageY = _ref2.pageY;

  var _window = window,
      scrollX = _window.scrollX,
      scrollY = _window.scrollY;
  var eventX = pageX - scrollX;
  var eventY = pageY - scrollY;
  var x = eventX;
  var y = eventY;
  return {
    x: x,
    y: y,
    eventX: eventX,
    eventY: eventY,
    pageX: pageX,
    pageY: pageY,
    scrollX: scrollX,
    scrollY: scrollY
  };
} // OPTIMIZATION: memoize?
function getPointerEventsPointDetails(event, element) {
  var containerElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  event = getPointerEvent(event);

  var _getPointerEventPoint = getPointerEventPointCoords(event),
      eventX = _getPointerEventPoint.eventX,
      eventY = _getPointerEventPoint.eventY,
      pageX = _getPointerEventPoint.pageX,
      pageY = _getPointerEventPoint.pageY,
      scrollX = _getPointerEventPoint.scrollX,
      scrollY = _getPointerEventPoint.scrollY;

  var containerRect = containerElement.getBoundingClientRect();
  var elementRect = element.getBoundingClientRect();
  var containerX = containerRect.x;
  var containerY = containerRect.y;
  var elementX = elementRect.x;
  var elementY = elementRect.y;
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var elementWidth = elementRect.width;
  var elementHeight = elementRect.height;
  return {
    eventX: eventX,
    eventY: eventY,
    scrollX: scrollX,
    scrollY: scrollY,
    pageX: pageX,
    pageY: pageY,
    containerRect: containerRect,
    containerX: containerX,
    containerY: containerY,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    elementRect: elementRect,
    elementX: elementX,
    elementY: elementY,
    elementWidth: elementWidth,
    elementHeight: elementHeight
  };
}
function getValidPosition(position) {
  position = _objectSpread2({}, position);

  if (!isCoordinate(position.x)) {
    position.x = 0;
  }

  if (!isCoordinate(position.y)) {
    position.y = 0;
  }

  return position;
}
function getValidSize(size) {
  size = _objectSpread2({}, size);

  if (!isCoordinate(size.width)) {
    size.width = 0;
  }

  if (!isCoordinate(size.height)) {
    size.height = 0;
  }

  return size;
}
function getConstrainedPosition(position, size, container) {
  position = getValidPosition(position);
  size = getValidSize(size);

  if (!container) {
    var containerElement = getElement(container) || document.body;
    container = getElementRect(containerElement);
  }

  if (container.width) {
    var isOverflowingX = Boolean(position.x + size.width > container.width);

    if (isOverflowingX) {
      var adjustedPositionX = container.width - size.width;
      position.x = adjustedPositionX;
    }
  }

  if (container.height) {
    var isOverflowingY = Boolean(position.y + size.height > container.height);

    if (isOverflowingY) {
      var adjustedPositionY = container.height - size.height;
      position.y = adjustedPositionY;
    }
  }

  if (position.x < 0) {
    position.x = 0;
  }

  if (position.y < 0) {
    position.y = 0;
  }

  return position;
}
function getConstrainedPositionAndSize(position, size) {
  var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  position = getValidPosition(position);
  size = getValidSize(size);

  if (!container) {
    var containerElement = getElement(container) || document.body;
    container = getElementRect(containerElement);
  }

  position = getConstrainedPosition(position, size, container);

  if (container.width) {
    var isOverflowingW = Boolean(position.x + size.width > container.width);

    if (isOverflowingW) {
      var adjustedSizeW = container.width;
      size.width = adjustedSizeW;
    }
  }

  if (container.height) {
    var isOverflowingH = Boolean(position.y + size.height > container.height);

    if (isOverflowingH) {
      var adjustedSizeH = container.height;
      size.height = adjustedSizeH;
    }
  }

  return [position, size];
}
function withRAF(fn, raf) {
  return function () {
    cancelAnimationFrame(raf);
    return requestAnimationFrame(fn);
  };
}
function callback(fn) {
  return function () {
    if (typeof fn === 'function') {
      return fn.apply(void 0, arguments);
    }
  };
}

/* =========================================
      LOGGER
-------------------------------------- */

var _log = debug('react-interactable:hooks:useInteractable');
/* =========================================
      HOOKS
-------------------------------------- */


var useInteractable = function useInteractable($node) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var log = props.log,
      id = props.id,
      container = props.container,
      attributePrefix = props.attributePrefix,
      draggable = props.draggable,
      resizable = props.resizable,
      droppable = props.droppable,
      position = props.position,
      size = props.size,
      data = props.data,
      onDragStart = props.onDragStart,
      onDrag = props.onDrag,
      onDragStop = props.onDragStop,
      onResizeStart = props.onResizeStart,
      onResize = props.onResize,
      onResizeStop = props.onResizeStop,
      onDropStart = props.onDropStart,
      onDrop = props.onDrop,
      onDropStop = props.onDropStop;
  var interactableAttributePrefix = attributePrefix || 'data-interactable';
  var interactableData = data;
  var interactableIDGenerator = getFunction(id, function (node) {
    useInteractable.instanceID = useInteractable.instanceID || 1;
    return id || node && node.getAttribute("".concat(interactableAttributePrefix, "-id")) || useInteractable.instanceID++;
  });
  var interactableDroppableAccept = getFunction(droppable,
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref2) {
      var source, target, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              source = _ref2.source, target = _ref2.target;
              data = source && (source.$interactableData || source.$data || _objectSpread2({}, source.dataset)) || null;
              return _context.abrupt("return", data);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  var node = $node.current;
  var interactableID = interactableIDGenerator(node, props);

  if (log === undefined) {
    log = function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _log.apply(void 0, ["".concat(interactableID)].concat(args));
    };
  }

  var interactableRAF = useRef(null);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      globalPointerDown = _useState2[0],
      setGlobalPointerDown = _useState2[1];

  var _useState3 = useState({
    x: undefined,
    y: undefined
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      pointStart = _useState4[0],
      setPointStart = _useState4[1];

  var _useState5 = useState({
    x: undefined,
    y: undefined
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      point = _useState6[0],
      setPoint = _useState6[1];

  var _useState7 = useState({
    x: undefined,
    y: undefined
  }),
      _useState8 = _slicedToArray(_useState7, 2),
      pointEnd = _useState8[0],
      setPointEnd = _useState8[1];

  var _useState9 = useState(null),
      _useState10 = _slicedToArray(_useState9, 2),
      interactableType = _useState10[0],
      setInteractableType = _useState10[1];

  var _useState11 = useState(null),
      _useState12 = _slicedToArray(_useState11, 2),
      interactableElement = _useState12[0],
      setInteractableElement = _useState12[1];

  var _useState13 = useState(null),
      _useState14 = _slicedToArray(_useState13, 2),
      interactableHandleElement = _useState14[0],
      setInteractableHandleElement = _useState14[1];

  var _useState15 = useState({}),
      _useState16 = _slicedToArray(_useState15, 2),
      interactableHandleData = _useState16[0],
      setInteractableHandleData = _useState16[1];

  var _useState17 = useState({}),
      _useState18 = _slicedToArray(_useState17, 2),
      interactablePosition = _useState18[0],
      setInteractablePosition = _useState18[1];

  var _useState19 = useState({}),
      _useState20 = _slicedToArray(_useState19, 2),
      interactableSize = _useState20[0],
      setInteractableSize = _useState20[1];

  var dragging = Boolean(interactableType === 'drag');
  var dropping = Boolean(interactableType === 'drop');
  var resizing = Boolean(interactableType === 'resize'); // NOTE: not reliable for drag positions

  var _native = false;
  useEffect(function () {
    var node = $node.current;

    if (!node) {
      return;
    }

    node.setAttribute("".concat(interactableAttributePrefix, "-id"), interactableID);

    if (draggable) {
      node.setAttribute("".concat(interactableAttributePrefix, "-draggable"), '');
    }

    if (droppable) {
      node.setAttribute("".concat(interactableAttributePrefix, "-droppable"), '');
    }

    if (resizable) {
      node.setAttribute("".concat(interactableAttributePrefix, "-resizable"), '');
    }

    var _onMouseDown =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(event) {
        var originalEvent, _event, target, actionElement, element, containerElement, isCurrentElement, currentPointStart, isResizeAction, isDragAction, resizableElement, resizableHandleElement, resizableHandleData, draggableElement, draggableHandleElement, draggableHandleData;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                originalEvent = event;
                event = getPointerEvent(event); // log('interactable:mousedown', event)

                setGlobalPointerDown(true);
                _event = event, target = _event.target;

                if (!target.matches("[".concat(interactableAttributePrefix, "-ignore], [").concat(interactableAttributePrefix, "-ignore] *"))) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return");

              case 6:
                actionElement = getParentElement(target, ["[".concat(interactableAttributePrefix, "-draggable-handle]"), "[".concat(interactableAttributePrefix, "-resizable-handle]")], {
                  includeSelf: true
                }) || getParentElement(target, ["[".concat(interactableAttributePrefix, "-draggable]"), "[".concat(interactableAttributePrefix, "-resizable]")], {
                  includeSelf: true
                });
                element = getParentElement(actionElement, ["[".concat(interactableAttributePrefix, "-draggable]"), "[".concat(interactableAttributePrefix, "-resizable]")], {
                  includeSelf: true
                }) || getPointerEventElement(target, ["[".concat(interactableAttributePrefix, "-draggable]"), "[".concat(interactableAttributePrefix, "-resizable]")]);
                containerElement = getElement(container) || getParentElement(element, ["[".concat(interactableAttributePrefix, "-container]")]) || getParentElement(element); // log('interactable:mousedown:element', element, actionElement)

                if (element) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return");

              case 11:
                isCurrentElement = Boolean(actionElement && actionElement.matches(["[".concat(interactableAttributePrefix, "-id=\"").concat(interactableID, "\"]"), "[".concat(interactableAttributePrefix, "-id=\"").concat(interactableID, "\"] *")].join(', ')));

                if (isCurrentElement) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return");

              case 14:
                originalEvent.preventDefault();
                currentPointStart = getPointerEventsPointDetails(event, element, containerElement);
                setPointStart(currentPointStart);
                isResizeAction = false;
                isDragAction = false;

                if (resizable) {
                  resizableElement = getParentElement(target, "[".concat(interactableAttributePrefix, "-resizable]"), {
                    includeSelf: true
                  });
                  resizableHandleElement = getParentElement(target, "[".concat(interactableAttributePrefix, "-resizable-handle]"), {
                    includeSelf: true
                  });
                  resizableHandleData = resizableHandleElement && resizableHandleElement.dataset && {
                    type: resizableHandleElement.dataset.interactableResizableHandleType,
                    direction: resizableHandleElement.dataset.interactableResizableHandleDirection
                  };
                  isResizeAction = Boolean(resizableElement && resizableHandleElement);

                  if (isResizeAction) {
                    log('interactable:resizable:start', interactableID);
                    document.body.setAttribute("".concat(interactableAttributePrefix, "-resizing"), interactableID);
                    resizableElement.setAttribute("".concat(interactableAttributePrefix, "-resizing"), '');
                    setInteractableType('resize');
                    setInteractableElement(resizableElement);
                    setInteractableHandleElement(resizableHandleElement);
                    setInteractableHandleData(resizableHandleData);
                    onResizeStart({
                      position: position,
                      size: size,
                      pointStart: currentPointStart
                    });
                  }
                }

                if (draggable && !isResizeAction) {
                  draggableElement = getParentElement(target, "[".concat(interactableAttributePrefix, "-draggable]"), {
                    includeSelf: true
                  });
                  draggableHandleElement = getParentElement(target, "[".concat(interactableAttributePrefix, "-draggable-handle]"), {
                    includeSelf: true
                  }) || getParentElement(target, "[".concat(interactableAttributePrefix, "-resizable]"), {
                    includeSelf: true
                  }) || draggableElement;
                  draggableHandleData = draggableHandleElement && draggableHandleElement.dataset && {};
                  isDragAction = Boolean(draggableElement && draggableHandleElement);

                  if (isDragAction) {
                    log('interactable:draggable:start', interactableID);
                    document.body.setAttribute("".concat(interactableAttributePrefix, "-dragging"), interactableID);
                    draggableElement.setAttribute("".concat(interactableAttributePrefix, "-dragging"), '');
                    draggableElement.$interactableData = interactableData;
                    setInteractableType('drag');
                    setInteractableElement(draggableElement);
                    setInteractableHandleElement(draggableHandleElement);
                    setInteractableHandleData(draggableHandleData);
                    onDragStart({
                      position: position,
                      size: size,
                      pointStart: pointStart
                    });
                  }
                }

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function _onMouseDown(_x2) {
        return _ref3.apply(this, arguments);
      };
    }();

    var _onMouseMove =
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(event) {
        var originalEvent, _event2, target, isPointerStillDown, isResizing, isDragging, isDropping, dragElementID, dropElementID, dragElement, dragContainerElement, droppableElements, dropElement, _i, _arr, _droppableElement, _source, _target2, _result, _accept, _droppableElements, _i2, _arr2, droppableElement, source, _target, result, accept, _data, element, containerElement, currentPoint, x, y, dx, dy, _position, _size, direction, isModifierPositionX, isModifierPositionY, isModifierSizeX, isModifierSizeY, w, h, dw, dh, _container, _getConstrainedPositi, _getConstrainedPositi2, constraintedPosition, constrainedSize, resized, _position2, _size2, _container2, _getConstrainedPositi3, _getConstrainedPositi4, _constraintedPosition, _constrainedSize, dragged;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                originalEvent = event;
                event = getPointerEvent(event);
                _event2 = event, target = _event2.target;

                if (!target.matches("[".concat(interactableAttributePrefix, "-ignore], [").concat(interactableAttributePrefix, "-ignore] *"))) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return");

              case 5:
                if (globalPointerDown) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return");

              case 7:
                isPointerStillDown = isPointerEventButton(event); // NOTE: sometimes `mouseup` event is not triggered

                if (isPointerStillDown) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", _onMouseUp(event));

              case 10:
                isResizing = false;
                isDragging = false;
                isDropping = false;

                if (!droppable) {
                  _context3.next = 66;
                  break;
                }

                dragElementID = document.body.getAttribute("".concat(interactableAttributePrefix, "-dragging"));
                dropElementID = interactableID;
                dragElement = dragElementID && document.querySelector("[".concat(interactableAttributePrefix, "-id=\"").concat(dragElementID, "\"]")) || null;
                dragContainerElement = dragElement && (getParentElement(dragElement, ["".concat(interactableAttributePrefix, "-container")]) || getParentElement(dragElement)) || null;
                droppableElements = dragContainerElement && dragContainerElement.querySelectorAll("[".concat(interactableAttributePrefix, "-droppable]:not([").concat(interactableAttributePrefix, "-id=\"").concat(dragElementID, "\"])")) || [];
                dropElement = getPointerEventElement(event, "[".concat(interactableAttributePrefix, "-id=\"").concat(dropElementID, "\"]"));
                isDropping = Boolean(dragElement && dropElement);
                log('interactable:droppable:drop?', isDropping, dragElementID, '=>', dropElementID);
                _i = 0, _arr = _toConsumableArray(droppableElements);

              case 23:
                if (!(_i < _arr.length)) {
                  _context3.next = 42;
                  break;
                }

                _droppableElement = _arr[_i];
                _source = dragElement;
                _target2 = _droppableElement;
                _result = void 0; // NOTE: `result` can be `<Object>` (success) or `<Error>` (failed accepting - with details)

                _context3.prev = 28;
                _context3.next = 31;
                return interactableDroppableAccept({
                  source: _source,
                  target: _target2
                });

              case 31:
                _result = _context3.sent;
                _context3.next = 37;
                break;

              case 34:
                _context3.prev = 34;
                _context3.t0 = _context3["catch"](28);
                _result = _context3.t0;

              case 37:
                _accept = !!_result && !(_result instanceof Error);

                _droppableElement.setAttribute("".concat(interactableAttributePrefix, "-droppable-accept"), _accept);

              case 39:
                _i++;
                _context3.next = 23;
                break;

              case 42:
                _droppableElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-droppable-accept], [").concat(interactableAttributePrefix, "-dropping-accept]"));

                if (_droppableElements) {
                  for (_i2 = 0, _arr2 = _toConsumableArray(_droppableElements); _i2 < _arr2.length; _i2++) {
                    droppableElement = _arr2[_i2];
                    droppableElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping"));
                    droppableElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping-accept"));
                  }
                }

                if (!isDropping) {
                  _context3.next = 66;
                  break;
                }

                source = dragElement;
                _target = dropElement;
                _context3.prev = 47;
                _context3.next = 50;
                return interactableDroppableAccept({
                  source: source,
                  target: _target
                });

              case 50:
                result = _context3.sent;
                _context3.next = 56;
                break;

              case 53:
                _context3.prev = 53;
                _context3.t1 = _context3["catch"](47);
                result = _context3.t1;

              case 56:
                accept = !!result && !(result instanceof Error);
                _data = getObject(result, {});
                document.body.setAttribute("".concat(interactableAttributePrefix, "-dropping"), dropElementID);
                document.body.setAttribute("".concat(interactableAttributePrefix, "-dropping-accept"), accept);
                dragContainerElement.setAttribute("".concat(interactableAttributePrefix, "-dropping"), dropElementID);
                dragContainerElement.setAttribute("".concat(interactableAttributePrefix, "-dropping-accept"), accept);
                dropElement.setAttribute("".concat(interactableAttributePrefix, "-dropping"), '');
                dropElement.setAttribute("".concat(interactableAttributePrefix, "-dropping-accept"), accept);
                log('interactable:droppable:drop:start', accept, _data);
                callback(onDropStart)({
                  source: source,
                  target: _target,
                  accept: accept,
                  data: _data
                });

              case 66:
                element = interactableElement;
                containerElement = getElement(container) || getParentElement(element, ["[".concat(interactableAttributePrefix, "-container]")]) || getParentElement(element); // log('interactable:mousemove:element', element)

                if (element) {
                  _context3.next = 70;
                  break;
                }

                return _context3.abrupt("return");

              case 70:
                if (containerElement) {
                  _context3.next = 72;
                  break;
                }

                return _context3.abrupt("return");

              case 72:
                originalEvent.preventDefault();
                currentPoint = getPointerEventsPointDetails(event, element, containerElement);
                setPoint(currentPoint);
                x = pointStart.elementX - pointStart.containerX + (currentPoint.eventX - currentPoint.containerX - (pointStart.eventX - pointStart.containerX));
                y = pointStart.elementY - pointStart.containerY + (currentPoint.eventY - currentPoint.containerY - (pointStart.eventY - pointStart.containerY));
                dx = x - position.x;
                dy = y - position.y;

                if (resizable) {
                  isResizing = Boolean(interactableType === 'resize');

                  if (isResizing) {
                    log('interactable:resizable:drag', x, y);
                    _position = getValidPosition(position);
                    _size = getValidSize(size);
                    direction = "".concat(interactableHandleData.direction || '');
                    isModifierPositionX = direction.includes('w');
                    isModifierPositionY = direction.includes('n');
                    isModifierSizeX = direction.includes('e');
                    isModifierSizeY = direction.includes('s');
                    log('interactable:direction', interactableHandleData);
                    w = pointStart.elementWidth + dx;
                    h = pointStart.elementHeight + dy;
                    dw = w - size.width;
                    dh = h - size.height;

                    if (isModifierPositionX) {
                      _position.x += dx;
                      _size.width += -dx;
                    }

                    if (isModifierPositionY) {
                      _position.y += dy;
                      _size.height += -dy;
                    }

                    if (isModifierSizeX) {
                      _size.width += dw;
                    }

                    if (isModifierSizeY) {
                      _size.height += dh;
                    }

                    _container = {
                      width: currentPoint.containerWidth,
                      height: currentPoint.containerHeight
                    };
                    _getConstrainedPositi = getConstrainedPositionAndSize(_position, _size, _container), _getConstrainedPositi2 = _slicedToArray(_getConstrainedPositi, 2), constraintedPosition = _getConstrainedPositi2[0], constrainedSize = _getConstrainedPositi2[1];
                    resized = !!(dx + dy + dw + dh);
                    interactableRAF.current = withRAF(function () {
                      callback(onResize)({
                        position: constraintedPosition,
                        size: constrainedSize,
                        resized: resized,
                        point: currentPoint
                      });
                    }, interactableRAF.current)();
                  }
                }

                if (draggable) {
                  isDragging = Boolean(interactableType === 'drag');

                  if (isDragging && !isResizing) {
                    log('interactable:draggable:drag', x, y);
                    _position2 = getValidPosition(position);
                    _size2 = getValidSize(size);
                    _position2.x += dx;
                    _position2.y += dy;
                    _container2 = {
                      width: currentPoint.containerWidth,
                      height: currentPoint.containerHeight
                    };
                    _getConstrainedPositi3 = getConstrainedPositionAndSize(_position2, _size2, _container2), _getConstrainedPositi4 = _slicedToArray(_getConstrainedPositi3, 2), _constraintedPosition = _getConstrainedPositi4[0], _constrainedSize = _getConstrainedPositi4[1];
                    dragged = !!(dx + dy);
                    interactableRAF.current = withRAF(function () {
                      onDrag({
                        position: _constraintedPosition,
                        size: _constrainedSize,
                        dragged: dragged,
                        point: currentPoint
                      });
                    }, interactableRAF.current)();
                  }
                }

              case 81:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[28, 34], [47, 53]]);
      }));

      return function _onMouseMove(_x3) {
        return _ref4.apply(this, arguments);
      };
    }();

    var _onMouseUp =
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(event) {
        var originalEvent, _event3, target, isDropping, dragElementID, dropElementID, dragElement, dropElement, droppedElements, _i3, _arr3, droppedElement, isCurrentDroppable, accept, _data2, source, _target3, result, droppableElements, _i4, _arr4, droppableElement, resizableElements, _i5, _arr5, resizableElement, draggableElements, _i6, _arr6, draggableElement, element, containerElement, currentPointEnd, isResizing, _resizableElements, _i7, _arr7, _resizableElement, isDragging, _draggableElements, _i8, _arr8, _draggableElement;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                originalEvent = event;
                event = getPointerEvent(event); // log('interactable:mouseup')

                setGlobalPointerDown(false);
                _event3 = event, target = _event3.target;

                if (!target.matches("[".concat(interactableAttributePrefix, "-ignore], [").concat(interactableAttributePrefix, "-ignore] *"))) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return");

              case 6:
                isDropping = false;

                if (!droppable) {
                  _context4.next = 39;
                  break;
                }

                dragElementID = document.body.getAttribute("".concat(interactableAttributePrefix, "-dragging"));
                dropElementID = document.body.getAttribute("".concat(interactableAttributePrefix, "-dropping"));
                dragElement = dragElementID && document.querySelector("[".concat(interactableAttributePrefix, "-id=\"").concat(dragElementID, "\"]"));
                dropElement = dropElementID && document.querySelector("[".concat(interactableAttributePrefix, "-id=\"").concat(dropElementID, "\"]"));
                droppedElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-dropping-accept]"));

                if (droppedElements) {
                  for (_i3 = 0, _arr3 = _toConsumableArray(droppedElements); _i3 < _arr3.length; _i3++) {
                    droppedElement = _arr3[_i3];
                    droppedElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping-accept"));
                  }
                }

                isCurrentDroppable = Boolean(interactableID === dropElementID);
                isDropping = Boolean(dragElement && dropElement && isCurrentDroppable);
                log('interactable:droppable?', isDropping, dragElementID, '=>', dropElementID);
                accept = false;
                _data2 = null;
                source = dragElement;
                _target3 = dropElement;

                if (!isDropping) {
                  _context4.next = 35;
                  break;
                }

                _context4.prev = 22;
                _context4.next = 25;
                return interactableDroppableAccept({
                  source: source,
                  target: _target3
                });

              case 25:
                result = _context4.sent;
                _context4.next = 31;
                break;

              case 28:
                _context4.prev = 28;
                _context4.t0 = _context4["catch"](22);
                result = _context4.t0;

              case 31:
                accept = !!result && !(result instanceof Error);
                _data2 = getObject(result, {});
                log('interactable:droppable:drop:accept?', accept, _data2, dragElementID, '=>', dropElementID);

                if (accept) {
                  log('interactable:droppable:drop', accept, _data2);
                  callback(onDrop)({
                    source: source,
                    target: _target3,
                    accept: accept,
                    data: _data2
                  });
                }

              case 35:
                log('interactable:droppable:drop:stop', accept, _data2);
                callback(onDropStop)({
                  source: source,
                  target: _target3,
                  accept: accept,
                  data: _data2
                });
                droppableElements = document.querySelectorAll(["[".concat(interactableAttributePrefix, "-droppable-accept]"), "[".concat(interactableAttributePrefix, "-dropping-accept]")].join(', '));

                if (droppableElements) {
                  for (_i4 = 0, _arr4 = _toConsumableArray(droppableElements); _i4 < _arr4.length; _i4++) {
                    droppableElement = _arr4[_i4];
                    droppableElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping"));
                    droppableElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping-accept"));
                    droppableElement.removeAttribute("".concat(interactableAttributePrefix, "-droppable-accept"));
                  }
                }

              case 39:
                if (resizable) {
                  resizableElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-resizable]"));

                  if (resizableElements) {
                    for (_i5 = 0, _arr5 = _toConsumableArray(resizableElements); _i5 < _arr5.length; _i5++) {
                      resizableElement = _arr5[_i5];
                      resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizing"));
                      resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizing-accept"));
                      resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizable-accept"));
                    }
                  }
                }

                if (draggable) {
                  draggableElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-draggable]"));

                  if (draggableElements) {
                    for (_i6 = 0, _arr6 = _toConsumableArray(draggableElements); _i6 < _arr6.length; _i6++) {
                      draggableElement = _arr6[_i6];
                      draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-dragging"));
                      draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-dragging-accept"));
                      draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-draggable-accept"));
                    }
                  }
                }

                element = interactableElement;
                containerElement = getElement(container) || getParentElement(element, ["[".concat(interactableAttributePrefix, "-container]")]) || getParentElement(element); // log('interactable:mouseup:element', element)

                setInteractableType(null);
                setInteractableElement(null);
                setInteractableHandleElement(null);
                setInteractableHandleData(null); // NOTE: ensure executed in next event loop, to avoid race condition between interactable element event handlers

                setTimeout(function () {
                  document.body.removeAttribute("".concat(interactableAttributePrefix, "-dragging"));
                  document.body.removeAttribute("".concat(interactableAttributePrefix, "-dropping"));
                  document.body.removeAttribute("".concat(interactableAttributePrefix, "-resizing"));

                  if (interactableElement) {
                    interactableElement.removeAttribute("".concat(interactableAttributePrefix, "-dragging"));
                    interactableElement.removeAttribute("".concat(interactableAttributePrefix, "-dropping"));
                    interactableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizing"));
                    interactableElement.removeAttribute("".concat(interactableAttributePrefix, "-droppable-accept"));
                  }
                }, 0);

                if (element) {
                  _context4.next = 50;
                  break;
                }

                return _context4.abrupt("return");

              case 50:
                if (!(element !== node)) {
                  _context4.next = 52;
                  break;
                }

                return _context4.abrupt("return");

              case 52:
                originalEvent.preventDefault();
                currentPointEnd = getPointerEventsPointDetails(event, element, containerElement);
                setPointEnd(currentPointEnd);

                if (resizable) {
                  isResizing = Boolean(interactableType === 'resize');

                  if (isResizing) {
                    log('interactable:resizable:end');
                    onResizeStop({
                      position: position,
                      size: size,
                      pointEnd: currentPointEnd
                    });
                  }

                  _resizableElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-resizable]"));

                  if (_resizableElements) {
                    for (_i7 = 0, _arr7 = _toConsumableArray(_resizableElements); _i7 < _arr7.length; _i7++) {
                      _resizableElement = _arr7[_i7];

                      _resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizable-accept"));

                      _resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizing"));

                      _resizableElement.removeAttribute("".concat(interactableAttributePrefix, "-resizing-accept"));
                    }
                  }
                }

                if (draggable) {
                  isDragging = Boolean(interactableType === 'drag');

                  if (isDragging) {
                    log('interactable:draggable:end');
                    onDragStop({
                      position: position,
                      size: size,
                      pointEnd: currentPointEnd
                    });
                  }

                  _draggableElements = document.querySelectorAll("[".concat(interactableAttributePrefix, "-draggable]"));

                  if (_draggableElements) {
                    for (_i8 = 0, _arr8 = _toConsumableArray(_draggableElements); _i8 < _arr8.length; _i8++) {
                      _draggableElement = _arr8[_i8];

                      _draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-draggable-accept"));

                      _draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-dragging"));

                      _draggableElement.removeAttribute("".concat(interactableAttributePrefix, "-dragging-accept"));
                    }
                  }
                }

              case 57:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[22, 28]]);
      }));

      return function _onMouseUp(_x4) {
        return _ref5.apply(this, arguments);
      };
    }();

    document.addEventListener('mousedown', _onMouseDown, false);
    document.addEventListener('mousemove', _onMouseMove, false);
    document.addEventListener('mouseup', _onMouseUp, false);
    document.addEventListener('touchstart', _onMouseDown, false);
    document.addEventListener('touchmove', _onMouseMove, false);
    document.addEventListener('touchend', _onMouseUp, false);
    return function () {
      document.removeEventListener('mousedown', _onMouseDown);
      document.removeEventListener('mousemove', _onMouseMove);
      document.removeEventListener('mouseup', _onMouseUp);
      document.removeEventListener('touchstart', _onMouseDown);
      document.removeEventListener('touchmove', _onMouseMove);
      document.removeEventListener('touchend', _onMouseUp);
      document.removeEventListener('touchcancel', _onMouseUp);
    };
  }, [$node, _native, interactableID, interactableData, interactableDroppableAccept, draggable, resizable, droppable, position, size, globalPointerDown, setGlobalPointerDown, interactableAttributePrefix, interactableType, interactableElement, interactableHandleElement, interactableHandleData, interactablePosition, interactableSize, setInteractableType, setInteractableElement, setInteractableHandleElement, setInteractableHandleData, setInteractablePosition, setInteractableSize, pointStart, point, pointEnd, setPointStart, setPoint, setPointEnd, interactableRAF, onDrag, onDragStart, onDragStop, onResize, onResizeStart, onResizeStop, onDrop, onDropStart, onDropStop]);
  return {
    $node: $node,
    draggable: draggable,
    resizable: resizable,
    position: position,
    size: size,
    dragging: dragging,
    dropping: dropping,
    resizing: resizing,
    globalPointerDown: globalPointerDown,
    setGlobalPointerDown: setGlobalPointerDown,
    interactableAttributePrefix: interactableAttributePrefix,
    interactableType: interactableType,
    interactableElement: interactableElement,
    interactableHandleElement: interactableHandleElement,
    interactableHandleData: interactableHandleData,
    setInteractableType: setInteractableType,
    setInteractableElement: setInteractableElement,
    setInteractableHandleElement: setInteractableHandleElement,
    setInteractableHandleData: setInteractableHandleData,
    pointStart: pointStart,
    point: point,
    pointEnd: pointEnd,
    setPointStart: setPointStart,
    setPoint: setPoint,
    setPointEnd: setPointEnd,
    interactableRAF: interactableRAF,
    onDrag: onDrag,
    onDragStart: onDragStart,
    onDragStop: onDragStop,
    onResize: onResize,
    onResizeStart: onResizeStart,
    onResizeStop: onResizeStop
  };
};

/* =========================================
      LOGGER
-------------------------------------- */
// const log = debug('react-interactable:components:Inspector')

/* =========================================
      COMPONENTS
-------------------------------------- */

var Inspector = function Inspector() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var enabled = props.enabled,
      labelStyle = props.labelStyle,
      pointStart = props.pointStart,
      point = props.point,
      pointEnd = props.pointEnd;
  enabled = getBoolean(enabled, true);
  labelStyle = _objectSpread2({
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white',
    opacity: 0.7,
    zIndex: 2147483638,
    fontSize: '12px',
    fontFamily: 'monospace',
    lineHeight: '12px',
    padding: '3px 4px',
    pointerEvents: 'none'
  }, labelStyle);

  var _pointStart = pointStart || {};

  var _point = point || {};

  var _pointEnd = pointEnd || {};

  var InteractableInspectorDeltaPointer = function InteractableInspectorDeltaPointer(props) {
    var name = props.name,
        point = props.point,
        eventColor = props.eventColor,
        elementColor = props.elementColor,
        style = props.style;
    eventColor = eventColor || 'cyan';
    elementColor = elementColor || 'magenta';
    point = point || {};
    var eventTransform = _pointStart.eventX && _pointStart.eventY && "translate(".concat(point.eventX, "px, ").concat(point.eventY, "px)");
    var elementTransform = _pointStart.elementX && _pointStart.elementY && "translate(".concat(point.elementX, "px, ").concat(point.elementY, "px)");
    return React.createElement("div", {
      className: classnames('InteractableInspector-start')
    }, eventTransform && ReactDOM.createPortal(React.createElement("span", {
      className: classnames("InteractableInspector-start-event"),
      style: _objectSpread2({
        background: eventColor
      }, style, {
        transform: eventTransform
      })
    }, "event:".concat(name)), document.body), elementTransform && ReactDOM.createPortal(React.createElement("span", {
      className: classnames("InteractableInspector-start-element"),
      style: _objectSpread2({
        background: elementColor
      }, style, {
        transform: elementTransform
      })
    }, "element:".concat(name)), document.body));
  };

  return React.createElement("div", {
    className: classnames('InteractableInspector')
  }, enabled && React.createElement(InteractableInspectorDeltaPointer, {
    name: "start",
    point: _pointStart,
    eventColor: 'brown',
    elementColor: 'magenta',
    style: labelStyle
  }), enabled && React.createElement(InteractableInspectorDeltaPointer, {
    name: "move",
    point: _point,
    eventColor: 'brown',
    elementColor: 'magenta',
    style: labelStyle
  }), enabled && React.createElement(InteractableInspectorDeltaPointer, {
    name: "end",
    point: _pointEnd,
    eventColor: 'brown',
    elementColor: 'magenta',
    style: labelStyle
  }));
};

/* =========================================
      LOGGER
-------------------------------------- */
// const log = debug('react-interactable:components:ResizeHandles')

/* =========================================
      COMPONENTS
-------------------------------------- */

var ResizeHandles = function ResizeHandles() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var interactableAttributePrefix = props.interactableAttributePrefix,
      interactableHandleData = props.interactableHandleData;
  var currentHandleData = interactableHandleData || {};
  var currentResizeType = currentHandleData.type;
  var currentResizeDirection = currentHandleData.direction;
  var InteractableResizeHandle = useCallback(function (props) {
    var _ref;

    var className = props.className,
        type = props.type,
        direction = props.direction,
        active = props.active;
    return React.createElement("div", _extends({
      className: classnames('InteractableResizeHandle', className, type, direction, {
        active: active
      })
    }, (_ref = {}, _defineProperty(_ref, "".concat(interactableAttributePrefix, "-resizable-handle"), ''), _defineProperty(_ref, "".concat(interactableAttributePrefix, "-resizable-handle-type"), type), _defineProperty(_ref, "".concat(interactableAttributePrefix, "-resizable-handle-direction"), direction), _ref)));
  }, [interactableAttributePrefix]);
  var edgeDirections = ['w', 'n', 'e', 's'];
  var cornerDirections = ['nw', 'ne', 'sw', 'se'];
  return React.createElement("div", {
    className: classnames('InteractableResizeHandles'),
    "data-current-type": currentResizeType,
    "data-current-direction": currentResizeDirection
  }, React.createElement("div", {
    className: classnames('InteractableResizeHandles-edges')
  }, edgeDirections.map(function (direction) {
    var active = Boolean(currentResizeDirection === direction);
    return React.createElement(InteractableResizeHandle, {
      key: "InteractableResizeHandle-edge-".concat(direction),
      type: "edge",
      direction: direction,
      active: active
    });
  })), React.createElement("div", {
    className: classnames('InteractableResizeHandles-corners')
  }, cornerDirections.map(function (direction) {
    var active = Boolean(currentResizeDirection === direction);
    return React.createElement(InteractableResizeHandle, {
      key: "InteractableResizeHandle-corner-".concat(direction),
      type: "corner",
      direction: direction,
      active: active
    });
  })));
};

/* =========================================
      IMPORTS
-------------------------------------- */
/* =========================================
      EXPORTS
-------------------------------------- */

var useInteractable$1 = useInteractable;
var Inspector$1 = Inspector;
var InteractableInspector = Inspector;
var ResizeHandles$1 = ResizeHandles;
var InteractableResizeHandles = ResizeHandles;
var index = {
  useInteractable: useInteractable$1,
  Inspector: Inspector$1,
  InteractableInspector: InteractableInspector,
  ResizeHandles: ResizeHandles$1,
  InteractableResizeHandles: InteractableResizeHandles
};

export default index;
export { Inspector$1 as Inspector, InteractableInspector, InteractableResizeHandles, ResizeHandles$1 as ResizeHandles, useInteractable$1 as useInteractable };
