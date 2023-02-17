import { Menu, Layout, Button } from 'antd'
import React from 'react'
import { MHeader } from '../components'
const { Content, Sider } = Layout

export const Container = (props: { info: IMockDataType }) => {
	const { info } = props
	const index = info?.pages?.findIndex(
		(v) => v.id === info?.currentPageInfo?.id
	)
	const pagesHaveCurrentPage = index ? index > -1 : false
	return (
		<Layout style={{ background: '#fff' }}>
			{props.info.config && <MHeader config={props.info.config} />}
			<Layout style={{ background: '#fff' }}>
				<Sider
					width={120}
					style={{
						overflow: 'auto',
						height: '100vh',
						width: 100,
						background: '#fff',
						borderRight: '1px solid #ddd',
					}}
				>
					<Menu
						defaultSelectedKeys={
							props?.info?.currentPageInfo?.id as any
						}
						defaultOpenKeys={['sub1']}
						mode="inline"
						theme="light"
						items={props.info.pages?.map((v) => ({
							label: v.title,
							key: v.id,
						}))}
					/>
				</Sider>
				<Layout style={{ background: '#fff' }}>
					<Content style={{ padding: 8 }}>
						<div className="flex-between">
							<div>{info.currentPageInfo?.title}</div>
							<Button ghost type="primary">
								生成报告
							</Button>
						</div>
						<hr />
						{pagesHaveCurrentPage ? (
							<div>接口信息</div>
						) : (
							<Button type="primary" ghost>
								创建页面
							</Button>
						)}
						{/* <Editor
              value={JSON.stringify(props.info)}
              theme="vs-dark"
              language="json"
              width={500}
              height={400}
            /> */}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	)
}
