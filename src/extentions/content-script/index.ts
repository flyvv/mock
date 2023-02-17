import { init } from './libs'

{
	init()
	chrome.storage.onChanged.addListener((changes, namespace) => {
		for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
			switch (key) {
				case 'config':
				case 'currentPageInfo':
				default:
					console.log(oldValue, newValue)
					break
			}
		}
	})
}
