// filepath: src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;