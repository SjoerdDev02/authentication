import { proxy } from 'valtio';

type modalStoreType = {
    otc: boolean;
};

const modalStore: modalStoreType = proxy({
	otc: false
});

export default modalStore;