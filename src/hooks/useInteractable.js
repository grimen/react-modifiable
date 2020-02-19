
/* =========================================
      IMPORTS
-------------------------------------- */

import { useEffect, useState, useRef } from 'react'
import debug from 'debug'

import {
    callback,

    getObject,
    getFunction,

    getConstrainedPositionAndSize,

    getElement,
    getParentElement,

    getPointerEvent,
    getPointerEventsPointDetails,
    getPointerEventElement,

    getValidPosition,
    getValidSize,

    isPointerEventButton,

    withRAF,
} from '../utils'


/* =========================================
      LOGGER
-------------------------------------- */

const _log = debug('react-interactable:hooks:useInteractable')


/* =========================================
      HOOKS
-------------------------------------- */

const useInteractable = ($node, props = {}) => {
    let {
        log,
        id,

        container,

        attributePrefix,

        draggable,
        resizable,
        droppable,

        position,
        size,

        data,

        onDragStart,
        onDrag,
        onDragStop,

        onResizeStart,
        onResize,
        onResizeStop,

        onDropStart,
        onDrop,
        onDropStop,
    } = props

    const interactableAttributePrefix = attributePrefix || 'data-interactable'

    const interactableData = data

    const interactableIDGenerator = getFunction(id, (node, props = {}) => {
        useInteractable.instanceID = useInteractable.instanceID || 1

        return id || (node && node.getAttribute(`${interactableAttributePrefix}-id`)) || useInteractable.instanceID++
    })

    const interactableDroppableAccept = getFunction(droppable, async ({source, target}) => {
        const data = (source && (source.$interactableData || source.$data || {...source.dataset})) || null

        return data
    })

    const node = $node.current
    const interactableID = interactableIDGenerator(node, props)

    if (log === undefined) {
        log = (...args) => {
            return _log(`${interactableID}`, ...args)
        }
    }

    const interactableRAF = useRef(null)

    const [globalPointerDown, setGlobalPointerDown] = useState(false)

    const [pointStart, setPointStart] = useState({
        x: undefined,
        y: undefined,
    })
    const [point, setPoint] = useState({
        x: undefined,
        y: undefined,
    })
    const [pointEnd, setPointEnd] = useState({
        x: undefined,
        y: undefined,
    })

    const [interactableType, setInteractableType] = useState(null)
    const [interactableElement, setInteractableElement] = useState(null)
    const [interactableHandleElement, setInteractableHandleElement] = useState(null)
    const [interactableHandleData, setInteractableHandleData] = useState({})
    const [interactablePosition, setInteractablePosition] = useState({})
    const [interactableSize, setInteractableSize] = useState({})

    const dragging = Boolean(interactableType === 'drag')
    const dropping = Boolean(interactableType === 'drop')
    const resizing = Boolean(interactableType === 'resize')

    // NOTE: not reliable for drag positions
    const native = false

    useEffect(() => {
        const node = $node.current

        if (!node) {
            return
        }

        node.setAttribute(`${interactableAttributePrefix}-id`, interactableID)

        if (draggable) {
            node.setAttribute(`${interactableAttributePrefix}-draggable`, '')
        }

        if (droppable) {
            node.setAttribute(`${interactableAttributePrefix}-droppable`, '')
        }

        if (resizable) {
            node.setAttribute(`${interactableAttributePrefix}-resizable`, '')
        }

        const _onMouseDown = (async (event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            // log('interactable:mousedown', event)

            setGlobalPointerDown(true)

            const { target } = event

            if (target.matches(`[${interactableAttributePrefix}-ignore], [${interactableAttributePrefix}-ignore] *`)) {
                return
            }

            const actionElement = getParentElement(target, [
                `[${interactableAttributePrefix}-draggable-handle]`,
                `[${interactableAttributePrefix}-resizable-handle]`,
            ], {includeSelf: true}) || getParentElement(target, [
                `[${interactableAttributePrefix}-draggable]`,
                `[${interactableAttributePrefix}-resizable]`,
            ], {includeSelf: true})

            const element = getParentElement(actionElement, [
                `[${interactableAttributePrefix}-draggable]`,
                `[${interactableAttributePrefix}-resizable]`,
            ], {includeSelf: true}) || getPointerEventElement(target, [
                `[${interactableAttributePrefix}-draggable]`,
                `[${interactableAttributePrefix}-resizable]`,
            ])

            const containerElement = getElement(container) || getParentElement(element, [
                `[${interactableAttributePrefix}-container]`,
            ]) || getParentElement(element)

            // log('interactable:mousedown:element', element, actionElement)

            if (!element) {
                return
            }

            const isCurrentElement = Boolean(actionElement && actionElement.matches([
                `[${interactableAttributePrefix}-id="${interactableID}"]`,
                `[${interactableAttributePrefix}-id="${interactableID}"] *`,
            ].join(', ')))

            if (!isCurrentElement) {
                return
            }

            originalEvent.preventDefault()

            const currentPointStart = getPointerEventsPointDetails(event, element, containerElement)

            setPointStart(currentPointStart)

            let isResizeAction = false
            let isDragAction = false

            if (resizable) {
                const resizableElement = getParentElement(target, `[${interactableAttributePrefix}-resizable]`, {includeSelf: true})
                const resizableHandleElement = getParentElement(target, `[${interactableAttributePrefix}-resizable-handle]`, {includeSelf: true})
                const resizableHandleData = resizableHandleElement && resizableHandleElement.dataset && {
                    type: resizableHandleElement.dataset.interactableResizableHandleType,
                    direction: resizableHandleElement.dataset.interactableResizableHandleDirection,
                }

                isResizeAction = Boolean(resizableElement && resizableHandleElement)

                if (isResizeAction) {
                    log('interactable:resizable:start', interactableID)

                    document.body.setAttribute(`${interactableAttributePrefix}-resizing`, interactableID)

                    resizableElement.setAttribute(`${interactableAttributePrefix}-resizing`, '')

                    setInteractableType('resize')
                    setInteractableElement(resizableElement)
                    setInteractableHandleElement(resizableHandleElement)
                    setInteractableHandleData(resizableHandleData)

                    onResizeStart({
                        position,
                        size,

                        pointStart: currentPointStart,
                    })
                }
            }

            if (draggable && !isResizeAction) {
                const draggableElement = getParentElement(target, `[${interactableAttributePrefix}-draggable]`, {includeSelf: true})
                const draggableHandleElement = (
                    getParentElement(target, `[${interactableAttributePrefix}-draggable-handle]`, {includeSelf: true}) ||
                    getParentElement(target, `[${interactableAttributePrefix}-resizable]`, {includeSelf: true})
                ) || draggableElement
                const draggableHandleData = draggableHandleElement && draggableHandleElement.dataset && {}

                isDragAction = Boolean(draggableElement && draggableHandleElement)

                if (isDragAction) {
                    log('interactable:draggable:start', interactableID)

                    document.body.setAttribute(`${interactableAttributePrefix}-dragging`, interactableID)

                    draggableElement.setAttribute(`${interactableAttributePrefix}-dragging`, '')
                    draggableElement.$interactableData = interactableData

                    setInteractableType('drag')
                    setInteractableElement(draggableElement)
                    setInteractableHandleElement(draggableHandleElement)
                    setInteractableHandleData(draggableHandleData)

                    onDragStart({
                        position,
                        size,

                        pointStart,
                    })
                }
            }

            if (droppable) {
                // n/a
            }
        })

        const _onMouseMove = (async (event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            const { target } = event

            if (target.matches(`[${interactableAttributePrefix}-ignore], [${interactableAttributePrefix}-ignore] *`)) {
                return
            }

            // log('interactable:mousemove', event)

            if (!globalPointerDown) {
                return
            }

            const isPointerStillDown = isPointerEventButton(event) // NOTE: sometimes `mouseup` event is not triggered

            if (!isPointerStillDown) {
                return _onMouseUp(event)
            }

            let isResizing = false
            let isDragging = false
            let isDropping = false

            if (droppable) {
                const dragElementID = document.body.getAttribute(`${interactableAttributePrefix}-dragging`)
                const dropElementID = interactableID

                const dragElement = (dragElementID && document.querySelector(`[${interactableAttributePrefix}-id="${dragElementID}"]`)) || null

                const dragContainerElement = dragElement && (
                    getParentElement(dragElement, [`${interactableAttributePrefix}-container`]) ||
                    getParentElement(dragElement)
                ) || null

                const droppableElements = (
                    dragContainerElement &&
                    dragContainerElement.querySelectorAll(`[${interactableAttributePrefix}-droppable]:not([${interactableAttributePrefix}-id="${dragElementID}"])`)
                ) || []

                const dropElement = getPointerEventElement(event, `[${interactableAttributePrefix}-id="${dropElementID}"]`)

                isDropping = Boolean(dragElement && dropElement)

                log('interactable:droppable:drop?', isDropping, dragElementID, '=>', dropElementID)

                for (const droppableElement of [...droppableElements]) {
                    const source = dragElement
                    const target = droppableElement

                    let result

                    // NOTE: `result` can be `<Object>` (success) or `<Error>` (failed accepting - with details)
                    try {
                        result = await interactableDroppableAccept({
                            source,
                            target,
                        })

                    } catch (error) {
                        result = error
                    }

                    const accept = !!result && !(result instanceof Error)

                    droppableElement.setAttribute(`${interactableAttributePrefix}-droppable-accept`, accept)
                }

                const _droppableElements = document.querySelectorAll(`[${interactableAttributePrefix}-droppable-accept], [${interactableAttributePrefix}-dropping-accept]`)

                if (_droppableElements) {
                    for (const droppableElement of [..._droppableElements]) {
                        droppableElement.removeAttribute(`${interactableAttributePrefix}-dropping`)
                        droppableElement.removeAttribute(`${interactableAttributePrefix}-dropping-accept`)
                    }
                }

                if (isDropping) {
                    const source = dragElement
                    const target = dropElement

                    let result

                    try {
                        result = await interactableDroppableAccept({
                            source,
                            target,
                        })

                    } catch (error) {
                        result = error
                    }

                    const accept = !!result && !(result instanceof Error)
                    const data = getObject(result, {})

                    document.body.setAttribute(`${interactableAttributePrefix}-dropping`, dropElementID)
                    document.body.setAttribute(`${interactableAttributePrefix}-dropping-accept`, accept)

                    dragContainerElement.setAttribute(`${interactableAttributePrefix}-dropping`, dropElementID)
                    dragContainerElement.setAttribute(`${interactableAttributePrefix}-dropping-accept`, accept)

                    dropElement.setAttribute(`${interactableAttributePrefix}-dropping`, '')
                    dropElement.setAttribute(`${interactableAttributePrefix}-dropping-accept`, accept)

                    log('interactable:droppable:drop:start', accept, data)

                    callback(onDropStart)({
                        source,
                        target,

                        accept,
                        data,
                    })
                }
            }

            const element = interactableElement

            const containerElement = getElement(container) || getParentElement(element, [
                `[${interactableAttributePrefix}-container]`,
            ]) || getParentElement(element)

            // log('interactable:mousemove:element', element)

            if (!element) {
                return
            }

            if (!containerElement) {
                return
            }

            originalEvent.preventDefault()

            const currentPoint = getPointerEventsPointDetails(event, element, containerElement)

            setPoint(currentPoint)

            const x = (pointStart.elementX - pointStart.containerX) + ((currentPoint.eventX - currentPoint.containerX) - (pointStart.eventX - pointStart.containerX))
            const y = (pointStart.elementY - pointStart.containerY) + ((currentPoint.eventY - currentPoint.containerY) - (pointStart.eventY - pointStart.containerY))

            const dx = x - position.x
            const dy = y - position.y

            if (resizable) {
                isResizing = Boolean(interactableType === 'resize')

                if (isResizing) {
                    log('interactable:resizable:drag', x, y)

                    const _position = getValidPosition(position)
                    const _size = getValidSize(size)

                    const direction = `${interactableHandleData.direction || ''}`

                    const isModifierPositionX = direction.includes('w')
                    const isModifierPositionY = direction.includes('n')

                    const isModifierSizeX = direction.includes('e')
                    const isModifierSizeY = direction.includes('s')

                    log('interactable:direction', interactableHandleData)

                    const w = pointStart.elementWidth + dx
                    const h = pointStart.elementHeight + dy

                    const dw = w - size.width
                    const dh = h - size.height

                    if (isModifierPositionX) {
                        _position.x += dx
                        _size.width += -dx
                    }

                    if (isModifierPositionY) {
                        _position.y += dy
                        _size.height += -dy
                    }

                    if (isModifierSizeX) {
                        _size.width += dw
                    }

                    if (isModifierSizeY) {
                        _size.height += dh
                    }

                    const container = {
                        width: currentPoint.containerWidth,
                        height: currentPoint.containerHeight,
                    }

                    const [constraintedPosition, constrainedSize] = getConstrainedPositionAndSize(_position, _size, container)

                    const resized = !!(dx + dy + dw + dh)

                    interactableRAF.current = withRAF(() => {
                        callback(onResize)({
                            position: constraintedPosition,
                            size: constrainedSize,

                            resized,

                            point: currentPoint,
                        })
                    }, interactableRAF.current)()
                }
            }

            if (draggable) {
                isDragging = Boolean(interactableType === 'drag')

                if (isDragging && !isResizing) {
                    log('interactable:draggable:drag', x, y)

                    const _position = getValidPosition(position)
                    const _size = getValidSize(size)

                    _position.x += dx
                    _position.y += dy

                    const container = {
                        width: currentPoint.containerWidth,
                        height: currentPoint.containerHeight,
                    }

                    const [constraintedPosition, constrainedSize] = getConstrainedPositionAndSize(_position, _size, container)

                    const dragged = !!(dx + dy)

                    interactableRAF.current = withRAF(() => {
                        onDrag({
                            position: constraintedPosition,
                            size: constrainedSize,

                            dragged,

                            point: currentPoint,
                        })
                    }, interactableRAF.current)()
                }
            }
        })

        const _onMouseUp = (async (event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            // log('interactable:mouseup')

            setGlobalPointerDown(false)

            const { target } = event

            if (target.matches(`[${interactableAttributePrefix}-ignore], [${interactableAttributePrefix}-ignore] *`)) {
                return
            }

            let isDropping = false

            if (droppable) {
                const dragElementID = document.body.getAttribute(`${interactableAttributePrefix}-dragging`)
                const dropElementID = document.body.getAttribute(`${interactableAttributePrefix}-dropping`)

                const dragElement = dragElementID && document.querySelector(`[${interactableAttributePrefix}-id="${dragElementID}"]`)
                const dropElement = dropElementID && document.querySelector(`[${interactableAttributePrefix}-id="${dropElementID}"]`)

                const droppedElements = document.querySelectorAll(`[${interactableAttributePrefix}-dropping-accept]`)

                if (droppedElements) {
                    for (const droppedElement of [...droppedElements]) {
                        droppedElement.removeAttribute(`${interactableAttributePrefix}-dropping-accept`)
                    }
                }

                const isCurrentDroppable = Boolean(interactableID === dropElementID)

                isDropping = Boolean(dragElement && dropElement && isCurrentDroppable)

                log('interactable:droppable?', isDropping, dragElementID, '=>', dropElementID)

                let accept = false
                let data = null

                const source = dragElement
                const target = dropElement

                if (isDropping) {
                    let result

                    try {
                        result = await interactableDroppableAccept({
                            source,
                            target,
                        })

                    } catch (error) {
                        result = error
                    }

                    accept = !!result && !(result instanceof Error)
                    data = getObject(result, {})

                    log('interactable:droppable:drop:accept?', accept, data, dragElementID, '=>', dropElementID)

                    if (accept) {
                        log('interactable:droppable:drop', accept, data)

                        callback(onDrop)({
                            source,
                            target,

                            accept,
                            data,
                        })
                    }
                }

                log('interactable:droppable:drop:stop', accept, data)

                callback(onDropStop)({
                    source,
                    target,

                    accept,
                    data,
                })

                const droppableElements = document.querySelectorAll([
                    `[${interactableAttributePrefix}-droppable-accept]`,
                    `[${interactableAttributePrefix}-dropping-accept]`,
                ].join(', '))

                if (droppableElements) {
                    for (const droppableElement of [...droppableElements]) {
                        droppableElement.removeAttribute(`${interactableAttributePrefix}-dropping`)
                        droppableElement.removeAttribute(`${interactableAttributePrefix}-dropping-accept`)

                        droppableElement.removeAttribute(`${interactableAttributePrefix}-droppable-accept`)
                    }
                }
            }

            if (resizable) {
                const resizableElements = document.querySelectorAll(`[${interactableAttributePrefix}-resizable]`)

                if (resizableElements) {
                    for (const resizableElement of [...resizableElements]) {
                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizing`)
                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizing-accept`)

                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizable-accept`)
                    }
                }
            }

            if (draggable) {
                const draggableElements = document.querySelectorAll(`[${interactableAttributePrefix}-draggable]`)

                if (draggableElements) {
                    for (const draggableElement of [...draggableElements]) {
                        draggableElement.removeAttribute(`${interactableAttributePrefix}-dragging`)
                        draggableElement.removeAttribute(`${interactableAttributePrefix}-dragging-accept`)

                        draggableElement.removeAttribute(`${interactableAttributePrefix}-draggable-accept`)
                    }
                }
            }

            const element = interactableElement

            const containerElement = getElement(container) || getParentElement(element, [
                `[${interactableAttributePrefix}-container]`,
            ]) || getParentElement(element)

            // log('interactable:mouseup:element', element)

            setInteractableType(null)
            setInteractableElement(null)
            setInteractableHandleElement(null)
            setInteractableHandleData(null)

            // NOTE: ensure executed in next event loop, to avoid race condition between interactable element event handlers
            setTimeout(() => {
                document.body.removeAttribute(`${interactableAttributePrefix}-dragging`)
                document.body.removeAttribute(`${interactableAttributePrefix}-dropping`)
                document.body.removeAttribute(`${interactableAttributePrefix}-resizing`)

                if (interactableElement) {
                    interactableElement.removeAttribute(`${interactableAttributePrefix}-dragging`)
                    interactableElement.removeAttribute(`${interactableAttributePrefix}-dropping`)
                    interactableElement.removeAttribute(`${interactableAttributePrefix}-resizing`)

                    interactableElement.removeAttribute(`${interactableAttributePrefix}-droppable-accept`)
                }
            }, 0)

            if (!element) {
                return
            }

            if (element !== node) {
                return
            }

            originalEvent.preventDefault()

            const currentPointEnd = getPointerEventsPointDetails(event, element, containerElement)

            setPointEnd(currentPointEnd)

            if (resizable) {
                const isResizing = Boolean(interactableType === 'resize')

                if (isResizing) {
                    log('interactable:resizable:end')

                    onResizeStop({
                        position,
                        size,

                        pointEnd: currentPointEnd,
                    })
                }

                const resizableElements = document.querySelectorAll(`[${interactableAttributePrefix}-resizable]`)

                if (resizableElements) {
                    for (const resizableElement of [...resizableElements]) {
                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizable-accept`)

                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizing`)
                        resizableElement.removeAttribute(`${interactableAttributePrefix}-resizing-accept`)
                    }
                }
            }

            if (draggable) {
                const isDragging = Boolean(interactableType === 'drag')

                if (isDragging) {
                    log('interactable:draggable:end')

                    onDragStop({
                        position,
                        size,

                        pointEnd: currentPointEnd,
                    })
                }

                const draggableElements = document.querySelectorAll(`[${interactableAttributePrefix}-draggable]`)

                if (draggableElements) {
                    for (const draggableElement of [...draggableElements]) {
                        draggableElement.removeAttribute(`${interactableAttributePrefix}-draggable-accept`)

                        draggableElement.removeAttribute(`${interactableAttributePrefix}-dragging`)
                        draggableElement.removeAttribute(`${interactableAttributePrefix}-dragging-accept`)
                    }
                }
            }
        })

        document.addEventListener('mousedown', _onMouseDown, false)
        document.addEventListener('mousemove', _onMouseMove, false)
        document.addEventListener('mouseup', _onMouseUp, false)

        document.addEventListener('touchstart', _onMouseDown, false)
        document.addEventListener('touchmove', _onMouseMove, false)
        document.addEventListener('touchend', _onMouseUp, false)

        return () => {
            document.removeEventListener('mousedown', _onMouseDown)
            document.removeEventListener('mousemove', _onMouseMove)
            document.removeEventListener('mouseup', _onMouseUp)

            document.removeEventListener('touchstart', _onMouseDown)
            document.removeEventListener('touchmove', _onMouseMove)
            document.removeEventListener('touchend', _onMouseUp)
            document.removeEventListener('touchcancel', _onMouseUp)
        }
    }, [
        $node,

        native,

        interactableID,
        interactableData,
        interactableDroppableAccept,

        draggable,
        resizable,
        droppable,

        position,
        size,

        globalPointerDown,

        setGlobalPointerDown,

        interactableAttributePrefix,

        interactableType,
        interactableElement,
        interactableHandleElement,
        interactableHandleData,
        interactablePosition,
        interactableSize,

        setInteractableType,
        setInteractableElement,
        setInteractableHandleElement,
        setInteractableHandleData,
        setInteractablePosition,
        setInteractableSize,

        pointStart,
        point,
        pointEnd,

        setPointStart,
        setPoint,
        setPointEnd,

        interactableRAF,

        onDrag,
        onDragStart,
        onDragStop,

        onResize,
        onResizeStart,
        onResizeStop,

        onDrop,
        onDropStart,
        onDropStop,
    ])

    return {
        $node,

        draggable,
        resizable,

        position,
        size,

        dragging,
        dropping,
        resizing,

        globalPointerDown,

        setGlobalPointerDown,

        interactableAttributePrefix,

        interactableType,
        interactableElement,
        interactableHandleElement,
        interactableHandleData,

        setInteractableType,
        setInteractableElement,
        setInteractableHandleElement,
        setInteractableHandleData,

        pointStart,
        point,
        pointEnd,

        setPointStart,
        setPoint,
        setPointEnd,

        interactableRAF,

        onDrag,
        onDragStart,
        onDragStop,

        onResize,
        onResizeStart,
        onResizeStop,
    }
}


/* =========================================
      EXPORTS
-------------------------------------- */

export default useInteractable
