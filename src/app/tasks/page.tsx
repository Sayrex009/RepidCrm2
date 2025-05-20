'use client'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function TaskModal({ isModalOpen, setIsModalOpen, programmers, setTasks }) {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = session?.accessToken;

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("start_date", values.start_date.toISOString());
      formData.append("end_date", values.end_date.toISOString());
      formData.append("description", values.description || "");
      formData.append("status", values.status);
      formData.append("programmer_ids", JSON.stringify(values.programmer_ids));

      if (values.image?.[0]?.originFileObj) {
        formData.append("image_task", values.image[0].originFileObj);
      } else {
        message.error("Rasm tanlanmagan");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        "https://crmm.repid.uz/common/task",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Vazifa yaratildi!");
      setTasks((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Task yaratishda xatolik:", error);
      message.error("Xatolik yuz berdi: " + (error?.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Yangi vazifa qo'shish"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={isLoading}
      okText="Yaratish"
      cancelText="Bekor qilish"
      className="mt-24"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Nomi"
          name="name"
          rules={[{ required: true, message: "Iltimos, vazifa nomini kiriting" }]}
        >
          <Input placeholder="Masalan, CRM dizayn qilish" />
        </Form.Item>

        <Form.Item
          label="Boshlanish sanasi"
          name="start_date"
          rules={[{ required: true, message: "Iltimos, boshlanish sanasini tanlang" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Tugash sanasi"
          name="end_date"
          rules={[{ required: true, message: "Iltimos, tugash sanasini tanlang" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Izoh"
          name="description"
          rules={[{ required: false }]}
        >
          <TextArea rows={4} placeholder="Qo'shimcha ma'lumotlar" />
        </Form.Item>

        <Form.Item
          label="Holati"
          name="status"
          rules={[{ required: true, message: "Iltimos, holatni tanlang" }]}
        >
          <Select placeholder="Vazifa holatini tanlang">
            <Option value="Yangi">Yangi</Option>
            <Option value="Jarayonda">Jarayonda</Option>
            <Option value="Kutilmoqda">Kutilmoqda</Option>
            <Option value="Yakunlangan">Yakunlangan</Option>
            <Option value="Bekor qilingan">Bekor qilingan</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Dasturchilar"
          name="programmer_ids"
          rules={[{ required: true, message: "Iltimos, kamida 1 dasturchini tanlang" }]}
        >
          <Select mode="multiple" placeholder="Dasturchilarni tanlang">
            {programmers?.map((dev: any) => (
              <Option key={dev.id} value={dev.id}>
                {dev.full_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Rasm yuklash"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Iltimos, rasm tanlang" }]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Rasm tanlash</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
