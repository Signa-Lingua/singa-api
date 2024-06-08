export type PredictionResponse = {
  error: boolean
  message: string
  data: Datum[]
}

export type Datum = {
  text: string
  timestamp: string
}

export type PredictionValidationError = {
  detail: Detail[]
}

export type Detail = {
  type: string
  loc: string[]
  msg: string
  input: null
}
