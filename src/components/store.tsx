import App, { AppContext, AppInitialProps } from "next/app"
import logger from 'redux-logger';
import {AppCallback, createWrapper, Context, WrapperProps} from 'next-redux-wrapper';
import {createStore, applyMiddleware, Store} from 'redux';
import reducer, {State} from './reducer';

type GetInitialAppProps<P> = typeof App['getInitialProps']


export const makeStore = (context: Context) => {
    const store = createStore(reducer, applyMiddleware(logger));

    if (module.hot) {
        module.hot.accept('./reducer', () => {
            console.log('Replacing reducer');
            store.replaceReducer(require('./reducer').default);
        });
    }

    return store;
};

const wrapper = createWrapper<Store<State>>(makeStore, {debug: true});

/**
 * Following fix is needed to make next-redux-wrapper work with other Next HOC
 */
/*const { getInitialAppProps } = wrapper
wrapper.getInitialAppProps = (callback: AppCallback<Store, WrapperProps>): GetInitialAppProps<WrapperProps> => {
    const nextCallback = getInitialAppProps<WrapperProps>(store => callback(store))

    return async (
      context: AppContext
    ): Promise<AppInitialProps & WrapperProps> => {
        const { initialProps, initialState } = await nextCallback(context) as WrapperProps
        // We spread initial props here so result props are compatible with `AppInitialProps` type
        return {
            ...initialProps,
            initialState,
        }
    }
};*/

export { wrapper }
