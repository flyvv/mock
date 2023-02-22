import { handleConfigChange, handleCurrentPageInfoChange, init } from './libs'

{
	init()
	chrome.storage.onChanged.addListener((changes, namespace) => {
		for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
			switch (key) {
				case 'config':
					handleConfigChange(oldValue, newValue)
					break
				case 'currentPageInfo':
					handleCurrentPageInfoChange(oldValue, newValue)
					break
				default:
					break
			}
		}
	})
}
