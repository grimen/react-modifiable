
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

const _log = debug('react-modifiable:hooks:useModifiable')


/* =========================================
      HOOKS
-------------------------------------- */

const useModifiable = ($node, props = {}) => {
    let {
        log,
        id,

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

        onDrop,
        onDropStart,
        onDropStop,
    } = props

    const modifiableAttributePrefix = attributePrefix || 'data-modifiable'

    const modifiableData = data

    const modifiableIDGenerator = getFunction(id, (node, props = {}) => {
        useModifiable.instanceID = useModifiable.instanceID || 1

        return id || (node && node.getAttribute(`${modifiableAttributePrefix}-id`)) || useModifiable.instanceID++
    })

    const modifiableDroppableAccept = getFunction(droppable, ({source, target}) => {
        return {
            source,
            target,
        }
    })

    const node = $node.current
    const modifiableID = modifiableIDGenerator(node, props)

    if (log === undefined) {
        log = (...args) => {
            return _log(`${modifiableID}`, ...args)
        }
    }

    const modifiableRAF = useRef(null)

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

    const [modifiableType, setModifiableType] = useState(null)
    const [modifiableElement, setModifiableElement] = useState(null)
    const [modifiableHandleElement, setModifiableHandleElement] = useState(null)
    const [modifiableHandleData, setModifiableHandleData] = useState({})
    const [modifiablePosition, setModifiablePosition] = useState({})
    const [modifiableSize, setModifiableSize] = useState({})

    const dragging = Boolean(modifiableType === 'drag')
    const dropping = Boolean(modifiableType === 'drop')
    const resizing = Boolean(modifiableType === 'resize')

    // NOTE: not reliable for drag positions
    const native = false

    useEffect(() => {
        const node = $node.current

        if (!node) {
            return
        }

        node.setAttribute(`${modifiableAttributePrefix}-id`, modifiableID)

        if (draggable) {
            node.setAttribute(`${modifiableAttributePrefix}-draggable`, '')
        }

        if (droppable) {
            node.setAttribute(`${modifiableAttributePrefix}-droppable`, '')
        }

        if (resizable) {
            node.setAttribute(`${modifiableAttributePrefix}-resizable`, '')
        }

        const _onMouseDown = ((event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            // log('modifiable:mousedown', event)

            setGlobalPointerDown(true)

            const { target } = event

            if (target.matches(`[${modifiableAttributePrefix}-ignore], [${modifiableAttributePrefix}-ignore] *`)) {
                return
            }

            const actionElement = getParentElement(target, [
                `[${modifiableAttributePrefix}-draggable-handle]`,
                `[${modifiableAttributePrefix}-resizable-handle]`,
            ], {includeSelf: true}) || getParentElement(target, [
                `[${modifiableAttributePrefix}-draggable]`,
                `[${modifiableAttributePrefix}-resizable]`,
            ], {includeSelf: true})

            const element = getParentElement(actionElement, [
                `[${modifiableAttributePrefix}-draggable]`,
                `[${modifiableAttributePrefix}-resizable]`,
            ], {includeSelf: true}) || getPointerEventElement(target, [
                `[${modifiableAttributePrefix}-draggable]`,
                `[${modifiableAttributePrefix}-resizable]`,
            ])

            const containerElement = getParentElement(element, [
                `[${modifiableAttributePrefix}-container]`,
            ]) || getParentElement(element)

            log('modifiable:mousemove:element', element, actionElement)

            if (!element) {
                return
            }

            const isCurrentElement = Boolean(actionElement && actionElement.matches([
                `[${modifiableAttributePrefix}-id="${modifiableID}"]`,
                `[${modifiableAttributePrefix}-id="${modifiableID}"] *`,
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
                const resizableElement = getParentElement(target, `[${modifiableAttributePrefix}-resizable]`, {includeSelf: true})
                const resizableHandleElement = getParentElement(target, `[${modifiableAttributePrefix}-resizable-handle]`, {includeSelf: true})
                const resizableHandleData = resizableHandleElement && resizableHandleElement.dataset && {
                    type: resizableHandleElement.dataset.modifiableResizableHandleType,
                    direction: resizableHandleElement.dataset.modifiableResizableHandleDirection,
                }

                isResizeAction = Boolean(resizableElement && resizableHandleElement)

                if (isResizeAction) {
                    log('modifiable:resizable:start', modifiableID)

                    document.body.setAttribute(`${modifiableAttributePrefix}-resizing`, modifiableID)

                    setModifiableType('resize')
                    setModifiableElement(resizableElement)
                    setModifiableHandleElement(resizableHandleElement)
                    setModifiableHandleData(resizableHandleData)

                    onResizeStart({
                        position,
                        size,

                        pointStart: currentPointStart,
                    })
                }
            }

            if (draggable && !isResizeAction) {
                const draggableElement = getParentElement(target, `[${modifiableAttributePrefix}-draggable]`, {includeSelf: true})
                const draggableHandleElement = (
                    getParentElement(target, `[${modifiableAttributePrefix}-draggable-handle]`, {includeSelf: true}) ||
                    getParentElement(target, `[${modifiableAttributePrefix}-resizable]`, {includeSelf: true})
                )
                const draggableHandleData = draggableHandleElement && draggableHandleElement.dataset && {}

                isDragAction = Boolean(draggableElement && draggableHandleElement)

                if (isDragAction) {
                    log('modifiable:draggable:start', modifiableID)

                    document.body.setAttribute(`${modifiableAttributePrefix}-dragging`, modifiableID)

                    draggableElement.$modifiableData = modifiableData

                    setModifiableType('drag')
                    setModifiableElement(draggableElement)
                    setModifiableHandleElement(draggableHandleElement)
                    setModifiableHandleData(draggableHandleData)

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

        const _onMouseMove = ((event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            const { target } = event

            if (target.matches(`[${modifiableAttributePrefix}-ignore], [${modifiableAttributePrefix}-ignore] *`)) {
                return
            }

            // log('modifiable:mousemove', event)

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

            // log('modifiable:mousemove:element', element)

            if (droppable) {
                const dragElementID = document.body.getAttribute(`${modifiableAttributePrefix}-dragging`)
                // const dropElementID = document.body.getAttribute(`${modifiableAttributePrefix}-dropping`)

                const dragElement = (dragElementID && document.querySelector(`[${modifiableAttributePrefix}-id="${dragElementID}"]`)) || null

                const dragContainerElement = dragElement && (
                    getParentElement(dragElement, [`${modifiableAttributePrefix}-container`]) ||
                    getParentElement(dragElement)
                ) || null

                const droppableElements = (
                    dragContainerElement &&
                    dragContainerElement.querySelectorAll(`[${modifiableAttributePrefix}-droppable]:not([${modifiableAttributePrefix}-id="${dragElementID}"])`)
                ) || []

                const dropElement = getPointerEventElement(event, `[${modifiableAttributePrefix}-droppable]:not([${modifiableAttributePrefix}-id="${dragElementID}"])`)

                isDropping = Boolean(dragElement && dropElement)

                // log('modifiable:droppable:drop?', isDropping, dragElementID, '=>', dropElementID)

                for (const droppableElement of [...droppableElements]) {
                    // NOTE: `result` can be `<Object>` (success) or `<Error>` (failed accepting - with details)
                    const result = modifiableDroppableAccept({
                        source: dragElement,
                        target: droppableElement,
                    })

                    const accept = !!result

                    droppableElement.setAttribute(`${modifiableAttributePrefix}-droppable-accept`, accept)
                }

                const _droppableElements = document.querySelectorAll(`[${modifiableAttributePrefix}-droppable-accept], [${modifiableAttributePrefix}-dropping-accept]`)

                if (_droppableElements) {
                    for (const droppableElement of [..._droppableElements]) {
                        droppableElement.removeAttribute(`${modifiableAttributePrefix}-dropping`)
                        droppableElement.removeAttribute(`${modifiableAttributePrefix}-dropping-accept`)
                    }
                }

                if (isDropping) {
                    const result = modifiableDroppableAccept({
                        source: dragElement,
                        target: dropElement,
                    })

                    const accept = !!result
                    const data = getObject(result, {})

                    document.body.setAttribute(`${modifiableAttributePrefix}-dropping`, modifiableID)
                    document.body.setAttribute(`${modifiableAttributePrefix}-dropping-accept`, accept)

                    dragContainerElement.setAttribute(`${modifiableAttributePrefix}-dropping`, modifiableID)
                    dragContainerElement.setAttribute(`${modifiableAttributePrefix}-dropping-accept`, accept)

                    dropElement.setAttribute(`${modifiableAttributePrefix}-dropping`, '')
                    dropElement.setAttribute(`${modifiableAttributePrefix}-dropping-accept`, accept)

                    log('modifiable:droppable:drop:start', accept, data)

                    callback(onDropStart)({
                        accept,
                        data,
                    })

                }
            }

            const element = modifiableElement

            const containerElement = getParentElement(element, [
                `[${modifiableAttributePrefix}-container]`,
            ]) || getParentElement(element)

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

            const w = pointStart.elementWidth + dx
            const h = pointStart.elementHeight + dy

            const dw = w - size.width
            const dh = h - size.height

            if (resizable) {
                isResizing = Boolean(modifiableType === 'resize')

                if (isResizing) {
                    log('modifiable:resizable:drag', x, y)

                    const _position = getValidPosition(position)
                    const _size = getValidSize(size)

                    const direction = `${modifiableHandleData.direction || ''}`

                    const isModifierPositionX = direction.includes('w')
                    const isModifierPositionY = direction.includes('n')

                    const isModifierSizeX = direction.includes('e')
                    const isModifierSizeY = direction.includes('s')

                    log('modifiable:direction', modifiableHandleData)

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

                    modifiableRAF.current = withRAF(() => {
                        callback(onResize)({
                            position: constraintedPosition,
                            size: constrainedSize,

                            resized,

                            point: currentPoint,
                        })
                    }, modifiableRAF.current)()
                }
            }

            if (draggable) {
                isDragging = Boolean(modifiableType === 'drag')

                if (isDragging && !isResizing) {
                    log('modifiable:draggable:drag', x, y)

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

                    modifiableRAF.current = withRAF(() => {
                        onDrag({
                            position: constraintedPosition,
                            size: constrainedSize,

                            dragged,

                            point: currentPoint,
                        })
                    }, modifiableRAF.current)()
                }
            }
        })

        const _onMouseUp = ((event) => {
            const originalEvent = event

            event = getPointerEvent(event)

            log('modifiable:mouseup')

            setGlobalPointerDown(false)

            const { target } = event

            if (target.matches(`[${modifiableAttributePrefix}-ignore], [${modifiableAttributePrefix}-ignore] *`)) {
                return
            }

            let isDropping = false

            if (droppable) {
                const dragElementID = document.body.getAttribute(`${modifiableAttributePrefix}-dragging`)
                const dropElementID = document.body.getAttribute(`${modifiableAttributePrefix}-dropping`)

                const dragElement = dragElementID && document.querySelector(`[${modifiableAttributePrefix}-id="${dragElementID}"]`)
                const dropElement = dropElementID && document.querySelector(`[${modifiableAttributePrefix}-id="${dropElementID}"]`)

                document.body.removeAttribute(`${modifiableAttributePrefix}-dropping`)

                const droppedElements = document.querySelectorAll(`[${modifiableAttributePrefix}-dropping-accept]`)

                if (droppedElements) {
                    for (const droppedElement of [...droppedElements]) {
                        droppedElement.removeAttribute(`${modifiableAttributePrefix}-dropping-accept`)
                    }
                }

                isDropping = Boolean(dragElement && dropElement)

                log('modifiable:droppable:drop?', isDropping, dragElementID)

                if (isDropping) {
                    const result = modifiableDroppableAccept({
                        source: dragElement,
                        target: dropElement,
                    })

                    const accept = !!result
                    const data = getObject(result, {})

                    if (accept) {
                        log('modifiable:droppable:drop', accept, data)

                        callback(onDrop)({
                            accept,
                            data,
                        })
                    }

                    log('modifiable:droppable:drop:stop', accept, data)

                    callback(onDropStop)({
                        accept,
                        data,
                    })
                }

                const droppableElements = document.querySelectorAll([
                    `[${modifiableAttributePrefix}-droppable-accept]`,
                    `[${modifiableAttributePrefix}-dropping-accept]`,
                ].join(', '))

                if (droppableElements) {
                    for (const droppableElement of [...droppableElements]) {
                        droppableElement.removeAttribute(`${modifiableAttributePrefix}-dropping`)
                        droppableElement.removeAttribute(`${modifiableAttributePrefix}-dropping-accept`)

                        droppableElement.removeAttribute(`${modifiableAttributePrefix}-droppable-accept`)
                    }
                }
            }

            if (resizable) {
                const resizableElements = document.querySelectorAll(`[${modifiableAttributePrefix}-resizable]`)

                if (resizableElements) {
                    for (const resizableElement of [...resizableElements]) {
                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizing`)
                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizing-accept`)

                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizable-accept`)
                    }
                }
            }

            if (draggable) {
                const draggableElements = document.querySelectorAll(`[${modifiableAttributePrefix}-draggable]`)

                if (draggableElements) {
                    for (const draggableElement of [...draggableElements]) {
                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-dragging`)
                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-dragging-accept`)

                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-draggable-accept`)
                    }
                }
            }

            const element = modifiableElement

            const containerElement = getParentElement(element, [
                `[${modifiableAttributePrefix}-container]`,
            ]) || getParentElement(element)

            // log('modifiable:mouseup:element', element)

            setModifiableType(null)
            setModifiableElement(null)
            setModifiableHandleElement(null)
            setModifiableHandleData(null)

            document.body.removeAttribute(`${modifiableAttributePrefix}-dragging`)
            document.body.removeAttribute(`${modifiableAttributePrefix}-resizing`)
            document.body.removeAttribute(`${modifiableAttributePrefix}-dropping`)

            if (modifiableElement) {
                modifiableElement.removeAttribute(`${modifiableAttributePrefix}-dragging`)
                modifiableElement.removeAttribute(`${modifiableAttributePrefix}-resizing`)
                modifiableElement.removeAttribute(`${modifiableAttributePrefix}-dropping`)

                modifiableElement.removeAttribute(`${modifiableAttributePrefix}-droppable-accept`)
            }

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
                const isResizing = Boolean(modifiableType === 'resize')

                if (isResizing) {
                    log('modifiable:resizable:end')

                    onResizeStop({
                        position,
                        size,

                        pointEnd: currentPointEnd,
                    })
                }

                const resizableElements = document.querySelectorAll(`[${modifiableAttributePrefix}-resizable]`)

                if (resizableElements) {
                    for (const resizableElement of [...resizableElements]) {
                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizable-accept`)

                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizing`)
                        resizableElement.removeAttribute(`${modifiableAttributePrefix}-resizing-accept`)
                    }
                }
            }

            if (draggable) {
                const isDragging = Boolean(modifiableType === 'drag')

                if (isDragging) {
                    log('modifiable:draggable:end')

                    onDragStop({
                        position,
                        size,

                        pointEnd: currentPointEnd,
                    })
                }

                const draggableElements = document.querySelectorAll(`[${modifiableAttributePrefix}-draggable]`)

                if (draggableElements) {
                    for (const draggableElement of [...draggableElements]) {
                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-draggable-accept`)

                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-dragging`)
                        draggableElement.removeAttribute(`${modifiableAttributePrefix}-dragging-accept`)
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

        modifiableID,
        modifiableData,
        modifiableDroppableAccept,

        draggable,
        resizable,
        droppable,

        position,
        size,

        globalPointerDown,

        setGlobalPointerDown,

        modifiableAttributePrefix,

        modifiableType,
        modifiableElement,
        modifiableHandleElement,
        modifiableHandleData,
        modifiablePosition,
        modifiableSize,

        setModifiableType,
        setModifiableElement,
        setModifiableHandleElement,
        setModifiableHandleData,
        setModifiablePosition,
        setModifiableSize,

        pointStart,
        point,
        pointEnd,

        setPointStart,
        setPoint,
        setPointEnd,

        modifiableRAF,

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

        modifiableAttributePrefix,

        modifiableType,
        modifiableElement,
        modifiableHandleElement,
        modifiableHandleData,

        setModifiableType,
        setModifiableElement,
        setModifiableHandleElement,
        setModifiableHandleData,

        pointStart,
        point,
        pointEnd,

        setPointStart,
        setPoint,
        setPointEnd,

        modifiableRAF,

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

export default useModifiable
