export const createMessageBridge = () => {
	let mockConfig: IConfigType
	try {
		mockConfig = JSON.parse(
			document.documentElement.dataset?.toolconfig || '{}'
		)
	} catch (e) {
		console.warn('解析document toolconfig出错', e)
	}

	const bridgeDiv = document.createElement('div')
	bridgeDiv.style.display = 'none'
	bridgeDiv.id = 'extension'
	document.body.append(bridgeDiv)

	const config = { childList: true }
	// const observer = new MutationObserver()
	const observer = new MutationObserver(() => {
		console.log('MutationObserver pagescript', bridgeDiv.innerText)
		try {
			mockConfig = JSON.parse(bridgeDiv.innerText)
		} catch (e) {
			console.warn('解析页面mock配置出错a', e)
		}
	})
	observer.observe(bridgeDiv, config)
	const getMockConfig = () => mockConfig
	const postPageMessage = (messageData) => {
    console.log(messageData,'messageData');
    
		try {
			bridgeDiv.dataset.message = JSON.stringify(messageData)
		} catch (e) {
			console.warn('解析postPageMessage出错:', e)
		}
	}
	return {
		getMockConfig,
		bridgeDiv,
		postPageMessage,
	}
}
