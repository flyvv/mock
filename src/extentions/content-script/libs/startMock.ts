const getMockConfigFromStorage = async () => {
	const storage = await chrome.storage.local.get('config')
	console.log(storage, 'storage????')
	if (!storage) return
	return { config: storage }
}

const injectedScript = async (onReady) => {
	const res: any = await getMockConfigFromStorage()
	/** 将插件配置项属性植入html属性中 */
	document.documentElement.setAttribute(
		'data-toolConfig',
		JSON.stringify(res.config || {})
	)
	/** 创建script标签，插入page-script */
	const script = document.createElement('script')
	script.type = 'text/javascript'

	script.src = `chrome-extension:${chrome.runtime.id}/extension/page-script/index.js`
	document.getElementsByTagName('html')?.[0]?.prepend(script)
	script.onload = () => {
		onReady?.()
	}
}

export const startMock = () => {
	injectedScript(() => {})
}
