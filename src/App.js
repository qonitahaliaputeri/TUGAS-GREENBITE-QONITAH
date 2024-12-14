// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Cart from './components/Cart'; // Pastikan path ke Cart.js sesuai struktur folder Anda
// import OrderConfirmation from './components/OrderConfirmation';
// import { createBrowserRouter } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// // import { useRef } from 'react';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Cart />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Impor Router
// import Cart from './components/Cart'; // Impor komponen Cart
// import OrderConfirmation from './components/OrderConfirmation'; // Impor komponen OrderConfirmation

// function App() {
//   return (
//     <Router> {/* Bungkus seluruh aplikasi dengan Router */}
//       <div className="App">
//         <Routes> {/* Konfigurasikan rute aplikasi */}
//           <Route path="/cart" element={<Cart />} /> {/* Rute untuk Cart */}
//           <Route path="/orderconfirmation" element={<OrderConfirmation />} /> {/* Rute untuk OrderConfirmation */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from './components/Cart'; // Pastikan path ke Cart.js sesuai struktur folder Anda
import OrderConfirmation from './components/OrderConfirmation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
};

export default App;