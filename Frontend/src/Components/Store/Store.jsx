import {configureStore} from '@reduxjs/toolkit'
import TodoCounterSlice from '../TodoCounterSlice/TodoCounterSlice';
export const Store=configureStore({
    reducer:{
        Data:TodoCounterSlice,
    },
})