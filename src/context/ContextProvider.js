// import React, { useState } from 'react';
// import { GlobalContext } from './Context';

// export const ContextProvider = (props) => {
//   /**
//    * Using react hooks, set the default state
//    */
//   const [state, setState] = useState({});

//   /**
//    * Declare the update state method that will handle the state values
//    */
//   const updateState = (newState) => {
//     setState({ ...state, ...newState });
//   };
//   /**
//    * Context wrapper that will provider the state values to all its children nodes
//    */
//   return (
//     <GlobalContext.Provider value={{ ...state, updateState }}>
//       {props.children}
//     </GlobalContext.Provider>
//   );
// };
