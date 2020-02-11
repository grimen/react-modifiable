
/* =========================================
      IMPORTS
-------------------------------------- */

import _useModifiable from './hooks/useModifiable'

import _Inspector from './components/Inspector'
import _ResizeHandles from './components/ResizeHandles'


/* =========================================
      EXPORTS
-------------------------------------- */

export const useModifiable = _useModifiable

export const Inspector = _Inspector
export const ModifiableInspector = _Inspector

export const ResizeHandles = _ResizeHandles
export const ModifiableResizeHandles = _ResizeHandles

export default {
    useModifiable,

    Inspector,
    ModifiableInspector,

    ResizeHandles,
    ModifiableResizeHandles,
}
