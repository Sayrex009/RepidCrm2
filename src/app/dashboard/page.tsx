'use client';

import React, { useState } from 'react';
import { Card, Input, InputNumber, DatePicker, Button, Alert, message } from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { div } from 'framer-motion/client';

const CreateIncomeProject: React.FC = () => {
  const { data: session } = useSession();
  const [payPrice, setPayPrice] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [datePaid, setDatePaid] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      setError('Not authenticated');
      return;
    }

    if (!payPrice || !projectId || !description || !datePaid) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://crmm.repid.uz/income/project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          pay_price: String(payPrice),
          project_id: projectId,
          description,
          date_paid: datePaid
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error:', result);
        throw new Error(result?.detail || 'Failed to submit income');
      }

      message.success('Доход успешно создан!');
      // Очистка формы
      setPayPrice(null);
      setProjectId(0);
      setDescription('');
      setDatePaid(new Date().toISOString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-24'>
    <Card title="Создание дохода проекта" style={{ maxWidth: 500, margin: 'auto' }}>
      {error && <Alert message="Ошибка" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <InputNumber
        value={payPrice ?? undefined}
        onChange={(value) => setPayPrice(value)}
        placeholder="Сумма (pay_price)"
        style={{ width: '100%', marginBottom: 16 }}
      />
      <InputNumber
        value={projectId}
        onChange={(value) => setProjectId(value || 0)}
        placeholder="ID проекта (project_id)"
        style={{ width: '100%', marginBottom: 16 }}
      />
      <Input.TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        rows={3}
        style={{ marginBottom: 16 }}
      />
      <DatePicker
        style={{ width: '100%', marginBottom: 16 }}
        value={dayjs(datePaid)}
        onChange={(date) => setDatePaid(date?.toISOString() || new Date().toISOString())}
      />
      <Button type="primary" onClick={handleSubmit} loading={loading} block>
        Отправить
      </Button>
    </Card>
    </div>
  );
};

export default CreateIncomeProject;
