
/* =========================================
      IMPORTS
-------------------------------------- */

import React, { useCallback } from 'react'
import classnames from 'classnames'
// import debug from 'debug'


/* =========================================
      LOGGER
-------------------------------------- */

// const log = debug('react-interactable:components:ResizeHandles')


/* =========================================
      COMPONENTS
-------------------------------------- */

const ResizeHandles = (props = {}) => {
    let {
        interactableAttributePrefix,
        interactableHandleData,
    } = props

    const currentHandleData = interactableHandleData || {}

    const currentResizeType = currentHandleData.type
    const currentResizeDirection = currentHandleData.direction

    const InteractableResizeHandle = useCallback((props) => {
        const {
            className,

            type,
            direction,

            active,
        } = props

        return (
            <div
                className={classnames('InteractableResizeHandle', className, type, direction, {active})}

                {
                   ...{
                        [`${interactableAttributePrefix}-resizable-handle`]: '',
                        [`${interactableAttributePrefix}-resizable-handle-type`]: type,
                        [`${interactableAttributePrefix}-resizable-handle-direction`]: direction,
                    }
                }
            />
        )
    }, [
        interactableAttributePrefix,
    ])

    const edgeDirections = ['w', 'n', 'e', 's']
    const cornerDirections = ['nw', 'ne', 'sw', 'se']

    return (
        <div
            className={classnames('InteractableResizeHandles')}

            data-current-type={currentResizeType}
            data-current-direction={currentResizeDirection}
        >
            <div className={classnames('InteractableResizeHandles-edges')}>
                {
                    edgeDirections.map((direction) => {
                        const active = Boolean(currentResizeDirection === direction)

                        return (
                            <InteractableResizeHandle
                                key={`InteractableResizeHandle-edge-${direction}`}
                                type={`edge`}
                                direction={direction}
                                active={active}
                            />
                        )
                    })
                }
            </div>

            <div className={classnames('InteractableResizeHandles-corners')}>
                {
                    cornerDirections.map((direction) => {
                        const active = Boolean(currentResizeDirection === direction)

                        return (
                            <InteractableResizeHandle
                                key={`InteractableResizeHandle-corner-${direction}`}
                                type={`corner`}
                                direction={direction}
                                active={active}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}


/* =========================================
      EXPORTS
-------------------------------------- */

export default ResizeHandles
