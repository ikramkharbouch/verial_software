import { useState } from 'react';
import '../../styles/forms.scss';

const users = [
  { firstName: 'John', id: 1 },
  { firstName: 'Emily', id: 2 },
  { firstName: 'Michael', id: 3 },
  { firstName: 'Sarah', id: 4 },
  { firstName: 'David', id: 5 },
  { firstName: 'Jessica', id: 6 },
  { firstName: 'Daniel', id: 7 },
  { firstName: 'Olivia', id: 8 },
  { firstName: 'Matthew', id: 9 },
  { firstName: 'Sophia', id: 10 },
];

const Search = () => {
  const [searchItem, setSearchItem] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleInputChange = (e: any) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredUsers(filteredItems);
  };

  return (
    <div>
      <input
        type="text"
        value={searchItem}
        onChange={handleInputChange}
        placeholder="Type to search"
        className='search-bar'
      />

      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.firstName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
