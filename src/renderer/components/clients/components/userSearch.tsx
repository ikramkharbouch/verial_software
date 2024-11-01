import React, { useState } from 'react';
import { Input } from 'antd';

export interface User {
  companyName: string; // Company name
  nif: number; // N.I.F (tax identification number)
  clientName: string; // Client's name
}

interface UserSearchProps {
  users: User[];
  onUserSelect: (user: User) => void; // Callback function to handle user selection
}

const UserSearch: React.FC<UserSearchProps> = ({ users, onUserSelect }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.nif||
      user.companyName.toLowerCase().includes(value.toLowerCase()) ||
      user.clientName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <Input 
        placeholder="Search by N.I.F, Company Name, or Client Name" 
        value={searchTerm} 
        onChange={(e) => handleSearch(e.target.value)} 
      />
      <div>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user, index) => (
              <li key={index} onClick={() => onUserSelect(user)}> {/* Call the onUserSelect prop when clicked */}
                {user.clientName} - {user.companyName} (N.I.F: {user.nif})
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
