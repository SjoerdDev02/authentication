import { proxy } from 'valtio';

type ModalStoreType = {
    otc: boolean;
};

const modalStore: ModalStoreType = proxy({
	otc: false
});

export default modalStore;