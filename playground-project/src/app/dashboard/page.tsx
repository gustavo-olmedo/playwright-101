import UserProfile from '../components/UserProfile/UserProfile';

export default function Dashboard() {
  return (
    <div className="bg-gray-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <UserProfile />
      </div>
    </div>
  );
}
