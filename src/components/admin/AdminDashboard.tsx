import Header from "./Header";
import Main from "./Main";



export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background" >
      {/* Admin Header */}
      <Header />
      {/* Admin main */}
      <Main />
    </div>
  );
}