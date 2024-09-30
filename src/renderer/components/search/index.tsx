import { useEffect, useState, useMemo } from 'react';
import '../../styles/forms.scss';
import { useFetchItems } from '@renderer/hooks';
import TableContainer from './tableContainer';

const Search = (searchType: string) => {
  const { data, isLoading, error } = useFetchItems();

  const [tableData, setTableData] = useState([]);

  // let data: any = [];
  const [searchItem, setSearchItem] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(data);

  // wrap it in a useMemo Hook for memorization
  const columns = useMemo(
    () => [
      {
        Header: "TV Show",
        columns: [
          {
            Header: "ID",
            accessor: "data.id"
          },
          {
            Header: "Name",
            accessor: "data.name"
          }
        ]
      }
    ],
    [data]
  )


  const handleInputChange = (e: any) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    // make a type for client later
    const filteredItems = data.filter((client: any) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredUsers(filteredItems);
  };

  useEffect(() => {
    console.log(data);
    setFilteredUsers(data);
  }, [data])

  console.log(data);

  return (
    <div>
      <input
        type="text"
        value={searchItem}
        onChange={handleInputChange}
        placeholder="Type to search"
        className='search-bar'
      />

      {data && filteredUsers && <ul>
        {filteredUsers.map((client: any) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>}

      <TableContainer />
    </div>
  );
};

export default Search;
