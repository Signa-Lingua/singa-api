export type Meta = {
  code: number
  status: string
  message: string
}

export type ResponseFormatter<T> = {
  meta: Meta
  data?: T
}

function responseFormatter<T>(
  code: number,
  status: string,
  message: string,
  data?: T
): ResponseFormatter<T> {
  return {
    meta: {
      code,
      status,
      message,
    },
    data: data,
  }
}

export default responseFormatter
