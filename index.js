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

var _log = debug('react-modifiable:hooks:useModifiable');
/* =========================================
      HOOKS
-------------------------------------- */


var useModifiable = function useModifiable($node) {
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
      onDrop = props.onDrop,
      onDropStart = props.onDropStart,
      onDropStop = props.onDropStop;
  var modifiableAttributePrefix = attributePrefix || 'data-modifiable';
  var modifiableData = data;
  var modifiableIDGenerator = getFunction(id, function (node) {
    useModifiable.instanceID = useModifiable.instanceID || 1;
    return id || node && node.getAttribute("".concat(modifiableAttributePrefix, "-id")) || useModifiable.instanceID++;
  });
  var modifiableDroppableAccept = getFunction(droppable, function (_ref) {
    var source = _ref.source,
        target = _ref.target;
    return {
      source: source,
      target: target
    };
  });
  var node = $node.current;
  var modifiableID = modifiableIDGenerator(node, props);

  if (log === undefined) {
    log = function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _log.apply(void 0, ["".concat(modifiableID)].concat(args));
    };
  }

  var modifiableRAF = useRef(null);

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
      modifiableType = _useState10[0],
      setModifiableType = _useState10[1];

  var _useState11 = useState(null),
      _useState12 = _slicedToArray(_useState11, 2),
      modifiableElement = _useState12[0],
      setModifiableElement = _useState12[1];

  var _useState13 = useState(null),
      _useState14 = _slicedToArray(_useState13, 2),
      modifiableHandleElement = _useState14[0],
      setModifiableHandleElement = _useState14[1];

  var _useState15 = useState({}),
      _useState16 = _slicedToArray(_useState15, 2),
      modifiableHandleData = _useState16[0],
      setModifiableHandleData = _useState16[1];

  var _useState17 = useState({}),
      _useState18 = _slicedToArray(_useState17, 2),
      modifiablePosition = _useState18[0],
      setModifiablePosition = _useState18[1];

  var _useState19 = useState({}),
      _useState20 = _slicedToArray(_useState19, 2),
      modifiableSize = _useState20[0],
      setModifiableSize = _useState20[1];

  var dragging = Boolean(modifiableType === 'drag');
  var dropping = Boolean(modifiableType === 'drop');
  var resizing = Boolean(modifiableType === 'resize'); // NOTE: not reliable for drag positions

  var _native = false;
  useEffect(function () {
    var node = $node.current;

    if (!node) {
      return;
    }

    node.setAttribute("".concat(modifiableAttributePrefix, "-id"), modifiableID);

    if (draggable) {
      node.setAttribute("".concat(modifiableAttributePrefix, "-draggable"), '');
    }

    if (droppable) {
      node.setAttribute("".concat(modifiableAttributePrefix, "-droppable"), '');
    }

    if (resizable) {
      node.setAttribute("".concat(modifiableAttributePrefix, "-resizable"), '');
    }

    var _onMouseDown = function _onMouseDown(event) {
      var originalEvent = event;
      event = getPointerEvent(event); // log('modifiable:mousedown', event)

      setGlobalPointerDown(true);
      var _event = event,
          target = _event.target;

      if (target.matches("[".concat(modifiableAttributePrefix, "-ignore], [").concat(modifiableAttributePrefix, "-ignore] *"))) {
        return;
      }

      var actionElement = getParentElement(target, ["[".concat(modifiableAttributePrefix, "-draggable-handle]"), "[".concat(modifiableAttributePrefix, "-resizable-handle]")], {
        includeSelf: true
      }) || getParentElement(target, ["[".concat(modifiableAttributePrefix, "-draggable]"), "[".concat(modifiableAttributePrefix, "-resizable]")], {
        includeSelf: true
      });
      var element = getParentElement(actionElement, ["[".concat(modifiableAttributePrefix, "-draggable]"), "[".concat(modifiableAttributePrefix, "-resizable]")], {
        includeSelf: true
      }) || getPointerEventElement(target, ["[".concat(modifiableAttributePrefix, "-draggable]"), "[".concat(modifiableAttributePrefix, "-resizable]")]);
      var containerElement = getElement(container) || getParentElement(element, ["[".concat(modifiableAttributePrefix, "-container]")]) || getParentElement(element); // log('modifiable:mousedown:element', element, actionElement)

      if (!element) {
        return;
      }

      var isCurrentElement = Boolean(actionElement && actionElement.matches(["[".concat(modifiableAttributePrefix, "-id=\"").concat(modifiableID, "\"]"), "[".concat(modifiableAttributePrefix, "-id=\"").concat(modifiableID, "\"] *")].join(', ')));

      if (!isCurrentElement) {
        return;
      }

      originalEvent.preventDefault();
      var currentPointStart = getPointerEventsPointDetails(event, element, containerElement);
      setPointStart(currentPointStart);
      var isResizeAction = false;
      var isDragAction = false;

      if (resizable) {
        var resizableElement = getParentElement(target, "[".concat(modifiableAttributePrefix, "-resizable]"), {
          includeSelf: true
        });
        var resizableHandleElement = getParentElement(target, "[".concat(modifiableAttributePrefix, "-resizable-handle]"), {
          includeSelf: true
        });
        var resizableHandleData = resizableHandleElement && resizableHandleElement.dataset && {
          type: resizableHandleElement.dataset.modifiableResizableHandleType,
          direction: resizableHandleElement.dataset.modifiableResizableHandleDirection
        };
        isResizeAction = Boolean(resizableElement && resizableHandleElement);

        if (isResizeAction) {
          log('modifiable:resizable:start', modifiableID);
          document.body.setAttribute("".concat(modifiableAttributePrefix, "-resizing"), modifiableID);
          resizableElement.setAttribute("".concat(modifiableAttributePrefix, "-resizing"), '');
          setModifiableType('resize');
          setModifiableElement(resizableElement);
          setModifiableHandleElement(resizableHandleElement);
          setModifiableHandleData(resizableHandleData);
          onResizeStart({
            position: position,
            size: size,
            pointStart: currentPointStart
          });
        }
      }

      if (draggable && !isResizeAction) {
        var draggableElement = getParentElement(target, "[".concat(modifiableAttributePrefix, "-draggable]"), {
          includeSelf: true
        });
        var draggableHandleElement = getParentElement(target, "[".concat(modifiableAttributePrefix, "-draggable-handle]"), {
          includeSelf: true
        }) || getParentElement(target, "[".concat(modifiableAttributePrefix, "-resizable]"), {
          includeSelf: true
        }) || draggableElement;
        var draggableHandleData = draggableHandleElement && draggableHandleElement.dataset && {};
        isDragAction = Boolean(draggableElement && draggableHandleElement);

        if (isDragAction) {
          log('modifiable:draggable:start', modifiableID);
          document.body.setAttribute("".concat(modifiableAttributePrefix, "-dragging"), modifiableID);
          draggableElement.setAttribute("".concat(modifiableAttributePrefix, "-dragging"), '');
          draggableElement.$modifiableData = modifiableData;
          setModifiableType('drag');
          setModifiableElement(draggableElement);
          setModifiableHandleElement(draggableHandleElement);
          setModifiableHandleData(draggableHandleData);
          onDragStart({
            position: position,
            size: size,
            pointStart: pointStart
          });
        }
      }
    };

    var _onMouseMove = function _onMouseMove(event) {
      var originalEvent = event;
      event = getPointerEvent(event);
      var _event2 = event,
          target = _event2.target;

      if (target.matches("[".concat(modifiableAttributePrefix, "-ignore], [").concat(modifiableAttributePrefix, "-ignore] *"))) {
        return;
      } // log('modifiable:mousemove', event)


      if (!globalPointerDown) {
        return;
      }

      var isPointerStillDown = isPointerEventButton(event); // NOTE: sometimes `mouseup` event is not triggered

      if (!isPointerStillDown) {
        return _onMouseUp(event);
      }

      var isResizing = false;
      var isDragging = false;
      var isDropping = false;

      if (droppable) {
        var dragElementID = document.body.getAttribute("".concat(modifiableAttributePrefix, "-dragging")); // const dropElementID = document.body.getAttribute(`${modifiableAttributePrefix}-dropping`)

        var dragElement = dragElementID && document.querySelector("[".concat(modifiableAttributePrefix, "-id=\"").concat(dragElementID, "\"]")) || null;
        var dragContainerElement = dragElement && (getParentElement(dragElement, ["".concat(modifiableAttributePrefix, "-container")]) || getParentElement(dragElement)) || null;
        var droppableElements = dragContainerElement && dragContainerElement.querySelectorAll("[".concat(modifiableAttributePrefix, "-droppable]:not([").concat(modifiableAttributePrefix, "-id=\"").concat(dragElementID, "\"])")) || [];
        var dropElement = getPointerEventElement(event, "[".concat(modifiableAttributePrefix, "-droppable]:not([").concat(modifiableAttributePrefix, "-id=\"").concat(dragElementID, "\"])"));
        isDropping = Boolean(dragElement && dropElement); // log('modifiable:droppable:drop?', isDropping, dragElementID, '=>', dropElementID)

        for (var _i = 0, _arr = _toConsumableArray(droppableElements); _i < _arr.length; _i++) {
          var _droppableElement = _arr[_i];

          // NOTE: `result` can be `<Object>` (success) or `<Error>` (failed accepting - with details)
          var _result = modifiableDroppableAccept({
            source: dragElement,
            target: _droppableElement
          });

          var _accept = !!_result;

          _droppableElement.setAttribute("".concat(modifiableAttributePrefix, "-droppable-accept"), _accept);
        }

        var _droppableElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-droppable-accept], [").concat(modifiableAttributePrefix, "-dropping-accept]"));

        if (_droppableElements) {
          for (var _i2 = 0, _arr2 = _toConsumableArray(_droppableElements); _i2 < _arr2.length; _i2++) {
            var droppableElement = _arr2[_i2];
            droppableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping"));
            droppableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"));
          }
        }

        if (isDropping) {
          var result = modifiableDroppableAccept({
            source: dragElement,
            target: dropElement
          });
          var accept = !!result;

          var _data = getObject(result, {});

          document.body.setAttribute("".concat(modifiableAttributePrefix, "-dropping"), modifiableID);
          document.body.setAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"), accept);
          dragContainerElement.setAttribute("".concat(modifiableAttributePrefix, "-dropping"), modifiableID);
          dragContainerElement.setAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"), accept);
          dropElement.setAttribute("".concat(modifiableAttributePrefix, "-dropping"), '');
          dropElement.setAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"), accept);
          log('modifiable:droppable:drop:start', accept, _data);
          callback(onDropStart)({
            accept: accept,
            data: _data
          });
        }
      }

      var element = modifiableElement;
      var containerElement = getElement(container) || getParentElement(element, ["[".concat(modifiableAttributePrefix, "-container]")]) || getParentElement(element); // log('modifiable:mousemove:element', element)

      if (!element) {
        return;
      }

      if (!containerElement) {
        return;
      }

      originalEvent.preventDefault();
      var currentPoint = getPointerEventsPointDetails(event, element, containerElement);
      setPoint(currentPoint);
      var x = pointStart.elementX - pointStart.containerX + (currentPoint.eventX - currentPoint.containerX - (pointStart.eventX - pointStart.containerX));
      var y = pointStart.elementY - pointStart.containerY + (currentPoint.eventY - currentPoint.containerY - (pointStart.eventY - pointStart.containerY));
      var dx = x - position.x;
      var dy = y - position.y;

      if (resizable) {
        isResizing = Boolean(modifiableType === 'resize');

        if (isResizing) {
          log('modifiable:resizable:drag', x, y);

          var _position = getValidPosition(position);

          var _size = getValidSize(size);

          var direction = "".concat(modifiableHandleData.direction || '');
          var isModifierPositionX = direction.includes('w');
          var isModifierPositionY = direction.includes('n');
          var isModifierSizeX = direction.includes('e');
          var isModifierSizeY = direction.includes('s');
          log('modifiable:direction', modifiableHandleData);
          var w = pointStart.elementWidth + dx;
          var h = pointStart.elementHeight + dy;
          var dw = w - size.width;
          var dh = h - size.height;

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

          var _container = {
            width: currentPoint.containerWidth,
            height: currentPoint.containerHeight
          };

          var _getConstrainedPositi = getConstrainedPositionAndSize(_position, _size, _container),
              _getConstrainedPositi2 = _slicedToArray(_getConstrainedPositi, 2),
              constraintedPosition = _getConstrainedPositi2[0],
              constrainedSize = _getConstrainedPositi2[1];

          var resized = !!(dx + dy + dw + dh);
          modifiableRAF.current = withRAF(function () {
            callback(onResize)({
              position: constraintedPosition,
              size: constrainedSize,
              resized: resized,
              point: currentPoint
            });
          }, modifiableRAF.current)();
        }
      }

      if (draggable) {
        isDragging = Boolean(modifiableType === 'drag');

        if (isDragging && !isResizing) {
          log('modifiable:draggable:drag', x, y);

          var _position2 = getValidPosition(position);

          var _size2 = getValidSize(size);

          _position2.x += dx;
          _position2.y += dy;
          var _container2 = {
            width: currentPoint.containerWidth,
            height: currentPoint.containerHeight
          };

          var _getConstrainedPositi3 = getConstrainedPositionAndSize(_position2, _size2, _container2),
              _getConstrainedPositi4 = _slicedToArray(_getConstrainedPositi3, 2),
              _constraintedPosition = _getConstrainedPositi4[0],
              _constrainedSize = _getConstrainedPositi4[1];

          var dragged = !!(dx + dy);
          modifiableRAF.current = withRAF(function () {
            onDrag({
              position: _constraintedPosition,
              size: _constrainedSize,
              dragged: dragged,
              point: currentPoint
            });
          }, modifiableRAF.current)();
        }
      }
    };

    var _onMouseUp = function _onMouseUp(event) {
      var originalEvent = event;
      event = getPointerEvent(event); // log('modifiable:mouseup')

      setGlobalPointerDown(false);
      var _event3 = event,
          target = _event3.target;

      if (target.matches("[".concat(modifiableAttributePrefix, "-ignore], [").concat(modifiableAttributePrefix, "-ignore] *"))) {
        return;
      }

      var isDropping = false;

      if (droppable) {
        var dragElementID = document.body.getAttribute("".concat(modifiableAttributePrefix, "-dragging"));
        var dropElementID = document.body.getAttribute("".concat(modifiableAttributePrefix, "-dropping")); // console.warn('modifiable:xxx', {dragElementID, dropElementID})

        var dragElement = dragElementID && document.querySelector("[".concat(modifiableAttributePrefix, "-id=\"").concat(dragElementID, "\"]"));
        var dropElement = dropElementID && document.querySelector("[".concat(modifiableAttributePrefix, "-id=\"").concat(dropElementID, "\"]")); // document.body.removeAttribute(`${modifiableAttributePrefix}-dropping`)

        var droppedElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-dropping-accept]"));

        if (droppedElements) {
          for (var _i3 = 0, _arr3 = _toConsumableArray(droppedElements); _i3 < _arr3.length; _i3++) {
            var droppedElement = _arr3[_i3];
            droppedElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"));
          }
        }

        isDropping = Boolean(dragElement && dropElement);
        log('modifiable:droppable?', isDropping, dragElementID, '=>', dropElementID);
        var accept = false;
        var _data2 = null;

        if (isDropping) {
          _data2 = modifiableDroppableAccept({
            source: dragElement,
            target: dropElement
          });
          accept = !!_data2;
          _data2 = getObject(_data2, {});
          log('modifiable:droppable:drop:accept?', accept, _data2, dragElementID, '=>', dropElementID);

          if (accept) {
            log('modifiable:droppable:drop', accept, _data2);
            callback(onDrop)({
              accept: accept,
              data: _data2
            });
          }
        }

        log('modifiable:droppable:drop:stop', accept, _data2);
        callback(onDropStop)({
          accept: accept,
          data: _data2
        });
        var droppableElements = document.querySelectorAll(["[".concat(modifiableAttributePrefix, "-droppable-accept]"), "[".concat(modifiableAttributePrefix, "-dropping-accept]")].join(', '));

        if (droppableElements) {
          for (var _i4 = 0, _arr4 = _toConsumableArray(droppableElements); _i4 < _arr4.length; _i4++) {
            var droppableElement = _arr4[_i4];
            droppableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping"));
            droppableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping-accept"));
            droppableElement.removeAttribute("".concat(modifiableAttributePrefix, "-droppable-accept"));
          }
        }
      }

      if (resizable) {
        var resizableElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-resizable]"));

        if (resizableElements) {
          for (var _i5 = 0, _arr5 = _toConsumableArray(resizableElements); _i5 < _arr5.length; _i5++) {
            var resizableElement = _arr5[_i5];
            resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizing"));
            resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizing-accept"));
            resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizable-accept"));
          }
        }
      }

      if (draggable) {
        var draggableElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-draggable]"));

        if (draggableElements) {
          for (var _i6 = 0, _arr6 = _toConsumableArray(draggableElements); _i6 < _arr6.length; _i6++) {
            var draggableElement = _arr6[_i6];
            draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dragging"));
            draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dragging-accept"));
            draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-draggable-accept"));
          }
        }
      }

      var element = modifiableElement;
      var containerElement = getElement(container) || getParentElement(element, ["[".concat(modifiableAttributePrefix, "-container]")]) || getParentElement(element); // log('modifiable:mouseup:element', element)

      setModifiableType(null);
      setModifiableElement(null);
      setModifiableHandleElement(null);
      setModifiableHandleData(null); // NOTE: ensure executed in next event loop, to avoid race condition between modifiable element event handlers

      setTimeout(function () {
        document.body.removeAttribute("".concat(modifiableAttributePrefix, "-dragging"));
        document.body.removeAttribute("".concat(modifiableAttributePrefix, "-dropping"));
        document.body.removeAttribute("".concat(modifiableAttributePrefix, "-resizing"));

        if (modifiableElement) {
          modifiableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dragging"));
          modifiableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dropping"));
          modifiableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizing"));
          modifiableElement.removeAttribute("".concat(modifiableAttributePrefix, "-droppable-accept"));
        }
      }, 0);

      if (!element) {
        return;
      }

      if (element !== node) {
        return;
      }

      originalEvent.preventDefault();
      var currentPointEnd = getPointerEventsPointDetails(event, element, containerElement);
      setPointEnd(currentPointEnd);

      if (resizable) {
        var isResizing = Boolean(modifiableType === 'resize');

        if (isResizing) {
          log('modifiable:resizable:end');
          onResizeStop({
            position: position,
            size: size,
            pointEnd: currentPointEnd
          });
        }

        var _resizableElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-resizable]"));

        if (_resizableElements) {
          for (var _i7 = 0, _arr7 = _toConsumableArray(_resizableElements); _i7 < _arr7.length; _i7++) {
            var _resizableElement = _arr7[_i7];

            _resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizable-accept"));

            _resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizing"));

            _resizableElement.removeAttribute("".concat(modifiableAttributePrefix, "-resizing-accept"));
          }
        }
      }

      if (draggable) {
        var isDragging = Boolean(modifiableType === 'drag');

        if (isDragging) {
          log('modifiable:draggable:end');
          onDragStop({
            position: position,
            size: size,
            pointEnd: currentPointEnd
          });
        }

        var _draggableElements = document.querySelectorAll("[".concat(modifiableAttributePrefix, "-draggable]"));

        if (_draggableElements) {
          for (var _i8 = 0, _arr8 = _toConsumableArray(_draggableElements); _i8 < _arr8.length; _i8++) {
            var _draggableElement = _arr8[_i8];

            _draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-draggable-accept"));

            _draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dragging"));

            _draggableElement.removeAttribute("".concat(modifiableAttributePrefix, "-dragging-accept"));
          }
        }
      }
    };

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
  }, [$node, _native, modifiableID, modifiableData, modifiableDroppableAccept, draggable, resizable, droppable, position, size, globalPointerDown, setGlobalPointerDown, modifiableAttributePrefix, modifiableType, modifiableElement, modifiableHandleElement, modifiableHandleData, modifiablePosition, modifiableSize, setModifiableType, setModifiableElement, setModifiableHandleElement, setModifiableHandleData, setModifiablePosition, setModifiableSize, pointStart, point, pointEnd, setPointStart, setPoint, setPointEnd, modifiableRAF, onDrag, onDragStart, onDragStop, onResize, onResizeStart, onResizeStop, onDrop, onDropStart, onDropStop]);
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
    modifiableAttributePrefix: modifiableAttributePrefix,
    modifiableType: modifiableType,
    modifiableElement: modifiableElement,
    modifiableHandleElement: modifiableHandleElement,
    modifiableHandleData: modifiableHandleData,
    setModifiableType: setModifiableType,
    setModifiableElement: setModifiableElement,
    setModifiableHandleElement: setModifiableHandleElement,
    setModifiableHandleData: setModifiableHandleData,
    pointStart: pointStart,
    point: point,
    pointEnd: pointEnd,
    setPointStart: setPointStart,
    setPoint: setPoint,
    setPointEnd: setPointEnd,
    modifiableRAF: modifiableRAF,
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
// const log = debug('react-modifiable:components:Inspector')

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

  var ModifiableInspectorDeltaPointer = function ModifiableInspectorDeltaPointer(props) {
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
      className: classnames('ModifiableInspector-start')
    }, eventTransform && ReactDOM.createPortal(React.createElement("span", {
      className: classnames("ModifiableInspector-start-event"),
      style: _objectSpread2({
        background: eventColor
      }, style, {
        transform: eventTransform
      })
    }, "event:".concat(name)), document.body), elementTransform && ReactDOM.createPortal(React.createElement("span", {
      className: classnames("ModifiableInspector-start-element"),
      style: _objectSpread2({
        background: elementColor
      }, style, {
        transform: elementTransform
      })
    }, "element:".concat(name)), document.body));
  };

  return React.createElement("div", {
    className: classnames('ModifiableInspector')
  }, enabled && React.createElement(ModifiableInspectorDeltaPointer, {
    name: "start",
    point: _pointStart,
    eventColor: 'brown',
    elementColor: 'magenta',
    style: labelStyle
  }), enabled && React.createElement(ModifiableInspectorDeltaPointer, {
    name: "move",
    point: _point,
    eventColor: 'brown',
    elementColor: 'magenta',
    style: labelStyle
  }), enabled && React.createElement(ModifiableInspectorDeltaPointer, {
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
// const log = debug('react-modifiable:components:ResizeHandles')

/* =========================================
      COMPONENTS
-------------------------------------- */

var ResizeHandles = function ResizeHandles() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var modifiableAttributePrefix = props.modifiableAttributePrefix,
      modifiableHandleData = props.modifiableHandleData;
  var currentHandleData = modifiableHandleData || {};
  var currentResizeType = currentHandleData.type;
  var currentResizeDirection = currentHandleData.direction;
  var ModifiableResizeHandle = useCallback(function (props) {
    var _ref;

    var className = props.className,
        type = props.type,
        direction = props.direction,
        active = props.active;
    return React.createElement("div", _extends({
      className: classnames('ModifiableResizeHandle', className, type, direction, {
        active: active
      })
    }, (_ref = {}, _defineProperty(_ref, "".concat(modifiableAttributePrefix, "-resizable-handle"), ''), _defineProperty(_ref, "".concat(modifiableAttributePrefix, "-resizable-handle-type"), type), _defineProperty(_ref, "".concat(modifiableAttributePrefix, "-resizable-handle-direction"), direction), _ref)));
  }, [modifiableAttributePrefix]);
  var edgeDirections = ['w', 'n', 'e', 's'];
  var cornerDirections = ['nw', 'ne', 'sw', 'se'];
  return React.createElement("div", {
    className: classnames('ModifiableResizeHandles'),
    "data-current-type": currentResizeType,
    "data-current-direction": currentResizeDirection
  }, React.createElement("div", {
    className: classnames('ModifiableResizeHandles-edges')
  }, edgeDirections.map(function (direction) {
    var active = Boolean(currentResizeDirection === direction);
    return React.createElement(ModifiableResizeHandle, {
      key: "ModifiableResizeHandle-edge-".concat(direction),
      type: "edge",
      direction: direction,
      active: active
    });
  })), React.createElement("div", {
    className: classnames('ModifiableResizeHandles-corners')
  }, cornerDirections.map(function (direction) {
    var active = Boolean(currentResizeDirection === direction);
    return React.createElement(ModifiableResizeHandle, {
      key: "ModifiableResizeHandle-corner-".concat(direction),
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

var useModifiable$1 = useModifiable;
var Inspector$1 = Inspector;
var ModifiableInspector = Inspector;
var ResizeHandles$1 = ResizeHandles;
var ModifiableResizeHandles = ResizeHandles;
var index = {
  useModifiable: useModifiable$1,
  Inspector: Inspector$1,
  ModifiableInspector: ModifiableInspector,
  ResizeHandles: ResizeHandles$1,
  ModifiableResizeHandles: ModifiableResizeHandles
};

export default index;
export { Inspector$1 as Inspector, ModifiableInspector, ModifiableResizeHandles, ResizeHandles$1 as ResizeHandles, useModifiable$1 as useModifiable };
