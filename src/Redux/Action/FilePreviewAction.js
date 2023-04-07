import React from 'react'
import { OPEN_PREV } from '../Constants/ActionStates'

export const OpenPrev = (data)=>{
    return {
        type: OPEN_PREV,
        data
    }
}