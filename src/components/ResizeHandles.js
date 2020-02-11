
/* =========================================
      IMPORTS
-------------------------------------- */

import React, { useCallback } from 'react'
import classnames from 'classnames'
// import debug from 'debug'


/* =========================================
      LOGGER
-------------------------------------- */

// const log = debug('react-modifiable:components:ResizeHandles')


/* =========================================
      COMPONENTS
-------------------------------------- */

const ResizeHandles = (props = {}) => {
    let {
        modifiableAttributePrefix,
        modifiableHandleData,
    } = props

    const currentHandleData = modifiableHandleData || {}

    const currentResizeType = currentHandleData.type
    const currentResizeDirection = currentHandleData.direction

    const ModifiableResizeHandle = useCallback((props) => {
        const {
            className,

            type,
            direction,

            active,
        } = props

        return (
            <div
                className={classnames('ModifiableResizeHandle', className, type, direction, {active})}

                {
                   ...{
                        [`${modifiableAttributePrefix}-resizable-handle`]: '',
                        [`${modifiableAttributePrefix}-resizable-handle-type`]: type,
                        [`${modifiableAttributePrefix}-resizable-handle-direction`]: direction,
                    }
                }
            />
        )
    }, [
        modifiableAttributePrefix,
    ])

    const edgeDirections = ['w', 'n', 'e', 's']
    const cornerDirections = ['nw', 'ne', 'sw', 'se']

    return (
        <div
            className={classnames('ModifiableResizeHandles')}

            data-current-type={currentResizeType}
            data-current-direction={currentResizeDirection}
        >
            <div className={classnames('ModifiableResizeHandles-edges')}>
                {
                    edgeDirections.map((direction) => {
                        const active = Boolean(currentResizeDirection === direction)

                        return (
                            <ModifiableResizeHandle
                                key={`ModifiableResizeHandle-edge-${direction}`}
                                type={`edge`}
                                direction={direction}
                                active={active}
                            />
                        )
                    })
                }
            </div>

            <div className={classnames('ModifiableResizeHandles-corners')}>
                {
                    cornerDirections.map((direction) => {
                        const active = Boolean(currentResizeDirection === direction)

                        return (
                            <ModifiableResizeHandle
                                key={`ModifiableResizeHandle-corner-${direction}`}
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
