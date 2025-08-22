import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  Table, 
  Space, 
  Tag, 
  Avatar, 
  Drawer, 
  Typography, 
  Divider, 
  message 
} from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ... même imports que avant

const UtilisateurProdManager = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/utilisateur');
      // ✅ filtrer uniquement cadre production + opérateur
      const filtres = res.data.filter(
        (u) => u.role === "production" || u.role === "operateur"
      );
      setUtilisateurs(filtres);
      setLoading(false);
    } catch (error) {
      message.error("Erreur de chargement des utilisateurs");
      setLoading(false);
    }
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const renderRole = (role) => {
    const roleConfig = {
      production: { color: '#fbbf24', text: 'Cadre Production' },
      operateur: { color: '#4ade80', text: 'Opérateur' }
    };
    const config = roleConfig[role] || { color: '#d1d5db', text: role };
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
    },
    {
      title: 'Statut',
      dataIndex: 'etat',
      render: (etat) => renderStatus(etat),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <a onClick={() => showUserDetails(record)}>
          <EyeOutlined /> Voir
        </a>
      ),
    }
  ];

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 border-0 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-r from-blue-200 to-green-600 rounded-xl">
            <TeamOutlined className="text-white text-3xl" />
          </div>
          <div>
            <Title level={2} className="m-0 text-gray-800">
              Utilisateurs (Cadre Prod & Opérateurs)
            </Title>
            <Text className="text-gray-500">
              {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} trouvé{utilisateurs.length > 1 ? 's' : ''}
            </Text>
          </div>
        </div>
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
                  <a onClick={() => showUserDetails(user)}>
                    <EyeOutlined /> Voir
                  </a>
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
            loading={loading}
          />
        )}
      </Card>

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
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UtilisateurProdManager;
