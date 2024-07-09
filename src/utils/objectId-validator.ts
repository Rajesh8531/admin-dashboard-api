import { IncomingMessage } from "http"

export function isValidId (id:string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
       return true   
    } 
    return false
}

export interface CustomIncomingMessage extends IncomingMessage {
    rawBody : any
}