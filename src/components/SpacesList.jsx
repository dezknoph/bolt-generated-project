import { useQuery } from 'react-query';
import { fetchSpaces } from '../api/spaces';

function SpacesList() {
  const { data: spaces, isLoading, error } = useQuery('spaces', fetchSpaces);

  if (isLoading) return <div>Loading spaces...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="spaces-list">
      {spaces?.map(space => (
        <div key={space.id} className="space-card">
          <h2>{space.title}</h2>
          <p>Host: {space.host_name}</p>
          <p>Listeners: {space.participant_count}</p>
          <p>Status: {space.state}</p>
        </div>
      ))}
    </div>
  );
}

export default SpacesList;
