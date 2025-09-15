import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  message,
  Space,
  Tag,
  Avatar,
  Drawer,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PictureOutlined,
  UserOutlined,
  EyeOutlined,
  PoweroffOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const UtilisateurManager = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/utilisateur');
      setUtilisateurs(res.data);
      setLoading(false);
    } catch (error) {
      message.error("Erreur de chargement des utilisateurs");
      setLoading(false);
    }
  };

  const toggleEtat = async (user) => {
    try {
      await axios.patch(`http://localhost:3000/api/utilisateur/${user.id_uti}/etat`);
      message.success(`Utilisateur ${user.nom_uti} ${user.etat ? 'désactivé' : 'activé'}`);
      fetchUtilisateurs();
    } catch (error) {
      message.error("Impossible de modifier le statut");
    }
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const renderRole = (role) => {
    const roleConfig = {
      admin: { color: '#f87171', text: 'Admin' },
      direction: { color: '#c084fc', text: 'Direction' },
      production: { color: '#fbbf24', text: 'Cadre Production' },
      operateur: { color: '#4ade80', text: 'Opérateur' },
      AQ: { color: '#60a5fa', text: 'AQ' },
      utilisateur: { color: '#60a5fa', text: 'AQ' }
    };
    const config = roleConfig[role] || roleConfig.utilisateur;
    return <Tag style={{ borderRadius: 12, padding: '4px 10px', fontWeight: 500 }} color={config.color}>{config.text}</Tag>;
  };

  const renderStatus = (etat) => (
    <Tag style={{ borderRadius: 12, padding: '4px 10px', fontWeight: 500 }} color={etat ? 'success' : 'error'}>
      {etat ? 'Actif' : 'Inactif'}
    </Tag>
  );

  const desktopColumns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (photo) => (
        <Avatar 
          size={70}
          src={`http://localhost:3000/uploads/photos/${photo}`}
          icon={<UserOutlined />}
          className="shadow-md border-2 border-white"
        />
      ),
    },
    {
      title: 'Utilisateur',
      dataIndex: 'nom_uti',
      sorter: (a, b) => a.nom_uti.localeCompare(b.nom_uti),
      render: (nom, record) => (
        <div>
          <div className="font-semibold text-gray-900 text-lg">{nom}</div>
          <div className="text-base text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      render: (role) => renderRole(role),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'AQ', value: 'AQ' },
        { text: 'Cadre Production', value: 'production' },
        { text: 'Superviseur Production', value: 'production' },
        { text: 'Chef d\'Equipe', value: 'Operateur' },
        { text: 'Direction', value: 'direction' },
        { text: 'Opérateur', value: 'operateur' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Statut',
      dataIndex: 'etat',
      render: (etat) => renderStatus(etat),
      filters: [
        { text: 'Actif', value: true },
        { text: 'Inactif', value: false },
      ],
      onFilter: (value, record) => record.etat === value,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => showUserDetails(record)}>Voir</Button>
          <Button type={record.etat ? 'text' : 'primary'} danger={record.etat} onClick={() => toggleEtat(record)}>
            {record.etat ? 'Désactiver' : 'Activer'}
          </Button>
        </Space>
      ),
    }
  ];

  const handleSubmit = async (values) => {
    if (!photoFile) {
      message.error("Veuillez télécharger une photo");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('nom_uti', values.nom_uti);
    formDataToSend.append('email', values.email);
    formDataToSend.append('password', values.password);
    formDataToSend.append('role', values.role || 'utilisateur');
    formDataToSend.append('photo', photoFile);

    try {
      await axios.post('http://localhost:3000/api/utilisateur/registrer', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Utilisateur ajouté avec succès');
      setModalVisible(false);
      form.resetFields();
      setPhotoFile(null);
      fetchUtilisateurs();
    } catch (error) {
      message.error(error.response?.data?.error || "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return (
    <div className=" w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 border-0 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-r from-blue-200 to-green-600 rounded-xl">
            <TeamOutlined className="text-white text-3xl" />
          </div>
          <div>
            <Title level={2} className="m-0 text-gray-800">
              Gestion des Utilisateurs
            </Title>
            <Text className="text-gray-500">
              {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} enregistré{utilisateurs.length > 1 ? 's' : ''}
            </Text>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          size="large"
          onClick={() => setModalVisible(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl px-6"
        >
          {isMobile ? 'Ajouter' : 'Ajouter un utilisateur'}
        </Button>
      </div>

      {/* CONTENU */}
      <Card className="shadow-xl rounded-2xl border-0">
        {isMobile ? (
          <div className="space-y-5">
            {utilisateurs.map((user) => (
              <Card
                key={user.id_uti}
                className="shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-center space-x-4">
                  <Avatar
                    size={70}
                    src={`http://localhost:3000/uploads/photos/${user.photo}`}
                    icon={<UserOutlined />}
                    className="shadow-md border-2 border-white"
                  />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900">{user.nom_uti}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      {renderRole(user.role)}
                      {renderStatus(user.etat)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="default" shape="round" icon={<EyeOutlined />} onClick={() => showUserDetails(user)}>
                    Voir
                  </Button>
                  <Button shape="round" danger={user.etat} type={user.etat ? "default" : "primary"} onClick={() => toggleEtat(user)}>
                    {user.etat ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table
            columns={desktopColumns}
            dataSource={utilisateurs}
            rowKey="id_uti"
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            className="noble-table"
          />
        )}
      </Card>

      {/* MODAL AJOUT */}
      <Modal
        title="Ajouter un utilisateur"
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); setPhotoFile(null); }}
        footer={null}
        width={isMobile ? '95%' : 800}
        centered
        className="rounded-2xl"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large" className="mt-6">
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="nom_uti" label="Nom complet" rules={[{ required: true }]}>
                <Input prefix={<EditOutlined />} placeholder="Nom complet" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="password" label="Mot de passe" rules={[{ required: true }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="role" label="Rôle">
                <Select defaultValue="utilisateur">
                  <Option value="AQ">AQ</Option>
                  <Option value="production">Cadre Production</Option>
                  <Option value="direction">Direction</Option>
                  <Option value="production">Superviseur Production</Option>
                  <Option value="operateur">Opérateur</Option>
                  <Option value="CE">Chef d\'Equipe</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="photo" label="Photo de profil">
                <Upload
                  name="photo"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={(file) => { setPhotoFile(file); return false; }}
                >
                  <div className="text-center p-4">
                    <PictureOutlined className="text-3xl text-gray-400 mb-3" />
                    <div className="text-gray-600">Télécharger</div>
                  </div>
                </Upload>
                {photoFile && <div className="mt-4 p-4 bg-green-50 rounded-xl border">{photoFile.name}</div>}
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Enregistrer l'utilisateur
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* DRAWER DETAILS */}
      <Drawer
        title="Détails utilisateur"
        placement="bottom"
        height="60%"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        className="rounded-t-2xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="text-center">
              <Avatar size={80} src={`http://localhost:3000/uploads/photos/${selectedUser.photo}`} icon={<UserOutlined />} />
              <Title level={4} className="mt-4 mb-2">{selectedUser.nom_uti}</Title>
              <Text className="text-gray-500">{selectedUser.email}</Text>
            </div>
            <Divider />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text strong>Rôle:</Text>
                {renderRole(selectedUser.role)}
              </div>
              <div className="flex justify-between items-center">
                <Text strong>Statut:</Text>
                {renderStatus(selectedUser.etat)}
              </div>
            </div>
            <Divider />
            <Button type={selectedUser.etat ? 'default' : 'primary'} danger={selectedUser.etat} block size="large" onClick={() => { toggleEtat(selectedUser); setDrawerVisible(false); }}>
              {selectedUser.etat ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'}
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UtilisateurManager;
