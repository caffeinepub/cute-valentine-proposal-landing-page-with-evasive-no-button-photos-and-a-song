import ValentineProposalPage from './pages/ValentineProposalPage';
import { CustomMediaProvider } from './context/CustomMediaContext';

function App() {
  return (
    <CustomMediaProvider>
      <ValentineProposalPage />
    </CustomMediaProvider>
  );
}

export default App;
