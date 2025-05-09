"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Pagination,
  Modal,
  Button,
  Form,
  message,
  Select,
  Input,
  Dropdown,
  Menu,
} from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";

const { Item } = Form;
const { Option } = Select;

interface Operator {
  id: number;
  full_name: string;
  phone_number: string;
  description: string;
  operator_type_id: number;
  operator_type: string;
  status: "in_progres" | "empty" | "cancel";
}

export default function OperatorPage() {
  const { data: session, status: authStatus } = useSession();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Статус параметрлари
  const statusOptions = [
    { value: "in_progres", label: "Jarayonda" },
    { value: "empty", label: "Bo'sh" },
    { value: "cancel", label: "Bekor qilindi" },
  ];

  // Операторларни юклаш
  const fetchOperators = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        status: selectedStatuses.join(",") || undefined,
      };

      const res = await axios.get("https://crmm.repid.uz/operator", {
        params,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setOperators(res.data.items);
      setTotalItems(res.data.total);
    } catch (err) {
      message.error("Operatorlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchOperators(currentPage);
    }
  }, [authStatus, session, selectedStatuses, currentPage]);

  // Статус ранглари
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "in_progres":
        return "bg-orange-100 text-orange-800 border-orange-500";
      case "empty":
        return "bg-gray-100 text-gray-600 border-gray-400";
      case "cancel":
        return "bg-red-100 text-red-800 border-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Оператор қўшиш
  const handleAddOperator = async (values: any) => {
    try {
      await axios.post(
        "https://crmm.repid.uz/operator",
        {
          ...values,
          operator_type_id: Number(values.operator_type_id),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Operator muvaffaqiyatli qo'shildi");
      setIsModalVisible(false);
      form.resetFields();
      fetchOperators(currentPage);
    } catch (error) {
      message.error("Operator qo'shishda xatolik");
    }
  };

  // Операторни ўчириш
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://crmm.repid.uz/operator/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      message.success("Operator o'chirildi");
      fetchOperators(currentPage);
    } catch (error) {
      message.error("O'chirishda xatolik");
    }
  };

  // Action меню
  const actionMenu = (id: number): MenuProps => ({
    items: [
      {
        key: "delete",
        label: <span className="text-red-600 font-medium">O'chirish</span>,
        onClick: () => handleDelete(id),
        className: "hover:bg-red-50"
      },
    ],
  });

  if (authStatus === "loading")
    return <div className="text-center py-8 text-gray-600">Yuklanmoqda...</div>;

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Operatorlar</h1>

        {/* Фильтр ва қўшиш тугмаси */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <Select
            mode="multiple"
            placeholder="Holatni tanlang"
            className="w-full sm:w-96"
            options={statusOptions}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            optionFilterProp="label"
          />

          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600 text-white h-10 px-6"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Yangi operator
          </Button>
        </div>

        {/* Операторлар рўйхати */}
        <div className="grid gap-4">
          {operators.map((operator) => (
            <div
              key={operator.id}
              className="bg-white rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {operator.full_name}
                  </h3>
                  <p className="text-gray-600 mt-1">{operator.phone_number}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className={`py-1.5 px-3 rounded-full text-sm border ${getStatusStyle(
                        operator.status
                      )}`}
                    >
                      {
                        statusOptions.find((s) => s.value === operator.status)
                          ?.label
                      }
                    </span>
                    <span className="text-gray-500 text-sm">
                      {operator.operator_type}
                    </span>
                  </div>
                </div>

                <Dropdown
                  menu={actionMenu(operator.id)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <MoreOutlined className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer" />
                </Dropdown>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={10}
            onChange={(page) => setCurrentPage(page)}
            className="ant-pagination-custom"
            showSizeChanger={false}
          />
        </div>
      </div>

      {/* Модал ёрдамида қўшиш */}
      <Modal
        title="Yangi operator qo'shish"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        className="rounded-xl"
      >
        <Form form={form} layout="vertical" onFinish={handleAddOperator}>
          <Item
            label="To'liq ism"
            name="full_name"
            rules={[{ required: true, message: "Iltimos ism kiriting!" }]}
          >
            <Input size="large" />
          </Item>

          <Item
            label="Telefon raqam"
            name="phone_number"
            rules={[{ required: true, message: "Iltimos telefon kiriting!" }]}
          >
            <Input size="large" />
          </Item>

          <Item label="Qo'shimcha ma'lumot" name="description">
            <Input.TextArea rows={3} />
          </Item>

          <Item
            label="Operator turi"
            name="operator_type_id"
            rules={[{ required: true, message: "Iltimos turini tanlang!" }]}
          >
            <Select size="large">
              <Option value={1}>Admin</Option>
              <Option value={2}>Moderator</Option>
            </Select>
          </Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="bg-orange-500 hover:bg-orange-600 mt-4 h-12 text-lg"
          >
            Saqlash
          </Button>
        </Form>
      </Modal>
    </main>
  );
}
