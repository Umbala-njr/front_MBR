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
import PetitEPage from './assets/Pages/AQpage/petite_etapePage';
import MBR1Page from './assets/Pages/AQpage/fabricationBRPage';
import AppareilPage from './assets/Pages/AQpage/appareilPage';
import AtelierBRPage from './assets/Pages/AQpage/atelierMbrPage';
import Fab_echanPage from './assets/Pages/AQpage/liste_fab_echanPage';
import ModeleechanPage from './assets/Pages/AQpage/modele_echanPage';
import Copie_echanPage from './assets/Pages/AQpage/copie_echanPage';
import MethodePage from './assets/Pages/AQpage/methodePage';
import MethFabriPage from './assets/Pages/AQpage/FabrimetPage';
import UtilisateurprodPage from './assets/Pages/PRODpage/utilisateurprodPage';
import HistoriqueprodPage from './assets/Pages/PRODpage/historiqueprodPage';
import ProductionPage from './assets/Pages/PRODpage/productionPage';
import MBRProdPage from './assets/Pages/PRODpage/mbrprodpage';

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
           <Route path="sousetape/:id_atelier/:id_eta" element={<PetitEPage />} />  
           <Route path="document" element={<DocumentPage />} />
           <Route path="mbr/:code_fab" element={<AtelierBRPage/>} />
           <Route path="creer-mbr/:code_fab/:id_atelier" element={<MbrPage/>}/>
            <Route path="echantillon/:id_mbr/:code_fab" element={<Copie_echanPage/>} />
            <Route path="ajout-parametre/:id_atelier/:id_eta/:id_peta" element={<SousetapePage/>}/>
            <Route path="mbr1" element={<MBR1Page />} />
            <Route path="appareil/:id_atelier" element={<AppareilPage />} />

            <Route path="Mechant" element={<Fab_echanPage />} />
            <Route path="echan/:code_fab" element={<ModeleechanPage />} />

            {/* Route pour la méthode */}
            <Route path="methode/:code_fab" element={<MethodePage />} />
            <Route path="methodefab" element={<MethFabriPage />} />
          {/* ajoute d'autres sous-routes ici */}
        </Route>
        
        {/* Routes protégées pour PROD */}
        <Route path="/PROD" element={<ProtectedRoute><NavbarLayout /></ProtectedRoute> }>
         <Route path="home" element={<HomePage/>} />
         <Route path="utilisateurProd" element={<UtilisateurprodPage />} />
        <Route path="historiqueProd" element={<HistoriqueprodPage />} />
        <Route path="production" element={<ProductionPage />} />
        <Route path="mbr/:code_fab" element={<MBRProdPage />} />
            {/* ajoute d'autres sous-routes ici */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
