import { startMock } from './startMock'

export const handleConfigChange = (
	newConfig: IConfigType,
	oldConfig: IConfigType
) => {
	if (newConfig.isOpen !== oldConfig.isOpen) {
		if (!newConfig.isOpen) {
			window.location.reload()
			return
		}
		startMock()
		return
	}
	
	if (newConfig.reload !== oldConfig.reload) window.location.reload()
	// try {
	// 	const bridgeDiv: any = document.getElementById('extension')
	// 	bridgeDiv.innerText = JSON.stringify(newConfig)
	// } catch (e) {
	// 	console.warn('解析pageMockConfig出错了围', e)
	// }
}
