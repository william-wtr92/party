import {
  tokenExpired,
  tokenInvalidStructure,
  tokenSignatureMismatched,
} from "@server/features/auth"

import { SC } from "../status"
import { throwInternalErrors } from "./throwInternalErrors"

export const jwtTokenErrors = <T>(err: T) => {
  if (err instanceof Error && err.name === "JwtTokenSignatureMismatched") {
    throw throwInternalErrors(tokenSignatureMismatched, SC.errors.UNAUTHORIZED)
  } else if (err instanceof Error && err.name === "JwtTokenInvalid") {
    throw throwInternalErrors(tokenInvalidStructure, SC.errors.UNAUTHORIZED)
  } else if (err instanceof Error && err.name === "JwtTokenExpired") {
    throw throwInternalErrors(tokenExpired, SC.errors.UNAUTHORIZED)
  }

  throw throwInternalErrors(tokenExpired, SC.serverErrors.INTERNAL_SERVER_ERROR)
}
