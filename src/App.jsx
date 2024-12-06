import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import SpacesList from './components/SpacesList';
import AudioInputSelector from './components/AudioInputSelector';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1>X Spaces Viewer</h1>
        <AudioInputSelector />
        <SpacesList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
