export function RESOURCE_FETCHED_SUCCESSFULLY(resourceName = 'Resource') {
  return `Fetched ${resourceName} successfully`
}

export function RESOURCE_NOT_FOUND(resourceName = 'Resource') {
  return `${resourceName} Was not found`
}

export function RESOURCE_LIST_FETCHED_SUCCESSFULLY(resourceName = 'Resource') {
  return `Fetched ${resourceName} list successfully`
}

export function RESOURCE_LIST_FETCH_FAILED(resourceName = 'Resource') {
  return `Unable To Fetch ${resourceName} list`
}

export function OPERATION_SUCCESSFUL(operationName = 'Operation') {
  return `${operationName} Successful`
}

export function OPERATION_FAIL(operationName = 'Operation') {
  return `${operationName} Failed`
}
