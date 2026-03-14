import { RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { router } from "./routes"; 
import { AuthProvider } from "./context/AuthContext"; // 1. Importe o Provider aqui

function App() {
  return (
    // 2. Envolva tudo com o AuthProvider
    <AuthProvider> 
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '12px',
            background: '#1B365D',
            color: '#fff',
          },
        }}
      />
      
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;