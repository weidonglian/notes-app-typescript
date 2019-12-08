import { AppState } from '../reducers';
import { MessageState } from '../reducers/message';

export const getMessageState = (state: AppState): MessageState => state.message
