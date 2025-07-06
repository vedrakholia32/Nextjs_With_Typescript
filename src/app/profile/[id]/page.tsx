export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col item-center justify-center min-h-screen py-2">
      <h1>profile</h1>
      <hr />
      <p className="text-4xl">Profile page {params.id}</p>
    </div>
  );
}
