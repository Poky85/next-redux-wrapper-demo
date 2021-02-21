# Example Next.js app using [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper) and [next-i18next](https://github.com/isaachinman/next-i18next)

App reproduces problem with composing `next-redux-wrapper@7.0.0-rc.1` with another Next.js HOC (here I am using `next-i18next:@7.0.1`) but similar problem can occur when composing `next-redux-wrapper` with many other Next's _app HOCs.

## Bug description

In `next-redux-wrapper@7.0.0-rc.1` I noticed that shape of `next-redux-wrapper`'s `App.getInitialProps` is not compatible with Next's `AppInitialProps`.

```typescript
type AppInitialProps = {
    pageProps: any;
}
```

This is what`next-redux-wrapper`'s `App.getInitialProps` returns (see the code [here](https://github.com/kirill-konshin/next-redux-wrapper/blob/7.0.0-rc.1/packages/wrapper/src/index.tsx#L96) and [here](https://github.com/kirill-konshin/next-redux-wrapper/blob/7.0.0-rc.1/packages/wrapper/src/index.tsx#L81)).

```typescript
type WrapperProps = {
    initialProps: any;
    initialState: any;
}
```

`next-redux-wrapper` itself handles different shape of initial app props well [in the render() method](https://github.com/kirill-konshin/next-redux-wrapper/blob/7.0.0-rc.1/packages/wrapper/src/index.tsx#L190).

But fact that `App.getInitialProps` doesn't return `AppInitialProps`-compatible data makes `next-redux-wrapper` harder to coexist with different Next _app HOCs.

## To Reproduce

I created [Codesandbox reproducing the problem](https://codesandbox.io/s/github/Poky85/next-redux-wrapper-demo). In the example I use composition with [next-i18next](https://github.com/isaachinman/next-i18next). This package expects that `App.getInitialProps()` returns `Promise<{ pageProps }>` for its own functionality. It breaks because `pageProps` are missing as `next-redux-wrapper` returns `Promise<WrapperProps>`.

## Expected behavior

I don't think this is problem of [next-i18next](https://github.com/isaachinman/next-i18next) lib. I expect that every `App.getInitialProps` component follows the interface:

```typescript
function appGetInitialProp(appCtx: AppContext): Promise<AppInitialProps>
```

[I hotfixed the problem in another Codesandbox](https://codesandbox.io/s/1vn8f?file=/src/components/store.tsx) – there I recompose initial props by redefining `wrapper.getInitialAppProps()`.

Proposal: **`next-redux-wrapper` should compose initial props in `getInitialAppProps` in this way**

```typescript
const getInitialAppProps = <P extends {} = any>(callback: AppCallback<S, P>): GetInitialAppProps<P> => async (
  context: AppContext,
) => {
    const { initialProps, ...props } = (await makeProps({callback, context})) as WrapperProps & AppInitialProps; // this is just to convince TS
    return {
        ...initialProps,
        ...props,
    }
}
```

