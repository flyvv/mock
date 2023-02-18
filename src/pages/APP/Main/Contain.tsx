import { Form, Layout, Button } from 'antd'
import React, { useState } from 'react'
import { MHeader } from '../components'
import { Input, Modal } from 'antd'
import { Container } from './CreatePage'

export const Contain = (props: { info: IMockDataType }) => {
	const { info } = props
	const index = info?.pages?.findIndex(
		(v) => v.id === info?.currentPageInfo?.id
	)
	const pagesHaveCurrentPage = index ? index > -1 : false
	return (
		<>
			{pagesHaveCurrentPage ? (
				<div>接口信息</div>
			) : (
				// <Button type="primary" ghost>
				// 	创建页面
				// </Button>
				<Container info={props.info} />
			)}
		</>
	)
}
