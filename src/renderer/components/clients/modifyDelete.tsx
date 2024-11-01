import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import UserSearch from './components/userSearch';

interface User {
  id: number; // Assuming you have an id field
  companyName: string;
  nif: string;
  clientName: string;
}

const ModifyDeleteUser: React.FC<{ users: User[] }> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsSearchVisible(false); // Close search modal after selection
  };

  const handleModify = () => {
    // Implement your modify logic here
    console.log('Modify user:', selectedUser);
  };

  const handleDelete = () => {
    // Implement your delete logic here
    console.log('Delete user:', selectedUser);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsSearchVisible(true)}>
        Search User
      </Button>

      {isSearchVisible && (
        <Modal
          title="Search Users"
          open={isSearchVisible}
          onCancel={() => setIsSearchVisible(false)}
          footer={null}
        >
          <UserSearch users={users as any} onUserSelect={handleUserSelect as any} />
        </Modal>
      )}

      {selectedUser && (
        <div>
          <h3>Selected User:</h3>
          <p>Name: {selectedUser.clientName}</p>
          <p>Company: {selectedUser.companyName}</p>
          <p>N.I.F: {selectedUser.nif}</p>
          <Button type="primary" onClick={handleModify}>
            Modify User
          </Button>
          <Button onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModifyDeleteUser;
