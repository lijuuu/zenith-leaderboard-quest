
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { AppDispatch } from '@/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
