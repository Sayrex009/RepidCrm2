<<<<<<< HEAD
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
=======
"use client";

import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message, Spin } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function TasksPage() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false); // To show loading spinner for employees
  const [creatingStatus, setCreatingStatus] = useState("to_do");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const token = session?.accessToken;
        if (!token) {
          message.error("Token topilmadi. Iltimos, tizimga qayta kiring.");
          return;
        }

        const response = await axios.get("https://crmm.repid.uz/operator", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployees(response.data); // Set the employees to state
      } catch (error) {
        console.error("Error fetching employees:", error);
        message.error("Xodimlar olishda xatolik.");
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (session?.accessToken) {
      fetchEmployees();
    }
  }, [session]);

  const columns = [
    { id: "to_do", title: "To do" },
    { id: "in_progres", title: "Jarayonda" },
    { id: "code_review", title: "Qayta ko'rib chiqish" },
    { id: "done", title: "Tugallandi" },
    { id: "success", title: "Muvaffaqqiyatli" },
  ];

  const showModal = (status: string) => {
    setCreatingStatus(status);
    setIsModalOpen(true);
  };
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = session?.accessToken;

<<<<<<< HEAD
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
=======
      if (!token) {
        message.error("Token topilmadi. Iltimos, tizimga qayta kiring.");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("start_date", values.start_date.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
      formData.append("end_date", values.end_date.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
      formData.append("description", values.description || "");
      formData.append("status", creatingStatus);

      // Add programmer_ids to form data
      (values.programmer_ids || []).forEach((id: string) => {
        formData.append("programmer_ids", id);
      });

      if (values.image?.file?.originFileObj) {
        formData.append("image_task", values.image.file.originFileObj);
      }

      console.log("Form data to be sent:", formData); 

      const response = await axios.post(
        "https://crmm.repid.uz/common/task", 
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
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
<<<<<<< HEAD
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
=======
    } catch (error) {
      console.error("Task yaratishda xatolik:", error);
      message.error("Xatolik yuz berdi.");
    }
  };
  return (
    <main className="px-[15px] sm:px-[30px] pt-[20px] pb-[40px] lg:overflow-auto h-[calc(100%-80px)]">
      <h1 className="text-[#26273F] font-bold text-[24px] md:text-[32px] mb-5 md:mb-7">Vazifalar</h1>
      <div className="flex gap-4 w-[95vw] lg:w-[calc(100vw-380px)] overflow-auto">
        {columns.map((col) => (
          <div key={col.id} className="bg-[#dee2e6] p-[24px] rounded-[10px] min-w-[360px] h-auto">
            <h3 className="text-[16px] font-medium mb-[24px]">{col.title}</h3>
            <div className="h-auto">
              {tasks.filter((task: any) => task.status === col.id).map((task: any) => (
                <div key={task.id} className="bg-white p-2 mb-2 rounded">
                  {task.name}
                </div>
              ))}
            </div>
            <button className="flex flex-row items-center gap-4 mt-4" onClick={() => showModal(col.id)}>
              <Plus className="w-[14px] h-[14px]" />
              <p className="text-[14px]">Add a Card</p>
            </button>
          </div>
        ))}
      </div>

      <Modal
        title="Vazifa qo‘shish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Saqlash"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Vazifa nomi"
            rules={[{ required: true, message: "Iltimos, nomini kiriting" }]}
          >
            <Input placeholder="Masalan: Dizayn yaratish" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item
              name="start_date"
              label="Boshlanish sanasi"
              className="w-1/2"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="Tugatish sanasi"
              className="w-1/2"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="programmer_ids" label="Xodimlar">
            <Select mode="multiple" placeholder="Tanlang">
              {loadingEmployees ? (
                <Select.Option disabled>
                  <Spin size="small" />
                  Xodimlar yuklanmoqda...
                </Select.Option>
              ) : employees.length > 0 ? (
                employees.map((employee: any) => {
                  if (!employee.id) return null;
                  return (
                    <Select.Option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name}
                    </Select.Option>
                  );
                })
              ) : (
                <Select.Option disabled>Yo'q xodimlar</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Rasm"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Izoh">
            <TextArea rows={3} placeholder="Izoh..." />
          </Form.Item>
        </Form>
      </Modal>
    </main>
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
  );
}
