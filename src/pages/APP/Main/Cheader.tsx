import React from 'react'
import { Button } from 'antd'

export const Cheader = ({ info }) => {
	return (
		<>
			<div className="flex-between">
				<div>{info.currentPageInfo?.title}</div>
				<Button ghost type="primary">
					生成报告
				</Button>
			</div>
			<hr />
		</>
	)
}
