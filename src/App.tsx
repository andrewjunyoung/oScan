import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
const Home = () => <div className="p-4"><h1>Home</h1></div>;
const Profile = () => <div className="p-4"><h1>Profile</h1></div>;
const Settings = () => <div className="p-4"><h1>Settings</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
