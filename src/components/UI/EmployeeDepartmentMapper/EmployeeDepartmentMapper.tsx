// import React, { useState } from 'react';
// import {
//   Select,
//   Button,
//   List,
//   Card,
//   message,
//   Typography,
//   Divider,
//   Space,
// } from 'antd';
// import { UserOutlined, TeamOutlined, DeleteOutlined } from '@ant-design/icons';

// const { Option } = Select;
// const { Title, Text } = Typography;

// // Пример данных
// const employees = [
//   { id: 1, name: 'Иван Иванов' },
//   { id: 2, name: 'Мария Петрова' },
//   { id: 3, name: 'Алексей Сидоров' },
// ];

// const departments = [
//   { id: 101, name: 'IT' },
//   { id: 102, name: 'HR' },
//   { id: 103, name: 'Бухгалтерия' },
// ];

// const EmployeeDepartmentMapper = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [mappings, setMappings] = useState([]);

//   const handleAddMapping = () => {
//     if (!selectedEmployee || !selectedDepartment) {
//       message.warning('Выберите сотрудника и подразделение');
//       return;
//     }

//     const employee = employees.find(emp => emp.id === selectedEmployee);
//     const department = departments.find(dep => dep.id === selectedDepartment);

//     const exists = mappings.some(
//       m => m.employeeId === employee.id && m.departmentId === department.id
//     );

//     if (exists) {
//       message.info('Такое сопоставление уже существует!');
//       return;
//     }

//     setMappings([
//       ...mappings,
//       {
//         key: `${employee.id}-${department.id}`, // уникальный ключ
//         employeeId: employee.id,
//         employeeName: employee.name,
//         departmentId: department.id,
//         departmentName: department.name,
//       },
//     ]);

//     // Очистить выбор
//     setSelectedEmployee(null);
//     setSelectedDepartment(null);

//     message.success('Сопоставление добавлено');
//   };

//   const handleRemoveMapping = (index) => {
//     const removed = mappings[index];
//     setMappings(mappings.filter((_, i) => i !== index));
//     message.info(`Удалено: ${removed.employeeName} → ${removed.departmentName}`);
//   };

//   return (
//     <Card
//       title={
//         <Title level={4} style={{ margin: 0 }}>
//           <TeamOutlined /> Сопоставление сотрудников и подразделений
//         </Title>
//       }
//       bordered={false}
//       style={{ maxWidth: 600, margin: '20px auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
//     >
//       <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//         <div>
//           <Text strong>Сотрудник:</Text>
//           <Select
//             placeholder="Выберите сотрудника"
//             value={selectedEmployee}
//             onChange={setSelectedEmployee}
//             style={{ width: '100%', marginTop: 8 }}
//             allowClear
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//             }
//             suffixIcon={<UserOutlined />}
//           >
//             {employees.map(emp => (
//               <Option key={emp.id} value={emp.id}>
//                 {emp.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         <div>
//           <Text strong>Подразделение:</Text>
//           <Select
//             placeholder="Выберите подразделение"
//             value={selectedDepartment}
//             onChange={setSelectedDepartment}
//             style={{ width: '100%', marginTop: 8 }}
//             allowClear
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//             }
//             suffixIcon={<TeamOutlined />}
//           >
//             {departments.map(dep => (
//               <Option key={dep.id} value={dep.id}>
//                 {dep.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         <Button
//           type="primary"
//           onClick={handleAddMapping}
//           block
//           icon={<TeamOutlined />}
//         >
//           Добавить сопоставление
//         </Button>

//         <Divider />

//         <Title level={5}>Добавленные связи:</Title>
//         {mappings.length === 0 ? (
//           <Text type="secondary">Пока нет сопоставлений</Text>
//         ) : (
//           <List
//             dataSource={mappings}
//             renderItem={(item, index) => (
//               <List.Item
//                 actions={[
//                   <Button
//                     type="text"
//                     danger
//                     icon={<DeleteOutlined />}
//                     onClick={() => handleRemoveMapping(index)}
//                     size="small"
//                   />,
//                 ]}
//               >
//                 <List.Item.Meta
//                   avatar={<UserOutlined style={{ color: '#1890ff' }} />}
//                   title={
//                     <Text strong>{item.employeeName}</Text>
//                   }
//                   description={`→ ${item.departmentName}`}
//                 />
//               </List.Item>
//             )}
//           />
//         )}
//       </Space>
//     </Card>
//   );
// };

// export default EmployeeDepartmentMapper;