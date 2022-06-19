import { getStorage } from '../Shared/LocalStorage';

export const isAuth = () => {
    if (getStorage('token') != null) {
        return true;
    }
    else {
        return false;
    }
}
