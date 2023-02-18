import { Form, Layout, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
const { Content, Sider } = Layout

export const Container = (props: { info: IMockDataType }) => {
	const { info } = props
	const [form] = Form.useForm()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	return (
		<>
			<Button ghost type="primary" onClick={showModal}>
				创建页面
			</Button>
			<Modal
				title="创建页面"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 16 }}
					name="normal_login"
					className="login-form"
				>
					<Form.Item name="url" label="页面地址">
						<Input
							defaultValue={info?.currentPageInfo?.url}
							disabled
						/>
					</Form.Item>
					<Form.Item
						name="title"
						label="页面标题"
						rules={[
							{
								required: true,
								message: '请输入页面标题',
							},
						]}
					>
						<Input
							defaultValue={info?.currentPageInfo?.title}
							placeholder="请输入页面标题"
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}
