import { OPEN_CHAT } from "../Constants/ActionStates";

const MessageReducer = (state = [], action) => {
    switch (action.type) {
        case OPEN_CHAT:
            console.log("In red openchat :",action.state)
            return {...state}
    }
}