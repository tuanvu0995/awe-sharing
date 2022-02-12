import { toast } from 'react-toastify'

export const logger = (message, {useToast = false, ...data} = {}) => {
    console.log('LOG:', message, data)
    useToast && toast(message)
}