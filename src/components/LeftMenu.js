const LeftMenu = () => {

    let Username = 'Ikram Kharbouch';

    return (
        <div className="h-screen bg-gray-700 w-48 text-white p-3 text-center">
           <h1>Verial Software</h1>
           <p className="font-thin text-sm mt-3">User: <span className="font-medium">{Username}</span></p>
           <ul>
            <li><button className="bg-gray-500 px-3 py-2 rounded-md w-full mt-5">General</button></li>
           </ul>
        </div>
    )
}

export default LeftMenu;