
/* =========================================
      IMPORTS
-------------------------------------- */


/* =========================================
      CONSTANTS
-------------------------------------- */

const X = 0
const Y = 0


/* =========================================
      FUNCTIONS
-------------------------------------- */

export function getBoolean (value, fallback = undefined) {
    if (typeof value !== 'boolean') {
        value = fallback
    }

    return value
}

export function getObject (value, fallback = undefined) {
    if (typeof value !== 'object') {
        value = fallback
    }

    return value
}

export function getFunction (value, fallback = undefined) {
    if (typeof value !== 'function') {
        value = fallback
    }

    return value
}

export function isCoordinate (value) {
    return (typeof value === 'number' && !isNaN(value))
}

export function isCoordinates (...values) {
    return Boolean(values.filter(isCoordinate).length === values.length)
}

export function isPointerEventButton (event) {
    return Boolean(event && (event.button || event.buttons || event.which || event.detail || event.force || (event.touches || []).length))
}

export function getElement (element) {
    if (typeof element === 'string') {
        element = document.querySelector(element)
    }

    if (!element) {
        return null
    }

    if (element instanceof Element) {
        return element
    }

    element = element.current || null // ~ $ref

    return element
}

export function getElementStyle (element) {
    element = getElement(element)

    return window.getComputedStyle(element) || {}
}

export function getElementRect (element) {
    element = getElement(element)

    return element && element.getBoundingClientRect() || {}
}

export function getElementSize (element) {
    if (element) {
        // REVIEW: use `getBoundingClientRect` instead?
        const style = (element instanceof Element) ? getElementStyle(element) : {}

        const width = parseFloat(style.width || element.width)
        const height = parseFloat(style.height || element.height)

        const naturalWidth = parseFloat(element.naturalWidth || element.videoWidth || element.clientWidth || width)
        const naturalHeight = parseFloat(element.naturalHeight || element.videoWidth || element.clientHeight || height)

        const scale = naturalWidth ? (width / naturalWidth) : 1
        const aspectRatio = naturalHeight ? (naturalWidth / naturalHeight) : 1

        const size = {
            width,
            height,

            naturalWidth,
            naturalHeight,

            scale,
            aspectRatio,
        }

        return size
    }
}

export function getElementData (element) {
    element = getElement(element)

    return element && {...(element.dataset || {})}
}

export function isElement (element) {
    element = getElement(element)

    return (element instanceof Element)
}

// NOTE:
//
//     • `event.target`` - the element that triggered the event (e.g., the user clicked on)
//     • `event.currentTarget` - the element that the event listener is attached to
//
export function getEventCurrentTarget (event) {
    return event.toElement || event.currentTarget || event.srcElement || null
}

export function isElementsIntersecting (elementA, elementB) {
    elementA = getElement(elementA)
    elementB = getElement(elementB)

    const elementRectA = getElementRect(elementA)
    const elementRectB = getElementRect(elementB)

    // TODO: consider intersecting using optional `threshold` (%)
    const isElementsIntersecting = !(
        (elementRectB.left >= elementRectA.right) ||
        (elementRectB.right <= elementRectA.left) ||
        (elementRectB.top >= elementRectA.bottom) ||
        (elementRectB.bottom <= elementRectA.top)
    )

    return isElementsIntersecting
}

export function getIntersectingElements (referenceElement, elements = []) {
    if (isElement(elements)) {
        elements = [elements]
    } else {
        elements = [...elements || []]
    }

    let intersectingElements = []

    for (const element of elements) {
        const isIntersectingElements = isElementsIntersecting(referenceElement, element)

        if (isIntersectingElements) {
            intersectingElements = [
                ...intersectingElements,
                element,
            ]
        }
    }

    return intersectingElements
}

export function getIntersectingElement (referenceElement, elements = []) {
    return getIntersectingElements(referenceElement, elements)[0]
}

export function getParentElements (element, selector = undefined, options = {includeSelf: false, rootElement: null}) {
    element = getElement(element)

    if (!isElement(element)) {
        return []
    }

    let elements = []
    let isMatchingElement

    if (options.includeSelf) {
        isMatchingElement = selector ? element.matches(selector) : true

        if (isMatchingElement) {
            elements = [
                element,
            ]
        }
    }

    if (options.rootElement) {
        if (element === options.rootElement) {
            return elements
        }
    }

    while (element.parentElement) {
        isMatchingElement = selector ? element.parentElement.matches(selector) : true

        if (isMatchingElement) {
            elements = [
                ...elements,
                element.parentElement,
            ]
        }

        element = element.parentElement

        if (options.rootElement) {
            if (element === options.rootElement) {
                break
            }
        }
    }

    return elements
}

export function getParentElement (element, selector = undefined, options = {includeSelf: false, rootElement: null}) {
    return getParentElements(element, selector, options)[0] || null
}

export function getPointerEvent (event) {
    if (event) {
        event = (event.touches || [])[0] || event
    }

    return event
}

// OPTIMIZATION: memoize?
export function getPointerEventElements (event, selector = undefined) {
    if (!event) {
        return []
    }

    event = getPointerEvent(event)

    const [x, y] = [
        (event.pageX - window.scrollX) || event.x || event[X],
        (event.pageY - window.scrollY) || event.y || event[Y],
    ]

    if (!isCoordinates(x, y)) {
        return []
    }

    let elements

    elements = document.elementsFromPoint(x, y) || []

    if (selector) {
        elements = elements.filter((element) => {
            return element.matches(selector)
        })
    }

    return elements
}

export function getPointerEventElement (event, selector = undefined) {
    return getPointerEventElements(event, selector)[0] || null
}

export function getPointerEventPointCoords (event) {
    const {
        pageX,
        pageY,
    } = (event.touches || [])[0] || event

    const {
        scrollX,
        scrollY,
    } = window

    const eventX = pageX - scrollX
    const eventY = pageY - scrollY

    const x = eventX
    const y = eventY

    return {
        x,
        y,

        eventX,
        eventY,

        pageX,
        pageY,

        scrollX,
        scrollY,
    }
}

// OPTIMIZATION: memoize?
export function getPointerEventPoint (event, relativeElement = undefined) {
    let x = 0
    let y = 0

    if (event) {
        x = event.pageX
        y = event.pageY

        const point = getPointerEventPointCoords(event)

        x = point.x
        y = point.y
    }

    if (relativeElement === true) {
        relativeElement = event.target

    } else {
        relativeElement = getElement(relativeElement)
    }

    if (relativeElement instanceof Element) {
        const elBounds = getElementRect(relativeElement)

        x = (x - elBounds.x)
        y = (y - elBounds.y)
    }

    return {
        x,
        y,
    }
}

export function getPointerEventsPointDetails (event, element, containerElement = document.body) {
    event = getPointerEvent(event)

    const {
        eventX,
        eventY,

        pageX,
        pageY,

        scrollX,
        scrollY,
    } = getPointerEventPointCoords(event)

    const containerRect = containerElement.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    const containerX = containerRect.x
    const containerY = containerRect.y

    const elementX = elementRect.x
    const elementY = elementRect.y

    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    const elementWidth = elementRect.width
    const elementHeight = elementRect.height

    return {
        eventX,
        eventY,

        scrollX,
        scrollY,

        pageX,
        pageY,

        containerRect,

        containerX,
        containerY,

        containerWidth,
        containerHeight,

        elementRect,

        elementX,
        elementY,

        elementWidth,
        elementHeight,
    }
}

export function getValidPosition (position) {
    position = {
        ...position,
    }

    if (!isCoordinate(position.x)) {
        position.x = 0
    }

    if (!isCoordinate(position.y)) {
        position.y = 0
    }

    return position
}

export function getValidSize (size) {
    size = {
        ...size,
    }

    if (!isCoordinate(size.width)) {
        size.width = 0
    }

    if (!isCoordinate(size.height)) {
        size.height = 0
    }

    return size
}

export function getConstrainedPosition (position, size, container) {
    position = getValidPosition(position)
    size = getValidSize(size)

    if (!container) {
        const containerElement = getElement(container) || document.body

        container = getElementRect(containerElement)
    }

    if (container.width) {
        const isOverflowingX = Boolean((position.x + size.width) > container.width)

        if (isOverflowingX) {
            const adjustedPositionX = container.width - size.width

            position.x = adjustedPositionX
        }
    }

    if (container.height) {
        const isOverflowingY = Boolean((position.y + size.height) > container.height)

        if (isOverflowingY) {
            const adjustedPositionY = container.height - size.height

            position.y = adjustedPositionY
        }
    }

    if (position.x < 0) {
        position.x = 0
    }

    if (position.y < 0) {
        position.y = 0
    }

    return position
}

export function getConstrainedPositionAndSize (position, size, container = undefined) {
    position = getValidPosition(position)
    size = getValidSize(size)

    if (!container) {
        const containerElement = getElement(container) || document.body

        container = getElementRect(containerElement)
    }

    position = getConstrainedPosition(position, size, container)

    if (container.width) {
        const isOverflowingW = Boolean((position.x + size.width) > container.width)

        if (isOverflowingW) {
            const adjustedSizeW = container.width

            size.width = adjustedSizeW
        }
    }

    if (container.height) {
        const isOverflowingH = Boolean((position.y + size.height) > container.height)

        if (isOverflowingH) {
            const adjustedSizeH = container.height

            size.height = adjustedSizeH
        }
    }

    return [position, size]
}

export function withRAF (fn, raf) {
    return () => {
        cancelAnimationFrame(raf)

        return requestAnimationFrame(fn)
    }
}

export function callback (fn) {
    return (...args) => {
        if (typeof fn === 'function') {
            return fn(...args)
        }
    }
}

export function getProps (object, options = {}) {
    let newObject = {...object}

    if (Array.isArray(object)) {
        options = {
            include: options,
        }
    }

    let {
        include,
        exclude,
    } = options

    const allKeys = Object.keys(newObject)

    const includeKeys = include || allKeys
    const excludeKeys = exclude || []

    for (const key of allKeys) {
        if (!includeKeys.includes(key)) {
            delete newObject[key]
        }

        if (excludeKeys.includes(key)) {
            delete newObject[key]
        }
    }

    return newObject
}
