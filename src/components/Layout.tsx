import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
