import { AppLoadContext } from "react-router"

// Internal types utils
type RouteLoaderOrAction = (...args: never[]) => Promise<unknown>
type RouteLoaderOrActionArgs = {
  request: Request
  params: Record<string, string | undefined>
  context: AppLoadContext
}

type RouteLoaderOrActionData<T extends RouteLoaderOrAction> =
  Exclude<Awaited<ReturnType<T>>, Response> extends { data: infer D }
    ? D
    : Exclude<Awaited<ReturnType<T>>, Response>

// External types utils
export type RouteLoaderArgs = RouteLoaderOrActionArgs
export type RouteActionArgs = RouteLoaderOrActionArgs

export type RouteLoader = RouteLoaderOrAction
export type RouteAction = RouteLoaderOrAction

export type RouteLoaderData<T extends RouteLoader> = RouteLoaderOrActionData<T>
export type RouteActionData<T extends RouteAction> = RouteLoaderOrActionData<T>

export type RouteComponentProps<
  T extends RouteLoaderOrAction | undefined = undefined,
  U extends RouteLoaderOrAction | undefined = undefined,
> = {
  params: Record<string, string | undefined>
  loaderData: T extends RouteLoader ? RouteLoaderData<T> : undefined
  actionData: U extends RouteAction ? RouteActionData<U> : undefined
}
