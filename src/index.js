
/* =========================================
      IMPORTS
-------------------------------------- */

import _useInteractable from './hooks/useInteractable'

import _Inspector from './components/Inspector'
import _ResizeHandles from './components/ResizeHandles'


/* =========================================
      EXPORTS
-------------------------------------- */

export const useInteractable = _useInteractable

export const Inspector = _Inspector
export const InteractableInspector = _Inspector

export const ResizeHandles = _ResizeHandles
export const InteractableResizeHandles = _ResizeHandles

export default {
    useInteractable,

    Inspector,
    InteractableInspector,

    ResizeHandles,
    InteractableResizeHandles,
}
