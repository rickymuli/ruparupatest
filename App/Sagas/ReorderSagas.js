import ReorderActions, { ReorderTypes } from '../Redux/ReorderRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'

export function * getInvoiceConfirmation (api) {
  yield baseListen(ReorderTypes.REORDER_INVOICE_REQUEST,
    fetchInvoiceConfirmationAPI,
    api)
}

export function * fetchInvoiceConfirmationAPI (api, { data }) {
  yield baseFetchNoToken(api.getInvoiceConfirmation,
    data,
    ReorderActions.reorderInvoiceSuccess,
    ReorderActions.reorderInvoiceFailure)
}

export function * customerConfirmation (api) {
  yield baseListen(ReorderTypes.CONFIRMATION_REQUEST,
    fetchCustomerConfirmationAPI,
    api)
}

export function * fetchCustomerConfirmationAPI (api, { data }) {
  yield baseFetchNoToken(api.customerConfirmation,
    data,
    ReorderActions.confirmationSuccess,
    ReorderActions.confirmationFailure)
}

export function * deliveryConfirmation (api) {
  yield baseListen(ReorderTypes.CONFIRMATION_DELIVERY_REQUEST,
    fetchDeliveryConfirmationAPI,
    api
  )
}

export function * fetchDeliveryConfirmationAPI (api, { data }) {
  yield baseFetchNoToken(api.deliveryConfirmation,
    data,
    ReorderActions.confirmationDeliverySuccess,
    ReorderActions.confirmationDeliveryFailure)
}
