import { INIT_CONFIG, INIT_PAGES } from '../../../utils/constants'
import { startMock } from './startMock'

export const init = () =>
	chrome.storage.local.get().then(({ config, pages }) => {
		const initStorageData: IMockDataType = {}
		if (!config) initStorageData.config = INIT_CONFIG
		if (!pages) initStorageData.pages = INIT_PAGES
		if (Object.keys(initStorageData).length)
			chrome.storage.local.set(initStorageData)
		if (!config?.isOpen) return
		startMock()
	})
