
/* =========================================
      IMPORTS
-------------------------------------- */

import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
// import debug from 'debug'

import {
    getBoolean,
} from '../utils'


/* =========================================
      LOGGER
-------------------------------------- */

// const log = debug('react-interactable:components:Inspector')


/* =========================================
      COMPONENTS
-------------------------------------- */

const Inspector = (props = {}) => {
    let {
        enabled,

        labelStyle,

        pointStart,
        point,
        pointEnd,
    } = props

    enabled = getBoolean(enabled, true)

    labelStyle = {
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
        pointerEvents: 'none',
        ...labelStyle,
    }

    const _pointStart = pointStart || {}
    const _point = point || {}
    const _pointEnd = pointEnd || {}

    const InteractableInspectorDeltaPointer = (props) => {
        let {
            name,
            point,
            eventColor,
            elementColor,
            style,
        } = props

        eventColor = eventColor || 'cyan'
        elementColor = elementColor || 'magenta'

        point = point || {}

        const eventTransform = (_pointStart.eventX && _pointStart.eventY) && `translate(${point.eventX}px, ${point.eventY}px)`
        const elementTransform = (_pointStart.elementX && _pointStart.elementY) && `translate(${point.elementX}px, ${point.elementY}px)`

        return (
            <div className={classnames('InteractableInspector-start')}>
                {
                    eventTransform && ReactDOM.createPortal((
                        <span
                            className={classnames(`InteractableInspector-start-event`)}
                            style={{
                                background: eventColor,
                                ...style,

                                transform: eventTransform,
                            }}
                        >
                            { `event:${name}` }
                        </span>
                    ), document.body)
                }

                {
                    elementTransform && ReactDOM.createPortal((
                        <span
                            className={classnames(`InteractableInspector-start-element`)}
                            style={{
                                background: elementColor,
                                ...style,

                                transform: elementTransform,
                            }}
                        >
                            { `element:${name}` }
                        </span>
                    ), document.body)
                }
            </div>
        )
    }

    return (
        <div className={classnames('InteractableInspector')}>
            {
                enabled && (
                    <InteractableInspectorDeltaPointer
                        name={`start`}

                        point={_pointStart}

                        eventColor={'brown'}
                        elementColor={'magenta'}

                        style={labelStyle}
                    />
                )
            }

            {
                enabled && (
                    <InteractableInspectorDeltaPointer
                        name={`move`}

                        point={_point}

                        eventColor={'brown'}
                        elementColor={'magenta'}

                        style={labelStyle}
                    />
                )
            }

            {
                enabled && (
                    <InteractableInspectorDeltaPointer
                        name={`end`}

                        point={_pointEnd}

                        eventColor={'brown'}
                        elementColor={'magenta'}

                        style={labelStyle}
                    />
                )
            }
        </div>
    )
}

/* =========================================
      EXPORTS
-------------------------------------- */

export default Inspector
