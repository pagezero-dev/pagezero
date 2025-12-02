import type { AppLoadContext } from "react-router"

// Internal types utils
type LoaderOrAction = (...args: never[]) => Promise<unknown>
type LoaderOrActionArgs = {
  request: Request
  params: Record<string, string | undefined>
  context: AppLoadContext
}

type LoaderOrActionData<T extends LoaderOrAction> =
  Exclude<Awaited<ReturnType<T>>, Response> extends { data: infer D }
    ? D
    : Exclude<Awaited<ReturnType<T>>, Response>

type Loader = LoaderOrAction
type Action = LoaderOrAction

type LoaderData<T extends Loader> = LoaderOrActionData<T>
type ActionData<T extends Action> = LoaderOrActionData<T>

// External types utils
export namespace Route {
  export type LoaderArgs = LoaderOrActionArgs
  export type ActionArgs = LoaderOrActionArgs

  export type ComponentProps<
    T extends Loader | undefined = undefined,
    U extends Action | undefined = undefined,
  > = {
    params: Record<string, string | undefined>
    loaderData: T extends Loader ? LoaderData<T> : undefined
    actionData: U extends Action ? ActionData<U> : undefined
  }
}
