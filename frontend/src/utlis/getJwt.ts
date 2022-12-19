import { getMeta } from './getMeta'

export const getJwt = function() {
  return getMeta('jwt')
}
