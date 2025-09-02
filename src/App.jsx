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
import ProduitprodPage from './assets/Pages/PRODpage/produitPage';
import AttenteBRPage from './assets/Pages/PRODpage/attenteBRPage';
import MatierePage from './assets/Pages/AQpage/matierePage';
import FabmatierePage from './assets/Pages/AQpage/listefabmatierePage';
import ColonneMATPage from './assets/Pages/AQpage/colonnematierePage';
import DetailattentePage from './assets/composant/production/detailattenteBrPage';
import EchantillonaffichePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/echantilonaffichePage';
import MatiereaffichePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/matiereaffichePage';
import TableaumatierePage from './assets/Pages/PRODpage/MBRpage/AffichagePage/tableaumatierePage';
import EtapebymbrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/etapeaffichePage';
import PetitetapeBrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/petitetapeaffichePage';
import ValeuretapeBrPage from './assets/Pages/PRODpage/MBRpage/AffichagePage/valeuretapebrPage';
import EncoursBRPage from './assets/Pages/PRODpage/MBRpage/encoursBRPage';
import DetailencoursPage from './assets/Pages/PRODpage/detailsencoursBrPage';
import MatiereactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/matiereactionPage';
import TableaumatiereactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/tableaumatiereActionPage';
import EchantillonactionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/echantillonActionPage';
import EtapebymbractionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/etapeActionPage';
import PetitetapembrActionPage from './assets/Pages/PRODpage/MBRpage/Actionpage/petiteetapeactionPage';
import ValeuretapeactionBrPage from './assets/Pages/PRODpage/MBRpage/Actionpage/valeuretapeActionPage';
import ListedocumentPage from './assets/Pages/PRODpage/MBRpage/Actionpage/liste_docPage';
import CampagnePage from './assets/Pages/PRODpage/campagnePage';
import CampagneCardPage from './assets/Pages/AQpage/campagneAqPage';
import DetailPage from './assets/Pages/AQpage/detailsBrPage';
import CampagneEmiPage from './assets/Pages/PRODpage/campagneEmissionPage';
import CampagneprodPage from './assets/Pages/PRODpage/CampagneProdPage';

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
            <Route path="matiere/:code_fab" element={<MatierePage />} />
            <Route path="fabmatiere" element={<FabmatierePage />} />
            <Route path="colonnematiere/:id_mat" element={<ColonneMATPage />} />

            <Route path="campagneAQ" element={<CampagneCardPage />} />
            <Route path="detailmbr/:id_mbr/:code_fab" element={<DetailPage />} />
          {/* ajoute d'autres sous-routes ici */}
        </Route>
        
        {/* Routes protégées pour PROD */}
        <Route path="/PROD" element={<ProtectedRoute><NavbarLayout /></ProtectedRoute> }>
         <Route path="home" element={<HomePage/>} />
         <Route path="utilisateurProd" element={<UtilisateurprodPage />} />
        <Route path="historiqueProd" element={<HistoriqueprodPage />} />
        <Route path="production/:id_pro" element={<ProductionPage />} />
        <Route path="mbr/:code_fab" element={<MBRProdPage />} />
        <Route path="produit" element={<ProduitprodPage />} />
        <Route path="attente/:code_fab" element={<AttenteBRPage />} />
        <Route path="detailattente/:id_mbr/:code_fab" element={<DetailattentePage />} />
        <Route path="echantillonaffiche/:id_mbr/:code_fab" element={<EchantillonaffichePage />} />
        <Route path="matiereaffiche/:id_mbr/:code_fab" element={<MatiereaffichePage />} />
        <Route path="tableaumatiere/:id_mbr/:id_mat" element={<TableaumatierePage />} />
        <Route path="etapeaffiche/:id_mbr/:code_fab" element={<EtapebymbrPage />} />
        <Route path="petitetapeaffiche/:id_mbr/:id_eta" element={<PetitetapeBrPage />} />
        <Route path="valeuretapebr/:id_mbr/:id_eta/:id_peta" element={<ValeuretapeBrPage />} />
        <Route path="encours/:code_fab" element={<EncoursBRPage />} />
        <Route path="detailencours/:id_mbr/:code_fab" element={<DetailencoursPage />} />

        <Route path="matiereaction/:id_mbr/:code_fab" element={<MatiereactionPage />} />
        <Route path="tableaumatiereaction/:id_mbr/:id_mat" element={<TableaumatiereactionPage />} />
        <Route path="echantillonaction/:id_mbr/:code_fab" element={<EchantillonactionPage />} />
        <Route path="etapeaction/:id_mbr/:code_fab" element={<EtapebymbractionPage />} />
        <Route path="petiteetapeaction/:id_mbr/:id_eta" element={<PetitetapembrActionPage />} />
        <Route path="valeuretapeaction/:id_mbr/:id_eta/:id_peta" element={<ValeuretapeactionBrPage/>} />
        <Route path="listedocument/:id_mbr" element={<ListedocumentPage />} />
        <Route path="campagne/:code_fab" element={<CampagnePage />} />
        <Route path="campagneEmission" element={<CampagneEmiPage />} />
        <Route path="campagneProduction" element={<CampagneprodPage />} />
            {/* ajoute d'autres sous-routes ici */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
