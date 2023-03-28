import { OPEN_CHAT } from "../Constants/ActionStates"

export const OpenChat = (state)=>{
    return {
        type: OPEN_CHAT,
        state
    }
}