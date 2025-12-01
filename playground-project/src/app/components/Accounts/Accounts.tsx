export default function Accounts() {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
      <div className="bg-gray-100 border border-gray-800 p-4 rounded-lg flex-1 min-w-[200px] text-gray-800 text-center">
        <p className="font-semibold mb-2">Regular Account:</p>
        <p>
          <strong>Login:</strong> <code>test</code>
        </p>
        <p>
          <strong>Password:</strong> <code>password123</code>
        </p>
      </div>
      <div className="bg-gray-100 border border-gray-800 p-4 rounded-lg flex-1 min-w-[200px] text-gray-800 text-center">
        <p className="font-semibold mb-2">Blocked Account:</p>
        <p>
          <strong>Login:</strong> <code>testblock</code>
        </p>
        <p>
          <strong>Password:</strong> <code>password123</code>
        </p>
      </div>
    </div>
  );
}
