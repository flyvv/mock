import { useEffect, useRef, useState } from 'react'
import { Empty } from 'antd'
import React from 'react'
import { Container } from './Main'

export default function App() {
	const [storageData, setStorageData] = useState<IMockDataType>()
	const pageKey = useRef<string>()
	useEffect(() => {
		chrome?.tabs?.query?.(
			{
				active: true,
				lastFocusedWindow: true,
			},
			(tabs) => {
				console.log(tabs, 'tabs')

				if (!tabs?.[0]?.url) return
				const pageUrl = new URL(tabs[0].url)

				const currentUrl = pageUrl.host + pageUrl.pathname
				const currentTitle = tabs[0].title ?? ''
				const currentId = `${tabs[0].id}` ?? ''

				pageKey.current = currentUrl

				chrome.storage.local.get().then((res) => {
					const storageProjects: any = res.projects?.find?.(
						(p) => p.active
					)
					let currentPageInfo: ICurrentPageInfoType
					if (storageProjects) {
						currentPageInfo = storageProjects
					} else {
						currentPageInfo = {
							id: currentId,
							url: currentUrl,
							title: currentTitle,
							apiCapture: false,
              apis:[]
						}
						const data = {
							projects: [],
							config: {
								isOpen: true,
								reload: true,
								defaultRequestContentType:
									'application/x-www-form-urlencoded',
								mode: 'fronted',
							},
							currentPageInfo: currentPageInfo,
						}

						chrome.storage.local.set(data)
					}
					setStorageData({
						pages: [
							{
								id: '123123',
								url: 'https://www.baidu.com/',
								title: 'demo',
							},
						],
						config: {
							isOpen: true,
							reload: true,
							ignoreParams: {},
							defaultRequestContentType:
								'application/x-www-form-urlencoded',
							hostWhiteList: [],
							mode: 'fronted',
						},
						currentPageInfo: currentPageInfo,
					})
				})
			}
		)
	}, [])

	if (!storageData || !storageData.config) return <div>请刷新页面</div>

	return (
		<div
			className="popup"
			style={{
				width: '800px',
				height: '600px',
			}}
		>
			{storageData.config.isOpen ? (
				<div>
					<Container info={storageData} />
				</div>
			) : (
				<Empty description={'开启即可享受丝滑无比的mock体验'} />
			)}
		</div>
	)
}
