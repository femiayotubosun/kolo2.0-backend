type CreateCustomerReturnType =
  | {
      infrastructureResults: Record<string, unknown>
      customerInformation: {
        customerCode: string
      }
    }
  | {
      infrastructureResults: null
      customerInformation: null
    }

export default CreateCustomerReturnType
