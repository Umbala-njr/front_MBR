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
  MenuOutlined,
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

  // Détecter la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch utilisateurs
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

  // Toggle user status
  const toggleEtat = async (user) => {
    try {
      await axios.patch(`http://localhost:3000/api/utilisateur/${user.id_uti}/etat`);
      message.success(`Utilisateur ${user.nom_uti} ${user.etat ? 'désactivé' : 'activé'}`);
      fetchUtilisateurs();
    } catch (error) {
      message.error("Impossible de modifier le statut");
    }
  };

  // Afficher les détails d'un utilisateur
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  // Rendu du rôle avec style amélioré
  const renderRole = (role) => {
    const roleConfig = {
      admin: { color: '#f50', text: 'Admin' },
      direction: { color: '#722ed1', text: 'Direction' },
      production: { color: '#fa8c16', text: 'Cadre Production' },
      operateur: { color: '#52c41a', text: 'Opérateur' },
      AQ: { color: '#1890ff', text: 'AQ' },
      utilisateur: { color: '#1890ff', text: 'AQ' }
    };

    const config = roleConfig[role] || roleConfig.utilisateur;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Rendu du statut
  const renderStatus = (etat) => (
    <Tag color={etat ? 'success' : 'error'}>
      {etat ? 'Actif' : 'Inactif'}
    </Tag>
  );

  // Colonnes pour desktop
  const desktopColumns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      width: 60,
      render: (photo, record) => (
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
      width: 150,
      sorter: (a, b) => a.nom_uti.localeCompare(b.nom_uti),
      render: (nom, record) => (
        <div>
          <div className="font-medium text-gray-900 text-lg">{nom}</div>
          <div className="text-base text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      width: 120,
      render: (role) => (
        <Tag color={
          role === 'admin' ? '#f50' :
          role === 'direction' ? '#722ed1' :
          role === 'production' ? '#fa8c16' :
          role === 'operateur' ? '#52c41a' :
          '#1890ff'
        } className="text-base px-4 py-2">
          {role === 'production' ? 'Cadre Production' : 
           role === 'direction' ? 'Direction' :
           role === 'operateur' ? 'Opérateur' :
           role === 'utilisateur' ? 'AQ' : role}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'AQ', value: 'AQ' },
        { text: 'Cadre Production', value: 'production' },
        { text: 'Direction', value: 'direction' },
        { text: 'Opérateur', value: 'operateur' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Statut',
      dataIndex: 'etat',
      width: 90,
      render: (etat) => (
        <Tag color={etat ? 'success' : 'error'} className="text-base px-4 py-2">
          {etat ? 'Actif' : 'Inactif'}
        </Tag>
      ),
      filters: [
        { text: 'Actif', value: true },
        { text: 'Inactif', value: false },
      ],
      onFilter: (value, record) => record.etat === value,
    },
    {
      title: 'Actions',
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showUserDetails(record)}
            className="text-blue-600 hover:text-blue-800 text-base h-10 px-4"
          >
            Voir
          </Button>
          <Button 
            type={record.etat ? 'text' : 'primary'}
            danger={record.etat}
            icon={<PoweroffOutlined />}
            onClick={() => toggleEtat(record)}
            className={`${record.etat ? 'text-red-600 hover:text-red-800' : ''} text-base h-10 px-4`}
          >
            {record.etat ? 'Désactiver' : 'Activer'}
          </Button>
        </Space>
      ),
    }
  ];

  // Rendu mobile sous forme de cartes
  const MobileUserCards = () => (
    <div className="space-y-4">
      {utilisateurs.map((user) => (
        <Card 
          key={user.id_uti}
          className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl border-0"
          bodyStyle={{ padding: '16px' }}
        >
          <div className="flex items-center space-x-4">
            <Avatar 
              size={60}
              src={`http://localhost:3000/uploads/photos/${user.photo}`}
              icon={<UserOutlined />}
              className="shadow-md border-2 border-white flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{user.nom_uti}</div>
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
              <div className="flex items-center space-x-2 mt-2">
                {renderRole(user.role)}
                {renderStatus(user.etat)}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showUserDetails(user)}
              className="text-blue-600"
            />
            <Button 
              type={user.etat ? 'text' : 'primary'}
              danger={user.etat}
              size="small"
              onClick={() => toggleEtat(user)}
              className={user.etat ? 'text-red-600' : ''}
            >
              {user.etat ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  // Soumettre le formulaire
  const [photoFile, setPhotoFile] = useState(null);

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
      console.error(error);
    }
  };

  // Effet initial
  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return (
    <div className="max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 overflow-x-hidden ">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 ">
        {/* Header avec design amélioré */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow-lg p-6 lg:p-8 xl:p-10 border-0">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="p-4 lg:p-5 bg-gradient-to-r from-blue-200 to-green-600 rounded-xl">
                <TeamOutlined className="text-white text-xl lg:text-2xl xl:text-3xl" />
              </div>
              <div>
                <Title level={1} className="m-0 text-gray-800 lg:text-4xl xl:text-5xl">
                  Gestion des Utilisateurs
                </Title>
                <Text className="text-gray-500 text-base lg:text-lg xl:text-xl">
                  {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} enregistré{utilisateurs.length > 1 ? 's' : ''}
                </Text>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />} 
              size="large"
              onClick={() => setModalVisible(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg rounded-xl w-full sm:w-auto h-12 lg:h-14 xl:h-16 text-base lg:text-lg xl:text-xl px-6 lg:px-8 xl:px-10"
            >
              {isMobile ? 'Ajouter' : 'Ajouter un utilisateur'}
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
       <Card
  className="shadow-xl rounded-2xl border-0 overflow-hidden"
  styles={{ body: { padding: isMobile ? '16px' : '32px' } }}
>
  <div className="overflow-x-auto">
    <Table
     columns={desktopColumns}  // <-- ici !
  
      dataSource={utilisateurs}
      rowKey="id_uti"
      bordered
      pagination={{
        pageSize: 5,
        showSizeChanger: false,
        position: ["bottomCenter"],
      }}
      className="custom-table rounded-xl overflow-hidden"
    />
  </div>
</Card>

        {/* Modal d'ajout d'utilisateur */}
        <Modal
          title={
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserAddOutlined className="text-blue-600 text-lg" />
              </div>
              <span className="text-lg font-semibold">Ajouter un utilisateur</span>
            </div>
          }
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setPhotoFile(null);
          }}
          footer={null}
          width={isMobile ? '95%' : 800}
          centered
          className="rounded-2xl"
        >
          <Form 
            form={form}
            onFinish={handleSubmit} 
            layout="vertical"
            className="mt-6"
            size="large"
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="nom_uti" 
                  label={<span className="text-base font-medium">Nom complet</span>}
                  rules={[{ required: true, message: 'Nom requis' }]}
                >
                  <Input 
                    prefix={<EditOutlined className="text-gray-400" />} 
                    placeholder="Nom complet" 
                    className="rounded-xl h-12 text-base"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="email" 
                  label={<span className="text-base font-medium">Adresse email</span>}
                  rules={[{ 
                    required: true, 
                    type: 'email', 
                    message: 'Email invalide' 
                  }]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-gray-400" />} 
                    placeholder="Email" 
                    className="rounded-xl h-12 text-base"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="password" 
                  label={<span className="text-base font-medium">Mot de passe</span>}
                  rules={[{ required: true, message: 'Mot de passe requis' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-gray-400" />} 
                    placeholder="Mot de passe" 
                    className="rounded-xl h-12 text-base"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="role" label={<span className="text-base font-medium">Rôle</span>}>
                  <Select 
                    defaultValue="utilisateur" 
                    className="rounded-xl h-12 text-base"
                    placeholder="Sélectionner un rôle"
                  >
                    <Option value="AQ">AQ</Option>
                    <Option value="production">Cadre Production</Option>
                    <Option value="direction">Direction</Option>
                    <Option value="operateur">Opérateur</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="photo" label={<span className="text-base font-medium">Photo de profil</span>}>
                  <Upload 
                    name="photo"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setPhotoFile(file);
                      return false;
                    }}
                  >
                    <div className="text-center p-4">
                      <PictureOutlined className="text-3xl text-gray-400 mb-3" />
                      <div className="text-gray-600 text-base">Télécharger</div>
                    </div>
                  </Upload>
                  {photoFile && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <Text className="text-green-700 text-base">
                        ✓ Photo sélectionnée : {photoFile.name}
                      </Text>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item className="mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    size="large"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 h-14 rounded-xl shadow-lg text-lg"
                  >
                    Enregistrer l'utilisateur
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Drawer pour les détails utilisateur (mobile) */}
        <Drawer
          title={
            <div className="flex items-center space-x-3 max-w-[1100px] w-full mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12  ">
              <Avatar 
                src={selectedUser?.photo ? `http://localhost:3000/uploads/photos/${selectedUser.photo}` : null}
                icon={<UserOutlined />}
              />
              <span>Détails utilisateur</span>
            </div>
          }
          placement="bottom"
          height="60%"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          className="rounded-t-2xl"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="text-center">
                <Avatar 
                  size={80}
                  src={`http://localhost:3000/uploads/photos/${selectedUser.photo}`}
                  icon={<UserOutlined />}
                  className="shadow-lg border-4 border-white"
                />
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
              
              <Button 
                type={selectedUser.etat ? 'danger' : 'primary'}
                block
                size="large"
                onClick={() => {
                  toggleEtat(selectedUser);
                  setDrawerVisible(false);
                }}
                className="rounded-xl"
              >
                {selectedUser.etat ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'}
              </Button>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default UtilisateurManager;