interface JqlRes<T> {
  data: T
  dataType: string
  message: string
  responseType: string
  statusCode: number
}

interface JqlQuery {
  action: string
  query: {
    [key: any]: any
  }
}
