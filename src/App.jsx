import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/composant/login';
import MotDePasseOublie from './assets/composant/mot_passe_oublier';
import NouveauMotDePasse from './assets/composant/nouveau_mot';
import UtilisateurPage from './assets/Pages/AQpage/utilisateurPages';
import ProtectedRoute from '../ProtectedRoute';
import DashboardAQ from './assets/composant/LayoutAQ/utilisateurLayout';
import HistoriqueConnexions from './assets/composant/AQ/historiqueAq';
import ProduitPage from './assets/Pages/AQpage/produitPage';
import FabricationPage from './assets/Pages/AQpage/fabricationPage';
import AtelierManager from './assets/composant/AQ/Atelier';
import EtapePage from './assets/Pages/AQpage/etapePage';
import Etape1Page from './assets/Pages/AQpage/etape1Page';
import SousetapePage from './assets/Pages/AQpage/sousetapePage';
import DocumentPage from './assets/Pages/AQpage/documentPage';
import MbrPage from './assets/Pages/AQpage/mbrPage';
import EchantillonPage from './assets/Pages/AQpage/echantillonPage';
import HomePage from './assets/Pages/AQpage/homePage';
import NavbarComponent from './assets/composant/production/navbar';
import NavbarLayout from './assets/composant/LayoutAQ/productionLayout';







function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/nouveau_mot_de_passe" element={<NouveauMotDePasse />} />

        {/* Routes protégées pour AQ */}
        <Route path="/AQ" element={<ProtectedRoute><DashboardAQ /></ProtectedRoute>}>
          <Route path="home" element={<HomePage/>} />
          <Route path="utilisateur" element={<UtilisateurPage />} />
           <Route path="historique" element={<HistoriqueConnexions />} />
           <Route path="produit" element={<ProduitPage/>} />
           <Route path="fabrication/:id_pro" element={<FabricationPage />} />
           <Route path="atelier" element={<AtelierManager />} />
           <Route path="etape" element={<EtapePage />} />
           <Route path="etape1/:code_fab" element={<Etape1Page />} /> 
           <Route path="sousetape/:id_eta" element={<SousetapePage />} />  
           <Route path="document" element={<DocumentPage />} />
           <Route path="mbr" element={<MbrPage />} />
            <Route path="echantillon/:id_mbr" element={<EchantillonPage />} />
          {/* ajoute d'autres sous-routes ici */}
        </Route>
        

        <Route path="/PROD" element={<ProtectedRoute><NavbarLayout /></ProtectedRoute> }>
         <Route path="home" element={<HomePage/>} />

        </Route>

        {/* Catch all */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
